import json, sys
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[1] if len(sys.argv)>1 else "small", device="cpu", compute_type="int8")
segs, info = m.transcribe("vo/vo16k.wav", word_timestamps=True, vad_filter=False)
print("lang", info.language, info.language_probability)
words=[]; out=[]
for s in segs:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    out.append({"start":s.start,"end":s.end,"text":s.text})
    for w in s.words:
        words.append({"w":w.word.strip(),"s":round(w.start,3),"e":round(w.end,3),"p":round(w.probability,2)})
json.dump({"segments":out,"words":words}, open((sys.argv[2] if len(sys.argv)>2 else "vo/transcript.json"),"w"), indent=1)
