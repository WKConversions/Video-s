# K.B — explainer (58 s, voice-over)

Karl's ask: "Make EXACTLY this video but then for the business K.B" — the JustCall × HubSpot product explainer in
`references/` — on the ElevenLabs voice-over he recorded from the script in `script.md`. Only "K.B" is said and shown,
never "Consultancy"; no photos of K.B's team; nothing from K.B's hero video.

## How it follows the reference
The film copies the reference's **structure, pacing and kinds of motion**, beat for beat (`storyboard/plan.md`):
two logo circles dock and open into an app window; a module switches on with a check; a phone slides in; a big "How?";
one window stays on screen while its body changes and the view pushes into cards; a dropdown pick; a workflow runs;
tools join up; a row of avatars; a month calendar fills; an infinity loop; a logo-and-button end card; a small brand
mark in the top-right corner throughout; soft blobs and small drifting shapes on a pale canvas.

Everything on screen is **original K.B artwork, interface and copy**: none of the reference's screens, logos,
illustrations or wording is reproduced. The interfaces are examples built from K.B's own services and words (process
audit, build board, intake form and workflow with Make, n8n and an AI agent, dashboard, website, app, tool
connections, team channel, monthly plan, Diagnose → Build → Run). People are initials only.

## Karl's brief, and where it is met
| Ask | In the film |
|---|---|
| "K.B", never "Consultancy" | Voice: "Talk to K.B." Screen: the K.B logo tile, the K.B logotype in the app bars, the K.B avatar and cursor. No URL (the domain contains "consultancy"); the end card uses the site's own button, "Book a Free Discovery Call". |
| No team member photos | Every person is a circle of initials (AM, JS, RK, LT, "You"); K.B is its logo tile. |
| Not the hero video | Not downloaded, sampled or looked at. |
| Exactly the reference | Same order of beats and the same kinds of moves (see above); see `storyboard/plan.md` for each shot against the reference beat it mirrors. |

## The review round
Two independent reviews of the first draft (fidelity to the reference and story; craft, legibility and brand) and a
cold-eyes pass on the second, plus the automatic checks. What changed and why is in `storyboard/revisions.json` (and on
the storyboard page): the windows stay whole and still while cards lift out of them (no push-ins), every screen leaves
before the next arrives, the stage is larger than the frame so the breathing camera never shows its edge, the corner
mark sits outside the camera, K.B and You meet on "with you", the phone returns with the follow-up email, the team makes
room for K.B, the monthly plan is lighter, the loop draws from Diagnose, and the end card reads "Talk to K.B" over a cyan
"Book a Free Discovery Call".

## What is here
| Path | What |
|---|---|
| `deliver/kb-explainer-58s.mp4` | The film: 1920×1080, 30 fps, 58.0 s, H.264 yuv420p BT.709 TV range, 8-sample motion blur, AAC 48 kHz, −15.1 LUFS, peak −1.3 dBFS. QC on this encode: 37 of 37 phrases bring a new visual (0.0 s of voice over a held frame); something moves in 99% of frames (longest still 0.2 s); median 1.7% of the frame in motion (the reference: 2.7%); every screen leaves before the next arrives; no visible shake (six flags are very slow creeps stepping a pixel at a time); every pop a designed arrival; as busy as the reference (median 10 things on screen, the reference 11); every frame on palette; every text colour ≥ 5.6:1. |
| `storyboard/index.html` | The storyboard page (published privately: https://claude.ai/artifact/9pZR1rdLaQSJYkzZevgnnt): the film, the direction, a frame per phrase from the film, notes, open questions, the revision log of the review round, QC. Built by `storyboard/build_page.py` from `frames.json`, `revisions.json`, `qc.json`. |
| `script.md` | The voice-over script Karl recorded. |
| `vo/` | The ElevenLabs file and its word timings (`words_full.json`; film time = file time + 1.60 s). |
| `references/` | The reference film and its contact sheet. |
| `storyboard/plan.md`, `phrases.txt` | The shot plan (every phrase's visual, against the reference beat) and the 37 phrases. |
| `sound/` | The cue sheet (`cues.json`, written by `make_cues.py` from the film's labels), the music bed (`bed.wav`, cut by `fit_bed.py`), the generated effects (`lib/`), the mix sheet. |
| `film/` | The Remotion project (below). |
| `scripts/` | The skill's scripts used on this film. |

## The Remotion project (`film/`)
```
cd films/kb-explainer/film
npm i
npx remotion studio            # composition "Film"
```
- `src/clock.ts`: every beat as a label keyed to a spoken word (`src/words.json`); every move is placed on a label, so a
  retime moves labels. `src/Story.tsx`: the stage (background, corner mark, the acts). `src/a1.tsx` the open, the
  workspace, the phone, "How?"; `src/a2.tsx` the one window of the audit, board, intake and workflow; `src/a3.tsx`
  "Need more?", the dashboard, website and app, the tools; `src/a4.tsx` the team channel, launch, the monthly plan, the
  loop, the end card. `src/ui.tsx`: windows, phone, cursors, pills, toggles, avatars, icons, background shapes.
  `src/lib.tsx`: the brand's tokens. `src/kinetic.tsx`, `src/timeline.ts`: the skill's kit.
- Draft (no blur): `npx remotion render Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}'`
- Final (8-sample motion blur, chunked; about 5 minutes on 4 cores):
  `bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' 0,437,870,1305,1740 public/audio/mix.wav`,
  then the TV-range BT.709 encode (`ffmpeg … -vf "scale=in_range=full:out_range=tv,format=yuv420p" -colorspace bt709 …`).
- In this sandbox: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
- Sound after a retime: `python3 ../sound/make_cues.py && python3 ../scripts/sound_mix.py ../sound/cues.json public/audio/mix.wav --sheet ../sound/mix.png`.

## Credits and licences
- K.B logo (rebuilt as vectors from the site's favicon), the button's words, tool logos: kruslockbosconsultancy.com, as the site presents them.
- Fonts: Montserrat (SIL OFL), Copperplate CC Heavy (SIL OFL 1.1, Cowboy Collective).
- Music: Mixkit "Tears of Joy" (Michael Ramir C.), Mixkit Stock Music Free License, no credit required; cut to the film on its bar grid.
- Sound effects: generated with `scripts/sfx_synth.py` (royalty-free). Voice: ElevenLabs, voice "Christina", supplied by Karl.
- Structure and pacing after the JustCall × HubSpot explainer Karl supplied (reference only; nothing from it is in the film).
