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
# Karl (after the first full demo): one airy "spread" sound came back too often (Ui Open, 13 times); every effect
# should be more its own. So each kind draws from a pool in turn, never the same sound twice in a row, the long airy
# ones are used once each on the film's biggest moments, close events are thinned, and pitch steps within a group.
POOL = {
 "click": [("ui-beatbox-click-01", -3), ("one-keyboard-click", 2), ("ui-click-digital-03", 0)],
 "pop":   [("pop", -13), ("ui-granular-button-select", -12), ("v4-type-delete", -2), ("ui-enter", -6), ("ui-granular-button-select-2", -15)],
 "open":  [("ui-stretch", -17), ("turn-off-phone", -6), ("ui-backspace", -4), ("charge-connection", -3), ("ui-digital-click", -8), ("start-video", -7)],
 "send":  [("send-2", -12), ("mail-in", -17), ("send", -19)],
 "check": [("double-bubble-pop", -9), ("ui-button", -13), ("iphone-apple-pay", 0)],
 "logo":  [("ui-button", -12), ("ui-granular-button-select", -11)],
}
ONCE = {"wizard rises": ("ui-open", -5), "site window rises": ("ui-premium-open", -10)}   # the two long airy sounds, once each
GAP = {"pop": 0.45, "open": 0.9, "check": 0.25, "click": 0.12, "send": 0.5, "logo": 0.6}
fx, extra, n = [], [], 0
last, turn, prev, group = {}, {}, None, {}
for t, kind, ln, note in ev:
    if kind == "type":
        e = typing_clip(n, ln); extra.append(e); fx.append({"frame": round(t * 60), "id": e["id"], "db": 4, "pitch": 0, "note": note}); n += 1; continue
    if kind not in POOL or t - last.get(kind, -9) < GAP[kind]: continue
    once = next((v for k_, v in ONCE.items() if k_ in note), None)
    if once: ONCE = {k_: v for k_, v in ONCE.items() if v != once}; i, db = once
    else:
        pool = POOL[kind]; j = turn.get(kind, 0)
        if pool[j % len(pool)][0] == prev and len(pool) > 1: j += 1
        i, db = pool[j % len(pool)]; turn[kind] = j + 1
    step = group.get(kind, 0) + 1 if t - last.get(kind, -9) < 2.5 else 0; group[kind] = step
    last[kind] = t; prev = i
    fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": min(6, 2 * step) if kind in ("check", "pop") else 0, "note": note})
end_logo = max([t for t, k, _, _ in ev if k == "logo"] or [60])
fx.append({"frame": round((end_logo + 0.3) * 60), "id": "mac-startup", "db": -14, "pitch": 0, "note": "the logo: Mac start-up chord, low"})
json.dump([x for x in idx if not x["id"].startswith("typing-")] + extra, open(f"{LIB}/sfx/index.json", "w"), indent=1)
json.dump({"fps": 60, "frames": 3912, "library": LIB, "allow_apple": True,
           "vo": {"file": "../vo/vo_paced.mp3", "at": 0, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -27, "duck_db": 6, "fade_in": 0.05, "fade_out": 1.2},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(ev), "events ->", len(fx), "cues")
