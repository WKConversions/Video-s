# Writes sound/cues.json: one sound per visual event, each made for its moment (malaga_sfx.py) and used once, so no
# effect is heard twice (Karl, 12 Oct). Keyed to the voice-over's words (film seconds, vo/words.json; the VO sits at 0.5 s)
# with the same offsets the picture uses (film/src/Scene*.tsx).
#   cd sound && python3 malaga_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
W = {w["key"]: w["start"] for w in json.load(open("../vo/words.json"))["words"]}
F = lambda s: round(s * 30) / 30                                # picture events sit on whole frames
cues = []
def c(id, sec, note, db=None):
    e = {"id": id, "frame": max(0, round(sec * 30)), "note": note}
    if db is not None: e["db"] = db
    cues.append(e)
w = lambda k, d=0.0: F(W[k] + d)

# 1 one home, a hundred moving parts
c("mh-home", w("w:one", -0.1), "the home arrives", -3)
c("mh-swarm", w("w:a", -0.12), "the parts stream out", -2)
# 2 the chores pile up (each card lands 16 f after it leaves the swarm)
c("mh-bookings", w("w:bookings", -0.2) + 0.3, "Bookings", -4)
c("mh-keys", w("w:checkins", -0.2) + 0.35, "Check-ins", -3)
c("mh-sparkle", w("w:cleaning", -0.2) + 0.35, "Cleaning", -4)
c("mh-repair", w("w:repairs", -0.2) + 0.3, "Repairs", 0)
c("mh-messages", w("w:guest", -0.2) + 0.3, "Guest messages", -4)
# 3 you're miles away
c("mh-shrink", w("w:youre", -0.3) + 0.4, "the pile shrinks onto Málaga", -5)
c("mh-map", w("w:youre", -0.3) + 1.6, "the map spreads out of Málaga", -7)
c("mh-pin-malaga", w("w:youre", -0.3) + 0.6, "Málaga pin", -5)
c("mh-route", w("w:miles", -0.25) + 0.43, "the route north", -6)
c("mh-pin-you", w("w:away", 0.1), "You", -8)
c("mh-travel", w("w:miles", 0.3) + 0.3, "the chores travel up the route", -11)
# 4 Málaga Hideaway comes in
c("mh-mark", w("w:malaga", -0.12), "the house mark lands", -3)
c("mh-brand", w("w:hideaway", -0.05), "the blue opens, the logo comes in", -2)
c("mh-wordmark", w("w:comes", -0.15), "the name writes out", -6)
# 5–6 one local partner; every detail taken care of
c("mh-sea", w("w:one2", -0.25) + 0.6, "Málaga opens: a wave", -5)
c("mh-location", w("w:local", -0.1), "Málaga, Costa del Sol", -5)
c("mh-card-rise", w("w:every", -0.3) + 0.25, "the checklist rises", -6)
c("mh-checks", w("w:every", 0.05) + 0.03, "five chores checked", -3)
# 7 the services
c("mh-to-window", w("w:we", -0.3) + 0.8, "Málaga closes into the window", -5)
c("mh-calendar", w("w:reservations", -0.2) + 0.13, "reservations fill the month", -5)
c("mh-arrival", w("w:coordinate", -0.05), "guest arrivals", -2)
c("mh-linen", w("w:arrange", -0.1), "cleaning", -4)
c("mh-fixed", w("w:handle", -0.15) + 0.42, "maintenance: fixed", -4)
c("mh-home-back", w("w:keeping", -0.1) + 0.45, "the home rises over a made room", -7)
c("mh-ready", w("w:ready", -0.1), "Ready for guests", -3)
c("mh-stays", w("w:every2", -0.15), "the next stays", -5)
# 8 not renting; keyholding and property support
c("mh-switch-chip", w("w:not", -0.15), "the rental switch appears", -6)
c("mh-switch-off", w("w:renting", 0.0), "renting out: off", -2)
c("mh-list-swap", w("w:our", -0.05) + 0.2, "the list turns to keyholding", -6)
c("mh-key-hook", w("w:keyholding", -0.15) + 0.74, "the key goes onto its hook", -3)
c("mh-inspect", w("w:property3", -0.1), "the property check", -2)
c("mh-knock", w("w:services", -0.05), "technician: we'll be there", -3)
c("mh-covered", w("w:covered", -0.1), "covered while you're away", -3)
# 9 agreements, communication, tailored, in the loop
c("mh-morph", w("w:with", -0.3) + 0.45, "list → agreement, window → phone", -5)
c("mh-terms", w("w:clear", -0.05), "the terms tick", -5)
c("mh-sign", w("w:agreements", -0.05), "signed", -3)
c("mh-message-in", w("w:personal", -0.15), "a personal message", -3)
c("mh-message-out", w("w:communication", 0.25) + 0.16, "your reply", -6)
c("mh-card-turn", w("w:and3", -0.15) + 0.18, "your services", -4)
c("mh-toggles", w("w:services2", 0.0), "switched on for this home", -3)
c("mh-updates", w("w:youre3", 0.0), "updates arrive", -4)
# 10 less to manage, more freedom
c("mh-fold", w("w:less", -0.2) + 0.5, "everything folds into one line", -5)
c("mh-all-done", w("w:less", -0.2) + 0.3, "All taken care of", -4)
c("mh-freedom", w("w:more", -0.2) + 0.5, "the pool opens", -4)
# 11 the sign-off (the music's last hit at 42.93, on "in good hands")
c("mh-to-card", w("w:malaga2", -0.75) + 0.82, "the pool closes into the home card", -6)
c("mh-logo", w("w:malaga2", -0.02), "the logo", -3)
c("mh-hands", w("w:hands", -0.15), "In good hands", -6)
c("mh-button", w("w:request", -0.15), "Request your proposal", -3)
c("mh-url", w("w:request", -0.15) + 8 / 30, "the address", -7)

ids = [x["id"] for x in cues]
assert len(ids) == len(set(ids)), "a sound is used twice"
lib = {x["id"] for x in json.load(open("lib/sfx/index.json"))}
assert set(ids) == lib, ("unused or missing sounds", lib ^ set(ids))
doc = {"fps": 30, "frames": 1380, "library": "lib", "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "music/summer-fun-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.6,
                 "note": "Summer Fun (Ahjay Stelino, Mixkit, Mixkit Stock Music Free License), fitted: lift at 11.00 on 'Málaga Hideaway', last hit 42.93 on 'in good hands'"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues, every sound used once")
