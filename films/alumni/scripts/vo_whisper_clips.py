# Second whisper pass: transcribe each sentence (cut at its pauses, padded) on its own and offset the word times.
#   python3 vo_whisper_clips.py vo.mp3 sentences.json out.json [pad_s]
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
src, sp, out = sys.argv[1:4]; PAD = float(sys.argv[4]) if len(sys.argv) > 4 else 0.15
SR = 16000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).copy()
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
res = []
for s in json.load(open(sp)):
    a = max(0.0, s["start"] - PAD); b = min(len(x) / SR, s["end"] + PAD)
    clip = x[int(a * SR):int(b * SR)]
    segs, _ = m.transcribe(clip, language="en", word_timestamps=True, vad_filter=False, beam_size=5, initial_prompt=None)
    ws = [{"w": w.word.strip(), "start": round(a + w.start, 3), "end": round(a + w.end, 3), "p": round(w.probability, 3)} for sg in segs for w in sg.words]
    res.append({"i": s["i"], "text": s["text"], "clip": [round(a, 3), round(b, 3)], "words": ws})
    print(s["i"], " ".join(f"{w['w']}[{w['start']:.2f}-{w['end']:.2f}]" for w in ws), flush=True)
json.dump(res, open(out, "w"), indent=1)
