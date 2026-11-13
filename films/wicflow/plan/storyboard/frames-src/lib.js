/* Wicflow hero storyboard: styleframe engine (1920x1080 SVG).
   v2 (text-light): the block world is centred, so the lattice is
   (i,j,h) -> (960 + 120(i-j), 554 + 69.5(i+j) - 128h). v1 used 1360 (world right of a text column). */
'use strict';
const W = 1920, HGT = 1080;
const C = {
  ink: '#0B1220', text: '#F3F5FA', muted: 'rgba(223,230,243,.72)', line: 'rgba(255,255,255,.10)',
  peri: '#6172F3', lav: '#B9C1FF', green: '#16B857', orange: '#FF5A1F', peach: '#ffd9c8',
  wire: 'rgba(223,230,243,.42)'
};
const FONT = { h: 'WF Headline', i: 'WF Inter', m: 'WF Mono', k: 'WF Mark' };

let _uid = 0;
const uid = (p = 'u') => `${p}${++_uid}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f2 = (n) => Math.round(n * 100) / 100;
const lerp = (a, b, t) => a + (b - a) * t;
const lerpP = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const pts = (arr) => arr.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' ');

/* ---------- text ---------- */
let _ctx = null;
function measure(s, o = {}) {
  if (!_ctx) _ctx = document.createElement('canvas').getContext('2d');
  const sz = o.sz || 40, w = o.w || 400, fam = FONT[o.f || 'i'];
  _ctx.font = `${w} ${sz}px "${fam}"`;
  const ls = o.ls || 0;
  return _ctx.measureText(s).width + ls * s.length;
}
function T(x, y, s, o = {}) {
  const fam = FONT[o.f || 'i'];
  const a = [`x="${f2(x)}"`, `y="${f2(y)}"`, `font-family="${fam}"`, `font-size="${o.sz || 40}"`,
    `font-weight="${o.w || 400}"`, `fill="${o.fill || C.text}"`];
  if (o.op != null && o.op !== 1) a.push(`opacity="${o.op}"`);
  if (o.anchor) a.push(`text-anchor="${o.anchor}"`);
  if (o.ls) a.push(`letter-spacing="${o.ls}"`);
  if (o.attr) a.push(o.attr);
  const body = o.raw ? s : esc(s);
  return `<text ${a.join(' ')}>${body}</text>`;
}
const HL = (x, y, s, o = {}) => T(x, y, s, { f: 'h', sz: 96, w: 500, ls: -1.92, fill: C.text, ...o });
const SUP = (x, y, s, o = {}) => T(x, y, s, { f: 'i', sz: 44, w: 400, fill: C.muted, ...o });
const MONO = (x, y, s, o = {}) => T(x, y, s, { f: 'm', sz: 40, w: 400, fill: C.muted, ...o });

/* ---------- defs shared by every frame ---------- */
function baseDefs() {
  return `
  <radialGradient id="bg" gradientUnits="userSpaceOnUse" cx="960" cy="540" r="1400">
    <stop offset="0" stop-color="#131C3A"/><stop offset=".45" stop-color="#0E1630"/><stop offset="1" stop-color="#0B1220"/>
  </radialGradient>
  <filter id="dither" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="11" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <linearGradient id="barG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6172F3"/><stop offset="1" stop-color="#B9C1FF"/></linearGradient>
  <linearGradient id="barV" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#6172F3"/><stop offset="1" stop-color="#B9C1FF"/></linearGradient>
  <linearGradient id="peach" x1="0" y1=".41" x2="1" y2=".59"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#ffd9c8"/><stop offset="1" stop-color="#f3a585"/></linearGradient>
  <filter id="shCard" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="20" flood-color="#000" flood-opacity=".35"/></filter>
  <filter id="shCard60" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="30" flood-color="#000" flood-opacity=".35"/></filter>
  <filter id="shLift" x="-30%" y="-60%" width="160%" height="260%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity=".45"/></filter>
  <filter id="shLift2" x="-30%" y="-80%" width="160%" height="300%"><feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000" flood-opacity=".5"/></filter>
  ${[2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30].map((s) => `<filter id="b${s}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="${s}"/></filter>`).join('')}
  <filter id="markWhite" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values="0 0 0 0 0.953  0 0 0 0 0.961  0 0 0 0 0.980  0 0 0 1 0"/></filter>`;
}
function background() {
  return `<rect width="${W}" height="${HGT}" fill="url(#bg)"/><rect width="${W}" height="${HGT}" filter="url(#dither)" opacity=".02"/>`;
}
function svgDoc(inner, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${HGT}" viewBox="0 0 ${W} ${HGT}">
  <defs>${baseDefs()}${extraDefs}</defs>${background()}${inner}</svg>`;
}

/* ---------- isometric block world ---------- */
const OX = 960, OY = 554, AX = 120, AY = 69.5, HZ = 128;
const P = (i, j, h) => [OX + AX * (i - j), OY + AY * (i + j) - HZ * h];
const STUD = { rx: 44, ry: 25.5, h: 20 };
const BLOCKS = [
  [0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [0, 2, 0], [1, 2, 0], [2, 2, 0],
  [0, 0, 1], [0, 1, 1], [1, 0, 1], [2, 0, 1], [0, 0, 2]
];
const NAMED = { '0,2,0': '01', '2,2,0': '02', '2,0,1': '03', '0,1,1': '04', '1,0,1': '05', '0,0,2': '06' };
const KEY_OF = { '01': '0,2,0', '02': '2,2,0', '03': '2,0,1', '04': '0,1,1', '05': '1,0,1', '06': '0,0,2' };
const topCentre = (c, r, k) => P(c + 0.5, r + 0.5, k + 1);

function geom(c, r, k) {
  const v = (i, j, h) => [c + i, r + j, k + h];
  return {
    top: [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)],
    left: [v(0, 1, 1), v(1, 1, 1), v(1, 1, 0), v(0, 1, 0)],
    right: [v(1, 1, 1), v(1, 0, 1), v(1, 0, 0), v(1, 1, 0)],
    vis: [[v(0, 0, 1), v(1, 0, 1)], [v(1, 0, 1), v(1, 1, 1)], [v(0, 1, 1), v(1, 1, 1)], [v(0, 0, 1), v(0, 1, 1)],
      [v(0, 1, 0), v(0, 1, 1)], [v(1, 1, 0), v(1, 1, 1)], [v(1, 0, 0), v(1, 0, 1)],
      [v(0, 1, 0), v(1, 1, 0)], [v(1, 0, 0), v(1, 1, 0)]],
    hid: [[v(0, 0, 0), v(0, 0, 1)], [v(0, 0, 0), v(0, 1, 0)], [v(0, 0, 0), v(1, 0, 0)]],
    hex: [v(0, 0, 1), v(1, 0, 1), v(1, 0, 0), v(1, 1, 0), v(0, 1, 0), v(0, 1, 1)],
    stud: [c + 0.5, r + 0.5, k + 1]
  };
}
const proj = (l, dy = 0) => { const p = P(l[0], l[1], l[2]); return [p[0], p[1] - dy]; };
const projAll = (arr, dy) => arr.map((l) => proj(l, dy));

function studPaths(cx, cy, h = STUD.h, rx = STUD.rx, ry = STUD.ry) {
  const side = `M${f2(cx - rx)},${f2(cy - h)} L${f2(cx - rx)},${f2(cy)} A${rx},${ry} 0 0 0 ${f2(cx + rx)},${f2(cy)} L${f2(cx + rx)},${f2(cy - h)} A${rx},${ry} 0 0 1 ${f2(cx - rx)},${f2(cy - h)} Z`;
  const lower = `M${f2(cx - rx)},${f2(cy)} A${rx},${ry} 0 0 0 ${f2(cx + rx)},${f2(cy)}`;
  const sides = `M${f2(cx - rx)},${f2(cy - h)} L${f2(cx - rx)},${f2(cy)} M${f2(cx + rx)},${f2(cy - h)} L${f2(cx + rx)},${f2(cy)}`;
  return { side, lower, sides, top: { cx, cy: cy - h, rx, ry } };
}

/* An edge always runs in its canonical direction so shared edges dash identically. */
function edgeD(a, b, dy, prog = 1) {
  let A = a, B = b;
  if (a[0] > b[0] || (a[0] === b[0] && (a[1] > b[1] || (a[1] === b[1] && a[2] > b[2])))) { A = b; B = a; }
  const p = proj(A, dy), q = proj(B, dy);
  const e = lerpP(p, q, prog);
  return `M${f2(p[0])},${f2(p[1])} L${f2(e[0])},${f2(e[1])}`;
}

const STATE = {
  glass: { faces: ['rgba(255,255,255,.06)', 'rgba(255,255,255,.035)', 'rgba(255,255,255,.05)'], edge: 'rgba(255,255,255,.22)', ew: 1.25 },
  solid: { faces: ['#F2F3FC', '#DCDFF5', '#C2C7EC'], edge: 'rgba(255,255,255,.85)', ew: 1, studTop: '#FFFFFF', studSide: ['#E6E8F8', '#C9CDEB'], glow: 'rgba(185,193,255,.22)', glowB: 20 },
  peri: { faces: ['#CDD3FF', '#B9C1FF', '#98A2F5'], edge: 'rgba(255,255,255,.55)', ew: 1, studTop: '#DDE1FF', studSide: ['#C3CAFF', '#9AA4F2'], glow: 'rgba(97,114,243,.45)', glowB: 30 },
  gperi: { faces: ['rgba(185,193,255,.24)', 'rgba(185,193,255,.14)', 'rgba(185,193,255,.10)'], edge: '#B9C1FF', ew: 1.5, glow: 'rgba(97,114,243,.35)', glowB: 12 },
  orange: { faces: ['rgba(255,90,31,.14)', 'rgba(255,90,31,.14)', 'rgba(255,90,31,.14)'], edge: '#FF5A1F', ew: 2 }
};

/* b: {c,r,k, w:{wire,glass,solid,peri,gperi,orange}, dy, op, prog, num, studLit, glowMul, studH, wireOp, dash, dashOff} */
function renderBlock(b, g) {
  const { c, r, k } = b;
  const G = geom(c, r, k);
  const dy = b.dy || 0;
  const w = b.w || { wire: 1 };
  const prog = b.prog == null ? 1 : b.prog;
  const studH = b.studH == null ? STUD.h : b.studH;
  const sc = proj(G.stud, dy);
  const st = studPaths(sc[0], sc[1], studH);
  let out = '';
  // glows
  for (const s of ['solid', 'peri', 'gperi']) {
    if (!w[s] || b.studOnly) continue;
    const S = STATE[s];
    const gm = (b.glowMul == null ? 1 : b.glowMul) * w[s] * (s === 'solid' && b.wipe != null ? b.wipe : 1);
    out += `<polygon points="${pts(projAll(G.hex, dy))}" fill="${S.glow}" filter="url(#b${S.glowB})" opacity="${f2(Math.min(gm, 1.6))}"/>`;
    if (gm > 1) out += `<polygon points="${pts(projAll(G.hex, dy))}" fill="${S.glow}" filter="url(#b${S.glowB})" opacity="${f2(gm - 1)}"/>`;
  }
  // wire
  if (w.wire && !b.studOnly) {
    const wo = b.wireOp || 0.42;
    const dash = b.dash || '6 6';
    const off = b.dashOff || 0;
    const stroke = `stroke="rgba(223,230,243,${wo})" stroke-width="1.5" stroke-dasharray="${dash}" stroke-dashoffset="${off}" fill="none"`;
    let s = '';
    s += `<path d="${G.hid.map((e) => edgeD(e[0], e[1], dy, prog)).join(' ')}" ${stroke}/>`;
    const fillOp = 0.42 * prog;
    s += `<polygon points="${pts(projAll(G.top, dy))}" fill="rgba(8,12,27,${f2(fillOp * 0.9)})"/>`;
    s += `<polygon points="${pts(projAll(G.left, dy))}" fill="rgba(8,12,27,${f2(fillOp)})"/>`;
    s += `<polygon points="${pts(projAll(G.right, dy))}" fill="rgba(8,12,27,${f2(fillOp)})"/>`;
    s += `<path d="${G.vis.map((e) => edgeD(e[0], e[1], dy, prog)).join(' ')}" ${stroke}/>`;
    if (prog > 0.6) {
      const so = (prog - 0.6) / 0.4;
      s += `<g opacity="${f2(so)}"><path d="${st.side}" fill="rgba(8,12,27,.35)"/><path d="${st.lower} ${st.sides}" ${stroke}/><ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${st.top.rx}" ry="${st.top.ry}" ${stroke}/></g>`;
    }
    out += `<g opacity="${f2(w.wire)}">${s}</g>`;
  }
  for (const s of ['glass', 'gperi', 'orange', 'solid', 'peri']) {
    if (!w[s]) continue;
    const S = STATE[s];
    let q = '';
    const faces = [G.top, G.left, G.right];
    if (s === 'glass' || s === 'gperi' || s === 'orange') {
      q += `<path d="${G.hid.map((e) => edgeD(e[0], e[1], dy)).join(' ')}" stroke="${S.edge}" stroke-width="1" opacity=".45" fill="none"/>`;
    }
    faces.forEach((f, n) => { q += `<polygon points="${pts(projAll(f, dy))}" fill="${S.faces[n]}"/>`; });
    q += `<path d="${G.vis.map((e) => edgeD(e[0], e[1], dy)).join(' ')}" stroke="${S.edge}" stroke-width="${S.ew}" fill="none" stroke-linejoin="round"/>`;
    // stud
    if ((s === 'solid' || s === 'peri') && b.studOnly) {
      // handled below: only the stud is drawn
    }
    if (s === 'solid' || s === 'peri') {
      if (b.studOnly) q = '';
      const gid = uid('sg');
      const lit = b.studLit || 0;
      q += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${S.studSide[0]}"/><stop offset="1" stop-color="${S.studSide[1]}"/></linearGradient></defs>`;
      q += `<ellipse cx="${f2(sc[0])}" cy="${f2(sc[1] + 3)}" rx="${STUD.rx + 4}" ry="${STUD.ry + 3}" fill="rgba(60,70,140,.12)"/>`;
      q += `<path d="${st.side}" fill="url(#${gid})"/>`;
      q += `<ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${st.top.rx}" ry="${st.top.ry}" fill="${S.studTop}" stroke="rgba(255,255,255,.9)" stroke-width="1"/>`;
      if (lit) {
        q += `<ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${st.top.rx + 6}" ry="${st.top.ry + 5}" fill="#fff" filter="url(#b8)" opacity="${f2(0.9 * lit)}"/>`;
        q += `<ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${st.top.rx}" ry="${st.top.ry}" fill="#fff" opacity="${f2(lit)}"/>`;
      }
    } else if (s === 'glass') {
      q += `<path d="${st.side}" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.14)" stroke-width="1"/>`;
      q += `<ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${st.top.rx}" ry="${st.top.ry}" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)" stroke-width="1"/>`;
    } else if (s === 'gperi') {
      q += `<path d="${st.side}" fill="rgba(185,193,255,.16)" stroke="#B9C1FF" stroke-width="1.2"/>`;
      q += `<ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${st.top.rx}" ry="${st.top.ry}" fill="rgba(185,193,255,.22)" stroke="#B9C1FF" stroke-width="1.2"/>`;
    } else if (s === 'orange') {
      q += `<path d="${st.side}" fill="rgba(255,90,31,.14)" stroke="#FF5A1F" stroke-width="2"/><ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${st.top.rx}" ry="${st.top.ry}" fill="rgba(255,90,31,.14)" stroke="#FF5A1F" stroke-width="2"/>`;
    }
    if (b.studOnly && s !== 'solid' && s !== 'peri') continue;
    // printed number on the left face (left of centre, so a light line climbing the face never crosses it)
    if (b.num && !b.studOnly && (s === 'solid' || s === 'peri')) {
      const lc = proj([c + 0.24, r + 1, k + 0.5], dy);
      q += `<g transform="matrix(0.866,0.5,0,1,${f2(lc[0])},${f2(lc[1])})">${T(0, 12, b.num, { f: 'm', sz: 34, fill: '#0B1220', op: b.numOp == null ? 0.35 : b.numOp, anchor: 'middle' })}</g>`;
    }
    if (s === 'solid' && b.wipe != null) {
      const ys = projAll(G.hex, dy).map((p) => p[1]);
      const y0 = Math.min(...ys) - STUD.h - STUD.ry, y1 = Math.max(...ys);
      const gid = uid('wg'), mid = uid('wm');
      q = `<defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f2(y0)}" x2="0" y2="${f2(y1)}"><stop offset="${f2(Math.max(0, b.wipe - 0.05))}" stop-color="#fff"/><stop offset="${f2(Math.min(1, b.wipe + 0.05))}" stop-color="#000"/></linearGradient><mask id="${mid}"><rect x="0" y="0" width="1920" height="1080" fill="url(#${gid})"/></mask></defs><g mask="url(#${mid})">${q}</g>`;
    }
    out += `<g opacity="${f2(w[s])}">${q}</g>`;
  }
  const op = b.op == null ? 1 : b.op;
  return op === 1 ? out : `<g opacity="${f2(op)}">${out}</g>`;
}

/* world(opts): opts.def = default block props; opts.blocks = {'c,r,k': props | null (hidden)};
   opts.level = px parting per level; opts.scale {s, cx, cy}; opts.after = svg drawn on top inside the world transform */
function world(opts = {}) {
  const list = [];
  for (const [c, r, k] of BLOCKS) {
    const key = `${c},${r},${k}`;
    const ov = opts.blocks && key in opts.blocks ? opts.blocks[key] : {};
    if (ov === null) continue;
    const b = { c, r, k, ...(opts.def || {}), ...ov };
    if (opts.level) b.dy = (b.dy || 0) + opts.level * k;
    list.push(b);
  }
  list.sort((a, b) => (a.c + a.r) - (b.c + b.r) || a.k - b.k);
  // transparent blocks first, opaque (solid/periwinkle) blocks on top: glass and wire never dim a lit block,
  // which matches the reference fragments (the first block's faces read fully through the glass in front).
  const opaque = (b) => ((b.w && (b.w.solid || 0) + (b.w.peri || 0)) || 0) >= 0.5;
  let s = (opts.before || '') + list.filter((b) => !opaque(b)).map((b) => renderBlock(b)).join('') +
    list.filter(opaque).map((b) => renderBlock(b)).join('') + (opts.after || '') +
    (opts.studsOnTop ? list.filter((b) => opaque(b) && (b.w.solid || 0) + (b.w.peri || 0) >= 1).map((b) => renderBlock({ ...b, studOnly: true })).join('') : '') +
    (opts.top || '');
  if (opts.scale) {
    const { s: k, cx, cy } = opts.scale;
    s = `<g transform="translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})">${s}</g>`;
  }
  return s;
}
/* union silhouette of the cluster (for clip paths) */
function clusterShapes(level = 0) {
  return BLOCKS.map(([c, r, k]) => {
    const G = geom(c, r, k); const dy = level * k;
    const sc = proj(G.stud, dy); const st = studPaths(sc[0], sc[1]);
    return `<polygon points="${pts(projAll(G.hex, dy))}"/><path d="${st.side}"/><ellipse cx="${f2(st.top.cx)}" cy="${f2(st.top.cy)}" rx="${STUD.rx}" ry="${STUD.ry}"/>`;
  }).join('');
}

/* leader line + dot + label */
function leader(x, y1, y2, label, o = {}) {
  const op = o.op == null ? 1 : o.op;
  const dotY = o.dotY == null ? y2 : o.dotY;
  const lx = o.lx == null ? x - 18 : o.lx;
  const ly = o.ly == null ? dotY + 14 : o.ly;
  return `<g opacity="${op}"><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="rgba(223,230,243,.5)" stroke-width="1"/>
    <circle cx="${x}" cy="${dotY}" r="4" fill="#F3F5FA"/>
    ${label ? MONO(lx, ly, label, { fill: C.text, op: 0.85, anchor: o.anchor || 'end' }) : ''}</g>`;
}

/* light line (B8) drawn to a fraction of its polyline length */
function polyPart(points, frac) {
  const segs = []; let L = 0;
  for (let n = 1; n < points.length; n++) { const d = Math.hypot(points[n][0] - points[n - 1][0], points[n][1] - points[n - 1][1]); segs.push(d); L += d; }
  let rem = L * frac; const out = [points[0]];
  for (let n = 1; n < points.length; n++) {
    if (rem >= segs[n - 1]) { out.push(points[n]); rem -= segs[n - 1]; } else { out.push(lerpP(points[n - 1], points[n], rem / segs[n - 1])); break; }
  }
  return out;
}
function polyAt(points, frac) { const p = polyPart(points, frac); return p[p.length - 1]; }
function lightLine(points, frac = 1, o = {}) {
  if (frac <= 0) return '';
  const p = polyPart(points, frac);
  const d = 'M' + p.map((q) => `${f2(q[0])},${f2(q[1])}`).join(' L');
  let s = `<path d="${d}" stroke="rgba(97,114,243,.75)" stroke-width="10" fill="none" filter="url(#b5)" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="${d}" stroke="#B9C1FF" stroke-opacity=".9" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (o.spark && frac < 1) { const e = p[p.length - 1]; s += spark(e[0], e[1], 10); }
  return s;
}
function spark(x, y, d = 12, glow = 20) {
  return `<circle cx="${f2(x)}" cy="${f2(y)}" r="${glow / 2}" fill="#fff" filter="url(#b6)" opacity=".8"/><circle cx="${f2(x)}" cy="${f2(y)}" r="${d / 2}" fill="#fff"/>`;
}
const LINES_V1 = {
  '01-02': [[1120, 634.5], [1360, 773.5]],
  '02-03': [[1360, 773.5], [1540, 669.25], [1540, 541.25], [1600, 506.5]],
  '01-04': [[1120, 634.5], [1180, 599.75], [1180, 471.75], [1240, 437]],
  '03-05': [[1600, 506.5], [1480, 437]],
  '04-06': [[1240, 437], [1300, 402.25], [1300, 274.25], [1360, 239.5]],
  '05-06': [[1480, 437], [1420, 402.25], [1420, 274.25], [1360, 239.5]]
};
const LINES = Object.fromEntries(Object.entries(LINES_V1).map(([k, v]) => [k, v.map(([x, y]) => [x + OX - 1360, y])]));

/* glass panel/card */
function glassRect(x, y, w, h, o = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx == null ? 20 : o.rx}" fill="${o.fill || 'rgba(255,255,255,.06)'}" stroke="${o.stroke || 'rgba(255,255,255,.12)'}" stroke-width="${o.sw || 1}" ${o.filter ? `filter="url(#${o.filter})"` : ''} ${o.op != null ? `opacity="${o.op}"` : ''}/>`;
}

/* affine matrix mapping local box (0..w,0..h) to a parallelogram A(TL) B(TR) D(BL) */
function affine(A, B, D, w, h) {
  return `matrix(${f2((B[0] - A[0]) / w)},${f2((B[1] - A[1]) / w)},${f2((D[0] - A[0]) / h)},${f2((D[1] - A[1]) / h)},${f2(A[0])},${f2(A[1])})`;
}
function rotRectCorners(cx, cy, w, h, deg) {
  const a = deg * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
  return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * co - y * si, cy + x * si + y * co]);
}
/* top-face rhombus corners mapped to card corners TL->left, TR->top, BR->right, BL->bottom */
function topFaceCardOrder(c, r, k, dy = 0) {
  const t = [P(c, r, k + 1), P(c + 1, r, k + 1), P(c + 1, r + 1, k + 1), P(c, r + 1, k + 1)].map((p) => [p[0], p[1] - dy]);
  // t: top, right, bottom, left
  return [t[3], t[0], t[1], t[2]];
}

/* bilinear map over quad [TL,TR,BR,BL] */
function bil(q, u, v) {
  const top = lerpP(q[0], q[1], u), bot = lerpP(q[3], q[2], u);
  return lerpP(top, bot, v);
}
