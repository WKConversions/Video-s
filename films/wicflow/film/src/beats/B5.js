/* B5: First block, guaranteed. Not as agreed, you don't pay.  (14.30-18.45)
   14.30-14.78 the plan card tilts onto the floor, its top row lifts off  | 14.60-14.90 the row folds into cell (0,2)
   14.72 the first block extrudes (on "block" 14.78), stud last           | 15.00-16.75 13 wire blocks draw in, back to front
   15.42 leader drops + label types on ("guaranteed")                     | 16.76 seal ring ("agreed")
   17.00 cost chip pops in, 17.64 it drains ("don't pay") and dissolves   | 17.25 glint over the stud
   18.17-18.45 zoom through block 01's top face, panel emerges (B6 continues it). */
import * as K from '../engine/kit.js';
import { E, pop, mix, seg, drift, DASH } from '../engine/anim.js';
import { SPANS, w } from '../timeline.js';
import { periBlock, zoomGroup, zoomScale, streaks, cornerTint, blurWrap, scaleAbout, autoPanel2, clamp01 } from './C_shared.js';

export const HAND = [];
const { P, f2, pts, C } = K;

const CARD = [[380, 140], [1540, 140], [1540, 940], [380, 940]];            // TL TR BR BL
const FLOOR = [P(0, 3, 0), P(0, 0, 0), P(3, 0, 0), P(3, 3, 0)];
const WIRE = (T, op = 1) => `stroke="rgba(223,230,243,.42)" stroke-width="1.5" stroke-dasharray="6 6" stroke-dashoffset="${f2(DASH(T))}" fill="none" opacity="${f2(op)}"`;
const CELLQ = [P(0, 3, 0), P(0, 2, 0), P(1, 3, 0)];                          // row's A, B, D when folded onto cell (0,2)
const T_BLOCK = w('block'), T_GUAR = w('guaranteed'), T_AGREED = w('agreed'), T_DONT = w('pay') - 0.14;

const WIRES = K.BLOCKS.filter(([c, r, k]) => !(c === 0 && r === 2 && k === 0))
  .sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2] || a[0] - b[0]);

const LABEL = 'First block · guaranteed';

function scene(T, e) {
  const tt = pop(T, 14.30, { dur: 0.6, over: 0.03 });
  const q = CARD.map((p, n) => K.lerpP(p, FLOOR[n], tt));
  let s = '';
  // ---- the card lying down (content fades as the floor grid dashes in)
  const cardOp = 1 - E(T, 14.36, 0.4, 'inOut');
  const gridOp = E(T, 14.42, 0.45, 'inOut');
  if (T < 14.9) {
    if (cardOp > 0.002) {
      let body = K.planCard() + K.planLines() + ['quote', 'enq', 'cust', 'hours', 'report'].map((k, i) => (i === 0 ? '' : K.planRow(k, K.SLOT[i], { op: 0.62 }))).join('');
      s += `<g opacity="${f2(cardOp)}"><g transform="${K.affine(q[0], q[1], q[3], 1160, 800)} translate(-380,-140)">${body}</g></g>`;
    }
    if (gridOp > 0.002) {
      const fillOp = 0.025 * (1 - E(T, 14.8, 0.3));
      s += `<polygon points="${pts(q)}" fill="rgba(255,255,255,${f2(fillOp)})"/>`;
      s += `<polygon points="${pts(q)}" ${WIRE(T, gridOp)}/>`;
      for (const v of [1 / 3, 2 / 3]) { const a = K.bil(q, 0, v), b = K.bil(q, 1, v); s += `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" ${WIRE(T, gridOp)}/>`; }
      for (const u of [1 / 3, 2 / 3]) { const a = K.bil(q, u, 0), b = K.bil(q, u, 1); s += `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" ${WIRE(T, gridOp)}/>`; }
    }
  } else {
    s += `<polygon points="${pts(FLOOR)}" ${WIRE(T)}/>`;
    for (const n of [1, 2]) s += `<path d="M${P(n, 0, 0)} L${P(n, 3, 0)} M${P(0, n, 0)} L${P(3, n, 0)}" ${WIRE(T)}/>`;
  }
  // ---- the top row: lifts off the plane, folds into the footprint of cell (0,2)
  const fold = E(T, 14.60, 0.30, 'inOut');
  if (fold < 1) {
    const lift = 64 * E(T, 14.36, 0.34, 'inOut') * (1 - fold);
    const u0 = 30 / 1160, u1 = 1130 / 1160, v0 = 160 / 800, v1 = 260 / 800;
    let A = K.bil(q, u0, v0), B = K.bil(q, u1, v0), D = K.bil(q, u0, v1);
    const A2 = CELLQ[0], B2 = CELLQ[1], D2 = CELLQ[2];
    const Af = K.lerpP(A, A2, fold), Bf = K.lerpP(B, B2, fold), Df = K.lerpP(D, D2, fold);
    const Cf = [Bf[0] + Df[0] - Af[0], Bf[1] + Df[1] - Af[1]];
    if (lift > 0.5) s += `<polygon points="${pts([Af, Bf, Cf, Df])}" fill="#000" opacity="${f2(0.35 * lift / 64)}" filter="url(#b10)"/>`;
    const rowOp = 1 - E(T, 14.50, 0.30, 'inOut');
    const glass = E(T, 14.36, 0.34, 'inOut');
    let row = K.planRow('quote', 350, { hi: true, tag: true });
    row = `<g transform="translate(-410,-300)">${row}</g>`;
    const lifted = (p) => [p[0], p[1] - lift];
    const body = `<g opacity="${f2(rowOp)}"><g transform="${K.affine(lifted(Af), lifted(Bf), lifted(Df), 1100, 100)}">${row}` +
      `<rect x="0" y="0" width="1100" height="100" rx="20" fill="rgba(185,193,255,.32)" stroke="#B9C1FF" stroke-width="2" vector-effect="non-scaling-stroke" opacity="${f2(glass * 0.8)}"/></g></g>`;
    s += lift > 0.5 ? `<g filter="url(#shLift2)">${body}</g>` : body;
    // the folded row settling into a flat periwinkle footprint
    const fp = E(T, 14.58, 0.30, 'inOut');
    s += `<polygon points="${pts([Af, Bf, Cf, Df].map((p) => [p[0], p[1] - lift]))}" fill="rgba(185,193,255,${f2(0.32 * fp)})" stroke="#B9C1FF" stroke-width="1.5" stroke-opacity="${f2(fp)}"/>`;
  }
  // ---- seal ring on the floor around block 01's footprint
  const sp = E(T, T_AGREED, 0.55, 'out');
  const cen = P(0.5, 2.5, 0);
  if (sp > 0.001) {
    const k = 1.55, corners = [P(0, 2, 0), P(1, 2, 0), P(1, 3, 0), P(0, 3, 0)].map((p) => [cen[0] + (p[0] - cen[0]) * k, cen[1] + (p[1] - cen[1]) * k]);
    const d = `M${corners.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' L')} Z`;
    const dash = `stroke-dasharray="${f2(sp * 100)} 100"`;
    const br = 0.75 + 0.25 * Math.sin(T * 2.4);
    if (e <= 0) s += `<path d="${d}" pathLength="100" ${dash} fill="none" stroke="rgba(97,114,243,.7)" stroke-width="12" stroke-linejoin="round" stroke-linecap="round" filter="url(#b5)" opacity="${f2(br)}"/>`;
    s += `<path d="${d}" pathLength="100" ${dash} fill="none" stroke="#B9C1FF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (sp >= 0.999) s += `<path d="${d}" fill="rgba(97,114,243,${f2(0.10 * br)})"/>`;
    // ripple when the ring closes
    const rp = E(T, T_AGREED + 0.42, 0.55, 'out');
    if (rp > 0 && rp < 0.99 && e <= 0) {
      const k2 = 1 + 0.5 * rp, c2 = corners.map((p) => [cen[0] + (p[0] - cen[0]) * k2, cen[1] + (p[1] - cen[1]) * k2]);
      s += `<path d="M${c2.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' L')} Z" fill="none" stroke="#B9C1FF" stroke-width="2" stroke-linejoin="round" opacity="${f2(0.6 * (1 - rp))}"/>`;
    }
  }
  // ---- the world: 13 wire blocks back to front, block 01 on top
  const blocks = { '0,2,0': null };
  WIRES.forEach(([c, r, k], i) => {
    const p = E(T, 15.0 + i * 0.1, 0.55, 'smooth');
    blocks[`${c},${r},${k}`] = p > 0.001 ? { w: { wire: 1 }, prog: p, dashOff: DASH(T) } : null;
  });
  const hh = pop(T, 14.72, { dur: 0.55, over: 0.04 });
  const stud = pop(T, 15.02, { dur: 0.4, over: 0.1 });
  const studOp = clamp01(stud * 6) * (1 - seg(e, 0.04, 0.25));
  const glow = 1.2 * E(T, 14.8, 0.5, 'smooth') * (1 + drift(T, 2.4, 0.07)) * (1 - seg(e, 0, 0.1));
  let after = '';
  if (T >= 14.5) after += periBlock({ hh: T < 14.72 ? 0 : hh, studH: 20 * stud, studOp, glow, op: E(T, 14.55, 0.2) });
  // glint across the stud (flourish of the "not as agreed" stretch)
  const gt = seg(T, 17.25, 0.5);
  if (gt > 0 && gt < 1 && e <= 0) {
    const sc = K.topCentre(0, 2, 0), cx = sc[0], cy = sc[1] - K.STUD.h, id = K.uid('gl');
    const bell = Math.sin(Math.PI * gt);
    const x = cx - 70 + 140 * E(T, 17.25, 0.5, 'inOut');
    after += `<defs><clipPath id="${id}"><ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="44" ry="25.5"/></clipPath></defs>` +
      `<g clip-path="url(#${id})"><rect x="${f2(x - 9)}" y="${f2(cy - 40)}" width="18" height="80" fill="#fff" opacity="${f2(0.95 * bell)}" transform="skewX(-25)" transform-origin="${f2(x)} ${f2(cy)}"/></g>` +
      `<g opacity="${f2(bell)}">${K.glintArc(0, 2, 0)}</g>`;
  }
  s += K.world({ def: { w: { wire: 1 } }, blocks, after });
  // ---- leader line + label
  const ld = E(T, T_GUAR, 0.28, 'out');
  if (ld > 0) {
    const y2 = mix(764, 928, ld);
    let l = `<line x1="600" y1="764" x2="600" y2="${f2(y2)}" stroke="rgba(223,230,243,.5)" stroke-width="1.2"/>`;
    const dp = pop(T, T_GUAR + 0.2, { dur: 0.3, over: 0.1 });
    if (dp > 0) l += `<circle cx="600" cy="932" r="${f2(4.5 * dp)}" fill="#B9C1FF"/>`;
    const n = Math.round(LABEL.length * E(T, T_GUAR + 0.22, 0.42, 'smooth'));
    if (n > 0) {
      const txt = LABEL.slice(0, n);
      l += K.MONO(620, 943, txt, { sz: 32, fill: C.text, op: 0.9 });
      if (n < LABEL.length || T < T_GUAR + 0.8) l += K.caret(620 + K.measure(txt, { f: 'm', sz: 32 }) + 4, 918, 30);
    }
    s += l;
  }
  // ---- cost chip: the grey bar of the plan row, drained on "don't pay"
  const cp = pop(T, 17.0, { dur: 0.4, over: 0.07 });
  const gone = E(T, 17.98, 0.22, 'inOut');
  if (cp > 0.01 && gone < 1 && e <= 0) {
    const drain = E(T, T_DONT, 0.38, 'inOut');
    const sc = cp * (1 - 0.15 * gone), op = (1 - gone) * clamp01(cp);
    const cx = 420, cy = 640;
    let ch = `<rect x="${cx - 130}" y="${cy - 30}" width="260" height="60" rx="30" fill="rgba(255,255,255,.07)" stroke="rgba(185,193,255,.45)" stroke-width="1.2"/>`;
    ch += `<circle cx="${cx - 92}" cy="${cy}" r="17" fill="none" stroke="#B9C1FF" stroke-width="2"/>` + K.T(cx - 92, cy + 8, '€', { f: 'i', sz: 22, w: 500, fill: C.text, anchor: 'middle' });
    ch += K.bar(cx - 56, cy - 7, 164, 14, 'rgba(255,255,255,.07)');
    const bw = 164 * (1 - drain);
    if (bw > 0.5) ch += K.bar(cx - 56, cy - 7, bw, 14, 'rgba(223,230,243,.45)');
    if (drain > 0.02 && drain < 0.98) ch += `<circle cx="${f2(cx - 56 + bw)}" cy="${cy}" r="9" fill="#B9C1FF" opacity="${f2(0.55 * Math.sin(Math.PI * drain))}" filter="url(#b4)"/>`;
    s += `<g opacity="${f2(op)}" transform="translate(${cx},${cy}) scale(${f2(sc)}) translate(${-cx},${-cy})">${ch}</g>`;
    // dotted tie from chip to the block's left corner
    s += `<line x1="${cx + 130}" y1="${cy}" x2="598" y2="${cy}" stroke="rgba(185,193,255,.45)" stroke-width="1.2" stroke-dasharray="4 6" stroke-dashoffset="${f2(-DASH(T))}" opacity="${f2(op)}"/>`;
  }
  // ---- alive hold: light pulses run along the floor grid, the whole stack floats a little
  if (e <= 0.02 && T > 15.3) {
    const paths = [[P(0, 3, 0), P(0, 0, 0), P(3, 0, 0), P(3, 3, 0), P(0, 3, 0)], [P(0, 1, 0), P(3, 1, 0)], [P(2, 0, 0), P(2, 3, 0)], [P(3, 2, 0), P(0, 2, 0)]];
    const on = E(T, 15.3, 0.5);
    paths.forEach((pts_, n) => {
      const fr = ((T - 15.3) * (n === 0 ? 0.1 : 0.16) + n * 0.37) % 1;
      for (let g = 0; g < 4; g++) {
        const f = fr - g * 0.012; if (f < 0) continue;
        const pp = K.polyAt(pts_, f);
        s += g === 0 ? K.spark(pp[0], pp[1], 7, 16).replace(/opacity=".8"/, `opacity="${f2(0.8 * on)}"`) : `<circle cx="${f2(pp[0])}" cy="${f2(pp[1])}" r="${f2(4 - g)}" fill="#B9C1FF" opacity="${f2(0.5 * on / g)}"/>`;
      }
    });
  }
  const fl = E(T, 14.9, 0.5) * (1 - seg(e, 0, 0.1));
  return fl > 0 ? `<g transform="translate(0,${f2(drift(T, 3.76, 5) * fl)})">${s}</g>` : s;
}

export function draw(T) {
  const e = E(T, 18.17, 0.28, 'inOut');
  const wOp = 1 - E(T, 18.31, 0.12, 'inOut');
  let s = zoomGroup(`<g opacity="${f2(wOp)}">${scene(T, e)}</g>`, e).replace(/^<g transform/, '<g transform');
  const st = E(T, 18.22, 0.14, 'smooth') * (1 - E(T, 18.45, 0.30, 'smooth'));
  s += cornerTint(0.35 * E(T, 18.31, 0.12) * (1 - E(T, 18.45, 0.35)));
  s += streaks(st);
  const pOp = E(T, 18.31, 0.12, 'inOut');
  if (pOp > 0.002) s += `<g opacity="${f2(pOp)}">${blurWrap(scaleAbout(autoPanel2(T), 0.62, 960, 540, drift(T, 3.76, 2.5)), 3)}</g>`;
  return s;
}
