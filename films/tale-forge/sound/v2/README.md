# Film v2 sound: an original score and a new effects kit

Everything here is free of rights: no licensed music, no credit line needed, nothing reused from v1.

## Music: "Iris's Waltz" (`music/score.wav`, 70.0 s)
An original waltz in D major written for this cut (`scripts/score_v2.py`), played by a sampled chamber orchestra:
harp, glockenspiel, flute, oboe, clarinet, horn, violin, viola and cello sections, pizzicato strings, triangle and a
suspended cymbal. The instrument recordings are from **VSCO 2 Community Edition** (Versilian Studios), released as
**CC0 / public domain**, so the score is ours outright.

The tempo map is cut to the picture: each section starts on the VO phrase it carries.

| Film s | Bars | Section | Under |
|---|---|---|---|
| 0.00 | 2 | intro: a music box (glock, harp, soft strings) | "Some days, a child comes home…" |
| 3.40 | 6 | tender, B minor: the tune's first notes in the clarinet | "They didn't let me play." |
| 13.10 | free | magic: harp and glock glissandi, cymbal swell, D major opens on "story" (14.20) | "It's a story." |
| 14.90 | 4 | the waltz begins: pizzicato oom-pah-pah, glock motif, harp sweep | "With Tale Forge…" |
| 20.35 | 10 | theme A: flute over violins | "…adventure where your child is the hero" |
| 34.10 | 8 | theme A′: violins lead, the horn answers; settles on "ends" | "One small decision…" |
| 45.35 | 4 | quiet: harp, soft strings, oboe | "What do you think our friend needed?" |
| 51.35 | 5 | wonder: the tune grows, flowing harp, glock | "…more adventures waiting" |
| 58.20 | 2 | morning: crescendo, cymbal swell | "Another adventure waiting for tomorrow" |
| 60.75 | 5 | finale: tutti on "Tale Forge", the tune once more | the sign-off |
| 67.75 | | D major rings out | |

Checked by measurement (I can't listen): per-bar pitch content against the written chords (77 % of the energy sits in
the chord tones; the rest is melody and reverb tails), even stem levels bar by bar, no clicks, −19.6 LUFS before the mix.

## Effects (`lib/sfx/`, 50 sounds, `index.json`)
- **Recorded (CC0, VSCO 2 CE):** glockenspiel runs up and down, wind chimes, bell tree, Nepalese bells, triangle,
  vibraphone ring, cymbal swell, water bubbles (the watercolour), a timpani tap, violin pizzicato (Iris's hops,
  stepping up the scale), harp strings and harp glissandi, a pizzicato that bends up like a question.
- **Generated (`scripts/sfx_v2.py`):** crayon on paper (short, long, scribble, circle, tangle), page turns, a book
  closing, a rubber stamp, pops, raindrops, air whooshes, a little door creak, fairy dust, a soft tap, night crickets,
  morning birds.

## Cue sheet and mix
`cues.json` (written by `scripts/build_cues_v2.py` from the film's own timing labels): 129 effects, 43 different
sounds, every one on the frame of its picture event. `mix.png` shows voice, music and effects on one timeline.
Mixed with `scripts/sound_mix.py` to `film/public/audio/mix-v2.wav`: −15 LUFS, peaks under −1.5 dBTP, music ducked
4 dB under the voice.

## Rebuild
```
git clone --depth 1 https://github.com/sgossner/VSCO-2-CE <vsco>      # 2 GB of the sampled instruments are used
python3 -I scripts/score_v2.py <vsco> sound/v2/music/score.wav
python3 -I scripts/sfx_v2.py <vsco> sound/v2/lib
python3 -I scripts/build_cues_v2.py
python3 -I scripts/sound_mix.py sound/v2/cues.json film/public/audio/mix-v2.wav --sheet sound/v2/mix.png
```
