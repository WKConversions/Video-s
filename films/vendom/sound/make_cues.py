# Writes sound/cues.json: one sound per visual event, each made for its moment (vendom_sfx.py) and used once, so no
# effect is heard twice (Karl, 12 Oct). Keyed to the voice-over's words (film seconds, vo/words.json; the VO sits at 0.5 s)
# with the picture's own offsets (film/src/Story.tsx).
#   cd sound && python3 vendom_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
W = {w["key"]: w["start"] for w in json.load(open("../vo/words.json"))["words"]}
F = lambda s: round(s * 30) / 30
cues = []
def c(id, sec, note, db=None):
    e = {"id": id, "frame": max(0, round(sec * 30)), "note": note}
    if db is not None: e["db"] = db
    cues.append(e)
w = lambda k, d=0.0: F(W[k] + d)

c("vd-flaps", w("w:your", -0.25) + 10 / 30, "the destination flaps flip", -6)
c("vd-garden", w("w:closer", 0.0), "Your garden, 0 km", -6)
c("vd-to-bubble", w("w:think", 0.45) + 0.42, "the card closes into a bubble", -5)
c("vd-bubbles-open", w("w:meet", -0.3) + 0.6, "the bubbles open the frame", -6)
c("vd-logo", w("w:meet", -0.05), "Vendom", -2)
c("vd-wordmark", w("w:vendom", -0.1), "the name writes out", -6)
c("vd-home-rise", w("w:a", -0.05) + 0.35, "the spa at home rises in", -6)
c("vd-roof", w("w:home", -0.15), "the roof rises: home", -4)
c("vd-plan", w("w:start", -0.25) + 0.9, "the plan of your space", -9)
c("vd-draw", w("w:space", -0.3), "the terrace is drawn", -5)
c("vd-range", w("w:range", -0.15), "six spas", -2)
c("vd-compact", w("w:compact", -0.1) + 0.7, "a compact spa settles", -4)
c("vd-swim", w("w:spacious", -0.05) + 0.8, "the swim spa slides in", -4)
c("vd-water-open", w("w:start", -0.25) + 0.6, "water opens around the plan", -8)
c("vd-options", w("w:choose", -0.3) + 0.45, "the two experiences rise", -6)
c("vd-toggles", w("w:experience", 0.0), "hydromassage on, insulation on", -3)
c("vd-jets-in", w("w:targeted", -0.25) + 0.3, "the jet and the spa", -6)
c("vd-targets", w("w:hydromassage", -0.1), "three jet targets", -4)
c("vd-release", w("w:release", -0.1) + 0.2, "release: a rush of bubbles", -7)
c("vd-relieved", w("w:tension", -0.1), "Tension released", -8)
c("vd-swap", w("w:while", -0.2) + 0.25, "winter and the insulation", -6)
c("vd-wrap", w("w:insulation", -0.1), "the insulation wraps the water", -2)
c("vd-warmth", w("w:warmth", -0.1) + 0.3, "the warmth turns back in", -5)
c("vd-energy-down", w("w:energy", -0.05), "energy use down", -2)
c("vd-project", w("w:then", -0.2) + 0.25, "your spa project", -6)
c("vd-experts", w("w:experts", -0.15), "Vendom experts", -3)
c("vd-details", w("w:experts", -0.15) + 0.2, "the details are taken", -6)
c("vd-path", w("w:from2", -0.1) + 0.3, "the path draws", -6)
c("vd-step-model", w("w:choosing", -0.05), "the right model", -3)
c("vd-step-delivery", w("w:delivery", -0.05), "delivery", -3)
c("vd-step-install", w("w:installation", -0.05), "installation", -3)
c("vd-step-support", w("w:support", -0.05), "ongoing support", -3)
c("vd-guides", w("w:guides", -0.1) + 0.6, "Vendom guides every step", -4)
c("vd-fold", w("w:less", -0.2) + 0.5, "less planning", -5)
c("vd-arranged", w("w:less", -0.05), "All arranged", -4)
c("vd-relax", w("w:more", -0.15) + 0.6, "more relaxing", -4)
c("vd-panel", w("w:personal", -0.25) + 0.25, "your spa's panel", -6)
c("vd-temp", w("w:personal", -0.25) + 8 / 30, "the water warms to 38°", -8)
c("vd-ready", w("w:ready", -0.1), "Ready", -3)
c("vd-seasons", w("w:all", -0.15) + 0.1, "all year round", -2)
c("vd-sign-open", w("w:vendom3", -0.35) + 0.3, "the sign-off opens", -6)
c("vd-final", w("w:vendom3", -0.1), "Vendom", -3)
c("vd-url", w("w:wellbeing", 0.5), "the address", -10)

ids = [x["id"] for x in cues]
assert len(ids) == len(set(ids)), "a sound is used twice"
lib = {x["id"] for x in json.load(open("lib/sfx/index.json"))}
assert set(ids) == lib, ("unused or missing sounds", lib ^ set(ids))
doc = {"fps": 30, "frames": 1260, "library": "lib", "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "music/pop-05-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.0,
                 "note": "Pop 05 (Grigoriy Nuzhny, Mixkit, Mixkit Stock Music Free License), fitted: lift at 3.60 on 'Meet Vendom', last hit 39.06"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues, every sound used once")
