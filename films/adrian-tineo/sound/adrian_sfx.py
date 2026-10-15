# The Adrian Tineo film's own sound effects: calm, precise, premium (the site's restraint): soft UI ticks, glass and chrome
# touches, paper slides for the card morphs, a low soft landing for the dark panel. Every cue gets its own sound, used once.
# Tonal sounds sit in the music's key (Digital Clouds measures between A-flat major and C minor: A-flat major pentatonic,
# Ab Bb C Eb F, fits both). Generated with numpy, royalty-free.
#   python3 adrian_sfx.py   -> lib/sfx/adrian/*.wav and lib/sfx/index.json
import json, os, numpy as np, wave
from scipy.signal import lfilter, fftconvolve
SR = 48000
rng = np.random.default_rng(23)
OUT = "lib/sfx/adrian"
os.makedirs(OUT, exist_ok=True)
PC = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
def N(s):  # "Ab4" -> Hz
    return 440.0 * 2 ** ((12 * (int(s[-1]) + 1) + PC[s[:-1]] - 69) / 12)

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
    items.append({"id": id, "file": f"sfx/adrian/{id}.wav", "category": cat, "sync": sync, "length": round(len(st) / SR, 3),
                  "licence": "generated", "source": "generated for the Adrian Tineo film (adrian_sfx.py), royalty-free", "character": note})


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

def glass(f, n=0.9, seed=0, bright=1.0):
    # a fingertip on glass: a clean partial and two quiet inharmonic ones
    r = np.random.default_rng(seed); t = t_(n)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.45) + 0.28 * bright * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.12) \
        + 0.12 * bright * np.sin(2 * np.pi * f * 5.4 * (1 + 0.001 * r.standard_normal()) * t) * np.exp(-t / 0.05)
    return y * np.minimum(1, t / 0.002)
def felt(f, n=0.8, d=0.3):
    # a felt mallet on a soft key: warm, rounded, short attack
    t = t_(n); y = tone(f, n, ((1, 1.0), (2, 0.18), (4, 0.04)), d=d, a=0.006)
    return lp(y, 2600)
def air(n, f0, f1, seed=0, q=0.8, p=1.2):
    # moving air for slides and drops: band noise sweeping f0 -> f1 in an arc
    return sweep_noise(n, f0, f1, q, seed) * arc(n, p)
def glide(f0, f1, n=0.8):
    t = t_(n); ph = 2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (t / n)) / SR
    return np.sin(ph) * arc(n, 1.5)

# --- 1 AI is everywhere
save("at-shell", air(1.2, 300, 900, 1, 0.7, 1.6) * 0.7, "whoosh", 0.6, "the site shell rises out of the dark field: a soft low swell of air", rev=0.25)
y = np.zeros(int(1.2 * SR)); place(y, click(5200, 2400, 0.012, 2) * 0.35, 0); place(y, glass(N("Ab5"), 1.1, 3) * 0.6, 0.004)
save("at-ai", y, "pop", 0.0, "the first tag, AI: a fingertip tap on glass, A-flat", rev=0.28)
y = np.zeros(int(1.6 * SR))
for i, nm in enumerate(["Ab5", "Bb5", "C6", "Eb6", "F6", "Ab6", "Bb6", "C7"]):
    place(y, add(click(4400 + 300 * i, 1900, 0.01, 10 + i) * 0.18, tone(N(nm), 0.25, ((1, 1),), d=0.07) * 0.22), 0.1 * i)
save("at-bloom", y, "data", 0.0, "eight tags bloom out across the frame: a quick rising run of tiny glass notes", rev=0.3)
y = add(paper(0.5, 1800, 700, 4) * 0.5, np.concatenate([np.zeros(int(0.32 * SR)), felt(N("Eb4"), 0.6, 0.18) * 0.35]))
save("at-card", y, "appear-rise", 0.32, "the Your business card rises and settles: a paper slide into a soft low note", rev=0.18)
# --- 2 it gets complicated
y = np.zeros(int(1.6 * SR))
for i in range(9):
    place(y, click(3000 + 1600 * rng.random(), 1400 + 600 * rng.random(), 0.016, 30 + i) * (0.3 + 0.04 * i), 0.07 * i + 0.02 * rng.random())
place(y, chord([N("Ab4"), N("Bb4"), N("C5")], 1.1, a=0.35, d=0.5) * 0.12, 0.15)
save("at-pile", y, "data", 0.2, "the tags crowd onto the card: clustered ticks over a close, slightly crowded chord", rev=0.2)
y = np.zeros(int(1.4 * SR))
for i in range(6):
    place(y, hp(sweep_noise(0.32, 2600 + 400 * i, 1200 + 300 * i, 4.0, 40 + i), 900) * arc(0.32, 0.7) * 0.4, 0.1 * i)
save("at-tangle", y, "swipe", 0.1, "hairlines tangle between them: six quick pencil scribbles", rev=0.12)
y = add(thump(90, 48, 0.6, 0.16) * 0.7, np.concatenate([np.zeros(int(0.02 * SR)), chord([N("Ab3"), N("Bb3"), N("Eb4")], 1.0, a=0.02, d=0.45) * 0.18]))
save("at-complicated", y, "impact", 0.0, "the card tilts under the weight: a soft low thud and a crowded chord", rev=0.25)
# --- 3 meet Adrian
y = air(0.7, 1600, 400, 50, 0.9, 0.8) * 0.8
for i in range(5): place(y, click(2600 - 200 * i, 1200, 0.014, 60 + i) * 0.15, 0.12 + 0.07 * i)
save("at-drop", y, "dismiss-fall", 0.25, "the pile drops away: falling air and a few ticks fading down", rev=0.2)
y = chord([N("Ab3"), N("Eb4"), N("C5"), N("Bb5")], 2.4, a=0.35, d=1.4) * 0.5
place(y, glass(N("Eb6"), 1.6, 70) * 0.18, 0.3)
save("at-portrait", y, "stinger", 0.35, "the card opens into Adrian's portrait: a warm A-flat add-9 bloom", rev=0.35)
save("at-name", add(pluck(N("Ab4"), 0.9, 0.35, 71) * 0.6, click(3800, 1700, 0.02, 72) * 0.12), "pop", 0.0, "his name rises: one plucked A-flat", rev=0.25)
y = np.zeros(int(0.6 * SR)); place(y, click(4600, 2000, 0.015, 80) * 0.3, 0); place(y, click(4100, 1800, 0.015, 81) * 0.25, 0.27)
save("at-independent", y, "tap", 0.0, "the grey line, Independent / AI expert: two soft ticks, one per line", rev=0.12)
save("at-handson", glass(N("C6"), 0.9, 90) * 0.7, "chime", 0.0, "the tag Business-minded, hands-on: a light glass C", rev=0.25)
# --- 4 from opportunity to solution
save("at-morph1", add(paper(0.6, 2600, 900, 100) * 0.6, air(0.6, 500, 1200, 101, 0.8) * 0.3), "swipe", 0.3, "the portrait card slides into the opportunity card: a long paper slide", rev=0.15, pan=-0.2)
save("at-direction", add(glass(N("Eb6"), 0.8, 110) * 0.6, click(5200, 2300, 0.01, 111) * 0.2), "chime", 0.0, "A clear direction: a bright glass E-flat", rev=0.25)
save("at-arrow", glide(N("Ab4"), N("Eb5"), 0.85) * 0.35 + air(0.85, 900, 2400, 120, 1.2, 1.0) * 0.25, "appear-rise", 0.6, "the arrow draws from opportunity to solution: a soft rising glide", rev=0.2, pan=0.15)
y = add(pluck(N("F4"), 1.0, 0.4, 130) * 0.45, np.concatenate([np.zeros(int(0.06 * SR)), pluck(N("C5"), 0.9, 0.4, 131) * 0.4]), paper(0.35, 2000, 900, 132) * 0.25)
save("at-solution", y, "appear-rise", 0.0, "the solution card buds out: two plucked notes, F and C", rev=0.25, pan=0.25)
y = add(glass(N("Bb5"), 0.9, 140, 0.7) * 0.55, thump(140, 90, 0.25, 0.05) * 0.25)
save("at-advantage", y, "chime", 0.0, "A real-world advantage (the dark tile): a deeper glass B-flat with a small body", rev=0.25, pan=0.3)
# --- 5 strategy, engineering, execution
y = np.zeros(int(1.0 * SR)); place(y, paper(0.4, 2200, 800, 150) * 0.45, 0); place(y, paper(0.4, 2000, 700, 151) * 0.4, 0.18)
save("at-three", y, "swipe", 0.2, "the cards make room for a third: two quick paper slides", rev=0.15)
save("at-connect", glide(N("Eb4"), N("Ab5"), 1.1) * 0.3 + air(1.1, 700, 1800, 160, 1.4) * 0.12, "appear-rise", 0.7, "the connecting rule draws: a smooth sine rising over a second", rev=0.25)
save("at-strategy", add(felt(N("Ab5"), 0.9, 0.35) * 0.6, click(4800, 2000, 0.01, 170) * 0.12), "chime", 0.0, "strategy: its dot turns sage, a felt A-flat", rev=0.3, pan=-0.35)
save("at-engineering", add(felt(N("C6"), 0.9, 0.33) * 0.6, click(5000, 2100, 0.01, 171) * 0.12), "chime", 0.0, "engineering: a felt C", rev=0.3)
save("at-execution", add(felt(N("Eb6"), 1.0, 0.4) * 0.6, glass(N("Eb6"), 0.9, 172, 0.5) * 0.2), "success", 0.0, "execution: a felt E-flat with a glass edge, the run completes", rev=0.32, pan=0.35)
# --- 6 the four services
y = np.zeros(int(1.4 * SR))
for i in range(3): place(y, paper(0.35, 2300 - 200 * i, 800, 180 + i) * 0.35, 0.08 * i)
place(y, add(paper(0.4, 1900, 700, 184) * 0.4, felt(N("Ab4"), 0.6, 0.2) * 0.25), 0.55)
save("at-grid", y, "swipe", 0.1, "three cards become the four-card grid: a shuffle of slides, the fourth lands", rev=0.18)
for nm, nt, pan, sd in [("at-lift1", "F5", -0.45, 190), ("at-lift2", "Ab5", -0.15, 191), ("at-lift3", "Bb5", 0.15, 192), ("at-lift4", "C6", 0.45, 193)]:
    y = add(felt(N(nt), 0.8, 0.28) * 0.5, click(5600, 2600, 0.008, sd) * 0.14, air(0.25, 2400, 3600, sd, 1.5, 0.6) * 0.08)
    save(nm, y, "tap", 0.0, f"service card lifts (the site's hover): a felt {nt[:-1]} under a tiny tick", rev=0.25, pan=pan)
save("at-team", add(glass(N("F6"), 0.9, 200) * 0.5, glass(N("C6"), 0.9, 201) * 0.25), "chime", 0.0, "Expertise, when you need it: two glass notes, F over C", rev=0.3, pan=0.4)
# --- 7 no hype, no guesswork, practical AI
save("at-clear", air(0.8, 1400, 350, 210, 0.9, 0.9) * 0.7, "dismiss-fall", 0.3, "the cards drop away: a falling breath of air", rev=0.2)
y = add(thump(70, 40, 0.8, 0.2) * 0.8, felt(N("Ab3"), 1.2, 0.5) * 0.3)
save("at-nohype", y, "impact", 0.0, "No hype.: a clean low statement, a soft sub thud under an A-flat", rev=0.3)
y = add(thump(82, 46, 0.7, 0.17) * 0.65, felt(N("Eb4"), 1.1, 0.45) * 0.3)
save("at-noguess", y, "impact", 0.0, "No guesswork.: the answer, a fifth higher", rev=0.3)
save("at-left", add(air(0.6, 600, 1500, 220, 0.9, 1.1) * 0.6, paper(0.4, 1600, 800, 221) * 0.2), "whoosh", 0.3, "the statement steps to the left: a soft slide", rev=0.18, pan=-0.3)
y = np.zeros(int(1.6 * SR))
for i, nm in enumerate(["Eb6", "Ab6", "C7"]): place(y, glass(N(nm), 1.2, 230 + i, 0.6) * (0.35 - 0.06 * i), 0.05 * i)
save("at-orb", y, "appear-rise", 0.0, "the chrome orb, AI at the core: a small crystalline shimmer", rev=0.4, pan=0.3)
for nm, f, dly, sd in [("at-base", 95, "the dark glass base rises", 240), ("at-mid", 120, "the silver slab rises onto it", 241), ("at-top", 150, "the top slab settles over the core", 242)]:
    y = add(thump(f, f * 0.55, 0.45, 0.09) * 0.55, metal(1800 + 4 * f, 0.4, sd) * 0.1, glass(N({"at-base": "Ab4", "at-mid": "C5", "at-top": "Eb5"}[nm]), 0.8, sd, 0.4) * 0.22)
    save(nm, y, "impact", 0.0, dly + ": a soft weighted landing with a chrome edge", rev=0.28, pan=0.35)
save("at-tag3", add(glass(N("Ab6"), 0.7, 250) * 0.4, click(5400, 2400, 0.01, 251) * 0.15), "chime", 0.0, "A clear direction returns: a high glass A-flat", rev=0.25, pan=0.1)
save("at-tag4", add(glass(N("F5"), 0.8, 252, 0.7) * 0.45, thump(160, 100, 0.2, 0.04) * 0.2), "chime", 0.0, "A real-world advantage returns: a glass F with a small body", rev=0.25, pan=0.4)
# --- 8 the dark panel, Let's talk
y = add(air(1.0, 250, 900, 260, 0.7, 1.4) * 0.55, np.concatenate([np.zeros(int(0.62 * SR)), thump(60, 34, 0.9, 0.25) * 0.75]))
save("at-panel", y, "whoosh", 0.62, "the dark contact panel rises over the page and lands: deep air into a low soft landing", rev=0.3)
save("at-potential", add(felt(N("C5"), 1.2, 0.5) * 0.5, chord([N("Ab3"), N("Eb4")], 1.4, a=0.2, d=0.8) * 0.15), "chime", 0.0, "AI potential.: a felt C over a low A-flat fifth", rev=0.35)
save("at-impact", add(felt(N("Eb5"), 1.4, 0.6) * 0.5, chord([N("Bb3"), N("F4")], 1.6, a=0.2, d=0.9) * 0.16), "success", 0.0, "Business impact.: a felt E-flat over B-flat, the line resolves upward", rev=0.35)
save("at-button", add(click(3600, 1600, 0.02, 270) * 0.3, felt(N("Ab5"), 0.5, 0.15) * 0.2), "pop", 0.0, "the Let's talk button appears: a soft pop", rev=0.2, pan=-0.2)
y = np.zeros(int(0.4 * SR)); place(y, click(6000, 2800, 0.018, 280) * 0.6, 0); place(y, click(3400, 1500, 0.012, 281) * 0.35, 0.09)
save("at-click", y, "tap", 0.0, "the button pressed on talk: a crisp two-part UI click", rev=0.1, pan=-0.2)
# --- 9 the sign-off
y = chord([N("Ab3"), N("Eb4"), N("C5"), N("Eb5")], 2.6, a=0.3, d=1.6) * 0.45; place(y, glass(N("Ab6"), 1.8, 290, 0.5) * 0.15, 0.25)
save("at-wordmark", y, "stinger", 0.3, "the wordmark: a resolved A-flat chord", rev=0.4)
save("at-dot", add(glass(N("C7"), 0.6, 300, 0.4) * 0.35, click(6200, 3000, 0.006, 301) * 0.2), "tap", 0.0, "the wordmark's dot lands: the smallest glass tap", rev=0.3)

os.makedirs("lib", exist_ok=True)
json.dump(items, open("lib/sfx/index.json", "w"), indent=1, ensure_ascii=False)
print(len(items), "sounds")
