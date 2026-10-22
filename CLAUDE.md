# Video-s: WKConversions motion films (Karl van Kessel)

Karl makes client films with the `senior-motion-designer` skill: Remotion at 60 fps, delivered as MP4. His local time
is UTC+2.

## Standing rules
- **Credentials:** never write passwords or logins to any file, commit or GitHub. API keys go in the environment
  settings (environment menu → Edit → secrets or variables); never ask for them in chat.
- **Git:** commit and push after every change you deliver.
- **Generation time:** say it when a job starts, as minutes from now plus Karl's local time. When he asks for speed,
  send the smallest convincing preview first (540p with sound), then offer the full version.
- **Usage:** keep it low.
  - Work solo by default.
  - Use parallel builders only when they save real wall-clock time. Run them on Sonnet (`model: "sonnet"`), with a
    precise brief and file ownership.
  - No multi-agent review or verify rounds unless Karl asks. Check the result yourself from one contact sheet.
  - View frames at small scale (480 px tiles). Don't re-read big files.
  - One session per film.
- **Briefs:** Karl fills in `BRIEF_TEMPLATE.md`. Ask only about what is missing and blocks the work.

## House style (details in the skill: `library/examples/corrections.md`)
- **Apple style:**
  - background calm and still, all motion in the foreground: springs, morphs, Apple transitions;
  - never a still frame;
  - a new visual every 0.5–0.8 s.
- **60 fps.** The motion norm is the median % of the frame changing per frame (`motion_check.py`); the brief names
  the target, usually 7%.
- **Sound:** effects lead, with a quiet music bed under them (louder only when there is no VO).
- **Brand and facts:** the client's own brand, harvested from their site, never another client's. On screen, only
  facts from the site or the script.
- **Realistic shots:** treat them as motion design, never a linear drift over stock: `library/production/realism.md`.
- **Old video:** when a client wants to improve one, list what it did as EXCLUDED before storyboarding.

## Layout and commands
- **A film:** `films/<client>/` holds `harvest/`, `brand/`, `plan/` (storyboard), `film/` (Remotion), `sound/`
  (cues, mix) and `deliver/` (the MP4s). Each film has a `README.md`.
- **The skill:**
  - the source is `skills/senior-motion-designer/`, with `senior-motion-designer.zip` for upload and
    `SKILL-CHANGES.md` as the change log;
  - the online library is claude.ai/artifact/UeFiNvnC9tHrN97jpEyr5X;
  - change it only with Karl's OK, then keep the zip and the artifact in step.
- **Scripts:** in the skill's `library/scripts/` (motion_check, jitter_check, sound_mix, music_find and music_fit,
  stock, track_quad, …).
- **Sound effects:** `films/alumni/sound/lib` (in cue sheets: `"library": "../../alumni/sound/lib"`).
- **node_modules:** don't reinstall. Hardlink one: `cp -al films/_lab/film/node_modules films/<client>/film/`.
- **Renders:** browser `$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell)`.
  - Preview: `npx remotion render src/index.ts <Comp> out/x.mp4 --scale=0.5 --concurrency=4 --muted
    --browser-executable=$B`, then mux the mix with ffmpeg.
  - Final: `render_chunks.sh`.
- **Blender** (photoreal plates): run `tools/get_blender.sh` when needed.
- **Disk is tight** (a few GB). Delete scratch with literal paths; `rm -rf $VAR` is blocked.
