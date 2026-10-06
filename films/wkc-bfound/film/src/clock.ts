// The film's timing as labels (seconds), relative to the voice-over's force-aligned words (src/words.json). Each beat
// label leads its spoken word by about 0.13 s, so the picture lands with the word.
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 1185;                 // 39.5 s: the voice-over (36.6 s) and the end card
type Wd = { word: string; start: number; end: number };
export const VO = WORDS_JSON as Wd[];
const words: Record<string, number> = {};
const seen: Record<string, number> = {};
for (const w of VO) {
  const base = "w:" + w.word.toLowerCase().replace(/[^a-z0-9]/g, "");
  const n = (seen[base] = (seen[base] ?? 0) + 1);
  words[n > 1 ? base + n : base] = w.start;
}
export const WORDS = words;
/** The spoken letters of the code, B F O U N D 5 0 (vo/align.txt), each typed as it is said. */
export const CODE_TIMES = [24.80, 25.09, 25.40, 25.66, 25.93, 26.15, 26.40, 26.84];
export const BEATS: Record<string, number> = {
  open: 0,
  // P1–P2: a great partnership, more than great work
  tiles: 0.0, link: 0.3, more: 1.47, work: 2.07,
  // P3–P4: WKConversions made a motion design video for bFound
  maker: 3.24, make: 4.62, motion: 5.07, deliver: 6.35,
  // P5–P7: the response
  response: 7.39, shows: 8.02, impact: 8.93, right: 9.52, can: 10.58,
  // P8–P12: €1,000 per video, out of reach
  price: 11.62, thousand: 13.43, per: 14.81, pro: 15.65, lock: 16.53, many: 18.16,
  // P13–P15: WKConversions and bFound change that
  wkc: 19.82, bf: 21.35, change: 22.11, unlock: 22.64,
  // P16–P18: the code
  field: 23.89, half: 27.44, four: 28.69, startup: 29.66,
  // P19–P21: claim it on wkconversions.com/contact
  visit: 31.09, dot: 32.45, claim: 34.02, two: 35.23,
  endcard: 36.75, end: 39.5,
};
export const T = timeline(FPS, { ...WORDS, ...BEATS });
