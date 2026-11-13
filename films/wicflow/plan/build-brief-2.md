# Wicflow film, round 2: Karl's notes on the first preview (13 Nov)

Read `plan/build-brief.md` first (the engine, the contract, the voice-over timing, the seams, how to check). It all
still holds, except where this file changes it. The film is already built and plays end to end: you are REVISING
the beat files you own, not starting over. Read your current beat files before you change them.

Karl's notes (his words, translated):
1. "I want a more SaaS-like intro. Now the intro is just a UI. I want a SaaS-like type-on with a gradient over the
   keywords, text… It has to be more SaaS-like in the intro."
2. "The hook text needs to be a creative transition into whatever you want to visualise with UI. Don't drop UIs
   around the text."
3. "And through the whole video I want more Apple-style bouncy animation."
4. (sound, handled by the lead) Apple keyboard typing under the hook's type-on.

## Apple-style bounce (everyone)

`src/engine/anim.js` now has real springs: `spring`, `springTo`, `bounceIn`, `squash` and the presets `BOUNCY`
(about 13% overshoot), `SNAPPY` (about 9%, quicker) and `SOFT` (read its header). Use them so the film feels like an
Apple product film: things don't just fade or slide in, they POP in with a visible, springy overshoot and settle.
- Every element that appears (a card, a chip, a tile, a tag, a label, a check, a stud, a button, a pulse dot):
  `bounceIn` (scale from about 0.6–0.85 through the overshoot to 1, plus a small rise), staggered 0.04–0.08 s
  when several arrive together, so they cascade.
- Every object that travels or lands (a row re-ranking, a card sliding in, a block rising, a document landing):
  `springTo` with BOUNCY or SNAPPY, and a `squash` on landing where it has weight (a block, a card).
- Every UI reaction (a button press, a toggle, a ring filling, a check): a press-in and a springy release.
- Increase the overshoot of the existing `pop` calls on objects (small things 0.12–0.18, cards and blocks
  0.06–0.1).
- The CAMERA stays smooth: whole-frame or whole-world zooms and pans keep `E` (inOut / smooth), no bounce, so
  nothing shakes. Only objects bounce.
- Never make it jittery: one spring per object at a time, no stacked wobbles, no bounce on text that is being read
  (a headline may pop in once, then holds still).
- The seams in build-brief.md must still match EXACTLY at their times: any spring that is still moving near a seam
  must be forced to its final value before it (as B4 already does with popF). Re-check every seam you own.

## The text budget changes for the hook only

Karl now wants type-on text in the intro (B1): the three voice-over lines may be typed on screen there. Everywhere
else the budget is unchanged (B5 label, B8 label, B9 lockup; small UI text only).

## How to report

Same as before: what changed per beat (main events and times), HAND keys if any, the seams you checked, the
flow.py result. Builder A: also export `TYPING` from B1.js: an array of `[start, end]` film-second pairs, one per
type-on run, so the lead can lay the keyboard sound exactly under it.
