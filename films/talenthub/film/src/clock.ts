// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, meet: "w:meet-0.15", platform: "w:the-0.15", browse: "w:browse-0.2", dash: "w:all-0.15", filter: "w:filter-0.2",
  discover: "w:discover-0.2", unlock: "w:unlock-0.15", connect: "w:and2-0.1", grads: "w:for2-0.2", employers: "w:for3-0.2",
  brand: "w:talent4-0.2", cta: "w:your-0.15",
  // the four hand-offs between the scenes
  s1: 3.1, s2: 12.2, s3: 22.7, s4: 30.5, end: 36.0, ...WORDS,
});
