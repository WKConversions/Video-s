# Realism lab (no API, no cost)

Tests for realistic motion design with free tools only.
- **Real-time 3D in Remotion** (`film/`, three.js + @remotion/three + drei): `PhoneOnWood`.
  - A phone on a wooden table, Poly Haven CC0 wood (diffuse, normal, roughness).
  - Lit by three's procedural RoomEnvironment and a warm key light with soft shadows.
  - The screen wakes up and its glow lights the wood. See `test_phone_on_wood.png`.
  - Renders at about 10 s per 1080p frame in software WebGL (`--gl=swangle`); run it as parallel chunks.
  - Textures must load before the scene mounts (delayRender), or the frame renders grey.
- **2.5D photo layers** (`scripts/photo_layers.py`): a depth map (Depth Anything V2 Small, ONNX) and a cut-out matte
  (ISNet general use, ONNX, from rembg) from one photo, in about 11 s on the CPU.
  - Models are in `models/` (gitignored; the script's header names their sources).
- **Real footage:** Mixkit (free, commercial use, no key) via `../creoble4/scripts/stock.py`.
  - It has phones and laptops on tables with blank screens, ready for screen compositing.
