# WKConversions: music notes

Film: 46.0 s (1380 frames at 30 fps). The voice (`vo/vo.mp3`, 44.2 s) carries the arc: the problem (0.0 to 15.0), **the turn**
(15.34, "That's where WKConversions comes in"), what we do (18.4 to 26.8), how (27.3 to 33.3), "No random animations" (33.6),
the sign-off rise (37.55, "WKConversions."), the three tag lines, "convert" ending at 44.19, the end card (44.2) to 46.0.

## Pick: "Let's Move", found on Mixkit, fitted (`sound/music/lets-move-fit.wav`)

| | |
|---|---|
| Track | "Let's Move" by Michael Ramir C., Mixkit, EDM, 101 s (`sound/music/source/lets-move.mp3`, from assets.mixkit.co/music/836/836.mp3) |
| Tempo | 117.66 BPM (bar 2.040 s) |
| File | 48 kHz stereo, exactly 46.000 s, starts at film 0 (the track's first bar is pre-rolled; the first pluck is at about 0.4 s) |
| Film sections | 0.0 to 15.3: the track's intro, sparse plucks and a filtered pulse, no kick or bass (the problem statement). **15.38: drums and bass drop in** (audible step measured at 15.38 s; the turn is 15.34). 15.4 to 44.2: the groove; it fills out slightly from about 30.5 (brighter top end). 37.66: the track's next section (a small entry, +8.6, see problems). 41.74: an inaudible join on a bar line into the song's last bars. **44.25: its own final chord** (end card 44.2), ringing out and faded at 46.0 |
| Loudness (file) | −12.0 LUFS integrated, peak −0.4 dBFS. By section: hook −26.8, turn −13.1, work −12.4, "no random" −10.9, sign-off −11.0, end card −19.0 LUFS |
| Busy-ness | 2.87 onsets/s overall (music_find's measure); hook 0.84/s, 15.5 to 37.7 3.5/s |
| Licence | Mixkit Stock Music Free License: commercial use, no credit required |
| Credit (for the README) | Music: "Let's Move" by Michael Ramir C., Mixkit (mixkit.co), Mixkit Stock Music Free License |

Why this one:
- **The turn lands on the frame.** It has a real, quiet intro and a drop that the fit puts at 15.38 s, 40 ms after the turn (15.34). The hook is nearly empty under the problem statement (0.84 onsets/s), and the music arrives with the solution: +14 dB.
- **It ends on its own chord at the end card.** One join at 41.74 s, on a bar line between bars that sound alike (no step visible in `lets-move-fit.png`), puts the song's last chord at 44.25 s, after "convert" (44.19). Then it rings out over the logo.
- **It is a real production, and it stays out of the voice's way.** It's instrumental. CLAP heard it as neither cheesy nor kids, retro or rock (z −0.9, −0.6, −1.3, below average). It is a bright, pluck-led EDM groove at 118 BPM: driving and confident, not loud.

Fit command (reproducible):
`python3 scripts/music_fit.py sound/music/source/lets-move.mp3 sound/music/lets-move-fit.wav --length 46 --lift 15.34,37.55 --end-hit 44.3 --max-early 1.5 --sheet sound/music/lets-move-fit-cut.png`
(picture of the result: `sound/music/lets-move-fit.png`, marks at 15.34, 33.6, 37.55, the join 41.74 and 44.2)

Problems to know:
- **No real lift at the sign-off and no breakdown at "No random".** After the drop the level is flat (−11 to −12 LUFS from 15.4 to 44). The track's next entry falls at 37.66, but it is small, and there is no dip at 33.6. A riser into 37.55 and an impact there (`gen-riser-soft-2s`, `gen-impact-soft`) would carry the rise. The composed option below has both built in.
- **The hook is very quiet.** At the mixer's −27 LUFS bed, the first 15 s sit about 32 dB under the voice. It works as tension, and it makes the drop bigger, but if the opening feels empty, give the music bus +4 to +6 dB before 15.3 s.

## Alternative: composed (`sound/music/composed-fit.wav`; original, royalty-free)

Brief: `sound/music-brief.json`, rendered with `scripts/music_make.py`, then trimmed by 0.9136 s so that bar 9 lands on the turn:
`python3 scripts/music_make.py sound/music-brief.json raw.wav && ffmpeg -i raw.wav -af "atrim=start_sample=43855,asetpts=PTS-STARTPTS,apad=whole_len=2208000,atrim=end_sample=2208000,afade=t=in:st=0:d=0.3" -c:a pcm_s16le sound/music/composed-fit.wav`

- 132 BPM, D major (vi IV I V loop), tech-minimal vibe with a soft e-piano, no bells. 48 kHz stereo, 46.000 s.
- Sections in film time: 0 pad and e-piano (hook); 6.36 pluck pulse and hats; riser; **15.45 kick, bass, claps (the turn)**; 26.36 full groove; **33.63 breakdown** ("No random animations"); riser; **37.27 full groove back** (in the pause after "good", 0.28 s before the sign-off rise at 37.55); **44.54 the final D chord** (V to I), ringing to 46.0 with a 0.5 s fade.
- Why 132 BPM: no tempo in 115 to 128 puts bar lines on the turn, the sign-off and an end chord after "convert" all at once. At 132 BPM they fall at 15.45, 37.27 and 44.54, and the breakdown at 33.63.
- −14.5 LUFS, peak −2.7 dBFS. By section: hook −20.6, turn −14.5, work −12.9, breakdown −18.0, sign-off −11.8, end card −14.9 LUFS. 2.57 onsets/s overall (hook 0.90).
- Every beat is built in, but it sounds synthesized (the previous film's composed bed read as more toy-like than library tracks). Use it if Karl wants the breakdown and the sign-off lift in the music itself.

## Search (candidates kept outside the repo, in /tmp/claude-0/music_wkc/)

- 616 Mixkit tracks crawled (moods energetic, driving, dynamic, propulsive, determined, powerful, confident, exciting, futuristic, elegant, uplifting, insistent, tension, motivating, positive; genres corporate, electronic, electronica, electropop, electro-house, house, deep-house, EDM, future bass, breakbeat, minimalism, dance-pop; tags corporate, technology, sports, future-bass…). 402 kept after genre and length filters, plus 16 driving synth pieces from Incompetech (CC BY).
- All 418 were measured: exact tempo (music_fit's comb), loudness per 2 s, ending type and onsets/s. CLAP (laion/larger_clap_general, the first 10 s plus 3 × 10 s) heard each against premium-tech, driving, confident, corporate, cheesy, kids, rock, folk, vocals, hip hop, retro and tense prompts.
- 194 were in 113 to 133 BPM. All of them were fitted with `music_fit.py` (`--lift 15.5 --end-hit 44.4`, and the top 80 also with `--lift 15.5,37.7`). Each edit was then measured where the music *audibly* steps up (low end and whole mix), not only where the plan said. Several plans were 0.6 to 0.9 s off: on four-on-the-floor tracks the downbeat guess was off by a beat or two.
- Runners-up:
  - "Peace" (Diego Nava, Mixkit): the drop lands exactly at 15.34 (+23 dB) and CLAP rates it the most premium and confident. But it is a half-time R&B/808 groove, not driving, and its final chord lands at 45.0, 0.8 s late.
  - "Roses" (Andrew Ev, Mixkit, 114 BPM): it has a breakdown before the sign-off and a lift after it, but the fitted drop lands 0.57 s early (14.77) and the last chord at 43.98, before "convert" ends. Its hook also carries a beat.
- Rejected:
  - "Swish Swed" and "Electro Dreams" (Arulo): the drop is audible 0.8 s after the turn, and the hook already has a kick.
  - "Winter Breeze" and "Don't Look Back": fade-out endings.
  - "Rising Forest": the kick drops out from 29 s and is missing at the sign-off.
  - "Tech House vibes": flat, no quiet opening.
  - "Digital Clouds": hard stop.

## Voice against the bed (stems rebuilt with sound_mix.py's own levels; `sound/test_cues.json`, no effects)

The test mix wav was not rendered: the coordinator writes the cues and the mix. Measured from the mixer's busses (voice −16 LUFS, bed −27 LUFS, ducked 6 dB on the voice envelope, fade-in 0.3 s, fade-out 0.5 s):

| | Let's Move (pick) | composed |
|---|---|---|
| bed after ducking (integrated) | −32.2 LUFS | −31.7 |
| duck while speaking (median) | 5.8 dB | 5.8 |
| voice over bed while speaking (median, 400 ms) | 18.6 dB | 17.8 |
| voice over bed: hook / turn / work / "no random" / sign-off | 31.7 / 15.6 / 16.9 / 16.6 / 15.4 dB | 23.3 / 15.8 / 14.4 / 22.4 / 13.4 |
| bed on the end card (44.4 to 46.0, momentary median) | −40.2 LUFS (a quiet ring-out) | −29.6 |
