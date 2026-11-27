# Cue sheet for the K.B process reel: effects (Karl's library) on the spoken words, the VO at 0.3 s, a quiet bed.
import json, re
W = {}
for line in open("../film/src/timing.ts"):
    m = re.match(r'\s*(\{"w".*\}),\s*$', line)
    if m: d = json.loads(m.group(1)); W.setdefault(d["w"], []).append(d["t"])
w = lambda x, n=1, d=0.0: W[x][n - 1] + d
E = [(0.3, "gen-appear", -6, 0, "logo"), (1.2, "gen-whoosh-medium", -9, 0, "logo to the header, contract rises"),
     *[(w("software", 1, 0.12 * i), "kenney-select-002", -16, i, "typing") for i in range(6)],
     (w("signed"), "gen-whoosh-short", -12, 2, "pen signs"), (w("contract", 1, 0.05), "gen-whoosh-short", -12, 4, "second signature"), (w("contract", 1, 0.6), "gen-stamp", -6, 0, "seal"),
     (w("scope"), "gen-shimmer", -10, 0, "scope glows"), *[(w("into", 1, 0.15 + 0.13 * i), "gen-whoosh-short", -12, i, "a task flies in") for i in range(5)],
     (w("project"), "kenney-drop-003", -8, 0, "the board"), *[(w("agents", 1, -0.1 + 0.12 * j), "gen-pop", -8, 2 * j, "an AI agent") for j in range(3)],
     *[(w("carry", 1, 0.22 * i), "gen-whoosh-short", -13, i, "to Doing") for i in range(5)], *[(w("those", 1, 0.25 + 0.2 * i), "gen-whoosh-short", -13, 3 + i, "to Done") for i in range(5)],
     (w("validate"), "gen-swell", -11, 0, "the scan"), *[(w("validate", 1, 0.05 + 0.12 * i), "kenney-select-001", -10, 2 * i, "check") for i in range(5)],
     (w("then"), "gen-whoosh-medium", -9, 0, "sparks to the docs"), (w("learn"), "gen-shimmer", -10, 2, "learn"), (w("update"), "gen-whoosh-short", -10, 0, "lines rewrite"),
     (w("documentation", 1, 0.2), "gen-whoosh-short", -10, 3, "more lines"), (w("improve"), "gen-whoosh-deep", -8, 0, "the loop"), (w("development", 2, -0.4), "gen-whoosh-short", -11, 2, "the glass sweeps"),
     (w("process", 1, -0.1), "gen-chime", -6, 0, "double-checked"), (w("do", 1, -0.15), "gen-whoosh-medium", -9, 0, "to the question"),
     (w("differently"), "gen-pop", -8, 2, "differently?"), (w("message"), "kenney-click-001", -5, 0, "Message us pressed"), (w("share"), "gen-appear", -7, 2, "a trick"),
     (20.95, "gen-whoosh-deep", -8, 0, "to the end card"), (21.5, "gen-success", -7, 0, "logo"), (22.3, "gen-shimmer", -13, 2, "glint")]
fx = [{"frame": round(t * 60), "id": i, "db": min(-3, db + (5 if i in ("gen-tick", "kenney-tick-004", "kenney-select-001", "kenney-select-002") else 3)), "pitch": p, "note": n} for t, i, db, p, n in E]
json.dump({"fps": 60, "frames": 1380, "library": "../../alumni/sound/lib", "vo": {"file": "../vo/vo.mp3", "at": 0.3, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -30, "duck_db": 5, "fade_in": 0.1, "fade_out": 1.2}, "sfx": sorted(fx, key=lambda c: c["frame"])}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
