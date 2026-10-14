// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, few: "w:its-0.25", since: "w:since-0.3", gucci: "w:gucci-0.1", ind: "w:individuality-0.05", pres: "w:prestige-0.05", sty: "w:style-0.05",
  detail: "w:every-0.25", legacy: "w:every2-0.2", goods: "w:from-0.15", wear: "w:gucci2-0.15", presence: "w:it-0.15", crowd: "w:not-0.2",
  pause: "w:it2+0.35", brand: "w:gucci3-0.25", end: 35.4, ...WORDS,
});
