# Reads a folder of sound effects and describes each one the way placing it needs:
#   python3 sfx_index.py <source folder> <out folder>
# For every distinct sound (duplicates across folders are merged, their folder names kept as tags):
#   onset   when the sound starts (first moment within 40 dB of its peak)
#   sync    the moment that lands on the picture: the first strong transient (where a click clicks)
#   hit     the strongest transient; transients, all of them (a ticker's ticks, a chime's notes)
#   attack  hit − onset;  decay  from the hit until it falls 20 dB;  tail  until it falls 40 dB
#   loudness (LUFS, short sounds padded), peak dBFS, brightness (spectral centroid), noisiness (spectral
#   flatness: 0 tonal … 1 noise), pitch movement in semitones (rising sounds open, falling ones close),
#   the number of separate hits (one click, a double pop, a three-note chime)
# and writes index.json plus waveform sheets (one row per sound: the waveform, the onset in grey and the
# sync point in red) to judge them by eye. Needs ffmpeg, numpy, Pillow; pyloudnorm for LUFS.
import hashlib, json, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

SR = 48000

def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def envelope(x, hop=240):                     # 5 ms RMS envelope
    n = len(x) // hop
    return np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12), hop

def lufs(x):
    try:
        import pyloudnorm as pyln
        y = np.concatenate([x, np.zeros(max(0, int(0.5 * SR) - len(x)), dtype=np.float32)])
        return float(pyln.Meter(SR).integrated_loudness(y.astype(np.float64)))
    except Exception:
        return None

def describe(x):
    env, hop = envelope(x)
    db = 20 * np.log10(env / env.max())
    t = lambda i: i * hop / SR
    active = np.where(db > -40)[0]
    onset, end40 = active[0], active[-1]
    # transients: rises of the envelope of 9 dB or more within 15 ms, at least 40 ms apart
    rise = db[3:] - db[:-3]
    peaks = []
    for i in np.where((rise > 9) & (db[3:] > -24))[0] + 3:
        if not peaks or i - peaks[-1] > 8: peaks.append(i)
    # the hit: the loudest point within 60 ms after the strongest rise, or the overall peak
    hit = int(np.argmax(env))
    if peaks:
        k = max(peaks, key=lambda i: env[i:i + 12].max())
        hit = k + int(np.argmax(env[k:k + 12]))
    # where to sync: the first transient within 6 dB of the strongest one (a double click syncs on its
    # first click, a soft pre-hit doesn't count)
    strong = [i + int(np.argmax(env[i:i + 12])) for i in peaks]
    lv = [db[i] for i in strong]
    sync = next((i for i, l in zip(strong, lv) if l > max(lv) - 6), hit) if strong else hit
    after = np.where(db[hit:] < -20)[0]
    decay = t(after[0]) if len(after) else t(len(db) - hit)
    # spectrum per 20 ms frame over the active part
    F = 960; frames = []
    for s in range(onset * hop, min(len(x), end40 * hop) - F, F // 2):
        w = x[s:s + F] * np.hanning(F)
        frames.append(np.abs(np.fft.rfft(w)) + 1e-9)
    freqs = np.fft.rfftfreq(F, 1 / SR)
    if frames:
        S = np.array(frames); e = S.sum(axis=1)
        loud = S[e > e.max() * 0.1]
        centroid = float(np.median((loud * freqs).sum(axis=1) / loud.sum(axis=1)))
        flat = float(np.median(np.exp(np.log(loud).mean(axis=1)) / loud.mean(axis=1)))
        band = (freqs > 150) & (freqs < 6000)
        f0 = freqs[band][np.argmax(loud[:, band], axis=1)]
        semis = 12 * np.log2(f0 / f0[0]) if len(f0) > 1 else np.zeros(1)
        movement = float(np.median(semis[-max(1, len(semis) // 3):]) - np.median(semis[: max(1, len(semis) // 3)]))
        notes = 1 + int(np.sum(np.abs(np.diff(12 * np.log2(f0))) > 1.5)) if len(f0) > 1 else 1
    else:
        centroid, flat, movement, notes = 0.0, 0.0, 0.0, 1
    return {
        "duration": round(len(x) / SR, 3), "onset": round(t(onset), 3), "sync": round(t(sync), 3), "hit": round(t(hit), 3),
        "transients": [round(t(i), 3) for i in strong][:12], "end": round(t(end40), 3), "attack": round(t(hit - onset), 3),
        "decay": round(decay, 3), "tail": round(t(end40 - hit), 3), "peak_db": round(float(20 * np.log10(np.abs(x).max() + 1e-9)), 1),
        "lufs": None if (l := lufs(x)) is None else round(l, 1), "brightness_hz": round(centroid), "noisiness": round(flat, 3),
        "pitch_move_semitones": round(movement, 1), "hits": max(1, len(peaks)), "pitch_changes": notes,
    }

def slug(name):
    s = re.sub(r"\(\d+\)|\d{5,}", "", os.path.splitext(name)[0]).lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:48]

def sheet(items, path):
    W, H, L = 900, 70, 330
    im = Image.new("RGB", (W + L, H * len(items)), "white"); d = ImageDraw.Draw(im)
    for r, (it, x) in enumerate(items):
        y0 = r * H
        d.rectangle([L, y0 + 2, L + W, y0 + H - 2], fill=(246, 247, 250))
        dur = max(it["duration"], 0.05)
        scale = W / max(dur, 1.0)                       # one second fills the row; longer sounds are squeezed
        if dur > 1.0: scale = W / dur
        n = len(x); xs = np.linspace(0, n - 1, int(min(W, dur * scale))).astype(int)
        seg = np.abs(x)
        for i in range(len(xs) - 1):
            a = seg[xs[i]:xs[i + 1] + 1].max() if xs[i + 1] > xs[i] else seg[xs[i]]
            h = a / (np.abs(x).max() + 1e-9) * (H / 2 - 6)
            d.line([L + i, y0 + H / 2 - h, L + i, y0 + H / 2 + h], fill=(30, 40, 90))
        for key, col in (("onset", (150, 150, 150)), ("sync", (220, 30, 30))):
            px = L + it[key] * scale
            d.line([px, y0 + 4, px, y0 + H - 4], fill=col, width=2)
        d.text((6, y0 + 6), f"{it['id']}", fill=(0, 0, 0))
        d.text((6, y0 + 22), f"{it['duration']:.2f}s sync {it['sync']*1000:.0f}ms  {it['hits']} hit(s)", fill=(60, 60, 60))
        d.text((6, y0 + 38), f"{it['brightness_hz']}Hz  noise {it['noisiness']:.2f}  pitch {it['pitch_move_semitones']:+.0f}st", fill=(60, 60, 60))
        d.text((6, y0 + 54), ", ".join(it["tags"])[:52], fill=(120, 120, 120))
    im.save(path)

def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    seen, items = {}, []
    for root, _, files in os.walk(src):
        for f in sorted(files):
            if not f.lower().endswith((".mp3", ".wav", ".m4a", ".aac", ".ogg", ".mp4", ".aif", ".aiff", ".flac", ".wma")): continue
            p = os.path.join(root, f)
            tag = os.path.basename(root)
            x = decode(p)
            if len(x) < 100: continue
            h = hashlib.md5(np.round(x[:SR * 2], 3).tobytes()).hexdigest()
            if h in seen:
                if tag not in seen[h]["tags"]: seen[h]["tags"].append(tag)
                seen[h]["sources"].append(os.path.relpath(p, src)); continue
            it = {"id": slug(f), "file": os.path.relpath(p, src), "sources": [os.path.relpath(p, src)], "tags": [tag], **describe(x)}
            seen[h] = it; items.append((it, x))
    ids = {}
    for it, _ in items:
        ids[it["id"]] = ids.get(it["id"], 0) + 1
        if ids[it["id"]] > 1: it["id"] += f"-{ids[it['id']]}"
    json.dump([it for it, _ in items], open(os.path.join(out, "index.json"), "w"), indent=1)
    for k in range(0, len(items), 20):
        sheet(items[k:k + 20], os.path.join(out, f"waves_{k // 20 + 1:02d}.png"))
    print(f"{len(items)} distinct sounds from {sum(len(it['sources']) for it, _ in items)} files -> {out}/index.json, waves_*.png")

main()
