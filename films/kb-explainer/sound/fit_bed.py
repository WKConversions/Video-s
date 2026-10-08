# The bed: Mixkit "Tears of Joy" (Michael Ramir C., Mixkit Stock Music Free License, no credit needed), cut to the film
# on its bar grid (124.01 BPM, bar 1.935 s; music_fit.py's analysis). Film 1.39 s = track 1.19 s (a bar line), so the
# band's biggest entry (track 6.99 s) lands at film 7.20 s as the process-audit window rises after "How?". At the bar
# line where the two sound most alike (searched below) the edit joins the song's ending section 38 bars later, so the
# song's last hit lands at film 56.09 s, on "K.B" and the end card's button; the tail is faded over the last 0.8 s.
#   python3 sound/fit_bed.py sound/music/tears-of-joy.mp3 sound/bed.wav
import subprocess, sys, wave
import numpy as np
SR, LEN = 48000, 58.0
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
BAR = 60 / 124.01 * 4
D0 = 1.19 - 1.39                  # track = film + D0 before the join
D1 = D0 + 38 * BAR                # track = film + D1 after it
mono = x.mean(1)
def feat(t0):                     # one bar's spectrum, in 24 log bands
    a = mono[int(t0 * SR):int((t0 + BAR) * SR)]
    s = np.abs(np.fft.rfft(a * np.hanning(len(a))))
    edges = np.geomspace(60, 12000, 25) / (SR / 2) * len(s)
    v = np.array([s[int(edges[i]):int(edges[i + 1]) + 1].mean() for i in range(24)])
    return np.log(v + 1e-6)
cands = [1.39 + n * BAR for n in range(6, 18)]          # bar lines between film 13 s and 35 s
score = [np.linalg.norm(feat(J + D0 - BAR) - feat(J + D1 - BAR)) + np.linalg.norm(feat(J + D0) - feat(J + D1)) for J in cands]
J = cands[int(np.argmin(score))]
print(f"join at film {J:.2f} s: track {J + D0:.2f} → {J + D1:.2f} s (last hit at film {129.42 - D1:.2f} s)")
n = int(LEN * SR); t = np.arange(n) / SR
def seg(d):
    idx = ((t + d) * SR).astype(int); ok = (idx >= 0) & (idx < len(x))
    out = np.zeros((n, 2)); out[ok] = x[idx[ok]]; return out
a, b = seg(D0), seg(D1)
xf = 0.03
w = np.clip((t - (J - xf / 2)) / xf, 0, 1)[:, None]
y = a * np.sqrt(1 - w) + b * np.sqrt(w)
g = np.clip((LEN - t) / 0.8, 0, 1)
y *= g[:, None]
y /= max(1e-9, np.abs(y).max() / 0.9)
with wave.open(sys.argv[2], "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
