# VoxFlow music bed: notes

Film: 32.000 s Dutch SaaS explainer, with timings from `vo/words.json`. Hook 0.42-2.27 ("Mis geen enkel telefoontje meer."). The turn at 2.70 ("Met VoxFlow…"). Product groove 5.93-27.99. CTA 28.42-30.17 ("Start vandaag nog met VoxFlow."). End card 30.2-32.0.

## Pick: "The Great Wall", Michael Ramir C. (Mixkit)

| | |
|---|---|
| Title / artist | The Great Wall, Michael Ramir C. |
| Source | Mixkit, genre Synthpop, mood "positive", 1:46 (106 s), Mixkit asset 930 |
| File | https://assets.mixkit.co/music/930/930.mp3, kept as `sound/music/source/the-great-wall.mp3` |
| Mixkit listing | https://mixkit.co/free-stock-music/synthpop/ (also on the https://mixkit.co/free-stock-music/mood/positive/ pages). Mixkit has no per-track page for music. |
| Licence | **Mixkit Stock Music Free License**: commercial use allowed, no credit required. The track's own schema.org record on Mixkit reads `"copyrightNotice": "Mixkit Stock Music Free License"`, `"license": "https://mixkit.co/license/#musicFree"`, `"isAccessibleForFree": true`. |
| Tempo | 128.03 BPM (music_fit's estimate; bar 1.874 s). music_find's rough estimate was 129.2. |
| Fit command | `python3 scripts/music_fit.py sound/music/source/the-great-wall.mp3 sound/music/the-great-wall-fit.wav --length 32 --lift 2.6 --end-hit 30.3 --max-early 1.0 --sheet sound/music/the-great-wall-fit.png` |
| Output | `sound/music/the-great-wall-fit.wav`: 48 kHz, stereo, 16-bit, exactly 1,536,000 samples (32.000 s) |
| Loudness (ffmpeg ebur128) | Integrated **-17.6 LUFS**, LRA 4.2 LU, true peak -2.6 dBTP |

**Why `--lift 2.6` and not 2.7.** The track's attacks fall about 0.06 s after the tool's bar grid. At `--lift 2.7` the entry hit at 2.78 and the final chord at 2.7 + 27.97 = 30.67. Moving the grid 0.1 s earlier puts both where the film wants them.

**Where things land (film time, measured on the output wav with librosa onsets and per-band RMS):**

- 0.00-0.60: the edit begins inside the music (pre-rolled from track 59.22 s) with a 0.6 s fade-in. Under the hook, plucked synth arpeggios play at **-27.0 dB** RMS (0.42-2.3).
- **2.67: the lift.** The tool puts the bar line at 2.60; the first attack is measured at 2.67, a strong onset with a +11.4 dB step (bass and kick enter). It lands just before "Met" (2.70).
- 2.67-12.0: the punchy first section. 4.47 is a smaller entry (+12).
- **10.10: the one join.** It cuts from track 69.32 s to 74.94 s, dropping 3 bars. Chords on both sides are the same B♭m/D♭ vamp, so nothing clashes. The bar's chroma similarity is 0.88, against a typical 0.99, and the level drops 1.3 dB.
- 12.0-15.7: a breakdown with a filter sweep, about 8 dB quieter, under "plant afspraken automatisch in / zo hoef jij niet constant…".
- 15.72: re-entry into the full section (+22), on "gaten".
- About 26.3-30.8: a three-tone pitch riser climbing from about 300 Hz to about 5 kHz, under "haal meer uit ieder telefoontje" and the CTA.
- 30.1-30.4: the kick drops out for a beat.
- **30.54-30.56: the final chord** (bass and kick hit, measured; the tool predicted 30.52). The riser's top ends about 30.8 and the chord decays to about 31.9. music_fit fades the last 0.8 s, because the real ring-out would run to about 33.9.

**Why this one** (decided on measured facts; I could not listen to the audio):

- Quiet-ish intro under the hook. The hook is 8 dB under the groove, and it is plucks, not drums.
- A real entry at the turn: 2.67, onset strength 4.6× the body's 95th percentile.
- In the calmest quarter of the 70 measured tracks: 2.18 onsets/s (music_find), 15th of 70. The loudness swing per beat is moderate (12.9 dB), not house-style pumping.
- The brightest of the top three: 2390 Hz brightness (14th of 70) and a 2.6 kHz spectral centroid. Modern synth-pop production (plucks, synth bass, claps); no ukulele, acoustic guitar or cheesy tag on Mixkit.
- A real ending: a struck chord that rings, not a fade or a dead stop.
- Its arc suits the film. Lift at the turn, a breather mid-explanation, full energy from 15.7 and a build into the end-card chord.

## Runner-up: "Electro Dreams", Arulo (Mixkit)

Mixkit, genre House, 1:56. https://assets.mixkit.co/music/190/190.mp3 (audio deleted, re-download from that URL). Same licence. 119.74 BPM.

Best fit: `python3 scripts/music_fit.py <electro-dreams.mp3> sound/music/electro-dreams-fit.wav --length 32 --lift 2.5 --end-hit 30.3 --max-early 1.0`. Measured on that fit:

- The hook is very quiet (-34.6 dB, a filtered kick only).
- The drop is huge (+20 dB) and lands at 2.81. The tool's bar grid sits 0.3 s ahead of the track's real downbeats, so with `--lift 2.7` the drop lands at 3.00, on "VoxFlow".
- The last hit lands at **30.20** and rings to about 31.4.
- The join (8.51) is seamless (chroma 0.98).

Not chosen for these reasons:

- It is sidechain-pumped house, with a 28 dB loudness swing per beat. That is energetic but not smooth under a voice.
- It is busier (2.67 onsets/s).
- Its ring-out is short; the last 0.6 s is near-silent.

Third place, Uplift Me (Ahjay Stelino, https://assets.mixkit.co/music/35/35.mp3, 120.0 BPM), is the warmest: clearly D major, with a pad hook and an entry at 2.72. Its production is darker (centroid 0.7 kHz, electric guitar), a white-noise riser sits under the CTA, and its chord lands at about 30.7.

All eight finalists, with their fit plans, measurements and the reason each lost, are in `sound/music/candidates/candidates.json` and `candidates.png`. Every track measured is in `candidates/screened.json`.

## Composed alternative: `sound/music/composed-fit.wav`

Royalty-free by construction, made with `scripts/music_make.py` from the brief `sound/music/composed-brief.json`:

- **tech-minimal** vibe, D major, **121.739 BPM** (bar 1.9714 s). That tempo makes exactly 14 bars between 2.70 and 30.30.
- It is rendered 1.2429 s long at the start and trimmed, so bar 2 = 2.70 (the turn), bar 8 = 14.53, bar 10 = 18.47, bar 12 = 22.41, bar 15 = 28.33 (CTA "Start" 28.42) and bar 16 = 30.30 (the end chord).
- One chord per bar: IV V | I V vi IV … | I V | I. That gives a IV-V-I cadence into the turn and V-I into the end card.
- Energy by bar: 0 1 | 2 ×6 | 1 1 | 3 3 | 2 2 2 | 3 | end. That is pad under "Mis geen…", then plucks and a riser into the turn, a groove, a lighter pass under "zo hoef jij niet…", a lift for "VoxFlow werkt professioneel, snel…", and a lift for the CTA.

```
python3 scripts/music_make.py sound/music/composed-brief.json <scratch>/composed-render.wav
ffmpeg -i <scratch>/composed-render.wav -af "atrim=start_sample=59657,asetpts=PTS-STARTPTS,apad=whole_len=1536000,atrim=end_sample=1536000,afade=t=in:st=0:d=0.3" -ar 48000 -ac 2 -c:a pcm_s16le sound/music/composed-fit.wav
```

The output is 48 kHz, stereo, 16-bit, exactly 1,536,000 samples. Measured:

- **Lift at 2.71** (first attack after the 2.700 bar line; +15.6 dB, hook -30.2 dB → groove -16.4 dB).
- **End chord at 30.31-30.33**, ringing to about 31.6, with the last 0.5 s faded.
- Loudness **-15.0 LUFS** integrated, LRA 6.9 LU, true peak -2.6 dBTP.

Picture: `sound/music/composed-fit-look.png`.

## Known problems

- **Riser under the CTA (pick).** From about 26.3 to 30.8 the three rising tones sweep through 0.3-5 kHz, the voice's presence range, under "haal meer uit ieder telefoontje" and "Start vandaag nog met VoxFlow". The mix should duck harder there, or dip 1-4 kHz on the bed, so the CTA stays clear.
- **Join at 10.10 (pick).** Three bars are dropped, so the phrase runs 5 bars instead of 4. The chords match (B♭m/D♭ on both sides), but the join should be checked by ear.
- **Harmony (pick).** It is a B♭m/D♭ vamp; key detection is ambiguous (F minor 0.46). It reads cool and modern rather than overtly warm. If the client wants warmer and plainly major, use Uplift Me or the composed bed (D major).
- **Final chord (pick)** lands at 30.55, 0.05 s past the 30.2-30.5 window and 0.38 s after "VoxFlow" ends (30.17). Its natural ring-out runs past 32 s, so music_fit fades it over 31.2-32.0.
- **Breakdown 12.0-15.7 (pick).** The bed drops about 8 dB in the middle of the product explanation and comes back at 15.72, mid-sentence ("gaten"). The mixer may want to ride it up a little.
- **Film start (pick).** The edit opens inside the music with a 0.6 s fade-in, so the first word, "Mis" (0.42), comes before the fade is complete.
- **Loudness.** Both beds are full-scale stems (pick -17.6 LUFS, composed -15.0 LUFS). They need to be set well under the voice in the mix; nothing has been ducked yet.
- **Licence text.** Mixkit's licence page loads the Stock Music Free License text in a script modal, which I could not fetch from the sandbox. The licence name and URL above come from the track's own Mixkit metadata. Before delivery, open https://mixkit.co/license/#musicFree once to confirm the current terms. As I recall them: no credit needed and commercial use allowed, but no standalone redistribution or resale, and no Content ID registration.
- **Composed bed.** Its instruments are synthesised in numpy (a Karplus-Strong pluck, an FM bell, a simple kick and clap), so it sounds plainer than produced library music. The energy-3 bars (18.47-22.41 and the CTA) are busy under the voice (16th-note plucks, a kick on every beat). The noise risers (1.7-2.7, 17.5-18.5, 27.3-28.3) add hiss under "telefoontje meer", "bedrijf" and "telefoontje".
- **How I searched.** I used `scripts/music_find.py` through its own functions (Mixkit scrape, `analyse`, score formula, `sheet`), with two changes. Its Incompetech branch was switched off, because this brief is Mixkit only. All listing pages of each mood were read, where the script reads only page 1. That gave 191 Mixkit tracks after excluding children, country, holiday, rock, folk, jazz, funk and anything tagged cheesy, ukulele or acoustic guitar. Of those, 70 were downloaded, measured and fitted in scratch, and 8 finalists are recorded here. The BPM in music_find's output is coarse (half or double tempo is common). The values above come from music_fit.
