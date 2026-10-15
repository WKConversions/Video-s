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
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-20):
    for i in range(n): cue(label, off + i * step, CLICK, db, [0, 2, -1, 3, 1, -2][i % 6], "a key")

cue("w:meet", 0.0, "gen-swell", -10, -2, "Meet")
cue("w:creoble", 0.15, "gen-pop", -8, 3, "the blue dot")
cue("tell", 0.1, "gen-whoosh-medium", -11, -2, "the laptop rises")
for lab in ["w:what2", "w:what3", "w:what4"]:
    cue(lab, 0.0, TAP2, -12, 2, "the field focuses")
    keys(lab, 0.1, 8, 0.1)
cue("w:ai", 0.0, CLICK, -6, note="Build my website")
cue("w:ai", 0.1, "gen-shimmer", -12, note="AI at work")
for i in range(3): cue("w:do2", i * 0.35, TICK, -12, [0, 3, 5][i], f"step {i + 1} done")
cue("w:minutes", 0.0, "gen-whoosh-short", -13, note="the site assembles")
for i in range(4): cue("w:minutes", 0.3 + i * 0.45, POP, -15, [-2, 0, 2, 4][i], f"block {i + 1}")
cue("w:ready", 0.0, TAP, -11, note="ready")
cue("w:website2", -0.1, "gen-whoosh-medium", -11, note="laptop and phone")
cue("change", 0.2, "gen-appear", -13, note="the prompt")
keys("w:just2", 0.0, 12, 0.08, -21)
cue("w:it", -0.05, CLICK, -7, note="send")
cue("w:it", 0.1, "gen-shimmer", -13, 3, "the site changes")
cue("w:preview", 0.0, TAP, -11, note="Preview for free")
cue("w:everything", 0.0, "gen-whoosh-short", -15, -3, "the page scrolls")
cue("happy", 0.0, "gen-whoosh-medium", -12, -2, "the site comes to the centre")
cue("w:its", 0.0, "gen-pop", -9, 2, "It's yours")
cue("w:499", -0.05, "gen-impact-soft", -9, note="499 kr.")
cue("host", 0.1, "gen-whoosh-short", -12, note="hosting")
cue("w:hosting", 0.5, TAP2, -11, note="Live")
for i in range(3): cue("w:covered", -0.1 + i * 0.18, TICK, -12, [0, 3, 5][i], f"included {i + 1}")
cue("nocode", 0.05, "gen-whoosh-short", -13, -2, "no coding")
cue("w:no2", 0.0, "gen-whoosh-short", -14, 1, "no complexity")
cue("simple", 0.1, "gen-whoosh-medium", -11, note="the devices return")
cue("brand", 0.1, "gen-swell", -7, note="Creoble")
cue("w:creoble2", 0.3, "gen-shimmer", -9, note="the blue dot")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -23, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.6, "lifts": [[33.1, 35.6, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
