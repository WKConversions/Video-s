# Cue sheet for the Wicflow hero film (33.0 s, 60 fps). Effects lead, a quiet bed of Karl's track ("New Gold",
# instrumental) under Christina's voice-over. Client delivery: only Karl's own sounds, generated ones and Kenney CC0
# (lib-mix = lib-karl without the Apple sounds + the alumni library; gitignored). Each cue sits on a picture event from
# the beat builders' reports (film/src/beats/*.js); the hand's clicks land on their deepest point (at + 0.11 s).
#   python3 make_cues.py && python3 sound_mix.py cues.json mix.wav --sheet mix.png
import json, copy, subprocess, os
LIB = "lib-mix"; idx = json.load(open(f"{LIB}/sfx/index.json")); by = {x["id"]: x for x in idx}
extra = []
def typing(name, start, length):          # a stretch of Karl's soft typing recording, cut to a typing run
    out = f"{LIB}/sfx/ticker/{name}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-i", os.path.join(LIB, by["ui-typing"]["file"]), "-t", str(length),
                    "-af", f"afade=t=in:d=0.02,afade=t=out:st={length - 0.08}:d=0.08", out], check=True)
    e = copy.deepcopy(by["ui-typing"]); e.update(id=name, file=f"sfx/ticker/{name}.wav", length=length, sync=0.0, transients=[]); extra.append(e)
    return name
T2 = typing("wf-type-label", 0.9, 0.7); T3 = typing("wf-type-draft", 0.1, 0.85)
# Karl (13 Nov): "apply Apple keyboard typing under the type-on of the hook": his iPhone keyboard recording
# (iphone-texting, an Apple sound: allowed here because Karl asked for it by name), cut to each type-on run that B1
# exports as TYPING.
def keyboard(n, length):
    i = f"wf-keys-{n}"; out = f"{LIB}/sfx/ticker/{i}.wav"; d = max(0.3, length)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(3.0 + 2.3 * n), "-i", os.path.join(LIB, by["iphone-texting"]["file"]), "-t", str(d),
                    "-af", f"afade=t=in:d=0.02,afade=t=out:st={d - 0.07}:d=0.07", out], check=True)
    e = copy.deepcopy(by["iphone-texting"]); e.update(id=i, file=f"sfx/ticker/{i}.wav", length=d, sync=0.0, transients=[]); extra.append(e); return i
try:
    TYPING = json.loads(subprocess.run(["node", "--input-type=module", "-e", "import {TYPING} from './src/beats/B1.js'; console.log(JSON.stringify(TYPING))"],
                                       cwd="../film", capture_output=True, text=True, check=True).stdout)
except Exception as err:
    print("TYPING not readable from B1.js, using the voice-over's lines:", err); TYPING = [[0.0, 1.08], [1.76, 2.92], [3.5, 4.86]]
KEYS = [(a, keyboard(n, b - a)) for n, (a, b) in enumerate(TYPING)]

C = [  # (film s, id, db nudge against the role level, pitch, note)
 # B1 the hook: three lines typed on (the Apple keyboard runs are added from TYPING below), each turning into its UI
 (1.20, "kenney-maximize-009", -5, 0, "line 1 becomes the quote card (the shell grows out of the text)"),
 (1.62, "ui-digital-click", 0, -2, "'quiet': the reply dots fade, the ring drains to peach"), (1.64, "gen-whoosh-short", -6, 0, "the card docks top left"),
 (2.10, "kenney-select-002", -2, 0, "Open becomes Quiet"),
 (3.05, "kenney-drop-003", -2, 0, "'pile up': the letters drop into enquiry pills"), (3.16, "kenney-drop-003", -2, 2, ""), (3.27, "kenney-drop-003", -1, 4, ""), (3.38, "kenney-drop-003", 0, 6, ""),
 (3.30, "gen-whoosh-short", -6, 2, "the enquiries card docks"),
 (4.96, "kenney-maximize-009", -4, 2, "line 3 becomes the hours card"),
 (5.28, "ui-click-digital-03", -1, 0, "'twice': the same hours row lands in the timesheet"), (5.36, "ui-click-digital-03", -1, 2, "and again in the invoice"),
 # B2 off the shelf never fits: the puzzle
 (5.70, "gen-whoosh-medium", -2, 0, "'Off-the-shelf': the grey template springs in from the right"),
 (5.76, "gen-pop", -3, 0, "new customers tile pops in"), (5.88, "gen-pop", -3, 3, "report tile pops in"),
 (6.26, "ui-beatbox-click-01", 0, 0, "hand click: the person grabs the hours tile"),
 (6.62, "ui-glitch-click", -3, 0, "the quote tile bumps the template edge (orange)"),
 (7.00, "ui-stretch", -3, 0, "enquiries squeezes into a slot"), (7.34, "gen-pop", -2, -3, "and pops back out"),
 (7.46, "uu-click-digital-01", -2, 0, "the hours tile is too wide: it sticks out in orange"),
 (7.64, "ui-granular-button-select", -2, -5, "the template's 'no' shake"), (7.68, "ui-backspace", -1, -2, "the hours tile bounces back"),
 (7.92, "gen-whoosh-short", -3, -2, "the template slides away"),
 (8.02, "kenney-tick-004", -2, 0, "the tiles settle into the company's own arrangement"), (8.17, "kenney-tick-004", -2, 2, ""), (8.32, "kenney-tick-004", -2, 4, ""),
 # B3 the AI mapping
 (8.92, "gen-whoosh-medium", -2, 2, "'First': the company's tiles glide into the mapping"), (9.30, "ui-granular-button-select-2", -1, 0, "the tiles settle"),
 (9.50, "ui", 0, 0, "'we map': the connectors draw, data dots run"),
 (10.02, "kenney-tick-004", 0, 0, "time drops land"), (10.22, "kenney-tick-004", 0, 2, ""), (10.36, "kenney-tick-004", 0, 4, ""), (10.50, "kenney-tick-004", -3, 6, "'time goes'"),
 (10.62, "ui-click-digital-04", -2, 0, "brackets snap onto quotes"), (10.66, "gen-chime", -6, 0, "the highest return is found"),
 (11.02, "gen-whoosh-short", -4, 0, "the window becomes the costed plan"),
 # B4 the costed plan
 (11.20, "kenney-drop-003", -2, 0, "tiles drop into the rows"), (11.40, "kenney-drop-003", -2, 3, ""),
 (11.60, "kenney-maximize-009", 0, 0, "'costed plan': the bars grow"),
 (12.76, "ui-enter", 1, 0, "hand click: the client picks the quote row, it lifts"),
 (13.25, "gen-whoosh-short", -4, 3, "it glides to the top"),
 (13.66, "ui-button", 0, 0, "'first': the plate settles, the 'First block' tag pops"),
 # B5 first block, guaranteed
 (14.45, "gen-whoosh-deep", -3, 2, "the plan card lies down as the ground"),
 (14.80, "ui-backspace", 2, -2, "'block': the first block springs up (a plastic thock)"), (14.98, "gen-impact-soft", -3, 2, "it lands with a squash"),
 (15.05, "gen-pop", -2, 0, "its stud rises"),
 (15.46, "gen-appear", 0, 2, "'guaranteed': the label pops in"),
 (15.05, "kenney-drop-003", -4, 0, "the other blocks pop in, back to front"), (15.40, "kenney-drop-003", -4, 2, ""), (15.75, "kenney-drop-003", -4, 4, ""), (16.10, "kenney-drop-003", -4, 6, ""),
 (16.80, "gen-success", -2, 0, "'agreed': the seal ring closes around the block"),
 (17.02, "gen-pop", -2, 3, "the cost chip pops in"),
 (17.66, "ui-digital-click", 0, -5, "'don't pay': the cost bar drains to nothing"),
 (18.28, "gen-whoosh-whip", 0, 0, "zoom through the first block's top face"),
 # B6 inside the block, it runs
 (18.55, "ui-premium-open", -3, 0, "the automation panel opens"),
 (19.26, "ui-click-digital-04", 0, 3, "'runs': the Running dot starts"),
 (20.22, T3, 2, 0, "the follow-up drafts itself"),
 (20.95, "ui-granular-button-select", 0, 0, "send: the button presses in"),
 (21.10, "kenney-maximize-009", -4, 3, "'Draft ready' slides into the queue"),
 (21.67, "gen-chime", -5, 3, "'quiet': the ring refills, the check pops"),
 (22.00, "gen-whoosh-medium", -3, -2, "back out through the block"),
 # B7 block by block
 (22.42, "kenney-select-001", 2, 0, "'Block': 02 builds"), (22.76, "kenney-select-001", 2, 3, "'block': 03 builds"),
 (23.30, "gen-whoosh-short", -4, 0, "the price document slides in"),
 (23.86, "ui-click", 0, 0, "hand click: the signature line, the signature draws itself"),
 (24.55, "kenney-select-001", -9, 5, "04 builds"), (24.70, "kenney-select-001", -6, 7, "05 builds"),
 # B8 all of it connected
 (25.16, "kenney-select-002", 0, 0, "light lines climb, block to block"), (25.45, "kenney-select-002", 0, 2, ""), (25.75, "kenney-select-002", -4, 4, ""),
 (26.05, "kenney-select-002", 0, 5, ""), (26.40, "kenney-select-002", 0, 7, ""),
 (26.76, "gen-impact-soft", -5, 3, "'connected': block 06 turns solid"),
 (27.02, "gen-shimmer", -2, 0, "the wave lights every stud"),
 # B9 the end card and the CTA press
 (27.75, "gen-whoosh-deep", -4, 3, "the system rises above the lockup"),
 (28.38, "gen-appear", -1, 0, "the mark reveals"),
 (29.02, "gen-pop", -1, 5, "the button pops in"),
 (30.41, "ui-beatbox-click-01", 2, -2, "THE CTA PRESS (the deepest point of the hand's click)"), (30.42, "gen-impact-deep", -2, 0, "the press lands"),
 (30.55, "ui-open", -2, 0, "the button releases, the ripple spreads"),
]
fx = [{"frame": round(t * 60), "id": i, "db": db, "pitch": p, "note": n} for t, i, db, p, n in C]
json.dump([x for x in idx if not x["id"].startswith(("wf-type", "wf-keys"))] + extra, open(f"{LIB}/sfx/index.json", "w"), indent=1)
C += [(a, k, 3, 0, "Apple keyboard typing under the hook's type-on") for a, k in KEYS]
fx = [{"frame": round(t * 60), "id": i, "db": db, "pitch": p, "note": n} for t, i, db, p, n in C]
json.dump({"fps": 60, "frames": 1980, "library": LIB, "allow_apple": True,
           "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
           "music": {"file": "music/bed_fit.wav", "at": 0, "lufs": -27, "duck_db": 6, "fade_in": 0.05, "fade_out": 0.6},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
