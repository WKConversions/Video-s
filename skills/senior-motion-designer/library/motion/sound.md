# Sound and motion

Sound reinforces motion hierarchy. A sound earns its place when it confirms an impact, clarifies a
transition, adds scale, builds anticipation, adds texture, establishes an environment or guides the
rhythm. Sound is mixed after the picture is locked to the voice-over, from a cue sheet, by measurement:
the build sandbox has no speakers, so every level and every sync point is read from the waveform, and
Karl's ear has the final say.

## The sound library

Karl's effects are filed by role in `sound/sfx/<category>/`, listed in `sound/catalogue.md` with each
sound's character, sync point, length and licence. Generated whooshes, risers, impacts, a stamp, a
shimmer and a swell fill what the folder lacks (`scripts/sfx_synth.py`; royalty-free, sync exact).
Sounds marked `karl` come from Karl's own motion-design pack (October 2026): cinematic whooshes and
risers, gears, money, data and glitch sounds, and more taps and pops; use them in client films. Sounds marked `cc0` are Kenney's Interface Sounds (public domain): clean, short UI
sounds, and the only `error` sounds. Sounds marked `apple` are Apple's system sounds: reference and internal drafts only, never a client
delivery (the mixer refuses them). New sounds: `sfx_index.py` measures them and draws their waveforms,
you judge their role in `sound/categories.json`, then `sfx_build.py` and `sfx_synth.py` rebuild the library.

For storybook, fairytale and magical films there are two ready kits: `sfx_kit.py` (recorded CC0 instruments from
VSCO 2 Community Edition, such as glockenspiel runs, wind chimes, a bell tree, harp strings and glissandi, pizzicato
hops, water bubbles for watercolour and a cymbal swell, plus generated foley: page turns, a book closing, a rubber
stamp, pops, raindrops, air whooshes, crickets and morning birds) and `sfx_fairy.py` (generated twinkles, magic dust,
a shooting star, bloops). Tuned sounds (`pizz-step`, `harp-pluck`, `glock-ding`) take the cue's `pitch` so a run
climbs a scale in the music's key. A sound that implies an activity the client doesn't do (crayon scribbles for a
company that isn't about drawing) stays out.

## Hear a sound before choosing it

Every sound in the library has been heard by an audio-language model (`scripts/sfx_hear.py`, CLAP), and the index
carries what it heard: tone scales from 0 to 1 across the library (soft–harsh, warm–cold, premium–toy,
playful–serious, subtle–prominent, organic–digital), a fit for each film vibe (corporate-tech, calm-premium,
playful-social, energetic-startup, cinematic, friendly-human, data-ai, retro-game) and what it sounds like. So a
sound is chosen by how it feels in the film, not only by its role and waveform:
- `python3 scripts/sfx_hear.py pick sound "calm premium corporate" --role whoosh --n 6` ranks a role's sounds for
  the film's vibe (it never offers Apple's sounds);
- `python3 scripts/sfx_hear.py describe file.wav` says what any file sounds like, a new download or a reference.
Pick from the top of the ranking, then check the choice by its tone: a calm film wants soft, warm, subtle and
premium near the top of their scales; a playful one can take playful and prominent; never a toy or retro sound
in a premium film. The model names a sound right about 7 times in 10: trust the scales and the ranking, and read
a surprising result against the sound's name and character.

## The sound follows the speed graph

The move's speed graph (`motion/speed-graphs.md`) says where its sound sits and what kind it is:

| Speed graph | Sound | On which frame |
|---|---|---|
| A1, A2 whip through a cut; B16 zoom-through | a whoosh whose loudest moment is the cut (short for a shape, medium for a scene) | the cut: the whoosh's sync point on the fastest frame |
| A3, A7 pop with elastic; B5 overshoot | a pop or bubble | the landing (the key before the settle), not the first visible frame; the settle stays silent |
| A4 drop in, land, hold, drop out | a soft swish under the fall, a pop or soft impact on the landing, nothing on the hold, the exit's whoosh at its cut | each cut and the landing |
| A5 word cascade | nothing per word; one soft swish or none under the line | the first word |
| A6 type-on | soft key clicks, a few for the fast start, fewer as it trickles, never one per letter | from the first character |
| B6 anticipation | a small intake (a short reverse swell) under the pull-back, the whoosh on the launch | the launch's fastest frame |
| B7 accelerate into an impact; B8 drop | a stamp, thud or soft impact; for a bounce, a smaller one on the first bounce only | the contact frame |
| B9 follow-through | one sound for the leader; followers are silent | the leader's landing |
| B10, B11 constant, steady progress | a quiet bed (a soft gear, a data stream, an airy tone) or nothing | under the whole move, low |
| B12 fast–slow–fast | a whoosh in, silence in the slow middle, a whoosh out | each fast end |
| B13 step, hold, step | a tick or tap per step, on the beat | each step's landing |
| B14 finger flick | a light swipe | the push |
| B15 breathing, B17 sweep | nothing for the breath; a soft slide per sweep at most | |

The speed graph also says how hard: the larger and faster the move, the fuller the sound (in a calm film still
soft). A whip's whoosh should peak exactly where the speed graph peaks, so the sound and the fastest frame feel
like one event.

## Which sound for which moment

| Picture event | Category | How |
|---|---|---|
| a finger or cursor touches a button | tap | one tap sound for the whole film: it becomes the product's voice; a cursor click is crisper than a finger tap |
| a toggle, a press-and-release | double-tap | |
| something small appears: a pin, a badge, a tile landing | pop | a run of them: one pop each on the stagger, pitched up a scale (+2, +4, +7 semitones), never the same pitch four times |
| many items in an even stagger | ticker | a ticker whose spacing matches the stagger (`floraphonic-ui-pop-up-15`: a tick every 0.1 s, 3 frames at 30 fps) |
| a sheet, card or window opens | appear-rise | |
| something closes, leaves, switches off | dismiss-fall | |
| a message arrives | chime | the first message only, not every bubble |
| saved, sent, done, paid | success | the payoff: once or twice a film, on the action the voice names |
| a screen pushes in, a soft slide | swipe | |
| a camera move, a card flying, a pan | whoosh | short for cards and words, medium for camera moves, whip for whip pans, deep for a big pull-back; Karl's cinematic whooshes for a colour field or scene opening, the generated ones for small, exact moves |
| a build into a reveal | riser | ends on the reveal frame |
| a dial turns, a counter winds, a part fits into a system, a process runs | gear | a short ratchet under a rotation or a counter rolling; under a long process, a soft one, low |
| a payment, a sale, revenue, a price | money | literal: only where money is the subject the voice names, once |
| data loads, is collected, scanned or analysed; an AI thinks | data | under the visual of the data moving, low; a stream for a scan, blips for items found |
| something fails, is rejected, breaks: the problem beat | error | soft and short, once: the viewer should feel the problem, not be startled |
| a screen switches, text glitches, a tech reveal | glitch | only in a film whose look is digital; once or twice |
| a landing, a logo locking in, a stamp | impact | soft for a UI landing, deep for the end card |
| a brand moment, a reveal | stinger (shimmer) | |
| a scene breathing in, a slow push | swell | |

## Sync, from the waveform

- Every sound has a measured sync point (`sync` in `sound/sfx/index.json`): the first strong transient
  of a click or pop, the loudest moment of a whoosh or swell, the end of a riser's climb. The cue gives the
  picture frame; the mixer starts the file `sync` seconds before it.
- The picture frame: a tap on the frame the finger or cursor touches (the ripple's first frame, the
  button's press); a pop on the frame the element reaches full size (with an overshoot ease, the
  overshoot's peak), not its first visible frame; a whoosh at the middle of the move, its fastest frame;
  a riser on the reveal; an impact on the landing; a chime when the bubble is readable.
- On the frame, or one frame late; never early. Viewers notice sound before picture at about 45 ms,
  but sound after picture only at about 125 ms.
- Staggered items get their sounds on the same stagger. Read the frames from the code's keys (the
  `tw(g, start, end)` spans): the cue is part of the timing sheet, not a guess from the render.

## Density and tone

- The brief's tone sets the density, as it sets the motion (`motion/timing.md`). Calm, warm or human:
  sparse, soft, rounded sounds, few whooshes, one success. Energetic or tech: denser, crisper, whips
  and risers.
- Sound the actions the voice-over names and the actions a viewer would do (taps, saves, shares); let
  secondary motion (drift, parallax, the camera's breathing) stay silent.
- There is no right number (Karl: "never a precise amount; you have to know the style and vibe of the video").
  Decide by the vibe and by the picture: a calm film sounds only the moves that carry meaning and lets the rest
  breathe; an energetic one sounds most arrivals and every cut; a premium one fewer, softer, longer sounds. Ask of
  each cue: would the viewer miss it? If not, it goes. (For information: the calm GoHere film carried 41 effects
  in 37 s and that was at the busy end; the K.B film, approved, fewer.)
- Leave a short silence before the payoff; the end card's last chord or impact needs room.
- Under speech: only the action itself, nothing that covers a word.

## Palettes from the references

Heard with `scripts/ref_sound.py` on Karl's 25 reference films: voice removed, the music's repeating pattern
filtered out, and the sound around each big move of the picture compared with random moments. The model's
readings are estimates, so take the pattern, not the counts:
- **The music leads.** Every reference runs one light bed under the whole film, nearly always upbeat corporate pop
  or a steady electronic pulse (a few lo-fi or funky); it carries much of the motion on its own.
- **Effects are sparse and soft, and they sit on the moves.** In 16 of the 25 films a sound lands on a big move
  clearly more often than at a random moment, but in none on every move: the important moves are sounded, the rest
  ride the music.
- **The sound on a move is a soft swish**, far more often than a big whoosh; then soft digital blips for interface
  events, an impact where a word or object lands hard, a chime for a message or a success. Risers, shimmers and
  pops are rare.

By vibe (with the films that show it):
- **Calm, clean interface films** (Fellow, Lovio, Benefits Science, CalcuQuote, pretaa, SmileGenius): a soft swish
  on the bigger moves only, soft blips when the interface responds, a chime for a notification; much of the film
  is music alone.
- **Playful illustration and 3D** (UpSend, JOS, Dripc, JustCall): a swish on most moves, soft impacts and pops on
  landings, a coin or cash sound where money is the subject.
- **Punchy kinetic type** (Qwilr, Kaelio, SKUVE, Vela): sounds on most word hits, impacts and clicks as
  punctuation, swishes under the moves, all tight to the beat.
- **Footage and people** (Happy, Faronics, Shopgenie, Seed Fitness): very few effects; the music and the footage
  carry it, with a soft swish on a transition now and then.
- **Dark tech** (Qualetics, elyxir, FCS, kyvos): swishes on the moves, digital blips and an occasional shimmer or
  chime for the tech moments.

So for a film: choose the vibe, take its palette, pick each sound by ear for that vibe (`sfx_hear.py pick`), place
it by the move's speed graph, and leave the moves that don't carry meaning to the music.

## Levels

- Voice −16 LUFS, the reference. Music bed −27 LUFS, ducked 5–6 dB more while the voice speaks; a
  client who asks for "music low in the mix" gets exactly this. Effects by role: taps −31, pops and
  appear-rises −29, whooshes −30, chimes −28, success and impacts −27 (`sound_mix.py`, `ROLE_LUFS`).
- The mixer measures each effect against what plays under it, over the loudest 100 ms (the ear's window
  for short sounds): an effect that doesn't clear the bed by 3 dB is felt, not heard, and is lifted up to
  4 dB, but never to within 4 dB of the speaking voice. Read its report; repeated lifts on one bed mean
  the bed is too busy under the effects.
- Master: −15 LUFS integrated with peaks under −1.5 dBFS, 48 kHz, exactly the film's length; the
  web encode carries it as it is (`production/coded-render.md`).

## Music

Choose by the brief's vibe, then measure:

| Vibe | Instruments | Tempo | Density |
|---|---|---|---|
| calm, warm, human | piano, acoustic guitar, soft pads | 80–110 BPM | under 2 onsets a second |
| optimistic, confident | folk pop, corporate pop | 100–120 BPM | 2–2.5 |
| tech, precise | minimal electronic, plucks | 110–125 BPM | 2–3 |
| cinematic, premium | film score, strings, swells | 70–100 BPM | slow builds |
| playful | ukulele, glockenspiel, claps | 110–130 BPM | 2.5–3 |

- **Find** (`music_find.py`) when a produced track fits: real instruments and a real mix beat anything
  synthesized. Mixkit tracks need no credit; Incompetech's need "Music by Kevin MacLeod (incompetech.com),
  CC BY 4.0". Never commercial songs; Pixabay and similar block scripts and can't be checked anyway.
  Look at the candidates' energy curves: a dense track fights the voice.
- **Fit** (`music_fit.py`): the music opens up on the film's turn (`--lift`, the problem-to-solution
  moment), the song's own ending lands on the end card (back-timed through one join on a bar line, where
  the two bars sound most alike), and the edit is pre-rolled so the film never opens in silence.
- **Compose** (`music_make.py`) when nothing found fits the arc, the length is odd, or the film needs its
  hits on exact frames: a brief with the tempo, key, vibe and sections by bar, each lift on a film beat.
- **Compose on real instruments** (`score_sampled.py`) when the film needs a score rather than a bed (a
  storytelling or brand film, an orchestral or fairytale tone) or the client asks for music that isn't
  copyrighted: an original piece played by a sampled chamber orchestra (VSCO 2 Community Edition, CC0), so there
  is nothing to license or credit. Cut the tempo map to the picture: each section starts on the VO phrase it
  carries, with its bar length set so the bar lines land there; tender and quiet where the story is, the tune in
  the gaps of the voice, the climb into the logo, the last chord ringing after the last word. Under a voice use the
  softest velocity layers. The sandbox can't listen, so check it by measurement (`score_check.py`: the written
  chord tones should carry about 75–85 % of each bar's pitch energy, no stem should jump 8 dB in one bar, no clicks)
  and look at it with `audio_look.py`.
- **Sources that close:** FreePD (public-domain music) shut down in 2026; check a source still answers before
  planning on it. Mixkit, Incompetech and the VSCO samples (via `git clone`) worked from the sandbox in October 2026.
- When unsure, mix both over the same cues (`sound_mix.py --music`) and deliver both, saying which you'd
  pick and why.
- Read the bed and the mix by eye with `audio_look.py`: the sections arrive where planned, the voice's
  harmonics stay above the bed, the last chord rings out after the last word, nothing clips.
- Credit the track in the film's README (title, artist, source, licence).

## The workflow

1. After the picture is locked to the voice-over, list the picture events with their frames.
2. Write `sound/cues.json`: one line per cue with a `note` saying what it is for. On a timed project, write the
   cues against the film's labels and VO words instead of frames (`cues_from_labels.py`), so they follow every
   retime. "Effects all over the film" means a sound on every picture event, roughly one to two a second, not a
   wall: quiet ones (taps, dust) under the voice, the bigger ones (a book opening, a logo) in its gaps. An ambience
   bed is a cue too, with `"auto_level": false` so the mixer keeps it at its written level.
3. Find or compose the music; fit it to the film.
4. `python3 sound_mix.py sound/cues.json public/audio/mix.wav --sheet mix.png`; read the level report
   and the sheet (voice, music and effects on one timeline, every effect's frame marked).
5. Point the film's audio at the mix, render, and run the quality check.

- **Voice-over:** placing a recording and retiming the picture to its words is in
  `planning/voice-over.md`.
- **Music first:** music shapes the cut, so ask for the track at the storyboard stop
  (`planning/intake.md`); if Karl has none, find or compose one as above and say which.
