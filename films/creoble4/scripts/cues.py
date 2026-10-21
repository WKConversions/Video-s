# Creoble v4's cue sheet: the Danish voice-over, the music bed ("Piano Reflections", its beat entering on "Det
# bedste?" and its last hit on "Så køber du."), and a quiet, sparing set of interface sounds. Apple's audio-haptic
# rules decide them: causality (a sound only on the event that causes it, matching its physicality), harmony (on the
# same frame as the picture event) and utility (only meaningful moments: a commit, a check, a press; never a sound on
# every word). Every cue sits on a voice-over word label.
#   python3 scripts/cues.py            (run from films/creoble4; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = dict(json.load(open(os.path.join(ROOT, "film", "src", "words.json"))))
FPS = 30
L.update({"h1": L["w:det"] - 0.25, "h2": L["w:tilfreds"] - 0.25, "h3": L["w:skal"] - 0.3, "h4": L["w:brug"] - 0.3})
END = L["w:dk"] + 2.6
KEY, TAP, TICK, CLICK = "kenney-click-001", "gen-tap", "gen-tick", "kenney-select-001"
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + 4, **({"pitch": pitch} if pitch else {}), "note": note})
def keys(label, off, n, step, db=-22, note="keys"):
    for i in range(n): cue(label, off + i * step, KEY, db, [0, 2, -1, 3, 1, -2][i % 6], note)

# B1: the hook
cue("w:hjemmeside", 0.0, "gen-whoosh-short", -16, 3, "the word becomes the website frame")
cue("w:minutter", 0.0, "gen-riser-1s", -20, 0, "the build line runs")
cue("w:ai", 0.1, "gen-shimmer", -14, 2, "built by AI: the site resolves")
cue("w:fortl", 0.0, "gen-whoosh-medium", -18, 0, "the frame morphs into the builder")
keys("w:om", 0.0, 10, 0.08, note="Holm Fysioterapi types")
cue("w:creoble", 0.05, CLICK, -10, 0, "Næste")
for i in range(4): cue("w:bygger", i * 0.12, TICK, -19, i * 2, "a step ticks")
cue("w:teknik", 0.0, "gen-whoosh-short", -18, -2, "the code panel leaves")
cue("w:skabeloner", 0.0, "gen-whoosh-short", -18, -4, "the templates fall away")
# B2: see it, change it
cue("w:bedste", 0.0, "gen-appear", -16, 2, "Det bedste?")
cue("w:ser", 0.0, "gen-whoosh-medium", -17, 0, "the frame expands")
cue("w:krone", 0.1, TAP, -13, 2, "0 kr")
keys("w:skriv", 0.0, 12, 0.07, note="the edit types")
cue("w:det2", 0.15, CLICK, -10, 0, "send")
cue("w:retter", 0.1, "gen-shimmer", -15, 4, "the booking button appears")
cue("w:det3", 0.2, TICK, -14, 5, "Opdateret")
# B3: the deal
cue("w:499", 0.0, "gen-appear", -14, 0, "499 kr")
cue("w:gang", 0.0, TICK, -14, 3, "1 betaling")
cue("w:abonnement", 0.1, CLICK, -11, -3, "the toggle switches off")
cue("w:din3", 0.0, TAP, -14, 3, "Din")
cue("w:ikke", 0.0, "gen-whoosh-short", -16, 0, "the card flips")
cue("w:ingenting", 0.0, TAP, -14, -2, "0 kr")
cue("w:risiko", 0.0, "gen-chime", -16, 0, "Nul risiko")
# B4: hosting
cue("w:nettet", 0.0, "gen-whoosh-short", -18, 2, "the address bar comes forward")
keys("w:stter", 0.0, 12, 0.07, note="holmfysio.dk types")
for i in range(4): cue("w:hele2", i * 0.14, TICK, -17, i * 2, "a setup step ticks")
cue("w:dig", 0.2, "gen-success", -15, 0, "Live")
cue("w:83", 0.0, "gen-appear", -15, 2, "83 kr")
cue("w:domne", 0.0, TAP, -16, 3, "domain chip")
cue("w:email", 0.0, TAP, -16, 5, "e-mail chip")
cue("w:fornyer", 0.0, "gen-whoosh-short", -19, 0, "the price line draws flat")
for w, p in [("w:navn", 0), ("w:europa", 2), ("w:binding", 4)]: cue(w, 0.0, TICK, -15, p, "a promise lands")
cue("w:binding", 0.1, CLICK, -14, 2, "the lock opens")
# B5: support, brand, CTA
cue("w:brug", 0.0, "gen-appear", -15, 0, "the chat comes forward")
cue("w:menneske", 0.2, TAP, -13, 3, "the human reply lands")
cue("w:k", 0.0, "gen-whoosh-short", -20, -2, "the queue chip goes")
cue("w:robotsvar", 0.0, "gen-whoosh-short", -20, -4, "the bot chip goes")
cue("w:creoble3", -0.05, "gen-shimmer", -12, 2, "Creoble.")
cue("w:samlet", 0.0, "gen-impact-soft", -17, 0, "website and hosting meet")
cue("w:byg2", 0.0, CLICK, -11, 0, "Byg din side gratis")

music = {"file": "bed.wav", "at": 0, "lufs": -24, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.8}
out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib", "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": music, "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues,", out["frames"], "frames")
