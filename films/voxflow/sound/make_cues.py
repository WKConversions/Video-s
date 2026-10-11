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
# One sound per visual event (the review: 94 cues was one per item), never on top of a key word.
# 1 the hook (the bed's plucks only; its entry comes at 2.67): the call rings until it is missed, then the pile grows
c("gen-ring-short", 0.12, "a call rings in the practice", -2)
c("gen-ring-short", 0.55, "it keeps ringing", -2, -1)
c("gen-missed", L["missed"] + 0.12, "nobody can answer: missed", 1)
c("gen-pop-soft-1", 1.62, "missed calls pile up", -5)
c("gen-pop-soft-2", 2.42, "and more", -7, 2)
c("gen-riser-soft-1s", L["turn"] + 0.2, "into the turn", -4)
# 2 the turn
c("gen-whoosh-soft-short", L["turn"] + 0.05, "the words leave", -6)
c("gen-shimmer", L["turn"] + 0.3, "the VoxFlow wordmark", -7)
c("gen-swell-low", L["square"] + 0.2, "the practice becomes the receptionist's square", -6)
c("gen-tick-soft", L["flip"] + 0.2, "the missed calls flip to answered", -3)
c("gen-success-soft", L["flip"] + 0.32, "answered", -4)
c("gen-pop-soft-2", L["always"] + 0.05, "Altijd bereikbaar", -5)
c("gen-appear", L["rise"] + 0.1, "the receptionist rises", -2)
c("gen-whoosh-soft-short", L["fold"] + 0.15, "the calls fold into one", -8)
c("gen-blip", L["talk"] + 0.15, "in conversation with your customer", -4)
# 3 the AI receptionist, 24/7
c("gen-tick-soft-hi", words["receptionist"] + 0.15, "the underline", -5)
c("gen-impact-soft", L["h247"] + 0.01, "24/7", -6)
c("gen-swell-low", L["night"] + 0.1, "night falls", -4)
c("gen-tick-soft", L["night"] + 0.16, "the hours roll", -4)
c("gen-tick-soft", L["night"] + 0.52, "to 03:20", -4, 2)
c("gen-ring-short", L["ring2"] + 0.05, "a call at 03:20, until it is accepted", -1)
c("gen-tap-soft", L["accept"] + 0.08, "accept", 0)
c("gen-pickup", 9.80, "picked up within 3 seconds (after 'op')", -6)
# 4 the conversation and the agenda
c("gen-swell", L["white"] + 0.2, "the white field grows out of the call", -11)
c("gen-pop-soft-1", L["ask"] - 0.15, "the caller appears", -5)
c("gen-typing-run", L["answer"] + 0.15, "the answer types", -3)
c("gen-appear", L["agenda"] + 0.05, "the agenda appears", -2)
c("gen-send", L["fly"] + 0.1, "10:00 lifts out of the answer", -3)
c("gen-pop-soft-3", L["fly"] + 0.56, "it lands on Tuesday 10:00", -1)
c("gen-chime-soft", L["fly"] + 0.6, "booked", -5)
c("gen-success-soft", L["check"] + 0.05, "the check", -5)
# 5–6 the phone and the practice
c("gen-whoosh-whip", L["whip1"] + 0.2, "the whip", -3)
c("gen-note", L["notes"] + 0.15, "what VoxFlow handled, on the lock screen", -8)
c("gen-ring-short", L["banner"] + 0.05, "a call comes in", -1)
c("gen-pickup", L["banner"] + 0.45, "VoxFlow neemt op", -3)
c("gen-swell-low", L["dim"] + 0.1, "the screen dims", -10)
c("gen-whoosh-soft-short", words["en2"] + 0.2, "the phone goes", -8)
c("gen-swell", L["focus"] + 0.1, "the focus pulls to the practice", -6)
c("gen-pop-soft-1", L["pill"] + 0.05, "calls handled", -9)
c("gen-tick-soft-hi", L["pill"] + 0.71, "the count", -5, 4)
# 7 professioneel, snel, zonder pauzes
c("gen-swell-low", L["teal"] + 0.15, "the teal field grows out of her face", -6)
c("gen-shimmer", L["werkt"] + 0.05, "the wordmark", -9)
c("gen-typing-run", L["greet"] + 0.15, "the greeting types", -4)
c("gen-pop-soft-2", L["prof"] + 0.02, "professioneel", -9)
c("gen-pop-soft-2", L["snel"] + 0.02, "snel", -11, 2)
c("gen-tick-soft-hi", L["snel"] + 0.8, "the ring closes on <3 sec", -3)
c("gen-pop-soft-2", L["zonder"] + 0.02, "zonder pauzes", -11, 4)
c("gen-data-blips", L["zonder"] + 0.15, "the seven days light up", -6)
c("gen-tap", L["strike"] + 0.1, "pauzes struck", -2)
# 8 every customer, at once
c("gen-swell-low", L["cream"] + 0.1, "cream grows out of Sunday", -7)
for i in (0, 2, 4):
    c("gen-ring-short", L["calls"] + 0.15 * i + 0.05, "five calls ring at once", -5, i)
c("gen-success-soft", L["direct"] + 0.1, "all answered, directly", -2)
c("gen-whoosh-soft-medium", L["photo"] + 0.25, "the middle call opens into the customer's phone", -6)
c("gen-note", L["sms"] + 0.1, "the confirmation", -7, 3)
# 9 the week fills, next week fills
c("gen-whoosh-whip", L["whip2"] + 0.2, "the whip", -3)
c("gen-pop-soft-1", words["meer2"] + 0.05, "this week fills", -5)
c("gen-whoosh-soft-short", words["ieder"] + 0.15, "the page turns to next week", -6)
c("gen-pop-soft-3", words["ieder"] + 0.55, "next week fills", -6, 2)
# 10 the call to action (the bed's final chord lands at 30.55)
c("gen-whoosh-soft-medium", L["cta"] + 0.3, "an appointment lifts out and becomes the button", -6)
c("gen-impact-logo", L["mark"] + 0.15, "the wordmark", -3)
c("gen-click", L["press"] + 0.05, "Start gratis is pressed", -2)
doc = {"fps": 30, "frames": 960, "library": "lib", "vo": {"file": "../vo/vo-from-draft.wav", "at": 0},
       "music": {"file": "music/the-great-wall-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.8, "dips": [[26.3, 30.2, -4]],
                 "note": "The Great Wall (Michael Ramir C., Mixkit), fitted: entry 2.67, breakdown 12.0–15.7, final chord 30.55"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues")
