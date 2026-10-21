# Creoble v4 (Danish): "Din nye hjemmeside er få minutter væk" (55 s, 16:9, 60 fps)

A SaaS explainer for creoble.dk: the hero video on their website, also used on their LinkedIn business page. It shows
the platform and its USPs, built from Karl's Danish script and the supplied voice-over "Mathias". It is a new film,
not a revision of the earlier Creoble films v1–v3 (`films/creoble`), in Creoble's own brand kit
(`films/creoble/brand/BRANDKIT.md`): background #fafaf8, text #1a1614, sage #87a89e, light sage #a8c4bb, Fraunces 400
and DM Sans 400/500, the client's wordmark SVG.

The example client the film builds a site for is Holm Fysioterapi, a fictional physiotherapy clinic in its own slate
teal, so it never reads as Creoble's UI.

## Versions
- **Version 1** (`deliver/creoble-v4-dk-draft-540p.mp4`, scenes in `plan/v1-scenes/`). Karl: the music was sad, the
  motion slow, the UIs stood still.
- **Version 2** (`deliver/creoble-v4-dk-v2-draft-540p.mp4`, scenes in `plan/v2-scenes/`): constant motion and an upbeat
  bed. Karl: every shot drifted left and grew, too many zooms through text, stutter at 30 fps.
- **Version 3** (this build): 60 fps; a named, different motion per shot; bounce springs, Liquid Glass, a
  Dynamic-Island status capsule, gooey merges, bento grids. Plan and contract: `plan/storyboard.md`; storyboard
  `plan/storyboard_v3.jpg`.

## Delivered
- `deliver/creoble-v4-dk-v3-draft-540p60.mp4`: the version 3 draft (540p, 60 fps, VO, music and effects).
- `deliver/creoble-v4-dk-55s-60fps.mp4`: the final, 1920×1080, 60 fps, 4-sample motion blur, H.264 BT.709.

## Sources
- **Script:** `vo/script.txt` (Danish); the English translation is in `films/creoble/plan/v4-script-da.md`.
- **Voice-over:** `vo/vo.mp3` (53.6 s). Word times from `scripts/vo_whisper.py` (Whisper medium, Danish) and
  `scripts/vo_align.py`, written to `film/src/words.json`. Labels are word starts.
- **Music:** "Take this Higher" by Michael Ramir C. from Mixkit, under the Mixkit Stock Music Free License (commercial
  use, no credit needed). It is fitted with `scripts/music_fit.py --length 55.18 --lift 0.50 --end real
  --max-early 1.6`.
- **Footage:** four Mixkit clips for the Holm site's imagery, credited in `film/public/footage/CREDITS.md` (Mixkit
  Stock Video Free License). The mp4s are gitignored; `scripts/stock.py` fetches them again.
- **Effects:** the alumni sound library. The cue sheet is `scripts/cues.py` (79 cues on the voice-over's words).
- **Fonts:** Fraunces and DM Sans (OFL).

## Build
```
cd film && npx tsc --noEmit
python3 ../scripts/cues.py && python3 ../scripts/sound_mix.py ../sound/cues.json public/audio/mix.wav --sheet ../sound/mix.png   # from films/creoble4
npx remotion render src/index.ts Film out/draft540.mp4 --props='{"blurSamples":1,"audio":"audio/mix.wav"}' --scale=0.5
bash ../scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":4,"audio":"none"}' 0,604,1022,1594,2348,3310 public/audio/mix.wav
```
Frame numbers are 60 fps; the scenes animate on a 30-unit clock `g = frame / 2` (`src/clock.ts`).

## Code layout
- `src/lib.tsx`: brand colours, fonts, eases.
- `src/shared.tsx`: the kit: springs (`aspring`, `bounce`, `press`, `squash`), type (`Statement`, `BounceText`,
  `Wordmark`), UI (`Browser`, `HolmSite`, `Builder`, `PillButton`, `Toggle`), Apple pieces (`LiquidGlass`, `Island`,
  `Gooey`, `FilterDefs`, `SageIris`), transitions (`whip*`, `push*`).
- `src/scenes/S1–S5.tsx`:
  - S1: the hook, the brief, the build (to "Det bedste?").
  - S2: see it before paying, change it (to "Tilfreds?").
  - S3: 499 kr once, no subscription, zero risk (to "Skal den på nettet?").
  - S4: hosting from 83 kr, domain and e-mail, fixed price, Europe, no lock-in (to "Brug for hjælp?").
  - S5: a human, the wordmark, the CTA.
