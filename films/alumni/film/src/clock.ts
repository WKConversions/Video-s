// The film's clock: beats on the voice-over's words (src/words.json, force-aligned; ../vo/).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, ask: "w:so-0.2", meet: "w:meet-0.15", connect: "w:connecting-0.15", start: "w:start-0.2", brings: "w:alumni2-0.15",
  grads: "w:for2-0.2", biz: "w:for3-0.2", agency: "w:and3-0.2", newc: "w:new2-0.15", sign: "w:alumni3-0.2", chapter: "w:your4-0.2",
  end: 39.0, ...WORDS,
});
