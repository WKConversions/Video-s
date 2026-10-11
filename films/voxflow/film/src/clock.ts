// The film's timing as labels (seconds), relative to the voice-over's force-aligned words (src/words.json, CTC
// alignment of the Dutch script on the draft's voice track). Beat labels lead their spoken word by about 0.13 s, so
// the picture lands with the word.
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 960;                  // 32.0 s: the voice-over (0.42–30.17 s) and the end card
type Wd = { word: string; key: string; start: number; end: number };
export const VO = WORDS_JSON as Wd[];
const words: Record<string, number> = {};
const seen: Record<string, number> = {};
for (const w of VO) {
  const base = "w:" + w.key.toLowerCase().replace(/[^a-z0-9]/g, "");
  const n = (seen[base] = (seen[base] ?? 0) + 1);
  words[n > 1 ? base + n : base] = w.start;
}
export const WORDS = words;
export const BEATS: Record<string, number> = {
  open: 0,
  // 1 hook: a call rings in the practice, nobody can answer, the missed calls pile up
  ring: 0.05, hook: 0.3, missed: 0.95,
  // 2 the turn: VoxFlow; the same calls answered; the receptionist
  turn: 2.5, square: 3.25, flip: 3.3, always: 3.76, rise: 4.19, fold: 4.45, talk: 4.95,
  // 3 the AI receptionist, 24/7 (the words take the left, where the wordmark was)
  words3: 5.75, h247: 7.96, night: 8.1, ring2: 8.62, accept: 9.02, picked: 9.5,
  // 4 the caller asks, the receptionist answers, the appointment lands in the agenda
  white: 9.75, ask: 10.2, answer: 10.55, agenda: 11.42, fly: 11.8, check: 12.98,
  // 5 the practice works while the phone handles the calls
  whip1: 13.5, notes: 14.4, banner: 14.98, dim: 15.66,
  // 6 the practice in focus
  open6: 16.6, focus: 17.62, pill: 18.26,
  // 7 professioneel, snel, zonder pauzes
  teal: 18.95, werkt: 19.17, greet: 19.5, prof: 19.96, snel: 20.91, zonder: 21.84, strike: 22.3,
  // 8 every customer, at once
  cream: 22.85, calls: 23.12, direct: 24.19, photo: 24.75, sms: 25.33,
  // 9 more from every call
  whip2: 25.85,
  // 10 the call to action
  cta: 28.2, mark: 29.3, tagline: 29.7, press: 30.45, end: 32.0,
};
export const T = timeline(FPS, { ...WORDS, ...BEATS });
