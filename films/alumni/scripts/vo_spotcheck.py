# Spot-check word starts: whisper on a 0.4 s clip starting at the word (should begin with the word, not the previous
# word's tail), on the 0.4 s before it (should hold the previous word, not this one), and the envelope around the start.
#   python3 vo_spotcheck.py vo.mp3 words_full.json key1 key2 ...
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
src, wp, keys = sys.argv[1], sys.argv[2], sys.argv[3:]
SR = 16000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).copy()
words = json.load(open(wp)); byk = {w["key"]: (i, w) for i, w in enumerate(words)}
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
pad = np.zeros(int(0.25 * SR), np.float32)
def hear(a, b):
    clip = np.concatenate([pad, x[int(a * SR):int(b * SR)], pad])
    segs, _ = m.transcribe(clip, language="en", word_timestamps=True, vad_filter=False, beam_size=5, condition_on_previous_text=False)
    return " ".join(w.word.strip() for s in segs for w in s.words) or "(nothing)"
def env(t):
    seg = x[max(0, int(t * SR) - 80):int(t * SR) + 80]; return 10 * np.log10((seg ** 2).mean() + 1e-12)
for k in keys:
    i, w = byk[k]; t = w["start"]; prev = words[i - 1]["w"] if i else "-"
    e = " ".join(f"{env(t + d):.0f}" for d in np.arange(-0.06, 0.061, 0.02))
    print(f"{k:15s} start {t:6.2f} | from start: '{hear(t, t + 0.4)}' | 0.4 s before: '{hear(t - 0.4, t)}' (prev word '{prev}') | dB t-60..t+60ms: {e}", flush=True)
