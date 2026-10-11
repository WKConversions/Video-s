# senior-motion-designer: what changed (Tale Forge, October 2026)

Upload `senior-motion-designer.zip` to replace the skill. The library inside it is the live library
(https://claude.ai/artifact/UeFiNvnC9tHrN97jpEyr5X, version 20) with these additions.

**Check before uploading:** the SKILL.md in the zip is the one synced to this session (dated 9 October), plus the
additions below. If your account's SKILL.md is newer than that (for example if it already talks about "directions"
instead of styles, or the movement graph), keep yours and paste in only these four additions:

1. Which-task table, a new row:
   `| A revision Karl is waiting for ("change X", "no Y") | Other tasks: revision: straight to the video |`
2. Core laws, "Truth" ends with: "…comes from the harvest's facts file, and every piece of interface is the
   product's real UI with its real copy (no field or button it doesn't have)."
3. Core laws, a new law before "Karl's rules win": **The client's own material, at its best.** Build with the
   client's own art, product and medium; no cheap stand-ins (silhouettes, cut-out puppets walking across a
   background, doodles over their art), and nothing that suggests a business they're not in (drawings for a
   picture-book company). For illustrated clients: paintings, light, depth and paper (`production/remotion.md`,
   storybook films).
4. Other tasks, a new item: **A revision Karl is waiting for:** straight to the video. Read his note and the
   corrections, change the build directly (no planning panels or extra passes he didn't ask for), render the
   draft with the mix, send the preview, then list what wasn't checked (blurred render, full QC) and offer it.
   Give honest time estimates and update them when asked.

(Also in the zip's SKILL.md: the Sounds note names `sfx_kit.py`, `sfx_fairy.py` and `score_sampled.py`, and step 14
mentions cues written against timing labels and an original score on sampled instruments.)

## New in the library
- `scripts/score_sampled.py`: original score on a sampled chamber orchestra (VSCO 2 CE, CC0), tempo map cut to
  the VO; worked example: "Iris's Waltz". `scripts/score_check.py`: checks a score without listening.
- `scripts/sfx_kit.py`: storybook/magical effects kit (recorded CC0 instruments + generated foley), merging index.
  `scripts/sfx_fairy.py`: the v1 fairytale effects. `scripts/sfx_synth.py` is now importable.
- `scripts/cues_from_labels.py`: cue sheet from timing labels and VO words. `scripts/sound_mix.py`: per-cue
  `"auto_level": false` for ambience beds.
- `scripts/vo_whisper.py`: word timings with faster-whisper.
- `scripts/storybook_kit.tsx` (+ blot and grain textures): paintings, light pools, blooms, page turns, rack focus.
- Modules: `motion/sound.md` (composing on real instruments, sources, kits, label cues), `production/remotion.md`
  (storybook films), `production/build-gotchas.md` (workflows across restarts, big sample repos, one clock, render
  times), `planning/voice-over.md`, `examples/corrections.md` (four Tale Forge corrections and three new
  recurring lessons), `scripts/index.md`, the library page.
