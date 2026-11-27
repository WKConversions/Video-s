# Cue sheet for the K.B process reel v2: Karl's own recorded UI sounds only (films/kb-team/sound/lib-kb, licence
# "karl"), placed on the spoken words; nothing generated. Calm bed: Mixkit "Piano Reflections" (free licence, no credit).
import json, re
W = {}
for line in open("../film/src/timing.ts"):
    m = re.match(r'\s*(\{"w".*\}),\s*$', line)
    if m: d = json.loads(m.group(1)); W.setdefault(d["w"], []).append(d["t"])
w = lambda x, n=1, d=0.0: W[x][n - 1] + d
E = [(0.3, "ui-open", -8, 0, "the logo"), (0.95, "aio-06", -10, 0, "the contract appears"), (w("software"), "kbt-type-0", -12, 0, "the title types"),
     (w("signed", 1, -0.1), "ui-stretch", -14, 2, "signature"), (w("contract", 1, 0.05), "ui-stretch", -14, 4, "second signature"), (w("contract", 1, 0.5), "aio-10", -7, 0, "the seal"),
     (w("contract", 1, 0.55), "ui-button", -10, 0, "seal"), (w("scope"), "aio-03", -12, 0, "scope lines glow"), (w("into", 1, -0.05), "aio-05", -11, 0, "the lines split into tiles"),
     *[(w("clear", 1, -0.1 + 0.1 * i), "ui-click-digital-03", -12, i, "a task is created") for i in range(6)], (w("project", 1, -0.15), "ui-enter", -9, 0, "Project tools"),
     (w("agents", 1, -0.1), "aio-00", -10, 0, "AI agents"), (w("carry"), "ui", -12, 0, "the agents work"), (w("carry", 1, 0.6), "kbt-type-3", -14, 0, "working"),
     *[(w("validate", 1, 0.1 * i), "aio-09", -11, i, "validated") for i in range(6)], (w("results"), "aio-07", -9, 0, "all validated"),
     (w("then", 1, -0.05), "aio-05", -11, 2, "the tiles merge into the documentation"), (w("update", 1, -0.05), "ui-typing", -13, 0, "lines rewritten"),
     (w("improve", 1, -0.25), "ui-open", -9, 0, "the ring"), *[(w("improve", 1, 0.05 + 0.13 * j), "ui-granular-button-select", -12, j, "a segment") for j in range(4)],
     (w("process", 1, -0.2), "aio-07", -8, 2, "double-checked"), (w("do", 1, -0.25), "aio-06", -10, -2, "into the chat"), (w("differently"), "kbt-type-5", -13, 0, "the message types"),
     (w("message", 1, -0.05), "ui-click", -6, 0, "Message us"), (w("message", 1, 0.15), "aio-02", -10, 0, "sent"), (w("share", 1, -0.1), "aio-01", -10, 0, "a trick"),
     (20.95, "ui-premium-open", -10, 0, "the end card"), (21.7, "ui-button", -10, 3, "Message us")]
fx = [{"frame": round(t * 60), "id": i, "db": min(-2, db + 6), "pitch": p, "note": n} for t, i, db, p, n in E]
json.dump({"fps": 60, "frames": 1380, "library": "../../kb-team/sound/lib-kb", "vo": {"file": "../vo/vo.mp3", "at": 0.3, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -33, "duck_db": 5, "fade_in": 0.1, "fade_out": 1.2}, "sfx": sorted(fx, key=lambda c: c["frame"])}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
