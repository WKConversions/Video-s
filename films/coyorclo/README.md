# COYOR RUN: vertical promo demo (17 Nov)

For Karl's friend's streetwear brand COYOR (coyorclo.com) and its game COYOR RUN. Vertical 1080x1920, 60 fps, 28 s,
English. The gameplay is real: the game is embedded in the site's homepage (an iframe srcdoc); `film/tools/capture.js`
runs a local copy in mobile mode (iPhone 13 viewport) on a virtual 60 fps clock, hides the login gate locally, turns on
the game's own admin god mode and plays it with a small autopilot, and saves the canvas frame by frame. The four
runners (Abdel, Bram, Paulie, Rahim) are drawn big with the game's own sprite code (`film/tools/sprites.js`).
Brand: dark, gold #E9C66A, cream #F8F1E2, Barlow Condensed + DM Sans (the site's fonts).

Story: ONE OUTFIT. FOUR RUNNERS. → Abdel runs the streets → Bram flies the jetpack → Paulie dodges the traffic → Rahim
survives the moon (UFO boss) → Infinity Mode: climb the leaderboard, play for prizes → COYOR RUN, the hand taps PLAY FREE,
COYORCLO.COM. Sound: the beat from the sample draft (sound/bed.wav, looped to 28 s) and effects from Karl's own folder only.
Not in git: the client's sample videos, the game copy, the captured takes, the audio.

## v2 (Karl: "it must be fullscreen; understand the platform")
FULLSCREEN vertical gameplay: `film/tools/capture_v.js` renders the game at 4K (its own resolution scaling) and a 9:16
camera follows each runner (Abdel and Rahim's boss shot continue the sky upward; the game's HUD text is left out and the
film draws its own HUD). The platform, from the game's own COYOR Shop: play -> earn CY coins -> discounts on real COYOR
clothing (10% / 25% / 50% off at 2,500 / 6,000 / 12,000 CY, 100% for Infinity Mode winners), unlock and equip the fits
(Common to Legendary), wear them IRL (the site's products and prices). Shop screens: `film/tools/ui_shots.js`.
