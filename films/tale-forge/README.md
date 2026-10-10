# Tale Forge — "Adventures worth talking about" (English, 70.0 s)

A storytelling brand film for tale-forge.app: a child comes home quieter than usual, a parent reaches for a story, and
the Tale Forge book turns the moment into an adventure in which the child is the hero, makes a choice, and comes back
with something to talk about. The real world is a shadow theatre in Night violet and lamp gold; the story world is Tale
Forge's own watercolour sample book; the night ends in Tale Forge's Morgon theme.

## Deliverables
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

## Sources and credits
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
```
cd film && npm i
npx remotion render src/index.ts Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}' \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
cd .. && python3 -I scripts/build_cues.py && python3 -I scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
```
