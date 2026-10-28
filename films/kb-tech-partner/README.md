# K.B — "In, beside, behind" (34 s, voice-over)

A brand film for K.B (kruslockbosconsultancy.com: an embedded tech partner for startups and SMEs) on the ElevenLabs
voice-over Karl supplied. Only "K.B" is said and shown, never "Consultancy". Built with the senior-motion-designer skill:
site harvest (the hero video ruled out) → brief, beat sheet → three concepts and three judges → thesis and plan →
Remotion build → art-director pass (four independent reviews and a judgement pass) → QC → delivery.

## Karl's brief, and where it is met
| Ask | In the film |
|---|---|
| "K.B", never "K.B Consultancy" | Voice: "K.B." as written. Screen: the K.B logotype, "TECH PARTNER" (the site's lockup), "We grow with you." No URL (the domain contains "consultancy"). |
| "5% motion instead of 1, 2, 3 or 4%" | The median frame changes **6.0%** of its area (draft 5.6%) (`motion_check.py`; K.B v3 was 1.7%, the earlier films 1.0–1.8%, Karl's references 0.5–6.6%). Reached by the content (the business's footage drifting inside its tile, the tool conveyors, the founders' photo, the moves), never by the camera, which only breathes. |
| "No statics with voiceover" | 21 of 21 phrases bring a new visual; the longest voice without one: 0.0 s; something moves in 100% of frames. |
| "Don't place the caption everywhere, sometimes only visualize the script" | Words on 7 of 21 phrases (grow · Where to start? · Advice · TECH PARTNER · Strategy / Implementation · alone.); 14 phrases are pictures only. |
| "Don't get inspired by or use the hero-section video" | Not downloaded, sampled or looked at (nor the site's other videos). Only the brand basics, real copy, real logos and the real team photo came from the site. |

## What is here
| Path | What |
|---|---|
| `deliver/kb-tech-partner-34s.mp4` | The film: 1920×1080, 30 fps, 34.0 s, H.264 yuv420p BT.709 TV range, AAC 48 kHz, −15.5 LUFS, peak −1.5 dBFS. QC on this encode: 100% of frames moving, median 6.0% of the frame in motion, no shake, every flagged pop a designed move, not busy (median 2 things on screen), 21/21 phrases with a new visual, 0.0 s of voice over a held frame; the probe found no camera spikes, overshoot or flying (two lurch flags are wall tiles that start moving off screen). |
| `storyboard/index.html` | The storyboard page (published privately: https://claude.ai/artifact/1hBSHSHvgP2dU5VKJo1mig): the film, direction, a frame per phrase from the film, notes, open questions, revision log, QC, appendix. Built by `storyboard/build_page.py` from `frames.json`, `revisions.json`, `qc.json`. |
| `storyboard/plan.md`, `beats.md`, `thesis.md`, `brief.md` | The production plan (every phrase's visual), the beat sheet and arc, the thesis with its allowed patterns, the brief. |
| `storyboard/concepts/` | The three concepts (A business on one stage, B proof by real work, C brand geometry) and the three judges' verdicts; C won with grafts. |
| `harvest/facts.md`, `missing.md`, `pages/` | Every claim the film may make, with its page; what the material lacks; the text of every page. |
| `brand.json`, `assets/` | The brand measured from the site; the rebuilt vector logo, fonts, tool and client logos, team photos, site screenshots. |
| `vo/` | The ElevenLabs file and its force-aligned word timings (`align.txt`; film time = file time + 0.40 s). |
| `sound/` | The cue sheet (`cues.json`, written by `make_cues.py` from the film's labels), the music bed (`bed.wav`, cut by `fit_bed.py`), the generated effects (`lib/`), the mix sheet. |
| `film/` | The Remotion project (below). |
| `scripts/` | The skill's scripts used on this film. |

## The Remotion project (`film/`)
```
cd films/kb-tech-partner/film
npm i
npx remotion studio            # composition "Film"
```
- `src/clock.ts`: every beat as a label keyed to a spoken word (`src/words.json`); every move in `src/Story.tsx` is placed on a
  label, so a retime moves labels. `src/Story.tsx`: the stage (the business tile, the K.B tile, the tools, the words) with one
  track per persistent object. `src/parts.tsx`: the business tile (one clip, nine parts), tool faces and rows, the founders'
  photo, the note. `src/lib.tsx`: the brand's tokens and curves. `src/kinetic.tsx`, `src/timeline.ts`: the skill's kit.
- Draft (no blur): `npx remotion render Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}'`
- Final (8-sample motion blur, chunked so slow text never trembles; about 35 minutes on 4 cores):
  `bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' 0,255,510,765,1020 public/audio/mix.wav`,
  then the TV-range BT.709 encode (`ffmpeg … -vf "scale=in_range=full:out_range=tv,format=yuv420p" -colorspace bt709 …`).
- In this sandbox: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
- Sound after a retime: `python3 ../sound/make_cues.py && python3 ../scripts/sound_mix.py ../sound/cues.json public/audio/mix.wav --sheet ../sound/mix.png`.

## Credits and licences
- K.B logo (rebuilt as vectors from the site's favicon), copy, tool logos, the founders' photo: kruslockbosconsultancy.com, as the site presents them.
- Fonts: Montserrat (SIL OFL), Copperplate CC Heavy (SIL OFL 1.1, Cowboy Collective).
- Footage: Mixkit "Business people at work meeting" (4809), Mixkit Stock Video Free License, no credit required. It stands for the viewer's own business; it is never presented as a K.B client or the K.B team.
- Music: Mixkit "Raising Me Higher" (Ahjay Stelino), Mixkit Stock Music Free License, no credit required; cut to the film on its bar grid.
- Sound effects: generated with `scripts/sfx_synth.py` (royalty-free). Voice: ElevenLabs, voice "Christina – Energetic Commercial Female", supplied by Karl.
