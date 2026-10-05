# Voice-over files: transcribe them, then force-align the script for word timings (planning/voice-over.md).
#   python3 vo_align.py transcribe vo1.mp3 vo2.mp3 ...        -> what each file says, its length
#   python3 vo_align.py align vo1.mp3 "your visitors give you three seconds"
#                                                               -> word@start-end in seconds
# Needs: pip install pocketsphinx, and ffmpeg on the PATH. Write the text lowercase and spell names the
# way they are spoken ("double you kay conversions"); unknown words make the alignment fail.
import subprocess, sys
from pocketsphinx import Decoder

def pcm(path):
    return subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                          check=True, capture_output=True).stdout

def decode(raw, text=None):
    d = Decoder(samprate=16000)
    if text: d.set_align_text(text)
    d.start_utt(); d.process_raw(raw, full_utt=True); d.end_utt()
    return d

mode = sys.argv[1]
if mode == "transcribe":
    for f in sys.argv[2:]:
        raw = pcm(f); d = decode(raw)
        print(f"{f}  {len(raw) / 32000:.2f}s  heard: {d.hyp().hypstr if d.hyp() else ''}")
elif mode == "align":
    d = decode(pcm(sys.argv[2]), sys.argv[3])
    print(" ".join(f"{s.word}@{s.start_frame / 100:.2f}-{s.end_frame / 100:.2f}" for s in d.seg()
                   if s.word not in ("<sil>", "(NULL)", "<s>", "</s>")))
