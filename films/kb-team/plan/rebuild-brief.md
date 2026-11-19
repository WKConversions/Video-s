# K.B team film: rebuild brief (v2): the reference's animation, frame by frame

You rebuild ONE package of a 50-second film for **K.B**. The film replicates a reference film (Base44, "Build an app
with your name on it", `reference/`) with K.B's brand and content. Version 1 exists and Karl rejected its animation.
This brief replaces `plan/build-brief.md` wherever they disagree; that file still holds the shot list, the K.B subject
of every shot and the voice-over times.

## Karl's verdict on v1 (verbatim)
"If you compare the reference video and this video, you see that in certain animations it's not clear on your made
video. For example, when text animations, big text animations in the screen, you cannot read it, you cannot see it.
While the reference video, the pacing, the explanation, it's better. Also, some animations aren't clear, some
animations are too stiff, some animations are too choppy. You should literally replicate frame by frame the animation
of the reference video through the whole video, because the whole video is a bit choppy, a bit stiff, a bit linear, and
I want more the direction which the reference video had."

## What the lead measured and saw in v1 (this is what you fix)
1. **Our pictures are smaller, paler and emptier.** Averaged over the film the reference covers 49% of the frame, v1
   36%, and the covered areas overlap only 0.48. Where the reference fills the frame with a finished, colourful,
   detailed screen (names, numbers, labels, pictures), v1 shows a small pale window on a grey ground with grey bars
   standing in for text. Example: the reference's finished product (f622-f638) is full-frame and dense; v1's is a white
   window on half the frame.
2. **Our big type cannot be read.** The reference's giant letters (f420-f433) are bold, near black and fill the frame's
   height; v1's are thin, navy and half cut off below the frame. The reference's close-up typed lines (f1007-f1049)
   are medium weight and sit in the upper middle; v1's are light weight and lower.
3. **Our motion is not the reference's motion.** Shot by shot, v1's curve of "how much changes per frame" barely
   follows the reference's (correlation mostly under 0.4). v1 pops and springs where the reference travels; v1 adds
   slow linear pushes where the reference rests; v1 holds still inside flash cuts where the reference keeps moving;
   v1 turned several animated transitions into hard cuts (the opening card bursting into the first screen, f36-f41, is
   a five-frame liquid spread in the reference).
4. **The pointer hides its target.** The reference's arrow is about 45 x 60 px; v1's hand is 210 px and covers the
   button it clicks.

## The rule
**For every reference frame n, our frame at the same moment (film time n / 24 s) is the same picture, translated to
K.B.** The same things, in the same places, at the same sizes, with the same amount of detail, the same light-dark
composition, the same weight of type, in the same phase of every move. Between two reference frames (we run at 60 fps,
the reference at 24) our picture glides along the same path. The old storyboard (`src/Storyboard.tsx`) is no longer the
target: it only tells you which K.B subject stands for which reference subject. If you are unsure what to draw, draw
what the reference draws, with K.B's content.

Six things are the same:
- **Same place and size.** Measure the reference's boxes (`tools/track.py boxes`, `follow`) and put ours there. A
  screen that fills the frame in the reference fills the frame in ours. Never shrink a screen into a window with
  margins unless the reference does.
- **Same detail.** Where the reference shows words, numbers, names, avatars, icons, photos, sliders or charts, ours
  shows words, numbers, names, avatars, icons, photos, sliders or charts, at the same density. A grey bar may stand for
  text only where the reference itself shows a wireframe.
- **Same light and dark.** A light screen stays light, a dark one dark, a saturated one saturated (in K.B's colours:
  where the reference uses its strong teal or orange picture, use K.B's cyan, indigo, mint or a photo, never grey).
- **Same type.** Match the height of every text line to the reference's (`tools/track.py text`) within 10%, and its
  weight by eye: body text 500-600, giant letters 700, never under 500 for anything that is meant to be read. Colour
  near black (`#16202E`) on light, white on dark. Montserrat runs wider than the reference's grotesk: keep the height,
  tighten the tracking a little (-1% to -3%), and let a line break where it must.
- **Same motion.** Every move is measured on the reference and replayed (see Motion). Nothing is invented: no slow push
  the reference does not have, no spring where the reference travels evenly, no pop where it slides.
- **Same moments.** Every cut, arrival, typed letter, click and flash is on the reference frame it is on in the
  reference.

## Translation: reference to K.B (the same in every package)
| Reference | K.B |
|---|---|
| Base44, the product that builds the app | K.B, the team that builds it and stays to run it. Always "K.B": never what it stands for, never a URL. |
| The reference's on-screen words | The words v1 uses in the same shot (they follow Karl's script and are approved). Do not rewrite them. |
| The user of the app ("Anna", "David Kim") | "Your business". Never a real client's name. |
| The prompt box ("Create an app to…", "Base 1", "Build", orange send button) | The kit's `Msg`: the same box (measured), "K.B team", "Ask", cyan send button. Use it everywhere the reference shows its prompt box, light or `dark`, so the box is the same object through the film. |
| The apps the reference builds (a calm app, a leaderboard, a robot controller, a shipping tool) | What K.B builds and runs: an automation flow with a CRM (leads, follow-ups), a search and AI-answers ranking, a booking product, an operations dashboard. The subjects per shot are in `plan/build-brief.md` and in v1's code. |
| Photos inside the reference's screens | The five team portraits (`public/team/<robin|tom|youri|karl|cedric>.jpg`) where the picture is "the people behind it"; the cleared stills in `public/stills/` (see `plan/stills.jpg`) where it is a product or customer photo; K.B's client logos (`public/clients/`) only as "clients", K.B's tools (`public/tools/`) as tools. |
| The black arrow pointer | Karl's 3D hand (`HandAt`), on the arrow's measured path, fingertip where the arrow's tip is, clicking on the same frames. Size about 110-130 px in normal screens so it never covers what it clicks; larger only where the reference's arrow is larger (measure it). |
| The Base44 logo | The K.B tile (`Tile`). |
| Filmed shots | Our cleared clips (`Footage`, names in v1's code). Keep the clip; match the cut and the reference's camera move. |

**Mock content.** Screens need believable content, and several packages show the same screens, so use this set:
- The client is one local hospitality business, always called "Your business". Its product is "Bookings" (book a table
  in two taps). Its numbers: 248 bookings this week, 92% show-up, rating 4.8, visitors +38%.
- A ranking or search result list: "Your business" among these invented names, in this order when a fixed order is
  needed: Harbour Kitchen, Olive & Oak, Mesa Verde, The Corner Table, Bistro Lune, Saffron House, Canal Street Grill,
  Noord Eten, Little Anchor.
- People in a CRM or a list: first names only, with initials avatars: Sanne, Milan, Noor, Daan, Lotte, Jesse, Fenna,
  Ruben. Statuses: New lead, Follow-up sent, Meeting booked, Quote signed. Flow steps: New lead, Follow-up sent, CRM
  updated, Team notified.
- K.B's own facts, the only claims about K.B allowed (`harvest/facts.md`): 25 client projects, 100+ automations; the
  services "AI, Agents & Automation", "Software Development", "Growth Technology"; the team's five roles (Founder & CEO,
  Co-Founder & CTO, Software Engineering, Commercial Technology, Fractional CSO & Advisor), shown as roles, no names.
- Never: another real company or person, a phone number, an e-mail address, a URL, "Consultancy".

## Motion: measure, then replay
- `n = refN(t, F0)` is the (fractional) reference frame at your local time `t`. Drive every animated value with
  `kf(n, [[frame, value], …])` from the kit: keyframes you MEASURED on the reference. `kf` passes through every key and
  glides between them, so the move has the reference's own start, speed, overshoot and settle, at 60 fps.
- How to measure: `tools/track.py follow A B x y` follows one element (a card, a window, a word) and prints its box per
  frame (`--ts` prints the keyframe lists); `boxes` lists everything on the ground per frame; `cam` gives the scale and
  shift of a picture that moves as a whole (a zoom into a screen, a filmed shot); `text` gives line heights and how far
  a typed line has come. All numbers are already in our 1920 x 1080 pixels.
- Keep the keys that carry the move: where it starts (repeat the resting value one frame earlier), two or three points
  through the fast part, the overshoot's peak if there is one, where it comes to rest. A key on every frame of a slow
  move copies the measuring noise.
- **Transitions are moves too.** Before you treat a change as a cut, look at the frames around it at `--step 1`: if
  the reference spreads, slides, scales, blurs or dissolves over two or more frames, so do we, with the same in-between
  pictures. Only a change from one frame to the next with nothing in between is a hard cut (the cuts in
  `plan/shots.json` are candidates, not verdicts).
- **Flash cuts move inside.** When the reference cuts every 3 or 4 frames, look at what happens within each flash (a
  drift, a scale, cards sliding): replicate it. A held still between cuts reads as choppy.
- **Rests are rests.** Where the reference holds, we hold: its typing, caret, pointer or counter is the life. Do not
  add a push or a drift.
- **Glide, never step.** Positions, scales and opacities are continuous functions of `t`. Only things that are discrete
  in the reference step: a typed letter, a cut, a number changing, a flash.
- Typed text: the letters appear on the reference's frames (`track.py text` shows the right edge advancing); the caret
  as in the reference (shape, blink frames).
- Filmed shots: `const tw = onTwos(name, s, inSec)`; `<Footage name at={tw.at} scale={…} x={…} />` with the scale and
  shift from `track.py cam` on the reference's shot, evaluated at the stepped time `tw.sj` (so a held picture is truly
  held). If the reference's camera is still, ours is still.

## How to work
1. Read `plan/build-brief.md` (your package's entry and "The voice"), `src/kit.tsx` once, your current
   `src/shots/<id>.tsx`, `src/timeline.ts`, `src/types.ts`.
2. Baseline: from `film/`, `python3 -I tools/check.py <id>`. It renders v1 of your package, scores every shot and
   writes pair sheets (reference above, ours below, every frame). Read the scores; open the sheets.
3. **Study every frame of your package.** Look at all pair sheets (they are your package's whole reference, 24 frames a
   sheet). For anything you cannot read at that size: `python3 -I tools/ref.py full N out/x.png` (one frame, full
   size), `crop N x y w h out/x.png --scale 2` (reference pixels, 1280 x 720), `strip A B out/x.png --step 1 --cols 6
   --w 320`, from `films/kb-team`. Write down, per shot: what is on screen and where (boxes), every text with its size
   and weight, every move with its frames, every transition, the pointer's path, what v1 gets wrong.
4. Measure (`tools/track.py`, from `films/kb-team`). Then rebuild the package shot by shot: layout and content first
   (a still that matches the reference frame), then the motion from the measured keys.
5. Check: `python3 -I tools/check.py <id>` again; look at the sheets of every shot you changed, frame by frame, and at
   `--from A --to B --w 480 --cols 4` for the fast parts. Fix what differs. Repeat until every shot passes the gates
   AND the sheets show the reference's picture in K.B's content on every frame.
6. Smoothness: `bash tools/smooth.sh <id>` when you have slow moves (it reports shake).
7. `npx tsc --noEmit` must be clean for your files (other builders are editing other packages at the same time: ignore
   errors in files that are not yours, never edit them).

## The contract (unchanged)
- You own `src/shots/<id>.tsx`, and may add `src/shots/<id>_*.tsx` helper files and assets under `public/<id>/`. Do not
  edit the kit, the timeline, the types, other packages or the tools; do not `npm install`; do not commit.
- `export const PKG: Pkg = { id, Comp, sfx }`. `Comp` gets `t` = seconds since your package's first reference frame and
  draws one opaque 1920 x 1080 frame, a pure function of `t` (no state, no randomness without `rnd(k)`); start `Comp`
  with `const ok = useFonts(); if (!ok) return <AbsoluteFill style={{ background: … }} />;`.
- The kit (`src/kit.tsx`): `C` colours, `F` font, `Ground` (paper, vig, ui, dark, cyan), `Tx`, `Port`, `Tile`, `Msg`
  (rebuilt to the reference's prompt box), `Glyph`, `Win`, `Tool`, `Check`, `Bars`, `Footage`, `onTwos`, `settle`,
  `typed`, `Caret`, `Fringe`, `HandAt`, `pressAt`, `E`, `S`, `clamp`, `mix`, `ease`, `rnd`, `rs`, `refN`, `kf`. The
  kit's `FlowCard`, `Rank`, `AppUI` are v1's sparse placeholders: build the rich versions your shots need in your own
  files. Sizes in the reference are 1280 x 720: multiply by 1.5 (`track.py` already does).
- Smooth rendering: move things with `transform: translate3d(...)` / `scale(...)` and `willChange: "transform"`, never
  with time-dependent left, top, width, height or font-size. A block that moves as its own layer needs a transparent
  margin inside the layer (make the moving div a few px larger than the visible card), or its edges step in whole
  pixels. Text that is typed must not shift the letters already there.
- Sound: keep `sfx: [{ t, kind, note }]` true to the new picture (t in local seconds; kinds: `type` with the run's
  length in seconds in `note`, `click`, `tick`, `pop`, `swish`, `slide`, `rise`, `sparkle`, `thud`, `success`,
  `digital`; `keep: true` for a run that must sound on every step).

## Gates (printed by `tools/check.py`) and what they are worth
- Layout: on a flat ground, cover within x0.7-x1.4 of the reference and overlap >= 0.60; on a full-frame picture, ours
  full-frame and tone >= 0.45.
- Motion: amount within x0.55-x1.8 of the reference, correlation >= 0.45; where the reference rests, ours rests.
- Steps: our 60 fps frames repeat no more than the reference's 24 fps frames do (filmed shots on twos are exempt).
The gates find misses; they do not prove a match. The proof is the pair sheet: on every frame, would a viewer say
"the same shot, for K.B"? If a gate cannot be met for a good reason (our text is longer, a filmed clip differs), say
so in your report with the frame numbers.

## Report (your final message)
Per shot: what the reference does (one or two lines), what you built, the gate line from `check.py`, and anything that
still differs with its frames. Then: files you added, kit components you found lacking, and the sound events that
changed.
