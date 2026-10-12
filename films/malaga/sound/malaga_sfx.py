# The Málaga Hideaway film's own sound effects: every cue gets its own sound, made for its moment, so nothing is heard
# twice (Karl, 12 Oct: "be more unique with the sound effects ... too much a pattern"). Tonal sounds sit in the music's key
# (Summer Fun, fitted, measures E minor with an Andalusian colour: E pentatonic minor E G A B D). Home and seaside
# textures (keys, a door knock, linen, the sea) tie the sound to the place. Generated with numpy, royalty-free.
#   python3 malaga_sfx.py   -> lib/sfx/malaga/*.wav and lib/sfx/index.json
import json, os, numpy as np, wave
from scipy.signal import lfilter, fftconvolve
SR = 48000
rng = np.random.default_rng(23)
OUT = "lib/sfx/malaga"
os.makedirs(OUT, exist_ok=True)
NOTE = {"E2": 82.41, "B2": 123.47, "E3": 164.81, "G3": 196.0, "A3": 220.0, "B3": 246.94, "D4": 293.66, "E4": 329.63, "G4": 392.0, "A4": 440.0,
        "B4": 493.88, "D5": 587.33, "E5": 659.25, "G5": 783.99, "A5": 880.0, "B5": 987.77, "D6": 1174.66, "E6": 1318.51, "G6": 1567.98, "A6": 1760.0}

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
    items.append({"id": id, "file": f"sfx/malaga/{id}.wav", "category": cat, "sync": sync, "length": round(len(st) / SR, 3),
                  "licence": "generated", "source": "generated for the Málaga Hideaway film (malaga_sfx.py), royalty-free", "character": note})


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

# --- 1 one home, a hundred moving parts
y = np.zeros(int(1.8 * SR)); place(y, knock(170, 1) * 0.6, 0.0); place(y, chord([NOTE["E3"], NOTE["B3"], NOTE["G4"]], 1.6, a=0.06, d=0.8) * 0.35, 0.0)
place(y, tone(NOTE["E5"], 1.0, ((1, 1), (2, 0.3)), d=0.4) * 0.2, 0.03)
save("mh-home", y, "impact", 0.0, "the home arrives: a soft wooden knock under a warm E-minor chord", rev=0.3)
y = np.zeros(int(2.0 * SR))
for i in range(28):
    f = [NOTE[n] for n in ["E5", "G5", "A5", "B5", "D6", "E6"]][i % 6] * (1 + 0.002 * i)
    place(y, add(click(3600 + 1400 * rng.random(), 1500 + 500 * rng.random(), 0.01, 100 + i) * 0.25, tone(f, 0.12, ((1, 1),), d=0.035) * 0.22) * (0.55 + 0.45 * i / 27), 0.05 * i + 0.01 * rng.random())
save("mh-swarm", y, "data", 0.0, "twenty-eight small parts stream out: a rising patter of ticks and tiny notes", rev=0.2)
# --- 2 the chores pile up
y = np.zeros(int(0.9 * SR)); place(y, paper(0.3, 2600, 1100, 3) * 0.8, 0)
for k, n in enumerate(["E5", "G5", "B5"]): place(y, tone(NOTE[n], 0.2, ((1, 1), (3.9, 0.15)), d=0.05) * 0.4, 0.33 + 0.17 * k)
save("mh-bookings", y, "pop", 0.0, "Bookings: a calendar card lands and three stays fill in", rev=0.15, pan=0.2)
y = np.zeros(int(0.8 * SR))
for k in range(4): place(y, metal(2300 + 500 * rng.random(), 0.35, 5 + k) * (0.55 - 0.08 * k), 0.03 + 0.055 * k + 0.02 * rng.random())
save("mh-keys", y, "pop", 0.0, "Check-ins: a jingle of keys", rev=0.15, pan=0.2)
y = np.zeros(int(0.9 * SR)); place(y, hp(sweep_noise(0.4, 2500, 7000, 2.0, 7), 2000) * arc(0.4, 1.5) * 0.5, 0)
for k in range(5): place(y, tone(4200 + 900 * rng.random(), 0.08, ((1, 1),), d=0.02) * 0.25, 0.12 + 0.06 * k)
save("mh-sparkle", y, "swipe", 0.1, "Cleaning: a bright swish with glints", rev=0.25, pan=0.2)
y = np.zeros(int(0.9 * SR))
for k in range(4): place(y, click(1500, 700, 0.012, 9 + k) * 0.8, 0.07 * k)
place(y, tone(NOTE["D5"] * 1.06, 0.3, ((1, 1), (2, 0.4)), d=0.08) * 0.35, 0.32); place(y, tone(NOTE["D5"] * 1.06, 0.3, ((1, 1), (2, 0.4)), d=0.08) * 0.35, 0.46)
save("mh-repair", y, "pop", 0.0, "Repairs: a ratchet, then a two-blip alert, slightly sour", rev=0.12, pan=0.2)
y = np.zeros(int(0.9 * SR))
for k, n in enumerate(["B5", "D6", "E6"]): place(y, bubble(NOTE[n], 0.11) * 0.6, 0.0 + 0.17 * k)
save("mh-messages", y, "pop", 0.0, "Guest messages: three message bubbles, each higher", rev=0.15, pan=0.2)
# --- 3 you're miles away
y = np.zeros(int(1.0 * SR)); place(y, sweep_noise(0.8, 2400, 300, 2.0, 11) * arc(0.8, 1.5) * 0.8, 0)
save("mh-shrink", y, "whoosh", 0.4, "the whole pile shrinks onto Málaga", rev=0.18)
y = np.zeros(int(1.6 * SR)); place(y, sweep_noise(1.4, 250, 800, 1.4, 13) * np.linspace(0, 1, int(1.4 * SR)) ** 1.2 * np.exp(-np.maximum(0, t_(1.4) - 1.0) / 0.15) * 0.5, 0)
place(y, chord([NOTE["A3"], NOTE["E4"], NOTE["B4"]], 1.5, a=0.7, d=0.4) * 0.3, 0)
save("mh-map", y, "riser", 1.0, "the map opens out of Málaga: an airy swell", rev=0.35)
save("mh-pin-malaga", add(pluck(NOTE["E5"], 0.6, 0.5, 15) * 0.7, click(3800, 1700, 0.01, 15) * 0.2), "pop", 0.0, "the Málaga pin lands", rev=0.2, pan=-0.2)
y = np.zeros(int(1.0 * SR)); z = sweep_noise(0.75, 600, 2600, 3.0, 17) * np.sin(np.pi * np.clip(t_(0.75) / 0.75, 0, 1)) * 0.6; place(y, z, 0)
save("mh-route", y, "whoosh", 0.4, "the route stretches north, far away", rev=0.2, pan=0.15)
y = np.zeros(int(2.0 * SR))
for k in range(10):
    z = sweep_noise(0.16, 900 + 60 * k, 2400 + 80 * k, 3.0, 200 + k) * arc(0.16, 1.5) * 0.35
    place(y, add(z, tone(NOTE[["E5", "G5", "A5", "B5", "D6"][k % 5]], 0.08, ((1, 1),), d=0.025) * 0.18), 0.167 * k)
save("mh-travel", y, "data", 0.0, "the chores keep travelling north to you: ten soft passing ticks", rev=0.2, pan=0.2)
save("mh-pin-you", add(pluck(NOTE["B4"], 0.7, 0.4, 19) * 0.7, click(3000, 1300, 0.012, 19) * 0.2), "pop", 0.0, "'You': a lower, farther pin", rev=0.3, pan=0.3)
# --- 4 that's where Málaga Hideaway comes in
y = np.zeros(int(1.2 * SR)); place(y, pluck(NOTE["B5"], 0.9, 0.7, 21) * 0.6, 0); place(y, tone(NOTE["E6"], 0.9, ((1, 1), (2, 0.2)), d=0.3) * 0.25, 0.02)
save("mh-mark", y, "chime", 0.0, "the house mark lands on Málaga", rev=0.3)
y = np.zeros(int(2.6 * SR)); place(y, thump(95, 44, 0.6) * 0.6, 0)
place(y, chord([NOTE["E3"], NOTE["B3"], NOTE["E4"], NOTE["G4"], NOTE["B4"]], 2.4, a=0.03, d=1.0) * 0.45, 0); place(y, sweep_noise(1.2, 400, 2400, 1.5, 23) * arc(1.2, 2) * 0.12, 0)
save("mh-brand", y, "impact", 0.0, "Málaga Hideaway comes in: the blue opens out of the pin, a full warm chord", rev=0.4)
y = np.zeros(int(1.0 * SR))
for k in range(6): place(y, tone(NOTE[["E6", "D6", "B5", "A5", "G5", "E5"][k]], 0.4, ((1, 1), (2, 0.2)), d=0.12) * 0.22, 0.045 * k)
save("mh-wordmark", y, "stinger", 0.0, "the name writes itself out: a falling glint", rev=0.35)
# --- 5 one local partner: Málaga itself
y = np.zeros(int(2.0 * SR)); place(y, wash(1.8, 25) * 0.7, 0); place(y, sweep_noise(0.7, 500, 1800, 2, 25) * arc(0.7, 1.5) * 0.4, 0)
save("mh-sea", y, "riser", 0.6, "a circle opens into Málaga: a wave on the shore", rev=0.3)
save("mh-location", add(tone(NOTE["G5"], 0.25, ((1, 1), (2.76, 0.18)), d=0.07) * 0.5, click(4400, 2000, 0.01, 27) * 0.2), "pop", 0.0, "'Málaga, Costa del Sol'", rev=0.18, pan=0.35)
# --- 6 every detail taken care of
w = sweep_noise(0.45, 300, 1200, 2.0, 29) * arc(0.45, 1)
save("mh-card-rise", w, "appear-rise", 0.25, "the checklist rises", rev=0.12)
y = np.zeros(int(1.6 * SR))
for k, n in enumerate(["E5", "G5", "A5", "B5", "E6"]): place(y, add(pluck(NOTE[n], 0.45, 0.55, 31 + k) * 0.5, click(5000, 2400, 0.006, 31 + k) * 0.12), 0.233 * k)
save("mh-checks", y, "success", 0.0, "five chores checked off, one note each, rising", rev=0.2)
# --- 7 the services
y = np.zeros(int(1.2 * SR)); place(y, sweep_noise(0.85, 1800, 400, 2.0, 37) * arc(0.85, 1.4) * 0.7, 0); place(y, thump(150, 90, 0.3) * 0.3, 0.8)
save("mh-to-window", y, "whoosh", 0.8, "Málaga closes into the home's window, the list steps aside", rev=0.18)
y = np.zeros(int(1.2 * SR))
for k, n in enumerate(["G4", "B4", "D5", "E5"]): place(y, add(tone(NOTE[n], 0.3, ((1, 1), (4.0, 0.2)), d=0.07) * 0.5, knock(260 + 30 * k, 39 + k) * 0.08), 0.13 + 0.2 * k)
save("mh-calendar", y, "ticker", 0.13, "reservations: four stays fill the month, marimba-like", rev=0.18, pan=0.25)
y = np.zeros(int(1.4 * SR)); z = lp(rng.standard_normal(int(0.9 * SR)), 300) * arc(0.9, 0.8) * 3.0
place(y, z * 0.5, 0.0); place(y, metal(2900, 0.4, 41) * 0.35, 0.75); place(y, click(2500, 1100, 0.03, 41) * 0.5, 0.85)
save("mh-arrival", y, "swipe", 0.0, "guest arrivals: suitcase wheels roll up, the lock clicks open", rev=0.15, pan=0.25)
y = np.zeros(int(1.0 * SR)); z = bp(rng.standard_normal(int(0.35 * SR)), 900, 0.7) * np.exp(-t_(0.35) / 0.09); place(y, z * 0.7, 0.0)
for k in range(3): place(y, tone(NOTE[["B5", "D6", "E6"][k]], 0.2, ((1, 1),), d=0.06) * 0.25, 0.22 + 0.07 * k)
save("mh-linen", y, "swipe", 0.0, "cleaning: fresh linen shaken out, then a clean glint", rev=0.18, pan=0.25)
y = np.zeros(int(1.2 * SR)); place(y, click(1200, 600, 0.02, 43) * 0.8, 0.0); place(y, click(1300, 650, 0.02, 44) * 0.8, 0.16)
place(y, add(tone(NOTE["E5"], 0.5, d=0.15), tone(NOTE["B5"], 0.5, d=0.15)) * 0.3, 0.42)
save("mh-fixed", y, "success", 0.42, "maintenance: two turns of a wrench, then a clean fifth: fixed", rev=0.18, pan=0.25)
y = np.zeros(int(1.4 * SR)); place(y, sweep_noise(0.9, 400, 1400, 1.6, 45) * arc(0.9, 1.3) * 0.4, 0)
save("mh-home-back", y, "appear-rise", 0.45, "the home itself returns to the window", rev=0.25, pan=0.25)
y = np.zeros(int(1.6 * SR))
for k, n in enumerate(["E5", "G5", "B5", "E6"]): place(y, tone(NOTE[n], 1.1, ((1, 1), (2, 0.25), (3, 0.08)), d=0.4) * 0.3, 0.06 * k)
save("mh-ready", y, "success", 0.0, "'Ready for guests': an E-minor arpeggio that settles", rev=0.35, pan=0.2)
y = np.zeros(int(0.8 * SR))
for k, n in enumerate(["A4", "B4", "D5"]): place(y, add(knock(300 + 40 * k, 47 + k) * 0.25, tone(NOTE[n], 0.2, ((1, 1), (3.9, 0.15)), d=0.05) * 0.4), 0.167 * k)
save("mh-stays", y, "pop", 0.0, "the next stays line up, three wooden pops", rev=0.15, pan=0.35)
# --- 8 not renting it out? keyholding and property support
save("mh-switch-chip", add(tone(NOTE["D5"], 0.2, d=0.05) * 0.4, click(3600, 1600, 0.01, 51) * 0.2), "pop", 0.0, "the 'Renting out' switch appears", rev=0.12, pan=0.35)
y = np.zeros(int(0.9 * SR)); place(y, click(2200, 900, 0.035, 53) * 0.8, 0.0)
for k, n in enumerate(["B4", "G4", "E4"]): place(y, tone(NOTE[n], 0.2, ((1, 1),), d=0.06) * 0.3, 0.1 + 0.08 * k)
save("mh-switch-off", y, "tap", 0.0, "renting out: off; the stays drop away, three notes down", rev=0.15, pan=0.35)
save("mh-list-swap", paper(0.4, 1800, 700, 55) * 0.8, "swipe", 0.2, "the list turns to keyholding and property support", rev=0.12, pan=-0.3)
y = np.zeros(int(1.6 * SR)); place(y, sweep_noise(0.5, 1500, 600, 2, 57) * arc(0.5, 1.5) * 0.4, 0)
for k in range(3): place(y, metal(2600 + 300 * k, 0.4, 57 + k) * 0.45, 0.62 + 0.04 * k)
place(y, metal(1700, 0.6, 60) * 0.5, 0.74)
save("mh-key-hook", y, "impact", 0.74, "the key on its tag drops onto the hook and swings", rev=0.2, pan=0.25)
y = np.zeros(int(1.2 * SR)); place(y, sweep_noise(0.4, 600, 1600, 2, 61) * arc(0.4, 1.5) * 0.35, 0)
for k in range(4): place(y, add(click(4600 - 200 * k, 2100, 0.007, 62 + k) * 0.2, tone(NOTE[["E5", "G5", "A5", "B5"][k]], 0.15, ((1, 1),), d=0.04) * 0.25), 0.47 + 0.2 * k)
save("mh-inspect", y, "ticker", 0.0, "the property check ticks through as the rooms are walked: doors, water, post, air-con", rev=0.15, pan=0.25)
y = np.zeros(int(0.8 * SR)); place(y, knock(150, 65) * 0.9, 0.0); place(y, knock(155, 66) * 0.8, 0.17)
save("mh-knock", y, "tap", 0.0, "'Technician Tue 10:00': a knock at the door, we're there", rev=0.25, pan=-0.2)
y = add(chord([NOTE["G4"], NOTE["B4"], NOTE["E5"]], 1.3, a=0.02, d=0.5) * 0.45, tone(NOTE["E6"], 0.8, d=0.25) * 0.15)
save("mh-covered", y, "success", 0.0, "'Covered while you're away': a warm closed chord", rev=0.3)
# --- 9 clear agreements, personal communication, tailored, in the loop
y = np.zeros(int(1.2 * SR)); place(y, sweep_noise(0.9, 2200, 450, 2.0, 67) * arc(0.9, 1.4) * 0.7, 0)
save("mh-morph", y, "whoosh", 0.45, "the list becomes the agreement, the window your phone", rev=0.18)
y = np.zeros(int(0.8 * SR))
for k in range(3): place(y, add(click(4200, 1900, 0.008, 69 + k) * 0.25, tone(NOTE[["D5", "E5", "G5"][k]], 0.15, ((1, 1),), d=0.04) * 0.3), 0.167 * k)
save("mh-terms", y, "ticker", 0.0, "the three terms tick", rev=0.12, pan=-0.25)
y = np.zeros(int(0.8 * SR)); tt = 0.0; k = 0
while tt < 0.58:
    seg = bp(rng.standard_normal(int(0.07 * SR)), 2600 + 1200 * rng.random(), 1.2) * arc(0.07, 1) * (0.5 + 0.4 * rng.random()); place(y, seg, tt); tt += 0.06 + 0.03 * rng.random(); k += 1
save("mh-sign", y, "swipe", 0.0, "the signature: a quick pen scribble", rev=0.08, pan=-0.25)
y = np.zeros(int(0.8 * SR)); place(y, tone(NOTE["B5"], 0.25, ((1, 1), (2, 0.2)), d=0.07) * 0.5, 0); place(y, tone(NOTE["E6"], 0.35, ((1, 1), (2, 0.2)), d=0.1) * 0.5, 0.1)
save("mh-message-in", y, "chime", 0.0, "a personal message from Málaga, with a photo of the house", rev=0.2, pan=0.3)
y = np.zeros(int(0.6 * SR)); place(y, sweep_noise(0.22, 900, 3800, 2.5, 71) * arc(0.22, 1.5) * 0.5, 0); place(y, tone(NOTE["G5"], 0.15, d=0.04) * 0.3, 0.16)
save("mh-message-out", y, "swipe", 0.16, "your reply goes out", rev=0.15, pan=0.3)
save("mh-card-turn", paper(0.35, 2200, 900, 73) * 0.7, "swipe", 0.18, "the agreement turns into your services", rev=0.12, pan=-0.25)
y = np.zeros(int(0.9 * SR))
for k in range(3): place(y, add(click(2600 + 300 * k, 1200, 0.03, 75 + k) * 0.5, tone(NOTE[["E5", "A5", "B5"][k]], 0.18, d=0.05) * 0.25), 0.233 * k)
save("mh-toggles", y, "tap", 0.0, "three services switched on for this home", rev=0.12, pan=-0.25)
y = np.zeros(int(1.6 * SR))
for k, n in enumerate(["E6", "G6", "D6", "A6"]): place(y, add(tone(NOTE[n], 0.3, ((1, 1), (2, 0.15)), d=0.08) * 0.32, tone(NOTE[n] / 2, 0.3, d=0.08) * 0.15), 0.2 * k)
save("mh-updates", y, "chime", 0.0, "always in the loop: four updates, four soft notification notes", rev=0.25, pan=0.3)
# --- 10 less to manage, more freedom
y = np.zeros(int(1.0 * SR)); z = sweep_noise(0.5, 1800, 400, 2.0, 79) * np.linspace(0, 1, int(0.5 * SR)) ** 2; place(y, z * 0.6, 0); place(y, thump(160, 95, 0.25) * 0.4, 0.5)
save("mh-fold", y, "whoosh", 0.5, "everything folds into one line", rev=0.15)
y = add(chord([NOTE["E4"], NOTE["B4"], NOTE["E5"]], 1.2, a=0.01, d=0.4) * 0.45, pluck(NOTE["G5"], 0.8, 0.5, 81) * 0.3)
save("mh-all-done", y, "success", 0.0, "'All taken care of'", rev=0.3)
y = np.zeros(int(2.6 * SR)); place(y, wash(2.4, 83, 400, 1500) * 0.6, 0); place(y, chord([NOTE["E4"], NOTE["A4"], NOTE["B4"], NOTE["E5"]], 2.4, a=0.5, d=0.9) * 0.25, 0.1)
save("mh-freedom", y, "riser", 0.5, "more freedom: the circle opens onto a sunny pool, a long breath of water", rev=0.4)
# --- 11 the sign-off (the music's last hit at 42.93)
y = np.zeros(int(1.2 * SR)); place(y, sweep_noise(0.85, 2400, 500, 2.0, 85) * arc(0.85, 1.4) * 0.6, 0); place(y, thump(130, 80, 0.3) * 0.35, 0.82)
save("mh-to-card", y, "whoosh", 0.82, "the pool closes into the home card", rev=0.18)
y = np.zeros(int(1.6 * SR)); place(y, pluck(NOTE["E5"], 1.0, 0.6, 87) * 0.5, 0); place(y, pluck(NOTE["B5"], 1.0, 0.6, 88) * 0.45, 0.07)
place(y, tone(NOTE["E6"], 1.2, ((1, 1), (2, 0.2)), d=0.45) * 0.2, 0.1)
save("mh-logo", y, "chime", 0.0, "Málaga Hideaway: the logo lands", rev=0.35, pan=0.2)
y = add(chord([NOTE["E3"], NOTE["B3"], NOTE["G4"], NOTE["B4"]], 2.0, a=0.02, d=0.9) * 0.35, metal(NOTE["E6"] * 2, 0.8, 89) * 0.06)
save("mh-hands", y, "success", 0.0, "'In good hands' lands with the song's last hit", rev=0.4)
save("mh-button", add(tone(NOTE["B5"], 0.4, ((1, 1), (2, 0.2)), d=0.1) * 0.5, click(4300, 1900, 0.015, 91) * 0.3), "pop", 0.0, "'Request your proposal'", rev=0.2, pan=0.2)
save("mh-url", add(click(5200, 2500, 0.006, 93) * 0.4, tone(NOTE["E6"], 0.12, d=0.03) * 0.2), "tap", 0.0, "the address", rev=0.15, pan=0.2)

idx_path = "lib/sfx/index.json"
idx = [x for x in (json.load(open(idx_path)) if os.path.exists(idx_path) else []) if not x["id"].startswith("mh-")]
json.dump(idx + items, open(idx_path, "w"), indent=1)
print(len(items), "sounds")
