# Moviqly film 2: "Behind this prompt" (46 s, 16:9)

The second SaaS explainer for Moviqly. It is built from Karl's script and the ElevenLabs voice-over "Christina".

The camera goes behind the prompt box into an AI motion-design studio and follows one film through it. That film is
for the fictional brand Fjello, an outdoor-gear shop. Plan and contract: `plan/storyboard.md`. It lists film 1's
strategies as excluded.

## Delivered
- `deliver/moviqly2-draft-v1-540p.mp4`: the first version (540p, VO, music and effects).
- `deliver/moviqly2-behind-this-prompt-46s.mp4`: the final, 1920×1080, 6-sample motion blur, −15.2 LUFS, H.264
  BT.709.

## Sources
- **Voice-over:** `vo/vo.mp3`. Word times come from `scripts/vo_whisper.py` and `scripts/vo_align.py`, written to
  `film/src/words.json`. Labels are word starts.
- **Harvest:** `harvest/shots/` holds the test site (https://moviqly.moviqly.workers.dev/), captured with a throwaway
  account. No prompt was sent. `harvest/editor.css` is the studio's CSS, for its exact values.
- **Music:** "Digital Clouds" by Alejandro Magaña (A. M.) from Mixkit, under the Mixkit Stock Music Free License
  (commercial use, no credit needed). It is fitted with `scripts/music_fit.py --length 46.02 --lift 28.08 --end real
  --max-early 1.6`: the lift lands on "Your film plays" and the last hit on "Make it Moviqly".
- **Effects:** the alumni sound library. The cue sheet is `scripts/cues.py` (127 cues on the voice-over's words).
- **Fonts:** DM Sans (the platform) and Fraunces (the demo brand; OFL).

## Build
```
cd film && npx tsc --noEmit
python3 ../scripts/cues.py && python3 ../scripts/sound_mix.py ../sound/cues.json public/audio/mix.wav --sheet ../sound/mix.png   # from films/moviqly2
npx remotion render src/index.ts Film out/draft540.mp4 --props='{"blurSamples":1,"audio":"audio/mix.wav"}' --scale=0.5
bash ../scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":6,"audio":"none"}' 0,366,651,831,1143,1381 public/audio/mix.wav
```

## Code layout
- `src/shared.tsx`: the kit. It holds the app's pieces and the Fjello site, film and draft. It also defines
  hand-offs h1–h4 between the four builders.
- `src/scenes/A–N.tsx`:
  - A–C: behind the prompt, the brief, the scan.
  - D–F: earlier films, form / idea / art direction, the storyboard.
  - G–H: fact check, review.
  - I–L: the studio (plays, make it calmer, Portrait, Export MP4).
  - M–N: steps and versions, back to the prompt.
- Some scene files import helpers from their neighbours, written by the same builder.
