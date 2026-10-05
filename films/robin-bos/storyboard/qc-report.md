# Quality check of the delivered film (deliver/robin-bos-30s.mp4)

Six final encodes were made; each one's measurements drove the next (plan.md, round 3). These are the numbers of the delivered one (the sixth).

## What ran, what passed

| Check | Tool | Result |
|---|---|---|
| Delivery format | ffprobe | 1920×1080, 30.00 fps, 30.000 s, H.264 yuv420p, BT.709, TV range, AAC 48 kHz stereo, 15 MB (crf 16) — pass |
| Loudness | ffmpeg ebur128 | −15.0 LUFS integrated, true peak −1.7 dBFS, LRA 2.3 LU — pass (target −15, under −1.5) |
| Mix report | sound_mix.py | 45 effects; 41 clear the bed by 3 dB or more; 4 sit 0.4–2.8 dB over it (three ticks, one appear-rise: soft by design); voice at −16 LUFS, bed at −27 |
| Motion | motion_check | moving in 95 % of frames (target 90+), longest still 0.47 s (target 0.8) — pass |
| Shake | jitter_check | none in 900 frames — pass (the first final had one: the light's banded edge creeping; fixed with a radial light and a static grain) |
| Pops | handoff_check | 8 flagged plus the field reveal at 14.0 s read as a cut; each one opened and classified (table below) |
| Busy | busy_check | median 3 things on screen (references 3–7); 8 or more for 0 % — pass |
| Phrases | phrase_check | 18 of 18 phrases bring a new visual; longest voice without one 0.0 s — pass |
| Motion probe (project) | motion_probe | clean: camera 0 px/s pan, 0.0 %/s zoom; no CAMERA, LURCH, OVERSHOOT, FLYING or BUSY; median 1 motion at a time, 95th percentile 3 |
| Brand colours | brand_measure verify | 33 of 34 storyboard frames on the measured palette; the one off-palette frame is the team photo filling the card (f0615) — explained. The delivered encode's flat colours measure within 1–2 levels of the stills (the first final's camera blur had rounded them to multiples of 16; see plan.md, round 3) |
| Contrast | brand.json | ink on canvas 16.5:1, white on the field 13.4:1, the caption (sky on the field) 7.9:1, the areas at 55 % ≥ 4.5:1 — pass |
| Tells | film_tells | no tells in 11 files; the truth check ran against harvest/facts.md: nothing flagged |
| Chunk boundaries | cut_match | frames 211/212 and 449/450 differ by 0.5–0.6 (0–255 mean), 659/660 by 6.4 because Robin two is entering — no blip; frames 1–11 measure identical in the white, the haze and the light |
| Safe areas | by hand | key type ≥ 80 px from the sides, ≥ 100 px from top and bottom; the contact lines' last baseline at y 980 |

Not checked: nothing in the automatic set. By hand only: the mix heard at speed (no listener in the session; the mix report and the mix sheet stand in).

## Findings, ranked

- **Critical:** none.
- **High:** none left. (Fixed on the way: the count flickering a digit a frame; the periods jumping 60 px as they left the wall; the light's banding creeping; the K.B period appearing in one frame; "process" without a measured visual.)
- **Medium:** the end card holds 1.3 s after the voice (the scorers asked for 2.5 s; the voice ends at 27.9 s) — open for Karl.
- **Low:** 8 handoff pops and one whole-frame change, all designed arrivals, departures or reveals under motion blur (table below).

## Pops on the delivered encode

The handoff check flags a frame whose change is several times the change around it. Fresh agents opened every strip of the fourth final (21 flagged), named the object and the word it is keyed to, and gave a verdict; the three bugs and four minor points they found were fixed before the delivered encode (the card snapping on over the half-closed block, the areas unmounting mid-fade, the first frames' tint swing — traced to the camera blur's additive compositing and replaced by a running mean — the €2M header's blur copies, the 66 % first frame of a riser, the field's chroma step, the button's label smeared through the morph). The delivered encode's flags, each one opened again and a designed change:

| Moment | What changes | Keyed to | Verdict |
|---|---|---|---|
| 0.47 s | the second wall square rises out of a blur, fading in over 0.15 s, into an otherwise still frame | the wall's rise frame 12 | designed arrival |
| 7.5 s | "Technology" rises with its period flying in from the wall | "technology" − 0.13 s | designed arrival |
| 14.0 s | the K.B tile grows into the navy field over 0.73 s (the whole frame changes: read as a cut) | "two" − 0.5 s | designed reveal |
| 20.8 s, 21.0 s | the returning canvas grows out of the card's box; the card leaves left on its rail under the blur | "today" + 0.35 s, + 0.25 s | designed transition |
| 21.6 s, 21.7 s, 22.2 s | the logos arrive from the left and leave downward | "founders", "strategy" − 0.6 s | designed arrival and departure |
| 28.0 s | the period of TALK. grows into the button (fast while still a dot) | 27.9 s | designed morph |

## Scorecard and the three biggest changes

See storyboard/scorecard.md. The three: (1) B7 rebuilt as one object — structural, open for Karl; (2) the end card earlier and the count as a whole number — done; (3) the square thread cleaned (stepped wall, no orphan, no defocus on cut-outs) — done.
