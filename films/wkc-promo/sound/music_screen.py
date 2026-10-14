# Screens candidate music against the reference promo's music (how "Can't Get You Off My Mind" was chosen):
#   python3 -I music_screen.py ../ref/audio.wav <dir of excerpts or tracks> <list.json> <out.json>
# list.json: [{"title", "artist", "genre", "url", "length"}, ...] (Mixkit listing pages' JSON-LD; the file looked up in
# the dir is the url's basename, e.g. 1210.mp3). Each track (a 25 s mid-track excerpt is enough) is measured against the
# reference's main section (3.3-38 s): tempo folded into the 150 family and the stretch it would need, long-term
# spectrum distance, chroma correlation after the best transposition, mid-band stereo width, sub/air shares, hat rate.
# Run with -I: the excerpts are downloads. music/screening.json is this run's result for 191 Mixkit tracks
# (genres trap, future bass, hip hop, EDM/electronic; moods energetic, futuristic; tag technology).
import json, os, subprocess, sys, glob
import numpy as np, librosa
SR = 22050
def load(path, t0=None, t1=None, ch=2):
    cmd = ["ffmpeg", "-v", "error"]
    if t0 is not None: cmd += ["-ss", str(t0)]
    if t1 is not None: cmd += ["-t", str(t1 - (t0 or 0))]
    cmd += ["-i", path, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch).astype(np.float64)
MAJ = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
MIN = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
BANDS = np.geomspace(32, 10500, 26)
def feats(x):
    m = x.mean(1); s = (x[:, 0] - x[:, 1]) / 2
    # tempo: onset autocorrelation
    oenv = librosa.onset.onset_strength(y=m.astype(np.float32), sr=SR, hop_length=256, aggregate=np.median)
    fps = SR / 256
    oenv = oenv - oenv.mean()
    ac = np.correlate(oenv, oenv, "full")[len(oenv) - 1:]; ac /= ac[0] + 1e-9
    def strength(bpm):
        lag = 60 * fps / bpm; i = int(lag); f = lag - i
        return ac[i] * (1 - f) + ac[i + 1] * f if i + 1 < len(ac) else 0
    bpms = np.arange(60, 200, 0.25)
    st = np.array([strength(b) + 0.5 * strength(b / 2) + 0.5 * strength(b * 2) if b * 2 < 400 else strength(b) for b in bpms])
    best = bpms[np.argmax(st)]
    # tempo as a 150-family candidate: fold into 120-190 range
    cand = best
    while cand < 115: cand *= 2
    while cand > 190: cand /= 2
    # comb refine around cand
    t = np.arange(len(oenv)) / fps
    def comb(b):
        p = 60 / b; z = (np.maximum(oenv, 0) * np.exp(2j * np.pi * t / p)).sum(); return abs(z)
    fine = max(np.arange(cand - 2, cand + 2, 0.02), key=comb)
    # spectrum
    S = np.abs(librosa.stft(m.astype(np.float32), n_fft=8192, hop_length=1024)) ** 2
    fr = librosa.fft_frequencies(sr=SR, n_fft=8192)
    ltas = np.array([S[(fr >= a) & (fr < b)].mean() for a, b in zip(BANDS[:-1], BANDS[1:])])
    ltas_db = 10 * np.log10(ltas + 1e-12); ltas_db -= ltas_db.max()
    tot = S.sum()
    sub = S[(fr >= 25) & (fr < 70)].sum() / tot
    air = S[fr >= 6000].sum() / tot
    cent = float((S * fr[:, None]).sum() / tot)
    # stereo width mid band
    Sm = np.abs(librosa.stft(((x[:, 0] + x[:, 1]) / 2).astype(np.float32), n_fft=2048)) ** 2
    Ss = np.abs(librosa.stft(s.astype(np.float32), n_fft=2048)) ** 2
    f2 = librosa.fft_frequencies(sr=SR, n_fft=2048); bandm = (f2 > 150) & (f2 < 2000)
    width = 10 * np.log10(Ss[bandm].sum() / (Sm[bandm].sum() + 1e-12) + 1e-12)
    # key
    ch = librosa.feature.chroma_cqt(y=m.astype(np.float32), sr=SR).mean(1)
    best_k = max(((np.corrcoef(np.roll(P, k), ch)[0, 1], k, mode) for P, mode in ((MAJ, "maj"), (MIN, "min")) for k in range(12)))
    key = NAMES[best_k[1]] + " " + best_k[2]
    # semitone distance to G minor (or its relative Bb major)
    root = best_k[1] if best_k[2] == "min" else (best_k[1] - 3) % 12
    shift = ((7 - root + 6) % 12) - 6
    # hat density: onsets in >5 kHz
    hf = librosa.onset.onset_strength(S=librosa.power_to_db(S[fr > 5000]), sr=SR, hop_length=1024)
    hpk = librosa.util.peak_pick(hf, pre_max=2, post_max=2, pre_avg=4, post_avg=4, delta=hf.std() * 0.5, wait=2)
    dur = len(m) / SR
    rms = np.sqrt((m ** 2).mean())
    chroma = (ch / ch.sum()).tolist()
    return {"chroma": chroma, "bpm_best": float(best), "bpm150": round(float(fine), 2), "stretch": round(150 / fine, 4), "ltas": ltas_db.round(1).tolist(), "sub": round(float(sub), 3),
            "air": round(float(air), 4), "centroid": round(cent), "width_db": round(float(width), 1), "key": key, "key_shift": int(shift), "key_conf": round(float(best_k[0]), 2),
            "hat_rate": round(len(hpk) / dur, 2), "rms_db": round(20 * np.log10(rms + 1e-9), 1)}
ref, d, lst, out = sys.argv[1:5]
R = feats(load(ref, 3.3, 38.0))
print("REF", {k: v for k, v in R.items() if k not in ("ltas", "chroma")})
res = []
for it in json.load(open(lst)):
    fid = it["url"].split("/")[-1]
    p = os.path.join(d, fid)
    if not os.path.exists(p): continue
    try: F = feats(load(p))
    except Exception as e: print("skip", fid, e); continue
    cr = np.array(R["chroma"]); cc = np.array(F["chroma"])
    corr = [np.corrcoef(np.roll(cc, k), cr)[0, 1] for k in range(12)]
    k = int(np.argmax(corr)); F["key_shift"] = int(((k + 6) % 12) - 6); F["chroma_corr"] = round(float(corr[k]), 2); F["chroma_corr0"] = round(float(corr[0]), 2)
    spec = float(np.sqrt(np.mean((np.array(F["ltas"]) - np.array(R["ltas"])) ** 2)))
    tempo_pen = abs(F["stretch"] - 1)
    score = spec + 60 * tempo_pen + 0.4 * abs(F["key_shift"]) + 3 * (1 - F["chroma_corr"]) + 2 * abs(F["width_db"] - R["width_db"]) / 6
    F.update({"title": it["title"], "artist": it["artist"], "genre": it["genre"], "url": it["url"], "length": it["length"], "spec_dist": round(spec, 2), "score": round(score, 2)})
    res.append(F)
res.sort(key=lambda r: r["score"])
json.dump({"ref": R, "cands": res}, open(out, "w"), indent=1)
for r in res[:70]:
    print(f"{r['score']:6.2f} spec {r['spec_dist']:5.2f} {r['bpm150']:7.2f} (best {r['bpm_best']:6.2f}) x{r['stretch']:.3f} {r['key']:7s} shift{r['key_shift']:+d} c{r['chroma_corr']:.2f}/{r['chroma_corr0']:.2f} w{r['width_db']:+5.1f} sub {r['sub']:.2f} air {r['air']:.3f} hats {r['hat_rate']:4.1f}/s  {r['genre'][:10]:10s} {r['title'][:28]:28s} {r['artist'][:14]} {r['url'].split('/')[-1]}")
