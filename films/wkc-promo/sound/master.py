# Masters the mixed film sound to about -14 LUFS integrated with true peaks under -1 dBTP (sound_mix.py leaves it at
# -15 LUFS with a sample-peak ceiling): one gain to the target, then a look-ahead limiter that watches the 4x
# oversampled (true) peak, then 16-bit with TPDF dither. In place by default.
#   python3 master.py [../film/public/audio/mix.wav] [--lufs -14] [--tp -1.2]
import sys, wave
import numpy as np, pyloudnorm as pyln
from scipy.signal import resample_poly
from scipy.ndimage import minimum_filter1d

def arg(name, default): return float(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
path = next((a for a in sys.argv[1:] if a.endswith(".wav")), "../film/public/audio/mix.wav")
TARGET, CEIL = arg("--lufs", -14.0), arg("--tp", -1.2)
with wave.open(path) as w:
    SR, n = w.getframerate(), w.getnframes()
    x = np.frombuffer(w.readframes(n), dtype="<i2").reshape(-1, 2).astype(np.float64) / 32768
meter = pyln.Meter(SR)

def true_peak_env(y):
    """Per-sample true peak (max over 4x oversampling, both channels)."""
    up = np.abs(resample_poly(y, 4, 1, axis=0)).max(axis=1)
    up = up[: len(y) * 4].reshape(-1, 4).max(axis=1)
    return np.maximum(up, np.abs(y).max(axis=1))

def limit(y, ceil_db, look=0.005, release=0.08):
    c = 10 ** (ceil_db / 20)
    need = np.minimum(1.0, c / np.maximum(true_peak_env(y), 1e-9))
    la = int(look * SR)
    need = minimum_filter1d(need, 2 * la + 1, origin=0)          # look ahead (and behind) so the gain is down in time
    g = np.empty_like(need); cur = 1.0; rel = np.exp(-1 / (release * SR))
    for i in range(len(need)):                                      # instant attack (already looked ahead), smooth release
        v = need[i]; cur = v if v < cur else v + (cur - v) * rel; g[i] = cur
    k = np.hanning(2 * la + 1); k /= k.sum()                       # smooth the attack corners
    g = np.minimum(g, np.convolve(g, k, "same"))
    return y * g[:, None]

l0 = meter.integrated_loudness(x)
gain = TARGET - l0
for it in range(4):
    y = limit(x * 10 ** (gain / 20), CEIL)
    l = meter.integrated_loudness(y)
    if abs(l - TARGET) < 0.05: break
    gain += TARGET - l
tp = 20 * np.log10(true_peak_env(y).max())
rng = np.random.default_rng(0)
d = (rng.random(y.shape) - rng.random(y.shape)) / 32768            # TPDF dither
pcm = np.clip(np.round((y + d) * 32767), -32768, 32767).astype("<i2")
with wave.open(path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"{path}: {n / SR:.3f} s, {l0:.1f} -> {l:.1f} LUFS (gain {gain:+.1f} dB), true peak {tp:.1f} dBTP")
