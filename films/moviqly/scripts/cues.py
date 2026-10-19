# The Moviqly explainer's cue sheet: the supplied voice-over, the music bed ("Midnight Funk", its big entry on "Meet
# Moviqly"), and quiet, playful interface sounds on the picture events: keys while a brief types, a soft pop for
# chips and checks, a click for the send and export buttons, whooshes for camera moves, a shimmer for the logo.
#   python3 scripts/cues.py            (run from films/moviqly; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = dict(json.load(open(os.path.join(ROOT, "film", "src", "words.json"))))
FPS = 30
L.update({"s1": L["w:motion"] - 0.22, "s2": L["w:meet"] - 0.25, "sC": L["w:launching"] - 0.25, "s3": L["w:watch"] - 0.3,
          "sF": L["w:refine"] - 0.3, "s4": L["w:a4"] - 0.3, "sH": L["w:make2"] - 0.3, "hit": L["w:today"] + 1.08})
END = L["w:today"] + 3.0
TAP, TAP2, TICK, CLICK, POP = "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-drop-003"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 5, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-20, note="keys"):
    for i in range(n): cue(label, off + i * step, CLICK, db, [0, 2, -1, 3, 1, -2][i % 6], note)

# A: hook
keys("w:one", 0.0, 8, 0.07, note="one sentence types")
cue("w:finished", 0.0, "gen-whoosh-short", -12, 2, "the sentence becomes a film")
cue("w:video", 0.0, POP, -12, 4, "play")
# B: problem
cue("s1", 0.05, "gen-whoosh-short", -15, -2, "problem")
for i in range(3): cue("w:designers", i * 0.12, POP, -15, i, "a designer")
for i in range(3): cue("w:tools", -0.2 + i * 0.12, TAP2, -15, i, "a tool window")
for i in range(4): cue("w:weeks", i * 0.15, TICK, -15, i, "a week flips")
for i in range(3): cue("w:revisions", i * 0.18, POP, -16, -i, "a file piles up")
cue("w:keep", 0.0, "gen-whoosh-medium", -13, -3, "the pile tips over")
# C: solution
cue("w:meet", -0.05, "gen-riser-1s", -16, 0, "into the brand moment")
cue("w:moviqly", 0.0, "gen-shimmer", -10, 3, "the logo builds")
keys("w:describe", 0.1, 8, 0.07, note="a brief types")
for w, n in [("w:reads", "the site is read"), ("w:understands", "understood"), ("w:writes", "the story writes"), ("w:designs", "the look"), ("w:checks", "facts checked")]:
    cue(w, 0.0, TAP, -12, 2, n)
for i in range(3): cue("w:fact", -0.2 + i * 0.12, TICK, -13, 4 + i, "a purple check")
# D: use case
cue("w:launching", 0.0, POP, -11, 3, "product launch")
cue("w:announcing", 0.1, POP, -11, 5, "new feature")
keys("w:make", 0.0, 14, 0.13, note="the brief types")
# E: showcase
cue("s3", 0.08, CLICK, -8, note="send")
cue("s3", 0.15, "gen-whoosh-medium", -12, 1, "into the studio")
for i in range(7): cue("w:every2", i * 0.22, TICK, -13, i, "a step checks")
cue("w:film", 0.0, "gen-shimmer", -12, 4, "the film appears")
cue("w:minutes", 0.0, POP, -12, 2, "play")
# F: refine and export
keys("w:refine", 0.0, 6, 0.07, note="make it calmer")
cue("w:chat", 0.0, CLICK, -10, 2, "send")
cue("w:export", 0.0, CLICK, -8, note="Export MP4")
for w, p in [("w:landscape", 0), ("w:portrait", 3), ("w:square", 6)]: cue(w, 0.0, "gen-whoosh-short", -14, p, "the canvas reshapes")
cue("s4", -0.25, "gen-whoosh-short", -15, -2, "into the little dot")
# G: outro
cue("w:little", 0.0, POP, -12, 5, "the little idea")
cue("w:whole", -0.05, "gen-whoosh-medium", -10, 2, "a whole new world bursts open")
for i in range(5): cue("w:world", i * 0.1, TAP2, -17, i * 2, "film tiles")
# H: CTA
cue("sH", 0.05, "gen-whoosh-short", -14, 0, "the landing settles")
cue("w:moviqly3", 0.0, "gen-shimmer", -12, 3, "Moviqly")
cue("w:started", 0.0, CLICK, -8, note="Get started")
cue("hit", 0.0, "gen-swell", -13, note="end accent on the music's last hit")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -24, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.8, "lifts": [[L["w:today"] + 0.5, END, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
