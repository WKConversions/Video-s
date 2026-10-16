// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import { LANG } from "./lang";
import EN from "./words.json";
import NL from "./words_nl.json"; // the Dutch voice-over: these labels on the Dutch words, plus "w:nl_<word>" (scripts/words_nl.py)
const WORDS: Record<string, number> = LANG === "nl" ? NL : EN;

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, meet: "w:meet-0.15", platform: "w:the-0.15", browse: "w:browse-0.2", dash: "w:all-0.15", filter: "w:filter-0.2",
  discover: "w:discover-0.2", unlock: "w:unlock-0.15", connect: "w:and2-0.1", grads: "w:for2-0.2", employers: "w:for3-0.2",
  brand: "w:talent4-0.2", cta: "w:your-0.15",
  // the four hand-offs between the scenes, tied to words so the Dutch version retimes with its voice-over
  s1: "w:the-0.31", s2: "w:filter-0.25", s3: "w:for2-0.27", s4: "w:talent4-0.28", end: "w:here+3.0", ...WORDS,
});
