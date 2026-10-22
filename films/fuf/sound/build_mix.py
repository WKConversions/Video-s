# Joins the five segments' cue lists (sound/cues_A-E.json, global seconds) into the cue sheet and mixes it with the
# voice-over and the music bed ("I Believe in Us", Mixkit, fitted by music_fit.py to sound/bed.wav).
#   python3 sound/build_mix.py  (from films/fuf)
import json, subprocess
LIB = {"gen-whoosh-short", "gen-whoosh-medium", "gen-whoosh-whip", "gen-whoosh-deep", "gen-riser-1s", "gen-riser-2s", "gen-swell", "gen-impact-soft", "gen-impact-deep", "gen-stamp",
       "gen-tap", "kenney-click-001", "kenney-select-001", "kenney-select-002", "gen-tick", "kenney-tick-004", "gen-pop", "kenney-drop-003", "gen-appear", "kenney-maximize-009",
       "gen-chime", "gen-success", "gen-shimmer"}
sfx, dropped = [], []
for s in "ABCDE":
    for c in json.load(open(f"sound/cues_{s}.json")):
        if c["id"] not in LIB: dropped.append(f"{s}:{c['id']}"); continue
        sfx.append({"frame": max(0, round(c["t"] * 30)), "id": c["id"], "db": c["db"] + 4, **({"pitch": c["pitch"]} if c.get("pitch") else {}), "note": f"{s}: {c.get('note', '')}"})
cue = {"fps": 30, "frames": 1275, "library": "../../alumni/sound/lib", "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -27, "duck_db": 5, "fade_in": 0.2, "fade_out": 1.0},
       "sfx": sorted(sfx, key=lambda c: c["frame"])}
json.dump(cue, open("sound/cues.json", "w"), indent=1)
if dropped: print("dropped (not in the library):", " ".join(dropped))
subprocess.run(["python3", "scripts/sound_mix.py", "sound/cues.json", "sound/mix.wav", "--sheet", "sound/mix.png"], check=True)
