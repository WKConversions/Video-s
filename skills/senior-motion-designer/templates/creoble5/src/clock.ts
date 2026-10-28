// The film's clock: beats on the voice-over's words (src/words.json: word STARTS, from ../vo/ — whisper word times
// snapped to the pauses). Keys are the script's words lower-cased with æ ø å and other non-ASCII letters dropped
// ("færdig" → "w:frdig", "Én" → "w:n", "kø" → "w:k"); a repeated word gets a number ("w:ingen2").
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;          // the animation clock: g counts 30ths of a second (fractional at 60 fps)
export const OUT_FPS = 60;      // the render (version 3): 60 fps
export const T = timeline(FPS, {
  open: 0,
  // hand-offs between the five builders (plan/storyboard.md): the sage thread capsule whips across the centre
  h1: 10.05,                  // S1 → S2 (before "Det bedste?")
  h2: 17.05,                  // S2 → S3 (before "Tilfreds?")
  h3: 26.66,                  // S3 → S4 (before "Skal den på nettet?")
  h4: 39.22,                  // S4 → S5 (before "Brug for hjælp?")
  end: "w:dk+2.6",
  ...WORDS,
});
