# Measures how constantly and how much a video moves: python3 motion_check.py out.mp4 [--profile]
# Needs numpy and opencv-python-headless. Ignores the last 2 seconds (the end card) on films longer than 4 s.
# --profile adds one line per second: the share of the frame in motion and any still frames, to find
# dead, flat or over-busy stretches (the rhythm pass in evaluation/quality-check.md).
import cv2, numpy as np, sys
cap = cv2.VideoCapture(sys.argv[1]); fps = cap.get(cv2.CAP_PROP_FPS); prev = None; frac = []
while True:
    ok, fr = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(fr, (160, 90), interpolation=cv2.INTER_LINEAR), cv2.COLOR_BGR2GRAY).astype(np.float32)
    if prev is not None: frac.append(float((np.abs(g - prev) > 6).mean()))   # share of the frame that changed
    prev = g
frac = np.array(frac); cut = int(2 * fps) if len(frac) > 4 * fps else 0
body = frac[:len(frac) - cut]; still = body < 0.001; runs, r = [0], 0
for s in still: r = r + 1 if s else 0; runs.append(r)
print(f"moving in {100 * (1 - still.mean()):.0f}% of frames (target 90+), "
      f"median {100 * np.median(frac):.1f}% of the frame in motion (information, not a target: K.B v3, approved, 1.7; references 0.5–6.6), "
      f"longest still {max(runs) / fps:.2f} s (target 0.8 or less)")
if '--profile' in sys.argv:
    n = max(1, round(fps))
    for i in range(0, len(frac), n):
        seg = frac[i:i + n]; m = 100 * float(seg.mean()); k = int((seg < 0.001).sum())
        print(f"{i / fps:6.1f}s {m:5.1f}% {'#' * min(60, round(m * 4)):<60}" + (f" still {k}" if k else ""))
