# Facts the film puts on screen

Every word in `film/src/film/copy.ts` traces to a row here. Full research with all sources: `harvest/research/*.md`.
The car itself: Dutch RDW open data for plate 25-KDB-4 (`harvest/rdw-*.json`): BMW 3er Reihe, 2 doors, petrol,
6 cylinders, 2979 cc, 170 kW, first registered 2001-04-09, black, type approval e1*98/14*0112*05, variant BN51,
wheelbase 272 cm. That it is an automatic: the owner (via Karl).

| On screen (Dutch) | Claim | Value | Source | Confidence |
|---|---|---|---|---|
| BMW 330Ci Coupé · E46 · 2001 | 6-cyl 2979 cc 170 kW coupé, first registered April 2001 | 330Ci, E46/2 | RDW open data; BMW Group Classic 330Ci Coupé page (06/2000–05/2006) | high |
| Geen omgebouwde sedan: alle buitenpanelen zijn eigen. | Every outer body panel (bonnet, wings, doors, roof, side frame, boot lid) is coupé-specific; only the door handles, side repeaters and BMW logos are shared on the outside. (ST034's "no sheet metal parts shared" is too strong: the ETK shows shared inner structure, e.g. front wheelhouses, bulkhead, boot floor, so the film says outer panels only.) | 3 shared exterior items | BMW NA press kit 1 July 1999; BMW ETK 330Ci coupé vs 330i sedan, EUR 03/2001 (bmwfans.info); BMW ST034 p.6 | high |
| 46 mm lager | Coupé 1369 mm vs sedan 1415 mm high | −46 mm | BMW ST034 dimension drawings (E46/2, E46/4); BMW NA press kit 1999; BMW data sheet (treffseiten.de) | high |
| raamloze deuren | Frameless door glass that drops slightly when the door opens | — | BMW NA press kit 1999 | high |
| (sedan roofline drawn) | Sedan top profile digitised from BMW's E46/4 drawing, coupé from the E46/2 drawing | — | BMW ST034 p.5, p.7 (modelling reference) | medium (±10 mm) |
| Cilinderkop · Het dak van de motor: 24 kleppen laten lucht in en uitlaatgas uit. · Aluminium | The head closes the top of the cylinders; aluminium DOHC cross-flow head, 4 valves per cylinder (intake valves let the air-fuel charge in, exhaust valves let the burnt gas out) | 24 valves | BMW ST034/ST036 (M54); de.wikipedia M50/M54 | high |
| M54B30 · 2.979 cc · 231 pk | Engine code, displacement, 170 kW / 231 PS at 5900 rpm | M54B30 | BMW ST036 p.21–25; BMW data sheet 2001; RDW | high |
| Dubbel VANOS · Verdraait beide nokkenassen op motorolie · Inlaat én uitlaat · traploos | Both camshafts (intake and exhaust, hence "double") continuously variable; actuated by engine oil pressure through solenoid valves, a piston and a helical-toothed cup | — | BMW ST036 p.32–34; BMW ST055 p.112–114; de.wikipedia VANOS | high |
| inlaat 20° · uitlaat 12,5° (at the sprockets) | Adjustment range at the camshaft, the angle the sprockets visibly turn (BMW quotes 40° / 25° crankshaft) | 20° / 12.5° cam | BMW ST036 p.34 timing diagram; ST034 p.19 | high |
| meer trekkracht onderin | More torque in the low and middle rev range without losing top-end power | — | BMW ST036 p.32; BMW Lexikon VANOS | high |
| Automaat · ZF 5HP19 | The 2001 330Ci automatic is the ZF 5HP19, BMW "A5S 325Z" (not the GM 5L40-E) | A5S 325Z | BMW E46 training (automatic transmissions) p.33, p.53; BMW ETK 330Ci coupé EUR 2001; en.wikipedia ZF 5HP | high |
| Koppelomvormer en planeetwielen · vijf versnellingen · schakelt zelf | Hydraulic torque converter with lock-up; planetary gear sets; 5 forward + 1 reverse; electronic control (EGS) | 3.67 / 2.00 / 1.41 / 1.00 / 0.74 | BMW E46 training p.35–37, p.52 | high |
| Steptronic | Manual shifting mode of the BMW automatic, since 1994 | — | BMW training (Steptronic) p.18, p.39 | high |
| Differentieel · Draait de kracht 90° naar de achterwielen. | Rear-wheel drive; the hypoid ring-and-pinion turns the propshaft's rotation through 90° to the half-shafts | — | general principle; E46 is rear-wheel drive (BMW data sheet) | high |
| Eindoverbrenging 3,38 : 1 | Factory final-drive ratio of the automatic 330Ci (manual 2.93); the propshaft turns 3.38 times per wheel turn. Not checked on this car's diff tag | 3.38 | BMW data sheet 09/2001 ("2,93 (3,38)", bracket = automatic); BMW ETK 33 10 7 505 394 "I=3,38" | high |
| buitenwiel sneller / binnenwiel langzamer | In a corner the differential lets the outer wheel turn faster than the inner | — | general principle | high |
| 25-KDB-4, "GEAR UP automotive" holder, green sticker | As on the photo of the car | — | the owner's photo | high |

## Animation choices that are illustrations, not claims
- The valve lift is shown 1.6× real (intake 9.7 mm, exhaust about 9.0 mm) so it reads at film size; firing order 1-5-3-6-2-4 drives the sequence. No lift number is on screen.
- The VANOS shift is shown at the real cam angles (20°, 12.5°), faster than in the engine.
- The gear read-out steps 1→5 in about two seconds; the planetary sets are a simplified picture of the 5HP19's gear train.
- The corner speed difference of the rear wheels is shown as ±35% (a tight corner).
- The engine leans to the right (direction supported); the ~30° angle is a modelling estimate, never captioned.
- No secondary-air injection is shown: the car is EURO 3 (RDW), and the air pump came only with EU4 cars from 09/2001.
- "2001" in the intro is the first-registration year (RDW), not the build or model year.
- The angel-eye headlights are aftermarket (no E46 had factory corona rings); they are modelled from the photo and never captioned.
