# 3D

Real 3D in Remotion films: three.js through `@remotion/three` and React Three Fiber, with `@react-three/drei` for the
studio, rounded shapes and lighting. The kit is `scripts/three_kit.tsx`, tested in a 10-second reel (the K.B badge as a
real object, a laptop and a phone with live screens, interface lifting off a screen into layers). It looks clean and
premium, not photoreal: soft studio light, real thickness, soft shadows, reflections. Karl asked for it in October 2026.

## When 3D earns its place

3D is a tool for a moment, not a style for a whole film by default. Use it when depth explains something:
- **The client's mark as a real object:** the logo badge as a satin or matte tile that turns to face the viewer, for
  the opening or the sign-off (calm: one turn, no spinning, the badge and the words only).
- **A device with a live screen:** a laptop, phone or tablet the camera glides around slowly, the screen showing the
  same interface the 2D film draws, at readable sizes (`Screen3D` maps any React onto the 3D screen).
- **Inside a product:** interface panels lifting off the screen into layers to show what's in it (CRM, invoices,
  support), one after another (B9 follow-through).
- **Physical metaphors done literally:** blocks assembling into a system, a document flipping with real thickness, a
  coin turning edge-on.
- **One hero line in depth:** a short statement on a plane in space; never running text.
- **Place:** a map tilted in perspective with pins standing up, a globe turning to a city (`design/maps.md`).

Don't use 3D for what 2D shows as clearly, for every scene of a film, or as a spinning showpiece. The rules of the
whole skill still hold: few, big things; the subject the largest; no overshoot in a clean film; the camera only
breathes.

## The kit (scripts/three_kit.tsx)

- `Stage3D` the bright studio: brand background, a soft key light from above-left, a fill, reflections from soft
  light panels (Lightformers, so nothing is downloaded), a soft contact shadow on an invisible floor.
- `Camera3D` the camera: a slow breath around a target, an optional slow orbit (`orbit`, radians) and push (`push`
  0..1). Drive orbit and push with the approved curves (`EASE3.soft`, `EASE3.longS`) over seconds, never fast.
- `Tile3D` a rounded tile with an image face (the real logo, loaded with `useTex` outside the canvas): satin, matte or
  glass.
- `Laptop3D` (`open` 0..1 lifts the lid), `Phone3D`, `Panel3D` with live faces through `Screen3D`.
- `Screens` wraps the film: every `Screen3D` reports where its corners land on the frame and its interface is drawn
  onto that shape above the canvas (drei's Html doesn't run in Remotion: it updates on a render loop Remotion doesn't
  have). Screens draw above all 3D objects, so nothing may pass in front of a screen.
- `EASE3`, `k3(g, start, frames, ease)`, `mix`: the speed graphs, frame-driven.

Rules that keep it working:
- **Everything from the frame.** Pass `g` (the frame) and compute every position and angle from it; never
  `useFrame`, clocks or physics. Then the voice timing, the speed graphs and the motion probe apply as in 2D.
- **Textures load outside the canvas** (`useTex` in the film component), or the frame is taken before they arrive.
- **Units:** at the default camera (fov 30, 20 units away) one unit is about 100 px of a 1080p frame.
- **Readable screens:** design the screen interface at its own pixel size (a laptop 1280 × 800, a phone 390 × 800)
  with 36 px or more for what must be read at that size, and keep the device large enough that this survives: a
  laptop at least half the frame wide.

## Look

- **Bright, never a dark static background:** the brand's page colour as the studio background; the contact shadow
  does the grounding.
- **Materials by vibe:** premium or corporate → satin (painted metal) and brushed aluminium; friendly or human →
  matte; tech → a little glass, sparingly. One material family per film.
- **Light:** one key from above-left, soft; reflections from wide soft panels; never coloured lights or glow as
  decoration.
- **Motion:** objects rise and settle on a long S or a soft ease, panels follow-through, the lid opens on a soft ease;
  the camera orbits a few degrees over several seconds. No spinning logos, no fly-throughs.

## Rendering

- Install once per machine: `npm i @react-three/drei@10.7.9 @react-three/postprocessing@3.0.4` (three 0.180 and
  React Three Fiber 9 come with Remotion's set in this repository).
- Render with `--gl=angle` (stills: `npx remotion still … --gl=angle`; the Node API: `chromiumOptions: { gl: "angle" }`).
  It renders on the CPU, no graphics card needed.
- Time (this machine, 4 cores, no graphics card): the 10-second test reel rendered in 121 s, about 0.4 s a frame at
  concurrency 2, without motion blur. With 8-sample motion blur count about 8 times that. A whole film in 3D is
  possible; still use 3D for the moments where depth explains something.
- Motion blur: CameraMotionBlur multiplies the render time by its samples; use it only on the shots with fast moves.
- Check 3D shots like any other: the motion probe sees the screens' boxes; `busy_check.py` and `qc.sh` on the encode.

## Not possible here

Photoreal light (that needs Blender's Cycles, slow on this machine), people and characters, complex modelled products
without a model file, and real-time effects that need a graphics card.
