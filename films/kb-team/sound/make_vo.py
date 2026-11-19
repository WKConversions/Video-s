# Places Karl's voice-over (ElevenLabs, voice Warren, 30.4 s) sentence by sentence where the reference film speaks its
# matching sentences (the reference's voice was separated with Demucs and its phrase starts measured: plan/ref notes in
# README). The recording is cut only in pauses (and once between "team" and "for", in a dip), with short fades.
#   python3 make_vo.py   ->  vo_placed.wav (48 kHz mono, 50.05 s) and vo-plan.json (each clip and word in film seconds)
import json, subprocess, numpy as np, wave
SR = 48000; DUR = 50.05
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "../vo/warren.mp3", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.float32).astype(np.float64)
# (text, source in, source out, film start, reference line it answers)
CLIPS = [
    ("What if your business had the right team", 0.03, 2.03, 0.32, "What if you could build an app"),
    ("for what comes next?", 2.03, 3.30, 3.83, "with your name on it?"),
    ("K.B.", 3.55, 4.13, 5.93, "Base44."),
    ("A team behind you.", 4.43, 5.93, 7.55, "Big changes start small."),
    ("Part of your business, with the talent to take it further.", 6.14, 9.27, 10.55, "A few words even will get you a fully working app."),
    ("From the systems your team works with,", 9.55, 11.43, 14.74, "From a tool only you will use"),
    ("to the customers you reach,", 11.58, 13.18, 18.21, "to a platform millions might."),
    ("from early concepts", 13.41, 14.58, 23.53, "From passion projects"),
    ("to products people choose.", 14.60, 16.59, 27.86, "to enterprise-level systems."),
    ("One shared vision.", 16.79, 18.13, 31.08, "Same starting point."),
    ("One partner.", 18.32, 19.30, 33.65, "No ceiling."),
    ("Think big.", 19.54, 20.37, 35.78, "Shape it."),
    ("Build well.", 20.46, 21.39, 36.87, "Push it."),
    ("Grow with us.", 21.51, 22.60, 38.20, "Build on it."),
    ("Your growth has a partner.", 22.76, 24.46, 39.50, "Your back end is covered,"),
    ("Involved.", 24.64, 25.40, 41.38, "secure"),
    ("From day one onwards.", 25.55, 27.00, 42.30, "and ready to launch."),
    ("What could your next chapter look like?", 27.02, 29.32, 45.00, "What if you can build it today?"),
    ("K.B.", 29.63, 30.19, 48.14, "Base44."),
]
TIGHTEN = [(27.20, 27.34)]          # silence removed inside a clip (the recording pauses after "What")
out = np.zeros(int(DUR * SR)); F = int(0.010 * SR)
words = json.load(open("../plan/vo-words.json"))["words"]; plan = []
for text, s0, s1, at, ref in CLIPS:
    seg = a[int(s0 * SR):int(s1 * SR)].copy(); cut = 0.0; wt = []
    for c0, c1 in TIGHTEN:
        if s0 < c0 and c1 < s1:
            i0, i1 = int((c0 - s0) * SR), int((c1 - s0) * SR); x = np.linspace(0, 1, 240)
            seg[i0 - 240:i0] *= 1 - x; seg[i1:i1 + 240] *= x; seg = np.concatenate([seg[:i0], seg[i1:]]); cut = c1 - c0
            for w in words:
                if w["start"] >= c1 - 0.01: w["_shift"] = cut
    seg[:F] *= np.linspace(0, 1, F); seg[-F:] *= np.linspace(1, 0, F)
    i = int(at * SR); out[i:i + len(seg)] += seg[:max(0, len(out) - i)]
    for w in words:
        mid = (w["start"] + w["end"]) / 2
        if s0 - 0.02 <= mid <= s1 + 0.02: wt.append({"word": w["word"], "t": round(at + w["start"] - s0 - w.get("_shift", 0), 3)})
    plan.append({"text": text, "src": [s0, s1], "at": at, "end": round(at + len(seg) / SR, 3), "answers": ref, "words": wt})
pcm = (np.clip(out, -1, 1) * 32767).astype("<i2")
with wave.open("vo_placed.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
json.dump(plan, open("vo-plan.json", "w"), indent=1)
for p in plan: print(f"{p['at']:6.2f} - {p['end']:6.2f}  {p['text']}")
