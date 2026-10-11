# "Iris's Waltz": the original score for the Tale Forge film v2, written for the picture and played by a
# sampled chamber orchestra (VSCO 2 Community Edition, CC0 / public domain: harp, glockenspiel, flute, oboe,
# clarinet, horn, string sections, pizzicato, triangle, suspended cymbal). No third-party music; nothing to credit.
#   python3 -I score_v2.py <VSCO-2-CE root> <out.wav> [--stems dir]
#
# Form (film time; each section starts on the VO phrase it carries, the tempo of each section is set so its bar
# lines land there):
#   intro     0.00  2 bars  music box: glock and harp over soft strings (Iris walks home)
#   tender    3.40  6 bars  B minor: the theme's first notes in the clarinet over soft strings ("didn't let me play")
#   magic    13.10  free    glock and harp glissandi rise, the cymbal swells and D major opens on "story" (14.20)
#   waltz in 14.90  4 bars  pizzicato oom-pah-pah, a glock motif, a harp sweep into "adventure"
#   theme A  20.35 10 bars  the waltz tune: flute over violins, harp, pizzicato bass ("inside the story")
#   theme A' 34.10  8 bars  the answer: violins lead, horn counter-line ("one small decision" .. "ends")
#   quiet    45.35  4 bars  harp and soft strings, oboe ("What do you think our friend needed?")
#   wonder   51.35  5 bars  the tune grows, harp in flowing eighths, glock sparkle ("more adventures")
#   morning  58.20  2 bars  crescendo, cymbal swell into the logo
#   finale   60.75  5 bars  tutti on "Tale Forge", the tune once more, settling under the last lines
#   end      67.75          D major rings out with a harp roll and the glock
import os, re, sys, glob, subprocess, wave
import numpy as np
from scipy.signal import fftconvolve, resample_poly, butter, sosfilt

SR = 48000
LEN = 70.0
ROOT = sys.argv[1]
OUT = sys.argv[2]
rng = np.random.default_rng(11)

# ----------------------------------------------------------------------------------------------- the tempo map
SECTIONS = [  # (start s, bars, bar length s)
    (0.00, 2, 1.70), (3.40, 6, 9.70 / 6), (13.10, 1, 1.80), (14.90, 4, 5.45 / 4), (20.35, 10, 13.75 / 10),
    (34.10, 8, 11.25 / 8), (45.35, 4, 1.50), (51.35, 5, 6.85 / 5), (58.20, 2, 2.55 / 2), (60.75, 5, 1.40), (67.75, 1, 2.25),
]
BAR = []
for s0, n, d in SECTIONS:
    BAR += [(s0 + i * d, d) for i in range(n)]

def at(bar, beat=0.0):
    """time of a beat (0-based, may be fractional) in a bar"""
    s, d = BAR[bar]
    return s + beat * d / 3

def beats(bar, n):
    return n * BAR[bar][1] / 3

# ----------------------------------------------------------------------------------------------- the samples
NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
INST = {  # folder, octave offset of its file names (most of VSCO names middle C "C3"; the harp names it "C4"), pan, kind
    "harp":   ("Strings/Harp", 0, -0.35, "pluck"),
    "glock":  ("Percussion/Glock", 12, 0.30, "pluck"),
    "flute":  ("Woodwinds/Flute/susvib", 12, -0.08, "sus"),
    "fl_st":  ("Woodwinds/Flute/stac", 12, -0.08, "pluck"),
    "oboe":   ("Woodwinds/Oboe/Vib", 12, 0.05, "sus"),
    "clar":   ("Woodwinds/Clarinet/susLong", 12, 0.12, "sus"),
    "horn":   ("Brass/F Horn/sus", 12, 0.22, "sus"),
    "vln":    ("Strings/Violin Section/susVib", 12, -0.45, "sus"),
    "vla":    ("Strings/Viola Section/susvib", 12, 0.18, "sus"),
    "vc":     ("Strings/Cello Section/susvib", 12, 0.42, "sus"),
    "vln_pz": ("Strings/Violin Section/Pizz", 12, -0.40, "pluck"),
    "vc_pz":  ("Strings/Cello Section/pizzT", 12, 0.38, "pluck"),
    "cb_pz":  ("Strings/Solo Contrabass/Pizz", 12, 0.50, "pluck"),
}
_cache = {}

def load(path):
    if path not in _cache:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
        x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
        m = np.abs(x).max(axis=1); pk = m.max() + 1e-9
        on = int(np.argmax(m > pk * 0.03))                  # trim the silence before the attack
        _cache[path] = x[max(0, on - int(0.004 * SR)):]
    return _cache[path]

def catalogue(name):
    folder, off, _, _ = INST[name]
    out = []
    for p in glob.glob(os.path.join(ROOT, folder, "*.wav")):
        b = os.path.basename(p)
        m = re.search(r"_([A-G][#b]?)(\d)(?=[_.])", b)
        if not m: continue
        midi = 12 * (int(m.group(2)) + 1) + NOTE[m.group(1)] + off
        v = re.search(r"_v(\d)", b); v = int(v.group(1)) if v else 1
        if "_f." in b or "_f_" in b: v = max(v, 3)
        out.append((midi, v, p))
    return out

CAT = {k: catalogue(k) for k in INST}
_rr = {}

def pick(name, midi, vel):
    cands = CAT[name]
    best = min(abs(c[0] - midi) for c in cands)
    near = [c for c in cands if abs(c[0] - midi) == best]
    layers = sorted({c[1] for c in near})
    want = layers[0] if vel < 0.7 or len(layers) == 1 else layers[1]      # under a voice: the softest layer; louder layers only at the top
    near = [c for c in near if c[1] == want]
    k = _rr.get((name, midi), 0); _rr[(name, midi)] = k + 1                # alternate round robins
    return near[k % len(near)]

_shift = {}

def shifted(x, semis):
    if abs(semis) < 0.01: return x
    key = (id(x), len(x), round(semis, 3))
    if key in _shift: return _shift[key]
    # resample by a rational close to 2^(semis/12): played back at SR the pitch moves by semis
    r = 2 ** (semis / 12); up, down = 1000, int(round(1000 * r))
    _shift[key] = np.stack([resample_poly(x[:, k], up, down) for k in range(2)], 1)
    return _shift[key]

STEMS = {}

def bus(name):
    if name not in STEMS: STEMS[name] = np.zeros((int(LEN * SR) + SR * 4, 2))
    return STEMS[name]

def note(inst, midi, t, dur, vel=0.6, stem=None, att=None, rel=None, pan=None):
    folder, off, p0, kind = INST[inst]
    smidi, _, path = pick(inst, midi, vel)
    x = load(path)
    if kind == "sus":
        x = shifted(x, midi - smidi)
        att = 0.06 if att is None else att; rel = 0.45 if rel is None else rel
        n = int((dur + rel) * SR); x = x[:n].copy()
        if len(x) < n: x = np.pad(x, ((0, n - len(x)), (0, 0)))
        a = int(att * SR); x[:a] *= np.linspace(0, 1, a)[:, None] ** 1.5
        r0 = int(dur * SR); x[r0:] *= np.cos(np.linspace(0, np.pi / 2, n - r0))[:, None] ** 2
    else:
        x = shifted(x, midi - smidi)
        if rel is not None:                                   # damp a ringing note after dur + rel
            n = int((dur + rel) * SR); x = x[:n].copy(); r0 = int(dur * SR)
            if len(x) > r0: x[r0:] *= np.cos(np.linspace(0, np.pi / 2, len(x) - r0))[:, None] ** 2
    g = vel ** 1.4
    pan = p0 if pan is None else pan
    gl, gr = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    y = x * g * np.array([min(1, gl), min(1, gr)])
    b = bus(stem or {"flute": "melody", "fl_st": "melody", "oboe": "melody", "clar": "melody"}.get(inst, inst))
    s = int(round(t * SR)); e = min(len(b), s + len(y))
    b[s:e] += y[: e - s]

def sample(path, t, gain=1.0, stem="perc", peak_at=None, pan=0.0):
    """a one-shot sample at t; with peak_at, the loudest moment of it lands at t instead (cymbal swells)"""
    x = load(os.path.join(ROOT, path))
    s = int(round(t * SR))
    if peak_at is not None:
        c = np.concatenate([[0], np.cumsum(np.abs(x).mean(1))]); env = c[2400:] - c[:-2400]
        s -= int(np.argmax(env)) + 1200
    b = bus(stem); a0 = max(0, -s); s = max(0, s); e = min(len(b), s + len(x) - a0)
    gl, gr = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    b[s:e] += x[a0: a0 + e - s] * gain * np.array([min(1, gl), min(1, gr)])

# ----------------------------------------------------------------------------------------------- harmony
N = lambda s: (lambda m: 12 * (int(m.group(2)) + 1) + NOTE[m.group(1)])(re.match(r"([A-G][#b]?)(-?\d)", s))
CH = {  # root position pitch classes over a bass note
    "D": ("D", ["D", "F#", "A"]), "G": ("G", ["G", "B", "D"]), "A": ("A", ["A", "C#", "E"]), "A7": ("A", ["A", "C#", "E", "G"]),
    "Bm": ("B", ["B", "D", "F#"]), "Em": ("E", ["E", "G", "B"]), "Em7": ("E", ["E", "G", "B", "D"]), "Gmaj7": ("G", ["G", "B", "D", "F#"]),
    "D/F#": ("F#", ["D", "F#", "A"]), "Asus": ("A", ["A", "D", "E"]), "F#": ("F#", ["F#", "A#", "C#"]), "F#m": ("F#", ["F#", "A", "C#"]),
}

def tones(ch, lo, hi):
    pcs = {NOTE[p] for p in CH[ch][1]}
    return [m for m in range(N(lo), N(hi) + 1) if m % 12 in pcs]

def bass(ch, octave=2):
    return N(f"{CH[ch][0]}{octave}") if N(f"{CH[ch][0]}{octave}") >= N("C2") else N(f"{CH[ch][0]}{octave + 1}")

def pad(bar, nbars, ch, vel, parts=("vla", "vc"), att=0.35, rel=0.8, lo="A3", hi="F#4", vln=None):
    t, d = at(bar), sum(BAR[b][1] for b in range(bar, bar + nbars))
    if "vc" in parts: note("vc", bass(ch, 2) + (12 if bass(ch, 2) < N("D2") else 0), t, d, vel, stem="strings", att=att, rel=rel)
    if "vla" in parts:
        for m in tones(ch, lo, hi)[:3]: note("vla", m, t, d, vel * 0.85, stem="strings", att=att, rel=rel)
    if vln:
        for m in tones(ch, vln[0], vln[1])[:3]: note("vln", m, t, d, vel * 0.8, stem="strings", att=att, rel=rel)

def oompah(bar, ch, vel, high=True):
    """the waltz: bass on one, a pizzicato chord on two and three"""
    b = bass(ch, 2)
    note("vc_pz", b + 12 if b < N("E2") else b, at(bar, 0), 0.6, vel, stem="pizz")
    note("cb_pz", b, at(bar, 0), 0.6, vel * 0.8, stem="pizz")
    up = tones(ch, "A3", "F#4")[:3] if high else tones(ch, "F#3", "D4")[:3]
    for k in (1, 2):
        for m in up: note("vln_pz", m, at(bar, k) + rng.uniform(-0.006, 0.006), 0.3, vel * (0.78 if k == 1 else 0.68), stem="pizz")

def arp(bar, ch, vel, lo="D3", n=6, up=True, inst="harp", stem="harp", start=0.0, step=0.5):
    """harp arpeggio in eighths through the chord from lo upwards (or down)"""
    ts = tones(ch, lo, "A6")
    seq = ts[:n] if up else ts[:n][::-1]
    for i, m in enumerate(seq):
        note(inst, m, at(bar, start + i * step), 1.0, vel * (0.9 + 0.1 * ((i + 1) % 2)), stem=stem)

def gliss(t_end, lo, hi, dur, vel, scale="D", inst="harp", stem="harp", down=False):
    """a harp (or glock) glissando over the D major scale from lo to hi, its last note on t_end"""
    pcs = {0: [2, 4, 6, 7, 9, 11, 1], 1: [2, 4, 6, 9, 11]}[0 if scale == "D" else 1]
    ms = [m for m in range(N(lo), N(hi) + 1) if m % 12 in pcs]
    if down: ms = ms[::-1]
    for i, m in enumerate(ms):
        k = i / max(1, len(ms) - 1)
        note(inst, m, t_end - dur + dur * (k ** 0.85 if not down else k), 1.2, vel * (0.55 + 0.45 * k if not down else 1 - 0.4 * k), stem=stem)

def tune(inst, bar, notes, vel, stem="melody", leg=1.0, att=0.05, rel=0.3, oct=0):
    """a melody: notes as (pitch, beats) running on from beat 0 of bar"""
    b, beat = bar, 0.0
    for p, n in notes:
        if p != "-":
            note(inst, N(p) + oct, at(b, beat), beats(b, n) * leg, vel, stem=stem, att=att, rel=rel)
        beat += n
        while beat >= 3 - 1e-9: beat -= 3; b += 1

# ----------------------------------------------------------------------------------------------- the score
GL = "Miscellania Raw/Misc 2/glock_glisses/"
P = "Percussion/"

# intro (bars 0-1): a music box under the stars; Iris walks home in pizzicato steps
note("vla", N("A3"), at(0), beats(0, 6), 0.35, stem="strings", att=0.8, rel=0.8)
note("vc", N("D3"), at(0), beats(0, 6), 0.32, stem="strings", att=0.8, rel=0.8)
tune("glock", 0, [("A5", 1), ("D6", 1), ("F#6", 1), ("A6", 2), ("F#6", 1)], 0.50, stem="glock")
arp(0, "D", 0.50, lo="D3", n=6)
arp(1, "Gmaj7", 0.48, lo="G3", n=6)
# (Iris's hops and the door are effects, on their frames: sound/v2/cues.json)

# tender (bars 2-7): B minor; the theme's first notes, sighing in the clarinet; soft strings; single harp notes
TENDER = ["Bm", "G", "Em7", "Asus", "D/F#", "Gmaj7"]
for i, ch in enumerate(TENDER):
    b = 2 + i
    pad(b, 1, ch, 0.27 + 0.02 * i, att=0.5, rel=1.0)
    note("harp", bass(ch, 2) + 12, at(b, 0), 2, 0.42, stem="harp")
    for k, m in enumerate(tones(ch, "F#3", "E4")[:2]): note("harp", m, at(b, 1 + k), 1, 0.30, stem="harp")
note("vla", N("C#4"), at(5, 1.8), beats(5, 1.2), 0.30, stem="strings", att=0.3, rel=0.6)    # Asus resolves: the warm turn
tune("clar", 2, [("B4", 1), ("D5", 1), ("F#5", 1), ("G5", 2), ("D5", 1), ("E5", 2), ("B4", 1), ("C#5", 3)], 0.36, rel=0.5)
tune("flute", 6, [("D5", 1), ("F#5", 1), ("A5", 1), ("F#5", 3)], 0.30, rel=0.8)               # the golden thread

# magic (bar 8, 13.10-14.90): night falls, a story opens on "story" (14.20)
STORY = 14.20
note("vc", N("D3"), 13.10, 1.8, 0.30, stem="strings", att=0.6, rel=0.6)
note("vla", N("A3"), 13.10, 1.1, 0.30, stem="strings", att=0.6, rel=0.4)
note("vla", N("G4"), 13.10, 1.1, 0.26, stem="strings", att=0.6, rel=0.4)
gliss(STORY - 0.04, "D3", "D6", 0.95, 0.42)
sample(GL + "glock_fx_up_pentatonic_med_01.wav", STORY, 0.30, stem="glock", peak_at=True, pan=0.35)
sample(P + "susCymb1-cresc-Short_v1.wav", STORY, 0.20, stem="perc", peak_at=True)
for m, v in [(N("D3"), 0.42), (N("A3"), 0.40), (N("F#4"), 0.40), (N("D4"), 0.38)]:
    note("vla" if m >= N("C3") else "vc", m, STORY, 14.95 - STORY + 0.4, v, stem="strings", att=0.08, rel=0.9)
for m in (N("A4"), N("D5"), N("F#5")): note("vln", m, STORY, 14.95 - STORY + 0.3, 0.38, stem="strings", att=0.1, rel=0.9)
note("flute", N("A5"), STORY + 0.02, 0.8, 0.30, att=0.15, rel=0.6)
note("glock", N("D6"), STORY, 1, 0.45, stem="glock"); note("glock", N("A6"), STORY + 0.18, 1, 0.35, stem="glock")
sample(P + "Triangle3-Hit_v1_rr1_Sum.wav", STORY, 0.16, pan=0.4)

# waltz in (bars 9-12, 14.90-20.35): "With Tale Forge, a small moment from today can become..."
WIN = ["D", "Bm", "G", "A7"]
for i, ch in enumerate(WIN):
    oompah(9 + i, ch, 0.46 + 0.04 * i)
    pad(9 + i, 1, ch, 0.24 + 0.03 * i, att=0.3, rel=0.6)
tune("glock", 9, [("A5", 1), ("D6", 1), ("F#6", 1), ("A6", 3)], 0.34, stem="glock")
tune("fl_st", 11, [("D5", 1), ("G5", 1), ("B5", 1)], 0.34)
tune("flute", 12, [("C#6", 1), ("E6", 0.5), ("-", 1.5)], 0.30, rel=0.3)
gliss(at(13) - 0.03, "A3", "A5", beats(12, 2), 0.46)                              # into "adventure"
sample(P + "susCymb1-cresc-Short_v1.wav", at(13), 0.16, peak_at=True)

# theme A (bars 13-22, 20.35-34.10): the waltz tune
A_CH = ["D", "D", "G", "A7", "D", "Bm", "Em", "D", "G", "A7"]
for i, ch in enumerate(A_CH):
    b = 13 + i
    oompah(b, ch, 0.50)
    pad(b, 1, ch, 0.28, att=0.25, rel=0.5)
note("vla", N("A3"), at(19, 1.5), beats(19, 1.5), 0.26, stem="strings", att=0.2, rel=0.4)    # Em -> A7 in bar 19
note("vla", N("G4"), at(19, 1.5), beats(19, 1.5), 0.26, stem="strings", att=0.2, rel=0.4)
THEME_A = [("A4", 1), ("D5", 1), ("F#5", 1), ("A5", 2), ("F#5", 1), ("G5", 2), ("B5", 1), ("A5", 1.5), ("G5", 0.5), ("E5", 1),
           ("F#5", 1), ("A5", 1), ("D6", 1), ("B5", 2), ("F#5", 1), ("G5", 1), ("E5", 1), ("C#5", 1), ("D5", 3)]
tune("flute", 13, THEME_A, 0.46, rel=0.25, leg=0.92)
tune("vln", 13, THEME_A, 0.30, stem="strings", oct=-12, att=0.08, rel=0.3)
tune("glock", 14, [("A6", 3)], 0.26, stem="glock"); tune("glock", 18, [("B6", 3)], 0.26, stem="glock")
arp(16, "A7", 0.36, lo="A3", n=6); arp(20, "D", 0.40, lo="D3", n=6)
tune("glock", 21, [("B5", 1), ("D6", 1), ("G6", 1)], 0.34, stem="glock")                       # "because their choices..."
tune("flute", 22, [("E5", 1), ("G5", 1), ("C#6", 1)], 0.40, rel=0.2)
gliss(at(23) - 0.03, "A4", "A6", beats(22, 1.5), 0.30, inst="glock", stem="glock")

# theme A' (bars 23-30, 34.10-45.35): violins lead, the horn answers; it settles on "ends"
B_CH = ["G", "D", "Em", "A", "D", "G", "A7", "D"]
for i, ch in enumerate(B_CH):
    b = 23 + i
    oompah(b, ch, 0.48 if i < 7 else 0.36)
    pad(b, 1, ch, 0.30, att=0.25, rel=0.6)
THEME_B = [("B5", 2), ("G5", 1), ("A5", 2), ("F#5", 1), ("G5", 1), ("E5", 1), ("B4", 1), ("A4", 2), ("C#5", 1),
           ("D5", 1), ("F#5", 1), ("A5", 1), ("B5", 1), ("D6", 1), ("B5", 1), ("A5", 1), ("G5", 1), ("E5", 1), ("D5", 3)]
tune("vln", 23, THEME_B, 0.44, stem="strings", att=0.1, rel=0.35)
tune("flute", 27, THEME_B[9:], 0.32, rel=0.3, leg=0.9)
tune("horn", 23, [("D4", 3), ("D4", 3), ("B3", 3), ("C#4", 3), ("A3", 3), ("B3", 3), ("C#4", 3), ("D4", 3)], 0.30, stem="horn", att=0.25, rel=0.6)
arp(26, "A", 0.38, lo="A3"); arp(29, "A7", 0.34, lo="A3")
note("harp", N("D3"), at(30), 3, 0.38, stem="harp"); note("harp", N("A3"), at(30, 0.33), 3, 0.34, stem="harp")
note("harp", N("F#4"), at(30, 0.66), 3, 0.34, stem="harp"); note("harp", N("D5"), at(30, 1.0), 3, 0.32, stem="harp")
note("glock", N("F#6"), at(30, 1.0), 2, 0.26, stem="glock")

# quiet (bars 31-34, 45.35-51.35): the conversation; harp eighths, soft strings, the oboe
Q_CH = ["G", "D/F#", "Em7", "Asus"]
for i, ch in enumerate(Q_CH):
    b = 31 + i
    pad(b, 1, ch, 0.30, att=0.5, rel=0.9, vln=("D4", "B4"))
    arp(b, ch, 0.34, lo="G3" if i == 0 else ("F#3" if i == 1 else ("E3" if i == 2 else "A3")), n=6)
note("vla", N("C#4"), at(34, 1.6), beats(34, 1.4), 0.28, stem="strings", att=0.3, rel=0.7)
tune("oboe", 31, [("B4", 2), ("D5", 1), ("A4", 3), ("G4", 1), ("B4", 1), ("E5", 1), ("E5", 2), ("C#5", 1)], 0.34, rel=0.5)

# wonder (bars 35-39, 51.35-58.20): the tune grows; flowing harp, glock sparkle, the horn holds it up
W_CH = ["D", "Bm", "G", "Em", "A7"]
for i, ch in enumerate(W_CH):
    b = 35 + i
    v = 0.40 + 0.06 * i
    oompah(b, ch, v - 0.06)
    pad(b, 1, ch, v - 0.04, att=0.2, rel=0.5, vln=("A4", "F#5"))
    arp(b, ch, v - 0.04, lo={"D": "D4", "Bm": "B3", "G": "G3", "Em": "E4", "A7": "A3"}[ch], n=6)
tune("flute", 35, [("F#5", 1), ("A5", 1), ("D6", 1), ("B5", 2), ("F#5", 1), ("G5", 1), ("B5", 1), ("D6", 1), ("E6", 2), ("B5", 1), ("C#6", 1), ("E6", 1), ("G6", 1)], 0.44, rel=0.3, leg=0.92)
tune("horn", 35, [("A3", 3), ("B3", 3), ("D4", 3), ("E4", 3), ("E4", 3)], 0.32, stem="horn", att=0.2, rel=0.5)
for b, ps in [(35, ["D6", "A6"]), (37, ["G6", "D7"]), (38, ["E6", "B6"])]:
    for k, p in enumerate(ps): note("glock", N(p), at(b, 2 + k * 0.5), 1, 0.24, stem="glock")

# morning (bars 40-41, 58.20-60.75): crescendo into the logo
for i, ch in enumerate(["G", "A7"]):
    b = 40 + i
    oompah(b, ch, 0.58 + 0.06 * i)
    pad(b, 1, ch, 0.50 + 0.06 * i, att=0.15, rel=0.4, vln=("B4", "G5"))
    arp(b, ch, 0.52, lo="G3" if i == 0 else "A3", n=6)
tune("flute", 40, [("G5", 1), ("B5", 1), ("D6", 1), ("A5", 1), ("C#6", 1), ("E6", 1)], 0.50, rel=0.2)
tune("horn", 40, [("B3", 3), ("C#4", 3)], 0.40, stem="horn", att=0.15, rel=0.3)
sample(P + "susCymb1-cresc-Median_v1.wav", at(42), 0.24, peak_at=True)
gliss(at(42) - 0.03, "D3", "D6", beats(41, 1.6), 0.48)
sample(GL + "glock_fx_up_chromatic_fast_01.wav", at(42), 0.22, stem="glock", peak_at=True, pan=0.35)

# finale (bars 42-46, 60.75-67.75): tutti on "Tale Forge", the tune once more, settling under the last lines
F_CH = ["D", "G", "D/F#", "Em", "A7"]
for i, ch in enumerate(F_CH):
    b = 42 + i
    v = [0.62, 0.52, 0.48, 0.44, 0.38][i]
    oompah(b, ch, v - 0.08)
    pad(b, 1, ch, v - 0.06, att=0.12 if i == 0 else 0.25, rel=0.6, vln=("A4", "F#5"))
note("vc", N("D2"), at(42), beats(42, 3), 0.55, stem="strings", att=0.02, rel=0.8)
for m in (N("D3"), N("A3"), N("D4"), N("F#4"), N("A4"), N("D5")): note("harp", m, at(42) + 0.012 * (m - 50), 2, 0.52, stem="harp")
note("glock", N("D6"), at(42), 2, 0.46, stem="glock"); note("glock", N("A6"), at(42, 1), 2, 0.30, stem="glock")
sample(P + "Triangle3-Hit_v2_rr1_Sum.wav", at(42), 0.20, pan=0.4)
tune("flute", 42, [("F#5", 1), ("A5", 1), ("D6", 1), ("B5", 2), ("G5", 1), ("A5", 2), ("F#5", 1), ("G5", 1), ("E5", 1), ("B5", 1), ("A5", 2), ("G5", 1)], 0.44, rel=0.3, leg=0.92)
tune("vln", 42, [("F#5", 1), ("A5", 1), ("D6", 1), ("B5", 2), ("G5", 1)], 0.36, stem="strings", oct=-12, att=0.1, rel=0.3)
tune("horn", 42, [("A3", 3), ("B3", 3), ("A3", 3), ("G3", 3), ("G3", 3)], 0.34, stem="horn", att=0.2, rel=0.5)
arp(44, "D/F#", 0.36, lo="F#3"); arp(46, "A7", 0.32, lo="A3")

# end (67.75-70): D major rings out; a harp roll up, the glock, a triangle
END = at(47)
for m, v in [(N("D3"), 0.40), (N("A3"), 0.36), (N("F#4"), 0.36)]: note("vla" if m >= N("C3") else "vc", m, END, 2.0, v, stem="strings", att=0.15, rel=1.4)
note("vc", N("D2") + 12, END, 2.0, 0.40, stem="strings", att=0.15, rel=1.4)
for m in (N("A4"), N("D5")): note("vln", m, END, 2.0, 0.32, stem="strings", att=0.2, rel=1.4)
note("flute", N("F#5"), END, 1.6, 0.34, att=0.12, rel=1.2)
for i, m in enumerate([N(p) for p in ("D3", "A3", "D4", "F#4", "A4", "D5", "F#5", "A5")]): note("harp", m, END + i * 0.07, 2, 0.40, stem="harp")
note("glock", N("D6"), END + 0.56, 2, 0.36, stem="glock"); note("glock", N("F#6"), END + 0.9, 2, 0.24, stem="glock")
sample(P + "Triangle3-Hit_v1_rr2_Sum.wav", END + 0.56, 0.14, pan=0.4)

# ----------------------------------------------------------------------------------------------- mix
def lufs(x):
    import pyloudnorm as pyln
    l = pyln.Meter(SR).integrated_loudness(x)
    return l if np.isfinite(l) else -70

# each section of the orchestra to its own level (relative LUFS), then a hall
LEVEL = {"melody": -21.0, "strings": -22.0, "harp": -22.5, "pizz": -26.0, "glock": -26.0, "horn": -26.5, "perc": -30.0}
WET = {"melody": 0.28, "strings": 0.32, "harp": 0.38, "pizz": 0.20, "glock": 0.42, "horn": 0.35, "perc": 0.35}

def hall(n_s=2.6):
    n = int(n_s * SR); t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for k in range(2):
        bright = rng.standard_normal(n) * np.exp(-t * 6.9 / 1.1)
        dark = sosfilt(butter(2, 3500, "low", fs=SR, output="sos"), rng.standard_normal(n)) * np.exp(-t * 6.9 / 2.4)
        ir[:, k] = 0.45 * bright + dark
    pre = int(0.022 * SR); ir = np.vstack([np.zeros((pre, 2)), ir])
    return ir / np.sqrt((ir ** 2).sum(axis=0))

IR = hall()
mix_dry, mix_wet = 0, 0
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
stem_dir = sys.argv[sys.argv.index("--stems") + 1] if "--stems" in sys.argv else None
for name, x in STEMS.items():
    g = 10 ** ((LEVEL[name] - lufs(x[: int(LEN * SR)])) / 20)
    x = x * g
    wet = np.stack([fftconvolve(x[:, k], IR[:, k])[: len(x)] for k in range(2)], 1)
    mix_dry = mix_dry + x; mix_wet = mix_wet + wet * WET[name]
    print(f"  {name:8s} gain {20 * np.log10(g):+5.1f} dB")
    if stem_dir:
        os.makedirs(stem_dir, exist_ok=True)
        y = np.clip(x[: int(LEN * SR)], -1, 1)
        with wave.open(os.path.join(stem_dir, f"{name}.wav"), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype("<i2").tobytes())
mix = (mix_dry + mix_wet)[: int(LEN * SR)]
mix = sosfilt(butter(2, 45, "high", fs=SR, output="sos"), mix, axis=0)       # keep the low end clear for the voice
t = np.arange(len(mix)) / SR
mix *= np.clip((LEN - t) / 1.2, 0, 1)[:, None]                                # the last ring fades by the end
mix *= 10 ** ((-18 - lufs(mix)) / 20)
pk = np.abs(mix).max()
if pk > 0.95: mix *= 0.95 / pk
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"{OUT}: {len(mix) / SR:.2f} s, {lufs(mix):.1f} LUFS, peak {20 * np.log10(np.abs(mix).max()):.1f} dBFS")
