# The JongLeren film's cue sheet: the supplied voice-over, the music bed and an effect on every picture
# event that carries meaning. Every cue is placed on the same labels as the picture (film/src/clock.ts,
# film/src/Story.tsx): a word of the voice-over plus the offset of the move it sounds.
#   python3 scripts/cues.py            (run from films/jongleren; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
# Effects: the studio's generated sounds (gen-*) and Kenney's CC0 interface sounds (kenney-*). Energetic
# brief: denser and crisper than a calm film, still always under the voice.
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 40.0
L = dict(W)
L.update({"turn": W["w:met"] - 0.1, "intake": W["w:eerst"] - 0.15, "app": W["w:vervolgens"] - 0.15, "search": W["w:wij"] - 0.15,
          "hired": W["w:ben"] - 0.1, "house": W["w:dan"] - 0.1, "spain": W["w:en3"] - 0.15, "journey": W["w:van2"] - 0.15,
          "close": W["w:jongleren2"] - 0.15})
POP, TAP, TAP2, TICK = "kenney-drop-003", "kenney-select-002", "kenney-select-001", "kenney-tick-004"

cues = []
def cue(label, off, sid, db=0, pitch=0, note="", auto=True):
    cues.append({"frame": round((L[label] + off) * FPS), "id": sid, "db": db, **({"pitch": pitch} if pitch else {}),
                 **({} if auto else {"auto_level": False}), "note": note})
# the short whoosh is the film's most used sound: alternate it with the whip and shift its pitch, so no two in a row match
_w = [0]
def swish(label, off, db, note):
    i = _w[0]; _w[0] += 1
    cue(label, off, "gen-whoosh-short" if i % 2 == 0 else "gen-whoosh-whip", db - (0 if i % 2 == 0 else 2), [-2, 0, 2][i % 3], note)

# 1 hook: the suitcase slides in empty, the route starts, then on "koffer pakt" the things land in it and the lid shuts
swish("w:jouw", 0.25, -3, "the suitcase slides in, open and empty")
cue("w:begint", 0.08, POP, -6, -5, "the start ball drops onto the route")
cue("w:al", 0.1, "gen-whoosh-short", -9, 3, "the red route runs ahead")
for i, (lab, off) in enumerate([("w:je2", 0.02), ("w:je2", 0.1), ("w:koffer", 0.02), ("w:koffer", 0.1), ("w:koffer", 0.18), ("w:pakt", -0.02)]):
    cue(lab, off + 0.1, POP, -10, [0, 2, 4, 7, 9, 12][i], f"packed item {i + 1} lands")
cue("w:pakt", 0.5, "gen-stamp", -10, note="the lid shuts")
# 2 turn: the red field, the logo, the heap, the catch, the juggle
cue("w:jongleren", -0.1, "gen-whoosh-medium", -4, note="the red field grows out of the start ball")
cue("w:jongleren", 0.35, "gen-appear", -3, note="the logo rises", auto=False)
swish("w:wordt", 0.25, -4, "the to-dos tumble in")
for i in range(4):
    cue("w:stuk", -0.1 + i * 0.05 + 0.42, TAP, -6, [0, 3, 5, 8][i], "a to-do becomes a ball in the bull's juggle")
cue("intake", 0.1, "gen-whoosh-medium", -8, note="the red field closes into the first dot")
for i in range(4):
    cue("intake", i * 0.04 + 0.6, POP, -8, [0, 2, 4, 7][i], f"ball {i + 1} lands on the route")
# 3 intake
cue("w:eerst", 0.07, "kenney-maximize-009", -2, note="the intake card opens out of the first dot")
cue("w:plannen", 0.26, TAP, -5, note="the day is picked: red fills the chip")
cue("w:vertelt", -0.2, "gen-chime", -7, note="the call connects (the talk bars start)")
swish("w:vertelt", 0.15, -8, "your tile becomes the big one")
for i, lab in enumerate(["w:wat", "w:je4", "w:studeert"]):
    cue(lab, 0.15, TICK, -2, i * 2, "the study field rolls")
for i in range(3):
    cue("w:zoekt", -0.2 + i * 0.12 + 0.42, POP, -7, [0, 3, 7][i], "a wish lands")
swish("w:welke", 0.1, -4, "the school's checklist slides in")
for i, (lab, off) in enumerate([("w:eisen", 0.2), ("w:jouw2", 0.2), ("w:school", 0.32)]):
    cue(lab, off, TAP2, -2, i * 2, "a requirement ticked")
cue("w:stelt", 0.55, POP, -8, 5, "step 1 ticked on the route")
# 4 app
cue("w:vervolgens", 0.05, "gen-whoosh-medium", -4, note="the card folds into the phone")
cue("w:vervolgens", 0.2, "gen-whoosh-whip", -7, 3, "the app icon flies in")
cue("w:vervolgens", 0.4, POP, -6, 7, "the icon lands in the store")
cue("w:download", 0.12, TAP, 0, note="Download tapped")
cue("w:download", 0.2, "gen-riser-1s", -10, note="the download ring fills (ends on 100%)")
cue("w:app", 0.3, "gen-appear", 0, note="the app opens out of its icon")
swish("w:waarin", 0.15, -8, "the step sheet slides up")
cue("w:stap", 0.2, TAP2, -4, 2, "step 2 ticked in the app's list")
# 5 search, match, invitation, the company
swish("search", 0.35, -5, "the phone moves aside")
for i in range(8):
    cue("w:zoeken", i * 0.1 + 0.12, TICK, -8, i % 4, "a vacancy card flicks past")
cue("w:stageplek", 0.4, "gen-success", -10, note="the match rings")
swish("w:regelen", -0.05, -5, "the match card turns into the invitation")
cue("w:regelen", 0.5, POP, -4, 4, "the time lands")
cue("w:kennismakingsgesprek", 0.45, "gen-chime", -7, note="you and the company are linked")
cue("w:met2", 0.15, "gen-whoosh-medium", -3, note="the invitation opens into the company")
# hired
cue("w:aangenomen", 0.21, "gen-stamp", -4, note="the Aangenomen! stamp lands")
cue("w:aangenomen", 0.59, "gen-success", -11, note="the celebration, after the word")
cue("w:aangenomen", 0.3, "gen-shimmer", -11, note="confetti")
# 6 housing
swish("house", 0.2, -5, "the company leaves")
cue("house", 0.45, "kenney-maximize-009", -3, note="the housing question rises")
cue("w:indien", 0.2, TAP, 0, note="the switch flips on")
cue("w:vinden", 0.0, "gen-swell", -3, note="the house photo clears")
cue("w:huisvesting", 0.35, POP, -10, -3, "the pin lands on the house")
# 7 spain
cue("spain", 0.25, "gen-whoosh-deep", -3, note="Spain opens out of the pin")
cue("w:spanje2", 0.25, TAP2, -4, note="the suitcase is ringed")
cue("w:spanje2", 0.5, POP, -4, 12, "step 5 ticked at the suitcase")
cue("w:ook2", 0.25, "gen-whoosh-medium", -4, note="the photo becomes a card")
swish("w:staan", 0.1, -5, "the team slides in")
for lab in ["w:persoonlijke", "w:coaching", "w:activiteiten"]:
    swish(lab, 0.1, -5, f"card dealt ({lab[2:]})")
# 8 the whole journey
swish("journey", 0.35, -4, "the cards fly onto the route")
cue("w:vraag", 0.05, POP, -3, 0, "the first question")
cue("journey", 0.75, POP, -6, 7, "the three support cards fold into the fifth dot")
for i in range(5):
    cue("w:tot", -0.1 + i * 0.22 + 0.15, TAP2, -6, [0, 2, 4, 7, 9][i], f"the ball passes step {i + 1}")
cue("w:stagedag", 0.15, POP, -2, 12, "the last internship day")
# 9 close
cue("close", 0.15, "gen-swell", -5, note="Granada opens behind the card")
for i in range(4):
    cue("close", -0.05 + i * 0.06 + 0.62, POP, -14, [0, 4, 7, 12][i], f"ball {i + 1} lands in the logo")
cue("w:jongleren2", 0.35, "gen-shimmer", -4, note="the logo")

out = {"fps": FPS, "frames": round(END * FPS), "library": "lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       # the bed 4 dB up from the studio default (it sat 17 dB under the voice), lifted where the track itself dips
       # (the hook's quiet intro, the summary) and for its final hit after the last word
       "music": {"file": "bed.wav", "at": 0, "lufs": -23, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.5,
                 "lifts": [[0, 3.9, 6], [38.3, 40.0, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
