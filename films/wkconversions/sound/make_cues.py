# Writes sound/cues.json from the film's own timing labels (film/src/clock.ts BEATS and the aligned words), so every
# effect sits on its picture event: a whoosh on a move's fastest frame, a pop or tick on a landing, a riser ending on
# its reveal. Re-run after any retime:  python3 make_cues.py [music.wav "note"]
import json, re, sys
src = open("../film/src/clock.ts").read()
L = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", src[src.index("BEATS"):src.index("export const T")])}
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
# P1–P5: you and the competitor
c("gen-appear", 0.12, "the city rises out of the paper in a wave", -5)
c("gen-pop-soft-1", L["youTag"] + 0.12, "the You tag", -6)
c("gen-pop-soft-2", L["compTag"] + 0.12, "the Competitor tag", -6)
c("gen-swell-low", L["standout"] + 0.05, "the competitor rises; its rings go out", -6)
c("gen-impact-soft", L["standout"] + 0.45, "the competitor lands at its new height", -8)
c("gen-whoosh-soft-short", L["offer"] + 0.1, "the two offer cards grow out of the roofs", -7)
c("gen-pop-soft-1", L["offer"] + 0.2, "your offer lands", -7)
c("gen-pop-soft-2", L["offer"] + 0.3, "their offer lands", -7, 2)
c("gen-tick-soft-hi", L["equal"] + 0.12, "the = between them", -3)
c("gen-data-blips", L["comm"] + 0.1, "their card starts playing motion; the signal goes out", -7)
c("gen-shimmer", L["comm"] + 0.3, "their rings pulse into the crowd", -10)
c("gen-whoosh-soft-medium", L["better2"] + 0.5, "the crowd walks to the competitor", -10)
# P6–P10: most businesses lose attention
c("gen-whoosh-soft-medium", L["most"] + 0.4, "the camera steps back over the city; the offer cards fold", -6)
for i in range(5):
    c(f"gen-pop-soft-{1 + i % 3}", L["most"] + 0.09 * i + 0.22, f"grey card {i + 1} grows out of its roof", -9, i)
c("gen-whoosh-soft-short", L["lose"] + 0.35, "the attention meters drain", -9, -5)
c("gen-typing-run", L["unclear"] + 0.05, "the copy scrambles", -11)
c("gen-whoosh-soft-short", L["forget"] + 0.25, "the cards fade, forgettable", -9, -7)
for i in range(5):
    c("gen-tick-soft", L["visuals"] + 0.07 * i + 0.15, "the same placeholder image on every card", -10, -i)
c("gen-appear", L["content"] + 0.1, "your card grows out of your roof; the grey cards fold", -6)
c("gen-tap-soft", L["reason"] + 0.05, "the cursor hovers Learn more ...", -9)
c("gen-whoosh-soft-short", L["act"] + 0.35, "... and leaves without clicking", -9, -3)
# P11–P19: WKConversions comes in
c("gen-riser-soft-1s", L["brand"], "into the mark (ends on its first stroke)", -6)
c("gen-whoosh-soft-medium", L["turn"] + 0.5, "the routed blue line comes in along the streets", -6)
c("gen-impact-logo", L["brand"] + 0.05, "the mark writes itself on", -5)
c("gen-sparkle", L["brand"] + 0.4, "the name rises under the mark", -10)
c("gen-pop-soft-2", L["comes"] + 0.55, "the node lands on your roof; your block turns blue", -3)
c("gen-swell-low", L["comes"] + 0.2, "the rings round your lot", -7)
c("gen-whoosh-soft-short", L["complex"] + 0.3, "the tangle draws itself", -9)
for i in range(5):
    c("gen-tick-soft", L["offers"] + 0.05 * i + 0.15, "a jumbled line of the offer", -10, i)
c("gen-whoosh-soft-medium", L["clear"] + 0.3, "the tangle pulls straight; the lines line up", -6)
c("gen-chime-soft", L["clear"] + 0.55, "clear", -8)
c("gen-shimmer", L["perf"] + 0.2, "the line rises into the growth curve", -8)
c("gen-pop-soft-3", L["motion"] + 0.15, "the card plays motion design", -6)
c("gen-data-blips", L["motion"] + 0.35, "shapes in motion", -10)
c("gen-swell", L["attract"] + 0.1, "the rings go out from your lot", -7)
c("gen-whoosh-soft-medium", L["attract"] + 0.9, "the crowd streams over to you", -9)
for i in range(3):
    c(f"gen-pop-soft-{1 + i}", L["explain"] + 0.13 * i + 0.18, f"explainer frame {i + 1}", -7, i * 2)
c("gen-chime-soft", L["value"] + 0.1, "Value turns blue", -5)
c("gen-whoosh-soft-short", L["drive"] + 0.4, "the cursor comes to Start a project", -10)
c("gen-click", L["conv"] + 0.04, "the click", -2)
c("gen-success-soft", L["conv"] + 0.15, "conversion", -6)
c("gen-data-blips", L["conv"] + 0.5, "people go in, ring after ring", -10)
# P20–P23: the process
c("gen-whoosh-soft-medium", L["goal"] + 0.4, "the card turns into the process", -7)
c("gen-impact-soft", L["goalHit"] + 0.33, "the goal is hit", -4)
c("gen-shimmer", L["sharpen"] + 0.2, "the message comes into focus", -8)
for i in range(6):
    c("gen-tick-soft-hi" if i % 2 else "gen-tick-soft", L["concept"] + 0.07 * i + 0.15, f"storyboard frame {i + 1}", -9, i)
c("gen-whoosh-soft-short", L["frames"] + 0.15, "the film strip starts to run", -9)
for i in range(4):
    c("gen-tick-soft-hi", L["every"] + 0.25 * i + 0.1, "a frame gets its check", -10, i)
c("gen-pop-soft-2", L["purpose"] + 0.2, "Every frame with purpose", -5)
# P24–P26: no random animations, no visuals just to look good
for i in range(5):
    c("gen-blip", L["random"] + 0.1 * i + 0.1, "a random shape spins in", -12, [3, -2, 5, -4, 1][i])
c("gen-whoosh-whip", L["strike1"] + 0.1, "struck out", -6)
for i in range(4):
    c("gen-sparkle" if i % 2 else "gen-pop-soft-3", L["visuals2"] + 0.1 * i + 0.12, "decoration pops on", -11, i)
c("gen-pop", L["just"] + 0.15, "Looks good", -9)
c("gen-whoosh-whip", L["sweep"] + 0.1, "struck out", -5)
# P27–P33: the sign-off
c("gen-whoosh-medium", L["fin"] + 0.3, "the card folds into your roof; your block rises, blue", -6)
c("gen-impact-deep", L["fin"] + 0.85, "your block lands tall", -8)
c("gen-pop-soft-1", L["fin"] + 0.45, "the WKConversions badge", -6)
c("gen-data-blips", L["creative"] + 0.15, "routes run out from your lot", -8)
c("gen-swell", L["standout2"] + 0.1, "you rise above the city; it lowers", -6)
c("gen-impact-soft", L["standout2"] + 0.85, "you land, the tallest", -7)
c("gen-sparkle", L["designed"] + 0.2, "the wireframe draws round you", -9)
c("gen-whoosh-soft-medium", L["move"] + 0.6, "the crowd moves to you", -9)
for i in range(3):
    c("gen-tick", L["built3"] + 0.2 * i + 0.15, f"floor line {i + 1}", -8, i * 2)
c("gen-success-soft", L["convert"] + 0.2, "people go in", -5)
c("gen-whoosh-soft-medium", L["endcard"] + 0.35, "the page grows out of your roof", -6)
c("gen-impact-logo", L["endcard"] + 0.2, "the mark writes on", -6)
c("gen-tap-soft", L["endcard"] + 0.8, "Start a project", -8)
music = sys.argv[1] if len(sys.argv) > 1 else "music/music-fit.wav"
note = sys.argv[2] if len(sys.argv) > 2 else ""
doc = {"fps": 30, "frames": 1380, "library": "lib", "vo": {"file": "../vo/vo.mp3", "at": 0},
       "music": {"file": music, "at": 0, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.6, "note": note},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues")
