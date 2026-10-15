# Writes a mixer cue sheet (sound_mix.py format) from the film's own timing labels, so every effect sits on the frame
# of its picture event and moves with the picture when the timing changes:
#   python3 -I cues_from_labels.py cuelist.json sound/cues.json
# cuelist.json:
#   {"labels": ["film/src/clock.ts:BEATS", "film/src/v2/labels.ts:V2"],   # TS objects `NAME = { key: seconds, ... }`
#    "words": "film/src/words.json",                                     # {"w:word": seconds} (vo_whisper / vo_align)
#    "fps": 30, "frames": 2100, "library": "lib",
#    "vo": {"file": "../vo/vo.mp3", "at": 1.0}, "music": {"file": "music/score.wav", "duck_db": 4, "fade_out": 0.6},
#    "cues": [["w:story", "belltree", -1, 0, "the book opens into light"],
#             ["w:can+0.37", "page-turn", 0, 0, "the page turns"],
#             [0.0, "night-crickets", -13, 0, "the night under the opening", {"auto_level": false}]]}
# A cue is [when, effect id, dB nudge, pitch in semitones, note, optional extra fields]. "when" is a number of seconds
# or a label expression: "label", "label+0.3", "label-0.2" (later label files win over earlier ones; words last).
# Put the offset where the sound's sync point should land: a page turn's sync is the page passing upright, a
# glissando's its top note, a pop's its attack (the effect's own `sync` in the index).
import json, re, sys

def table(path, name):
    body = re.search(name + r"[^=]*=\s*\{(.*?)\};", open(path).read(), re.S).group(1)
    return {k: float(v) for k, v in re.findall(r"([A-Za-z0-9_]+):\s*(-?[0-9.]+)", body)}

spec = json.load(open(sys.argv[1]))
LAB = {}
for ref in spec.get("labels", []):
    path, name = ref.split(":")
    LAB.update(table(path, name))
if spec.get("words"): LAB.update(json.load(open(spec["words"])))

def t(when):
    if isinstance(when, (int, float)): return float(when)
    m = re.match(r"^(.*?)([+-][0-9.]+)?$", when)
    base, off = m.group(1), float(m.group(2) or 0)
    if base not in LAB: sys.exit(f"unknown label: {base}")
    return LAB[base] + off

fps = spec.get("fps", 30)
sfx = []
for row in spec["cues"]:
    when, sid, db, pitch, note = row[:5]
    c = {"id": sid, "frame": int(round(t(when) * fps)), "db": db}
    if pitch: c["pitch"] = pitch
    if note: c["note"] = note
    if len(row) > 5: c.update(row[5])
    sfx.append(c)
sfx.sort(key=lambda c: c["frame"])
out = {k: spec[k] for k in ("fps", "frames", "library", "vo", "music", "auto_level", "allow_apple") if k in spec}
out["sfx"] = sfx
json.dump(out, open(sys.argv[2], "w"), indent=1)
print(f"{sys.argv[2]}: {len(sfx)} effects, {len({c['id'] for c in sfx})} different sounds")
