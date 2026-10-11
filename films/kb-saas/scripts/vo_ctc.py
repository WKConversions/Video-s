# CTC forced alignment of a known script (word starts/ends), wav2vec2 (English: facebook/wav2vec2-base-960h, uppercase vocab).
import sys, json, re, numpy as np, soundfile as sf, torch
from transformers import AutoProcessor, AutoModelForCTC
wav, text, out, mname = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
proc = AutoProcessor.from_pretrained(mname); model = AutoModelForCTC.from_pretrained(mname).eval()
y, sr = sf.read(wav)
import librosa
y16 = librosa.resample(y.astype(np.float32), orig_sr=sr, target_sr=16000)
with torch.no_grad():
    iv = proc(y16, sampling_rate=16000, return_tensors="pt").input_values
    lp = torch.log_softmax(model(iv).logits[0], -1).numpy()
vocab = proc.tokenizer.get_vocab(); blank = proc.tokenizer.pad_token_id
sep = vocab.get("|", None)
words = text.split()
norm = lambda w: re.sub(r"[^A-Z']", "", w.upper())
toks, wid = [], []
for i, w in enumerate(words):
    for ch in norm(w):
        if ch in vocab: toks.append(vocab[ch]); wid.append(i)
    if sep is not None and i < len(words) - 1: toks.append(sep); wid.append(-1)
T, N = lp.shape[0], len(toks)
# trellis over (frame, token) with blank/stay transitions (torchaudio tutorial style)
tr = np.full((T + 1, N + 1), -np.inf); tr[0, 0] = 0
tr[1:, 0] = np.cumsum(lp[:, blank])
for t in range(T):
    stay = tr[t, 1:] + lp[t, blank]
    change = tr[t, :-1] + lp[t, toks]
    tr[t + 1, 1:] = np.maximum(stay, change)
# backtrack
t, j = T, N; path = []
while j > 0 and t > 0:
    stay = tr[t - 1, j] + lp[t - 1, blank]; change = tr[t - 1, j - 1] + lp[t - 1, toks[j - 1]]
    if change > stay: path.append((j - 1, t - 1)); j -= 1
    t -= 1
path = path[::-1]
fps = T / (len(y16) / 16000)
res = {}
for (k, f) in path:
    i = wid[k]
    if i < 0: continue
    a = f / fps
    if i not in res: res[i] = [a, a + 1 / fps]
    else: res[i][1] = a + 1 / fps
outw = [{"w": words[i], "s": round(res[i][0], 3), "e": round(res[i][1], 3)} for i in sorted(res)]
json.dump(outw, open(out, "w"), ensure_ascii=False, indent=0)
print(" ".join(f"{x['w']}@{x['s']:.2f}-{x['e']:.2f}" for x in outw))
