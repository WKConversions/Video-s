# Cue sheet for the Digital Marketing Málaga film: effects lead (on the picture's events, from plan/contract.md),
# a quiet music bed under the voice (Mixkit "Tech House vibes", fitted: bed.wav). Film time = VO + 0.4.
import json
fx = []
def a(t, i, db, pitch=0, note=""): fx.append({"frame": round(t * 60), "id": i, "db": min(-3, db + (5 if i in ("gen-tick", "kenney-tick-004", "kenney-select-001", "kenney-select-002") else 3)), "pitch": pitch, "note": note})
# S1 connect
a(0.00, "gen-appear", -6, 0, "the mark draws on"); a(0.55, "gen-pop", -7, 2, "the dot pops")
a(0.78, "gen-whoosh-short", -9, 0, "the ends pull apart"); a(1.05, "kenney-drop-003", -6, 0, "card A blooms"); a(1.70, "kenney-drop-003", -6, 3, "card B blooms")
a(2.14, "gen-shimmer", -8, 0, "glint along the connection"); a(2.30, "gen-tick", -12, 5, "ring ping")
# S2 search
a(2.90, "gen-swell", -12, -5, "the ridge rises"); a(3.32, "gen-whoosh-whip", -7, -2, "the wave snaps"); a(3.34, "kenney-click-001", -8, -4, "snap")
for i, t in enumerate([3.55, 3.75, 3.95, 4.15]): a(t, "gen-tick", -15, i, "the dot searches")
a(4.10, "kenney-select-001", -10, 0, "outline pulse"); a(4.60, "gen-whoosh-short", -12, -3, "loops"); a(5.30, "gen-stamp", -9, -3, "the knot pulls tight")
# S3 meet
a(5.80, "gen-whoosh-medium", -8, 0, "the knot unwinds"); a(6.36, "gen-appear", -6, 2, "springs into the mark"); a(6.46, "gen-pop", -7, 4, "dot")
for i, t in enumerate([6.60, 7.08, 7.52]): a(t, "gen-tick", -12, 2 * i, "logotype word")
a(8.02, "gen-chime", -5, 0, "the dot clicks in: the logo"); a(8.25, "gen-whoosh-short", -11, 2, "logotype leaves")
# S4 community
a(8.62, "gen-swell", -10, 0, "rings ripple out"); a(8.70, "gen-whoosh-medium", -9, 2, "the wave stretches")
for i, t in enumerate([9.00, 9.09, 9.18, 9.27]): a(t, "kenney-drop-003", -8, i * 2, "hero card lands")
a(10.00, "gen-shimmer", -9, 2, "pulse along the community"); a(10.55, "gen-whoosh-short", -11, 0, "cards slide in")
# S5 Málaga
a(11.16, "kenney-drop-003", -7, -2, "stack"); a(11.30, "gen-whoosh-short", -12, 4, "the wave pulls into its dot"); a(11.72, "gen-pop", -5, -1, "the pin lands"); a(11.74, "gen-tick", -11, 0, "pin ring")
# S6 events
a(12.45, "gen-riser-1s", -12, 0, "the pin swells"); a(12.62, "gen-whoosh-deep", -6, 0, "the white circle opens"); a(12.66, "gen-appear", -9, 3, "first banner")
for i, t in enumerate([13.00, 13.42, 14.18]): a(t, "gen-whoosh-whip", -8, i, "banner flip")
for i, t in enumerate([13.02, 13.44, 14.20]): a(t, "kenney-tick-004", -11, 2, "date rolls")
a(13.70, "gen-tap", -9, 0, "underline"); a(14.28, "gen-tap", -9, 2, "venue underline"); a(14.55, "gen-swell", -12, 2, "the event grows")
# S7 professionals
a(15.10, "gen-tick", -13, 0, "seams"); [a(t, "gen-whoosh-whip", -10, i * 2, "panel flips to a speaker") for i, t in enumerate([15.38, 15.48, 15.58])]
for i, t in enumerate([16.10, 16.18, 16.26]): a(t, "gen-tick", -13, 3 + i, "name")
a(16.45, "gen-shimmer", -9, 0, "one line links the speakers")
# S8 share / explore
a(17.25, "gen-whoosh-short", -10, 0, "cards slide together"); a(17.56, "gen-whoosh-whip", -8, 0, "flip to the group"); a(17.85, "gen-pop", -6, 2, "speech bubble")
a(18.40, "gen-whoosh-short", -12, -2, "make room"); a(18.70, "gen-whoosh-short", -10, 3, "the wave forks")
for i, t in enumerate([19.05, 19.13, 19.21]): a(t, "gen-pop", -8, i * 2, "member pill")
for i, t in enumerate([19.50, 19.75]): a(t, "gen-tick", -12, 4 + i, "lights a pill")
a(20.02, "kenney-click-001", -5, 0, "presses WhatsApp group")
# S9 WhatsApp
a(20.05, "gen-whoosh-medium", -8, 0, "the phone rises"); a(20.30, "kenney-drop-003", -9, 2, "voice note"); a(20.58, "gen-pop", -8, 0, "image message"); a(21.05, "gen-pop", -8, 3, "link preview")
for i, t in enumerate([21.55, 21.67, 21.79]): a(t, "kenney-select-002", -15, i, "typing dots")
a(21.82, "gen-stamp", -8, 2, "the lock closes"); a(22.14, "gen-tick", -12, 2, "WhatsApp group")
a(22.55, "gen-riser-1s", -10, 0, "into the zoom-through"); a(23.10, "gen-whoosh-deep", -6, 0, "zoom-through cut")
# S10 ambitions
a(23.20, "gen-appear", -9, 0, "the dot"); [a(t, "kenney-drop-003", -7, 2 * i, "a pill lands") for i, t in enumerate([23.40, 23.80, 24.16])]
[a(t, "gen-tap", -11, 2 * i, "the dot hops") for i, t in enumerate([23.50, 23.90, 24.26])]
a(24.80, "gen-whoosh-short", -11, -2, "pills out"); a(25.00, "gen-swell", -9, 0, "the humps grow"); a(25.60, "gen-shimmer", -10, 2, "glint")
a(26.10, "gen-whoosh-short", -12, 3, "the dot lets go"); a(27.14, "gen-chime", -6, 3, "inspiration flares"); a(27.16, "gen-shimmer", -8, 4, "rings of light")
# S11 door
a(27.70, "gen-whoosh-medium", -8, 0, "the two return"); a(28.42, "gen-whoosh-short", -10, 4, "the link draws out"); a(28.72, "gen-pop", -7, 2, "connected")
a(29.22, "gen-whoosh-short", -9, -2, "the line folds into a door"); a(29.62, "gen-whoosh-deep", -7, 2, "the door swings open"); a(29.66, "gen-swell", -9, 4, "light pours in")
a(30.15, "gen-riser-1s", -9, 2, "the light fills the frame"); a(30.70, "gen-shimmer", -8, 5, "sheen")
# S12 join
a(30.85, "gen-whoosh-short", -9, -3, "the light condenses into JOIN US"); a(31.14, "kenney-click-001", -4, 0, "JOIN US pressed"); a(31.15, "gen-impact-soft", -8, 0, "press")
for i, t in enumerate([31.50, 31.96, 32.38]): a(t, "gen-tick", -12, 2 * i, "logotype word")
a(32.56, "gen-appear", -8, 2, "the wave draws back"); a(32.92, "gen-pop", -6, 4, "the dot: full stop")
a(33.70, "gen-swell", -9, 2, "grow"); a(33.82, "gen-success", -7, 0, "together"); a(35.00, "gen-shimmer", -12, 2, "glint")
json.dump({"fps": 60, "frames": 2184, "library": "../../alumni/sound/lib",
           "vo": {"file": "../vo/vo.mp3", "at": 0.4, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -32, "duck_db": 5, "fade_in": 0.1, "fade_out": 1.4},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
