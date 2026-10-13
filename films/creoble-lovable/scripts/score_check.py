# Checks a composed score by measurement, since the sandbox can't listen:
#   python3 -I score_check.py score.wav [--stems dir] [--bars score.wav.bars.json]
# 1 harmony: per bar, the share of pitch energy (90 Hz-2 kHz) on the written chord's tones (score_sampled.py writes
#   the chords to score.wav.bars.json). Around 75-85 % is healthy (the melody's passing notes and reverb tails make
#   the rest); a bar far below its neighbours has a wrong note, a wrong-octave sample or a chord carried over.
# 2 levels: per bar, each stem's RMS (with --stems), to catch a sample layer or a part that jumps
#   out (a forte velocity layer under a voice reads 10 dB above its neighbours).
# 3 clicks: sample-to-sample spikes above 9 kHz far above their local level (a sample cut without a fade).
# Exit code 1 when a bar's harmony is under 45 %, a stem jumps 8 dB above both neighbouring bars, or a click is found.
import glob, json, os, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, stft

path = sys.argv[1]
arg = lambda n, d=None: sys.argv[sys.argv.index(n) + 1] if n in sys.argv else d
meta = json.load(open(arg("--bars", path + ".bars.json")))
BAR = meta["bars"]; CH = meta["chords"]; PCS = meta["pcs"]
NAMES = "C C# D D# E F F# G G# A A# B".split()

def read(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), "<i2").reshape(-1, w.getnchannels()) / 32768
    return x, w.getframerate()

x, sr = read(path); mono = x.mean(1)
bad = 0
# 1 harmony
f, t, Z = stft(mono, sr, nperseg=8192, noverlap=8192 - 2048)
P = np.abs(Z) ** 2; midi = 69 + 12 * np.log2(np.maximum(f, 1) / 440); ok = (f > 90) & (f < 2000)
pc_of = np.round(midi[ok]).astype(int) % 12
print("bar  start  chord   in-chord  strongest")
for i, (s, d) in enumerate(BAR):
    ch = CH.get(str(i))
    m = (t >= s + 0.05) & (t < s + d)
    if not ch or not m.any(): continue
    e = P[ok][:, m].sum(1); c = np.bincount(pc_of, weights=e, minlength=12); c /= c.sum() + 1e-12
    inside = sum(c[j] for j in PCS[ch]); top = np.argsort(c)[::-1][:4]
    flag = "  <- check" if inside < 0.45 else ""
    bad += inside < 0.45
    print(f"{i:3d} {s:6.2f}  {ch:6s}  {inside:6.0%}    " + " ".join(f"{NAMES[j]}{c[j]:.0%}" for j in top) + flag)

# 2 stem levels per bar
stems = sorted(glob.glob(os.path.join(arg("--stems", ""), "*.wav"))) if arg("--stems") else []
if stems:
    print("\nstem levels per bar (RMS dB)")
    for p in stems:
        y, _ = read(p); y = y.mean(1); row = []
        for s, d in BAR:
            seg = y[int(s * sr): int((s + d) * sr)]
            row.append(20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9) if len(seg) else -99)
        # a part playing on both sides that jumps 8 dB in one bar (an entry after a rest is not a jump)
        jumps = [i for i in range(1, len(row) - 1) if min(row[i - 1], row[i + 1]) > -45 and row[i] - max(row[i - 1], row[i + 1]) > 8]
        bad += len(jumps)
        print(f"  {os.path.basename(p):14s} " + " ".join(f"{v:4.0f}" for v in row) + (f"   jumps at bars {jumps}" if jumps else ""))

# 3 clicks
clicks = []
for ch in range(x.shape[1]):
    h = sosfilt(butter(4, 9000, "high", fs=sr, output="sos"), x[:, ch])
    c = np.concatenate([[0], np.cumsum(h ** 2)]); n = 4800
    env = np.sqrt(np.maximum((c[n:] - c[:-n]) / n, 0)); env = np.pad(env, (n // 2, len(h) - len(env) - n // 2), mode="edge") + 1e-6
    idx = np.where(np.abs(h) / env > 9)[0]
    last = -sr
    for i in idx:
        if i - last > sr // 20: clicks.append(round(i / sr, 2))
        last = i
bad += len(clicks)
print(f"\nclicks: {sorted(set(clicks)) if clicks else 'none'}")
sys.exit(1 if bad else 0)
