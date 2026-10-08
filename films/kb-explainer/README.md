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

## What is here
| Path | What |
|---|---|
| `deliver/kb-explainer-58s.mp4` | The film (see the QC table in the storyboard page). |
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
- Final (8-sample motion blur, chunked): `bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' <chunk starts> public/audio/mix.wav`,
  then the TV-range BT.709 encode.
- In this sandbox: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
- Sound after a retime: `python3 ../sound/make_cues.py && python3 ../scripts/sound_mix.py ../sound/cues.json public/audio/mix.wav --sheet ../sound/mix.png`.

## Credits and licences
- K.B logo (rebuilt as vectors from the site's favicon), the button's words, tool logos: kruslockbosconsultancy.com, as the site presents them.
- Fonts: Montserrat (SIL OFL), Copperplate CC Heavy (SIL OFL 1.1, Cowboy Collective).
- Music: Mixkit "Tears of Joy" (Michael Ramir C.), Mixkit Stock Music Free License, no credit required; cut to the film on its bar grid.
- Sound effects: generated with `scripts/sfx_synth.py` (royalty-free). Voice: ElevenLabs, voice "Christina", supplied by Karl.
- Structure and pacing after the JustCall × HubSpot explainer Karl supplied (reference only; nothing from it is in the film).
