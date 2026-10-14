# Cuts "Can't Get You Off My Mind" (Michael Ramir C., Mixkit, Mixkit Stock Music Free License; Future Bass, 150.0 BPM,
# C# minor) to the reference promo's structure (spec/audio.md), so every bar line and hit sits on the reference's frames:
#   film downbeats (kick onsets) at 0.094 + 1.6 n s  = frames 3 + 48 n   (the reference measures 0.091-0.097)
#   track downbeats (kick onsets) at 1.599 + 1.6 m s (measured on 10 bars between 25 and 82 s, all within 4 ms)
# The track is exactly 150 BPM, so nothing is time-stretched: every segment is the original audio, joined on a bar line
# with a 12 ms crossfade that ends 3 ms before the incoming kick.
#
#   film bars   film time        track bars          what
#   0-1         0.00-3.28        5-6 (filtered intro) quiet wide intro (kick high-passed out), fades in, thins at 2.55,
#                                                    hard stop 12 ms before the drop (the riser effect carries the build)
#   2-10        3.29-17.69       15-23               DROP 1 at f99 and the first drop section (bar 10 = the track's
#                                                    sparser bar 23, like the reference's sparse-hat bar 16.1-17.7)
#   11          17.69-19.29      30                  the break: the track's own transition bar into its second section,
#                                                    low-passed (hats and claps gone) and opening into the drop
#   12-19       19.29-32.09      31-38               DROP 2 at f579: the track's brighter second section
#   20-23       32.09-38.00      47-50               the brightest last section for "200+ / 3 / Built for"; the beat
#                                                    stops at f1140 (38.0 s) with a 0.12 s fall to silence
#   24-25       38.40-41.95      1-2 (intro again)   the outro pad under the logo and "Let's talk", filtered and quiet,
#                                                    fading to silence by 41.95 s (f1258)
# Sparse-hat bars of the reference copied with a low-pass: film bar 3 (4.89-6.49) and 33.45-34.23 under the "3" reveal.
#   python3 -I music_splice.py   ->  music/cant-get-you-off-my-mind-fit.wav (48 kHz stereo, 42.067 s = 1262 frames)
import subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfiltfilt, stft, istft
import pyloudnorm as pyln

SR = 48000
SRC, OUT = "music/candidates/1210.mp3", "music/cant-get-you-off-my-mind-fit.wav"
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", SRC, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                                 capture_output=True, check=True).stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
FB = lambda n: 0.094 + 1.6 * n          # film downbeat n
TB = lambda m: 1.599 + 1.6 * m          # track downbeat m
L = 1262 / 30
N = int(round(L * SR))
out = np.zeros((N, 2))
XF = 0.012                               # crossfade length; it ends PRE before the incoming downbeat
PRE = 0.003

def piece(f0, f1, track_bar, film_bar, fade_in=XF, fade_out=XF):
    """Track audio for film time [f0, f1), aligned so track downbeat `track_bar` falls on film downbeat `film_bar`."""
    off = TB(track_bar) - FB(film_bar)
    a, b = int(round(f0 * SR)), int(round(f1 * SR))
    s = x[a + int(round(off * SR)): b + int(round(off * SR))].copy()
    fi, fo = int(fade_in * SR), int(fade_out * SR)
    if fi: s[:fi] *= np.linspace(0, 1, fi)[:, None]
    if fo: s[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return a, s

def hp(s, fc, order=4): return sosfiltfilt(butter(order, fc, "high", fs=SR, output="sos"), s, axis=0)
def lp(s, fc, order=2): return sosfiltfilt(butter(order, fc, "low", fs=SR, output="sos"), s, axis=0)

meter = pyln.Meter(SR)
def lufs(s): return meter.integrated_loudness(s)

# ---- the main body first (its level is the reference for the intro and the outro)
segs = []
segs.append(piece(FB(2) - PRE - 0.002, FB(11) - PRE, 15, 2, fade_in=0.002))           # drop 1, film bars 2-10
segs.append(piece(FB(11) - PRE - XF, FB(12) - PRE, 30, 11))                            # the break bar
segs.append(piece(FB(12) - PRE - XF, FB(20) - PRE, 31, 12))                            # drop 2, film bars 12-19
segs.append(piece(FB(20) - PRE - XF, 38.12, 47, 20, fade_out=0.0))                     # bars 20-23, to the stop
for a, s in segs: out[a:a + len(s)] += s
t = np.arange(N) / SR
# the stop at f1140: the beat falls away in 0.12 s
stop = np.clip((38.12 - t) / 0.12, 0, 1) ** 2
out *= np.where(t >= 38.0, stop, 1.0)[:, None]
main = lufs(out[int(4 * SR): int(37.5 * SR)])

# ---- the intro: two filtered bars, the kick high-passed away, fading in, thinning under the riser, hard stop
a, s = piece(0.0, FB(2) - 0.012, 5, 0, fade_in=0.0, fade_out=0.006)
s = hp(s, 95)
ti = (a + np.arange(len(s))) / SR
g_db = np.interp(ti, [0.0, 0.05, 1.0, 2.45, 2.75, 3.3], [-60, -9, 0, 0, -4.5, -4.5])
s *= 10 ** (g_db / 20)[:, None]
lvl = lufs(s[int(1.0 * SR): int(2.4 * SR)])
s *= 10 ** ((main - 3.5 - lvl) / 20)                     # the reference's intro sits about 3.5 LU under the plateau
out[a:a + len(s)] += s

# ---- the outro: the intro's first bars again, darker and quiet, under the logo sting and "Let's talk"
a, s = piece(38.40, 41.95, 1, 24, fade_in=0.0, fade_out=0.0)
s = lp(hp(s, 95), 2600)
to = (a + np.arange(len(s))) / SR
g_db = np.interp(to, [38.40, 38.75, 39.25, 40.2, 41.2, 41.6, 41.95], [-40, 0, 0, -3, -7, -14, -60])
s *= 10 ** (g_db / 20)[:, None]
lvl = lufs(s[int(0.4 * SR): int(1.6 * SR)])
s *= 10 ** ((main - 9.5 - lvl) / 20)                     # the reference's outro pad: -25 to -30 LUFS against -13
out[a:a + len(s)] += s

# ---- filter moves: the break (low-passed, opening into drop 2) and the reference's sparse-hat bars
def fc_curve(t):
    fc = np.full_like(t, 30000.0)
    def seg(t0, t1, f0, f1, shape="exp"):
        m = (t >= t0) & (t < t1); u = (t[m] - t0) / (t1 - t0)
        fc[m] = f0 * (f1 / f0) ** u if shape == "exp" else f0 + (f1 - f0) * u
    def ramp(t0, t1, f0, f1): seg(t0, t1, f0, f1)
    # the break, film bar 11: hats and claps out under "Export", opening with the shimmer riser into f579
    ramp(FB(11) - 0.03, FB(11) + 0.01, 30000, 650)
    ramp(FB(11) + 0.01, 18.45, 650, 900)
    ramp(18.45, FB(12) - 0.01, 900, 16000)
    ramp(FB(12) - 0.01, FB(12) + 0.004, 16000, 30000)
    # sparse-hat bars: film bar 3 (the "Engage." glitch swoosh stands alone) and under the "3" (33.45-34.23)
    ramp(FB(3) - 0.02, FB(3) + 0.02, 30000, 4200); ramp(FB(3) + 0.02, FB(4) - 0.03, 4200, 4200); ramp(FB(4) - 0.03, FB(4) - 0.004, 4200, 30000)
    ramp(33.43, 33.46, 30000, 3400); ramp(33.46, 34.20, 3400, 3400); ramp(34.20, 34.26, 3400, 30000)
    return fc

NP, HOPS = 2048, 512
f, tt, Z = stft(out.T, fs=SR, nperseg=NP, noverlap=NP - HOPS, boundary="even", padded=True)
fc = fc_curve(tt)
M = 1 / np.sqrt(1 + (f[:, None] / fc[None, :]) ** 6)       # 18 dB/octave
_, y = istft(Z * M[None], fs=SR, nperseg=NP, noverlap=NP - HOPS, boundary=True)
out = y.T[:N]
brk = (t >= FB(11)) & (t < FB(12))
out[brk] *= 10 ** (-1.0 / 20)

out[t >= 41.95] = 0
pk = np.abs(out).max(); out *= 10 ** (-1.0 / 20) / pk     # the bed is levelled by the mixer; just no overs
sf.write(OUT, out.astype(np.float32), SR, subtype="PCM_24")
print(f"{OUT}: {len(out) / SR:.3f} s, main {main:.1f} LUFS before scaling, peak normalised to -1 dBFS")
for name, (p, q) in {"intro 1.0-2.4": (1.0, 2.4), "drop1 3.3-17.7": (3.3, 17.7), "break 17.7-19.3": (17.7, 19.3), "drop2 19.3-32.1": (19.3, 32.1),
                     "end 32.1-38.0": (32.1, 38.0), "outro 39.3-41.0": (39.3, 41.0)}.items():
    print(f"  {name:18s} {lufs(out[int(p * SR):int(q * SR)]):6.1f} LUFS")
