# Facts the film puts on screen

Every word in `film/src/film/copy.ts` traces to a row here. Full research with all sources: `harvest/research/*.md`.
The car itself: Dutch RDW open data for plate 25-KDB-4 (`harvest/rdw-*.json`): BMW 3er Reihe, 2 doors, petrol,
6 cylinders, 2979 cc, 170 kW, first registered 2001-04-09, black, type approval e1*98/14*0112*05, variant BN51,
wheelbase 272 cm. That it is an automatic: the owner (via Karl).

| On screen (Dutch) | Claim | Value | Source | Confidence |
|---|---|---|---|---|
| BMW 330Ci Coupé · E46 · 2001 | 6-cyl 2979 cc 170 kW coupé, first registered April 2001 | 330Ci, E46/2 | RDW open data; BMW Group Classic 330Ci Coupé page (06/2000–05/2006) | high |
| Geen enkel plaatwerkdeel gedeeld met de sedan. | "The body of the E46/2 Coupe is not a modified sedan... There are no sheet metal parts shared between the Sedan and the Coupe." | 0 parts | BMW NA technical training ST034 "E46 Complete Vehicle", Models, p.6; BMW NA press kit 1 July 1999 (only door handles, side repeaters, logos shared) | high |
| 46 mm lager | Coupé 1369 mm vs sedan 1415 mm high | −46 mm | BMW ST034 dimension drawings (E46/2, E46/4); BMW NA press kit 1999; BMW data sheet (treffseiten.de) | high |
| raamloze deuren | Frameless door glass that drops slightly when the door opens | — | BMW NA press kit 1999 | high |
| (sedan roofline drawn) | Sedan top profile digitised from BMW's E46/4 drawing, coupé from the E46/2 drawing | — | BMW ST034 p.5, p.7 (modelling reference) | medium (±10 mm) |
| Cilinderkop · Aluminium, twee nokkenassen en 24 kleppen. | Aluminium DOHC cross-flow head, 4 valves per cylinder | 24 valves | BMW ST034/ST036 (M54); de.wikipedia M50/M54 | high |
| M54B30 · 2.979 cc · 231 pk | Engine code, displacement, 170 kW / 231 PS at 5900 rpm | M54B30 | BMW ST036 p.21–25; BMW data sheet 2001; RDW | high |
| Dubbel VANOS · Verdraait beide nokkenassen traploos, op motorolie. | Both camshafts continuously variable; actuated by engine oil pressure through solenoid valves, a piston and a helical-toothed cup | — | BMW ST036 p.32–34; BMW ST055 p.112–114; de.wikipedia VANOS | high |
| inlaat 40° · uitlaat 25° | Adjustment range in crankshaft degrees (20° / 12.5° at the camshaft) | 40° / 25° | BMW ST036 p.34 timing diagram; ST034 p.19 | high |
| Meer koppel bij lage toeren | More torque in the low and middle rev range without losing top-end power | — | BMW ST036 p.32; BMW Lexikon VANOS | high |
| Automaat · ZF 5HP19 | The 2001 330Ci automatic is the ZF 5HP19, BMW "A5S 325Z" (not the GM 5L40-E) | A5S 325Z | BMW E46 training (automatic transmissions) p.33, p.53; BMW ETK 330Ci coupé EUR 2001; en.wikipedia ZF 5HP | high |
| Koppelomvormer en planeetwielen · vijf versnellingen · schakelt zelf | Hydraulic torque converter with lock-up; planetary gear sets; 5 forward + 1 reverse; electronic control (EGS) | 3.67 / 2.00 / 1.41 / 1.00 / 0.74 | BMW E46 training p.35–37, p.52 | high |
| Steptronic | Manual shifting mode of the BMW automatic, since 1994 | — | BMW training (Steptronic) p.18, p.39 | high |
| Differentieel · Draait de kracht 90° naar de achterwielen. | Rear-wheel drive; the hypoid ring-and-pinion turns the propshaft's rotation through 90° to the half-shafts | — | general principle; E46 is rear-wheel drive (BMW data sheet) | high |
| Eindoverbrenging 3,38 : 1 | Final-drive ratio of the automatic 330Ci (manual 2.93) | 3.38 | BMW data sheet 09/2001 ("2,93 (3,38)", bracket = automatic); BMW ETK 33 10 7 505 394 "I=3,38" | high |
| buitenwiel sneller / binnenwiel langzamer | In a corner the differential lets the outer wheel turn faster than the inner | — | general principle | high |
| 25-KDB-4, "GEAR UP automotive" holder, green sticker | As on the photo of the car | — | the owner's photo | high |

## Animation choices that are illustrations, not claims
- The valve lift is shown 1.6× real (9.7 mm on the M54B30) so it reads at film size; firing order 1-5-3-6-2-4 drives the sequence.
- The VANOS shift is shown at the real cam angles (20°, 12.5°), faster than in the engine.
- The gear read-out steps 1→5 in about two seconds; the planetary sets are a simplified picture of the 5HP19's gear train.
- The corner speed difference of the rear wheels is shown as ±35% (a tight corner).
- The engine tilt (~30° to the right) is from the research's best estimate (low confidence).
