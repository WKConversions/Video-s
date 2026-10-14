# The Recruiting Rewards film's cue sheet: the supplied voice-over, the music bed and an effect on every picture event
# that carries meaning, placed on the same labels as the picture (film/src/clock.ts, film/src/Story.tsx).
#   python3 scripts/cues.py            (run from films/recruiting; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
# Effects: the studio's generated sounds (gen-*) and Kenney's CC0 interface sounds (kenney-*), shared with the Alumni
# film (../alumni/sound/lib). Product brief: real UI sounds (keys, clicks, taps, soft pops), swishes on the bigger moves.
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 50.5
L = dict(W)
L.update({"hook": 0.0, "meet": W["w:meet"] - 0.1, "create": W["w:create"] - 0.45, "live": W["w:your2"] - 0.1, "arrive": W["w:as"] - 0.1,
          "see": W["w:see"] - 0.1, "compare": W["w:compare"] - 0.15, "short": W["w:shortlist"] - 0.1, "msg": W["w:message"] - 0.15,
          "track": W["w:track"] - 0.1, "move": W["w:move"] - 0.1, "hire": W["w:and3"] - 0.1, "rec": W["w:for"] - 0.15, "inbox": W["w:no"] - 0.25,
          "upfront": W["w:no2"] - 0.15, "just": W["w:just"] - 0.15, "end_": W["w:recruiting3"] - 0.2})
POP, TAP, TAP2, TICK, CLICK, OPEN = "kenney-drop-003", "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-maximize-009"
LIFT = 3

cues = []
def cue(label, off, sid, db=0, pitch=0, note="", auto=True):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + (LIFT if auto else 0), **({"pitch": pitch} if pitch else {}),
                 **({} if auto else {"auto_level": False}), "note": note})
_w = [0]
def swish(label, off, db, note):
    i = _w[0]; _w[0] += 1
    cue(label, off, "gen-whoosh-short" if i % 2 == 0 else "gen-whoosh-whip", db - (0 if i % 2 == 0 else 2), [-2, 0, 2][i % 3], note)
def keys(label, off, n, step, db=-17, note="a key"):
    for i in range(n): cue(label, off + i * step, CLICK, db, [0, 2, -1, 3, 1, -2][i % 6], note)

# 1 the mess, simplified into one platform
for i in range(4): cue("hook", 0.05 + i * 0.1, POP, -16, [-4, -1, 1, 3][i], "a message lands")
cue("w:simplified", 0.15, "gen-whoosh-medium", -6, note="the mess gathers")
cue("w:one", -0.25, "gen-appear", -6, note="the platform")
for i in range(5): cue("w:more", 0.05 + i * 0.07, POP, -11, [-5, -3, -1, 1, 3][i], f"recruiter {i + 1}")
for i in range(3): cue("w:better", i * 0.15, TICK, -11, [0, 3, 5][i], "a match score")
cue("w:better", 0.5, TAP2, -8, note="the best match")
# 2 Meet Recruiting Rewards
swish("meet", 0.0, -7, "the window folds into the mark")
cue("meet", 0.35, "gen-impact-soft", -6, note="the logo")
cue("w:recruiting", 0.0, "gen-shimmer", -11, note="the name")
# 3 create a job, requirements, reward, publish
cue("create", 0.0, "gen-whoosh-medium", -7, note="the window opens")
keys("w:create", 0.05, 15, 0.11)
for i, lab in enumerate(["w:add", "w:your", "w:requirements", "w:requirements", "w:requirements", "w:requirements"]):
    cue(lab, [-0.0, 0, -0.05, 0.15, 0.35, 0.55][i], TAP2, -9, [0, 2, 3, 5, 7, 9][i], "a criterion detected")
swish("w:set", -0.2, -9, "the reward page")
cue("w:reward", 0.0, CLICK, -4, note="click")
cue("w:reward", 0.02, POP, -8, note="95 000 selected")
cue("w:publish", 0.0, CLICK, -3, note="click")
cue("w:publish", 0.1, "gen-success", -8, note="published")
# 4 live, recruiters at work, candidates arrive
cue("live", 0.05, "gen-whoosh-medium", -6, note="the vacancy lifts out")
cue("w:live", 0.0, "gen-chime", -9, note="Live")
for i in range(5): cue("w:recruiters2", -0.1 + i * 0.07, POP, -11, [-4, -2, 0, 2, 4][i], f"recruiter {i + 1}")
for i in range(5): cue("w:work", i * 0.06, TICK, -13, [0, 2, 4, 6, 8][i], "working on it")
swish("arrive", 0.05, -8, "candidates fly in")
for i in range(3): cue("arrive", 0.8 + i * 0.12, POP, -9, [-3, 0, 2][i], f"candidate {i + 1} lands")
# 5 the dashboard
swish("w:profiles", -0.15, -10, "the profile panel")
cue("w:match", 0.0, "gen-riser-1s", -15, note="the scores fill")
cue("w:applications", -0.05, TAP, -10, note="the application")
swish("w:one2", -0.05, -11, "the panel closes onto the dashboard")
for i in range(4): cue("w:one2", 0.1 + i * 0.1, POP, -14, [-2, 0, 2, 4][i], "cards fill the stages")
# 6 compare, shortlist, message, interview, move
cue("compare", 0.05, "gen-whoosh-medium", -7, note="three candidates side by side")
for i in range(3): cue("compare", 0.1 + i * 0.08, OPEN, -12, [-2, 0, 2][i], f"card {i + 1}")
cue("w:instantly", 0.0, "gen-chime", -9, note="best match")
cue("w:shortlist", 0.0, CLICK, -4, note="click")
cue("w:shortlist", 0.03, "gen-pop", -7, note="the star")
swish("short", 0.4, -10, "into the shortlist")
swish("msg", 0.0, -10, "the chat")
keys("w:message", 0.05, 8, 0.1, -18)
cue("w:recruiters3", 0.35, TAP2, -8, note="the recruiter replies")
cue("track", 0.05, OPEN, -8, note="the interview step")
for i in range(5): cue("w:track", i * 0.06, TICK, -12, [0, 2, 4, 5, 7][i], "a star")
cue("w:interviews", 0.65, CLICK, -8, note="send")
swish("w:interviews", 0.75, -14, "into Interview")
swish("w:through", 0.0, -10, "into Tests")
swish("w:stage", 0.0, -10, "into Reference check")
cue("w:without", 0.0, "gen-swell", -12, note="the whole overview")
# 7 hired, then you pay
swish("w:hire", 0.0, -8, "into Hired")
cue("w:hire", 0.3, "gen-appear", -7, note="the hired dialog")
cue("w:hire", 0.45, "gen-success", -6, note="hired")
cue("w:pay", -0.1, "gen-impact-soft", -8, note="pay on results")
# 8 the recruiter's side
cue("rec", 0.0, "gen-whoosh-medium", -7, note="the side switches")
cue("w:recruiters4", 0.0, CLICK, -4, note="click: For recruiters")
for i in range(4): cue("w:recruiters4", 0.3 + i * 0.08, POP, -13, [-3, -1, 1, 3][i], f"an assignment {i + 1}")
for i in range(3): cue("w:explore", i * 0.17, TICK, -15, [0, 2, 4][i], "hover")
cue("w:relevant", 0.0, TAP, -8, note="Sales")
swish("w:submit", -0.45, -10, "the submit panel")
cue("w:talent", -0.2, CLICK, -4, note="click: Submit")
cue("w:talent", -0.1, "gen-success", -9, note="submitted")
cue("w:qualified", 0.0, TAP2, -10, note="interviewed, screened")
swish("w:and4", 0.0, -10, "earnings")
cue("w:rewards2", 0.0, "gen-riser-1s", -12, note="the reward counts up")
cue("w:placements", 0.0, "gen-chime", -8, note="paid on hire")
# 9 the closing lines
for i in range(6): cue("inbox", -0.1 + i * 0.05, POP, -18, [-5, -3, -1, 1, 3, 5][i], "the mess again")
cue("w:inboxes", -0.1, "gen-whoosh-deep", -6, note="pulled into one place")
cue("w:no2", 0.1, OPEN, -8, note="the price card")
cue("w:upfront", -0.05, "gen-pop", -7, note="0 SEK")
for i in range(3): cue("w:costs", [0, 0.12, 0.3][i], TAP2 if i < 2 else POP, -10 if i < 2 else -7, [0, 2, 4][i], ["free to post", "pay when the candidate starts", "30–45% lower cost than an agency"][i])
cue("just", 0.05, "gen-whoosh-medium", -8, note="the card leaves")
cue("w:redesigned", 0.0, "gen-shimmer", -8, note="redesigned")
# 10 the end card
cue("end_", 0.0, "gen-swell", -3, note="the window folds into the logo", auto=False)
cue("w:recruiting3", 0.05, "gen-shimmer", -4, note="Recruiting Rewards", auto=False)
cue("w:rewards3", 0.85, "gen-appear", -7, note="Start hiring")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -23, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.6, "lifts": [[48.1, 50.5, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
