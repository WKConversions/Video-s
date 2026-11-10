# Mixes a film's sound from a cue sheet: voice-over, music and sound effects, each at its level, every
# effect placed so its sync point lands on its frame.
#   python3 sound_mix.py cues.json out.wav [--sheet mix.png] [--music other-bed.wav]
#
# cues.json (paths relative to the cue file; "library" points at library/sound):
#   {"fps": 30, "frames": 1110, "library": "../../../library/sound",
#    "vo":    {"file": "audio/vo.mp3", "at": 0},
#    "music": {"file": "audio/music.wav", "at": 0, "duck_db": 6, "fade_in": 0.5, "fade_out": 2.0},
#    "sfx":   [{"id": "u-o8xh7gwsrj-app-interface-click-2", "frame": 526}, {"id": "gen-whoosh-medium", "frame": 790, "db": -2}]}
# An effect's "frame" is the picture event: a tap lands on the touch, a whoosh passes at the middle of the
# move, a riser ends on the reveal, an impact hits the landing. "db" nudges one cue against its role level;
# "pitch" (semitones) shifts it, so a run of the same sound can climb. "note" is for the reader only.
#
# Levels (LUFS of each element on its own; the voice sets the reference): voice −16, music bed −27 and a
# further duck under speech, effects by role (taps quietest, impacts and success sounds loudest), all
# below the voice. The finished mix is normalized to −15 LUFS with peaks under −1.5 dBTP, at 48 kHz, cut to
# the film's exact length. Each effect is then measured against what it plays over (the loudest 100 ms, the
# ear's window): one the bed would mask is lifted up to 4 dB, never to within 4 dB of the voice; set
# "auto_level": false to keep the levels as written. Needs ffmpeg, numpy, pyloudnorm; Pillow for --sheet.
import json, os, subprocess, sys
import numpy as np
import pyloudnorm as pyln

SR = 48000
ROLE_LUFS = {"tap": -31, "double-tap": -31, "pop": -29, "appear-rise": -29, "dismiss-fall": -30, "chime": -28, "success": -27,
             "ticker": -32, "swipe": -31, "whoosh": -30, "riser": -29, "impact": -27, "stinger": -28, "camera": -29,
             "gear": -32, "money": -29, "data": -33, "glitch": -31, "error": -30}
VO_LUFS, MUSIC_LUFS, MASTER_LUFS, CEILING_DB = -16.0, -27.0, -15.0, -1.5
meter = pyln.Meter(SR)

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)

def loudness(x):
    pad = np.zeros((max(0, int(0.5 * SR) - len(x)), 2))
    return meter.integrated_loudness(np.concatenate([x, pad]))

def to_lufs(x, target):
    l = loudness(x)
    return x * 10 ** ((target - l) / 20) if np.isfinite(l) else x

def place(bus, x, start):
    s = int(round(start * SR)); a, b = max(0, s), min(len(bus), s + len(x))
    if b > a: bus[a:b] += x[a - s:b - s]

def envelope(x, attack=0.08, release=0.45):
    """A smoothed 'is someone speaking' curve from the voice, 0..1, for ducking."""
    m = np.abs(x).mean(axis=1)
    hop = 480; n = len(m) // hop
    r = np.sqrt((m[: n * hop].reshape(n, hop) ** 2).mean(axis=1))
    on = (20 * np.log10(r + 1e-9) > 20 * np.log10(r.max() + 1e-9) - 30).astype(float)
    out = np.zeros(n); a, rel = np.exp(-hop / (attack * SR)), np.exp(-hop / (release * SR))
    for i in range(n):
        c = a if on[i] > out[i - 1 if i else 0] else rel
        out[i] = c * (out[i - 1] if i else 0) + (1 - c) * on[i]
    env = np.repeat(out, hop)
    return np.pad(env, (0, max(0, len(x) - len(env))), mode="edge")[: len(x)]   # any length, not only whole windows

def limit(x, ceiling_db):
    """Gain that never lets a peak pass the ceiling, with 5 ms of look-ahead and a 120 ms release."""
    c = 10 ** (ceiling_db / 20); peak = np.abs(x).max(axis=1)
    need = np.minimum(1, c / np.maximum(peak, 1e-9))
    la = int(0.005 * SR)
    need = np.minimum.reduce([np.roll(need, -k) for k in range(0, la, 8)])
    g = np.ones_like(need); rel = np.exp(-1 / (0.12 * SR)); cur = 1.0
    for i in range(len(need)):
        cur = need[i] if need[i] < cur else min(need[i], rel * cur + (1 - rel))
        g[i] = cur
    return x * g[:, None]

short_meter = pyln.Meter(SR, block_size=0.1)

def momentary(bus, t, span=0.3):
    """The loudest 100 ms (K-weighted, LUFS) in the span after time t: how loud a short sound is to the ear,
    which integrates over about a tenth of a second; -70 for silence."""
    best = -70.0
    for k in range(int(span / 0.05)):
        a = max(0, int((t + k * 0.05 - 0.02) * SR)); x = bus[a:a + int(0.1 * SR)]
        if len(x) < int(0.1 * SR): continue
        l = short_meter.integrated_loudness(x)
        if np.isfinite(l): best = max(best, l)
    return best

def bed(bus, t, span=0.3):
    """The music under an effect: its average 100 ms loudness over the same span."""
    vals = []
    for k in range(int(span / 0.05)):
        a = max(0, int((t + k * 0.05 - 0.02) * SR)); x = bus[a:a + int(0.1 * SR)]
        if len(x) == int(0.1 * SR):
            l = short_meter.integrated_loudness(x); vals.append(l if np.isfinite(l) else -70)
    return float(np.mean(vals)) if vals else -70.0

def report(vo, mu, fx, cues, fps):
    """Each effect against what it plays over: it should clear the music bed by 3 dB or more (else it is
    masked: felt, not heard) and stay 4 dB or more under the voice it lands on (else it covers a word)."""
    masked, loud = [], []                     # voice above -28 LUFS: speaking, not trailing off
    for c in cues:
        t = c["frame"] / fps
        e, m, v = momentary(fx, t), bed(mu, t), momentary(vo, t)
        if e - m < 3: masked.append(f"{c['frame']} {c['id']} ({e - m:+.1f} dB over the bed)")
        if v > -28 and e > v - 4: loud.append(f"{c['frame']} {c['id']} ({e - v:+.1f} dB against the voice)")
    print(f"levels: {len(cues) - len(masked)} of {len(cues)} effects clear the music by 3 dB or more" + ("" if not masked else "; masked: " + ", ".join(masked)))
    if loud: print("too close to the voice: " + ", ".join(loud))

def main():
    cue_path, out = sys.argv[1], sys.argv[2]
    base = os.path.dirname(os.path.abspath(cue_path))
    cue = json.load(open(cue_path))
    fps, frames = cue["fps"], cue["frames"]
    n = int(round(frames / fps * SR))
    lib = os.path.join(base, cue.get("library", "../../../library/sound"))
    index = {o["id"]: o for o in json.load(open(os.path.join(lib, "sfx", "index.json")))}
    vo_bus, mu_bus, fx_bus = np.zeros((n, 2)), np.zeros((n, 2)), np.zeros((n, 2))
    if "vo" in cue:
        place(vo_bus, to_lufs(load(os.path.join(base, cue["vo"]["file"])), VO_LUFS), cue["vo"].get("at", 0))
    if "--music" in sys.argv:                 # the same cues over another bed, to compare
        cue.setdefault("music", {})["file"] = os.path.relpath(os.path.abspath(sys.argv[sys.argv.index("--music") + 1]), base)
    if "music" in cue:
        m = cue["music"]; x = to_lufs(load(os.path.join(base, m["file"])), MUSIC_LUFS)
        place(mu_bus, x, m.get("at", 0))
        t = np.arange(n) / SR
        fi, fo = m.get("fade_in", 0.3), m.get("fade_out", 2.0)
        mu_bus *= np.clip(t / max(fi, 1e-3), 0, 1)[:, None] * np.clip((n / SR - t) / max(fo, 1e-3), 0, 1)[:, None]
        if "vo" in cue and m.get("duck_db", 6):
            mu_bus *= (10 ** (-m.get("duck_db", 6) * envelope(vo_bus) / 20))[:, None]
    placed, lifted = [], []
    for c in cue.get("sfx", []):
        o = index[c["id"]]
        if o["licence"] == "apple" and not cue.get("allow_apple"):
            sys.exit(f"{c['id']} is one of Apple's system sounds: not for a client delivery (set allow_apple for an internal draft)")
        x = load(os.path.join(lib, o["file"]))
        sync = o["sync"]
        if c.get("pitch"):                    # semitones; repeats of one sound step up a scale, not a machine gun
            r = 2 ** (c["pitch"] / 12); t = np.arange(0, len(x) - 1, r)
            x = np.stack([np.interp(t, np.arange(len(x)), x[:, k]) for k in range(2)], 1); sync /= r
        target = ROLE_LUFS.get(o["category"], -30) + c.get("db", 0)
        x = to_lufs(x, target)
        start = c["frame"] / fps - sync
        # make it heard, not just felt: lift it (up to 4 dB) until it clears the bed under it by 3 dB, but
        # never closer than 4 dB to the voice it lands on
        if cue.get("auto_level", True):
            solo = np.zeros((int(0.6 * SR), 2)); place(solo, x, -sync + 0.1)
            e, m, v = momentary(solo, 0.1), bed(mu_bus, start + sync), momentary(vo_bus, start + sync)
            up = min(4.0, max(0.0, m + 3.3 - e))
            if v > -28: up = min(up, max(0.0, v - 4 - e))
            if up > 0.2:
                x = x * 10 ** (up / 20); lifted.append(f"{c['frame']} +{up:.1f}")
        place(fx_bus, x, start); placed.append((c["frame"], c["id"], o["category"]))
    if lifted: print("lifted over the bed: " + ", ".join(lifted))
    report(vo_bus, mu_bus, fx_bus, cue.get("sfx", []), fps)
    mix = vo_bus + mu_bus + fx_bus
    mix = to_lufs(mix, MASTER_LUFS)
    mix = limit(mix, CEILING_DB)
    final_l = loudness(mix)
    pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2")
    import wave
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"{out}: {n / SR:.2f} s, {final_l:.1f} LUFS, peak {20 * np.log10(np.abs(mix).max() + 1e-9):.1f} dBFS, {len(placed)} effects")
    if "--sheet" in sys.argv:
        sheet(sys.argv[sys.argv.index("--sheet") + 1], vo_bus, mu_bus, fx_bus, placed, fps, frames)

def sheet(path, vo, mu, fx, placed, fps, frames):
    """The mix as a picture: voice, music and effects as waveforms on one timeline, each effect's frame marked."""
    from PIL import Image, ImageDraw
    W, rowH, L = 2400, 120, 90
    im = Image.new("RGB", (W + L, rowH * 3 + 60), "white"); d = ImageDraw.Draw(im)
    for r, (name, x, col) in enumerate([("voice", vo, (20, 20, 60)), ("music", mu, (60, 140, 120)), ("effects", fx, (200, 60, 50))]):
        y0 = r * rowH; m = np.abs(x).max(axis=1); step = max(1, len(m) // W); mm = m[: (len(m) // step) * step].reshape(-1, step).max(axis=1)
        top = mm.max() + 1e-9
        for i, v in enumerate(mm[:W]):
            h = v / top * (rowH / 2 - 8); d.line([L + i, y0 + rowH / 2 - h, L + i, y0 + rowH / 2 + h], fill=col)
        d.text((6, y0 + rowH / 2 - 6), name, fill=(0, 0, 0))
    for f, sid, cat in placed:
        x = L + f / frames * W
        d.line([x, rowH * 2, x, rowH * 3], fill=(0, 0, 0)); d.text((x + 2, rowH * 3 + 4 + (hash(sid) % 3) * 16), cat[:7], fill=(80, 80, 80))
    for s in range(0, int(frames / fps) + 1):
        x = L + s * fps / frames * W; d.line([x, rowH * 3, x, rowH * 3 + 4], fill=(0, 0, 0)); d.text((x + 2, rowH * 3 + 48), f"{s}", fill=(120, 120, 120))
    im.save(path)

main()
