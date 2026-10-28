// The ad's timing as labels (film seconds = voice-over seconds: the voice starts on frame 0, with the hook).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const DURATION = 1215; // 40.5 s

export const BEATS: Record<string, number | string> = {
  open: 0,
  slow: "w:scrolling-0.1",          // the feed slows: other people's lives
  plans: "w:putting-0.15",          // your plans slide up
  hold: "w:hold-0.05",              // ...and are put on hold
  timer: "w:five-0.1",              // 5 min
  hour: "w:hour-0.05",              // 1 hour
  empty: "w:and-0.05",              // the feed stops; what did you get out of it
  meet: "w:meet-0.1",               // Bingua blue floods the frame
  app: "w:the-0.05",                // the Bingua app
  useful: "w:something-0.1",
  map: "w:learning-0.15",           // the world lights up by language
  watch: "w:watch-0.2",
  words: "w:discover-0.05",
  convo: "w:understand-0.05",
  love: "w:all-0.05",
  diff: "w:but-0.1",                // But here's the difference.
  abroad: "w:next-0.1",             // Europe; the plane flies
  others: "w:not-0.15",             // watching others make memories
  talk: "w:youre4-0.05",            // starting conversations
  friends: "w:making-0.1",
  explore: "w:exploring-0.1",
  outside: "w:because-0.1",         // life happens outside your screen
  burst: "w:outside-0.1",           // the footage breaks out of the phone
  endcard: "w:bingua2-0.15",        // the end card
  rest: "w:connections+0.5",
  end: 40.5,
};

export const T = timeline(FPS, { ...(WORDS as Record<string, number>), ...BEATS });
