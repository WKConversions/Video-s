# Realism: real footage, real devices and 3D, with free means

Use this module when the brief asks for realistic, "in real life" or 3D-looking shots, such as photoreal devices on
tactile surfaces with the brand colour glowing from their screens. Karl's reference is the Upwork ad seen on a laptop
in instagram.com/p/DeQQcHvOaaH. Everything here is free: no paid API, no image generator, no GPU.

**The rule from Karl's correction:** realistic frames are a stage for motion design, never stock footage under a
linear drift. Every realistic shot gets:
- a speed-ramped virtual camera;
- joints that travel through the screen;
- UI that breaks out of the glass.

## 1. Real footage with tracked screens (fastest, most real)
**Find the clip.**
- Search with `scripts/stock.py search` ("phone on table", "smartphone wooden table", "laptop desk").
- Prefer a static shot or a slow pan with a blank, dark screen that stays fully in the frame.
- Fetch 1080p directly: `https://assets.mixkit.co/videos/<id>/<id>-1080.mp4`. `stock.py get` can return 720p.

**Prepare the segment.**
```
ffmpeg -ss <a> -i clip.mp4 -t <d> -vf fps=60 -an -c:v libx264 -crf 14 seg.mp4
```
This cuts the segment and converts it to 60 fps.

**Mark the screen.** Draw a 100 px grid over frame 0 and read off the screen's corners. List them as TL, TR, BR, BL
of the upright UI: decide which edge is the phone's top so the text isn't upside down.

**Track it.**
```
python3 track_quad.py seg.mp4 track.json "x,y x,y x,y x,y" "<mask polygon>"
```
- The mask covers the surface the phone lies on: the table moves with the screen's plane.
- The script tracks with LK optical flow, fits a RANSAC homography and chains it frame to frame, then smooths the
  result.
- The output is one quad per frame.

**Composite** with `scripts/realism_kit.tsx`:
- `OnQuad` pins the UI with a CSS `matrix3d`.
- `lowKey` grades the footage. Add a cool multiply layer on top.
- `spill(cx, cy, glow)` is the screen's light on the surface, blended with `screen` and scaled by how bright the UI
  is.
- Finish with a glass sheen over the screen and a vignette.

## 2. Motion design on top of the footage
The worked example is `scripts/realism_footage_example.tsx`.
- **The virtual camera.** Wrap footage, UI and spill in one container, and animate translate, rotate and scale about
  a point solved from the quad. Use speed ramps: an anticipation, a push, a settle.
- **Joints are camera moves.**
  - Zoom through the screen: solve a roll that straightens the screen and a scale that makes it fill the frame. The
    screen's content then becomes the next shot.
  - Pull out from a white screen to reveal the next device.
  - A whip pan.
  - A glow that grows into the next shot.
- **Break-out UI.** Logo and field layers float above the screen plane with parallax and a shadow on the glass. On a
  dive they fly past the lens.
- **Motion blur.** Draw the scene at several camera times across the shutter and average them. In a preview, a blur
  proportional to the speed is enough.
- **Zoomed footage gets soft.** Keep the extreme zooms on fast moves, where blur hides it, or end them on the
  crisp UI.

## 3. Blender Cycles plates (devices or rooms that stock doesn't have)
**Install.** Blender 4.2 LTS from download.blender.org: about 350 MB to download, 1.1 GB unpacked. In the Video-s
repo, `tools/get_blender.sh` installs it. Run it headless: `blender -b -P scene.py`.

**Build the scene in bpy:**
- bevel every edge;
- textures and HDRIs from Poly Haven (CC0, 1k–2k to save disk);
- a low-key light and an emissive screen;
- camera DOF focused on the device, at f/2–2.8.

**Render stills, not sequences.**
- Size and samples: 2560×1440, 64–128 samples plus the OpenImageDenoise denoiser.
- Three passes of the same frame: `off` (the screen dark), `glow` (the screen emitting the brand colour) and `white`.
- Write the screen's corners to `screen.json` with `bpy_extras.object_utils.world_to_camera_view`, flipping y to
  pixels from the top.

**In Remotion:**
- cross-fade the passes by the UI's brightness, which gives physically right light spill;
- pin the UI on the quad;
- move the camera as in section 2.

On 4 CPUs a still takes about 1–3 minutes.

## 4. three.js inside Remotion (short shots only)
- **Setup:** `@remotion/three`, rendered with `--gl=swangle`. It takes about 10 s per 1080p frame on CPU.
- **Textures:** load them before mounting the scene, with `delayRender` and `TextureLoader.loadAsync`. Otherwise
  frames come out grey or black.
- **RoundedBox:** the radius must be ≤ half the smallest dimension.
- **Reflections:** a `RoomEnvironment` PMREM gives them without an HDRI.

## 5. A photo into 2.5D
`scripts/photo_layers.py photo.jpg outdir --models <dir>` runs two ONNX models on CPU:
- Depth Anything V2 Small (quantized) for a 16-bit depth map;
- ISNet general-use for a matte and a cut-out.

Then move the layers at different speeds for parallax. It takes about 11 s per photo.

## The reference look
- low-key and moody;
- the brand colour glowing from screens, lighting the room;
- shallow focus;
- clean white minimal UI beats with a brand-colour tick;
- an abstract dark brand-colour space with type and a glowing horizon;
- floating stacked UI cards with DOF;
- the logo on a brand gradient;
- shots of 1–1.5 s.

## Checks
- **Tracking:** draw the tracked quad on the first, middle and last frames.
- **Joints:** render stills of each joint's first and last frame. The screen must fill the frame where the next shot
  takes over.
- **Motion:** run `motion_check.py` as usual. A calm reference-style cut measures low (about 0.5%), so say which
  target the brief set.
