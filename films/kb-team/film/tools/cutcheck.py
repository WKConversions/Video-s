#!/usr/bin/env python3
# Are our cuts on the reference's frames? For every clean cut of the reference (a picture change of 30% or more of the
# frame from one frame to the next), the film frame on which reference frame n starts is ceil(n * 2.5). Our film must
# change there: not a frame early, not a frame late. Also lists dark frames right after a cut (a picture not loaded).
#   python3 -I tools/cutcheck.py out/v2_540.mp4          run from films/kb-team/film
import json, math, os, sys
import cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..", ".."); REF = os.path.join(ROOT, "reference", "frames")
def small(img): return cv2.cvtColor(cv2.resize(img, (160, 90), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
def ch(a, b): return float((np.abs(a - b) > 10).mean())
R = [small(cv2.imread(os.path.join(REF, f"f{n:04d}.jpg"))) for n in range(1201)]
cuts = [n for n in range(1, 1201) if ch(R[n], R[n - 1]) >= 0.30]
cap = cv2.VideoCapture(sys.argv[1]); O = []
while True:
    ok, fr = cap.read()
    if not ok: break
    O.append(small(fr))
late, early, missing, good, dark = [], [], [], 0, []
for n in cuts:
    i = math.ceil(n * 2.5 - 1e-9)
    if i + 1 >= len(O) or i < 2: continue
    here, before, after = ch(O[i], O[i - 1]), ch(O[i - 1], O[i - 2]), ch(O[i + 1], O[i])
    if here >= 0.25: good += 1
    elif after >= 0.25: late.append((n, i))
    elif before >= 0.25: early.append((n, i))
    else: missing.append((n, i, round(100 * here)))
    if O[i].mean() < 6 and O[i + 1].mean() > 12: dark.append((n, i))
print(f"{len(cuts)} clean cuts in the reference; ours changes on the same film frame at {good} of them")
print("one film frame LATE at reference frames:", [n for n, _ in late] or "none")
print("one film frame EARLY at reference frames:", [n for n, _ in early] or "none")
print("no clear change within a frame (reference frame, film frame, % of our frame changing there):", missing or "none")
print("a dark frame on the cut (picture not loaded):", dark or "none")
