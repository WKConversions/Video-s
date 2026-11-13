/* A_shared (round 2): builder A's scene for B1 + B2 (0.00-8.60) as ONE pure function of T, so the B1/B2 cut cannot jump.
   B1: three lines are TYPED (SaaS type-on, gradient keyword) and each one TRANSFORMS into its UI, which grows out of
   the words (no UI around the text). B2: the company's work becomes five tiles of their own shapes; a generic
   off-the-shelf template slides in beside them, the tiles try to slot into it and do not fit; it slides away and the
   tiles become uniform and settle EXACTLY on seamAB(8.60). */
import * as K from '../engine/kit.js';
import { E, mix, clamp01, spring, bounceIn, bezier, drift, DASH, BOUNCY, SNAPPY } from '../engine/anim.js';
import { SEAM_AB_TILES, seamAB } from './seams.js';

const { bar, f2, T: TXT, icon, tile, pill, timer, measure, NS } = K;
const DOCKCFG = { stiffness: 210, damping: 20 };

/* ---------- small helpers ---------- */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const hexMix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], p))).join(',')})`; };
const mixA = (a, b, p) => a.map((v, i) => mix(v, b[i], p));
const rgba = (a) => `rgba(${a.map((v, i) => (i < 3 ? Math.round(v) : f2(v))).join(',')})`;
/* an Apple pop-in group */
const popG = (T, t0, cx, cy, inner, o = {}) => {
  if (T <= t0) return '';
  const b = bounceIn(T, t0, { cfg: o.cfg || BOUNCY, from: o.from ?? 0.7, rise: o.rise ?? 12, fade: o.fade ?? 0.1 });
  const op = b.op * (o.op ?? 1);
  if (op <= 0.001) return '';
  return `<g opacity="${f2(op)}" transform="translate(${f2(cx)},${f2(cy + b.y)}) scale(${f2(b.s)}) translate(${f2(-cx)},${f2(-cy)})">${inner}</g>`;
};

/* ---------- type-on text, laid out in CARD-LOCAL coordinates (card centred at 960,540 -> local = screen - (700,380)) ---------- */
const FS = 112, LS = -0.02 * FS, BASEL = 195, BASE_SCREEN = 575;
const wcache = new Map();
const mw = (s) => { let v = wcache.get(s); if (v == null) { v = K.measure(s, { f: 'h', sz: FS, w: 500, ls: LS }); wcache.set(s, v); } return v; };
const mk = (words, shift = 0) => {
  const full = words.map((x) => x[0]).join(''), W = mw(full), x0 = 960 - W / 2;
  const chars = []; let i = 0;
  for (const [txt, s, e, grp, kw] of words) {
    for (let j = 0; j < txt.length; j++) {
      chars.push({ ch: txt[j], xl: x0 - 700 + mw(full.slice(0, i + j)), w: mw(txt[j]), tc: s + shift + (j / txt.length) * (e - s) * 0.9, grp, kw: !!kw });
    }
    i += txt.length;
  }
  return { chars, W, x0l: x0 - 700, t0: words[0][1] + shift, t1: words[words.length - 1][2] + shift };
};
let _LN = null;
const lines = () => _LN || (_LN = {
  L1: mk([['Quotes ', 0.00, 0.40, 'A'], ['go ', 0.40, 0.62, 'A'], ['quiet', 0.62, 1.04, 'B', 1], ['.', 1.04, 1.08, 'B']], -0.04),
  L2: mk([['Enquiries ', 1.76, 2.18, 'A'], ['pile ', 2.18, 2.64, 'B', 1], ['up', 2.64, 2.88, 'B', 1], ['.', 2.88, 2.92, 'B']]),
  L3: mk([['Hours ', 3.50, 3.78, 'A'], ['get ', 3.78, 4.04, 'A'], ['typed ', 4.04, 4.28, 'A'], ['in ', 4.28, 4.50, 'A'], ['twice', 4.50, 4.82, 'B', 1], ['.', 4.82, 4.86, 'B']]),
});
export const TYPING = [[-0.04, 1.04], [1.76, 2.92], [3.50, 4.86]];
const gx = (ln, grp) => { const c = ln.chars.filter((q) => q.grp === grp && q.ch !== ' '); return [Math.min(...c.map((q) => q.xl)), Math.max(...c.map((q) => q.xl + q.w))]; };
const grad = (T, id, x, wd, t0, t1) => {
  const L = Math.max(wd * 1.6, 260);
  const ph = Math.min(Math.max(T - t0, 0), t1 - t0) * L * 1.8 + Math.max(0, T - t1) * L * 0.45;
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f2(x)}" y1="0" x2="${f2(x + L)}" y2="0" spreadMethod="repeat" gradientTransform="translate(${f2(ph)},0)">` +
    `<stop offset="0" stop-color="#6172F3"/><stop offset=".34" stop-color="#B9C1FF"/><stop offset=".67" stop-color="#ffd9c8"/><stop offset="1" stop-color="#6172F3"/></linearGradient>`;
};
/* lead: while a line types, it stays centred (the typed part re-centres as each character arrives, like a SaaS hero
   type-on); once the line is complete the shift is 0, so the transforms after it are unchanged. */
function lineShift(T, ln) {
  if (T > ln.t1 + 0.2) return 0;
  let w = 0;
  for (const c of ln.chars) w += c.w * clamp01((T - c.tc) / 0.09);
  return Math.max(0, (ln.W - w) / 2) * (1 - E(T, ln.t1, 0.15));
}
/* the typed characters of one group (each with its own little spring), in local coordinates */
function chars(T, ln, grp, gid, skip) {
  let s = '';
  const sh = lineShift(T, ln);
  for (const c of ln.chars) {
    if (c.grp !== grp || c.ch === ' ' || (skip && skip(c))) continue;
    const b = bounceIn(T, c.tc, { cfg: SNAPPY, from: 0.85, rise: 14, fade: 0.07 });
    if (b.op <= 0) continue;
    const cx = c.xl + sh + c.w / 2, cy = BASEL - 42;
    s += `<g opacity="${f2(b.op)}" transform="translate(${f2(cx)},${f2(cy + b.y)}) scale(${f2(b.s)}) translate(${f2(-cx)},${f2(-cy)})">${TXT(c.xl + sh, BASEL, c.ch, { f: 'h', sz: FS, w: 500, fill: c.kw && gid ? `url(#${gid})` : '#F3F5FA' })}</g>`;
  }
  return s;
}
function caretMk(T, ln, fadeAt) {
  if (T < ln.t0 - 0.12 || T > fadeAt + 0.1) return '';
  const done = ln.chars.filter((c) => c.tc <= T);
  const last = done[done.length - 1];
  const x = (last ? last.xl + last.w : ln.x0l) + lineShift(T, ln);
  const typing = T < ln.t1 + 0.05;
  const op = (typing ? 1 : 0.55 + 0.45 * Math.sin(T * 9)) * (1 - E(T, fadeAt - 0.05, 0.1)) * clamp01((T - (ln.t0 - 0.12)) / 0.08);
  if (op <= 0.01) return '';
  return `<rect x="${f2(x + 3)}" y="${BASEL - 88}" width="5" height="104" rx="2.5" fill="#B9C1FF" opacity="${f2(op)}"/>`;
}
/* group A (the plain words) contracts into the card's title */
function titleXf(ln, p) {
  const x0 = ln.chars[0].xl, sc = 30 / FS;
  const s = mix(1, sc, p), ax = mix(0, 112 - sc * x0, p), ay = mix(0, 58 - sc * BASEL, p);
  return `translate(${f2(ax)},${f2(ay)}) scale(${f2(s)})`;
}
/* the card's shell grows out of the line's text box */
function shellRect(T, t0, ln) {
  if (T <= t0) return '';
  const p = spring(T, t0, BOUNCY), pw = E(T, t0 + 0.06, 0.4, 'inOut');
  const tx0 = ln.x0l - 44, tw = ln.W + 88, ty0 = BASEL - 92, th = 134;
  const x = mix(tx0, 0, pw), y = mix(ty0, 0, p), w = Math.max(40, mix(tw, 520, pw)), h = Math.max(40, mix(th, 320, p));
  return `<rect x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" rx="${f2(mix(66, 26, clamp01(pw)))}" fill="#161F3F" fill-opacity="${f2(clamp01((T - t0) / 0.14))}" stroke="rgba(255,255,255,${f2(0.14 * clamp01((T - t0) / 0.14))})" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
}

/* ---------- the three UI cards (local 520 x 320) ---------- */
const cardXf = (st) => `translate(${f2(st.cx)},${f2(st.cy)}) scale(${f2(st.s)}) translate(-260,-160)`;
const DOCK = { quote: [200, 190, 0.6], enq: [200, 395, 0.6] }, ACT = 1.3;
export function cardState(key, T) {
  if (key === 'quote') {
    const m = spring(T, 1.62, DOCKCFG), d = E(T, 2.1, 0.5), sA = mix(1, ACT, spring(T, 1.18, BOUNCY));
    return { cx: mix(960, DOCK.quote[0], m) + drift(T, 3.76, 3, 0.4) * d, cy: mix(540, DOCK.quote[1], m) + drift(T, 3.76, 3.5, 1.7) * d, s: mix(sA, DOCK.quote[2], m), op: 1 - 0.22 * E(T, 2.6, 0.6) };
  }
  if (key === 'enq') {
    const m = spring(T, 3.26, DOCKCFG), d = E(T, 3.8, 0.5), sA = mix(1, ACT, spring(T, 3.0, BOUNCY));
    return { cx: mix(960, DOCK.enq[0], m) + drift(T, 3.76, 3, 2.4) * d, cy: mix(540, DOCK.enq[1], m) + drift(T, 3.76, 3.5, 3.1) * d, s: mix(sA, DOCK.enq[2], m), op: 1 - 0.22 * E(T, 4.2, 0.6) };
  }
  const d = E(T, 5.3, 0.5);
  return { cx: 960 + drift(T, 3.76, 3, 4.6) * d, cy: 540 + drift(T, 3.76, 3.5, 5.2) * d, s: mix(1, ACT, spring(T, 4.94, BOUNCY)), op: 1 };
}

/* QUOTE: "quiet" becomes the timer ring, the reply dots fade one by one */
function quoteCard(T) {
  const { L1, L2, L3 } = lines();
  const [bx0, bx1] = gx(L1, 'B'), cb = [(bx0 + bx1) / 2, BASEL - 42], ringF = [60, 280];
  const pB = E(T, 1.18, 0.36, 'inOut'), sB = mix(1, 0.22, pB);
  const cpB = [mix(cb[0], ringF[0], pB), mix(cb[1], ringF[1], pB)];
  const gid = K.uid('kg');
  let s = shell(T, 1.18, L1);
  s += popG(T, 1.30, 64, 64, tile(64, 64, 64, 'doc', { is: 0.95 }));
  s += popG(T, 1.36, 160, 82, bar(112, 76, 110, 11));
  s += `<g opacity="${f2(1 - E(T, 2.05, 0.15))}">${popG(T, 1.38, 450, 56, pill(488, 40, 'Open', { right: true, sz: 22 }), { from: 0.6 })}</g>`;
  s += popG(T, 2.1, 450, 56, pill(488, 40, 'Quiet', { right: true, sz: 22, fill: 'rgba(243,165,133,.16)', stroke: 'rgba(243,165,133,.5)', tc: '#ffd9c8' }), { from: 0.6, cfg: SNAPPY });
  [[128, 230], [166, 190], [204, 212]].forEach(([y, w], k) => { s += popG(T, 1.40 + 0.05 * k, 260, y + 6, bar(34, y, w, 12) + bar(420, y, 66, 12), { from: 0.9, rise: 10 }); });
  s += popG(T, 1.5, 260, 240, `<line x1="34" y1="240" x2="486" y2="240" stroke="rgba(255,255,255,.10)"/>`, { from: 1, rise: 0 });
  s += popG(T, 1.52, 160, 281, bar(98, 275, 130, 12), { from: 0.9 }) + popG(T, 1.58, 440, 284, K.T(392, 291, '€', { f: 'i', sz: 30, w: 500, fill: K.C.muted }) + bar(418, 278, 68, 16, 'rgba(185,193,255,.55)'), { from: 0.9 });
  // the ring: grows out of the word, drains to peach
  const rp = mix(0, 1, E(T, 1.34, 0.32)), rpos = [mix(cpB[0], ringF[0], rp), mix(cpB[1], ringF[1], rp)];
  if (T > 1.34) {
    const rs = mix(0.25, 1, spring(T, 1.34, BOUNCY)), q = E(T, 1.5, 0.7, 'smooth');
    s += `<g opacity="${f2(clamp01((T - 1.34) / 0.08))}" transform="translate(${f2(rpos[0])},${f2(rpos[1])}) scale(${f2(rs)})">${timer(0, 0, 22, mix(0.72, 0.08, q), hexMix('#B9C1FF', '#f3a585', q))}</g>`;
  }
  // reply chip with three dots
  const qq = E(T, 2.1, 0.3);
  let chip = `<rect x="430" y="-34" width="104" height="52" rx="26" fill="#1A2350" stroke="rgba(185,193,255,.5)" stroke-width="1.2" opacity="${f2(1 - qq)}"/><rect x="430" y="-34" width="104" height="52" rx="26" fill="rgba(11,18,32,.6)" stroke="rgba(223,230,243,.3)" stroke-width="1.2" stroke-dasharray="5 5" opacity="${f2(qq)}"/>`;
  [0, 1, 2].forEach((n) => { chip += `<circle cx="${458 + n * 24}" cy="-8" r="6" fill="#F3F5FA" opacity="${f2(mix(0.95 - 0.28 * n, 0.1, E(T, 1.62 + 0.13 * n, 0.3)))}"/>`; });
  s += popG(T, 1.40, 482, -8, chip, { from: 0.6 });
  // the words
  s += `<g transform="${titleXf(L1, E(T, 1.24, 0.4, 'inOut'))}">${chars(T, L1, 'A')}</g>`;
  s += `<g opacity="${f2(1 - E(T, 1.40, 0.2))}" transform="translate(${f2(cpB[0] - sB * cb[0])},${f2(cpB[1] - sB * cb[1])}) scale(${f2(sB)})"><defs>${grad(T, gid, bx0, bx1 - bx0, L1.t0 + 0.6, L1.t1)}</defs>${chars(T, L1, 'B', gid)}</g>`;
  s += caretMk(T, L1, 1.22);
  return { inner: s };
}
const shell = shellRect;

/* ENQUIRIES: the letters of "pile up" drop and pile up as six notification pills */
const PILE = [[-14, -2], [16, 1.5], [-10, -1.2], [18, 2], [-16, -1.8], [8, 1]];
function enqCard(T) {
  const { L1, L2, L3 } = lines();
  const tF = 3.02, gid = K.uid('kg'), [bx0, bx1] = gx(L2, 'B');
  let s = shell(T, 3.0, L2);
  s += popG(T, 3.1, 64, 64, tile(64, 64, 64, 'chat', { is: 0.95 }));
  s += popG(T, 3.16, 160, 82, bar(112, 76, 96, 11));
  const letters = L2.chars.filter((c) => c.grp === 'B' && c.ch !== ' ' && c.ch !== '.');
  let pills = '', fall = '';
  letters.forEach((c, k) => {
    const ts = tF + 0.06 + 0.05 * k, land = ts + 0.3;
    const [ox, rot] = PILE[k], tx = 260 + ox, ty = 287 - 32 * k;
    const cx = c.xl + c.w / 2, cy = BASEL - 42;
    if (T >= ts) {
      const f = spring(T, ts, { stiffness: 140, damping: 13 }), sc = mix(1, 0.22, E(T, ts, 0.34));
      const x = mix(cx, tx, E(T, ts, 0.34, 'inOut')), y = mix(cy, ty, f);
      const op = 1 - E(T, land - 0.04, 0.12);
      if (op > 0.01) fall += `<g opacity="${f2(op)}" transform="translate(${f2(x)},${f2(y)}) scale(${f2(sc)}) translate(${f2(-cx)},${f2(-cy)})">${TXT(c.xl, BASEL, c.ch, { f: 'h', sz: FS, w: 500, fill: `url(#${gid})` })}</g>`;
    }
    const pk = `<g transform="rotate(${rot} ${tx} ${ty})"><rect x="${tx - 124}" y="${ty - 23}" width="248" height="46" rx="14" fill="#18213F" stroke="rgba(255,255,255,.18)" filter="url(#shLift)"/>` +
      `<circle cx="${tx - 98}" cy="${ty}" r="11" fill="rgba(255,255,255,.12)"/>${bar(tx - 78, ty - 11, 104 - (k % 3) * 14, 9, 'rgba(255,255,255,.28)')}${bar(tx - 78, ty + 3, 70, 7)}</g>`;
    pills += popG(T, land, tx, ty, pk, { from: 0.6, rise: 0, fade: 0.06 });
    pills += popG(T, land + 0.1, tx + 100, ty, `<circle cx="${tx + 100}" cy="${ty}" r="7" fill="#FF5A1F"/>`, { from: 0.2, rise: 0, cfg: SNAPPY });
  });
  s += pills;
  s += `<g transform="${titleXf(L2, E(T, tF + 0.06, 0.4, 'inOut'))}">${chars(T, L2, 'A')}</g>`;
  s += `<defs>${grad(T, gid, bx0, bx1 - bx0, L2.t0 + 0.4, L2.t1)}</defs>`;
  s += `<g>${chars(T, L2, 'B', gid, (c) => c.ch === '.' || T >= tF + 0.06 + 0.05 * letters.indexOf(c))}</g>`;
  s += `<g opacity="${f2(1 - E(T, tF + 0.06, 0.2))}">${chars(T, L2, 'B', gid, (c) => c.ch !== '.')}</g>`;
  s += fall;
  s += caretMk(T, L2, tF);
  return { inner: s };
}

/* HOURS: "twice" splits into two identical rows, one in the timesheet, one in the invoice */
function hoursCard(T) {
  const { L1, L2, L3 } = lines();
  const tH = 5.0, gid = K.uid('kg'), [bx0, bx1] = gx(L3, 'B'), cb = [(bx0 + bx1) / 2, BASEL - 42];
  let s = shell(T, 4.94, L3);
  s += popG(T, 5.04, 64, 64, tile(64, 64, 64, 'clock', { is: 0.95 }));
  s += popG(T, 5.10, 160, 82, bar(112, 76, 100, 11));
  const filled = new Set(['0,0', '1,0', '2,0', '0,1', '1,1', '3,1', '0,2', '2,2', '3,2', '4,2', '1,3']);
  for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) {
    const f = filled.has(`${q},${r}`);
    let fill = f ? 'rgba(97,114,243,.5)' : 'rgba(255,255,255,.04)', stroke = f ? 'rgba(185,193,255,.55)' : 'rgba(255,255,255,.16)';
    if (r === 2) {
      const k = Math.sin(Math.PI * E(T, 5.3 + q * 0.07, 0.4));
      fill = hexMix(f ? '#6172F3' : '#10172E', '#B9C1FF', k * 0.7); stroke = hexMix('#B9C1FF', '#FFFFFF', k);
    }
    const cx = 50 + q * 40, cy = 132 + r * 40;
    s += popG(T, 5.08 + 0.014 * (r * 5 + q), cx, cy, `<rect x="${34 + q * 40}" y="${116 + r * 40}" width="32" height="32" rx="8" fill="${fill}" stroke="${stroke}"/>`, { from: 0.5, rise: 6, cfg: SNAPPY });
  }
  let zig = 'M300,34 H488 V282'; for (let i = 0; i < 8; i++) zig += ` l-11.75,${i % 2 ? 10 : -10}`; zig += ' Z';
  let inv = `<path d="${zig}" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)" stroke-width="1"/>` + icon('invoice', 334, 70, 0.7) + bar(360, 64, 90, 12, 'rgba(255,255,255,.28)');
  [116, 150, 184, 218].forEach((y, n) => { if (n !== 2) inv += bar(318, y, 96, 12) + bar(436, y, 34, 12); });
  inv += TXT(318, 262, '€', { f: 'i', sz: 26, w: 500, fill: K.C.muted }) + bar(436, 250, 34, 14, 'rgba(185,193,255,.5)');
  s += popG(T, 5.16, 400, 160, inv, { from: 0.85, rise: 10 });
  // the two copies of "twice" travel to their rows, which land as identical hours items
  const tg = [[133, 212, 5.0, 5.28], [396, 190, 5.07, 5.35]];
  const item = (x, y, w, h) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="12" fill="rgba(185,193,255,.10)" stroke="#B9C1FF" stroke-width="2"/>` + icon('clock', x - w / 2 + 24, y, 0.5, { c: '#B9C1FF', sw: 2.4 }) + bar(x - w / 2 + 46, y - 6, w - 70, 12, 'rgba(223,230,243,.72)');
  const rowItems = [item(133, 212, 210, 44), item(396, 190, 176, 32)];
  s += `<defs>${grad(T, gid, bx0, bx1 - bx0, L3.t0 + 0.9, L3.t1)}</defs>`;
  if (T < tH) s += `<g>${chars(T, L3, 'B', gid)}</g>`;
  tg.forEach(([tx, ty, t0, tl], n) => {
    s += popG(T, tl, tx, ty, rowItems[n], { from: 0.7, rise: 0, fade: 0.06 });
    if (T > tl - 0.04 && T < tl + 0.7) {
      const rr = E(T, tl, 0.6, 'out'); s += `<circle cx="${tx}" cy="${ty}" r="${f2(10 + 44 * rr)}" fill="none" stroke="#DDE1FF" stroke-width="2" opacity="${f2(0.7 * (1 - rr))}"/>`;
    }
    if (T < tH) return;
    const u = E(T, t0, 0.38, 'inOut'), sB = mix(1, 0.26, u), cp = [mix(cb[0], tx, u), mix(cb[1], ty, u)], op = 1 - E(T, tl - 0.12, 0.14);
    if (op > 0.01) s += `<g opacity="${f2(op)}" transform="translate(${f2(cp[0] - sB * cb[0])},${f2(cp[1] - sB * cb[1])}) scale(${f2(sB)})">${chars(T, L3, 'B', gid)}</g>`;
  });
  const first = (c) => L3.chars.indexOf(c) < 6;
  s += `<g transform="${titleXf(L3, E(T, 5.0, 0.4, 'inOut'))}">${chars(T, L3, 'A', null, (c) => !first(c))}</g>`;
  const ro = 1 - E(T, 5.0, 0.3), rs = mix(1, 0.5, E(T, 5.0, 0.3));
  if (ro > 0.01) s += `<g opacity="${f2(ro)}" transform="translate(${f2(260 * (1 - rs) + 40 * (1 - rs))},${f2(BASEL * (1 - rs) - 30 * (1 - rs))}) scale(${f2(rs)})">${chars(T, L3, 'A', null, first)}</g>`;
  s += caretMk(T, L3, tH);
  return { inner: s };
}
const CARDS = { quote: quoteCard, enq: enqCard, hours: hoursCard };
const TM0 = { quote: 5.55, enq: 5.58, hours: 5.64 };

/* ---------- the company's five processes: tiles of their OWN shapes ---------- */
const OWN = {
  quote: { cx: 680, cy: 300, w: 300, h: 150, icon: 'doc' }, cust: { cx: 330, cy: 330, w: 220, h: 130, icon: 'personPlus' },
  enq: { cx: 430, cy: 630, w: 190, h: 250, icon: 'chat' }, hours: { cx: 700, cy: 620, w: 280, h: 200, icon: 'clock' },
  report: { cx: 500, cy: 870, w: 440, h: 140, icon: 'chart' },
};
/* the template: a rigid grid of identical square slots */
const WIN = { x: 930, y: 240, w: 760, h: 600 };
const SLOT = (r, c) => [1195 + 170 * c, 391 + 170 * r];
export const HAND_T = { click: 6.15, dragS: 6.53, dragE: 7.5, release: 7.66, home: [700, 620], slot: SLOT(1, 0) };
const glideEase = (u) => { const q = bezier(0.42, 0, 0.18, 1)(clamp01(u)); return q + 0.015 * Math.sin(Math.PI * clamp01((u - 0.72) / 0.28)) * clamp01((u - 0.72) / 0.1); };
const spf = (T, t0, cfg) => spring(T, t0, cfg);

function tileBox(key, T) {
  const o = OWN[key];
  let cx = o.cx, cy = o.cy, w = o.w, h = o.h, lift = 0, orange = 0, sc = 1;
  if (key === 'quote') {   // no slot at all for it: it bumps the template's edge
    const f = spf(T, 6.62, SNAPPY) * (1 - spf(T, 6.9, BOUNCY));
    cx += 94 * f; orange = Math.sin(Math.PI * clamp01((T - 6.84) / 0.32));
  } else if (key === 'enq') {   // squeezes into a slot, then pops back out
    const s2 = SLOT(2, 0), f = spf(T, 6.7, SNAPPY) * (1 - spf(T, 7.34, BOUNCY));
    cx += (s2[0] - cx) * f; cy += (s2[1] - cy) * f;
    const sq = spf(T, 7.0, SNAPPY) * (1 - spf(T, 7.3, BOUNCY));
    w = mix(w, 150, sq); h = mix(h, 150, sq);
  } else if (key === 'hours') {   // the hand drags it into a slot: too wide, it sticks out; it bounces back
    const H = HAND_T, q = glideEase((T - H.dragS) / (H.dragE - H.dragS));
    const dx = H.home[0] + (H.slot[0] - H.home[0]) * q, dy = H.home[1] + (H.slot[1] - H.home[1]) * q;
    const ret = spf(T, H.release, BOUNCY);
    cx = dx + (H.home[0] - dx) * ret; cy = dy + (H.home[1] - dy) * ret;
    const press = E(T, H.click, 0.11) * (1 - E(T, H.click + 0.11, 0.15));
    lift = E(T, H.click + 0.14, 0.2) * (1 - E(T, H.release, 0.25));
    sc = 1 - 0.05 * press + 0.04 * lift;
    orange = E(T, H.dragE - 0.06, 0.12) * (1 - E(T, H.release + 0.2, 0.3));
  }
  const spU = spf(T, 7.95, SNAPPY), pu = T < 7.95 ? 0 : spU + (1 - spU) * E(T, 8.2, 0.3);
  const sm = SEAM_AB_TILES.find((k) => k.key === key);
  return { cx: mix(cx, sm.x, pu), cy: mix(cy, sm.y, pu), w: mix(w, NS, pu) * sc, h: mix(h, NS, pu) * sc, lift, orange, pu, icon: o.icon, ow: w, oh: h };
}
const OWN_FILL = [97, 114, 243, 0.17], OWN_STROKE = [185, 193, 255, 0.38], UNI_FILL = [255, 255, 255, 0.07], UNI_STROKE = [255, 255, 255, 0.15];
function boxMk(b, pm, iop, T) {
  const pu = b.pu, fill = rgba(mixA(OWN_FILL, UNI_FILL, pu)), stroke = rgba(mixA(OWN_STROKE, UNI_STROKE, pu));
  const rx = mix(26, NS * 0.26, pu);
  let s = '';
  if (b.orange > 0.01) s += `<rect x="${f2(b.cx - b.w / 2)}" y="${f2(b.cy - b.h / 2)}" width="${f2(b.w)}" height="${f2(b.h)}" rx="${f2(rx)}" fill="#FF5A1F" opacity="${f2(0.2 * b.orange)}" filter="url(#b12)"/>`;
  s += `<rect x="${f2(b.cx - b.w / 2)}" y="${f2(b.cy - b.h / 2)}" width="${f2(b.w)}" height="${f2(b.h)}" rx="${f2(rx)}" fill="${fill}" stroke="${b.orange > 0.01 ? '#FF5A1F' : stroke}" stroke-width="${f2(mix(1, 3.5, b.orange))}"/>`;
  // the icon: top-left in the own layout, centred in the uniform tile
  const ix = mix(b.cx - b.w / 2 + 44, b.cx, pu), iy = mix(b.cy - b.h / 2 + 44, b.cy, pu), is = mix(1.0, 1.6, pu);
  const bo = (1 - E(pu, 0, 0.5)) * iop;
  let c = icon(b.icon, ix, iy, is, { sw: mix(2.5, 3, pu) });
  if (bo > 0.01) c += `<g opacity="${f2(bo)}">${bar(b.cx - b.w / 2 + 28, b.cy - b.h / 2 + 92, b.w - 56, 10, 'rgba(255,255,255,.26)')}${bar(b.cx - b.w / 2 + 28, b.cy - b.h / 2 + 110, (b.w - 56) * 0.6, 8)}</g>`;
  return `<g${b.lift > 0.01 ? ' filter="url(#shLift2)"' : ''}>${s}<g opacity="${f2(clamp01(iop + pu))}">${c}</g></g>`;
}
/* card -> tile for the three processes of the hook */
function morphItem(key, T) {
  const t0 = TM0[key];
  if (T < t0) {
    const st = cardState(key, T), c = CARDS[key](T);
    return `<g opacity="${f2(st.op)}" filter="url(#shCard)"><g transform="${cardXf(st)}">${c.inner}</g></g>`;
  }
  const st = cardState(key, T), tb = tileBox(key, T);
  const sp = spf(T, t0, SNAPPY), pm = sp + (1 - sp) * E(T, t0 + 0.5, 0.25);
  const cb = { cx: st.cx, cy: st.cy, w: 520 * st.s, h: 320 * st.s };
  const b = { ...tb, cx: mix(cb.cx, tb.cx, pm), cy: mix(cb.cy, tb.cy, pm), w: mix(cb.w, tb.w, pm), h: mix(cb.h, tb.h, pm) };
  let s = boxMk(b, pm, E(T, t0 + 0.22, 0.3), T);
  const co = (1 - E(T, t0, 0.3)) * st.op;
  if (co > 0.01) {
    const c = CARDS[key](T), k = Math.min(b.w / 520, b.h / 320);
    s += `<g opacity="${f2(co)}" transform="translate(${f2(b.cx)},${f2(b.cy)}) scale(${f2(k)}) translate(-260,-160)">${c.inner}</g>`;
  }
  return s;
}
function newTile(key, T, t0) {
  if (T < t0) return '';
  const tb = tileBox(key, T), b = bounceIn(T, t0, { cfg: BOUNCY, from: 0.6, rise: 24, fade: 0.1 });
  return `<g opacity="${f2(b.op)}" transform="translate(${f2(tb.cx)},${f2(tb.cy + b.y)}) scale(${f2(b.s)}) translate(${f2(-tb.cx)},${f2(-tb.cy)})">${boxMk(tb, 1, 1, T)}</g>`;
}

/* ---------- the off-the-shelf template (generic grey chrome, a rigid grid of identical slots) ---------- */
function template(T) {
  const sh = T > 7.62 ? 20 * Math.exp(-7 * (T - 7.62)) * Math.cos((2 * Math.PI * (T - 7.62)) / 0.22) : 0;
  const tx = mix(1000, 0, spring(T, 5.66, SNAPPY)) + sh + 1100 * E(T, 7.88, 0.5, 'inOut');
  if (tx > 1050) return '';
  const { x, y, w, h } = WIN;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="rgba(176,183,200,.26)" stroke="rgba(220,225,236,.55)" stroke-width="2" filter="url(#shCard60)"/>`;
  s += `<path d="M${x},${y + 56} V${y + 22} a22,22 0 0 1 22,-22 H${x + w - 22} a22,22 0 0 1 22,22 V${y + 56} Z" fill="rgba(210,215,228,.22)"/>`;
  [0, 1, 2].forEach((n) => { s += `<circle cx="${x + 32 + n * 28}" cy="${y + 28}" r="8" fill="rgba(235,238,245,${0.62 - n * 0.14})"/>`; });
  s += `<rect x="${x + w - 230}" y="${y + 18}" width="200" height="20" rx="10" fill="rgba(235,238,245,.22)"/>`;
  s += `<rect x="${x + 20}" y="${y + 76}" width="140" height="504" rx="14" fill="rgba(220,225,236,.14)"/>`;
  for (let i = 0; i < 6; i++) s += bar(x + 38, y + 104 + 38 * i, 104 - (i % 3) * 18, 14, 'rgba(235,238,245,.28)');
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const [cx, cy] = SLOT(r, c), hot = (r === 1 && c === 0) ? E(T, 7.44, 0.12) * (1 - E(T, 7.9, 0.3)) : 0;
    const inner = `<rect x="${cx - 75}" y="${cy - 75}" width="150" height="150" rx="14" fill="${hot > 0.01 ? `rgba(255,90,31,${f2(0.12 + 0.16 * hot)})` : 'rgba(220,225,236,.20)'}" stroke="${hot > 0.01 ? '#FF5A1F' : 'rgba(235,238,245,.38)'}" stroke-width="${f2(2 + hot)}"/>`;
    s += popG(T, 5.84 + 0.05 * (r * 3 + c), cx, cy, inner, { from: 0.8, rise: 8, cfg: SNAPPY });
  }
  return `<g transform="translate(${f2(tx)},0)">${s}</g>`;
}

function tilePath(boxes, T, op) {
  let d = '';
  const r = NS / 2 + 10;
  for (let i = 1; i < boxes.length; i++) {
    const a = boxes[i - 1], b = boxes[i], L = Math.hypot(b.cx - a.cx, b.cy - a.cy), ux = (b.cx - a.cx) / L, uy = (b.cy - a.cy) / L;
    d += `M${f2(a.cx + ux * r)},${f2(a.cy + uy * r)} L${f2(b.cx - ux * r)},${f2(b.cy - uy * r)} `;
  }
  return `<path d="${d}" fill="none" stroke="rgba(223,230,243,.38)" stroke-width="2" stroke-dasharray="6 8" stroke-dashoffset="${f2(-DASH(T))}" stroke-linecap="round" opacity="${f2(op)}"/>`;
}

export function scene(T) {
  const { L1, L2, L3 } = lines();
  if (T >= 8.5) return seamAB(T);
  let s = '';
  if (T >= 5.6) s += template(T);
  const pathOp = E(T, 8.15, 0.35);
  if (pathOp > 0.01) {
    const boxes = SEAM_AB_TILES.map((k) => tileBox(k.key, T));
    s += tilePath(boxes, T, pathOp);
  }
  if (T < 5.55) {   // the hook: cards only (each one grows out of its line)
    for (const k of ['quote', 'enq', 'hours']) if (T >= (k === 'quote' ? L1.t0 - 0.2 : k === 'enq' ? L2.t0 - 0.2 : L3.t0 - 0.2)) s += morphItem(k, T);
  } else {
    s += newTile('cust', T, 5.74);
    s += morphItem('quote', T) + morphItem('enq', T) + morphItem('hours', T);
    s += newTile('report', T, 5.86);
  }
  return s;
}
