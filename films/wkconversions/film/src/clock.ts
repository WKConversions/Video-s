// The film's timing as labels (seconds), relative to the voice-over's force-aligned words (src/words.json). Each beat
// label leads its spoken word by about 0.13 s, so the picture lands with the word, not after it.
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 1380;                 // 46.0 s: the voice-over (44.2 s) and the end card
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
export const BEATS: Record<string, number> = {
  open: 0,
  // P1–P5: you and the competitor; the same offer; they communicate it better
  youTag: 0.06, compTag: 1.34, standout: 1.95, offer: 3.68, equal: 4.17, comm: 5.68, better2: 6.61,
  // P6–P10: most businesses lose attention
  most: 7.56, lose: 8.45, unclear: 9.6, forget: 10.7, visuals: 11.3, content: 12.3, cursor: 12.95, reason: 13.9, act: 14.3,
  // P11–P19: WKConversions comes in; the offer made clear; attention, value, conversion
  turn: 15.34, brand: 16.06, comes: 17.2, complex: 18.73, offers: 19.35, clear: 20.05, perf: 20.73, motion: 21.59,
  attract: 22.6, explain: 24.23, value: 24.75, drive: 25.52, conv: 25.9,
  // P20–P23: the process
  goal: 27.18, goalHit: 27.86, sharpen: 28.52, concept: 29.9, frames: 30.85, every: 31.56, purpose: 32.5,
  // P24–P26: no random animations, no visuals just to look good
  random: 33.6, strike1: 34.72, novis: 34.98, visuals2: 35.42, just: 36.03, sweep: 36.5,
  // P27–P33: the sign-off
  fin: 37.55, creative: 39.16, standout2: 39.8, designed: 41.2, move: 41.75, built3: 42.6, convert: 43.3, endcard: 44.2,
  // captions leave as one block before the next line arrives
  capOut1: 3.0, capOut2: 7.45, capOut3: 10.66, capOut4: 15.22, capOut5: 18.28, capOut6: 22.52, capOut7: 27.08, capOut8: 33.5,
  capOut9: 37.42, capOut10: 41.15, capOut11: 44.05,
  rest: 44.4, end: 46.0,
};
export const T = timeline(FPS, { ...WORDS, ...BEATS });
