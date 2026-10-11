# Reading references

A reference is evidence of principles, never a command to clone. Extract why it works; don't
summarize it as "clean, smooth, modern", and never copy its layouts unless Karl explicitly asks.

## Style reference or content reference

Decide which kind each reference is before using it:
- **Style reference:** influences the visual language: materials, color logic, type, rendering,
  depth, motion feel. The library's three directions are style references (`styles/README.md`). Take the look; the
  case decides every layout.
- **Content reference:** influences how information can be communicated: how a process was
  explained, how a number was made felt, how a transition carried meaning. Take the communication
  idea and rebuild it for this client's message, in this film's style.
- **Motion benchmark:** Karl's benchmark for how films should move (`references/benchmarks.md`). Take
  the motion craft, never the look.

A reference can be more than one kind; say which parts you are using and why.

## What to analyze

For representative frames and moments:
- **Why the frame works** (answer first, in one sentence),
- **Composition:** focal point, alignment, spacing, scale hierarchy, crop, balance, depth planes,
  number of elements, use of negative space, information density,
- **Visual system:** typography, color, geometry, image treatment, icon and UI style, depth, texture,
  light,
- **Visual concept:** the idea that communicates the message,
- **Motion:** start and end states, duration, direction, velocity and easing character, overlap,
  anticipation, follow-through, secondary motion,
- **Camera behavior** and **transition logic:** what carries across (object, direction, color,
  shape, camera, scale, texture, type),
- **Macro structure:** duration, hook, number of major beats, density and pace changes, rhythm,
  recurring motifs, climax, resolution,
- **Sound:** impacts, accents, ambience, transition sounds, music structure, silence,
- **Principle:** for every notable technique, why it works, stated so it transfers.

Keep what you saw separate from what you inferred: compositions, type, palette and transition end
points come from the frames; easing and in-between motion are inferred from consecutive samples;
audio is unanalyzed unless you analyzed it.

## Record format

```
REFERENCE / SOURCE / DURATION / WHY SELECTED / KIND (style, content, motion)
MACRO STRUCTURE: hook, pacing, climax, resolution
VISUAL SYSTEM: type, color, geometry, depth, imagery, UI, texture

[timecode]
COMMUNICATION PURPOSE:
STATIC COMPOSITION:
PRIMARY MOTION:
SECONDARY MOTION:
TRANSITION LOGIC:
TIMING:
EASING CHARACTER:
SOUND RELATION:
WHY IT WORKS:
TRANSFERABLE RULE:
DO NOT COPY:
```

## Seeing a reference video

You can't watch video, and a YouTube page returns metadata at best. Never describe a reference's
motion from its URL alone. Capture frames, then analyze the frames.

- **A URL or a file, first look:** the `video-extract` MCP server (`production/mcp-tools.md`):
  `resolve_video` says what it is without downloading, `analyze_video` gives the transcript and
  deduplicated key frames (`frames: "even"` with `start`, `end` and `maxFrames` samples a range evenly).
  Then measure the motion with the scripts below; key frames show what is there, not how it moves.
- **A video file, the quick way:** `python3 scripts/ref_sheet.py ref.mp4 out/ref --every 1.5` draws an
  overview with true timecodes (it doesn't need ffmpeg's drawtext, which some builds lack), and
  `--from 12 --to 14 --fps 10` samples a transition densely.
- **A video file:** `ffprobe` gives duration, frame rate and size. For an overview with timecodes:
  `ffmpeg -i ref.mp4 -vf "scale=320:-2,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=18:fontcolor=red,fps=1,tile=6x5:padding=4:color=white" ref_%02d.png`
  (one sheet per 30 seconds). Keep `drawtext` before `fps` so each label is the sampled frame's true
  time. To study a transition, sample densely: put `trim=start=12:end=14,` at the front of the filter
  and use `fps=10` (trim keeps source timecodes; `-ss` would restart the labels at zero). For cut
  points: `ffmpeg -i ref.mp4 -vf "select='gt(scene,0.3)',showinfo" -fps_mode vfr cut_%03d.png`; the
  timestamps appear in the log as `pts_time`.
- **An online video, with a browser tool:** open it, skip any ads, pause it, then draw frames onto a
  canvas at chosen times and screenshot the canvas (`scripts/reference_frames.js`). Sample every
  0.6–1.8 seconds, and every 1–3 frames around transitions. Stepping forward one frame at a time is
  fast; large jumps are slow because the decoder restarts from a keyframe. A hidden browser pane
  still draws frames after a seek, but a playing video may not update, so seek rather than play.
- **Measure motion, not just stills:** stills don't show animation. Run `scripts/motion_check.py` on a
  file, or compute the same per-frame difference in the page, to see how constantly and how much the
  frame moves.
- **Neither:** ask for the file, or for screenshots at key moments.
