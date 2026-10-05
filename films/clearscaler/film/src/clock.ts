// The film's timing as labels (seconds). Silent film: the captions are the narration; their words are labels too
// ("w:offer"), at 0.14 s a word from each caption's start, and src/words.json mirrors them for scripts/phrase_check.py.
import { timeline } from "./timeline";
import CAPS from "./captions.json";

export const FPS = 30;
export const DURATION = 1200;
export const WORD_STEP = 0.12;
export type Caption = { id: string; at: number; out: number; lines: string[]; key: string[]; sub?: string };
export const CAPTIONS = CAPS as Caption[];

export const BEATS: Record<string, number> = {
  open: 0, offer: 0.17, dist: 2.57,
  scan: 4.8, chip: 5.0,
  score: 7.5, hold: 8.0, sofia: 8.7, card: 8.9, bars: 9.2, merge: 10.0,
  reason: 10.85, reason2: 11.35,
  draft: 12.6, subject: 12.9, generic: 13.15, strike: 14.0, personal: 14.3, ask: 15.5, qc: 15.6,
  approve: 16.4, cursor: 16.7, click: 17.3,
  fold: 18.3, send: 18.85, arrive: 19.95, more: 20.3,
  replies: 22.2, marta: 23.1, bubble: 24.3, answer: 24.9,
  week: 26.0, fly: 26.3, booked: 26.75, weekOut: 27.9,
  pull: 28.0, loopOn: 29.4, stat: 31.2, turn: 34.6, word: 35.4, line: 36.0, sub: 36.7, cta: 37.2, faces: 37.5, rest: 37.8, end: 40,
};

const words: Record<string, number> = {};
const seen: Record<string, number> = {};
for (const c of CAPTIONS) {
  let i = 0;
  for (const ln of [...c.lines, ...(c.sub ? [c.sub] : [])]) for (const w of ln.split(" ")) {
    const base = "w:" + w.toLowerCase().replace(/[^a-z0-9]/g, "");
    const n = (seen[base] = (seen[base] ?? 0) + 1);
    words[n > 1 ? base + n : base] = +(c.at + i * WORD_STEP).toFixed(3);
    i++;
  }
}
export const WORDS = words;
export const T = timeline(FPS, { ...BEATS, ...WORDS });
