# The K.B. Network Intelligence cue sheet: the supplied voice-over, the music bed, and quiet, precise interface sounds
# on the picture events (an Apple-style film: soft taps and ticks for packets and chips, clean clicks for approvals,
# airy swishes for camera moves, a shimmer when an AI agent starts working, one swell for the end card).
#   python3 scripts/cues.py            (run from films/kb; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = dict(json.load(open(os.path.join(ROOT, "film", "src", "words.json"))))
FPS = 30
# the hand-offs, as in src/clock.ts
L.update({"s1": L["w:first"] - 0.3, "sB": L["w:once"] - 0.25, "s2": L["w:ai"] - 0.3, "sD": L["w:specialized"] - 0.25,
          "s3": L["w:management"] - 0.25, "s4": L["w:for"] - 0.25, "s5": L["w:every"] - 0.25, "hit": L["w:decisions"] + 2.05})
END = L["w:decisions"] + 4.1
TAP, TAP2, TICK, CLICK, POP = "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-drop-003"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 5, **({"pitch": pitch} if pitch else {}), "note": note})

# A: the hook
cue("w:kb", -0.05, "gen-appear", -12, 0, "the K.B mark builds")
cue("w:network", 0.0, TAP, -14, 2, "Network")
cue("w:intelligence", 0.0, "gen-shimmer", -14, 2, "the cyan ring breathes")
cue("w:turns", 0.0, "gen-whoosh-short", -14, -1, "the lockup rises")
for i in range(6): cue("w:everyday", i * 0.09, POP, -18, i % 4, "an everyday fragment")
for i in range(5): cue("w:into", 0.05 + i * 0.1, TICK, -16, i, "packets stream into the mark")
for i, w in enumerate(["w:real", "w:business", "w:opportunities"]): cue(w, 0.0, POP, -12, 3 + i, "an opportunity fans out")
cue("w:opportunities", 0.4, POP, -12, 6, "an opportunity fans out")
cue("w:heres", -0.05, "gen-whoosh-medium", -12, 2, "the map builds")
for i in range(7): cue("w:heres", 0.1 + i * 0.11, TICK, -17, i, "a layer rises")
# B: capture → Claude
cue("s1", 0.05, "gen-whoosh-short", -13, note="push into layer 1")
for w in ["w:conversations", "w:meetings", "w:emails", "w:documents"]: cue(w, 0.0, TAP, -12, 2, "a source arrives")
cue("w:collected", 0.0, "gen-whoosh-short", -13, 1, "the streams merge")
cue("w:claude", 0.0, "gen-shimmer", -12, 3, "the Claude summariser starts")
for i in range(5): cue("w:processes", 0.15 + i * 0.2, TICK, -15, i, "a summary field")
for i in range(5): cue("w:structured", 0.1 + i * 0.16, CLICK, -19, [0, 2, -1, 3, 1][i], "the summary types")
# C: gate 1 → knowledge core → ecosystem
cue("w:once", 0.0, TAP2, -13, 0, "gate 1 appears")
cue("w:approved", 0.05, CLICK, -8, note="management approves")
cue("w:approved", 0.12, "gen-tap", -11, 3, "Approved")
cue("w:everything", 0.0, "gen-whoosh-short", -13, -2, "through the gate")
cue("w:stored", 0.0, "gen-impact-soft", -12, 0, "into the knowledge base")
for i in range(6): cue("w:central", i * 0.15, TICK, -17, i, "more summaries stream in")
for i in range(6): cue("w:connected", 0.1 + i * 0.12, POP, -15, i % 4, "the ecosystem connects")
cue("s2", -0.35, "gen-whoosh-short", -15, -1, "the ecosystem folds back")
# D: intelligence → opportunities
cue("w:ai", 0.0, "gen-shimmer", -12, 3, "the opportunity agent starts")
cue("w:analyzes", 0.0, TICK, -14, 1, "read-only line")
cue("w:external", 0.0, "gen-whoosh-short", -14, 2, "external data streams in")
for i in range(4): cue("w:data", i * 0.1, TICK, -16, i, "a signal")
for w, p in [("w:partnerships", 3), ("w:referrals", 4), ("w:investments", 5), ("w:existing", 6)]: cue(w, 0.0, POP, -11, p, "an opportunity lands")
# E: gate 2 → specialist agents → proposals
cue("sD", 0.15, "gen-whoosh-short", -14, 0, "gate 2 sweeps")
for i in range(4): cue("sD", 0.35 + i * 0.1, TICK, -14, i, "an opportunity approved")
cue("w:agents", 0.0, "gen-whoosh-medium", -14, 1, "routed to the specialists")
cue("w:develop", 0.0, "gen-shimmer", -14, 4, "the agents work")
for i in range(4): cue("w:actionable", i * 0.12, POP, -14, 2 + i, "a proposal")
cue("w:proposals", 0.3, "gen-whoosh-medium", -13, -1, "pull back to the map")
# F: management gates → outreach
for i, w in enumerate(["w:management", "w:reviews", "w:each", "w:stage"]): cue(w, 0.0, TAP2, -12, i, "a gate approves")
cue("w:before", 0.0, "gen-whoosh-short", -13, 0, "push into outreach")
for i in range(8): cue("w:prepared", -0.2 + i * 0.07, CLICK, -20, [0, 2, -1, 3, 1, -2][i % 6], "the draft types")
cue("w:approved2", 0.05, CLICK, -8, note="message approved")
cue("w:approved2", 0.12, "gen-tap", -11, 3, "Approved")
cue("w:sent", 0.0, "gen-whoosh-whip", -12, 2, "sent")
for i in range(2): cue("w:tracked", i * 0.25, TICK, -13, 2 + i * 2, "Sent / Opened")
cue("w:tracked", 0.55, "gen-success", -14, 0, "Replied")
cue("s4", -0.3, "gen-whoosh-short", -15, -2, "collapse to the dot")
# G: the example
cue("w:for", 0.05, "gen-appear", -13, 0, "the conversation opens")
for i in range(4): cue("w:launching", i * 0.2, TICK, -14, i, "the phrase highlights")
for i in range(4): cue("w:needs", -0.2 + i * 0.12, POP, -12, i + 2, "a need")
for i in range(4): cue("w:connections", -0.3 + i * 0.12, TICK, -13, i * 2, "a connection lights")
for i in range(3): cue("w:next", -0.1 + i * 0.3, TAP, -12, i * 2, "a next step checks")
cue("s5", -0.3, "gen-whoosh-short", -15, -2, "collapse to the dot")
# H: the loop → end card
cue("s5", 0.05, "gen-whoosh-medium", -13, 0, "the map builds round the dot")
cue("w:outcome", 0.0, POP, -12, 4, "Reply logged")
cue("w:feeds", 0.0, "gen-riser-1s", -15, 0, "up the feedback loop")
cue("w:base2", 0.0, "gen-impact-soft", -12, 2, "into the knowledge base")
cue("w:base2", 0.05, "gen-shimmer", -13, 3, "the knowledge base glows")
for i in range(4): cue("w:continuously", i * 0.12, TICK, -14, i * 2, "gates approve")
cue("w:improving", 0.0, "gen-shimmer", -14, 5, "improving")
cue("w:decisions", 0.2, "gen-whoosh-medium", -13, -1, "the map collapses into the mark")
cue("hit", 0.0, "gen-swell", -12, note="end card accent (the music's last hit)")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -24, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.8, "lifts": [[L["w:decisions"] + 0.6, END, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
