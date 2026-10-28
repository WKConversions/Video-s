# Word timings of a film's voice-over, for phrase_check.py, from the film itself (no script needed).
#   python3 vo_words.py film.mp4 words.json [--model base.en]
# Writes {"w:<word><n>": start_seconds, ...} (the n keeps repeated words apart; phrase_check strips it).
# Needs faster-whisper (pip install --user faster-whisper); the model downloads once (~140 MB for base.en).
import sys, json, re, subprocess
import numpy as np
from faster_whisper import WhisperModel
film, out = sys.argv[1], sys.argv[2]
name = sys.argv[sys.argv.index("--model") + 1] if "--model" in sys.argv else "base.en"
m = WhisperModel(name, device="cpu", compute_type="int8", cpu_threads=2)
# decode with ffmpeg (16 kHz mono float): faster-whisper's own loader breaks on some PyAV versions
pcm = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", film, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.float32)
segs, _ = m.transcribe(audio, word_timestamps=True, vad_filter=True)
words, text = {}, []
for s in segs:
    for w in s.words:
        t = re.sub(r"[^\w'-]", "", w.word.strip().lower())
        if t: words[f"w:{t}{len(words)}"] = round(w.start, 3); text.append(t)
json.dump(words, open(out, "w"), indent=0)
print(f"{len(words)} words, {len(text) / max(1e-6, (max(words.values()) - min(words.values()))):.2f} words/s: " + " ".join(text[:40]) + " …")
