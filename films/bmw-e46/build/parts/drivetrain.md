# drivetrain.glb: automatic gearbox, propshaft, rear differential, half-shafts, exhaust, tank, chassis

Build: `python3 build/parts/drivetrain.py` (re-runnable; `--no-render`, `--no-check`, `--only gearbox,diff,...`,
`--prev gearbox,diff,overview`). Helpers: `build/parts/drivetrain_lib.py`. Output: `film/public/models/drivetrain.glb`,
previews `build/parts/previews/drivetrain_*.png`, triangle counts + clearance report `build/parts/drivetrain_tris.json`.

Coordinates as in `build/SPEC.md` (metres, +X forward, +Y up, +Z right, origin on the ground at mid-wheelbase).
Built in Blender (X forward, Y left, Z up) and exported with `export_yup`.

## Fitted to the other parts (read at build time, nothing hard-coded twice)
- **engine.glb**: the bell-housing face sits on the `engine_block` node origin (crank axis on the block's rear face):
  X = 0.980, Y = 0.390, Z = 0 (the SPEC's 0.82 was moved forward by the engine build). The flange outline is the
  section of the `engine_block` mesh 3 mm ahead of its rear face (so it includes the engine's 30 deg tilt to the
  right), united with a level lower skirt down to 186 mm below the axis, smoothed, +4 mm. The gearbox itself is upright
  and level (axis = crank axis); only the flange follows the tilted block (BMW practice, research gearbox.md).
- Exhaust manifold outlets: engine.py's `out_end` formula with the GLB's frame: (0.880, 0.165, 0.205) and
  (0.880, 0.165, 0.275); checked against the mesh (226 / 430 vertices within 45 mm).
- **wheels.glb**: rear wheel centres (-1.3625, 0.318, +/-0.739). The rear brake disc models the hub core as a
  44 mm-radius cylinder |Z| 0.682-0.774 with the hat plate at |Z| 0.756-0.767; the half-shaft stub enters that
  cylinder and the hub flange is an annulus behind the hat plate (|Z| 0.742-0.7555).
- **details.glb**: tail pipes `exhaust_tips_0` (Z -0.488) and `exhaust_tips_2` (Z -0.564), Y 0.278, front ends
  X -2.150 / -2.135; the tail pipes end 16 mm inside them.
- **body.glb**: closed outer skin, bottom Y 0.16 between the axles (0.17-0.23 behind), wheel wells are box cut-outs
  (|Z| > 0.60, Y < 0.66-0.68). Clearance check in the build (ray parity against the skin + BVH overlap against
  engine/wheels/details); results in `drivetrain_tris.json`.

## Nodes (glTF names), origins and what turns about what
| node | origin (glTF) | notes |
|---|---|---|
| `bell_housing` | (0.980, 0.390, 0) crank axis on the bell face | ZF 5HP19 converter bell, open at the front, bolt bosses + Torx heads |
| `gearbox_case` | same | main case + tail housing, ribs and bands, EGS connector, selector shaft + lever, 2 ATF cooler fittings + lines, ID plate |
| `gearbox_pan` | centre of the pan gasket face | ribbed pan, 22 bolts, drain plug (bottom), filler plug (left side) |
| `torque_converter` (empty) | (0.900, 0.390, 0) on the axis | children `torque_converter_shell`, `impeller`, `turbine`, `stator`, `lockup_clutch`; all spin about local +X |
| `planetary_sets` (empty) | (0.630, 0.390, 0) | children `ravigneaux_set` -> `rav_ring`, `rav_sun_large`, `rav_sun_small`, `rav_carrier` -> `rav_planet_long_1..3`, `rav_planet_short_1..3`; `tail_planetary_set` -> `tail_ring`, `tail_sun`, `tail_carrier` -> `tail_planet_1..4`; `clutch_packs` (A-G, static); `input_shaft`. Every gear spins about its own local +X; planets are children of their carrier and sit on their pin axes |
| `output_shaft` | (0.280, 0.390, 0) flange face | output shaft + three-arm flange; spins about local +X |
| `gearbox_crossmember` | gearbox origin | support with two rubber mounts (static) |
| `propshaft` | (0.280, 0.390, 0) | local +X along the shaft, 4.2 deg nose-up (rotation in the node); spins about local +X. Flex disc, 76 mm front tube, splined stub, U-joint, 68 mm rear tube, CV joint + boot; length 1.406 m (ETK 1403) |
| `propshaft_support` | same frame | centre bearing + bracket (static) |
| `diff_housing` | (-1.3625, 0.318, 0) ring-gear centre | cast-iron 188K housing: ribbed pinion nose, output collars (no side-bearing covers on the 'K' type), two low front lugs beside the nose (fore-aft M12 bolts into the subframe bushes), two automatic-only vibration absorbers on top |
| `diff_cover` | same | rear cover 'TYP 188K' (aluminium, cast X-ribs, no cooling fins), mounting eye on top with the hydro bush and the fore-aft M14 x 133 bolt, fill + drain plugs |
| `ring_gear` | same | 44 hypoid teeth, on the car's left of the pinion; spins about local Z (= the axle) |
| `pinion` | (-1.2815, 0.288, 0) on the pinion axis | 13 spiral teeth, bearings, drive flange; spins about local +X (with the propshaft); hypoid offset 30 mm below the ring centre |
| `spider_gears` | ring-gear centre | carrier + cross pin (vertical at export) + ring bolts; children `side_gear_left/right` (spin about local Z), `spider_gear_top/bottom` (spin about local Y = the pin) |
| `halfshaft_left` / `_right` | (-1.3625, 0.318, -/+0.165) output-flange face | output flange (LK 86), inner disc CV + boot, 34 mm shaft (ETK, automatic), outer CV + boot, stub, hub flange; spin about local Z |
| `exhaust_system` | world origin | two pipes, front silencer, centre silencer, rear silencer, clamps, hangers |
| `fuel_tank` | world origin | saddle tank, straps, pump/sender flanges, filler neck + vent to the right rear |
| `subframe_front` | world origin | front axle carrier |
| `subframe_rear` | world origin | tubular rear axle carrier: front tube arched over the diff nose with the two front diff bushes, rear tube with the U-bracket for the cover-eye mount, side members, four rubber body mounts |
| `suspension_front` / `suspension_rear` | world origin | simplified struts/springs/arms (front McPherson; rear trailing arm, lower arm + barrel spring, upper link, damper) |

Animation relations (export pose = all zero): engine/converter shell/impeller angle = -a about +X (engine turns
clockwise seen from the front); output shaft = propshaft = pinion (also negative about their local +X when driving
forward); ring gear = pinion / 3.385 (44/13), driving forward = negative rotation about glTF +Z (clockwise seen from
the car's right, same sense as the wheels rolling forward); spider_gears carrier = ring gear; differential action: side gears +/-d relative to the
carrier, spider gears turn d*14/10 about the pin in opposite senses; half-shafts follow their side gears.

## Triangle counts (whole GLB 144970, budget ~150k)
| top-level node | triangles |
|---|---|
| `planetary_sets` | 25996 |
| `gearbox_case` | 15816 |
| `torque_converter` | 13080 |
| `suspension_front` | 8668 |
| `bell_housing` | 8544 |
| `exhaust_system` | 7912 |
| `subframe_rear` | 7884 |
| `suspension_rear` | 7556 |
| `propshaft` | 6556 |
| `diff_housing` | 6316 |
| `spider_gears` | 5912 |
| `fuel_tank` | 4828 |
| `halfshaft_left` | 4020 |
| `halfshaft_right` | 4020 |
| `ring_gear` | 3520 |
| `gearbox_pan` | 2956 |
| `pinion` | 2612 |
| `diff_cover` | 2476 |
| `subframe_front` | 1748 |
| `output_shaft` | 1566 |
| `propshaft_support` | 1508 |
| `gearbox_crossmember` | 1476 |

## Checks done (in the build, see `drivetrain_tris.json`)
- Nothing pokes through the body skin except: parts inside the wheel wells (|Z| > 0.60: hub ends of the half-shafts,
  wheel carriers, strut feet - as on the real car) and the first ~0.2 m of the exhaust (X 0.68-0.88, down to Y 0.123),
  which starts at the engine's manifold outlets (Y 0.165, flange radius 42 mm) below the skin's floor line Y 0.16.
- Bell face touches the block's rear face (coplanar contact, X 0.980); its top lip touches the head's rear face by a
  few mm. Exhaust mating flanges touch the manifold outlet flanges. Half-shaft stubs/hub sleeves enter the brake
  disc's hub cylinder (wheels.glb). Remaining internal contacts are bolted joints / arm pivots only.
- Note on engine.glb (not changed here): the downpipe of the rear manifold (cylinders 4-6) loops back to X 0.806,
  behind its own outlet flange at X 0.880, so it overlaps the start of the exhaust pipe there.

## Previews (`build/parts/previews/`)
`drivetrain_gearbox_*` (left rear/front 3/4, right, below, bell face), `drivetrain_gearbox_internals`,
`drivetrain_planetary_sets`, `drivetrain_converter_open`, `drivetrain_diff_*` (outside, internals side/top),
`drivetrain_overview_*`, `drivetrain_joint_engine_gearbox`, `drivetrain_rear_axle_below`, `drivetrain_in_body_*`
(ghosted body), and side-by-side reference comparisons `drivetrain_compare_gearbox|diff|planetary`.

## Facts used (sources)
- Gearbox ZF 5HP19 = BMW A5S 325Z (not GM 5L40-E), W254 converter with two-lining lock-up clutch, Ravigneaux + tail
  set, 7 shift elements A-G, ribbed pan with 22 bolts, drain + side filler plug, selector shaft on the left,
  flex disc 96 mm bolt circle, centre bearing 55/30 mm, CV joint 6 x M10 on 86 mm, automatic propshaft 1403 mm,
  overall gearbox length ~700 mm (BMW ST034 section scaled by the 254 mm converter): `harvest/research/gearbox.md`
  and its BMW/ETK sources; reference drawings in `assets/ref/gearbox/`.
- Final drive: `harvest/research/diff.md` (188K compact case, no side-bearing covers, three rubber mounts: two front
  bushes beside the pinion flange with fore-aft M12 bolts, one hydro bush in the cover eye with an M14 x 133 bolt;
  stock cover without cooling fins; two vibration absorbers on automatics; half shafts LK 86 mm / 34 mm), the BMW
  ST034 p.23 drawing and p.22 rear-axle photo and the TEDGUM photos in `assets/ref/diff/`.
- Final drive (ETK): E46 Coupe 330Ci EU 2001 "Differential-drive/output": 33 10 7 505 394 I = 3.38 for automatic
  (30.7 kg), mounting 2 x M12 x 80 + 1 x M14 x 133, vibration absorber with bracket (automatic), output flanges
  LK 86 mm / M10 for automatic (https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/2001/browse/rear_axle/differential_drive_output/).
  Case type 188K (188 mm ring gear) for the 330i/Ci (diff covers marked "Typ 188K"; parts sellers, web search).
  3.38 modelled as 44/13 = 3.385 (common BMW tooth count for this ratio).
- Exhaust: ETK "Center and rear muffler" / "Front muffler" (front silencer 18 10 7 504 168, centre silencer
  18 10 7 506 018 for automatic, rear silencer 18 10 7 504 172, 50 mm clamps), shapes from the ETK drawings.
- Fuel tank: ETK "Fuel tank attaching parts" (plastic saddle tank, two straps, filler pipe, vent pipe).
- Rear axle carrier, wheel suspension, front axle carrier, struts: ETK drawings (rear_axle_carrier,
  rear_axle_support_wheel_suspension, front_axle_support_wishbone, front_spring_strut_shock_absorber).
  The ETK drawings were viewed only as modelling references (not shipped); copies in `assets/ref/chassis/MODELREF-ONLY_bmw-etk_*` (exhaust, tank, front axle; the diff/rear-axle drawings are in `assets/ref/diff/`)
  (source pages under https://bmwfans.info/parts-catalog/E46-Coupe/Europe/330Ci-M54/L-N/2001/browse/).

## Uncertain / estimated
- Gearbox outer shape between the BMW drawings (bell flare, rib layout, connector/selector exact positions) is an
  interpretation of ST034 fig. 1/2 and the ETK drawings; overall length 700 mm is scaled, not an official figure.
- The flange outline follows the engine model's block flange (the engine model's block is narrower than a real M54,
  so the real 440 mm-wide ZF flange is narrower here).
- Hypoid offset (30 mm) and the diff housing / cover dimensions are estimates; cover material (aluminium vs cast
  iron) not confirmed. The brief and SPEC ask for a "finned diff cover", but diff.md finds the stock 330Ci cover
  (33 11 7 508 901) has no cooling fins (the finned cover is the Z4 / aftermarket part), so the cover has cast X-ribs
  only; set `FINNED_COVER = True` in drivetrain.py to add fins. Vibration-absorber positions (on top) follow the
  ETK drawing, not a photo. Pinion flange 240 mm ahead of the axle follows from the 1403 mm propshaft.
- Exhaust routing (pipes pass over the left half-shaft, between the subframe crossmembers) and the positions of the
  front and centre silencers are inferred from the ETK drawings; no underbody photo was available (Wikimedia API was
  rate-limited). The first 0.15 m of pipe sits below Y 0.16 because the engine's manifold outlets are at Y 0.165.
- Subframes and suspension are simplified; no steering rack, anti-roll bars or engine mounts.
- Planet/sun tooth counts are visual (module 3 mm), not ZF's real counts.
