# The Alumni film's cue sheet: the supplied voice-over, the music bed and an effect on every picture event that
# carries meaning, placed on the same labels as the picture (film/src/clock.ts, film/src/Story.tsx).
#   python3 scripts/cues.py            (run from films/alumni; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
# Effects: the studio's generated sounds (gen-*) and Kenney's CC0 interface sounds (kenney-*). SaaS brief: clean,
# crisp UI sounds (taps, ticks, soft pops), airy swishes on the bigger moves, one shimmer for the brand.
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 39.0
L = dict(W)
L.update({"hook": 0.0, "ask": W["w:so"] - 0.2, "meet": W["w:meet"] - 0.15, "connect": W["w:connecting"] - 0.15, "start": W["w:start"] - 0.2,
          "brings": W["w:alumni2"] - 0.15, "grads": W["w:for2"] - 0.2, "biz": W["w:for3"] - 0.2, "agency": W["w:and3"] - 0.2,
          "newc": W["w:new2"] - 0.15, "sign": W["w:alumni3"] - 0.2, "chapter": W["w:your4"] - 0.2})
POP, TAP, TAP2, TICK, CLICK, OPEN = "kenney-drop-003", "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-maximize-009"

cues = []
def cue(label, off, sid, db=0, pitch=0, note="", auto=True):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db, **({"pitch": pitch} if pitch else {}),
                 **({} if auto else {"auto_level": False}), "note": note})
_w = [0]
def swish(label, off, db, note):
    i = _w[0]; _w[0] += 1
    cue(label, off, "gen-whoosh-short" if i % 2 == 0 else "gen-whoosh-whip", db - (0 if i % 2 == 0 else 2), [-2, 0, 2][i % 3], note)

# 1 hook: the internship card, the bar fills to 100%, the line runs on
cue("w:your", 0.17, "gen-appear", -6, note="the internship card arrives")
cue("w:beginning", 0.0, "gen-riser-1s", -12, note="the bar fills (ends on 100%)")
cue("w:beginning", 0.1, TAP, -4, note="Completed")
swish("w:beginning", 0.6, -11, "the line runs on out of the card")
# 2 the question
swish("ask", 0.2, -6, "the search bar arrives")
for i in range(5):
    cue("w:so", 0.2 + i * 0.13, CLICK, -14, [0, 2, -1, 3, 1][i], "a key")
for i in range(3):
    cue("w:comes", i * 0.12 + 0.1, POP, -11, [-5, -2, 0][i], "a suggestion row")
# 3 Meet Alumni
cue("meet", -0.05, "gen-whoosh-medium", -5, note="the bar closes into a point")
cue("meet", 0.12, "gen-swell", -6, note="the A climbs, the L turns")
cue("w:alumni", 0.05, "gen-impact-soft", -7, note="the name lands")
cue("w:alumni", 0.15, "gen-shimmer", -8, note="the brand")
# 4 the hub
cue("connect", 0.1, "gen-whoosh-medium", -6, note="the logo becomes the hub")
cue("w:graduates", -0.05, OPEN, -5, note="the graduate tile")
for i, lab in enumerate(["w:international", "w:career", "w:opportunities"]):
    cue(lab, 0.08, POP, -7, [-7, -4, 0][i], f"opportunity {i + 1} lands")
# 5 the profile
cue("start", 0.05, "gen-whoosh-medium", -5, note="the tile opens into the profile")
for i in range(2):
    cue("w:experience", 0.25 + i * 0.18, TAP2, -5, i * 3, "a tick")
for i in range(3):
    cue("w:ambitions", i * 0.14 + 0.1, "gen-pop", -9, [-7, -3, 0][i], "an ambition chip")
for i in range(2):
    cue("w:where", i * 0.15 + 0.1, POP, -9, [-2, 0][i], "a destination")
swish("w:want", 0.2, -9, "the route draws")
cue("w:go", 0.1, TAP, -4, note="the place is picked")
# 6 closer
cue("brings", 0.1, "gen-whoosh-medium", -6, note="the profile folds into a tile")
cue("w:closer", 0.2, "gen-swell", -2, note="both sides move in", auto=False)
cue("w:employers", -0.1, OPEN, -9, note="employers")
cue("w:recruitment", -0.1, OPEN, -9, 3, "recruitment agencies")
cue("w:agencies", 0.1, POP, -9, -3, "the agency cards fan out")
cue("w:emerging", 0.02, POP, -8, 0, "Emerging talent")
# 7-9 the three audiences
swish("grads", 0.15, -6, "the first panel rises")
swish("w:path", 0.15, -9, "the path draws")
cue("w:forward", 0.1, TAP, -9, note="the arrowhead")
cue("biz", 0.2, "gen-whoosh-medium", -7, note="the track slides to employers")
for i in range(6):
    cue("w:access", i * 0.08 + 0.12, POP, -11, [-9, -7, -5, -4, -2, 0][i], f"professional {i + 1}")
cue("agency", 0.2, "gen-whoosh-medium", -2, note="the track slides to agencies", auto=False)
cue("w:partners", 0.2, "gen-whoosh-whip", -7, 2, "the two paths draw", auto=False)
cue("w:connection", 0.6, "gen-impact-soft", -11, note="they meet")
cue("w:connection", 0.66, "gen-chime", -10, note="a stronger connection")
# 10 new countries, colleagues, possibilities
cue("newc", 0.1, "gen-whoosh-deep", -6, note="the city window")
swish("w:countries", 0.3, -7, "the flight")
cue("w:new3", -0.05, OPEN, -10, note="the team window")
for i in range(4):
    cue("w:colleagues", i * 0.1 + 0.1, "gen-pop", -11, [-8, -5, -3, 0][i], f"colleague {i + 1}")
cue("w:colleagues", 0.57, TAP2, -8, note="the message")
swish("w:new4", 0.1, -7, "the second city")
cue("w:possibilities", 0.35, TICK, -8, note="the opportunity shape")
# 11 the sign-off
cue("sign", 0.05, "gen-swell", -1, note="the logo returns", auto=False)
cue("sign", 0.25, "gen-shimmer", -3, note="Alumni", auto=False)
swish("w:to4", 0.2, -9, "the line from experience to opportunity")
# 12 the end card
cue("chapter", -0.2, "gen-whoosh-medium", -2, note="the logo lifts, the cities float in", auto=False)
cue("w:abroad", 0.48, OPEN, -5, note="Grow together. Go further.")

out = {"fps": FPS, "frames": round(END * FPS), "library": "lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -23, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.5, "lifts": [[0, 4.25, 11], [4.25, 8.15, 9], [8.15, 10.12, 4]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
