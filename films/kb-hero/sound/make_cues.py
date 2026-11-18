# Cue sheet for the K.B hero film (40.5 s, 60 fps). Karl: "For now, only use sound effects. No self by Claude made sound
# effects." So: no music, no voice, and ONLY Karl's own recordings (lib-karl, licence "karl": no Apple system sounds, this
# goes on a client's website, and nothing generated). Each cue comes from an event the scenes export
# (film/tools/events.mjs evaluates src/scenes/*.tsx), plus one soft sound on some scene changes.
#   python3 make_cues.py && python3 sound_mix.py cues.json mix.wav --sheet mix.png
import json, subprocess, copy, os
SRC = "../../creoble6/sound/lib-karl"; LIB = "lib-kb"
# the film's own library folder: hardlinks to Karl's files, but its OWN index.json (never write through a hardlink into
# lib-karl's shared index), filtered to Karl's own recordings
if not os.path.isdir(f"{LIB}/sfx"):
    os.makedirs(LIB, exist_ok=True); subprocess.run(["cp", "-al", f"{SRC}/sfx", f"{LIB}/sfx"], check=True)
    os.remove(f"{LIB}/sfx/index.json")
base = [x for x in json.load(open(f"{SRC}/sfx/index.json")) if x["licence"] == "karl"]
idx = {x["id"]: x for x in base}; extra = []
ev = json.loads(subprocess.run(["node", "tools/events.mjs"], cwd="../film", capture_output=True, text=True, check=True).stdout)
# kinds -> pools of Karl's sounds, taken in turn so the same sound never comes twice in a row
POOL = {
    "click": [("ui-click", 0), ("ui-enter", -1), ("ui-backspace", -2)],
    "pop": [("ui-button", -3), ("ui-granular-button-select", -2), ("ui-granular-button-select-2", -3)],
    "whoosh": [("ui-stretch", -6), ("ui-open", -7)],
    "slide": [("ui-stretch", -7)],
    "open": [("ui-open", -6), ("ui-premium-open", -8)],
    "tick": [("v4-type-delete", -3), ("ui-click-digital-04", -4)],
    "snap": [("ui-enter", -2), ("ui-beatbox-click-01", -4)],
    "success": [("ui-granular-button-select-2", -1), ("ui-button", -2)],
    "glitch": [("ui-glitch-click", -5)],
}
GAP = {"pop": 0.28, "tick": 0.16, "whoosh": 0.8, "slide": 0.8, "open": 1.5, "success": 0.5, "snap": 0.3, "click": 0.3, "glitch": 0.5}
fx, turn, last, prev, n = [], {}, {}, None, 0
for e in sorted(ev["sfx"], key=lambda x: x["t"]):
    t, kind = e["t"], e["kind"]
    if kind == "type":       # a stretch of Karl's soft typing recording
        d = 0.7; i = f"kb-type-{n}"; out = f"{LIB}/sfx/ticker/{i}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(0.1 + 0.45 * (n % 3)), "-i", os.path.join(SRC, idx["ui-typing"]["file"]), "-t", str(d), "-af", f"afade=t=in:d=0.02,afade=t=out:st={d - 0.08}:d=0.08", out], check=True)
        x = copy.deepcopy(idx["ui-typing"]); x.update(id=i, file=f"sfx/ticker/{i}.wav", length=d, sync=0.0, transients=[]); extra.append(x)
        fx.append({"frame": round(t * 60), "id": i, "db": -4, "pitch": 0, "note": f"{e['scene']} typing: {e.get('note', '')}"}); n += 1; continue
    if kind not in POOL or t - last.get(kind, -9) < GAP[kind]: continue
    pool = POOL[kind]; k = turn.get(kind, 0)
    if pool[k % len(pool)][0] == prev and len(pool) > 1: k += 1
    i, db = pool[k % len(pool)]; turn[kind] = k + 1; last[kind] = t; prev = i
    fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": 0, "note": f"{e['scene']} {kind}: {e.get('note', '')}"})
# a soft pass on the bigger scene changes (not all of them)
for s in ev["scenes"]:
    if s["trans"] in ("zoom", "push-up", "push-left", "iris") and s["start"] > 0:
        fx.append({"frame": round((s["start"] - 0.12) * 60), "id": "ui-stretch" if s["trans"].startswith("push") else "ui-open", "db": -9, "pitch": -2, "note": f"{s['id']} transition ({s['trans']})"})
json.dump(base + extra, open(f"{LIB}/sfx/index.json", "w"), indent=1)
cues = {"fps": 60, "frames": round(ev["dur"] * 60), "library": LIB, "sfx": sorted(fx, key=lambda c: c["frame"])}
json.dump(cues, open("cues.json", "w"), indent=1)
print(len(cues["sfx"]), "cues +", n, "typing runs;", "hand on screen:", ev.get("handShare"))
