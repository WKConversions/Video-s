# K.B hero film: build brief for the scene builders

A ~40 s, 1920×1080, 60 fps website hero-section explainer for **K.B**, a tech partner for startups and SMEs. No
voice-over, no music: the picture and on-screen words carry it. You build a group of scenes as React components
(Remotion) with the shared kit. Karl van Kessel (the owner of this work) set the direction below.

## Karl's direction (his words)
- "A high-end website hero section, SaaS style, Apple style animated explainer."
- "I want the bright look of the website to be the leading colour approach, instead of primarily use of for example the
  blue as background." So: bright grounds (#F7F7F7, white, pale tints); navy and cyan are accents, never a full dark
  background (a dark window as an OBJECT on a bright ground is fine).
- "K.B positions itself as a tech partner. Never mention what K.B stands for, always call the company K.B." Never write
  "Consultancy", never any other name, never a URL or domain.
- "Pure SaaS style explainer video order: variety in scenes of visualisation, SaaS style centred text animations,
  constant motion, aim to the 4% norm, and a clean variety of animations, a clean variety of transitions and a clean
  variety of colour use wherever (screen, UIs, texts, words, highlights, gradients, buttons etc.)."
- "Use the cursor for 50% through the video." (Karl's 3D hand cursor; see below.)
- "Make the visuals/visualisations in scenes where you don't include text very unique. Work with popular assets"
  (his example: a 3D Apple-style map). Think of the things everyone recognises from Apple and SaaS films: macOS
  windows, an iPhone, a MacBook-like browser, a dock, a Spotlight-like search bar, a notification stack, a node canvas,
  a code editor, charts and KPI tiles, a calendar, a 3D map with pins, glassy cards with depth. Draw them yourself in
  React/CSS/SVG (no stock images), clean and high-end, never the reflex version.

## What exists (read first)
- `films/kb-hero/film/src/kit.tsx` (LEAD-OWNED, do not edit): brand colours `C`, gradients `GRAD` (one per pillar),
  time helpers `E`, `S` (spring), `drift`, `mix`, `clamp`, `rnd`; `Stage` (the bright living background), `KBTile` (the
  square K.B logo), `Words` (SaaS centred word-by-word headline with gradient highlight words), `Eyebrow`, `Win` (macOS
  window), `Btn`, `Chip`, `Tool` (K.B's own tool logos in `public/tools`), `pressAt`, `Ripple`. Read the whole file.
- `src/types.ts`: the contract. `src/timeline.ts`: every scene's start, duration and incoming transition.
- `src/scenes/<your group>.tsx`: a placeholder you REPLACE. It must export
  `export const GROUP: Group = { scenes: { S1: ..., S2: ... }, hand: { S1: [...], ... }, sfx: { S1: [...], ... } }`.
- You may add helper files `src/scenes/<group>_*.tsx` for your own use. Edit nothing else. Do not npm install. Do not commit.

## The scene contract
- `const S4: Scene = ({ t, dur }) => ...` where `t` is the scene's LOCAL time in seconds. The film shows your scene for
  `t` from −0.3 to `dur + 0.3`: the 0.6 s around each boundary is a transition the lead applies to the whole scene
  (zoom, push, iris, wipe, blur…; see `trans` in timeline.ts). So your scene must already look composed at t = −0.3
  (start its entrances around t = −0.2 … 0.2) and must stay alive and composed until `dur + 0.3`. Do not build your own
  scene-to-scene transition; do design everything inside the scene.
- A scene is one opaque 1920×1080 frame: wrap it in `<Stage t={t} ...>`. Pure function of `t` (no Math.random, no
  state; use `rnd(k)` for variety).
- Every animation uses the kit's time helpers: `S(t, t0)` springs (Apple-style small overshoot) for arrivals, pops and
  landings; `E(t, t0, d)` eased moves; never linear, never a hard pop without a spring, nothing on screen under 0.5 s,
  any words fully readable for at least 1.2 s.
- **Constant motion, the 4% norm**: at every frame a visible part of the picture is moving (the norm is the median
  share of the frame that changes per frame, about 4%). Give each scene a slow continuous camera push or drift on its
  main group (for example scale 1 → 1.04 and a few px of drift over the scene), keep UI alive (pulses running along
  wires, bars breathing, cursors blinking, cards floating), and bring a new visual event every 0.5–0.8 s.
- **Variety**: every scene uses a different main animation idea from its neighbours (cascade, 3D tilt, morph, draw-on
  stroke, counter, typing, drag, flip, parallax, mask reveal…) and its own colour accent from the kit (per pillar:
  `GRAD.ai` cyan→violet, `GRAD.dev` indigo→cyan, `GRAD.growth` mint→cyan; plus amber/coral/green signals in UI).
- **Truth**: use only the copy and facts given for your scenes below (they come from K.B's site and their new page
  text). Small UI filler (row labels, a file name, "Deploy", "Run") is fine; no invented company names, people, numbers,
  prices or claims. Tool logos: only `Tool` names listed in kit.tsx (K.B's own tools).

## The 3D hand cursor
The lead draws Karl's 3D hand on top from your `hand` keys: `{ at, x, y, click }`, `at` in the scene's LOCAL seconds,
`x, y` the screen px of the TARGET. It glides key to key in one eased move taking
`glideTime(d) = max(0.55, min(1.6, 0.45 + d/1000))` s for d px, arrives about 0.5 s before `at` when there is room,
and for a click the fingertip is exactly on the target at the deepest point, at `at + 0.11` s: make the clicked thing
react then (`pressAt(t, at)`, `Ripple`). It stays on a click target until `at + 0.32` s, so two clicks need at least
`0.32 + glideTime(d)` s between them. A key with `dur` and `early: 0` makes a glide of exactly that length ending at
`at` (a drag: move your dragged object with the same timing and ease-in-out). The hand may already be on screen from the
scene before, so your first key is simply where you want it first; give no off-screen entry/exit keys unless your scene
says so. Where your scene uses the hand, keep it purposeful: hover, click, drag, one thing at a time, calm.

## Sound events
Export `sfx[scene] = [{ t, kind, note }]` (LOCAL seconds) for the moments that deserve a sound: kinds `click` (a hand
click, at its deepest point), `pop`, `whoosh`, `type` (a typing run start), `tick`, `success`, `slide`, `snap`, `open`,
`glitch`. Few and meaningful (3–7 per scene). The lead maps them to Karl's own sound library.

## Checking your work (do it; you cannot watch video)
From `films/kb-hero/film`:
- `bash tools/sheet.sh <group> <SceneId> 8 out/<name>.png` renders 8 evenly spaced frames of your scene alone (with
  the hand), 4 per row; view it with Read. Your own entry bundles only the kit and your file.
- `bash tools/sheet.sh <group> <SceneId> clip out/<name>.mp4` then `python3 tools/flow.py out/<name>.mp4` lists sudden
  starts/stops (JERKS) and the per-0.25 s motion profile: fix jerks that are not deliberate, and flat stretches near 0.
- Look hard at your sheets: is it bright, clean, high-end, readable at a glance, few big things, nothing overlapping
  by accident, nothing cut off, the hand's targets under its fingertip? Fix before reporting.
You have about 25 minutes. Reply with a short report: what each scene shows, your hand keys and sfx, what you checked,
anything unresolved.
