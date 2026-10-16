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
