/* Wicflow hero storyboard v2: one function per key frame (ids = beat + time in centiseconds).
   v2 is text-light and visual-first: the voice-over carries the words. Outside the product UI the film shows
   three text moments only: the leader label "First block · guaranteed" (B5), the leader label
   "All of it connected" (B8) and the end lockup (wicflow + one line + the "Book an AI mapping" button, B9).
   UI text is small and only where a real interface would show it (a status chip, a row label, a tag). */
'use strict';

/* ---------- helpers ---------- */
const bar = (x, y, w, h = 12, fill = 'rgba(255,255,255,.20)', op = 1) =>
  `<rect x="${f2(x)}" y="${f2(y)}" width="${f2(Math.max(0, w))}" height="${h}" rx="${h / 2}" fill="${fill}"${op !== 1 ? ` opacity="${op}"` : ''}/>`;
function pill(x, y, text, o = {}) { // x = left edge (right edge with o.right), y = top
  const sz = o.sz || 24, padX = o.padX || 16, h = o.h || Math.round(sz * 1.75);
  const dotW = o.dot ? 20 : 0;
  const w = measure(text, { f: o.f || 'm', sz, w: o.w || 400 }) + padX * 2 + dotW;
  const x0 = o.right ? x - w : x;
  let s = `<rect x="${f2(x0)}" y="${y}" width="${f2(w)}" height="${h}" rx="${h / 2}" fill="${o.fill || 'rgba(255,255,255,.07)'}" stroke="${o.stroke || 'rgba(255,255,255,.14)'}" stroke-width="1"/>`;
  if (o.dot) {
    if (o.ring) s += `<circle cx="${f2(x0 + padX + 5)}" cy="${f2(y + h / 2)}" r="${f2(8 + 6 * o.ring)}" fill="none" stroke="${o.dot}" stroke-opacity="${f2(0.6 * (1 - o.ring))}" stroke-width="2"/>`;
    s += `<circle cx="${f2(x0 + padX + 5)}" cy="${f2(y + h / 2)}" r="5" fill="${o.dot}"/>`;
  }
  s += T(x0 + padX + dotW, y + h / 2 + sz * 0.36, text, { f: o.f || 'm', sz, w: o.w || 400, fill: o.tc || C.text });
  return `<g${o.op != null ? ` opacity="${o.op}"` : ''}>${s}</g>`;
}
const ICON = {
  doc: '<path d="M-14,-20 H6 L16,-10 V20 H-14 Z"/><path d="M6,-20 V-10 H16"/><path d="M-8,-1 H8 M-8,7 H8 M-8,15 H2"/>',
  chat: '<path d="M-16,-15 H16 a5,5 0 0 1 5,5 V7 a5,5 0 0 1 -5,5 H-4 L-13,19 V12 H-16 a5,5 0 0 1 -5,-5 V-10 a5,5 0 0 1 5,-5 Z"/><path d="M-11,-5 H11 M-11,3 H4"/>',
  clock: '<circle cx="0" cy="0" r="18"/><path d="M0,-10 V0 L8,6"/>',
  invoice: '<path d="M-14,-20 H14 V20 L9.33,16 L4.67,20 L0,16 L-4.67,20 L-9.33,16 L-14,20 Z"/><path d="M-8,-10 H8 M-8,-2 H8 M-8,6 H2"/>',
  chart: '<path d="M-18,18 H18"/><path d="M-12,14 V4 M-4,14 V-6 M4,14 V-1 M12,14 V-14"/>',
  person: '<circle cx="0" cy="-7" r="8"/><path d="M-15,18 a15,13 0 0 1 30,0"/>',
  personPlus: '<circle cx="-5" cy="-7" r="8"/><path d="M-20,18 a15,13 0 0 1 30,0"/><path d="M16,-13 V-1 M10,-7 H22"/>',
  sparkle: '<path d="M0,-18 C2,-6 6,-2 18,0 C6,2 2,6 0,18 C-2,6 -6,2 -18,0 C-6,-2 -2,-6 0,-18 Z"/>',
  check: '<path d="M-10,1 L-3,8 L11,-7"/>',
  send: '<path d="M-14,-12 L16,0 L-14,12 L-9,0 Z"/>',
  trend: '<path d="M-18,14 L-6,2 L2,8 L18,-10"/><path d="M7,-10 H18 V1"/>',
  arrow: '<path d="M-16,0 H16 M6,-10 L16,0 L6,10"/>'
};
function icon(name, x, y, s = 1, o = {}) {
  const c = o.c || 'rgba(223,230,243,.9)', sw = o.sw || 2.5;
  return `<g transform="translate(${f2(x)},${f2(y)}) scale(${s})" fill="${o.fill || 'none'}" stroke="${c}" stroke-width="${f2(sw / s)}" stroke-linecap="round" stroke-linejoin="round"${o.op != null ? ` opacity="${o.op}"` : ''}>${ICON[name]}</g>`;
}
function tile(x, y, size, name, o = {}) { // centred on x,y
  const r = o.r || size * 0.26;
  let s = `<rect x="${f2(x - size / 2)}" y="${f2(y - size / 2)}" width="${size}" height="${size}" rx="${f2(r)}" fill="${o.fill || 'rgba(255,255,255,.07)'}" stroke="${o.stroke || 'rgba(255,255,255,.15)'}" stroke-width="${o.sw || 1}"/>`;
  if (o.glow) s = `<rect x="${f2(x - size / 2)}" y="${f2(y - size / 2)}" width="${size}" height="${size}" rx="${f2(r)}" fill="${o.glow}" filter="url(#b20)"/>` + s;
  return s + icon(name, x, y, o.is || size / 80, { c: o.ic, sw: o.isw || 2.5 });
}
function ringArc(cx, cy, r, frac, col, sw = 4) {
  const L = 2 * Math.PI * r;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="${sw}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${f2(L * frac)} ${f2(L)}" transform="rotate(-90 ${cx} ${cy})"/>`;
}
function timer(cx, cy, r, frac, col) {
  return ringArc(cx, cy, r, frac, col, 4) + `<path d="M${cx},${cy - r * 0.5} V${cy} L${f2(cx + r * 0.4)},${f2(cy + r * 0.3)}" stroke="${col}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function cursor(x, y, s = 1) {
  return `<g transform="translate(${f2(x)},${f2(y)}) scale(${s})" filter="url(#shLift)"><path d="M0,0 L0,30 L8,23 L13.5,35 L18.5,32.8 L13,21 L23,21 Z" fill="#fff" stroke="#0B1220" stroke-width="1.6" stroke-linejoin="round"/></g>`;
}
const caret = (x, y, h = 24) => `<rect x="${f2(x)}" y="${f2(y)}" width="3" height="${h}" rx="1.5" fill="#B9C1FF"/>`;
const shell = (w, h, o = {}) => `<rect x="0" y="0" width="${w}" height="${h}" rx="${o.rx || 26}" fill="${o.fill || '#161F3F'}" stroke="${o.stroke || 'rgba(255,255,255,.14)'}" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
function miniCube(x, y, s = 1) { // small periwinkle block glyph (the first block), centred
  const a = 14 * s, b = 8 * s, h = 16 * s;
  return `<g><polygon points="${f2(x)},${f2(y - b - h / 2)} ${f2(x + a)},${f2(y - h / 2)} ${f2(x)},${f2(y + b - h / 2)} ${f2(x - a)},${f2(y - h / 2)}" fill="#CDD3FF"/>
    <polygon points="${f2(x - a)},${f2(y - h / 2)} ${f2(x)},${f2(y + b - h / 2)} ${f2(x)},${f2(y + b + h / 2)} ${f2(x - a)},${f2(y + h / 2)}" fill="#B9C1FF"/>
    <polygon points="${f2(x)},${f2(y + b - h / 2)} ${f2(x + a)},${f2(y - h / 2)} ${f2(x + a)},${f2(y + h / 2)} ${f2(x)},${f2(y + b + h / 2)}" fill="#98A2F5"/></g>`;
}
function bez(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
}
function flow(a, b, o = {}) { // horizontal S-curve connector with data dots
  const k = o.k || Math.max(50, Math.abs(b[0] - a[0]) * 0.45);
  const p1 = [a[0] + k, a[1]], p2 = [b[0] - k, b[1]];
  const lit = o.lit == null ? 1 : o.lit;
  let s = `<path d="M${f2(a[0])},${f2(a[1])} C${f2(p1[0])},${f2(p1[1])} ${f2(p2[0])},${f2(p2[1])} ${f2(b[0])},${f2(b[1])}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2"/>`;
  if (lit > 0) {
    s += `<path d="M${f2(a[0])},${f2(a[1])} C${f2(p1[0])},${f2(p1[1])} ${f2(p2[0])},${f2(p2[1])} ${f2(b[0])},${f2(b[1])}" fill="none" stroke="rgba(185,193,255,.55)" stroke-width="2" opacity="${lit}"/>`;
    for (const t of (o.dots || [0.3, 0.62])) {
      const p = bez(a, p1, p2, b, t);
      s += `<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="9" fill="#B9C1FF" opacity="${f2(0.45 * lit)}" filter="url(#b4)"/><circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="4.5" fill="#fff" opacity="${f2(lit)}"/>`;
    }
  }
  return s;
}
const xf = (p, s = 1, dx = 0, dy = 0, cx = 960, cy = 570) => [cx + (p[0] - cx) * s + dx, cy + (p[1] - cy) * s + dy];
function placed(inner, s = 1, dx = 0, dy = 0, cx = 960, cy = 570) {
  return `<g transform="translate(${dx},${dy}) translate(${cx},${cy}) scale(${s}) translate(${-cx},${-cy})">${inner}</g>`;
}

/* ---------- B1: the company's real work, four big cards (local box 520 x 320) ---------- */
const CW = 520, CH = 320;
function quoteBody(st = {}) {
  const quiet = st.quiet || 0;
  const ring = st.ring == null ? 0.72 : st.ring;
  const col = quiet > 0.5 ? '#f3a585' : '#B9C1FF';
  let c = tile(64, 64, 64, 'doc', { is: 0.95 });
  c += bar(112, 46, 170, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 110, 11);
  c += pill(488, 40, 'Open', { right: true, sz: 22 });
  [[128, 230], [166, 190], [204, 212]].forEach(([y, w]) => { c += bar(34, y, w, 12) + bar(420, y, 66, 12); });
  c += `<line x1="34" y1="240" x2="486" y2="240" stroke="rgba(255,255,255,.10)"/>`;
  c += timer(60, 280, 22, ring, col) + bar(98, 274, 130, 12);
  c += T(392, 291, '€', { f: 'i', sz: 30, w: 500, fill: C.muted }) + bar(418, 278, 68, 16, 'rgba(185,193,255,.55)');
  // a reply bubble on the corner: three dots while the quote is alive, faint and dashed once it has gone quiet
  const dots = quiet > 0.5 ? [0.18, 0.14, 0.1] : [0.95, 0.65, 0.38];
  let bub = `<rect x="430" y="-34" width="104" height="52" rx="26" fill="${quiet > 0.5 ? 'rgba(11,18,32,.6)' : '#1A2350'}" stroke="${quiet > 0.5 ? 'rgba(223,230,243,.3)' : 'rgba(185,193,255,.5)'}" stroke-width="1.2"${quiet > 0.5 ? ' stroke-dasharray="5 5"' : ''}/>`;
  dots.forEach((o, n) => { bub += `<circle cx="${458 + n * 24}" cy="-8" r="6" fill="#F3F5FA" opacity="${o}"/>`; });
  // gone quiet: the quote's activity trace decays to a flat line under the card
  if (quiet > 0.5) {
    for (let i = 0; i < 30; i++) {
      const x = 30 + i * 15.6, h = Math.max(3, 40 * Math.exp(-i / 6) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7))));
      bub += `<rect x="${f2(x)}" y="${f2(372 - h / 2)}" width="6" height="${f2(h)}" rx="3" fill="${i < 9 ? '#B9C1FF' : 'rgba(223,230,243,.28)'}" opacity="${f2(Math.max(0.3, 1 - i / 14))}"/>`;
    }
  }
  return shell(CW, CH, quiet > 0.5 ? { stroke: 'rgba(255,255,255,.10)', fill: '#121A35' } : {}) +
    `<g opacity="${f2(1 - 0.3 * quiet)}">${c}</g>` + bub;
}
function enquiryBody(st = {}) {
  const pile = st.pile || 0;
  let c = tile(64, 64, 64, 'chat', { is: 0.95 });
  c += bar(112, 46, 150, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 96, 11);
  [[132, 210, 120], [192, 170, 96], [252, 196, 140]].forEach(([y, w1, w2], n) => {
    c += `<circle cx="52" cy="${y + 10}" r="16" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.16)"/>`;
    c += bar(82, y, w1, 12, 'rgba(255,255,255,.26)') + bar(82, y + 20, w2, 10);
    if (n < (pile > 0.5 ? 3 : 1)) c += `<circle cx="478" cy="${y + 10}" r="7" fill="${pile > 0.5 ? C.orange : '#B9C1FF'}"/>`;
  });
  // new enquiries piling up on top of the inbox
  const spots = [[372, 236, -4], [352, 190, 5], [380, 146, -6], [346, 100, 4], [376, 54, -3], [356, 8, 6], [372, -38, -5]];
  const n = pile > 0.5 ? 7 : (st.arrive ? 1 : 0);
  let p = '';
  for (let i = 0; i < n; i++) {
    const [cx, cy, rot] = i === 0 && n === 1 ? [372, -30, -4] : spots[i];
    p += `<g transform="translate(${cx},${cy}) rotate(${rot})" filter="url(#shLift)"><rect x="-112" y="-30" width="224" height="60" rx="16" fill="#18213F" stroke="rgba(255,255,255,.16)"/>
      <circle cx="-82" cy="0" r="13" fill="rgba(255,255,255,.12)"/>${bar(-60, -12, 110, 10, 'rgba(255,255,255,.28)')}${bar(-60, 4, 76, 8)}
      <circle cx="86" cy="0" r="6.5" fill="${pile > 0.5 ? C.orange : '#B9C1FF'}"/></g>`;
  }
  return shell(CW, CH) + c + p;
}
function hoursBody(st = {}) {
  const rt = st.retype || 0;
  let c = tile(64, 64, 64, 'clock', { is: 0.95 });
  c += bar(112, 46, 120, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 80, 11);
  const filled = new Set(['0,0', '1,0', '2,0', '0,1', '1,1', '3,1', '0,2', '2,2', '3,2', '4,2', '1,3']);
  for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) {
    const f = filled.has(`${q},${r}`);
    c += `<rect x="${34 + q * 40}" y="${116 + r * 40}" width="32" height="32" rx="8" fill="${f ? 'rgba(97,114,243,.5)' : 'rgba(255,255,255,.04)'}" stroke="${f ? 'rgba(185,193,255,.55)' : 'rgba(255,255,255,.16)'}"/>`;
  }
  // invoice
  let zig = 'M300,34 H488 V282'; for (let i = 0; i < 8; i++) zig += ` l-11.75,${i % 2 ? 10 : -10}`; zig += ' Z';
  c += `<path d="${zig}" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)" stroke-width="1"/>`;
  c += icon('invoice', 334, 70, 0.7) + bar(360, 64, 90, 12, 'rgba(255,255,255,.28)');
  [116, 150, 184, 218].forEach((y, n) => {
    if (rt && n === 2) { c += bar(318, y, 52, 12, 'rgba(223,230,243,.7)') + caret(373, y - 6, 24); return; }
    if (rt && n === 3) { c += `<rect x="318" y="${y}" width="96" height="12" rx="6" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="4 4"/>`; return; }
    c += bar(318, y, 96, 12) + bar(436, y, 34, 12);
  });
  c += T(318, 262, '€', { f: 'i', sz: 26, w: 500, fill: C.muted }) + bar(436, 250, 34, 14, 'rgba(185,193,255,.5)');
  if (rt) {
    c += `<rect x="28" y="${110 + 80}" width="210" height="44" rx="12" fill="none" stroke="#B9C1FF" stroke-width="2"/>`;
    c += `<path d="M240,212 C268,212 278,196 300,192" fill="none" stroke="#B9C1FF" stroke-width="2" stroke-dasharray="5 5"/><path d="M292,186 L302,192 L293,199" fill="none" stroke="#B9C1FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    c += cursor(380, 196, 1.05);
  }
  return shell(CW, CH) + c;
}
function reportBody(st = {}) {
  const hand = st.hand || 0;
  let c = tile(64, 64, 64, 'chart', { is: 0.95 });
  c += bar(112, 46, 140, 14, 'rgba(255,255,255,.30)') + bar(112, 72, 90, 11);
  const hs = [64, 96, 80, 124, 104, 150];
  hs.forEach((h, n) => {
    const x = 40 + n * 46;
    if (hand && n === 5) {
      c += `<rect x="${x}" y="${292 - h}" width="30" height="${h}" rx="6" fill="none" stroke="rgba(185,193,255,.6)" stroke-width="1.5" stroke-dasharray="5 4"/>`;
      c += `<rect x="${x}" y="${292 - h * 0.55}" width="30" height="${f2(h * 0.55)}" rx="6" fill="url(#barV)" opacity=".9"/>`;
      c += cursor(x + 8, 292 - h * 0.55 - 8, 1.05);
    } else c += `<rect x="${x}" y="${292 - h}" width="30" height="${h}" rx="6" fill="url(#barV)" opacity="${hand ? 0.9 : 0.8}"/>`;
  });
  c += `<line x1="34" y1="294" x2="312" y2="294" stroke="rgba(255,255,255,.18)"/>`;
  for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) {
    const hi = hand && r === 3 && q === 1;
    c += `<rect x="${340 + q * 50}" y="${126 + r * 34}" width="46" height="28" rx="5" fill="${hi ? 'rgba(185,193,255,.16)' : 'rgba(255,255,255,.04)'}" stroke="${hi ? '#B9C1FF' : 'rgba(255,255,255,.12)'}" stroke-width="${hi ? 1.5 : 1}"/>`;
    if (!hi && (r + q) % 2 === 0) c += bar(348 + q * 50, 136 + r * 34, 26, 8, 'rgba(255,255,255,.22)');
  }
  if (hand) c += caret(402, 228 + 2, 20);
  return shell(CW, CH) + c;
}
const CARD = {
  QUOTE: { cx: 690, cy: 330, rot: -2, body: quoteBody },
  ENQUIRY: { cx: 1250, cy: 350, rot: 2, body: enquiryBody },
  HOURS: { cx: 700, cy: 762, rot: 1.5, body: hoursBody },
  REPORT: { cx: 1244, cy: 768, rot: -1.5, body: reportBody }
};
function cardAt(type, st = {}, o = {}) {
  const k = CARD[type];
  const op = o.op == null ? 1 : o.op;
  return `<g opacity="${op}" filter="url(#shCard)"><g transform="translate(${k.cx + (o.dx || 0)},${k.cy + (o.dy || 0)}) rotate(${k.rot}) scale(${o.s || 1}) translate(${-CW / 2},${-CH / 2})">${k.body(st)}</g></g>`;
}
function cardMorph(type, toCorners, t, contentOp, st = {}) {
  const k = CARD[type];
  const from = rotRectCorners(k.cx, k.cy, CW, CH, k.rot);
  const q = from.map((p, n) => lerpP(p, toCorners[n], t));
  const body = `<rect x="0" y="0" width="${CW}" height="${CH}" rx="26" fill="#141C3B" opacity="${f2(Math.min(1, 0.4 + contentOp))}"/><g opacity="${contentOp}">${k.body(st)}</g>`;
  return `<g filter="url(#shCard)"><g transform="${affine(q[0], q[1], q[3], CW, CH)}">${body}<rect x="0" y="0" width="${CW}" height="${CH}" rx="26" fill="rgba(185,193,255,.06)" stroke="rgba(185,193,255,.6)" stroke-width="1.4" vector-effect="non-scaling-stroke"/></g></g>`;
}
const frame0 = () => cardAt('HOURS') + cardAt('REPORT') + cardAt('QUOTE') + cardAt('ENQUIRY', { arrive: 1 });
const CARD_BLOCK = { QUOTE: [0, 2, 0], ENQUIRY: [2, 2, 0], HOURS: [0, 1, 1], REPORT: [1, 0, 1] };

/* ---------- labels (reference style: line, dot, Fragment Mono label) ---------- */
const FIRST_LABEL = (op = 1) => `<g opacity="${op}"><line x1="600" y1="764" x2="600" y2="928" stroke="rgba(223,230,243,.5)" stroke-width="1.2"/><circle cx="600" cy="932" r="4.5" fill="#B9C1FF"/>${MONO(620, 943, 'First block · guaranteed', { sz: 32, fill: C.text, op: 0.9 })}</g>`;
const TOP_LABEL = (op = 1, dy = 0) => `<g opacity="${op}" transform="translate(0,${dy})"><line x1="960" y1="178" x2="960" y2="116" stroke="rgba(223,230,243,.5)" stroke-width="1.2"/><circle cx="960" cy="112" r="4.5" fill="#F3F5FA"/>${MONO(940, 123, 'All of it connected', { sz: 32, fill: C.text, op: 0.9, anchor: 'end' })}</g>`;

/* ---------- world helpers ---------- */
function namedState(map) { const o = {}; for (const k in map) o[KEY_OF[k]] = map[k]; return o; }
function solidNamed(extra = {}) {
  const b = (n, w) => ({ w, num: n, ...(extra[n] || {}) });
  return namedState({ '01': b('01', { peri: 1 }), '02': b('02', { solid: 1 }), '03': b('03', { solid: 1 }), '04': b('04', { solid: 1 }), '05': b('05', { solid: 1 }), '06': b('06', { solid: 1 }) });
}
function pulsesAt(list) { return list.map(([x, y]) => spark(x, y, 12, 20)).join(''); }
function allLines() { return Object.values(LINES).map((l) => lightLine(l)).join(''); }
function litWorld(extra = {}) {
  const lit = { studLit: 1, glowMul: 1.2 };
  const blocks = solidNamed({ '01': lit, '02': lit, '03': lit, '04': lit, '05': lit, '06': lit });
  const tc = topCentre(0, 0, 2);
  const halo = `<ellipse cx="${tc[0]}" cy="${tc[1] + 40}" rx="170" ry="150" fill="rgba(185,193,255,.22)" filter="url(#b30)"/>`;
  return { def: { w: { glass: 1 } }, blocks, before: halo, studsOnTop: true, ...extra };
}
function floorLines(op = 1) {
  const wire = `stroke="rgba(223,230,243,.42)" stroke-width="1.5" stroke-dasharray="6 6" fill="none" opacity="${op}"`;
  let s = `<polygon points="${pts([P(0, 0, 0), P(3, 0, 0), P(3, 3, 0), P(0, 3, 0)])}" ${wire}/>`;
  for (const n of [1, 2]) s += `<path d="M${P(n, 0, 0)} L${P(n, 3, 0)} M${P(0, n, 0)} L${P(3, n, 0)}" ${wire}/>`;
  return s;
}
function glintArc(c, r, k, dy = 0) {
  const sc = topCentre(c, r, k); const cx = sc[0], cy = sc[1] - STUD.h - dy;
  return `<path d="M${cx - 38},${cy + 12} A44,25.5 0 0 0 ${cx + 6},${cy + 25.3}" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".95"/><path d="M${cx - 38},${cy + 12} A44,25.5 0 0 0 ${cx + 6},${cy + 25.3}" stroke="#fff" stroke-width="6" fill="none" opacity=".5" filter="url(#b3)"/>`;
}

/* ---------- B3: the AI mapping (an interface) ---------- */
const NODES = [
  { key: 'cust', icon: 'personPlus', x: 400, y: 420, lost: 165, blk: [2, 0, 1] },
  { key: 'enq', icon: 'chat', x: 680, y: 500, lost: 205, blk: [2, 2, 0] },
  { key: 'quote', icon: 'doc', x: 960, y: 420, lost: 250, blk: [0, 2, 0] },
  { key: 'hours', icon: 'clock', x: 1240, y: 500, lost: 130, blk: [0, 1, 1] },
  { key: 'report', icon: 'chart', x: 1520, y: 420, lost: 100, blk: [1, 0, 1] }
];
const BASE = 872, NS = 128;
const PEACH_V = `<linearGradient id="peachV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9c8"/><stop offset="1" stop-color="#f3a585" stop-opacity=".75"/></linearGradient>
  <linearGradient id="periV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDD3FF"/><stop offset="1" stop-color="#6172F3"/></linearGradient>`;
function mapWindow(o = {}) {
  let s = `<rect x="220" y="140" width="1480" height="800" rx="32" fill="rgba(255,255,255,.045)" stroke="rgba(255,255,255,.11)" stroke-width="1" filter="url(#shCard60)"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  if (o.chrome === false) return s;
  s += MONO(270, 200, 'AI mapping', { sz: 26, fill: C.muted });
  const x0 = 1250, x1 = 1640, fx = lerp(x0, x1, o.week == null ? 0 : o.week);
  s += `<line x1="${x0}" y1="186" x2="${x1}" y2="186" stroke="rgba(255,255,255,.16)" stroke-width="2"/><line x1="${x0}" y1="186" x2="${f2(fx)}" y2="186" stroke="#B9C1FF" stroke-width="2"/>`;
  s += `<circle cx="${x0}" cy="186" r="5" fill="#F3F5FA"/><circle cx="${x1}" cy="186" r="5" fill="${o.week >= 1 ? '#B9C1FF' : 'rgba(223,230,243,.35)'}"/>`;
  if (o.week > 0 && o.week < 1) s += `<circle cx="${f2(fx)}" cy="186" r="12" fill="rgba(185,193,255,.45)" filter="url(#b4)"/><circle cx="${f2(fx)}" cy="186" r="4" fill="#fff"/>`;
  s += MONO(x0, 216, 'Week 1', { sz: 20, anchor: 'middle', fill: 'rgba(223,230,243,.55)' }) + MONO(x1, 216, 'Week 2', { sz: 20, anchor: 'middle', fill: 'rgba(223,230,243,.55)' });
  s += `<line x1="220" y1="240" x2="1700" y2="240" stroke="rgba(255,255,255,.08)"/>`;
  return s;
}
function mapBody(o = {}) {
  const fill = o.fill || [1, 1, 1, 1, 1];
  const dim = o.found ? 0.36 : 1;
  let s = `<line x1="300" y1="${BASE}" x2="1620" y2="${BASE}" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/>` + icon('clock', 272, BASE, 0.62, { c: 'rgba(255,217,200,.7)', sw: 2 });
  // connectors
  for (let i = 0; i < NODES.length - 1; i++) {
    const a = NODES[i], b = NODES[i + 1];
    s += `<g opacity="${o.found ? 0.4 : 1}">${flow([a.x + NS / 2 + 6, a.y], [b.x - NS / 2 - 6, b.y], { lit: o.flow == null ? 1 : o.flow, dots: [0.35 + 0.1 * (i % 2), 0.75] })}</g>`;
  }
  NODES.forEach((n, i) => {
    const isQ = n.key === 'quote';
    const op = o.found && !isQ ? dim : 1;
    const h = n.lost * fill[i];
    const top = BASE - h;
    let g = '';
    // time draining out of the process into its column
    const y0 = n.y + NS / 2 + 18, y1 = top - 14;
    if (y1 > y0 && fill[i] < 1) {
      for (let d = 0; d < 4; d++) {
        const y = lerp(y0, y1, (d + 0.35) / 4);
        g += `<circle cx="${n.x}" cy="${f2(y)}" r="${f2(3.2 + d * 0.5)}" fill="#ffd9c8" opacity="${f2(0.35 + d * 0.15)}"/>`;
      }
    }
    if (y1 > y0 && fill[i] >= 1 && !(o.found && isQ)) g += `<line x1="${n.x}" y1="${f2(y0)}" x2="${n.x}" y2="${f2(y1)}" stroke="rgba(255,217,200,.22)" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>`;
    const barFill = o.found && isQ ? 'url(#periV)' : 'url(#peachV)';
    if (o.found && isQ) g += `<rect x="${n.x - 36}" y="${f2(top)}" width="72" height="${f2(h)}" rx="14" fill="rgba(97,114,243,.6)" filter="url(#b15)"/>`;
    g += `<rect x="${n.x - 36}" y="${f2(top)}" width="72" height="${f2(h)}" rx="14" fill="${barFill}" opacity=".92"/>`;
    // node
    if (o.found && isQ) {
      g += tile(n.x, n.y, NS, n.icon, { fill: 'rgba(185,193,255,.24)', stroke: '#B9C1FF', sw: 2, ic: '#F3F5FA', is: 1.6, isw: 3, glow: 'rgba(97,114,243,.55)' });
      g += ringArc(n.x, n.y, 104, 1, 'rgba(185,193,255,.35)', 2);
      const k = 86, a = 26;
      g += `<path d="M${n.x - k},${n.y - k + a} V${n.y - k} H${n.x - k + a} M${n.x + k - a},${n.y - k} H${n.x + k} V${n.y - k + a} M${n.x + k},${n.y + k - a} V${n.y + k} H${n.x + k - a} M${n.x - k + a},${n.y + k} H${n.x - k} V${n.y + k - a}" fill="none" stroke="#B9C1FF" stroke-width="3" stroke-linecap="round"/>`;
    } else {
      const scanned = o.scanX != null && o.scanX > n.x;
      g += tile(n.x, n.y, NS, n.icon, { is: 1.6, isw: 3, stroke: scanned ? 'rgba(185,193,255,.45)' : 'rgba(255,255,255,.15)' });
    }
    s += `<g opacity="${op}">${g}</g>`;
  });
  if (o.scanX != null) {
    s += `<defs><linearGradient id="scanB" x1="0" x2="1"><stop offset="0" stop-color="#6172F3" stop-opacity="0"/><stop offset="1" stop-color="#6172F3" stop-opacity=".16"/></linearGradient></defs>`;
    s += `<rect x="${o.scanX - 160}" y="252" width="160" height="${BASE - 252 + 30}" fill="url(#scanB)"/><line x1="${o.scanX}" y1="252" x2="${o.scanX}" y2="${BASE + 30}" stroke="#B9C1FF" stroke-width="1.5" opacity=".8"/>`;
  }
  return s;
}

/* ---------- B4: the costed plan (a UI card) ---------- */
const ROWS = {
  quote: { icon: 'doc', label: 'Quote follow-ups', ret: 300, cost: 110 },
  enq: { icon: 'chat', label: 'Enquiries answered', ret: 245, cost: 96 },
  cust: { icon: 'personPlus', label: 'New customers', ret: 195, cost: 104 },
  hours: { icon: 'clock', label: 'Hours to invoices', ret: 150, cost: 90 },
  report: { icon: 'chart', label: 'Owner’s weekly report', ret: 115, cost: 80 }
};
const SLOT = [350, 470, 590, 710, 830];
function planCard(o = {}) {
  let s = `<rect x="380" y="140" width="1160" height="800" rx="32" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.11)" stroke-width="1" filter="url(#shCard60)"/>`;
  s += T(440, 222, 'Costed plan', { f: 'h', sz: 44, w: 500, ls: -0.6, op: o.titleOp == null ? 1 : o.titleOp });
  s += icon('trend', 1086, 206, 0.8, { c: 'rgba(185,193,255,.8)' }) + T(1398, 219, '€', { f: 'i', sz: 34, w: 500, fill: C.muted });
  s += `<line x1="410" y1="262" x2="1510" y2="262" stroke="rgba(255,255,255,.10)"/>`;
  return s;
}
function planRow(key, cy, o = {}) {
  const d = ROWS[key];
  const grow = o.grow == null ? 1 : o.grow;
  let s = '';
  if (o.plate) s += `<rect x="410" y="${cy - 50}" width="1100" height="100" rx="20" fill="#1A2246" fill-opacity=".97" stroke="rgba(255,255,255,.16)" filter="url(#shLift2)"/>`;
  if (o.hi) s += `<rect x="410" y="${cy - 50}" width="1100" height="100" rx="20" fill="rgba(185,193,255,.14)" stroke="rgba(185,193,255,.75)" stroke-width="1.5"/>`;
  const lit = o.lit || o.hi;
  s += tile(478, cy, 68, d.icon, lit ? { fill: 'rgba(185,193,255,.24)', stroke: '#B9C1FF', sw: 1.5, ic: '#F3F5FA', is: 0.85 } : { is: 0.85 });
  s += T(540, cy + 13, d.label, { f: 'i', sz: 36, fill: C.text, op: o.labelOp == null ? 1 : o.labelOp });
  if (o.tag) {
    const x = 540 + measure(d.label, { f: 'i', sz: 36 }) + 24;
    s += `<rect x="${f2(x)}" y="${cy - 20}" width="162" height="40" rx="20" fill="#B9C1FF"/>` + MONO(x + 81, cy + 8, 'First block', { sz: 22, fill: '#0B1220', anchor: 'middle' });
  }
  s += `<rect x="1070" y="${cy - 8}" width="290" height="16" rx="8" fill="rgba(255,255,255,.06)"/>`;
  s += `<rect x="1070" y="${cy - 8}" width="${f2(d.ret * 0.96 * grow)}" height="16" rx="8" fill="url(#barG)"/>`;
  if (o.sheen) s += `<defs><clipPath id="sh${key}"><rect x="1070" y="${cy - 8}" width="${d.ret * 0.96}" height="16" rx="8"/></clipPath></defs><rect x="${1070 + d.ret * 0.96 * o.sheen - 40}" y="${cy - 14}" width="80" height="28" fill="#fff" opacity=".35" clip-path="url(#sh${key})"/>`;
  s += `<rect x="1400" y="${cy - 6}" width="${f2(d.cost * 0.85 * grow)}" height="12" rx="6" fill="rgba(223,230,243,.38)"/>`;
  const op = o.op == null ? 1 : o.op;
  const tr = o.dx || o.scale ? ` transform="translate(${o.dx || 0},0)${o.scale ? ` translate(960,${cy}) scale(${o.scale}) translate(-960,${-cy})` : ''}"` : '';
  return `<g opacity="${op}"${tr}>${s}</g>`;
}
function planLines() { return SLOT.slice(0, 4).map((c) => `<line x1="430" y1="${c + 60}" x2="1490" y2="${c + 60}" stroke="rgba(255,255,255,.05)"/>`).join(''); }

/* ---------- B6: the automation running inside the first block ---------- */
function autoPanel(st = {}) {
  let s = `<rect x="240" y="160" width="1440" height="760" rx="32" fill="rgba(97,114,243,.08)" stroke="rgba(185,193,255,.28)" stroke-width="1" filter="url(#shCard60)"/>`;
  s += miniCube(300, 222, 1.3) + T(340, 234, 'Quote follow-ups', { f: 'i', sz: 34, w: 500 });
  s += pill(1620, 200, 'Running', { right: true, sz: 24, dot: C.green, ring: st.pulse == null ? 0.4 : st.pulse });
  s += `<line x1="270" y1="280" x2="1650" y2="280" stroke="rgba(255,255,255,.09)"/>`;
  // stage 1: open quotes (a queue)
  const q = st.quote || {};
  s += `<g opacity=".28"><rect x="402" y="412" width="300" height="400" rx="24" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)"/></g>`;
  s += `<g opacity=".5"><rect x="386" y="396" width="300" height="400" rx="24" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)"/></g>`;
  let c = `<rect x="370" y="380" width="300" height="400" rx="24" fill="#151D3D" stroke="${q.done ? 'rgba(185,193,255,.55)' : 'rgba(255,255,255,.16)'}" stroke-width="1.2"/>`;
  c += tile(422, 432, 56, 'doc', { is: 0.82 }) + bar(462, 418, 120, 12, 'rgba(255,255,255,.30)') + bar(462, 440, 80, 10);
  [500, 536, 572].forEach((y, n) => { c += bar(394, y, [170, 140, 160][n], 12) + bar(600, y, 46, 12); });
  c += `<line x1="394" y1="610" x2="646" y2="610" stroke="rgba(255,255,255,.10)"/>`;
  c += T(394, 652, '€', { f: 'i', sz: 28, w: 500, fill: C.muted }) + bar(600, 640, 46, 14, 'rgba(185,193,255,.55)');
  c += timer(420, 724, 22, q.done ? 1 : 0.4, q.done ? '#B9C1FF' : '#ffd9c8');
  c += pill(458, 706, 'Open', { sz: 22 });
  if (q.done) c += `<circle cx="646" cy="404" r="20" fill="#6172F3"/>` + icon('check', 646, 404, 0.9, { c: '#fff', sw: 3 });
  s += c;
  // stage 2: the follow-up drafts itself
  const d = st.draft == null ? 1 : st.draft;
  s += flow([676, 580], [800, 580], { lit: 1, dots: [0.4, 0.8] });
  let g = `<rect x="806" y="380" width="308" height="400" rx="24" fill="#151D3D" stroke="rgba(185,193,255,.45)" stroke-width="1.2"/>`;
  g += tile(858, 432, 56, 'sparkle', { fill: 'rgba(185,193,255,.2)', stroke: '#B9C1FF', ic: '#CDD3FF', is: 0.82, glow: d < 1 ? 'rgba(97,114,243,.6)' : null });
  g += bar(898, 418, 140, 12, 'rgba(255,255,255,.30)') + bar(898, 440, 90, 10);
  const lw = [250, 228, 256, 204, 150];
  let rem = d * lw.reduce((a, b) => a + b, 0), cx = 830, cy = 500;
  lw.forEach((w, n) => {
    const y = 500 + n * 34;
    const ww = Math.max(0, Math.min(w, rem)); rem -= w;
    g += `<rect x="830" y="${y}" width="${w}" height="12" rx="6" fill="rgba(255,255,255,.06)"/>`;
    if (ww > 0) { g += bar(830, y, ww, 12, 'rgba(223,230,243,.72)'); cx = 830 + ww; cy = y; }
  });
  if (d < 1) g += caret(cx + 6, cy - 6, 24);
  g += `<rect x="830" y="${d >= 1 ? 706 : 706}" width="136" height="48" rx="24" fill="${d >= 1 ? '#6172F3' : 'rgba(255,255,255,.07)'}" stroke="rgba(255,255,255,.14)"/>` + icon('send', 898, 730, 0.62, { c: '#F3F5FA', sw: 2.4 });
  s += g;
  // stage 3: ready for the salesperson
  const r = st.ready || 0;
  s += flow([1120, 580], [1244, 666], { lit: r ? 1 : 0.15, dots: r ? [0.35, 0.75] : [] });
  s += `<g opacity="${r ? 1 : 0.55}"><circle cx="1400" cy="452" r="64" fill="rgba(255,255,255,.07)" stroke="${r ? 'rgba(185,193,255,.6)' : 'rgba(255,255,255,.16)'}" stroke-width="1.5"/>${icon('person', 1400, 456, 1.7, { sw: 3 })}</g>`;
  if (r) {
    s += `<rect x="1250" y="560" width="300" height="220" rx="24" fill="#151D3D" stroke="rgba(185,193,255,.55)" stroke-width="1.2" filter="url(#shLift)"/>`;
    s += tile(1296, 606, 48, 'doc', { is: 0.7 }) + bar(1332, 594, 140, 11, 'rgba(255,255,255,.3)') + bar(1332, 614, 96, 9);
    s += bar(1276, 650, 248, 10) + bar(1276, 672, 210, 10);
    s += `<rect x="1276" y="712" width="176" height="44" rx="22" fill="#6172F3"/>` + MONO(1364, 741, 'Draft ready', { sz: 22, fill: C.text, anchor: 'middle' });
    if (st.sheen != null) s += `<defs><clipPath id="drC"><rect x="1276" y="712" width="176" height="44" rx="22"/></clipPath></defs><rect x="${1276 + st.sheen * 176 - 25}" y="700" width="50" height="70" fill="#fff" opacity=".28" transform="skewX(-20)" transform-origin="${1276 + st.sheen * 176} 734" clip-path="url(#drC)"/>`;
    s += `<circle cx="1500" cy="734" r="22" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)"/>` + icon('send', 1501, 734, 0.5, { sw: 2.2 });
  } else {
    s += `<rect x="1250" y="560" width="300" height="220" rx="24" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="7 7"/>`;
  }
  return s;
}

/* ---------- B7: the system, block by block ---------- */
function signedDoc(x, y, sig = 1) { // "priced in writing": a document with a price line and a signature being drawn
  let s = `<rect x="${x}" y="${y}" width="300" height="400" rx="24" fill="#151D3D" stroke="rgba(255,255,255,.16)" filter="url(#shCard)"/>`;
  s += tile(x + 52, y + 52, 56, 'doc', { is: 0.82 }) + bar(x + 92, y + 38, 130, 12, 'rgba(255,255,255,.3)') + bar(x + 92, y + 60, 86, 10);
  [120, 156, 192].forEach((dy, n) => { s += bar(x + 26, y + dy, [160, 130, 150][n], 12) + bar(x + 228, y + dy, 46, 12); });
  s += `<line x1="${x + 26}" y1="${y + 228}" x2="${x + 274}" y2="${y + 228}" stroke="rgba(255,255,255,.10)"/>`;
  s += T(x + 26, y + 272, '€', { f: 'i', sz: 28, w: 500, fill: C.muted }) + bar(x + 214, y + 258, 60, 16, 'rgba(185,193,255,.65)');
  s += `<line x1="${x + 26}" y1="${y + 356}" x2="${x + 274}" y2="${y + 356}" stroke="rgba(223,230,243,.35)" stroke-width="1.2"/>`;
  const sigD = `M${x + 40},${y + 340} c8,-26 18,-30 20,-8 s6,16 14,-6 s10,-24 16,-2 s8,14 18,-6 c6,-10 12,-8 16,2 s10,8 22,-10`;
  s += `<path d="${sigD}" fill="none" stroke="#CDD3FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="${f2(100 * sig)} 100"/>`;
  if (sig < 1) s += `<g transform="translate(${x + 40 + 106 * sig},${y + 330}) rotate(35)"><rect x="-4" y="-40" width="8" height="40" rx="3" fill="#F3F5FA"/><path d="M-4,0 L0,10 L4,0 Z" fill="#B9C1FF"/></g>`;
  return s;
}
function hoursFlowCard(x, y) { // hours from the sites straight into invoices, running
  let s = `<rect x="${x}" y="${y}" width="740" height="600" rx="30" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)" filter="url(#shCard60)"/>`;
  s += tile(x + 64, y + 64, 60, 'clock', { is: 0.85 }) + icon('arrow', x + 128, y + 64, 0.7, { c: 'rgba(185,193,255,.8)' }) + tile(x + 192, y + 64, 60, 'invoice', { is: 0.85 });
  s += `<circle cx="${x + 690}" cy="${y + 64}" r="7" fill="${C.green}"/><circle cx="${x + 690}" cy="${y + 64}" r="14" fill="none" stroke="${C.green}" stroke-opacity=".35" stroke-width="2"/>`;
  s += MONO(x + 662, y + 73, '04', { sz: 26, anchor: 'end', fill: C.muted });
  s += `<line x1="${x + 30}" y1="${y + 120}" x2="${x + 710}" y2="${y + 120}" stroke="rgba(255,255,255,.08)"/>`;
  // timesheet
  const gx = x + 50, gy = y + 160;
  const on = new Set(['0,0', '1,0', '2,0', '3,0', '0,1', '1,1', '2,1', '4,1', '0,2', '1,2', '3,2', '4,2', '0,3', '2,3', '3,3', '1,4', '2,4', '4,4', '0,5', '3,5']);
  for (let r = 0; r < 6; r++) for (let q = 0; q < 5; q++) {
    const f = on.has(`${q},${r}`) && !(r === 2 && q < 2);
    const c0 = `<rect x="${gx + q * 48}" y="${gy + r * 48}" width="40" height="40" rx="9" fill="${f ? 'rgba(97,114,243,.5)' : 'rgba(255,255,255,.04)'}" stroke="${f ? 'rgba(185,193,255,.55)' : 'rgba(255,255,255,.14)'}"/>`;
    s += c0;
  }
  // invoice
  const ix = x + 440, iy = y + 150;
  let zig = `M${ix},${iy} H${ix + 260} V${iy + 400}`; for (let i = 0; i < 10; i++) zig += ` l-26,${i % 2 ? 12 : -12}`; zig += ' Z';
  s += `<path d="${zig}" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)"/>`;
  s += bar(ix + 24, iy + 30, 120, 12, 'rgba(255,255,255,.3)');
  [80, 120, 160, 200, 240, 280].forEach((dy, n) => {
    if (n < 3) s += bar(ix + 24, iy + dy, 130, 12, 'rgba(223,230,243,.6)') + bar(ix + 190, iy + dy, 46, 12, 'rgba(223,230,243,.6)');
    else if (n === 3) s += bar(ix + 24, iy + dy, 74, 12, 'rgba(223,230,243,.6)') + `<rect x="${ix + 24}" y="${iy + dy}" width="130" height="12" rx="6" fill="none" stroke="rgba(185,193,255,.35)"/>`;
    else s += `<rect x="${ix + 24}" y="${iy + dy}" width="130" height="12" rx="6" fill="none" stroke="rgba(255,255,255,.14)" stroke-dasharray="4 4"/>`;
  });
  s += `<line x1="${ix + 24}" y1="${iy + 320}" x2="${ix + 236}" y2="${iy + 320}" stroke="rgba(255,255,255,.12)"/>`;
  s += T(ix + 24, iy + 360, '€', { f: 'i', sz: 28, w: 500, fill: C.muted }) + bar(ix + 176, iy + 346, 60, 16, 'rgba(185,193,255,.65)');
  // cells flying across, no hands
  const to = [ix + 98, iy + 86 + 120];
  [[gx + 20, gy + 2 * 48 + 20, 0.82], [gx + 68, gy + 2 * 48 + 20, 0.5], [gx + 20, gy + 2 * 48 + 20, 0.22]].forEach(([fx, fy, t], n) => {
    const c1 = [fx + 160, fy - 120], c2 = [to[0] - 120, to[1] - 140];
    if (n === 0) s += `<path d="M${fx},${fy} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${to[0]},${to[1]}" fill="none" stroke="rgba(185,193,255,.35)" stroke-width="2" stroke-dasharray="3 7" stroke-linecap="round"/>`;
    const p = bez([fx, fy], c1, c2, to, t);
    s += `<rect x="${f2(p[0] - 20)}" y="${f2(p[1] - 20)}" width="40" height="40" rx="9" fill="rgba(97,114,243,.85)" stroke="#CDD3FF" stroke-width="1.5" filter="url(#shLift)" transform="rotate(${-8 + n * 6} ${f2(p[0])} ${f2(p[1])})"/>`;
  });
  return s;
}
function reportCard(x, y, grow = 0.7) {
  let s = `<rect x="${x}" y="${y}" width="420" height="300" rx="26" fill="rgba(255,255,255,.055)" stroke="rgba(255,255,255,.12)" filter="url(#shCard)"/>`;
  s += tile(x + 52, y + 52, 56, 'chart', { is: 0.82 }) + bar(x + 92, y + 38, 120, 12, 'rgba(255,255,255,.3)') + bar(x + 92, y + 60, 80, 10);
  s += tile(x + 372, y + 52, 48, 'sparkle', { fill: 'rgba(185,193,255,.2)', stroke: '#B9C1FF', ic: '#CDD3FF', is: 0.7 });
  const hs = [70, 110, 88, 136, 118, 160];
  hs.forEach((h, n) => {
    const g = n < 4 ? 1 : n === 4 ? grow : grow * 0.35;
    s += `<rect x="${x + 36 + n * 60}" y="${f2(y + 270 - h * g)}" width="40" height="${f2(h * g)}" rx="7" fill="url(#barV)"/>`;
  });
  s += `<line x1="${x + 28}" y1="${y + 272}" x2="${x + 392}" y2="${y + 272}" stroke="rgba(255,255,255,.18)"/>`;
  return s;
}
function elbow(points, frac = 1) { return lightLine(points, frac, { spark: frac < 1 }); }

/* ---------- B9: lockup ---------- */
const MARK = { w: 199.68, h: 133.12 };
function lockup(o = {}) {
  const ms = o.markS || 0.66, mw = MARK.w * ms, mh = MARK.h * ms;
  const wsz = 92, ls = -wsz * 0.04;
  const ww = measure('wicflow', { f: 'k', sz: wsz, w: 800, ls });
  const gap = 18, total = mw + gap + ww;
  const x0 = 960 - total / 2, cy = o.cy || 628;
  let g = `<image href="../../../harvest/wicflow-mark.png" x="${f2(x0)}" y="${f2(cy - mh / 2 - 4)}" width="${f2(mw)}" height="${f2(mh)}" filter="url(#markWhite)"/>`;
  g += T(x0 + mw + gap, cy + wsz * 0.34, 'wicflow', { f: 'k', sz: wsz, w: 800, ls, fill: C.text, op: o.wordOp == null ? 1 : o.wordOp });
  let s = `<g opacity="${o.markOp == null ? 1 : o.markOp}">${g}</g>`;
  if (o.line) s += T(960, 790, 'Let’s find the first thing to build.', { f: 'h', sz: 60, w: 500, ls: -1.2, anchor: 'middle', op: o.line });
  if (o.cta) {
    const bw = 520, bx = 960 - bw / 2, by = 846;
    s += `<rect x="${bx}" y="${by}" width="${bw}" height="88" rx="44" fill="#FFFFFF"/>`;
    s += T(bx + 54, by + 57, 'Book an AI mapping', { f: 'i', sz: 38, w: 600, fill: '#0B1220' });
    const ax = bx + bw - 86;
    s += `<path d="M${ax},${by + 44} h32 M${ax + 18},${by + 31} l14,13 l-14,13" stroke="#0B1220" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (o.sheen != null) s += `<defs><clipPath id="ctaC"><rect x="${bx}" y="${by}" width="${bw}" height="88" rx="44"/></clipPath><linearGradient id="shG" x1="0" x2="1"><stop offset="0" stop-color="#9fb0ff" stop-opacity="0"/><stop offset=".5" stop-color="#9fb0ff" stop-opacity=".38"/><stop offset="1" stop-color="#9fb0ff" stop-opacity="0"/></linearGradient></defs><g clip-path="url(#ctaC)"><rect x="${bx + bw * o.sheen - 60}" y="${by - 10}" width="120" height="110" fill="url(#shG)" transform="skewX(-20)" transform-origin="${bx + bw * o.sheen} ${by + 44}"/></g>`;
  }
  return s;
}

/* ======================================================================= */
const FRAMES = {};
const FRAME_META = [];
function def(id, t, fn) { FRAMES[id] = fn; FRAME_META.push({ id, t }); }

/* B1 · the real work */
def('B01-0000', 0, () => svgDoc(frame0()));
def('B01-0120', 1.2, () => svgDoc(
  cardAt('HOURS', {}, { op: 0.28 }) + cardAt('REPORT', {}, { op: 0.28 }) + cardAt('ENQUIRY', { arrive: 1 }, { op: 0.28 }) +
  cardAt('QUOTE', { quiet: 1, ring: 0.1 }, { s: 1.18, dx: 170, dy: 105 })));
def('B01-0260', 2.6, () => svgDoc(
  cardAt('QUOTE', { quiet: 1, ring: 0.1 }, { op: 0.55 }) + cardAt('REPORT', { hand: 1 }) +
  cardAt('HOURS', { retype: 1 }, { s: 1.04 }) + cardAt('ENQUIRY', { pile: 1 }, { s: 1.04 })));

/* B2 · off the shelf never fits, so we build around how you work */
def('B02-0420', 4.2, () => {
  const prog = { '0,0,0': 0.7, '1,0,0': 0.85, '2,0,0': 1, '0,1,0': 0.9, '1,1,0': 1, '2,1,0': 1, '1,2,0': 1, '0,0,1': 0.55, '2,0,1': 0.8, '0,0,2': 0.35 };
  const blocks = {}; for (const k in prog) blocks[k] = { prog: prog[k] };
  let s = world({ def: { w: { wire: 1 }, dashOff: 3 }, blocks });
  for (const type of ['HOURS', 'REPORT', 'QUOTE', 'ENQUIRY']) {
    const [c, r, k] = CARD_BLOCK[type];
    s += cardMorph(type, topFaceCardOrder(c, r, k), 0.74, 0.18, type === 'QUOTE' ? { quiet: 1, ring: 0.1 } : {});
  }
  return svgDoc(s);
});
function appSlab(drop = 0) {
  const dy = -drop;
  const L = (i, j, h) => { const p = P(i, j, h); return [p[0], p[1] + dy]; };
  let s = `<polygon points="${pts([P(0, 0, 1), P(3, 0, 1), P(3, 3, 1), P(0, 3, 1)].map((p) => [p[0], p[1] + 34]))}" fill="#000" opacity=".28" filter="url(#b15)"/>`;
  const top = [L(0, 0, 3), L(3, 0, 3), L(3, 3, 3), L(0, 3, 3)];
  const left = [L(0, 3, 3), L(3, 3, 3), L(3, 3, 2.7), L(0, 3, 2.7)];
  const right = [L(3, 3, 3), L(3, 0, 3), L(3, 0, 2.7), L(3, 3, 2.7)];
  s += `<polygon points="${pts(left)}" fill="rgba(140,148,166,.42)"/><polygon points="${pts(right)}" fill="rgba(160,168,186,.48)"/>`;
  // a generic, one-size-fits-all app window lying on the slab's top face
  const app = `<rect x="0" y="0" width="600" height="600" rx="26" fill="rgba(176,183,200,.40)" stroke="rgba(220,225,236,.75)" stroke-width="2"/>
    <rect x="0" y="0" width="600" height="70" rx="26" fill="rgba(210,215,228,.30)"/><circle cx="40" cy="35" r="10" fill="rgba(235,238,245,.7)"/><circle cx="72" cy="35" r="10" fill="rgba(235,238,245,.5)"/><circle cx="104" cy="35" r="10" fill="rgba(235,238,245,.35)"/>
    <rect x="24" y="96" width="120" height="480" rx="16" fill="rgba(220,225,236,.18)"/>
    ${[0, 1, 2].map((r) => [0, 1, 2].map((q) => `<rect x="${172 + q * 140}" y="${96 + r * 164}" width="120" height="140" rx="18" fill="rgba(220,225,236,.24)" stroke="rgba(235,238,245,.35)"/>`).join('')).join('')}`;
  s += `<g transform="${affine(top[0], top[1], top[3], 600, 600)}">${app}</g>`;
  return s;
}
def('B02-0540', 5.4, () => {
  let s = world({ def: { w: { wire: 1 }, dashOff: 7 } });
  s += appSlab(0);
  s += renderBlock({ c: 0, r: 0, k: 2, w: { orange: 1 } });
  const gaps = [[P(0, 2, 2), P(0, 2, 1)], [P(2, 3, 2), P(2, 3, 1)], [P(3, 2, 2), P(3, 2, 1)], [P(1, 3, 2), P(1, 3, 1)]];
  s += gaps.map(([a, b]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#FF5A1F" stroke-opacity=".8" stroke-width="2" stroke-dasharray="6 5"/><circle cx="${b[0]}" cy="${b[1]}" r="4" fill="#FF5A1F"/>`).join('');
  return svgDoc(s);
});
def('B02-0700', 7.0, () => {
  const base = { def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.55, dashOff: 3 } };
  let s = world(base);
  const c = [1020, 669.25], n = [0.5, 0.866];
  const p0 = [c[0] - 70 * n[0], c[1] - 70 * n[1]], p1 = [c[0] + 70 * n[0], c[1] + 70 * n[1]];
  const defs = `<linearGradient id="bandM" gradientUnits="userSpaceOnUse" x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}"><stop offset="0" stop-color="#000"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="bandF" gradientUnits="userSpaceOnUse" x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}"><stop offset="0" stop-color="#B9C1FF" stop-opacity="0"/><stop offset=".5" stop-color="#B9C1FF" stop-opacity=".2"/><stop offset="1" stop-color="#B9C1FF" stop-opacity="0"/></linearGradient>
    <mask id="band"><rect width="1920" height="1080" fill="url(#bandM)"/></mask><clipPath id="clu">${clusterShapes()}</clipPath>`;
  s += `<g clip-path="url(#clu)"><rect width="1920" height="1080" fill="url(#bandF)"/></g>`;
  s += `<line x1="${c[0] + 1000 * 0.866}" y1="${c[1] - 500}" x2="${c[0] - 1000 * 0.866}" y2="${c[1] + 500}" stroke="rgba(185,193,255,.45)" stroke-width="1.2"/>`;
  s += `<g mask="url(#band)"><g filter="url(#b2)" opacity=".9">${world({ def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.95, dashOff: 3 } })}</g>${world({ def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.95, dashOff: 3 } })}</g>`;
  // the edges the scan has passed are measured and settle crisp: small dimension ticks
  const tick = (a, b) => { const m = lerpP(a, b, 0.5); return `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="#B9C1FF" stroke-width="2"/><circle cx="${f2(a[0])}" cy="${f2(a[1])}" r="4" fill="#B9C1FF"/><circle cx="${f2(b[0])}" cy="${f2(b[1])}" r="4" fill="#B9C1FF"/><circle cx="${f2(m[0])}" cy="${f2(m[1])}" r="10" fill="rgba(185,193,255,.35)" filter="url(#b4)"/>`; };
  const off = (p, dx, dy) => [p[0] + dx, p[1] + dy];
  s += tick(off(P(0, 3, 0), -26, 15), off(P(0, 3, 1), -26, 15)) + tick(off(P(3, 3, 0), 0, 30), off(P(3, 2, 0), 26, 15));
  return svgDoc(s, defs);
});

/* B3 · the AI mapping: processes laid out, time draining, the highest return found */
def('B03-0790', 7.9, () => {
  let s = `<g opacity=".28">${world({ def: { w: { wire: 1 }, dashOff: 5 } })}</g>`;
  s += mapWindow({ chrome: false, dash: '1600 3000' });
  const t = 0.6;
  NODES.forEach((n) => {
    const [c, r, k] = n.blk;
    const from = topFaceCardOrder(c, r, k, 30);
    const to = [[n.x - NS / 2, n.y - NS / 2], [n.x + NS / 2, n.y - NS / 2], [n.x + NS / 2, n.y + NS / 2], [n.x - NS / 2, n.y + NS / 2]];
    const q = from.map((p, i) => lerpP(p, to[i], t));
    const cen = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2];
    const o = topCentre(c, r, k);
    const back = lerpP(cen, o, 0.4);
    s += `<line x1="${f2(cen[0])}" y1="${f2(cen[1])}" x2="${f2(back[0])}" y2="${f2(back[1])}" stroke="rgba(185,193,255,.16)" stroke-width="60" stroke-linecap="round" filter="url(#b12)"/>`;
    s += `<polygon points="${pts(q)}" fill="rgba(185,193,255,.10)" stroke="rgba(255,255,255,.3)" stroke-width="1.2" stroke-linejoin="round"/>`;
    s += icon(n.icon, cen[0], cen[1], 1.4, { op: 0.55, sw: 3 });
  });
  return svgDoc(s);
});
def('B03-0930', 9.3, () => svgDoc(mapWindow({ week: 0.5 }) + mapBody({ fill: [0.62, 0.58, 0.66, 0.4, 0.28], scanX: 1100 }), PEACH_V));
def('B03-1070', 10.7, () => svgDoc(mapWindow({ week: 1 }) + mapBody({ found: 1, flow: 0.6 }), PEACH_V));

/* B4 · the costed plan, ranked by return */
def('B04-1170', 11.7, () => {
  let s = planCard({ titleOp: 0.85 }) + planLines();
  const order = ['cust', 'enq', 'quote', 'hours', 'report'];
  order.forEach((k, i) => {
    s += planRow(k, SLOT[i], { lit: k === 'quote', grow: [0.75, 0.6, 0.7, 0.45, 0.3][i], dx: [0, 0, 0, 30, 70][i], op: [1, 1, 1, 0.75, 0.45][i] });
  });
  return svgDoc(s);
});
def('B04-1320', 13.2, () => {
  let s = planCard() + planLines();
  s += planRow('hours', SLOT[3]) + planRow('report', SLOT[4]);
  s += planRow('cust', 548, { op: 0.6 }) + planRow('enq', SLOT[1], { op: 0.85 });
  s += planRow('quote', 398, { plate: true, lit: true, scale: 1.025 });
  return svgDoc(s);
});
def('B04-1460', 14.6, () => {
  let s = planCard() + planLines();
  ['quote', 'enq', 'cust', 'hours', 'report'].forEach((k, i) => {
    s += planRow(k, SLOT[i], i === 0 ? { hi: true, tag: true, sheen: 0.55 } : { op: 0.62 });
  });
  return svgDoc(s);
});

/* B5 · the plan lies down as the ground, the top row rises as the first block */
def('B05-1570', 15.7, () => {
  const card = [[380, 140], [1540, 140], [1540, 940], [380, 940]];
  const floor = [P(0, 3, 0), P(0, 0, 0), P(3, 0, 0), P(3, 3, 0)];
  const q = card.map((p, n) => lerpP(p, floor[n], 0.55));
  const wire = 'stroke="rgba(223,230,243,.42)" stroke-width="1.5" stroke-dasharray="6 6" fill="none"';
  let s = `<polygon points="${pts(q)}" fill="rgba(255,255,255,.025)"/>`;
  s += `<polygon points="${pts(q)}" stroke="rgba(223,230,243,.22)" stroke-width="6" fill="none" filter="url(#b4)"/><polygon points="${pts(q)}" ${wire}/>`;
  const lineUV = (u0, v0, u1, v1, op = 1) => { const a = bil(q, u0, v0), b = bil(q, u1, v1); return `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" ${wire} opacity="${op}"/>`; };
  for (const v of [1 / 3, 2 / 3]) s += lineUV(0, v, 1, v);
  for (const u of [1 / 3, 2 / 3]) s += lineUV(u, 0, u, 1);
  for (const v of [0.475, 0.625, 0.775]) s += lineUV(0.03, v, 0.97, v, 0.3);
  // the lifted top row
  const u0 = 30 / 1160, u1 = 1130 / 1160, v0 = 160 / 800, v1 = 260 / 800, lift = 64;
  const A = bil(q, u0, v0), B = bil(q, u1, v0), D = bil(q, u0, v1);
  const up = (p) => [p[0], p[1] - lift];
  s += `<polygon points="${pts([A, B, bil(q, u1, v1), D])}" fill="#000" opacity=".35" filter="url(#b10)"/>`;
  const row = `<rect x="0" y="0" width="1100" height="100" rx="20" fill="rgba(185,193,255,.32)" stroke="#B9C1FF" stroke-width="2" vector-effect="non-scaling-stroke"/>
    <g opacity=".5">${tile(68, 50, 68, 'doc', { fill: 'rgba(185,193,255,.24)', stroke: '#B9C1FF', ic: '#F3F5FA', is: 0.85 })}${T(130, 63, 'Quote follow-ups', { f: 'i', sz: 36 })}
    <rect x="600" y="42" width="300" height="16" rx="8" fill="url(#barG)"/></g>`;
  s += `<g filter="url(#shLift2)"><g transform="${affine(up(A), up(B), up(D), 1100, 100)}">${row}</g></g>`;
  const a = up(A);
  s += `<ellipse cx="${f2(a[0] + 60)}" cy="${f2(a[1] + 30)}" rx="90" ry="50" fill="rgba(97,114,243,.45)" filter="url(#b20)"/>`;
  return svgDoc(s);
});
def('B05-1680', 16.8, () => {
  let s = floorLines();
  const blocks = {};
  for (const [c, r, k] of BLOCKS) blocks[`${c},${r},${k}`] = null;
  blocks['1,2,0'] = { prog: 0.25 }; blocks['0,1,0'] = { prog: 0.25 }; blocks['1,1,0'] = { prog: 0.1 };
  blocks['0,2,0'] = { w: { peri: 1 }, studH: 14, glowMul: 0.6 };
  s += world({ def: { w: { wire: 1 }, dashOff: 2 }, blocks });
  return svgDoc(s);
});
def('B05-1840', 18.4, () => {
  let s = world({ def: { w: { wire: 1 }, dashOff: 9 }, blocks: { '0,2,0': { w: { peri: 1 }, glowMul: 1.2 } } });
  s += glintArc(0, 2, 0) + FIRST_LABEL(1);
  return svgDoc(s);
});

/* B6 · inside the first block, the automation runs */
def('B06-1960', 19.6, () => {
  const hole = [[960 - 1700, 540], [960, 540 - 980], [960 + 1700, 540], [960, 540 + 980]];
  let s = `<defs><mask id="corners"><rect width="1920" height="1080" fill="#fff"/><polygon points="${pts(hole)}" fill="#000" filter="url(#b12)"/></mask></defs>`;
  s += `<rect width="1920" height="1080" fill="#CDD3FF" opacity=".35" mask="url(#corners)"/>`;
  let streaks = '';
  for (let n = 0; n < 32; n++) {
    const a = (n / 32) * Math.PI * 2 + 0.1; const r0 = 330 + (n % 3) * 30, r1 = r0 + 70 + (n % 4) * 30;
    streaks += `<line x1="${f2(960 + Math.cos(a) * r0 * 1.5)}" y1="${f2(540 + Math.sin(a) * r0)}" x2="${f2(960 + Math.cos(a) * r1 * 1.5)}" y2="${f2(540 + Math.sin(a) * r1)}" stroke="rgba(185,193,255,.22)" stroke-width="2" stroke-linecap="round"/>`;
  }
  s += `<g filter="url(#b2)">${streaks}</g>`;
  s += `<g transform="translate(960,540) scale(.62) translate(-960,-540)"><g filter="url(#b3)">${autoPanel({ draft: 0, quote: {}, pulse: 0 })}</g></g>`;
  return svgDoc(s);
});
def('B06-2120', 21.2, () => svgDoc(autoPanel({ draft: 0.55, pulse: 0.3 })));
def('B06-2260', 22.6, () => svgDoc(autoPanel({ draft: 1, ready: 1, sheen: 0.5, quote: { done: 1 }, pulse: 0.7 })));

/* B7 · block by block, each priced in writing before we start */
def('B07-2360', 23.6, () => {
  const blocks = namedState({ '01': { w: { peri: 1 }, num: '01' }, '02': { w: { glass: 1, solid: 1 }, wipe: 0.55, dy: 3 }, '06': { w: { wire: 1 } } });
  let s = world({ def: { w: { glass: 1 } }, blocks });
  s += `<line x1="1400" y1="740" x2="1068" y2="842" stroke="rgba(185,193,255,.55)" stroke-width="1.5" stroke-dasharray="5 6"/><circle cx="1068" cy="842" r="5" fill="#B9C1FF"/>`;
  s += signedDoc(1400, 470, 0.62);
  return svgDoc(s);
});
def('B07-2500', 25.0, () => {
  const blocks = solidNamed({ '04': { glowMul: 1.8, studLit: 0.8 }, '05': { w: { glass: 1 }, num: null }, '06': { w: { wire: 1 }, num: null } });
  const W2 = world({ def: { w: { glass: 1 } }, blocks });
  let s = placed(W2, 0.9, -390, 0, 960, 570);
  const stud = xf([840, 437 - 24], 0.9, -390, 0);
  s += elbow([stud, [stud[0], 196], [1110, 196], [1110, 236]], 1);
  s += hoursFlowCard(1060, 236);
  return svgDoc(s);
});
def('B07-2640', 26.4, () => {
  const blocks = solidNamed({ '05': { studLit: 0.9, glowMul: 1.5 }, '06': { w: { wire: 1 }, num: null } });
  let s = world({ def: { w: { glass: 1 } }, blocks, level: 4 });
  s += elbow([[1080, 404], [1080, 300], [1240, 300]], 1);
  s += reportCard(1240, 150, 0.72);
  return svgDoc(s);
});

/* B8 · one system, all of it connected */
def('B08-2750', 27.5, () => {
  const blocks = solidNamed({ '06': { w: { glass: 1 }, num: null } });
  const lines = lightLine(LINES['01-02']) + lightLine(LINES['02-03']) + lightLine(LINES['01-04'], 0.78, { spark: 1 }) + lightLine(LINES['03-05'], 0.5, { spark: 1 }) + lightLine(LINES['04-06'], 0.2, { spark: 1 });
  return svgDoc(world({ def: { w: { glass: 1 } }, blocks, after: lines, studsOnTop: true }));
});
def('B08-2880', 28.8, () => {
  const blocks = solidNamed({ '01': { studLit: 1 }, '02': { studLit: 1 }, '04': { studLit: 1 }, '03': { studLit: 1 }, '06': { glowMul: 1.3 } });
  const tc = topCentre(0, 0, 2);
  const wave = `<ellipse cx="${tc[0]}" cy="${tc[1] - 20}" rx="210" ry="122" fill="none" stroke="rgba(185,193,255,.5)" stroke-width="2" filter="url(#b2)"/>` + spark(900, 330, 14, 26) + spark(1140, 472, 14, 26);
  let s = world({ def: { w: { glass: 1 } }, blocks, after: allLines(), studsOnTop: true, top: wave });
  return svgDoc(s + TOP_LABEL(1));
});
def('B08-3020', 30.2, () => {
  const s = world(litWorld({ after: allLines(), top: pulsesAt([[780, 540], [1140, 600], [1020, 330]]), scale: { s: 1.04, cx: 960, cy: 570 } }));
  return svgDoc(s + TOP_LABEL(1, -8));
});

/* B9 · the end: let's find the first thing to build */
def('B09-3150', 31.5, () => svgDoc(placed(world(litWorld({ after: allLines(), top: pulsesAt([[840, 704], [1140, 620], [900, 300]]) })), 0.76, 0, -90)));
def('B09-3270', 32.7, () => svgDoc(placed(world(litWorld({ after: allLines(), top: pulsesAt([[780, 540], [1140, 600], [1020, 330]]) })), 0.5, 0, -238) + lockup({ wordOp: 0.85 })));
def('B09-3440', 34.4, () => svgDoc(placed(world(litWorld({ after: allLines(), top: pulsesAt([[840, 704], [1140, 560], [900, 340]]) })), 0.5, 0, -238) + lockup({ line: 1, cta: 1, sheen: 0.62 })));

/* B10 · back to the work (loop) */
def('B10-3640', 36.4, () => {
  const blocks = namedState({ '06': { w: { wire: 1 } }, '05': { w: { wire: 0.8, glass: 0.2 } }, '04': { w: { glass: 1 } }, '03': { w: { glass: 0.7, solid: 0.3 } }, '02': { w: { glass: 1 } }, '01': { w: { peri: 0.6, glass: 0.4 }, glowMul: 0.4 } });
  for (const k of ['0,0,0', '1,0,0', '2,0,0', '0,1,0', '1,1,0', '2,1,0', '1,2,0', '0,0,1']) blocks[k] = { w: { glass: 0.5, wire: 0.5 } };
  const S = 0.62, DY = -150;
  let s = `<g opacity=".5">${placed(world({ def: { w: { glass: 1 } }, blocks }), S, 0, DY)}</g>`;
  for (const type of ['HOURS', 'REPORT', 'QUOTE', 'ENQUIRY']) {
    const [c, r, k] = CARD_BLOCK[type];
    const face = topFaceCardOrder(c, r, k, 20).map((p) => xf(p, S, 0, DY));
    s += cardMorph(type, face, 0.36, 0.6, type === 'ENQUIRY' ? { arrive: 1 } : {});
  }
  return svgDoc(s);
});
def('B10-3760', 37.6, () => svgDoc(frame0()));

const FRAME_IDS = FRAME_META.map((m) => m.id);
