# Makes the sound effects Karl's library doesn't have, so they are royalty-free and their sync point is
# exact: python3 sfx_synth.py <library/sound>   (adds sfx/<category>/gen-*.wav and their index entries)
#   whoosh   a band of noise that sweeps up into the moment of passing and away (camera moves, things
#            flying past, whip pans); sync = the moment of passing
#   riser    noise and a tone climbing into a reveal; sync = the end of the climb (the reveal)
#   impact   a soft low thump with a short click (a landing, a stamp, a logo locking in); sync = the hit
#   stamp    a thud with a paper slap; shimmer  bright partials sparkling (a reveal, a brand moment)
#   swell    soft air swelling and fading (a slow push, a scene breathing in)
# Stereo, 48 kHz, with a small synthetic room. Needs numpy.
# The soft palette (wicflow, Oct 2026): soft whooshes (0.3 s for cards and words, 0.6 s for whips), soft pops in three
# pitches, a crisp cursor click and a soft finger tap, soft ticks, a typing run, a message-sent swoosh, a soft
# message chime, a soft success, soft risers (1 s, 2 s), a soft logo impact, a sparkle, data blips (a scan run and
# one blip) and a low swell: band-limited (nothing above ~8 kHz but air), rounded attacks, tonal sounds on A-major
# pentatonic notes (A B C# E F#: in A major, the found track's key, and in E major, the composed bed's). Every sound's sync and transients are measured from its file with sfx_index.describe(), as sfx_build.py does
# for Karl's: whooshes, swipes and swells land at their loudest moment (20 ms smoothed), risers at the end of their
# climb (by construction), everything else on its first strong transient. Generated ids not listed here are kept.
import json, os, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)

def stft_filter(noise, fc, bw):
    """Noise through a band whose centre (Hz) and width (Hz) follow fc(t), bw(t), per 1024-sample frame."""
    N, H = 2048, 512
    win = np.hanning(N)
    out = np.zeros(len(noise) + N)
    freqs = np.fft.rfftfreq(N, 1 / SR)
    for k, s in enumerate(range(0, len(noise) - N, H)):
        t = (s + N / 2) / len(noise)
        spec = np.fft.rfft(noise[s:s + N] * win)
        c, b = fc(t), bw(t)
        mask = np.exp(-0.5 * ((np.log2(np.maximum(freqs, 20)) - np.log2(c)) / max(b, 1e-3)) ** 2)
        out[s:s + N] += np.fft.irfft(spec * mask) * win
    return out[: len(noise)] / 1.5

def room(x, length=0.8, wet=0.18):
    n = int(length * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir[0] = 0
    y = np.convolve(x, ir)[: len(x) + n] * (wet / np.sqrt(np.sum(ir ** 2)))
    y[: len(x)] += x
    return y

def stereo(f, *a, **k):
    L, R = f(*a, **k), f(*a, **k)       # two independent noise draws: natural width
    m = max(len(L), len(R)); L = np.pad(L, (0, m - len(L))); R = np.pad(R, (0, m - len(R)))
    return np.stack([L, R], 1)

def whoosh(length=0.6, sync=0.38, lo=300, hi=3500):
    n = int(length * SR); t = np.arange(n) / n; ts = sync / length
    noise = rng.standard_normal(n)
    fc = lambda u: lo * (hi / lo) ** (np.exp(-((u - ts) / 0.22) ** 2))
    y = stft_filter(noise, fc, lambda u: 0.9 - 0.4 * np.exp(-((u - ts) / 0.2) ** 2))
    env = np.where(t < ts, (t / ts) ** 2.6, np.exp(-(t - ts) / (1 - ts) * 4.5))
    return room(y * env, 0.5, 0.12)

def riser(length=1.5, lo=180, hi=1400):
    n = int(length * SR); t = np.arange(n) / n
    noise = stft_filter(rng.standard_normal(n), lambda u: 400 * (8 ** u), lambda u: 0.7)
    f = lo * (hi / lo) ** (t ** 1.6)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * (4 + 10 * t) * t * length))
    y = (0.55 * noise + 0.35 * tone) * t ** 2.2
    y[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    return room(y, 0.9, 0.2)

def impact(length=1.2, f0=110, f1=42, click=0.5):
    n = int(length * SR); tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt / 0.045)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.28)
    cl = stft_filter(rng.standard_normal(n), lambda u: 2500, lambda u: 1.2) * np.exp(-tt / 0.012) * click
    return room(0.9 * body + cl, 1.0, 0.15)

def stamp(length=0.7):
    n = int(length * SR); tt = np.arange(n) / SR
    f = 75 + 90 * np.exp(-tt / 0.03)
    thud = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.09)
    slap = stft_filter(rng.standard_normal(n), lambda u: 1800, lambda u: 1.0) * np.exp(-tt / 0.02)
    return room(0.8 * thud + 0.7 * slap, 0.4, 0.1)

def shimmer(length=1.4):
    n = int(length * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    for k in range(9):
        f = 2093 * 2 ** (rng.choice([0, 4, 7, 12, 16, 19, 24]) / 12)
        t0 = k * 0.035; e = np.where(tt > t0, np.exp(-(tt - t0) / 0.35) * (1 - np.exp(-(tt - t0) / 0.004)), 0)
        y += np.sin(2 * np.pi * f * tt) * e * 0.25
    return room(y, 1.4, 0.35)

def swell(length=1.6, peak=0.9):
    n = int(length * SR); t = np.arange(n) / n; tp = peak / length
    y = stft_filter(rng.standard_normal(n), lambda u: 700 + 900 * np.exp(-((u - tp) / 0.3) ** 2), lambda u: 1.4)
    env = np.where(t < tp, np.sin(np.pi / 2 * t / tp) ** 2, np.cos(np.pi / 2 * (t - tp) / (1 - tp)) ** 2)
    return room(y * env, 1.0, 0.2)


# ------------------------------------------------------------------ the soft palette (wicflow, Oct 2026)
def lp(x, fc, order=2):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** (2 * order)), len(x))

def hp(x, fc, order=2):
    X = np.fft.rfft(x); f = np.maximum(np.fft.rfftfreq(len(x), 1 / SR), 1)
    return np.fft.irfft(X / np.sqrt(1 + (fc / f) ** (2 * order)), len(x))

def band(n, lo, hi):
    return hp(lp(rng.standard_normal(n), hi), lo)

def tail(n, fade=0.08):
    """A short fade at the end of a maker's array, so a ringing note is never cut off."""
    w = np.ones(n); k = int(fade * SR); w[-k:] = np.linspace(1, 0, k) ** 2; return w

def ad(tt, attack, decay, t0=0.0):
    """A rounded attack (raised cosine, `attack` s) into an exponential decay (time constant `decay` s), from t0."""
    u = tt - t0
    a = np.where(u < attack, 0.5 - 0.5 * np.cos(np.pi * np.clip(u / max(attack, 1e-4), 0, 1)), 1.0)
    return np.where(u >= 0, a * np.exp(-np.maximum(u - attack, 0) / decay), 0.0)

def soft_whoosh(length=0.32, sync=0.19, lo=380, hi=2400, width=0.8):
    """A whoosh with the hiss taken off: smooth rise, soft fall, band capped near 6 kHz."""
    n = int(length * SR); t = np.arange(n) / n; ts = sync / length
    noise = lp(rng.standard_normal(n), 7000)
    y = stft_filter(noise, lambda u: lo * (hi / lo) ** np.exp(-((u - ts) / 0.25) ** 2), lambda u: width)
    env = np.where(t < ts, np.sin(np.pi / 2 * t / ts) ** 3, np.exp(-(t - ts) / (1 - ts) * 4.0))
    return room(lp(y * env, 6000), 0.5, 0.12)

def soft_pop(hz=660.0):
    """A rounded pop: a sine settling a little upward into its note (no cartoon bloom), a 3 ms attack, a soft body
    an octave down; no click."""
    n = int(0.2 * SR); tt = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(hz * (0.94 + 0.06 * (1 - np.exp(-tt / 0.005)))) / SR
    body = np.sin(ph) * ad(tt, 0.003, 0.04) + 0.3 * np.sin(2 * np.pi * hz / 2 * tt) * ad(tt, 0.002, 0.02)
    return room(body, 0.35, 0.12)

def click():
    """A crisp cursor click: a short band-limited press with a small tonal tick, and its quieter release 65 ms later."""
    n = int(0.15 * SR); tt = np.arange(n) / SR
    def one(t0, a):
        u = np.maximum(tt - t0, 0); on = tt >= t0
        return a * on * (lp(hp(rng.standard_normal(n), 2500), 9000) * np.exp(-u / 0.0007) + 0.25 * np.sin(2 * np.pi * 2900 * u) * np.exp(-u / 0.002)
                         + 0.15 * np.sin(2 * np.pi * 1300 * u) * np.exp(-u / 0.003))
    return room(one(0, 1.0) + one(0.065, 0.3), 0.2, 0.05)

def tap():
    """A soft finger tap: a round low body and a muted touch."""
    n = int(0.15 * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * 330 * tt) * ad(tt, 0.001, 0.018)
    touch = lp(hp(rng.standard_normal(n), 700), 2600) * np.exp(-tt / 0.003) * 0.45
    return room(body * 0.8 + touch, 0.25, 0.06)

def tick(lo=1500.0, hi=5000.0):
    """A soft tick: a 2 ms breath of band noise, like a quiet clock; for counters and stepped lists (no ping)."""
    n = int(0.05 * SR); tt = np.arange(n) / SR
    return room(lp(hp(rng.standard_normal(n), lo), hi) * ad(tt, 0.0002, 0.0018), 0.15, 0.04)

def key_stroke(tt, t0, thock, a):
    """One laptop key: a click, a soft thock under it and a quieter release click."""
    u = tt - t0; on = u >= 0
    cl = np.where(on, np.exp(-np.maximum(u, 0) / 0.0016), 0) * band(len(tt), 1800, 6000)
    th = np.where(on, np.sin(2 * np.pi * thock * np.maximum(u, 0)), 0) * ad(tt, 0.0008, 0.012, t0) * 0.6
    rel = np.where(u >= 0.045, np.exp(-np.maximum(u - 0.045, 0) / 0.0012), 0) * band(len(tt), 2200, 6500) * 0.25
    return a * (cl * 0.7 + th + rel)

def typing(times=(0.0, 0.105, 0.19, 0.315, 0.39, 0.52)):
    """A short typing run, a few keys at a human, uneven pace (a few clicks, not one per letter)."""
    r = np.random.default_rng(11); n = int((times[-1] + 0.3) * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    for k, t0 in enumerate(times):
        y += key_stroke(tt, t0, r.uniform(190, 260), (1.0 if k == 0 else r.uniform(0.65, 0.9)))
    return room(lp(y, 8000), 0.3, 0.08)

def one_key():
    n = int(0.15 * SR); tt = np.arange(n) / SR
    return room(lp(key_stroke(tt, 0.0, 220, 1.0), 8000), 0.3, 0.08)

def send(length=0.45, peak=0.3):
    """Message sent: an airy swoosh that rises and leaves (a tonal glide read as sci-fi; left out)."""
    n = int(length * SR); t = np.arange(n) / n; tp = peak / length
    y = stft_filter(lp(rng.standard_normal(n), 9000), lambda u: 500 * 9 ** min(1.0, u / tp), lambda u: 0.7)
    env = np.where(t < tp, (t / tp) ** 2, np.exp(-(t - tp) / (1 - tp) * 6))
    return room(lp(y * env, 6500), 0.4, 0.1)

def bell(tt, f, t0=0.0, decay=0.45, vel=1.0):
    """A soft bell: few, gentle partials with a 3 ms attack; the upper ones die first."""
    y = np.zeros(len(tt))
    for ratio, amp in ((1.0, 1.0), (2.0, 0.22), (2.76, 0.07), (5.4, 0.025)):
        y += amp * np.sin(2 * np.pi * f * ratio * np.maximum(tt - t0, 0)) * ad(tt, 0.003, decay / ratio ** 0.7, t0)
    return y * vel

def mallet(tt, f, t0, decay, vel):
    u = np.maximum(tt - t0, 0)
    return vel * (np.sin(2 * np.pi * f * u) + 0.22 * np.sin(2 * np.pi * 3.9 * f * u) * np.exp(-u / 0.02)) * ad(tt, 0.0015, decay, t0)

def chime(notes=(1318.51, 1760.0), gap=0.08):
    """A soft two-note glass-mallet chime (E6 up to A6): a message arriving."""
    n = int(2.2 * SR); tt = np.arange(n) / SR
    y = (mallet(tt, notes[0], 0.0, 0.45, 0.8) + mallet(tt, notes[1], gap, 0.55, 0.9)) * tail(n)
    return room(lp(y, 6500), 1.2, 0.28)

def success():
    """A soft success: three rising mallet notes (C#6, E6, A6) over a warm A-major bloom; on the first note."""
    n = int(2.2 * SR); tt = np.arange(n) / SR
    y = mallet(tt, 1108.73, 0.0, 0.22, 0.85) + mallet(tt, 1318.51, 0.08, 0.25, 0.85) + mallet(tt, 1760.0, 0.16, 0.5, 1.0)
    bloom = sum(np.sin(2 * np.pi * f * tt) for f in (220.0, 277.18, 329.63)) * ad(tt, 0.04, 0.35) * 0.12
    return room(lp((y + bloom) * tail(n), 7000), 1.0, 0.2)

def soft_riser(length=1.0):
    """Air climbing into a reveal; sync = the end. (A tonal glide under it was heard as a laser; left out.)"""
    n = int(length * SR); t = np.arange(n) / n
    noise = stft_filter(lp(rng.standard_normal(n), 9000), lambda u: 250 * (3500 / 250) ** (u ** 1.5), lambda u: 1.0 - 0.4 * u)
    y = noise * t ** 2.6
    y[-int(0.025 * SR):] *= np.linspace(1, 0, int(0.025 * SR))
    return room(lp(y, 6500), 0.8, 0.18)

def soft_impact(length=1.6):
    """A soft, deep landing for a logo: a sub thump, a muffled body and a little air; no click."""
    n = int(length * SR); tt = np.arange(n) / SR
    f = 44 + 24 * np.exp(-tt / 0.05)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * ad(tt, 0.003, 0.35)
    body = lp(hp(rng.standard_normal(n), 150), 900) * ad(tt, 0.002, 0.03) * 0.35
    air = lp(hp(rng.standard_normal(n), 1500), 6000) * ad(tt, 0.02, 0.25) * 0.05
    return room(sub * 0.9 + body + air, 1.2, 0.22)

def sparkle(length=2.2, count=14):
    """A brand-moment sparkle: soft sine glints on A-major pentatonic notes (1.3-3 kHz), rising and fading."""
    r = np.random.default_rng(5); n = int(length * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    notes = [1318.51, 1479.98, 1760.0, 1975.53, 2217.46, 2637.02, 2959.96]
    for k in range(count):
        f = notes[min(len(notes) - 1, int(k / count * len(notes) + r.integers(0, 2)))]
        t0 = k * 0.028 + rng.uniform(0, 0.012) * (k > 0)
        y += np.sin(2 * np.pi * f * np.maximum(tt - t0, 0)) * ad(tt, 0.003, r.uniform(0.25, 0.5), t0) * 0.2 * (1 - k / (count * 1.4))
    return room(lp(y * tail(n), 7000), 1.6, 0.35)

def blips(count=7, gap=0.065):
    """Data blips for a scan: short soft sine blips on A-major pentatonic notes, evenly spaced."""
    r = np.random.default_rng(9); n = int((count * gap + 0.25) * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    notes = [1318.51, 1479.98, 1760.0, 1975.53, 2217.46]
    for k in range(count):
        f = notes[r.integers(0, len(notes))]; t0 = k * gap
        u = np.maximum(tt - t0, 0)
        y += (np.sin(2 * np.pi * f * u) + 0.1 * np.sin(4 * np.pi * f * u)) * ad(tt, 0.001, 0.012, t0) * (1.0 if k == 0 else r.uniform(0.6, 0.9))
    return room(lp(y, 8000), 0.3, 0.08)

def blip(hz=1760.0):
    n = int(0.12 * SR); tt = np.arange(n) / SR
    return room(lp((np.sin(2 * np.pi * hz * tt) + 0.1 * np.sin(4 * np.pi * hz * tt)) * ad(tt, 0.001, 0.014), 8000), 0.3, 0.08)

def low_swell(length=2.2, peak=1.2):
    """A low swell: warm low air and a soft sub (A1, A2) breathing up to a peak and away."""
    n = int(length * SR); t = np.arange(n) / n; tp = peak / length; tt = np.arange(n) / SR
    air = stft_filter(rng.standard_normal(n), lambda u: 200 + 220 * np.exp(-((u - tp) / 0.3) ** 2), lambda u: 1.2)
    sub = 0.35 * np.sin(2 * np.pi * 55.0 * tt) + 0.2 * np.sin(2 * np.pi * 110.0 * tt)
    env = np.where(t < tp, np.sin(np.pi / 2 * t / tp) ** 2, np.cos(np.pi / 2 * (t - tp) / (1 - tp)) ** 2)
    return room(lp((air + sub) * env, 2500), 1.0, 0.15)

SPECS = [  # id, category, character, maker, kwargs, sync (s)
    ("gen-whoosh-short", "whoosh", "short, soft pass: a card or a word flying in", whoosh, dict(length=0.45, sync=0.26), 0.26),
    ("gen-whoosh-medium", "whoosh", "medium pass: a camera move, a page pan", whoosh, dict(length=0.8, sync=0.5, lo=220, hi=2800), 0.5),
    ("gen-whoosh-whip", "whoosh", "fast, bright: a whip pan", whoosh, dict(length=0.35, sync=0.17, lo=500, hi=6000), 0.17),
    ("gen-whoosh-deep", "whoosh", "slow, low: a big pull-back or zoom", whoosh, dict(length=1.2, sync=0.8, lo=120, hi=1500), 0.8),
    ("gen-riser-1s", "riser", "one second into a reveal", riser, dict(length=1.0), 1.0),
    ("gen-riser-2s", "riser", "two seconds of build into a reveal", riser, dict(length=2.0), 2.0),
    ("gen-impact-soft", "impact", "soft low thump: a landing, a lock-in", impact, dict(click=0.35), 0.0),
    ("gen-impact-deep", "impact", "deeper, longer: a logo, the end card", impact, dict(length=1.8, f0=90, f1=34, click=0.5), 0.0),
    ("gen-stamp", "impact", "thud with a paper slap: a stamp", stamp, dict(), 0.0),
    ("gen-shimmer", "stinger", "bright sparkle: a reveal, a brand moment", shimmer, dict(), 0.0),
    ("gen-swell", "swipe", "soft air swelling: a slow push, a scene breathing in", swell, dict(), 0.9),
    # the soft palette (wicflow): sync None = measured from the file
    ("gen-whoosh-soft-short", "whoosh", "soft, short pass (0.3 s): a card or a word arriving; no hiss", soft_whoosh, dict(length=0.32, sync=0.19), None),
    ("gen-whoosh-soft-medium", "whoosh", "soft whip (0.6 s): a quick camera whip or a panel flying, rounded", soft_whoosh, dict(length=0.6, sync=0.36, lo=300, hi=3200, width=0.85), None),
    ("gen-pop-soft-1", "pop", "soft rounded pop, A5: a tile, badge or pin landing (first of a run)", soft_pop, dict(hz=880.0), None),
    ("gen-pop-soft-2", "pop", "soft rounded pop, C#6: the second of a run", soft_pop, dict(hz=1108.73), None),
    ("gen-pop-soft-3", "pop", "soft rounded pop, E6: the third of a run", soft_pop, dict(hz=1318.51), None),
    ("gen-click", "tap", "crisp cursor click: the product's UI voice, a button pressed", click, dict(), None),
    ("gen-tap-soft", "tap", "soft finger tap: a touch on a phone screen, round and muted", tap, dict(), None),
    ("gen-tick-soft", "ticker", "soft tick, a 2 ms breath of noise like a quiet clock: a counter step, a stepped list item", tick, dict(), None),
    ("gen-tick-soft-hi", "ticker", "soft tick, brighter: alternate with gen-tick-soft", tick, dict(lo=2200.0, hi=7000.0), None),
    ("gen-typing-run", "ticker", "a few laptop keys at a human pace (6 keys in 0.5 s): a type-on's start", typing, dict(), None),
    ("gen-key", "tap", "one soft laptop key", one_key, dict(), None),
    ("gen-send", "swipe", "message sent: an airy rising swoosh, peaks at the send", send, dict(), None),
    ("gen-chime-soft", "chime", "soft two-note glass-mallet chime (E6 up to A6): a message arriving", chime, dict(), None),
    ("gen-success-soft", "success", "soft success: three rising mallet notes (C#6 E6 A6) over a warm chord; syncs on the first", success, dict(), None),
    ("gen-riser-soft-1s", "riser", "soft riser, 1 s: air climbing into a reveal; sync = the reveal", soft_riser, dict(length=1.0), 1.0),
    ("gen-riser-soft-2s", "riser", "soft riser, 2 s: a longer airy build into a reveal", soft_riser, dict(length=2.0), 2.0),
    ("gen-impact-logo", "impact", "soft deep landing for the logo: sub thump, muffled body, no click", soft_impact, dict(), None),
    ("gen-sparkle", "stinger", "soft sparkle: pentatonic glints rising and fading (a brand moment)", sparkle, dict(), None),
    ("gen-data-blips", "data", "a scan: 7 soft blips 65 ms apart (data found, an AI working)", blips, dict(), None),
    ("gen-blip", "data", "one soft data blip", blip, dict(), None),
    ("gen-swell-low", "swipe", "low swell: warm low air and sub breathing up to 1.2 s (a slow push, a scene opening)", low_swell, dict(), None),
]

def write(path, y):
    y = y / (np.abs(y).max() + 1e-9) * 0.7
    pcm = (np.clip(y, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

def main():
    lib = sys.argv[1]
    idx_path = os.path.join(lib, "sfx", "index.json")
    ours = {sp[0] for sp in SPECS}
    idx = [o for o in json.load(open(idx_path)) if o["id"] not in ours]     # other generated ids are kept
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from sfx_index import describe, decode
    for o in idx:                                      # kept generated sounds: transients and loudness measured
        if o["id"].startswith("gen-") and os.path.exists(os.path.join(lib, o["file"])):
            d = describe(decode(os.path.join(lib, o["file"])))
            o.update(transients=[float(v) for v in d["transients"]] or [o["sync"]], lufs=d["lufs"], hits=d["hits"], brightness_hz=d["brightness_hz"])
    for sid, cat, character, maker, kw, sync in SPECS:
        y = stereo(maker, **kw)
        rel = os.path.join("sfx", cat, sid + ".wav"); os.makedirs(os.path.join(lib, "sfx", cat), exist_ok=True)
        write(os.path.join(lib, rel), y)
        m = (y / (np.abs(y).max() + 1e-9) * 0.7).mean(axis=1).astype(np.float32)
        pad = int(0.05 * SR)                           # measured with 50 ms of silence before it, so a hit at 0 counts
        d = describe(np.concatenate([np.zeros(pad, np.float32), m]))
        for k in ("sync", "hit", "onset"): d[k] = round(max(0.0, d[k] - 0.05), 3)
        d["transients"] = [round(max(0.0, float(v) - 0.05), 3) for v in d["transients"]]
        if cat in ("whoosh", "swipe"):                 # the loudest moment, on a 20 ms smoothed envelope
            e = np.sqrt(np.convolve(m.astype(np.float64) ** 2, np.ones(960) / 960, "same"))
            measured = round(float(np.argmax(e)) / SR, 3)
            d["transients"], d["hits"] = [measured], 1
        elif cat == "riser":
            measured = sync                            # the end of the climb, by construction
            d["transients"], d["hits"] = [sync], 1
        else:                                          # the first strong transient, taken where the envelope first
            mp = np.concatenate([np.zeros(pad, np.float32), m]); hop = 240   # comes within 3 dB of that hit's maximum
            env = np.sqrt(np.mean(mp[: len(mp) // hop * hop].reshape(-1, hop).astype(np.float64) ** 2, axis=1) + 1e-12)
            env = np.convolve(env, np.ones(3) / 3, "same")              # 15 ms: a low thump's cycles don't stop the walk
            k = int(round((d["sync"] + 0.05) * SR / hop)); j = k
            while j > max(0, k - 12) and env[j - 1] >= env[k] / 1.41: j -= 1
            measured = round(max(0.0, j * hop / SR - 0.05), 3)  # (a room's build-up can put the maximum 30 ms late)
        if sync is not None and cat != "riser" and abs(sync - measured) > 0.02:
            print(f"  {sid}: designed sync {sync:.3f} s, measured {measured:.3f} s; the index takes the measurement")
        trans = [float(v) for v in d["transients"]] or [measured]
        idx.append({"id": sid, "file": rel, "category": cat, "character": character, "licence": "generated", "sync": measured,
                    "transients": trans, "length": round(len(y) / SR, 3), "lufs": d["lufs"], "hits": d["hits"],
                    "brightness_hz": d["brightness_hz"], "original": ["scripts/sfx_synth.py"]})
    json.dump(idx, open(idx_path, "w"), indent=1)
    cat_path = os.path.join(lib, "catalogue.md")
    text = open(cat_path).read().split("\n## generated")[0].rstrip() + "\n\n## generated\n\nMade by `scripts/sfx_synth.py` for what the folder lacks; royalty-free. `sync` (s from the file's start) is measured from\neach file: whooshes and swipes at their loudest moment, risers at the end of the climb, the rest on the first strong transient.\n\n"
    text += "| id | category | character | sync s | length s |\n|---|---|---|---|---|\n"
    text += "\n".join(f"| `{o['id']}` | {o['category']} | {o['character']} | {o['sync']:.3f} | {o['length']:.2f} |" for o in idx if o["id"].startswith("gen-")) + "\n"
    open(cat_path, "w").write(text)
    print(f"{len(SPECS)} generated sounds added to {lib}/sfx")

main()
