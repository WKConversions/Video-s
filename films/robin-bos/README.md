# Robin Bos — "The structure behind it" (30 s)

A business-card film for Robin Bos (CEO & Founder, K.B Consultancy) for his profile site
(test.karlvankessel.workers.dev) and LinkedIn. Built with the senior-motion-designer skill: harvest →
script → beat sheet → concept judge panel → production plan → Remotion build → art-director pass → QC.

## What is here
| Path | What |
|---|---|
| `storyboard/index.html` | The storyboard page: direction, a frame per phrase (rendered from the project), notes, open questions, appendix. Open it in a browser (`storyboard/frames/` holds the frames). |
| `storyboard/plan.md` | The production plan: the phrase list with every visual event, the variety and continuity tables, the decisions taken on the judges' open questions. |
| `storyboard/beats.md`, `brief.md`, `thesis.md`, `notes.md` | Beat sheet and arc; the brief; the thesis with its allowed patterns; assumptions, both script variants, open questions. |
| `storyboard/concepts/` | The three concepts of the judge panel and the judges' verdicts. |
| `harvest/facts.md`, `harvest/missing.md` | Every claim the film may make, with its source; what the material lacks. |
| `assets/` + `assets/assets.md` | Everything harvested from his site, the K.B site and his public post. |
| `brand.json` | The brand measured from his site (k-means in CIELAB), the film's tokens, type, shapes, contrast. |
| `film/` | The Remotion project (see below). `film/out/` holds renders and QC results (not committed). |
| `vo/` | The scratch voice (Piper en_US-ryan-high) and its word timings; `film/src/words.json` is the clock. |
| `sound/` | The cue sheet (`cues.json`), the composed bed (`bed.wav`, brief in `music-brief.json`), the generated effects (`lib/`), the mix sheet. |
| `scripts/` | The skill's scripts used on this film (QC, probe, phrase check, mixer, music, brand measure…). |

## The Remotion project (`film/`)
```
cd films/robin-bos/film
npm i
npx remotion studio                      # edit in Remotion Studio (composition "Film")
```
- `src/clock.ts`: the beats and every word of the voice (`words.json`) as labels; every move in `src/Story.tsx` is keyed to a label (`k(g, "w:two", 0.4)`). **To retime to a real voice-over:** force-align the recording (`python3 ../scripts/vo_align.py align vo.wav "<the line, lowercase>"`) and write the new times into `src/words.json` (same keys), put the file at `public/audio/vo.wav`, re-mix (`python3 ../scripts/sound_mix.py ../sound/cues.json public/audio/mix.wav`, the cues are also keyed to words via `sound/cues.json`'s notes; regenerate them with the snippet in the notes), then render.
- `src/lib.tsx`: the brand tokens and the motion curves. `src/kinetic.tsx`: the skill's kit. `src/parts.tsx`, `src/forms.tsx`: the stage's pieces and Robin's rebuilt forms.
- Draft render (no blur, fast): `npx remotion render Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}'`
- Final render (8-sample motion blur, chunked so slow text never trembles): from `film/`,
  `bash scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,212,450,660,900 public/audio/mix.wav`
- In a sandbox add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell` (render_chunks.sh finds it itself).
- Test frames: `node scripts/stills.mjs 0,90,420 1 Film` → `out/test/`. Motion probe: `node scripts/motion_probe.mjs out/probe.jsonl && python3 ../scripts/motion_probe.py out/probe.jsonl --style calm`.
- QC on an encode: `bash ../scripts/qc.sh out/final.mp4 out/qc` and `python3 ../scripts/phrase_check.py check out/final.mp4 src/words.json --sheet out/qc/phrases.png`.

## Credits and licences
- Portrait cut-out, logos, copy: Robin's own site and the companies' sites, as they present them. Team photo: Robin's public LinkedIn post (€2M announcement).
- Font: Manrope (the site's font; SIL Open Font License).
- Music: composed for this film with `scripts/music_make.py` (royalty-free by construction, "calm-optimistic", 113.5 BPM, D major). Replace with Karl's track via `sound/cues.json` → `music.file`.
- Sound effects: generated with `scripts/sfx_synth.py` and numpy (royalty-free). No Apple sounds.
- Scratch voice: Piper TTS (en_US-ryan-high, MIT), for timing only; not for delivery.
