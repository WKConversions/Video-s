# Soundtrack spec: reference promo (audio.wav, 42.10 s, 44.1 kHz stereo)

Use this file to pick or compose a replacement track with the same energy curve and hits, and to rebuild the SFX layer frame by frame.
Times are in seconds from the start of the file. Frames are at 30 fps (frame = t x 30); "f147" means frame 147 = 4.900 s.
The audio is aligned to ref.mp4 (frame n = n/30 s).

How it was measured: librosa 0.11 HPSS (harmonic/percussive), a bar-synchronous median model (the median of all 22 beat bars is treated as "the music"; the residual is treated as "non-repeating = SFX or arrangement change"), onset strength and spectral flux, band envelopes (sub/low/mid/high/air), CQT and linear spectrograms viewed frame by frame next to the picture, EBU R128 (ffmpeg). Working files (stems, spectrogram images, scripts) are in `/tmp/claude-0/-home-user-Video-s/7c0b2c2d-fb9e-5a4a-bb36-f16fc655f937/scratchpad/wkc-audio-b/`: `harm.wav`, `perc.wav`, `fg_bar.wav` (SFX-ish residual), `c_*.png` (spectrogram + residual + frame strips), `l_*.png` (linear zooms of individual SFX).

Confidence: the tempo, grid, key, structure and loudness numbers are solid. The SFX are mixed into a busy beat and most of them sit on the beat grid, so the line between "SFX" and "part of the track" is a judgement call for the small ticks. Each SFX row gives a confidence rating.

---

## 1. Key numbers

| Property | Value |
|---|---|
| Tempo | **150.0 BPM** exactly (half-time feel = 75 BPM). The downbeat kick onsets of 22 bars sit within ±5 ms of the grid; three sit about +30 ms late, where a riser or 808 glide masks the attack. |
| Beat | 0.400 s = **12 frames** |
| Bar (4/4 at 150) | 1.600 s = **48 frames** (one 75-BPM half-time bar = 2 x 48 = 96 frames) |
| 16th note | 0.100 s = **3 frames**. Every 16th lands 0.1 frame before a frame number divisible by 3 |
| Beat 1 of bar 0 | **0.097 s (f2.9 ~ f3)**. Downbeats are at 0.097 + 1.6n s = frames 3 + 48n |
| The drop (drums enter) | **3.297 s = f99** (bar 2) |
| Second drop | **19.297 s = f579** (bar 12) |
| Beat stops | after **38.0 s (f1140)**. The logo sting starts at 38.30 s (f1149) |
| Silence | 0-0.05 s at the start; the outro fades to -60 dBFS at 42.00 s (f1260) |
| Key / mode | **G minor** (Aeolian; the last bar and outro lift to a **C**-bass chord = IV, Dorian colour) |
| Progression | **Eb - F - Gm (- D)**, i.e. bVI - bVII - i (- V), one chord per 1.6 s bar |
| Loudness | **-13.2 LUFS integrated**, LRA 4.5 LU, true peak **+0.6 dBTP** (the reference clips; master ours to about -14 LUFS / -1 dBTP) |
| Stereo | Low end mono (20-150 Hz corr +0.88). Chords and pads very wide (150-1000 Hz corr ~0). The intro and outro pads are near-decorrelated (S/M ~ 0 dB) |

**Why 150 BPM matters for us:** at 30 fps, 150 BPM gives exactly 12 frames per beat and 3 frames per 16th. If we choose or compose a track at 150 BPM (or 75 half-time) with its first downbeat at f3, every cut in the reference lands on our grid unchanged. At any other tempo, the cuts and hits must be re-timed.

---

## 2. The music

### Genre, instrumentation, energy
A glossy **tech/SaaS promo track: hybrid half-time trap / future bass**. It is confident and sleek, with constant drive and no long breakdown. Sound-design transitions are built around the edit.
- **Kick + 808 sub** on beat 1 of every 1.6 s bar. The 808 follows the chord roots (Eb1 ~39 Hz, F1 ~44 Hz, G1 ~49 Hz, D1 ~37 Hz). It sustains to about step 9, often leaves a 3-16th gap (steps 10-13), then plays a **pickup kick on step 14** (the "a" of beat 4, 0.2 s before the next downbeat). Some bars also have kicks on steps 3 and 7. At several cuts the 808 **glides down** to ~27-30 Hz, which works as a sub drop (see SFX table).
- **Clap/snare** on step 8 (beat 3 of the 150 bar = the half-time backbeat), with a ghost/flam layer on step 6.
- **Hats/ticks** in a syncopated **3-3-2** pattern (16th steps 2, 5, 8, 10, 13, 14). In a few bars ("sparse-hat bars": 4.90-6.49, 16.10-17.69, 17.70-18.30, 33.70-34.23) the hats thin out so a UI moment can stand alone.
- **Wide detuned synth chords** (pad/stab hybrid, 200 Hz-2 kHz, very wide stereo) carrying Eb-F-Gm.
- **Vibrato lead / vocal-like synth line** (held notes ~700 Hz and ~2.3 kHz with ~5 Hz vibrato) enters at 18.4 s and runs through the montage (19.3-23.9 s). This is the "drop 2" colour.
- **Intro/outro pad**: soft, very wide, no drums (G minor at the start, an open C-bass chord at the end).
- The track has sound-design transitions built in or layered on top: noise risers, reverse swooshes, glitch swooshes, sub drops (see section 4).

### Structure (with frames)

| # | Time (s) | Frames | Section | What happens musically | Picture |
|---|---|---|---|---|---|
| 0 | 0.00-0.05 | f0-1 | silence | - | end-card thumbnail f0-4, black at f5 |
| 1 | 0.05-3.297 | f2-99 | **Intro** (2 bars) | Wide G-minor pad fades in (-23 to -16 LUFS by 1.0 s). Soft filtered ticks on the 16th grid (0.30, 0.60, 0.70, 0.90, 1.10 s). Chord moves to Eb/G at the bar-1 downbeat 1.697 s (f51). The pad thins at 2.55 s and a **noise + sparkle riser with a low rumble** builds to 3.285 s, then cuts off ~10 ms before the drop | "Meet" (f8-40), logo glow reveal (flash at f46), logo hold, push into the "Build" ring scene (f88-99) |
| 2 | **3.297** | **f99** | **DROP 1** | Full beat enters (kick + 808 on Eb) | "Build" types in, rings |
| 3 | 3.297-17.697 | f99-531 | **Main A** (9 bars) | Steady full beat, Eb-F-Gm loop. Sparse-hat bar at 4.90-6.49. 808 glide (sub drop) into 13.0 s. The beat holds energy throughout (-12 to -15 LUFS) | Build AI / Drag-Drop-Done / Or...just vibe it / prompt / node cards / 3D tilt |
| 4 | 17.697-19.297 | f531-579 | **Break / pre-drop** (1 bar) | Sub drop at 17.68, then hats and claps drop out (17.70-18.28; only sparse kicks and 808 remain). UI click at 18.28-18.33, then a **shimmer riser** 18.50 to 19.285 into the downbeat. The vibrato lead starts here | "Publish" button, cursor click (f549-550), rings expand |
| 5 | **19.297** | **f579** | **DROP 2 / Main B** (3 bars) | Full beat plus the vibrato lead. The brightest part of the track (mid band +2 dB). Glitch swoosh at 21.49 | montage of finished UI screens, "Report Is Ready!" |
| 6 | 23.897/24.097 | f717/723 | transition | Step-14 pickup with a low boom (808 accent to ~78 Hz) on the cut to dark | cut to the dark "Plug into any LLM" scene at f718 |
| 7 | 24.097-35.297 | f723-1059 | **Main C** (7 bars) | Same loop, low end heavier. **Loudest stretch: 27.3-30.5 s** (short-term -11 LUFS, momentary peak -7.3 LUFS at ~28.2 s). UI blips on card selections, reverse swoosh into 27.43, sub drop at 30.3. Sparse-hat bar at 33.70-34.23 under "90%", whoosh 34.0-34.7 | Plug into any LLM, Deploy anywhere, Fully containerized, badges, the feature words, 200+ clients, 90% |
| 8 | 35.297-38.0 | f1059-1140 | **Main D: rapid list** (1.7 bars) | Beat continues with **a bright tick on every 8th note (every 0.2 s = 6 frames)** for each word swap. Last 808 note at 37.497 decays. The last bar's harmony moves to C | "Built for ..." x ~12 |
| 9 | 38.00-38.15 | f1140-1144 | **Stop** | Beat gone, near-silence (-16 dB) | "Agentic AI" glow builds |
| 10 | 38.30-39.25 | f1149-1177 | **Logo sting** | Glitch swoosh into a bright open C-bass chord (C6/9 colour) with a shimmer tail. The bright layer cuts at 39.25 s | white flash, then logo reveal (f1153) |
| 11 | 39.25-42.00 | f1177-1260 | **Outro** | Quiet wide pad (-25 to -30 LUFS) with two soft swells, 40.29-40.59 (f1209-1218) and 40.91-41.34 (f1227-1240), then a fade to silence at 41.95-42.00 | static end card (logo, "7-day trial" pill, URL), fade at the end |

There is no long breakdown in the middle. The energy is a **plateau** from 3.3 s to 38 s, with a slow upward drift that peaks at 27-30 s. Variety comes from micro-events (one-bar breaks, sparse-hat bars, sub drops, risers) placed on picture moments.

### Loudness curve

Momentary loudness (EBU R128, 400 ms), averaged per 0.5 s:

```
 t(s) frame LUFS
  0.0 f0    -22.9 |###################          intro pad fades in
  1.0 f30   -16.2 |#############################
  2.0 f60   -15.5 |##############################
  2.5 f75   -17.6 |###########################  pad thins, riser starts
  3.0 f90   -14.5 |################################  DROP at 3.297
  4.0 f120  -16.2 |#############################
  5.0 f150  -13.5 |#################################
  6.5 f195  -12.6 |###################################
  8.0 f240  -14.1 |################################
 10.0 f300  -12.2 |###################################
 12.5 f375  -11.8 |####################################  sub drop into cards
 14.0 f420  -15.7 |##############################
 15.0 f450  -11.5 |####################################
 16.5 f495  -11.4 |####################################
 18.0 f540  -11.7 |####################################  break (Publish)
 18.5 f555  -15.4 |##############################  pre-drop riser
 19.5 f585  -11.5 |####################################  DROP 2
 21.5 f645  -11.0 |#####################################
 23.5 f705  -10.5 |######################################  boom into the dark scene
 25.0 f750  -15.0 |###############################
 26.0 f780  -11.3 |####################################
 27.5 f825   -8.7 |########################################  loudest point
 28.0 f840  -10.1 |######################################
 30.0 f900  -12.0 |###################################
 31.5 f945  -11.1 |#####################################
 33.0 f990  -14.2 |################################  "90%" (sparse bar)
 34.5 f1035 -16.0 |##############################
 35.5 f1065 -13.2 |##################################  Built for...
 37.0 f1110 -12.4 |###################################
 38.0 f1140 -19.7 |########################  stop, then logo sting
 39.0 f1170 -22.6 |####################
 40.0 f1200 -24.7 |#################          outro pad
 41.0 f1230 -30.6 |########
 41.5 f1245 -45.9 |                           fade
```

Per second (momentary mean / max, LUFS): 0-1 -23.0/-19.8 · 1-2 -17.3/-15.4 · 2-3 -16.4/-14.9 · 3-4 -14.9/-13.8 · 4-5 -15.0/-12.8 · 5-6 -13.0/-11.7 · 6-7 -14.8/-11.9 · 7-8 -13.9/-12.3 · 8-9 -13.8/-12.7 · 9-10 -14.1/-12.5 · 10-11 -13.1/-11.4 · 11-12 -14.8/-13.3 · 12-13 -13.2/-11.0 · 13-14 -12.5/-11.2 · 14-15 -15.0/-12.9 · 15-16 -12.7/-10.8 · 16-17 -13.0/-11.0 · 17-18 -12.6/-10.9 · 18-19 -12.8/-11.1 · 19-20 -12.4/-11.3 · 20-21 -12.2/-10.2 · 21-22 -11.5/-9.4 · 22-23 -14.3/-12.3 · 23-24 -12.4/-9.9 · 24-25 -11.3/-9.4 · 25-26 -13.3/-11.5 · 26-27 -11.8/-11.1 · 27-28 -11.7/-8.6 · 28-29 -9.9/-7.3 · 29-30 -12.5/-11.3 · 30-31 -12.8/-11.6 · 31-32 -12.3/-10.7 · 32-33 -12.0/-10.4 · 33-34 -13.5/-12.0 · 34-35 -13.3/-11.6 · 35-36 -14.0/-12.1 · 36-37 -13.8/-12.9 · 37-38 -12.7/-11.3 · 38-39 -19.8/-17.1 · 39-40 -23.0/-19.0 · 40-41 -26.3/-22.6 · 41-42 -32.1/-28.5.

### Stereo width

| Section | 20-150 Hz | 150-1000 Hz | 1-5 kHz | 5-16 kHz |
|---|---|---|---|---|
| Intro 0.1-3.29 | corr +0.57 (S/M -5.6 dB) | corr -0.26 (S/M +2.3 dB, very wide/phasey) | +0.05 | +0.23 |
| Main 3.3-38.1 | **+0.88 (S/M -12 dB, mono)** | +0.07 (S/M -0.6 dB, very wide chords) | +0.35 (S/M -3.2) | +0.39 (S/M -3.6) |
| Outro 38.45-41.9 | +0.12 | -0.31 (S/M +2.6 dB) | -0.03 | +0.24 |

Most SFX sit in the centre. The exceptions are panned: the two "Or....." swishes (7.58 s hard-ish **left**, +9 dB L; 7.88 s **right**, -5 to -8 dB), the Publish click ring (left), and the notification pop at 22.14 (right).

### Harmony per bar (808 root -> chord)
Bar 2 (3.30) Eb · bar 3 (4.90) F · bar 4 (6.50) Gm -> Eb · bar 5 (8.10) Eb · bar 6 (9.70) F · bar 7 (11.30) Gm -> D · bar 8 (12.90) Gm · bar 9 (14.50) Eb · bar 10 (16.10) F -> Eb · bar 11 (17.70) Eb · bar 12 (19.30) Eb · bar 13 (20.90) F · bar 14 (22.50) Gm -> D · bar 15 (24.10) Gm · bar 16 (25.70) Eb · bar 17 (27.30) F · bar 18 (28.90) Gm · bar 19 (30.50) Eb -> F · bar 20 (32.10) Gm · bar 21 (33.70) F · bar 22 (35.30) Gm -> D · bar 23 (36.90) **C** · outro **C** (C6/9 then a C9sus colour).
Intro: Gm (G-Bb-D) for bar 0, then Eb/G (Ebmaj7 colour) from 1.70 s.

---

## 3. Beat grid (150 BPM, beat 1 of bar 0 = 0.097 s)

Bar n downbeat = 0.097 + 1.6n s. Beats every 12 frames, 16ths every 3 frames. Frames are rounded; the true position is 0.1 frame earlier.

| Bar | Downbeat (s) | Downbeat frame (exact) | Beat 1/2/3/4 frames | Note |
|---|---|---|---|---|
| 0 | 0.097 | 2.9 | 3 / 15 / 27 / 39 | intro pad |
| 1 | 1.697 | 50.9 | 51 / 63 / 75 / 87 | intro, chord change, riser from 2.55 |
| 2 | 3.297 | 98.9 | 99 / 111 / 123 / 135 | **DROP 1** |
| 3 | 4.897 | 146.9 | 147 / 159 / 171 / 183 | hard cut f147 (Drag.) |
| 4 | 6.497 | 194.9 | 195 / 207 / 219 / 231 | node lands f195, cut to "Or." on beat 3 (f219) |
| 5 | 8.097 | 242.9 | 243 / 255 / 267 / 279 | "...just vibe it" |
| 6 | 9.697 | 290.9 | 291 / 303 / 315 / 327 | prompt typing |
| 7 | 11.297 | 338.9 | 339 / 351 / 363 / 375 | prompt -> card |
| 8 | 12.897 | 386.9 | 387 / 399 / 411 / 423 | sub drop, cards fly in |
| 9 | 14.497 | 434.9 | 435 / 447 / 459 / 471 | 3D tilt (cut f429 = step 14 of bar 8) |
| 10 | 16.097 | 482.9 | 483 / 495 / 507 / 519 | |
| 11 | 17.697 | 530.9 | 531 / 543 / 555 / 567 | **Break**: Publish (cut f530) |
| 12 | 19.297 | 578.9 | 579 / 591 / 603 / 615 | **DROP 2**: montage (cut f579) |
| 13 | 20.897 | 626.9 | 627 / 639 / 651 / 663 | Report Is Ready (f649) |
| 14 | 22.497 | 674.9 | 675 / 687 / 699 / 711 | |
| 15 | 24.097 | 722.9 | 723 / 735 / 747 / 759 | dark scene (cut f718 = step 14 of bar 14) |
| 16 | 25.697 | 770.9 | 771 / 783 / 795 / 807 | Deploy anywhere |
| 17 | 27.297 | 818.9 | 819 / 831 / 843 / 855 | Fully containerized |
| 18 | 28.897 | 866.9 | 867 / 879 / 891 / 903 | badges (cut f866) |
| 19 | 30.497 | 914.9 | 915 / 927 / 939 / 951 | feature words |
| 20 | 32.097 | 962.9 | 963 / 975 / 987 / 999 | 200+ clients |
| 21 | 33.697 | 1010.9 | 1011 / 1023 / 1035 / 1047 | 90% (lands on step 14 of bar 20 = f1005) |
| 22 | 35.297 | 1058.9 | 1059 / 1071 / 1083 / 1095 | **Built for** (cut f1059) |
| 23 | 36.897 | 1106.9 | 1107 / 1119 / 1131 / 1143 | last beat bar; stop at f1140 |
| 24 | 38.497 | 1154.9 | 1155 / 1167 / 1179 / 1191 | logo sting (no drums) |
| 25 | 40.097 | 1202.9 | 1203 / 1215 / 1227 / 1239 | outro pad |

Sync habits of the reference edit:
- **Section changes land on downbeats**: f99, f147, f531 (cut at f530), f579, f867, f1059.
- **Many other cuts land on the step-14 pickup** (0.2 s = 6 frames before a downbeat): f429, f718 (pickup at 716.9), f1005 ("90%"), and the prompt cut at f287 (pickup at f285).
- The cut to "Or." lands on the beat-3 clap (f219).
- The remaining cuts sit within 1-2 frames of a 16th.

---

## 4. SFX

### 4a. Sound palette (recurring families, with recipes)

| ID | Family | Recipe / character | Used at |
|---|---|---|---|
| **A** | **Glitch swoosh** (the film's "magic/AI" transition) | Abrupt broadband noise burst (1-16 kHz, attack < 10 ms, ~0.4-0.5 s decay), 3-5 **falling digital chirps** (sine sweeps ~8 -> 4 kHz, ~40 ms each, staggered ~25 ms) and bubbly random sine blips at 8-13 kHz. Centred. **Its attack leads the visual flash by 4-5 frames.** | 1.38, 5.49, 21.49, 38.30 |
| **B** | **UI blip** | A click attack plus a short pure-sine ping (~50-80 ms), usually **two partials** (14-15 kHz with 3.5-6 kHz). Very bright, small, glassy. Lands on the exact frame of a state change | 7.30, 8.15, 25.57, 26.11, 26.63, 30.60, 30.97 |
| **C** | **Typing data-blips** | Same voice as B, but a run of ~8 single sine pips at random pitches (3.3, 5.8, 8, 10.5, 12-15 kHz), 2-3 per 0.1 s | 9.70-10.10, 10.37-10.47 |
| **D** | **Noise swish** | 0.1-0.3 s band-passed noise (1-12 kHz), fast in, fast out, sometimes panned | 7.58 (L), 7.88 (R), 8.10, 14.23, 25.04, 31.38, 35.08 |
| **E** | **Reverse swoosh** | Bright noise that swells and **cuts off abruptly on the hit frame** | 2.55-3.285 (with sparkles and rumble), 27.08-27.43, 33.07-33.45 |
| **F** | **Sub drop / low boom** | 808 glide down to ~27-30 Hz or a low swell, +5-10 dB in 20-80 Hz, ~0.25-0.35 s, peaking on the cut | 9.50, 12.70-13.05, 17.48-17.81, 23.80-24.05, 30.20-30.45 |
| **G** | **Shimmer riser** | Rising noise with twinkling sine sparkles (4-8 kHz) into a downbeat | 18.50-19.285 (also inside E at 2.55-3.285) |
| **H** | **UI click + ring** | Sharp double click (~10 ms apart) plus a thin 13 kHz sine ring (~0.45 s, left) | 18.28-18.80 (Publish) |
| **I** | **Bubble pops** | Clusters of tiny pops (2 kHz tonal plus 9-15 kHz blips), very quiet | 3.87, 4.08-4.27, 12.79-13.30 |
| **J** | **Ratchet ticks** | 5-6 tiny 12-14 kHz ticks, about one per frame | 26.88-27.07 (toggle slide) |
| **K** | **Word-swap tick** | 50-80 ms bright noise tick (centroid ~8-9 kHz) on **every 8th note (6 frames)** | 35.40-37.57 |

Level vocabulary used below:
- **prominent**: clearly the loudest thing in its band, lifting the 2-16 kHz (or sub) band by more than 8 dB, roughly 6-10 dB under the full mix.
- **medium**: lifts its band by +3 to 8 dB; about -10 to -16 dB relative to the mix.
- **subtle**: about 0 to +3 dB in band, -16 to -28 dB relative to the mix; felt more than heard.

### 4b. Full SFX table

Frames are start-end at 30 fps. "Music" in the Type column marks a track event that works as a hit, kept here so the sync list is complete.

| # | Time (s) | Frames | Type (family) | Dur | Pitch / brightness | Level vs music | Picture event it lands on | Conf. |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.30, 0.60, 0.70, 0.90, 1.10 | f9, f18, f21, f27, f33 | soft ticks (closed-hat-like clicks) | ~30 ms each | 3-12 kHz, airy | medium over the quiet pad (peaks -9 to -14 dBFS) | "Me -> Mee -> Meet" letters appearing (f8-f20); on the 16th grid (steps 2, 5, 6, 8, 10), so probably part of the intro music | med |
| 2 | **1.383-1.90** | **f41.5-57** | **glitch swoosh (A)** | 0.52 s | noise 1-16 kHz, falling chirps 7 -> 4 kHz (f43-48), blips 8-12 kHz | prominent (clearly the brightest element at that moment; 2-16 kHz band +3-4 dB over the already-bright pad and ticks) | "Meet" -> NeuralSeek logo glow flash; brightness peak **f46** (attack leads by 4.5 f) | high |
| 3 | 2.00-3.285 (noise from 2.55) | f60-98.5 (f76.5) | **reverse riser (E+G)**: noise + twinkling sparkles + low rumble swell (60-120 Hz +8 dB) | 0.73 s (noise) | dark-to-bright, sparkles 4-8 kHz; hard cut ~10 ms before the downbeat | medium | logo hold -> push/fade (f88-98) into the "Build" ring scene | high |
| 4 | **3.297** | **f99** | music: **DROP 1** (first kick + 808, Eb) | - | sub 39 Hz | - | "Build" types in on the drop, rings | high |
| 5 | 3.87-3.94 | f116-118 | bubble blips (I) | 70 ms | 9-15 kHz sine pips | subtle (-27 dB vs mix) | "AI agents in" words appear | med |
| 6 | 4.08-4.27 | f122.5-128 | bubble blips (I), ~5 pips | 0.19 s | 9-14 kHz | subtle (-21 dB) | "minutes" appears (~4.1-4.25) | med |
| 7 | 4.897 | f147 | music: downbeat kick after a 3-16th 808 gap | - | - | - | hard cut to the "Drag. Drop. Done" UI scene **f147** | high |
| 8 | **5.485-6.00** | **f164.5-180** | **glitch swoosh (A)** | 0.52 s | burst 1-16 kHz, falling chirps 9 -> 5 kHz (f168-171), bubbly blips 10-12 kHz (f171-179) | **prominent** (band +18 dB over the sparse bar before it; ~-15 dB vs mix) | "Drop." lights (f165); the "Post a Message" node is dragged and dropped (f168-172) | high |
| 9 | 6.497 | f195 | music: downbeat kick | - | - | - | node lands in the flow (f194-198) | high |
| 10 | 6.69-6.76 | f201-203 | small tick | 70 ms | 8-12 kHz, slightly L | subtle-med | "Done" lights up (f200) | low-med |
| 11 | 7.29-7.40 | f218.7-222 | **UI blip (B)**: 15 kHz pip (f219), then 14 kHz + 6 kHz (f221), on the beat-3 clap | 2 x 60 ms | glassy, very high | medium (-12 dB vs mix) | **hard cut to pastel "Or."** (f219) | high |
| 12 | 7.58-7.87 | f227.5-236 | noise swish (D), **panned L** (+9 dB) | 0.29 s | 1-8 kHz | medium | "Or......" dots run out to the right (f228-236) | high |
| 13 | 7.88-8.10 | f236.5-243 | noise swish (D), **panned R** (-5 to -8 dB) | 0.22 s | 1-8 kHz, slightly darker | medium | dots keep growing (f237-243) | high |
| 14 | 8.10-8.32 | f243-249.6 | swish (D) + UI blip (B) 14 kHz + 6 kHz at f244.5 | 0.22 s | bright | medium | line slides left, cut to "....just vibe it" **f245** | high |
| 15 | 8.84-8.90 | f265-267 | sparkle pop (B-like) | 60 ms | transient + pips 10 -> 6 kHz + 1.4 kHz | medium | "just vibe it" snaps to the bold/outlined 3D style; sparkles multiply (f265-267) | high |
| 16 | 9.43-9.62 | f283-288.6 | low boom (F): step-14 808 accent 43-51 Hz | 0.19 s | sub | strong in sub (+8 dB over the preceding audio) | cut to the prompt pill **f287** | med (could be pure 808) |
| 17 | **9.70-10.10** | **f291-303** | **typing data-blips (C)**, ~8 pips | 0.40 s | random 3.3-15 kHz sine pips, each 40-70 ms with a click | medium-subtle (band +6 dB; -16 dB vs mix) | "Prompt your agent into existence" types in (f290-306) | high |
| 18 | 10.37-10.47 | f311-314 | 2 more data-blips (13.5 kHz, 12 kHz) | 0.1 s | very high | subtle | arrow button lights / prompt complete | med |
| 19 | 11.57-11.67 | f347-350 | soft low thump + 9 kHz tick | 0.1 s | low 25-300 Hz + tick | subtle | prompt pill settles into the "Describe a use-case" card | low |
| 20 | 12.70-13.05 | f381-391.5 | **sub drop (F)**: 808 glides to ~27-30 Hz, after a 60 ms HF gap (12.72-12.78) | 0.35 s | sub, descending | strong in sub (+7 dB) | card shrinks away; node cards begin to fly in (f389-390) | med-high |
| 21 | 12.79-13.30 | f384-399 | bubble pops (I), ~10 pops | 0.5 s | 2 kHz tonal pops + 10-12 kHz blips | subtle (-21 dB vs mix) | node cards populate the canvas (f390-f420) | med |
| 22 | 14.23-14.35 | f427-430.5 | short bright swish (D) | 0.12 s | 2-12 kHz | medium (band +10 dB) | cut/tilt to the 3D chat panel **f429** | high |
| 23 | 16.68-16.92 | f500-507.6 | two small pops (16.70, 16.87) | 2 x 60 ms | 1-2 kHz body + HF | subtle | elements popping inside the 3D panel (unclear) | low |
| 24 | **17.48-17.81** | **f524-534** | **sub drop (F)**: 808 glide to ~27 Hz, swell peaking 17.68 | 0.33 s | sub, descending | strong in sub (+8-10 dB) | hard cut to the "Publish" button **f530** | high |
| 25 | 17.70-18.28 | f531-548 | music: **break** (hats and clap removed) | 0.58 s | - | - | Publish button alone, cursor approaches | high |
| 26 | **18.28-18.40** | **f548.4-552** | **UI click (H)**: two sharp clicks (18.28, 18.33), slightly L | 0.12 s | broadband click, bright | medium (band +13 dB over the break) | cursor **clicks Publish** (button press f549-550) | high |
| 27 | 18.36-18.80 | f550-564 | thin sine ring (H) | 0.45 s | 13 kHz pure tone, hard **left** | subtle | press glow / rings start (f552) | med |
| 28 | **18.50-19.285** | **f555-578.6** | **shimmer riser (G)** | 0.79 s | rising noise + sparkles 4-7 kHz | medium (inside the music) | rings expand around Publish -> **DROP 2 cut f579** | high |
| 29 | **19.297** | **f579** | music: **DROP 2** (full beat + vibrato lead) | - | - | - | montage of client screens | high |
| 30 | **21.49-21.90** | **f644.5-657** | **glitch swoosh (A)** | 0.41 s | burst + falling chirps 6 -> 3.5 kHz (f650-654) + blips | **prominent** (band +13 dB) | hard cut to the "Report Is Ready!" notifications **f649** | high |
| 31 | 22.14-22.21 | f664-666 | small notification pop | 70 ms | 5-6 kHz, panned **R** (-8 dB) | subtle | second notification card settles (right side) | low |
| 32 | 23.80-24.05 | f714-721.5 | **low boom (F)** on the step-14 pickup 23.897 (808 accent to ~78 Hz) | 0.25 s | sub/low | strong in sub (+5-8 dB) | cut from the pastel montage to the dark "Plug into any LLM" scene **f718** | med |
| 33 | 25.04-25.30 | f751-759 | soft mid swish (D), drifts left | 0.26 s | 2-5 kHz, dull | subtle | "Plug into any LLM" blurs out -> "Deploy anywhere" (f758-765) | low-med |
| 34 | 25.55-25.62 | f766.5-768.6 | **UI blip (B)** 15 kHz + 3.5 kHz | 70 ms | glassy | medium | **aws** card selected (f767-769) | high |
| 35 | 26.09-26.19 | f782.7-785.7 | **UI blip (B)** 14 kHz + 5.8 kHz | 0.1 s | glassy | medium | selection jumps to **IBM** (f783) | high |
| 36 | 26.57-26.70 | f797-801 | short reverse swell into a **UI blip (B)** at 8.4 kHz | 0.13 s | lower, rounder ping | medium-prominent (band +10-15 dB) | selection jumps to **Azure** (f799-801) | high |
| 37 | 26.88-27.07 | f806.4-812 | ratchet ticks (J) | 0.19 s | 12-14 kHz | subtle | the toggle starts to slide (f812-821) | med |
| 38 | **27.08-27.43** | **f812.4-823** | **reverse swoosh (E)**, abrupt stop at f823 | 0.35 s | flat bright noise 2-16 kHz | medium (band +8 dB) | transition to the "Fully containerized" server card (f817-825) | high |
| 39 | 28.897 | f867 | music: downbeat (no extra SFX found) | - | - | - | cut to the Enterprise-grade security badges (f866) | high |
| 40 | 30.20-30.45 | f906-913.5 | sub drop (F): 808 glide 54 -> 30 Hz, plus a HF burst at 30.27 | 0.25 s | sub + bright tick | medium | cut to "Semantic scoring" **f908** | med |
| 41 | 30.58-30.70 | f917.4-921 | **UI blip (B)** 14 kHz + 6 kHz | 0.1 s | glassy | medium | "Confidence thresholds" pops in (f918-920) | high |
| 42 | 30.95-31.08 | f928.5-932.4 | **UI blip (B)** 15 kHz + 3.5 kHz | 0.1 s | glassy | medium-subtle | "PII redaction" pops in (f930) | high |
| 43 | 31.38-31.78 | f941.4-953.4 | soft swish (D) | 0.4 s | 2-10 kHz | subtle | PII blurs out -> "Prompt injection safe" (f945) | med |
| 44 | 31.82-32.16 | f954.6-964.8 | mid swell (whoosh-in) | 0.34 s | 300 Hz-2 kHz, warm | subtle-medium | the "200+ Clients" logo wall blurs in (f960-967) | med |
| 45 | **33.07-33.45** | **f992-1003.5** | **reverse swoosh (E)**, abrupt stop | 0.38 s | dense bright noise | medium | into the **"90%"** reveal, which lands on the step-14 kick 33.497 (**f1005**) | high |
| 46 | 33.45-34.23 | f1003.5-1027 | music: sparse-hat bar (HF ~8 dB lower) | 0.78 s | - | - | 90% ring reveal and hold | high |
| 47 | 34.02-34.74 | f1020.6-1042 | whoosh (noise sweep with a 1.5 kHz tonal core) | 0.72 s | mid-bright | medium | "Save your time with task automation" rises in and settles | med |
| 48 | **35.08-35.22** | **f1052-1057** | bright swish (D) into the downbeat | 0.14 s | 2-14 kHz | **prominent** (band +14 dB) | cut to "Built for Fortune 50" on the downbeat **f1059** | high |
| 49 | **35.40 -> 37.57, every 0.2 s** | **f1062, 1068, 1074, 1080, 1086, 1092, 1098, 1104, 1110, 1116, 1122, 1127** | **word-swap ticks (K)** on the 8th-note grid (+15 ms) | 50-80 ms each | bright noise ticks, centroid 8-9 kHz | medium (band +5-7 dB) | each "Built for ___" swap. Picture swaps every ~5.5-6 f (f1064, 1069.5, 1075.5, 1081, 1087.5, 1092.5, 1097.5, 1103.5, 1108.5, ...); the ticks lead by 0-2 f | high |
| 50 | 38.00-38.15 | f1140-1144.5 | music: **stop** (beat ends; near-silence, -16 dB) | 0.15 s | - | - | "Agentic AI" glow builds (f1140-1150) | high |
| 51 | **38.30-38.77** | **f1149-1163** | **glitch swoosh (A)** | 0.47 s | burst + falling chirps 6 -> 4 kHz (f1152-1156) + blips | **prominent** (the only element at that moment) | "Agentic AI" flashes white and morphs into the **logo (f1153)** | high |
| 52 | 38.43-39.25 | f1153-1177.5 | logo sting chord + shimmer tail (music) | 0.82 s | bright open C-bass chord; the bright layer cuts at 39.25 | - | logo reveal and hold | high |
| 53 | 40.29-40.59, 40.91-41.34 | f1209-1218, f1227-1240 | soft pad swells (music) | 0.3 s, 0.43 s | warm mid pad | - | static end card (nothing moves) | high |
| 54 | 41.95-42.00 | f1258-1260 | fade to silence | - | - | - | end | high |

Events searched for with no SFX found: the hard cuts at 20.20 (f606) and 20.63 (f619) in the montage, the badge cut at 28.87 (f866), and the "Plug into any LLM" logos drifting (24-25 s). The music alone carries these.

### 4c. Sync rules to copy
1. **Glitch swooshes (A)** start **4-5 frames before** the visual flash or cut: f41.5 -> f46, f164.5 -> ~f169, f644.5 -> f649, f1149 -> f1153.
2. **UI blips (B)** land **on the exact frame** of the state change (selection, text pop): f219, f767, f783, f799, f918, f930.
3. **Reverse swooshes and risers (E/G)** **end exactly on the hit frame**, with a hard cut 0-1 frame before it: f98.5 -> f99, f823, f1003.5 -> f1005, f578.6 -> f579.
4. **Sub drops (F)** peak **on the cut frame** (f530, f718, f908) and start ~6-9 frames earlier.
5. **Rapid lists**: one tick per item, quantised to 8th notes (6 frames).

---

## 5. Brief for picking or composing the WKC track

**Target:** 150 BPM (half-time 75), 4/4, G minor (or any minor key, but keep the bVI-bVII-i loop feel), glossy hybrid trap / future bass, wide synth chords, 808 sub, half-time clap, 3-3-2 hats, about 42 s. Useful library search terms: "tech promo trap 150", "future bass corporate minimal", "SaaS product launch hip hop", "glitch transitions logo sting".

**Energy curve to match:**
1. 0-3.3 s: a wide pad intro around -17 LUFS (no drums), a logo glitch swoosh at ~1.4-1.9 s, and a riser that hard-stops ~10 ms before the downbeat.
2. 3.297 s (f99): full beat. Hold a plateau around -13 LUFS short-term with one-bar micro-variations.
3. 17.70-19.30 s: a one-bar break (drop the hats and claps), a click, and a shimmer riser into 19.297 (f579).
4. 19.3-24 s: drop 2, brighter (add a lead line).
5. 24-35.3 s: the darker, heavier part, peaking around 27.5-30 s.
6. 35.3-38.0 s: the rapid list with 8th-note ticks.
7. 38.0 s: stop. Glitch swoosh at 38.30, logo sting 38.43-39.25, quiet pad outro, fade out by 42.0 s.

**Hits the track must have (or that we add as SFX):**

| Time | Frame | Hit |
|---|---|---|
| 1.38-1.53 | f41.5-46 | glitch swoosh (logo reveal) |
| 3.297 | f99 | drop |
| 4.897 | f147 | downbeat cut |
| 5.485 | f164.5 | glitch swoosh |
| 7.297 | f219 | beat-3 clap cut |
| 8.097 | f243 | downbeat |
| 9.497 | f285 | pickup accent |
| 12.70-13.0 | f381-390 | sub drop |
| 14.297 | f429 | pickup cut |
| 17.68 | f530 | sub drop / break |
| 18.28 | f548 | click |
| 19.297 | f579 | drop 2 |
| 21.49 | f644.5 | glitch swoosh |
| 23.897 | f717 | low boom into the dark section |
| 27.43 | f823 | reverse swoosh end |
| 28.897 | f867 | downbeat |
| 30.27 | f908 | sub drop |
| 33.45/33.497 | f1003.5/1005 | reverse swoosh into the "3" / "90%" moment |
| 35.297 | f1059 | downbeat into the "Built for" list |
| 38.0 | f1140 | stop |
| 38.30 | f1149 | glitch swoosh -> logo at f1153 |
| 39.25 | f1177 | sting tail cut |
| 41.95 | f1258 | end |

### WKC mapping (same frames, new meaning)
- #2 glitch swoosh (f41.5) -> the **wkc monogram + wordmark** glow reveal at 1.5 s.
- #3/#4 riser and drop (f99) -> "Motion that makes it click" lands on the drop. Bubble blips #5/#6 work as per-word pops for "makes it click"; put a crisp **click** on "click".
- #8 glitch swoosh (f164.5) -> the "Engage." beat of "Explain. Engage. Convert." (keyframe snap on a timeline). #10 tick -> "Convert." lights.
- #11-#15 -> "Or just look incredible.": blip on "Or.", L/R swishes as the dots run, a sparkle pop when "incredible" goes bold/3D.
- #17/#18 typing blips -> "Tell us what needs explaining" typed into the brief field.
- #20/#21 sub drop and bubble pops -> the brief breaks into storyboard frames. #22 swish -> the 3D tilt into compositions or animated scenes.
- #24-#28 -> the "Export" button: sub drop on the cut, break, **click at f548-550**, shimmer riser into the f579 montage drop.
- #30 glitch swoosh -> a hero cut inside the client-video showcase (21.6 s).
- #32 low boom (f718) -> "Made for every platform" (dark section).
- #34-#36 UI blips -> each platform or format card selected ("Publish anywhere": website / LinkedIn / Instagram / ad).
- #37/#38 ratchet and reverse swoosh -> "Multiple versions / One project".
- #40-#44 -> "Detail-driven design", "Clear messaging", "Smooth transitions", "Every frame intentional" (a blip per word pop).
- #44 -> "2 Founders, 1 Studio" portraits blur in.
- #45 reverse swoosh -> "3" lands at f1005, then the 16:9 / 1:1 / 9:16 formats (#47 whoosh as "Formats for your website and socials" rises).
- #48/#49 -> the six "Built for" statements. The WKC script uses 0.5 s (15 frames) per statement. That is not on the 150 BPM 8th grid (6 frames). Either keep a tick on every swap anyway (ticks then fall on every 15 frames), or retime the statements to 12 frames (1 beat) each so they stay on the beat.
- #50/#51 -> stop at f1140, then a glitch swoosh into the **WKConversions logo** at f1153. #52 sting, #53 pad swells under "Let's talk" (39-41.5) and wkconversions.com. Optionally place a soft UI blip (B) when the "Let's talk" pill glows on, around 39.0-39.3.
