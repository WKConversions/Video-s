// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0,
  // the hand-offs between the scenes (plan/storyboard.md)
  s1: "w:motion-0.22",        // A → B (hook → problem): the ground alone
  s2: "w:meet-0.25",          // B → C (problem → solution): the ground alone
  sC: "w:launching-0.25",     // C → D (solution → use case), one builder
  s3: "w:watch-0.3",          // D → E (use case → showcase): the prompt box with the brief, alone
  sF: "w:refine-0.3",         // E → F (live → refine & export), one builder
  s4: "w:a4-0.3",             // F → G (showcase → outro): a gradient dot
  sH: "w:make2-0.3",          // G → H (outro → CTA), one builder
  end: "w:today+3.0",
  ...WORDS,
});
