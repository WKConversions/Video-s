# Smoothness check on a render: how much of the picture changes per frame (mean abs difference, % of full scale), and
# where that amount JUMPS between consecutive frames (a sudden start, stop or speed change reads as choppy).
#   python3 tools/flow.py out/film540.mp4 [t0 t1]      prints the jerks (time, before -> after) and a per-0.25 s profile
import subprocess, sys, numpy as np
src = sys.argv[1]; t0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0; t1 = float(sys.argv[3]) if len(sys.argv) > 3 else 1e9
W, H, FPS = 240, 135, 60
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.int16)
m = np.abs(F[1:] - F[:-1]).mean(axis=(1, 2)) / 2.55          # % per frame; m[i] = change into frame i+1
s = np.convolve(m, np.ones(3) / 3, mode="same")               # light smoothing (3 frames)
print("JERKS (speed changes by more than 1.7x within 3 frames, at a visible speed):")
last = -1
for i in range(3, len(s) - 3):
    a, b = s[i - 3], s[i + 3]; t = (i + 1) / FPS
    if t < t0 or t > t1 or i - last < 12: continue
    if max(a, b) > 0.6 and (b > 1.7 * a + 0.25 or a > 1.7 * b + 0.25):
        print(f"  {t:6.2f}s  {a:5.2f} -> {b:5.2f}  {'sudden start / speed-up' if b > a else 'sudden stop / slow-down'}"); last = i
print("PROFILE (mean % changed per frame, per 0.25 s; calm flowing motion sits around 0.5-2.5 without cliffs):")
for k in range(0, len(m), 15):
    t = k / FPS
    if t0 <= t <= t1: print(f"  {t:6.2f}s  {m[k:k+15].mean():5.2f}  {'#' * int(m[k:k+15].mean() * 8)}")
