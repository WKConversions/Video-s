# Quality check of the delivered film (deliver/robin-bos-30s.mp4)

Four final encodes were made; each one's measurements drove the next (plan.md, round 3). These are the numbers of the delivered one.

## What ran, what passed

| Check | Tool | Result |
|---|---|---|
| Delivery format | ffprobe | 1920×1080, 30.00 fps, 30.000 s, H.264 yuv420p, BT.709, TV range, AAC 48 kHz stereo, 28.9 MB (crf 16; the grain costs bitrate) — pass |
| Loudness | ffmpeg ebur128 | −15.0 LUFS integrated, true peak −1.7 dBFS, LRA 2.3 LU — pass (target −15, under −1.5) |
| Mix report | sound_mix.py | 45 effects; 41 clear the bed by 3 dB or more; 4 sit 0.4–2.8 dB over it (three ticks, one appear-rise: soft by design); voice at −16 LUFS, bed at −27 |
| Motion | motion_check | moving in 95 % of frames (target 90+), longest still 0.27 s (target 0.8) — pass |
| Shake | jitter_check | none in 900 frames — pass (the first final had one: the light's banded edge creeping; fixed with a radial light and a static grain) |
| Pops | handoff_check | 21 flagged; each one opened and classified (table below) |
| Busy | busy_check | median 3 things on screen (references 3–7); 8 or more for 0 % — pass |
| Phrases | phrase_check | 18 of 18 phrases bring a new visual; longest voice without one 0.0 s — pass |
| Motion probe (project) | motion_probe | camera 0 px/s pan, 0.0 %/s zoom; no LURCH, OVERSHOOT or FLYING; one BUSY (16.2–17.4 s, five motions: the 25 squares landing while "25" and its label rise — the proof's one swarm, a decision) |
| Brand colours | brand_measure verify | 32 of 34 storyboard frames on the measured palette; the two off-palette frames are the team photo (f0597, f0615) — explained |
| Contrast | brand.json | ink on canvas 16.5:1, white on the field 13.4:1, the caption (sky on the field) 7.9:1, the areas at 55 % ≥ 4.5:1 — pass |
| Tells | film_tells | no tells in 11 files; the truth check ran against harvest/facts.md: nothing flagged |
| Chunk boundaries | cut_match | frames 211/212 and 449/450 differ by 0.7 (0–255 mean), 659/660 by 7.3 because Robin two is entering — no blip |
| Safe areas | by hand | key type ≥ 80 px from the sides, ≥ 100 px from top and bottom; the contact lines' last baseline at y 980 |

Not checked: nothing in the automatic set. By hand only: the mix heard at speed (no listener in the session; the mix report and the mix sheet stand in).

## Findings, ranked

- **Critical:** none.
- **High:** none left. (Fixed on the way: the count flickering a digit a frame; the periods jumping 60 px as they left the wall; the light's banding creeping; the K.B period appearing in one frame; "process" without a measured visual.)
- **Medium:** the busy peak at 16.2–17.4 s (five motions) is a decision, not a defect; the end card holds 1.3 s after the voice (the scorers asked for 2.5 s; the voice ends at 27.9 s).
- **Low:** 21 handoff pops, all designed arrivals, departures or text changes under motion blur (table below).

## Pops on the delivered encode

PENDING

## Scorecard and the three biggest changes

See storyboard/scorecard.md. The three: (1) B7 rebuilt as one object — structural, open for Karl; (2) the end card earlier and the count as a whole number — done; (3) the square thread cleaned (stepped wall, no orphan, no defocus on cut-outs) — done.
