/* B3 + B4 (builder B): shared stage. The AI mapping window, its tiles, columns and drops, and the continuous
   move of window -> costed plan card with the five tiles dropping into the rows' icon slots (10.94 -> 12.3).
   B3.js draws the world + stage(T); B4.js draws stage(T) + the plan rows (rows() lives in B4.js). */
import * as K from '../engine/kit.js';
import { E, ease, pop, seg, mix, clamp01 } from '../engine/anim.js';

const { f2, NODES, NS, BASE, SLOT } = K;
export const KEYS = NODES.map((n) => n.key);               // cust, enq, quote, hours, report (left to right)

/* ---- timings (film s) ---- */
export const F0 = 8.80, FST = 0.045, FD = 0.62;              // faces lift and fly into tiles
export const SCAN0 = 9.88, SCAN_DUR = 0.72;                  // scan line + week track (ends 10.60)
export const FOUND = 10.60;                                  // brackets snap onto quotes
export const TW = { win0: 10.94, tile0: 10.98, stag: 0.06, tileDur: 0.62, tail: 0.4 };
export const SHELL_END = 13.0;
export const tStart = (i) => TW.tile0 + i * TW.stag;
export const tLand = (i) => tStart(i) + TW.tileDur;
export const tileDone = (i) => tLand(i) + TW.tail;           // from here the plan row draws its own tile

/* pop that is forced to its exact end value by tEnd (so the settled frame equals the hand-off state) */
export function popF(T, t0, dur, over, tEnd) {
  const p = pop(T, t0, { dur, over });
  return mix(p, 1, E(T, tEnd - 0.4, 0.4));
}

const scanP = (T) => E(T, SCAN0, SCAN_DUR);
const scanX = (T) => mix(260, 1700, scanP(T));
function passT(i) {                                          // when the scan line reaches tile i (bisection)
  const target = NODES[i].x - 70;
  let a = SCAN0, b = SCAN0 + SCAN_DUR;
  for (let k = 0; k < 18; k++) { const m = (a + b) / 2; if (scanX(m) < target) a = m; else b = m; }
  return b;
}
const PASS = NODES.map((_, i) => passT(i));
/* column fill of node i (0..1): rises as the scan passes */
function fill(i, T) {
  const n = NODES[i];
  const s0 = (n.x - 140 - 260) / 1440, s1 = Math.min(1, s0 + 0.3);
  return ease.out(clamp01((scanP(T) - s0) / (s1 - s0)));
}

/* ---- tile ---- */
export function tileSvg(cx, cy, size, key, o = {}) {
  const n = K.NODES.find((q) => q.key === key) || { icon: K.ROWS[key].icon };
  const lit = o.lit || 0, is = size / 80, isw = o.isw == null ? 3 : o.isw;
  let s = '';
  if (o.glow > 0.003) s += `<rect x="${f2(cx - size / 2)}" y="${f2(cy - size / 2)}" width="${f2(size)}" height="${f2(size)}" rx="${f2(size * 0.26)}" fill="rgba(97,114,243,.55)" filter="url(#b20)" opacity="${f2(o.glow)}"/>`;
  s += K.tile(cx, cy, size, n.icon, { is, isw, stroke: o.stroke });
  if (lit > 0.003) {
    const t = K.tile(cx, cy, size, n.icon, { fill: 'rgba(185,193,255,.24)', stroke: '#B9C1FF', sw: o.litSw || 2, ic: '#F3F5FA', is, isw });
    s += lit >= 0.999 ? t : `<g opacity="${f2(lit)}">${t}</g>`;
  }
  if (o.scale && Math.abs(o.scale - 1) > 1e-4) s = `<g transform="translate(${f2(cx)},${f2(cy)}) scale(${f2(o.scale)}) translate(${f2(-cx)},${f2(-cy)})">${s}</g>`;
  return o.op != null && o.op < 0.999 ? `<g opacity="${f2(o.op)}">${s}</g>` : s;
}

/* ---- the window / card shell ---- */
export function shell(T) {
  if (T < 8.86) return '';
  if (T >= SHELL_END) return K.planCard() + K.planLines();
  const o = E(T, 8.86, 0.7, 'smooth'), fo = E(T, 9.15, 0.45), sk = E(T, 9.3, 0.5);
  const p = T < TW.win0 ? 0 : pop(T, TW.win0, { dur: 0.8, over: 0.03 });
  const x = mix(220, 380, p), w = mix(1480, 1160, p);
  const dash = o < 0.999 ? ` pathLength="1" stroke-dasharray="${f2(o)} 2"` : '';
  let s = `<rect x="${f2(x)}" y="140" width="${f2(w)}" height="800" rx="32" fill="rgba(255,255,255,${f2(mix(0.045, 0.05, p) * fo)})" stroke="rgba(${f2(mix(185, 255, sk))},${f2(mix(193, 255, sk))},${f2(mix(255, 255, sk))},${f2(mix(0.6, 0.11, sk))})" stroke-width="${f2(mix(2, 1, sk))}" filter="url(#shCard60)"${dash}/>`;
  // map chrome
  const mc = E(T, 9.3, 0.35) * (1 - E(T, TW.win0, 0.3));
  if (mc > 0.003) {
    const week = scanP(T), x0 = 1250, x1 = 1640, fx = mix(x0, x1, week);
    let c = K.MONO(270, 200, 'AI mapping', { sz: 26, fill: K.C.muted });
    c += `<line x1="${x0}" y1="186" x2="${x1}" y2="186" stroke="rgba(255,255,255,.16)" stroke-width="2"/><line x1="${x0}" y1="186" x2="${f2(fx)}" y2="186" stroke="#B9C1FF" stroke-width="2"/>`;
    c += `<circle cx="${x0}" cy="186" r="5" fill="#F3F5FA"/><circle cx="${x1}" cy="186" r="5" fill="${week >= 1 ? '#B9C1FF' : 'rgba(223,230,243,.35)'}"/>`;
    if (week > 0 && week < 1) c += `<circle cx="${f2(fx)}" cy="186" r="12" fill="rgba(185,193,255,.45)" filter="url(#b4)"/><circle cx="${f2(fx)}" cy="186" r="4" fill="#fff"/>`;
    c += K.MONO(x0, 216, 'Week 1', { sz: 20, anchor: 'middle', fill: 'rgba(223,230,243,.55)' }) + K.MONO(x1, 216, 'Week 2', { sz: 20, anchor: 'middle', fill: 'rgba(223,230,243,.55)' });
    c += `<line x1="220" y1="240" x2="1700" y2="240" stroke="rgba(255,255,255,.08)"/>`;
    s += `<g opacity="${f2(mc)}">${c}</g>`;
  }
  // plan card chrome
  const cc = E(T, 11.2, 0.4);
  if (cc > 0.003) {
    let c = K.T(440, 222, 'Costed plan', { f: 'h', sz: 44, w: 500, ls: -0.6 });
    c += K.icon('trend', 1086, 206, 0.8, { c: 'rgba(185,193,255,.8)' }) + K.T(1398, 219, '€', { f: 'i', sz: 34, w: 500, fill: K.C.muted });
    c += `<line x1="410" y1="262" x2="1510" y2="262" stroke="rgba(255,255,255,.10)"/>`;
    c += K.planLines();
    s += `<g opacity="${f2(cc)}">${c}</g>`;
  }
  return s;
}

/* ---- the map layer: flying faces -> tiles, connectors, columns, drops, scan, found, tiles dropping into rows ---- */
export function mapLayer(T) {
  if (T < F0) return '';
  const bodyOp = 1 - E(T, TW.win0, 0.32);
  const foundE = E(T, FOUND + 0.02, 0.3);
  const foundDim = E(T, FOUND + 0.12, 0.4);
  let defs = `<defs><linearGradient id="wfPeachV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9c8"/><stop offset="1" stop-color="#f3a585" stop-opacity=".75"/></linearGradient>` +
    `<linearGradient id="wfPeriV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDD3FF"/><stop offset="1" stop-color="#6172F3"/></linearGradient>` +
    `<linearGradient id="wfScanB" x1="0" x2="1"><stop offset="0" stop-color="#6172F3" stop-opacity="0"/><stop offset="1" stop-color="#6172F3" stop-opacity=".16"/></linearGradient><clipPath id="wfScanC"><rect x="220" y="140" width="1480" height="800" rx="32"/></clipPath></defs>`;
  let under = '', tiles = '', over = '';
  const sx = scanX(T);

  if (bodyOp > 0.003) {
    // baseline + clock
    const bl = E(T, 9.8, 0.35);
    if (bl > 0.003) under += `<g opacity="${f2(bl * bodyOp)}"><line x1="300" y1="${BASE}" x2="1620" y2="${BASE}" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/>${K.icon('clock', 272, BASE, 0.62, { c: 'rgba(255,217,200,.7)', sw: 2 })}</g>`;
    // connectors
    for (let i = 0; i < 4; i++) {
      const a = NODES[i], b = NODES[i + 1];
      const A = [a.x + NS / 2 + 6, a.y], B = [b.x - NS / 2 - 6, b.y];
      const t0 = 9.46 + i * 0.07, dr = E(T, t0, 0.3, 'smooth');
      if (dr <= 0) continue;
      const k = Math.max(50, Math.abs(B[0] - A[0]) * 0.45), p1 = [A[0] + k, A[1]], p2 = [B[0] - k, B[1]];
      const d = `M${f2(A[0])},${f2(A[1])} C${f2(p1[0])},${f2(p1[1])} ${f2(p2[0])},${f2(p2[1])} ${f2(B[0])},${f2(B[1])}`;
      const da = dr < 0.999 ? ` pathLength="1" stroke-dasharray="${f2(dr)} 2"` : '';
      let c = `<path d="${d}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2"${da}/><path d="${d}" fill="none" stroke="rgba(185,193,255,.55)" stroke-width="2"${da}/>`;
      for (let j = 0; j < 2; j++) {
        const tt = ((T - t0 - 0.1) * 0.5 + j * 0.5 + i * 0.17) % 1;
        if (T < t0 + 0.1 || tt > dr) continue;
        const q = K.bez(A, p1, p2, B, tt), op = Math.pow(Math.sin(Math.PI * tt), 0.6);
        c += `<circle cx="${f2(q[0])}" cy="${f2(q[1])}" r="9" fill="#B9C1FF" opacity="${f2(0.45 * op)}" filter="url(#b4)"/><circle cx="${f2(q[0])}" cy="${f2(q[1])}" r="4.5" fill="#fff" opacity="${f2(op)}"/>`;
      }
      under += `<g opacity="${f2(bodyOp * (1 - 0.6 * foundDim))}">${c}</g>`;
    }
    // columns, guides, drops
    NODES.forEach((n, i) => {
      const isQ = n.key === 'quote';
      const f = fill(i, T), h = n.lost * f, top = BASE - h;
      const dim = isQ ? 1 : 1 - 0.64 * foundDim * (1 - E(T, tStart(i), 0.35));
      let g = '';
      const y0 = n.y + NS / 2 + 18;
      const gd = E(T, PASS[i] - 0.1, 0.3);
      if (gd > 0.003) g += `<line x1="${n.x}" y1="${y0}" x2="${n.x}" y2="${f2(Math.max(y0, top - 14))}" stroke="rgba(255,217,200,.22)" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" opacity="${f2(gd)}"/>`;
      // drops (gravity: ease-in), each into its own column
      const emit = (ts, period, ph, tA, tB, life) => {
        const k0 = Math.ceil((tA - ts - ph) / period);
        for (let k = k0; ; k++) {
          const tk = ts + ph + k * period;
          if (tk > tB || tk > T) break;
          const u = (T - tk) / life;
          if (u < 0) continue;
          const yt = Math.max(y0 + 20, top - 8);
          if (u < 1) {
            const y = y0 + (yt - y0) * u * u, r = 3.4 + (k % 3) * 0.7, sq = 1 + 1.1 * u;
            g += `<ellipse cx="${n.x + ((k * 7) % 5 - 2) * 3}" cy="${f2(y)}" rx="${f2(r)}" ry="${f2(r * sq)}" fill="#ffd9c8" opacity="${f2(0.9 * Math.min(1, u * 6))}"/>`;
          } else if (u < 1.7) {
            const v = (u - 1) / 0.7;
            g += `<ellipse cx="${n.x}" cy="${f2(yt)}" rx="${f2(8 + 26 * ease.out(v))}" ry="${f2(3 + 7 * ease.out(v))}" fill="none" stroke="#ffd9c8" stroke-width="1.6" opacity="${f2(0.5 * (1 - v))}"/>`;
          }
        }
      };
      emit(PASS[i] - 0.05, 0.3, i * 0.071, PASS[i] - 0.05, 10.64, 0.36);
      emit(10.2, 0.115, i * 0.029, 10.2, 10.5, 0.34);
      const hq = isQ && foundE > 0;
      if (h > 0.5) {
        if (hq) g += `<rect x="${n.x - 36}" y="${f2(top)}" width="72" height="${f2(h)}" rx="14" fill="rgba(97,114,243,.6)" filter="url(#b15)" opacity="${f2(foundE)}"/>`;
        g += `<rect x="${n.x - 36}" y="${f2(top)}" width="72" height="${f2(h)}" rx="14" fill="url(#wfPeachV)" opacity=".92"/>`;
        if (hq) g += `<rect x="${n.x - 36}" y="${f2(top)}" width="72" height="${f2(h)}" rx="14" fill="url(#wfPeriV)" opacity="${f2(0.92 * foundE)}"/>`;
      }
      under += `<g opacity="${f2(dim * bodyOp)}">${g}</g>`;
    });
  }

  // tiles (faces -> tiles, static map tiles, dropping into row slots)
  NODES.forEach((n, i) => {
    const f0 = F0 + i * FST;
    if (T < f0 || T >= tileDone(i)) return;
    const q = seg(T, f0, FD), e = ease.smooth(q), isQ = n.key === 'quote';
    const [c, r, k] = n.blk;
    const from = K.topFaceCardOrder(c, r, k, 0);
    const to = [[n.x - NS / 2, n.y - NS / 2], [n.x + NS / 2, n.y - NS / 2], [n.x + NS / 2, n.y + NS / 2], [n.x - NS / 2, n.y + NS / 2]];
    const lift = 90 * Math.sin(Math.PI * e);
    const quad = from.map((p, m) => [mix(p[0], to[m][0], e), mix(p[1], to[m][1], e) - lift]);
    const cen = [(quad[0][0] + quad[2][0]) / 2, (quad[0][1] + quad[2][1]) / 2];
    const origin = K.topCentre(c, r, k);
    const ts = tStart(i), te = seg(T, ts, TW.tileDur), ee = ease.smooth(te);
    let g = '';
    if (q < 1) {
      // flourish: a soft lavender light trail behind the flying face
      const e2 = Math.max(0, e - 0.24);
      const c2 = [mix(origin[0], n.x, e2), mix(origin[1], n.y, e2) - 90 * Math.sin(Math.PI * e2)];
      const tr = Math.sin(Math.PI * q);
      g += `<line x1="${f2(cen[0])}" y1="${f2(cen[1])}" x2="${f2(c2[0])}" y2="${f2(c2[1])}" stroke="rgba(185,193,255,${f2(0.26 * tr)})" stroke-width="${f2(40 + 20 * tr)}" stroke-linecap="round" filter="url(#b12)"/>`;
      const ap = clamp01(q / 0.18), xf = clamp01((q - 0.74) / 0.26);
      g += `<g opacity="${f2(1 - xf)}"><polygon points="${K.pts(quad)}" fill="rgba(185,193,255,${f2(0.10 * ap)})" stroke="rgba(255,255,255,${f2(0.3 * ap)})" stroke-width="1.2" stroke-linejoin="round"/>` +
        K.icon(n.icon, cen[0], cen[1], (NS * (0.5 + 0.5 * e)) / 80, { op: 0.55 * ap, sw: 3 }) + `</g>`;
      if (xf > 0) g += tileSvg(cen[0], cen[1], NS * (0.55 + 0.45 * e), n.key, { op: xf, lit: 0 });
    } else if (T < ts) {
      const sm = clamp01((sx - (n.x - NS / 2)) / NS);
      const bump = 1 + 0.07 * Math.sin(Math.PI * seg(T, f0 + FD, TW.tail));
      const lit = isQ ? foundE : 0;
      const stroke = `rgba(${f2(mix(255, 185, sm))},${f2(mix(255, 193, sm))},255,${f2(mix(0.15, 0.45, sm))})`;
      g += tileSvg(n.x, n.y, NS, n.key, { lit, glow: isQ ? foundE : 0, stroke, scale: bump, op: isQ ? 1 : 1 - 0.64 * foundDim });
      if (isQ && foundE > 0) {
        const kk = mix(130, 86, pop(T, FOUND, { dur: 0.4, over: 0.06 })), a = 26, bo = E(T, FOUND, 0.12);
        g += `<g opacity="${f2(bo)}">${K.ringArc(n.x, n.y, 104, 1, 'rgba(185,193,255,.35)', 2)}<path d="M${n.x - kk},${n.y - kk + a} V${n.y - kk} H${n.x - kk + a} M${n.x + kk - a},${n.y - kk} H${n.x + kk} V${n.y - kk + a} M${n.x + kk},${n.y + kk - a} V${n.y + kk} H${n.x + kk - a} M${n.x - kk + a},${n.y + kk} H${n.x - kk} V${n.y + kk - a}" fill="none" stroke="#B9C1FF" stroke-width="3" stroke-linecap="round"/></g>`;
      }
    } else {
      // dropping into the row's icon slot
      const tx = mix(n.x, 478, ee), ty = mix(n.y, SLOT[i], ee), sz = mix(NS, 68, ee);
      const bump = 1 + 0.07 * Math.sin(Math.PI * seg(T, tLand(i), TW.tail));
      const fo = 1 - E(T, ts, 0.3);
      g += tileSvg(tx, ty, sz, n.key, { lit: isQ ? 1 : 0, glow: isQ ? foundE * fo : 0, isw: mix(3, 2.5, ee), litSw: mix(2, 1.5, ee), scale: bump, op: isQ ? 1 : 1 - 0.64 * foundDim * (1 - E(T, ts, 0.35)) });
      if (isQ && fo > 0.003) {
        const kk = 86 * sz / NS;
        g += `<g opacity="${f2(fo)}"><path d="M${f2(tx - kk)},${f2(ty - kk + 26)} V${f2(ty - kk)} H${f2(tx - kk + 26)} M${f2(tx + kk - 26)},${f2(ty - kk)} H${f2(tx + kk)} V${f2(ty - kk + 26)} M${f2(tx + kk)},${f2(ty + kk - 26)} V${f2(ty + kk)} H${f2(tx + kk - 26)} M${f2(tx - kk + 26)},${f2(ty + kk)} H${f2(tx - kk)} V${f2(ty + kk - 26)}" fill="none" stroke="#B9C1FF" stroke-width="3" stroke-linecap="round"/></g>`;
      }
    }
    tiles += g;
  });

  // scan line (on top of the tiles)
  if (T >= SCAN0 - 0.05 && bodyOp > 0.003) {
    const so = E(T, SCAN0 - 0.05, 0.2) * (1 - E(T, SCAN0 + SCAN_DUR - 0.05, 0.25)) * bodyOp;
    if (so > 0.003) over += `<g opacity="${f2(so)}" clip-path="url(#wfScanC)"><rect x="${f2(sx - 160)}" y="252" width="160" height="${BASE - 252 + 30}" fill="url(#wfScanB)"/><line x1="${f2(sx)}" y1="252" x2="${f2(sx)}" y2="${BASE + 30}" stroke="#B9C1FF" stroke-width="1.5" opacity=".8"/></g>`;
  }
  return defs + under + tiles + over;
}

export function stage(T) { return shell(T) + mapLayer(T); }
