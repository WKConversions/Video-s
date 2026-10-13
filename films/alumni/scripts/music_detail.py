# Looks closely at shortlisted tracks: the bar grid, where the music steps up (beat/band entries, on bar
# starts), the ending (the final hit and its ring-out), and whether there are sung words (faster-whisper).
#   python3 music_detail.py out.json track1.mp3 [track2.mp3 ...] [--whisper small] [--no-whisper] [--sheet dir]
# Tempo, beat phase and downbeat use the same method as music_fit.py (comb over every beat; the downbeat is
# the beat of four that carries the most kick and bass), so the times here are the ones music_fit.py cuts on.
# Vocals: faster-whisper on a 30 s excerpt (the loudest 30 s of the body) with the VAD filter; words with
# decent probability mean a vocal; nothing, or a few low-probability fragments, means instrumental.
import json, subprocess, sys
import numpy as np

A_SR, HOP = 22050, 256

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

def load(path, sr, ch=1):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", str(ch), "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch).astype(np.float64)

def features(x):
    N = 1024
    fr = np.lib.stride_tricks.sliding_window_view(x, N)[::HOP] * np.hanning(N)
    S = np.log1p(30 * np.abs(np.fft.rfft(fr, axis=1)))
    freqs = np.fft.rfftfreq(N, 1 / A_SR)
    d = np.maximum(0, np.diff(S, axis=0, prepend=S[:1]))
    flux, low = d.sum(axis=1), d[:, freqs < 160].sum(axis=1)
    rms = np.sqrt((fr ** 2).mean(axis=1) + 1e-12)
    bands = np.stack([S[:, (freqs >= a) & (freqs < b)].mean(axis=1) for a, b in [(20, 160), (160, 600), (600, 2500), (2500, 11000)]], 1)
    return flux - np.convolve(flux, np.ones(32) / 32, "same"), low, rms, bands

def tempo(onset):
    fps = A_SR / HOP
    ac = np.correlate(onset, onset, "full")[len(onset) - 1:]
    lags = np.arange(int(fps * 60 / 180), int(fps * 60 / 60))
    coarse = 60 * fps / lags[np.argmax(ac[lags])]
    while coarse < 80: coarse *= 2
    while coarse > 160: coarse /= 2
    t = np.arange(len(onset)) / fps
    def comb(bpm):
        p = 60 / bpm
        ph = np.mod(t, p) / p
        z = (onset * np.exp(2j * np.pi * ph)).sum()
        return abs(z), (-np.angle(z) / (2 * np.pi)) % 1 * p
    best = max((comb(b)[0], b) for b in np.arange(coarse - 3, coarse + 3, 0.05))[1]
    best = max((comb(b)[0], b) for b in np.arange(best - 0.06, best + 0.06, 0.005))[1]
    return best, -comb(best)[1] % (60 / best)

def vocals(path, x, model):
    """Transcribe the loudest 30 s of the track's middle; return the words whisper hears."""
    fps = A_SR / HOP
    dur = len(x) / A_SR
    r = np.sqrt(np.convolve(x ** 2, np.ones(A_SR) / A_SR, "valid")[::A_SR] + 1e-12)   # per-second loudness
    lo, hi = int(min(10, dur * 0.1)), int(max(11, dur - 40))
    win = np.convolve(r, np.ones(30), "valid")
    s0 = lo + int(np.argmax(win[lo:hi])) if hi > lo and len(win) > lo else 0
    a = load(path, 16000)[:, 0].astype(np.float32)[s0 * 16000:(s0 + 30) * 16000]
    segs, info = model.transcribe(a, language="en", vad_filter=True, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    words = [(w.word.strip(), round(w.probability, 2)) for s in segs for w in (s.words or [])]
    good = [w for w, p in words if p >= 0.5 and len(w.strip(" .,!?'-")) > 1]
    return {"excerpt_s": [s0, s0 + 30], "words": words, "confident_words": good, "vocals": "yes" if len(good) >= 4 else ("maybe" if good else "no")}

def detail(path, model=None):
    x = load(path, A_SR)[:, 0]
    onset, low, rms, bands = features(x)
    fps = A_SR / HOP
    bpm, phase = tempo(onset)
    beat = 60 / bpm; bar = 4 * beat
    db = 20 * np.log10(rms / rms.max() + 1e-9)
    loud = np.where(db > -35)[0]
    t_first, E = loud[0] / fps, loud[-1] / fps
    beats = np.arange(phase, len(x) / A_SR, beat)
    lowb = np.array([low[int(b * fps)] if int(b * fps) < len(low) else 0 for b in beats])
    down = int(np.argmax([lowb[k::4].mean() for k in range(4)]))
    bars = beats[down::4]
    if bars[0] - bar > t_first - 0.1 and bars[0] - bar >= 0: bars = np.concatenate([[bars[0] - bar], bars])
    bars = bars[bars >= 0]
    def at_bar(arr, b0, b1):
        i0, i1 = int(b0 * fps), max(int(b0 * fps) + 1, int(b1 * fps))
        return arr[i0:i1].mean(axis=0)
    bdb = np.array([20 * np.log10(at_bar(rms, b, b + bar) + 1e-9) for b in bars])
    blow = np.array([at_bar(low, b, b + bar) for b in bars])
    bb = np.array([at_bar(bands, b, b + bar) for b in bars])
    step = np.zeros(len(bars))
    for i in range(2, len(bars) - 2):
        step[i] = (bdb[i:i + 2].mean() - bdb[i - 2:i].mean()) + 4 * np.maximum(0, bb[i:i + 2].mean(0) - bb[i - 2:i].mean(0)).sum()
    # entries in the first minute (where an edit would start), strongest first
    early = [i for i in np.argsort(-step) if step[i] > 0.8 and bars[i] < min(75, E - 20)][:6]
    # first bar where the low end (kick/bass) runs at body level
    third = len(bars) // 3
    lref = np.median(blow[third:2 * third])
    kick = next((i for i in range(len(bars)) if blow[i] > 0.6 * lref and (i + 1 < len(bars) and blow[i + 1] > 0.6 * lref)), None)
    # the ending: last strong hit (98th percentile onset) before the ring-out, the bar it sits on, and the tail
    strong = np.where(onset[: int(E * fps)] > np.percentile(onset, 98))[0]
    last_hit = strong[-1] / fps if len(strong) else E
    hit_bar = None
    # a sharper final hit from a 10 ms peak envelope: the last attack (a jump of 4 dB or more over the 40 ms
    # before it, near full level) before the music decays for good; snapped to the nearest beat if within 60 ms
    env = np.abs(x[: len(x) // 220 * 220]).reshape(-1, 220).max(axis=1)          # 10 ms frames
    sm = np.convolve(env, np.ones(25) / 25, "same")                              # 250 ms level
    full = np.percentile(sm, 75)
    held = np.where(sm > full * 10 ** (-3 / 20))[0]
    decay_start = held[-1] / 100 if len(held) else E
    att = [i for i in range(5, len(env)) if env[i] > 1.58 * env[i - 5:i - 1].max() and env[i] > 0.3 * env.max() and i / 100 <= decay_start + 0.3]
    attacks = [i for i in range(5, len(env)) if env[i] > 1.58 * env[i - 5:i - 1].max() and env[i] > 0.3 * env.max()]
    hit2 = (att[-1] / 100) if att else last_hit
    bt = beats[int(np.argmin(np.abs(beats - hit2)))]
    on_beat = abs(bt - hit2) <= 0.06
    on_bar = on_beat and np.min(np.abs(bars - bt)) < 0.05
    # level per 0.5 s over the last 20 s, relative to the body
    body = np.percentile(bdb, 70)
    tail = []
    for t0 in np.arange(max(0, E - 20), E + 0.5, 0.5):
        i0, i1 = int(t0 * fps), int((t0 + 0.5) * fps)
        if i1 <= len(rms): tail.append((round(float(t0), 1), round(float(20 * np.log10(rms[i0:i1].mean() + 1e-9) - body), 1)))
    # how long the music stays at full level before the hit, and how fast it decays after it
    decay_to_m20 = None
    def snap(t):
        """The strongest onset within 60 ms of a grid time (where an editor would actually cut)."""
        i, w = int(t * fps), int(0.06 * fps)
        return (max(0, i - w) + int(np.argmax(onset[max(0, i - w):i + w + 1]))) / fps
    decay_to_m20 = next((t - hit2 for t, v in tail if t >= hit2 and v < -20), None)
    res = {"file": path, "bpm": round(bpm, 2), "beat_s": round(beat, 4), "bar_s": round(bar, 4), "first_downbeat_s": round(float(bars[0]), 3),
           "music_starts_s": round(t_first, 2), "rings_out_to_s": round(E, 2), "duration_s": round(len(x) / A_SR, 2),
           "intro_bars": [round(float(b), 2) for b in bars[: max(1, (kick or 1) + 1)]],
           "kick_in_bar_s": round(float(bars[kick]), 2) if kick is not None else None,
           "entries": [{"bar_s": round(float(bars[i]), 2), "transient_s": round(snap(bars[i]), 3), "bar_no": int(i), "step": round(float(step[i]), 1)} for i in sorted(early)],
           "intro_bar_db": [(round(float(bars[i]), 2), round(float(bdb[i] - body), 1)) for i in range(min(10, len(bars)))],
           "final_hit_s": round(float(hit2), 2), "final_hit_beat_s": round(float(bt), 3), "final_hit_on_beat": bool(on_beat), "final_hit_on_bar": bool(on_bar),
           "decay_start_s": round(float(decay_start), 2), "last_strong_onset_s": round(float(last_hit), 2), 
           "decay_to_-20dB_s": round(float(decay_to_m20), 2) if decay_to_m20 is not None else None, "tail_db": tail,
           "bar_db": [round(float(v - body), 1) for v in bdb], "bar_low": [round(float(v / (lref + 1e-9)), 2) for v in blow], "bars_s": [round(float(b), 3) for b in bars]}
    if model is not None: res["vocal_check"] = vocals(path, x, model)
    return res, x, onset, bars, early

def sheet(r, x, onset, bars, early, out):
    from PIL import Image, ImageDraw
    W, H = 1800, 240
    dur = len(x) / A_SR
    im = Image.new("RGB", (W + 20, 2 * H + 60), "white"); d = ImageDraw.Draw(im)
    def draw(y0, t0, t1, title):
        i0, i1 = int(t0 * A_SR), int(t1 * A_SR); sig = x[i0:i1]
        st = max(1, len(sig) // W); env = np.abs(sig[: len(sig) // st * st]).reshape(-1, st).max(axis=1)
        X = lambda t: 10 + (t - t0) / (t1 - t0) * W
        for b in bars:
            if t0 <= b <= t1: d.line([X(b), y0, X(b), y0 + H], fill=(225, 225, 232))
        for i, v in enumerate(env[:W]): d.line([10 + i, y0 + H / 2 - v * H / 2, 10 + i, y0 + H / 2 + v * H / 2], fill=(40, 60, 110))
        for e in r["entries"]:
            if t0 <= e["bar_s"] <= t1: d.line([X(e["bar_s"]), y0, X(e["bar_s"]), y0 + 18], fill=(230, 120, 20), width=3); d.text((X(e["bar_s"]) + 3, y0 + 2), f"{e['bar_s']}", fill=(230, 120, 20))
        if r["kick_in_bar_s"] and t0 <= r["kick_in_bar_s"] <= t1: d.line([X(r["kick_in_bar_s"]), y0 + H - 18, X(r["kick_in_bar_s"]), y0 + H], fill=(40, 160, 90), width=3)
        if t0 <= r["final_hit_s"] <= t1: d.line([X(r["final_hit_s"]), y0, X(r["final_hit_s"]), y0 + H], fill=(210, 40, 40), width=2); d.text((X(r["final_hit_s"]) + 3, y0 + 20), f"hit {r['final_hit_s']}", fill=(210, 40, 40))
        d.text((14, y0 + H - 14), title, fill=(0, 0, 0))
    draw(20, 0, min(dur, 40), f"{r['file'].split('/')[-1]}  first 40 s  ({r['bpm']} BPM, bar {r['bar_s']} s; grey: bars, orange: entries, green: kick in)")
    draw(H + 40, max(0, r["rings_out_to_s"] - 30), r["rings_out_to_s"] + 1, "last 30 s (red: final hit)")
    im.save(out)

def main():
    out = sys.argv[1]
    files = [a for a in sys.argv[2:] if a.endswith((".mp3", ".wav"))]
    model = None
    if "--no-whisper" not in sys.argv:
        from faster_whisper import WhisperModel
        model = WhisperModel(arg("--whisper", "small"), device="cpu", compute_type="int8", cpu_threads=2)
    res = []
    for f in files:
        r, x, onset, bars, early = detail(f, model)
        res.append(r)
        if arg("--sheet"):
            import os; os.makedirs(arg("--sheet"), exist_ok=True)
            sheet(r, x, onset, bars, early, os.path.join(arg("--sheet"), os.path.basename(f).rsplit(".", 1)[0] + "_detail.png"))
        v = r.get("vocal_check", {})
        print(f"{f.split('/')[-1]}: {r['bpm']} BPM, bar {r['bar_s']} s, first downbeat {r['first_downbeat_s']} s, music {r['music_starts_s']}-{r['rings_out_to_s']} s")
        print(f"  kick in at bar {r['kick_in_bar_s']} s; entries: " + ", ".join(f"{e['bar_s']} s (bar {e['bar_no']}, +{e['step']})" for e in r["entries"]))
        print(f"  final hit {r['final_hit_s']} s (beat {r['final_hit_beat_s']} s, on beat {r['final_hit_on_beat']}, on bar {r['final_hit_on_bar']}); level holds to {r['decay_start_s']} s, -20 dB {r['decay_to_-20dB_s']} s after the hit")
        print("  first bars (s, dB vs body): " + "  ".join(f"{t}:{v:+.0f}" for t, v in r["intro_bar_db"]))
        if v: print(f"  vocals: {v['vocals']} (excerpt {v['excerpt_s']}): {' '.join(w for w, p in v['words'])[:200]}")
        json.dump(res, open(out, "w"), indent=1)

main()
