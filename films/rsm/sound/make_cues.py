# Cue sheet for the Royal School of Music film: effects lead (on the picture's events), quiet music bed under the VO.
import json
VO = 0.4
W = dict(exciting=1.26, finding=2.56, teacher=3.08, fitting=3.96, schedule=4.96, knowing=5.9, often=7.22, meet=8.96, royal=9.18,
         we=11.0, bring=11.16, personalized=12.56, complete=14.44, schools=15.84, professional=16.78, live=17.28, learn=19.9,
         piano=20.08, guitar=20.86, violin=21.62, singing=22.3, drums=22.96, qualified=23.7, build=25.26, confidence=25.44,
         develop=26.0, prepare=27.58, international=28.16, certifications=28.66, your=30.3, starts=31.26, get=32.52, touch=32.74)
w = lambda x: W[x] + VO
F = lambda s: round(s * 60)
fx = []
def add(t, i, db, pitch=0, note=""): fx.append({"frame": F(t), "id": i, "db": min(-3, db + (7 if i == "gen-tick" else 5)), "pitch": pitch, "note": note})
# S1 words fly in, lock; strum + burst
add(0.0, "gen-whoosh-medium", -12, 0, "words fly in")
for j, t in enumerate([0.35, 0.55, 0.75, 0.95, 1.15]): add(t, "gen-tick", -20, j, "words lock")
add(w("exciting") - 0.02, "gen-shimmer", -8, 0, "strum: notes burst")
add(w("exciting"), "gen-appear", -10, 0, "burst")
add(2.75, "gen-whoosh-short", -11, -2, "words into the card")
add(3.0, "kenney-drop-003", -9, 0, "card lands")
# S2 problem
for j in range(4): add(w("teacher") - 0.1 + j * 0.08, "gen-tick", -16, j, "portrait slots")
for j in range(4): add(w("teacher") + 0.45 + j * 0.08, "gen-pop", -14, 2 + j, "? badges")
add(w("fitting") - 0.15, "gen-whoosh-short", -12, 0, "to schedule")
for j in range(3): add(w("fitting") + 0.55 + j * 0.45, "kenney-click-001", -10, -3 + j, "slot taken")
add(w("knowing") - 0.15, "gen-whoosh-short", -12, 2, "to instruments")
for j in range(5): add(w("knowing") - 0.1 + j * 0.06, "gen-pop", -15, j, "chips")
for j in range(4): add(w("knowing") + 0.4 + j * 0.17, "kenney-select-001", -16, j % 2, "hover")
add(w("often"), "gen-whoosh-deep", -12, -4, "less so: grey and sink")
# S3 meet
add(w("meet") - 0.9, "gen-riser-1s", -11, 0, "into the tile")
add(w("meet") + 0.02, "gen-chime", -6, 0, "logo")
add(w("meet") + 0.05, "gen-shimmer", -9, 2, "brand notes")
for j, k in enumerate(["royal", "meet"]): pass
# S4 services
add(w("we") - 0.1, "gen-swell", -10, 0, "tile opens into the card")
add(w("bring") + 0.1, "gen-whoosh-short", -16, 4, "house draws")
add(w("personalized") - 0.2, "gen-whoosh-medium", -11, 0, "push: home")
add(w("complete") - 0.15, "gen-whoosh-medium", -11, 2, "push: schools")
for j in range(5): add(w("complete") + 0.2 + j * 0.16, "gen-pop", -11, j, "logos")
add(w("professional") - 0.15, "gen-whoosh-medium", -11, -1, "push: events")
add(w("live") - 0.1, "gen-appear", -9, 0, "instruments assemble")
add(w("live") + 0.6, "gen-shimmer", -14, -2, "assembled")
add(19.8, "gen-whoosh-short", -12, 0, "card out")
# S5 instruments
for j, k in enumerate(["piano", "guitar", "violin", "singing", "drums"]): add(w(k) - 0.12, "gen-whoosh-whip", -12, j - 2, k)
# S6 teachers, bars
for j in range(4): add(w("qualified") + j * 0.1, "kenney-drop-003", -11, j, "teacher")
add(w("build") - 0.1, "gen-whoosh-short", -14, 0, "row up")
for j in range(12): add(w("confidence") + 0.05 + j * 0.05, "gen-tick", -19, j // 2, "bar")
for j in range(12): add(w("develop") + 0.05 + j * 0.05, "gen-tick", -19, 2 + j // 2, "bar")
# S7 certificate
add(w("prepare") - 0.3, "gen-whoosh-medium", -11, 0, "certificate in")
add(w("international") + 0.1, "gen-pop", -12, 0, "Trinity")
add(w("international") + 0.3, "gen-pop", -12, 3, "ABRSM")
add(w("certifications") + 0.15, "gen-stamp", -5, 0, "seal stamps")
add(w("certifications") + 0.2, "gen-success", -10, 0, "seal")
# S8 journey
add(w("your") - 0.3, "gen-whoosh-short", -12, 0, "staff draws")
for j in range(11): add(w("your") + 0.1 + j * 0.16, "gen-pop", -15, j, "melody notes")
# S9 end
add(w("get") - 0.3, "gen-whoosh-deep", -11, 0, "end card")
add(w("get") - 0.25, "gen-chime", -8, 0, "logo")
add(w("touch"), "kenney-click-001", -7, 0, "button press")
json.dump({"fps": 60, "frames": 2136, "library": "../../alumni/sound/lib",
           "vo": {"file": "../vo/vo.mp3", "at": VO, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -31, "duck_db": 5, "fade_in": 0.2, "fade_out": 1.2},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
