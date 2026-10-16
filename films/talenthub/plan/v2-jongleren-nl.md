# Talent Hub v2 — JongLeren as verified partner, and the Dutch version

## The client's ask (Karl, translated)
- "The connection with JongLeren must be clearer. It is a USP for the company that they have people who already have
  internship work experience through JongLeren. You can literally bring JongLeren in as a kind of verified partner;
  be creative with it."
- "Then, once that video is adjusted, I need the same video in Dutch" (Dutch VO by Vincent, vo_nl/vo.mp3, 37.3 s).
- This replaces the old rule "never mention JongLeren on screen". The film still opens on its own (A stays clean:
  no "coming from JongLeren"); JongLeren enters as the partner that verifies the candidates' internship experience.

## The idea: "qualified" = internship experience, verified by JongLeren
The candidates' qualification is made literal. JongLeren appears as Talent Hub's verified partner: a seal, a
badge, a filter, an experience line on the profile and a partner lockup on the end card. One idea, carried
through the film (the thread object for v2 is the **JongLeren verified badge**):
- **B, the network/database:** the graduates come in from a "JongLeren · Verified partner" source card on the
  left; on "qualified" each JongLeren alumnus card gets the "JongLeren verified" badge (`verified` on
  `CandidateCard`).
- **C, filter/profile:** the 4th filter "Verified partner · JongLeren" switches on with the qualifications; on the
  profile, the experience line "Marketing internship · JongLeren, Málaga" and the round VERIFIED PARTNER seal
  stamps onto the profile (the hero JongLeren moment).
- **D, graduates/employers:** the graduate's path reads internship (JongLeren, Spain) → Talent Hub → career abroad;
  the employers' ranked matches carry the badge.
- **E, end card:** under the wide logo and tagline, a partner lockup: "Verified talent partner" + the JongLeren mark
  and wordmark.

## Two languages, one project
- `src/lang.ts`: `LANG` ("en" | "nl") and `tx(en, nl)`; every on-screen string goes through `tx`.
- `src/clock.ts` takes `src/words.json` (English VO) or `src/words_nl.json` (Dutch VO) by `LANG`. The Dutch file
  places every English label ("w:graduates", "w:qualified2" …) on the matching Dutch word, in English word order
  (scripts/words_nl.py), and adds the Dutch words as "w:nl_<word>" for the Dutch captions.
- Scenes are timed only on labels (no frame numbers), so they retime with the voice.
- Hand-offs: s1 (A→B) "w:the-0.31", s2 (B→C) "w:filter-0.25", s3 (C→D) "w:for2-0.27", s4 (D→E) "w:talent4-0.28",
  end "w:here+3.0". EN frames 93 / 366 / 681 / 915 / 1080; NL 116 / 438 / 784 / 1030 / 1208.
