# Recruiting Rewards: two SaaS explainers

Two separate films for recruitingrewards.com, 40 s each, 1920×1080, 30 fps, no voice-over.

| Film | Composition | Delivery |
|---|---|---|
| For recruiters: "Stop selling. Start recruiting." | `Recruiters` (`film/src/Recruiters.tsx`) | `deliver/recruiting-rewards-recruiters.mp4` |
| For companies: "No cost until someone is hired." | `Companies` (`film/src/Companies.tsx`) | `deliver/recruiting-rewards-companies.mp4` |

The `-preview.mp4` files next to them are small copies for sharing in chat.

- **Script:** `storyboard/scripts.md`.
- **Facts and copy:** `harvest/facts.md`. Every claim on screen comes from the site's /recruiters and /companies pages or from the product demo films. The interface is rebuilt from the demo films with their own copy and sample data: Nordvik Systems AB, Senior Backend Engineer SEK 119,000, Account Executive SaaS SEK 95 000, Oskar Vinge, Arthur Berg.
- **Style:** the site's own tokens (`film/src/tokens.ts`):
  - warm off-white page #F8F6F5, stone ink #1C1917, deep green #287E61, amber accent, navy CTA panel #0B1F3A
  - Lora headlines, Manrope UI (both SIL OFL, `film/public/fonts`)

## Rebuild

```
cd film
node stills.mjs 100,400,900 1 Recruiters                     # test frames -> out/test
bash ../scripts/render_chunks.sh Recruiters out/final/recruiters.mp4 '{"audio":"none"}' 0,300,600,900,1200 public/audio/mix-recruiters.wav
bash ../scripts/render_chunks.sh Companies out/final/companies.mp4 '{"audio":"none"}' 0,300,600,900,1200 public/audio/mix-companies.wav
```

`film/node_modules` is a symlink to `../../tale-forge/film/node_modules` (the same Remotion 4.0.532 install).

## Sound

The mixes are `film/public/audio/mix-*.wav`. They are built from `sound/cues-*.json` with `scripts/sound_mix.py`, normalized to −15 LUFS with peaks at −1.5 dBTP.

**Music.** Both tracks are cut to 40 s with `scripts/music_fit.py --length 40 --lift 2.6`, so the music opens up on the turn at 2.6 s. Both are covered by the Mixkit Stock Music Free License, which needs no credit.
- Recruiters: "Tech House vibes" (Mixkit), https://assets.mixkit.co/music/130/130.mp3.
- Companies: "Raising Me Higher" (Mixkit), https://assets.mixkit.co/music/34/34.mp3. The song's last hit lands on the end card at 34.3 s.

The fitted wavs (`sound/music-*.wav`) and the downloads (`sound/music/*.mp3`) are not committed. Re-create them with `scripts/music_find.py` (the result is in `sound/music/find.log`) and then `music_fit.py`.

**Effects.** UI sounds come from Karl's sound library (`sound/lib/sfx`, index included):
- Pixabay Content License, no credit needed.
- Kenney, CC0.
- Karl's own recordings.
- Generated `gen-*` sounds.

No Apple system sounds are used.
