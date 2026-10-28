# Hears the sound design of a reference film: what the music is like, which sound effects it uses, what they sound
# like, how many there are for the film's pace, and whether they sit on the big moves. It describes a palette, not
# a recipe (Karl: "never a precise amount; know the style and vibe of the video").
#   python3 ref_sound.py ref.mp4 [more.mp4 …] [--stems DIR] [--json out.json]
# 1 The voice comes out first (Demucs, two stems), so only music and effects are left. Pass --stems to reuse a
#   separation (DIR/htdemucs/<name>/no_vocals.wav); otherwise it runs `python3 -m demucs --two-stems=vocals`.
# 2 The music: an audio-language model (CLAP, as in sfx_hear.py) scores 10-second windows against descriptions
#   of music beds.
# 3 The effects: the music repeats bar after bar and effects don't, so the repeating bed is filtered out
#   (nearest-neighbour filtering, REPET-SIM); onsets in what is left, loud enough to hear over the bed and heard as an
#   effect family rather than drums or melody, are the effects, each with sfx_hear's tone scales.
# 4 The pace: effects a minute, read against the other references (sparse, moderate, dense), and how many land
#   within 0.15 s of a big move in the picture (a peak in the optical flow).
# Needs demucs, librosa, torch, transformers, opencv-python-headless.
import argparse, json, os, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import sfx_hear as H

MUSIC = {
    "upbeat corporate pop": "upbeat corporate pop background music",
    "calm ambient": "calm ambient background music with soft pads",
    "soft piano": "soft emotional piano background music",
    "lo-fi beat": "lo-fi hip hop beat",
    "electronic tech": "modern electronic music with a steady synth pulse",
    "playful ukulele and claps": "playful happy music with ukulele, whistles and claps",
    "funky groove": "funky groove with bass guitar",
    "cinematic build": "cinematic orchestral music building up",
    "minimal pulse": "minimal ticking electronic pulse",
    "acoustic guitar": "warm acoustic guitar music",
    "no music": "silence with no music",
}
# effects are heard by family; a window counts as an effect only when an effect family beats every music family
FAMILIES = {
    "whoosh": ["a whoosh sound effect", "a swoosh of air", "a fast whip sound effect", "an airy swell"],
    "pop": ["a bubbly pop sound effect", "a water drop sound", "a soft pop"],
    "click": ["a mouse click", "a soft button tap", "a switch toggle click"],
    "chime": ["a notification chime", "a glass ping", "a bell ding", "a positive confirmation sound"],
    "impact": ["a deep impact sound effect", "a soft thud", "a stamp sound effect"],
    "riser": ["a rising sweep sound effect", "a riser building tension"],
    "digital": ["a digital glitch", "data processing beeps", "a futuristic interface sound"],
    "shimmer": ["a magical shimmer", "sparkles sound effect"],
    "typing": ["typing on a keyboard", "a keyboard key press"],
    "money": ["a cash register", "coins clinking"],
    "swish": ["a paper slide", "a page turn", "a card flip", "a soft swish"],
}
MUSIC_FAMILIES = {
    "drums": ["a kick drum in a pop song", "a snare drum hit in a song", "a hi-hat in a beat", "hand claps in a song"],
    "melody": ["a piano chord", "a guitar strum", "a synth melody note", "a bass note"],
}

def stem_of(video, stems):
    name = os.path.splitext(os.path.basename(video))[0]
    if stems:
        p = os.path.join(stems, "htdemucs", name, "no_vocals.wav")
        if os.path.exists(p): return p
    out = stems or os.path.join(os.path.dirname(os.path.abspath(video)), "stems")
    wav = os.path.join(out, name + ".wav"); os.makedirs(out, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-ac", "2", "-ar", "44100", wav], check=True)
    subprocess.run([sys.executable, "-m", "demucs", "--two-stems=vocals", "-n", "htdemucs", "-o", out, wav], check=True, capture_output=True)
    return os.path.join(out, "htdemucs", name, "no_vocals.wav")

def foreground(y, sr):
    """What doesn't repeat: music repeats bar after bar (drums included), effects don't. Nearest-neighbour filtering
    (REPET-SIM) estimates the repeating bed; the rest, kept by a soft mask, is mostly the effects."""
    import librosa
    D = librosa.stft(y, n_fft=2048, hop_length=512); S = np.abs(D)
    bed = librosa.decompose.nn_filter(S, aggregate=np.median, metric="cosine", width=int(librosa.time_to_frames(2.0, sr=sr, hop_length=512)))
    bed = np.minimum(S, bed)
    mask = librosa.util.softmask(S - bed, 2 * bed, power=2)
    return librosa.istft(mask * D, hop_length=512, length=len(y))

def motion_peaks(video):
    """Times of big moves in the picture: peaks of the mean optical-flow speed."""
    import cv2
    cap = cv2.VideoCapture(video); fps = cap.get(cv2.CAP_PROP_FPS) or 30; prev = None; sp = []
    while True:
        ok, fr = cap.read()
        if not ok: break
        g = cv2.cvtColor(cv2.resize(fr, (192, 108)), cv2.COLOR_BGR2GRAY)
        if prev is not None:
            fl = cv2.calcOpticalFlowFarneback(prev, g, None, 0.5, 2, 9, 2, 5, 1.1, 0)
            sp.append(float(np.percentile(np.hypot(fl[..., 0], fl[..., 1]), 90)))
        else: sp.append(0.0)
        prev = g
    sp = np.array(sp); thr = max(np.percentile(sp, 90), 1.0)
    pk = [i for i in range(1, len(sp) - 1) if sp[i] >= thr and sp[i] >= sp[i - 1] and sp[i] >= sp[i + 1]]
    big, last = [], -99                                   # the big moves: the strongest peaks, at least 0.8 s apart
    for i in sorted(pk, key=lambda i: -sp[i]):
        if sp[i] < np.percentile(sp, 97): break
        if all(abs(i - j) > 0.8 * fps for j in big): big.append(i)
    return np.array(pk) / fps, np.array(sorted(big)) / fps

def analyse(video, stems, text, audio):
    import librosa
    path = stem_of(video, stems)
    y, sr = librosa.load(path, sr=48000, mono=True); dur = len(y) / sr
    # music bed
    win = []
    for s in np.arange(0, max(0.1, dur - 5), 10.0):
        seg = y[int(s * sr): int(min(dur, s + 10) * sr)]
        if len(seg) > sr: win.append(seg)
    import tempfile, soundfile as sf
    tmp = tempfile.mkdtemp()
    files = []
    for i, seg in enumerate(win):
        f = os.path.join(tmp, f"m{i}.wav"); sf.write(f, seg, sr); files.append(f)
    A = audio(files) if files else np.zeros((0, 512))
    M = A @ text(list(MUSIC.values())).T if len(A) else np.zeros((0, len(MUSIC)))
    music = sorted(zip(MUSIC, M.mean(0) if len(M) else np.zeros(len(MUSIC))), key=lambda r: -r[1])[:3]
    rms = librosa.feature.rms(y=y)[0]; level = float(np.percentile(rms, 50))
    # effect candidates: onsets in what doesn't repeat, loud enough to be heard over the bed
    y22 = librosa.resample(y, orig_sr=sr, target_sr=22050); fg = foreground(y22, 22050)
    fg48 = librosa.resample(fg, orig_sr=22050, target_sr=sr)
    oenv = librosa.onset.onset_strength(y=fg, sr=22050, hop_length=512)
    on = librosa.onset.onset_detect(onset_envelope=oenv, sr=22050, hop_length=512, units="time", backtrack=False, delta=0.3, wait=4)
    frms = librosa.feature.rms(y=fg, hop_length=512)[0]; full = librosa.feature.rms(y=y22, hop_length=512)[0]
    gate = np.percentile(full, 60) * 0.35
    on = [t for t in on if 0.2 < t < dur - 0.4 and frms[min(len(frms) - 1, int(t * 22050 / 512)): int((t + 0.4) * 22050 / 512) + 1].max() > gate]
    clips, times = [], []
    for t in on:
        seg = fg48[int((t - 0.15) * sr): int((t + 0.85) * sr)]
        f = os.path.join(tmp, f"o{len(clips)}.wav"); sf.write(f, seg, sr); clips.append(f); times.append(t)
    effects = []
    peaks, big = motion_peaks(video)
    if clips:
        E = audio(clips)
        fam = {k: (E @ text(v).T).max(1) for k, v in FAMILIES.items()}
        mus = np.max(np.stack([(E @ text(v).T).max(1) for v in MUSIC_FAMILIES.values()]), axis=0)
        sc, st, _ = H.raw_scores(text, E)
        names = list(FAMILIES)
        F = np.stack([fam[k] for k in names], axis=1)
        for i, t in enumerate(times):
            j = int(np.argmax(F[i]))
            near = bool(len(peaks)) and float(np.min(np.abs(peaks - t))) <= 0.15
            # an effect beats the music's own families; one on a big move in the picture gets a smaller margin
            if F[i, j] > mus[i] - (0.03 if near else 0.0):
                effects.append({"t": round(float(t), 2), "family": names[j], "score": round(float(F[i, j]), 3), "on_move": near,
                                "tone": {k: float(v[i]) for k, v in sc.items()}})
    # what sits on the big moves: the non-repeating sound around each one, against the film's usual level
    moves, chance = [], None
    if len(big):
        lvl = librosa.feature.rms(y=fg48, hop_length=1024)[0]; base = float(np.median(lvl)) + 1e-9
        mclips = []
        for t in big:
            a0, a1 = max(0, t - 0.45), min(dur, t + 0.45)
            seg = fg48[int(a0 * sr): int(a1 * sr)]
            if len(seg) < sr * 0.3: continue
            f = os.path.join(tmp, f"b{len(mclips)}.wav"); sf.write(f, seg, sr); mclips.append((t, f, seg))
        if mclips:
            E = audio([f for _, f, _ in mclips]); names = list(FAMILIES)
            F = np.stack([(E @ text(FAMILIES[k]).T).max(1) for k in names], axis=1)
            for i, (t, f, seg) in enumerate(mclips):
                ratio = float(np.sqrt(np.mean(seg ** 2)) / base)
                moves.append({"t": round(float(t), 2), "loud": round(ratio, 2), "family": names[int(np.argmax(F[i]))], "sound": ratio > 1.8})
        # chance: the same test at random moments, so "with a sound" means more than the mix being busy
        rng = np.random.default_rng(0); hits = 0; tries = 60
        for t in rng.uniform(0.5, dur - 0.5, tries):
            seg = fg48[int((t - 0.45) * sr): int((t + 0.45) * sr)]
            hits += float(np.sqrt(np.mean(seg ** 2)) / base) > 1.8
        chance = hits / tries
    on_move = [e for e in effects if e["on_move"]]
    kinds = {}
    for e in effects: kinds[e["family"]] = kinds.get(e["family"], 0) + 1
    return {"film": os.path.basename(video), "dur": round(dur, 1), "music": [[m, round(float(s), 3)] for m, s in music],
            "music_level": level, "effects": effects, "per_min": round(len(effects) / dur * 60, 1),
            "on_moves": round(len(on_move) / max(1, len(effects)), 2), "kinds": dict(sorted(kinds.items(), key=lambda r: -r[1])),
            "moves": moves, "moves_with_sound": round(sum(m["sound"] for m in moves) / max(1, len(moves)), 2), "chance": chance,
            "move_sounds": {k: sum(1 for m in moves if m["sound"] and m["family"] == k) for k in FAMILIES if any(m["sound"] and m["family"] == k for m in moves)},
            "tone": {k: round(float(np.mean([e["tone"][k] for e in effects])), 4) if effects else None for k in H.SCALES}}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("videos", nargs="+"); ap.add_argument("--stems"); ap.add_argument("--json")
    a = ap.parse_args()
    text, audio = H.load()
    out = []
    for v in a.videos:
        r = analyse(v, a.stems, text, audio); out.append(r)
        top = ", ".join(f"{k} ×{n}" for k, n in list(r["kinds"].items())[:5])
        ms = ", ".join(f"{k} ×{n}" for k, n in sorted(r["move_sounds"].items(), key=lambda x: -x[1]))
        print(f"{r['film']}: music {r['music'][0][0]} / {r['music'][1][0]}; big moves {len(r['moves'])}, "
              f"{int(r['moves_with_sound'] * 100)}% with a sound on them, {int((r['chance'] or 0) * 100)}% at random moments ({ms}); other effects heard: {top}", flush=True)
    if len(out) > 2:                                             # pace words against this set
        q1, q2 = np.percentile([r["per_min"] for r in out], [33, 66])
        for r in out: r["pace"] = "sparse" if r["per_min"] < q1 else "dense" if r["per_min"] > q2 else "moderate"
    if a.json: json.dump(out, open(a.json, "w"), indent=1); print("->", a.json)

if __name__ == "__main__":
    main()
