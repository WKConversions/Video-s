# The Talent Hub film's cue sheet: the supplied voice-over, the music bed and quiet, precise interface sounds on the picture
# events (an Apple-style film: soft keys, clean clicks, a few airy swishes, one shimmer for the brand).
#   python3 scripts/cues.py [nl]       (run from films/talenthub; writes sound/cues.json, or sound/cues_nl.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
#   python3 scripts/sound_mix.py sound/cues_nl.json film/public/audio/mix_nl.wav --sheet sound/mix_nl.png
# The Dutch build uses film/src/words_nl.json: the same labels on the Dutch voice-over's words, so every cue follows.
import json, os, sys

NL = len(sys.argv) > 1 and sys.argv[1] == "nl"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words_nl.json" if NL else "words.json")))
FPS = 30
L = dict(W)
# the hand-offs, as in src/clock.ts
L.update({"s1": L["w:the"] - 0.31, "s2": L["w:filter"] - 0.25, "s3": L["w:for2"] - 0.27, "s4": L["w:talent4"] - 0.28})
END = L["w:here"] + 3.0
# beats the scenes clamp in the Dutch timing (same formulas as the scenes), so their sounds follow the picture
L["build"] = min(L["w:talent2"], L["w:meet"] + 0.6)                          # A: the mark builds (A.tsx BUILD)
L["snap"] = min(L["w:one"], L["s2"] - 1.8)                                    # B: the cards snap into the dashboard
L["press"] = max(L["w:opportunities2"] - 8 / 30, L["w:gateway"] + 0.14 + 21 / 30)  # D: Apply is pressed
L["scan"] = min(L["w:smarter"], L["s4"] - 1.9)                                # D: the scan for matches
TAP, TAP2, TICK, CLICK, POP = "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-drop-003"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 5, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-20):
    for i in range(n): cue(label, off + i * step, CLICK, db, [0, 2, -1, 3, 1, -2][i % 6], "a key")

# Clear UI sounds on every picture event (plan/storyboard.md): keys, the swirl, the logo, links, cards, filters,
# the unlock, the message, the red irises.
Q = "gekwalificeerd talent" if NL else "qualified talent"                    # one key per typed letter (typed() at 17 cps)
for i, ch in enumerate(Q):
    if ch != " ": cue("w:qualified", -0.14 + (i + 1) / 17, CLICK, -20, [0, 2, -1, 3, 1][i % 5], "search keys")
cue("w:qualified", 0.0, "gen-whoosh-short", -14, -2, "the talent cloud swirls")
cue("w:meet", -0.05, "gen-whoosh-medium", -11, 2, "talent converges, red field")
cue("build", 0.05, "gen-pop", -8, 1, "the t rises")
cue("build", 0.25, "gen-pop", -8, 4, "the h drops in")
cue("w:hub", 0.15, "gen-shimmer", -11, 3, "the mark completes")
cue("s1", 0.0, "gen-whoosh-short", -13, -1, "the mark becomes the hub")
for i in range(4): cue("w:graduates", i * 0.1, POP, -14, i, "a graduate")
for i in range(5): cue("w:connecting", 0.1 + i * 0.32, TICK, -13, i, "a link draws")
for i in range(5): cue("w:international", i * 0.12, TAP2, -15, i * 2, "a pin lights")
for i in range(3): cue("w:opportunities", -0.2 + i * 0.15, POP, -13, 3 + i, "a job card")
cue("w:browse", 0.0, "gen-whoosh-medium", -12, note="the hub opens into the pool")
for i in range(8): cue("w:database", i * 0.09, POP, -16, i % 5, "a card flows in")
for i in range(4): cue("w:qualified2", i * 0.08, TICK, -15, i, "qualified checks")
cue("snap", -0.1, "gen-whoosh-short", -12, note="the cards snap into the dashboard")
cue("w:dashboard", 0.0, TAP, -11, 2, "the dashboard lands")
cue("w:filter", 0.0, CLICK, -9, note="filters")
for lab in ["w:skills", "w:experience", "w:qualifications"]:
    cue(lab, 0.0, CLICK, -8, 2, "a filter on")
    cue(lab, 0.12, "gen-whoosh-short", -15, -2, "non-matches drop out")
cue("w:match", 0.0, "gen-pop", -8, 4, "the match")
cue("w:discover", 0.0, "gen-whoosh-medium", -12, note="the profile expands")
cue("w:unlock", 0.0, CLICK, -6, note="Unlock profile")
cue("w:unlock", 0.15, TICK, -9, 3, "a credit flies")
cue("w:unlock", 0.43, "gen-pop", -8, 5, "the lock springs open")
cue("w:details", 0.0, "gen-shimmer", -12, 3, "the details are revealed")
cue("w:connect", 0.0, TICK, -11, 2, "the connection line")
cue("w:directly", 0.1, "gen-whoosh-short", -12, 3, "the message travels")
cue("w:hires", 0.2, "gen-pop", -10, 4, "the reply")
cue("s3", -0.1, "gen-whoosh-medium", -11, note="red iris")
cue("w:graduates2", 0.0, TAP, -11, note="for graduates")
cue("w:gateway", 0.0, "gen-whoosh-medium", -11, 2, "the gateway opens")
for i in range(5): cue("w:exciting", -0.1 + i * 0.12, POP, -14, i, "an opportunity flies in")
cue("press", 0.0, CLICK, -8, note="Apply")
cue("press", 4 / 30, TAP2, -10, 4, "Applied")
cue("w:employers", 0.0, TAP, -11, note="for employers")
for i in range(2): cue("w:recruiters", 0.05 + i * 0.43, POP, -12, i * 2, "a vacancy posted")
cue("scan", 0.0, "gen-whoosh-short", -12, note="the scan sweep")
for i in range(4): cue("scan", 0.63 + i * 0.2, TICK, -12, i * 2, "a match ranked")
cue("s4", 0.0, "gen-whoosh-medium", -11, note="red iris")
cue("w:talent4", 0.0, "gen-pop", -7, 2, "the logo builds")
cue("w:hub2", 0.1, "gen-shimmer", -9, 3, "the mark completes")
cue("w:your", 0.0, "gen-whoosh-short", -12, note="the wide logo")
cue("w:connection", 0.1, TICK, -10, 4, "the connection line")
cue("w:here", 0.3, "gen-swell", -11, note="end card")

# v2: JongLeren as the verified partner (plan/v2-jongleren-nl.md)
cue("w:graduates", -0.1, TAP, -13, 1, "the JongLeren partner card")
cue("w:qualifications", 0.35, CLICK, -9, 4, "the JongLeren filter on")
cue("w:qualifications", 0.5, "gen-whoosh-short", -16, 3, "the verified scan sweeps the grid")
cue("w:profiles", 0.37, "gen-stamp", -11, 0, "the VERIFIED PARTNER seal stamps")
cue("w:profiles", 0.37, CLICK, -12, -5, "the stamp's slap (small speakers)")
cue("w:qualified2", 0.35, "gen-shimmer", -16, 2, "verified by JongLeren legend")
cue("w:its", 0.0, TICK, -12, 3, "the path reaches Talent Hub")
cue("w:abroad", 0.2, "gen-success", -15, 0, "career abroad checked")
cue("w:here", 0.18, TICK, -13, 2, "the thread drops")
cue("w:here", 0.57, "gen-tap", -11, 3, "the verified check lands")
cue("w:here", 1.1, "gen-appear", -12, 0, "the partner lockup")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo_nl/vo.mp3" if NL else "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed_nl.wav" if NL else "bed.wav", "at": 0, "lufs": -24, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.6, "lifts": [[L["w:here"], END, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues_nl.json" if NL else "cues.json"), "w"), indent=1)
print(len(cues), "cues")
