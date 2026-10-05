// The film's timing as labels: beats in seconds, plus every word of the voice-over (src/words.json).
// Retiming to a recorded voice means replacing words.json and moving the beat labels; every move follows.
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const BEATS: Record<string, number> = {
  hook: 0,        // A business is only as strong as the structure behind it.
  name: 3.45,     // I'm Robin Bos.
  what: 4.6,      // I build businesses around people, process and technology.
  kb: 8.5,        // I co-founded K.B Consultancy in 2024.
  val: 12.5,      // Eighteen months later: a two-million-euro valuation.
  proof: 16.0,    // Twenty-five client projects. A hundred automations. A team that's all in.
  advise: 20.6,   // Today I advise founders on strategy, leadership, growth and capital.
  cta: 25.3,      // If you're building something that needs structure, let's talk.
  rest: 27.4,     // the camera's drift settles; one slow push to the end
  end: 30,
};
export const T = timeline(30, { ...BEATS, ...(WORDS as Record<string, number>) });
export const FPS = 30;
