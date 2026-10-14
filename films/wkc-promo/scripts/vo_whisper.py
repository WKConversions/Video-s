# Word timings for a voice-over with faster-whisper (more robust than vo_align.py's pocketsphinx on synthetic voices),
# with the script as the initial prompt:  python3 -I vo_whisper.py vo.mp3 words.json [model=medium] [script.txt]
# Needs `pip install faster-whisper` (a venv is fine; set HF_HOME to a writable folder for the model download).
# Then shift the times by the VO's place in the film and key them "w:word" (repeats numbered) for timeline.ts.
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
src, out, model_name = sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "medium"
script = open(sys.argv[4]).read() if len(sys.argv) > 4 else None
pcm = subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True).stdout
audio = np.frombuffer(pcm, dtype=np.float32).copy()
m = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=4)
segs, info = m.transcribe(audio, language=(sys.argv[5] if len(sys.argv) > 5 else "en"), beam_size=5, word_timestamps=True, vad_filter=False, initial_prompt=script)
words = []
for s in segs:
    for w in s.words or []:
        words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "p": round(w.probability, 3)})
json.dump({"source": src, "model": model_name, "duration": info.duration, "words": words}, open(out, "w"), indent=1)
print(" ".join(w["word"] for w in words))
