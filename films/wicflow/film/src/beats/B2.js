/* B2 (5.45-8.60): "Off-the-shelf software never quite fits." The company's five processes are tiles of their own
   shapes; a generic template slides in beside them, the tiles try to slot in and do not fit (the hand drags one);
   the template leaves and the tiles settle into seamAB(8.60). Same scene function as B1. */
import * as A from './A_shared.js';
const H = A.HAND_T;
export const HAND = [
  { at: 4.0, x: 150, y: 1250 },
  { at: H.click, x: H.home[0], y: H.home[1], click: true },
  { at: H.dragE, x: H.slot[0], y: H.slot[1], early: 0, dur: 0.97 },
  { at: 8.7, x: 1300, y: 1250, early: 0 },
];
export function draw(T) { return A.scene(T); }
