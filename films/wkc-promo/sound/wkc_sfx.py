# The WKConversions promo's own sound effects, one for every row of the reference's SFX table (spec/audio.md §4b), in the
# reference's eleven families: A glitch swooshes, B glassy two-tone UI blips, C typing data-blips, D noise swishes
# (some panned), E reverse swooshes cut on the hit, F sub drops / low booms, G shimmer risers, H the click with a thin
# ring, I bubble pops, J toggle ratchet ticks, K word ticks; plus the drop impacts, the logo sting and the outro swells
# the reference has in its music. Every sound is made for its moment and used once (make_cues.py asserts it).
# Tonal sounds sit in the music's key: the track (Can't Get You Off My Mind) is in C# minor, tuned 13 cents sharp
# (librosa estimate_tuning; the reference is G minor, a tritone away, so G-minor effects would clash with this bed).
# Each entry's "sync" is the time in the file that lands on the cue's frame (the picture event).
#   python3 wkc_sfx.py   ->  lib/sfx/wkc/wk-*.wav (48 kHz stereo) + entries in lib/sfx/index.json
import json, os, wave
import numpy as np
from scipy.signal import butter, sosfilt, stft, istft, fftconvolve

SR = 48000
OUT = "lib/sfx/wkc"
os.makedirs(OUT, exist_ok=True)
TUNE = 2 ** (13 / 1200)
SEMI = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}
def hz(n):
    """'C#5' -> Hz, tuned like the track (+13 cents)."""
    name, octv = n[:-1], int(n[-1])
    return 440.0 * 2 ** ((SEMI[name] + 12 * (octv - 4)) / 12) * TUNE

def T(n): return np.arange(int(round(n * SR))) / SR
def Z(n): return np.zeros(int(round(n * SR)))
def place(dst, src, at):
    s = int(round(at * SR)); e = min(len(dst), s + len(src))
    if e > s: dst[s:e] += src[:e - s]
def add(*xs):
    n = max(len(x) for x in xs); out = np.zeros((n,) + xs[0].shape[1:]) if xs[0].ndim > 1 else np.zeros(n)
    for x in xs: out[:len(x)] += x
    return out
def noise(n, seed): return np.random.default_rng(seed).standard_normal(int(round(n * SR)))
def band(x, lo=None, hi=None, order=4):
    if lo and hi: sos = butter(order, [lo, min(hi, 0.47 * SR)], "bandpass", fs=SR, output="sos")
    elif lo: sos = butter(order, lo, "highpass", fs=SR, output="sos")
    else: sos = butter(order, hi, "lowpass", fs=SR, output="sos")
    return sosfilt(sos, x)
def env_ad(n, a, d, shape=1.0):
    """attack a s (raised cosine), exponential decay with time constant d."""
    t = T(n); e = np.where(t < a, 0.5 - 0.5 * np.cos(np.pi * np.clip(t / max(a, 1e-6), 0, 1)), np.exp(-(t - a) / d))
    return e ** shape
def arc(n, p=1.0, peak=0.5):
    """0 -> 1 -> 0, peaking at `peak` (fraction of n)."""
    u = T(n) / n
    return np.where(u < peak, np.sin(0.5 * np.pi * u / peak), np.cos(0.5 * np.pi * (u - peak) / (1 - peak))) ** p
def masknoise(n, fmask, seed, nper=512):
    """White noise shaped in the STFT domain by fmask(f[:,None], t[None,:]) -> gain; for sweeping bands."""
    x = noise(n + nper / SR, seed)
    f, t, Zs = stft(x, fs=SR, nperseg=nper, noverlap=nper - nper // 4)
    _, y = istft(Zs * fmask(f[:, None], t[None, :]), fs=SR, nperseg=nper, noverlap=nper - nper // 4)
    return y[: int(round(n * SR))]
def sweepband(n, f0, f1, oct_bw=1.0, seed=0, curve=1.0):
    """Noise in a band (oct_bw octaves wide) whose centre glides f0 -> f1 (exponentially, warped by `curve`)."""
    def m(f, t):
        u = np.clip(t / n, 0, 1) ** curve; fc = f0 * (f1 / f0) ** u
        return np.exp(-0.5 * (np.log2(np.maximum(f, 1) / fc) / (oct_bw / 2.355)) ** 2)
    return masknoise(n, m, seed)
def sine_glide(n, f0, f1, curve=1.0, phase=0.0):
    t = T(n); u = (t / n) ** curve; f = f0 * (f1 / f0) ** u
    return np.sin(2 * np.pi * np.cumsum(f) / SR + phase)
def ping(f, n=0.08, d=0.022, a=0.0008, partials=((1, 1.0),)):
    t = T(n); y = np.zeros_like(t)
    for m, amp in partials: y += amp * np.sin(2 * np.pi * f * m * t) * np.exp(-t * (1 + 0.6 * (m - 1)) / d)
    return y * np.minimum(1, t / a)
def tick(seed, lo=3000, hi=None, d=0.004, n=0.03, a=0.0004):
    """A crisp transient: filtered noise with a very fast decay."""
    x = noise(n, seed); t = T(n)
    return band(x, lo, hi, 2) * np.exp(-t / d) * np.minimum(1, t / a)
def clickpair(seed, gap=0.01, hi=6500, lo=2600, body=180):
    """A sharp UI click: two transients (press and release) and a tiny body."""
    y = Z(0.08)
    place(y, tick(seed, hi * 0.6, None, 0.0025, 0.03), 0.0)
    place(y, band(noise(0.02, seed + 1), lo * 0.7, lo * 1.4, 2) * np.exp(-T(0.02) / 0.003) * 0.7, 0.0)
    place(y, tick(seed + 2, hi * 0.5, None, 0.002, 0.03) * 0.55, gap)
    place(y, np.sin(2 * np.pi * body * T(0.03)) * np.exp(-T(0.03) / 0.006) * 0.25, 0.0)
    return y
def bubble(f, n=0.06, rise=0.6, d=0.018):
    """A bubble pop: a sine whose pitch rises through the pop."""
    t = T(n); fr = f * (1 + rise * (1 - np.exp(-t / (n * 0.35))))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / d) * np.minimum(1, t / 0.0008)
def sat(x, drive=1.5): return np.tanh(drive * x) / np.tanh(drive)
def sub808(n, f0, f1, glide_at=0.0, glide=0.25, a=0.004, d=0.4, drive=2.2, curve=1.0):
    """An 808 tone holding f0, gliding to f1 from glide_at over `glide` s; saturated so it reads on small speakers."""
    t = T(n); u = np.clip((t - glide_at) / glide, 0, 1) ** curve
    f = f0 * (f1 / f0) ** u
    y = np.sin(2 * np.pi * np.cumsum(f) / SR)
    e = np.minimum(1, t / a) * np.exp(-t / d) * np.clip((n - t) / min(0.15, 0.3 * n), 0, 1) ** 2   # never stops dead
    return sat(y * e, drive)
def saw(f, t, phase):
    return 2 * ((f * t + phase) % 1) - 1
def supersaw(freqs, n, seed, detune=0.12, voices=5, cut=5000):
    """Detuned saw stack per note, split over L and R for width; low-passed."""
    r = np.random.default_rng(seed); t = T(n); L, R = np.zeros_like(t), np.zeros_like(t)
    for f in freqs:
        for v in range(voices):
            c = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune      # semitones
            s = saw(f * 2 ** (c / 12), t, r.random()) / voices
            if v % 2: L += s * 0.8; R += s * 0.2
            else: L += s * 0.2; R += s * 0.8
    return np.stack([band(L, None, cut, 2), band(R, None, cut, 2)], 1)

# ---- room: a short bright stereo plate (two decorrelated tails)
def reverb(x, length=0.9, wet=0.18, decay=0.22, damp=7000, seed=1):
    if x.ndim == 1: x = np.stack([x, x], 1)
    n = int(length * SR); out = np.zeros((len(x) + n, 2)); out[:len(x)] += x
    for ch in range(2):
        ir = noise(length, seed + 31 * ch) * np.exp(-T(length) / decay)
        ir = band(ir, 300, damp, 2); ir[: int(0.006 * SR)] *= np.linspace(0, 1, int(0.006 * SR))
        ir /= np.sqrt((ir ** 2).sum())
        c = fftconvolve(x[:, ch], ir)[: len(out)]; out[: len(c), ch] += wet * c
    return out
def stereo(x, pan=0.0, width=0.0006):
    """Mono -> stereo: a short Haas offset for air and an equal-power pan (-1 left .. +1 right)."""
    if x.ndim == 2: L, R = x[:, 0], x[:, 1]
    else:
        d = int(width * SR); L = np.concatenate([x, np.zeros(d)]); R = np.concatenate([np.zeros(d), x])
    a = (pan + 1) * np.pi / 4
    return np.stack([L * np.cos(a) * np.sqrt(2), R * np.sin(a) * np.sqrt(2)], 1) if pan else np.stack([L, R], 1)
def wide(xl, xr): return np.stack([xl[:min(len(xl), len(xr))], xr[:min(len(xl), len(xr))]], 1)

items = []
def save(id, y, cat, sync, note, rev=0.12, length=0.8, decay=0.2, pan=0.0, cut=None, peak=0.7):
    """Write lib/sfx/wkc/<id>.wav. `cut` (s) hard-cuts the file there (2 ms fade): the reverse swooshes and risers."""
    st = y if y.ndim == 2 else stereo(y)
    if rev > 0: st = reverb(st, length, rev, decay, seed=len(items) + 3)
    if pan: st = stereo(st, pan)
    if cut is not None:
        k = int(round(cut * SR)); st = st[:k].copy(); f = int(0.002 * SR); st[-f:] *= np.linspace(1, 0, f)[:, None]
    else:                                   # trim the silent tail
        e = np.abs(st).max(1); k = np.nonzero(e > e.max() * 10 ** (-70 / 20))[0]; st = st[: k[-1] + 1 if len(k) else len(st)]
    st = st / (np.abs(st).max() + 1e-12) * peak
    with wave.open(f"{OUT}/{id}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype("<i2").tobytes())
    assert id not in [i["id"] for i in items], id
    items.append({"id": id, "file": f"sfx/wkc/{id}.wav", "category": cat, "sync": round(sync, 4), "length": round(len(st) / SR, 3),
                  "licence": "generated", "source": "generated for the WKConversions promo (wkc_sfx.py), royalty-free", "character": note})

# =====================================================================================================================
# A  glitch swoosh: an abrupt bright noise burst (decaying ~0.45 s) made digital (sample-and-hold, bit-crush, stutter
#    gate), 3-5 falling sine chirps (~40 ms each, 25 ms apart) and bubbly random blips; its attack leads the flash by
#    4-5 frames (sync = that lead).
def glitch(seed, n=0.52, chirp_at=0.06, chirps=4, c0=7000, c1=4000, blips=10, blip_lo=8000, blip_hi=13000, gate_hz=55, crush=6, lead=0.15, burst_lo=1000):
    r = np.random.default_rng(seed); t = T(n)
    base = band(noise(n, seed), burst_lo, 16000, 2)
    hold = np.repeat(base[:: crush], crush)[: len(base)]                          # sample-and-hold: the digital grain
    q = np.round(hold * 6) / 6
    burst = 0.55 * base + 0.45 * band(q, burst_lo, 16000, 2)
    e = env_ad(n, 0.004, 0.13) * (0.75 + 0.25 * np.exp(-((t - lead) / 0.03) ** 2))  # a second lift at the flash
    gate = np.where(t < 0.08, 1.0, 0.55 + 0.45 * (np.sin(2 * np.pi * gate_hz * t + r.random() * 6) > -0.2))
    y = burst * e * gate
    for k in range(chirps):                                                         # the falling chirps
        a = chirp_at + 0.025 * k; m = 0.04 + 0.01 * r.random()
        f0 = c0 * (1 + 0.08 * r.standard_normal()); f1 = c1 * (1 + 0.06 * r.standard_normal())
        place(y, sine_glide(m, f0, f1, 0.8) * np.sin(np.pi * T(m) / m) ** 0.7 * (0.55 - 0.06 * k), a)
    for k in range(blips):                                                          # bubbly blips in the tail
        a = chirp_at + 0.05 + r.random() * (n - chirp_at - 0.12)
        f = blip_lo + (blip_hi - blip_lo) * r.random()
        place(y, bubble(f, 0.025 + 0.02 * r.random(), 0.3 * r.random(), 0.008) * (0.12 + 0.18 * r.random()), a)
    l = y + 0.18 * band(noise(n, seed + 7), 3000, 16000, 2) * e * gate             # a little decorrelated air for width
    rr = y + 0.18 * band(noise(n, seed + 8), 3000, 16000, 2) * e * gate
    return wide(l, rr)

# B  UI blip: a click attack and a short pure ping in two partials (one very high, one 3.5-6 kHz)
def uiblip(f_hi, f_lo, seed, n=0.075, d=0.02, hi_amp=0.55, click_amp=0.35):
    y = Z(n + 0.01)
    place(y, tick(seed, 5000, None, 0.0015, 0.02) * click_amp, 0)
    place(y, ping(f_lo, n, d, 0.0006, ((1, 1.0), (2.76, 0.04))), 0.0005)
    place(y, ping(f_hi, n * 0.8, d * 0.75, 0.0004) * hi_amp, 0.0005)
    return y

# =====================================================================================================================
S = save
# ---- 0-3.3 s: "Meet", the wkc logo, the riser into the drop -------------------------------------------------------
for k, (lo, d, f) in enumerate([(5000, 0.006, None), (3500, 0.008, 9500), (6500, 0.005, None), (4000, 0.007, 11000), (5500, 0.009, None)]):
    y = tick(100 + k, lo, f, d, 0.05) * 0.9 + band(noise(0.05, 110 + k), 9000, None, 2) * np.exp(-T(0.05) / 0.012) * 0.25
    S(f"wk-meet-{k + 1}", y, "tap", 0.0, f"soft airy tick {k + 1} of 5 on the 'Meet' letters (closed-hat-like, {lo // 1000}-12 kHz)", rev=0.1, length=0.4, decay=0.08)
S("wk-glitch-logo", glitch(201, 0.52, 0.05, 4, 7000, 4000, 9, 8000, 12000, 48, 6, 0.15), "glitch", 0.15,
  "glitch swoosh into the wkc monogram + wordmark glow (attack 4.5 f before the flash; chirps 7->4 kHz)", rev=0.14, length=0.9)
# the riser into DROP 1: a low rumble swell from 2.00 s, bright reverse noise from 2.55 s with twinkling sparkles, hard cut 12 ms before the drop
n = 1.285; t = T(n)
rumble = sub808(n, hz("E1") * 1.6, hz("E1") * 2.6, 0, n, 0.3, 9, 1.6) * np.clip(t / n, 0, 1) ** 2.2 * 0.55
rumble += band(noise(n, 301), 50, 140, 2) * (t / n) ** 2 * 1.4
nz = Z(n); bright = sweepband(0.735, 1500, 9000, 2.2, 302, 0.7) * (T(0.735) / 0.735) ** 2.6; place(nz, bright, n - 0.735)
sp = Z(n); r = np.random.default_rng(303)
for k in range(46):
    a = 0.55 + (n - 0.6) * (k / 46) ** 0.7 + 0.01 * r.random()
    f = hz(["C#7", "E7", "F#7", "G#7", "B7", "C#8"][r.integers(6)]) * (1 + 0.003 * r.standard_normal())
    place(sp, ping(f, 0.06, 0.018) * (0.1 + 0.25 * (a / n) ** 1.5), a)
S("wk-riser-drop1", add(rumble, nz * 0.9, sp), "riser", n + 0.015,
  "reverse riser into the drop: rumble swell from 2.0 s, bright noise + sparkles from 2.55 s, hard cut at 3.285 s", rev=0.16, length=1.0, cut=n)
# the drop: a sub hit on the track's first kick plus a bright air burst
y = add(stereo(sub808(0.9, hz("E2"), hz("E1"), 0.0, 0.08, 0.002, 0.28, 2.0) * 0.9),
        wide(band(noise(0.9, 401), 2500, 16000, 2) * env_ad(0.9, 0.003, 0.16) * 0.35, band(noise(0.9, 402), 2500, 16000, 2) * env_ad(0.9, 0.003, 0.16) * 0.35))
S("wk-drop1", y, "impact", 0.006, "DROP 1 (f99): sub hit on E with a bright wide air burst, 'Motion' lands", rev=0.12, length=1.0)
# "Motion that makes it click": bubble pips per word, a crisp click on "click"
y = Z(0.12)
for k, (f, a) in enumerate([(hz("C#9") * 1.2, 0.0), (hz("G#9") * 0.85, 0.022), (hz("E9") * 1.4, 0.045)]):
    place(y, bubble(f, 0.03, 0.25, 0.007) * (0.8 - 0.15 * k), a)
S("wk-pop-that", y, "pop", 0.0, "bubble blips (9-15 kHz) as 'that makes it' appears", rev=0.1, length=0.5)
y = Z(0.25); place(y, clickpair(501, 0.012, 7000, 3200, 220), 0)
for k, f in enumerate([9800, 12600, 10700, 13900, 11300]):
    place(y, bubble(f, 0.028, 0.35, 0.007) * 0.35, 0.03 + 0.033 * k)
S("wk-click-word", y, "pop", 0.0167, "a crisp click on 'click' with five bubble pips after it (f122.5-128)", rev=0.1, length=0.5)

# ---- 5-7.5 s: "Explain. Engage. Convert." --------------------------------------------------------------------------
S("wk-glitch-engage", glitch(801, 0.52, 0.117, 5, 9000, 5000, 12, 10000, 12000, 62, 4, 0.15), "glitch", 0.15,
  "glitch swoosh on 'Engage.' (the keyframe snap); chirps 9->5 kHz at f168-171, bubbly blips 10-12 kHz after", rev=0.14, length=0.9)
y = add(tick(1001, 8000, 12000, 0.012, 0.08) * 0.8, ping(hz("D#9"), 0.07, 0.012) * 0.25)
S("wk-tick-convert", y, "tap", 0.0, "small bright tick (8-12 kHz), slightly left: 'Convert.' lights", rev=0.08, length=0.4, pan=-0.3)

# ---- 7.3-10 s: "Or just look incredible." -------------------------------------------------------------------------
y = Z(0.16); place(y, add(tick(1101, 6000, None, 0.0012, 0.015) * 0.3, ping(15000, 0.055, 0.015)), 0.0)
place(y, uiblip(hz("A9"), hz("F#8"), 1102, 0.07, 0.02), 0.0667)
S("wk-blip-or", y, "pop", 0.0, "glassy UI blip on 'Or.': a 15 kHz pip, then 14 kHz + 6 kHz two frames later", rev=0.1, length=0.5)
n = 0.29; y = sweepband(n, 1800, 6000, 1.6, 1201, 1.0) * arc(n, 1.3, 0.35)
S("wk-swish-left", y, "swipe", 0.0167, "noise swish 1-8 kHz panned left as the dots run out", rev=0.08, length=0.5, pan=-0.75)
n = 0.22; y = sweepband(n, 2600, 1400, 1.4, 1301, 1.0) * arc(n, 1.2, 0.4)
S("wk-swish-right", y, "swipe", 0.0167, "darker swish panned right as the dots keep growing", rev=0.08, length=0.5, pan=0.6)
n = 0.22; y = sweepband(n, 3000, 7500, 1.8, 1401, 0.8) * arc(n, 1.4, 0.3); place(y, uiblip(hz("A9"), hz("F#8") * 1.0, 1402, 0.07, 0.02) * 0.9, 0.05)
S("wk-swish-incredible", y, "swipe", 0.0667, "swish as the line slides left, with a 14 + 6 kHz blip on the cut to 'just look incredible'", rev=0.1, length=0.5)
y = Z(0.2); place(y, tick(1501, 4000, None, 0.003, 0.03), 0)
for k, f in enumerate([10000, 8600, 7300, 6100]): place(y, ping(f, 0.05, 0.012) * (0.45 - 0.05 * k), 0.006 + 0.012 * k)
place(y, ping(hz("F#6"), 0.12, 0.035, 0.001, ((1, 1), (2, 0.2))) * 0.5, 0.004)
S("wk-sparkle-incredible", y, "pop", 0.0, "sparkle pop as 'incredible' snaps bold/3D: transient, pips 10->6 kHz, an F#6 body", rev=0.16, length=0.7)
# the step-14 808 accent: a 60 ms low pre-swell from 9.43 s, the boom on the pickup (9.49 s), ringing through the cut at f287
y = Z(0.5); place(y, band(noise(0.06, 1601), 40, 160, 2) * (T(0.06) / 0.06) ** 2 * 0.5, 0.0)
place(y, sub808(0.44, hz("B1"), hz("E1"), 0.01, 0.08, 0.003, 0.17, 2.6) + 0.15 * band(noise(0.44, 1602), 120, 500, 2) * env_ad(0.44, 0.002, 0.03), 0.06)
S("wk-boom-brief", y, "impact", 0.137, "low boom (B1 -> E1, 62 -> 41 Hz) on the step-14 pickup (9.49 s), ringing through the cut to the brief field (f287)", rev=0.0)

# ---- 9.7-12.5 s: "Tell us what needs explaining" typed --------------------------------------------------------------
r = np.random.default_rng(1701); y = Z(0.48)
fs = [3320, 10500, 5800, 13900, 8000, 12200, 3900, 14800]
for k, f in enumerate(fs):
    a = 0.005 + 0.048 * k + 0.008 * r.random()
    place(y, add(tick(1710 + k, 5000, None, 0.0012, 0.01) * 0.25, ping(f, 0.06, 0.012 + 0.008 * r.random())) * (0.6 + 0.3 * r.random()), a)
S("wk-type-brief", y, "data", 0.0, "typing data-blips: 8 single pips at random pitches 3.3-15 kHz as the brief is typed", rev=0.08, length=0.4)
y = Z(0.13); place(y, add(tick(1801, 6000, None, 0.001, 0.01) * 0.3, ping(13500, 0.05, 0.014)), 0); place(y, add(tick(1802, 6000, None, 0.001, 0.01) * 0.3, ping(12000, 0.06, 0.016)), 0.05)
S("wk-type-done", y, "data", 0.0, "two more data-blips (13.5 and 12 kHz): the arrow lights, the brief is complete", rev=0.08, length=0.4)
y = add(np.sin(2 * np.pi * np.cumsum(np.linspace(140, 70, int(0.12 * SR))) / SR) * env_ad(0.12, 0.003, 0.03), tick(1901, 7500, 11000, 0.006, 0.05) * 0.4)
S("wk-settle-card", y, "tap", 0.0, "soft low thump with a 9 kHz tick: the brief settles into its card", rev=0.1, length=0.5)

# ---- 12.7-18 s: the brief breaks into storyboard frames, the 3D tilt, the Export cut -------------------------------
n = 0.62; y = sub808(n, hz("G#1"), hz("A0") * 1.0, 0.04, 0.3, 0.01, 0.35, 2.4, 0.8)
y *= np.interp(T(n), [0, 0.2, 0.267, 0.62], [0.35, 0.8, 1.0, 0.0]) ** 1.0
S("wk-subdrop-frames", y, "impact", 0.267, "sub drop: an 808 glide G#1 -> A0 (52 -> 28 Hz) peaking as the storyboard frames fly in", rev=0.0)
r = np.random.default_rng(2101); y = Z(0.56)
for k in range(10):
    a = 0.012 + 0.048 * k + 0.012 * r.random()
    tone = bubble(hz(["B6", "C#7", "A6", "B6", "G#6"][k % 5]) * (1 + 0.01 * r.standard_normal()), 0.05, 0.4, 0.012)
    place(y, add(tone * 0.7, bubble(10000 + 2000 * r.random(), 0.02, 0.2, 0.006) * 0.3) * (0.6 + 0.4 * r.random()), a)
S("wk-pops-frames", y, "pop", 0.0, "ten tiny bubble pops (2 kHz tonal + 10-12 kHz blips) as the storyboard frames populate", rev=0.12, length=0.5)
n = 0.13; y = sweepband(n, 2500, 9000, 2.0, 2201, 0.7) * arc(n, 1.1, 0.55)
S("wk-swish-tilt", y, "swipe", 0.0667, "short bright swish (2-12 kHz) into the 3D tilt (f429)", rev=0.08, length=0.4)
y = Z(0.26)
for k, (f, a) in enumerate([(hz("C#6"), 0.0), (hz("F#6"), 0.167)]):
    place(y, add(bubble(f, 0.06, 0.35, 0.016), tick(2301 + k, 7000, None, 0.002, 0.02) * 0.25), a)
S("wk-pops-panel", y, "pop", 0.0, "two small pops (1-2 kHz body + air) as elements pop inside the 3D composition", rev=0.12, length=0.5)
n = 0.6; y = sub808(n, hz("E1") * 1.3, hz("A0"), 0.0, 0.32, 0.03, 0.5, 2.6, 0.7)
y *= np.interp(T(n), [0, 0.12, 0.2, 0.26, 0.6], [0.2, 0.7, 1.0, 0.85, 0.0])
S("wk-subdrop-export", y, "impact", 0.2, "sub drop: 808 glide to 28 Hz, the swell peaking on the hard cut to 'Export' (f530)", rev=0.0)

# ---- 18-19.3 s: the Export click, its ring, the shimmer riser into DROP 2 ------------------------------------------
y = Z(0.12); place(y, clickpair(2601, 0.009, 7800, 3000, 240), 0); place(y, clickpair(2602, 0.008, 6600, 2600, 200) * 0.85, 0.05)
S("wk-click-export", y, "tap", 0.02, "the cursor clicks Export: two sharp double-clicks 50 ms apart, slightly left", rev=0.06, length=0.4, pan=-0.3)
t = T(0.47); y = np.sin(2 * np.pi * hz("G#9") * t + 0.002 * np.sin(2 * np.pi * 6 * t) * 50) * np.minimum(1, t / 0.01) * np.exp(-t / 0.16)
S("wk-ring-export", y, "chime", 0.0, "thin sine ring (G#9, 13.4 kHz), hard left, as the press glow starts", rev=0.0, pan=-0.92)
n = 0.785; t = T(n)
y = sweepband(n, 1800, 11000, 1.6, 2801, 0.8) * (t / n) ** 2.4 * 0.8
sp = Z(n); r = np.random.default_rng(2802)
for k in range(60):
    a = (k / 60) ** 0.8 * (n - 0.03); f = hz(["E7", "F#7", "G#7", "B7", "C#8", "E8"][min(5, int(6 * a / n + r.random()))]) * (1 + 0.004 * r.standard_normal())
    place(sp, ping(f, 0.05, 0.014) * (0.12 + 0.4 * (a / n) ** 1.3), a)
S("wk-shimmer-drop2", wide(y + sp, y * 0.95 + np.roll(sp, 37)), "riser", n + 0.015,
  "shimmer riser: rising noise with twinkling sparkles (4-7 kHz, C# minor) from 18.50 s, cut on the drop-2 downbeat", rev=0.18, length=1.0, cut=n)
y = add(stereo(sub808(1.2, hz("E2"), hz("E1"), 0.0, 0.06, 0.002, 0.3, 1.8) * 0.75),
        wide(band(noise(1.2, 2901), 4000, 16000, 2) * env_ad(1.2, 0.002, 0.35), band(noise(1.2, 2902), 4000, 16000, 2) * env_ad(1.2, 0.002, 0.35)) * 0.45)
S("wk-drop2", y, "impact", 0.006, "DROP 2 (f579): sub hit and a long crash-like air tail into the showcase", rev=0.15, length=1.2)

# ---- 19.3-24 s: the client-video showcase ----------------------------------------------------------------------------
S("wk-glitch-showcase", glitch(3001, 0.42, 0.183, 4, 6000, 3500, 8, 8000, 11500, 70, 5, 0.15, 1200), "glitch", 0.15,
  "glitch swoosh on the hero cut inside the showcase (f649); chirps 6->3.5 kHz at f650-654", rev=0.14, length=0.9)
y = add(bubble(hz("E8"), 0.07, 0.15, 0.02), tick(3101, 6000, None, 0.002, 0.02) * 0.2)
S("wk-pop-notify", y, "pop", 0.0, "small notification pop (5.3 kHz), panned right: a second clip settles", rev=0.12, length=0.5, pan=0.55)
y = Z(0.45); place(y, band(noise(0.094, 3201), 50, 220, 2) * (T(0.094) / 0.094) ** 2.2 * 0.45, 0.0)
place(y, sub808(0.36, hz("D#2") * 1.06, hz("D#2") * 0.94, 0.0, 0.2, 0.003, 0.12, 3.0) + 0.12 * band(noise(0.36, 3202), 150, 700, 2) * env_ad(0.36, 0.002, 0.035), 0.094)
S("wk-boom-platform", y, "impact", 0.133, "low boom on D#2 (78 Hz) on the step-14 pickup (23.894 s) into the cut to the dark 'Made for every platform' (f718)", rev=0.06, length=0.6)

# ---- 24-29 s: platforms, formats, versions ---------------------------------------------------------------------------
n = 0.27; t = T(n); y = sweepband(n, 4200, 2200, 1.2, 3301, 1.0) * arc(n, 1.2, 0.45)
S("wk-swish-publish", wide(y * np.linspace(1, 1.3, len(y)), y * np.linspace(1, 0.35, len(y))), "swipe", 0.0,
  "soft mid swish (2-5 kHz) drifting left as 'Made for every platform' blurs out", rev=0.1, length=0.5)
S("wk-blip-web", uiblip(15000, hz("A7"), 3401, 0.07, 0.02), "pop", 0.0167, "UI blip 15 kHz + 3.5 kHz (A7): the website card is selected", rev=0.1, length=0.5)
S("wk-blip-linkedin", uiblip(hz("A9") * 0.995, hz("F#8") * 0.98, 3501, 0.09, 0.024, 0.5), "pop", 0.01, "UI blip 14 kHz + 5.8 kHz: the selection jumps to LinkedIn", rev=0.1, length=0.5)
n = 0.067; y = Z(0.2); sw = sweepband(n, 3000, 9000, 1.5, 3601, 1.0) * (T(n) / n) ** 2.5 * 0.6; place(y, sw, 0)
place(y, uiblip(hz("C#9") * 0.95, hz("C#8"), 3602, 0.1, 0.03, 0.15, 0.25), n)
S("wk-blip-insta", y, "pop", 0.0667, "short reverse swell into a rounder 8.4 kHz ping: the selection jumps to Instagram", rev=0.12, length=0.5)
y = Z(0.2)
for k in range(6): place(y, add(tick(3701 + k, 11000, None, 0.0012, 0.01), ping(12000 + 400 * k, 0.012, 0.003) * 0.4) * (0.7 + 0.06 * k), 0.0333 * k)
S("wk-ratchet", y, "gear", 0.02, "six tiny 12-14 kHz ratchet ticks, one per frame, as the versions toggle slides", rev=0.04, length=0.3)
def revswoosh(n, seed, lo=2000, damp=14000, decay=0.18, dense=1.0):
    """A bright burst through a long bright tail, reversed: swells and stops dead."""
    L = int(n * SR); x = np.zeros(L); x[:int(0.004 * SR)] = noise(0.004, seed)
    out = []
    for ch in range(2):
        ir = band(noise(n, seed + 1 + ch), lo, damp, 2) * np.exp(-T(n) / decay)
        if dense > 1: ir += band(noise(n, seed + 5 + ch), lo * 2, damp, 2) * np.exp(-T(n) / (decay * 0.7)) * (dense - 1)
        out.append(fftconvolve(x, ir)[:L][::-1])
    return wide(*out)
S("wk-revswoosh-versions", revswoosh(0.35, 3801, 2000, 16000, 0.14), "whoosh", 0.35,
  "reverse swoosh (flat bright noise 2-16 kHz) stopping dead at f823: 'Multiple versions / One project'", rev=0.0, cut=0.35)

# ---- 29-33.5 s: design details, the founders ------------------------------------------------------------------------
n = 0.5; y = sub808(n, hz("A1") * 0.95, hz("B0"), 0.0, 0.2, 0.004, 0.2, 2.4)
y = y * np.interp(T(n), [0, 0.0667, 0.25, 0.5], [0.6, 1.0, 0.5, 0.0]); place(y, tick(4001, 4000, None, 0.006, 0.05) * 1.2, 0.0667)
S("wk-subdrop-detail", y, "impact", 0.0667, "808 glide 54 -> 31 Hz with a bright burst on the cut to 'Detail-driven design' (f908)", rev=0.05, length=0.6)
S("wk-blip-clear", uiblip(hz("A9") * 1.002, hz("F#8"), 4101, 0.08, 0.022, 0.6, 0.4), "pop", 0.02, "UI blip 14 + 6 kHz: 'Clear messaging' pops in", rev=0.1, length=0.5)
S("wk-blip-smooth", uiblip(hz("B9") * 0.95, hz("A7") * 1.0, 4201, 0.085, 0.026, 0.45, 0.3), "pop", 0.05, "UI blip 15 + 3.5 kHz: 'Smooth transitions' pops in", rev=0.12, length=0.5)
n = 0.4; y = sweepband(n, 2600, 7000, 2.2, 4301, 1.0) * arc(n, 1.6, 0.35)
S("wk-swish-frame", y, "swipe", 0.12, "soft swish (2-10 kHz) as the line blurs into 'Every frame intentional'", rev=0.12, length=0.6)
n = 0.35; t = T(n); y = sweepband(n, 450, 1600, 1.6, 4401, 1.0) * (t / n) ** 1.8 * np.minimum(1, (n - t) / 0.04)
y += np.sin(2 * np.pi * np.cumsum(np.full(len(t), hz("E5"))) / SR) * (t / n) ** 2.5 * 0.08
S("wk-swell-founders", y, "whoosh", 0.3467, "warm mid swell (300 Hz-2 kHz) as the two founders' portraits blur in", rev=0.2, length=0.8)
S("wk-revswoosh-three", revswoosh(0.38, 4501, 1800, 15000, 0.2, 1.8), "whoosh", 0.43,
  "dense bright reverse swoosh stopping dead at f1003.5, into the '3' on the f1005 kick", rev=0.0, cut=0.38)

# ---- 34-38.5 s: formats, "Built for" ---------------------------------------------------------------------------------
n = 0.72; t = T(n); y = sweepband(n, 900, 5000, 1.4, 4701, 0.6) * arc(n, 1.2, 0.4)
y += np.sin(2 * np.pi * np.cumsum(hz("F#6") * (1 + 0.012 * np.sin(2 * np.pi * 5 * t))) / SR) * arc(n, 1.5, 0.4) * 0.12
S("wk-whoosh-formats", y, "whoosh", 0.0133, "whoosh with a 1.5 kHz (F#6) tonal core as 'Formats for your website and socials' rises in", rev=0.15, length=0.8)
n = 0.15; y = sweepband(n, 3000, 11000, 2.0, 4801, 0.6) * (T(n) / n) ** 1.6 * np.minimum(1, (n - T(n)) / 0.012)
S("wk-swish-builtfor", y, "swipe", 0.2233, "bright swish (2-14 kHz) into the cut to the first 'Built for' (f1065)", rev=0.06, length=0.4)
for k, (note, lo) in enumerate([("C#8", 6500), ("D#8", 7000), ("E8", 7500), ("F#8", 8000), ("G#8", 8500), ("B8", 7200)]):
    n = 0.075 if k < 5 else 0.11
    y = add(band(noise(n, 4901 + k), lo, lo * 1.7, 2) * env_ad(n, 0.0008, 0.012 + 0.002 * k), ping(hz(note), n, 0.014) * 0.22,
            tick(4911 + k, 9000, None, 0.0015, 0.02) * 0.4)
    S(f"wk-built-{k + 1}", y, "ticker", 0.0, f"word-swap tick {k + 1} of 6 (bright noise, centroid ~8-9 kHz, with a faint {note[:-1]} ping): 'Built for' statement {k + 1}",
      rev=0.06, length=0.4)

# ---- 38-42 s: the stop, the WKConversions logo, "Let's talk" -------------------------------------------------------
S("wk-glitch-wkc", glitch(5101, 0.47, 0.1, 5, 6000, 4000, 11, 8500, 13000, 44, 7, 0.133), "glitch", 0.133,
  "glitch swoosh into the WKConversions logo (attack f1149, flash f1153; chirps 6->4 kHz)", rev=0.18, length=1.0)
# the logo sting: an open E6/9 chord (the track's relative major, all C# minor pentatonic) with a shimmer tail; the bright
# layer cuts at 0.82 s (39.25 s) as in the reference, a soft body rings on under the outro pad
n = 2.2; t = T(n)
notes = ["E2", "B2", "E3", "G#3", "C#4", "F#4", "B4", "E5"]
br = supersaw([hz(x) for x in notes[1:]], n, 5201, 0.14, 5, 6500) * 0.5
br *= (np.minimum(1, t / 0.006) * np.exp(-t / 0.9) * np.clip((0.82 - t) / 0.025, 0, 1))[:, None]
body = np.zeros((len(t), 2))
for k, x in enumerate(notes):
    v = np.sin(2 * np.pi * hz(x) * t + k) + 0.25 * np.sin(4 * np.pi * hz(x) * t)
    body[:, k % 2] += v * 0.7; body[:, 1 - k % 2] += v * 0.3
body = np.stack([band(body[:, 0], None, 1800, 2), band(body[:, 1], None, 1800, 2)], 1) * (np.minimum(1, t / 0.01) * np.exp(-t / 0.7))[:, None] * 0.09
sp = Z(n); r = np.random.default_rng(5202)
for k in range(40):
    a = 0.01 + 0.8 * (k / 40) ** 1.2; f = hz(["B7", "C#8", "E8", "F#8", "G#8", "B8"][r.integers(6)])
    place(sp, ping(f, 0.08, 0.025) * (0.25 - 0.2 * a / 0.82), a)
sp *= np.clip((0.82 - t) / 0.02, 0, 1)
bass = sub808(n, hz("E2") * 1.5, hz("E2"), 0, 0.03, 0.002, 0.45, 1.4) * 0.35
S("wk-sting-logo", add(br, body, wide(sp, np.roll(sp, 53)), stereo(bass)), "stinger", 0.0,
  "logo sting: an open E6/9 chord (wide detuned saws) with a C# minor shimmer; the bright layer cuts at 0.82 s (39.25 s)", rev=0.2, length=1.6, decay=0.35)
S("wk-blip-cta", uiblip(hz("E9"), hz("B7"), 5301, 0.11, 0.035, 0.25, 0.15), "pop", 0.0, "soft glassy blip as the 'Let's talk' pill glows on", rev=0.25, length=1.0, decay=0.3)
def padswell(chord, n, peak, seed):
    t = T(n); L, R = np.zeros_like(t), np.zeros_like(t); r = np.random.default_rng(seed)
    for k, x in enumerate(chord):
        for dt in (-0.07, 0.07):
            v = np.sin(2 * np.pi * hz(x) * 2 ** (dt / 12) * t + r.random() * 6) + 0.18 * np.sin(4 * np.pi * hz(x) * 2 ** (dt / 12) * t)
            (L if dt < 0 else R)[:] += v
    e = arc(n, 1.6, peak)
    return wide(band(L, None, 2200, 2) * e, band(R, None, 2200, 2) * e)
S("wk-swell-talk", padswell(["E3", "B3", "F#4", "G#4"], 0.42, 0.55, 5401), "riser", 0.0, "soft warm pad swell (E add9) under 'Let's talk'", rev=0.25, length=1.2, decay=0.35)
S("wk-swell-url", padswell(["C#4", "E4", "G#4", "B4"], 0.58, 0.5, 5501), "riser", 0.0, "second soft pad swell (C#m7) under wkconversions.com", rev=0.25, length=1.2, decay=0.35)

idx_path = "lib/sfx/index.json"
idx = [x for x in (json.load(open(idx_path)) if os.path.exists(idx_path) else []) if not x["id"].startswith("wk-")]
json.dump(idx + items, open(idx_path, "w"), indent=1)
print(len(items), "sounds in", OUT)
