#!/usr/bin/env python3
# Finds slow moves that stall or double-step: something gliding at 0.3-4 px a frame whose speed drops to nothing (or
# doubles) on single frames, again and again. The cause is nearly always a position snapped to whole pixels (layout
# left/top/width/height, or a transform on a layer that is not composited): move it with translate3d / scale on a
# layer with willChange: "transform" and a transparent margin. Run from films/kb-team/film on a full-size 60 fps render.
#   python3 -I tools/stall.py out/v2_final.mp4 [--from 0 --to 3003]
import json, math, os, sys
import cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..", ".."); SHOTS = json.load(open(os.path.join(ROOT, "plan", "shots.json")))
def arg(name, default): return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
COLS, ROWS = 8, 5; cap = cv2.VideoCapture(sys.argv[1]); A, B = arg("--from", 0), arg("--to", 10 ** 9)
cap.set(cv2.CAP_PROP_POS_FRAMES, A); prev = None; V = []; i = A
while i < B:
    ok, fr = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(fr, (960, 540), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
    if prev is not None:
        row = []
        for r in range(ROWS):
            for c in range(COLS):
                a = prev[r * 108:(r + 1) * 108, c * 120:(c + 1) * 120]; b = g[r * 108:(r + 1) * 108, c * 120:(c + 1) * 120]
                if a.std() < 4 or float(np.abs(a - b).max()) < 3: row.append((0.0, 0.0, a.std() >= 4)); continue
                (dx, dy), resp = cv2.phaseCorrelate(a, b); row.append((2 * dx, 2 * dy, resp > 0.25))
        V.append(row)
    prev = g; i += 1
V = np.array(V, dtype=np.float32)            # frames x tiles x (dx, dy, ok)
ok = V[:, :, 2] > 0.5
film = lambda n: math.ceil(n * 2.5 - 1e-9); W = 20; found = []
# a spike: one frame's velocity sticks out from BOTH neighbours, which agree with each other (a glide that stalls for a
# frame or takes a double step). Eased motion, however fast it changes, never does that.
for t in range(COLS * ROWS):
    for comp in (0, 1):
        v = V[:, t, comp]; spikes = []
        for i in range(1, len(v) - 1):
            if not (ok[i - 1, t] and ok[i, t] and ok[i + 1, t]): continue
            m = 0.5 * (v[i - 1] + v[i + 1])
            if 0.3 <= abs(m) <= 6 and abs(v[i - 1] - v[i + 1]) < 0.3 * abs(m) + 0.12 and abs(v[i] - m) > max(0.4, 0.5 * abs(m)): spikes.append(i)
        k = 0
        while k < len(spikes):
            j = k
            while j + 1 < len(spikes) and spikes[j + 1] - spikes[k] < W: j += 1
            if j - k + 1 >= 3: found.append((A + spikes[k] + 1, t, float(np.median(np.abs(v[spikes[k]:spikes[j] + 1]))), j - k + 1, "xy"[comp]))
            k = j + 1
by = {}
for f, t, m, cnt, comp in found:
    name = next((f"{pid} {nm}" for pid, p in SHOTS.items() for nm, a, b, _ in p["shots"] if film(a) <= f < film(b + 1)), "?")
    by.setdefault(name, []).append((f, t, m, cnt, comp))
print(f"{len(found)} runs of spikes (3 or more within 20 frames, in one tile), by shot:")
for name, L in sorted(by.items(), key=lambda kv: -sum(x[3] for x in kv[1])):
    tiles = sorted({f"r{t // COLS}c{t % COLS}" for _, t, _, _, _ in L}); fr = sorted({f for f, _, _, _, _ in L})
    print(f"  {name:9s} {sum(x[3] for x in L):4d} spikes in {len(L):3d} runs, film frames {fr[0]}-{fr[-1] + W}, typical speed {np.median([m for _, _, m, _, _ in L]):.2f} px/frame, "
          f"{'x' if sum(c == 'x' for *_, c in L) >= len(L) / 2 else 'y'} mostly, tiles {' '.join(tiles[:12])}{' …' if len(tiles) > 12 else ''}")
