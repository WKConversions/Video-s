# Rear differential (final drive) of the 2001 E46 330Ci automatic

Topic folder: `diff`. Images: `/home/user/Video-s/films/bmw-e46/assets/ref/diff/`.
The car (RDW): 330Ci coupe, M54B30, 170 kW, first registered 9 Apr 2001, EU type approval, rear track 149 cm, automatic (per owner).
Gearbox (other topic): ZF 5HP19 automatic (BMW code A5S325Z), ratios 3.67 / 2.00 / 1.41 / 1.00 / 0.74, R 4.10 [S1][S13].

## Plain-Dutch summary (voice-over and captions)

Het differentieel zit midden tussen de achterwielen. De 330Ci heeft achterwielaandrijving.
De cardanas komt van voren binnen. Een klein tandwiel (het pignon) drijft een groot kroonwiel aan. Zo draait de beweging 90 graden, naar de twee aandrijfassen van de wielen.
Meteen gaat het toerental omlaag: bij deze automaat draait de cardanas 3,38 keer rond voor één omwenteling van de wielen.
In een bocht moet het buitenste wiel verder rijden dan het binnenste. Kleine kegeltandwielen in het differentieel laten de twee wielen daarom verschillend snel draaien.
Het is een "open" differentieel van BMW-type 188K (kroonwiel van 188 mm). Het hangt op drie rubberen steunen in het achterassubframe.

## Answer to the main question: final drive ratio

| Candidate | Applies to | Sources | Verdict |
|---|---|---|---|
| **3.38 : 1** | 330Ci **automatic** (ZF 5HP19), Europe and USA, from launch (ETK lists it without a date limit from 07/2000) | [S1] BMW AG data sheet "2,93 (3,38)", bracket = automatic; [S2] ETK Europe 03/2001: 33 10 7 505 394 "I=3,38, for vehicles with automatic transmission (S205A)"; [S9] ETK Europe 09/2000; [S8] ETK USA 03/2001; [S14] BMW NA MY2003 spec sheet (330Ci coupe automatic 3.38) | **Use this. High confidence.** |
| 2.93 : 1 | 330Ci **manual** (5-speed) | [S1], [S2] 33 10 7 505 390 "I=2,93 from Sep '00" (earlier 33 10 7 511 190, 07-09/2000), [S13], [S14], [S27] | Not this car (manual only) |
| 2.93 : 1 and 3.46 : 1 under "automatic" | BMW NA 2001 spec sheet | [S13] p.4: two "final drive ratio" rows for the automatic, both footnoted "applies to all models" | Self-contradictory layout error. 3.46 is the 330xi automatic ratio [S10 p.50]. The MY2003 sheet [S14] gives 3.38. **Low; do not use.** |
| 3.64 : 1 | US 330Ci automatic with Performance Package (S767A, ZHP, 2003+) | [S8] | Not this car |
| 3.46 / 3.07 | 330xi automatic / manual (HAG 188N) | [S10] p.50 | Not this car (4WD) |

Overall gearing (computed from [S1][S13] ratios): 1st gear 3.67 x 3.38 = 12.4 (manual 4.21 x 2.93 = 12.3). 5th gear 0.74 x 3.38 = 2.50 (manual 1.00 x 2.93 = 2.93). The automatic's shorter diff makes up for the taller gearbox ratios in 1st, and its 5th is an overdrive.
At 100 km/h in 5th (converter locked), with the standard 225/45 R17 tyre (rolling circumference about 1.95 m, estimate): about 2,150 rpm for the automatic and about 2,500 rpm for the manual.

## Facts (with sources)

Confidence: H = BMW source, or two independent sources agree. M = one good source, or sources differ slightly. L = weak or conflicting.

### What it is and what it does

| id | fact (EN) | NL (on-screen) | value | conf | source |
|---|---|---|---|---|---|
| rwd | Front engine, rear-wheel drive. | Motor voor, aandrijving achter. | RWD | H | [S13] p.4, [S14] |
| turn-90 | A final drive turns the propshaft rotation through 90 degrees to the half shafts and reduces the speed (the final gear ratio). | Het differentieel draait de beweging 90 graden naar de wielen. | 90° | H | [S24] |
| corner | In a corner the outer wheel travels farther than the inner wheel. The differential lets the two wheels turn at different speeds, so the tyres roll instead of scrub. | In een bocht draait het buitenste wiel sneller dan het binnenste. | - | H | [S24], [S26] |
| ratio-meaning | i = 3.38: the propshaft turns 3.38 times for each turn of the rear wheels. | De cardanas draait 3,38 keer rond voor één wielomwenteling. | 3.38 | H | derived from [S1][S2] |
| hypoid | Rear-drive final drives normally use a hypoid gear pair: the pinion sits off-centre (below the ring-gear axis), which lets it be larger and stronger. Not stated in an E46-specific BMW document. | Klein pignon, groot kroonwiel. | - | M | [S25] |

### Case type and construction

| id | fact (EN) | NL | value | conf | source |
|---|---|---|---|---|---|
| case-188k | The E46 final drive is BMW's compact type HAG 188K. The ETK lists the 330Ci's cover and gasket set as "TYP 188K". | BMW-type 188K. | 188K | H | [S10] p.23, [S3] |
| 188-meaning | "188" is the outer diameter of the ring gear in mm. BMW's sizes: 168 (small), 188 (medium), 210/215 (large). Later 188 units are identified by their 90 mm output seals; the 330Ci's output seals are 90 x 44 x 10. | Kroonwiel van 188 mm. | 188 mm | M | [S18], [S2] (seal size) |
| k-compact | "K" = compact ("kompakt"). BMW: lighter than the E36 type; compact housing, shorter pinion shaft, hollow drive-flange shafts, no side bearing covers, no speedometer gear, lifetime synthetic oil. | Compact en lichter dan bij de E36. | - | H | [S10] p.23, [S30] |
| open | Open differential. BMW: "Limited slip differential is no longer possible with the compact differential." The ETK lists only open units for the 330Ci. A French road test regrets that BMW fitted only traction control, not a limited-slip diff. | Een open differentieel, geen sperdifferentieel. | open | H | [S10] p.23, [S2], [S27] |
| adb | Instead of a mechanical LSD, the brakes act as an electronic diff lock: ASC+T/DSC brakes the rear wheel that spins (ADB, Automatic Differential Brake). | De remmen spelen voor sperdifferentieel. | ADB | H | [S1] (lists "elektronische Differentialsperre (ADB)"), [S17] |
| lifetime-oil | Lifetime fill of synthetic gear oil (BMW SAF-XO). A sticker on the unit says "LIFE-TIME-OIL / KEIN ÖLWECHSEL / NO OIL CHANGE". | Gevuld met olie voor het hele autoleven. | lifetime | H | [S1] ("Hinterachsgetriebeöl: Dauerfüllung"), [S2], [S10] |
| part-auto | The 330Ci automatic's final drive: BMW 33 10 7 505 394 (exchange unit), i = 3.38, 30.7 kg. A new unit is 33 10 7 505 393. Manual: 33 10 7 505 390, i = 2.93, 31.4 kg. | - | 33107505394 | H | [S2], [S8], [S9], [S28] (7505393) |
| weight | Complete final drive about 31 kg. | Het weegt zo'n 31 kilo. | 30.7 kg | H | [S2] |
| cover | Rear cover 33 11 7 508 901 "TYP 188K", 1.2 kg. It is sealed with liquid sealant, not a gasket, and has two M22 x 1.5 screw plugs (fill and drain). Its eye holds the rear rubber mount. | - | 1.2 kg | H | [S3] |
| cover-fins | A finned aluminium cover, 33 11 7 512 980 (the Z4 part), is sold as an upgrade for all non-M E46s. BMW's training notes the E85 Z4 (not the E46) got a finned cover. So the 330Ci's standard cover very likely has **no big cooling fins**. | - | no fins (likely) | M | [S21], [S11] p.20, [S3] |
| housing-material | Housing material is not confirmed by a BMW E46 source. Most likely a cast-iron main housing with a light (1.2 kg) cast cover, probably aluminium. RacingDiffs says aluminium housings only came later ("AL" type). On the E60's 188K, BMW says the cover is aluminium. | - | probably cast iron + Al cover | L | [S18], [S15], [S3] (cover weight) |
| vib-absorbers | On automatic cars only, two vibration absorbers (tuned mass dampers) on brackets are bolted to the final drive: 33 10 7 513 897 (with bracket, 1.9 kg, 3 x M10 bolts) and 33 10 7 513 902 (1.3 kg) on bracket 33 11 7 503 356 with an M12 collar screw. | - | 2 dampers (auto) | H (existence) / M (position) | [S2] |
| centreline | The propshaft and differential sit on the car's centre line (narrower tunnel). Because of this, the left and right half shafts have different lengths and are not interchangeable. | Het differentieel zit precies in het midden. | centre line | H | [S10] p.23 |
| pinion-flange | The propshaft's rear CV joint (bolt circle 86 mm) bolts to the diff's input (pinion) flange with six Torx M10 x 46 bolts. | - | LK 86 mm, 6 x M10 | H | [S29] |
| drive-flanges | Output (drive) flanges for the automatic: 33 13 1 428 124 (or 33 13 1 428 252), bolt circle 86 mm, M10 threads. Manual cars use 94 mm flanges (33 13 7 500 801). Output seals: 90 x 44 x 10. Pinion seal: 45 x 75 x 10. | - | LK 86 mm | H | [S2] |

### Mounting in the rear subframe

| id | fact (EN) | NL | value | conf | source |
|---|---|---|---|---|---|
| 3-mounts | The diff hangs in the rear subframe on three rubber mounts: two at the front and one at the rear. ETK: front rubber mountings 33 17 6 770 788 (x2) with M12 x 1.5 x 80 bolts. Rear rubber mounting 33 17 6 751 808 with an M14 x 1.5 x 133 bolt and nut. | Drie rubberen steunen: twee voor, één achter. | 3 | H | [S19], [S6], [S2] |
| hydro | BMW: "The differential is mounted to the sub frame using a hydraulic mount." The original rear mount is a fluid-filled ("hydro") bushing. It wears and can cause a "thud" when shifting or on throttle changes. | Een rubber-met-vloeistof-steun dempt trillingen. | hydraulic | H | [S10] p.22, [S11] p.20, [S12] p.38, [S19] |
| rear-eye | The rear bushing is pressed into an eye on the diff's rear cover. To replace it, the diff is removed and the bushing pulled out of its socket. The two front bolts go through the two front mounts beside the pinion flange. | - | in cover | M | [S20], [S3] drawing |
| subframe | The rear subframe (axle carrier) is tubular steel, 13.8 kg, and is bolted to the body with four rubber mounts (2 front, 2 rear). | Het subframe is van stalen buizen, op vier rubbers. | 4 mounts | H | [S10] p.22, [S11] p.20, [S6] |
| body-cracks | On early six-cylinder E46s, cracks often formed where the rear axle is fixed to the body. A big repair; BMW also offered to bond the panels with resin. de.wikipedia says it was fixed in the September 2001 update, so this April-2001 car is from before the fix. | - | fixed 09/2001 | M | [S23] |

### Half shafts

| id | fact (EN) | NL | value | conf | source |
|---|---|---|---|---|---|
| halfshaft-auto | Automatic 330Ci half shafts: 33 21 7 510 623 (left) / 33 21 7 510 622 (right). Inner CV-joint bolt circle 86 mm, shaft diameter 34 mm, 5.7 / 5.8 kg. Manual cars get stronger shafts (bolt circle 94 mm, shaft diameter 38 mm, 6.0 / 6.1 kg). | Twee aandrijfassen met homokineten. | LK 86 / D 34 mm | H | [S4], [S5] |
| halfshaft-joints | Each shaft has a CV joint at both ends, with rubber boots. The inner joint bolts to the diff flange with 6 Torx M10 bolts (with reinforcement plates on the automatic). The outer end is splined into the wheel hub and held by an M27 x 1.5 collar nut. | - | 6 x M10; M27 nut | H | [S4] |

### Rear suspension

| id | fact (EN) | NL | value | conf | source |
|---|---|---|---|---|---|
| rear-axle-name | BMW calls the E46 rear axle the central-link rear axle ("Central 'C' Link"), internal code HA3. The German data sheet says "Zentral-Lenker-Achse mit Längslenker und Doppelquerlenker". BMW NA calls it a "multi-link system with Central Links, upper & lower lateral links". | Achteras: centrale-arm-meerarmsas (BMW HA3). | HA3 | H | [S1], [S11] p.15-20, [S12] p.38-39, [S13] p.5 |
| rear-axle-parts | Per side: a cast "central" (trailing) arm carries the wheel and is bolted to the body through a rubber bushing. An upper link (cast aluminium) and a lower link run to the subframe. The coil spring sits on the lower link, and a separate gas shock. The central arm takes the driving and braking forces; the two lateral links take the cornering forces. | - | 1 central arm + 2 lateral links | H | [S11] p.19, [S12], [S13], [S7] |
| rear-adjust | Rear toe is set by moving the forward central-arm bushing mount; rear camber by an eccentric bolt on the lower lateral link. | - | - | H | [S11] p.21 |
| rear-history | Based on the E36 central-link axle, but all parts are new for the E46. Also used on the E85 Z4. | - | - | H | [S10] p.22, [S11] |

## Modelling notes (stylised 3D model)

**Position in the car** (x = rearward from front-axle centre line, y = from car centre line, z = up from ground):
* Lateral: on the centre line (y = 0) [S10].
* Fore/aft: the output-flange axis is on the rear-axle line, x ≈ 2725 mm (wheelbase [S1]; RDW 272 cm). The pinion nose and input flange point forward, about 200-250 mm ahead of the axle line (estimate). The rear cover is about 100-130 mm behind it (estimate).
* Height: output-flange axis at about wheel-centre height, z ≈ 300-315 mm. (A 225/45 R17 tyre is 634 mm in diameter unloaded, so 317 mm radius, a little less when loaded. Estimate.) The pinion/input-flange axis sits a few cm lower (hypoid offset, estimate 30-40 mm). The bottom of the housing is about 150-180 mm above ground (estimate).
* The two half shafts run out left and right to the hubs at about the same height, nearly horizontal (slight angle). Rear track 1483 mm (BMW) / 149 cm (RDW).
* Above and around it is the tubular-steel subframe: a front cross tube arched over the diff nose, two side members, and four rubber mounts to the body. See the ST034 front-view photo and ETK rear axle carrier drawing.

**Overall size** (estimates, no published drawing found; ring gear 188 mm and flange bolt circles are sourced):
* Width across the output-flange faces: about 300-340 mm.
* Length, input-flange face to back of cover: about 330-380 mm.
* Height: about 250-280 mm. Mass 30.7 kg [S2].

**Shape breakdown (simple solids):**
1. *Ring-gear bowl:* a fat horizontal cylinder or sphere-cylinder, axis across the car (y), about 240-260 mm in diameter (it houses the 188 mm ring gear). It bulges more to one side: with a clockwise-turning engine, the ring gear sits on the car's LEFT of the pinion. (This is derived; the ETK's left shaft is lighter, which fits.)
2. *Pinion nose:* a tapered cone or truncated cylinder pointing forward from the bowl, about 110-130 mm in diameter at the tip. Several longitudinal stiffening ribs run along its sides (see the ST034 drawing).
3. *Input flange:* a round disc about 110 mm in diameter at the tip of the nose, with 6 bolt holes on an 86 mm circle. The propshaft's CV joint bolts here.
4. *Front mount ears:* two small lugs, low on each side of the nose, with fore-aft bolts (M12) into rubber bushings in the subframe.
5. *Output stubs and flanges:* a short collar left and right (90 mm seal), then a round 6-bolt drive flange (86 mm bolt circle on the automatic) about 110 mm across. The CV joint and black boot of each half shaft follow.
6. *Rear cover:* a large, roughly D-shaped / rounded-square plate bolted to the back of the bowl with about 8-10 M10 bolts on a flange rim. Plain surface, no big cooling fins on the stock 330Ci (the finned cover is a Z4/upgrade part). It has a cast mounting eye (rear rubber bushing, M14 bolt) at its top. There are two hex plugs (fill higher, drain lower).
7. *Automatic only:* one or two small cylindrical vibration-absorber masses on brackets bolted to the housing (ETK items 5 and 18/19).
8. Small "LIFE-TIME-OIL" sticker.

**Colours and materials (stylised):** main housing dark grey cast metal (a satin graphite #3a3d40, with a rusty/oxidised tint on real used cars). Cover a lighter cast-aluminium grey (#9a9da0). Flanges and bolts steel (#7d8187). CV boots black rubber. Subframe tubes black-painted steel. Rubber mounts black.

**Recognisable features:** the forward-pointing nose with its round flange; the wide round middle; flanges left and right; the cover at the back with the bushing eye; the three-point rubber mounting. Animation idea: the propshaft spins, the pinion turns the ring gear (3.38:1 slower), and the half shafts spin. In a corner the spider gears let the outer wheel run faster.

## Images

Free to show on screen (credit required for CC BY-SA):

| file | subject | source | author | licence | free |
|---|---|---|---|---|---|
| commons_differential-gear-labelled-diagram_PearsonScottForesman_PD.png | labelled diff diagram: drive shaft, drive pinion, ring gear, housing, side gears, differential pinions, axle shafts | https://commons.wikimedia.org/wiki/File:Differential_Gear_(PSF).png | Pearson Scott Foresman | Public domain | yes |
| commons_open-differential-driving-straight_Wapcaplet_CC-BY-SA-3.0.png | open diff, straight ahead: carrier and both shafts turn together, spider gear still (250x175 px, small) | https://commons.wikimedia.org/wiki/File:Differential_free.png | Wapcaplet | CC BY-SA 3.0 | yes, with credit |
| commons_open-differential-one-side-held-spider-gear-turns_Wapcaplet_CC-BY-SA-3.0.png | open diff, one side held: spider gear turns, other side runs faster (250x175 px) | https://commons.wikimedia.org/wiki/File:Differential_locked.png | Wapcaplet | CC BY-SA 3.0 | yes, with credit |
| commons_hypoid-ring-gear-and-pinion-in-rear-diff_SkyMWard_CC-BY-SA-3.0.jpg | real hypoid ring gear and pinion in an opened rear diff (not BMW) | https://commons.wikimedia.org/wiki/File:Hypoid_gear_set_in_a_rear_differential_2013-07-22_12-42.jpg | SkyMWard | CC BY-SA 3.0 | yes, with credit |
| commons_bmw-e38-740d-rear-diff-finned-cover_NOT-E46_Beemwej_CC-BY-SA-3.0.jpg | BMW E38 740d rear diff, finned cover (bigger 7 Series unit, NOT the E46) | https://commons.wikimedia.org/wiki/File:Bmw_7_dyfer.JPG | Beemwej | CC BY-SA 3.0 | yes, with credit; not E46 |
| commons_bmw-e38-740d-rear-diff-housing-front-view_NOT-E46_Beemwej_CC-BY-SA-3.0.jpg | BMW E38 740d rear diff housing (NOT the E46) | https://commons.wikimedia.org/wiki/File:Bmw_7-er_dyfer.JPG | Beemwej | CC BY-SA 3.0 | yes, with credit; not E46 |
| commons_porsche-cayenne-rear-diff-cutaway_NOT-BMW_DrJunge_CC-BY-SA-3.0.jpg | cutaway modern rear diff (Porsche Cayenne) showing ring gear, pinion, bearings | https://commons.wikimedia.org/wiki/File:Differentialgetriebe2.jpg | DrJunge | CC BY-SA 3.0 | yes, with credit; not BMW |

Not downloaded, but useful and free: "Around the Corner" (1937, Chevrolet / Jam Handy), a public-domain film explaining the differential: https://commons.wikimedia.org/wiki/File:Around_the_Corner_(1937)_24fps_selection.webm

MODELLING REFERENCE ONLY (copyright BMW AG / BMW NA / TEDGUM; never show in the film):

| file | subject | source |
|---|---|---|
| MODELREF-ONLY_bmw-st034-models_p23_e46-final-drive-HAG-188K-drawing.png | BMW line drawing of the E46 HAG 188K final drive (nose, flanges, cover, rear mount bolt) | [S10] p.23 |
| MODELREF-ONLY_bmw-st034-models_p22_e46-complete-rear-axle-front-view-photo.png | BMW photo, complete E46 rear axle from the front: subframe, diff nose and front mounts, arms, springs, shocks | [S10] p.22 |
| MODELREF-ONLY_bmw-st056_e46-central-c-link-rear-suspension-drawing.png | labelled E46 rear axle drawing (upper arms, carrier, central-arm bushing) | [S11] p.20 |
| MODELREF-ONLY_bmw-st1115_e46-HA3-rear-axle-drawing.png | E46 HA3 rear axle drawing | [S12] p.38 |
| MODELREF-ONLY_bmw-etk_e46-330ci_final-drive-188K-complete_mounts-vibration-absorbers-auto_flanges.png | ETK: final drive with mounts, vibration absorbers (auto), flanges, seals, sticker | [S2] |
| MODELREF-ONLY_bmw-etk_e46_final-drive-188K_rear-cover-with-mount-eye_gasket-seals.png | ETK: rear cover with mount eye, plugs, seals | [S3] |
| MODELREF-ONLY_bmw-etk_e46-330ci-auto_output-shaft-LK86-cv-joints-collar-nut.png | ETK: automatic half shaft, CV joints, LK/Ø definition | [S4] |
| MODELREF-ONLY_bmw-etk_e46-330ci-manual_output-shaft-LK94-for-comparison.png | ETK: manual half shaft | [S5] |
| MODELREF-ONLY_bmw-etk_e46_rear-axle-carrier-subframe_diff-mounts-front-rear.png | ETK: subframe with diff front/rear rubber mounts and bolts | [S6] |
| MODELREF-ONLY_bmw-etk_e46_rear-suspension-central-arm-upper-lower-lateral-links.png | ETK: central arm, upper and lower lateral links | [S7] |
| MODELREF-ONLY_tedgum_e46-diff-front-pinion-flange-and-two-front-mount-bolts.jpg | photo: diff nose from below, pinion flange, two front mount bolts | [S20] |
| MODELREF-ONLY_tedgum_e46-diff-rear-mount-bushing-and-long-bolt.jpg | photo: rear mount bushing with long bolt | [S20] |
| MODELREF-ONLY_tedgum_e46-diff-rear-bushing-in-cover-eye.jpg | photo: rear bushing in its socket | [S20] |
| MODELREF-ONLY_tedgum_e46-diff-rear-bushing-new-pressed-in.jpg | photo: new rear bushing pressed in | [S20] |
| MODELREF-ONLY_tedgum_e46-rear-aluminium-bracket-under-subframe.jpg | photo: rear aluminium bracket under subframe | [S20] |

## Open questions

* Housing material: no BMW E46 source found. Most likely a cast-iron housing with a cast (probably aluminium) cover.
* Exact outside dimensions of the 188K (flange-to-flange width, length, height): none published; the model numbers above are estimates.
* Hypoid offset (pinion below ring-gear axis) and exact diff height above the ground: not found; estimated.
* Exact mounting position of the two vibration absorbers on the automatic's diff: the ETK drawing shows them on top of the housing; not confirmed with a photo.
* Tooth count for 3.38: 44:13 = 3.385 would fit, but it is not confirmed. One ETK line, "I=44:13=3,64" (US ZHP), is internally inconsistent.
* Oil capacity of the E46 188K: not confirmed (BMW rear diffs typically hold 1 to 1.4 litres).
* Whether this April-2001 car has DSC or only ASC+T as standard: de.wikipedia says DSC (ESP) became standard on all models from 09/2001. ADB brake intervention exists in both.
* Whether the diff was ever replaced (the car was imported in 2009). The ratio can be read from the tag/stamping on the diff housing.
* The body-crack issue at the rear-axle mounts comes from de.wikipedia only (one source).

## Sources

- [S1] BMW AG Presse, "Technische Daten BMW 3er Coupé 320Ci, 325Ci, 330Ci", 28/9/01, valid from 09/2001 (values in brackets = automatic): https://www.treffseiten.de/bmw/info/daten_320ci_325ci_330ci_coupe.pdf
- [S2] BMW ETK (via bmwfans.info), E46 Coupe Europe 330Ci M54, LHD, production 03/2001, "Differential drive/output": https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/mar2001/browse/rear_axle/differential_drive_output/
- [S3] Same, "Final drive gasket set" (cover "TYP 188K"): https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/mar2001/browse/rear_axle/final_drive_gasket_set/
- [S4] Same, "Output shaft" (automatic, S205A): https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/mar2001/browse/rear_axle/output_shaft/
- [S5] Same, "Output shaft with bearing ball cage" (manual): https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/mar2001/browse/rear_axle/output_shaft_with_bearing_ball_cage/
- [S6] Same, "Rear axle carrier": https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/mar2001/browse/rear_axle/rear_axle_carrier/
- [S7] Same, "Rear axle support/wheel suspension": https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/mar2001/browse/rear_axle/rear_axle_support_wheel_suspension/
- [S8] BMW ETK (bmwfans), E46 Coupe USA 330Ci, 03/2001, final drive: https://bmwfans.info/parts-catalog/E46-Coupe/USA/330Ci-M54/L-N/mar2001/browse/rear_axle/differential_drive_output/
- [S9] BMW ETK (bmwfans), E46 Coupe Europe 330Ci, 09/2000, final drive: https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/sep2000/browse/rear_axle/differential_drive_output/
- [S10] BMW NA Technical Training ST034 "E46 Complete Vehicle - Models" (p.22 rear suspension, p.23 final drive, p.50 330xi): https://archive.org/download/BMWTechnicalTrainingDocuments/ST034%20E46%20Complete%20Vehicle/1%20models.pdf
- [S11] BMW NA Technical Training ST056 "Suspension Systems and Alignment Procedures" (1-20-03), p.15-21: https://archive.org/download/BMWTechnicalTrainingDocuments/ST056%20Chassis%20Dynamics%20(Archive%201)/01%20Suspension%20Systems%20and%20Alignment%20Procedures%201-20-03.pdf
- [S12] BMW NA Technical Training ST1115 "BMW Suspension Systems", p.38-39 (HA3): https://archive.org/download/BMWTechnicalTrainingDocuments/ST1115%20Chassis%20Dynamics%20_/03_BMW%20Suspension%20Systems.pdf
- [S13] BMW of North America, "2001 BMW 3 Series 330 Models Specifications": https://www.press.bmwgroup.com/usa/article/attachment/T0021977EN_US/41270
- [S14] BMW of North America, Press Kit MY2003 (24 Oct 2002), "2003 BMW 330 coupe and convertible specifications" and "2003 BMW 330 Sedan specifications": https://www.press.bmwgroup.com/usa/article/attachment/T0022146EN_US/41438 and https://www.press.bmwgroup.com/usa/article/attachment/T0022146EN_US/41439
- [S15] BMW NA Technical Training ST046 "E60 Driveline" p.16-19 (188K ratio range 2.35-4.10, aluminium finned cover on the E60): https://archive.org/download/BMWTechnicalTrainingDocuments/ST046%20E60%20Complete%20Vehicle/04_E60%20Driveline.pdf
- [S16] BMW NA Technical Training ST502 "E90 Powertrain" p.17-18 (188L successor): https://archive.org/download/BMWTechnicalTrainingDocuments/ST502%20E90%20Complete%20Vehicle/04_E90%20Powertrain.pdf
- [S17] BMW NA Technical Training ST034 "E46 Traction and Stability Control" (ADB brake intervention): https://archive.org/download/BMWTechnicalTrainingDocuments/ST034%20E46%20Complete%20Vehicle/13%20P1%20Traction%20and%20Stability%20Control%20Internet.pdf
- [S18] RacingDiffs, "BMW differential types explained: sizes, generations & housing codes": https://racingdiffs.com/blogs/news/bmw-differential-types-explained-sizes-generations-amp-housing-codes
- [S19] BimmerWorld, "Rear Differential Mount, Meyle HD - E46 non-M, E83 X3, E85 Z4" (3 mounts; OE 33176751808 is "open hydro fluid-filled"): https://www.bimmerworld.com/Driveline-Shifter/Differentials-Accessories/Meyle-Heavy-Duty-E46-Z4-X3-Rear-Differential-Mount.html
- [S20] TEDGUM, E46 rear differential bushing replacement (PDF and page with photos): https://www.tedgum.pl/wp-content/uploads/2019/09/tedgum-bushing-puller-ted99705-bmw-e46-eng.pdf and https://tedgum.pl/?p=5021
- [S21] BimmerWorld, "E46 Finned Differential Cover - 33117512980" (aluminium, fits all non-M E46): https://www.bimmerworld.com/Driveline-Shifter/Differentials-Accessories/E46-Finned-Differential-Cover.html
- [S23] de.wikipedia "BMW E46" (cracks at rear-axle body mounts, fixed 09/2001; ESP standard from 09/2001): https://de.wikipedia.org/wiki/BMW_E46
- [S24] en.wikipedia "Differential (mechanical device)": https://en.wikipedia.org/wiki/Differential_(mechanical_device)
- [S25] en.wikipedia "Spiral bevel gear - Hypoid gears": https://en.wikipedia.org/wiki/Spiral_bevel_gear#Hypoid_gears
- [S26] nl.wikipedia "Differentieel (werktuigbouwkunde)": https://nl.wikipedia.org/wiki/Differentieel_(werktuigbouwkunde)
- [S27] automobile-sportive.com, BMW 330Ci guide (2.93; "un autobloquant et non un simple antipatinage"): https://www.automobile-sportive.com/guide/bmw/330ci.php
- [S28] eBay product page "OEM BMW 99-06 E46 Rear Back Diff Differential 3.38 Ratio 7505393": https://www.ebay.com/p/3018546934
- [S29] BMW ETK (bmwfans), E46 330Ci 03/2001, "Drive shaft, centre bearing, CV joint": https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/mar2001/browse/drive_shaft/drive_shaft_cen_bearing_const_vel_joint/
- [S30] bmw-syndikat.de forum, "e46 haben 168k oder 188k Diffs verbaut, wobei das 'k' für kompakt steht": https://www.bmw-syndikat.de/bmwsyndikatforum/topic134118_Muss_Differential_erneuern__aber_welchen_!__3er_BMW_-_E46.html
