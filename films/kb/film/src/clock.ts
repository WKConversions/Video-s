// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0,
  // the hand-offs between the scenes (plan/storyboard.md)
  s1: "w:first-0.3",          // A → B: the pipeline overview
  sB: "w:once-0.25",          // B → C: the structured summary card
  s2: "w:ai-0.3",             // C → D: the knowledge base core
  sD: "w:specialized-0.25",   // D → E: the four scored opportunities
  s3: "w:management-0.25",    // E → F: the overview, layers 1–5 done
  s4: "w:for-0.25",           // F → G: a navy dot
  s5: "w:every-0.25",         // G → H: a navy dot
  end: "w:decisions+4.1",
  ...WORDS,
});
