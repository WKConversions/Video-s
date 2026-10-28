# Portrait ad template (from the Bingua ad, 40.5 s, 1080x1920, 30 fps, 7.5% motion)
The TikTok / Meta ad recipe: the hook moving on frame 0, the problem first, then the product and the payoff; a dotted
world map with countries that light up (`public/map`, `scripts/map_make.py`), a phone with the app UI (`src/app.tsx`),
the kinetic kit (`kinetic.tsx`, `timeline.ts`), running-mean motion blur and the camera in `Film.tsx`.
Not included: the footage cards and the audio (`public/footage`, `public/audio`); put the client's own there, or the
scenes that use them render empty. Replace the brand in `lib.tsx` and the copy in `Story.tsx`. For 60 fps, add the
`Film60` composition (corrections.md, "60 fps from a 30 fps story").
