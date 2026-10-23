# Joins the five builders' cue lists (sound/cues_S1-S5.json, 60 fps frames) into the cue sheet and mixes them with the
# voice-over (the v4 "Mathias" take) and the v4 music bed ("Take this Higher", Mixkit, fitted to 55.18 s), quieter here:
# effects lead, the bed sits under them.   python3 sound/build_mix.py  (from films/creoble5)
import json, os, subprocess
LIB = {"gen-whoosh-short", "gen-whoosh-medium", "gen-whoosh-whip", "gen-whoosh-deep", "gen-riser-1s", "gen-riser-2s", "gen-swell", "gen-impact-soft", "gen-impact-deep", "gen-stamp",
       "gen-tap", "kenney-click-001", "kenney-select-001", "kenney-select-002", "gen-tick", "kenney-tick-004", "gen-pop", "kenney-drop-003", "gen-appear", "kenney-maximize-009",
       "gen-chime", "gen-success", "gen-shimmer"}
sfx, dropped = [], []
for s in range(1, 6):
    p = f"sound/cues_S{s}.json"
    if not os.path.exists(p): print("missing", p); continue
    d = json.load(open(p)); d = d.get("sfx", d) if isinstance(d, dict) else d
    for c in d:
        if c["id"] not in LIB: dropped.append(f"S{s}:{c['id']}"); continue
        sfx.append({"frame": max(0, round(c["frame"])), "id": c["id"], "db": c.get("db", -6) + 3, **({"pitch": c["pitch"]} if c.get("pitch") else {}), "note": f"S{s}: {c.get('note', '')}"})
cue = {"fps": 60, "frames": 3310, "library": "../../alumni/sound/lib", "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -29, "duck_db": 5, "fade_in": 0.2, "fade_out": 1.2},
       "sfx": sorted(sfx, key=lambda c: c["frame"])}
json.dump(cue, open("sound/cues.json", "w"), indent=1)
if dropped: print("dropped (not in the library):", " ".join(dropped))
subprocess.run(["python3", "scripts/sound_mix.py", "sound/cues.json", "film/public/audio/mix.wav", "--sheet", "sound/mix.png"], check=True)
