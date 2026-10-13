# The Vendom film's own sound effects: every cue gets its own sound, made for its moment, so nothing is heard twice
# (Karl, 12 Oct). Water is the material: bubbles, drops, a jet, a wash; tonal sounds sit in the music's key (Pop 05,
# fitted, measures G minor: G minor pentatonic G Bb C D F). Generated with numpy, royalty-free.
#   python3 vendom_sfx.py   -> lib/sfx/vendom/*.wav and lib/sfx/index.json
import json, os, numpy as np, wave
from scipy.signal import lfilter, fftconvolve
SR = 48000
rng = np.random.default_rng(41)
OUT = "lib/sfx/vendom"
os.makedirs(OUT, exist_ok=True)
NOTE = {"G2": 98.0, "D3": 146.83, "G3": 196.0, "Bb3": 233.08, "C4": 261.63, "D4": 293.66, "F4": 349.23, "G4": 392.0, "Bb4": 466.16, "C5": 523.25,
        "D5": 587.33, "F5": 698.46, "G5": 783.99, "Bb5": 932.33, "C6": 1046.5, "D6": 1174.66, "F6": 1396.91, "G6": 1567.98}

def t_(n): return np.arange(int(n * SR)) / SR
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)
def hp(x, fc):
    return x - lp(x, fc)
def bp(x, fc, q=4.0):
    w = 2 * np.pi * fc / SR; al = np.sin(w) / (2 * q)
    b0, b1, b2, a0, a1, a2 = al, 0, -al, 1 + al, -2 * np.cos(w), 1 - al
    return lfilter([b0 / a0, b1 / a0, b2 / a0], [1, a1 / a0, a2 / a0], x)
def sweep_noise(n, f0, f1, q=3.0, seed=0):
    r = np.random.default_rng(seed); x = r.standard_normal(int(n * SR)); out = np.zeros_like(x); seg = 256
    for s in range(0, len(x), seg):
        fc = f0 * (f1 / f0) ** (s / len(x)); out[s:s + seg] = bp(x[s:s + seg], fc, q)[:len(x[s:s + seg])]
    return out
def arc(n, p=1.0): return np.sin(np.pi * np.clip(t_(n) / n, 0, 1)) ** p
def tone(f, n, partials=((1, 1.0), (2, 0.35), (3, 0.12)), d=0.4, a=0.004):
    t = t_(n); y = np.zeros_like(t)
    for k, amp in partials: y += amp * np.sin(2 * np.pi * f * k * t) * np.exp(-t * k / d)
    return y * np.minimum(1, t / a)
def pluck(f, n=0.6, bright=0.5, seed=0):
    r = np.random.default_rng(seed); N = int(SR / f); buf = r.uniform(-1, 1, N); out = np.zeros(int(n * SR))
    for i in range(len(out)):
        out[i] = buf[i % N]; buf[i % N] = 0.5 * (buf[i % N] + buf[(i + 1) % N]) * (0.994 + 0.004 * bright)
    return lp(out, 2500 + 5000 * bright)
def click(hi=4200, lo=1800, gap=0.028, seed=0, n=0.09):
    r = np.random.default_rng(seed); x = np.zeros(int(n * SR))
    for fc, at, g in [(hi, 0.0, 1.0), (lo, gap, 0.6)]:
        b = r.standard_normal(int(0.012 * SR)) * np.exp(-np.arange(int(0.012 * SR)) / (0.0025 * SR))
        b = bp(b, fc, 2.5) * g; s = int(at * SR); x[s:s + len(b)] += b
    return x
def thump(f0=110, f1=45, n=0.5, d=0.12):
    t = t_(n); ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t / 0.05)) / SR
    return np.sin(ph) * np.exp(-t / d) * np.minimum(1, t / 0.002)
def chord(freqs, n=1.6, a=0.25, d=0.9, saw=False, cut=2600):
    t = t_(n); y = np.zeros_like(t)
    for f in freqs:
        for dt in (-0.004, 0.0, 0.004):
            ff = f * (1 + dt); y += (2 * ((ff * t) % 1) - 1 if saw else np.sin(2 * np.pi * ff * t)) / 3
    e = np.minimum(1, t / a) * np.exp(-np.maximum(0, t - a) / d)
    return (lp(y, cut) if saw else y) * e
def ceramic(f=1900, n=0.9, seed=0):
    # a cup or saucer touched: inharmonic partials, quick bright decay
    r = np.random.default_rng(seed); t = t_(n); y = np.zeros_like(t)
    for k, (m, amp, d) in enumerate([(1, 1, 0.35), (2.32, 0.6, 0.22), (4.25, 0.35, 0.12), (6.63, 0.2, 0.07)]):
        y += amp * np.sin(2 * np.pi * f * m * (1 + 0.002 * r.standard_normal()) * t) * np.exp(-t / d)
    return y * np.minimum(1, t / 0.0015)
def paper(n=0.35, f0=2400, f1=900, seed=0):
    r = np.random.default_rng(seed); x = r.standard_normal(int(n * SR)) * (0.6 + 0.4 * r.random(int(n * SR)) ** 4)
    return hp(sweep_noise(n, f0, f1, 1.2, seed) * 0.6 + bp(x, 3000, 0.8) * 0.4, 500) * arc(n, 0.8)
def keys(n, seed, lo=3000, hi=5000, rate=(0.05, 0.06)):
    r = np.random.default_rng(seed); y = np.zeros(int(n * SR)); tt = 0.02
    while tt < n - 0.08:
        place(y, click(lo + (hi - lo) * r.random(), 1300 + 700 * r.random(), 0.012, int(tt * 1000) + seed) * (0.45 + 0.35 * r.random()), tt)
        tt += rate[0] + rate[1] * r.random()
    return y
def add(*xs):
    n = max(len(x) for x in xs); out = np.zeros(n)
    for x in xs: out[:len(x)] += x
    return out
def place(dst, src, at):
    s = int(at * SR); e = min(len(dst), s + len(src)); dst[s:e] += src[:e - s]
def reverb(x, length=1.0, wet=0.22, seed=1):
    r = np.random.default_rng(seed); n = int(length * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / (0.25 * SR)); ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum())
    wetx = fftconvolve(x, ir)[:len(x) + n]
    out = np.zeros(len(x) + n); out[:len(x)] += x; out[:len(wetx)] += wet * wetx
    return out
def stereo(x, width=0.0012, pan=0.0):
    d = int(width * SR); L = np.concatenate([x, np.zeros(d)]); R = np.concatenate([np.zeros(d), x])
    return np.stack([L * (1 - max(0, pan)), R * (1 + min(0, pan))], 1)

items = []
def save(id, y, cat, sync, note, rev=0.18, pan=0.0):
    y = reverb(y, 1.0, rev) if rev > 0 else y
    y = y / (np.abs(y).max() + 1e-9) * 0.7
    st = stereo(y, pan=pan)
    with wave.open(f"{OUT}/{id}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())
    items.append({"id": id, "file": f"sfx/vendom/{id}.wav", "category": cat, "sync": sync, "length": round(len(st) / SR, 3),
                  "licence": "generated", "source": "generated for the Vendom film (vendom_sfx.py), royalty-free", "character": note})


def metal(f=2600, n=0.5, seed=0):
    # a small key or ring: bright inharmonic partials, fast decay
    r = np.random.default_rng(seed); t = t_(n); y = np.zeros_like(t)
    for m, amp, d in [(1, 1, 0.12), (2.76, 0.7, 0.08), (5.4, 0.45, 0.05), (8.9, 0.25, 0.03)]:
        y += amp * np.sin(2 * np.pi * f * m * (1 + 0.003 * r.standard_normal()) * t) * np.exp(-t / d)
    return y * np.minimum(1, t / 0.001)
def knock(f=180, seed=0):
    r = np.random.default_rng(seed); n = 0.18; t = t_(n)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.03) + 0.5 * np.sin(2 * np.pi * f * 2.3 * t) * np.exp(-t / 0.02)
    tick = bp(r.standard_normal(len(t)), 1800, 1.5) * np.exp(-t / 0.006) * 0.6
    return body + tick
def wash(n=1.6, seed=0, f0=500, f1=1800):
    # a wave on the shore: band noise that swells and recedes
    return sweep_noise(n, f0, f1, 0.9, seed) * arc(n, 1.4) * (0.7 + 0.3 * np.sin(np.pi * 3 * np.clip(t_(n) / n, 0, 1)))
def bubble(f, n=0.12):
    t = t_(n); ph = 2 * np.pi * np.cumsum(f * (1 + 0.6 * t / n)) / SR
    return np.sin(ph) * np.sin(np.pi * np.clip(t / n, 0, 1)) ** 1.5



def drop(f, n=0.18, seed=0):
    # a water drop: a fast upward-chirping sine with a soft decay
    t = t_(n); ph = 2 * np.pi * np.cumsum(f * (1 + 1.6 * (t / n) ** 0.7)) / SR
    return np.sin(ph) * np.exp(-t / (n * 0.35)) * np.minimum(1, t / 0.002)
def fizz(n, seed=0, density=60, lo=600, hi=2400):
    # many tiny bubbles
    r = np.random.default_rng(seed); y = np.zeros(int(n * SR))
    for k in range(int(density * n)):
        place(y, drop(lo + (hi - lo) * r.random(), 0.04 + 0.05 * r.random()) * (0.2 + 0.5 * r.random()), r.random() * (n - 0.1))
    return y
def gush(n=1.2, seed=0, f0=300, f1=1600):
    return sweep_noise(n, f0, f1, 0.8, seed) * arc(n, 1.2)

# --- 1 your next escape
y = np.zeros(int(1.8 * SR))
for k in range(12): place(y, add(click(3000 + 200 * (k % 3), 1400, 0.012, 300 + k) * 0.4, bp(rng.standard_normal(int(0.03 * SR)), 1800, 2) * np.exp(-t_(0.03) / 0.008) * 0.25), 0.133 * k)
save("vd-flaps", y, "ticker", 0.0, "the destination flaps flip: Bali, Santorini, Maldives…", rev=0.1)
y = np.zeros(int(1.6 * SR)); place(y, chord([NOTE["G4"], NOTE["Bb4"], NOTE["D5"]], 1.4, a=0.01, d=0.5) * 0.4, 0); place(y, tone(NOTE["G5"], 0.8, d=0.3) * 0.2, 0.02)
place(y, sweep_noise(0.7, 2400, 500, 2.5, 3) * arc(0.7, 1.5) * 0.18, 0.05)
save("vd-garden", y, "success", 0.0, "'Your garden': it lands, the distance runs down to 0 km", rev=0.3)
y = np.zeros(int(0.8 * SR)); place(y, sweep_noise(0.45, 2000, 400, 2.0, 5) * arc(0.45, 1.6) * 0.6, 0); place(y, drop(500, 0.22) * 0.6, 0.42)
save("vd-to-bubble", y, "whoosh", 0.42, "the card closes into a bubble", rev=0.2)
# --- 2 meet Vendom
y = np.zeros(int(1.8 * SR)); place(y, gush(1.2, 7, 250, 1400) * 0.4, 0); place(y, fizz(1.4, 7, 50, 500, 1800) * 0.7, 0.05)
save("vd-bubbles-open", y, "riser", 0.6, "the bubbles open the frame", rev=0.3)
y = np.zeros(int(2.2 * SR)); place(y, chord([NOTE["G3"], NOTE["D4"], NOTE["G4"], NOTE["Bb4"], NOTE["D5"]], 2.0, a=0.02, d=0.9) * 0.42, 0); place(y, thump(110, 55, 0.4) * 0.35, 0)
place(y, drop(900, 0.2) * 0.3, 0.0); place(y, drop(1300, 0.2) * 0.25, 0.08)
save("vd-logo", y, "impact", 0.0, "Vendom: the two bubbles land, a full G-minor bloom", rev=0.4)
y = np.zeros(int(1.0 * SR))
for k, n in enumerate(["D6", "C6", "Bb5", "G5", "F5", "D5"]): place(y, tone(NOTE[n], 0.35, ((1, 1), (2, 0.2)), d=0.1) * 0.2, 0.045 * k)
save("vd-wordmark", y, "stinger", 0.0, "the name writes itself out", rev=0.35)
# --- 3 bring wellness home
w = sweep_noise(0.6, 350, 1400, 2.0, 9) * arc(0.6, 1.2)
save("vd-home-rise", w, "appear-rise", 0.35, "the spa at home rises in", rev=0.18)
save("vd-roof", add(pluck(NOTE["G4"], 0.9, 0.45, 11) * 0.6, pluck(NOTE["D5"], 0.9, 0.45, 12) * 0.4), "chime", 0.0, "the roof rises: home", rev=0.3)
# --- 4–5 your space, the range
y = np.zeros(int(1.6 * SR)); place(y, gush(1.3, 13, 300, 900) * 0.35, 0); place(y, chord([NOTE["C4"], NOTE["G4"], NOTE["D5"]], 1.4, a=0.5, d=0.5) * 0.25, 0)
save("vd-plan", y, "riser", 0.9, "the plan of your space opens", rev=0.3)
y = np.zeros(int(1.1 * SR)); z = bp(rng.standard_normal(int(0.9 * SR)), 3200, 1.2) * (0.5 + 0.5 * np.abs(np.sin(np.pi * 9 * t_(0.9)))) * arc(0.9, 0.6) * 0.35
place(y, hp(z, 1500), 0)
save("vd-draw", y, "swipe", 0.0, "the space is drawn: a pen around the terrace", rev=0.12)
y = np.zeros(int(1.0 * SR))
for k, n in enumerate(["G4", "Bb4", "C5", "D5", "F5", "G5"]): place(y, add(drop(NOTE[n], 0.16) * 0.5, tone(NOTE[n], 0.15, d=0.04) * 0.2), 0.1 * k)
save("vd-range", y, "ticker", 0.0, "the range: six spas, six drops climbing", rev=0.2)
y = np.zeros(int(1.0 * SR)); place(y, sweep_noise(0.6, 1600, 500, 2.0, 15) * arc(0.6, 1.5) * 0.5, 0); place(y, add(thump(160, 100, 0.25) * 0.4, drop(700, 0.2) * 0.3), 0.7)
save("vd-compact", y, "whoosh", 0.7, "a compact spa settles in your space", rev=0.18)
y = np.zeros(int(1.6 * SR)); place(y, gush(1.1, 17, 200, 1100) * 0.6, 0); place(y, thump(120, 70, 0.3) * 0.3, 0.8)
save("vd-swim", y, "whoosh", 0.8, "the swim spa slides in, long: a water swish", rev=0.25)
# --- 6 choose your experience
y = np.zeros(int(1.4 * SR)); place(y, gush(1.2, 19, 400, 1200) * 0.45, 0)
save("vd-water-open", y, "riser", 0.6, "water opens under the options", rev=0.3)
w = sweep_noise(0.45, 400, 1500, 2.0, 21) * arc(0.45, 1)
save("vd-options", w, "appear-rise", 0.25, "the two experiences rise", rev=0.15)
y = np.zeros(int(0.8 * SR)); place(y, add(click(2800, 1200, 0.03, 23) * 0.6, tone(NOTE["D5"], 0.2, d=0.05) * 0.3), 0); place(y, add(click(3000, 1300, 0.03, 24) * 0.6, tone(NOTE["G5"], 0.2, d=0.05) * 0.3), 0.3)
save("vd-toggles", y, "tap", 0.0, "hydromassage on, insulation on", rev=0.12)
# --- 7 targeted jets, release tension
y = np.zeros(int(1.2 * SR)); place(y, sweep_noise(0.5, 600, 2000, 2.5, 25) * arc(0.5, 1.5) * 0.4, 0); place(y, hp(rng.standard_normal(int(0.7 * SR)), 2500) * arc(0.7, 1) * 0.12, 0.3)
save("vd-jets-in", y, "swipe", 0.3, "the jet and the spa come in; water hiss", rev=0.15)
y = np.zeros(int(0.8 * SR))
for k, n in enumerate(["C5", "D5", "F5"]): place(y, add(drop(NOTE[n], 0.14) * 0.6, tone(NOTE[n] * 2, 0.1, d=0.03) * 0.15), 0.2 * k)
save("vd-targets", y, "pop", 0.0, "three jet targets light up", rev=0.2)
y = np.zeros(int(2.0 * SR)); place(y, fizz(1.6, 27, 90, 400, 2200) * 0.8, 0); place(y, gush(1.4, 27, 300, 1500) * 0.35, 0)
save("vd-release", y, "riser", 0.2, "release: a rush of bubbles", rev=0.3)
y = add(chord([NOTE["Bb4"], NOTE["D5"], NOTE["F5"]], 1.1, a=0.01, d=0.35) * 0.4, pluck(NOTE["G5"], 0.7, 0.5, 29) * 0.25)
save("vd-relieved", y, "success", 0.0, "'Tension released'", rev=0.3)
# --- 8 insulation, warmth, energy
w = sweep_noise(0.5, 1800, 500, 2.0, 31) * arc(0.5, 1.5)
save("vd-swap", w, "whoosh", 0.25, "the jets give way to winter and the insulation", rev=0.15)
y = np.zeros(int(0.9 * SR)); place(y, lp(rng.standard_normal(int(0.75 * SR)), 900) * arc(0.75, 0.8) * 1.5, 0)
save("vd-wrap", y, "swipe", 0.0, "the insulation wraps the water: a soft foam wipe", rev=0.15)
y = np.zeros(int(1.6 * SR)); place(y, chord([NOTE["D3"], NOTE["G3"], NOTE["Bb3"]], 1.5, a=0.3, d=0.6, saw=True, cut=1200) * 0.5, 0)
save("vd-warmth", y, "riser", 0.3, "the warmth turns back in: a warm low swell", rev=0.3)
y = np.zeros(int(1.0 * SR))
for k, n in enumerate(["G5", "F5", "D5", "C5"]): place(y, tone(NOTE[n], 0.25, ((1, 1), (2, 0.2)), d=0.07) * 0.35, 0.12 * k)
save("vd-energy-down", y, "data", 0.0, "energy use goes down: four falling notes", rev=0.2)
# --- 9–10 the experts, every step
w = sweep_noise(0.45, 300, 1200, 2.0, 33) * arc(0.45, 1)
save("vd-project", w, "appear-rise", 0.25, "your spa project", rev=0.15)
y = np.zeros(int(0.9 * SR)); place(y, thump(140, 80, 0.25) * 0.5, 0); place(y, add(tone(NOTE["G4"], 0.5, d=0.15), tone(NOTE["D5"], 0.5, d=0.15)) * 0.3, 0.02)
save("vd-experts", y, "impact", 0.0, "'Vendom experts' lands on the project", rev=0.2)
y = np.zeros(int(1.0 * SR))
for k in range(4): place(y, add(click(4200, 1900, 0.008, 35 + k) * 0.2, tone(NOTE[["G5", "Bb5", "C6", "D6"][k]], 0.12, d=0.03) * 0.25), 0.133 * k)
save("vd-details", y, "ticker", 0.0, "the details are taken: four ticks", rev=0.12)
y = np.zeros(int(0.9 * SR)); z = sweep_noise(0.55, 700, 2600, 3.0, 39) * np.sin(np.pi * np.clip(t_(0.55) / 0.55, 0, 1)) * 0.5; place(y, z, 0)
save("vd-path", y, "whoosh", 0.3, "the path draws across", rev=0.18)
save("vd-step-model", add(drop(NOTE["G4"] * 2, 0.2) * 0.5, pluck(NOTE["G4"], 0.6, 0.5, 41) * 0.5), "pop", 0.0, "step: the right model", rev=0.2, pan=-0.4)
save("vd-step-delivery", add(thump(90, 60, 0.25) * 0.4, pluck(NOTE["Bb4"], 0.6, 0.4, 43) * 0.5), "pop", 0.0, "step: delivery, a soft low thud", rev=0.2, pan=-0.15)
save("vd-step-install", add(click(1600, 800, 0.02, 45) * 0.5, pluck(NOTE["C5"], 0.6, 0.5, 46) * 0.5), "pop", 0.0, "step: installation, a fitting click", rev=0.2, pan=0.15)
save("vd-step-support", add(tone(NOTE["D5"], 0.5, ((1, 1), (2, 0.3)), d=0.15) * 0.4, tone(NOTE["F5"], 0.5, d=0.15) * 0.25), "pop", 0.0, "step: ongoing support, a warm two-note", rev=0.25, pan=0.4)
y = np.zeros(int(1.6 * SR)); place(y, sweep_noise(0.8, 500, 2000, 2.0, 47) * arc(0.8, 1.2) * 0.35, 0)
for k, n in enumerate(["G5", "Bb5", "D6", "G6"]): place(y, tone(NOTE[n], 0.5, ((1, 1), (2, 0.2)), d=0.15) * 0.22, 0.6 + 0.133 * k)
save("vd-guides", y, "success", 0.6, "Vendom guides every step: the path completes, four checks climb", rev=0.3)
# --- 11 less planning, more relaxing
y = np.zeros(int(1.0 * SR)); z = sweep_noise(0.5, 1800, 400, 2.0, 49) * np.linspace(0, 1, int(0.5 * SR)) ** 2; place(y, z * 0.6, 0); place(y, thump(160, 95, 0.25) * 0.35, 0.5)
save("vd-fold", y, "whoosh", 0.5, "less planning: everything folds into one line", rev=0.15)
y = add(chord([NOTE["G4"], NOTE["D5"], NOTE["G5"]], 1.2, a=0.01, d=0.4) * 0.4, pluck(NOTE["Bb5"], 0.8, 0.5, 51) * 0.25)
save("vd-arranged", y, "success", 0.0, "'All arranged'", rev=0.3)
y = np.zeros(int(2.4 * SR)); place(y, gush(2.0, 53, 250, 1100) * 0.45, 0); place(y, fizz(2.0, 53, 30, 400, 1400) * 0.4, 0.2)
place(y, chord([NOTE["G3"], NOTE["D4"], NOTE["Bb4"]], 2.2, a=0.6, d=0.9) * 0.25, 0)
save("vd-relax", y, "riser", 0.6, "more relaxing: the spa opens, warm water and bubbles", rev=0.4)
# --- 12–13 always ready, all year round
w = sweep_noise(0.5, 400, 1300, 2.0, 55) * arc(0.5, 1)
save("vd-panel", w, "appear-rise", 0.25, "your spa's panel rises", rev=0.15)
y = np.zeros(int(1.6 * SR)); t = t_(1.3); place(y, np.sin(2 * np.pi * np.cumsum(np.linspace(NOTE["D5"], NOTE["G5"], len(t))) / SR) * arc(1.3, 0.8) * 0.18, 0)
save("vd-temp", y, "data", 0.0, "the water warms to 38°: a slow rising tone", rev=0.3)
y = add(tone(NOTE["G5"], 0.8, ((1, 1), (2, 0.25)), d=0.25) * 0.35, tone(NOTE["D6"], 0.8, d=0.25) * 0.25)
save("vd-ready", y, "chime", 0.0, "'Ready'", rev=0.3)
y = np.zeros(int(1.4 * SR)); place(y, hp(sweep_noise(1.0, 2000, 6000, 1.5, 57), 1800) * arc(1.0, 1.2) * 0.25, 0)
for k, n in enumerate(["D5", "F5", "G5", "C6"]): place(y, add(pluck(NOTE[n], 0.5, 0.5, 58 + k) * 0.4, tone(NOTE[n] * 2, 0.15, d=0.04) * 0.12), 0.167 * k + 0.1)
save("vd-seasons", y, "ticker", 0.1, "all year round: winter opens, four seasons pass", rev=0.3)
# --- 14 the sign-off (the music's last hit at 39.06)
y = np.zeros(int(1.0 * SR)); place(y, sweep_noise(0.6, 2200, 500, 2.0, 61) * arc(0.6, 1.5) * 0.5, 0)
save("vd-sign-open", y, "whoosh", 0.3, "the sign-off opens out of the panel", rev=0.18)
y = np.zeros(int(2.6 * SR)); place(y, drop(780, 0.25) * 0.35, 0); place(y, drop(1170, 0.25) * 0.3, 0.09)
place(y, chord([NOTE["G3"], NOTE["Bb3"], NOTE["D4"], NOTE["G4"], NOTE["D5"]], 2.4, a=0.03, d=1.1) * 0.35, 0.05)
save("vd-final", y, "impact", 0.0, "Vendom: two bubbles and the closing chord", rev=0.45)
save("vd-url", add(click(5200, 2500, 0.006, 63) * 0.4, drop(1600, 0.12) * 0.25), "tap", 0.0, "the address", rev=0.15)

idx_path = "lib/sfx/index.json"
idx = [x for x in (json.load(open(idx_path)) if os.path.exists(idx_path) else []) if not x["id"].startswith("vd-")]
json.dump(idx + items, open(idx_path, "w"), indent=1)
print(len(items), "sounds")
