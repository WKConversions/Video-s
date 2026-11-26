# Cue sheets for the two K.B intern films: effects lead (Karl's own library, films/alumni/sound/lib), placed on the
# spoken words the scenes land their events on (film/src/<id>/timing.ts), the placed VO on top, a quiet music bed.
#   python3 make_cues.py   ->  onb-cues.json, off-cues.json   (then sound_mix.py)
import json, re

def words(fid):
    W = {}
    for line in open(f"../film/src/{fid}/timing.ts"):
        m = re.match(r'\s*(\{"w".*\}),\s*$', line)
        if m:
            d = json.loads(m.group(1)); W.setdefault(d["w"], []).append(d["t"])
    return lambda word, n=1, d=0.0: W[word][n - 1] + d

LOUD = ("gen-tick", "kenney-tick-004", "kenney-select-001", "kenney-select-002")
def sheet(fid, dur, events, bed, out):
    fx = [{"frame": round(t * 60), "id": i, "db": min(-3, db + (5 if i in LOUD else 3)), "pitch": p, "note": n} for t, i, db, p, n in events]
    json.dump({"fps": 60, "frames": round(dur * 60), "library": "../../alumni/sound/lib",
               "vo": {"file": f"../vo/{'onboarding' if fid == 'onb' else 'offboarding'}-placed.wav", "at": 0, "compress": True},
               "music": {"file": bed, "at": 0, "lufs": -31, "duck_db": 5, "fade_in": 0.1, "fade_out": 1.5},
               "sfx": sorted(fx, key=lambda c: c["frame"])}, open(out, "w"), indent=1)
    print(out, len(fx), "cues")

w = words("onb")
E = [
    (0.25, "gen-swell", -12, 0, "the map reveals"), (0.85, "kenney-drop-003", -6, 0, "the pin lands"), (0.9, "gen-tick", -12, 2, "ring"),
    (w("welcome"), "gen-appear", -7, 2, "the logo"), (w("kb"), "gen-whoosh-short", -11, 0, "Welcome to K.B"),
    (w("software"), "gen-pop", -8, 0, "Software"), (w("ai"), "gen-pop", -8, 2, "AI"), (w("automation"), "gen-pop", -8, 4, "Automation"),
    (w("small"), "gen-shimmer", -10, 0, "nodes across Europe"), *[(w("businesses", 1, 0.25 * i), "gen-tick", -14, i, "a node") for i in range(4)],
    (w("across"), "gen-whoosh-short", -12, 2, "arcs"), (w("find"), "gen-whoosh-medium", -10, -2, "arcs flow back"), (w("us"), "gen-chime", -9, 0, "into the pin"),
    (w("security"), "gen-whoosh-short", -9, 0, "the path draws"), (w("confidentiality"), "kenney-select-001", -9, 0, "tick 1"),
    (w("laptop"), "kenney-select-001", -9, 2, "tick 2"), (w("guidelines"), "kenney-select-001", -9, 4, "tick 3"),
    (w("guidelines", 1, 0.75), "kenney-click-001", -5, 0, "the padlock opens"), (w("guidelines", 1, 0.8), "gen-success", -9, 0, "open"),
    (w("then"), "gen-whoosh-medium", -10, 0, "into the tools"),
    (w("jira"), "gen-whoosh-short", -10, 0, "chip"), (w("confluence"), "gen-whoosh-short", -10, 2, "chip"), (w("dolibar"), "gen-whoosh-short", -10, 4, "chip"),
    (w("one"), "gen-whoosh-short", -10, 6, "chip"), (w("always"), "gen-appear", -9, 0, "Always your K.B account"),
    *[(w("two", 1, 0.38 * i), "gen-pop", -9, 2 * i, "2FA badge") for i in range(4)],
    (w("your", 3) if False else w("marketing", 1, -0.9), "gen-whoosh-medium", -9, 0, "the board"),
    (w("backlog"), "gen-tap", -9, 0, "Backlog"), (w("progress"), "gen-whoosh-short", -9, 0, "card to In Progress"),
    (w("done"), "gen-whoosh-short", -9, 2, "card to Done"), (w("done", 1, 0.3), "kenney-drop-003", -8, 0, "lands"),
    (w("live"), "gen-pop", -7, 0, "Done = live"), (w("plan"), "gen-whoosh-medium", -9, 0, "board to calendar"), (w("mondays"), "gen-chime", -8, 2, "Monday"),
    (w("two", 2), "gen-whoosh-short", -10, 0, "two rules"), (w("never"), "gen-appear", -8, 0, "rule 1"), (w("report"), "gen-appear", -8, 2, "rule 2"),
    (w("first"), "gen-whoosh-medium", -9, 0, "rules make room"), (w("linkedin"), "gen-pop", -8, 0, "the post"), (w("introduction"), "gen-tick", -12, 3, "title"),
    (w("welcome", 2, -0.2), "gen-whoosh-deep", -9, 0, "to the end card"), (w("welcome", 2), "gen-appear", -6, 0, "the logo lands"),
    (w("team"), "gen-success", -7, 0, "Welcome to the team!"), (58.0, "gen-shimmer", -14, 2, "glint"),
]
sheet("onb", 60.0, E, "onb-bed.wav", "onb-cues.json")

w = words("off")
E = [
    (0.9, "gen-appear", -6, 0, "the logo lands"), (w("thank"), "gen-pop", -7, 2, "Thank you!"),
    (w("here's"), "gen-whoosh-short", -10, 0, "the timeline draws"), *[(w("wrap", 1, 0.3 * i), "gen-tick", -12, 2 * i, "a stop") for i in range(4)],
    (w("two"), "gen-whoosh-medium", -9, 0, "timeline to the header; 2 weeks before"), (w("send"), "gen-whoosh-short", -10, 2, "the report"),
    (w("supervisor"), "gen-pop", -9, 0, "Supervisor"), (w("written"), "gen-stamp", -6, 0, "K.B approval needed"),
    (w("approval", 1, 0.5), "gen-whoosh-short", -9, -2, "slides to the supervisor"),
    (w("last"), "gen-tap", -9, 0, "Last week"), (w("hand"), "gen-whoosh-short", -10, 0, "the ticket"), (w("comment"), "gen-pop", -8, 2, "comment bubble"),
    (w("next"), "gen-tick", -12, 4, "Next step"), (w("assign"), "gen-whoosh-short", -9, 0, "assignee changes"), (w("successor"), "kenney-select-001", -9, 2, "Successor"),
    (w("last", 2), "gen-tap", -9, 2, "Last day"), (w("return"), "kenney-select-001", -9, 0, "tick"), (w("delete"), "kenney-select-001", -9, 2, "tick"),
    (w("writing"), "kenney-select-001", -9, 4, "tick"), (w("passwords"), "kenney-select-001", -9, 6, "tick"),
    *[(w("close", 1, 0.22 * i), "gen-whoosh-whip", -10, i, "chip flips") for i in range(4)], (w("access"), "kenney-click-001", -6, 0, "Access revoked"),
    (w("confidentiality"), "gen-tap", -9, 4, "Afterwards"), (w("confidentiality", 1, 0.2), "kenney-click-001", -6, -3, "the padlock"),
    (w("linkedin"), "gen-pop", -8, 0, "the profile"), (w("without"), "gen-tick", -12, 2, "row"),
    (w("good", 1, -0.2), "gen-whoosh-deep", -9, 0, "to the end card"), (w("good"), "gen-appear", -6, 0, "the logo"), (w("luck"), "gen-success", -7, 0, "Good luck!"),
    (46.5, "gen-shimmer", -14, 2, "glint"),
]
sheet("off", 48.0, E, "off-bed.wav", "off-cues.json")
