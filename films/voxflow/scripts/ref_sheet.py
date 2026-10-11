# Contact sheets of a reference video with each frame's true timecode, for reading it frame by frame
# (references/reading-references.md). Works where ffmpeg has no drawtext filter.
#   python3 ref_sheet.py ref.mp4 out/ref --every 1.5              overview: a frame every 1.5 s, 48 to a sheet
#   python3 ref_sheet.py ref.mp4 out/ref_t --from 12 --to 14 --fps 10   a transition, densely (or --fps 30: every frame)
#   [--cols 8] [--w 240]
# Writes out/ref_01.png, out/ref_02.png, … Needs opencv-python-headless and Pillow.
import argparse, cv2
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--every", type=float, default=1.5); ap.add_argument("--fps", type=float)
ap.add_argument("--from", dest="t0", type=float, default=0.0); ap.add_argument("--to", dest="t1", type=float)
ap.add_argument("--cols", type=int, default=8); ap.add_argument("--rows", type=int, default=6); ap.add_argument("--w", type=int, default=240)
a = ap.parse_args()

cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
t1 = a.t1 if a.t1 is not None else n / fps
step = 1 / a.fps if a.fps else a.every
want = []
t = a.t0
while t < t1 - 1e-6:
    want.append(round(t * fps)); t += step
want = sorted(set(f for f in want if f < n))

frames = []
cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, want[0]))
f = max(0, want[0]); wi = 0
while wi < len(want):
    ok, im = cap.read()
    if not ok: break
    if f == want[wi]:
        frames.append((f / fps, cv2.cvtColor(im, cv2.COLOR_BGR2RGB))); wi += 1
    f += 1

per = a.cols * a.rows
for s in range(0, len(frames), per):
    chunk = frames[s:s + per]
    h0, w0 = chunk[0][1].shape[:2]; th = round(a.w * h0 / w0)
    rows = -(-len(chunk) // a.cols)
    sheet = Image.new("RGB", (a.cols * (a.w + 3), rows * (th + 3)), "white"); d = ImageDraw.Draw(sheet)
    for i, (ts, im) in enumerate(chunk):
        x, y = i % a.cols * (a.w + 3), i // a.cols * (th + 3)
        sheet.paste(Image.fromarray(im).resize((a.w, th)), (x, y))
        lab = f"{int(ts // 60)}:{ts % 60:05.2f}"
        d.rectangle([x, y, x + 7 * len(lab) + 4, y + 14], fill="white"); d.text((x + 3, y + 2), lab, fill="red")
    sheet.save(f"{a.out}_{s // per + 1:02d}.png")
print(f"{len(frames)} frames, {-(-len(frames) // per)} sheet(s) -> {a.out}_NN.png")
