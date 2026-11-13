/* A_shared: builder A's shared helpers (B1 + B2): animated card bodies, card transforms, the card -> wire-block
   morph (one pure function of T, drawn identically by B1 and B2 so the seam cannot jump) and the app slab. */
import * as K from '../engine/kit.js';
import { E, pop, drift, mix, clamp01, DASH } from '../engine/anim.js';

const { bar, tile, pill, timer, shell, caret, T: TXT, C, f2, pts, P } = K;
export const CW = 520, CH = 320;
export const MORPH0 = 5.05;           // the cards start to flatten
export const WORLD_DASH = { w: { wire: 1 }, dash: '3 4', wireOp: 0.55 };

/* ---------- small helpers ---------- */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const hexMix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], p))).join(',')})`; };
/* track(T, init, [[t, value, dur], ...]): a value that eases from key to key. */
export const track = (T, init, keys) => { let v = init; for (const [t, to, d] of keys) v = mix(v, to, E(T, t, d, 'inOut')); return v; };

/* ---------- where each card is at T (drift + focus) ---------- */
const BASE = {
  QUOTE: { cx: 690, cy: 330, rot: -2, ph: 0.0 }, ENQUIRY: { cx: 1250, cy: 350, rot: 2, ph: 1.7 },
  HOURS: { cx: 700, cy: 762, rot: 1.5, ph: 3.1 }, REPORT: { cx: 1244, cy: 768, rot: -1.5, ph: 4.6 },
};
export const mt = (T) => pop(T, MORPH0, { dur: 0.95, over: 0.03 });   // morph progress (0 -> 1, tiny overshoot)
export function cardState(type, T) {
  const b = BASE[type];
  const dm = Math.max(0, 1 - mt(T));                                   // the drift settles as the card lies down
  let s = 1, dx = 0, dy = 0, op = 1;
  if (type === 'QUOTE') {
    const w = pop(T, 0.05, { dur: 0.65, over: 0.03 }) * (1 - E(T, 1.7, 0.7, 'inOut'));
    s = 1 + 0.18 * w; dx = 170 * w; dy = 105 * w;
    op = track(T, 1, [[1.7, 0.55, 0.6], [4.9, 1, 0.25]]);
  } else if (type === 'ENQUIRY') {
    s = 1 + 0.04 * pop(T, 1.7, { dur: 0.7, over: 0.03 }) * (1 - E(T, 3.45, 0.5));
    op = track(T, 1, [[0.05, 0.28, 0.55], [1.7, 1, 0.5], [3.5, 0.55, 0.5], [4.9, 1, 0.25]]);
  } else if (type === 'HOURS') {
    s = 1 + 0.06 * pop(T, 3.45, { dur: 0.65, over: 0.03 }) * (1 - E(T, 4.95, 0.3));
    op = track(T, 1, [[0.05, 0.28, 0.55], [1.7, 0.55, 0.5], [3.45, 1, 0.5]]);
  } else {
    op = track(T, 1, [[0.05, 0.28, 0.55], [1.7, 0.55, 0.5], [4.9, 1, 0.25]]);
  }
  return {
    cx: b.cx + dx + drift(T, 3.76, 6, b.ph) * dm, cy: b.cy + dy + drift(T, 3.76, 6, b.ph + 1.3) * dm,
    rot: b.rot + drift(T, 3.76, 1.5, b.ph + 2.1) * dm, s, op,
  };
}
/* local card point (0..520, 0..320) -> screen */
export function loc(type, T, lx, ly) {
  const c = cardState(type, T), a = (c.rot * Math.PI) / 180;
  const x = (lx - CW / 2) * c.s, y = (ly - CH / 2) * c.s;
  return [c.cx + x * Math.cos(a) - y * Math.sin(a), c.cy + x * Math.sin(a) + y * Math.cos(a)];
}

/* ---------- animated card bodies ---------- */
const TRACE_FIN = (i) => Math.max(3, 40 * Math.exp(-i / 6) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7))));
export function quoteBody(T, out = 1) {
  const q = E(T, 0.62, 0.85, 'smooth');
  const col = hexMix('#B9C1FF', '#f3a585', E(T, 0.62, 0.6));
  let c = tile(64, 64, 64, 'doc', { is: 0.95 });
  c += bar(112, 46, 170, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 110, 11);
  c += pill(488, 40, 'Open', { right: true, sz: 22 });
  [[128, 230], [166, 190], [204, 212]].forEach(([y, w]) => { c += bar(34, y, w, 12) + bar(420, y, 66, 12); });
  c += `<line x1="34" y1="240" x2="486" y2="240" stroke="rgba(255,255,255,.10)"/>`;
  c += timer(60, 280, 22, mix(0.72, 0.1, q), col) + bar(98, 274, 130, 12);
  c += TXT(392, 291, '€', { f: 'i', sz: 30, w: 500, fill: C.muted }) + bar(418, 278, 68, 16, 'rgba(185,193,255,.55)');
  const qq = E(T, 0.9, 0.4);
  let ov = `<rect x="430" y="-34" width="104" height="52" rx="26" fill="#1A2350" stroke="rgba(185,193,255,.5)" stroke-width="1.2" opacity="${f2(1 - qq)}"/>
    <rect x="430" y="-34" width="104" height="52" rx="26" fill="rgba(11,18,32,.6)" stroke="rgba(223,230,243,.3)" stroke-width="1.2" stroke-dasharray="5 5" opacity="${f2(qq)}"/>`;
  [0.95, 0.65, 0.38].forEach((o, n) => { ov += `<circle cx="${458 + n * 24}" cy="-8" r="6" fill="#F3F5FA" opacity="${f2(mix(o, 0.1, E(T, 0.62 + 0.12 * n, 0.3)))}"/>`; });
  // activity trace under the card: alive, then it decays left to right to a flat line
  const tr = E(T, 0.45, 0.3);
  for (let i = 0; i < 30; i++) {
    const d = E(T, 0.62 + i * 0.015, 0.42, 'inOut');
    const alive = 14 + 22 * Math.abs(Math.sin(i * 0.9 + T * 5));
    const h = mix(alive, TRACE_FIN(i), d);
    const fc = i < 9 ? '#B9C1FF' : 'rgba(223,230,243,.5)';
    ov += `<rect x="${f2(30 + i * 15.6)}" y="${f2(372 - h / 2)}" width="6" height="${f2(h)}" rx="3" fill="${d > 0.5 ? fc : '#B9C1FF'}" opacity="${f2(tr * out * mix(0.9, Math.max(0.3, 1 - i / 14), d))}"/>`;
  }
  const shellFill = hexMix('#161F3F', '#121A35', q);
  return shell(CW, CH, { fill: shellFill, stroke: `rgba(255,255,255,${f2(mix(0.14, 0.10, q))})` }) +
    `<g opacity="${f2(1 - 0.3 * q)}">${c}</g><g opacity="${f2(out)}">${ov}</g>`;
}

const MSG_T = [1.80, 1.95, 2.08, 2.20, 2.35, 2.52, 2.70];
const SPOTS = [[372, 236, -4], [352, 190, 5], [380, 146, -6], [346, 100, 4], [376, 54, -3], [356, 8, 6], [372, -38, -5]];
export function enquiryBody(T, out = 1) {
  let c = tile(64, 64, 64, 'chat', { is: 0.95 });
  c += bar(112, 46, 150, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 96, 11);
  const oc = E(T, 2.2, 0.35);
  [[132, 210, 120], [192, 170, 96], [252, 196, 140]].forEach(([y, w1, w2], n) => {
    c += `<circle cx="52" cy="${y + 10}" r="16" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.16)"/>`;
    c += bar(82, y, w1, 12, 'rgba(255,255,255,.26)') + bar(82, y + 20, w2, 10);
    const dp = n === 0 ? 1 : pop(T, 2.2 + 0.12 * (n - 1), { dur: 0.35, over: 0.1 });
    if (dp > 0) c += `<circle cx="478" cy="${y + 10}" r="${f2(7 * dp)}" fill="${hexMix('#B9C1FF', '#FF5A1F', n === 0 ? oc : 1)}"/>`;
  });
  let p = '';
  MSG_T.forEach((t0, i) => {
    const [cx, cy, rot] = SPOTS[i];
    const a = pop(T, t0, { dur: 0.5, over: 0.06 });
    if (a <= 0) return;
    const o = E(T, t0, 0.22, 'out') * out;
    const y = cy - (1 - a) * 90 + 2 * Math.sin(T * 2.1 + i * 1.3) * E(T, t0 + 0.5, 0.4);
    const dp = pop(T, t0 + 0.18, { dur: 0.35, over: 0.1 });
    p += `<g transform="translate(${cx},${f2(y)}) rotate(${rot})" opacity="${f2(o)}" filter="url(#shLift)"><rect x="-112" y="-30" width="224" height="60" rx="16" fill="#18213F" stroke="rgba(255,255,255,.16)"/>
      <circle cx="-82" cy="0" r="13" fill="rgba(255,255,255,.12)"/>${bar(-60, -12, 110, 10, 'rgba(255,255,255,.28)')}${bar(-60, 4, 76, 8)}
      <circle cx="86" cy="0" r="${f2(6.5 * dp)}" fill="#FF5A1F"/></g>`;
  });
  return shell(CW, CH) + c + p;
}

/* the hand's two targets, in local card coordinates, and when the fingertip is deepest */
export const L1 = [210, 212], L2 = [366, 190];
export const CLICK1 = 3.55, CLICK2 = 4.62, DEEP = 0.11;   // lead: click 2 moved from 4.50 so its 156 px glide is not compressed (handcheck)
export function hoursBody(T, out = 1) {
  const t1 = CLICK1 + DEEP, t2 = CLICK2 + DEEP;
  let c = tile(64, 64, 64, 'clock', { is: 0.95 });
  c += bar(112, 46, 120, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 80, 11);
  const filled = new Set(['0,0', '1,0', '2,0', '0,1', '1,1', '3,1', '0,2', '2,2', '3,2', '4,2', '1,3']);
  for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) {
    let f = filled.has(`${q},${r}`);
    let fill = f ? 'rgba(97,114,243,.5)' : 'rgba(255,255,255,.04)', stroke = f ? 'rgba(185,193,255,.55)' : 'rgba(255,255,255,.16)';
    if (r === 2) {   // the row is typed in by hand: each cell lights up in turn, then settles
      const k = Math.sin(Math.PI * E(T, t1 + 0.05 + q * 0.09, 0.4, 'inOut'));
      fill = hexMix(f ? '#6172F3' : '#10172E', '#B9C1FF', k * 0.7); stroke = hexMix('#B9C1FF', '#FFFFFF', k);
      if (f) fill = fill.replace('rgb', 'rgba').replace(')', `,${f2(mix(0.5, 0.9, k))})`);
    }
    c += `<rect x="${34 + q * 40}" y="${116 + r * 40}" width="32" height="32" rx="8" fill="${fill}" stroke="${stroke}"/>`;
  }
  let zig = 'M300,34 H488 V282'; for (let i = 0; i < 8; i++) zig += ` l-11.75,${i % 2 ? 10 : -10}`; zig += ' Z';
  c += `<path d="${zig}" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)" stroke-width="1"/>`;
  c += K.icon('invoice', 334, 70, 0.7) + bar(360, 64, 90, 12, 'rgba(255,255,255,.28)');
  const typed = E(T, t2, 0.32, 'smooth'), typed2 = E(T, t2 + 0.26, 0.16, 'smooth');
  [116, 150, 184, 218].forEach((y, n) => {
    if (n === 2) {
      c += `<rect x="318" y="${y}" width="96" height="12" rx="6" fill="none" stroke="rgba(255,255,255,.2)" stroke-dasharray="4 4" opacity="${f2(1 - typed)}"/>`;
      if (typed > 0) c += bar(318, y, 96 * typed, 12, 'rgba(223,230,243,.7)') + (typed2 > 0 ? bar(436, y, 34 * typed2, 12, 'rgba(255,255,255,.22)') : '');
      return;
    }
    c += bar(318, y, 96, 12) + bar(436, y, 34, 12);
  });
  c += TXT(318, 262, '€', { f: 'i', sz: 26, w: 500, fill: C.muted }) + bar(436, 250, 34, 14, 'rgba(185,193,255,.5)');
  // click 1: the timesheet row outlines; a dashed arrow draws to the invoice; a light trail runs along it
  const o1 = pop(T, t1, { dur: 0.4, over: 0.06 });
  if (o1 > 0) c += `<g transform="translate(133,212) scale(${f2(mix(0.96, 1, clamp01(o1)))}) translate(-133,-212)" opacity="${f2(clamp01(o1))}"><rect x="28" y="190" width="210" height="44" rx="12" fill="rgba(185,193,255,.07)" stroke="#B9C1FF" stroke-width="2"/></g>`;
  const ap = E(T, t1 + 0.2, 0.5, 'inOut');
  if (ap > 0) {
    const id = K.uid('ar');
    c += `<clipPath id="${id}"><rect x="238" y="170" width="${f2(70 * ap)}" height="60"/></clipPath><g clip-path="url(#${id})" opacity="${f2(1 - E(T, t2 + 0.4, 0.4))}"><path d="M240,212 C268,212 278,196 300,192" fill="none" stroke="#B9C1FF" stroke-width="2" stroke-dasharray="5 5"/><path d="M292,186 L302,192 L293,199" fill="none" stroke="#B9C1FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    // comet: a light trail behind a spark running along the arrow (B1's flourish)
    const cp = E(T, t1 + 0.25, 0.7, 'inOut'), cop = Math.sin(Math.PI * clamp01(cp));
    const bz = (u) => { const a = [240, 212], b = [268, 212], d = [278, 196], e = [300, 192], m = 1 - u; return [m * m * m * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * d[0] + u * u * u * e[0], m * m * m * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * d[1] + u * u * u * e[1]]; };
    if (cop > 0.01) for (let k = 7; k >= 0; k--) { const [x, y] = bz(clamp01(cp - k * 0.045)); c += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(5 - k * 0.45)}" fill="#DDE1FF" opacity="${f2(cop * (1 - k / 8) * 0.9)}"/>`; }
  }
  // click 2: the invoice line is typed again, with a caret
  const o2 = pop(T, t2, { dur: 0.4, over: 0.06 });
  if (o2 > 0) c += `<g transform="translate(395,190) scale(${f2(mix(0.96, 1, clamp01(o2)))}) translate(-395,-190)" opacity="${f2(clamp01(o2))}"><rect x="308" y="174" width="176" height="32" rx="10" fill="rgba(185,193,255,.07)" stroke="#B9C1FF" stroke-width="2"/></g>`;
  if (T > t2 - 0.02) c += `<g opacity="${f2(0.55 + 0.45 * Math.sin(T * 9))}">${caret(318 + 96 * typed + 4 + 34 * typed2, 178, 24)}</g>`;
  // click 1 caret on the row
  if (T > t1 && T < t2 - 0.1) c += `<g opacity="${f2((0.55 + 0.45 * Math.sin(T * 9)) * E(T, t1 + 0.4, 0.2))}">${caret(232, 200, 24)}</g>`;
  // ripples where the fingertip lands
  [[t1, L1], [t2, L2]].forEach(([t, [x, y]]) => {
    const u = E(T, t, 0.6, 'out');
    if (u > 0 && u < 1) c += `<circle cx="${x}" cy="${y}" r="${f2(6 + 34 * u)}" fill="none" stroke="#DDE1FF" stroke-width="2" opacity="${f2(0.7 * (1 - u))}"/>`;
  });
  return shell(CW, CH) + c;
}

export function reportBody(T) {
  let c = tile(64, 64, 64, 'chart', { is: 0.95 });
  c += bar(112, 46, 140, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 90, 11);
  [64, 96, 80, 124, 104, 150].forEach((h0, n) => {
    const h = h0 * (1 + 0.05 * Math.sin(T * 1.6 + n * 0.9));
    c += `<rect x="${40 + n * 46}" y="${f2(292 - h)}" width="30" height="${f2(h)}" rx="6" fill="url(#barV)" opacity=".8"/>`;
  });
  c += `<line x1="34" y1="294" x2="312" y2="294" stroke="rgba(255,255,255,.18)"/>`;
  for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) {
    c += `<rect x="${340 + q * 50}" y="${126 + r * 34}" width="46" height="28" rx="5" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)"/>`;
    if ((r + q) % 2 === 0) c += bar(348 + q * 50, 136 + r * 34, 26, 8, 'rgba(255,255,255,.22)');
  }
  return shell(CW, CH) + c;
}
const BODY = { QUOTE: quoteBody, ENQUIRY: enquiryBody, HOURS: hoursBody, REPORT: reportBody };
export const body = (type, T, out) => BODY[type](T, out);

/* ---------- live cards (before the morph) ---------- */
export function liveCard(type, T, out = 1) {
  const c = cardState(type, T);
  return `<g opacity="${f2(c.op)}" filter="url(#shCard)"><g transform="translate(${f2(c.cx)},${f2(c.cy)}) rotate(${f2(c.rot)}) scale(${f2(c.s)}) translate(${-CW / 2},${-CH / 2})">${body(type, T, out)}</g></g>`;
}
export const LIVE_ORDER = ['HOURS', 'REPORT', 'ENQUIRY', 'QUOTE'];

/* ---------- the morph: cards lie down on four wire blocks while the world draws itself ---------- */
const WORLD_ORDER = K.BLOCKS.slice().sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2]);
export function wireWorld(T, extra = {}) {
  const blocks = {};
  WORLD_ORDER.forEach(([c, r, k], i) => {
    const p = E(T, MORPH0 + 0.05 + i * 0.052, 0.6, 'smooth');
    blocks[`${c},${r},${k}`] = p <= 0 ? null : { prog: p };
  });
  return K.world({ def: { ...WORLD_DASH, dashOff: DASH(T) }, blocks, ...extra });
}
function rotCorners(cx, cy, w, h, deg) { return K.rotRectCorners(cx, cy, w, h, deg); }
export function morphCard(type, T) {
  const c = cardState(type, T), m = mt(T);
  const from = rotCorners(c.cx, c.cy, CW * c.s, CH * c.s, c.rot);
  const [bc, br, bk] = K.CARD_BLOCK[type];
  const to = K.topFaceCardOrder(bc, br, bk);
  const q = from.map((p, n) => K.lerpP(p, to[n], m));
  const contentOp = 1 - 0.82 * E(T, MORPH0, 0.6) - 0.18 * E(T, 6.0, 0.5);
  const alpha = c.op * (1 - E(T, 6.0, 0.55));
  const out = 1 - E(T, MORPH0, 0.3);
  const inner = `<rect x="0" y="0" width="${CW}" height="${CH}" rx="26" fill="#141C3B" opacity="${f2(Math.min(1, 0.4 + contentOp))}"/><g opacity="${f2(contentOp)}">${body(type, T, out)}</g>` +
    `<rect x="0" y="0" width="${CW}" height="${CH}" rx="26" fill="rgba(185,193,255,.06)" stroke="rgba(185,193,255,.6)" stroke-width="1.4" vector-effect="non-scaling-stroke" opacity="${f2(E(T, MORPH0, 0.45))}"/>`;
  return `<g opacity="${f2(alpha)}" filter="url(#shCard)"><g transform="${K.affine(q[0], q[1], q[3], CW, CH)}">${inner}</g></g>`;
}
export function morphLayer(T, worldExtra = {}) {
  let s = wireWorld(T, worldExtra);
  if (T < 6.6) for (const t of LIVE_ORDER) s += morphCard(t, T);
  return s;
}

/* ---------- the generic app slab (copy of K.appSlab with a shadow strength and a sideways offset) ---------- */
export function appSlab(drop = 0, dx = 0, shadow = 1) {
  const dy = -drop;
  const L = (i, j, h) => { const p = P(i, j, h); return [p[0] + dx, p[1] + dy]; };
  let s = `<polygon points="${pts([P(0, 0, 1), P(3, 0, 1), P(3, 3, 1), P(0, 3, 1)].map((p) => [p[0] + dx * 0.6, p[1] + 34]))}" fill="#000" opacity="${f2(0.28 * shadow)}" filter="url(#b15)"/>`;
  const top = [L(0, 0, 3), L(3, 0, 3), L(3, 3, 3), L(0, 3, 3)];
  const left = [L(0, 3, 3), L(3, 3, 3), L(3, 3, 2.7), L(0, 3, 2.7)];
  const right = [L(3, 3, 3), L(3, 0, 3), L(3, 0, 2.7), L(3, 3, 2.7)];
  s += `<polygon points="${pts(left)}" fill="rgba(140,148,166,.42)"/><polygon points="${pts(right)}" fill="rgba(160,168,186,.48)"/>`;
  const app = `<rect x="0" y="0" width="600" height="600" rx="26" fill="rgba(176,183,200,.40)" stroke="rgba(220,225,236,.75)" stroke-width="2"/>
    <rect x="0" y="0" width="600" height="70" rx="26" fill="rgba(210,215,228,.30)"/><circle cx="40" cy="35" r="10" fill="rgba(235,238,245,.7)"/><circle cx="72" cy="35" r="10" fill="rgba(235,238,245,.5)"/><circle cx="104" cy="35" r="10" fill="rgba(235,238,245,.35)"/>
    <rect x="24" y="96" width="120" height="480" rx="16" fill="rgba(220,225,236,.18)"/>
    ${[0, 1, 2].map((r) => [0, 1, 2].map((q) => `<rect x="${172 + q * 140}" y="${96 + r * 164}" width="120" height="140" rx="18" fill="rgba(220,225,236,.24)" stroke="rgba(235,238,245,.35)"/>`).join('')).join('')}`;
  s += `<g transform="${K.affine(top[0], top[1], top[3], 600, 600)}">${app}</g>`;
  return s;
}
