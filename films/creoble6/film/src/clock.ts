// The film's clock (v6). Beats sit on the voice-over's words: src/words.json holds word STARTS in film seconds from
// ../vo/pace.py (Karl's Christina take of 10 Nov, with a little air between scenes: 65.2 s film; see ../vo/words.txt). Keys are the script's words
// lower-cased with æ ø å and other non-ASCII letters dropped ("færdig" → "w:frdig", "Én" → "w:n", "kø" → "w:k",
// "Domæne" → "w:domne", "e-mail" → "w:email"); a repeated word gets a number ("w:ingen2", "w:creoble3").
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;          // the animation clock: g counts 30ths of a second (fractional at 60 fps)
export const OUT_FPS = 60;      // the render: 60 fps
export const T = timeline(FPS, {
  open: 0,
  // hand-offs between the three builders: both sides draw the kit's Handoff1 / Handoff2 inside ±0.3 s of these
  h1: 20.5,                   // A → B: the finished Holm site, whole and sharp
  h2: 44.65,                  // B → C: the hosting card, all rows Aktiv
  end: 65.2,
  ...WORDS,
});
