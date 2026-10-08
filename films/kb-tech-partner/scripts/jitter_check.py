# Finds shake: things that move in steps instead of gliding.  python3 jitter_check.py film.mp4 [--png worst.png]
#
# The motion check measures how much moves; this measures how smoothly. The frame is cut into a grid of
# tiles and each tile's shift between frames is tracked with phase correlation (a reading counts only on
# a textured tile with a clear correlation peak). A shake has one signature: during slow, steady motion
# one frame's velocity sticks out from both neighbours, which agree with each other (+1.2, +1.2, +1.2,
# −2.5, +1.2 px …), again and again in the same place. Smooth motion, eased or not, never does that, and
# a fade or a word appearing can't repeat it three times in 20 frames.
#
# Typical causes, in the order they have happened: an element positioned with left/top under a zoomed
# camera (box offsets snap to whole pixels; position with transform instead); a camera that tracks a
# moving object which itself snaps; text re-laid out every frame. Exit code 1 when a shake (an error) is found;
# "look" lines are small irregular jumps worth a glance in a transition strip.
# Needs: opencv-python-headless, numpy.
import cv2, numpy as np, sys

COLS, ROWS, SCALE = 8, 5, 0.5   # analysis grid, and the analysis resolution (half of 1080p)
SLOW_PX = 10.0                  # only motion slower than this (px/frame, full resolution) is judged
SPIKE_PX = 1.0                  # how far one frame's velocity must stick out from its neighbours
MIN_SPIKES = 3                  # spikes within 20 frames, in one tile, that make a shake
WIN = 20

def main():
    path = sys.argv[1]
    png = sys.argv[sys.argv.index("--png") + 1] if "--png" in sys.argv else None
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    prev, V, OK = None, [], []
    while True:
        ok, fr = cap.read()
        if not ok: break
        g = cv2.cvtColor(cv2.resize(fr, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
        if prev is not None:
            H, W = g.shape; th, tw_ = H // ROWS, W // COLS
            win = cv2.createHanningWindow((tw_, th), cv2.CV_32F)
            vs, oks = [], []
            for r in range(ROWS):
                for c in range(COLS):
                    # copies: phaseCorrelate writes its window back into a slice it is given
                    a = prev[r*th:(r+1)*th, c*tw_:(c+1)*tw_].copy(); b = g[r*th:(r+1)*th, c*tw_:(c+1)*tw_].copy()
                    (dx, dy), resp = cv2.phaseCorrelate(a, b, win)
                    good = min(a.std(), b.std()) > 6 and resp > 0.4 and abs(dx) < 12 and abs(dy) < 12
                    vs.append((dx / SCALE, dy / SCALE)); oks.append(good)
            V.append(vs); OK.append(oks)
        prev = g
    v, ok = np.array(V), np.array(OK)        # [frame, tile, 2], [frame, tile]
    n, T = ok.shape
    slow = ok & (np.abs(v).max(axis=2) < SLOW_PX)
    # a spike at t: both neighbours valid and close to each other, t far from both, in the same direction
    spike = np.zeros((n, T), bool); size = np.zeros((n, T))
    for t in range(1, n - 1):
        both = slow[t - 1] & slow[t] & slow[t + 1]
        d1, d2 = v[t] - v[t - 1], v[t] - v[t + 1]
        dev = np.minimum(np.abs(d1), np.abs(d2)).max(axis=1) * (np.sign(d1) == np.sign(d2)).all(axis=1)
        agree = np.abs(v[t + 1] - v[t - 1]).max(axis=1) < 0.5 * np.maximum(dev, 1e-6)
        spike[t] = both & agree & (dev > SPIKE_PX); size[t] = np.where(spike[t], dev, 0)
    pad = np.pad(spike.astype(int), ((WIN // 2, WIN // 2), (0, 0)))
    count = np.stack([pad[i:i + WIN].sum(axis=0) for i in range(n)])
    bad = count >= MIN_SPIKES
    found, i = [], 0
    anyb = bad.any(axis=1)
    while i < n:
        if anyb[i]:
            j = i
            while j < n and anyb[j]: j += 1
            tiles = np.where(bad[i:j].any(axis=0))[0]
            a0, b0 = max(0, i - WIN // 2), min(n, j + WIN // 2)
            # regular steps (a constant slow speed snapping to the pixel grid) or many tiles at once (the
            # camera) make an error; a few irregular jumps in one place are a note to look at
            best = max(tiles, key=lambda t: spike[a0:b0, t].sum())
            at = np.where(spike[a0:b0, best])[0]
            periodic = len(at) >= 3 and np.std(np.diff(at)) <= 1.0
            peak = float(size[a0:b0].max())
            major = (len(tiles) >= 4 and peak >= 1.5) or (periodic and peak >= 1.0)
            found.append((a0 + 1, b0, tiles, peak, int(count[i:j].max()), major, periodic))
            i = j
        else:
            i += 1
    majors = [f for f in found if f[5]]
    if not found:
        print(f"no shake in {n + 1} frames (most spikes in one tile in {WIN} frames: {int(count.max())}; a shake needs {MIN_SPIKES})")
    for a, b, tiles, peak, cnt, major, periodic in found:
        cells = ", ".join(f"r{t // COLS}c{t % COLS}" for t in tiles[:8])
        kind = "SHAKE" if major else "look "
        why = "regular steps" if periodic else ("many tiles" if len(tiles) >= 4 else "irregular, one place")
        print(f"{kind} {a / fps:.2f}–{b / fps:.2f} s (frames {a}–{b}): {cnt} jumps of up to {peak:.1f} px in {WIN} frames ({why}), tiles {cells}{' …' if len(tiles) > 8 else ''}")
    if not majors and found:
        print("no shake; the 'look' lines are small irregular jumps: check them in a transition strip (a rolling number or a repeating pattern can cause them)")
    if png and found:
        a, b, tiles = max(found, key=lambda f: (f[5], len(f[2]) * f[4]))[:3]
        cap2 = cv2.VideoCapture(path); cap2.set(cv2.CAP_PROP_POS_FRAMES, (a + b) // 2); _, fr = cap2.read()
        H, W = fr.shape[:2]; th, tw_ = H // ROWS, W // COLS
        for t in tiles:
            r, c = divmod(int(t), COLS)
            cv2.rectangle(fr, (c * tw_, r * th), ((c + 1) * tw_, (r + 1) * th), (0, 0, 255), 4)
        cv2.imwrite(png, fr)
    sys.exit(1 if majors else 0)

main()
