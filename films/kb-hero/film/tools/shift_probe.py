# Is a flagged stretch really stepping? Tracks ONE rectangle of a clip frame by frame with an exhaustive whole-pixel
# search (sum of absolute differences) refined to sub-pixel, along one axis, and prints the shift per frame.
#   python3 tools/shift_probe.py out/sm_S10.mp4 1.57 2.30 960 432 240 216 y
# A rigid stream at 7 px/frame prints 7.0 every frame with a small residual (smooth; the shake check was fooled by a
# repeating pattern). Real stepping prints an uneven sequence (2, 2, 3 …) or outliers.
import subprocess, sys, numpy as np
src, t0, t1, x, y, w, h, ax = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), *map(int, sys.argv[4:8]), sys.argv[8]
raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t0), "-t", str(t1 - t0), "-i", src, "-vf", f"crop={w}:{h}:{x}:{y},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32); M = 24; out = []
for a, b in zip(F[:-1], F[1:]):
    best = []
    for s in range(-M, M + 1):
        if ax == "y": A, B = (a[M:h - M], b[M + s:h - M + s])
        else: A, B = (a[:, M:w - M], b[:, M + s:w - M + s])
        best.append(float(np.abs(A - B).mean()))
    k = int(np.argmin(best)); sub = 0.0
    if 0 < k < 2 * M:
        l, c, r = best[k - 1], best[k], best[k + 1]; d = l - 2 * c + r
        if d > 1e-6: sub = 0.5 * (l - r) / d
    out.append((k - M + sub, best[k]))
print(" ".join(f"{s:+.1f}" for s, _ in out))
print("residual (mean abs diff at the best shift, 0-255):", " ".join(f"{r:.1f}" for _, r in out[:40]))
