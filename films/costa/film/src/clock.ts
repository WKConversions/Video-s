// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, q: "w:waarom-0.2", cc: "w:met-0.15", svc: "w:van-0.15", face: "w:wij-0.15", tell: "w:jij-0.2", contact: "w:wij2-0.1",
  table: "w:schuiven-0.1", upd: "w:en3-0.1", geen: "w:geen-0.2", korte: "w:korte-0.2", twee: "w:twee-0.2", sign: "w:costa2-0.2",
  cta: "w:klaar-0.2", end: 37.5, ...WORDS,
});
