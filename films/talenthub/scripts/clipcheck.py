# Checks a draft clip of part of the film: motion (how much and how constantly it moves) and, for every voice-over phrase
# that starts inside the clip, whether something new appears on screen while it is spoken (phrase_check.py's measure).
#   python3 clipcheck.py <clip.mp4> <first frame of the clip in the film> [words.json]
# Targets for the Creoble v2 film: moving in 95%+ of frames, typical change 2.5%+ of the frame, longest still 0.4 s or
# less, and every phrase "ok" (6% of the frame changed in tone or 0.6% new structure).
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from phrase_check import phrases, newness, NEW, STRUCT

clip, first = sys.argv[1], int(sys.argv[2])
words = json.load(open(sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "vo", "words.json")))
cap = cv2.VideoCapture(clip); fps = cap.get(cv2.CAP_PROP_FPS) or 30
small, big = [], []
while True:
    ok, fr = cap.read()
    if not ok: break
    small.append(cv2.cvtColor(cv2.resize(fr, (160, 90), interpolation=cv2.INTER_LINEAR), cv2.COLOR_BGR2GRAY).astype(np.float32))
    big.append(cv2.cvtColor(cv2.resize(fr, (320, 180), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32))
n = len(small); t0 = first / 30
frac = np.array([float((np.abs(small[i] - small[i - 1]) > 6).mean()) for i in range(1, n)])
still = frac < 0.001; runs, r = [0], 0
for s in still: r = r + 1 if s else 0; runs.append(r)
print(f"clip {t0:.2f}–{t0 + n / fps:.2f} s, {n} frames")
print(f"motion: moving in {100 * (1 - still.mean()):.0f}% of frames (target 95+), typical change {100 * np.median(frac):.1f}% of the frame (target 2.5+), "
      f"longest still {max(runs) / fps:.2f} s (target 0.4 or less)")
for i in range(0, len(frac), int(fps)):
    seg = frac[i:i + int(fps)]; k = int((seg < 0.001).sum())
    print(f"   {t0 + i / fps:6.1f}s {100 * seg.mean():5.1f}% {'#' * min(50, round(100 * seg.mean() * 4))}" + (f"  still {k}" if k else ""))
at = lambda t: big[max(0, min(n - 1, int(round((t - t0) * fps))))]
for a, b, text in phrases(words):
    if a - 0.1 < t0 or a > t0 + n / fps - 0.2: continue
    b = min(b, t0 + n / fps - 1 / fps)
    vals = [newness(at(a - 0.1), at(t)) for t in np.linspace(a + 0.15, b, 5)]
    tone, struct = max(v[0] for v in vals), max(v[1] for v in vals)
    ok = tone >= NEW or struct >= STRUCT
    print(f"{'ok    ' if ok else 'STATIC'} {a:6.2f}–{b:5.2f}s  tone {tone * 100:5.1f}%  structure {struct * 100:4.2f}%  {text}")
