/* B1 (0.00-5.45): "Quotes go quiet. Enquiries pile up. Hours get typed in twice."
   Four live cards drift; QUOTE comes forward on "Quotes" and goes quiet on "quiet"; enquiries pile up on
   "Enquiries ... pile up"; on "Hours" the 3D hand re-types the hours by hand (click 1 on the timesheet row, click 2
   on the invoice line, landing on "twice"); from 5.05 the cards lie down on four wire blocks (A_shared.morphLayer,
   which B2 continues). */
import * as A from './A_shared.js';
import { MORPH0 } from './A_shared.js';

// the hand: enters from below, two clicks on the HOURS card (fingertip at the deepest point at + 0.11), leaves.
const tip = (lc, t) => A.loc('HOURS', t, lc[0], lc[1]);
const [x1, y1] = tip(A.L1, A.CLICK1 + A.DEEP), [x2, y2] = tip(A.L2, A.CLICK2 + A.DEEP);
export const HAND = [
  { at: 2.0, x: 1150, y: 1300 },
  { at: A.CLICK1, x: Math.round(x1), y: Math.round(y1), click: true },
  { at: A.CLICK2, x: Math.round(x2), y: Math.round(y2), click: true },
  { at: 6.2, x: 1300, y: 1300 },
];

export function draw(T) {
  if (T >= MORPH0) return A.morphLayer(T);
  return A.LIVE_ORDER.map((t) => A.liveCard(t, T)).join('');
}
