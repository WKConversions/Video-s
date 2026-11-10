// The film's clock (v6). Beats sit on the voice-over's words: src/words.json holds word STARTS in film seconds from
// ../vo/pace.py (the v5 take, paced: silence added between sentences, 65.2 s film). Keys are the script's words
// lower-cased with æ ø å and other non-ASCII letters dropped ("færdig" → "w:frdig", "Én" → "w:n", "kø" → "w:k",
// "Domæne" → "w:domne", "e-mail" → "w:email"); a repeated word gets a number ("w:ingen2", "w:creoble3").
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;          // the animation clock: g counts 30ths of a second (fractional at 60 fps)
export const OUT_FPS = 60;      // the render: 60 fps
export const T = timeline(FPS, {
  open: 0,
  // scene starts (plan/contract.md), for orientation; builders key their moves to the words
  sc2: 5.5, sc3: 8.8, sc4: 13.6, sc5: 21.9, sc6: 32.4, sc7: 37.92, sc8: 46.4, sc9: 52.4,
  // hand-offs between the three builders: both sides draw the kit's Handoff1 / Handoff2 inside ±0.3 s of these
  h1: 13.6,                   // A → B: the finished Holm site, far and soft, no type on screen
  h2: 37.92,                  // B → C: the hosting card, its price in view
  end: "w:dk+3.2",            // 65.18 s
  ...WORDS,
});
