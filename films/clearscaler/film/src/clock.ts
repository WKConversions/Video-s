// The film's timing as labels (seconds). Silent film: the captions are the narration; their words are labels too
// ("w:offer"), at 0.14 s a word from each caption's start, and src/words.json mirrors them for scripts/phrase_check.py.
import { timeline } from "./timeline";
import CAPS from "./captions.json";

export const FPS = 30;
export const DURATION = 1200;
export const WORD_STEP = 0.14;
export type Caption = { id: string; at: number; out: number; lines: string[]; key: string[]; note?: string };
export const CAPTIONS = CAPS as Caption[];

export const BEATS: Record<string, number> = {
  open: 0, offer: 1.15, reach: 3.82,
  scan: 6.0, chip: 6.3,
  score: 9.0, hold: 9.7, sofia: 10.2, card: 10.4, bars: 10.7, merge: 11.6,
  reason: 12.8, reason2: 13.4,
  draft: 14.5, generic: 15.2, strike: 16.0, personal: 16.3,
  approve: 17.7, cursor: 18.0, click: 18.6,
  fold: 19.2, send: 19.62, arrive: 20.8, more: 21.0,
  replies: 22.3, marta: 23.6, answer: 25.3, week: 26.1, booked: 26.75,
  weekOut: 28.0, pull: 28.3, summary: 28.6,
  stat: 30.9, turn: 34.2, word: 35.0, line: 35.8, cta: 36.9, faces: 37.2, rest: 37.6, end: 40,
};

const words: Record<string, number> = {};
const seen: Record<string, number> = {};
for (const c of CAPTIONS) {
  let i = 0;
  for (const ln of c.lines) for (const w of ln.split(" ")) {
    const base = "w:" + w.toLowerCase().replace(/[^a-z0-9]/g, "");
    const n = (seen[base] = (seen[base] ?? 0) + 1);
    words[n > 1 ? base + n : base] = +(c.at + i * WORD_STEP).toFixed(3);
    i++;
  }
}
export const WORDS = words;
export const T = timeline(FPS, { ...BEATS, ...WORDS });
