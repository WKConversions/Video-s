# The Bingua film's cue sheet: the supplied voice-over, the music bed and quiet, precise interface sounds on the picture
# events (an Apple-style film: soft keys, clean clicks, a few airy swishes, one shimmer for the brand).
#   python3 scripts/cues.py            (run from films/creoble; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 37.6
L = dict(W)
L.update({"s1": 3.3, "s2": 12.5, "s3": 21.15, "s4": 31.85})
TAP, TAP2, TICK, CLICK, POP = "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-drop-003"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 5, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-20):
    for i in range(n): cue(label, off + i * step, CLICK, db, [0, 2, -1, 3, 1, -2][i % 6], "a key")

# Crisp UI sounds on every picture event (plan/storyboard.md): the feed swipes, taps, pops, saves, flips, ticks.
for i, lab in enumerate(["w:turn", "w:scrolling"]): cue(lab, 0.0, "gen-whoosh-short", -12, i * 2, "a feed flick")
cue("w:learning", 0.05, TAP, -10, 2, "the word lights up")
cue("w:learning", 0.35, "gen-pop", -12, 3, "the word chip")
cue("w:meet", -0.4, "gen-whoosh-short", -13, -2, "the card becomes the logo")
cue("w:meet", 0.05, "gen-pop", -9, 2, "the play triangle")
cue("w:bingua", 0.1, "gen-shimmer", -12, 2, "the wordmark")
for s in ["s1", "s2", "s3", "s4"]: cue(s, 0.0, "gen-whoosh-medium", -11, -1, "feed swipe")
for i, lab in enumerate(["w:learn", "w:learn", "w:learn", "w:languages", "w:languages", "w:languages"]): cue(lab, (i % 3) * 0.1, POP, -14, i, "a greeting bubble")
cue("w:real", 0.0, "gen-whoosh-short", -13, note="the video row")
for i, lab in enumerate(["w:everyday", "w:everyday", "w:conversations", "w:conversations", "w:conversations"]): cue(lab, (i % 2) * 0.15, POP, -14, 3 - i, "a speech bubble")
cue("w:follow", 0.0, "gen-whoosh-short", -13, note="one video comes forward")
cue("w:translations", 0.05, TAP2, -13, note="translations slide in")
cue("w:unfamiliar", 0.1, CLICK, -6, note="tap the word")
cue("w:unfamiliar", 0.2, "gen-pop", -10, 2, "the word pop-up")
cue("w:sentences", 0.0, "gen-whoosh-short", -13, 2, "swipe the line")
for i in range(3): cue("w:sentences", 0.25 + i * 0.12, TICK, -12, i * 2, "a chunk")
cue("w:understand", 0.05, TAP, -10, 4, "it clicks")
cue("w:word", 0.0, TAP2, -12, note="the word marked")
cue("w:remember", 0.0, POP, -13, 2, "the word lifts")
cue("w:save", 0.0, CLICK, -5, note="+ Save")
cue("w:save", 0.08, "gen-pop", -10, 3, "Saved")
cue("w:instantly", 0.0, "gen-whoosh-short", -12, 2, "into the cards")
cue("w:instantly", 0.35, TICK, -9, 5, "badge 15")
for i in range(4): cue("w:discoveries", -0.3 + i * 0.12, POP, -14, i, "a saved word gathers")
cue("w:flashcards", 0.0, "gen-whoosh-short", -12, note="the cards stack")
cue("w:flashcards", 0.35, TAP2, -11, 2, "a card flips")
for i in range(4): cue("w:quizzes", i * 0.1, POP, -13, i * 2, "a quiz tile")
cue("w:helping", 0.0, TICK, -13, note="the curve")
for i in range(3): cue("w:vocabulary", -0.2 + i * 0.25, TICK, -12, i * 2, "a review bumps the curve")
cue("w:stick", 0.0, TAP, -8, 4, "it sticks")
cue("w:no", 0.0, "gen-whoosh-short", -14, -3, "the endless list")
cue("w:lists", 0.0, TICK, -8, -2, "struck through")
cue("w:no2", 0.0, "gen-whoosh-short", -14, -2, "the worksheets")
cue("w:exercises", 0.0, TICK, -8, -2, "crossed out")
cue("w:just", 0.0, "gen-whoosh-medium", -12, note="the video row")
cue("w:enjoy", 0.0, "gen-pop", -9, 3, "a heart")
for i in range(6): cue("w:growing", i * 0.12, CLICK, -16, i, "the counter climbs")
for i in range(4): cue("w:confidence", -0.2 + i * 0.3, TICK, -12, i * 2, "a video adds XP")
cue("w:video", 0.1, TAP, -9, 5, "goal reached")
for i, off in enumerate([0.0, 0.25, 0.5]): cue("w:at", off, CLICK, -10, i * 2, "speed toggles")
cue("w:bingua3", -0.1, "gen-pop", -8, 2, "the logo")
cue("w:bingua3", 0.2, "gen-shimmer", -10, 3, "the wordmark")
cue("w:scrolling2", 0.2, "gen-swell", -11, note="the end card")
for i in range(6): cue("w:scrolling2", 0.6 + i * 0.07, POP, -17, i, "a language chip")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -24, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.6, "lifts": [[34.6, 37.6, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
