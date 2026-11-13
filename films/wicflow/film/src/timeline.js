/* Wicflow film: the clock. 60 fps, 33.0 s, NO loop (Karl, 13 Nov). Film seconds T everywhere.
   SPANS: which beat draws at T (a beat draws from its start up to, not including, its end; the next beat's first
   frame must continue its last frame: see the hand-off states in plan/build-brief.md).
   w(word, n): start of the n-th occurrence of a voice-over word (case and punctuation ignored); we(): its end.
     w('quiet') = 0.62, w('quiet', 2) = 21.36, w('first', 4) = 28.22 ... */
import { WORDS } from './words.js';
export const FPS = 60, DUR = 33.0, FRAMES_TOTAL = Math.round(DUR * FPS);
export const SPANS = {
  B1: [0.0, 5.45], B2: [5.45, 8.6], B3: [8.6, 11.2], B4: [11.2, 14.3], B5: [14.3, 18.45],
  B6: [18.45, 22.2], B7: [22.2, 25.0], B8: [25.0, 27.55], B9: [27.55, 33.0],
};
const norm = (s) => s.toLowerCase().replace(/[^a-z']/g, '');
const find = (word, n) => {
  let k = 0;
  for (const x of WORDS) if (norm(x[0]) === norm(word) && ++k === n) return x;
  throw new Error(`no word "${word}" #${n}`);
};
export const w = (word, n = 1) => find(word, n)[1];
export const we = (word, n = 1) => find(word, n)[2];
export { WORDS };
