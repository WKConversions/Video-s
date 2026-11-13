/* B4 (11.20-14.30) "A costed plan. Highest return, first." Builder B. */
import * as K from '../engine/kit.js';
import { E, pop, seg, mix, clamp01, spring, springTo, BOUNCY, SNAPPY } from '../engine/anim.js';
import { stage, KEYS, tLand, tileDone, popF, springF } from './B_shared.js';
const { f2, SLOT } = K;

/* a plan row: a copy of K.planRow with the extra state the re-rank needs */
function row(key, cy, o = {}) {
  const d = K.ROWS[key], grow = o.grow == null ? 1 : o.grow;
  let s = '';
  if (o.plate > 0.003) s += `<g opacity="${f2(o.plate)}"><rect x="410" y="${f2(cy - 50)}" width="1100" height="100" rx="20" fill="#1A2246" fill-opacity=".97" stroke="rgba(255,255,255,.16)" filter="url(#shLift2)"/></g>`;
  if (o.glow > 0.003) s += `<rect x="410" y="${f2(cy - 50)}" width="1100" height="100" rx="20" fill="rgba(97,114,243,.5)" filter="url(#b20)" opacity="${f2(o.glow)}"/>`;
  if (o.hi > 0.003) s += `<g opacity="${f2(o.hi)}"><rect x="410" y="${f2(cy - 50)}" width="1100" height="100" rx="20" fill="rgba(185,193,255,.14)" stroke="rgba(185,193,255,.75)" stroke-width="1.5"/></g>`;
  const lit = o.lit || o.hi > 0.003;
  if (o.tile !== false) {
    if (o.tileGlow > 0.003) s += `<rect x="444" y="${f2(cy - 34)}" width="68" height="68" rx="17.68" fill="rgba(97,114,243,.55)" filter="url(#b20)" opacity="${f2(o.tileGlow)}"/>`;
    s += K.tile(478, cy, 68, d.icon, lit ? { fill: 'rgba(185,193,255,.24)', stroke: '#B9C1FF', sw: 1.5, ic: '#F3F5FA', is: 0.85 } : { is: 0.85 });
  }
  let b = K.T(540, cy + 13, d.label, { f: 'i', sz: 36, fill: K.C.text });
  if (o.tag > 0.003) {
    const x = 540 + K.measure(d.label, { f: 'i', sz: 36 }) + 24, tx = x + 81;
    const t = `<rect x="${f2(x)}" y="${cy - 20}" width="162" height="40" rx="20" fill="#B9C1FF"/>` + K.MONO(tx, cy + 8, 'First block', { sz: 22, fill: '#0B1220', anchor: 'middle' });
    b += o.tag > 0.9995 ? t : `<g opacity="${f2(Math.min(1, o.tag * 2.5))}" transform="translate(${f2(tx)},${cy}) scale(${f2(o.tag)}) translate(${f2(-tx)},${-cy})">${t}</g>`;
  }
  b += `<rect x="1070" y="${cy - 8}" width="290" height="16" rx="8" fill="rgba(255,255,255,.06)"/>`;
  b += `<rect x="1070" y="${cy - 8}" width="${f2(d.ret * 0.96 * grow)}" height="16" rx="8" fill="url(#barG)"/>`;
  if (o.sheen > 0 && o.sheen < 1.15) b += `<defs><clipPath id="sh${key}"><rect x="1070" y="${f2(cy - 8)}" width="${d.ret * 0.96}" height="16" rx="8"/></clipPath></defs><rect x="${f2(1070 + d.ret * 0.96 * o.sheen - 40)}" y="${f2(cy - 14)}" width="80" height="28" fill="#fff" opacity=".35" clip-path="url(#sh${key})"/>`;
  b += `<rect x="1400" y="${cy - 6}" width="${f2(d.cost * 0.85 * grow)}" height="12" rx="6" fill="rgba(223,230,243,.38)"/>`;
  const bo = o.bodyOp == null ? 1 : o.bodyOp;
  s += bo >= 0.999 ? b : `<g opacity="${f2(bo)}">${b}</g>`;
  const op = o.op == null ? 1 : o.op;
  const sc = o.scale && Math.abs(o.scale - 1) > 1e-4 ? ` translate(960,${f2(cy)}) scale(${f2(o.scale)}) translate(-960,${f2(-cy)})` : '';
  const tr = o.dx || sc ? ` transform="translate(${f2(o.dx || 0)},0)${sc}"` : '';
  return `<g opacity="${f2(op)}"${tr}>${s}</g>`;
}

const LIFT = 12.76, GLIDE = 13.16, SETTLE = 13.64, END = 14.0;
// Karl (13 Nov): the cursor in 30-50% of the film. Here the client CHOOSES: the hand clicks the quote row on "Highest"
// (its deepest point = LIFT, so the click lifts the row), guides it up to the top slot with the row's own glide, rests on
// it, and leaves as the card tilts into B5.
export const HAND = [
  { at: 10.0, x: 2100, y: 1250 },
  { at: 12.65, x: 700, y: 590, click: true },
  { at: 14.0, x: 700, y: 350, early: 0, dur: 0.85 },
  { at: 15.9, x: 2150, y: 1300, early: 0 },
];
export function draw(T) {
  let s = stage(T);
  // ---- row state ----
  const lift = spring(T, LIFT, BOUNCY) * (1 - E(T, SETTLE, 0.4));
  const g = springF(T, GLIDE, BOUNCY, END);            // quote glides up
  const uc = springF(T, GLIDE + 0.06, SNAPPY, END);    // customers glide down
  const mv = Math.sin(Math.PI * seg(T, GLIDE + 0.04, 0.9));
  const others = mix(1, 0.62, E(T, SETTLE + 0.04, 0.5));
  const plate = E(T, LIFT, 0.3) * (1 - E(T, SETTLE + 0.06, 0.35));
  const hi = E(T, SETTLE + 0.06, 0.35);
  const tag = T > SETTLE + 0.08 ? springF(T, SETTLE + 0.08, BOUNCY, END + 0.1) : 0;
  const shn = T > 13.8 && T < 14.2 ? 1.16 * E(T, 13.8, 0.4, 'smooth') : 0;
  const gate = E(T, 13.85, 0.3), halo = gate * Math.pow(Math.sin(Math.PI * (14.3 - T) / 1.1), 2);
  const idle = E(T, 11.9, 0.4) * (1 - E(T, 12.7, 0.3)) * (0.5 + 0.5 * Math.sin(2 * Math.PI * (T - 11.9) / 1.4));
  const cyQ = mix(SLOT[2], SLOT[0], g) - 12 * lift;
  const R = {};
  KEYS.forEach((k, i) => {
    const land = tLand(i);
    const bodyOp = E(T, land - 0.12, 0.32);
    const grow = spring(T, 11.5 + i * 0.07, { stiffness: 220, damping: 20 });
    const tile = T >= tileDone(i);
    const cas = T > 12.45 + i * 0.06 && T < 13.1 ? 1.16 * E(T, 12.45 + i * 0.06, 0.5, 'smooth') : 0;
    const base = { cas, bodyOp, grow, tile };
    if (k === 'cust') R[k] = row(k, mix(SLOT[0], SLOT[2], uc), { ...base, sheen: cas, op: others * (1 - 0.88 * mv), dx: 70 * mv });   // lead: almost gone while it passes behind enquiries (no legible overlap)
    else if (k === 'enq') R[k] = row(k, SLOT[1], { ...base, sheen: cas, op: others * (1 - 0.25 * mv), dx: -70 * mv });
    else if (k === 'quote') R[k] = row(k, cyQ, { ...base, lit: true, plate, hi, tag, sheen: shn || cas, glow: halo * 0.85, tileGlow: idle * 0.8, scale: 1 + 0.025 * lift });
    else R[k] = row(k, SLOT[i], { ...base, sheen: cas, op: others });
  });
  // draw order: the quote last (on top while it travels)
  s += R.cust + R.enq + R.hours + R.report + R.quote;
  return s;
}
