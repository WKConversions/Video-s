// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, meet: "w:meet-0.15", tell: "w:just-0.25", ai: "w:then-0.15", build: "w:in-0.2", change: "w:want-0.2", preview: "w:preview-0.2",
  happy: "w:happy-0.2", host: "w:need-0.2", nocode: "w:no-0.15", simple: "w:just4-0.2", brand: "w:creoble2-0.25", end: 35.6, ...WORDS,
});
