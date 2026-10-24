# Klyro: 12 s looping explainer (540p, 60 fps)

Made from the client's site (`harvest/site`, Klyro, "Customer operations, in motion"), in its own brand: paper
#f1f0e9, ink #151715, lime #c9ff3d, purple, blue and orange signal colours, Manrope and DM Mono.

- **The idea:** every 4 s one customer signal (Churn risk detected, Expansion intent, Handoff ready) travels into the
  Klyro hub. The hub decides, and a next best action comes out (Protect the renewal, Unlock expansion, Accelerate
  onboarding).
- **The streams:** small signal chips stream in and action chips stream out (the sources and actions named on the
  site).
- **The top line:** "Listen everywhere · Decide intelligently · Move as one" follows the beat.
- **The bottom line:** "Customer operations. Always in motion."
- **Loop:** everything is a function of time mod 4 s (the streams repeat exactly over 12 s), so the last frame flows
  into the first.
- **Motion:** median 2.9% (`motion_check.py`), moving in 100% of frames.
- **Sound:** effects only, from the alumni library (`sound/cues.json`, `scripts/sound_mix.py`), repeating every 4 s.
- **Deliverable:** `deliver/klyro-loop-12s-540p60.mp4`. A 1080p render is `npx remotion render src/index.ts Loop`
  without `--scale`.
