# ClearScaler — "Your market, worked for you" (40 s, silent)

A silent product film for ClearScaler's GTM platform (clearscaler.com), in their dark style, for the site and LinkedIn.
Built with the senior-motion-designer skill: site harvest → reference read (Karl's attached film) → brief, thesis, plan →
Remotion build → art-director pass (six independent reviews, then a second round) → QC → delivery.

## What is here
| Path | What |
|---|---|
| `deliver/clearscaler-gtm-40s.mp4` | The film: 1920×1080, 30 fps, 40.00 s, H.264 yuv420p, BT.709 TV range, no audio (silent by brief). |
| `storyboard/index.html` | The storyboard page: the film, direction, a frame per phrase rendered from the project, notes, revision log, open questions. |
| `storyboard/plan.md`, `brief.md`, `thesis.md` | The production plan (every caption and visual event), the brief, the thesis with its allowed patterns. |
| `references/reference.md` | The reading of Karl's reference film (timecoded sheets in `references/`). |
| `harvest/facts.md`, `harvest/missing.md`, `harvest/pages/` | Every claim the film may make, with its page; what the site lacks; the text of every page in the sitemap. |
| `brand.json`, `assets/` | The brand measured from the site; logo, fonts, founders' avatars, site screenshots and mockup captures. |
| `film/` | The Remotion project. |

## The Remotion project (`film/`)
```
cd films/clearscaler/film
npm i
npx remotion studio          # composition "Film"
```
- `src/clock.ts`: every beat as a label in seconds; `src/captions.json`: the on-screen lines (the narration), built word by word.
  Retime by moving labels; every move follows.
- `src/world.ts` + `src/World.tsx`: the market map (isometric account blocks, ClearScaler's loop on the ground, routes, replies).
- `src/cards.tsx`: the product moments (score → email, reply, week) and the finale (the loop lifts off as the 8 of 8% and turns
  into the logo). `src/ui.tsx`: captions, the GTM app's chip, shared parts. `src/lib.tsx`: the brand's tokens and curves.
- Draft (no blur): `npx remotion render Film out/draft.mp4 --props='{"blurSamples":1}'`
- Final (8-sample motion blur, chunked): `bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8}' 0,296,598,902,1200`
  then the TV-range BT.709 encode (see build-gotchas in the skill).
- In this sandbox: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

## Credits
- Logo, fonts (Outfit, Manrope, Geist Mono), founders' avatars and all copy: clearscaler.com, as the site presents them.
- Product data: the site's own demo workspace (fictional companies, labelled "Demo workspace" as on the site).
- The 8% reply rate: as published on clearscaler.com (Real · anonymised; replies over 300 contacts, 12 Aug to 12 Sep 2026,
  campaign report). The site's claims list marks it "confirm": see the open questions.
- No music, no sound effects, no voice (brief).
