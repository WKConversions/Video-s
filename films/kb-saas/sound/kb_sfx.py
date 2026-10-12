# The K.B film's own sound effects: every cue gets its own sound, made for its moment, so nothing is heard twice
# (Karl, 12 Oct: "be more unique with the sound effects ... too much a pattern"). Tonal sounds sit in the music's key
# (Cat Walk measures E minor / G major: E G A B D). Generated with numpy, royalty-free.
#   python3 kb_sfx.py   -> lib/sfx/kb/*.wav and their entries in lib/sfx/index.json
import json, os, numpy as np, wave
from scipy.signal import lfilter, fftconvolve
SR = 48000
rng = np.random.default_rng(7)
OUT = "lib/sfx/kb"
os.makedirs(OUT, exist_ok=True)
NOTE = {"E4": 329.63, "G4": 392.0, "A4": 440.0, "B4": 493.88, "D5": 587.33, "E5": 659.25, "G5": 783.99, "A5": 880.0, "B5": 987.77,
        "D6": 1174.66, "E6": 1318.51, "G6": 1567.98, "E3": 164.81, "B3": 246.94, "G3": 196.0, "E2": 82.41, "B2": 123.47}

def t_(n): return np.arange(int(n * SR)) / SR
def env(n, a=0.003, d=0.3):
    t = t_(n); return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)
def bp(x, fc, q=4.0):
    # biquad band-pass
    w = 2 * np.pi * fc / SR; al = np.sin(w) / (2 * q)
    b0, b1, b2, a0, a1, a2 = al, 0, -al, 1 + al, -2 * np.cos(w), 1 - al
    return lfilter([b0 / a0, b1 / a0, b2 / a0], [1, a1 / a0, a2 / a0], x)
def sweep_noise(n, f0, f1, q=3.0, seed=0):
    r = np.random.default_rng(seed); x = r.standard_normal(int(n * SR)); out = np.zeros_like(x)
    seg = 256
    for s in range(0, len(x), seg):
        fc = f0 * (f1 / f0) ** (s / len(x)); out[s:s + seg] = bp(x[s:s + seg + 0], fc, q)[:len(x[s:s + seg])]
    return out
def tone(f, n, partials=((1, 1.0), (2, 0.35), (3, 0.12)), d=0.4, a=0.004, detune=0.0):
    t = t_(n); y = np.zeros_like(t)
    for k, amp in partials:
        y += amp * np.sin(2 * np.pi * f * k * (1 + detune * (k - 1)) * t) * np.exp(-t * k / d)
    return y * np.minimum(1, t / a)
def pluck(f, n=0.6, bright=0.5, seed=0):
    # Karplus–Strong: a soft plucked string
    r = np.random.default_rng(seed); N = int(SR / f); buf = r.uniform(-1, 1, N); out = np.zeros(int(n * SR))
    for i in range(len(out)):
        out[i] = buf[i % N]; buf[i % N] = 0.5 * (buf[i % N] + buf[(i + 1) % N]) * (0.994 + 0.004 * bright)
    return lp(out, 2500 + 5000 * bright)
def click(hi=4200, lo=1800, gap=0.028, seed=0):
    r = np.random.default_rng(seed); n = 0.09; x = np.zeros(int(n * SR))
    for k, (fc, at, g) in enumerate([(hi, 0.0, 1.0), (lo, gap, 0.6)]):
        b = r.standard_normal(int(0.012 * SR)) * np.exp(-np.arange(int(0.012 * SR)) / (0.0025 * SR))
        b = bp(b, fc, 2.5) * g; s = int(at * SR); x[s:s + len(b)] += b
    return x
def thump(f0=110, f1=45, n=0.5):
    t = t_(n); ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t / 0.05)) / SR
    return np.sin(ph) * np.exp(-t / 0.12) * np.minimum(1, t / 0.002)
def chord(freqs, n=1.6, a=0.25, d=0.9, saw=False):
    t = t_(n); y = np.zeros_like(t)
    for f in freqs:
        for dt in (-0.004, 0.0, 0.004):
            ff = f * (1 + dt)
            y += (2 * ((ff * t) % 1) - 1 if saw else np.sin(2 * np.pi * ff * t)) / 3
    e = np.minimum(1, t / a) * np.exp(-np.maximum(0, t - a) / d)
    return (lp(y, 2600) if saw else y) * e
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
    path = f"{OUT}/{id}.wav"
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())
    items.append({"id": id, "file": f"sfx/kb/{id}.wav", "category": cat, "sync": sync, "length": round(len(st) / SR, 3),
                  "licence": "generated", "source": "generated for the K.B film (kb_sfx.py), royalty-free", "character": note})

# --- the hook
y = np.zeros(int(2.4 * SR)); place(y, chord([NOTE["E3"], NOTE["B3"], NOTE["G4"]], 2.2, a=0.9, d=0.8, saw=True) * 0.6, 0)
place(y, sweep_noise(2.0, 300, 1400, 2.0, 3) * 0.08 * np.minimum(1, t_(2.0) / 1.2), 0.1)
save("kb-air-open", y, "riser", 0.6, "a soft E-minor air that opens the film under 'One business.'", rev=0.3)
y = np.zeros(int(0.9 * SR))
for i, n in enumerate(["E5", "G5", "B5", "A5", "D6", "E6", "G5", "B5"]):
    place(y, tone(NOTE[n], 0.25, ((1, 1), (2.76, 0.2)), d=0.09) * (0.55 + 0.05 * i), i * 0.1)
save("kb-chips-cascade", y, "pop", 0.0, "eight tiny wooden notes as the tool chips settle around the business")
w = sweep_noise(0.55, 900, 300, 2.2, 5) * np.sin(np.pi * np.clip(t_(0.55) / 0.55, 0, 1)) ** 2
save("kb-air-away", w, "whoosh", 0.3, "a low soft air as the words ease away and the tools line up")
y = np.zeros(int(2.0 * SR)); tt = 0.0; k = 0
while tt < 1.85:
    b = rng.standard_normal(int(0.02 * SR)) * np.exp(-np.arange(int(0.02 * SR)) / (0.004 * SR))
    place(y, bp(b, 1400 + 900 * rng.random(), 3) * (0.4 + 0.5 * tt / 1.85), tt); tt += 0.26 - 0.17 * (tt / 1.85); k += 1
save("kb-tasks-flutter", y, "data", 0.0, "soft paper flicks, denser and denser, as the tasks pile up", rev=0.12)
y = np.zeros(int(0.7 * SR))
for i in range(7):
    f0 = 900 + 120 * i; c = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f0 * 1.6, int(0.05 * SR))) / SR) * np.hanning(int(0.05 * SR))
    place(y, c * 0.5, i * 0.07)
save("kb-links-chirp", y, "data", 0.0, "fast upward chirps as the dashed links draw", rev=0.1)
# --- the question
w = sweep_noise(0.45, 250, 900, 2.0, 9) * np.sin(np.pi * np.clip(t_(0.45) / 0.45, 0, 1))
save("kb-bar-rise", w, "appear-rise", 0.3, "the prompt bar rises into place", rev=0.15)
y = np.zeros(int(1.3 * SR)); tt = 0.02
while tt < 1.15:
    place(y, click(3400 + 1600 * rng.random(), 1500 + 600 * rng.random(), 0.012, int(tt * 1000)) * (0.5 + 0.3 * rng.random()), tt)
    tt += 0.045 + 0.06 * rng.random()
save("kb-keys", y, "ticker", 0.0, "the question typed: a natural run of keys", rev=0.08)
y = np.zeros(int(0.9 * SR))
for i, n in enumerate(["B4", "D5", "E5", "G5"]): place(y, pluck(NOTE[n], 0.6, 0.4, i) * 0.6, i * 0.1)
save("kb-fan-in", y, "chime", 0.0, "four plucked notes as the tools' lines reach the question")
y = add(tone(NOTE["E6"], 1.2, ((1, 1), (1.5, 0.4), (2, 0.25)), d=0.5) * 0.4, tone(NOTE["B5"], 1.2, ((1, 1),), d=0.5) * 0.4)
save("kb-glow", y, "stinger", 0.02, "a glassy glow as the lines turn solid on 'together'", rev=0.35)
save("kb-click-send", click(4600, 2000, 0.03, 11), "tap", 0.0, "the send click (crisp)", rev=0.05)
w = sweep_noise(0.35, 600, 4200, 2.5, 13) * np.sin(np.pi * np.clip(t_(0.35) / 0.35, 0, 1)) ** 1.5
save("kb-send", w, "swipe", 0.25, "the question leaves, an upward swish", rev=0.12)
y = np.zeros(int(2.6 * SR)); place(y, thump(95, 42, 0.6) * 0.8, 0.0)
place(y, chord([NOTE["E4"], NOTE["G4"], NOTE["B4"], NOTE["E5"]], 2.4, a=0.04, d=0.9) * 0.5, 0.0)
save("kb-reveal", y, "impact", 0.0, "Meet K.B: a warm E-minor bloom over a soft landing", rev=0.35)
y = np.zeros(int(1.0 * SR)); place(y, sweep_noise(0.9, 500, 1200, 2.0, 15) * 0.25 * np.hanning(int(0.9 * SR)), 0)
place(y, tone(NOTE["G5"], 0.3, d=0.08) * 0.5, 0.05); place(y, tone(NOTE["B5"], 0.3, d=0.08) * 0.5, 0.65)
save("kb-pill-open", y, "swipe", 0.05, "the pill widens: 'Tech', then 'Partner'", rev=0.15)
# --- built around your business
save("kb-click-pill", click(3000, 1300, 0.024, 17), "tap", 0.0, "the pill is clicked (rounder)", rev=0.05)
y = add(sweep_noise(0.8, 200, 600, 1.6, 19) * np.sin(np.pi * np.clip(t_(0.8) / 0.8, 0, 1)) * 0.8, chord([NOTE["B3"]], 0.8, a=0.2, d=0.4) * 0.3)
save("kb-card-bloom", y, "appear-rise", 0.25, "the workspace grows around the tasks", rev=0.25)
save("kb-note-business", pluck(NOTE["B5"], 0.7, 0.6, 21), "pop", 0.0, "'Your business' lands")
# --- connect
w = sweep_noise(0.3, 400, 1600, 2.2, 23) * np.hanning(int(0.3 * SR))
save("kb-lift", w, "whoosh", 0.15, "CRM updates lifts out", rev=0.1)
y = np.zeros(int(1.0 * SR)); z = sweep_noise(0.35, 700, 3800, 6.0, 25) * np.linspace(0.3, 1, int(0.35 * SR)); place(y, z * 0.5, 0)
place(y, tone(NOTE["E5"], 0.5, d=0.15) * 0.5, 0.42); place(y, tone(NOTE["B5"], 0.5, d=0.2) * 0.5, 0.5)
save("kb-connect", y, "success", 0.42, "the link is drawn like a zip, then 'Connected'", rev=0.2)
y = np.zeros(int(1.0 * SR))
for i in range(4): place(y, tone(1800 + 260 * i, 0.08, ((1, 1),), d=0.025) * 0.5, i * 0.33)
save("kb-data", y, "data", 0.0, "data capsules crossing", rev=0.12, pan=0.2)
# --- automate
y = np.zeros(int(0.5 * SR)); place(y, tone(NOTE["D6"], 0.2, d=0.05) * 0.5, 0); place(y, tone(NOTE["A5"], 0.25, d=0.07) * 0.5, 0.07)
save("kb-message", y, "pop", 0.0, "the request message arrives", rev=0.15)
y = np.zeros(int(0.4 * SR)); place(y, click(2600, 900, 0.05, 27), 0); place(y, tone(NOTE["G5"], 0.15, d=0.04) * 0.35, 0.06)
save("kb-toggle", y, "tap", 0.0, "the workflow switches on", rev=0.08)
y = np.zeros(int(1.0 * SR))
for i, f in enumerate([700, 880, 1050]):
    b = bp(rng.standard_normal(int(0.03 * SR)) * np.exp(-np.arange(int(0.03 * SR)) / 300), f, 12) * 0.9; place(y, b, i * 0.4)
save("kb-run", y, "ticker", 0.0, "woodblock ticks as the workflow runs its steps", rev=0.1)
# --- simplify operations
y = np.zeros(int(0.8 * SR)); z = sweep_noise(0.55, 1500, 400, 2.0, 29) * np.linspace(0, 1, int(0.55 * SR)) ** 2; place(y, z * 0.6, 0)
place(y, thump(160, 90, 0.2) * 0.4, 0.55)
save("kb-gather", y, "whoosh", 0.55, "everything gathers into one deck", rev=0.15)
y = add(chord([NOTE["G4"], NOTE["B4"], NOTE["D5"]], 1.2, a=0.01, d=0.35) * 0.5, tone(NOTE["G5"], 1.0, d=0.3) * 0.3)
save("kb-ops", y, "success", 0.0, "Operations: one line, a bright G chord", rev=0.25)
# --- the agent and the software
w = sweep_noise(0.5, 1200, 350, 2.0, 31) * np.sin(np.pi * np.clip(t_(0.5) / 0.5, 0, 1))
save("kb-panel-open", w, "swipe", 0.25, "the line opens into the agent panel", rev=0.15)
y = np.zeros(int(0.8 * SR))
for i in range(14): place(y, tone(2400 + 600 * rng.random(), 0.05, ((1, 1),), d=0.015) * 0.25 * (1 - i / 16), 0.05 * i)
save("kb-agent-work", y, "data", 0.0, "a soft glitter while the agent works", rev=0.3)
y = np.zeros(int(0.5 * SR))
for i in range(6): place(y, click(5200, 2600, 0.008, 33 + i) * 0.5, 0.045 * i)
save("kb-stream", y, "ticker", 0.0, "the reply streams in", rev=0.08)
y = np.zeros(int(1.0 * SR)); place(y, pluck(NOTE["E5"], 0.6, 0.5, 35) * 0.6, 0); place(y, pluck(NOTE["A5"], 0.7, 0.5, 36) * 0.6, 0.09)
save("kb-done", y, "chime", 0.0, "Done", rev=0.2)
y = np.zeros(int(0.7 * SR)); place(y, sweep_noise(0.5, 300, 1100, 2.0, 37) * np.hanning(int(0.5 * SR)) * 0.6, 0); place(y, thump(130, 70, 0.3) * 0.35, 0.42)
save("kb-dash-rise", y, "appear-rise", 0.42, "the dashboard rises", rev=0.15)
y = np.zeros(int(1.4 * SR))
for i, n in enumerate(["E6", "G6", "B5", "E6", "D6"]): place(y, tone(NOTE[n], 0.5, ((1, 1), (3, 0.1)), d=0.12) * 0.3, 0.08 * i)
save("kb-develop", y, "stinger", 0.0, "the dashboard develops into true colour", rev=0.4)
# --- everything works together
w = sweep_noise(0.5, 2500, 500, 2.0, 39) * np.sin(np.pi * np.clip(t_(0.5) / 0.5, 0, 1)) ** 2
save("kb-zoom-out", w, "whoosh", 0.3, "the dashboard zooms out into the stack", rev=0.15)
y = np.zeros(int(0.4 * SR))
for i in range(4): place(y, click(3800 - 400 * i, 1600, 0.01, 41 + i) * 0.5, 0.035 * i)
save("kb-rewrite", y, "ticker", 0.0, "the question rewrites itself", rev=0.08)
y = np.zeros(int(2.6 * SR)); place(y, thump(80, 38, 0.8) * 0.7, 0)
place(y, chord([NOTE["E3"], NOTE["B3"], NOTE["E4"], NOTE["G4"], NOTE["B4"]], 2.4, a=0.08, d=1.0) * 0.55, 0)
save("kb-flood", y, "impact", 0.0, "the answer floods cyan: the film's biggest chord", rev=0.4)
# --- diagnose, build, run
y = np.zeros(int(1.5 * SR)); z = sweep_noise(1.3, 400, 3000, 8.0, 43) * np.sin(np.pi * np.clip(t_(1.3) / 1.3, 0, 1)) * 0.6; place(y, z, 0)
st = stereo(y); save("kb-scan", y, "riser", 1.25, "the scan sweeps the business", rev=0.2)
y = np.zeros(int(0.6 * SR)); place(y, tone(NOTE["E4"] * 1.06, 0.2, ((1, 1), (2, 0.5)), d=0.05) * 0.5, 0); place(y, tone(NOTE["E4"] * 1.06, 0.2, ((1, 1), (2, 0.5)), d=0.05) * 0.5, 0.17)
save("kb-friction", y, "pop", 0.0, "two muted knocks: Friction", rev=0.1)
save("kb-click-kb", click(3800, 1700, 0.022, 45), "tap", 0.0, "the K.B cursor clicks", rev=0.05, pan=0.25)
save("kb-auto-1", pluck(NOTE["G5"], 0.6, 0.5, 47), "success", 0.0, "a step automated")
save("kb-click-team", click(3200, 1450, 0.034, 49), "tap", 0.0, "your team clicks", rev=0.05, pan=-0.25)
save("kb-auto-2", pluck(NOTE["B5"], 0.6, 0.5, 51), "success", 0.0, "a second step automated")
y = np.zeros(int(1.0 * SR))
for i, n in enumerate(["E5", "G5", "B5", "E6"]): place(y, pluck(NOTE[n], 0.5, 0.6, 53 + i) * 0.55, 0.075 * i)
save("kb-run-all", y, "success", 0.0, "every step runs", rev=0.2)
y = np.zeros(int(1.2 * SR))
for i in range(3): place(y, add(thump(70, 55, 0.18) * 0.5, tone(1300, 0.06, ((1, 1),), d=0.02) * 0.15), 0.4 * i)
save("kb-monitor", y, "data", 0.0, "a soft heartbeat: uptime and monitoring", rev=0.15)
# --- no unnecessary complexity
y = np.zeros(int(0.6 * SR))
for i in range(6): place(y, bp(rng.standard_normal(int(0.025 * SR)) * np.exp(-np.arange(int(0.025 * SR)) / 250), 2200 - 180 * i, 4) * 0.6, 0.09 * i)
save("kb-unfold", y, "ticker", 0.0, "the maintenance rows unfold", rev=0.1)
y = np.zeros(int(0.6 * SR))
for i in range(6): place(y, tone(NOTE["E5"] * (1 + 0.06 * i), 0.08, ((1, 1),), d=0.02) * 0.35, 0.09 * i)
save("kb-handled", y, "data", 0.0, "K.B takes each one", rev=0.12)
y = np.zeros(int(0.9 * SR)); z = sweep_noise(0.6, 500, 1800, 2.0, 55) * np.linspace(0, 1, int(0.6 * SR)) ** 2; place(y, z * 0.6, 0); place(y, thump(140, 80, 0.2) * 0.35, 0.6)
save("kb-fold", y, "whoosh", 0.6, "it folds away behind the card", rev=0.15)
save("kb-settle", add(thump(120, 60, 0.4) * 0.8, tone(NOTE["B4"], 0.4, d=0.1) * 0.25), "impact", 0.0, "the card settles into your business", rev=0.15)
# --- the claim, manual work, time to grow
y = chord([NOTE["E4"], NOTE["B4"], NOTE["D5"]], 1.8, a=0.35, d=0.9, saw=True) * 0.5
save("kb-claim", y, "riser", 0.35, "a warm swell as the business comes back behind the claim", rev=0.35)
save("kb-you", add(pluck(NOTE["E6"], 0.9, 0.7, 57) * 0.8, tone(NOTE["E6"], 0.6, d=0.2) * 0.2), "chime", 0.0, "'you'", rev=0.25)
w = sweep_noise(0.4, 350, 1500, 2.0, 59) * np.sin(np.pi * np.clip(t_(0.4) / 0.4, 0, 1))
save("kb-card-rise", w, "appear-rise", 0.25, "the Manual work card rises", rev=0.12)
y = np.zeros(int(1.2 * SR))
for i, (n, at) in enumerate(zip(["E5", "G5", "A5", "B5", "D6"], [0, 0.2, 0.26, 0.49, 0.68])):
    place(y, add(tone(NOTE[n], 0.3, ((1, 1), (2.4, 0.2)), d=0.08) * 0.5, click(5000, 2500, 0.006, 61 + i) * 0.15), at)
save("kb-checklist", y, "ticker", 0.0, "the manual tasks check off, one note each", rev=0.15)
y = np.zeros(int(1.6 * SR))
for i, n in enumerate(["G5", "B5", "E6"]): place(y, tone(NOTE[n], 1.2, ((1, 1), (2, 0.3)), d=0.4) * 0.4, 0.12 * i)
save("kb-grow", y, "success", 0.0, "Time to grow: three rising notes", rev=0.35)
w = sweep_noise(0.45, 1800, 600, 2.0, 63) * np.sin(np.pi * np.clip(t_(0.45) / 0.45, 0, 1)) ** 2
save("kb-exit", w, "whoosh", 0.3, "the card leaves for the sign-off", rev=0.15)
y = np.zeros(int(3.2 * SR)); place(y, thump(90, 40, 0.7) * 0.6, 0)
place(y, chord([NOTE["E4"], NOTE["G4"], NOTE["B4"], NOTE["D5"], NOTE["E5"]], 3.0, a=0.02, d=1.4) * 0.45, 0)
place(y, tone(NOTE["E6"], 2.0, ((1, 1), (2, 0.2)), d=0.8) * 0.15, 0.05)
save("kb-final", y, "impact", 0.0, "K.B: the closing chord", rev=0.45)

idx_path = "lib/sfx/index.json"
idx = [x for x in json.load(open(idx_path)) if not x["id"].startswith("kb-")]
json.dump(idx + items, open(idx_path, "w"), indent=1)
print(len(items), "sounds")
