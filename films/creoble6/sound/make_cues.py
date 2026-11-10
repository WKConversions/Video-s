# Cue sheet for Creoble v6 (contract 2). Karl (10 Nov): "more Apple-style heavy sounds", from his own folder (lib-karl,
# built with sfx_build.py from his zip; gitignored). Every cue comes from the EVENTS list each scene exports
# (film/src/scenes/A|B|C.tsx), so the sound follows the picture. Music: Karl's track, fitted with music_fit.py
# (bed.wav, gitignored). Voice: vo/vo_paced.mp3.
# python3 make_cues.py && python3 <skill>/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json, re, subprocess, copy, os
LIB = "lib-karl"; idx = json.load(open(f"{LIB}/sfx/index.json")); by = {x["id"]: x for x in idx}
ev = []
for s in "ABC":
    src = open(f"../film/src/scenes/{s}.tsx").read(); m = re.search(r"export const EVENTS[^=]*=\s*\[(.*?)\n\];", src, re.S)
    for t, kind, rest in re.findall(r"\{\s*t:\s*([\d.]+),\s*kind:\s*\"(\w+)\"([^}]*)\}", m.group(1) if m else ""):
        ln = re.search(r"len:\s*([\d.]+)", rest); note = re.search(r"note:\s*\"([^\"]*)\"", rest)
        ev.append((float(t), kind, float(ln.group(1)) if ln else 0, note.group(1) if note else ""))
ev.sort()
def typing_clip(n, length):          # a stretch of Karl's iPhone keyboard recording, cut to the typing run
    i = f"typing-{n:02d}"; out = f"{LIB}/sfx/ticker/{i}.wav"; os.makedirs(os.path.dirname(out), exist_ok=True)
    src = os.path.join(LIB, by["iphone-texting"]["file"]); d = max(0.3, length)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(2.0 + 1.7 * n), "-i", src, "-t", str(d), "-af", f"afade=t=in:d=0.02,afade=t=out:st={d - 0.06}:d=0.06", out], check=True)
    e = copy.deepcopy(by["iphone-texting"]); e.update(id=i, file=f"sfx/ticker/{i}.wav", length=d, sync=0.0, transients=[]); return e
SOUND = {"click": ("ui-beatbox-click-01", -3), "pop": ("pop", -13), "open": ("ui-open", -5), "send": ("send-2", -12), "check": ("double-bubble-pop", -9), "logo": ("ui-button", -12)}
fx, extra, n = [], [], 0
last = {}
for t, kind, ln, note in ev:
    if kind == "type":
        e = typing_clip(n, ln); extra.append(e); fx.append({"frame": round(t * 60), "id": e["id"], "db": 4, "pitch": 0, "note": note}); n += 1; continue
    if kind not in SOUND or t - last.get(kind, -9) < 0.12: continue
    last[kind] = t; i, db = SOUND[kind]
    fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": 0, "note": note})
end_logo = max([t for t, k, _, _ in ev if k == "logo"] or [60])
fx.append({"frame": round((end_logo + 0.3) * 60), "id": "mac-startup", "db": -14, "pitch": 0, "note": "the logo: Mac start-up chord, low"})
json.dump([x for x in idx if not x["id"].startswith("typing-")] + extra, open(f"{LIB}/sfx/index.json", "w"), indent=1)
json.dump({"fps": 60, "frames": 3912, "library": LIB, "allow_apple": True,
           "vo": {"file": "../vo/vo_paced.mp3", "at": 0, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -27, "duck_db": 6, "fade_in": 0.05, "fade_out": 1.2},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(ev), "events ->", len(fx), "cues")
