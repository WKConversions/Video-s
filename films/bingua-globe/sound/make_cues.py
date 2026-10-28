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
STOPS = [("esUp", "w:discover", "esWords", "esDone", "fr"), ("frUp", "w:things", "w:discover2-0.1", "frDone", "jp"),
         ("jpUp", "w:people", "w:video", "jpDone", "br"), ("brUp", "w:portuguese+0.2", "w:enjoying", "brDone", "it"),
         ("itUp", "w:language2", "w:culture+0.1", "itDone", "five")]
PINS = ["w:spain-0.15", "w:france-0.1", "w:japan", "w:brazil+0.35", "w:italy-0.1"]
FLIGHTS = [("fr", 0.2), ("jp", 0.0), ("br", 0.05), ("it", 0.0)]
cues = [
    ("gen-whoosh-whip", 1, -3, None, "frame 0: the globe is already spinning under the thumb"),
    ("gen-whoosh-whip", F("sw2", 0.05), -4, 1, "every scroll: spin"),
    ("gen-whoosh-whip", F("sw3", 0.05), -4, 2, "spin"),
    ("gen-pop", F(0.6), -6, 4, "こんにちは"), ("gen-pop", F("sw2", 0.62), -6, 3, "Olá"),
    *[("gen-pop", F("sw3", d), -8, p, "Hola, Bonjour, Ciao") for d, p in ((0.62, 2), (0.74, 4), (0.86, 6))],
    ("gen-impact-soft", F("meet", 0.1), -4, None, "Bingua"),
    ("gen-shimmer", F("w:bingua"), -7, None, ""),
    ("gen-whoosh-medium", F("orbit", 0.15), -6, None, "the ring of languages"),
    ("gen-whoosh-whip", F("swipe", 0.05), -3, None, "one swipe"),
    ("gen-whoosh-deep", F("swipe", 0.6), -6, None, "the globe turns to Spain"),
    *[("gen-pop", F(p, 0.2), -4, i, "pin lands") for i, p in enumerate(PINS)],
    *[x for i, (up, tap, chip, done, out) in enumerate(STOPS) for x in (
        ("gen-appear", F(up, 0.1), -6, i - 2, "the reel rises out of the country"),
        ("gen-tap", F(tap), -2, None, "tap the word"),
        ("gen-pop", F(tap, 0.08), -6, 3, "word card"),
        ("gen-chime", F(tap, 0.28), -8, i, "translation"),
        ("gen-whoosh-short", F(chip, 0.15), -7, 2, "the word flies to its country"),
        ("gen-pop", F(chip, 0.6), -6, 5, "and lands"),
        ("gen-success", F(done), -5, i, "language checked"),
        ("gen-whoosh-short", F(out, 0.12), -7, -3, "back into the pin"),
    )],
    *[x for lab, d in FLIGHTS for x in (("gen-whoosh-deep", F(lab, d + 0.3), -5, None, "the flight"), ("gen-swell", F(lab, d + 0.25), -10, None, ""))],
    ("gen-whoosh-short", F("jpNext"), -6, 1, "one video at a time"),
    ("gen-whoosh-short", F("itNext"), -6, 1, "next video"),
    ("gen-tap", F("w:love"), -3, None, "heart"), ("gen-pop", F("w:love", 0.05), -5, 6, ""),
    ("gen-whoosh-medium", F("five", 0.2), -6, -1, "zoom out"),
    *[("gen-pop", F("w:countries", 0.09 * i + 0.1), -7, i, "five flags") for i in range(5)],
    *[("gen-tick", F("w:languages2", 0.09 * i + 0.05), -8, i, "five languages") for i in range(5)],
    ("gen-riser-1s", F("endless", -0.6), -9, None, "the world lights up"),
    ("gen-shimmer", F("endless", 0.2), -6, None, ""),
    *[("gen-tick", F("endless", 0.3 + 0.18 * i), -10, i % 6, "greetings") for i in range(7)],
    ("gen-whoosh-medium", F("classroom", 0.25), -5, None, "the world goes into the app"),
    *[("gen-pop", F("w:world2", 0.1 * i + 0.1), -9, i, "flags in the app") for i in range(5)],
    ("gen-whoosh-medium", F("endcard", 0.2), -5, None, "the end card"),
    ("gen-impact-soft", F("w:bingua3", 0.05), -5, None, "Bingua"),
    ("gen-whoosh-whip", F("spin", 0.05), -4, None, "scroll the world"),
    ("gen-pop", F("w:languages3", 0.4), -6, 3, "App Store badge"),
]
out = {"fps": 30, "frames": 1395, "library": "lib",
       "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "bed.wav", "at": 0, "duck_db": 6, "fade_in": 0.05, "fade_out": 1.2},
       "sfx": [dict(id=i, frame=f, db=db, **({"pitch": p} if p else {}), note=n) for i, f, db, p, n in cues]}
json.dump(out, open(os.path.join(here, "cues.json"), "w"), indent=1)
print(len(cues), "cues")
