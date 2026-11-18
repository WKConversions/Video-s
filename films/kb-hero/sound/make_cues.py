# Cue sheet for the K.B hero film (60 fps). Karl: "For now, only use sound effects. No self by Claude made sound
# effects." and, after the first full version: "it also needs more sfx variety". So: no music, no voice, ONLY Karl's own
# recordings (lib-karl, licence "karl": no Apple system sounds, this goes on a client's website, and nothing generated),
# and all of them: the 20 single sounds plus the 11 sounds inside his compilation "ui-all-in-one" (cut apart here, as its
# catalogue entry says: "split before use"). Each cue comes from an event a scene exports (film/tools/events.mjs).
#   python3 make_cues.py && python3 sound_mix.py cues.json mix.wav --sheet mix.png
import json, subprocess, copy, os, collections
SRC = "../../creoble6/sound/lib-karl"; LIB = "lib-kb"
# the film's own library folder: hardlinks to Karl's files, but its OWN index.json (never write through a hardlink into
# lib-karl's shared index), filtered to Karl's own recordings
if not os.path.isdir(f"{LIB}/sfx"):
    os.makedirs(LIB, exist_ok=True); subprocess.run(["cp", "-al", f"{SRC}/sfx", f"{LIB}/sfx"], check=True)
    os.remove(f"{LIB}/sfx/index.json")
base = [x for x in json.load(open(f"{SRC}/sfx/index.json")) if x["licence"] == "karl"]
idx = {x["id"]: x for x in base}; extra = []

# ---- Karl's compilation, cut into its 11 sounds: (start, end, category for the mix level, sync point, what it is)
# measured with the skill's sfx_index.py: length, brightness, pitch movement, number of hits
AIO = [
    (0.00, 0.33, "pop", 0.03, "short mid blip, four quick taps"),
    (0.46, 1.16, "dismiss-fall", 0.05, "bright sparkle falling (-14 st)"),
    (1.34, 1.68, "pop", 0.08, "bloop falling fast (-47 st)"),
    (1.78, 3.50, "data", 0.06, "long quiet bright shimmer, 23 ticks"),
    (3.85, 4.42, "dismiss-fall", 0.14, "low tonal boop, falling, long decay"),
    (4.56, 5.80, "swipe", 0.23, "swell, 1.2 s"),
    (6.22, 6.66, "appear-rise", 0.20, "quiet zip rising (+58 st)"),
    (6.90, 7.62, "success", 0.22, "flourish rising (+11 st)"),
    (7.68, 8.46, "data", 0.07, "bright sparkle chatter"),
    (8.60, 8.78, "tap", 0.05, "single bright tick"),
    (8.93, 9.32, "impact", 0.04, "low thud (166 Hz)"),
]
os.makedirs(f"{LIB}/sfx/aio", exist_ok=True)
for k, (a, b, cat, sync, what) in enumerate(AIO):
    i = f"aio-{k:02d}"; out = f"{LIB}/sfx/aio/{i}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-to", str(b), "-i", os.path.join(SRC, idx["ui-all-in-one"]["file"]),
                    "-af", "afade=t=in:d=0.004,areverse,afade=t=in:d=0.03,areverse", out], check=True)
    x = copy.deepcopy(idx["ui-all-in-one"]); x.update(id=i, file=f"sfx/aio/{i}.wav", length=round(b - a, 2), sync=sync, transients=[], category=cat, character=what, original="ui-all-in-one")
    extra.append(x)

ev = json.loads(subprocess.run(["node", "tools/events.mjs"], cwd="../film", capture_output=True, text=True, check=True).stdout)

# ---- each kind of event has a small family of Karl's sounds. Within one scene a kind keeps ONE sound (the scene sounds
# like one thing); the next scene that uses the kind takes the next sound of the family (variety across the film).
# Quick repeats inside a scene step up in pitch, so three cards landing are three notes, not one sound three times.
VOICE = {
    "click": [("ui-click", 0)],                      # every cursor click is the same sound: the hand's own voice
    "pop": [("ui-button", -3), ("aio-00", -2), ("ui-granular-button-select", -2), ("aio-02", -2)],
    "tick": [("v4-type-delete", -2), ("aio-09", -2), ("ui-click-digital-03", -2), ("ui-beatbox-click-01", -3), ("ui-click-digital-04", -2)],
    "whoosh": [("ui-stretch", -6), ("aio-05", -4)],
    "slide": [("aio-05", -4), ("ui-stretch", -7)],
    "open": [("ui-open", -5), ("aio-06", -2)],
    "rise": [("aio-06", -2), ("ui-granular-button-select-2", -3), ("ui-open", -5)],
    "fall": [("ui-digital-click", -3), ("aio-01", -4), ("aio-04", -4)],
    "sparkle": [("ui", -2), ("aio-08", -3), ("aio-03", 0)],
    "success": [("aio-07", -2), ("ui-granular-button-select-2", -1), ("aio-08", -3)],
    "snap": [("ui-enter", -1), ("ui-backspace", -2)],
    "thud": [("aio-10", -5), ("ui-backspace", -1)],
    "glitch": [("ui-glitch-click", -5), ("ui-glitch-flicker-text", -6), ("uu-click-digital-01", -4)],
}
# a soft, different sound on each kind of scene change (none on the blur dissolves)
TRANS = {"zoom": ("ui-open", -9, 0), "push-up": ("ui-stretch", -9, -2), "push-left": ("aio-05", -8, 0), "iris": ("ui-open", -9, 3),
         "wipe": ("aio-01", -9, -3)}
TRANS_BY_SCENE = {"S13": ("ui-premium-open", -8, 0)}      # the globe turning in: Karl's long low swell, once in the film
fx, n = [], 0
tr_times = []
for s in ev["scenes"]:
    if s["trans"] in TRANS and s["start"] > 0:
        i, db, pitch = TRANS_BY_SCENE.get(s["id"], TRANS[s["trans"]]); t = s["start"] - 0.12; tr_times.append(t)
        fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": pitch, "note": f"{s['id']} transition ({s['trans']})"})
turn = collections.Counter(); scene_voice = {}; last = {}
for e in sorted(ev["sfx"], key=lambda x: x["t"]):
    t, kind, sc = e["t"], e["kind"], e["scene"]
    if kind == "type":       # a stretch of Karl's soft typing recording
        d = 0.7; i = f"kb-type-{n}"; out = f"{LIB}/sfx/ticker/{i}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(0.1 + 0.45 * (n % 3)), "-i", os.path.join(SRC, idx["ui-typing"]["file"]), "-t", str(d), "-af", f"afade=t=in:d=0.02,afade=t=out:st={d - 0.08}:d=0.08", out], check=True)
        x = copy.deepcopy(idx["ui-typing"]); x.update(id=i, file=f"sfx/ticker/{i}.wav", length=d, sync=0.0, transients=[]); extra.append(x)
        fx.append({"frame": round(t * 60), "id": i, "db": -4, "pitch": 0, "note": f"{sc} typing: {e.get('note', '')}"}); n += 1; continue
    if kind not in VOICE: continue
    if kind in ("whoosh", "slide", "open") and any(abs(t - tt) < 0.4 for tt in tr_times): continue   # the scene change already sounds
    if (sc, kind) not in scene_voice:
        scene_voice[(sc, kind)] = VOICE[kind][turn[kind] % len(VOICE[kind])]; turn[kind] += 1
    i, db = scene_voice[(sc, kind)]
    lt, lp = last.get((sc, kind), (-9, -2))
    if t - lt < 0.1: continue
    pitch = lp + 2 if t - lt < 1.3 and kind in ("pop", "tick", "success", "snap") else 0   # quick repeats climb a scale
    last[(sc, kind)] = (t, pitch)
    fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": pitch, "note": f"{sc} {kind}: {e.get('note', '')}"})
json.dump(base + extra, open(f"{LIB}/sfx/index.json", "w"), indent=1)
cues = {"fps": 60, "frames": round(ev["dur"] * 60), "library": LIB, "sfx": sorted(fx, key=lambda c: c["frame"])}
json.dump(cues, open("cues.json", "w"), indent=1)
use = collections.Counter(c["id"] if not c["id"].startswith("kb-type") else "ui-typing" for c in cues["sfx"])
print(len(cues["sfx"]), "cues;", len(use), "different sounds:", ", ".join(f"{k}×{v}" for k, v in use.most_common()))
print("hand on screen:", ev.get("handShare"))
