// The film's timing as labels (seconds). Silent film: the captions are the narration; their words are labels too
// ("w:offer"), at 0.14 s a word from each caption's start, and src/words.json mirrors them for scripts/phrase_check.py.
import { timeline } from "./timeline";
import CAPS from "./captions.json";

export const FPS = 30;
export const DURATION = 1005;
export const WORD_STEP = 0.12;
export type Caption = { id: string; at: number; out: number; lines: string[]; key: string[]; sub?: string; times?: number[] };
export const CAPTIONS = CAPS as Caption[];

// Timed to the recorded voice-over (vo/vo.mp3, force-aligned: vo/align.txt), with a 3.2 s pause cut in after "weekday"
// for the 8% beat (film/public/audio/vo.wav). The picture leads each word by a few frames.
export const BEATS: Record<string, number> = {
  open: 0, offer: 0.24, dist: 2.12,
  scan: 3.85, chip: 4.15,
  score: 6.55, hold: 7.0, sofia: 7.3, card: 7.5, bars: 7.7, merge: 8.7,
  reason: 9.3, reason2: 9.75,
  draft: 10.4, subject: 10.65, generic: 10.85, strike: 11.45, personal: 11.7, ask: 12.5, qc: 12.55,
  approve: 12.7, cursor: 12.75, click: 13.38,
  fold: 14.15, send: 14.6, arrive: 15.7, more: 15.9,
  replies: 16.9, marta: 17.8, bubble: 18.6, answer: 18.95,
  week: 19.55, fly: 19.85, booked: 20.3, weekOut: 21.0,
  pull: 20.95, loopOn: 21.7, stat: 23.5, turn: 26.65, word: 27.3, line: 26.82, sub: 29.06, cta: 30.4, faces: 30.7, rest: 31.0, end: 33.5,
};

const words: Record<string, number> = {};
const seen: Record<string, number> = {};
for (const c of CAPTIONS) {
  let i = 0;
  for (const ln of [...c.lines, ...(c.sub ? [c.sub] : [])]) for (const w of ln.split(" ")) {
    const base = "w:" + w.toLowerCase().replace(/[^a-z0-9]/g, "");
    const n = (seen[base] = (seen[base] ?? 0) + 1);
    words[n > 1 ? base + n : base] = +(c.times ? c.times[i] : c.at + i * WORD_STEP).toFixed(3);
    i++;
  }
}
export const WORDS = words;
export const T = timeline(FPS, { ...BEATS, ...WORDS });
