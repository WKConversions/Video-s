# Writes sound/cues.json: one sound per visual event, each made for its moment (kb_sfx.py) and used once, so no effect is
# heard twice (Karl, 12 Oct). Keyed to the voice-over's words (film seconds, vo/words.json).
#   cd sound && python3 kb_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
W = {w["key"]: w["start"] for w in json.load(open("../vo/words.json"))["words"]}
cues = []
def c(id, sec, note, db=None):
    e = {"id": id, "frame": max(0, round(sec * 30)), "note": note}
    if db is not None: e["db"] = db
    cues.append(e)
w = lambda k, d=0.0: W[k] + d

# 01–04 the hook
c("kb-air-open", w("w:one", -0.1), "an E-minor air opens under 'One business.'", -4)
c("kb-chips-cascade", w("w:tools", -0.12), "the tool chips settle around the business", -3)
c("kb-air-away", w("w:tools", 0.75), "the words ease away, the tools line up", -6)
c("kb-tasks-flutter", w("w:and", 0.15), "tasks pile up, denser and denser", -3)
c("kb-links-chirp", w("w:connecting", 0.0), "the dashed links draw", -4)
# 05 the question
c("kb-bar-rise", w("w:what", -0.25), "the prompt bar rises", -4)
c("kb-keys", w("w:what", -0.04), "the question is typed", -2)
c("kb-fan-in", w("w:everything", 0.0), "the tools' lines reach the question", -4)
c("kb-glow", w("w:together", 0.0), "the lines turn solid", -6)
c("kb-click-send", w("w:together", 0.65), "send", -1)
c("kb-send", w("w:together", 0.8), "the question leaves", -5)
# 06–08 K.B
c("kb-reveal", w("w:meet", 0.25), "the bar becomes the K.B tile", -1)
c("kb-pill-open", w("w:technology", -0.1), "the pill widens: Tech, Partner", -5)
# 09 built around your business
c("kb-click-pill", w("w:built", -0.08), "the pill is clicked", -2)
c("kb-card-bloom", w("w:around", 0.1), "the workspace grows around the tasks", -4)
c("kb-note-business", w("w:business2", 0.0), "'Your business' lands", -6)
# 10–11 connect, automate
c("kb-lift", w("w:business2", 0.55), "CRM updates lifts out", -7)
c("kb-connect", w("w:tools2", 0.15), "the link is drawn, 'Connected'", -3)
c("kb-data", w("w:tools2", 0.4), "data crosses", -6)
c("kb-message", w("w:automate", -0.08), "the request arrives", -4)
c("kb-toggle", w("w:workflows", 0.2), "the workflow switches on", -2)
c("kb-run", w("w:workflows", 0.45), "the steps run", -6)
# 12–13 simplify operations
c("kb-gather", w("w:simplify", 0.1), "everything gathers into one deck", -5)
c("kb-ops", w("w:operations", 0.2), "Operations", -6)
# 14–15 the agent, custom software
c("kb-panel-open", w("w:operations", 0.9), "the line opens into the agent", -7)
c("kb-agent-work", w("w:intelligent", 0.0), "the agent works", -6)
c("kb-stream", w("w:ai", 0.0), "the reply streams", -5)
c("kb-done", w("w:agents", 0.05), "Done", -4)
c("kb-dash-rise", w("w:custom", 0.05), "the dashboard rises", -5)
c("kb-develop", w("w:software", 0.0), "true colour develops", -7)
# 16–17 everything works together
c("kb-zoom-out", w("w:everything2", -0.25), "into the stack", -6)
c("kb-rewrite", w("w:works", 0.0), "the question rewrites itself", -6)
c("kb-flood", w("w:together2", 0.0), "the answer floods cyan", -5)
# 18–20 diagnose, build, run
c("kb-scan", w("w:analyze", 1.2), "the scan crosses the business", 1)
c("kb-friction", w("w:processes", 0.0), "Friction", -4)
c("kb-click-kb", w("w:build", 0.38), "the K.B cursor clicks", -2)
c("kb-auto-1", w("w:build", 0.52), "a step automated", -5)
c("kb-click-team", w("w:team", -0.03), "your team clicks", -2)
c("kb-auto-2", w("w:team", 0.12), "a second step automated", -5)
c("kb-run-all", w("w:systems", 0.1), "every step runs", -3)
c("kb-monitor", w("w:running", 0.0), "uptime and monitoring", -6)
# 21–22 no unnecessary complexity
c("kb-unfold", w("w:no", 0.0), "the maintenance unfolds", -5)
c("kb-handled", w("w:unnecessary", 0.0), "K.B takes each one", -6)
c("kb-fold", w("w:complexity", 0.2), "it folds away", -5)
c("kb-settle", w("w:complexity", 0.85), "the card becomes your business", -5)
# 23–24 the claim
c("kb-claim", w("w:just2", -0.1), "the business comes back behind the claim", -6)
c("kb-you", w("w:you", 0.02), "'you'", -3)
# 25–26 less manual work, more time to grow
c("kb-card-rise", w("w:less", -0.5), "the Manual work card rises", -6)
c("kb-checklist", w("w:less", -0.03) + 0.05, "the manual tasks check off", -3)
c("kb-grow", w("w:time", 0.0), "Time to grow", -4)
# 27–29 the sign-off (the music's last hit lands at 35.23)
c("kb-exit", w("w:kb2", -0.35), "the card leaves", -6)
c("kb-final", w("w:kb2", 0.02), "K.B", -2)

ids = [x["id"] for x in cues]
assert len(ids) == len(set(ids)), "a sound is used twice"
doc = {"fps": 30, "frames": 1200, "library": "lib", "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "music/cat-walk-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.2,
                 "note": "Cat Walk (Arulo, Mixkit, Mixkit Stock Music Free License), fitted: lift at 8.30 on 'Meet K.B.', last hit 35.23 on 'K.B.'"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues, every sound used once")
