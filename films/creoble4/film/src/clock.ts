// The film's clock: beats on the voice-over's words (src/words.json: word STARTS, from ../vo/ — whisper word times
// snapped to the pauses). Keys are the script's words lower-cased with æ ø å and other non-ASCII letters dropped
// ("færdig" → "w:frdig", "Én" → "w:n", "kø" → "w:k"); a repeated word gets a number ("w:ingen2").
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;          // the animation clock: g counts 30ths of a second (fractional at 60 fps)
export const OUT_FPS = 60;      // the render (version 3): 60 fps
export const T = timeline(FPS, {
  open: 0,
  // hand-offs between the five builders (plan/storyboard.md; exact frame states in shared.tsx)
  h1: "w:det-0.25",           // B1 → B2: the site at home, preview, no booking button  ("Det bedste?")
  h2: "w:tilfreds-0.25",      // B2 → B3: the site at home, with the "Book tid" button   ("Tilfreds?")
  h3: "w:skal-0.3",           // B3 → B4: the same                                       ("Skal den på nettet?")
  h4: "w:brug-0.3",           // B4 → B5: the site at home, live on holmfysio.dk         ("Brug for hjælp?")
  end: "w:dk+2.6",
  ...WORDS,
});
