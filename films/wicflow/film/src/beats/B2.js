/* B2 (5.45-8.60): "Off-the-shelf software never quite fits."
   The card -> wire-block morph carries on (shared with B1); a generic app slab lowers on "Off-the-shelf software",
   touches block 06 on "never" (orange outline, impact ring), orange gap lines draw down on "quite fits", a short
   'doesn't fit' sway, the slab lifts and slides out, a periwinkle scan band passes over the blocks (built around how
   you work: edges brighten, two dimension ticks pop) and by 8.60 only the clean wire world remains. */
import * as K from '../engine/kit.js';
import { E, pop, wobble, mix, DASH, clamp01 } from '../engine/anim.js';
import * as A from './A_shared.js';

export const HAND = [];
const f2 = K.f2, P = K.P;
const WORLD_END = { def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.55 } };

export function draw(T) {
  let s = A.morphLayer(T);
  if (T >= 8.56) return s;   // exact hand-off state (wire world only)

  const land = 6.76;
  // --- the slab ---
  const L = E(T, 5.72, 1.04, 'inOut'), lift = E(T, 7.78, 0.5, 'inOut'), slide = E(T, 7.88, 0.55, 'inOut');
  const drop = 820 * (1 - L) + wobble(T, land, 9, 0.5) + 300 * lift;
  const dx = 1500 * slide + wobble(T, 7.5, 6, 0.45);
  const shadow = clamp01(L * 1.4) * (1 - slide);
  // --- block 06 strikes ---
  const o = clamp01(pop(T, land, { dur: 0.4, over: 0.06 })) * (1 - E(T, 7.9, 0.4));
  const ring = E(T, land, 0.7, 'out');
  const c6 = K.topCentre(0, 0, 2);
  const slabDone = slide >= 1;
  if (!slabDone) s += A.appSlab(drop, dx, shadow);
  if (o > 0.005) {
    s += K.renderBlock({ c: 0, r: 0, k: 2, w: { orange: o } });
    if (ring > 0 && ring < 1) s += `<ellipse cx="${f2(c6[0])}" cy="${f2(c6[1])}" rx="${f2(50 + 150 * ring)}" ry="${f2((50 + 150 * ring) * 0.58)}" fill="none" stroke="#FF5A1F" stroke-width="2.5" opacity="${f2(0.8 * (1 - ring))}"/>`;
    // orange gap lines draw down from the slab's underside to the lower blocks ("quite fits")
    [[0, 2], [2, 3], [3, 2], [1, 3]].forEach(([i, j], n) => {
      const p = E(T, 7.22 + n * 0.1, 0.3, 'inOut');
      if (p <= 0) return;
      const a = P(i, j, 2.7), b = P(i, j, 2.7 - 1.7 * p), dp = pop(T, 7.22 + n * 0.1 + 0.22, { dur: 0.3, over: 0.1 });
      s += `<g opacity="${f2(1 - E(T, 7.9, 0.4))}"><line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="#FF5A1F" stroke-opacity=".8" stroke-width="2" stroke-dasharray="6 5" stroke-dashoffset="${f2(-DASH(T))}"/><circle cx="${f2(b[0])}" cy="${f2(b[1])}" r="${f2(4 * dp)}" fill="#FF5A1F"/></g>`;
    });
  }

  // --- the scan band (built around how you work) ---
  const bandOp = E(T, 7.84, 0.12) * (1 - E(T, 8.3, 0.14));
  if (bandOp > 0.002) {
    const m = [0.866, -0.5], n = [0.5, 0.866];
    const sp = mix(-520, 520, E(T, 7.82, 0.6, 'inOut'));
    const cB = [960 + sp * m[0], 570 + sp * m[1]];
    const p0 = [cB[0] - 70 * m[0], cB[1] - 70 * m[1]], p1 = [cB[0] + 70 * m[0], cB[1] + 70 * m[1]];
    const g1 = K.uid('bm'), g2 = K.uid('bf'), mk = K.uid('bk'), cl = K.uid('cl');
    const defs = `<defs><linearGradient id="${g1}" gradientUnits="userSpaceOnUse" x1="${f2(p0[0])}" y1="${f2(p0[1])}" x2="${f2(p1[0])}" y2="${f2(p1[1])}"><stop offset="0" stop-color="#000"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
      <linearGradient id="${g2}" gradientUnits="userSpaceOnUse" x1="${f2(p0[0])}" y1="${f2(p0[1])}" x2="${f2(p1[0])}" y2="${f2(p1[1])}"><stop offset="0" stop-color="#B9C1FF" stop-opacity="0"/><stop offset=".5" stop-color="#B9C1FF" stop-opacity=".2"/><stop offset="1" stop-color="#B9C1FF" stop-opacity="0"/></linearGradient>
      <mask id="${mk}"><rect width="1920" height="1080" fill="url(#${g1})"/></mask><clipPath id="${cl}">${K.clusterShapes()}</clipPath></defs>`;
    const bright = K.world({ def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.95, dashOff: DASH(T) } });
    s += `<g opacity="${f2(bandOp)}">${defs}<g clip-path="url(#${cl})"><rect width="1920" height="1080" fill="url(#${g2})"/></g>` +
      `<line x1="${f2(cB[0] + 700 * n[0])}" y1="${f2(cB[1] + 700 * n[1])}" x2="${f2(cB[0] - 700 * n[0])}" y2="${f2(cB[1] - 700 * n[1])}" stroke="rgba(185,193,255,.45)" stroke-width="1.2"/>` +
      `<g mask="url(#${mk})"><g filter="url(#b2)" opacity=".9">${bright}</g>${bright}</g></g>`;
  }

  // --- two dimension ticks pop where the band has passed ---
  const out = 1 - E(T, 8.42, 0.14);
  const tick = (a, b, t0) => {
    const p = pop(T, t0, { dur: 0.3, over: 0.1 });
    if (p <= 0) return '';
    const mm = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], e = [mix(mm[0], b[0], p), mix(mm[1], b[1], p)], e0 = [mix(mm[0], a[0], p), mix(mm[1], a[1], p)];
    return `<g opacity="${f2(clamp01(p) * out)}"><line x1="${f2(e0[0])}" y1="${f2(e0[1])}" x2="${f2(e[0])}" y2="${f2(e[1])}" stroke="#B9C1FF" stroke-width="2"/><circle cx="${f2(e0[0])}" cy="${f2(e0[1])}" r="4" fill="#B9C1FF"/><circle cx="${f2(e[0])}" cy="${f2(e[1])}" r="4" fill="#B9C1FF"/><circle cx="${f2(mm[0])}" cy="${f2(mm[1])}" r="10" fill="rgba(185,193,255,.35)" filter="url(#b4)"/></g>`;
  };
  const off = (p, dx, dy) => [p[0] + dx, p[1] + dy];
  s += tick(off(P(0, 3, 0), -26, 15), off(P(0, 3, 1), -26, 15), 7.92) + tick(off(P(3, 3, 0), 0, 30), off(P(3, 2, 0), 26, 15), 8.06);
  return s;
}
