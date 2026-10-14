# Brief for the segment builders

You rebuild ONE segment of a reference promo film in Remotion, frame for frame, as a WKConversions film. The client will lay our frames over the reference's: layout, sizes, positions, timing, motion and transitions must match the reference exactly; only the content changes (WKC's script, brand and work).

Project: /home/user/Video-s/films/wkc-promo/film (Remotion 4, React, TypeScript; 1920x1080, 30 fps, 1262 frames). node_modules is a symlink; don't install anything.
- src/lib.ts: WKC colours (C), fonts (F: "Inter Tight" headlines, "Inter" UI; both variable 100-900, loaded by src/fonts.ts), easing helpers (bezier, EASE, expoOut, pr, keys, lerp, clamp01, inv).
- src/kit.tsx: tw() text measure, WkcMark (the handwritten wkc monogram SVG), Pointer (the reference's glossy dart cursor; tip at x,y), Grain, Glow, textGlow.
- src/timeline.ts draws the segments in order; YOUR file src/segN.tsx exports RANGE ([from, to) frames it draws; it may overlap a neighbour for a transition, the later segment draws on top) and the component SegN({ g }) where g is the film frame.
- Assets: public/img (wkc-mark.svg, raphael-400.webp, karl-400.webp, grain.png), public/clips (real WKC client video clips + stills, see clips.json; use with <OffthreadVideo src={staticFile("clips/...")} /> inside a <Sequence from={startFrame} layout="none">), public/fonts.
- Your spec: /home/user/Video-s/films/wkc-promo/spec/segN.md (measured from the reference at 1080p; follow its WKC ADAPTATION section). The script and direction: /home/user/Video-s/films/wkc-promo/spec/BRIEF.md. The soundtrack's sync points: spec/audio.md (picture events must land on the reference's frames).
- Reference frames: /home/user/Video-s/films/wkc-promo/ref/frames/fNNNN.jpg (1280x720; frame n of the film = frame n of the reference).

Tools (run from the film folder):
- Stills: `node scripts/stills.mjs 10,20,30 out/segN` renders those frames to out/segN/fNNNN.png (bundles each run, ~1 min; keep batches to <= 12 frames; never run two at once yourself).
- Overlay: `python3 scripts/overlay.py out/segN/f0030.png 30` writes out/segN/f0030_ov.jpg (reference | ours / 50% blend | edges: reference red, ours cyan, both white) and prints foreground boxes of both and a global shift. Look at the sheet with the Read tool. Zoom crops with PIL when needed.
- Typecheck: `npx tsc --noEmit -p .` (must be clean for your files).

Fidelity bar (check, don't assume):
1. At the first, middle and last frame of every shot and at every transition frame, the overlay shows our elements on the reference's: text blocks, cards, buttons, logos, rings, streaks within about 6 px in position and 3% in size at 1080p (text widths differ with different words: then match the cap height, baseline, centre/left edge and alignment the reference uses).
2. Timing: every entrance, exit, cut and transition starts and ends on the reference's frames.
3. Motion: for each entrance/exit compare the per-frame position/scale/opacity of a key element on 4-6 consecutive frames against the reference (same curve).
4. Look: backgrounds, glows, gradients, blur, grain match the reference's in WKC blues (the client wants the reference's look: dark glowing sections, pastel gradient sections, re-coloured into WKC's blues #3F8CE8 / #8DC0FF / #5FD3FF / #1B4FB8, soft #E6F0FD, ink #050F19).
5. Smooth: no jumps, pops or one-frame glitches; fast moves blurred like the reference.
6. Clean, premium, legible; real WKC content: the script lines exactly as given, WKC's monogram, founders, client clips; never invent clients, numbers or claims beyond the script.

Rules: edit only src/segN.tsx and new files you create named src/segN_*.tsx (plus any shared file the orchestrator names for you), and assets you add under public/segN/. Do not edit lib.ts, kit.tsx, timeline.ts, Film.tsx or other segments (copy a helper into your file if you need a variant). Never git, never pkill (kill only by PID), never render the full film, rm only literal paths.
Finish with a self-review: overlay sheets at key frames, a list of measured deviations still left, and reply with what you built, the overlay results per key frame, and anything you could not match.
