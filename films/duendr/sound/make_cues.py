# Cue sheet for the Duendr film: effects lead (on the picture's events, plan/contract.md and the build), a quiet music bed
# under the voice (Mixkit "Gimme that groove", fitted with a lift on "Meet": bed.wav). Film time = VO + 0.3.
# python3 make_cues.py && python3 <skill>/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json, os, sys
fx = []
# Karl's Apple UI sounds (licence "apple" in the skill's catalogue): used where a real phone action happens, when his folder is
# present (APPLE_LIB, gitignored: the repo is public and the sounds are Apple's). Each entry: cue note -> Apple sound id.
APPLE_LIB = os.environ.get("APPLE_LIB", "")
APPLE = {
  "the coral card slides in: next": "pop", "the bar shoots up: the d": "pop",
  "a work tile springs in": "iphone-camera-shot", "I'm available pressed": "one-keyboard-click", "the AVAILABLE pill": "double-bubble-pop",
  "a pin lands": "pop", "the switch flips to Find talent": "one-keyboard-click",
  "the post types": "one-keyboard-click", "Post pressed": "one-keyboard-click", "the post flies onto the board": "send",
  "Connect pressed": "charge-connection", "a chat bubble": "message", "Confirm booking": "one-keyboard-click",
  "the booking stamps in": "mail-notification", "everything converges": "turn-off-phone", "a recommendation rises": "message",
}
QUIET = ("gen-tick", "kenney-tick-004", "kenney-select-001", "kenney-select-002")
def a(t, i, db, pitch=0, note=""): fx.append({"frame": round(t * 60), "id": i, "db": min(-3, db + (5 if i in QUIET else 3)), "pitch": pitch, "note": note})

# S1 hook (reference 1): a giant word, the frame becomes a card in a row, the coral card fills the frame
a(0.02, "gen-impact-soft", -9, 0, "Looking lands, giant")
a(0.32, "gen-whoosh-short", -11, 2, "Looking shrinks, for your join")
a(0.84, "gen-whoosh-medium", -8, 0, "the frame becomes a card in the row")
a(0.98, "kenney-drop-003", -7, 0, "the coral card slides in: next")
a(1.22, "gen-swell", -9, 0, "the coral card fills the frame")
for i, t in enumerate([1.26, 1.64]): a(t, "gen-tick", -14, 2 + 2 * i, "word joins")
a(2.32, "gen-whoosh-short", -12, -2, "the words drop away")
# S2 Meet Duendr
a(2.62, "gen-whoosh-deep", -7, 0, "the coral field condenses into the circle")
a(2.92, "gen-pop", -6, 2, "the bar shoots up: the d")
a(3.16, "gen-chime", -7, 0, "the wordmark's dot")
a(3.62, "gen-whoosh-short", -12, 2, "the lockup lifts")
# S3 creatives, venues, brands, Costa del Sol
a(3.96, "gen-whoosh-short", -10, 0, "the circle splits into three nodes")
a(4.38, "gen-shimmer", -12, 0, "connections draw")
for i, t in enumerate([4.82, 5.78, 6.56]): a(t, "kenney-drop-003", -7, 2 * i, "a cluster blooms")
a(6.92, "gen-shimmer", -9, 2, "the connections light coral")
a(7.20, "gen-whoosh-medium", -8, 0, "down onto the globe")
a(7.74, "gen-swell", -10, 2, "the coast lights up")
a(8.30, "gen-whoosh-deep", -8, 0, "the dive to Málaga")
# S4 showcase, availability
a(8.76, "gen-pop", -7, 0, "the dot becomes Lucía's avatar")
for i, t in enumerate([9.00, 9.30, 9.60]): a(t, "kenney-drop-003", -8, 2 * i, "a work tile springs in")
a(10.14, "kenney-click-001", -6, 0, "I'm available pressed")
a(10.64, "gen-pop", -7, 3, "the AVAILABLE pill")
for i, t in enumerate([10.80, 10.92, 11.04]): a(t, "gen-tick", -13, 3 + 2 * i, "a day lights up")
# S5 gigs, collaborators
a(11.86, "gen-whoosh-short", -9, 0, "gig cards arrive")
for i, t in enumerate([12.32, 12.66, 12.98]): a(t, "gen-whoosh-whip", -11, i, "a card flips")
a(13.06, "gen-whoosh-short", -10, 2, "to the people")
a(13.40, "kenney-drop-003", -8, 2, "a collaborator lifts out")
a(13.80, "gen-pop", -7, 4, "Let's collab")
# S6 the map
a(14.42, "gen-whoosh-deep", -7, 0, "the globe fills the frame")
for i, t in enumerate([14.62, 14.74, 14.86, 14.98, 15.10, 15.22, 15.34, 15.46, 15.58, 15.70, 15.82]): a(t, "kenney-drop-003", -11, i % 6, "a pin lands")
a(15.62, "kenney-maximize-009", -8, 0, "the Marbella sheet rises")
a(16.12, "gen-whoosh-short", -10, -2, "the map sinks, the switch arrives")
# S7 hiring, post, browse, right fit
a(16.86, "kenney-click-001", -5, 0, "the switch flips to Find talent")
a(17.14, "gen-whoosh-short", -11, 2, "Hiring creative talent? rises")
for i, t in enumerate([18.44, 18.56, 18.68, 18.80]): a(t, "kenney-tick-004", -14, i, "the post types")
a(19.10, "kenney-click-001", -5, 2, "Post pressed")
a(19.20, "gen-whoosh-short", -10, 0, "the post flies onto the board")
a(19.48, "gen-whoosh-medium", -9, 0, "portfolios slide past")
a(20.68, "gen-swell", -10, 0, "the row slows")
a(21.08, "gen-pop", -6, 2, "right fit")
# S8 connect, chat, confirm
a(22.06, "kenney-click-001", -5, 0, "Connect pressed")
a(22.12, "gen-whoosh-short", -10, 3, "the line shoots across")
for i, t in enumerate([23.30, 23.76, 24.12]): a(t, "gen-pop", -9, 2 * i, "a chat bubble")
a(24.56, "kenney-click-001", -5, 0, "Confirm booking")
a(25.12, "gen-stamp", -6, 0, "the booking stamps in")
# S9 all in one place
a(25.86, "gen-whoosh-short", -10, 0, "pieces fly in")
a(26.38, "gen-whoosh-deep", -8, 0, "everything converges")
a(26.64, "gen-impact-soft", -8, 0, "one place")
# S10 full fee, zero commission
a(27.52, "gen-whoosh-short", -10, 0, "the fee comes forward")
a(28.84, "gen-impact-soft", -7, 0, "the full fee lands whole")
a(29.54, "kenney-drop-003", -6, 0, "the circle rolls in: the zero")
a(29.90, "gen-stamp", -8, 0, "zero commission")
# S11 completed, recommendations, trust, reputation
a(31.42, "gen-stamp", -7, 0, "Completed")
for i, t in enumerate([32.58, 32.86, 33.14]): a(t, "kenney-maximize-009", -9, 2 * i, "a recommendation rises")
for i, t in enumerate([33.50, 33.62, 33.74]): a(t, "gen-tick", -13, 3 + i, "the count rises")
a(35.10, "gen-chime", -6, 0, "the badge lights up")
a(35.55, "gen-swell", -8, 0, "the cream grows out")
# S12 outro (reference 16)
for i, t in enumerate([36.08, 36.28, 36.40, 36.62]): a(t, "gen-tick", -15, i, "a word")
a(36.96, "gen-whoosh-short", -13, 0, "the line waves away")
for i, t in enumerate([37.14, 37.42, 37.56, 37.82]): a(t, "gen-tick", -15, 2 + i, "a word")
a(38.56, "gen-whoosh-short", -13, 2, "the line waves away")
for i, t in enumerate([38.92, 39.10, 39.26]): a(t, "gen-tick", -15, 4 + i, "a word")
a(39.98, "gen-whoosh-medium", -8, 0, "the push: the circle comes in")
a(40.10, "gen-appear", -8, 2, "the tile grows, the bar shoots up")
a(40.16, "gen-impact-deep", -7, 0, "the icon lands on Duendr")
a(40.98, "gen-whoosh-short", -14, -2, "the icon shrinks")
a(41.30, "gen-whoosh-short", -12, 2, "the wordmark slides in")
a(41.52, "gen-chime", -6, 2, "the dot")
if APPLE_LIB:
    seen = {}
    for c in fx:
        aid = APPLE.get(c["note"])
        if not aid: continue
        if aid == "iphone-camera-shot" and seen.get(aid): continue      # one shutter, on the first work tile
        seen[aid] = 1; c["id"] = aid
        if aid == "message" and c["note"] == "a chat bubble": c["id"] = ["send", "message", "send-2"][seen.setdefault("bub", 0) % 3]; seen["bub"] += 1
json.dump({"fps": 60, "frames": 2544, "library": APPLE_LIB or "../../alumni/sound/lib",
           "vo": {"file": "../vo/vo.mp3", "at": 0.3, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -32, "duck_db": 5, "fade_in": 0.05, "fade_out": 1.2},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
