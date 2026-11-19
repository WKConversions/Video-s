# Cue sheet for the K.B team film (50.05 s, 60 fps): Karl's voice-over placed sentence by sentence (make_vo.py), his
# music cut to the film (music_fit.py -> bed.wav), and sound effects that follow the reference's sparing palette (typing
# on typed text, soft clicks, swishes on the fast turns, a few digital sparkles), taken ONLY from Karl's own recordings
# (lib-karl, licence "karl": no Apple system sounds, nothing generated), including the 11 sounds inside his compilation
# "ui-all-in-one". Every cue comes from an event a shot package exports (film/tools/events.mjs).
#   python3 make_cues.py && python3 sound_mix.py cues.json mix.wav --sheet mix.png
import json, subprocess, copy, os, collections
SRC = "../../creoble6/sound/lib-karl"; LIB = "lib-kb"
if not os.path.isdir(f"{LIB}/sfx"):
    os.makedirs(LIB, exist_ok=True); subprocess.run(["cp", "-al", f"{SRC}/sfx", f"{LIB}/sfx"], check=True)
if os.path.exists(f"{LIB}/sfx/index.json"): os.remove(f"{LIB}/sfx/index.json")       # never write through a hardlink
base = [x for x in json.load(open(f"{SRC}/sfx/index.json")) if x["licence"] == "karl"]
idx = {x["id"]: x for x in base}; extra = []
AIO = [(0.00, 0.33, "pop", 0.03, "short mid blip, four quick taps"), (0.46, 1.16, "dismiss-fall", 0.05, "bright sparkle falling"),
       (1.34, 1.68, "pop", 0.08, "bloop falling fast"), (1.78, 3.50, "data", 0.06, "long quiet bright shimmer"),
       (3.85, 4.42, "dismiss-fall", 0.14, "low tonal boop, falling"), (4.56, 5.80, "swipe", 0.23, "swell, 1.2 s"),
       (6.22, 6.66, "appear-rise", 0.20, "quiet zip rising"), (6.90, 7.62, "success", 0.22, "flourish rising"),
       (7.68, 8.46, "data", 0.07, "bright sparkle chatter"), (8.60, 8.78, "tap", 0.05, "single bright tick"), (8.93, 9.32, "impact", 0.04, "low thud")]
os.makedirs(f"{LIB}/sfx/aio", exist_ok=True); os.makedirs(f"{LIB}/sfx/ticker", exist_ok=True)
for k, (a, b, cat, sync, what) in enumerate(AIO):
    i = f"aio-{k:02d}"; out = f"{LIB}/sfx/aio/{i}.wav"
    if os.path.exists(out): os.remove(out)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-to", str(b), "-i", os.path.join(SRC, idx["ui-all-in-one"]["file"]), "-af", "afade=t=in:d=0.004,areverse,afade=t=in:d=0.03,areverse", out], check=True)
    x = copy.deepcopy(idx["ui-all-in-one"]); x.update(id=i, file=f"sfx/aio/{i}.wav", length=round(b - a, 2), sync=sync, transients=[], category=cat, character=what, original="ui-all-in-one"); extra.append(x)
ev = json.loads(subprocess.run(["node", "tools/events.mjs"], cwd="../film", capture_output=True, text=True, check=True).stdout)
# each kind of event has a small family of Karl's sounds; inside one package a kind keeps one sound, the next package
# that uses the kind takes the next one; quick repeats step up in pitch
VOICE = {
    "click": [("ui-click", 0)],
    "tick": [("v4-type-delete", -3), ("aio-09", -4), ("ui-click-digital-03", -4)],
    "pop": [("ui-button", -5), ("aio-00", -4), ("ui-granular-button-select", -4), ("aio-02", -4)],
    "swish": [("ui-stretch", -8), ("aio-05", -6)],
    "slide": [("aio-05", -7), ("ui-stretch", -9)],
    "rise": [("aio-06", -3), ("ui-open", -7)],
    "sparkle": [("ui", -4), ("aio-08", -5), ("aio-03", -1)],
    "thud": [("aio-10", -7)],
    "digital": [("ui-digital-click", -5), ("ui-glitch-click", -7)],
    "success": [("aio-07", -4), ("ui-granular-button-select-2", -3)],
}
fx, n = [], 0; turn = collections.Counter(); voice = {}; last = {}
for e in ev["sfx"]:
    t, kind, pk = e["t"], e["kind"], e["pkg"]
    if kind == "type":       # a stretch of Karl's soft typing recording, as long as the typing run
        try: d = max(0.25, min(4.0, float(str(e.get("note", "0.7")).split()[0])))
        except ValueError: d = 0.7
        i = f"kbt-type-{n}"; out = f"{LIB}/sfx/ticker/{i}.wav"
        if os.path.exists(out): os.remove(out)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "2", "-ss", str(0.08 + 0.3 * (n % 3)), "-i", os.path.join(SRC, idx["ui-typing"]["file"]), "-t", str(d), "-af", f"afade=t=in:d=0.015,afade=t=out:st={d - 0.07}:d=0.07", out], check=True)
        x = copy.deepcopy(idx["ui-typing"]); x.update(id=i, file=f"sfx/ticker/{i}.wav", length=d, sync=0.0, transients=[]); extra.append(x)
        fx.append({"frame": round(t * 60), "id": i, "db": -5 + e.get("db", 0), "pitch": 0, "note": f"{pk} typing {d:.2f}s"}); n += 1; continue
    if kind not in VOICE: continue
    if (pk, kind) not in voice: voice[(pk, kind)] = VOICE[kind][turn[kind] % len(VOICE[kind])]; turn[kind] += 1
    i, db = voice[(pk, kind)]; lt, lp = last.get((pk, kind), (-9, -1))
    if t - lt < 0.07: continue
    pitch = (lp + 1) % 6 if t - lt < 0.9 and kind in ("pop", "tick") else 0
    last[(pk, kind)] = (t, pitch)
    fx.append({"frame": round(t * 60), "id": i, "db": db + e.get("db", 0), "pitch": pitch, "note": f"{pk} {kind}: {e.get('note', '')}"})
json.dump(base + extra, open(f"{LIB}/sfx/index.json", "w"), indent=1)
cues = {"fps": 60, "frames": 3003, "library": LIB, "vo": {"file": "vo_placed.wav", "at": 0}, "music": {"file": "bed.wav", "at": 0, "fade_in": 0.2, "fade_out": 0.6, "duck_db": 6},
        "sfx": sorted(fx, key=lambda c: c["frame"])}
json.dump(cues, open("cues.json", "w"), indent=1)
use = collections.Counter(c["id"] if not c["id"].startswith("kbt-type") else "ui-typing" for c in cues["sfx"])
print(len(cues["sfx"]), "effects;", len(use), "different sounds:", ", ".join(f"{k}×{v}" for k, v in use.most_common()))
