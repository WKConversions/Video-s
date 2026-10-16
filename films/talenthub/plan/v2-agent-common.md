# Common brief for the v2 scene builders (read fully before starting)

Project: a Remotion 4 SaaS explainer for Talent Hub (graduates ↔ international careers platform, prototype).
Read first: plan/storyboard.md (v1 build contract: look, kit, hand-offs, motion targets) and
plan/v2-jongleren-nl.md (what changes now). All paths below are relative to /home/user/Video-s/films/talenthub.

## Your folder
- Work ONLY in work/<ID>/ (a full Remotion project copy; node_modules and public are hardlinked — never write into
  public/ or node_modules/). Edit ONLY your scene file work/<ID>/src/scenes/<ID>.tsx. Never edit shared.tsx, lib.tsx,
  clock.ts, lang.ts, Story.tsx or other scenes; write local helpers in your scene file.
- Kit (src/shared.tsx) now also has: `tx(en, nl)`, `roleTx`, `skillTx`, `cityTx`, `JOBS` (already language-aware),
  `JLMark` (JongLeren bull mark, h px; `white` for red grounds), `JLWord` (JongLeren.es wordmark, w px), `JLBadge`
  (rose pill "JongLeren verified"/"JongLeren geverifieerd" with mark and check; size = font px; optional text),
  `PartnerSeal` (round stamp VERIFIED PARTNER around the mark; size px; p 0..1 stamps it in), `CandidateCard` gets
  `verified` 0..1 (badge top-right on cards whose `c.jl` is true; 9 of the 12 CANDIDATES are JongLeren alumni, all
  first 8 except index 3), and `Dashboard` `filters` takes a 4th value: the "Verified partner · JongLeren" filter chip.
  Read src/shared.tsx once to see them.

## Three jobs in your scene
1. **JongLeren as verified partner** (your scene's part is below). Make it clear and literal: the viewer must
   understand "these candidates have internship work experience, verified by JongLeren". Creative but clean,
   minimal, on-brand (red/ivory/rose/white, Lato). The JongLeren mark is a red bull; use the PNG components only.
2. **No frame numbers.** Every time in your scene must come from labels (`f("w:…")`, `f("s2")`, `k(g, "w:x+0.3", d)`,
   offsets in frames from a label are fine: `f("w:browse") - 6`). The film is rendered in English AND Dutch from the
   same code with different word times (Dutch is longer and the gaps differ). Hand-off frames: `f("s1")`, `f("s2")`,
   `f("s3")`, `f("s4")`, `f("end")`. Keep every hand-off state exactly as in plan/storyboard.md, expressed relative to
   these labels (e.g. "covers by s3+3, draws nothing after s3+5").
3. **Every on-screen string through `tx(en, nl)`**, including caption word arrays for `Say`:
   `words={tx([{ t: "For", at: "w:for2" }, …], [{ t: "Voor", at: "w:nl_voor" }, …])}`. Dutch caption words use the
   Dutch labels "w:nl_<word>" (accents dropped from the key: één → "w:nl_n", potentiële → "w:nl_potentile",
   carrièremogelijkheden → "w:nl_carriremogelijkheden"). Dutch text is longer: check it fits.

## Timing facts
- Labels (seconds) EN: see src/words.json; NL: src/words_nl.json (English label names on Dutch times + "w:nl_…").
- Scene spans in frames (30 fps): EN A 0–93, B 93–366, C 366–681(+5), D 681–915(+7), E 915–1080.
  NL A 0–116, B 116–438, C 438–784, D 784–1030, E 1030–1208.
- To test Dutch: set `export const LANG = "nl" as "en" | "nl";` in YOUR work/<ID>/src/lang.ts, render stills/draft,
  then set it back to "en". (Only your scene file is copied back, so lang.ts in your folder doesn't matter, but leave it "en".)

## Checks (be efficient: the user wants speed; ~35–45 minutes total for you)
- `cd work/<ID> && npx tsc --noEmit` clean.
- Stills: `node stills.mjs <f1,f2,…> 1` → out/test/fNNNN.png; batch 6–10 frames per call and Read them. Check both EN
  and NL at the key moments (NL: text fits, no overflow, nothing collides).
- One EN draft of your span: `bash ../../scripts/draft.sh <first> <last> out/draft.mp4` then
  `python3 ../../scripts/clipcheck.py out/draft.mp4 <first>`: moving 97%+, typical change ~5% (keep v1's level, don't
  drop it), every phrase ok, longest still ≤0.3 s. Optionally one NL draft if time allows.
- The machine has 4 CPUs shared by 4 builders: keep renders small (stills batches, one draft).
- Keep CSS blur ≤12 px; a frame renders in under ~1.5 s.

## Finish
Reply with: what you changed (JongLeren visuals, by phrase), the clipcheck numbers, any hand-off detail the
neighbouring scene must know, and anything not checked. Don't commit; the lead copies your scene file.
