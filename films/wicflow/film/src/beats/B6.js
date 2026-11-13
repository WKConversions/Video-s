/* B6: Inside the block, it runs.  (18.45-22.20)
   18.45-18.75 panel grows 62% -> 100% (camera move, no overshoot), streaks fade | 19.24 "runs": Running dot pulses, data dots run
   20.18-21.0 the follow-up drafts itself, caret | 20.98 send fills, dots run on, 21.08 queue card slides in "Draft ready"
   21.36 "quiet": the quote's ring refills in periwinkle, 21.66 check pops with a ripple, 21.74 the queue advances
   21.85-22.20 the panel shrinks back into block 01's top face, the world returns (hand-off state for B7 at 22.20). */
import * as K from '../engine/kit.js';
import { E, mix, drift, DASH } from '../engine/anim.js';
import { periBlock, zoomGroup, streaks, cornerTint, blurWrap, scaleAbout, autoPanel2 } from './C_shared.js';

export const HAND = [];
const { f2 } = K;

function glassWorld(T, e) {
  const blocks = { '0,2,0': null, [K.KEY_OF['06']]: { w: { wire: 1 }, dashOff: DASH(T) } };
  const glow = 1.2 * (1 - Math.min(1, e / 0.12));
  const studOp = 1 - Math.min(1, Math.max(0, (e - 0.04) / 0.25));
  const after = periBlock({ num: '01', glow, studOp });
  return K.world({ def: { w: { glass: 1 } }, blocks, after });
}

export function draw(T) {
  // forward portal (continues B5) and reverse portal (back to the world)
  const g = E(T, 18.45, 0.30, 'smooth'), r = E(T, 21.85, 0.18, 'inOut');
  const pg = g * (1 - r);
  const rev = T >= 21.8;
  let s = '';
  if (rev) {
    const e = 1 - E(T, 22.0, 0.20, 'inOut');
    const wOp = E(T, 21.96, 0.12, 'inOut');
    if (wOp > 0.002) s += `<g opacity="${f2(wOp)}">${zoomGroup(glassWorld(T, e), e)}</g>`;
    s += cornerTint(0.35 * r * (1 - E(T, 22.0, 0.15)));
    s += streaks(r * (1 - E(T, 22.04, 0.14)));
    const pOp = 1 - E(T, 21.96, 0.12, 'inOut');
    if (pOp > 0.002) s += `<g opacity="${f2(pOp)}">${blurWrap(scaleAbout(autoPanel2(T), mix(0.62, 1, pg), 960, 540, drift(T, 3.76, 2.5) * (1 - pg * 0.6)), 3 * (1 - pg))}</g>`;
    return s;
  }
  s += cornerTint(0.35 * (1 - E(T, 18.45, 0.35)));
  s += streaks(1 - E(T, 18.45, 0.30, 'smooth'));
  const panel = autoPanel2(T);
  const dy = drift(T, 3.76, 2.5) * (1 - g * 0.6);
  s += pg >= 0.999 ? `<g transform="translate(0,${f2(dy)})">${panel}</g>` : blurWrap(scaleAbout(panel, mix(0.62, 1, pg), 960, 540, dy), 3 * (1 - pg));
  return s;
}
