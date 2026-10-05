# interior.glb: E46/2 330Ci coupe interior (2001, LHD, automatic)

Build: `python3 build/parts/interior.py` (build, fit check, export, all previews; about 4 min on the CPU).
Options: `--no-render`, `--no-check`, `--views=cockpit,selector,side,...`. Output: `film/public/models/interior.glb`
(about 2.7 MB, 138k triangles, one embedded 1024 px texture), previews in `build/parts/previews/interior_*.png`,
stats and fit results in `build/parts/interior_stats.json`, texture atlas `build/parts/interior_atlas.png`
(made by the script).

## What is modelled
- **Front seats** (grey leather): cushion and backrest with side bolsters and the bolster seams. The headrest sits on two
  chrome posts with a visible gap above the backrest, as in the photo of the car. Also modelled: black plastic seat pan,
  outboard side shield with the recliner hub, rails and risers on the floor (Y 0.20). Backrest 23.5 deg from vertical.
- **Rear bench** (grey leather): 2+1. Two dished outboard seats with bolsters, a narrow raised centre seat, and a head
  restraint for each outboard seat on the backrest top in front of the parcel shelf. Backrest 37 deg from vertical. It
  stays inboard of the rear wheel wells (|Z| < 0.555 below Y 0.69).
- **Dashboard**: a loft of side profiles across the car.
  - Driver side: the binnacle hood (an arched visor) over a deep recess with the instrument cluster (child node).
    The cluster has four dials from left to right: fuel, speedometer (km/h, 260), rev counter (7, red from 6.5, with the
    economy gauge), coolant temperature. It also has chrome rings and white needles.
  - Centre: two centre vents above the centre stack (radio, automatic climate control, storage), and the trim strip
    across the passenger side.
  - Outer vents at both ends. The steering-column shroud with the two stalks, and the rotary light switch left of the
    column.
  - The top drops toward the ends to clear the windscreen corners.
- **Steering wheel**: pre-facelift E46 4-spoke multifunction wheel. It has a leather rim (377 mm outside), a shield-shaped
  airbag pad with the BMW roundel, two horizontal spokes with MFL buttons, two lower spokes at about 5 and 7 o'clock,
  and a back cover. The column is 24.5 deg below horizontal.
- **Centre console** (`centre_console`):
  - satin selector surround with the gate insert;
  - textured P-R-N-D plate on the driver side of the gate, with the M/S lane: "+" forward and "-" back (pre-9/2001
    pattern);
  - four window switches (coupe: front and rear side windows);
  - hazard and central-locking buttons;
  - handbrake slot and gaiter;
  - grey leather armrest lid on the storage box between the seats.
- **Selector** (`selector`): Steptronic lever with stalk, wrinkled leather gaiter and the tall black leather knob.
  The node origin is the lever pivot (X 0.335, Y 0.505, Z 0), and the mesh is upright, which is position P.
- **Handbrake** (`handbrake`): lever with a leather grip and an end button. The node origin is the pivot (X 0.10,
  Y 0.548), and the lever rises 14 deg rearward.
- **Door cards**: front doors have a grey leather insert, a grey armrest with the satin grab handle sweeping up to the
  chrome opener in its black bezel, a speaker grille at the front bottom, a pocket lip and the lock pin. Inner surface
  |Z| 0.723 at elbow height and 0.692 at shoulder height. The rear side trims (coupe quarter panels) have a grey insert
  and an armrest. Shoulder |Z| 0.672. They stay above the wheel wells.
- **Parcel shelf**: a thin slab from the rear backrest top (X -1.385) to the rear window base (X -1.84), and its rear
  edge follows the window wrap.

Not modelled, on purpose: the floor carpet, the tunnel, the pedals and the headliner. They would hide the
drivetrain in the x-ray shots. The console stops at Y 0.47 to 0.53 above the gearbox (main case top about 0.47 to 0.49,
research gearbox.md). Seat belts are not modelled.

## Nodes (glTF; origins in car coordinates, metres)
| node | parent | origin (X, Y, Z) | notes |
|---|---|---|---|
| `seats` | root | (0, 0, 0) | empty |
| `seat_driver` | seats | (-0.10, 0.20, -0.37) | on the floor under the cushion; extras `easy_entry_slide_m` 0.09 |
| `seat_passenger` | seats | (-0.10, 0.20, +0.37) | |
| `rear_bench` | seats | (-0.85, 0.20, 0) | |
| `dashboard` | root | (0.60, 0.75, 0) | |
| `instrument_cluster` | dashboard | (0.515, 0.872, -0.37) | |
| `steering_wheel` | root | (0.238, 0.874, -0.37) | rotated: local +X = column axis toward the dash (spin about local X), local +Y = 12 o'clock |
| `centre_console` | root | (0, 0.55, 0) | |
| `selector` | root | (0.335, 0.505, 0) | pivot. glTF rotation about local Z: P 0, R +6, N +12, D +18 deg (+ tips the knob rearward). M/S gate: about -12 deg about local X (tips it left). "+" = tip forward, "-" = tip back |
| `handbrake` | root | (0.10, 0.548, 0) | pull = about -20 deg about local Z |
| `door_cards` | root | (0, 0, 0) | empty |
| `door_card_left` / `door_card_right` | door_cards | (0.2, 0.6, -/+0.72) | |
| `rear_trim_left` / `rear_trim_right` | door_cards | (-0.9, 0.75, -/+0.69) | |
| `parcel_shelf` | root | (-1.6, 0.97, 0) | |

Triangles by node: seat_driver 28.9k, seat_passenger 28.9k, rear_bench 19.4k, dashboard 17.0k, centre_console 7.9k,
steering_wheel 7.4k, door_card_left/right 5.6k each, rear_trim_left/right 4.5k each, instrument_cluster 4.1k,
selector 1.7k, parcel_shelf 1.3k, handbrake 1.1k. Total 137.9k (budget 150k). All primitives are closed. Normals were recalculated
outward.

Materials:
- `leather_grey` (seats, door inserts, armrests): new; the car has light grey leather.
- `leather_black`: steering-wheel rim, selector knob and gaiter, handbrake grip.
- `interior_black`: dashboard, door cards, console.
- `plastic_black`: switches, vents, bezels.
- `trim_titan`: satin trim strip and selector surround.
- `alu_machined`: opener, dial rings, headrest posts.
- `steel_dark`: seat rails.
- `needle_white`.
- `gauges`: textured (dial faces, P-R-N-D plate, roundel; UVs only on those small parts).

## Fit (checked every build)
Every vertex is tested against the body's implicit field (`build/carfield.py`, the field `body.glb` was meshed
from), which includes the wheel wells. Minimum clearance to the outer skin is 15 mm or more for every node:
- dashboard 25.7 mm (at the windscreen corners);
- rear trims 21.4 mm (at the rear side window);
- rear bench 21.9 mm (at the wheel well);
- parcel shelf 28.5 mm, front seats 30.5 mm, steering wheel 33.5 mm, door cards 37.8 mm.

Nothing reaches the engine (dashboard max X 0.873; the engine above Y 0.33 starts at X 0.95) or the wheels.

## Facts and references
- **Seat, steering-wheel and rear-bench positions**: digitised from BMW's E46/2 dimension drawing (ST034 p.7,
  `assets/ref/body/MODELREF-ONLY_bmw-st034_e46-2-coupe_dimensions_side-front-rear-top.png`; front axle x 504 px,
  rear axle 1270 px, ground y 779 px, 3.557 mm/px, heights x 1369/1401).
  - Headroom arrows 953 / 926.
  - Shoulder room 1384 / 1338 and elbow room 1447 / 1402 set the door-card and trim widths.
  - The preview `interior_side_drawing.png` overlays the drawing on an orthographic render: the seats, the headrest,
    the wheel and the rear bench sit on the drawn lines.
- **Coupe facts** from `harvest/research/body.md` (BMW NA press kit 1999): front seats 10 mm lower than the sedan;
  they glide 90 mm forward for rear access; grey dial faces with italic numerals.
- **Steptronic**: from `harvest/research/gearbox.md` ([S2] BMW ST057 p.18, 38-41; [S6g] ETK).
  - P-R-N-D in the right lane, M/S lane to the left.
  - Forward = upshift up to MY2001, reversed from 9/2001.
  - The lever sits above the rear half of the gearbox.
- **Rear seats**: GoAuto 330Ci coupe review (Aug 2001) says four lap-sash belts and a head restraint for each outboard
  passenger, with only a lap belt in the middle. So it is a 5-seat 2+1 bench
  (https://goauto.com.au/amp/bmw/3-series/330ci-coupe/2001-08-01/36476.html). unixnerd.co.uk E46 interior guide says
  the coupe rear seat splits 60/40 (https://www.unixnerd.co.uk/e46interior.html).
- **Photos** (in `assets/ref/interior/`, Wikimedia Commons):
  - "BMW E46 POV (22659495726)", Falcon Photography, CC BY-SA 2.0: 4-spoke MFL wheel, dash and vents.
  - "BMW 325Ci 2004 IMG 4253", HLW, CC BY-SA 3.0: LHD coupe dash, grey dials, P-R-N-D plate left of the gaiter.
  - "BMW E46 Instrument Cluster", The Car Spy, CC BY 2.0: dial layout.
  - "BMW E46 330i Coupe interior 2", Raito Akehanareru, CC BY-SA 2.0.
  - From `assets/ref/gearbox/`: The Car Spy's 330Ci console and selector photos (CC BY 2.0).
- **The car itself** (`build/photo_front.png`): light grey leather seats, headrests on two posts.

## Uncertain
- **Steering wheel**: this car's wheel is not visible in the photo. The 4-spoke MFL wheel is the common pre-facelift
  wheel; a sport-package car would have a 3-spoke.
- **Seat type**: standard or sports seat is unknown. The bolsters are moderate.
- **Trim finish**: satin titanium-look on the selector surround and the dash strip is a guess. A 2001 car could have
  wood, black or titanium. The film can override `trim_titan`.
- **Plastics colour**: shown black. With grey leather BMW often used grey or black plastics; the photo shows a dark dash.
- **Centre armrest** between the front seats is an option; it is modelled.
- **Rear head restraint shape** and how they mount (fixed pads in front of the parcel shelf) were not confirmed by a
  photo.
- **Selector knob**: shape is approximate (tall black leather knob, no button).
- **Gaiter**: it is part of the `selector` node, so it tilts rigidly with the lever. At the D position (18 deg) its
  base slides about 3 cm inside the gate insert.
- **Speedometer scale**: the 260 km/h end is assumed. The economy gauge has no numerals.
