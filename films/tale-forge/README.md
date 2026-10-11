# Tale Forge — "Adventures worth talking about" (English, 70.0 s)

A storytelling brand film for tale-forge.app: a child comes home quieter than usual, a parent reaches for a story, and
the Tale Forge book turns the moment into an adventure in which the child is the hero, makes a choice, and comes back
with something to talk about. In v1 the real world was a shadow theatre in Night violet and lamp gold; the story world is Tale
Forge's own watercolour sample book; the night ends in Tale Forge's Morgon theme.

## v2 (current): storybook all the way, new music, new effects
Karl's note on v1: the shadow-theatre animation of the child and the parent looked low quality. v2 keeps the same VO and
tells the client's own idea (an everyday moment, being left out, becomes an adventure where the child is the hero, and
ends in a conversation) with Tale Forge's storybook art and a child's crayon doodles only. See `storyboard/plan-v2.md`.

- `deliver/tale-forge-en-v2.mp4`: 1920×1080, 30 fps, H.264 (yuv420p, BT.709, TV range), AAC 48 kHz stereo, −15 LUFS, 70.0 s.
- `deliver/tale-forge-en-v2-preview.mp4`: a lighter encode for sharing in chat.
- Picture: `film/src/v2/` (`FilmV2.tsx` stage, `Opening.tsx` home / her day / the book reveal, `BookV2.tsx`, `TalkV2.tsx`,
  `Doodle.tsx` crayon strokes, `labels.ts` v2 timing); composition `FilmV2`. The shared story-world scenes stay in `src/StoryWorld.tsx`.
- Sound: `sound/v2/` (README there): **"Iris's Waltz"**, an original score on CC0 orchestral samples, and a new kit of
  50 effects on 129 cues. **No credit line needed**: no third-party music.

## v1
- `deliver/tale-forge-en-v1.mp4`: 1920×1080, 30 fps, H.264 (yuv420p, BT.709, TV range), AAC 48 kHz stereo, −15 LUFS, 70.0 s.
- `storyboard/storyboard.png`: a frame per phrase (37 phrases), rendered from the film itself.
- The Remotion project in `film/` (open with `npm i` and `npx remotion studio`): every scene and caption is editable.

## Folder
| Path | What |
|---|---|
| `storyboard/brief.md` | the brief, the format, the assumptions |
| `storyboard/plan.md` | thesis, motion identity, the phrase-by-phrase plan, notes for Karl/Kevin |
| `harvest/facts.md`, `harvest/missing.md` | what the film may claim (with sources); what's missing and what to ask for |
| `vo/` | the supplied VO, its transcript with word timings (`words.json`), the phrase list |
| `film/` | the Remotion project: `src/Film.tsx` (stage and hand-offs), `src/Theatre.tsx` (shadow theatre: home, room, book), `src/StoryWorld.tsx` (book, reader, map, shelf, sky, astronaut, morning, end card), `src/clock.ts` (timing labels), `src/lib.tsx` (tokens) |
| `sound/` | `cues.json` (69 effects, each on its picture frame), `mix.png` (the mix on one timeline), `music/` (the fitted waltz and the bed), `lib/` (the generated effects and the ambience) |
| `scripts/` | the skill's checks and mixers, plus `fairy_sfx.py` (the magical effects) and `build_cues.py` (the cue sheet from the film's own timing) |
| `qc/` | the automatic checks on the draft and the final |

## Sources and credits (v1; v2's sound is in `sound/v2/README.md`)
- **Voice-over:** supplied by Karl: ElevenLabs, voice "Spuds Oxley – Grandpa" (`vo/vo-en__elevenlabs-spuds-oxley-grandpa.mp3`). Check the ElevenLabs plan covers commercial use.
- **Music:** "Frost Waltz" by Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 —
  **the credit line is required** wherever the film is published: *Music: "Frost Waltz" by Kevin MacLeod (incompetech.com), CC BY 4.0*.
  Free; flagged to the client as the brief asks. A licensed track can replace it in `sound/cues.json` (`music.file`).
- **Sound effects:** generated for this film (`scripts/fairy_sfx.py`, royalty-free by construction). Ambience: Tale Forge's
  own "Brasa" (hearth) and "Sagoskogen" (forest) loops from tale-forge.app; crickets and wind generated.
- **Pictures:** all Tale Forge's own, harvested from tale-forge.app (`/tale-forge-style-library`): the sample book
  *Iris och den sparade platsen* (cover and scenes S1, S2, S3B, S5BB, S6AA–S6BB), the hero portrait (the child's silhouette is cut
  from it), the Alva covers, the adventure cards, the astronaut nebula, the Morgon aurora, the narrator portrait, the logo.
- **Fonts:** Lora, Schibsted Grotesk and Cinzel (SIL Open Font License), Tale Forge's own web fonts.

## Rebuild
v2: `sound/v2/README.md` for the sound, then from `film/`:
`bash ../scripts/render_chunks.sh FilmV2 out/final-v2.mp4 '{"blurSamples":8,"audio":"none"}' 0,525,1050,1575,2100 public/audio/mix-v2.wav`

v1:
```
cd film && npm i
npx remotion render src/index.ts Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}' \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
cd .. && python3 -I scripts/build_cues.py && python3 -I scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
```
