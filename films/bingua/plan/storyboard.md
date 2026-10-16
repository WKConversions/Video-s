# Bingua — storyboard and build contract (37.6 s, 16:9, 30 fps)

## Brief (the client's words)
"Make another video for https://bingua.app/. This time not showing the platform, but try to explain what it is and what it's good for using visuals. So not constantly a phone in screen, but explanation through other UI animations or visual animations, what it does and what it helps. Keep it in the bright style of the website, and make it SaaS style — with SaaS style I mean more the animations, ways of explaining and less the gradient part. I want the colour style of their website."

So:
- **Explain with visuals.** Use UI pieces, real video cards, diagrams, counters and kinetic type. Show a phone at most once, briefly.
- **Bright, flat, the site's colours.** No gradients except soft shadows.
- **SaaS-crisp motion.** Snappy ease-outs, UI that responds (taps, pops, toggles, counters), objects that become the next thing.
- **Every phrase gets its own visual,** on its key word.

## Look (src/lib.tsx tokens, measured on bingua.app)
- **Ground:** flat #F2F2F7 (the site's iOS light grey), drawn by Story.tsx. Don't draw your own full-frame background.
- **Surfaces:** white cards (`CARD`: radius 24, hairline, soft shadow).
- **Colour:**
  - Text is black #000 / #1C1C1E with secondary gray #6B6B70.
  - **Accent:** sky blue #2FAFEE (`C.sky`), with link blue #0A649A (`C.skyDeep`) and tint #E4F3FC (`C.skyTint`).
  - **Logo tile:** navy #0F1A29.
  - The app's own UI colours are allowed inside UI only: adjective tag green, Forgot red tint, Got it green tint, streak flame #F59E0B.
- **Type:**
  - Inter only. Statements are 700 with tight tracking: 110–150 px when alone, 64–84 px over a picture.
  - UI text in focus is at least 26 px on screen.
- **Motion:** ARRIVE for entrances, MOVE for carries, SNAP for UI pops. Nothing elastic or cheesy. Fast moves get motion blur in the final render.

## Kit (src/shared.tsx)
- **Timing:** `k(g, at, dur, ease)` and `f(at)` (labels and words, e.g. "w:save+0.1"), `typed`.
- **Transitions:** `Feed` and `feedY` (the swipe between scenes).
- **Type and brand:** `Say` (word build), `Logo` (play/bars build props), `Wordmark`.
- **Icons:** `Ico`: play, plus, check, x, heart, bookmark, speaker, cards, quiz, home, bolt, flame, arrow, swipe, mic, keyboard, headphones, match, list, book, pencil, chart, gauge, clock, globe, chat, translate.
- **Surfaces and video:** `CARD` style; `VideoCard` (clip v1–v7, w, h, from) plays real footage. Clips are 8 s long, so keep one card on screen under 8 s minus from.
- **App UI:** `Line` (dual-language transcript line with active tint and mark), `SaveBtn`, `WordPop`, `Flashcard` (flip), `Tap` (finger tap ring), `Chip`.
- **3D and phone:** `Plane` (3D), `Phone` (sparingly).
- **Example content:** `LANGS` (6 languages with a greeting), `LINES` (Spanish lines from the app with English), `WORD` (ocupado / busy / ADJECTIVE), `CARDS`.

**Clips:**
- v1: woman talking with a friend (close-up).
- v2: friends at a coffee shop.
- v3: influencer talking to camera.
- v4: woman talking to camera.
- v5: woman eating street food.
- v6: women chatting in a cafeteria.
- v7: youtuber vlogging.

Never edit shared.tsx, lib.tsx, Story.tsx, clock.ts or other scenes. Write local helpers in your scene file.

## Facts allowed (bingua.app)
- Real videos by native speakers, with dual-language transcripts that keep pace with the speech.
- Tap any word for its translation, its word class and a plain-English note. Swipe a line for a breakdown of the whole sentence.
- "+ Save" saves a word or sentence to your cards in one tap. The Cards tab shows a count.
- Saved words become flashcards that come back right when you're about to forget them (spaced repetition): Forgot / Got it.
- Quizzes are built from your own cards: listening, typing, matching, saying words out loud into the mic.
- Six languages: Spanish, French, German, Dutch, Italian, Portuguese.
- The app shows XP today, a daily goal and a streak, and a 1.00x playback speed control.
- "Learn languages by scrolling." "No lesson screen." "No switching apps. No dictionary tab."
- Available on the App Store (iPhone). Website bingua.app.

Not allowed:
- user counts, ratings, levels or certificates;
- invented numbers presented as claims (UI counters like "Words saved 86" are example UI and fine);
- any other app's branding.

## Words (seconds; use them as "w:…" labels)
- **Hook and meet:** turn .07, scrolling .28, into .84, learning 1.36 | meet 2.43, bingua 2.64.
- **Real videos:** learn 3.75, languages 3.92, through 4.4, real 4.76, videos 5.12, and 5.52, everyday 5.86, conversations 6.28.
- **Translations:** follow 7.72, along 7.88, with 8.24, translations 8.4, that 8.88, make 9.32, unfamiliar 9.48, words 10.0, and2 10.5, sentences 10.7, easy 11.14, to 11.68, understand 11.84.
- **Save:** see 12.96, a 13.14, word 13.26, you 13.42, want 13.56, to2 13.7, remember 13.82 | save 14.63, it 14.88, instantly 15.02.
- **Cards and quizzes:** bingua2 16.07, turns 16.3, your 16.66, discoveries 16.82, into2 17.28, smart 17.64, flashcards 18.04, and3 18.62, quizzes 18.78 | helping 19.53, new 19.74, vocabulary 20.06, stick 20.54.
- **No lists:** no 21.61, endless 21.86, word2 22.18, lists 22.5 | no2 23.18, repetitive 23.44, textbook 23.98, exercises 24.44.
- **Benefits:** just 25.76, content 25.9, you2 26.26, enjoy 26.46 | a2 27.26, growing 27.36, vocabulary2 27.64 | and4 28.22, more 28.73, confidence 29.1, with2 29.54, every 30.05, video 30.26 | at 31.11, your2 31.2, own 31.34, pace 31.52.
- **End:** bingua3 32.55 | learn2 33.43, languages2 33.62, by 34.04, scrolling2 34.46. End 37.6.

## The feed swipe (the film's transition family)
The film scrolls between its scenes like the app's feed.
- **Swipe labels:** s1 3.30, s2 12.50, s3 21.15, s4 31.85.
- At each one, the outgoing scene's content scrolls up and away while the incoming scene scrolls up into place (0.45 s, MOVE). Wrap your whole scene in `<Feed g={g} in="sX" out="sY">`, so both move together.
- Inside a scene, use other moves: carries, morphs, pops, 3D turns.
- A scene may also do its own internal feed scroll where it fits the meaning (for example the hook's video feed).

## Scenes
### A: 0.00–3.80 (`<Feed out="s1">`). "Turn scrolling into learning." / "Meet Bingua."
- **0.0–1.9:**
  - A vertical feed of three playing `VideoCard`s in a column (around 430×765, right of centre, x≈1300) is scrolled up by a thumb flick on "turn" and again on "scrolling". Each card snaps into place, with a small finger swipe trail beside it.
  - The statement "Turn scrolling / into learning." builds on the left (left-aligned, around 120 px, "learning." in sky).
  - On "learning" (1.36), the current card shows a white caption pill near its bottom ("¿Qué está ocurriendo?"). The word "ocurriendo" lights up sky and pops out as a small chip "ocurriendo → happening".
- **1.9–2.4:** the statement leaves. The video card shrinks and morphs into the navy logo tile at the centre (radius grows, video fades to navy). The video becomes the logo.
- **2.43 "Meet Bingua.":**
  - The `Logo` builds: the play triangle pops, then the white and the sky subtitle bars draw. Logo around 200 px.
  - "Bingua" (`Wordmark`, around 150 px) slides out from behind the logo to its right, so the group is centred.
  - "Meet" is small and gray above it, or omitted.
- **3.30:** feed swipe out.

### B: 3.25–12.95 (`<Feed in="s1" out="s2">`). Languages, real videos, conversations, translations
- **3.75 "Learn languages":** six greeting bubbles pop in a loose ring, staggered on "learn" and "languages": ¡Hola! Salut ! Hallo! Hoi! Ciao! Olá!, each with a tiny language label (Spanish, French…).
- **4.76 "real videos":** a row of 5 playing video cards slides in (a horizontal feed, slow drift) and the bubbles attach to them.
- **5.86 "everyday conversations":** speech bubbles pop from the people in the videos with everyday lines in different languages ("¿Qué tal?", "On y va ?", "Lekker!", "Andiamo!", "Tudo bem?").
- **7.72 "Follow along":**
  - One card (v3) comes forward to the left (around 470×835). The others fall away.
  - Beside it, a white transcript card holds 3–4 `Line`s. The active line advances in sync (a word-by-word karaoke sweep).
- **8.40 "with translations":** the English translations slide in under each line.
- **9.48 "unfamiliar words":** a `Tap` on "ocupado" in the active line, and the `WordPop` (ocupado · busy · ADJECTIVE) pops out beside it.
- **10.70 "and sentences":** the line slides sideways (a swipe icon) and a sentence breakdown card shows the chunks linked to their meanings:
  - "No moleste" → "Don't bother me"
  - "no ve que" → "can't you see"
  - "estoy ocupado" → "I'm busy"
- **11.14 "easy to understand":** the chunks click into one clear English sentence, with a small check.
- **12.50:** feed swipe out.

### C: 12.45–21.60 (`<Feed in="s2" out="s3">`). Save a word, flashcards and quizzes, it sticks
- **12.96 "See a word you want to remember?":**
  - A large transcript line (around 60 px) floats centre: "O sea, trae lechuga para cinco familias, tío." with the translation under it.
  - On "word" (13.26), "lechuga" gets the sky mark. On "remember" (13.82) it lifts slightly out of the line.
- **14.63 "Save it instantly.":**
  - A "+ Save" pill sits next to the word and is tapped on "save". It turns to "✓ Saved".
  - On "instantly" (15.02) the word flies in an arc into a Cards stack icon at the right, whose red badge counts 14 → 15 with a pop.
- **16.07 "Bingua turns your discoveries":** several saved word chips (ocupado, grandes, lechuga, la noche) gather from the edges toward the centre.
- **17.64 "into smart flashcards":** the chips become `Flashcard`s that stack and fan. One flips (word → translation and its line), with Forgot / Got it buttons under it.
- **18.78 "and quizzes":** four quiz tiles fan out: Listening (headphones), Typing (keyboard), Matching (match), Speaking (mic). A multiple-choice question "ocupado = ?" shows busy ✓.
- **19.53 "helping new vocabulary stick":**
  - A clean SaaS chart: a memory curve decays over time. Each review (a card dot on the curve, "review" ticks) bumps it back up, and each decay gets flatter.
  - A small caption: "Cards come back right before you'd forget them".
  - On "stick" (20.54) the curve settles high and a word card snaps onto it with a check.
- **21.15:** feed swipe out.

### D: 21.10–32.30 (`<Feed in="s3" out="s4">`). What it replaces, and what you get
- **21.61 "No endless word lists.":**
  - "No endless word lists." builds big.
  - Beside it, a boring grey vocabulary list ("el perro – the dog", "la mesa – the table" …) scrolls endlessly fast.
  - On "lists" (22.5) it freezes and is struck through, then collapses.
- **23.18 "No repetitive textbook exercises.":**
  - Line 2 builds.
  - A textbook worksheet ("Exercise 14B · Fill in the blanks", blanks and lines) multiplies into a repetitive stack.
  - On "exercises" (24.44) the stack is crossed out and folds away.
- **25.76 "Just content you enjoy,":** the statements clear. A bright row of playing video cards (cooking, café chats, vlogs) scrolls in, and a heart pops on one (tap).
- **27.26 "a growing vocabulary,":** a "Words saved" counter climbs (12 → 86) while saved-word chips pile up and grow into a neat little word cloud, or a bar chart grows.
- **28.73 "and more confidence with every video,":**
  - Small video thumbnails pass one by one on a track. Each one fills a step of a progress bar like the app's: "⚡ 82 XP today · Goal 100".
  - The streak flame counts up, and on "every video" the goal completes with a check.
  - (Use "confidence" as a big word in the line, not as a fake metric.)
- **31.11 "at your own pace.":** the app's playback-speed chip ("1.00x") toggles 0.75x → 1.00x → 1.25x with a smooth dial. The line "at your own pace." builds.
- **31.85:** feed swipe out.

### E: 31.80–37.60 (`<Feed in="s4">`). "Bingua. Learn languages by scrolling."
- **32.55 "Bingua.":** the logo builds at centre, as in A (triangle pops, bars draw), and the wordmark slides out. Mirror scene A's lockup.
- **33.43 "Learn languages by scrolling.":**
  - The tagline builds under it (around 72 px, "scrolling." in sky).
  - Then a row of six small language chips and a "bingua.app" pill with "On the App Store" fade up underneath (no Apple logo).
- **To 37.6:** a slow push (2–3%), with something gently alive (for example the chips drifting, or the logo's subtitle bars pulsing once). The last ~1.5 s is the end card.

## Workflow (each builder)
- Work only in your folder: /home/user/Video-s/films/bingua/work/<id>/ (a full project copy). Edit only your scene file(s).
- Test frames: `node stills.mjs <frames> 1` → out/test/fNNNN.png. Batch the frames, then Read them.
- Draft: `bash ../../scripts/draft.sh <first> <last> out/draft.mp4`, then `python3 ../../scripts/clipcheck.py out/draft.mp4 <first>`.
- Targets:
  - moving in 95%+ of frames;
  - typical change 2.5%+;
  - longest still 0.4 s (scene E's end card excepted);
  - every phrase "ok";
  - no text collisions;
  - `npx tsc --noEmit` clean.
- Keep CSS blur filters small (12 px or less). A frame should render in under about 1.5 s.
