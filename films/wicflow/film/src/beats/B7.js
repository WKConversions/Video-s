/* B7 "Block by block, each priced in writing." 22.20-25.00. Builder D. */
import * as K from '../engine/kit.js';
import { E, mix, DASH, spring, bounceIn, BOUNCY, SNAPPY } from '../engine/anim.js';
import { w } from '../timeline.js';
import { fillProps, fillE, ringAt, floatXY, hop, FILL } from './D_shared.js';
// Karl (13 Nov): the cursor in 30-50% of the film. "Priced in writing": a person signs. The hand taps the price
// document's signature line, the signature draws itself from the deepest point of that tap, and the hand withdraws.
export const HAND = [
  { at: 21.5, x: 560, y: 1300 },
  { at: 23.75, x: 420, y: 652, click: true },
  { at: 25.6, x: -260, y: 1250, early: 0.3 },
];
const f2 = (n) => Math.round(n * 100) / 100;
const DOC = { x: 300, y: 300 }, TIP = [772, 522];   // price document, and where its tether meets block 04's left face
export function draw(T) {
  const g6 = E(T, 24.4, 0.6, 'inOut');
  const blocks = K.namedState({
    '01': { w: { peri: 1 }, num: '01', glowMul: mix(1.2, 1, E(T, 22.3, 0.9, 'smooth')) },
    '02': fillProps('02', fillE(T, '02'), { dy: hop(T, FILL['02'][0], 30) }), '03': fillProps('03', fillE(T, '03'), { dy: hop(T, FILL['03'][0], 30) }),
    '04': fillProps('04', fillE(T, '04'), { dy: hop(T, FILL['04'][0], 30) }), '05': fillProps('05', fillE(T, '05'), { dy: hop(T, FILL['05'][0], 30) }),
    '06': { w: { wire: 1 - g6, glass: g6 }, dashOff: DASH(T) },
  });
  const top = ringAt(T, 22.52, 2, 2, 0) + ringAt(T, 22.86, 2, 0, 1) + ringAt(T, 24.62, 0, 1, 1, 0.38, 50, 150) + ringAt(T, 24.70, 1, 0, 1, 0.30, 50, 130);
  const [fx, fy] = floatXY(T);
  let s = K.placed(K.world({ def: { w: { glass: 1 } }, blocks, studsOnTop: T >= 22.92, top }), 1, fx, fy);
  // the price document: slides in beside block 04, its signature draws on "writing", then it is absorbed into 04
  const tIn = 23.25, sig = E(T, 23.86, 0.60, 'inOut'), out = E(T, 24.50, 0.40, 'inOut');
  const bi = bounceIn(T, tIn, { from: 0.7, rise: 0, cfg: BOUNCY }), dp = spring(T, tIn, BOUNCY);
  if (bi.op > 0 && T < 24.95) {
    const ab = T < 24.50 ? 0 : spring(T, 24.50, SNAPPY);   // absorbed into block 04 on a spring (small overshoot past the tip)
    const op = bi.op * (1 - E(T, 24.62, 0.28, 'inOut'));
    const ptap = T < 23.86 ? E(T, 23.72, 0.14, 'inOut') : 1 - spring(T, 23.86, BOUNCY);   // press under the fingertip, springy release
    const cx = DOC.x + 150, cy = DOC.y + 200;
    const tx = mix(-170 * (1 - dp), TIP[0] - cx, ab), ty = mix(0, TIP[1] - cy, ab), sc = mix(bi.s * (1 - 0.035 * ptap), 0.18, ab);
    const tether = E(T, tIn + 0.25, 0.4, 'inOut') * (1 - E(T, 24.55, 0.25, 'inOut'));
    if (tether > 0) {
      s += `<g opacity="${f2(tether)}" transform="translate(${f2(fx)},${f2(fy)})"><line x1="${DOC.x + 300}" y1="${DOC.y + 190}" x2="${mix(DOC.x + 300, TIP[0], tether)}" y2="${mix(DOC.y + 190, TIP[1], tether)}" stroke="rgba(185,193,255,.6)" stroke-width="1.5" stroke-dasharray="5 6" stroke-dashoffset="${f2(-DASH(T))}"/><circle cx="${TIP[0]}" cy="${TIP[1]}" r="${f2(5 * tether)}" fill="#B9C1FF"/></g>`;
    }
    s += `<g opacity="${f2(op)}" transform="translate(${f2(tx)},${f2(ty)}) translate(${cx},${cy}) scale(${f2(sc)}) translate(${-cx},${-cy})">${K.signedDoc(DOC.x, DOC.y, sig).replace(/<g transform="translate\([^"]*\) rotate\(35\)">.*<\/g>$/, '')}</g>`;
  }
  return s;
}
