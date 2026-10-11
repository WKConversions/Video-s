# Writes sound/cues.json: one effect per visual event, keyed to the voice-over's words (film seconds, vo/words.json).
#   cd sound && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
W = {w["key"]: w["start"] for w in json.load(open("../vo/words.json"))["words"]}
cues = []
def c(id, sec, note, db=None, pitch=None):
    e = {"id": id, "frame": max(0, round(sec * 30)), "note": note}
    if db is not None: e["db"] = db
    if pitch is not None: e["pitch"] = pitch
    cues.append(e)
w = lambda k, d=0.0: W[k] + d

# 01–04 the hook: one business, countless tools, hundreds of tasks
c("gen-pop-soft-1", w("w:one", -0.05), "One", -9)
c("gen-pop-soft-2", w("w:business", -0.05), "business.", -10)
c("gen-whoosh-soft-short", w("w:business", 0.75), "line 1 makes room", -13)
c("gen-data-blips", w("w:countless", 0.0), "the slot rolls tool names", -12)
c("gen-tick-soft-hi", w("w:tools", -0.17), "the roll lands on 'tools.'", -6)
c("gen-whoosh-soft-short", w("w:tools", 0.62), "the lines leave", -11)
c("gen-pop-soft-1", w("w:and", 0.15), "the first task", -10)
c("gen-data-blips", w("w:hundreds", 0.05), "tasks stream", -11)
c("gen-data-blips", w("w:tasks", 0.05), "tools join the tasks", -10, 2)
c("gen-data-blips", w("w:connecting", 0.05), "dashed links draw", -9, 4)
# 05 the question
c("gen-swell", w("w:what", -0.3), "the prompt bar rises over the feed", -12)
c("gen-typing-run", w("w:what", 0.0), "the question types", -7)
c("gen-typing-run", w("w:everything", 0.3), "the question types", -8, 1)
c("gen-click", w("w:together", 0.65), "send is clicked", -2)
c("gen-send", w("w:together", 0.85), "the question is sent", -6)
# 06–08 K.B
c("gen-impact-logo", w("w:kb", -0.12), "the send tile grows into the K.B tile", -4)
c("gen-whoosh-soft-short", w("w:kb", 0.78), "the tile becomes the nav pill", -13)
c("gen-pop-soft-2", w("w:technology", 0.0), "Tech attaches", -10)
c("gen-pop-soft-3", w("w:partner", 0.0), "Partner attaches", -10)
# 09 built around your business
c("gen-click", w("w:built", -0.08), "the pill is clicked", -3)
c("gen-swell-low", w("w:built", 0.2), "the workspace opens", -10)
c("gen-pop-soft-1", w("w:around", 0.0), "the tasks rise in", -10)
c("gen-tick-soft-hi", w("w:around", 0.75), "the outline closes around them", -9, 2)
c("gen-pop-soft-3", w("w:business2", 0.0), "Your business", -7)
# 10 connect
c("gen-whoosh-soft-short", w("w:business2", 0.5), "CRM updates lifts out", -10)
c("gen-tick-soft-hi", w("w:connect", 0.35), "the link is drawn", -7)
c("gen-send", w("w:tools2", 0.15), "data travels across", -8)
c("gen-success-soft", w("w:tools2", 0.25), "Connected", -6)
# 11 automate
c("gen-whoosh-soft-short", w("w:automate", -0.25), "the thread scrolls up", -11)
c("gen-pop-soft-1", w("w:automate", -0.05), "the request lands", -8)
c("gen-appear", w("w:workflows", -0.05), "the workflow card lands", -7)
c("gen-tap-soft", w("w:workflows", 0.2), "the toggle switches on", -4)
c("gen-tick-soft", w("w:workflows", 0.45), "step ticks", -10)
c("gen-tick-soft", w("w:workflows", 0.85), "step ticks", -10, 2)
# 12–13 simplify operations
c("gen-whoosh-soft-medium", w("w:simplify", 0.1), "everything gathers into one deck", -9)
c("gen-success-soft", w("w:operations", 0.2), "Operations: one checked line", -4)
# 14–15 the agent, custom software
c("gen-swell-low", w("w:operations", 0.85), "the line opens into the agent", -11)
c("gen-data-blips", w("w:intelligent", 0.0), "the agent is working", -13)
c("gen-blip", w("w:ai", 0.0), "the reply streams", -7)
c("gen-blip", w("w:ai", 0.15), "the reply streams", -7, 3)
c("gen-chime-soft", w("w:agents", 0.05), "Done", -7)
c("gen-whoosh-soft-short", w("w:to", 0.0), "the agent scrolls away", -9)
c("gen-appear", w("w:custom", 0.05), "the dashboard rises", -7)
c("gen-shimmer", w("w:software", 0.0), "it develops into true colour", -11)
# 16–17 everything works together
c("gen-whoosh-soft-medium", w("w:everything2", -0.25), "the dashboard zooms out into the stack", -8)
c("gen-pop-soft-2", w("w:everything2", 0.05), "the question returns", -8)
c("gen-tick-soft", w("w:works", 0.0), "the question rewrites itself", -7)
c("gen-impact-soft", w("w:together2", 0.0), "the answer floods cyan", -4)
# 18–20 diagnose, build, run
c("gen-whoosh-soft-short", w("w:analyze", -0.5), "the cyan contracts into the process card", -8)
c("gen-riser-soft-1s", w("w:analyze", 0.95), "the scan crosses the steps", -11)
c("gen-pop-soft-1", w("w:processes", 0.0), "Friction", -7)
c("gen-pop-soft-2", w("w:processes", 0.17), "Friction", -7, 2)
c("gen-tick-soft", w("w:build", 0.0), "Build", -9)
c("gen-click", w("w:build", 0.38), "the K.B cursor clicks", -3)
c("gen-success-soft", w("w:build", 0.52), "a step automated", -8)
c("gen-click", w("w:team", -0.03), "your team clicks", -3)
c("gen-success-soft", w("w:team", 0.12), "a step automated", -8, 2)
c("gen-tick-soft", w("w:keep", 0.0), "Run", -9)
c("gen-success-soft", w("w:systems", 0.1), "every step runs", -5)
c("gen-data-blips", w("w:running", 0.0), "uptime and monitoring", -10)
# 21–22 no unnecessary complexity
c("gen-whoosh-soft-short", w("w:no", -0.4), "the card makes room", -11)
c("gen-data-blips", w("w:no", 0.0), "the maintenance unfolds", -9, -2)
for i in range(3):
    c("gen-tick-soft-hi", w("w:unnecessary", 0.0) + 0.1 * i * 2, "K.B handles it", -9, 2 * i)
c("gen-whoosh-soft-medium", w("w:complexity", 0.2), "it folds away behind the card", -9)
c("gen-pop-soft-3", w("w:complexity", 0.85), "the card collapses into your business", -6)
# 23–24 the claim
c("gen-swell-low", w("w:just2", -0.05), "white grows out of the pill", -12)
c("gen-pop-soft-2", w("w:you", 0.05), "your business drops in as 'you'", -5)
# 25–26 less manual work, more time to grow
c("gen-whoosh-soft-short", w("w:less", -0.5), "the claim leaves, the card rises", -10)
for i, (k, d) in enumerate([("w:less", -0.03), ("w:less", 0.17), ("w:manual", -0.03), ("w:manual", 0.2), ("w:work", -0.03)]):
    c("gen-tick-soft", w(k, d + 0.05), "a manual task checks off", -8, i)
c("gen-chime-soft", w("w:time", 0.05), "Time to grow", -6)
c("gen-sparkle", w("w:grow", 0.05), "the card grows, the line rises", -11)
# 27–29 the sign-off (the music's last hit lands at 35.23)
c("gen-whoosh-soft-medium", w("w:kb2", -0.35), "the card leaves, the tile rises", -9)
c("gen-impact-logo", w("w:kb2", 0.02), "K.B", -3)
c("gen-pop-soft-1", w("w:your7", 0.0), "Your tech team,", -13)
c("gen-pop-soft-2", w("w:without", 0.0), "without the hiring.", -13)

for e in cues:
    if e["note"] == "worked → works": e["auto_level"] = False
doc = {"fps": 30, "frames": 1200, "library": "lib", "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "music/cat-walk-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.2,
                 "note": "Cat Walk (Arulo, Mixkit, Mixkit Stock Music Free License), fitted: lift at 8.30 on 'Meet K.B.', last hit 35.23 on 'K.B.'"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues")
