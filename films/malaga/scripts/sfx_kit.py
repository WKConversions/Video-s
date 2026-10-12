# A storybook / magical effects kit, free of rights (made for the Tale Forge film v2, October 2026):
#   python3 -I sfx_kit.py <VSCO-2-CE root> <out lib dir>     → <lib>/sfx/<category>/<id>.wav + <lib>/sfx/index.json
# The index is MERGED: entries with other ids (another generator's sounds) are kept, so two kits can share one
# library. The VSCO-2-CE checkout is described in score_sampled.py (these folders: Misc 2/glock_glisses,
# varMetal/various, Misc 2/NepaleseBells, Percussion, Strings/Harp, Violin Section/Pizz, Misc 1/bubbles*).
# Two kinds of source, both free of rights:
#   recorded  single instruments from VSCO 2 Community Edition (CC0 / public domain): glockenspiel glissandi, wind
#             chimes, bell tree, Nepalese bells, triangle, vibraphone ring, suspended cymbal swell, harp and
#             pizzicato plucks, water bubbles, a timpani tap
#   generated synthesised here: crayon on paper, page turns, the book's thump, a rubber stamp, pops, raindrops,
#             air whooshes, a little door creak, magic dust, a soft tap, night crickets, morning birds
# Each entry carries its sync point (seconds into the file where the picture event lands: a pluck's attack, a
# glissando's top note, a swell's peak, a page's pass) so the mixer puts that moment on the frame.
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, stft, istft, resample_poly

SR = 48000
ROOT, LIB = sys.argv[1], sys.argv[2]
rng = np.random.default_rng(7)
INDEX = []

def load(rel):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, rel), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)

def env_db(x, win=0.01):
    m = np.abs(x).mean(1) if x.ndim == 2 else np.abs(x)
    n = int(win * SR); c = np.concatenate([[0], np.cumsum(m)])
    e = (c[n:] - c[:-n]) / n
    return 20 * np.log10(np.pad(e, (0, len(m) - len(e)), mode="edge") + 1e-9)

def trim(x, lead=0.003, length=None, fade=0.6):
    e = env_db(x); on = int(np.argmax(e > e.max() - 40))
    x = x[max(0, on - int(lead * SR)):]
    if length and len(x) > length * SR:
        x = x[: int(length * SR)].copy(); f = int(fade * SR); x[-f:] *= np.cos(np.linspace(0, np.pi / 2, f))[:, None] ** 2
    return x

def sync_of(x, how):
    e = env_db(x, 0.02)
    if how == "start": return float(np.argmax(e > e.max() - 20)) / SR
    if how == "peak": return float(np.argmax(e)) / SR
    if how == "last":    # the last strong attack: where a glissando arrives
        d = np.diff(e[:: 240]); idx = np.where((d > 4) & (e[:: 240][1:] > e.max() - 14))[0]
        return float(idx[-1] * 240) / SR if len(idx) else float(np.argmax(e)) / SR
    return float(how)

def stereo(y, pan=0.0):
    if y.ndim == 2: return y
    return np.stack([y * np.cos((pan + 1) * np.pi / 4) * 1.414, y * np.sin((pan + 1) * np.pi / 4) * 1.414], 1)

def save(sid, cat, x, sync, character, licence):
    x = stereo(x)
    x = x / (np.abs(x).max() + 1e-9) * 10 ** (-3 / 20)
    f = int(0.004 * SR); x[-f:] *= np.linspace(1, 0, f)[:, None]
    rel = f"sfx/{cat}/{sid}.wav"; p = os.path.join(LIB, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    with wave.open(p, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
    INDEX.append({"id": sid, "file": rel, "category": cat, "character": character, "licence": licence,
                  "sync": round(float(sync), 4), "length": round(len(x) / SR, 3)})

CC0 = "cc0 (VSCO 2 Community Edition, public domain)"
GEN = "generated"

def shift(x, semis):
    if abs(semis) < 0.01: return x
    up, down = 1000, int(round(1000 * 2 ** (semis / 12)))
    return np.stack([resample_poly(x[:, k], up, down) for k in range(2)], 1)

def bend(x, semis_from, semis_to, dur):
    """play x with its pitch gliding from semis_from to semis_to over dur seconds (then held)"""
    n_out = int(len(x) / 2 ** (max(semis_from, semis_to) / 12)) - 10
    t = np.arange(n_out) / SR
    s = semis_from + (semis_to - semis_from) * np.clip(t / dur, 0, 1) ** 0.6
    pos = np.cumsum(2 ** (s / 12)); pos = pos[pos < len(x) - 1]
    return np.stack([np.interp(pos, np.arange(len(x)), x[:, k]) for k in range(2)], 1)

def band(y, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), y)

def lp(y, f, order=2): return sosfilt(butter(order, f, "low", fs=SR, output="sos"), y)
def hp(y, f, order=2): return sosfilt(butter(order, f, "high", fs=SR, output="sos"), y)

def adsr(n, a, r, curve=2.0):
    e = np.ones(n); A = max(1, int(a * SR)); R = max(1, int(r * SR))
    e[:A] = np.linspace(0, 1, A) ** curve; e[-R:] *= np.linspace(1, 0, R) ** curve
    return e

# ------------------------------------------------------------------------------------------------ recorded (CC0)
G = "Miscellania Raw/Misc 2/glock_glisses/"
W = "VSCO 1 Percussion/varMetal/various/"
N = "Miscellania Raw/Misc 2/NepaleseBells/"
for sid, src, cat, how, length, txt in [
    ("glock-rise",      G + "glock_fx_up_pentatonic_med_01.wav", "appear-rise", 0.66, 3.2, "a glockenspiel runs up a pentatonic scale; lands on its top note"),
    ("glock-rise-2",    G + "glock_fx_up_pentatonic_med_02.wav", "appear-rise", 0.59, 3.2, "a second take of the pentatonic run up"),
    ("glock-fall",      G + "glock_fx_down_pentatonic_med_01.wav", "dismiss-fall", "start", 3.0, "a glockenspiel tumbles down a pentatonic scale"),
    ("glock-sparkle",   G + "glock_fx_up_chromatic_fast_01.wav", "appear-rise", 0.29, 2.6, "a fast chromatic glockenspiel sparkle upwards"),
    ("glock-drift",     G + "glock_fx_up_chromatic_slow_01.wav", "appear-rise", "start", 4.0, "a slow glockenspiel climb, like a thread being drawn"),
    ("chimes-rise",     W + "windchimes_fastAsc1.wav", "chime", "peak", 3.4, "wind chimes brushed upwards"),
    ("chimes-slow",     W + "windchimes_slowAsc1.wav", "chime", "start", 4.2, "wind chimes brushed slowly, a shimmer that keeps going"),
    ("chimes-fall",     W + "windchimes_desc1.wav", "chime", "start", 3.4, "wind chimes brushed downwards"),
    ("chimes-twinkle",  W + "windchimes_random.wav", "chime", "start", 3.0, "a few wind chimes touched at random"),
    ("belltree",        "Percussion/BellTree_Stroke1_v1_Sum.wav", "chime", "peak", 3.4, "a bell tree stroke: the classic magic shimmer"),
    ("belltree-2",      "Percussion/BellTree_Stroke3_v1_Sum.wav", "chime", "peak", 3.6, "a longer bell-tree stroke"),
    ("nepal-bells",     N + "fx1_short_r01_main.wav", "chime", "start", 2.0, "little Nepalese bells shaken once"),
    ("nepal-bells-2",   N + "fx2_short_r03_main.wav", "chime", "start", 2.0, "little Nepalese bells, another shake"),
    ("triangle",        "Percussion/Triangle3-Hit_v1_rr1_Sum.wav", "chime", "start", 2.6, "a soft triangle ting"),
    ("vibe-ring",       "Percussion/vibraring_v1_rr1.wav", "chime", "start", 1.6, "a vibraphone bar left to ring, warm and round"),
    ("bubbles",         "Miscellania Raw/Misc 1/bubbles.wav", "swipe", "start", 2.6, "water bubbling: wet watercolour paint"),
    ("bubbles-2",       "Miscellania Raw/Misc 1/bubbles4.wav", "swipe", "start", 2.0, "a shorter bubble, paint spreading in water"),
    ("timp-soft",       "Percussion/Timpani/Timpani2_Hit_v1_rr1_Sum.wav", "impact", "start", 2.4, "a soft timpani tap"),
]:
    x = trim(load(src), length=length)
    save(sid, cat, x, sync_of(x, how), txt, CC0)

# the cymbal swell: cut so its peak sits 2.2 s in, with its tail
x = load("Percussion/susCymb1-cresc-Short_v1.wav"); pk = int(np.argmax(env_db(x, 0.05)))
x = x[max(0, pk - int(2.2 * SR)): pk + int(1.6 * SR)].copy(); x *= adsr(len(x), 0.4, 1.0, 1.5)[:, None]
save("cymbal-swell", "riser", x, sync_of(x, "peak"), "a suspended cymbal rolled up to a peak, then let go", CC0)

# tuned plucks: pizzicato steps and harp notes, pitched by the cue (D major)
x = trim(load("Strings/Violin Section/Pizz/VlnEns_Pizz_A3_v1_rr1.wav"), length=0.9, fade=0.3)   # sounds A4
save("pizz-step", "tap", shift(x, 5), 0.004, "a violin pizzicato, D5: a puppet's hop (pitch steps it up the scale)", CC0)
x = trim(load("Strings/Violin Section/Pizz/VlnEns_Pizz_A2_v1_rr1.wav"), length=1.0, fade=0.3)   # sounds A3
save("pizz-low", "tap", shift(x, 5), 0.004, "a lower pizzicato, D4", CC0)
x = trim(load("Strings/Harp/KSHarp_C5_mf.wav"), length=3.0, fade=1.2)
save("harp-pluck", "pop", shift(x, 2), 0.004, "a harp string, D5, let ring", CC0)
x = trim(load("Percussion/Glock/glock_medium_C5.wav"), length=2.6, fade=1.0)   # sounds C6
save("glock-ding", "chime", shift(x, 2), 0.004, "one glockenspiel bar, D6", CC0)

# harp glissandi built from single strings (D major, D4 to D6)
def harp_gliss(up=True, dur=0.75):
    smp = {m: trim(load("Strings/Harp/" + f), length=2.5, fade=1.0) for m, f in [(62, "KSHarp_D4_mf.wav"), (76, "KSHarp_E5_mf.wav"), (86, "KSHarp_D6_mf.wav"), (72, "KSHarp_C5_mf.wav")]}
    notes = [m for m in range(62, 87) if m % 12 in (2, 4, 6, 7, 9, 11, 1)]
    if not up: notes = notes[::-1]
    out = np.zeros((int((dur + 2.6) * SR), 2))
    for i, m in enumerate(notes):
        s = min(smp, key=lambda k: abs(k - m)); y = shift(smp[s], m - s)
        t = int(dur * (i / (len(notes) - 1)) ** 0.9 * SR); v = 0.55 + 0.45 * (i / (len(notes) - 1) if up else 1 - i / (len(notes) - 1))
        out[t: t + len(y)] += y[: len(out) - t] * v
    return out, (dur if up else 0.004)
x, s = harp_gliss(True); save("harp-gliss-up", "riser", x, s, "a harp glissando up the D major scale; lands on its top string", CC0)
x, s = harp_gliss(False); save("harp-gliss-down", "dismiss-fall", x, s, "a harp glissando down the scale", CC0)

# a questioning pluck: a pizzicato whose pitch bends up, like a raised eyebrow
x = trim(load("Strings/Violin Section/Pizz/VlnEns_Pizz_A3_v1_rr1.wav"), length=0.9, fade=0.3)
save("pluck-question", "pop", bend(x, 0, 7, 0.22), 0.004, "a pizzicato that bends up a fifth: a little question", CC0)

# ------------------------------------------------------------------------------------------------ generated
def crayon(dur, rate=7.0, seed=0, density=1.0):
    """wax crayon on paper: bright noise with the paper's tooth, swelling and dipping with each scribble stroke"""
    r = np.random.default_rng(100 + seed); n = int(dur * SR); t = np.arange(n) / SR
    w = r.standard_normal(n)
    body = band(w, 1400, 7500, 2) + 0.35 * band(w, 450, 1400, 2)
    tooth = lp(np.abs(r.standard_normal(n)), 260); tooth = tooth / (tooth.max() + 1e-9)
    clicks = np.zeros(n); k = r.integers(0, n, int(dur * 90 * density)); clicks[k] = r.uniform(0.5, 1, len(k)) * r.choice([-1, 1], len(k))
    clicks = band(clicks, 2000, 6000, 2) * 6
    ph = np.cumsum(rate * (1 + 0.25 * lp(r.standard_normal(n), 3) * 8) / SR)
    stroke = 0.35 + 0.65 * np.abs(np.sin(np.pi * ph)) ** 0.7
    y = (body * (0.45 + 0.9 * tooth) + clicks) * stroke * adsr(n, 0.015, 0.07, 1.5)
    pan = 0.25 * np.sin(np.pi * ph / 4)
    return np.stack([y * (1 - pan), y * (1 + pan)], 1)

for sid, dur, rate, seed, txt in [
    ("crayon-short", 0.28, 4.0, 1, "one short crayon stroke on paper"), ("crayon-mid", 0.55, 6.0, 2, "a crayon line drawn at a child's pace"),
    ("crayon-long", 1.0, 5.0, 3, "a long crayon line, drawn and re-drawn"), ("crayon-scribble", 0.75, 11.0, 4, "fast back-and-forth crayon scribbling"),
    ("crayon-circle", 0.55, 3.0, 5, "a crayon drawing a circle in one go"),
]:
    save(sid, "swipe", crayon(dur, rate, seed), 0.012, txt, GEN)
x = np.concatenate([crayon(0.62, 15.0, 6, 1.6), np.zeros((int(0.05 * SR), 2))]) * 1.0
save("crayon-tangle", "swipe", x, 0.012, "a frantic crayon tangle", GEN)

def tv_band(n, centers, widths, amps, seed=0):
    """noise through a band that moves: centers/widths/amps are per-STFT-frame curves"""
    r = np.random.default_rng(seed); w = r.standard_normal(n + 4096)
    f, tt, Z = stft(w, SR, nperseg=2048, noverlap=1536)
    F = len(tt); idx = np.linspace(0, 1, F)
    c = np.interp(idx, np.linspace(0, 1, len(centers)), centers); bw = np.interp(idx, np.linspace(0, 1, len(widths)), widths)
    a = np.interp(idx, np.linspace(0, 1, len(amps)), amps)
    gain = np.exp(-0.5 * ((np.log(np.maximum(f, 20))[:, None] - np.log(c)[None, :]) / bw[None, :]) ** 2) * a[None, :]
    _, y = istft(Z * gain, SR, nperseg=2048, noverlap=1536)
    return y[:n]

def whoosh(dur, lo, hi, seed, width=0.5):
    n = int(dur * SR); t = np.linspace(0, 1, 9)
    c = lo * (hi / lo) ** np.sin(np.pi * t) ; a = np.sin(np.pi * t) ** 1.6
    y = tv_band(n, c, [width] * 9, a, seed)
    pan = np.linspace(-0.6, 0.6, n)
    return np.stack([y * (1 - pan), y * (1 + pan)], 1)
x = whoosh(0.7, 500, 2200, 1); save("whoosh-air", "whoosh", x, sync_of(x, "peak"), "a soft air whoosh passing left to right", GEN)
x = whoosh(1.1, 260, 1600, 2, 0.6); save("whoosh-deep", "whoosh", x, sync_of(x, "peak"), "a deeper, slower whoosh: falling into a picture", GEN)
x = whoosh(0.45, 900, 3600, 3, 0.45); save("whoosh-flick", "whoosh", x, sync_of(x, "peak"), "a quick light flick of air", GEN)
x = whoosh(0.9, 700, 2600, 4, 0.5)[::-1].copy(); save("whoosh-puff", "whoosh", x, sync_of(x, "peak"), "a puff of wind that blows things away", GEN)

def page_turn(seed=0):
    n = int(0.75 * SR)
    y = tv_band(n, [700, 1500, 3200, 2600, 1400], [0.6, 0.7, 0.8, 0.7, 0.6], [0.0, 0.6, 1.0, 0.55, 0.0], seed + 10)
    t = np.arange(n) / SR
    flutter = 1 + 0.45 * np.sin(2 * np.pi * (28 - 14 * t / 0.75) * t) * np.sin(np.pi * np.clip(t / 0.75, 0, 1))
    slap = np.zeros(n); s0 = int(0.6 * SR); m = int(0.03 * SR)
    slap[s0: s0 + m] = lp(np.random.default_rng(seed).standard_normal(m), 2500) * np.exp(-np.linspace(0, 6, m)) * 1.4
    y = y * flutter + slap
    pan = np.linspace(0.45, -0.45, n)
    return np.stack([y * (1 - pan), y * (1 + pan)], 1)
x = page_turn(0); save("page-turn", "swipe", x, 0.32, "a storybook page turning, a flutter and a soft landing", GEN)
x = page_turn(1); save("page-turn-2", "swipe", x, 0.32, "another page turning", GEN)

def thump(f0=95, f1=55, dur=0.35, noise=0.4, seed=0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.05); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / 0.09)
    m = int(0.025 * SR); nb = np.zeros(n); nb[:m] = lp(np.random.default_rng(seed).standard_normal(m), 1800) * np.exp(-np.linspace(0, 5, m))
    return y + noise * nb
x = thump(); x[: int(0.06 * SR)] += 0.3 * page_turn(3)[int(0.62 * SR): int(0.68 * SR), 0]
save("book-close", "impact", x, 0.004, "a storybook closing: a papery soft thump", GEN)
x = thump(140, 90, 0.22, 0.8, 4); n = int(0.012 * SR); x[:n] += 0.5 * band(np.random.default_rng(5).standard_normal(n), 1500, 4500)
save("stamp", "impact", x, 0.004, "a rubber stamp pressed on paper", GEN)
x = thump(80, 50, 0.6, 0.25, 6) * 0.9
save("book-land", "impact", x, 0.004, "the book settling, felt more than heard", GEN)

def tone_glide(f0, f1, dur, glide, decay, harm=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / glide); ph = 2 * np.pi * np.cumsum(f) / SR
    y = (np.sin(ph) + harm * np.sin(2 * ph)) * np.exp(-t / decay) * adsr(n, 0.002, 0.01, 1)
    return y
x = tone_glide(330, 820, 0.12, 0.018, 0.03, 0.15); x[:48] += np.random.default_rng(1).standard_normal(48) * 0.3
save("pop-up", "pop", x, 0.003, "a round bubble pop that rises: blip", GEN)
x = tone_glide(900, 420, 0.12, 0.02, 0.028, 0.1); x[:48] += np.random.default_rng(2).standard_normal(48) * 0.3
save("pop-down", "pop", x, 0.003, "a cork-like pop that falls", GEN)
x = tone_glide(950, 2300, 0.11, 0.012, 0.022) + 0.3 * tone_glide(240, 160, 0.11, 0.02, 0.03)
save("drop", "pop", x, 0.002, "a raindrop: a bright little plip", GEN)

def creak(dur=0.65, seed=0):
    r = np.random.default_rng(seed); n = int(dur * SR); y = np.zeros(n)
    t = 0.0; ts = []
    while t < dur:
        p = 0.016 - 0.008 * (t / dur) + r.uniform(-0.0015, 0.0015); t += p; ts.append(t)
    k = np.arange(int(0.012 * SR)) / SR
    grain = sum(a * np.sin(2 * np.pi * f * k) * np.exp(-k / d) for f, a, d in [(520, 1.0, 0.004), (1250, 0.6, 0.003), (2600, 0.3, 0.002)])
    for tt in ts:
        i = int(tt * SR)
        if i + len(grain) < n: y[i: i + len(grain)] += grain * r.uniform(0.6, 1.0)
    return y * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.8
x = creak(); x = np.concatenate([np.zeros(int(0.02 * SR)), x]); x[: int(0.01 * SR)] += band(np.random.default_rng(9).standard_normal(int(0.01 * SR)), 1500, 5000) * 0.8
save("door-creak", "swipe", x, 0.02, "a small wooden door creaking open, with its latch", GEN)

def dust(dur=1.5, n_pings=46, seed=0, lo=84, hi=105):
    r = np.random.default_rng(seed); n = int((dur + 0.4) * SR); out = np.zeros((n, 2))
    scale = [m for m in range(lo, hi) if m % 12 in (2, 4, 6, 9, 11)]
    for _ in range(n_pings):
        t0 = r.exponential(dur / 3.2); t0 = min(t0, dur)
        f = 440 * 2 ** ((r.choice(scale) - 69) / 12); d = r.uniform(0.05, 0.22); m = int(d * 4 * SR)
        k = np.arange(m) / SR; y = np.sin(2 * np.pi * f * k) * np.exp(-k / d) * r.uniform(0.3, 1.0) * adsr(m, 0.001, 0.005, 1)
        i = int(t0 * SR); out[i: i + m] += stereo(y, r.uniform(-0.8, 0.8))[: n - i]
    return out
save("magic-dust", "chime", dust(), 0.004, "a cloud of tiny high bells: fairy dust", GEN)
save("magic-dust-short", "chime", dust(0.6, 18, 3), 0.004, "a pinch of fairy dust", GEN)

x = np.zeros(int(0.06 * SR)); n = int(0.012 * SR)
x[:n] = band(np.random.default_rng(11).standard_normal(n), 2200, 5500) * np.exp(-np.linspace(0, 5, n))
x += 0.6 * tone_glide(1400, 1300, 0.06, 0.01, 0.012)
save("tap-soft", "tap", x, 0.002, "a soft wooden tap on a page", GEN)

def crickets(dur=15.0, seed=0):
    r = np.random.default_rng(seed); n = int(dur * SR); out = np.zeros((n, 2)); t = np.arange(n) / SR
    for f, pan, period in [(4450, -0.6, 0.74), (4920, 0.55, 0.91), (5300, 0.1, 1.27)]:
        tt = r.uniform(0, period)
        while tt < dur - 0.3:
            for p in range(3):
                i = int((tt + p * 0.042) * SR); m = int(0.028 * SR)
                k = np.arange(m) / SR; y = np.sin(2 * np.pi * f * k) * np.sin(np.pi * k / k[-1]) ** 2 * r.uniform(0.6, 1.0)
                if i + m < n: out[i: i + m] += stereo(y, pan)
            tt += period * r.uniform(0.85, 1.15)
    air = lp(r.standard_normal(n), 700) * 0.6
    out += stereo(air * (0.8 + 0.2 * np.sin(2 * np.pi * t / 6.3)), 0.0)
    return out * adsr(n, 1.5, 2.0, 1.2)[:, None]
save("night-crickets", "ambience", crickets(), 0.0, "a quiet night: three crickets and soft air", GEN)

def bird_phrase(r, n_chirps, f_lo, f_hi):
    ys = []
    for _ in range(n_chirps):
        d = r.uniform(0.05, 0.11); m = int(d * SR); k = np.linspace(0, 1, m)
        shape = r.choice(["up", "down", "hump"])
        if shape == "up": f = f_lo + (f_hi - f_lo) * k ** 0.6
        elif shape == "down": f = f_hi - (f_hi - f_lo) * k ** 0.8
        else: f = f_lo + (f_hi - f_lo) * np.sin(np.pi * k)
        ph = 2 * np.pi * np.cumsum(f) / SR
        y = (np.sin(ph) + 0.12 * np.sin(2 * ph)) * np.sin(np.pi * k) ** 1.5 * (1 + 0.3 * np.sin(2 * np.pi * 60 * k * d))
        ys.append(y); ys.append(np.zeros(int(r.uniform(0.04, 0.09) * SR)))
    return np.concatenate(ys)
def birds(dur=8.0, seed=0):
    r = np.random.default_rng(seed); n = int(dur * SR); out = np.zeros((n, 2)); tt = 0.15
    while tt < dur - 1.0:
        y = bird_phrase(r, int(r.integers(3, 7)), r.uniform(2600, 3400), r.uniform(4200, 5600)) * r.uniform(0.4, 1.0)
        i = int(tt * SR); out[i: i + len(y)] += stereo(y, r.uniform(-0.8, 0.8))[: n - i]
        tt += r.uniform(0.6, 1.4)
    return out * adsr(n, 0.6, 1.5, 1.2)[:, None]
save("morning-birds", "ambience", birds(), 0.15, "morning: small birds answering each other", GEN)

os.makedirs(os.path.join(LIB, "sfx"), exist_ok=True)
ip = os.path.join(LIB, "sfx", "index.json")
mine = {o["id"] for o in INDEX}
keep = [o for o in json.load(open(ip)) if o["id"] not in mine] if os.path.exists(ip) else []
json.dump(keep + INDEX, open(ip, "w"), indent=1)
print(f"{len(INDEX)} sounds → {LIB}/sfx/index.json")
for o in INDEX: print(f"  {o['id']:18s} {o['category']:12s} {o['length']:5.2f}s sync {o['sync']:.3f}  {o['licence'][:9]}")
