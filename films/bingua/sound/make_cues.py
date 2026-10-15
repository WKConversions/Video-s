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
    ("gen-whoosh-whip", F("flick", 0.12), -4, None, "the thumb flicks the lesson away"),
    *[("gen-tick", F("flick", d), -8, p, "videos scroll past") for d, p in ((0.3, 0), (0.45, 2), (0.62, 4))],
    ("gen-whoosh-medium", F("logo", 0.25), -5, None, "the phone becomes the tile"),
    ("gen-impact-soft", F("logo", 0.5), -6, None, ""),
    ("gen-shimmer", F("word"), -8, None, "Bingua"),
    ("gen-whoosh-short", F("reopen", 0.25), -5, None, "the tile opens into the phone"),
    *[("gen-whoosh-short", F(s, 0.18), -6, p, "swipe to the next video") for s, p in (("s1", 0), ("s2", 2), ("s3", 4))],
    *[("gen-pop", F(s, 0.25), -8, p, "the language changes") for s, p in (("s1", 2), ("s2", 4), ("s3", 6))],
    ("gen-tap", F("tap"), -2, None, "tap the word"),
    ("gen-pop", F("card"), -5, 3, "the word card opens"),
    ("gen-chime", F("trans"), -6, None, "the translation"),
    ("gen-whoosh-short", F("swipe", 0.15), -6, -2, "swipe the line"),
    ("gen-appear", F("sheet", 0.1), -4, None, "the breakdown slides up"),
    ("gen-tick", F("ex1"), -7, 0, ""), ("gen-tick", F("ex2"), -7, 2, ""),
    ("gen-tap", F("w:useful", 0.04), -3, None, "tap famoso again"),
    ("gen-tap", F("save"), -2, 2, "Save"),
    ("gen-success", F("save", 0.05), -4, None, "Saved"),
    ("gen-whoosh-short", F("fly", 0.25), -7, 4, "famoso flies into Cards"),
    ("gen-pop", F("badge"), -4, 5, "the badge goes to 15"),
    ("gen-tap", F("cards", -0.05), -3, None, "Cards tab"),
    ("gen-whoosh-short", F("flip", 0.2), -6, 2, "the card flips"),
    ("gen-success", F("gotit"), -5, None, "Got it"),
    ("gen-tap", F("pick"), -2, 1, "pick famous"),
    ("gen-success", F("pick", 0.08), -3, 3, "correct, +10 XP"),
    ("gen-whoosh-short", F("lesson", 0.2), -7, None, "the old lesson comes back"),
    ("gen-whoosh-whip", F("lessonOut", 0.15), -4, None, "flicked away"),
    ("gen-whoosh-short", F("routine", 0.2), -7, 1, "the routine"),
    ("gen-whoosh-whip", F("routineOut", 0.15), -4, 2, "flicked away"),
    ("gen-tap", F("feed", -0.06), -3, None, "Home tab"),
    ("gen-whoosh-short", F("next", 0.18), -6, 3, "swipe"),
    ("gen-pop", F("heart"), -3, 4, "heart"),
    ("gen-riser-1s", F("xp", 0.9), -9, None, "XP fills to the goal"),
    ("gen-success", F("streak"), -3, 5, "streak 3"),
    ("gen-whoosh-medium", F("outro", 0.3), -5, None, "the phone becomes the tile"),
    ("gen-impact-deep", F("scroll", 0.05), -5, None, "Scrolling."),
    ("gen-pop", F("scroll", 0.5), -8, 3, "the App Store badge"),
]
out = {"fps": 30, "frames": 1080, "library": "lib",
       "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "bed.wav", "at": 0, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.8},
       "sfx": [dict(id=i, frame=f, db=db, **({"pitch": p} if p else {}), note=n) for i, f, db, p, n in cues]}
json.dump(out, open(os.path.join(here, "cues.json"), "w"), indent=1)
print(len(cues), "cues")
