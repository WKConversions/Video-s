# Cue sheet for Creoble v6. Willads: "soft UI sounds (quiet keyboard ticks, a soft click, a gentle tone on checkmarks);
# less is more; calm minimal music, low in the mix." Real recorded sounds only (Karl: no generated whooshes), in sound/lib (Kenney CC0 and
# Pixabay UI sounds, copied from the alumni and recruiting-rewards libraries; Karl's Motionix pack is not on this machine). Music: Mixkit "Piano Reflections" (free licence, no credit), fitted to 65.18 s with an entry on the build
# (8.99 s): bed.wav, regenerable with music_fit.py (see README). Film time = paced VO time (vo/pace.py).
# python3 make_cues.py && python3 <skill>/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
fx = []
GAIN = 8   # soft, but audible over the bed (house style: effects lead)
def a(t, i, db, pitch=0, note=""): fx.append({"frame": round(t * 60), "id": i, "db": db + GAIN, "pitch": pitch, "note": note})
def typing(t0, t1, n, db=-19, note="a key"):
    for j in range(n): a(t0 + (t1 - t0) * j / max(1, n - 1), "kenney-select-001", db, (j * 7 % 5) - 2, note)

# A: the old web, the wizard, the build
a(6.45, "kenney-click-001", -11, 0, "click into Virksomhedsnavn")
typing(6.6, 7.85, 12, note="typing Holm Fysioterapi")
a(8.5, "kenney-click-001", -9, -2, "Fortsæt pressed")
a(8.78, "soundreality-ui-pop-up", -13, 0, "the dot opens into the logo")
a(10.9, "pop-up-notify-smooth-modern", -16, 0, "the site is complete")
# B: preview, edit, price, hosting
a(16.32, "soundreality-ui-pop-up", -15, 3, "Gratis")
a(18.68, "kenney-click-001", -11, 0, "the headline selected")
typing(19.25, 19.95, 9, note="typing the change")
a(20.0, "kenney-click-001", -12, 2, "send")
a(20.7, "kenney-glass-001", -19, 0, "the headline rewritten")
a(30.2, "kenney-tick-004", -21, 0, "499 rolls to 0")
a(33.7, "pop-up-notify-smooth-modern", -15, -2, "the address pill becomes the card")
for i, t in enumerate([34.48, 34.92, 35.20]): a(t, "kenney-tick-004", -19, 2 * i, "a row arrives")
a(36.0, "soundreality-ui-pop-up", -15, -2, "the price")
# C: green rows, pills, support, the logo
for i, t in enumerate([38.28, 39.00, 39.54]): a(t, "kenney-glass-001", -15, 2 * i, "a row turns green")
for i, t in enumerate([42.11, 43.69, 45.13]): a(t, "kenney-tick-004", -17, 2 * i, "a pill")
a(48.0, "kenney-click-001", -11, 0, "the chat button")
a(48.2, "pop-up-notify-smooth-modern", -15, 0, "the chat opens")
typing(48.8, 49.7, 9, -21, "her reply types")
a(53.25, "kenney-drop-003", -10, 0, "the dots land: the C")
a(53.45, "soundreality-ui-pop-up-clear", -19, 0, "the wordmark")
a(60.05, "soundreality-ui-pop-up", -14, 0, "Byg din side gratis")
typing(61.4, 61.95, 6, -21, "creoble.dk types")
json.dump({"fps": 60, "frames": 3911, "library": "lib",
           "vo": {"file": "../vo/vo_paced.mp3", "at": 0, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -31, "duck_db": 5, "fade_in": 0.05, "fade_out": 1.5},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
