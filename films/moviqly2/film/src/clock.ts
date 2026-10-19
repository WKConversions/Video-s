// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  open: 0,
  // scene starts (plan/storyboard.md); h1–h4 are the hand-offs between builders (exact frame states in shared.tsx)
  sB: "w:ask-0.3",            // A → B   (builder 1)
  sC: "w:moviqly-0.3",        // B → C   (builder 1)
  h1: "w:it-0.3",             // C → D   hand-off 1: the draft tile, centred (Handoff1)
  sE: "w:it2-0.3",            // D → E   (builder 2)
  sF: "w:your3-0.3",          // E → F   (builder 2)
  h2: "w:every-0.3",          // F → G   hand-off 2: the storyboard card on the left (Handoff2)
  sH: "w:moviqly2-0.3",       // G → H   (builder 3)
  h3: "w:your5-0.3",          // H → I   hand-off 3: the reviewed frame at the studio's canvas rect (Handoff3)
  sJ: "w:type-0.3",           // I → J   (builder 4)
  sK: "w:switch-0.3",         // J → K   (builder 4)
  sL: "w:click-0.3",          // K → L   (builder 4)
  h4: "w:every2-0.3",         // L → M   hand-off 4: the studio, final state (Handoff4)
  sN: "w:describe-0.3",       // M → N   (builder 3)
  end: "w:moviqly3+2.2",
  ...WORDS,
});
