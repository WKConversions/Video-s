// The film's clock: beats on the voice-over's words (src/words.json, from ../vo/: whisper word times snapped to the pauses).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0, meet: "w:meet-0.15", videos: "w:learn-0.2", follow: "w:follow-0.2", see: "w:see-0.2", save: "w:save-0.15",
  cards: "w:bingua2-0.2", stick: "w:helping-0.15", nolist: "w:no-0.15", notext: "w:no2-0.15", enjoy: "w:just-0.2",
  grow: "w:a2-0.1", conf: "w:more-0.2", pace: "w:at-0.15", brand: "w:bingua3-0.2",
  // the four feed swipes between the scenes (the film scrolls like the app)
  s1: 3.3, s2: 12.5, s3: 21.15, s4: 31.85, end: 37.6, ...WORDS,
});
