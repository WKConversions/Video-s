# Production plan: BMW 330Ci Coupé (E46), 30 s

PURPOSE: show Karl's brother's own car and explain five things inside it · AUDIENCE: owner, family, enthusiasts ·
FORMAT: 16:9, 1920×1080, 30 fps · DURATION: 30.0 s · CORE MESSAGE: "dit is wat er in jouw 330Ci zit" · TONE: precise
premium, energetic pace · STYLE: Minimal Single Visual (one hero object, bright white studio, short statements, one
accent: BMW blue #1C69D4) · ART DIRECTION: a real-proportion 3D model of THIS car (BMW drawing + the photo) in a
high-key studio; the body turns to x-ray glass with the car's own lines drawn on it; the drivetrain inside in light
clay; the part being explained in BMW blue · MOTION PERSONALITY: precise premium; the car never stops turning ·
TRANSITION FAMILY: (1) the car's rotation carries every change of view, (2) the paint/x-ray sweep along the car,
(3) parts leave and return along their own axis · VOICE-OVER AND MUSIC: no voice-over; on-screen Dutch; composed bed.

## Motion identity
- Signature curve: arrive `cubic-bezier(.22,1,.36,1)` for labels and part arrivals; big rotations on the long S
  (B2, `bezier(.8,0,.2,1)` softened to `(.65,0,.35,1)`), the car's idle turn as constant speed (B10, 3–4°/s), parts
  out and back on B3 (soft start, long settle), labels follow their part on B9 (3 and 6 frames behind).
- Durations: quick 8 f, standard 16 f, slow 30 f; rotations 36–60 f.
- Entrance pattern: type rises 24 px out of an 8 px blur, word by word (3 f stagger); parts move out along their
  own axis. No bounce, no overshoot, no camera pans: the camera only breathes; the car does the moving.
- Motion target: something moves in 100% of frames; median moving area ≈4% (brief), measured on the encode.

## Timeline (labels in seconds; frames = ×30)
| Beat | Time | Car pose | Event per moment | On screen (Dutch) |
|---|---|---|---|---|
| INTRO | 0.0–3.6 | on the floor, front three-quarter (yaw −70°) turning to −15°, drifting closer | 0.0 already turning; 0.4 title rises; 1.2 sub; wheels still | **BMW 330Ci Coupé** · E46 · 2001 |
| BODY | 3.6–8.0 | settles into the pure side profile (yaw 0), slow drift ±3° | 3.9 title out (rises away); 4.3 a blue line traces the coupé roofline windscreen→boot; 5.2 the sedan's roofline appears as a grey ghost above it; 5.8–6.6 the ghost drops onto the coupé line, the gap reads "46 mm"; 6.8 the frameless side glass outline glows | **Coupé-carrosserie** · Geen plaatwerkdeel gedeeld met de sedan. · 46 mm lager · raamloze deuren |
| LIFT | 8.0–9.4 | the body lifts 0.45 m off the chassis while the paint sweeps to x-ray glass front→back; settles back as glass; the car rises off the floor | the drivetrain (clay) is revealed in place | — |
| HEAD | 9.4–14.0 | turns and dips its nose (yaw −30°, pitch −14°, roll 6°), comes closer: the engine bay fills the middle third | 9.6 head glows blue inside the engine; 10.2 lifts out 0.42 m along the cylinder axis; 10.8 valve cover clears, camshafts turn, valves open in firing order 1-5-3-6-2-4 | **Cilinderkop** · Aluminium, twee nokkenassen, 24 kleppen. · M54B30 · 2.979 cc · 231 pk |
| VANOS | 14.0–18.4 | turns the front of the engine to camera (yaw −75°), head still lifted | 14.3 VANOS unit glows on the head's front face; 14.9 slides forward out of the head; 15.6–17.6 sprockets turn with the cams, then each shifts against its camshaft (arc + degrees); 17.9 VANOS and head slide home | **Dubbel VANOS** · Verdraait beide nokkenassen met oliedruk. · (spec from facts) |
| GEARBOX | 18.4–22.8 | rolls onto its side (roll −55°), yaw −20°: the underside to camera | 18.7 gearbox glows behind the engine; 19.2 drops out 0.35 m; 19.8 case clears: torque converter and planetary sets turn; a gear readout steps 1→5 | **Automaat** · Vijf versnellingen, schakelt zelf. · (type) · Steptronic |
| DIFF | 22.8–27.2 | turns to the rear three-quarter, low (yaw 145°, roll −15°) | 22.9 a blue pulse runs from the gearbox along the propshaft to the diff; 23.4 diff glows; 23.9 moves back out 0.3 m; 24.5 pinion turns the ring gear (90°); 25.6 left and right outputs turn at different speeds (corner arrows) | **Differentieel** · Stuurt de kracht 90° naar de achterwielen. · (ratio) |
| OUTRO | 27.2–30.0 | parts home, paint sweeps back rear→front, lands on the floor, turns to the photo's angle (yaw −38°) and keeps turning slowly | 28.2 title rises; 28.8 sub | **BMW 330Ci Coupé** · 25-KDB-4 is on the car |

## Continuity
| Object | Carried through | Rule |
|---|---|---|
| The car | every frame | never stops rotating; poses are keyed and eased; it floats from LIFT to OUTRO and lands at the end |
| The sweep line | LIFT → OUTRO | front→back to glass, back→front to paint; the seam is the only accent on it |
| Part highlight | one part at a time | blue fill + rim; the other parts dim to 45% while it is out |
| Labels | per beat | title, line, spec in one block, opposite the part on screen; a callout line from the part's anchor to the block |

## Sound
Composed bed (≈105 BPM, minor, clean electronic), a low whoosh on each big rotation, a soft click on each highlight,
a mechanical tick on the gear steps, a riser into LIFT, the bed resolves on OUTRO.
