/* Shared helpers for builder C (B5 + B6): the first block (variable height), the zoom-through, streaks, the
   automation panel with every state driven by film time T. */
import * as K from '../engine/kit.js';
import { E, pop, mix, seg, DASH, drift } from '../engine/anim.js';

const { f2, pts, P, C, T: TXT, MONO } = K;
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export { clamp01 };

/* ---------- block 01 (cell 0,2,0) with a variable height, a stud that can rise last and fade ---------- */
export const CELL = [0, 2, 0];
export const FACE = K.topCentre(0, 2, 0);          // centre of block 01's top face: [720, 634.5]
export const S_END = 14.1;                          // zoom factor at which the top face fills the frame

/* o: { hh (height 0..1+), studH, studOp, glow (glowMul), num, lit, op } */
export function periBlock(o = {}) {
  const [c, r, k] = CELL;
  const hh = o.hh == null ? 1 : o.hh, studH = o.studH == null ? K.STUD.h : o.studH, studOp = o.studOp == null ? 1 : o.studOp;
  const glow = o.glow == null ? 1 : o.glow;
  if (hh === 1 && studOp >= 1 && glow > 0.02) {
    return K.renderBlock({ c, r, k, w: { peri: 1 }, glowMul: glow, studH, studLit: o.lit || 0, num: o.num, op: o.op });
  }
  const S = K.STATE.peri;
  const v = (i, j, h) => P(c + i, r + j, k + h * hh);
  const top = [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)];
  const left = [v(0, 1, 1), v(1, 1, 1), v(1, 1, 0), v(0, 1, 0)];
  const right = [v(1, 1, 1), v(1, 0, 1), v(1, 0, 0), v(1, 1, 0)];
  const hex = [v(0, 0, 1), v(1, 0, 1), v(1, 0, 0), v(1, 1, 0), v(0, 1, 0), v(0, 1, 1)];
  let q = '';
  if (glow > 0.02) q += `<polygon points="${pts(hex)}" fill="${S.glow}" filter="url(#b${S.glowB})" opacity="${f2(Math.min(glow, 1.6))}"/>`;
  [top, left, right].forEach((f, n) => { q += `<polygon points="${pts(f)}" fill="${S.faces[n]}" stroke="${S.edge}" stroke-width="1" stroke-linejoin="round"/>`; });
  if (studOp > 0.01) {
    const sc = P(c + 0.5, r + 0.5, k + hh);
    const cx = sc[0], cy = sc[1], rx = K.STUD.rx, ry = K.STUD.ry, h = studH;
    const gid = K.uid('sg');
    const side = `M${f2(cx - rx)},${f2(cy - h)} L${f2(cx - rx)},${f2(cy)} A${rx},${ry} 0 0 0 ${f2(cx + rx)},${f2(cy)} L${f2(cx + rx)},${f2(cy - h)} A${rx},${ry} 0 0 1 ${f2(cx - rx)},${f2(cy - h)} Z`;
    let s = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${S.studSide[0]}"/><stop offset="1" stop-color="${S.studSide[1]}"/></linearGradient></defs>`;
    s += `<ellipse cx="${f2(cx)}" cy="${f2(cy + 3)}" rx="${rx + 4}" ry="${ry + 3}" fill="rgba(60,70,140,.12)"/>`;
    s += `<path d="${side}" fill="url(#${gid})"/>`;
    s += `<ellipse cx="${f2(cx)}" cy="${f2(cy - h)}" rx="${rx}" ry="${ry}" fill="${S.studTop}" stroke="rgba(255,255,255,.9)" stroke-width="1"/>`;
    q += `<g opacity="${f2(studOp)}">${s}</g>`;
  }
  if (o.num) {
    const lc = P(c + 0.24, r + 1, k + 0.5 * hh);
    q += `<g transform="matrix(0.866,0.5,0,1,${f2(lc[0])},${f2(lc[1])})">${TXT(0, 12, o.num, { f: 'm', sz: 34, fill: '#0B1220', op: 0.35, anchor: 'middle' })}</g>`;
  }
  return o.op == null || o.op === 1 ? q : `<g opacity="${f2(o.op)}">${q}</g>`;
}

/* ---------- the zoom-through: whole world scales around block 01's top face and drifts to the centre ---------- */
export function zoomGroup(inner, e) {
  if (e <= 0) return inner;
  const s = Math.exp(Math.log(S_END) * e);
  const cx = mix(FACE[0], 960, e), cy = mix(FACE[1], 540, e);
  return `<g transform="translate(${f2(cx - s * FACE[0])},${f2(cy - s * FACE[1])}) scale(${f2(s)})">${inner}</g>`;
}
export const zoomScale = (e) => Math.exp(Math.log(S_END) * e);

export function streaks(op) {
  if (op <= 0.01) return '';
  let s = '';
  for (let n = 0; n < 32; n++) {
    const a = (n / 32) * Math.PI * 2 + 0.1, r0 = 330 + (n % 3) * 30, r1 = r0 + 70 + (n % 4) * 30;
    s += `<line x1="${f2(960 + Math.cos(a) * r0 * 1.5)}" y1="${f2(540 + Math.sin(a) * r0)}" x2="${f2(960 + Math.cos(a) * r1 * 1.5)}" y2="${f2(540 + Math.sin(a) * r1)}" stroke="rgba(185,193,255,.22)" stroke-width="2" stroke-linecap="round"/>`;
  }
  return `<g opacity="${f2(clamp01(op))}" filter="url(#b2)">${s}</g>`;
}
export function cornerTint(op) {
  if (op <= 0.005) return '';
  const hole = [[960 - 1700, 540], [960, 540 - 980], [960 + 1700, 540], [960, 540 + 980]];
  const id = K.uid('mk');
  return `<defs><mask id="${id}"><rect width="1920" height="1080" fill="#fff"/><polygon points="${pts(hole)}" fill="#000" filter="url(#b12)"/></mask></defs>` +
    `<rect width="1920" height="1080" fill="#CDD3FF" opacity="${f2(op)}" mask="url(#${id})"/>`;
}
export function blurWrap(inner, sd) {
  if (sd < 0.08) return inner;
  const id = K.uid('bl');
  return `<defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${f2(sd)}"/></filter></defs><g filter="url(#${id})">${inner}</g>`;
}
export const scaleAbout = (inner, s, cx = 960, cy = 540, dy = 0) =>
  `<g transform="translate(${f2(cx)},${f2(cy + dy)}) scale(${f2(s)}) translate(${-cx},${-cy})">${inner}</g>`;

const hex2 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mixHex = (a, b, p) => { const A = hex2(a), B = hex2(b); return `rgb(${A.map((x, i) => Math.round(mix(x, B[i], p))).join(',')})`; };

/* ---------- the automation panel (copy of K.autoPanel, every state driven by T) ---------- */
export const T_RUN = 19.24, T_DRAFT = 20.18, T_QUIET = 21.36;
function flow2(a, b, o = {}) {
  const k = Math.max(50, Math.abs(b[0] - a[0]) * 0.45);
  const p1 = [a[0] + k, a[1]], p2 = [b[0] - k, b[1]], lit = o.lit == null ? 1 : o.lit;
  const d = `M${f2(a[0])},${f2(a[1])} C${f2(p1[0])},${f2(p1[1])} ${f2(p2[0])},${f2(p2[1])} ${f2(b[0])},${f2(b[1])}`;
  let s = `<path d="${d}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2"/>`;
  if (lit > 0.01) {
    s += `<path d="${d}" fill="none" stroke="rgba(185,193,255,.55)" stroke-width="2" opacity="${f2(lit)}"/>`;
    for (const [t, op] of (o.dots || [])) {
      const p = K.bez(a, p1, p2, b, t), oo = op * lit;
      s += `<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="9" fill="#B9C1FF" opacity="${f2(0.45 * oo)}" filter="url(#b4)"/><circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="4.5" fill="#fff" opacity="${f2(oo)}"/>`;
    }
  }
  return s;
}
const runDots = (T, t0, speed = 0.62, n = 3) => {
  if (T < t0) return [];
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = ((T - t0) * speed + i / n) % 1;
    out.push([t, Math.sin(Math.PI * t) ** 0.6 * E(T, t0, 0.25)]);
  }
  return out;
};

export function autoPanel2(T) {
  const lw = [250, 228, 256, 204, 150];
  // timings
  const run = T >= T_RUN;
  const d = E(T, T_DRAFT, 0.82, 'smooth');
  const sendFill = E(T, 20.98, 0.28, 'smooth'), sendPop = pop(T, 20.98, { dur: 0.4, over: 0.08 });
  const flow3 = E(T, 21.0, 0.3, 'smooth');
  const cardIn = pop(T, 21.08, { dur: 0.5, over: 0.04 }), cardOp = E(T, 21.08, 0.18);
  const lit3 = E(T, 21.04, 0.3, 'smooth');
  const refill = E(T, T_QUIET, 0.4, 'smooth');
  const done = refill >= 0.98;
  const badge = pop(T, 21.66, { dur: 0.4, over: 0.1 });
  const adv = pop(T, 21.74, { dur: 0.4, over: 0.05 });
  const ringCol = mixHex('#ffd9c8', '#B9C1FF', refill);
  const frameLit = E(T, 21.55, 0.25);

  let s = `<rect x="240" y="160" width="1440" height="760" rx="32" fill="rgba(97,114,243,.08)" stroke="rgba(185,193,255,.28)" stroke-width="1" filter="url(#shCard60)"/>`;
  s += `<rect x="240" y="160" width="1440" height="760" rx="32" fill="none" stroke="rgba(185,193,255,.30)" stroke-width="1.5" stroke-dasharray="7 9" stroke-dashoffset="${f2(-DASH(T) * 1.6)}"/>`;
  s += K.miniCube(300, 222, 1.3) + TXT(340, 234, 'Quote follow-ups', { f: 'i', sz: 34, w: 500 });
  s += K.pill(1620, 200, 'Running', { right: true, sz: 24, dot: C.green, ring: run ? ((T - T_RUN) / 1.2) % 1 : undefined });
  s += `<line x1="270" y1="280" x2="1650" y2="280" stroke="rgba(255,255,255,.09)"/>`;
  const head = s;
  s = '';
  // stage 1: the queue of open quotes; the queue advances once the front quote is settled
  const a1 = [386 - 8 * adv, 396 - 8 * adv], a2 = [402 - 16 * adv, 412 - 16 * adv];
  s += `<g opacity="${f2(0.28 + 0.22 * adv)}"><rect x="${f2(a2[0])}" y="${f2(a2[1])}" width="300" height="400" rx="24" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)"/></g>`;
  s += `<g opacity="${f2(0.5)}"><rect x="${f2(a1[0])}" y="${f2(a1[1])}" width="300" height="400" rx="24" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)"/></g>`;
  if (adv > 0.01) s += `<g opacity="${f2(0.28 * Math.min(1, adv))}"><rect x="418" y="428" width="300" height="400" rx="24" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)"/></g>`;
  let c = `<rect x="370" y="380" width="300" height="400" rx="24" fill="#151D3D" stroke="${mixHex('#3a4160', '#6f7bd0', frameLit)}" stroke-width="1.2"/>`;
  c += K.tile(422, 432, 56, 'doc', { is: 0.82 }) + K.bar(462, 418, 120, 12, 'rgba(255,255,255,.30)') + K.bar(462, 440, 80, 10);
  [500, 536, 572].forEach((y, n) => { c += K.bar(394, y, [170, 140, 160][n], 12) + K.bar(600, y, 46, 12); });
  c += `<line x1="394" y1="610" x2="646" y2="610" stroke="rgba(255,255,255,.10)"/>`;
  c += TXT(394, 652, '€', { f: 'i', sz: 28, w: 500, fill: C.muted }) + K.bar(600, 640, 46, 14, 'rgba(185,193,255,.55)');
  c += K.timer(420, 724, 22, mix(0.4, 1, refill), ringCol);
  c += K.pill(458, 706, 'Open', { sz: 22 });
  s += c;
  if (badge > 0.01) {
    s += `<g transform="translate(646,404) scale(${f2(badge)}) translate(-646,-404)"><circle cx="646" cy="404" r="20" fill="#6172F3"/>${K.icon('check', 646, 404, 0.9, { c: '#fff', sw: 3 })}</g>`;
    const rp = E(T, 21.66, 0.55, 'out');
    if (rp < 0.98) s += `<circle cx="646" cy="404" r="${f2(20 + 56 * rp)}" fill="none" stroke="#B9C1FF" stroke-width="${f2(3 * (1 - rp) + 0.5)}" opacity="${f2(0.7 * (1 - rp))}"/>`;
  }
  // stage 2: the follow-up drafts itself
  s += flow2([676, 580], [800, 580], { lit: mix(0.15, 1, E(T, T_RUN - 0.05, 0.3)), dots: runDots(T, T_RUN) });
  let g = `<rect x="806" y="380" width="308" height="400" rx="24" fill="#151D3D" stroke="rgba(185,193,255,.45)" stroke-width="1.2"/>`;
  g += K.tile(858, 432, 56, 'sparkle', { fill: 'rgba(185,193,255,.2)', stroke: '#B9C1FF', ic: '#CDD3FF', is: 0.82, glow: d > 0 && d < 1 ? 'rgba(97,114,243,.6)' : null });
  g += K.bar(898, 418, 140, 12, 'rgba(255,255,255,.30)') + K.bar(898, 440, 90, 10);
  let rem = d * lw.reduce((a, b) => a + b, 0), cx = 830, cy = 500;
  lw.forEach((wd, n) => {
    const y = 500 + n * 34, ww = Math.max(0, Math.min(wd, rem)); rem -= wd;
    g += `<rect x="830" y="${y}" width="${wd}" height="12" rx="6" fill="rgba(255,255,255,.06)"/>`;
    if (ww > 0) { g += K.bar(830, y, ww, 12, 'rgba(223,230,243,.72)'); cx = 830 + ww; cy = y; }
  });
  if (d > 0 && T < 21.25) g += K.caret(cx + 6, cy - 6, 24).replace('fill="#B9C1FF"', `fill="#B9C1FF" opacity="${f2(0.65 + 0.35 * Math.sin(T * 9))}"`);
  g += `<g transform="translate(898,730) scale(${f2(1 - 0.06 * Math.sin(Math.PI * clamp01((T - 20.98) / 0.3)))}) translate(-898,-730)">` +
    `<rect x="830" y="706" width="136" height="48" rx="24" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.14)"/>` +
    `<rect x="830" y="706" width="136" height="48" rx="24" fill="#6172F3" opacity="${f2(sendFill)}"/>` + K.icon('send', 898, 730, 0.62, { c: '#F3F5FA', sw: 2.4 }) + '</g>';
  void sendPop;
  s += g;
  // stage 3: ready for the salesperson
  s += flow2([1120, 580], [1244, 666], { lit: mix(0.15, 1, flow3), dots: flow3 > 0.2 ? runDots(T, 21.0, 0.75, 2) : [] });
  s += `<g opacity="${f2(mix(0.55, 1, lit3))}"><circle cx="1400" cy="452" r="64" fill="rgba(255,255,255,.07)" stroke="${mixHex('#3a4160', '#8d99ee', lit3)}" stroke-width="1.5"/>${K.icon('person', 1400, 456, 1.7, { sw: 3 })}</g>`;
  s += `<rect x="1250" y="560" width="300" height="220" rx="24" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="7 7" stroke-dashoffset="${f2(-DASH(T))}" opacity="${f2(1 - cardOp)}"/>`;
  if (cardOp > 0.01) {
    let qc = `<rect x="1250" y="560" width="300" height="220" rx="24" fill="#151D3D" stroke="rgba(185,193,255,.55)" stroke-width="1.2" filter="url(#shLift)"/>`;
    qc += K.tile(1296, 606, 48, 'doc', { is: 0.7 }) + K.bar(1332, 594, 140, 11, 'rgba(255,255,255,.3)') + K.bar(1332, 614, 96, 9);
    qc += K.bar(1276, 650, 248, 10) + K.bar(1276, 672, 210, 10);
    qc += `<rect x="1276" y="712" width="176" height="44" rx="22" fill="#6172F3"/>` + MONO(1364, 741, 'Draft ready', { sz: 22, fill: C.text, anchor: 'middle' });
    const sh = E(T, 21.5, 0.45, 'inOut');
    if (sh > 0 && sh < 1) {
      const id = K.uid('drC'), x = 1276 + sh * 176;
      qc += `<defs><clipPath id="${id}"><rect x="1276" y="712" width="176" height="44" rx="22"/></clipPath></defs><rect x="${f2(x - 25)}" y="700" width="50" height="70" fill="#fff" opacity=".28" transform="skewX(-20)" transform-origin="${f2(x)} 734" clip-path="url(#${id})"/>`;
    }
    qc += `<circle cx="1500" cy="734" r="22" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)"/>` + K.icon('send', 1501, 734, 0.5, { sw: 2.2 });
    s += `<g opacity="${f2(cardOp)}" transform="translate(${f2((1 - cardIn) * 150)},0)">${qc}</g>`;
  }
  void done;
  // alive: a soft light sweeps across the glass, the stages float a little (never a still frame)
  const sx = 240 - 300 + (((T * 0.36) % 1) * 2040), sid = K.uid('swp'), cid = K.uid('swc');
  const sweep = `<defs><linearGradient id="${sid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B9C1FF" stop-opacity="0"/><stop offset=".5" stop-color="#B9C1FF" stop-opacity=".10"/><stop offset="1" stop-color="#B9C1FF" stop-opacity="0"/></linearGradient><clipPath id="${cid}"><rect x="240" y="160" width="1440" height="760" rx="32"/></clipPath></defs>` +
    `<g clip-path="url(#${cid})"><rect x="${f2(sx)}" y="150" width="300" height="780" fill="url(#${sid})" transform="skewX(-18)" transform-origin="${f2(sx)} 540"/></g>`;
  return head + sweep + `<g transform="translate(0,${f2(drift(T, 3.2, 3.5))})">${s}</g>`;
}
