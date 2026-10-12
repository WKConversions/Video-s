# Writes the cue sheet for one cut: the client's voice-over, the music bed, and an effect on every picture
# event that carries meaning, each on the frame it happens (read from the source frame by frame).
#   python3 scripts/cues.py <A|B>        (run from films/gohere; writes sound/cues-<A|B>.json)
# Then: python3 scripts/sound_mix.py sound/cues-A.json out.wav --sheet sound/mix-A.png
# Frames are the film's (30 fps). Effects: the studio's generated ones (gen-*) and Kenney's CC0 interface
# sounds (kenney-*), see sound/lib/sfx/index.json. Vibe: calm, friendly travel; soft sounds, runs of the
# same warm pop rising a scale wherever places land (photos, logos, pins, clients), swishes on the bigger
# moves only, one chime for the message, one success for the save.
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mode = sys.argv[1]
POP = "kenney-drop-003"

FILM = [
    (92, "gen-whoosh-medium", -3, 0, "the photo blurs away into the white stage"),
    (126, POP, -5, 0, "photo 1 lands"), (130, POP, -5, 2, "photo 2"), (136, POP, -5, 4, "photo 3"),
    (140, POP, -5, 7, "photo 4"), (146, POP, -5, 9, "photo 5"),
    (168, "gen-whoosh-short", 0, 0, "the website slides in (fastest frame)"),
    (192, "gen-whoosh-short", -1, 2, "the brochure flies in"),
    (232, "gen-chime", -2, 0, "the first chat bubble is readable"),
    (303, "gen-appear", 0, 0, "the phone forms: GoHere's first appearance (the music opens up at 300)"),
    (371, "gen-whoosh-medium", 0, 0, "one phone fans out into four"),
    (393, POP, -4, 0, "Terschelling logo"), (397, POP, -4, 2, "Transavia logo"),
    (401, POP, -4, 4, "Ciao Tutti logo"), (405, POP, -4, 7, "BarcelonaTips logo"),
    (429, "gen-shimmer", -5, 0, "the colours sweep through the four apps"),
    (451, "gen-whoosh-medium", -9, 0, "the four phones close back into one"),
    (482, "kenney-select-002", 0, 0, "a tile is picked from the list"),
    (488, "gen-whoosh-short", -4, 3, "the tile flies to the phone"),
    (498, POP, -2, 0, "the tile lands in the grid"),
    (536, POP, -4, 0, "pin 1"), (540, POP, -4, 2, "pin 2"), (554, POP, -4, 4, "pin 3"), (558, POP, -4, 7, "pin 4"),
    (591, "kenney-select-002", 0, 0, "a pin is tapped"),
    (596, "kenney-maximize-009", -2, 0, "the place card slides up"),
    (616, "gen-whoosh-short", -2, 0, "the card opens into the place page"),
    (678, "kenney-select-001", -3, 0, "opening hours light up"),
    (698, "kenney-select-002", 0, 0, "Route is tapped"),
    (749, "gen-whoosh-medium", -4, 0, "the phone turns to the next scene"),
    (761, "gen-whoosh-short", -5, 2, "the bucket list slides in"),
    (778, "gen-success", -3, 0, "the saved place joins the list"),
    (803, "kenney-maximize-009", -1, 0, "the share sheet opens"),
    (826, "gen-whoosh-medium", 0, 0, "the portal slides in"),
    (858, "kenney-click-001", 0, 0, "a click on a row in the portal"),
    (872, POP, -4, 4, "the tile moves in the phone"),
    (914, "gen-whoosh-short", -2, 0, "the portal slides away"),
    (960, "gen-shimmer", -3, 0, "the GoHere logo appears"),
    (1009, POP, -3, 2, "the button lands"),
]

timing = json.loads(subprocess.run(["node", os.path.join(ROOT, "overlay", "render.mjs"), "timing", mode],
                                   capture_output=True, text=True, check=True).stdout)[mode]
# after the voice the bed is no longer ducked: the end card's runs sit higher to clear it
END = {"pop": (POP, 3), "tick": ("kenney-tick-004", 1)}
sfx = [{"frame": f, "id": i, "db": db, **({"pitch": p} if p else {}), "note": n} for f, i, db, p, n in FILM]
for c in timing["cues"]:
    sid, db = END[c["sound"]]
    sfx.append({"frame": c["frame"], "id": sid, "db": db, **({"pitch": c["semitones"]} if c["semitones"] else {}), "note": c["note"]})

cue = {
    "fps": 30, "frames": timing["end"], "library": "lib",
    "vo": {"file": "../source/gohere-v1.mp4", "at": 0},
    "music": {"file": f"music/bed-{'40' if mode == 'A' else '37'}.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.5},
    "sfx": sorted(sfx, key=lambda c: c["frame"]),
}
out = os.path.join(ROOT, "sound", f"cues-{mode}.json")
json.dump(cue, open(out, "w"), indent=1)
print(f"{out}: {len(cue['sfx'])} effects over {timing['end']} frames")
