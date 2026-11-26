# K.B rebrand 2026: 13 existing films in the new brand kit

Karl's request (26 Nov 2026): every existing K.B film gets the new brand kit
(kb-consultancy-brand-kit.wkconversions.chatgpt.site): colour and logo only, the films themselves unchanged.

## The mapping
- Logo: the "K.B" Copperplate tile becomes the new KB monogram (`brand/kb-mark.png`, white on navy #172B44), same
  place, size and rounded tile. `brand/kb-monogram-white.png` is the monogram cut out with alpha.
- Navy: the old slate tile and panels (#354C67-#3D5574) and the old navy #293A51 become #172B44 (darker layers
  deep navy #0D1C2D / #0F2036).
- Light blue: the bright cyan #38C8FF becomes the kit's light blue #99CDFC; its soft tints the kit's ice #EAF5FF / #DCEEFF.
- Fonts, layouts, timing, sound: unchanged.

## How each film was done
- **From source, re-rendered** (exact): the 8 case loops (`films/kb-loops`: tokens in `src/kb.tsx`, the `KBTile` logo,
  the hard-coded cyans in `src/cases/*`) and the 50 s team explainer (`films/kb-team`: tokens in `src/kit.tsx`,
  `public/logo/kb-logo-tile.svg` replaced).
- **No source in this repo** (made elsewhere): pillar-ai-agents-automation, pillar-growth-technology,
  pillar-software-development, services. These were recoloured on the MP4 itself: `tools/make_lut.py` builds a 3D
  LUT that moves only bluish tones (old slate/navy/cyan to the new navy and light blue; whites, greys and the light
  canvas pinned), and `tools/rebrand.py` applies it and finds the old K.B tile in every frame (slate rounded square
  with white letters) to paint the new tile over it. Audio copied untouched.
  `python3 tools/make_lut.py kb2026.cube; python3 tools/rebrand.py in.mp4 out.mp4 kb2026.cube brand/kb-monogram-white.png`

## Deliverables (`deliver/`, 1920x1080, 60 fps, same names as Karl's files)
pillar-growth-technology, pillar-software-development, social-impact-factory · abroad-internships, gohere,
goteborgsvarvet, h2o-water-coolers, jongleren, pillar-ai-agents-automation · services, top-jobs-abroad, vino-mio ·
kb-team-explainer.
