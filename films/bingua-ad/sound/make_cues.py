# Writes sound/cues.json from the film's labels (film/src/clock.ts + film/src/words.json): every effect on the frame
# of the action it sounds (a tap on the touch, a whoosh at the middle of a swipe, a pop on a landing).
#   python3 sound/make_cues.py
import json, re, os
here = os.path.dirname(os.path.abspath(__file__))
words = json.load(open(os.path.join(here, "../film/src/words.json")))
src = open(os.path.join(here, "../film/src/clock.ts")).read()
beats = dict(re.findall(r'^\s+(\w+):\s*("?[^,\n]+"?),', src.split("BEATS")[1].split("};")[0], re.M))
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
    ("gen-whoosh-whip", 1, -3, None, "frame 0: the feed is already rushing"),
    *[("gen-tick", F(d), -9, p, "posts scroll past") for d, p in ((0.3, 0), (0.6, 2), (0.9, 4), (1.2, 2), (1.5, 0))],
    ("gen-whoosh-short", F("w:lives", 0.15), -7, None, "another flick"),
    ("gen-appear", F("plans", 0.1), -6, None, "your plans card"),
    *[("gen-stamp", F("w:hold", d), -8, p, "ON HOLD") for d, p in ((0.0, 0), (0.12, 1), (0.24, 2))],
    ("gen-whoosh-short", F("timer", 0.05), -6, None, "the counter comes in"),
    *[("gen-tick", F("timer", 0.25 + 0.22 * i), -10, i % 5, "minutes run") for i in range(7)],
    *[("gen-whoosh-short", F("timer", 0.25 + 0.3 * i), -10, -2, "scrolling on") for i in range(5)],
    ("gen-impact-soft", F("w:hour"), -4, -3, "1 hour"),
    ("gen-appear", F("empty", 0.25), -6, -2, "today's stats"),
    *[("gen-pop", F(a), -8, -3, "zero") for a in ("w:get", "w:out", "w:it2")],
    ("gen-whoosh-deep", F("meet", 0.1), -3, None, "blue floods out"),
    ("gen-impact-soft", F("meet", 0.4), -5, None, ""),
    ("gen-shimmer", F("w:bingua"), -7, None, "Bingua"),
    ("gen-whoosh-medium", F("app", 0.2), -6, None, "pours back into the phone"),
    *[("gen-whoosh-short", F("app", 0.15 + d + 0.12), -8, p, "swipe") for d, p in ((0, 0), (0.45, 1), (0.9, 2), (1.35, 3), (1.8, 4), (2.25, 5))],
    *[("gen-pop", F("app", 0.15 + d + 0.6), -9, p, "a word collected") for d, p in ((0, 2), (0.45, 3), (0.9, 4), (1.35, 5), (1.8, 6), (2.25, 7))],
    ("gen-whoosh-medium", F("map", 0.2), -5, None, "the words fly home to their countries"),
    *[("gen-pop", F("w:learning", 0.18 * i + 0.25), -8, i, "flag pin lands") for i in range(6)],
    ("gen-whoosh-short", F("watch", 0.05), -6, None, "back to the app"),
    ("gen-tap", F("w:new"), -2, None, "tap famoso"),
    ("gen-pop", F("w:new", 0.12), -6, 3, "word card"),
    ("gen-chime", F("w:words"), -7, None, "translation"),
    ("gen-whoosh-short", F("convo", 0.1), -7, -1, "the conversation plays on"),
    ("gen-whoosh-short", F("love", 0.35), -7, 1, "swipe"),
    ("gen-tap", F("w:love"), -3, None, "heart"),
    ("gen-pop", F("w:love", 0.05), -5, 5, ""),
    ("gen-whoosh-short", F("love", 1.05), -7, 2, "swipe"),
    ("gen-whoosh-medium", F("diff", 0.15), -5, -1, "the map returns"),
    ("gen-whoosh-deep", F("abroad", 0.45), -5, None, "zoom to Europe"),
    ("gen-swell", F("abroad", 0.4), -9, None, "the flight"),
    ("gen-pop", F("w:abroad", 0.1), -7, 2, "Barcelona"),
    ("gen-appear", F("others", 0.1), -7, -2, "others' feed"),
    ("gen-whoosh-medium", F("talk"), -5, None, "the park"),
    ("gen-pop", F("w:starting", 0.05), -5, 4, "¡Hola!"),
    ("gen-pop", F("w:conversations2", 0.4), -5, 6, "¡Soy de Holanda!"),
    ("gen-whoosh-short", F("friends"), -6, None, "the balcony"),
    ("gen-success", F("w:friends", 0.1), -5, None, "+3 new friends"),
    ("gen-whoosh-short", F("explore"), -6, 1, "Ibiza"),
    *[("gen-pop", F(a, 0.1), -8, p, "a city") for a, p in (("w:exploring", 3), ("w:the3", 4), ("w:world", 5), ("w:world+0.25", 7))],
    ("gen-riser-1s", F("burst", -0.15), -8, None, "into the screen"),
    ("gen-whoosh-deep", F("burst", 0.25), -4, None, "out of the screen"),
    ("gen-impact-deep", F("burst", 0.7), -6, None, "life, full frame"),
    ("gen-whoosh-medium", F("endcard", 0.15), -5, None, "the end card"),
    ("gen-shimmer", F("w:bingua2"), -6, None, "Bingua"),
    *[("gen-pop", F("endcard", 0.4 + 0.14 * i), -11, i, "flags") for i in range(6)],
    ("gen-impact-soft", F("w:connections", 0.1), -5, None, "connections."),
    ("gen-pop", F("w:connections", 0.4), -7, 3, "App Store badge"),
]
out = {"fps": 30, "frames": 1215, "library": "lib",
       "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "bed.wav", "at": 0, "duck_db": 6, "fade_in": 0.05, "fade_out": 0.8},
       "sfx": [dict(id=i, frame=f, db=db, **({"pitch": p} if p else {}), note=n) for i, f, db, p, n in cues]}
json.dump(out, open(os.path.join(here, "cues.json"), "w"), indent=1)
print(len(cues), "cues")
