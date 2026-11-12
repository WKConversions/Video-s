# Loop seam check: is the jump from the last frame back to the first no bigger than an ordinary frame step?
#   python3 tools/seam.py out/<case>.mp4      → seam diff vs the median step (OK when seam ≤ 1.5 × median and ≤ 1.5)
import subprocess, sys, numpy as np
W, H = 240, 135
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.int16)
steps = np.abs(F[1:] - F[:-1]).mean(axis=(1, 2)) / 2.55
seam = np.abs(F[0] - F[-1]).mean() / 2.55
med = float(np.median(steps))
print(f"frames {len(F)}  seam {seam:.2f}%  median step {med:.2f}%  max step {steps.max():.2f}%  -> {'OK' if seam <= max(1.5 * med, 0.3) and seam <= 1.5 else 'VISIBLE JUMP'}")
