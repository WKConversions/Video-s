# Moviqly film 2's cue sheet: the supplied voice-over, the music bed, and precise studio sounds on the picture events
# (plan/storyboard.md). Film 1 was playful (pops); film 2 is a studio at work: soft appears for things surfacing
# from depth, deep whooshes for depth moves, ticks for checks, keys while the brief types, clicks for buttons, a
# stamp for the review. Every cue sits on a voice-over word label, so it lands with the picture event built on it.
#   python3 scripts/cues.py            (run from films/moviqly2; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = dict(json.load(open(os.path.join(ROOT, "film", "src", "words.json"))))
FPS = 30
for name, (w, off) in {"sB": ("w:ask", -0.3), "sC": ("w:moviqly", -0.3), "h1": ("w:it", -0.3), "sE": ("w:it2", -0.3), "sF": ("w:your3", -0.3),
                       "h2": ("w:every", -0.3), "sH": ("w:moviqly2", -0.3), "h3": ("w:your5", -0.3), "sJ": ("w:type", -0.3), "sK": ("w:switch", -0.3),
                       "sL": ("w:click", -0.3), "h4": ("w:every2", -0.3), "sN": ("w:describe", -0.3)}.items():
    L[name] = L[w] + off
END = L["w:moviqly3"] + 2.2
LIFT = float(sys.argv[1]) if len(sys.argv) > 1 else None   # the music's lift (film seconds), from music_fit
KEY, TICK, CLICK = "kenney-click-001", "gen-tick", "kenney-select-001"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 4, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-21, note="keys"):
    for i in range(n): cue(label, off + i * step, KEY, db, [0, 2, -1, 3, 1, -2][i % 6], note)

# A: behind the prompt
cue("w:behind", -0.1, "gen-whoosh-deep", -12, 0, "the prompt box swings open")
for i, w in enumerate(["w:an", "w:ai", "w:motiondesign", "w:studio"]): cue(w, 0.0, "gen-appear", -17, i * 2, "a station comes into focus")
cue("w:studio", 0.1, "gen-shimmer", -16, 2, "the studio is lit")
cue("sB", -0.2, "gen-whoosh-short", -16, -2, "the door closes")
# B: the brief
keys("w:ask", 0.0, 22, 0.13, note="the brief types")
for w, p in [("w:energetic", 0), ("w:thirtysecond", 2), ("w:your", 4)]: cue(w, 0.05, "gen-appear", -14, p, "a parsed token lifts out")
cue("w:site", 0.35, CLICK, -9, note="send")
cue("w:site", 0.45, "gen-whoosh-deep", -15, 2, "the box sinks into depth")
# C: the scan
cue("w:scans", 0.0, "gen-riser-1s", -18, 0, "the scan line sweeps")
for w, p in [("w:headlines", 0), ("w:numbers", 2), ("w:colors", 4), ("w:logo", 7)]:
    cue(w, 0.0, "gen-tap", -12, p, "lifted off the page")
    cue(w, 0.18, "gen-whoosh-short", -19, p, "carried to the rail")
cue("h1", -0.25, "gen-impact-soft", -15, 0, "the materials gather on the draft")
# D: earlier films
for i in range(5): cue("w:studies", i * 0.12, "gen-appear", -18, i, "an earlier film surfaces")
for i in range(5): cue("w:films", 0.1 + i * 0.1, TICK, -19, i, "a comparison line")
cue("w:different", 0.0, "gen-chime", -14, 0, "a new idea")
# E: form, idea, art direction
for i in range(4): cue("w:one", -0.1 + i * 0.14, TICK, -18, i, "the selection hops")
cue("w:forms", 0.0, CLICK, -10, 2, "Feature tour")
cue("w:idea", 0.0, "gen-appear", -12, 3, "the idea lands")
for i, w in enumerate(["w:sets", "w:the2", "w:art", "w:direction"]): cue(w, 0.0, "kenney-tick-004", -14, i * 2, "a slider snaps")
# F: the storyboard arrives
cue("w:arrives", -0.1, "gen-whoosh-medium", -15, 0, "the storyboard builds")
for i in range(7): cue("w:arrives", i * 0.11, TICK, -20, i, "a row lands")
# G: fact check
cue("w:number", 0.0, TICK, -12, 2, "a number checked")
cue("w:quote", 0.0, TICK, -12, 4, "the quote checked")
cue("w:checked", 0.1, "gen-stamp", -13, 0, "every number and quote is on the site")
# H: review
cue("w:reviews", 0.0, "gen-whoosh-short", -18, 0, "the loupe glides")
cue("w:test", 0.1, "gen-whoosh-short", -19, 2, "frame to frame")
cue("w:like", 0.0, "gen-tap", -12, -3, "cut-off text flagged")
cue("w:director", 0.1, "gen-stamp", -12, 2, "fixed: the check")
for i in range(6): cue("w:director", 0.35 + i * 0.07, TICK, -21, i, "review passed")
# I: beside the chat
cue("w:plays", -0.1, "gen-whoosh-deep", -15, 0, "the studio assembles")
cue("w:chat", -0.2, "gen-appear", -16, 2, "the chat fills")
# J: make it calmer
keys("w:make", 0.0, 12, 0.08)
cue("w:calmer", 0.55, CLICK, -9, note="send")
cue("w:storyboard2", 0.0, "kenney-maximize-009", -13, note="the storyboard lifts forward")
cue("w:updates", 0.15, "gen-whoosh-short", -17, -2, "a row slides out")
# K: portrait
cue("w:switch", 0.05, CLICK, -10, note="the format menu")
cue("w:portrait", 0.0, CLICK, -11, 3, "Portrait")
cue("w:reshapes", -0.1, "gen-whoosh-medium", -14, 1, "the canvas reshapes")
# L: export
cue("w:click", 0.0, CLICK, -7, note="Export MP4")
cue("w:export", 0.3, "gen-riser-1s", -19, 0, "rendering")
cue("w:mp4", 0.45, "gen-success", -14, 0, "the MP4 downloads")
# M: steps and versions
for i in range(11): cue("w:every2", 0.05 + i * 0.09, TICK, -20, i % 7, "a step checks")
cue("w:version", -0.1, "gen-whoosh-deep", -14, 0, "the versions stand in depth")
for i in range(3): cue("w:saved", -0.2 + i * 0.12, "gen-appear", -17, i * 2, "a version")
# N: back to the prompt
cue("sN", 0.1, "gen-whoosh-deep", -14, -2, "the versions slide behind the prompt")
cue("w:first", 0.0, "gen-appear", -16, 3, "describe your first motion")
cue("w:make2", 0.0, "gen-shimmer", -12, 3, "Make it Moviqly")

music = {"file": "bed.wav", "at": 0, "lufs": -24, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.8, "lifts": [[L["w:make2"], END, 3]]}
out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib", "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": music, "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues,", out["frames"], "frames")
