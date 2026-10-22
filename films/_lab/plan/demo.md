# Realism demo: build contract (15 s, 1920×1080, 60 fps, no voice-over)

## The brief
Karl: "make it in the exact style of this video: instagram.com/p/DeQQcHvOaaH (what's inside the laptop)". The inner
film is an Upwork ad (reference frames: `ref/inner_sheet1.jpg`, `ref/inner_sheet2.jpg`, 4 fps). We make the same
kind of film for one of Karl's clients, **Creoble** (an AI website builder, creoble.dk), in Creoble's brand, with
free means only: no paid API, no image generator.

## The style to match (from the reference)
- **Photoreal devices on tactile surfaces:**
  - a phone on a round stone table;
  - a desk with a monitor, lamp, keyboard and mug against a slat wall;
  - a phone on wood;
  - a tablet on a concrete desk with a mug, in window light;
  - a dark room with a glowing monitor.
- **Light:** low-key and moody. The brand colour glows from the screens and lights the room (spill on the desk and
  the walls).
- **Camera:** slow dollies and push-ins, shallow depth of field.
- **Shot length:** each about 1–1.5 s, with hard cuts or quick blur pushes between them.
- **UI:** clean, minimal white beats with small type and a brand-colour tick.
- **Abstract space:** a dark brand-colour space with floating words and a glowing horizon line, and stacked floating
  UI cards with DOF.
- **The end:** the logo on a brand gradient with a small tagline.
- **The screen glow gradient** goes from light at the top to deep at the bottom (the ad's green, here sage).

## Brand (Creoble, `src/demo/kit.tsx`)
- **Colours:**
  - background #FAFAF8, ink #1A1614;
  - sage #87A89E, light sage #A8C4BB, deep sage #495D58, dark sage #4A6B62, sage tint #E7EFEC, cream #F5F1EA;
  - the dark spaces in sage shades: night #0E1312, nightSage #16211E.
- **Type:** Fraunces 400 for headlines and the wordmark; DM Sans 400/500 for UI. Use the `Wordmark` component, never
  typed text, for the logo.
- **Text:** all on-screen text is Danish and comes from Creoble's script or site (listed per shot below). Nothing
  invented.

## Shot list (global time; t = local seconds from the shot's start)
| # | Span (s) | Frames | Source | What we see |
|---|---|---|---|---|
| 1 | 0.00–2.20 | 0–131 | footage `phone_round_248` (tracked) | Phone on a round stone table, graded dark and cool. The screen wakes: a sage dot (t 0.7) blooms into the sage gradient (t 1.2), then the wordmark (t 1.5). |
| 2 | 2.20–3.60 | 132–215 | plate `desk_a` | Desk at dusk, monitor on: SCREEN_GRAD with "Din nye hjemmeside" / "er få minutter væk." blurring into focus. |
| 3 | 3.60–4.90 | 216–293 | 2D `WordsSpace` | Pushed through the screen into dark sage space: "Bygget af AI.", "Ingen teknik.", "Ingen skabeloner." at depths over a glowing horizon; a sage orb blooms at the end. |
| 4 | 4.90–5.90 | 294–353 | plate `desk_b` | The same desk, closer and frontal against the slat wall: the monitor with the wordmark on the gradient. |
| 5 | 5.90–7.20 | 354–431 | footage `phone_wood_1795` (tracked) | Phone on a wooden slat table: white UI "Fortæl kort om din virksomhed", typing into a field. |
| 6 | 7.20–8.30 | 432–497 | 2D `FlowCheck` | Near-white minimal: "Byg den" → ✓ "Se den" → ✓ "Så køber du". |
| 7 | 8.30–9.50 | 498–569 | 2D `Cards` | Dark space; stacked floating 3D UI cards with DOF: "Hjemmeside", "Domæne", "E-mail", each with a sage dot. |
| 8 | 9.50–10.80 | 570–647 | plate `tablet_a` | Tablet on concrete with a mug, in window light: white UI "Se den færdig," / "før du betaler." |
| 9 | 10.80–12.00 | 648–719 | plate `tablet_b` (closer) | The screen goes sage with a dotted ring filling, then white with a sage tick: "499 kr. Én gang." |
| 10 | 12.00–13.40 | 720–803 | plate `room` | Dark room: the monitor turns on, glowing sage, "Byg din side gratis."; the spill lights the desk. |
| 11 | 13.40–15.00 | 804–899 | 2D `EndCard` | The glow blooms into a sage gradient; the wordmark lands; "Hjemmeside og hosting, samlet ét sted." then "creoble.dk". |

## Interfaces
- **Plates (Blender builder):** `public/plates/<cam>/` holds `off.png`, `glow.png`, `white.png` (2560×1440) and
  `screen.json`:
  ```json
  {"w":2560,"h":1440,"quad":[[x,y],[x,y],[x,y],[x,y]],"ui":[W,H]}
  ```
  - `quad` lists the screen's corners in plate pixels: TL, TR, BR, BL of the upright UI.
  - `off` is the screen dark; `glow` and `white` are the screen emitting sage and white light (the same frame
    otherwise).
  - The lead cross-fades between the three with the UI's brightness and pins the UI on the quad.
- **UI sizes:**
  - phone_round: 600×1300;
  - phone_wood: 750×1334;
  - monitors: 1600×900;
  - tablet: 1200×900.
- **Screen UIs and 2D shots (UI builder):** `src/demo/ui.tsx` and `src/demo/shots2d.tsx`. Each is a React component
  taking `{ t: number }` (local seconds).
  - Screen UIs fill their W×H box.
  - 2D shots fill 1920×1080.
- **The lead:** owns `Demo.tsx`, Root, tracking, compositing, transitions, sound and the render.
