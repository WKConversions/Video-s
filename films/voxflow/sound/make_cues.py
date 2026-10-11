# Writes sound/cues.json from the film's own timing labels (film/src/clock.ts), so every effect sits on its picture event.
#   python3 make_cues.py
import json, re
src = open("../film/src/clock.ts").read()
L = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", src[src.index("BEATS"):src.index("export const T")])}
words, seen = {}, {}
for w in json.load(open("../film/src/words.json")):
    b = re.sub(r"[^a-z0-9]", "", w["key"].lower()); n = seen[b] = seen.get(b, 0) + 1
    words[b if n == 1 else f"{b}{n}"] = w["start"]
cues = []
def c(id, sec, note, db=None, pitch=None):
    e = {"id": id, "frame": max(0, round(sec * 30)), "note": note}
    if db is not None: e["db"] = db
    if pitch is not None: e["pitch"] = pitch
    cues.append(e)
POPS = ["gen-pop-soft-1", "gen-pop-soft-2", "gen-pop-soft-3"]
# 1 the hook (the bed's plucks only; its entry comes at 2.67)
c("gen-ring", L["ring"] + 0.25, "a call rings in the practice", 2)
c("gen-missed", L["missed"] + 0.12, "nobody can answer: missed", 2)
for i, a in enumerate([1.28, 1.52, 1.76, 2.0, 2.24, 2.48]):
    c(POPS[i % 3], a + 0.12, "another missed call lands on the pile", -5, i % 2)
c("gen-riser-soft-1s", L["turn"] + 0.2, "into the turn", -4)
# 2 the turn
c("gen-whoosh-soft-short", L["turn"] + 0.05, "the words leave", -6)
c("gen-shimmer", L["turn"] + 0.3, "the VoxFlow wordmark", -7)
c("gen-swell-low", L["square"] + 0.2, "the practice becomes the receptionist's square", -6)
for i in range(4):
    c("gen-tick-soft-hi" if i % 2 else "gen-tick-soft", L["flip"] + 0.18 + 0.08 * i, "a missed call flips to answered", -3, i)
c("gen-success-soft", L["flip"] + 0.32, "answered", -4)
c("gen-pop-soft-2", L["always"] + 0.05, "Altijd bereikbaar", -5)
c("gen-appear", L["rise"] + 0.1, "the receptionist rises", -2)
c("gen-whoosh-soft-short", L["fold"] + 0.15, "the calls fold into one", -8)
c("gen-blip", L["talk"] + 0.15, "in conversation with your customer", -4)
# 3 the AI receptionist, 24/7
c("gen-whoosh-soft-medium", L["glide"] + 0.35, "she glides left", -5)
c("gen-tick-soft-hi", words["receptionist"] + 0.15, "the underline", -5)
c("gen-impact-soft", L["h247"] + 0.12, "24/7", -3)
c("gen-swell-low", L["night"] + 0.1, "night falls", -4)
for i in range(5):
    c("gen-tick-soft", L["night"] - 0.05 + 0.124 * (i + 1), "the hours roll", -4, i)
c("gen-ring", L["ring2"] + 0.1, "a call at 03:20", -1)
c("gen-tap-soft", L["accept"] + 0.08, "accept", 0)
c("gen-pickup", L["picked"] + 0.05, "picked up within 3 seconds", -3)
# 4 the conversation and the agenda
c("gen-swell", L["white"] + 0.2, "the white field grows out of the call", -7)
c("gen-pop-soft-1", L["ask"] + 0.05, "the caller asks", -4)
c("gen-typing-run", L["answer"] + 0.2, "the answer types", -2)
c("gen-typing-run", L["answer"] + 0.75, "the answer types", -3)
c("gen-whoosh-soft-short", L["agenda"] + 0.2, "the agenda arrives", -5)
c("gen-send", L["fly"] + 0.2, "10:00 lifts out of the answer", -3)
c("gen-pop-soft-3", L["land"] + 0.05, "it lands on Tuesday 10:00", -1)
c("gen-chime-soft", L["land"] + 0.1, "booked", -5)
c("gen-success-soft", L["check"] + 0.05, "the check", -5)
# 5–6 the phone and the practice
c("gen-whoosh-whip", L["whip1"] + 0.15, "the whip", -3)
for i in range(5):
    c("gen-note", L["notes"] + 0.1 + 0.17 * i + 0.05, "a handled call on the lock screen", -1, [0, 2, 4, 2, 5][i])
c("gen-ring-short", L["banner"] + 0.05, "a call comes in", -1)
c("gen-pickup", L["banner"] + 0.45, "VoxFlow neemt op", 0)
c("gen-swell-low", L["dim"] + 0.1, "the screen dims", -8)
c("gen-whoosh-soft-short", words["en2"] + 0.2, "the phone goes", -6)
c("gen-swell", L["focus"] + 0.1, "the focus pulls to the practice", -6)
c("gen-pop-soft-1", L["pill"] + 0.05, "calls handled", -3)
c("gen-tick-soft-hi", L["pill"] + 0.36, "2", -7, 2)
c("gen-tick-soft-hi", L["pill"] + 0.71, "3", -3, 4)
# 7 professioneel, snel, zonder pauzes
c("gen-swell-low", L["teal"] + 0.15, "the teal field grows out of her face", -6)
c("gen-shimmer", L["werkt"] + 0.05, "the wordmark", -8)
c("gen-whoosh-soft-short", L["prof"] - 0.05, "professioneel drops in", -6)
c("gen-typing-run", L["prof"] + 0.4, "the greeting types", -4)
c("gen-whoosh-soft-short", L["snel"] - 0.08, "snel drops through", -10, 2)
c("gen-tick-soft-hi", L["snel"] + 0.85, "the ring closes on <3 sec", -2)
c("gen-whoosh-soft-short", L["zonder"] - 0.08, "zonder pauzes drops through", -6, 4)
for i in range(7):
    c("gen-tick-soft", L["zonder"] + 0.12 + 0.07 * i + 0.05, "a day lights up", -5, i)
c("gen-tap", L["strike"] + 0.1, "pauzes struck", -2)
# 8 every customer, at once
c("gen-swell-low", L["cream"] + 0.1, "cream grows out of Sunday", -7)
for i in (0, 2, 4):
    c("gen-ring-short", L["calls"] + 0.15 * i + 0.1, "five calls ring at once", -4, i)
c("gen-success-soft", L["direct"] + 0.1, "all answered, directly", -2)
c("gen-whoosh-soft-medium", L["photo"] + 0.25, "the middle call opens into the customer's phone", -6)
c("gen-note", L["sms"] + 0.1, "the confirmation", 0, 3)
# 9 the week fills, next week fills
c("gen-whoosh-whip", L["whip2"] + 0.12, "the whip", -3)
for i in range(6):
    c(POPS[i % 3], words["meer2"] - 0.1 + 0.11 * i + 0.1, "an appointment drops in", -6, i)
c("gen-whoosh-soft-short", words["ieder"] + 0.15, "the page turns to next week", -6)
for i in range(5):
    c(POPS[(i + 1) % 3], words["ieder"] + 0.42 + 0.1 * i + 0.1, "next week fills", -7, i + 2)
# 10 the call to action (the bed's final chord lands at 30.55)
c("gen-whoosh-soft-medium", L["cta"] + 0.3, "an appointment lifts out and becomes the button", -6)
c("gen-impact-logo", L["mark"] + 0.15, "the wordmark", -3)
c("gen-click", L["press"] + 0.05, "Start gratis is pressed", -2)
doc = {"fps": 30, "frames": 960, "library": "lib", "vo": {"file": "../vo/vo-from-draft.wav", "at": 0},
       "music": {"file": "music/the-great-wall-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.8,
                 "note": "The Great Wall (Michael Ramir C., Mixkit), fitted: entry 2.67, breakdown 12.0–15.7, final chord 30.55"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues")
