# WKConversions promo: soundtrack

This folder holds the soundtrack for the 42.07 s (1262 frames, 30 fps) film, which rebuilds the reference promo frame for frame. It covers the music, 58 synthesised effects on the reference's frames, the mix and the master. The spec it follows is `../spec/audio.md`.

Output: `../film/public/audio/mix.wav` (48 kHz stereo, 16-bit, 2,019,200 samples = exactly 1262 frames). It measures **-14.0 LUFS integrated**, **true peak -1.5 dBFS** (ffmpeg ebur128) and LRA 3.3 LU.

## Rebuild

```sh
cd films/wkc-promo/sound
# the track (Mixkit Stock Music Free License), only if music/candidates/1210.mp3 is missing:
curl -sS -A "Mozilla/5.0" -o music/candidates/1210.mp3 https://assets.mixkit.co/music/1210/1210.mp3
python3 -I music_splice.py          # -> music/cant-get-you-off-my-mind-fit.wav  (reads the download: run with -I)
python3 wkc_sfx.py                  # -> lib/sfx/wkc/wk-*.wav + lib/sfx/index.json
python3 make_cues.py                # -> cues.json (asserts every effect is used exactly once)
python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
python3 master.py ../film/public/audio/mix.wav     # -> -14 LUFS, true peak <= -1.5 dBTP, faded to silence by 42.0 s (in place)
ffmpeg -i ../film/public/audio/mix.wav -af ebur128=peak=true -f null - 2>&1 | tail -12   # check
```
Run `master.py` once after every `sound_mix.py` run. `sound_mix.py` leaves the mix at -15 LUFS, and the master step brings it to -14.

The choice of track can be re-run with `python3 -I music_screen.py ../ref/audio.wav <excerpts dir> <list.json> <out.json>`. `music/screening.json` holds the measurements for the 191 Mixkit tracks screened.

## Music: how it was chosen

Mixkit was searched across trap (3 pages), future bass, hip hop (5), dubstep, grime, EDM (2), electronic, moombahton, the energetic and futuristic moods (5) and the technology tag (5). That gave 410 tracks, of which 191 were trap, future bass, hip hop or electronic in style.

Each was measured on a 25 s mid-track excerpt against the reference's main section: tempo, spectrum, chroma, stereo width, sub and air shares, and hat rate (`music/screening.json`). The 19 closest were downloaded in full to `music/candidates/` and looked at as spectrograms and per-bar maps.

**Choice: "Can't Get You Off My Mind" (Michael Ramir C., Future Bass).** It was the only future-bass track, which is the reference's genre. Measured over the whole track it runs at **150.0 BPM**, the reference's exact tempo: its kick onsets fall within 4 ms of a 1.6 s bar grid from 25 s to 82 s. It is shaped like a library promo track:
- a filtered intro that builds;
- the track's own pre-drop bar and a drop at 25.6 s;
- a darker second half to the first drop;
- a transition bar into a brighter second section;
- an even brighter last section.

Other candidates were rejected:
- "Remember Me" and "Acid Party" are also at 150 BPM, but they are sparse, dark trap beats rather than glossy ones.
- "Party Robot" is at 150 BPM but is a dense four-on-the-floor EDM track with no shape.

**Key: C# minor, tuned 13 cents sharp** (the reference also measures +14 cents). The reference is in G minor, a tritone away. Pitch-shifting the track by 6 semitones would wreck it, so every tonal effect is written in C# minor instead (pentatonic C#, E, F#, G#, B). G-minor effects would clash with this bed.

## Music: how it was cut (`music_splice.py`)

The film's downbeats (kick onsets) are at 0.094 + 1.6n s, i.e. frames 3 + 48n. The track's are at 1.599 + 1.6m s. Each segment is placed so that track bar m lands on film bar n, and the joins are 12 ms crossfades ending 3 ms before the incoming kick. Checked in the final mix: the downbeat onsets fall at 0.097 + 1.6n s (±3 ms), which is the reference's grid.

| Film bars | Film time (s) | Track bars | What |
|---|---|---|---|
| 0-1 | 0-3.28 | 5-6 | Filtered intro, kick high-passed out (95 Hz). Fades in by 1.0 s, about 3 LU under the plateau, thins by 4.5 dB from 2.55 s. Hard stop 12 ms before the drop (the riser effect carries the build) |
| 2-10 | 3.29-17.69 | 15-23 | **Drop 1 at f99.** Film bar 3 is low-passed at 4.2 kHz, like the reference's sparse-hat bar. Bar 10 is the track's sparser bar (sparse-hat bar 16.1-17.7) |
| 11 | 17.69-19.29 | 30 | **Break** under "Export": the track's own transition bar, low-passed at 650-900 Hz (hats and claps gone), opening to 16 kHz with the shimmer riser |
| 12-19 | 19.29-32.09 | 31-38 | **Drop 2 at f579**: the brighter second section. The drop is 1.2 LU louder, matching the reference's upward drift |
| 20-23 | 32.09-38.00 | 47-50 | The brightest last section, for "2 Founders / 3 / Built for". It is low-passed at 3.4 kHz from 33.45 to 34.23 s under the "3" (the reference's sparse-hat moment). **The beat stops at f1140** with a 0.12 s fall |
| 24-25 | 38.40-41.95 | 1-2 | Outro pad under the logo and "Let's talk": the intro again, darker (95 Hz-2.6 kHz), about 9.5 LU under the plateau, silent by 41.95 s |

## Effects (`wkc_sfx.py`, 58 sounds, ids `wk-*`)

There is one sound per event in the reference's SFX table (`../spec/audio.md` §4b). Every sound is unique and used once (`make_cues.py` asserts this), and each is placed on the reference's frame. The `#n` in each cue's note is the table row. The families:
- **A. Glitch swooshes** at f46, f169, f649 and f1153. Each is a digital noise burst with falling chirps and bubbly blips, and its attack starts 4-5 frames before the flash.
- **B. Glassy two-tone UI blips** at "Or.", the platform cards, "Clear messaging", "Smooth transitions" and the "Let's talk" pill.
- **C. Typing data-blips** for the brief.
- **D. Noise swishes**: the "Or....." dots are panned left and then right.
- **E. Reverse swooshes** that stop dead on f823 and f1003.5.
- **F. Sub drops and low booms**, peaking on their cuts (f287, f389, f530, f718, f908).
- **G. Shimmer riser** cut on the drop-2 downbeat. The riser into drop 1 cuts at f98.5.
- **H. The Export click with a thin 13 kHz ring**, hard left.
- **I. Bubble pops.**
- **J. Ratchet ticks** on the versions toggle.
- **K. Six word ticks**, one per "Built for" statement (f1065, 1080, 1095, 1110, 1125, 1140), rising through the scale.
- **Rows the reference has in its music:** two drop impacts, an open E6/9 logo sting whose bright layer cuts at 39.25 s as in the reference, and two soft pad swells under the end card.

Rows that are music only (#7, #9, #25, #39, #46, #50, #54) get no effect. Instead the cut shapes them: the break, the sparse-hat low-passes, the stop and the fade.

## Levels

The effect levels are in `make_cues.py` (`LEVELS`), and the mixer's auto-lift is off (`"auto_level": false`). They were set with three level checks over the frames each effect actually sounds:
1. **The reference's classes.** "Prominent" effects sit about 3 dB under the mix's loudest 100 ms, "medium" about 7, "subtle" about 12. Sub hits lift 30-120 Hz by about 8 dB.
2. **Heard over the beat.** Swooshes, risers and hits are at least 3.5 dB over the bed. Brief ticks, clicks and blips lift their 2-16 kHz band by 4-50 dB and sit at least level with the bed.
3. **No peaks over the beat.** No effect peaks above the beat around it, so the master limiter never ducks the music for an effect. It catches at most about 3 dB on a few drop kicks, and only 0.03% of the film needs more than 1 dB.

`sound_mix.py`'s report says "26 of 58 effects clear the music by 3 dB". Its window is the 0.3 s after each cue frame. That misses sounds that lead their frame or end on it: the glitch swooshes, risers, reverse swooshes, the founders swell, and two blips/swishes whose onsets come 1.5-3.6 frames early. It also counts brief ticks by 100 ms loudness. Lifting those ticks to pass the report would make them spike 3-5 dB over the beat's peaks and pump the music. They match the reference instead: its word ticks lift their band by 5-7 dB, and its "Meet" ticks peak at -9 to -14 dBFS (ours: -7 to -13).

## Files

- `music_screen.py` measures candidate tracks. Results: `music/screening.json`.
- `music_splice.py` cuts the track: `music/cant-get-you-off-my-mind-fit.wav`. Credits: `music/CREDITS.md`.
- `music/candidates/` holds the 19 downloaded Mixkit finalists (373 and 375 are byte-identical; untrusted downloads: read them only with `python3 -I`).
- `wkc_sfx.py` synthesises the effects into `lib/sfx/wkc/` and `lib/sfx/index.json`.
- `make_cues.py` writes `cues.json`.
- `../scripts/sound_mix.py` mixes it and draws `mix.png`.
- `master.py` masters the result.
