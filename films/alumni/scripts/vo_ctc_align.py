# Independent forced alignment: wav2vec2 (CTC, ONNX) + Viterbi over the script's characters, per sentence clip.
#   python3 vo_ctc_align.py vo.mp3 sentences.json model_dir out.json [pad_s]
# sentences.json: [{"text","start","end"}...] (rough bounds; each clip is padded by pad_s). Writes per-word start/end.
import json, re, subprocess, sys
import numpy as np
import onnxruntime as ort
src, sp, mdir, out = sys.argv[1:5]; PAD = float(sys.argv[5]) if len(sys.argv) > 5 else 0.12
SR = 16000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).copy()
vocab = json.load(open(f"{mdir}/vocab.json")); BLANK = vocab["<pad>"]
so = ort.SessionOptions(); so.intra_op_num_threads = 2
sess = ort.InferenceSession(f"{mdir}/onnx/model.onnx", so)

def viterbi(lp, toks):
    T, L = lp.shape[0], len(toks); S = 2 * L + 1
    ext = [BLANK if s % 2 == 0 else toks[s // 2] for s in range(S)]
    NEG = -1e30; dp = np.full((T, S), NEG); bp = np.zeros((T, S), np.int32)
    dp[0, 0] = lp[0, ext[0]]; dp[0, 1] = lp[0, ext[1]]
    for t in range(1, T):
        for s in range(S):
            best, arg = dp[t - 1, s], s
            if s >= 1 and dp[t - 1, s - 1] > best: best, arg = dp[t - 1, s - 1], s - 1
            if s >= 2 and s % 2 == 1 and ext[s] != ext[s - 2] and dp[t - 1, s - 2] > best: best, arg = dp[t - 1, s - 2], s - 2
            dp[t, s] = best + lp[t, ext[s]]; bp[t, s] = arg
    s = S - 1 if dp[T - 1, S - 1] >= dp[T - 1, S - 2] else S - 2
    path = [0] * T
    for t in range(T - 1, -1, -1):
        path[t] = s; s = bp[t, s]
    return path

res = []
for st in json.load(open(sp)):
    a = max(0.0, st["start"] - PAD); b = min(len(x) / SR, st["end"] + PAD)
    clip = x[int(a * SR):int(b * SR)]
    inp = ((clip - clip.mean()) / np.sqrt(clip.var() + 1e-7))[None, :].astype(np.float32)
    logits = sess.run(None, {"input_values": inp})[0][0]
    lp = logits - logits.max(1, keepdims=True); lp = lp - np.log(np.exp(lp).sum(1, keepdims=True))
    fdur = len(clip) / SR / lp.shape[0]
    words = st["text"].split()
    toks, owner = [], []
    for wi, w in enumerate(words):
        if wi: toks.append(vocab["|"]); owner.append(-1)
        for ch in re.sub(r"[^A-Z']", "", w.upper()):
            toks.append(vocab[ch]); owner.append(wi)
    path = viterbi(lp, toks)
    first, last = {}, {}
    for t, s in enumerate(path):
        if s % 2 == 1:
            wi = owner[s // 2]
            if wi < 0: continue
            first.setdefault(wi, t); last[wi] = t
    # greedy transcript for reference
    g = np.argmax(lp, 1); txt = []; prev = None
    for k in g:
        if k != prev and k != BLANK: txt.append([c for c, v in vocab.items() if v == k][0])
        prev = k
    ws = [{"w": w, "start": round(a + first[i] * fdur, 3), "end": round(a + (last[i] + 1) * fdur, 3)} for i, w in enumerate(words)]
    res.append({"text": st["text"], "greedy": "".join(txt).replace("|", " "), "words": ws})
    print(" ".join(f"{w['w']}[{w['start']:.2f}-{w['end']:.2f}]" for w in ws), " || ", res[-1]["greedy"], flush=True)
json.dump(res, open(out, "w"), indent=1)
