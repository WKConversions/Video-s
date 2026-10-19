# Moviqly — SaaS explainer, storyboard and build contract (43.3 s, 16:9, 30 fps)

## Brief (Karl, for his own product Moviqly)
- Make the SaaS explainer for this platform from the supplied script and voice-over (vo/vo.mp3, "Christina –
  Energetic Commercial", 40.8 s; word times in film/src/words.json as "w:…" labels).
- "Use the style of the platform."
- The script follows a SaaS explainer structure: hook, problem, solution, use case, showcase, outro, CTA.
- **What the platform is** (read the inventory: Artifact https://claude.ai/artifact/37Tj26aL2ih9gVzSBcQvKr; screenshots
  in ../harvest/shots/):
  - Moviqly turns a one-line brief into a finished motion-design film.
  - **Landing:** "Make it Moviqly" and a single prompt box.
  - **Studio:** chat on the left, where the AI narrates its work as a list of steps (read the website, understood the
    business, story, art direction, storyboard, checked facts, test frames, review, render), then a storyboard card
    with a test frame per scene. The film preview is on the right.
  - Refine by chat; Export MP4 in 16:9, 9:16 or 1:1.

## The platform's style (src/lib.tsx and src/shared.tsx; measured from the app and its CSS)
- **Ground and glow:**
  - Warm paper #FAF9F7.
  - The landing glow (exact CSS, `Glow`): purple from the bottom left, blue in the middle, cyan from the bottom
    right, fading up into paper.
  - The ground keeps a faint glow (Story draws `Ground`); scenes raise it (`Glow a/rise`) at brand moments.
- **Colour:**
  - Ink #26232C; muted #6C6676; hairline #E7E3EA; mist #F2EFF6.
  - Brand purple #982AFF, blue #3047FF, cyan #10DBED (GRAD); black buttons #171717.
  - Lavender user bubbles; purple check marks (#7C3AED).
- **Type:** DM Sans. Headlines 700 with tight tracking, ink, with one key word in the brand gradient (`Say` with
  `grad`). UI 500/400.
- **Logo:** `MMark` is the real gradient M (the client's file); `Wordmark` is "moviqly" in lowercase; `Logo` is the
  lockup.
- **Feel:**
  - Rounded, soft, friendly, modern: white cards (radius 18–26, hairline, soft shadow), round gradient send button,
    pill buttons.
  - The app is playful: POP (a small overshoot) is allowed for buttons, chips, checks and dots, not for big panels.

## Kit (read src/shared.tsx once)
- **Timing:** `k`, `f`, `kf`, `typed`.
- **Type and glow:** `Say`, `Glow`, `Ground`.
- **Logo:** `MMark` (p 0..1 builds it), `Wordmark`, `Logo`.
- **Icons:** `Ico`, with the names in `P`.
- **Buttons:** `SendButton`, `BlackButton`, `ExportButton` (idle, `progress` → "Rendering 42%", `done`).
- **App pieces:**
  - `PromptBox` (the landing composer, typed text, caret, send press);
  - `UserBubble`;
  - `ActivityCard` (steps with waiting, working spinner, done check; clock "Working 1:23" or "Worked for 4:20");
  - `StoryboardCard` (6 scenes of the demo film, p fills rows);
  - `Preview` (pane content: Motion canvas, format menu, canvas with aspect `ar` animatable between 16/9, 9/16
    and 1, the demo film at time `s`, transport);
  - `Studio` (the app window with header, chat column, composer and preview pane; `studioPane()` gives the pane
    size).
- **The demo film** (`DemoFrame`, `DemoFilm`, `filmAt`, `SCENES`):
  - It shows a fictional brand, "Lumo" (a planner app's launch film), rendered in code.
  - Moviqly's previews always show this film: never a real company's brand.
- **Other:** `Cursor`, `GDot` (the gradient dot carrier).

Never edit shared.tsx, lib.tsx, clock.ts or Story.tsx. Write local helpers in your scene file.

## Truth
- Show only what the app does, as in the inventory: one-line brief → reads the website → understands the business →
  story → art direction → storyboard → checks facts → test frames → review → render (minutes) → refine by chat →
  export 16:9 / 9:16 / 1:1.
- **Not shown:**
  - file attachments and voiceover (in progress);
  - no prices, no user numbers, no URL;
  - no real company names, except the client's own "moviqly".
- The demo brand "Lumo" and its site "lumo.app" are fictional. Show them as the user's own product, never as a client
  or a testimonial.

## Words (seconds)
- **Hook:** one .06, sentence .28, one2 1.31, finished 1.60, video 2.12.
- **Problem:** motion 3.28, design 3.50, takes 3.90, designers 4.24, expensive 5.18, tools 5.50, and 6.34, weeks 6.42,
  revisions 7.08, most 8.18, teams 8.36, simply 8.64, cant 9.18, keep 9.52, up 9.64.
- **Solution:** meet 10.55, moviqly 10.76, describe 11.96, idea 12.50, moviqly2 13.24, reads 13.60, website 14.16,
  understands 14.95, business 15.58, writes 16.37, story 16.80, designs 17.49, look 18.06, checks 18.60, every 19.06,
  fact 19.30.
- **Use case:** launching 20.25, product 20.66, announcing 21.26, new 21.82, feature 21.92, just 22.76, type 22.92, make
  23.59, 25 23.88, second 24.28, video2 24.64, about 25.06, our 25.32, launch 25.50.
- **Showcase:** watch 26.42, every2 26.56, step 27.02, happen 27.34, live 27.72, get 28.44, film 28.74, minutes 29.46 |
  refine 30.60, right 31.04, chat 31.46, then 32.13, export 32.38, landscape 32.84, portrait 33.71, square 34.32.
- **Outro:** a4 35.24, little 35.32, idea2 35.54, a5 36.39, whole 36.50, new2 36.84, world 37.10, motion2 37.74.
- **CTA:** make2 38.66, it2 38.82, moviqly3 38.94, get2 39.88, started 39.98, today 40.32. End 43.3.

## Scenes, builders and hand-offs (labels in src/clock.ts; frames)
| Scene | Span | Builder |
|---|---|---|
| A, hook | 0 → s1 (92) | 1 |
| B, problem | s1 → s2 (309) | 1 |
| C, solution | s2 → sC (600) | 2 |
| D, use case | sC → s3 (775) | 2 |
| E, showcase: live and minutes | s3 → sF (909) | 3 |
| F, refine and export | sF → s4 (1048) | 3 |
| G, outro | s4 → sH (1150) | 4 |
| H, CTA | sH → end (1300) | 4 |

The incoming scene draws the hand-off frame; the outgoing scene stops one frame before it (`g >= f("s2")` → null),
so nothing is drawn twice. All times come from labels (`f("w:meet")`, `k(g, "w:reads", 0.5)`, `f("s3") - 6`), never
frame numbers.

Hand-off states (on the `Ground`, at camera identity):
- **s1, s2:** the ground alone. The outgoing scene clears its stage with a move (out of frame, collapse, blur-out),
  and the incoming scene builds from empty.
- **s3 (D → E):** `<PromptBox w={1000} text="Make a 25 second video about our launch." />` alone, centred at
  (960, 540): left 460, top 454 (its measured height is 173 px). No caret, press 0. In E it is sent: it becomes
  the user bubble in the studio's chat.
- **s4 (F → G):** a `<GDot x={960} y={540} r={14} />` alone: the finished film shrinks into the little dot, "a
  little idea".

## The film, phrase by phrase (ideas; compose each beat as a strong still first, few big things)
- **A, hook (0–3.1) "One sentence. One finished video.":**
  - On "One sentence" a big `PromptBox` (or a single typed line) types one sentence.
  - On "One finished video" the sentence becomes a playing film (the demo film grows out of the box: same card,
    the text morphs into the canvas, play).
  - Clean and fast. The film then leaves (scales away or flies off) by s1.
- **B, problem (3.3–10.3):**
  - "Motion design takes designers": three designer avatars with busy status.
  - "expensive tools": stacks of tool windows and cost tags, without real product logos.
  - "and weeks of revisions": a calendar flipping weeks, with file names piling up: "launch_v3.mp4",
    "launch_v7_final.mp4", "launch_FINAL_final2.mp4".
  - "Most teams simply can't keep up": a request queue overflowing, the pile tipping over.
  - Muted palette (ink and greys, a red-ish accent allowed only as a "late" badge), so the brand colour arrives with
    the solution.
  - Clear the stage by s2.
- **C, solution (10.3–20.0):**
  - **"Meet Moviqly":** the glow rises (`Glow` rise) and the `Logo` builds (MMark p, then the wordmark), big and
    centred, the brand moment.
  - **"Describe your idea":** the logo moves to the top and the `PromptBox` arrives and types a short brief.
  - **"reads your website, understands your business, writes the story, designs the look and checks every fact":**
    one visual per phrase, each a big card that does what it says, chained.
    - reads: a website card (lumo.app) scanned by a light sweep, with its colours and fonts extracted as chips;
    - understands: an "Understood Lumo" card, "A planner for small teams";
    - story: a script or beat list writing itself;
    - look: palette swatches, type specimen, motion style chips;
    - checks: each claim gets a purple check, "Every number and quote is on the site".
    - The `ActivityCard` steps may tick off alongside as the thread.
- **D, use case (20.0–26.1):**
  - **"Launching a product or announcing a new feature?":** two big use-case chips or cards (rocket "Product
    launch", megaphone "New feature") on the words.
  - **"Just type: Make a 25 second video about our launch.":** the `PromptBox` (w 1000) centred, typing exactly
    that line on the voice, word by word.
  - End exactly in the s3 state.
- **E, showcase: live and minutes (26.1–30.3):**
  - **"Watch every step happen live":**
    - The send press: the box flies into the `Studio`, which assembles around it. The text becomes the user bubble
      in the chat.
    - The `ActivityCard` runs live: steps spin then check in quick succession ("Read lumo.app", "Understood Lumo",
      "Wrote the story", "Art direction", "Storyboard ready: 6 scenes", "Checked facts", "Rendered the video"),
      with the clock running "Working 0:12".
    - The `StoryboardCard` fills.
  - **"get your film in just minutes":** the preview fills from empty ("CREATING YOUR MOTION…" with a progress bar)
    into the demo film playing; the clock reads "Worked for 4:20".
- **F, refine and export (30.3–34.9):**
  - **"Refine it right in the chat":** the composer types "Make it calmer", it sends, and a new short activity shows
    "Revised the storyboard"; the film updates.
  - **"then export":** the `ExportButton` is clicked → "Rendering 42%" → done.
  - **"landscape, portrait, or square":** the canvas morphs 16:9 → 9:16 → 1:1 on the three words, with the format
    menu label changing.
  - Before s4 the square film shrinks into the gradient dot.
- **G, outro (34.9–38.4) "A little idea. A whole new world of motion.":**
  - The little dot ("a little idea") pulses.
  - On "a whole new world of motion" it bursts open: the glow rises, and many small film tiles (demo frames at
    different aspects) orbit or bloom outward from it.
  - "motion" in the gradient if captioned. One big, joyful move.
- **H, CTA (38.4–43.3) "Make it Moviqly. Get started today.":**
  - The world settles into the landing look: `Logo`, the headline "Make it Moviqly" ("Moviqly" in the gradient), the
    `PromptBox` (placeholder), and a `BlackButton` "Get started" that a `Cursor` clicks on "get started".
  - Calm hold to the end with the glow drifting.

## Motion
- **Signature:**
  - ARRIVE for entrances, MOVE for carries and camera, SNAP for UI.
  - POP for buttons, chips and checks.
  - Energetic but smooth: the VO is energetic, so cuts and arrivals come on the words.
- **Camera:** push-ins and pull-backs on a world layer (MOVE). No spins or shakes.
- **Targets (`scripts/clipcheck.py` on your draft):**
  - moving in 97%+ of frames;
  - typical change 3–6% (Karl's earlier feedback: "too static" is the worst note; big things, real travel);
  - longest still ≤0.3 s (H exempt after 41.5 s);
  - every phrase "ok";
  - UI text in focus ≥ 22 px;
  - no collisions;
  - `npx tsc --noEmit` clean.

## Workflow
- **Your folder:** work only in /home/user/Video-s/films/moviqly/work/<id>/, a full copy of film/. node_modules and
  public are hardlinked: never write into them. Edit only your scene files.
- **Stills:** `node stills.mjs <frames> 1` → out/test/fNNNN.png. Batch 6–10 frames.
- **Draft:** `bash ../../scripts/draft.sh <first> <last> out/draft.mp4`, then
  `python3 ../../scripts/clipcheck.py out/draft.mp4 <first> ../../vo/words.json`.
- **Speed:** Karl wants speed. Aim to finish in about 40 minutes.
