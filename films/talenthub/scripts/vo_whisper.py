# Transcribe the voice-over with faster-whisper (word timestamps) -> vo/whisper_words.json
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
src = sys.argv[1]; out = sys.argv[2]
model_name = sys.argv[3] if len(sys.argv) > 3 else "small"
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(raw, np.float32).copy()
m = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=2)
segs, info = m.transcribe(audio, language=(sys.argv[4] if len(sys.argv) > 4 else "en"), word_timestamps=True, vad_filter=False, beam_size=5)
words = []
for s in segs:
    for w in s.words:
        words.append({"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "p": round(w.probability, 3)})
json.dump(words, open(out, "w"), indent=1)
print(" ".join(f"{w['w']}[{w['start']:.2f}-{w['end']:.2f}]" for w in words))
