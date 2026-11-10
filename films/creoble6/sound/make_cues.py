# Cue sheet for Creoble v6. Willads: "soft UI sounds (quiet keyboard ticks, a soft click, a gentle tone on checkmarks);
# less is more; calm minimal music, low in the mix." Real recorded sounds only (Karl: no generated whooshes), in sound/lib (Kenney CC0 and
# Pixabay UI sounds, copied from the alumni and recruiting-rewards libraries; Karl's Motionix pack is not on this machine). Music: Mixkit "Piano Reflections" (free licence, no credit), fitted to 65.18 s with an entry on the build
# (8.99 s): bed.wav, regenerable with music_fit.py (see README). Film time = paced VO time (vo/pace.py).
# python3 make_cues.py && python3 <skill>/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
fx = []
GAIN = 8   # soft, but audible over the bed (house style: effects lead)
def a(t, i, db, pitch=0, note=""): fx.append({"frame": round(t * 60), "id": i, "db": db + GAIN, "pitch": pitch, "note": note})

# Willads' list, and nothing else ("less is more"): quiet keyboard ticks (Karl's own soft typing recording), a soft
# click on each real click, a gentle glass tone on each checkmark, and one soft landing for the logo.
def typing(t, n, db=-14, note="typing"): a(t, {13: "ui-typing-13", 9: "ui-typing-09", 6: "ui-typing-06"}[n], db, 0, note)
def click(t, note, db=-13): a(t, "kenney-click-001", db, -3, note)
def tone(t, i, note, db=-17): a(t, "kenney-glass-001", db, -5 + 2 * i, note)
# A
click(6.45, "click into Virksomhedsnavn"); typing(6.62, 13, note="typing Holm Fysioterapi"); click(8.5, "Fortsæt pressed")
# B
click(19.0, "the headline selected"); typing(19.4, 9, note="typing the change"); click(20.3, "send")
for i, t in enumerate([25.15, 25.95, 27.14]): tone(t, i, "a check on the purchase card")
# C
for i, t in enumerate([38.28, 39.00, 39.54]): tone(t, i, "a row turns green")
click(48.0, "the chat button"); typing(48.8, 9, -17, "her reply types"); click(52.15, "the send button")
a(53.25, "kenney-drop-003", -12, 0, "the dots land: the C")
typing(61.4, 6, -17, "creoble.dk types")
json.dump({"fps": 60, "frames": 3911, "library": "lib",
           "vo": {"file": "../vo/vo_paced.mp3", "at": 0, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -31, "duck_db": 5, "fade_in": 0.05, "fade_out": 1.5},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
