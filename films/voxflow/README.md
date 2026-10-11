# VoxFlow — "Mis geen enkel telefoontje meer." (32.0 s, Dutch voice-over, music, effects)

The VoxFlow explainer rebuilt at 1920×1080 in Remotion from the approved storyboard (claude.ai/artifact/YWno4dUuJrUoV2Ut83ukhy,
made on Karl's Mac; its project was not available here, so the film was rebuilt from the storyboard, its frames and the draft's
voice track). Brief (Karl, 11 Oct 2026): 1080p; suitable royalty-free music and sound effects; the 4% motion norm; no useless
animations, e.g. text obviously moving left and right.

## What is here
| Path | What |
|---|---|
| `deliver/voxflow-32s-1080p.mp4` | The film: 1920×1080, 30 fps, 32.0 s, H.264 yuv420p BT.709 (TV range), AAC 48 kHz, −15 LUFS, 8-sample motion blur. |
| `storyboard/` | The storyboard page (`build_page.py` from `frames.json`), frames from the finished film, a web copy of the film. |
| `harvest/` | voxflow.nl's text and styles (the only source of claims on screen). |
| `assets/` | The site's screenshots and images (wordmark, the receptionist portrait, photos). |
| `vo/` | The voice-over taken from the approved draft (`vo-from-draft.wav`), its word timings (`words.json`, CTC forced alignment of the Dutch script, `ctc_words.json`; Whisper transcript `whisper_words.json`). |
| `sound/` | `make_cues.py` → `cues.json` (63 effects), `phone_sfx.py` (the generated phone sounds), `lib/` (index of those plus the WKConversions library), `music/` (the fitted bed and an original alternative), `music-notes.md`. |
| `references/` | The approved draft (720p) and its storyboard frames; `footage-candidates/README.md` (licences of every clip considered; the mp4s are not committed). |
| `film/` | The Remotion project. |

## The Remotion project (`film/`)
```
cd films/voxflow/film
npm ci            # or reuse films/wkconversions/film/node_modules
npx remotion studio
```
- `src/clock.ts`: the beats as labels in seconds, leading their spoken words (`src/words.json`). Retime by moving labels.
- `src/Scenes.tsx`: every object and its states; `src/Story.tsx`: the camera (one push per shot, let go under full-frame
  changes); `src/ui.tsx`: the interface pieces in voxflow.nl's style; `src/lib.tsx`: colours, fonts, eases.
- Draft: `npx remotion render src/index.ts Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}' --scale=0.5 --concurrency=4`
- Final: `bash scripts/render_chunks.sh Film out/final_master.mp4 '{"blurSamples":8,"audio":"none"}' 0,240,480,720,960 public/audio/mix.wav`,
  then the TV-range BT.709 encode.
- Sound: `cd sound && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png`
  (`sound_mix.py` here also takes `"dips"` on the music: extra dips of the bed, used under the call to action).

## Motion without decoration
Nothing drifts and nothing with text on it slides across the frame (the earlier draft's "working holds" did). The motion
comes from what the film is about: a call ringing, missed calls piling up, cards flipping, the receptionist rising, the hours
rolling into the night, a live voice, the caller and the practice on real footage, the agenda filling, colour fields growing
out of objects, two whips that move both scenes on one curve, and one camera push per shot on its subject (at most about
5%/s, released only while the whole frame changes). `scripts/motion_segments.py` lists the stretches under a threshold.

## Credits and licences
- Voice-over: ElevenLabs, "Vincent (Warm & Enthusiastic)", from the approved draft.
- Music: "The Great Wall" by Michael Ramir C., Mixkit, Mixkit Stock Music Free License (commercial use, no credit required).
- Footage: Mixkit 12146 (dentist checking teeth), 49933 and 49920 (woman on the phone), Mixkit Stock Video Free License.
  The earlier draft's physio clip (Mixkit 18256) is under Mixkit's Restricted licence (personal use only) and was replaced.
- Effects: generated (numpy), royalty-free.
- Wordmark, receptionist portrait, photo, fonts (Inter, Geist), colours and copy: voxflow.nl.
