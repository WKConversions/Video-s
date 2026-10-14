# The Costa Connect film's cue sheet: the supplied voice-over, the music bed and an effect on every picture event that
# carries meaning, placed on the same labels as the picture (film/src/clock.ts, film/src/Story.tsx).
#   python3 scripts/cues.py            (run from films/costa; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
# Effects: the studio's generated sounds (gen-*) and Kenney's CC0 interface sounds (kenney-*), shared with the Alumni
# film (../alumni/sound/lib). Network/SaaS brief: clean UI taps and pops on the nodes, airy swishes on the bigger
# moves, one shimmer for the brand, a click on the call to action.
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 37.5
L = dict(W)
L.update({"q": W["w:waarom"] - 0.2, "svc": W["w:van"] - 0.15, "face": W["w:wij"] - 0.15, "tell": W["w:jij"] - 0.2, "contact": W["w:wij2"] - 0.1,
          "table": W["w:schuiven"] - 0.1, "geen": W["w:geen"] - 0.2, "korte": W["w:korte"] - 0.2, "twee": W["w:twee"] - 0.2,
          "sign": W["w:costa2"] - 0.2, "cta": W["w:klaar"] - 0.2})
POP, TAP, TAP2, TICK, CLICK, OPEN = "kenney-drop-003", "kenney-select-002", "kenney-select-001", "kenney-tick-004", "kenney-click-001", "kenney-maximize-009"

cues = []
LIFT = 4   # the bed here is busier than Alumni's: every effect a little louder, so the UI sounds read through it
def cue(label, off, sid, db=0, pitch=0, note="", auto=True):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db + (LIFT if auto else 0), **({"pitch": pitch} if pitch else {}),
                 **({} if auto else {"auto_level": False}), "note": note})
_w = [0]
def swish(label, off, db, note):
    i = _w[0]; _w[0] += 1
    cue(label, off, "gen-whoosh-short" if i % 2 == 0 else "gen-whoosh-whip", db - (0 if i % 2 == 0 else 2), [-2, 0, 2][i % 3], note)

# 1-3 two worlds, the distance, Costa Connect closes it
cue("w:ondernemen", 0.0, "gen-appear", -7, note="the Costa del Sol window")
cue("w:spanje", 0.1, TAP, -9, note="the pin")
cue("w:kansen", -0.05, "gen-appear", -8, 2, "the Amsterdam window")
cue("w:nederland", 0.1, TAP, -9, 2, "the pin")
swish("q", 0.1, -8, "the two windows move apart")
cue("w:afstand", 0.05, TICK, -10, note="the line stalls in the gap")
cue("w:costa", -0.12, "gen-impact-soft", -7, note="the mark drops into the gap")
cue("w:costa", 0.05, "gen-shimmer", -10, note="the brand")
cue("w:connect", 0.05, "gen-swell", -9, note="the line closes through it")
for i in range(5):
    cue("w:netwerk", i * 0.08 + 0.05, POP, -12, [-6, -3, -1, 1, 3][i], f"network node {i + 1}")
swish("w:dichtbij", -0.05, -9, "both sides move closer")
# 4 the services
cue("svc", 0.05, "gen-whoosh-medium", -7, note="the windows fold into the hub")
for i, lab in enumerate(["w:gesprekken", "w:connecties", "w:relatiebeheer", "w:praktische"]):
    cue(lab, -0.15, TICK, -13, [0, 2, 3, 5][i], "the cable draws")
    cue(lab, 0.1, OPEN, -8, [-3, -1, 1, 3][i], f"service tile {i + 1}")
# 5 the face on location
cue("face", 0.05, "gen-whoosh-medium", -7, note="the tiles retract, the hub moves")
cue("w:gezicht", -0.2, "gen-appear", -7, note="Rienk")
cue("w:locatie", 0.0, POP, -6, note="the pin lands")
# 6-7 tell, contact, table, update
swish("tell", 0.05, -8, "the card grows into the chat")
for i in range(8):
    cue("w:vertelt", -0.05 + i * 0.075, CLICK, -16, [0, 2, -1, 3, 1, 0, 2, -2][i], "a key")
cue("w:speelt", 0.0, TAP2, -8, note="the second message")
cue("contact", 0.05, "gen-whoosh-short", -11, note="the line runs to the people on location")
cue("w:contact", -0.1, TAP, -8, note="Contact gelegd")
for i in range(3):
    cue("w:contact", i * 0.1 + 0.05, POP, -12, [-4, -1, 2][i], f"contact {i + 1}")
cue("table", 0.05, "gen-whoosh-deep", -7, note="the window grows to the table")
cue("w:houden", 0.0, "gen-whoosh-whip", -11, note="the update flies back")
cue("w:houden", 0.62, "gen-chime", -10, note="the update lands")
# 8 no extra office, no missed chances
cue("geen", 0.1, "gen-whoosh-medium", -7, note="the windows leave")
cue("w:extrakantoor", 0.0, "gen-appear", -9, note="the office")
cue("w:extrakantoor", 0.42, "gen-stamp", -9, note="struck through")
swish("w:geen2", -0.15, -10, "the office drops away")
for i in range(3):
    cue("w:kansen2", 0.05 + i * 0.12, TAP, -8, [-2, 0, 2][i], f"followed up {i + 1}")
# 9 the network: short lines, strong relations, new possibilities
cue("korte", 0.0, "gen-whoosh-medium", -8, note="the network")
for i in range(5):
    cue("korte", 0.1 + i * 0.06, POP, -13, [-7, -5, -3, -1, 1][i], f"node {i + 1}")
cue("w:lijnen", -0.05, "gen-swell", -11, note="the lines shorten")
cue("w:sterke", 0.0, "gen-impact-soft", -11, note="the lines thicken")
for i in range(5):
    cue("w:nieuwe2", i * 0.09 + 0.05, "gen-pop", -12, [-3, -1, 1, 3, 5][i], f"a new possibility {i + 1}")
# 10 two countries, one network
cue("twee", 0.0, "gen-whoosh-medium", -7, note="the network collapses into the hub")
cue("w:twee", 0.05, OPEN, -9, note="Costa del Sol")
cue("w:landen", 0.0, OPEN, -9, 3, "Amsterdam")
cue("w:één", 0.0, "gen-whoosh-short", -11, note="one line")
cue("w:netwerk2", 0.25, "gen-chime", -15, note="one network")
# 11 the sign-off
cue("sign", 0.05, "gen-swell", -3, note="the mark rises into the logo", auto=False)
cue("w:costa2", 0.0, "gen-shimmer", -5, note="Costa Connect", auto=False)
swish("w:blijf", 0.0, -11, "the cards move to the corners")
# 12 the call to action
cue("cta", 0.05, "gen-whoosh-medium", -4, note="the logo lifts", auto=False)
cue("w:connecten", 0.2, "gen-appear", -7, note="the button")
cue("w:connecten", 0.15, "gen-whoosh-short", -12, note="the lines run into the button")
cue("w:connecten", 1.95, CLICK, -2, note="the click", auto=False)
cue("w:connecten", 1.98, "gen-success", -9, note="the call answered")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0, "lufs": -23, "duck_db": 6, "fade_in": 0.2, "fade_out": 0.5, "lifts": [[34.8, 37.5, 4]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
