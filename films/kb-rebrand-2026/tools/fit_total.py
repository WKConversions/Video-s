# Fit a set of videos into one total size at even quality (the best overall quality that size allows).
#   python3 fit_total.py <master_dir> <out_dir> <total_bytes>
# 1) a quick constant-quality pass (x264 veryfast, CRF 26) measures how hard each video is to compress;
# 2) the video budget (total minus audio minus a 2.5% margin) is shared in proportion to those sizes;
# 3) each video is two-pass x264 (preset slow) at its share, 1080p60 kept, audio AAC 80 kbps where present.
import sys, os, glob, subprocess, json
from concurrent.futures import ThreadPoolExecutor

src_dir, out_dir, total = sys.argv[1], sys.argv[2], float(sys.argv[3])
os.makedirs(out_dir, exist_ok=True)
tmp = os.path.join(out_dir, "_probe"); os.makedirs(tmp, exist_ok=True)
AB = 80000
files = sorted(glob.glob(os.path.join(src_dir, "*.mp4")))
def probe(f, entries, sel="v"):
    return subprocess.run(["ffprobe", "-v", "error", "-select_streams", sel, "-show_entries", entries, "-of", "csv=p=0", f], capture_output=True, text=True).stdout.strip()
info = {}
for f in files:
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
    info[f] = {"dur": dur, "audio": bool(probe(f, "stream=index", "a"))}

def analyse(f):
    o = os.path.join(tmp, os.path.basename(f))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-an", o], check=True)
    return f, os.path.getsize(o)
with ThreadPoolExecutor(3) as ex:
    for f, s in ex.map(analyse, files): info[f]["cx"] = s
audio_bytes = sum(AB / 8 * v["dur"] for v in info.values() if v["audio"])
budget = (total - audio_bytes) * 0.975
cx_sum = sum(v["cx"] for v in info.values())
for f, v in info.items():
    v["vb"] = int(budget * v["cx"] / cx_sum * 8 / v["dur"])

def encode(f):
    v = info[f]; o = os.path.join(out_dir, os.path.basename(f)); log = os.path.join(tmp, os.path.basename(f) + ".log")
    base = ["ffmpeg", "-v", "error", "-y", "-i", f, "-c:v", "libx264", "-preset", "slow", "-b:v", str(v["vb"]), "-passlogfile", log]
    subprocess.run(base + ["-pass", "1", "-an", "-f", "mp4", "/dev/null"], check=True)
    a = ["-c:a", "aac", "-b:a", str(AB)] if v["audio"] else ["-an"]
    subprocess.run(base + ["-pass", "2", "-pix_fmt", "yuv420p"] + a + ["-movflags", "+faststart", o], check=True)
    return f, os.path.getsize(o)
with ThreadPoolExecutor(3) as ex:
    for f, s in ex.map(encode, files): info[f]["size"] = s
tot = sum(v["size"] for v in info.values())
for f, v in info.items():
    print(f"{os.path.basename(f):34s} {v['dur']:6.2f}s  video {v['vb'] / 1000:6.0f} kbps  {v['size']:9d} bytes")
print(f"total {tot} bytes (target {int(total)})")
subprocess.run(["rm", "-rf", tmp])
