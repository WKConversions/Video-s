# Listens to sound effects the way a sound designer describes them: tone and style, not only the waveform.
# It uses an audio-language model (CLAP, laion/larger_clap_general: trained on sounds paired with descriptions) to
# score every sound against descriptions, so a sound can be chosen by how it feels.
#   python3 sfx_hear.py tag <library/sound>             tags every sound in sfx/index.json (writes "heard" into it)
#   python3 sfx_hear.py pick <library/sound> "calm premium corporate" --role whoosh [--n 6]
#                                                        ranks a role's sounds for a film's vibe
#   python3 sfx_hear.py describe file.wav [more.wav …]   what a file sounds like (also any reference audio)
# Tone scales (0 to 1 across the library, so 0.5 is the library's middle): soft–harsh, warm–cold, premium–toy,
# playful–serious, subtle–prominent, organic–digital. Style fit: how well it suits each film vibe below. "heard_as":
# the three descriptions it matches best. The model is a good ear, not a perfect one: in a test it named 7 of 10
# known sounds; trust the scales and the ranking, and check a surprising result by the sound's character and name.
# Needs torch, transformers, librosa (pip install torch --index-url https://download.pytorch.org/whl/cpu; pip install
# transformers librosa). The model (about 800 MB) downloads on first use.
import argparse, json, os, sys
import numpy as np

MODEL = "laion/larger_clap_general"
SCALES = {  # each pole is described several ways; a sound's score is how much closer it is to the first pole
    "soft": (["a soft, gentle sound", "a quiet, delicate sound", "a smooth, rounded sound"],
             ["a harsh, loud, aggressive sound", "a sharp, piercing sound", "a hard, abrasive sound"]),
    "warm": (["a warm, round, mellow sound", "a soft wooden or organic sound"],
             ["a cold, metallic, digital sound", "a thin, bright, glassy sound"]),
    "premium": (["a premium, elegant, high-end interface sound", "a refined, minimal, polished sound", "a luxury product sound"],
                ["a cheap toy sound", "a cartoonish, silly sound", "a retro video game sound"]),
    "playful": (["a playful, fun, bubbly sound", "a cute, cheerful sound", "a bouncy cartoon sound"],
                ["a serious, professional, corporate sound", "a calm, neutral business sound"]),
    "subtle": (["a subtle, barely noticeable sound", "a light, airy, faint sound"],
               ["a big, dramatic, impactful sound", "a loud cinematic hit"]),
    "organic": (["a natural, acoustic, physical sound", "a real object being touched"],
                ["an electronic, synthesized sound", "a futuristic digital sound"]),
}
STYLES = {
    "corporate-tech": "a clean sound effect for a corporate technology explainer video",
    "calm-premium": "a calm, elegant sound effect for a premium brand film",
    "playful-social": "a playful, bubbly sound effect for a social media app video",
    "energetic-startup": "an energetic, punchy sound effect for a startup advert",
    "cinematic": "a cinematic sound effect for a trailer",
    "friendly-human": "a warm, friendly sound effect for a human, caring brand",
    "data-ai": "a digital data processing sound for an AI product video",
    "retro-game": "a retro arcade game sound effect",
}
VOCAB = ["a mouse click", "a soft button tap", "a keyboard key", "typing on a keyboard", "a bubbly pop", "a water drop",
         "a notification chime", "a message received sound", "a glass ping", "a bell ding", "a positive confirmation",
         "an error buzz", "a swoosh", "a whoosh", "a fast whip", "a deep cinematic whoosh", "an airy swell", "a riser",
         "a rising sweep", "a falling sweep", "a soft thud", "a deep impact", "a stamp", "a camera shutter", "a ratchet gear",
         "a ticking clock", "a cash register", "coins", "a digital glitch", "data beeps", "a scanner", "a magical shimmer",
         "sparkles", "a zipper", "a paper slide", "a card flip", "a switch toggle", "a pluck", "a marimba note", "a synth blip",
         "a scroll wheel", "a page turn", "a whistle", "a laser", "a futuristic interface sound", "a cartoon boing"]

def load():
    import torch
    from transformers import ClapModel, ClapProcessor
    m = ClapModel.from_pretrained(MODEL); m.eval(); p = ClapProcessor.from_pretrained(MODEL)
    def feats(out):
        return out if torch.is_tensor(out) else out.pooler_output
    def text(ts):
        with torch.no_grad():
            e = feats(m.get_text_features(**p(text=ts, return_tensors="pt", padding=True)))
        return (e / e.norm(dim=-1, keepdim=True)).numpy()
    def audio(paths):
        import librosa
        out = []
        for i in range(0, len(paths), 16):
            xs = []
            for f in paths[i:i + 16]:
                y, _ = librosa.load(f, sr=48000, mono=True)
                y = y[: 48000 * 10] if len(y) else np.zeros(4800)
                xs.append(np.pad(y, (0, max(0, 4800 - len(y)))))       # at least 0.1 s
            with torch.no_grad():
                e = feats(m.get_audio_features(**p(audio=xs, sampling_rate=48000, return_tensors="pt", padding=True)))
            out.append((e / e.norm(dim=-1, keepdim=True)).numpy())
        return np.concatenate(out)
    return text, audio

def raw_scores(text, A):
    sc = {}
    for k, (pos, neg) in SCALES.items():
        sc[k] = (A @ text(pos).T).mean(1) - (A @ text(neg).T).mean(1)
    st = A @ text(list(STYLES.values())).T
    V = A @ text(VOCAB).T
    return sc, st, V

def rank01(x):
    r = np.argsort(np.argsort(x)); return r / max(1, len(x) - 1)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("cmd"); ap.add_argument("paths", nargs="+")
    ap.add_argument("--role"); ap.add_argument("--n", type=int, default=6); a = ap.parse_args()
    text, audio = load()
    if a.cmd == "tag":
        lib = a.paths[0]; ip = os.path.join(lib, "sfx", "index.json"); idx = json.load(open(ip))
        A = audio([os.path.join(lib, o["file"]) for o in idx]); sc, st, V = raw_scores(text, A)
        np.save(os.path.join(lib, "sfx", "clap.npy"), A)              # embeddings, for picking by any description
        json.dump(np.round(A.astype(np.float64), 4).tolist(), open(os.path.join(lib, "sfx", "clap.json"), "w"))   # the same, for the published library
        stz = (st - st.mean(0)) / (st.std(0) + 1e-9)
        for i, o in enumerate(idx):
            o["heard"] = {"tone": {k: round(float(rank01(v)[i]), 2) for k, v in sc.items()},
                          "style": {k: round(float(stz[i, j]), 2) for j, k in enumerate(STYLES)},
                          "heard_as": [VOCAB[j] for j in np.argsort(-V[i])[:3]]}
        json.dump(idx, open(ip, "w"), indent=1); print(f"{len(idx)} sounds heard and tagged in {ip}")
    elif a.cmd == "pick":
        lib, vibe = a.paths[0], " ".join(a.paths[1:]); idx = json.load(open(os.path.join(lib, "sfx", "index.json")))
        npy = os.path.join(lib, "sfx", "clap.npy")
        A = np.load(npy) if os.path.exists(npy) else np.array(json.load(open(os.path.join(lib, "sfx", "clap.json"))), dtype=np.float32)
        role = a.role or ""; q = text([f"a {vibe} {role} sound effect", f"{role} sound for a {vibe} video", f"a {vibe} sound"]).mean(0)
        s = A @ q
        rows = [(s[i], o) for i, o in enumerate(idx) if (not role or o["category"] == role) and o["licence"] != "apple"]
        for v, o in sorted(rows, key=lambda r: -r[0])[: a.n]:
            t = o.get("heard", {}).get("tone", {})
            print(f"{v:.3f}  {o['id']:44s} {o['category']:12s} soft {t.get('soft', 0):.2f} premium {t.get('premium', 0):.2f} playful {t.get('playful', 0):.2f}  ({o['licence']})")
    elif a.cmd == "describe":
        A = audio(a.paths); sc, st, V = raw_scores(text, A)
        for i, f in enumerate(a.paths):
            print(os.path.basename(f), "| heard as:", ", ".join(VOCAB[j] for j in np.argsort(-V[i])[:3]),
                  "| style:", max(STYLES, key=lambda k: st[i, list(STYLES).index(k)]))

if __name__ == "__main__":
    main()
