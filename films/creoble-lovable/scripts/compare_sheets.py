# Side-by-side sheets of the reference and the replica at 2 fps: for every half second, the reference frame (left) and
# ours (right), ten pairs a sheet (5 s).   python3 compare_sheets.py ref.mp4 ours.mp4 outdir
import subprocess, sys, os
from PIL import Image, ImageDraw
ref, ours, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
def grab(path, t, w=480):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", path, "-frames:v", "1", "-vf", f"scale={w}:{w * 9 // 16}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return Image.frombytes("RGB", (w, w * 9 // 16), raw) if len(raw) == w * (w * 9 // 16) * 3 else Image.new("RGB", (w, w * 9 // 16))
for s in range(16):
    W = Image.new("RGB", (1920, 5 * 290), (20, 20, 20)); d = ImageDraw.Draw(W)
    for i in range(10):
        t = s * 5 + i * 0.5
        if t > 80.45: break
        x, y = (i % 2) * 960, (i // 2) * 290
        W.paste(grab(ref, t + 0.02), (x, y + 18)); W.paste(grab(ours, t + 0.02), (x + 480, y + 18))
        d.text((x + 4, y + 3), f"{t:.1f}s  REFERENCE", fill=(255, 220, 0)); d.text((x + 484, y + 3), f"{t:.1f}s  CREOBLE", fill=(120, 230, 160))
    W.save(f"{out}/cmp_{s:02d}.jpg", quality=86)
print("ok")
