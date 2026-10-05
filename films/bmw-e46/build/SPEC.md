# E46 330Ci film: 3D model spec (shared by every modelling task)

The film shows Karl's brother's car, a **2001 BMW 330Ci Coupe (E46/2, pre-facelift), black, automatic**, as a 3D model
on a bright studio background. The car rotates, its body turns to x-ray glass, and parts inside it are highlighted,
pulled out and explained: the **cylinder head**, the **Double VANOS**, the **automatic transmission**, the **rear
differential**, and the **coupe body**. Everything is rendered in three.js (React Three Fiber inside Remotion), on the
CPU (SwiftShader). Facts: `harvest/research/*.md` (being written by the research workflow; read what exists).

## Coordinate system (all GLB files)
- Units: **metres**. **+X = forward** (toward the front bumper), **+Y = up**, **+Z = the car's right side**
  (passenger side; LHD car). Left side = -Z.
- Origin: on the ground, centred laterally, at the **midpoint of the wheelbase**.
- Wheelbase 2.725: **front axle X = +1.3625**, **rear axle X = -1.3625**. Wheel centre height **Y = 0.318**.
- Track: front 1.471 (wheel centres Z = ±0.7355), rear 1.478 (Z = ±0.739).
- Body: front bumper X ≈ +2.13 (incl. plate), rear bumper X ≈ -2.355, roof Y = 1.369, half-width 0.879 (no mirrors),
  sill bottom Y ≈ 0.16, bonnet at the scuttle Y ≈ 0.94 (centre), bonnet front edge Y ≈ 0.71 at X ≈ 2.02.
  Front overhang 0.774, rear overhang 0.989, length 4.488 (BMW E46/2 dimension drawing).
- Wheel arch openings: radius ≈ 0.375 around each wheel centre; the inner wheel-well wall at |Z| = 0.60.
- The body shell exists already (`film/public/models/body.glb`); internal parts must fit inside it: the engine bay
  between X ≈ +0.85 and +2.0 under a bonnet that falls from Y ≈ 0.94 (rear) to 0.72 (front); the transmission tunnel
  along the centre; the floor at Y ≈ 0.20; the boot floor at Y ≈ 0.45 behind the rear axle.

## Layout of the drivetrain (refine with the research; keep the parts consistent with each other)
- Engine M54B30, inline-6, longitudinal, crank axis on the centreline at about Y = 0.42. Front of the engine (pulley /
  VANOS face) at X ≈ +1.55; rear face of the block (bell housing flange) at X ≈ +0.82. Installed tilted toward the
  right side (BMW inline sixes in the E46 lean about 30 degrees; verify in research and state what you used).
  Cylinder 1 at the front. Valve cover top around Y ≈ 0.86. Intake manifold on the left (-Z), exhaust on the right (+Z)
  (verify).
- Automatic gearbox (GM 5L40-E family, verify): bell housing face at X = +0.82, case tapering back to the output at
  X ≈ +0.05, output centre Y ≈ 0.38. Oil pan underneath.
- Two-piece propshaft from X ≈ +0.05 (flex disc) to the diff pinion flange at X ≈ -1.15, centre bearing at X ≈ -0.55,
  slight downward slope (Y 0.38 -> 0.32).
- Rear differential: ring-gear centre on the rear axle line X = -1.3625, Y = 0.318, Z = 0; pinion nose forward;
  finned rear cover; output flanges left/right; half-shafts to the rear wheel hubs at Z = ±0.739.
- Exhaust: two pipes from the manifolds under the floor, a centre silencer, rear silencer across the back, twin tips
  at the LEFT rear (Z ≈ -0.45, X ≈ -2.30, Y ≈ 0.25).

## Naming (the film highlights parts by node name; keep these exact names on the top-level nodes)
`cylinder_head`, `valve_cover`, `camshaft_intake`, `camshaft_exhaust`, `valves`, `vanos_unit`, `vanos_sprocket_intake`,
`vanos_sprocket_exhaust`, `timing_chain`, `engine_block`, `oil_pan`, `intake_manifold`, `exhaust_manifold`,
`engine_front` (pulleys, belt), `gearbox_case`, `bell_housing`, `torque_converter`, `planetary_sets`, `gearbox_pan`,
`propshaft`, `diff_housing`, `diff_cover`, `ring_gear`, `pinion`, `spider_gears`, `halfshaft_left`, `halfshaft_right`,
`exhaust_system`, `radiator`, `fuel_tank`, `subframe_front`, `subframe_rear`, `seats`, `dashboard`, `steering_wheel`,
`wheel_FL`, `wheel_FR`, `wheel_RL`, `wheel_RR` (each with children `tyre`, `rim`, `brake_disc`, `caliper`).

## Materials (glTF material names; the film may override them)
`alu_cast` (light grey satin, the block and head), `alu_machined` (brighter), `steel` (mid grey metallic),
`steel_dark` (dark grey), `plastic_black` (valve cover, intake), `rubber` (tyres, boots), `rim_gunmetal`
(anthracite satin metallic), `brake_disc` (grey metallic), `caliper` (dark grey), `chain` (dark steel),
`copper` (coils, sparingly), `leather_black` (seats), `interior_black`.
Use PBR metallic-roughness values that read well under a soft white studio light. No textures needed; if you use any,
embed them in the GLB.

## Look
Clean, premium, a little stylised but **mechanically accurate and recognisable**: real proportions, real silhouettes,
the features an enthusiast checks (6 cylinders, two camshafts, 24 valves, the VANOS housing on the front of the head,
the torque converter bell, the finned diff cover). Real thickness, bevelled edges (bevels catch the light), no
z-fighting, closed meshes, normals outward, smooth shading where surfaces are curved. Budget: under ~150k triangles per
GLB (the wheels: under 60k per wheel). Everything is seen at 1080p, part filling up to half the frame when pulled out.

## Tools
- Blender as a Python module is installed: `python3 -c "import bpy"` (bpy 4.2). Model with bpy (primitives, bevel,
  solidify, screw, array, boolean modifiers; apply modifiers before export), export with
  `bpy.ops.export_scene.gltf(filepath=..., export_format='GLB', export_apply=True, export_yup=True)`.
  Blender is Z-up: in Blender build with **Blender X = car forward, Blender Y = car LEFT (-Z car), Blender Z = up**;
  the glTF exporter's Y-up conversion maps Blender (x, y, z) to glTF (x, z, -y), which gives exactly the coordinate
  system above. Check the exported bounds with trimesh/pygltflib.
- Preview renders: Cycles on the CPU in bpy (e.g. 960x540, 16-32 samples, denoise on), a soft studio light, white
  background. Look at your renders (Read the PNG) and compare with reference photos; iterate until it is right.
- Python packages available: numpy, scipy, trimesh, pygltflib, PIL, scikit-image.
- The research notes and reference images: `harvest/research/`, `assets/ref/<topic>/`.

## Output
Write your build script to `build/parts/<name>.py` (re-runnable: `python3 build/parts/<name>.py`), the GLB to
`film/public/models/<name>.glb`, preview renders to `build/parts/previews/<name>_*.png`, and a short
`build/parts/<name>.md`: what you modelled, which facts and references you used (with sources), the node names, and
what you were unsure about.
