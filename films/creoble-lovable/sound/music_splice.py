# Cuts Expressive Courage (Diego Nava, Mixkit, Mixkit Stock Music Free License) to the film the way the Lovable 2.0
# reference's music sits: a filtered intro that drops out under the logo reveal and drops at 8.8 s, a full section,
# a hard stop with a short silence at 49.4 s, a two-bar build and a second drop at 54.16 s ("Se resultatet"), and
# the track's own ending landing on the Creoble logo. 127 BPM; every join is on a bar line of the film's grid
# (anchor 8.8 s), with a 12 ms crossfade.   python3 music_splice.py  ->  music/expressive-courage-fit.wav
import subprocess, wave, numpy as np
SR = 48000
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", "music/expressive-courage.mp3", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                                 capture_output=True, check=True).stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
B = 60 / 127.0 * 4                      # one bar
D1, D2 = 15.10, 15.10 + 24 * B          # the track's drops
L = 80.49
segs = [  # (film start, track start, length)
    (0.0, D1 - 8.8, 8.8),                               # intro, its own pre-drop break under the logo
    (8.8, D1, 16 * B),                                  # drop 1 → 16 bars
    (8.8 + 16 * B, D2 + 4 * B, 5.5 * B),                # more full bars (from the second section's 2nd phrase)
    (8.8 + 24 * B - 2 * B, D2 - 2 * B, 2 * B),          # the build's last two bars → drop 2 at 54.16
    (8.8 + 24 * B, D2, 5 * B),                          # drop 2
    (8.8 + 29 * B, D2 + 8 * B, 99.0),                   # 3 bars left out (the most alike pair of bars), on to the real ending
]
out = np.zeros((int(L * SR), 2)); xf = int(0.012 * SR)
for fs, ts, n in segs:
    a, b = int(fs * SR), min(int((fs + n) * SR), len(out))
    s = x[int(ts * SR): int(ts * SR) + (b - a)]
    b = a + len(s); s = s.copy()
    s[:xf] *= np.linspace(0, 1, xf)[:, None]; s[-xf:] *= np.linspace(1, 0, xf)[:, None]
    out[a:b] += s
t = np.arange(len(out)) / SR
g = np.ones(len(out))
g *= np.interp(t, [7.30, 7.55, 8.70, 8.80], [1, 0.22, 0.22, 1])     # the music falls away under the logo reveal (as in the reference)
g *= np.interp(t, [49.30, 8.8 + 21.5 * B - 0.0, 50.38], [1, 0, 0]) * (t < 50.38) + (t >= 50.38)  # hard stop before the build
g *= np.interp(t, [0, 0.25], [0, 1])
out *= g[:, None]
fade = (t > L - 0.4); out[fade] *= np.linspace(1, 0, fade.sum())[:, None]
pk = np.abs(out).max(); out *= min(1, 0.95 / pk)
with wave.open("music/expressive-courage-fit.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype("<i2").tobytes())
print("bar", round(B, 4), "drop2 film", round(8.8 + 24 * B, 3), "join at", round(8.8 + 29 * B, 3), "last hit film", round(8.8 + 29 * B + 90.221 - (D2 + 8 * B), 3))
