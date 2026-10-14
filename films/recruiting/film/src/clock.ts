// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, meet: "w:meet-0.1", create: "w:create-0.45", live: "w:your2-0.1", arrive: "w:as-0.1", see: "w:see-0.1", compare: "w:compare-0.15",
  short: "w:shortlist-0.1", msg: "w:message-0.15", track: "w:track-0.1", move: "w:move-0.1", hire: "w:and3-0.1", rec: "w:for-0.15",
  inbox: "w:no-0.25", upfront: "w:no2-0.15", just: "w:just-0.15", end_: "w:recruiting3-0.2", end: 50.5, ...WORDS,
});
