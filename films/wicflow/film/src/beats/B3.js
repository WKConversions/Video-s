/* B3 (8.60-11.20) "First, we map where the time goes." Builder B. The stage lives in B_shared.js. */
import * as K from '../engine/kit.js';
import { E, DASH } from '../engine/anim.js';
import { stage, F0 } from './B_shared.js';
export const HAND = [];
export function draw(T) {
  const op = 1 - E(T, F0, 0.7);
  let s = '';
  if (op > 0.003) {
    const w = K.world({ def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.55, dashOff: DASH(T) } });
    s += op > 0.999 ? w : `<g opacity="${op.toFixed(3)}">${w}</g>`;
  }
  return s + stage(T);
}
