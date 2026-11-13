/* Group D shared helpers (B7, B8, B9): the block system's states as pure functions of film time T. */
import * as K from '../engine/kit.js';
import { E, pop, seg, mix, bezier, clamp01, DASH, drift, spring, bounceIn, BOUNCY, SNAPPY } from '../engine/anim.js';
import { w } from '../timeline.js';

const fmt = (n) => Math.round(n * 100) / 100;

/* ---------- B7: block fills ---------- */
export const FILL = {   // [start, duration] of each block's top-down wipe (film s)
  '02': [22.40, 0.50], '03': [22.74, 0.50], '04': [24.50, 0.38], '05': [24.62, 0.38],
};
export function fillProps(n, e, extra = {}) {
  if (e <= 0) return { ...extra };
  if (e >= 1) return { w: { solid: 1 }, num: n, ...extra };
  // solid at .99 keeps the stud off the "studs on top" layer until the wipe is complete
  return { w: { glass: 1, solid: 0.99 }, wipe: Math.min(1, e * 1.08), num: n, ...extra };
}
/* a hop-and-land: rises, comes down past rest (squash into the floor) and settles; 0 before t0 and after it settles */
export const hop = (T, t0, amp = 24, cfg = BOUNCY) => (T <= t0 || T > t0 + 1.3 ? 0 : -amp * (spring(T, t0, cfg) - spring(T, t0 + 0.2, cfg)));
export const fillE = (T, n) => E(T, FILL[n][0], FILL[n][1], 'inOut');

/* an expanding ring on a block's top stud (the flourish of B7: "it landed") */
export function ringAt(T, t0, c, r, k, dur = 0.7, rx0 = 56, rx1 = 190) {
  const u = seg(T, t0, dur);
  if (u <= 0 || u >= 1) return '';
  const e = 1 - Math.pow(1 - u, 2.2);
  const tc = K.topCentre(c, r, k), rx = mix(rx0, rx1, e);
  return `<ellipse cx="${fmt(tc[0])}" cy="${fmt(tc[1] - 20)}" rx="${fmt(rx)}" ry="${fmt(rx / 1.73)}" fill="none" stroke="#CDD3FF" stroke-width="${fmt(2.4 - 1.4 * u)}" opacity="${fmt(0.75 * Math.pow(1 - u, 1.3))}"/>`;
}

/* ---------- B8/B9: the lit system ---------- */
export const LTIME = {
  '01-02': [25.14, 25.65], '02-03': [25.55, 26.05], '03-05': [25.95, 26.40],
  '01-04': [25.30, 25.85], '04-06': [25.90, 26.72], '05-06': [26.35, 26.74],
};
const LORDER = ['01-02', '02-03', '03-05', '01-04', '04-06', '05-06'];
export const FILL6 = [26.74, 0.42];
export const STUD_T = { '06': 27.00, '04': 27.05, '05': 27.09, '03': 27.13, '02': 27.17, '01': 27.21 };
export const lineFrac = (T, id) => E(T, LTIME[id][0], LTIME[id][1] - LTIME[id][0], 'inOut');

export function lines(T) {
  return LORDER.map((id) => {
    const f = lineFrac(T, id);
    if (f <= 0) return '';
    const sp = f < 1 ? Math.max(0.05, spring(T, LTIME[id][0], SNAPPY)) * (1 + 0.25 * Math.sin(T * 40)) : 0;
    const head = f < 1 ? K.polyAt(K.LINES[id], f) : null;
    return K.lightLine(K.LINES[id], f) + (head ? K.spark(head[0], head[1], 10 * sp * 1.1, 20 * sp * 1.1) : '');
  }).join('');
}
/* pulses circulating the lines once each line is complete (same function in B8 and B9: no seam) */
export function pulses(T) {
  let s = '';
  LORDER.forEach((id, i) => {
    const t1 = LTIME[id][1] + 0.1, a = E(T, t1, 0.5, 'inOut');
    if (a <= 0) return;
    const ph = (((T - t1) * 0.42 + i * 0.37) % 1 + 1) % 1;
    const win = Math.pow(Math.sin(Math.PI * ph), 0.7) * a;
    const p = K.polyAt(K.LINES[id], ph);
    s += `<g opacity="${fmt(win)}">${K.spark(p[0], p[1], 11, 20)}</g>`;
  });
  return s;
}

export function topLabel(T) {
  const pl = E(T, 26.26, 0.30, 'inOut');
  if (pl <= 0) return '';
  let s = `<line x1="960" y1="178" x2="960" y2="${fmt(178 - 62 * pl)}" stroke="rgba(223,230,243,.5)" stroke-width="1.2"/>`;
  const dp = spring(T, 26.48, SNAPPY);
  if (dp > 0) s += `<circle cx="960" cy="112" r="${fmt(4.5 * dp)}" fill="#F3F5FA"/>`;
  const tp = E(T, 26.40, 0.34, 'inOut');
  if (tp > 0) {
    const id = K.uid('tl'), W = 420;
    s += `<defs><clipPath id="${id}"><rect x="${fmt(940 - W * tp)}" y="80" width="${fmt(W * tp + 4)}" height="60"/></clipPath></defs><g clip-path="url(#${id})">${K.MONO(940, 123, 'All of it connected', { sz: 32, fill: K.C.text, op: fmt(0.9 * clamp01(tp * 1.6)), anchor: 'end' })}</g>`;
  }
  return s;
}

/* the ambient float of the whole world: it never sits still (starts from rest at the B6 hand-off, 22.20) */
export function floatXY(T) {
  const a = E(T, 22.2, 1.2, 'smooth');
  return [a * drift(T, 5.3, 4, 0.4), a * drift(T, 3.9, 5, 1.3)];
}
/* the camera: slow growth in B8, a breath out and the rise above the lockup in B9 */
const SHR = bezier(0.45, 0, 0.2, 1);
export function camera(T) {
  const ee = SHR(seg(T, 27.55, 0.85));
  const breathe = 1 + 0.004 * Math.sin(((T - 29.0) * 2 * Math.PI) / 4.2) * E(T, 28.9, 0.8, 'inOut');
  const s = (1 + 0.03 * E(T, 25.0, 2.55, 'smooth') + 0.025 * E(T, 27.55, 0.45, 'inOut') - (1.055 - 0.5) * ee) * breathe;
  return { s, dy: -238 * ee, ee };
}

/* the whole system (blocks, lines, pulses, label) with the camera applied */
export function system(T) {
  const e6 = E(T, FILL6[0], FILL6[1], 'inOut');
  const lit = {}, glowMul = {};
  for (const n in STUD_T) { lit[n] = E(T, STUD_T[n], 0.30, 'inOut'); glowMul[n] = 1 + 0.2 * lit[n] + 0.5 * Math.max(0, spring(T, STUD_T[n], SNAPPY) - spring(T, STUD_T[n] + 0.22, SNAPPY)); }
  const ex = (n) => ({ studLit: lit[n], glowMul: glowMul[n], studH: 20 * (1 + 0.45 * Math.max(0, spring(T, STUD_T[n], SNAPPY) - spring(T, STUD_T[n] + 0.22, SNAPPY))) });
  const b = (n) => ({ w: n === '01' ? { peri: 1 } : { solid: 1 }, num: n, ...ex(n) });
  const h6 = hop(T, FILL6[0], 30), d6 = { dy: h6 };
  const six = e6 <= 0 ? { w: { glass: 1 }, num: null } : e6 >= 1 ? { ...b('06'), ...d6 }
    : { w: { glass: 1, solid: 0.99 }, wipe: Math.min(1, e6 * 1.08), num: '06', ...ex('06'), ...d6 };
  const blocks = K.namedState({ '01': b('01'), '02': b('02'), '03': b('03'), '04': b('04'), '05': b('05'), '06': six });
  const tc = K.topCentre(0, 0, 2);
  const haloOp = E(T, 26.95, 0.6, 'inOut');
  const halo = haloOp > 0 ? `<ellipse cx="${tc[0]}" cy="${tc[1] + 40}" rx="170" ry="150" fill="rgba(185,193,255,.22)" filter="url(#b30)" opacity="${fmt(haloOp)}"/>` : '';
  let wave = '';
  const wu = seg(T, 27.0, 0.55);
  if (wu > 0 && wu < 1) {
    const e = 1 - Math.pow(1 - wu, 2), rx = mix(60, 330, e);
    wave = `<ellipse cx="${fmt(tc[0])}" cy="${fmt(tc[1] - 20)}" rx="${fmt(rx)}" ry="${fmt(rx / 1.73)}" fill="none" stroke="rgba(205,211,255,.8)" stroke-width="2.2" filter="url(#b2)" opacity="${fmt(0.8 * Math.pow(1 - wu, 1.2))}"/>`;
  }
  const cam = camera(T);
  const worldS = K.world({ def: { w: { glass: 1 } }, blocks, before: halo, after: lines(T), studsOnTop: true, top: wave + pulses(T) });
  const labOp = 1 - E(T, 27.95, 0.35, 'inOut');
  const lb = bounceIn(T, 26.30, { from: 0.8, rise: 16, cfg: SNAPPY });
  const label = labOp > 0 ? `<g opacity="${fmt(labOp)}" transform="translate(960,${fmt(123 + lb.y)}) scale(${fmt(lb.s)}) translate(-960,-123)">${topLabel(T)}</g>` : '';
  const [fx, fy] = floatXY(T);
  return K.placed(worldS + label, cam.s, fx * cam.s, cam.dy + fy * cam.s);
}
