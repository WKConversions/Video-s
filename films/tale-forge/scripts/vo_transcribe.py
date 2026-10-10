# Transcribe the VO with word timestamps (faster-whisper), using the script as the initial prompt.
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
src, out, model_name = sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "medium"
script = open(sys.argv[4]).read() if len(sys.argv) > 4 else None
pcm = subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True).stdout
audio = np.frombuffer(pcm, dtype=np.float32).copy()
m = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=4)
segs, info = m.transcribe(audio, language="en", beam_size=5, word_timestamps=True, vad_filter=False, initial_prompt=script)
words = []
for s in segs:
    for w in s.words or []:
        words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "p": round(w.probability, 3)})
json.dump({"source": src, "model": model_name, "duration": info.duration, "words": words}, open(out, "w"), indent=1)
print(" ".join(w["word"] for w in words))
