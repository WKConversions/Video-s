# Finds one-frame glitches in a render: a frame that differs from both neighbours while the neighbours agree with
# each other (an element missing for one frame, a half-drawn frame from a render race under CPU load).
#   python3 glitch_check.py film.mp4 [first frame of the clip in the film]
# Each frame is cut into a 16 x 9 grid of tiles (480x270 analysis size); d(a, b) is a tile's mean absolute grey difference.
# A glitch: in some tile, d(i-1, i) and d(i, i+1) both exceed 3x d(i-1, i+1) + 4 levels (a few missing glyphs are
# enough). Fast motion fails the "neighbours agree" test, so it never trips this.
import sys, cv2, numpy as np

path = sys.argv[1]; first = int(sys.argv[2]) if len(sys.argv) > 2 else 0
cap = cv2.VideoCapture(path); fps = cap.get(cv2.CAP_PROP_FPS) or 60; F = []
while True:
    ok, fr = cap.read()
    if not ok: break
    F.append(cv2.cvtColor(cv2.resize(fr, (480, 270), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32))
d = lambda a, b: np.abs(F[a] - F[b]).reshape(9, 30, 16, 30).mean(axis=(1, 3))   # per-tile mean, 9 rows x 16 cols
hits = []
for i in range(1, len(F) - 1):
    a, b, skip = d(i - 1, i), d(i, i + 1), d(i - 1, i + 1)
    score = np.minimum(a, b) - (3 * skip + 4)
    if score.max() > 0:
        r, c = np.unravel_index(int(score.argmax()), score.shape)
        hits.append((i, a[r, c], b[r, c], skip[r, c], r, c))
for i, a, b, s, r, c in hits:
    print(f"GLITCH frame {first + i} ({(first + i) / fps:.2f} s), tile row {r} col {c} (x {c * 120}-{c * 120 + 120}, y {r * 120}-{r * 120 + 120} at 1080p): differs {a:.1f}/{b:.1f} from its neighbours, which differ {s:.1f}")
print(f"{len(F)} frames, {len(hits)} one-frame glitches")
sys.exit(1 if hits else 0)
