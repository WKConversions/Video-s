# Writes sound/cues.json from the film's own labels (film/src/clock.ts BEATS + film/src/words.json), so every effect
# sits on the frame of the move it sounds (the sound follows the speed graph: a whoosh at the middle of a move, a tap
# on the click, a pop on the landing). Re-run after a retime.
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
    # the open: two circles, one lockup, the workspace
    ("gen-whoosh-short", F("open", 0.12), -6, None, "the two circles drift in"),
    ("gen-impact-soft", F("dock", 0.5), -9, None, "they dock into one"),
    ("gen-whoosh-medium", F("grow", 0.38), -5, None, "the circle opens into the window"),
    *[("gen-pop", F("cards", 0.05 * i + 0.14), -10, p, "module cards land") for i, p in [(0, 0), (2, 1), (4, 2), (6, 3)]],
    ("gen-tap", F("auto", 0.2), -3, None, "Automations switches on"),
    ("gen-success", F("auto", 0.34), -4, None, "its check"),
    *[("gen-tick", F("runs", 0.05 * i + 0.12), -7, i % 3, "every module runs") for i in range(1, 8)],
    ("gen-whoosh-short", F("phone", 0.24), -4, None, "the phone slides in"),
    ("gen-pop", F("chips", 0.12), -6, 2, "K.B joins"),
    ("gen-pop", F("chips", 0.24), -6, 4, "You join"),
    ("gen-whoosh-medium", F("away", 0.28), -6, None, "everything leaves left"),
    ("gen-appear", F("how", 0.05), -3, None, "How?"),
    # the audit
    ("gen-whoosh-medium", F("audit", 0.3), -5, None, "the audit window rises (the band comes in)"),
    *[("gen-tick", F("audit", 0.42 + 0.12 * i), -9, i % 2, "the title types") for i in range(4)],
    *[("gen-pop", F("steps", 0.13 * i + 0.16), -8, i, "a step lands") for i in range(5)],
    ("gen-whoosh-short", F("friction", 0.35), -9, None, "the view pushes in"),
    ("gen-tap", F("w:friction", 0.08), -2, -5, "Manual: Intake"),
    ("gen-tap", F("w:is", 0.08), -2, -5, "Manual: Follow-up"),
    ("gen-tap", F("pick", 0.4), -3, None, "the priority opens"),
    ("gen-appear", F("pick", 0.46), -8, None, "the list drops"),
    ("gen-tick", F("first", -0.34), -6, 0, "Later → Next"),
    ("gen-tick", F("first", -0.16), -6, 1, "Next → First"),
    ("gen-tap", F("first"), -2, 2, "First"),
    ("gen-success", F("first", 0.12), -5, None, "chosen"),
    # the board
    ("gen-whoosh-medium", F("board", 0.28), -6, None, "the view pulls back, the board comes in"),
    ("gen-tap", F("drag1"), -4, None, "K.B grabs Intake form"),
    ("gen-whoosh-short", F("drag1", 0.35), -9, None, ""),
    ("gen-tap", F("drag1", 0.7), -3, 3, "and drops it in Building"),
    ("gen-tap", F("drag2"), -4, 1, "You grab CRM sync"),
    ("gen-whoosh-short", F("drag2", 0.35), -9, 1, ""),
    ("gen-tap", F("drag2", 0.7), -3, 4, "and drop it"),
    ("gen-whoosh-short", F("open2", 0.35), -8, None, "the view pushes into the activity"),
    ("gen-pop", F("open2", 0.32), -5, 3, "Shared with your team"),
    # intake and the workflow
    ("gen-whoosh-short", F("form", 0.25), -6, None, "the form rises"),
    *[("gen-tick", F(at, 0.06 * i), -10, i % 3, "typing") for at in ("w:intake-0.06", "w:forms-0.14", "w:forms+0.1") for i in range(4)],
    ("gen-tap", F("send"), -2, None, "Send"),
    ("gen-success", F("send", 0.06), -4, None, "Sent"),
    ("gen-whoosh-medium", F("flow", 0.3), -6, None, "the form folds into the workflow"),
    ("gen-chime", F("crm"), -6, 0, "CRM updated"),
    ("gen-chime", F("run"), -6, 3, "follow-up sent"),
    ("gen-pop", F("run", 0.12), -7, 5, "Running"),
    ("gen-impact-soft", F("make", 0.44), -9, None, "Make lands on its node"),
    ("gen-pop", F("make", 0.44), -6, 0, ""),
    ("gen-impact-soft", F("n8n", 0.44), -9, None, "n8n lands"),
    ("gen-pop", F("n8n", 0.44), -6, 2, ""),
    ("gen-whoosh-short", F("ai", 0.22), -6, None, "the AI agent drops in"),
    ("gen-impact-soft", F("ai", 0.5), -8, None, ""),
    ("gen-chime", F("manual"), -6, 5, "reply drafted"),
    *[("gen-chime", F("manual", d + 0.46), -10, 7 + 2 * j, "another run through") for j, d in enumerate((0.3, 0.62, 0.94))],
    # need more: custom software
    ("gen-whoosh-medium", F("need", 0.22), -6, None, "the workflow tucks away"),
    ("gen-appear", F("w:need"), -4, None, "Need more?"),
    ("gen-whoosh-medium", F("custom", 0.3), -6, None, "a window rises"),
    ("gen-pop", F("w:build2", 0.2), -8, 0, "the sidebar"),
    ("gen-pop", F("w:custom", 0.15), -8, 2, "the header"),
    ("gen-pop", F("w:software2", 0.15), -8, 4, "the blocks"),
    ("gen-appear", F("dash", 0.1), -5, None, "it becomes a dashboard"),
    ("gen-whoosh-short", F("dash", 0.6), -10, 2, "the line draws"),
    ("gen-whoosh-short", F("web", 0.35), -5, None, "the website slides in"),
    ("gen-whoosh-short", F("app", 0.3), -5, 2, "the app slides in"),
    ("gen-tap", F("tailor", 0.02), -5, None, "Today's jobs is picked up"),
    ("gen-whoosh-short", F("tailor", 0.35), -9, 3, "and dragged to the top"),
    ("gen-tap", F("tailor", 0.7), -4, 3, "dropped"),
    ("gen-tap", F("w:team2-0.1"), -5, 1, "Clients is picked up"),
    ("gen-tap", F("w:team2+0.58"), -4, 4, "dropped under it"),
    ("gen-success", F("works", 0.06), -5, None, "the team's order, saved"),
    # every tool, connected
    ("gen-whoosh-deep", F("tools", 0.3), -6, None, "the screens gather into one system"),
    *[("gen-pop", F("tools", 0.12 + 0.07 * i + 0.4), -10, i, "a tool lands in the ring") for i in range(8)],
    ("gen-appear", F("connect", 0.15), -5, None, "connected"),
    ("gen-swell", F("flows", 0.6), -8, None, "data flows"),
    ("gen-tap", F("copy", 0.2), -3, None, "Copy"),
    ("gen-tap", F("paste", 0.14), -3, 2, "Paste"),
    ("gen-whoosh-whip", F("paste", 0.25), -6, None, "struck out"),
    # the team
    ("gen-whoosh-medium", F("team", 0.32), -6, None, "the team channel rises"),
    ("gen-pop", F("team", 0.8), -8, 0, "a message"),
    ("gen-whoosh-short", F("inside", 0.3), -6, None, "K.B slides into the team"),
    ("gen-impact-soft", F("inside", 0.6), -9, None, ""),
    ("gen-tick", F("around", 0.2), -5, 2, "5 members"),
    *[("gen-pop", F(at, 0.1), -6, p, "a message") for at, p in (("ask", 1), ("always", 3), ("w:know-0.08", 4), ("w:doing2-0.12", 5))],
    # launch, the plan
    ("gen-whoosh-medium", F("launch", 0.3), -6, None, "Go live rises"),
    ("gen-tap", F("live"), -2, None, "click"),
    ("gen-success", F("live", 0.05), -2, None, "Live"),
    ("gen-whoosh-medium", F("stay", 0.35), -6, None, "the monthly plan opens"),
    ("gen-whoosh-short", F("hosting", 0.22), -7, None, "Hosting every week"),
    ("gen-whoosh-short", F("maint", 0.22), -7, 3, "Maintenance every week"),
    ("gen-pop", F("feat", 0.42), -4, 0, "a new feature lands"),
    ("gen-whoosh-short", F("month2", 0.25), -7, None, "the next month"),
    ("gen-pop", F("month2", 0.86), -4, 2, "a new feature"),
    ("gen-whoosh-short", F("month3", 0.25), -7, 1, "the next month"),
    ("gen-pop", F("month3", 0.8), -4, 4, "a new feature"),
    # the loop, the end
    ("gen-riser-1s", F("loop", 1.08), -9, None, "the loop draws (ends as it closes)"),
    ("gen-chime", F("w:diagnose"), -5, 0, "Diagnose"),
    ("gen-chime", F("w:build3"), -5, 4, "Build"),
    ("gen-chime", F("w:run2"), -5, 7, "Run"),
    ("gen-shimmer", F("one", 0.05), -8, None, "one loop: the dots run"),
    ("gen-swell", F("lift", 0.7), -8, None, "the loop lifts"),
    ("gen-whoosh-deep", F("talk", 0.3), -6, None, "the loop gathers into K.B"),
    ("gen-impact-deep", F("w:kb2", 0.22), -6, None, "the logo, with the song's last hit"),
    ("gen-pop", F("cta", 0.22), -6, 2, "the button"),
]
out = {"fps": 30, "frames": 1740, "library": "lib",
       "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "bed.wav", "at": 0, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.8},
       "sfx": [dict(id=i, frame=f, db=db, **({"pitch": p} if p else {}), note=n) for i, f, db, p, n in cues]}
json.dump(out, open(os.path.join(here, "cues.json"), "w"), indent=1)
print(len(cues), "cues")
