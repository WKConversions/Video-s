#!/usr/bin/env python3
# Where does our film STEP instead of glide? Read from a finished 60 fps render. Run from films/kb-team/film.
#   python3 -I tools/glide.py out/v2_final.mp4
# Per shot: of the film frames that lie inside a stretch of motion (something changed within 3 frames before AND
# within 3 frames after), the share that are an exact repeat of the frame before. Gliding motion: near 0%. Motion
# replayed at the reference's 24 pictures a second: about 60% (each picture stands 2 or 3 film frames). Footage on
# twos: 50%, and that is its cadence. Typing, counters, flash cuts and rests are discrete and may repeat.
import json, math, os, sys
import cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..", ".."); SHOTS = json.load(open(os.path.join(ROOT, "plan", "shots.json")))
cap = cv2.VideoCapture(sys.argv[1]); prev = None; same = []; amt = []
while True:
    ok, fr = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(fr, (480, 270), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
    if prev is None: same.append(True); amt.append(0.0)
    else:
        d = np.abs(g - prev); same.append(float(d.max()) < 5.0); amt.append(float((d > 8).mean()))
    prev = g
same = np.array(same); amt = np.array(amt); N = len(same); mv = ~same
inside = np.array([mv[max(0, i - 3):i].any() and mv[i + 1:i + 4].any() for i in range(N)])
film = lambda n: math.ceil(n * 2.5 - 1e-9)
print("shot            in motion   of those, repeats   moving frames: median % of the frame changing")
for pid, p in SHOTS.items():
    for name, a, b, kind in p["shots"]:
        i0, i1 = film(a) + 1, min(film(b + 1), N)
        ins = inside[i0:i1]; rep = (same[i0:i1] & ins).sum(); tot = ins.sum()
        med = 100 * float(np.median(amt[i0:i1][mv[i0:i1]])) if mv[i0:i1].any() else 0.0
        share = 100 * rep / max(1, tot); flag = "" if kind in ("film", "half-film") else ("  <-- STEPS" if share >= 35 and tot >= 12 else ("  <-- some steps" if share >= 18 and tot >= 12 else ""))
        print(f"  {pid} {name:4s} f{a:4d}-{b:4d}   {100 * tot / max(1, i1 - i0):5.0f}%      {share:5.0f}%            {med:5.2f}   {kind}{flag}")
