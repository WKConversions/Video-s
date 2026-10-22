# Joins the four segments' cue lists (sound/cues_A-D.json, global seconds) into the cue sheet and mixes it:
# UI sounds lead, the music is a quiet bed.  python3 sound/build_mix.py  (from films/tnoa)
import json, subprocess
sfx = []
for s in "ABCD":
    for c in json.load(open(f"sound/cues_{s}.json")):
        sfx.append({"frame": max(0, round(c["t"] * 30)), "id": c["id"], "db": c["db"] + 6, **({"pitch": c["pitch"]} if c.get("pitch") else {}), "note": f"{s}: {c.get('note', '')}"})
cue = {"fps": 30, "frames": 1200, "library": "../../alumni/sound/lib", "music": {"file": "bed.wav", "at": 0, "lufs": -33, "duck_db": 0, "fade_in": 0.3, "fade_out": 1.5},
       "sfx": sorted(sfx, key=lambda c: c["frame"])}
json.dump(cue, open("sound/cues.json", "w"), indent=1)
subprocess.run(["python3", "../creoble4/scripts/sound_mix.py", "sound/cues.json", "sound/mix.wav"], check=True)
