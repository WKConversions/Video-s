# Wicflow: music and sound notes

Film: 37.5 s (1125 frames at 30 fps). The voice (`vo/vo.mp3`, 35.0 s) sets the arc: the hook (0.09), the brand (5.59), the
work starts (10.83), follow-ups (14.44), connects (18.09), the pilot (21.52), the payoff run (26.38; "customers" 29.51),
the brand line (30.71, ends 34.99), then the logo end card to 37.5.

## Pick: "It's Love", found on Mixkit, fitted (`sound/music/its-love-fit.wav`)

| | |
|---|---|
| Track | "It's Love" by Michael Ramir C., Mixkit, Corporate Music, 97 s (`sound/music/source/it-s-love.mp3`) |
| Tempo, key | 110.01 BPM (bar 2.182 s), A major |
| Film sections | 0.00 to 10.96: the track's intro (pads, e-piano, plucks; no drums) under the hook and the brand. **10.96: drums and bass come in** (track 21.75), on "From finding the right prospects". 19.69: an inaudible join inside that section (one bar dropped so the next lift lands). **26.24: the full four-on-the-floor section** (track 39.21), on "Less manual work". 30.60: joined on a 4-bar phrase into the song's last bars under the brand line. **35.03: its own final chord**, ringing out to silence by about 37.1 s on the end card |
| Loudness (file) | −14.1 LUFS integrated, peak −0.4 dBFS. By section: hook −18.3, work −16.3, pilot −15.0, payoff −10.3, brand line −10.7, end card −19.2 LUFS |
| Busy-ness | 2.11 onsets/s overall (music_find's measure; the skill's "optimistic, confident" band is 2 to 2.5). Spectral-flux peaks per section: hook 0.3/s, work 5.8, pilot 6.2, payoff 5.3, brand 4.9 (2.9 to 3.9 in the voice band) |
| Licence | Mixkit Stock Music Free License: commercial use, no credit required |
| Credit (for the README) | Music: "It's Love" by Michael Ramir C., Mixkit (mixkit.co), Mixkit Stock Music Free License |

Why this one:
- **It already has the film's arc.** Quiet under the hook, the beat enters where the work starts, the full beat arrives on the payoff, and the song's real final chord rings on the end card. The fit needed only two joins on bar lines, both between bars that sound alike.
- **It's a real production.** CLAP (an audio-language model) heard it as the least synthetic of the three options and well above the median of all 131 candidates on "upbeat corporate", "premium tech" and "inspiring". The composed bed reads as more toy-like.
- **It stays out of the voice's way.** It's instrumental (no vocal section in any 6-s window), and under the hook the bed is nearly static (0.3 onsets/s).
- Caveat: at 110 BPM it is bright and confident rather than driving. If Karl wants more push, the alternatives are below.

Fit command (reproducible: `cmp` against the delivered file is identical):
`python3 scripts/music_fit.py sound/music/source/it-s-love.mp3 sound/music/its-love-fit.wav --length 37.5 --lift 10.8,26.4 --end-hit 35.0 --max-early 1.5 --sheet sound/music/its-love-fit-cut.png`

## Alternatives

**Composed: `sound/bed_composed.wav`** (brief `sound/music-brief.json`, `scripts/music_make.py`; original, royalty-free)
- 110 BPM, E major, bar 2.182 s. That tempo puts bar lines at 10.91 (lift), 26.18 (payoff), 30.55 (brand line) and 34.91 (end chord). Vibe calm-optimistic pushed brighter and tighter: no swing, a firmer kick, more e-piano, no glassy bells.
- Sections by bar: 0 pad and e-piano motif (hook); 2 (4.36) plucked arpeggio and hats; riser; 5 (10.91) kick, bass, claps; 11 (24.00) a one-bar breath, then a riser; 12 (26.18) the peak (16th arpeggio, open hats, piano on 1 and 3); 14 (30.55) back to the groove; 16 (34.91) the end: a struck E chord with bass, soft kick and pad, ringing to about 37.0.
- Progression I V vi IV | V I V vi | IV I V IV | I V IV V, then I: the first lift lands on I (V to I), the payoff on I (IV to I), the end on V to I.
- −16.2 LUFS, peak −2.7 dBFS. By section: hook −19.0, work −15.7, pilot −16.5, payoff −13.7, brand −16.1, end card −17.3. 1.79 onsets/s.
- Lands exactly on the film, but sounds synthesized: CLAP hears "kids/toy" about one standard deviation above the found tracks. Good as a fallback, or if Karl wants hits on exact frames.

**Found, punchier: `sound/music/motivating-mornings-fit.wav`** ("Motivating Mornings" by Ahjay Stelino, Mixkit, Corporate Music; credit not required)
- 121.05 BPM, D minor/F major. Lift at 10.67 (bass and beat in); the second lift at 26.53 is weak (+8, barely a change); final chord 34.51, ring-out faded at 37.5.
- −12.1 LUFS, 2.83 onsets/s. Busier under the hook (a stuttering pulse) and brighter overall. Note: the tonal effects (A-major pentatonic) include C#, which is outside D minor.

Rejected after measuring (sheet `sound/music/candidates.png`, all 131 tracks in `candidates.json`):
- Cat Walk: fashion-house pumping under the hook, and it ends in a fade, not a chord.
- Rising Forest: full kick under the hook; the payoff joins into a breakdown.
- Tech House vibes: flat, and has vocal chops.
- Newer Wave (Incompetech, CC BY): busy under the hook.
- Happy Times: flat, no lifts.
- Digital Clouds: hard stop, no ring-out.
- What About Action?: has a vocal section; no ending fits after the second lift.
- Fantasia Fantasia: flat, no ending fits.
- Deep Urban: DJ-style fade-out ending.
- Mixkit's "energetic" mood pages are rock and metal.

## Voice against the bed (test mix `sound/test_vo_music.wav`, picture `sound/test_mix.png`)

Made with `sound_mix.py` (cue file `sound/test_cues.json`, no effects), using the mixer's levels: voice −16 LUFS, bed −27 LUFS, ducked 6 dB on the voice envelope, fade-in 0.3 s, fade-out 0.5 s so the last chord's ring survives. Master −15.2 LUFS, peak −1.5 dBFS, 37.50 s, 48 kHz.

| | It's Love (pick) | composed | Motivating Mornings |
|---|---|---|---|
| bed after ducking (integrated) | −32.1 LUFS | −32.0 | −31.9 |
| duck applied while speaking (median) | 5.8 dB | 5.8 | 5.8 |
| voice over bed while speaking (median, 400 ms) | 17.0 dB | 17.2 | 16.9 |
| voice over bed: hook / work / payoff / brand line | 20.8 / 18.3 / 12.1 / 12.3 dB | 19.4 / 18.4 / 12.9 / 16.0 | 22.2 / 17.6 / 14.1 / 12.3 |
| bed on the end card (35 to 37.5, momentary median) | −38.8 LUFS (a quiet ring-out) | −32.4 | −28.4 |

The voice's harmonics sit clearly above the bed everywhere (see `test_mix.png`). The bed is closest on the payoff (12 dB under), which is where it should open up. The pick's ring-out is quiet, so the logo's impact and sparkle carry the end card. `sound/test_vo_composed.wav` is the same mix over the composed bed.

## Effects palette (`sound/lib`, 38 generated sounds; `catalogue.md`, `sfx/index.json`, waveforms `waves_1.png`, `waves_2.png`)

All are royalty-free, made by `scripts/sfx_synth.py` and heard by CLAP (`sfx_hear.py tag`; tone scales in the index). The palette for this film:

| moment | id | sync s | length s |
|---|---|---|---|
| a card or word arriving | `gen-whoosh-soft-short` | 0.177 | 0.82 |
| a whip, a panel flying | `gen-whoosh-soft-medium` | 0.330 | 1.10 |
| tiles and badges landing (a run: 1, 2, 3 = A5, C#6, E6) | `gen-pop-soft-1`, `-2`, `-3` | 0.005 | 0.55 |
| the product's UI click (press and release) | `gen-click` | 0.000 | 0.35 |
| a finger tap / one key | `gen-tap-soft` / `gen-key` | 0.000 | 0.40 / 0.45 |
| a counter, a stepped list | `gen-tick-soft`, `gen-tick-soft-hi` (alternate) | 0.000 | 0.20 |
| a type-on's start (6 keys in 0.52 s) | `gen-typing-run` | 0.000 | 1.12 |
| message sent | `gen-send` | 0.291 | 0.85 |
| message arrives (E6 up to A6) | `gen-chime-soft` | 0.005 | 3.40 |
| done, booked, a customer (C#6 E6 A6) | `gen-success-soft` | 0.005 | 3.20 |
| a build into a reveal | `gen-riser-soft-1s` / `gen-riser-soft-2s` | 1.000 / 2.000 | 1.80 / 2.80 |
| the logo landing | `gen-impact-logo` | 0.005 | 2.80 |
| the brand moment | `gen-sparkle` | 0.005 | 3.80 |
| a scan, data found (7 blips, 65 ms apart) | `gen-data-blips` / `gen-blip` | 0.000 | 1.00 / 0.42 |
| a slow push, a scene opening | `gen-swell-low` | 1.151 | 3.20 |

Also kept from before: `gen-whoosh-short/medium/whip/deep`, `gen-riser-1s/2s` (brighter; CLAP hears a "laser"), `gen-impact-soft/deep`, `gen-stamp`, `gen-shimmer` (higher and brighter than `gen-sparkle`), `gen-swell`, and the earlier `gen-tick`, `gen-tap`, `gen-pop`, `gen-chime`, `gen-success` and `gen-appear` (CLAP rates these more toy/retro; the soft ones replace them here).

Checked in a scratch mix over the pick (22 cues across the film): 21 of 22 clear the bed by 3 dB or more. Two things to know for the final mix:
- **Risers are always lifted the maximum 4 dB.** The mixer measures what follows a cue's sync, and a riser's sync is its end. Give riser cues `"db": -4`, or judge them by ear.
- **A pop under a word comes out about 1 dB from the voice.** A pop's momentary peak is high for its LUFS, so place pops between words, or at `"db": -3`.

## Script changes (in `films/wicflow/scripts`, documented in each header)

- **`music_fit.py`**
  - `--lift a,b` (two lifts on one bar grid, with an optional join before the second).
  - `--end-hit t` (puts the song's final chord at t, where the music stops being sustained, and lets it ring into the end card).
  - The downbeat now comes from where the track's sections change, when they agree (60 % vote). The kick/bass guess was 2 beats off on four-on-the-floor tracks, which put every lift and join mid-bar.
  - A join now starts exactly where the outgoing part was cut. Before, up to 40 ms of silence was left at a join (a dropout).
  - Single-lift fits without `--end-hit` are unchanged, apart from the two fixes.
- **`music_make.py`**
  - The brief's `"mix"` overrides the vibe's instrument levels.
  - The end chord is struck once (it was struck again on any later "end" bar), with plucks and bells when the vibe has no piano, plus bass, a soft kick and a decaying pad. With an end section, the final fade is 0.5 s instead of 2.5 s, so the chord rings out.
  - Hats, claps and the riser are low-passed above 10 kHz: 12 to 20 kHz was 8 to 15 dB hotter than in produced library tracks (hiss).
- **`sfx_synth.py`**
  - Adds the 21 soft-palette sounds.
  - Measures every generated sound's sync and transients from its file, as `sfx_build.py` does for Karl's sounds: whooshes and swipes at their loudest moment, risers at the end of the climb, the rest on the first strong transient, taken at the attack.
  - Keeps generated ids it doesn't make.
  - Corrected sync of an existing sound: `gen-shimmer` 0.000 to 0.035 (the sounds that already existed are otherwise unchanged).
- **`sfx_index.py`**: importable (its `main()` only runs as a script).
