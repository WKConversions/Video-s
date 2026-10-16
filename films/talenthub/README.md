# Talent Hub — v2 (October 2026): JongLeren as verified partner, English and Dutch

## Delivery (v2)
- `deliver/talenthub-v2-en-36s.mp4`: English, 36.0 s (voice-over "Christina").
- `deliver/talenthub-v2-nl-40s.mp4`: Dutch, 40.3 s (voice-over "Vincent", `vo_nl/vo.mp3`); all on-screen text Dutch.
- Both 1920×1080, 30 fps, H.264 High BT.709, AAC 48 kHz, about −15 LUFS.
- v1 (`deliver/talenthub-36s.mp4`) stays as delivered.

## What v2 changes (the client's feedback)
"The connection with JongLeren must be clearer: it is a USP that the candidates already have internship work
experience through JongLeren. Bring JongLeren in literally, as a kind of verified partner." The idea: **qualified =
internship experience, verified by JongLeren** (`plan/v2-jongleren-nl.md`). Scene A still opens on its own.
- **B:** the graduates come out of a "JongLeren · Verified internship partner" card; on "qualified" the JongLeren
  alumni get the "JongLeren verified" badge, with the legend "Internship experience verified by JongLeren".
- **C:** a 4th filter "Verified partner · JongLeren" and a verified scan; the profile shows "Marketing internship,
  Málaga · via JongLeren" and the round VERIFIED PARTNER seal stamps onto it.
- **D:** the graduate's path: internship in Spain (JongLeren) → Talent Hub → career abroad; the employers' ranked
  matches carry the badge.
- **E:** under the wide logo and tagline, a "Verified talent partner" lockup with the JongLeren mark and wordmark.

## Two languages, one project
- `film/src/lang.ts` (`LANG`, `tx(en, nl)`): every on-screen string has both languages.
- `film/src/clock.ts` reads `words.json` (English) or `words_nl.json` (Dutch: the same labels on the Dutch words,
  built by `scripts/words_nl.py` from `vo_nl/`), so every scene, hand-off and sound cue retimes to the Dutch voice.
- The Dutch build is `work/NL` (`bash scripts/sync_nl.sh` copies `film/src` and sets `LANG = "nl"`); sound:
  `python3 scripts/cues.py nl` → `sound/cues_nl.json` → `film/public/audio/mix_nl.wav` (music `sound/bed_nl.wav`,
  fitted so the last hit lands on "Hub").
- QC: clipcheck on both drafts (EN moving 100%, typical change 6.1%; NL 100%, 6.2%; every phrase gets a new
  visual), then a four-lens review (JongLeren clarity and truth, Dutch copy and fit, continuity, sound sync) with an
  adversarial verify; its 20 confirmed findings are fixed.

# Talent Hub — "Your next connection starts here." (36.0 s, English, SaaS explainer)

A launch film for Talent Hub, a graduate-talent platform still in development (no website yet), so the film
animates a prototype of the platform described in `brand/requirements.pdf`.
- Brand: `brand/brandkit.pdf`.
- Script and voice-over: the client's ("Christina – Energetic Commercial American Female", 33.7 s).

## Delivery
`deliver/talenthub-36s.mp4`:
- 1920×1080, 30 fps, 36.0 s;
- H.264 High, BT.709;
- AAC 48 kHz, −15.2 LUFS.

## Brief, and how it is met
- **Logo:**
  - The square "th" mark is animated instead of writing "Talent Hub". It is traced to vector from the supplied
    logo (`brand/th.svg`), so the t and the h build separately.
  - The wide logo (`brand/talenthub-wide.svg`, also traced) is the call to action.
- **SaaS caption rhythm:** captions only on "Looking for qualified talent?", "All in one dashboard.",
  "Connect directly.", "For graduates", "For employers & recruiters" and the tagline. The other lines are told by
  the picture.
- **5% motion norm:** median 6.5% of the frame moving, measured on the final render. The motion is explanation:
  - a swirl of anonymous talent converging into the hub;
  - links from graduates through the hub to pins across Europe;
  - cards flowing out of the hub into a database;
  - filters dropping non-matches (1,248 → 312 → 86 → 12);
  - a credit unlocking a profile;
  - a line connecting employer and graduate;
  - a gateway opening onto opportunities abroad;
  - a scan ranking matches.
- **Bright:** Warm Ivory ground with soft red ripples, varied lightly (a rose field, red irises at the hand-offs).
- **Bridge to the JongLeren films:**
  - It shares their visual family: warm ivory with soft red ripple rings, bold left-aligned statements with the key
    word in red, white cards, red pills, a red dot and line as the thread, and full red colour-field moments.
  - It stands on its own and never mentions JongLeren. The brand kit itself presents Talent Hub as an evolution of
    it.

## Brand (brand kit)
- **Colour:** Talent Red #CF141E, Charcoal #191B20, Warm Ivory #FCF8F5, Soft Rose #FCE6E7, Cloud Gray #F0F0EF.
- **Type:** Lato (Black, Bold, Regular).
- **Logo rules:** the logo is never stretched, rotated, shadowed or recoloured; only red, or white on red.

## Truth (prototype, from the requirements)
- **Shown as described:**
  - The candidate pool is anonymised until a client unlocks a profile.
  - One credit unlocks one profile and reveals the contact details.
  - Clients are agency recruiters and direct employers who post vacancies.
  - Graduates complete a profile and apply.
- **Example data:** names, profiles, contact details (example.com), cities, counts and the credit balance.
- **Not shown:** no URL (there is no website yet), no prices.

## Sound
- **Music:** "Happy Times" by Alejandro Magaña (Mixkit Stock Music Free License, commercial use, no credit needed).
  The song's last hit lands on "Talent Hub".
- **Effects:** 88 UI sounds on the picture events: keys, pops, swooshes, filter clicks, the unlock and the message.

## Build
Remotion 4 (`film/`): five scenes on the voice-over's words (`src/scenes/`, `src/clock.ts`), with the kit in
`src/shared.tsx`.
```
cd films/talenthub/film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,270,540,810,1080 public/audio/mix.wav
```

## Checks on the final
- Every one of the 21 voice-over phrases brings a new visual.
- Something moves in 100% of frames.
- The longest still is 0.07 s.
