# Writes sound/cues.json: one sound per visual event (adrian_sfx.py), each used once, on the frames the picture uses
# (film/src/scenes.tsx: W(key, d) = round(word start × 30) + round(d × 30)).
#   cd sound && python3 adrian_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
WD = {w["key"]: w["start"] for w in json.load(open("../vo/words.json"))["words"]}
def W(k, d=0.0): return round(WD[k] * 30) + round(d * 30)
cues = []
def c(id, frame, note, db=None):
    e = {"id": id, "frame": int(frame), "note": note}
    if db is not None: e["db"] = db
    cues.append(e)
END = 1100                                                     # the sign-off (scenes.tsx END_OF_SIGN)
CARDS_OUT = W("w:no") - 20
c("at-shell", 10, "the shell rises", -6)
c("at-ai", W("w:ai"), "AI", -2)
c("at-bloom", W("w:everywhere") - 1, "the tags bloom out", -1)
c("at-card", W("w:business") - 4, "the Your business card", -4)
c("at-pile", W("w:thats"), "the tags crowd onto the card", -2)
c("at-tangle", W("w:thats") + 8, "the hairlines tangle", -6)
c("at-complicated", W("w:complicated"), "complicated", -6.5)
c("at-drop", W("w:meet") + 2, "the pile drops away", -6)
c("at-portrait", W("w:meet") + 13, "the card opens into Adrian", -3)
c("at-name", W("w:adrian"), "Adrian Tineo.", -6)
c("at-independent", W("w:independent") - 2, "Independent / AI expert.", -8)
c("at-handson", W("w:expert") - 4, "Business-minded, hands-on", -7)
c("at-morph1", W("w:from") + 14, "portrait to opportunity", -7)
c("at-direction", W("w:right") - 2, "A clear direction", -6)
c("at-arrow", W("w:opportunities") + 18, "the arrow draws", -8)
c("at-solution", W("w:building") - 6, "the solution card", -5)
c("at-advantage", W("w:solutions") - 4, "A real-world advantage", -6)
c("at-three", W("w:adrian2") + 10, "three cards", -7)
c("at-connect", W("w:connects") + 19, "the rule draws", -8)
c("at-strategy", W("w:strategy"), "strategy", -5)
c("at-engineering", W("w:engineering"), "engineering", -5)
c("at-execution", W("w:execution"), "execution", -6.5)
c("at-grid", W("w:explore") - 7, "four service cards", -6)
c("at-lift1", W("w:explore"), "Explore use cases", -5)
c("at-lift2", W("w:develop"), "Develop and integrate AI", -5)
c("at-lift3", W("w:evaluate"), "Evaluate performance", -5)
c("at-lift4", W("w:bring"), "Bring expert leadership", -5)
c("at-team", W("w:team") - 6, "Expertise, when you need it", -7)
c("at-clear", CARDS_OUT + 9, "the cards drop away", -7)
c("at-nohype", W("w:no"), "No hype.", -2)
c("at-noguess", W("w:no2"), "No guesswork.", -3)
c("at-left", W("w:just"), "the statement steps left", -8)
c("at-orb", W("w:practical") - 2, "the chrome core", -5)
c("at-base", W("w:built") + 4, "the base slab", -5)
c("at-mid", W("w:built") + 12, "the silver slab", -5)
c("at-top", W("w:around") + 11, "the top slab", -4)
c("at-tag3", W("w:your4") - 4, "A clear direction", -8)
c("at-tag4", W("w:business2") - 2, "A real-world advantage", -8)
c("at-panel", W("w:ready") + 12, "the dark panel lands", -3)
c("at-potential", W("w:potential") - 4, "AI potential.", -5)
c("at-impact", W("w:impact") - 2, "Business impact.", -3)
c("at-button", W("w:lets") - 4, "the button", -6)
c("at-click", W("w:talk") + 4, "the button pressed", -4)
c("at-wordmark", END + 12, "the wordmark", -3)
c("at-dot", END + 28, "the dot", -6)

ids = [x["id"] for x in cues]
assert len(ids) == len(set(ids)), "a sound is used twice"
lib = {x["id"] for x in json.load(open("lib/sfx/index.json"))}
assert set(ids) == lib, ("unused or missing sounds", lib ^ set(ids))
doc = {"fps": 30, "frames": 1170, "library": "lib", "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "music/digital-clouds-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 0.6,
                 "note": "Digital Clouds (Alejandro Magaña, Mixkit, Mixkit Stock Music Free License), fitted: lift at 6.90 s on 'Meet', last hit 37.29 s"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues, every sound used once")
