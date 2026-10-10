# Writes sound/cues.json from the film's own timing (film/src/clock.ts BEATS + film/src/words.json), so every
# effect lands on the frame its picture event uses. Times in seconds → frames at 30 fps.
import json, re
src = open("film/src/clock.ts").read()
beats = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", src.split("BEATS")[1].split("};")[0])}
words = json.load(open("film/src/words.json"))
L = {**beats, **words}
def t(pos):
    m = re.match(r"^(.+?)([+-][\d.]+)?$", pos) if isinstance(pos, str) else None
    return pos if not m else L[m.group(1)] + (float(m.group(2)) if m.group(2) else 0)
CUES = [  # (time, id, db, pitch, note)
    (0.45, "shooting-star", -4, 0, "the shooting star crosses the sky"),
    ("window+0.05", "twinkle-1", -5, 0, "the house's windows light up"),
    (1.62, "step-soft", -8, 0, "footsteps on the ridge path"), (2.10, "step-soft", -8, 1, ""), (2.57, "step-soft", -8, -1, ""), (3.05, "step-soft", -9, 1, ""),
    ("door", "door-latch", -5, 0, "the door opens onto warm light"),
    ("inside+0.4", "swell-air", -7, 0, "the room grows out of the door"),
    ("thought", "bloop-1", -6, 0, "thought puff 1"), ("thought+0.17", "bloop-1", -6, 2, "thought puff 2"), ("thought+0.32", "bloop-2", -4, 4, "the thought cloud"),
    ("q1", "bloop-1", -4, 0, "question bubble 1"), ("q2", "bloop-1", -4, 2, "question bubble 2"), ("q3", "bloop-1", -4, 4, "question bubble 3"),
    ("qoff+0.25", "whoosh-soft", -9, 0, "the questions float away"),
    ("bloom+0.05", "shimmer", 0, 0, "the book opens into light"), ("bloom+0.1", "magic-dust", -2, 0, "sparkles rise from the pages"), ("bloom+0.45", "swell-air", -5, 0, "the light swells"),
    ("bookUp+0.55", "whoosh-soft", -7, 0, "the open book comes forward"),
    ("w:tale", "twinkle-2", -3, 0, "the Tale Forge mark appears on the page"),
    ("memory+0.45", "whoosh-soft", -8, 0, "today's moment flies onto the page"), ("today", "bloop-2", -6, -2, "it settles: TODAY"),
    ("flip+0.55", "page-turn", 0, 0, "the page turns"),
    ("paint+0.35", "paint-bloom", -2, 0, "the silhouette is painted into the hero"), ("paint+0.05", "magic-dust", -7, 0, ""),
    ("illus+0.4", "paint-bloom", -3, 0, "the picture blooms across the spread"),
    ("adventure+0.45", "swell-air", -6, 0, "into the adventure"),
    ("w:hero", "twinkle-3", -4, 0, "your child is the hero"),
    ("inside2+0.4", "paint-bloom", -4, 0, "the next page blooms out of Iris"),
    ("listen+0.45", "whoosh-soft", -9, 0, "the page becomes the reader"),
    ("lens+0.05", "twinkle-1", -6, 2, "look closer: the lens"),
    ("decide", "bloop-1", -7, 0, "choice A"), ("decide+0.12", "bloop-1", -7, 2, "choice B"),
    ("choose-0.03", "tap-glass", -5, 0, "the child's touch on B"),
    ("w:choices", "chime-choice", -1, 0, "their choices matter"), ("star", "magic-dust", -4, 0, "the gold star bursts"),
    ("map+0.3", "whoosh-soft", -8, 0, "the star flies to the map"), ("map+0.6", "twinkle-2", -5, 0, "it lands on choice 1"),
    ("w:next-1.6", "riser-soft", -9, 0, "the path builds to the ending"), ("w:next", "twinkle-4", -3, 0, "the ending lights up"),
    ("together+0.4", "paint-bloom", -2, 0, "S3B blooms out of the branch"),
    ("differently+0.1", "whoosh-soft", -10, 0, "the before card arrives"), ("w:differently+0.45", "page-turn", -3, 0, "the card turns: after"), ("w:differently+0.5", "twinkle-3", -6, 2, ""),
    ("close+0.45", "whoosh-soft", -7, 0, "the picture returns to its page"), ("close+1.25", "book-close", -2, 0, "the book closes"),
    ("shelf+0.95", "impact-soft", -11, 0, "the book stands on the shelf"),
    ("ends+0.7", "swell-air", -4, 0, "the ending opens"), ("ends+0.9", "shimmer", -4, 0, ""),
    ("room2+0.5", "swell-air", -6, 0, "back to the lamp-lit room"),
    ("friend", "twinkle-1", -5, -2, "our friend rises from the page"), ("friend+0.1", "magic-dust", -9, 0, ""),
    ("answer", "bloop-2", -6, 0, "the child answers"), ("talk", "bloop-1", -6, 2, "the adult"), ("talk+0.7", "bloop-2", -7, 4, "the child"), ("talk+1.3", "bloop-1", -7, 5, "the adult"),
    ("sky+0.5", "swell-air", -4, 0, "the window opens into the sky"),
    ("cards+0.6", "twinkle-1", -8, 0, "adventure 1"), ("cards+0.82", "twinkle-1", -8, 2, "adventure 2"), ("cards+1.04", "twinkle-1", -8, 4, "adventure 3"), ("cards+1.26", "twinkle-1", -8, 7, "adventure 4"),
    ("one+0.15", "shimmer", -3, 0, "one story tonight: the book glows"),
    ("world+0.1", "magic-dust", -3, 0, "the world blooms out of the book"), ("world+0.7", "swell-air", -3, 0, ""),
    ("tomorrow+0.25", "tap-glass", -7, 0, "the Natt/Morgon switch appears"),
    ("morgon", "tap-glass", -3, 0, "the switch flips to Morgon"), ("morgon+0.1", "shimmer", -4, 0, "dawn"),
    ("logoEnd+0.45", "impact-soft", -8, 0, "the logo arrives"), ("logoEnd+0.5", "twinkle-2", -4, 0, ""),
]
FPS = 30
sfx = []
for tm, id_, db, pitch, note in CUES:
    c = {"id": id_, "frame": round(t(tm) * FPS), "db": db, "note": note}
    if pitch: c["pitch"] = pitch
    sfx.append(c)
cue = {"fps": FPS, "frames": 2100, "library": "lib",
       "vo": {"file": "../vo/vo-en__elevenlabs-spuds-oxley-grandpa.mp3", "at": 1.0},
       "music": {"file": "music/bed-final.wav", "at": 0, "duck_db": 5, "fade_in": 0.0, "fade_out": 2.4},
       "sfx": sfx}
json.dump(cue, open("sound/cues.json", "w"), indent=1)
print(len(sfx), "cues")
