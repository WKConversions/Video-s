// The globe ad's timing as labels (film seconds = voice-over seconds: the voice starts on frame 0, with the hook).
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const DURATION = 1395; // 46.5 s

export const BEATS: Record<string, number | string> = {
  open: 0,                          // frame 0: the globe is already spinning under a thumb
  sw2: "w:scroll-0.05",             // every scroll...
  sw3: "w:somewhere-0.2",           // ...takes you somewhere new
  meet: "w:meet-0.1",               // Bingua
  orbit: "w:your-0.1",              // a ring of languages orbits the world
  swipe: "w:swipe-0.15",            // one swipe: the globe spins to the first stop
  es: "w:first-0.1",                // zoom in on Spain
  esUp: "w:watch-0.3",              // a Spanish reel rises out of Spain
  esWords: "w:words-0.1",
  esDone: "w:naturally+0.2",
  fr: "w:now-0.05",                 // back into the pin, fly to France
  frUp: "w:new3-0.3",
  frDone: "w:discover2+0.35",
  jp: "w:next-0.1",
  jpUp: "w:understand-0.35",
  jpNext: "w:one2-0.05",            // one video at a time: swipe
  jpDone: "w:time2+0.1",
  br: "w:over-0.3",
  brUp: "w:learn2-0.2",
  brDone: "w:love+0.3",
  it: "w:and2-0.1",
  itUp: "w:another-0.35",
  itNext: "w:another3-0.1",
  itDone: "w:connection+0.3",
  five: "w:five-0.25",              // the five stops, connected
  endless: "w:endless-0.1",         // every other country lights up
  classroom: "w:with-0.1",          // the world inside the app
  endcard: "w:bingua3-0.2",
  spin: "w:scroll2-0.25",           // scroll the world
  rest: "w:languages3+0.6",
  end: 46.5,
};
export const T = timeline(FPS, { ...(WORDS as Record<string, number>), ...BEATS });
