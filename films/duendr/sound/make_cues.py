# Cue sheet for the Duendr film. Karl's direction (7 Nov): no generated "AI" whooshes; real UI sounds, Apple's where possible.
# Library: lib-karl = Karl's own pack (Motionix, from his Drive: clicks, pops, shutters, UI opens, a few whooshes), built with
# sfx_build.py and gitignored (the repo is public). His Apple UI sounds replace the matching cues once his "Apple sounds" folder
# is added to the library (APPLE below). Film time = VO + 0.3. Effects lead; the music bed sits under the voice.
# python3 make_cues.py && python3 <skill>/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json, os
fx = []
LIB = "lib-karl"
def a(t, i, db, pitch=0, note=""): fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": pitch, "note": note})

# S1 hook (reference 1)
a(0.02, "cinematic-click", -4, 0, "Looking lands, giant")
a(0.84, "sweet-ui-open", -4, 0, "the frame becomes a card in the row")
a(0.98, "normal-pop", -3, 0, "the coral card slides in: next")
a(1.22, "ui-open", -6, 0, "the coral card fills the frame")
for i, t in enumerate([1.26, 1.64]): a(t, "high-click", -9, 2 * i, "word joins")
# S2 Meet Duendr
a(2.64, "slow-and-smooth-pop", -4, -3, "the coral field condenses into the circle")
a(2.92, "premium-and-smooth-pop", -3, 0, "the bar shoots up: the d")
a(3.16, "sweet-ui-open", -5, 3, "the wordmark's dot")
# S3 creatives, venues, brands, Costa del Sol
a(3.96, "ui-click-digital-04", -6, 0, "the circle splits into three nodes")
for i, t in enumerate([4.82, 5.78, 6.56]): a(t, "smooth-pop", -4, 2 * i, "a cluster blooms")
a(6.92, "ui-granular-button-select", -8, 0, "the connections light coral")
a(7.25, "smooth-and-fast-whoosh", -10, 0, "down onto the globe")
a(7.74, "meadia-pop", -8, 0, "the coast lights up")
# S4 showcase, availability
a(8.76, "smooth-pop", -5, 0, "the dot becomes Lucía's avatar")
a(9.00, "smooth-cammera-shutter", -4, 0, "her first work tile: a photographer's shot")
for i, t in enumerate([9.30, 9.60]): a(t, "smooth-pop", -6, 2 + 2 * i, "a work tile springs in")
a(10.08, "sweet-ui-open", -5, 0, "the new-post sheet opens")
a(10.14, "high-click", -4, 0, "I'm available pressed")
a(10.64, "premium-and-smooth-pop", -5, 2, "the AVAILABLE pill")
for i, t in enumerate([10.84, 10.94, 11.04]): a(t, "ui-click-digital-04", -10, 3 + 2 * i, "a day lights up")
# S5 gigs, collaborators
for i, t in enumerate([12.00, 12.32, 12.98]): a(t, "ui-click-digital-03", -8, i, "a gig card flips")
a(13.06, "sweet-ui-open", -6, 0, "the people list")
a(13.40, "smooth-pop", -5, 2, "a collaborator opens")
a(14.00, "premium-and-smooth-pop", -5, 4, "Let's collab")
# S6 the map
a(14.42, "slow-and-smooth-whoosh", -12, 0, "the globe grows out of the pill")
for i, t in enumerate([14.52, 14.64, 14.76, 14.88, 15.00, 15.12, 15.24, 15.36, 15.48, 15.58, 15.70]): a(t, "smooth-pop", -10, (i % 6) * 2, "a pin lands")
a(15.62, "ui-open", -8, 0, "the Marbella sheet rises")
# S7 hiring, post, browse, right fit
a(16.72, "high-click", -3, 0, "the switch flips to Find talent")
a(17.70, "sweet-ui-open", -5, -2, "the thumb becomes the post")
for i, t in enumerate([18.44, 18.54, 18.64, 18.74, 18.84]): a(t, "v4-type-delete", -9, i % 2, "the post types")
a(19.00, "ui-enter", -4, 0, "Post pressed")
a(19.48, "ui-click-digital-03", -8, 0, "portfolios slide past")
a(21.06, "premium-and-smooth-pop", -3, 3, "right fit")
# S8 connect, chat, confirm
a(22.06, "ui-button", -3, 0, "Connect pressed")
a(22.36, "smooth-pop", -5, 4, "connected")
a(22.90, "sweet-ui-open", -6, 0, "the card becomes a chat")
for i, t in enumerate([23.30, 23.76, 24.12]): a(t, "smooth-pop" if i != 1 else "slow-and-smooth-pop", -5, 2 * i, "a chat bubble")
a(24.80, "high-click", -3, 0, "Confirm booking")
a(25.10, "premium-and-smooth-pop", -3, -2, "the booking stamps in")
# S9 all in one place
for i, t in enumerate([25.86, 26.00, 26.14]): a(t, "meadia-pop", -9, 2 * i, "a piece flies in")
a(26.62, "ui-enter", -5, -2, "everything lands in the app")
# S10 full fee, zero commission
a(27.52, "ui-open", -8, 0, "the fee comes forward")
a(28.84, "premium-and-smooth-pop", -4, -3, "the full fee lands whole")
a(28.92, "high-click", -8, 4, "Full fee")
a(29.54, "slow-and-smooth-pop", -4, -4, "the circle rolls in: the zero")
a(29.90, "cinematic-click", -5, 0, "0% commission")
# S11 completed, recommendations, trust, reputation
a(31.42, "ui-enter", -4, 0, "Completed")
for i, t in enumerate([32.58, 32.86, 33.14]): a(t, "sweet-ui-open", -6, 2 * i, "a recommendation rises")
for i, t in enumerate([33.52, 33.70, 33.88]): a(t, "smooth-pop", -8, 4 + 2 * i, "a recommendation lands on the profile")
a(35.10, "premium-and-smooth-pop", -4, 2, "the badge lights up")
a(35.58, "ui-open", -7, 0, "the cream grows out")
# S12 outro (reference 16): a soft click on each phrase, a pop on each coral word, the icon, the lockup
for t in (36.08, 37.14, 38.92): a(t, "high-click", -10, 0, "a phrase starts")
for i, t in enumerate((36.62, 37.82, 39.26)): a(t, "smooth-pop", -8, 2 * i, "the coral word")
a(39.98, "simple-whoosh-2", -12, 0, "the push: the circle comes in")
a(40.12, "premium-and-smooth-pop", -2, -3, "the icon lands on Duendr")
a(40.16, "ui-premium-open", -8, 0, "the icon grows")
a(41.30, "sweet-ui-open", -7, 0, "the wordmark slides in")
a(41.52, "smooth-pop", -4, 5, "the dot")

# Karl's Apple UI sounds: when his folder is in the library (ids from the skill's catalogue), these cues switch to them
APPLE = {"Connect pressed": "charge-connection", "a chat bubble": "message", "Post pressed": "send", "the post types": "one-keyboard-click",
         "I'm available pressed": "one-keyboard-click", "a pin lands": "pop", "the AVAILABLE pill": "double-bubble-pop",
         "Confirm booking": "one-keyboard-click", "everything lands in the app": "turn-off-phone", "a recommendation rises": "message"}
have = {x["id"] for x in json.load(open(os.path.join(LIB, "sfx", "index.json")))}
for c in fx:
    aid = APPLE.get(c["note"])
    if aid and aid in have: c["id"] = aid
json.dump({"fps": 60, "frames": 2544, "library": LIB,
           "vo": {"file": "../vo/vo.mp3", "at": 0.3, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -32, "duck_db": 5, "fade_in": 0.05, "fade_out": 1.2},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues;", sum(1 for c in fx if c["id"] in APPLE.values()), "on Apple sounds")
