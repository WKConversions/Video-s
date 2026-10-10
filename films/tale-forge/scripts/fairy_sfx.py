# Magical, fairytale sound effects for the Tale Forge film, generated so they are royalty-free and their sync
# points are exact: python3 -I fairy_sfx.py <out_lib_dir>   (writes sfx/<category>/<id>.wav + sfx/index.json,
# the format scripts/sound_mix.py reads). Bells are tuned to the music bed (Frost Waltz: E-flat, G, B-flat, C).
# Also builds the ambience bed (night crickets and wind; Tale Forge's own hearth and forest loops) as atmos.wav.
import json, os, sys, subprocess
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synth_gen as S  # the skill's sfx_synth.py generators (whoosh, shimmer, swell, impact, riser), without its main()

SR = 48000
rng = np.random.default_rng(11)
OUT = sys.argv[1]
INDEX = []

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
EB = [63, 67, 70, 72, 75, 79, 82, 84, 87, 91, 94, 96]  # Eb G Bb C across octaves

def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)

def bell(f, dur=1.6, vel=1.0, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for ratio, amp, dec in [(1, 1, 1.0), (2.0, 0.42 * bright, 0.55), (2.76, 0.3 * bright, 0.35), (5.4, 0.12 * bright, 0.18), (8.93, 0.05 * bright, 0.1)]:
        y += amp * np.sin(2 * np.pi * f * ratio * t + rng.uniform(0, 6.28)) * np.exp(-t / (dec * dur * 0.45))
    return y * (1 - np.exp(-t * 900)) * vel

def pan(y, p):  # p -1..1
    l, r = np.cos((p + 1) * np.pi / 4), np.sin((p + 1) * np.pi / 4)
    return np.stack([y * l, y * r], 1)

def verb(x, length=1.2, wet=0.22):
    n = int(length * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, (n, 2)) * np.exp(-t / (length / 5))[:, None]
    ir[:, 0] = np.convolve(ir[:, 0], np.ones(8) / 8, mode="same"); ir[:, 1] = np.convolve(ir[:, 1], np.ones(8) / 8, mode="same")
    ir /= np.abs(ir).sum(0).max() / 6
    out = np.zeros((len(x) + n, 2))
    for c in range(2):
        conv = np.convolve(x[:, c], ir[:, c])[: len(x) + n]
        out[: len(conv), c] = conv
    dry = np.zeros_like(out); dry[: len(x)] = x
    return dry * (1 - wet) + out * wet

def norm(x, peak=0.85):
    m = np.abs(x).max(); return x * (peak / m) if m > 0 else x

def lp(x, fc):  # one-pole low-pass, both channels
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = np.zeros(x.shape[1:]) if x.ndim > 1 else 0.0
    for i in range(len(x)):
        s = (1 - a) * x[i] + a * s; y[i] = s
    return y

def bandnoise(n, lo, hi):
    X = np.fft.rfft(rng.normal(0, 1, n)); f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, n)

def add(id_, cat, y, sync, character):
    path = os.path.join(OUT, "sfx", cat, id_ + ".wav")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    y = norm(y)
    pcm = (np.clip(y, -1, 1) * 32767).astype("<i2")
    import wave
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    INDEX.append({"id": id_, "file": f"sfx/{cat}/{id_}.wav", "category": cat, "character": character, "licence": "generated", "sync": round(sync, 4), "length": round(len(y) / SR, 3)})

# --- twinkles: a quick rising run of tuned bells (sparkle, a star, a light switching on)
for i, notes in enumerate([[79, 84, 87, 91], [82, 87, 91, 94], [84, 91, 94, 96], [75, 79, 82, 87, 91]]):
    n = int(1.8 * SR); y = np.zeros((n, 2))
    for j, m in enumerate(notes):
        s = int(j * 0.055 * SR); b = bell(hz(m), 1.2, 0.8 - j * 0.08, 0.7)
        y[s:s + len(b)] += pan(b, -0.5 + j / max(1, len(notes) - 1))[: n - s]
    add(f"twinkle-{i + 1}", "chime", verb(y, 1.4, 0.3), 0.004, "a rising run of small tuned bells, sparkling")

# --- shooting star: a falling glissando of bells
n = int(1.6 * SR); y = np.zeros((n, 2))
for j in range(14):
    s = int(j * 0.045 * SR); b = bell(hz(96 - j * 1.5), 0.6, 0.5 * (1 - j / 16), 0.5)
    y[s:s + len(b)] += pan(b, -0.8 + j / 8)[: n - s]
add("shooting-star", "chime", verb(y, 1.6, 0.35), 0.3, "a falling glissando of tiny bells")

# --- choice chime: a warm tuned chord, the payoff of a decision
n = int(2.6 * SR); y = np.zeros((n, 2))
for j, m in enumerate([63, 70, 75, 79, 87]):
    s = int(j * 0.018 * SR); b = bell(hz(m), 2.4, 0.9 - j * 0.1, 0.8)
    y[s:s + len(b)] += pan(b, -0.4 + j * 0.2)[: n - s]
add("chime-choice", "success", verb(y, 1.8, 0.28), 0.004, "a warm bell chord with a long tail")

# --- magic dust: granular high sparkles, thinning out
n = int(1.6 * SR); y = np.zeros((n, 2))
for j in range(70):
    t0 = rng.random() ** 1.8 * 1.3; s = int(t0 * SR); f = hz(rng.choice(EB[4:]) + 12 * rng.integers(0, 2))
    m = int(0.12 * SR); tt = np.arange(m) / SR
    g = np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.03) * (0.25 + rng.random() * 0.5)
    y[s:s + m] += pan(g, rng.uniform(-0.9, 0.9))[: n - s]
add("magic-dust", "stinger", verb(y, 1.2, 0.35), 0.01, "a shower of tiny high sparkles")

# --- bubble pops: soft bloops for thought and speech bubbles (pitched per cue)
for i, (f0, f1) in enumerate([(420, 760), (520, 900)]):
    n = int(0.28 * SR); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 40))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / 0.06) * (1 - np.exp(-t * 2000))
    add(f"bloop-{i + 1}", "pop", verb(pan(y, 0), 0.5, 0.12), 0.012, "a soft rounded bloop, like a bubble")

# --- footstep on a soft path
n = int(0.25 * SR); t = np.arange(n) / SR
y = lp(pan(bandnoise(n, 120, 2200) * np.exp(-t / 0.035), 0), 1800) * 2 + pan(np.sin(2 * np.pi * 85 * t) * np.exp(-t / 0.05), 0) * 0.5
add("step-soft", "tap", y, 0.004, "a soft footstep on a garden path")

# --- door latch and a wooden knock-open
n = int(0.9 * SR); t = np.arange(n) / SR
click = bandnoise(n, 2500, 7000) * np.exp(-t / 0.006)
body = (np.sin(2 * np.pi * 180 * t) + 0.6 * np.sin(2 * np.pi * 317 * t)) * np.exp(-t / 0.09)
y = pan(click * 0.6 + body * 0.8, 0.2)
add("door-latch", "tap", verb(y, 0.8, 0.2), 0.003, "a small latch click and a wooden door opening")

# --- paper: a page turning (flutter, then a soft settle)
n = int(0.75 * SR); t = np.arange(n) / SR
flut = 0.55 + 0.45 * np.sin(2 * np.pi * (18 + 10 * t) * t + rng.uniform(0, 6))
shape = np.sin(np.pi * np.clip(t / 0.55, 0, 1)) ** 1.5
y = bandnoise(n, 900, 7500) * flut * shape * 0.8
settle = bandnoise(n, 300, 3000) * np.exp(-np.maximum(0, t - 0.52) / 0.05) * (t > 0.52)
add("page-turn", "swipe", verb(pan(y + settle * 0.8, 0.1), 0.6, 0.15), 0.52, "a picture-book page turning and settling")

# --- a book closing: page whoosh into a soft cloth thump
n = int(1.0 * SR); t = np.arange(n) / SR
air = bandnoise(n, 300, 4000) * np.sin(np.pi * np.clip(t / 0.45, 0, 1)) ** 2 * 0.5
thump = (np.sin(2 * np.pi * 95 * t) * np.exp(-np.maximum(0, t - 0.45) / 0.07) + bandnoise(n, 200, 1500) * np.exp(-np.maximum(0, t - 0.45) / 0.02) * 0.5) * (t > 0.45)
add("book-close", "impact", verb(pan(air + thump, 0), 0.7, 0.15), 0.45, "a book closing with a soft cloth thump")

# --- paint bloom: a wet brush stroke swelling and fading
n = int(1.4 * SR); t = np.arange(n) / SR
y = bandnoise(n, 400, 5000) * np.minimum(1, t / 0.35) * np.exp(-np.maximum(0, t - 0.35) / 0.35)
wet = 0.7 + 0.3 * np.sin(2 * np.pi * 7 * t)
add("paint-bloom", "whoosh", verb(lp(pan(y * wet, -0.1), 3200), 1.0, 0.25), 0.35, "a soft wet brush stroke blooming")

# --- touch on a glass button
n = int(0.3 * SR); t = np.arange(n) / SR
y = bandnoise(n, 1500, 6000) * np.exp(-t / 0.004) * 0.6 + np.sin(2 * np.pi * 1320 * t) * np.exp(-t / 0.05) * 0.3
add("tap-glass", "tap", verb(pan(y, 0.2), 0.4, 0.1), 0.002, "a soft tap on glass")

# --- the skill's own generators: soft air, swells, a soft impact, a riser
add("swell-air", "whoosh", S.stereo(S.swell, 1.8, 0.9), 0.9, "soft air swelling and fading")
add("whoosh-soft", "whoosh", S.stereo(S.whoosh, 0.9, 0.5, 200, 2400), 0.5, "a soft airy whoosh")
add("shimmer", "stinger", S.stereo(S.shimmer, 1.6), 0.05, "bright partials sparkling")
add("impact-soft", "impact", S.stereo(S.impact, 1.6, 90, 40, 0.2), 0.0, "a soft low thump")
add("riser-soft", "riser", S.stereo(S.riser, 1.6, 200, 1200), 1.6, "air and a tone climbing into a reveal")

os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
json.dump(INDEX, open(os.path.join(OUT, "sfx", "index.json"), "w"), indent=1)
print(len(INDEX), "effects")

# ---------------------------------------------------------------- the ambience bed (film time, 48 kHz stereo)
LEN = float(sys.argv[2]) if len(sys.argv) > 2 else 70.0
N = int(LEN * SR)
atm = np.zeros((N, 2))
def load(p):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32).reshape(-1, 2).astype(np.float64)
def place(x, at, a, b, fade=0.8, gain=1.0):
    s, e = int(at * SR), int(min(LEN, at + (b - a)) * SR)
    seg = np.tile(x, (int(np.ceil((e - s) / len(x))) + 1, 1))[int(a * SR): int(a * SR) + (e - s)]
    n = len(seg); ramp = np.ones(n); f = int(fade * SR)
    ramp[:f] = np.linspace(0, 1, f); ramp[-f:] = np.linspace(1, 0, f)
    atm[s:s + n] += seg * ramp[:, None] * gain
# night: two crickets and a little wind, 0 → 4.6 s
n = int(5.0 * SR); t = np.arange(n) / SR; night = np.zeros((n, 2))
for c, (fc, per, ph, p) in enumerate([(4300, 0.62, 0.0, -0.6), (4700, 0.81, 0.3, 0.7)]):
    gate = ((t + ph) % per < 0.12) * (0.5 + 0.5 * np.sin(2 * np.pi * 30 * t) > 0.5)
    night += pan(np.sin(2 * np.pi * fc * t) * gate * 0.25, p)
wind = lp(pan(rng.normal(0, 1, n), 0), 400) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.2 * t))[:, None]
night += wind * 0.6
place(night, 0.0, 0, 4.6, 0.3, 0.5)
lib = sys.argv[3] if len(sys.argv) > 3 else None
if lib:
    hearth = load(os.path.join(lib, "hearth.mp3")); forest = load(os.path.join(lib, "forest.mp3"))
    place(hearth, 3.7, 2.0, 2.0 + 12.4, 1.0, 0.55)     # the lamp-lit room, first visit
    place(hearth, 45.6, 6.0, 6.0 + 6.4, 1.0, 0.55)     # the room again
    place(forest, 59.1, 0.0, 10.9, 1.5, 0.4)           # morning birdsong
out = norm(atm, 0.5)
import wave
with wave.open(os.path.join(OUT, "atmos.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype("<i2").tobytes())
print("atmos", LEN, "s")
