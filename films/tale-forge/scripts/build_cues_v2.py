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
    # --- the library at dusk (S1): light only ------------------------------------------------------------------
    ("w:some", "chimes-twinkle", -9, 0, "the evening sky in the window lights up"),
    ("w:child", "vibe-ring", -9, 0, "a soft key light finds Iris"),
    ("w:home-0.1", "whoosh-air", -11, -3, "warm room light on 'home'"),
    ("face", "bubbles-2", -8, 0, "the close-up blooms out of her face"),
    ("w:play+0.1", "glock-fall", -13, 0, "a cool shadow settles"),
    ("w:with-0.05", "whoosh-flick", -10, 0, "her eyeline: the window seat she saved"),
    ("w:and-0.6", "bubbles-2", -9, 0, "back to her, out of the rolled paper"),
    ("w:and", "chimes-slow", -8, 0, "a warm light rises from below"),
    ("w:feeling", "triangle", -11, 0, "the light reaches her eyes"),
    ("w:isn't", "whoosh-deep", -10, 0, "night falls"),
    ("night+0.2", "whoosh-air", -9, -3, "the blank book rises out of the warm light"),
    ("w:story", "belltree", -1, 0, "the book opens into light"),
    ("w:story-0.05", "magic-dust", -4, 0, "sparkles burst from its pages"),
    ("w:story+0.3", "nepal-bells", -7, 0, "the second burst"),
    # --- the book ---------------------------------------------------------------------------------------------
    ("bookUp+0.5", "whoosh-air", -8, -3, "the open book comes forward"),
    ("w:tale", "glock-ding", -5, 0, "the Tale Forge mark on the page"),
    ("w:small", "bubbles", -5, 0, "today's moment paints onto the page"),
    ("w:today", "vibe-ring", -8, 0, "a warm light rims it"),
    ("w:can+0.37", "page-turn", 0, 0, "the page turns"),
    ("w:personalised", "chimes-rise", -4, 0, "the painted hero blooms on the new page"),
    ("w:personalised+0.05", "bubbles-2", -8, 0, ""),
    ("w:illustrated", "bubbles", -5, 0, "her world paints in around her"),
    ("w:adventure+0.2", "chimes-rise", -5, 0, "the page's light floods out"),
    ("w:adventure+0.35", "whoosh-deep", -6, 0, ""),
    # --- inside the story -------------------------------------------------------------------------------------
    ("w:child2", "triangle", -9, 0, "a key light on the hero"),
    ("w:hero", "glock-sparkle", -4, 0, "a gold halo, sparkles"),
    ("w:inside+0.2", "page-turn-2", -2, 0, "the cover opens towards us"),
    ("w:characters", "pizz-step", -8, 12, "a light on Mossa"),
    ("w:characters+0.05", "glock-ding", -10, 7, ""),
    ("w:stories", "whoosh-flick", -11, 0, "the light glides to Amina"),
    ("w:own", "harp-pluck", -7, 4, "Amina lit"),
    ("w:they4-0.2", "bubbles", -6, 0, "the reading page blooms out of the book"),
    ("w:listen-0.1", "pop-up", -6, 0, "Hear the narrator"),
    ("w:read", "magic-dust-short", -10, 0, "the line is read, highlighted"),
    ("w:look-0.1", "glock-ding", -6, 12, "look closer: the lens"),
    ("w:look", "triangle", -11, 0, ""),
    ("w:decide", "harp-pluck", -5, 0, "a light on Amina: one way"),
    ("w:what", "harp-pluck", -5, 4, "a light on Mossa: the other"),
    ("w:want", "magic-dust-short", -11, 0, ""),
    ("w:choices", "chimes-rise", -5, 0, "the choice warms; the girls come together"),
    ("w:matter", "glock-sparkle", -4, 0, "sparkles rise"),
    ("w:one", "triangle", -9, 0, "the chosen light becomes one bright point"),
    ("w:change+0.37", "page-turn-2", 0, 0, "the page turns"),
    ("w:happens-0.1", "whoosh-air", -8, 0, "four endings fan out"),
    ("w:happens", "nepal-bells-2", -9, 0, ""),
    ("w:next", "glock-ding", -4, 7, "this path's ending lights up"),
    ("w:next+0.05", "magic-dust-short", -9, 0, ""),
    ("w:and3", "whoosh-puff", -10, 0, "the endings fall away"),
    ("w:sometimes2", "vibe-ring", -9, 0, "page 1 comes into focus"),
    ("w:helps-0.3", "chimes-slow", -9, 0, "the focus racks to Amina, smiling"),
    ("w:things+0.37", "page-turn", -1, 0, "the page turns: together"),
    ("w:differently", "chimes-rise", -5, 0, "window light across all three"),
    # --- a story they can return to ----------------------------------------------------------------------------
    ("w:a6+0.3", "whoosh-air", -10, 0, "the page draws back into a book"),
    ("w:story3+0.6", "book-close", -2, 0, "the book closes"),
    ("w:return", "magic-dust", -6, 0, "and opens again"),
    ("w:return+0.1", "page-turn-2", -3, 0, ""),
    ("w:ends", "glock-ding", -7, 0, "The End"),
    ("w:ends+0.05", "triangle", -11, 0, ""),
    # --- the conversation ---------------------------------------------------------------------------------------
    ("w:what3-0.1", "whoosh-air", -10, -3, "back into the page"),
    ("w:friend-0.2", "vibe-ring", -7, 0, "a light on our friend, Mossa"),
    ("w:conversation", "chimes-slow", -6, 0, "the light opens onto all three"),
    ("w:doesn't", "magic-dust", -4, 0, "The End lifts off as gold motes"),
    ("w:doesn't+0.1", "glock-rise-2", -9, 0, ""),
    ("w:a7", "harp-gliss-down", -11, 0, "evening comes in"),
    ("w:together", "triangle", -11, 0, ""),
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
