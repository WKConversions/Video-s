# The Creoble film's own sound effects: every cue gets its own sound, made for its moment, so nothing is heard twice
# (Karl, 12 Oct: "be more unique with the sound effects ... too much a pattern"). Tonal sounds sit in the music's key
# (Just Keep Walking measures E major: E F# G# A B C# D#). A few café textures (cup, steam, paper) tie the sound to the
# example business. Generated with numpy, royalty-free.
#   python3 creoble_sfx.py   -> lib/sfx/creoble/*.wav and lib/sfx/index.json
import json, os, numpy as np, wave
from scipy.signal import lfilter, fftconvolve
SR = 48000
rng = np.random.default_rng(11)
OUT = "lib/sfx/creoble"
os.makedirs(OUT, exist_ok=True)
NOTE = {"E2": 82.41, "B2": 123.47, "E3": 164.81, "A3": 220.0, "B3": 246.94, "E4": 329.63, "F#4": 369.99, "G#4": 415.30, "A4": 440.0,
        "B4": 493.88, "C#5": 554.37, "D#5": 622.25, "E5": 659.25, "F#5": 739.99, "G#5": 830.61, "A5": 880.0, "B5": 987.77,
        "C#6": 1108.73, "D#6": 1244.51, "E6": 1318.51, "F#6": 1479.98, "G#6": 1661.22, "B6": 1975.53}

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
    items.append({"id": id, "file": f"sfx/creoble/{id}.wav", "category": cat, "sync": sync, "length": round(len(st) / SR, 3),
                  "licence": "generated", "source": "generated for the Creoble film (creoble_sfx.py), royalty-free", "character": note})

# --- 1 the hook: the café, then its website
y = np.zeros(int(2.6 * SR)); place(y, chord([NOTE["E3"], NOTE["B3"], NOTE["G#4"]], 2.4, a=0.8, d=0.9, saw=True, cut=1800) * 0.55, 0)
place(y, hp(sweep_noise(2.2, 3200, 5200, 1.5, 3), 2500) * 0.05 * np.minimum(1, t_(2.2) / 0.6) * np.exp(-t_(2.2) / 1.2), 0.05)
save("cr-cafe-open", y, "riser", 0.5, "a warm E-major air with a breath of steam as the café opens the film", rev=0.3)
y = np.zeros(int(1.0 * SR)); place(y, sweep_noise(0.7, 2600, 700, 2.0, 5) * arc(0.7, 1.5) * 0.7, 0); place(y, thump(150, 85, 0.35) * 0.35, 0.68)
save("cr-into-site", y, "whoosh", 0.68, "the café closes into the website's hero, a soft landing", rev=0.18)
save("cr-foer", add(pluck(NOTE["G#5"], 0.8, 0.55, 7) * 0.8, tone(NOTE["G#5"], 0.5, d=0.15) * 0.2), "pop", 0.0, "'før' lands in terracotta", rev=0.25)
w = sweep_noise(0.5, 900, 350, 2.0, 9) * arc(0.5, 2)
save("cr-words-away", w, "whoosh", 0.25, "the question eases away", rev=0.15)
# --- 2 the old way: locked, papers, questions
y = np.zeros(int(0.9 * SR)); place(y, thump(95, 60, 0.4, 0.09) * 0.7, 0); place(y, bp(rng.standard_normal(int(0.05 * SR)), 900, 3) * np.exp(-t_(0.05) / 0.01) * 0.4, 0.0)
place(y, tone(NOTE["E4"] * 0.944, 0.6, ((1, 1), (2, 0.2)), d=0.2) * 0.25, 0.02)
save("cr-lock", y, "impact", 0.0, "the site blurs behind a lock: a muted, slightly flat knock", rev=0.12)
save("cr-paper-quote", paper(0.4, 2600, 900, 11), "swipe", 0.2, "the quote slides in (paper)", rev=0.1, pan=-0.2)
y = np.zeros(int(0.8 * SR)); place(y, paper(0.35, 2000, 700, 13) * 0.9, 0); place(y, ceramic(2600, 0.5, 13) * 0.2, 0.3)
save("cr-paper-deposit", y, "swipe", 0.2, "the deposit slip lands with a small metallic tick", rev=0.1, pan=0.2)
y = np.zeros(int(2.2 * SR))
for i in range(14):
    f = 500 + 900 * rng.random(); z = np.sin(2 * np.pi * np.cumsum(np.linspace(f, f * 1.5, int(0.06 * SR))) / SR) * np.hanning(int(0.06 * SR))
    place(y, z * (0.35 + 0.03 * i), 0.133 * i + 0.02 * rng.random())
save("cr-questions", y, "data", 0.0, "fourteen small rising bubbles, one per question", rev=0.2)
y = np.zeros(int(0.9 * SR)); place(y, sweep_noise(0.7, 1400, 220, 1.8, 15) * arc(0.7, 1.2) * 0.8, 0)
save("cr-old-drop", y, "whoosh", 0.3, "the old way falls out of frame", rev=0.15)
# --- 3 Creoble turns it around
y = np.zeros(int(2.2 * SR)); place(y, chord([NOTE["E4"], NOTE["G#4"], NOTE["B4"], NOTE["E5"]], 2.0, a=0.02, d=0.9) * 0.45, 0)
place(y, tone(NOTE["B5"], 1.4, ((1, 1), (2, 0.25)), d=0.5) * 0.2, 0.04); place(y, thump(120, 60, 0.4) * 0.35, 0)
save("cr-brand", y, "impact", 0.0, "Creoble: a clear E-major bloom", rev=0.35)
y = np.zeros(int(0.6 * SR))
for i, n in enumerate(["B4", "C#5", "E5"]): place(y, add(click(3400 - 300 * i, 1500, 0.01, 17 + i) * 0.35, tone(NOTE[n], 0.2, d=0.06) * 0.4), 0.09 * i)
save("cr-steps-in", y, "pop", 0.0, "three step cards: three soft wooden notes", rev=0.12)
y = np.zeros(int(1.2 * SR)); place(y, sweep_noise(0.85, 400, 1800, 2.5, 19) * arc(0.85, 1) * 0.6, 0)
for i, n in enumerate(["E5", "B4", "G#4"]): place(y, tone(NOTE[n], 0.3, ((1, 1), (2.4, 0.2)), d=0.09) * 0.35, 0.5 + 0.08 * i)
save("cr-turn", y, "swipe", 0.5, "the process turns on its head: a rising orbit, notes stepping down as the order flips", rev=0.2)
w = sweep_noise(0.45, 600, 1500, 2.0, 21) * arc(0.45, 2) * 0.7
save("cr-steps-out", w, "whoosh", 0.25, "the steps make way for the builder", rev=0.12)
# --- 4 tell us about your business
y = np.zeros(int(1.6 * SR)); place(y, sweep_noise(1.2, 250, 900, 1.6, 23) * np.linspace(0, 1, int(1.2 * SR)) ** 1.5 * np.exp(-np.maximum(0, t_(1.2) - 0.9) / 0.1) * 0.5, 0)
place(y, chord([NOTE["A3"], NOTE["E4"], NOTE["C#5"]], 1.4, a=0.5, d=0.5) * 0.35, 0.0)
save("cr-cafe-behind", y, "riser", 0.9, "the café opens behind the form, a soft A-major swell", rev=0.3)
save("cr-keys-name", keys(0.8, 25), "ticker", 0.0, "'Café Salvie' typed", rev=0.08)
y = np.zeros(int(0.4 * SR)); place(y, click(2400, 1100, 0.035, 27) * 0.8, 0); place(y, sweep_noise(0.12, 1200, 2600, 3, 27) * np.hanning(int(0.12 * SR)) * 0.25, 0.02)
save("cr-dropdown", y, "tap", 0.0, "the branche list opens", rev=0.06)
y = np.zeros(int(0.7 * SR))
for i in range(4): place(y, click(5200 - 300 * i, 2500, 0.006, 29 + i) * 0.25, 0.055 * i)
place(y, tone(NOTE["C#6"], 0.35, ((1, 1), (2, 0.2)), d=0.1) * 0.45, 0.24)
save("cr-pick", y, "ticker", 0.24, "the highlight steps down the list and 'Restaurant / Café' is picked", rev=0.12)
save("cr-click-build", add(click(3000, 1250, 0.026, 31), tone(NOTE["E5"], 0.15, d=0.04) * 0.15), "tap", 0.0, "'Byg min side' is clicked", rev=0.05, pan=0.2)
y = np.zeros(int(1.0 * SR)); place(y, sweep_noise(0.75, 3000, 500, 2.2, 33) * arc(0.75, 1.6) * 0.75, 0); place(y, thump(140, 90, 0.3) * 0.3, 0.72)
save("cr-description-to-site", y, "whoosh", 0.72, "the café closes into the hero: the description becomes the website", rev=0.2)
# --- 5 the build
y = np.zeros(int(3.0 * SR))
for i in range(40): place(y, tone(2200 + 1800 * rng.random(), 0.06, ((1, 1),), d=0.018) * 0.22 * (0.6 + 0.4 * np.sin(np.pi * i / 40)), 0.07 * i + 0.02 * rng.random())
place(y, sweep_noise(2.8, 900, 2400, 6, 35) * arc(2.8, 1) * 0.12, 0)
save("cr-generating", y, "data", 0.0, "a fine glitter while Creoble builds the site", rev=0.3)
save("cr-build-menu", add(pluck(NOTE["E5"], 0.6, 0.45, 37) * 0.7, click(4400, 2000, 0.01, 37) * 0.15), "pop", 0.0, "the menu develops", rev=0.2, pan=-0.15)
save("cr-build-about", add(pluck(NOTE["G#5"], 0.6, 0.45, 39) * 0.7, click(4100, 1900, 0.01, 39) * 0.15), "pop", 0.0, "the about section develops", rev=0.2, pan=0.1)
save("cr-build-contact", add(pluck(NOTE["B5"], 0.6, 0.45, 41) * 0.7, click(3900, 1800, 0.01, 41) * 0.15), "pop", 0.0, "the contact band develops", rev=0.2, pan=0.2)
y = np.zeros(int(1.8 * SR))
for i, n in enumerate(["E5", "G#5", "B5", "E6"]): place(y, tone(NOTE[n], 1.2, ((1, 1), (2, 0.25), (3, 0.08)), d=0.45) * 0.32, 0.07 * i)
save("cr-site-ready", y, "success", 0.0, "'Din hjemmeside er færdig': an E-major arpeggio", rev=0.35)
# --- 6 explore, design, change it in plain words
w = sweep_noise(0.7, 500, 2600, 2.2, 43) * arc(0.7, 1.3) * 0.7
save("cr-scroll-down", w, "whoosh", 0.35, "the pages are explored: a long scroll down", rev=0.15)
w = sweep_noise(0.4, 2800, 900, 2.4, 45) * arc(0.4, 1.6) * 0.7
save("cr-scroll-up", w, "whoosh", 0.2, "and back up to the design", rev=0.12)
y = np.zeros(int(1.0 * SR)); place(y, click(3600, 1600, 0.02, 49) * 0.7, 0); place(y, chord([NOTE["C#5"], NOTE["E5"], NOTE["A5"]], 0.8, a=0.01, d=0.25) * 0.3, 0.03)
save("cr-theme-terra", y, "success", 0.0, "the first colour is picked: warm terracotta", rev=0.2, pan=0.3)
y = np.zeros(int(1.0 * SR)); place(y, click(3100, 1400, 0.03, 51) * 0.7, 0); place(y, chord([NOTE["B4"], NOTE["D#5"], NOTE["F#5"]], 0.8, a=0.01, d=0.25) * 0.3, 0.03)
save("cr-theme-forest", y, "success", 0.0, "the second colour: deep forest", rev=0.2, pan=0.3)
w = sweep_noise(0.4, 300, 1100, 2.0, 53) * arc(0.4, 1)
save("cr-change-bar", w, "appear-rise", 0.25, "the change bar rises", rev=0.12)
save("cr-keys-change", keys(0.8, 55, 3800, 5600, (0.035, 0.04)), "ticker", 0.0, "'Gør overskriften større' typed, quicker and lighter", rev=0.08)
y = np.zeros(int(1.2 * SR)); place(y, click(4800, 2100, 0.024, 57) * 0.6, 0); place(y, sweep_noise(0.3, 700, 3600, 2.5, 57) * arc(0.3, 1.5) * 0.5, 0.03)
place(y, add(tone(NOTE["B4"], 0.6, d=0.2), tone(NOTE["E5"], 0.6, d=0.2)) * 0.25, 0.22); place(y, tone(NOTE["B5"], 0.6, d=0.2) * 0.25, 0.35)
save("cr-send-change", y, "success", 0.22, "sent, and the headline grows: 'Ændret'", rev=0.2)
# --- 7 do you like the result?
w = sweep_noise(0.45, 350, 1300, 2.0, 59) * arc(0.45, 1)
save("cr-like-rise", w, "appear-rise", 0.25, "the question card rises", rev=0.12)
save("cr-click-yes", add(click(3500, 1500, 0.02, 61), ceramic(2300, 0.35, 61) * 0.12), "tap", 0.0, "'Ja, den er min'", rev=0.08, pan=-0.15)
# --- 8 499 kroner, one payment, no subscription
w = sweep_noise(0.55, 1800, 500, 2.0, 65) * arc(0.55, 1.5)
save("cr-price-in", w, "swipe", 0.3, "the site steps aside for the price", rev=0.15)
y = np.zeros(int(2.2 * SR)); place(y, thump(100, 48, 0.6, 0.15) * 0.7, 0)
place(y, chord([NOTE["E4"], NOTE["B4"], NOTE["E5"], NOTE["G#5"]], 2.0, a=0.015, d=0.8) * 0.38, 0); place(y, ceramic(1650, 0.9, 67) * 0.12, 0.0)
save("cr-499", y, "impact", 0.0, "499 kr: a warm landing", rev=0.3)
y = np.zeros(int(1.4 * SR)); place(y, ceramic(1975, 1.2, 69) * 0.8, 0)
save("cr-one-payment", y, "chime", 0.0, "Én betaling: a single cup-and-saucer ring, struck once", rev=0.25)
save("cr-no-sub", add(pluck(NOTE["C#5"], 0.6, 0.5, 71) * 0.6, tone(NOTE["C#5"], 0.4, d=0.12) * 0.15), "pop", 0.0, "Intet abonnement", rev=0.2)
y = np.zeros(int(0.5 * SR)); z = bp(rng.standard_normal(int(0.28 * SR)), 2600, 1.5) * np.linspace(0.3, 1, int(0.28 * SR)) * np.exp(-np.maximum(0, t_(0.28) - 0.22) / 0.02)
place(y, hp(z, 900) * 0.6, 0)
save("cr-strike", y, "swipe", 0.0, "'kr/md' struck through: a quick pen stroke", rev=0.08)
y = np.zeros(int(1.4 * SR)); place(y, pluck(NOTE["E4"], 1.2, 0.35, 73) * 0.7, 0); place(y, pluck(NOTE["B4"], 1.0, 0.35, 74) * 0.5, 0.06)
place(y, tone(NOTE["E5"], 1.0, d=0.35) * 0.18, 0.1)
save("cr-yours", y, "success", 0.0, "Siden er din: a warm low E, it's yours", rev=0.3)
# --- 9 online: hosting, domain, e-mail in one place
y = np.zeros(int(0.9 * SR)); place(y, sweep_noise(0.6, 3200, 450, 2.2, 75) * arc(0.6, 1.4) * 0.75, 0)
save("cr-back-to-top", y, "whoosh", 0.3, "the price leaves, the site runs back to the top", rev=0.15)
y = np.zeros(int(1.4 * SR)); place(y, click(2700, 1200, 0.04, 77) * 0.7, 0)
for i, n in enumerate(["B5", "E6"]): place(y, tone(NOTE[n], 0.9, ((1, 1), (2, 0.3)), d=0.3) * 0.32, 0.08 + 0.09 * i)
save("cr-go-online", y, "success", 0.08, "the switch flips: Online", rev=0.3)
save("cr-keys-url", keys(0.5, 79, 4200, 6200, (0.03, 0.025)), "ticker", 0.0, "cafesalvie.dk types into the address bar", rev=0.06)
save("cr-card-hosting", add(tone(NOTE["E5"], 0.3, ((1, 1), (2.76, 0.18)), d=0.08) * 0.6, click(3000, 1300, 0.01, 81) * 0.2), "pop", 0.0, "Hosting", rev=0.15, pan=-0.3)
save("cr-card-domain", add(tone(NOTE["F#5"], 0.3, ((1, 1), (2.76, 0.18)), d=0.08) * 0.6, click(3200, 1400, 0.01, 83) * 0.2), "pop", 0.0, "Domæne", rev=0.15)
save("cr-card-mail", add(tone(NOTE["G#5"], 0.3, ((1, 1), (2.76, 0.18)), d=0.08) * 0.6, click(3400, 1500, 0.01, 85) * 0.2), "pop", 0.0, "E-mail", rev=0.15, pan=0.3)
y = np.zeros(int(1.0 * SR)); z = sweep_noise(0.5, 1600, 450, 2.0, 87) * np.linspace(0, 1, int(0.5 * SR)) ** 2; place(y, z * 0.6, 0); place(y, thump(170, 95, 0.25) * 0.4, 0.5)
save("cr-gather", y, "whoosh", 0.5, "the three cards gather into one", rev=0.15)
y = chord([NOTE["A4"], NOTE["C#5"], NOTE["E5"], NOTE["B5"]], 1.6, a=0.05, d=0.6) * 0.5
save("cr-one-place", y, "stinger", 0.0, "Samlet ét sted: an open A chord", rev=0.35)
# --- 10 no code, no uncertainty
w = sweep_noise(0.45, 700, 2400, 2.0, 89) * arc(0.45, 2)
save("cr-lift-off", w, "whoosh", 0.25, "the site lifts away", rev=0.12)
y = np.zeros(int(0.6 * SR)); z = hp(bp(rng.standard_normal(int(0.2 * SR)), 1800, 1.2), 600) * np.linspace(1, 0.2, int(0.2 * SR)); place(y, z * 0.6, 0)
place(y, tone(NOTE["E4"] * 0.944, 0.3, ((1, 1), (2, 0.3)), d=0.08) * 0.35, 0.02)
save("cr-no-code", y, "swipe", 0.0, "the code sign is crossed out: a dry stroke", rev=0.1)
y = np.zeros(int(1.4 * SR)); place(y, tone(NOTE["D#5"], 0.4, d=0.12) * 0.35, 0); place(y, tone(NOTE["E5"], 1.0, ((1, 1), (2, 0.3)), d=0.35) * 0.4, 0.12)
place(y, pluck(NOTE["B5"], 0.8, 0.5, 91) * 0.35, 0.12)
save("cr-certain", y, "success", 0.12, "the question mark resolves into a check: D# to E", rev=0.3)
# --- 11 the sign-off (the music's last hit at 41.45)
y = np.zeros(int(1.6 * SR)); place(y, sweep_noise(1.2, 300, 1200, 1.8, 93) * np.linspace(0, 1, int(1.2 * SR)) ** 1.6 * 0.4, 0)
place(y, chord([NOTE["E4"], NOTE["B4"]], 1.4, a=0.6, d=0.6) * 0.3, 0)
save("cr-signoff-air", y, "riser", 1.0, "the sign-off breathes in", rev=0.3)
y = np.zeros(int(3.2 * SR)); place(y, thump(88, 41, 0.7) * 0.55, 0)
place(y, chord([NOTE["E4"], NOTE["G#4"], NOTE["B4"], NOTE["E5"], NOTE["B5"]], 3.0, a=0.02, d=1.3) * 0.42, 0)
place(y, ceramic(NOTE["E6"] * 1.0, 1.4, 95) * 0.1, 0.02)
save("cr-button", add(tone(NOTE["B5"], 0.4, ((1, 1), (2, 0.2)), d=0.1) * 0.5, click(4300, 1900, 0.015, 97) * 0.3), "pop", 0.0, "the 'Byg din side gratis' button arrives", rev=0.2)
save("cr-final", y, "impact", 0.0, "Byg din side gratis: the closing E-major chord with a last cup ring", rev=0.45)

idx_path = "lib/sfx/index.json"
idx = [x for x in (json.load(open(idx_path)) if os.path.exists(idx_path) else []) if not x["id"].startswith("cr-")]
json.dump(idx + items, open(idx_path, "w"), indent=1)
print(len(items), "sounds")
