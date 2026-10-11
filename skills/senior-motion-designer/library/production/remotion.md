# Remotion

Remotion builds the film as a React project rendered frame by frame. It is the default route for a
coded build: Karl gets an MP4 plus a project he can open in Remotion Studio and adjust himself
(keyframes, easing, timing, text), the closest a code build gets to an editable After Effects file.
Use the plain page renderer (`production/coded-render.md`) only when Remotion can't be installed or
rendered in the session. Remotion is free for teams of up to three people.

The rules here translate this skill's motion system into Remotion; they don't replace it. For API
details, read Remotion's own current rules rather than memory:
`git clone --depth 1 https://github.com/remotion-dev/skills`, then the topic file in
`skills/remotion-markup/` (timing, transitions, motion-blur, measuring-text, local-fonts, 3d,
text-highlights, audio, voiceover, parameters, multi-scene-video, connected-compositions) or
`skills/remotion-render/SKILL.md`. Any docs page also reads as Markdown with `.md` appended
(`https://www.remotion.dev/docs/sequence.md`).

## Setup

- Scaffold: `npx create-video@latest --yes --blank --no-tailwind my-film`, then `npm i`. Add packages
  with `npx remotion add <package>` so versions match (`@remotion/transitions`, `@remotion/motion-blur`,
  `@remotion/fonts`, `@remotion/media`, `@remotion/layout-utils`).
- **In a sandbox** Remotion's browser download is usually blocked. Render with the pre-installed
  Chromium: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`
  (check the exact path with `ls`). Keep `--concurrency` at or below the CPU count, or leave it out.
- Fonts: put the brand's .woff2 files in `public/` and load each weight with `loadFont()` from
  `@remotion/fonts` (or `@remotion/google-fonts`) before anything is measured.
- Assets go in `public/` and are referenced with `staticFile()`.

## Structure the project so Karl can edit it

- One component and file per scene, each registered as its own composition (a connected
  composition) so it has its own timeline in Studio, and the film as a `<TransitionSeries>` or
  `<Series>` of named sequences with `durationInFrames` written inline.
- Every element Karl may want to adjust is its own JSX node: `<Interactive.Div name="Headline">` with
  a descriptive, hardcoded `name`. Loops (`.map()`) only for repeated items that behave as one
  template, such as chart bars.
- Styles inline, animation inline: `interpolate(frame, [start, end], [from, to], {...})` directly in
  the `style` prop, with hardcoded values, both extrapolations clamped, and the `scale`, `translate`
  and `rotate` properties rather than a `transform` string. Use `output: 'perceptual-scale'` on
  scale animations. Keep fixed copy inline in the element.
- Everything moves from `useCurrentFrame()`; CSS transitions, CSS animations and timers don't render.
- Parameters: when a film is a template (intake-form films share a structure), expose brand color,
  logo, copy and product screens as a Zod schema so a new client is a props change, not a rebuild.
- Don't overwrite changes Karl made in Studio; treat surprising edits as intentional.

## Motion tokens

Put the film's motion identity (`motion/motion-identity.md`) in one file, for example `src/lib.tsx`,
and build every scene from it: the brand colors, the three named curves, the duration palette, a
tween helper `tw(frame, from, to, a, b, ease)` with clamping, the camera component, and the recurring
pieces (cursor, pill, portrait). Scenes then share one language the way component variants do in UI
motion libraries, and a new client changes the tokens, not the scenes.

## One stage, and the kinetic kit

For a film built phrase by phrase (`planning/phrase-by-phrase.md`), structure the project as one
continuous stage rather than a series of scenes: one `Story` component that renders every layer from
the frame, each layer mounted for the span it is on screen, objects that persist across beats driven by
keyed tracks (`track(g, [["label", x, y, s, opacity], …])`), and colour fields as masks that grow out of
objects. `scripts/kinetic.tsx` is the kit Karl's October 2026 films were built with: `Line` (words that
rise out of a blur on their spoken words, with a mark, an underline or a strike), `Roll` (one word rolling
into another), `Iris` (a field or scene growing out of a point, bleeding past the frame so the camera can
breathe out), `Disc` (a photo in a circle), `camera()` keys and `track()`. Copy it into `src/` next to
`timeline.ts` and a `lib.tsx` with the brand's tokens.

## Time it with labels, not frame numbers

Write the film's timing once, as labels, the way a GSAP timeline uses its position parameter
(`scripts/timeline.ts`, copied into `src/`): beats and the force-aligned words of the voice-over are
labels in seconds, every move is placed relative to one ("turn+0.3", "w:results", "cta-0.2"), and
`T.k(g, "turn+0.3", 0.5)` gives a move's eased progress. When the recorded voice-over arrives or
Karl asks for a beat to breathe, the labels move and every move follows; frame numbers scattered
through the scenes break on the first retime. A new move starts from the previous one's start or
end ("<", ">" in GSAP) by naming that label plus an offset, never from a remembered number.

## Storybook films: paintings, light and paper

For a client whose product is illustrated (picture books, games, art), tell the film with the client's own
paintings and the physics of a book, not with drawings added on top (`examples/corrections.md`, Tale Forge):
`scripts/storybook_kit.tsx` has the parts.
- **Place by the picture.** `Plate` puts a painting full frame by a focus point and scale; `at()` gives where any
  point of it lands, so lights, labels and lenses sit on a face or a book exactly. Keep paintings under about
  2–2.5× their native pixels on screen and lay paper grain over everything; a cut-out figure walking across a
  background, or a silhouette, looks cheap.
- **Attention by light, not by camera.** A key light finds a face, a pool of light moves from one character to the
  next on their words, the room warms or goes to night: the camera only breathes.
- **Hand-offs that grow out of the page.** The next picture blooms out of an object in this one (`PaintBloom` from a
  face, a book in someone's hands, a window); a full-frame `PageTurn` at the gutter carries one page onto the next;
  `Halves` racks focus across the gutter to show the other side of the same moment; a page draws back into a book
  object, closes and opens again ("a story they can return to"); a light flood out of a painted page hides a cut.
- **Real product UI only.** Show the client's real interface and copy verbatim (a narrator button, an adventure
  card), never a feature it doesn't have.

## 3D, when it earns its place

Real depth suits a few beats: an object the viewer should feel turn (a device, a card, a product), a
camera that travels through layers, a physical scale. It doesn't suit a beat that reads as well flat;
3D for its own sake is a fingerprint (`design/anti-ai-design.md`).

The tested kit and the rules for it (studio, logo tile, devices with live screens, panels, rendering) are in
`design/three-d.md` and `scripts/three_kit.tsx`.

- `npm i @remotion/three three @react-three/fiber` (Remotion 4.0.531 with React 19 takes
  `@react-three/fiber@9` and `three@0.180`), and put the scene in a `<ThreeCanvas width height camera>`.
- Drive everything from `useCurrentFrame()`, never `useFrame` or a clock, so every frame renders the
  same in every tab and every chunk.
- Render with `--gl=swangle` (or `chromiumOptions: { gl: "swangle" }`): the headless browser has no
  GPU. Tested here: a lit card with soft shadows, rendered headless at 1280×720.
- Light it for the brand, not for a showroom: under a standard light a white card reads grey, so raise
  the ambient light or use an unlit material for UI faces; one key light, a soft shadow on a
  `shadowMaterial` floor, nothing else.
- Keep text as HTML over the canvas, or as a texture rendered from HTML, so it stays sharp and uses
  the brand font.
- A worked example: `scripts/three_card.tsx`.

## The motion system in Remotion

- **Curves** (`motion/easing.md`): arrive `Easing.bezier(0.22, 1, 0.36, 1)`, depart
  `Easing.bezier(0.64, 0, 0.78, 0)`, move `Easing.bezier(0.65, 0, 0.35, 1)`.
  `Easing.spring({damping: 200})` is a push without bounce and fits the same world; lower damping
  bounces and stays off by default.
- **Camera** (`motion/camera.md`): wrap each scene's content in one `AbsoluteFill` named "Camera"
  whose `scale` and `translate` are interpolated, inside a parent with CSS `perspective` for tilted
  planes. Holds keep their slow push.
- **Motion blur** (`motion/animation-grammar.md`): wrap the scene in `<CameraMotionBlur samples={8}
  shutterAngle={180}>` from `@remotion/motion-blur`; it works in any Chromium. `<HtmlInCanvasMotionBlur>`
  is sharper but needs Chrome 149 or later (the sandbox's Chromium is older) and a flag for live
  preview. Never nest two blur wrappers. Test with 1–2 samples, render with 8.
- **Transitions** (`motion/transitions.md`): `<TransitionSeries>` organizes scenes and timing, but its
  preset presentations are not the transition system. `fade()` never crossfades one layout into
  another; `slide()` and `wipe()` only where the movement is a real directional continuation. Most
  scene changes are built inside the scenes: the outgoing scene's element becomes the incoming one,
  with overlapping `<Sequence>`s or a shared element carried across. Transitions shorten the total:
  two 60-frame scenes with a 15-frame transition last 105 frames.
- **Text** (`design/typography.md`): measure with `measureText()` and `fitText()` from
  `@remotion/layout-utils` after fonts load (pass `validateFontIsLoaded: true`). Word-by-word builds
  are one `Interactive.Span` per word, each with its own offset. Hand-drawn highlights from
  `@remotion/rough-notation` only where the style is hand-drawn; the library's three directions are not.
- **Audio** (`motion/sound.md`, `planning/voice-over.md`): `<Audio>` from `@remotion/media`, one per
  voice-over line, each in a `<Sequence from={frame} layout="none">` on the line's frame, and always
  outside the motion-blur wrapper (`production/build-gotchas.md`). A composition can size itself to the recording with
  `calculateMetadata`. Captions (`@remotion/captions`) only when Karl asks for burned-in subtitles;
  they never replace the visual strategy.
- **3D and maps:** `@remotion/three` inside `<ThreeCanvas width height>`, animated only from
  `useCurrentFrame()` (never `useFrame()`); maps through Remotion's map techniques for the Map strategy.

## Frames, render, delivery

- **Carried objects across scenes:** end one scene and start the next in exactly the same state,
  computed from the first scene's constants (export them), and verify the cut with
  `scripts/cut_match.py`. A hard cut between identical frames is invisible.
- Storyboard and test frames: `node stills.mjs 0,45,120` (`scripts/stills.mjs`, one bundle for all
  frames), then tile them as in `production/coded-render.md`. The frames Karl approves come from the
  project itself.
- Final render only after approval: `npx remotion render <Comp> out/film.mp4`. A 60-frame 720p test
  with 8-sample blur took 16 seconds in the sandbox. When the film has slowly moving layered text, render
  it with `scripts/render_chunks.sh` instead, boundaries where no layered text moves
  (`production/build-gotchas.md`).
- Render a draft without blur first (`--props='{"blurSamples":1}'`), check timing and sync on it,
  then spend the blurred render once (times in `production/build-gotchas.md`).
- Re-encode the delivery: TV-range BT.709 `yuv420p`, loudness-normalized audio at 48 kHz, cut to the
  exact length (`production/build-gotchas.md`).
- Check the MP4 exactly like any other build (`evaluation/quality-check.md`), including the motion
  check and `ffprobe` for frame rate, size and a 48 kHz audio track.
- Deliver the MP4 and the project folder (zipped, without `node_modules`). Karl opens it with
  `npm i` and `npx remotion studio`. Studio can't be shown from a cloud session; say so.
