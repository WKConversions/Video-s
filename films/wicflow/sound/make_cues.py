# Writes sound/cues.json from the film's own timing labels (sound/labels.json, exported from film/src/clock.ts), so every
# effect sits on its picture event: a whoosh on a move's fastest frame, a pop or tick on a landing, a riser ending on its
# reveal (motion/sound.md). Re-run after any retime:  node labels.js > labels.json && python3 make_cues.py
import json
L = json.load(open("labels.json"))
cues = []
def c(id, sec, note, db=None, pitch=None):
    e = {"id": id, "frame": round(sec * 30), "note": note}
    if db is not None: e["db"] = db
    if pitch is not None: e["pitch"] = pitch
    cues.append(e)
# P1–P3 the hook
c("gen-appear", 0.30, "the business rises out of its footprint", -4)
c("gen-pop-soft-2", L["dotLand"], "the AI dot lands on the roof (the dot's plip: the film's motif)", -2)
c("gen-pop-soft-1", 1.55, "the assistant bubble unfolds out of the dot", -5)
c("gen-whoosh-soft-short", 2.72, "'but': the bubble folds into the dot, 'assist' struck", -4)
c("gen-whoosh-soft-medium", L["fwd"] + 0.43, "the dot draws the route forward; the business slides along it (fastest frame)")
c("gen-data-blips", L["rise"] + 0.05, "the market rises ahead in a wave", -6)
# P4–P8 what Wicflow builds
for n, i in enumerate([0, 3, 6, 9, 11]):
    c("gen-tick-soft" if n % 2 == 0 else "gen-tick-soft-hi", L["builds"] + i * 0.085 + 0.18, f"track segment {i} lands (B13)", -5, n)
c("gen-riser-soft-1s", 5.59, "into 'Wicflow'", -4)
for n, u in enumerate([0.06, 0.31, 0.56, 0.81]):
    c("gen-pop-soft-" + str(1 + n % 3), L["run"] + u * 1.0 + 0.2, "a step of the system lights as the dot passes", -6, n * 2)
c("gen-chime-soft", L["live"] + 0.05, "the loop lights: the system is live; the chip drops in", -6)
c("gen-whoosh-soft-medium", L["sales"], "A1 whip to the CRM; it rises, 'Your CRM' (cut on the fastest frame)", -3)
c("gen-whoosh-soft-medium", L["marketing"], "A1 whip to the market; the blue wave across its tops", -3, 2)
c("gen-data-blips", L["marketing"] + 0.12, "the wave steps across the company tops", -8)
c("gen-whoosh-soft-medium", L["work"], "A1 whip to the desk; sand blooms, sheets land", -3, 4)
# P9–P12 the work
c("gen-data-blips", L["scan"] + 0.03, "the lens sweeps the market", -5)
c("gen-blip", L["lock"] + 0.3, "the target locks onto Anna's company; it turns AI blue", -1)
c("gen-whoosh-soft-short", L["card"] + 0.15, "the message card grows out of the roof", -5)
c("gen-typing-run", L["card"] + 0.15, "the message types", -4)
c("gen-click", L["approve"] + 0.05, "Approved: the team's check", -2)
c("gen-send", L["send"] + 0.24 + 0.25, "the card folds into the dot; the dot carries it to Anna (fastest frame)")
c("gen-pop-soft-1", L["timer"] + 0.1, "the Follow-up pill appears; the timer runs", -6, 2)
c("gen-tick-soft", L["timer"] + 0.3, "the timer arc fills", -9)
c("gen-whoosh-soft-short", L["follow"] + 0.25, "the follow-up leaves by itself", -4, 3)
c("gen-chime-soft", L["reply"] + 0.12, "Anna's reply arrives", -2)
c("gen-whoosh-soft-short", L["toCrm"] + 0.25, "the reply runs to the CRM", -6, -2)
c("gen-whoosh-soft-short", L["drawer"] + 0.12, "the drawer slides out, the record grows out of it", -7, -4)
c("gen-pop-soft-2", L["updated"] + 0.12, "status rolls to Interested prospect, updated", -4)
c("gen-tap-soft", L["drawerIn"] + 0.22, "the drawer closes", -6)
# P13–P14 connected
c("gen-swell-low", L["connects"] + 0.2, "every link turns solid blue", -5)
c("gen-appear", L["tools"] - 0.05, "the tools card grows out of the plot", -6)
for n in range(3):
    c(["gen-pop-soft-1", "gen-pop-soft-2", "gen-pop-soft-3"][n], L["tools"] + n * 0.33 + 0.28, f"tool row {n+1} rises", -5)
# P15–P17 pilot, measure, scale
c("gen-whoosh-soft-medium", L["dim"] + 0.1, "the map steps back to one pilot", -8, -5)
c("gen-pop-soft-1", L["plot"] + 0.45, "the Pilot pill", -7)
c("gen-whoosh-soft-short", L["pilotRun"] + 0.3, "the dot runs the pilot route", -6)
c("gen-appear", L["measure"] + 0.1, "the counter grows out of the plot", -4)
c("gen-tick-soft-hi", L["results"] + 0.17, "7 rolls to 8", -3)
c("gen-pop-soft-3", L["results"] + 0.32, "the blue check lands", -4)
c("gen-data-blips", L["scale"] + 0.05, "the pilot stamps out across the map (cascade)", -3)
# P18–P20 the outcome
c("gen-whoosh-soft-short", L["less"] - 0.05, "the Repeated work card grows out of the desk", -5)
for n in range(3):
    c("gen-click", L["less"] + 0.25 + n * 0.28, "a step ticked off", -5, n * 2)
for n, i in enumerate([0, 2, 4]):
    c(["gen-pop-soft-1", "gen-pop-soft-2", "gen-pop-soft-3"][n], L["convos"] + i * 0.1 + 0.3, "replies rise", -5)
c("gen-success-soft", L["customers"] + 0.1, "the replies flip into Meeting booked", -3)
c("gen-swell-low", L["blue"] + 0.35, "the AI-blue field fills the frame; the card takes the centre", -5)
c("gen-whoosh-soft-medium", L["gather"] + 0.3, "the field, the card and the badges gather back into the business", -3, -2)
# P21–P23 growth that lasts
for n, lab in enumerate(["f1", "f2", "f3"]):
    c("gen-impact-soft", L[lab] + 0.28, f"floor {n+1} lifts out of its tint", -6, n * 3)
c("gen-whoosh-soft-medium", L["lasts"] + 0.4, "the shadow sweeps like a sundial", -9, -6)
# the end card
c("gen-whoosh-soft-short", L["glide"] + 0.26, "the dot glides off the roof", -6)
c("gen-pop-soft-2", L["glide"] + 0.52, "the dot lands as the '.' of wicflow.com (the motif again)", -2)
c("gen-impact-logo", L["word"] + 0.05, "the wordmark opens out of the dot", -5)
c("gen-sparkle", L["mark"] + 0.1, "the W wipes in", -8)
c("gen-tap-soft", L["cta"] + 0.15, "AI analysis", -6)
doc = {"fps": 30, "frames": 1125, "library": "lib", "vo": {"file": "../vo/vo.mp3", "at": 0},
       "music": {"file": "music/its-love-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.5,
                 "note": "It's Love (Michael Ramir C., Mixkit), fitted: lifts at 10.96 and 26.24, final chord 35.03"},
       "sfx": cues}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues")
