# Recruiting Rewards — "Hiring, simplified." (50.5 s, English)

A sales film for Recruiting Rewards (recruitingrewards.com), made from the client's script and the supplied ElevenLabs
voice-over ("Christina – Energetic Commercial American Female", 48.0 s). The brief:
- a SaaS look, with no gradients required;
- about the platform, explaining it and sales-driven: why companies and recruiters use it;
- visuals that match the script without writing the script out everywhere;
- the bright version of the site's style (the client first asked for the dark style, then switched to bright).

## Delivery
| File | What |
|---|---|
| `deliver/recruiting-rewards-50s.mp4` | The film. 1920×1080, 30 fps, 50.5 s, H.264 High, yuv420p, BT.709 TV range; AAC 48 kHz stereo at about −15 LUFS |

## The idea
*One window for the whole process.*
- The film opens on the scattered mess of hiring (emails, CV files, spreadsheets, an agency invoice), which gathers
  into one platform window on "simplified".
- From there it walks through the product the way the client's own demo does (companies page, "From ad to hire in
  under two minutes"):
  - describe the role, with criteria detected as you type;
  - set the reward, then publish;
  - recruiters take the job on, and candidates arrive with AI match scores;
  - compare, shortlist, message the recruiter, run the interview step, and move the candidate through the stages;
  - "is hired", and only then is the reward invoiced.
- The site's "For companies / For recruiters" switch flips to the recruiter's side: the marketplace, submitting a
  candidate, and the placement reward.
- The opening mess comes back and is pulled into the window on "No scattered inboxes", and the window folds into
  the logo.
- The UI is rebuilt at film scale from the client's own interface:
  - light stone and white, the site's green, the amber AI-score chips;
  - Lora for headings, Manrope for the UI;
  - the same screens and labels as the product demo.
- The only headlines are the hook and the three closing lines. Everything else is shown in the product.

## Phrase by phrase
| Time | Phrase | Visual event |
|---|---|---|
| 0.08 | Hiring, simplified. | Scattered emails, CVs and spreadsheets around "Hiring, simplified."; they gather into one point |
| 1.96 | One platform. | The platform window opens out of it (the candidate pipeline); "One place for the whole process" |
| 3.06 | More recruiters. | The site's five recruiters appear around the platform, connected to it |
| 4.18 | Better matches. | The AI match scores appear and count up (all 7.0 or higher); the best match lights up; "7/10 match score before a candidate reaches you" |
| 5.51 | Meet Recruiting Rewards. | The window folds into the logo; "The AI hiring marketplace" |
| 7.37 | Create a job. | The window opens on "Who do you want to hire today?"; the role is typed in one sentence |
| 8.48 | Add your requirements. | The criteria are detected one by one (6/7) |
| 9.75 | Set the reward. | Publishing and reward: the recommended 95 000 SEK is clicked; "Always free until the job starts" |
| 10.96 | Hit publish. | Publish is clicked: a "Published" confirmation rises ("Out to the marketplace after a quick quality check", the demo's line) |
| 12.20 | Your vacancy goes live, and recruiters get to work. | The vacancy grows out of the confirmation and goes Live; the recruiters (the site's five, and the demo's Arthur Berg) connect to it, "Working on it"; "Within days, candidates arrive" |
| 15.33 | As candidates arrive, | Candidates fly from the recruiters into the pipeline (Oskar from Arthur, his recruiter); the vacancy shrinks into the pipeline's job chip |
| 16.60 | see their profiles, match scores, and applications in one clear dashboard. | The profile panel: facts, then the AI match score and its bars, then the application; it closes onto the full dashboard |
| 21.61 | Compare candidates instantly. | Three candidates side by side; the best match is marked |
| 23.51 | Shortlist the best. | The star is clicked; the card flies into Shortlist |
| 25.08 | Message recruiters. | The chat with the recruiter, and the reply |
| 26.36 | Track interviews. | The interview step: rating, feedback, "Let the recruiter book for you", Send |
| 27.82 | Move candidates through each stage, without losing the overview. | The card moves to Interview, Tests, Reference check; the board pulls back and every stage's count lights up in turn |
| 31.34 | And when the perfect hire starts? That's when you pay. | Into Hired; "Congrats, Oskar Vinge is hired!" with the invoice breakdown; "Pay on results" |
| 34.42 | For recruiters? | The site's switch flips to "For recruiters"; the recruiter workspace |
| 35.51 | Explore relevant opportunities, | The marketplace; a hover runs down the list; the Sales filter picks the matching role |
| 37.39 | submit qualified talent, | The submit panel: the candidate ticks Interviewed and Screening answered on "qualified"; Submit is clicked on "talent" |
| 38.79 | and earn rewards for successful placements. | Earnings: the placement reward counts up; "70–80% of the reward is yours"; Paid on hire |
| 41.54 | No scattered inboxes. | The opening mess comes back and is pulled into the window |
| 43.08 | No upfront costs. | Upfront cost: 0 SEK; free to post, pay when the candidate starts; then "30–45% lower cost than an agency" as its own line |
| 44.51 | Just recruiting, redesigned. | The clean platform under the line |
| 46.64 | Recruiting Rewards. | The window folds into the logo; "Match right. Pay on results."; Start hiring; recruitingrewards.com |

## Sound
- **Voice-over:** the supplied file, in sync, with a gentle compressor on its peaks.
- **Music:** "Motivating Mornings" (Mixkit, 121 BPM), from the Mixkit Stock Music Free License, free for commercial
  use with no credit required. It is royalty-free, not public domain.
  - It is cut on its bar grid (`scripts/music_fit.py`), and the band's big entry lands on "Meet Recruiting Rewards"
    (5.51 s).
  - It plays at −23 LUFS and ducks under speech.
- **Effects:** 136 cues, each on its picture event (`scripts/cues.py`).
  - Real UI sounds: keys while typing, clicks where the cursor clicks, taps and soft pops on cards and chips, and
    swishes on the bigger moves.
  - Sources: Kenney "Interface Sounds" (CC0) and the studio's own generated sounds (shared with the Alumni film).

## Truth: what is on screen, and where it comes from
- **From the site and the client's product demo:**
  - The screens and their labels: "Who do you want to hire today?", "x/7 criteria detected" and the seven criteria,
    "Publishing and reward" with Base level / Recommended / Premium, "Candidate pipeline", the AI score chips, the
    interview step, "Congrats, … is hired!" with the invoice breakdown, and "Let the recruiter book for you".
  - The demo's example data: Nordvik Systems AB, "Account Executive, SaaS" in Stockholm, the reward amounts
    (71 250 / 95 000 / 118 750 SEK), and the candidate and recruiter names (two surnames shortened to fit the cards).
    Arthur Berg is the demo's recruiter; he is the one the company messages, so the chat puts no words in a real person's mouth.
  - The marketplace roles (Account Manager, Scale up CTO, Cloud Architect), the five recruiters and their photos
    (from the site's testimonials), and the "For companies / For recruiters" switch.
  - The facts:
    - "One place for the whole process";
    - "7/10 match score before a candidate reaches you";
    - "Candidates arrive within days";
    - "Always free until the job starts";
    - "30–45% lower cost than an agency";
    - "70–80% of the reward is yours";
    - "The AI hiring marketplace", "Match right. Pay on results.", "Start hiring".
- **Example content, shown as UI and not as claims:**
  - The clutter labels in the opening.
  - The chat messages and the interview feedback.
  - The score bars' labels.
  - The candidate facts ("Stockholm", "8 years B2B SaaS").
- **No customer logos, no hire counts** (the site's live counters change), and no promises beyond the site's own.

## Build
Remotion 4 (`film/`): `src/Story.tsx` is one continuous stage on the voice-over's words (`vo/words.json`: whisper word
times snapped to the pauses; `src/clock.ts`). `src/lib.tsx` holds the site's light-theme tokens and fonts.
```
cd films/recruiting
python3 scripts/music_fit.py sound/music/motivating-mornings.mp3 sound/bed.wav --length 50.5 --lift 5.51
python3 scripts/cues.py && python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
cd film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":4,"audio":"none"}' 0,380,760,1140,1515 public/audio/mix.wav
```

## Checks on the final
- Phrases: every phrase brings a new visual on its words (`phrase_check.py`).
- Shake: none (`jitter_check.py`); motion in every frame.
- Frame review: three independent reviews of the first final (layout, copy and truth, story and sales), each serious
  finding checked again by a skeptic at full resolution. Fixed from it:
  - The candidate names cut by the score chip.
  - The fact pills touching the frame edge, and the sidebar card's text overflowing.
  - The scores before "Better matches" (now all 7.0 or higher, appearing on the line).
  - The upfront card (no unsupported 25% figure; the agency comparison as its own line).
  - The Submit click, the switch's margin, a visible "overview", and the Sales filter.
  - One currency format, Oskar's facts against the brief, and the cursor moving off each label after its click.

## Assumptions
- 16:9, 50.5 s: the voice-over plus about 2.5 s on the end card.
- The script is used exactly as written.
