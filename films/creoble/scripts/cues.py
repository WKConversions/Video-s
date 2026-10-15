# The Creoble film's cue sheet: the supplied voice-over, the music bed and quiet, precise interface sounds on the picture
# events (an Apple-style film: soft keys, clean clicks, a few airy swishes, one shimmer for the brand).
#   python3 scripts/cues.py            (run from films/creoble; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 35.6
L = dict(W)
L.update({"hook": 0.0, "meet": W["w:meet"] - 0.15, "tell": W["w:just"] - 0.25, "ai": W["w:then"] - 0.15, "build": W["w:in"] - 0.2, "change": W["w:want"] - 0.2,
          "preview": W["w:preview"] - 0.2, "happy": W["w:happy"] - 0.2, "host": W["w:need"] - 0.2, "nocode": W["w:no"] - 0.15, "simple": W["w:just4"] - 0.2,
          "brand": W["w:creoble2"] - 0.25})
TAP, TAP2, TICK, CLICK, POP = "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-drop-003"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 5, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-20):
    for i in range(n): cue(label, off + i * step, CLICK, db, [0, 2, -1, 3, 1, -2][i % 6], "a key")

# v2: the cues follow the storyboard's events (plan/v2-storyboard.md), anchored on the words
for i, lab in enumerate(["w:building", "w:a", "w:website", "w:was", "w:this"]): cue(lab, 0.05, POP, -18, [-2, 0, 2, 1, 3][i], "a clutter card")
cue("w:simple", 0.0, "gen-whoosh-short", -12, 2, "the clutter collapses into the dot")
cue("w:meet", 0.0, "gen-swell", -10, -2, "Meet")
cue("w:creoble", 0.0, "gen-shimmer", -12, 2, "the wordmark grows from the dot")
cue("tell", -0.15, "gen-whoosh-medium", -11, -2, "the logo flies to the window")
for i, lab in enumerate(["w:what2", "w:what3", "w:what4"]):
    cue(lab, -0.05, "gen-whoosh-short", -15, i, "a field lifts")
    keys(lab, 0.15, 9, 0.09)
cue("w:ai", 0.0, CLICK, -6, note="Build my website")
cue("w:ai", 0.1, "gen-shimmer", -11, note="the AI orb")
for i in range(3): cue(["w:do2", "w:the", "w:rest"][i], 0.05, TICK, -12, [0, 3, 5][i], f"task {i + 1}")
cue("w:in", -0.05, "gen-whoosh-medium", -11, note="the layers burst out")
for i in range(5): cue("w:in", 0.05 + i * 0.09, POP, -16, i, "a layer")
for i, lab in enumerate(["w:answers", "w:become", "w:a2"]): cue(lab, 0.1, TAP, -13, i, "an answer lands")
cue("w:complete", 0.0, "gen-whoosh-short", -12, note="the stack collapses")
cue("w:ready", 0.0, TAP2, -11, note="the laptop forms")
cue("w:website2", -0.1, "gen-whoosh-short", -13, note="the phone joins")
cue("w:want", 0.0, "gen-whoosh-medium", -13, -3, "push into the headline")
cue("w:change", 0.0, TAP, -13, 2, "selected")
keys("w:change", 0.1, 16, 0.088, -21)
cue("w:it", -0.05, CLICK, -7, note="send")
cue("w:it", 0.1, "gen-shimmer", -13, 3, "the headline rewrites")
cue("w:preview", 0.0, TAP, -12, note="preview")
cue("w:everything", 0.0, "gen-whoosh-medium", -12, note="the pages fan out")
cue("w:free", 0.0, "gen-pop", -10, 2, "Free")
cue("w:happy", 0.0, "gen-whoosh-short", -13, note="the phone turns in")
cue("w:its", 0.0, CLICK, -8, note="Get it")
cue("w:yours", 0.0, "gen-pop", -10, 2, "It's yours")
cue("w:just3", 0.0, "gen-whoosh-medium", -11, note="the phone clears")
for i in range(3): cue("w:499", i * 0.12, TICK, -11, [0, 2, 4][i], "a digit lands")
cue("w:499", 0.35, "gen-impact-soft", -9, note="499")
cue("w:kroner", 0.0, TAP, -12, 1, "kr.")
cue("w:need", -0.12, CLICK, -8, note="the cursor clicks into the address bar")
for i in range(8): cue("w:need", 0.05 + i * 0.07, CLICK, -21, [0, 2, -1, 3, 1, -2, 0, 2][i], "a key")
cue("w:hosting", 0.1, TAP2, -11, note="Live")
cue("w:weve", -0.2, "gen-whoosh-medium", -12, note="back to cream, the globe")
for i, lab in enumerate(["w:weve", "w:got", "w:that"]): cue(lab, 0.05, TICK, -12, [0, 3, 5][i], f"feature {i + 1}")
cue("w:no", 0.0, "gen-whoosh-short", -13, -2, "no coding")
cue("w:no2", 0.0, "gen-whoosh-short", -13, 1, "no complexity")
cue("w:just4", -0.1, "gen-whoosh-medium", -11, note="the devices rise")
cue("brand", -0.2, "gen-whoosh-short", -13, 2, "the devices fold into the dot")
cue("brand", 0.1, "gen-swell", -7, note="Creoble")
cue("w:creoble2", 0.3, "gen-shimmer", -9, note="the blue dot")
cue("w:creoble2", 1.07, CLICK, -6, note="the cursor clicks creoble.dk")
cue("w:creoble2", 1.1, "gen-pop", -11, 3, "the pill rings")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -25, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.6, "lifts": [[33.1, 35.6, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
