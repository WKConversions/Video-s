# Digital Marketing Málaga: community film (36.4 s, English, 1920×1080, 60 fps) — in progress

For digitalmarketingmalaga.com, on Karl's script and the ElevenLabs voice-over ("Christina", 34.2 s, placed at 0.4 s).
Karl's brief: no still frames, overlapping animations and transitions (constant motion), built from the site's own
visual language, not just its assets.

- **Harvest:** `harvest/` (pages screenshots and computed styles, `facts.md`, all site images at full size).
- **Their visuals, made animatable** (`film/src/kit.tsx`, `film/src/topo.ts`): the topographic contour texture as a live
  field (summits, ripples, reveal), the logo's wave mark as a stroke (fitted to the original), the wave as a connection
  line, the serif logotype (Source Serif 4), their pills, rounded photo cards, event banners, chat bubbles.
- **Sound:** bed Mixkit "Tech House vibes" (no credit needed), fitted with `music_fit.py` (lift on "Meet").
- **Checks:** `film/check.sh <scene> <t0> <t1>` renders one scene alone and measures motion and shake.
