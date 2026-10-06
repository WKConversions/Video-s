# Writes sound/cues.json from the film's own timing labels (film/src/clock.ts), so every effect sits on its picture event.
#   python3 make_cues.py
import json, re
src = open("../film/src/clock.ts").read()
L = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", src[src.index("BEATS"):src.index("export const T")])}
CODE = [float(x) for x in re.search(r"CODE_TIMES = \[([^\]]+)\]", src).group(1).split(",")]
words, seen = {}, {}
for w in json.load(open("../film/src/words.json")):
    b = re.sub(r"[^a-z0-9]", "", w["word"].lower()); n = seen[b] = seen.get(b, 0) + 1
    words[b if n == 1 else f"{b}{n}"] = w["start"]
cues = []
def c(id, sec, note, db=None, pitch=None):
    e = {"id": id, "frame": round(sec * 30), "note": note}
    if db is not None: e["db"] = db
    if pitch is not None: e["pitch"] = pitch
    cues.append(e)
# P1–P2
c("gen-whoosh-soft-short", 0.35, "WKConversions' tile slides in", -7)
c("gen-whoosh-soft-short", L["link"] + 0.4, "bFound's tile slides in", -7, 2)
c("gen-swell-low", L["link"] + 0.55, "the cable links them", -8)
c("gen-appear", L["more"] + 0.15, "the work grows out of the link", -5)
c("gen-shimmer", L["more"] + 0.45, "rings: more than great work", -9)
# P3–P4
c("gen-whoosh-soft-short", L["maker"] + 0.3, "the window moves to the maker", -8)
c("gen-pop-soft-1", L["make"] + 0.2, "the timeline", -7)
for i, p in enumerate([0.06, 0.26, 0.39, 0.59, 0.72, 0.92]):
    c("gen-tick-soft-hi" if i % 2 else "gen-tick-soft", L["motion"] + 1.1 * p, "a keyframe passes", -8, i)
c("gen-pop-soft-2", L["motion"] + 0.15, "the b-mark lands", -5)
c("gen-whoosh-soft-short", L["motion"] + 0.5, "Found. slides out", -8)
c("gen-pop-soft-3", L["motion"] + 0.85, "the url pill", -6)
c("gen-send", L["deliver"] + 0.3, "the film travels along the cable to bFound", -4)
c("gen-success-soft", L["deliver"] + 0.62, "delivered", -5)
# P5–P7
c("gen-whoosh-soft-medium", L["response"] + 0.3, "the post grows out of bFound's tile", -6)
for i in range(9):
    c(f"gen-pop-soft-{1 + i % 3}", L["shows"] + 0.42 * i + 0.1, "a comment arrives", -11, (i * 3) % 7)
c("gen-data-blips", L["response"] + 0.65, "the reactions count up", -8)
c("gen-whoosh-soft-short", L["right"] + 0.3, "the video comes forward and plays", -8)
c("gen-chime-soft", L["can"] + 0.1, "the counts land", -7)
# P8–P12
c("gen-appear", L["price"] + 0.15, "the price card", -3)
c("gen-shimmer", words["one"] - 0.05, "the price comes into focus", -6)
c("gen-impact-soft", words["euros"] + 0.05, "€1,000", -4)
c("gen-pop-soft-2", L["per"] + 0.15, "/ video", -7)
c("gen-whoosh-soft-short", L["pro"] + 0.3, "the professional video", -7)
c("gen-whoosh-soft-short", L["lock"] + 0.15, "the wall slides in", -9, -4)
c("gen-click", L["lock"] + 0.35, "the lock clicks shut", -2)
c("gen-whoosh-soft-short", L["lock"] + 0.3, "the price drops onto the lock", -9, 3)
c("gen-whoosh-whip", words["change"] + 0.1, "the price is struck", -6)
for i in range(6):
    c("gen-pop-soft-1", L["many"] + 0.07 * i + 0.2, "a business", -11, i)
# P13–P15 (the music drops at 19.95)
c("gen-whoosh-medium", L["wkc"] + 0.45, "WKConversions comes in", -5)
c("gen-whoosh-medium", L["bf"] + 0.45, "bFound comes in", -5, 2)
c("gen-riser-soft-1s", L["unlock"], "both pull on the lock", -5)
c("gen-impact-soft", L["unlock"] + 0.05, "unlocked", -3)
c("gen-success-soft", L["unlock"] + 0.3, "the wall falls", -6)
for i in range(6):
    c("gen-tick-soft-hi", L["unlock"] + 0.35 + 0.1 * i + 0.1, "a business connects", -11, i)
# P16–P18 (no lift in the bed at 24: a riser into the field)
c("gen-riser-soft-1s", L["field"] + 0.2, "into the code", -1)
for i, tt in enumerate(CODE):
    c("gen-key", tt, f"{'BFOUND50'[i]} typed as it is spoken", -3, (i % 3))
c("gen-success-soft", CODE[-1] + 0.3, "the code checks", -4)
c("gen-pop", L["half"] + 0.05, "50% off", -6)
c("gen-appear", L["four"] + 0.15, "€400", -3)
c("gen-tap-soft", L["startup"] + 0.1, "startup price", -9)
# P19–P21
c("gen-whoosh-soft-medium", L["visit"] + 0.3, "the contact page opens", -6)
c("gen-typing-run", words["wkconversions3"], "the address types", -5)
c("gen-click", L["two"] + 0.85, "Submit", -2)
c("gen-success", L["two"] + 0.45, "€400 struck, €200 with the code", -4)
c("gen-whoosh-soft-short", L["two"] + 0.3, "the €200 tag grows out of the code field", -7)
# the end card (the bed's final chord comes at 36.0; an accent carries the end card)
c("gen-impact-logo", L["endcard"] + 0.3, "the lockup", -4)
c("gen-pop-soft-2", L["endcard"] + 0.6, "×", -7)
c("gen-sparkle", L["endcard"] + 0.75, "BFOUND50", -8)
doc = {"fps": 30, "frames": 1185, "library": "../../wkconversions/sound/lib", "vo": {"file": "../vo/vo.mp3", "at": 0},
       "music": {"file": "music/ramp-it-up-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.8,
                 "note": "Ramp It Up (Ahjay Stelino, Mixkit), fitted: kick and bass at 11.9, drop at 19.95, final chord 36.0"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues")
