# Writes the v2 cue sheet (sound/v2/cues.json) from the film's own timing labels, so every effect sits on the frame
# of the picture event it belongs to. Labels resolve like the film's T2 clock: v1 beats (src/clock.ts), the v2 beats
# (src/v2/labels.ts) over them, and the VO's words (src/words.json, "w:word"); "label+0.3" / "label-0.2" offset in s.
#   python3 -I build_cues_v2.py            (run from films/tale-forge)
import json, re

src = "film/src/"
def table(path, name):
    body = re.search(name + r"[^=]*=\s*\{(.*?)\};", open(path).read(), re.S).group(1)
    return {k: float(v) for k, v in re.findall(r"([A-Za-z0-9_]+):\s*([0-9.]+)", body)}
LAB = {**table(src + "clock.ts", "BEATS"), **table(src + "v2/labels.ts", "V2"), **json.load(open(src + "words.json"))}

def t(expr):
    m = re.match(r"^(.*?)([+-][0-9.]+)?$", expr)
    base, off = m.group(1), float(m.group(2) or 0)
    return (LAB[base] if base else 0.0) + off

# (when, effect, dB nudge, pitch in semitones, what it is) — "when" is a label expression or a number of seconds
C = [
    # --- home: a crayon moon, a crayon house, Iris hops home ------------------------------------------------------
    (0.0, "night-crickets", -13, 0, "a quiet night under the opening", {"auto_level": False}),
    ("house+0.02", "crayon-long", -3, 0, "the moon and the ground are drawn"),
    ("house+0.42", "crayon-mid", -5, 2, "the house walls and roof"),
    ("house+0.75", "crayon-short", -6, 0, "the chimney"),
    ("house+0.62", "glock-ding", -7, 7, "the moon fills with light"),
    ("path+0.05", "tap-soft", -9, 0, "the path is dabbed on, dot by dot"),
    ("path+0.3", "tap-soft", -10, 0, ""),
    ("path+0.55", "tap-soft", -10, 0, ""),
    ("path+0.8", "tap-soft", -11, 0, ""),
    ("house+1.0", "crayon-short", -7, 3, "the door and the smoke"),
    ("lit", "vibe-ring", -4, 0, "the window lights up"),
    ("lit+0.05", "magic-dust-short", -11, 0, ""),
    ("house+1.53", "triangle", -12, 0, "the big star fills"),
    ("house+1.67", "glock-ding", -9, 9, "the small star fills"),
    ("walk+0.455", "pizz-step", -3, 0, "Iris hops: landing 1"),
    ("walk+0.909", "pizz-step", -3, 2, "landing 2"),
    ("walk+1.364", "pizz-step", -3, 4, "landing 3"),
    ("walk+1.818", "pizz-step", -4, 5, "landing 4, at the door"),
    ("door2-0.08", "door-creak", -6, 0, "the door creaks open"),
    ("door2", "chimes-rise", -3, 0, "warm light pours out of the door"),
    ("door2+0.1", "magic-dust", -9, 0, "sparks from the doorway"),
    ("face+0.15", "whoosh-air", -7, 0, "through the door, to Iris's face"),
    # --- Iris's day, drawn around her in crayon -------------------------------------------------------------------
    ("d1", "crayon-scribble", -4, 0, "the children playing in a ring are drawn"),
    ("d1+0.35", "crayon-mid", -6, 2, ""),
    ("d1+0.5", "crayon-short", -7, 0, "their smiles"),
    ("d1+0.8", "pop-up", -7, 5, "their ball fills in gold"),
    ("d2", "crayon-mid", -5, -2, "one child apart, head down"),
    ("d2+0.3", "harp-pluck", -11, -5, "a single low note for the child alone"),
    ("d3", "crayon-circle", -5, 0, "a little rain cloud"),
    ("d3+0.42", "drop", -8, 0, "rain drops"),
    ("d3+0.66", "drop", -9, -2, ""),
    ("d3+0.9", "drop", -9, 3, ""),
    ("d3+1.12", "drop", -10, -1, ""),
    ("tangle", "whoosh-flick", -8, 0, "the doodles fly into a knot"),
    ("tangle+0.07", "crayon-tangle", -2, 0, "the tangle over her head"),
    ("warm", "glock-ding", -11, -5, "the picture warms"),
    ("thread", "glock-drift", -4, 0, "the tangle unwinds into a gold thread"),
    ("thread+0.05", "crayon-long", -10, 4, ""),
    ("w:isn't-0.07", "pluck-question", -3, 0, "question 1 pops up"),
    ("w:another-0.07", "pluck-question", -3, 2, "question 2"),
    ("w:question-0.07", "pluck-question", -3, 4, "question 3"),
    ("qaway+0.1", "whoosh-puff", -7, 0, "the questions blow away"),
    ("qaway+0.05", "glock-fall", -12, 0, ""),
    ("night+0.25", "whoosh-deep", -9, 0, "night falls; the book rises"),
    # --- "It's a story." -----------------------------------------------------------------------------------------
    ("w:story", "belltree", -1, 0, "the book opens into light"),
    ("w:story-0.05", "magic-dust", -4, 0, "sparkles burst from its pages"),
    ("w:story+0.3", "nepal-bells", -7, 0, "the second burst"),
    ("bookUp+0.45", "whoosh-air", -8, -3, "the open book comes forward"),
    ("logo", "glock-ding", -5, 0, "the Tale Forge mark appears on the page"),
    ("logo+0.05", "chimes-twinkle", -11, 0, ""),
    ("memory", "crayon-scribble", -6, 2, "today's moment is drawn on the page"),
    ("memory+0.35", "crayon-short", -8, 0, ""),
    ("memory+0.6", "crayon-short", -8, 3, "the child apart"),
    ("memory+0.73", "pop-up", -8, 7, "the ball fills"),
    ("today-0.02", "stamp", -2, 0, "stamped TODAY"),
    ("flip+0.37", "page-turn", 0, 0, "the page turns"),
    ("line+0.05", "crayon-mid", -9, 5, "Iris is drawn in gold line"),
    ("line+0.35", "magic-dust-short", -9, 0, ""),
    ("paint2", "bubbles", -3, 0, "she is painted in watercolour"),
    ("paint2+0.1", "chimes-twinkle", -8, 0, "sparkles off the paint"),
    ("illus", "bubbles-2", -5, 0, "the painting blooms across the spread"),
    ("adventure+0.25", "whoosh-deep", -4, 0, "we fall into the picture"),
    # --- inside the story (the sample book) -----------------------------------------------------------------------
    ("hero+0.05", "pop-up", -9, 4, "Iris, the hero: her label"),
    ("hero+0.88", "chimes-twinkle", -4, 0, "your child is the hero"),
    ("inside2+0.38", "bubbles-2", -6, 0, "the next page blooms out of Iris"),
    ("mossa", "pizz-step", -8, 12, "Mossa, the mouse, appears"),
    ("amina+0.05", "pop-up", -9, 7, "Mossa's label"),
    ("listen", "tap-soft", -6, 0, "Listen: hear the narrator"),
    ("listen+0.05", "glock-ding", -11, 4, ""),
    ("listen+0.43", "whoosh-air", -6, 2, "the page becomes the reader"),
    ("read+0.05", "crayon-mid", -7, 0, "the line is highlighted as it is read"),
    ("lens+0.05", "triangle", -6, 0, "look closer: the lens"),
    ("decide-0.02", "pop-up", -6, 0, "choice A"),
    ("decide+0.12", "pop-up", -6, 3, "choice B"),
    ("choose-0.02", "tap-soft", -3, 0, "the child's touch on B"),
    ("choose+0.15", "harp-pluck", -4, 4, "the choice is taken"),
    ("star+0.02", "glock-sparkle", -4, 0, "the gold star bursts"),
    ("star+0.05", "magic-dust-short", -8, 0, ""),
    # --- consequence: the map, the ending ------------------------------------------------------------------------
    ("map+0.3", "whoosh-flick", -6, 0, "the star flies to the map"),
    ("map+0.6", "glock-ding", -6, 4, "it lands on choice 1"),
    ("map+1.2", "crayon-long", -7, 0, "the gold path builds to the ending"),
    ("next+0.1", "chimes-rise", -4, 0, "the ending lights up"),
    ("together+0.38", "bubbles", -5, 0, "the found ending blooms out of the branch"),
    ("together+0.45", "chimes-twinkle", -9, 0, ""),
    ("differently+0.1", "whoosh-air", -9, 0, "the before card arrives"),
    ("41.0", "page-turn-2", -3, 0, "the card turns: after"),
    ("41.07", "glock-ding", -8, 7, ""),
    ("41.73", "whoosh-flick", -5, -2, "the picture returns to its page"),
    ("42.53", "book-close", -2, 0, "the book closes"),
    ("43.17", "book-land", -11, 0, "it stands on the shelf"),
    ("ends", "triangle", -7, 0, "the ending's medal"),
    ("endmark-0.1", "chimes-rise", -5, 0, "the ending opens"),
    # --- the conversation ---------------------------------------------------------------------------------------
    ("talk2+0.05", "vibe-ring", -8, 0, "the medallion opens into the picture"),
    ("talk2+0.4", "whoosh-air", -10, -3, ""),
    ("ring", "crayon-circle", -4, 0, "our friend is ringed in gold crayon"),
    ("ring+0.6", "triangle", -9, 0, "a star"),
    ("ring+0.73", "glock-ding", -12, 7, "a second star"),
    ("b1-0.07", "pop-up", -3, 0, "Iris's bubble"),
    ("b1-0.05", "harp-pluck", -8, 0, ""),
    ("b2-0.07", "pop-up", -3, 2, "Amina's bubble"),
    ("b2-0.05", "harp-pluck", -8, 4, ""),
    ("b3-0.07", "pop-up", -3, 4, "Iris again"),
    ("b3-0.05", "harp-pluck", -8, 7, ""),
    ("b4-0.07", "pop-up", -3, 5, "Amina again"),
    ("b4-0.05", "harp-pluck", -8, 9, ""),
    ("rise", "magic-dust", -7, 0, "the bubbles rise and become stars"),
    ("rise+0.65", "glock-rise", -5, 0, ""),
    # --- the sky of adventures ----------------------------------------------------------------------------------
    ("sky+0.05", "chimes-slow", -5, 0, "into the sky of adventures"),
    ("52.45", "whoosh-flick", -10, 0, "the adventures fly in"),
    ("52.5", "glock-ding", -7, 0, "adventure 1"),
    ("52.73", "glock-ding", -7, 4, "adventure 2"),
    ("52.93", "glock-ding", -7, 7, "adventure 3"),
    ("53.17", "glock-ding", -7, 12, "adventure 4"),
    ("one+0.15", "belltree-2", -5, 0, "one story tonight: the book glows"),
    ("world+0.1", "magic-dust", -4, 0, "the world blooms out of the book"),
    ("astro-0.1", "whoosh-deep", -8, 0, ""),
    ("astro+0.3", "chimes-rise", -6, 0, ""),
    # --- tomorrow: Natt becomes Morgon, the sign-off ------------------------------------------------------------
    ("58.47", "tap-soft", -3, 0, "the Natt / Morgon switch appears"),
    ("morgon", "tap-soft", -9, 0, "the switch flips to Morgon"),
    ("morgon+0.02", "pop-up", -10, 7, ""),
    ("morgon+0.1", "chimes-rise", -4, 0, "dawn"),
    ("morgon+0.2", "morning-birds", -12, 0, "morning birds", {"auto_level": False}),
    ("logoEnd", "timp-soft", -9, 0, "the logo arrives"),
    ("logoEnd+0.2", "belltree", -4, 0, ""),
    ("tag+0.05", "magic-dust-short", -7, 0, "Adventures worth talking about."),
    ("line2+0.05", "nepal-bells-2", -11, 0, "A world they belong to."),
    ("line3+0.05", "chimes-twinkle", -7, 0, "A story you share."),
    ("url+0.05", "glock-ding", -9, 7, "the address"),
    ("67.8", "magic-dust", -10, 0, "a last sparkle on the final chord"),
]

sfx = []
for row in C:
    when, sid, db, pitch, note = row[:5]
    extra = row[5] if len(row) > 5 else {}
    sec = t(when) if isinstance(when, str) and not re.match(r"^[0-9.]+$", when) else float(when)
    c = {"id": sid, "frame": int(round(sec * 30)), "db": db}
    if pitch: c["pitch"] = pitch
    if note: c["note"] = note
    c.update(extra)
    sfx.append(c)
sfx.sort(key=lambda c: c["frame"])
cue = {"fps": 30, "frames": 2100, "library": "lib",
       "vo": {"file": "../../vo/vo-en__elevenlabs-spuds-oxley-grandpa.mp3", "at": 1.0},
       "music": {"file": "music/score.wav", "at": 0, "duck_db": 4, "fade_in": 0.0, "fade_out": 0.6},
       "sfx": sfx}
json.dump(cue, open("sound/v2/cues.json", "w"), indent=1)
print(f"sound/v2/cues.json: {len(sfx)} effects, {len({c['id'] for c in sfx})} different sounds, "
      f"{sum(1 for c in sfx if c['frame'] < 900)} in the first 30 s, {sum(1 for c in sfx if c['frame'] >= 900)} after")
