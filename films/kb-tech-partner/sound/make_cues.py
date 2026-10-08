# Writes sound/cues.json from the film's own labels (film/src/clock.ts BEATS + film/src/words.json), so every effect
# sits on the frame of the move it sounds (motion/sound.md: the sound follows the speed graph). Re-run after a retime.
#   python3 sound/make_cues.py
import json, re, os
here = os.path.dirname(os.path.abspath(__file__))
words = json.load(open(os.path.join(here, "../film/src/words.json")))
src = open(os.path.join(here, "../film/src/clock.ts")).read()
beats = dict(re.findall(r'^\s+(\w+):\s*("?[^,\n]+"?),', src.split("BEATS")[1].split("};")[0], re.M))
lab = {**words}
def sec(pos):
    pos = str(pos).strip().strip('"')
    m = re.match(r'^([^+-]+?)\s*([+-]\s*[\d.]+)?$', pos)
    base, d = m[1].strip(), float(m[2].replace(" ", "")) if m[2] else 0.0
    if base in lab: return lab[base] + d
    if base in beats:
        v = beats[base].strip('"')
        lab[base] = float(v) if re.match(r'^[\d.]+$', v) else sec(v)
        return lab[base] + d
    return float(base) + d
F = lambda pos, extra=0.0: int(round((sec(pos) + extra) * 30))

cues = [
    # the hook
    ("gen-impact-soft", F("land", 0.10), -7, None, "the business lands on the floor"),
    ("gen-whoosh-short", F("lift", 0.30), -5, None, "the floor lifts it on \"grow\" (mid-move)"),
    ("gen-tap", F("grip", 0.28), -3, -3, "the two tiles clamp its feet"),
    ("gen-whoosh-deep", F("sink", 0.30), -7, None, "held back: floor, business and word sink"),
    # the search
    *[("gen-tick", F("reel", d), -5, p, "a tool passes the selector") for d, p in [(0.25, 0), (0.55, 1), (0.95, 2), (1.85, 3), (2.05, 4)]],
    ("gen-whoosh-short", F("where", 0.25), -5, None, "the reel breaks: three tiles land round the business"),
    *[("gen-tap", F("where", d + 0.28), -7, 0, "the selector can't settle") for d in (0.12, 0.38, 0.62)],
    # the wall closes in pairs
    *[("gen-pop", F(pos, 0.14), -6, p, "a pair of tiles closes the wall") for pos, p in
      [("close", 0), ("close+0.17", 1), ("w:always-0.04", 2), ("w:always+0.14", 3), ("w:easy-0.06", 5), ("w:easy+0.1", 7)]],
    # the turn
    ("gen-stamp", F("kb", 0.30), -4, None, "K.B seats in the hole"),
    ("gen-whoosh-deep", F("field", 0.27), -3, None, "the tile grows into the navy field (fastest frame)"),
    ("gen-shimmer", F("field", 0.40), -9, None, "K.B, the brand moment"),
    ("gen-whoosh-medium", F("fold", 0.25), -7, None, "the field folds back into the tile"),
    ("gen-whoosh-short", F("note", 0.27), -9, None, "the advice note slides across the gap"),
    ("gen-whoosh-short", F("dock", 0.30), -5, None, "K.B crosses the gap"),
    ("gen-tap", F("dock", 0.55), -5, 0, "and docks beside the business"),
    # the four steps
    ("gen-pop", F("first", 0.62), -6, 4, "the dot leaves the period"),
    ("gen-appear", F("lens", 0.12), -3, None, "the dot opens into a lens"),
    ("gen-whoosh-medium", F("open3", 0.30), -5, None, "the business opens into its parts"),
    ("gen-pop", F("ring1", 0.10), -5, 0, "ringed: Excel files"),
    ("gen-pop", F("ring2", 0.10), -5, 2, "ringed: CRM updates"),
    ("gen-pop", F("ring2", 0.20), -5, 4, "ringed: Follow-ups"),
    ("gen-tap", F("flip", 0.21), -6, 0, "the pieces flip into Make, n8n, Claude"),
    ("gen-tap", F("flip", 0.31), -6, 2, ""),
    ("gen-tap", F("flip", 0.41), -6, 4, ""),
    ("gen-riser-1s", F("life"), -9, None, "the flow builds into \"life\" (ends on it)"),
    ("gen-whoosh-short", F("bring", 0.25), -6, None, "the pieces close into one"),
    ("gen-success", F("life", 0.12), -3, None, "brought to life: the colour comes back"),
    # the span
    ("gen-whoosh-medium", F("ride", 0.50), -4, None, "the pair rides from strategy to implementation"),
    ("gen-tap", F("ride", 1.0), -6, 2, "arrives at implementation"),
    ("gen-whoosh-short", F("side", 0.22), -6, None, "the K.B tile turns to the founders"),
    ("gen-whoosh-medium", F("behind0", 0.35), -5, None, "the founders go behind the business"),
    ("gen-whoosh-medium", F("floorIn", 0.30), -6, None, "the opening's floor returns"),
    ("gen-whoosh-deep", F("drop", 0.30), -4, None, "the floor drops away"),
    ("gen-swell", F("partner", 0.40), -2, None, "the founders rise behind it"),
    ("gen-whoosh-medium", F("up", 0.25), -6, None, "both lift, higher than in the hook"),
    ("gen-impact-deep", F("rest", 0.07), -8, None, "the end card: with the song's last chord"),
]
out = {"fps": 30, "frames": 1020, "library": "lib",
       "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "bed.wav", "at": 0, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.6},
       "sfx": [dict(id=i, frame=f, db=db, **({"pitch": p} if p else {}), note=n) for i, f, db, p, n in cues]}
json.dump(out, open(os.path.join(here, "cues.json"), "w"), indent=1)
print(len(cues), "cues")
