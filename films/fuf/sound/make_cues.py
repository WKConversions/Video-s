# Writes sound/cues.json from the film's labels (film/src/clock.ts + film/src/words.json): every effect on the frame
# of the action it sounds (a tap on the touch, a whoosh at the middle of a swipe, a pop on a landing).
#   python3 sound/make_cues.py
import json, re, os
here = os.path.dirname(os.path.abspath(__file__))
words = json.load(open(os.path.join(here, "../film/src/words.json")))
src = open(os.path.join(here, "../film/src/clock.ts")).read()
beats = dict(re.findall(r'^\s+(\w+):\s*("?[^,\n]+"?),', src.split("BEATS")[1].split("};")[0], re.M))
beats.update(dict(re.findall(r'(\w+):\s*([\d.]+)', src.split("BEATS")[1].split("};")[0])))  # several labels per line
lab = {**words}
def sec(pos):
    pos = str(pos).strip().strip('"')
    m = re.match(r'^([^+-]+?)\s*([+-]\s*[\d.]+)?$', pos)
    base, d = m[1].strip(), float(m[2].replace(" ", "")) if m[2] else 0.0
    if base in lab: return lab[base] + d
    if base in beats:
        v = beats[base].strip('"')
        lab[base] = float(v) if re.match(r'^[\d.]+$', v) else sec(v)
        return lab[base] + d
    return float(base) + d
F = lambda pos, extra=0.0: int(round((sec(pos) + extra) * 30))
cues = [
    ("gen-shimmer", 2, -12, -3, "frame 0: the network"),
    *[("gen-tick", F(t), -14, p, "a connection") for t, p in ((0.4, 0), (0.9, 2), (1.4, 4), (1.9, 3))],
    ("gen-swell", F("but", -0.1), -12, -4, "the network comes apart"),
    ("gen-whoosh-medium", F("meet", -0.05), -6, -2, "cream opens out"),
    ("gen-shimmer", F("future"), -8, None, "the mark"),
    ("gen-whoosh-medium", F("an", -0.2), -7, -3, "Málaga"),
    *[("gen-tick", F(l), -12, p, "who it brings together") for l, p in (("founders2", 0), ("entrepreneurs", 2), ("builders", 4), ("investors", 5))],
    ("gen-whoosh-short", F("through", -0.1), -8, None, "the gallery"),
    *[("gen-pop", F("through", 0.6 + 0.18 * i), -12, i, "a photo") for i in range(3)],
    *[("gen-tick", F(l, 0.1), -11, p, "a caption") for l, p in (("ideas", 2), ("partnerships", 4), ("opportunities", 6))],
    ("gen-whoosh-medium", F("no", -0.15), -7, -2, "the business cards"),
    ("gen-whoosh-short", F("25.4"), -10, 2, "struck through"),
    ("gen-whoosh-short", F("endless", 0.35), -10, 3, "struck through"),
    ("gen-whoosh-medium", F("business", 0.3), -8, 1, "the cards fly away"),
    ("gen-whoosh-short", F("just", -0.15), -8, None, "real conversations"),
    ("gen-whoosh-medium", F("because", -0.15), -8, -3, "back to the dark"),
    ("gen-impact-soft", F("one", 0.3), -8, None, "the two connect"),
    ("gen-shimmer", F("conversation"), -9, 2, ""),
    ("gen-whoosh-medium", F("endcard", -0.05), -6, -2, "the end card"),
    ("gen-pop", F("together2", 0.35), -10, 3, "Join the community"),
]
out = {"fps": 30, "frames": 1275, "library": "lib",
       "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "bed.wav", "at": 0, "duck_db": 6, "fade_in": 0.05, "fade_out": 1.2},
       "sfx": [dict(id=i, frame=f, db=db, **({"pitch": p} if p else {}), note=n) for i, f, db, p, n in cues]}
json.dump(out, open(os.path.join(here, "cues.json"), "w"), indent=1)
print(len(cues), "cues")
