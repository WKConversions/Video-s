# The bed: Mixkit "Raising Me Higher" (Ahjay Stelino, Mixkit Stock Music Free License), cut to the film by hand on
# its bar grid (110.04 BPM, bar 2.181 s; music_fit.py's analysis): film 0 → track 8.56 s, so the band enters on
# "That's where K.B comes in" (track 17.96 s at film 9.40 s); at film 30.03 s (a bar line, "it comes from…") it joins
# the song's last bar, 22 bars later in the track, so the final hit lands at film 32.46 s with the end card, and the
# chord rings out (faded over the last 0.6 s). A 5 dB dip under "alone." (28.9–29.9 s) leaves room for the word.
#   python3 sound/fit_bed.py sound/music/raising-me-higher.mp3 sound/bed.wav
import subprocess, sys, wave
import numpy as np
SR, LEN = 48000, 34.0
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
BAR = 60 / 110.04 * 4
D0, J = 8.56, 30.03
D1 = D0 + 22 * BAR
n = int(LEN * SR); t = np.arange(n) / SR
def seg(d):
    idx = np.clip(((t + d) * SR).astype(int), 0, len(x) - 1); return x[idx]
a, b = seg(D0), seg(D1)
xf = 0.03
w = np.clip((t - (J - xf / 2)) / xf, 0, 1)[:, None]
y = a * np.sqrt(1 - w) + b * np.sqrt(w)
g = np.ones(n)
g *= np.clip(t / 0.3, 0, 1)                                         # fade in
g *= np.clip((LEN - t) / 0.6, 0, 1)                                 # fade out
dip = 10 ** (-5 / 20)
ramp = np.clip(np.minimum((t - 28.9) / 0.15, (29.9 - t) / 0.15), 0, 1)
g *= 1 - (1 - dip) * ramp
y *= g[:, None]
y /= max(1e-9, np.abs(y).max() / 0.9)
with wave.open(sys.argv[2], "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((np.clip(y, -1, 1) * 32767).astype("<i2").tobytes())
print(f"bed {LEN} s, join at {J} s → track {J + D1:.2f} s, final hit ≈ film {89.0 - D1:.2f} s")
