# The Talent Hub film's cue sheet: the supplied voice-over, the music bed and quiet, precise interface sounds on the picture
# events (an Apple-style film: soft keys, clean clicks, a few airy swishes, one shimmer for the brand).
#   python3 scripts/cues.py            (run from films/creoble; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 36.0
L = dict(W)
L.update({"s1": 3.1, "s2": 12.2, "s3": 22.7, "s4": 30.5})
TAP, TAP2, TICK, CLICK, POP = "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-drop-003"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 5, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-20):
    for i in range(n): cue(label, off + i * step, CLICK, db, [0, 2, -1, 3, 1, -2][i % 6], "a key")

# Clear UI sounds on every picture event (plan/storyboard.md): keys, the swirl, the logo, links, cards, filters,
# the unlock, the message, the red irises.
for i in range(10): cue("w:looking", 0.05 + i * 0.07, CLICK, -20, [0, 2, -1, 3, 1][i % 5], "search keys")
cue("w:qualified", 0.0, "gen-whoosh-short", -14, -2, "the talent cloud swirls")
cue("w:meet", -0.05, "gen-whoosh-medium", -11, 2, "talent converges, red field")
cue("w:talent2", 0.05, "gen-pop", -8, 1, "the t rises")
cue("w:hub", 0.0, "gen-pop", -8, 4, "the h drops in")
cue("w:hub", 0.15, "gen-shimmer", -11, 3, "the mark completes")
cue("s1", 0.0, "gen-whoosh-short", -13, -1, "the mark becomes the hub")
for i in range(4): cue("w:graduates", i * 0.1, POP, -14, i, "a graduate")
for i in range(5): cue("w:connecting", 0.1 + i * 0.32, TICK, -13, i, "a link draws")
for i in range(5): cue("w:international", i * 0.12, TAP2, -15, i * 2, "a pin lights")
for i in range(3): cue("w:opportunities", -0.2 + i * 0.15, POP, -13, 3 + i, "a job card")
cue("w:browse", 0.0, "gen-whoosh-medium", -12, note="the hub opens into the pool")
for i in range(8): cue("w:database", i * 0.09, POP, -16, i % 5, "a card flows in")
for i in range(4): cue("w:qualified2", i * 0.08, TICK, -15, i, "qualified checks")
cue("w:one", -0.1, "gen-whoosh-short", -12, note="the cards snap into the dashboard")
cue("w:dashboard", 0.0, TAP, -11, 2, "the dashboard lands")
cue("w:filter", 0.0, CLICK, -9, note="filters")
for lab in ["w:skills", "w:experience", "w:qualifications"]:
    cue(lab, 0.0, CLICK, -8, 2, "a filter on")
    cue(lab, 0.12, "gen-whoosh-short", -15, -2, "non-matches drop out")
cue("w:match", 0.0, "gen-pop", -8, 4, "the match")
cue("w:discover", 0.0, "gen-whoosh-medium", -12, note="the profile expands")
cue("w:unlock", 0.0, CLICK, -6, note="Unlock profile")
cue("w:unlock", 0.15, TICK, -9, 3, "a credit flies")
cue("w:contact", 0.0, "gen-pop", -8, 5, "the lock springs open")
cue("w:details", 0.0, "gen-shimmer", -12, 3, "the details are revealed")
cue("w:connect", 0.0, TICK, -11, 2, "the connection line")
cue("w:directly", 0.1, "gen-whoosh-short", -12, 3, "the message travels")
cue("w:potential", 0.2, "gen-pop", -10, 4, "the reply")
cue("s3", -0.1, "gen-whoosh-medium", -11, note="red iris")
cue("w:graduates2", 0.0, TAP, -11, note="for graduates")
cue("w:gateway", 0.0, "gen-whoosh-medium", -11, 2, "the gateway opens")
for i in range(5): cue("w:exciting", -0.1 + i * 0.12, POP, -14, i, "an opportunity flies in")
cue("w:abroad", 0.0, CLICK, -8, note="Apply")
cue("w:abroad", 0.15, TAP2, -10, 4, "Applied")
cue("w:employers", 0.0, TAP, -11, note="for employers")
for i in range(2): cue("w:recruiters", i * 0.2, POP, -12, i * 2, "a client type")
cue("w:smarter", 0.0, "gen-whoosh-short", -12, note="the scan sweep")
for i in range(4): cue("w:discover2", i * 0.12, TICK, -12, i * 2, "a match ranked")
cue("s4", 0.0, "gen-whoosh-medium", -11, note="red iris")
cue("w:talent4", 0.0, "gen-pop", -7, 2, "the logo builds")
cue("w:hub2", 0.1, "gen-shimmer", -9, 3, "the mark completes")
cue("w:your", 0.0, "gen-whoosh-short", -12, note="the wide logo")
cue("w:connection", 0.1, TICK, -10, 4, "the connection line")
cue("w:here", 0.3, "gen-swell", -11, note="end card")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -24, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.6, "lifts": [[33.0, 36.0, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
