#!/usr/bin/env python3
# The whole film against the reference, from a finished render (any size): how much of the frame is covered, how well
# the covered areas overlap, how much moves, and how alike the motion curves are. Run from films/kb-team/film.
#   python3 -I tools/filmscore.py out/v2_540.mp4 [--shots]
import json, math, os, sys
import cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..", ".."); REF = os.path.join(ROOT, "reference", "frames")
SHOTS = json.load(open(os.path.join(ROOT, "plan", "shots.json")))
def small(img): return cv2.resize(img, (320, 180), interpolation=cv2.INTER_AREA)
def gray(img): return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
def ink(img):
    b = np.concatenate([img[:6].reshape(-1, 3), img[-6:].reshape(-1, 3), img[:, :6].reshape(-1, 3), img[:, -6:].reshape(-1, 3)]).astype(np.int32)
    q = b // 12; key = q[:, 0] * 10000 + q[:, 1] * 100 + q[:, 2]; vals, cnt = np.unique(key, return_counts=True)
    if cnt.max() < 0.45 * len(key): return np.ones(img.shape[:2], bool)
    bg = b[key == vals[cnt.argmax()]].mean(0); return np.abs(img.astype(np.int32) - bg).max(2) > 22
cap = cv2.VideoCapture(sys.argv[1]); want = {math.ceil(n * 2.5 - 1e-9): n for n in range(1201)}; ours = {}; i = 0
while True:
    ok, fr = cap.read()
    if not ok: break
    if i in want: ours[want[i]] = small(fr)
    i += 1
N = max(ours) + 1; ref = {n: small(cv2.imread(os.path.join(REF, f"f{n:04d}.jpg"))) for n in range(N)}
cr = np.array([ink(ref[n]).mean() for n in range(N)]); co = np.array([ink(ours[n]).mean() for n in range(N)])
iou = np.array([(ink(ref[n]) & ink(ours[n])).sum() / max(1, (ink(ref[n]) | ink(ours[n])).sum()) for n in range(N)])
mr = np.array([0] + [float((np.abs(gray(ref[n]) - gray(ref[n - 1])) > 8).mean()) for n in range(1, N)])
mo = np.array([0] + [float((np.abs(gray(ours[n]) - gray(ours[n - 1])) > 8).mean()) for n in range(1, N)])
cuts = {s[1] for p in SHOTS.values() for s in p["shots"]}; inner = np.array([n not in cuts and n > 0 for n in range(N)])
print(f"covered: reference {100 * cr.mean():.1f}% of the frame, ours {100 * co.mean():.1f}%; the covered areas overlap {iou.mean():.2f} (1.00 = the same area)")
print(f"motion (cuts left out): reference {100 * mr[inner].mean():.2f}% of the frame changes per picture, ours {100 * mo[inner].mean():.2f}%; "
      f"the two curves over the whole film correlate {np.corrcoef(mr[inner], mo[inner])[0, 1]:.2f}")
print(f"still pictures: reference {100 * (mr[inner] < 0.0005).mean():.0f}%, ours {100 * (mo[inner] < 0.0005).mean():.0f}%")
if "--shots" in sys.argv:
    for pid, p in SHOTS.items():
        for name, a, b, kind in p["shots"]:
            ns = np.arange(a + 1, min(b, N - 1) + 1)
            if len(ns) < 2: continue
            c = np.corrcoef(mr[ns], mo[ns])[0, 1] if mr[ns].std() > 1e-5 and mo[ns].std() > 1e-5 else float("nan")
            print(f"  {pid} {name:4s} f{a:4d}-{b:4d}  cover {100 * cr[a:b + 1].mean():5.1f} / {100 * co[a:b + 1].mean():5.1f}  overlap {iou[a:b + 1].mean():.2f}  motion {100 * mr[ns].mean():5.2f} / {100 * mo[ns].mean():5.2f}  corr {c:5.2f}  {kind}")
