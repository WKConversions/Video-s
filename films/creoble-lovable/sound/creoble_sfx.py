# The Creoble film's own sound effects (the Lovable 2.0 replica): every cue gets its own sound, made for its moment, used once.
import json, os, numpy as np, wave
from scipy.signal import lfilter, fftconvolve
SR = 48000
rng = np.random.default_rng(41)
OUT = "lib/sfx/creoble"
os.makedirs(OUT, exist_ok=True)
NOTE = {"Bb2": 116.54, "F3": 174.61, "Bb3": 233.08, "Db4": 277.18, "Eb4": 311.13, "F4": 349.23, "Ab4": 415.30, "Bb4": 466.16, "Db5": 554.37, "Eb5": 622.25, "F5": 698.46, "Ab5": 830.61, "Bb5": 932.33, "Db6": 1108.73, "Eb6": 1244.51, "F6": 1396.91, "Ab6": 1661.22, "Bb6": 1864.66}

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


def metal(f=2600, n=0.5, seed=0):
    # a small key or ring: bright inharmonic partials, fast decay
    r = np.random.default_rng(seed); t = t_(n); y = np.zeros_like(t)
    for m, amp, d in [(1, 1, 0.12), (2.76, 0.7, 0.08), (5.4, 0.45, 0.05), (8.9, 0.25, 0.03)]:
        y += amp * np.sin(2 * np.pi * f * m * (1 + 0.003 * r.standard_normal()) * t) * np.exp(-t / d)
    return y * np.minimum(1, t / 0.001)

# ---- the palette: the reference's sound design is a bright electronic one — airy whooshes on the big moves, crisp
# clicks and keyboard ticks on the UI, soft pops on words and messages, shimmers on the gradients, a riser into the
# drop, chimes on what gets done. Tonal sounds sit in the music's key (Expressive Courage, fitted: B♭ minor pentatonic).
def whoosh(n, f0, f1, q=1.6, seed=0, p=1.4, air=0.0):
    y = sweep_noise(n, f0, f1, q, seed) * arc(n, p)
    if air: y = y + hp(np.random.default_rng(seed + 9).standard_normal(int(n * SR)), 5000) * arc(n, 2.2) * air
    return y
def mclick(seed=0, hi=5200, lo=2100, body=0.35):
    # a mouse click: two bright ticks and a little body
    return add(click(hi, lo, 0.018, seed) * 0.9, thump(420 + 40 * (seed % 5), 160, 0.06, 0.012) * body)
def pop(f, n=0.16, drop_=0.5, seed=0):
    t = t_(n); ph = 2 * np.pi * np.cumsum(f * (1 - drop_ * np.minimum(1, t / 0.05))) / SR
    tick = bp(np.random.default_rng(seed).standard_normal(len(t)), f * 3, 2) * np.exp(-t / 0.004) * 0.3
    return np.sin(ph) * np.exp(-t / (n * 0.3)) * np.minimum(1, t / 0.0015) + tick
def blip(f, n=0.12, up=0.25):
    t = t_(n); ph = 2 * np.pi * np.cumsum(f * (1 + up * np.minimum(1, t / n))) / SR
    return (np.sin(ph) + 0.25 * np.sin(2 * ph)) * np.exp(-t / (n * 0.35)) * np.minimum(1, t / 0.002)
def chime(notes, gap=0.07, n=1.2, d=0.45, bright=0.3):
    y = np.zeros(int((n + gap * len(notes)) * SR))
    for k, nn in enumerate(notes): place(y, tone(NOTE[nn], n, ((1, 1), (2, bright), (3, bright * 0.3), (4.2, 0.08)), d=d), gap * k)
    return y
def shimmer(n, seed=0, lo=2500, hi=9000, density=90, rise=False):
    r = np.random.default_rng(seed); y = np.zeros(int(n * SR))
    for k in range(int(density * n)):
        at = r.random() * (n - 0.08); f = lo + (hi - lo) * (r.random() if not rise else min(1, at / n + 0.25 * r.random()))
        place(y, tone(f, 0.08, ((1, 1),), d=0.025) * (0.15 + 0.35 * r.random()) * np.sin(np.pi * at / n), at)
    return y
def riser(n, f0, f1, seed=0):
    t = t_(n); ph = 2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (t / n)) / SR
    return add(sweep_noise(n, 400, 7000, 1.2, seed) * (t / n) ** 2.2 * 0.7, (np.sin(ph) + 0.3 * np.sin(2 * ph)) * (t / n) ** 1.6 * 0.35)
def typing(n, seed, lo=3200, hi=5200, rate=(0.045, 0.05), soft=0.85):
    return keys(n, seed, lo, hi, rate) * soft
def swell(n, f, seed=0):
    # a reversed bloom into a reveal
    t = t_(n); e = (t / n) ** 2.4
    return add(sweep_noise(n, 600, 5000, 1.4, seed) * e * 0.6, tone(f, n, ((1, 1), (2, 0.3)), d=9) * e * 0.4)

S = save
# 0–1.5 s the ball field and "Mange"
S("cl-field", add(whoosh(0.7, 300, 2600, 1.2, 1, 1.0, 0.25), pop(NOTE["Bb4"], 0.25, 0.2, 1) * 0.25), "whoosh", 0.12, "the ball field zooms in", rev=0.3)
S("cl-mange", pop(NOTE["F5"], 0.2, 0.35, 2), "pop", 0.0, "'Mange' in its ball")
S("cl-icon", add(blip(NOTE["Db6"], 0.14, 0.4) * 0.6, shimmer(0.35, 3, 4000, 9000, 60) * 0.6), "pop", 0.0, "the code icon spins in", rev=0.25)
S("cl-caret", add(blip(NOTE["Bb3"], 0.25, 1.0) * 0.6, whoosh(0.25, 800, 3000, 2, 4, 1.2) * 0.4), "appear-rise", 0.0, "the gradient caret grows")
S("cl-type1", typing(0.62, 5), "ticker", 0.0, "for at bygge hjemmesider: typed", rev=0.08)
S("cl-brackets", add(whoosh(0.9, 3500, 500, 1.8, 6, 1.6) * 0.8, thump(140, 60, 0.3, 0.08) * 0.35), "whoosh", 0.25, "the brackets close in", rev=0.2)
S("cl-nu", tone(NOTE["Ab5"], 0.6, ((1, 1), (2.5, 0.2)), d=0.2) * 0.5, "chime", 0.0, "'nu'", rev=0.35)
S("cl-mod", swell(0.45, NOTE["Bb4"], 7), "riser", 0.45, "Mød sharpens", rev=0.3)
S("cl-logo", add(chime(["Bb4", "F5", "Bb5"], 0.03, 1.4, 0.6, 0.25) * 0.5, shimmer(0.9, 8, 3000, 9000, 70) * 0.5, thump(90, 45, 0.6, 0.18) * 0.5), "impact", 0.0, "Creoble: the logo on its arc", rev=0.45)
S("cl-riser", riser(1.45, NOTE["F3"], NOTE["F5"], 9), "riser", 1.45, "the rise into the drop (the music drops out under the logo)", rev=0.2)
S("cl-drop", add(whoosh(0.8, 2400, 250, 1.4, 10, 1.2) * 0.7, thump(70, 35, 0.9, 0.3) * 0.8), "impact", 0.05, "the drop: the dark spheres", rev=0.25)
S("cl-ai", whoosh(0.3, 900, 2600, 2.4, 11, 1.4), "swipe", 0.12, "'AI bygger'")
S("cl-sites", whoosh(0.3, 2600, 1000, 2.4, 12, 1.4), "swipe", 0.12, "'hjemmesider'")
S("cl-fast", add(whoosh(0.4, 600, 7000, 1.2, 13, 0.8, 0.4), shimmer(0.4, 13, 5000, 10000, 80, True) * 0.5), "whoosh", 0.18, "'hurtigere': a zip", rev=0.25)
S("cl-hele", add(thump(120, 70, 0.35, 0.07) * 0.8, pop(NOTE["Bb3"], 0.2, 0.3, 14) * 0.3), "pop", 0.0, "'Hele'")
S("cl-slide", whoosh(0.32, 2000, 700, 2.0, 15, 1.2), "swipe", 0.14, "the line slides on: 'processen tager'")
S("cl-under", add(thump(150, 80, 0.3, 0.06) * 0.6, pop(NOTE["Db5"], 0.18, 0.3, 16) * 0.4), "pop", 0.0, "'under'")
y = np.zeros(int(1.0 * SR)); tt = 0.0; k = 0
while tt < 0.66:
    place(y, click(3600 + 300 * (k % 3), 1500, 0.01, 170 + k) * (0.7 - 0.3 * tt), tt); k += 1; tt += 0.03 + 0.09 * (tt / 0.66) ** 2
S("cl-count", y, "ticker", 0.0, "the minutes count down to 5", rev=0.1)
S("cl-five", add(chime(["F5", "Bb5"], 0.05, 1.0, 0.4, 0.3) * 0.6, thump(100, 55, 0.4, 0.1) * 0.3), "success", 0.0, "5", rev=0.4)
S("cl-wave", whoosh(0.55, 500, 3500, 1.4, 18, 1.0), "whoosh", 0.2, "the wave draws to the dot")
S("cl-min", pop(NOTE["Eb5"], 0.16, 0.3, 19) * 0.7, "pop", 0.0, "'minutter. Ingen'")
S("cl-kode", add(pop(NOTE["F5"], 0.18, 0.3, 20) * 0.7, thump(130, 70, 0.25, 0.05) * 0.4), "pop", 0.0, "'kode'")
S("cl-noedv", add(pop(NOTE["Bb5"], 0.22, 0.25, 21) * 0.6, thump(110, 55, 0.4, 0.09) * 0.6), "impact", 0.0, "'nødvendig'", rev=0.25)
S("cl-bloom", add(swell(0.5, NOTE["Ab4"], 22) * 0.6, shimmer(0.5, 22, 2500, 7000, 50) * 0.5), "riser", 0.4, "the flower opens", rev=0.35)
S("cl-star", add(whoosh(0.6, 400, 6000, 1.2, 23, 1.0, 0.3) * 0.8, shimmer(0.5, 23, 4000, 10000, 90, True) * 0.4), "whoosh", 0.3, "the star opens onto a website", rev=0.25)
S("cl-collage", whoosh(0.7, 2800, 400, 1.3, 24, 1.3), "whoosh", 0.25, "the sites zoom out into a wall", rev=0.25)
S("cl-push", whoosh(0.8, 400, 3000, 1.3, 25, 1.6), "whoosh", 0.55, "the push into Café Gaden", rev=0.25)
S("cl-cafe", add(pop(NOTE["Db5"], 0.2, 0.2, 26) * 0.4, thump(100, 50, 0.35, 0.08) * 0.5), "pop", 0.0, "Café Gaden fills the frame")
S("cl-laptop", add(whoosh(0.9, 250, 900, 1.0, 27, 1.0) * 0.7, hp(np.random.default_rng(27).standard_normal(int(0.9 * SR)), 3000) * arc(0.9, 2) * 0.05), "whoosh", 0.3, "the laptop on the stone", rev=0.35)
# 23–34 s the prompt, the build, the colours
S("cl-pill", add(tone(NOTE["Bb2"], 1.2, ((1, 1), (2, 0.5), (3, 0.2)), d=2) * arc(1.2, 0.8) * 0.5, whoosh(1.0, 200, 1200, 0.9, 28, 1.0) * 0.3), "riser", 0.2, "the glowing prompt", rev=0.3)
S("cl-type2", typing(1.5, 29), "ticker", 0.0, "'Lav en hjemmeside til blomsterbutikken': typed", rev=0.08)
S("cl-zoomout", whoosh(0.5, 3000, 600, 1.6, 30, 1.3), "whoosh", 0.2, "the camera pulls back from the prompt")
S("cl-send", add(mclick(31), blip(NOTE["F5"], 0.16, 0.6) * 0.35), "tap", 0.0, "send", rev=0.12)
S("cl-fold", whoosh(0.4, 1800, 500, 2.2, 32, 1.4), "dismiss-fall", 0.2, "the pill folds to a bar")
S("cl-expand", add(whoosh(0.7, 350, 4200, 1.2, 33, 0.9, 0.2), blip(NOTE["Bb4"], 0.4, 0.5) * 0.25), "whoosh", 0.25, "the bar opens into the builder", rev=0.3)
y = np.zeros(int(1.4 * SR))
for k, nn in enumerate(["Bb4", "Db5", "Eb5", "F5", "Ab5", "Bb5"]): place(y, add(click(4200, 1800, 0.01, 340 + k) * 0.35, tone(NOTE[nn], 0.18, ((1, 1), (2, 0.2)), d=0.05) * 0.4), 0.2 * k)
S("cl-steps", y, "ticker", 0.0, "the builder answers its questions, step by step", rev=0.2)
S("cl-built", chime(["Bb4", "Db5", "F5", "Bb5"], 0.06, 1.2, 0.5, 0.25), "success", 0.0, "the site is built", rev=0.4)
S("cl-closeup", whoosh(0.5, 300, 1500, 1.0, 35, 1.0) * 0.8, "camera", 0.2, "close on the prompt box")
S("cl-type3", typing(1.7, 36, 3000, 4800, (0.04, 0.045)), "ticker", 0.0, "'Ret farverne…': typed", rev=0.08)
S("cl-send2", add(mclick(37, 4800, 1900), blip(NOTE["Ab5"], 0.14, 0.5) * 0.3), "tap", 0.0, "send", rev=0.12)
S("cl-msg-me", pop(NOTE["Db6"], 0.14, 0.3, 38), "pop", 0.0, "your message rises into the chat")
S("cl-msg-ai", add(pop(NOTE["F5"], 0.16, 0.3, 39) * 0.7, pop(NOTE["Bb5"], 0.14, 0.3, 40)[:int(0.12 * SR)] * 0.3), "pop", 0.0, "Creoble answers")
S("cl-tilt", whoosh(0.6, 2200, 500, 1.4, 41, 1.3), "whoosh", 0.2, "the builder tilts back")
S("cl-recolor", add(shimmer(1.0, 42, 2000, 8000, 110, True) * 0.7, whoosh(1.0, 500, 5000, 1.6, 42, 1.0) * 0.4), "riser", 0.3, "the site recolours in a sweep", rev=0.35)
S("cl-done", chime(["F5", "Ab5", "Db6"], 0.05, 1.0, 0.4, 0.3), "success", 0.0, "Færdig: the brand's colours", rev=0.4)
# 34–54 s the chatbot
S("cl-chatbot", add(pop(NOTE["Eb5"], 0.2, 0.3, 43) * 0.5, whoosh(0.3, 800, 2500, 2, 43, 1.4) * 0.4), "pop", 0.0, "'Tilføj din chatbot'")
S("cl-ptr1", blip(NOTE["Bb5"], 0.1, 0.3) * 0.7, "pop", 0.0, "the Kunde pointer")
S("cl-ptr2", blip(NOTE["F6"], 0.1, -0.2) * 0.6, "pop", 0.0, "the Chatbot pointer")
S("cl-click-chat", mclick(44, 5600, 2300), "tap", 0.0, "click: Chatbot")
S("cl-card", whoosh(0.35, 700, 2400, 1.8, 45, 1.2), "appear-rise", 0.15, "the set-up card rises")
S("cl-type4", typing(0.9, 46, 3400, 5400, (0.035, 0.04)), "ticker", 0.0, "the welcome message: typed", rev=0.08)
y = np.zeros(int(0.8 * SR))
for k, nn in enumerate(["Db5", "F5", "Ab5"]): place(y, tone(NOTE[nn], 0.25, ((1, 1), (3, 0.15)), d=0.07) * 0.5, 0.167 * k)
S("cl-learnt", y, "ticker", 0.0, "Lært, Lært, Lært", rev=0.2)
S("cl-save", add(mclick(47, 5000, 2000), chime(["Bb5"], 0, 0.5, 0.2, 0.2) * 0.35), "tap", 0.0, "Gem → Gemt", rev=0.15)
S("cl-zoomin", whoosh(0.45, 600, 2600, 1.6, 48, 1.2), "camera", 0.25, "the zoom onto the message")
y = np.zeros(int(0.8 * SR))
for k, nn in enumerate(["Bb4", "Db5", "Eb5", "F5", "Ab5"]): place(y, pop(NOTE[nn], 0.14, 0.3, 50 + k) * 0.55, 0.067 * k)
S("cl-tiles", y, "pop", 0.0, "what the bot knows, tile by tile", rev=0.2)
S("cl-fly", whoosh(0.55, 900, 3800, 1.6, 55, 1.3), "whoosh", 0.3, "the tiles fly into the top bar")
S("cl-zoomout2", whoosh(0.7, 3200, 450, 1.3, 56, 1.3), "whoosh", 0.25, "back out to the builder", rev=0.2)
S("cl-hi", add(pop(NOTE["F5"], 0.16, 0.25, 57) * 0.6, pop(NOTE["Bb5"], 0.16, 0.25, 58) * 0.4), "pop", 0.0, "the chat button says hello")
S("cl-med", add(thump(120, 60, 0.35, 0.08) * 0.8, pop(NOTE["Bb3"], 0.2, 0.3, 59) * 0.3), "pop", 0.0, "'Med'")
S("cl-klik", add(click(6000, 2600, 0.02, 60) * 0.8, pop(NOTE["F5"], 0.14, 0.3, 60) * 0.4), "tap", 0.0, "'ét klik'")
t = t_(0.7); S("cl-power", add(np.sin(2 * np.pi * np.cumsum(np.linspace(NOTE["Bb3"], NOTE["Bb4"], len(t))) / SR) * arc(0.7, 0.6) * 0.4, shimmer(0.6, 61, 3000, 8000, 60, True) * 0.5),
  "appear-rise", 0.2, "the power icon on the gradient", rev=0.35)
S("cl-chips", whoosh(0.5, 2600, 600, 1.6, 62, 1.3), "camera", 0.2, "out to the chips")
S("cl-activate", add(mclick(63, 5200, 2200), chime(["Bb4", "F5", "Bb5"], 0.04, 1.0, 0.45, 0.35) * 0.55, tone(NOTE["Bb2"], 0.6, ((1, 1),), d=0.3) * 0.25), "success", 0.0, "Aktivér → Aktiv", rev=0.35)
S("cl-open-chat", mclick(64, 4600, 1800), "tap", 0.0, "click: the chat button")
S("cl-chat-open", whoosh(0.4, 600, 3000, 1.8, 65, 1.1), "appear-rise", 0.15, "the chat window opens")
S("cl-bot1", pop(NOTE["Ab5"], 0.16, 0.25, 66), "pop", 0.0, "the bot's welcome")
S("cl-type5", typing(0.85, 67, 3000, 5000, (0.035, 0.04)), "ticker", 0.0, "'Kan I levere…': typed", rev=0.08)
S("cl-send3", add(click(5400, 2200, 0.015, 68) * 0.6, whoosh(0.18, 1500, 4500, 2.5, 68, 1.2) * 0.5), "tap", 0.0, "send", rev=0.1)
S("cl-me1", pop(NOTE["Db6"], 0.13, 0.35, 69), "pop", 0.0, "the question")
S("cl-bot2", add(pop(NOTE["F5"], 0.16, 0.25, 70) * 0.6, pop(NOTE["Ab5"], 0.14, 0.25, 71)[:int(0.12 * SR)] * 0.3), "pop", 0.0, "the bot answers: yes, tomorrow")
S("cl-type6", typing(0.75, 72, 3300, 5300, (0.035, 0.04)), "ticker", 0.0, "'Hvad koster…': typed", rev=0.08)
S("cl-send4", add(click(5000, 2400, 0.015, 73) * 0.6, whoosh(0.18, 1800, 5000, 2.5, 73, 1.2) * 0.5), "tap", 0.0, "send", rev=0.1)
S("cl-me2", pop(NOTE["Bb5"], 0.13, 0.35, 74), "pop", 0.0, "the second question")
S("cl-bot3", add(pop(NOTE["Eb5"], 0.16, 0.25, 75) * 0.6, pop(NOTE["Bb5"], 0.14, 0.25, 76)[:int(0.12 * SR)] * 0.3), "pop", 0.0, "the bot answers with a bouquet")
S("cl-card2", whoosh(0.3, 900, 2800, 2, 77, 1.2) * 0.8, "appear-rise", 0.12, "the product card")
S("cl-zoom-card", whoosh(0.6, 500, 2200, 1.4, 78, 1.4), "camera", 0.35, "close on the card")
S("cl-order", mclick(79, 5800, 2400), "tap", 0.0, "click: Bestil")
S("cl-ordered", chime(["Db5", "F5", "Ab5", "Db6"], 0.05, 1.1, 0.45, 0.25), "success", 0.0, "Bestilt", rev=0.4)
S("cl-bot4", pop(NOTE["Ab5"], 0.15, 0.3, 80) * 0.8, "pop", 0.0, "the bot: we'll call you")
S("cl-zoomout3", whoosh(0.8, 3000, 400, 1.3, 81, 1.4), "whoosh", 0.3, "out to the builder with the chat open", rev=0.2)
# 54–80.49 s the price, the hosting, the end
S("cl-se", add(swell(0.3, NOTE["F4"], 82) * 0.5, whoosh(0.35, 700, 3000, 1.6, 82, 1.2) * 0.4), "whoosh", 0.25, "'Se resultatet'", rev=0.2)
S("cl-helt", add(thump(110, 55, 0.4, 0.09) * 0.7, pop(NOTE["Bb4"], 0.2, 0.25, 83) * 0.4), "impact", 0.0, "'helt'", rev=0.2)
S("cl-gratis", add(shimmer(0.7, 84, 3000, 9500, 100) * 0.6, chime(["F5", "Bb5"], 0.03, 0.9, 0.35, 0.3) * 0.4), "chime", 0.0, "'gratis'", rev=0.4)
S("cl-foer", whoosh(0.4, 1200, 2800, 2.0, 85, 1.3) * 0.7, "swipe", 0.15, "'før du betaler noget'")
S("cl-click-buy", mclick(86, 5300, 2100), "tap", 0.0, "click: Køb · 499 kr.")
S("cl-buycard", whoosh(0.4, 650, 2600, 1.7, 87, 1.2), "appear-rise", 0.18, "the purchase card")
S("cl-type7", typing(0.75, 88, 3200, 5200, (0.03, 0.035)), "ticker", 0.0, "the preview link: typed", rev=0.08)
S("cl-pay", mclick(89, 5000, 2000), "tap", 0.0, "click: Køb nu")
y = np.zeros(int(1.4 * SR)); place(y, metal(3600, 0.4, 90) * 0.3, 0.0); place(y, chime(["Bb4", "Db5", "F5", "Bb5"], 0.05, 1.1, 0.45, 0.3) * 0.6, 0.03)
S("cl-paid", y, "money", 0.0, "Betalt: 499 kr.", rev=0.4)
S("cl-browser", whoosh(0.9, 3400, 500, 1.3, 91, 1.5), "whoosh", 0.3, "the browser swings out", rev=0.25)
S("cl-shop", add(whoosh(0.7, 300, 1200, 1.0, 92, 1.0) * 0.6, tone(NOTE["F6"], 1.0, ((1, 1), (2.76, 0.4)), d=0.4) * 0.15), "camera", 0.25, "the laptop on the shop's counter", rev=0.4)
S("cl-oplev", swell(0.5, NOTE["Db5"], 93) * 0.8, "riser", 0.5, "'Oplev' blurs in", rev=0.3)
S("cl-hosting", add(chime(["Bb3", "F4", "Bb4", "Db5"], 0.02, 1.4, 0.7, 0.2) * 0.45, shimmer(1.0, 94, 2500, 8000, 60) * 0.4, thump(80, 40, 0.6, 0.2) * 0.4), "impact", 0.0, "'nem hosting'", rev=0.45)
S("cl-toggle", add(click(4400, 1600, 0.03, 95), thump(300, 150, 0.08, 0.02) * 0.3), "tap", 0.0, "click: the hosting switch")
t = t_(0.6); S("cl-glow", add(np.sin(2 * np.pi * np.cumsum(np.linspace(NOTE["F4"], NOTE["F5"], len(t))) / SR) * arc(0.6, 0.5) * 0.35, shimmer(0.6, 96, 3500, 9000, 70, True) * 0.4),
  "appear-rise", 0.15, "the switch glows on", rev=0.35)
S("cl-panel", whoosh(1.0, 3600, 450, 1.3, 97, 1.5), "whoosh", 0.35, "out to the hosting panel", rev=0.2)
S("cl-type8", typing(0.66, 98, 3100, 5000, (0.03, 0.035)), "ticker", 0.0, "the domain: typed", rev=0.08)
S("cl-connect", mclick(99, 4900, 2000, 0.25), "tap", 0.0, "Forbind")
y = np.zeros(int(1.4 * SR))
for k, nn in enumerate(["Db5", "Eb5", "F5", "Ab5"]): place(y, tone(NOTE[nn], 0.3, ((1, 1), (2, 0.25), (3, 0.08)), d=0.08) * 0.5, 0.267 * k)
S("cl-checks", y, "ticker", 0.0, "domain, SSL, hosting, online: checked", rev=0.25)
S("cl-online", chime(["Bb4", "F5", "Bb5", "Db6"], 0.05, 1.2, 0.5, 0.25), "success", 0.0, "the address goes live", rev=0.4)
S("cl-gaa", add(thump(95, 50, 0.45, 0.1) * 0.7, whoosh(0.3, 600, 2000, 1.8, 100, 1.2) * 0.3), "impact", 0.0, "'Gå online'", rev=0.2)
S("cl-move", whoosh(0.4, 2400, 900, 2.0, 101, 1.3), "swipe", 0.2, "the line moves to the corner")
S("cl-domain", pop(NOTE["F5"], 0.18, 0.3, 102) * 0.7, "pop", 0.0, "'med dit eget domæne'")
S("cl-uden", add(pop(NOTE["Db5"], 0.18, 0.3, 103) * 0.5, metal(2800, 0.3, 103) * 0.15), "pop", 0.0, "'uden teknisk bøvl' with the wrench")
S("cl-glow-c", add(tone(NOTE["Bb3"], 2.5, ((1, 1), (1.5, 0.4), (2, 0.3)), d=4) * arc(2.5, 0.7) * 0.4, shimmer(2.0, 104, 2000, 6000, 30) * 0.3), "riser", 0.6, "the warm glow of the mark", rev=0.5)
S("cl-starter", pop(NOTE["Ab5"], 0.18, 0.25, 105) * 0.6, "pop", 0.0, "'Din hjemmeside starter her'")
S("cl-skabe", add(chime(["Db5", "F5", "Ab5"], 0.12, 1.2, 0.5, 0.25) * 0.5, whoosh(0.4, 900, 2600, 1.8, 106, 1.3) * 0.3), "chime", 0.0, "'Hvad vil du skabe?'", rev=0.45)
S("cl-mark", add(swell(0.4, NOTE["Bb4"], 107) * 0.6, thump(80, 40, 0.5, 0.15) * 0.5), "impact", 0.4, "the gradient mark", rev=0.4)
S("cl-wordmark", add(shimmer(0.8, 108, 3000, 9000, 70, True) * 0.5, chime(["Bb4", "Db5", "F5", "Bb5", "F6"], 0.04, 2.0, 0.9, 0.25) * 0.5), "success", 0.0, "Creoble.", rev=0.55)
S("cl-url", add(click(5600, 2600, 0.008, 109) * 0.5, blip(NOTE["Bb5"], 0.12, 0.2) * 0.3), "tap", 0.0, "creoble.dk", rev=0.2)

idx_path = "lib/sfx/index.json"
idx = [x for x in (json.load(open(idx_path)) if os.path.exists(idx_path) else []) if not x["id"].startswith("cl-")]
json.dump(idx + items, open(idx_path, "w"), indent=1)
print(len(items), "sounds")
