# The motion norm of a scene clip, the way Karl's motion_check.py measures it: the share of the picture (at 160x90, grey)
# whose value changes by more than 6/255 from one frame to the next; the norm is the MEDIAN of that share over the frames.
#   python3 tools/norm.py out/<clip>.mp4      (a clip from tools/sheet.sh <group> <Scene> clip ...: 0.3 s pre-roll included)
# Prints the median over the scene's own time (local 0 .. dur) and a profile per 0.25 s of local time.
import subprocess, sys, numpy as np
src = sys.argv[1]; W, H, FPS, PRE = 160, 90, 60, 0.3
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={W}:{H}:flags=bilinear,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
fr = (np.abs(F[1:] - F[:-1]) > 6).mean(axis=(1, 2)) * 100
a, b = int(PRE * FPS), len(fr) - int(PRE * FPS)
body = fr[a:b]
print(f"NORM (median, local 0..{(b - a) / FPS:.1f} s): {np.median(body):.1f}%   frames at 4% or more: {100 * (body >= 4).mean():.0f}%   under 1%: {100 * (body < 1).mean():.0f}%")
for k in range(0, len(fr), 15):
    seg = fr[k:k + 15]; t = k / FPS - PRE
    print(f"  {t:5.2f}s  {np.median(seg):4.1f}%  {'#' * int(round(np.median(seg) * 4))}")
