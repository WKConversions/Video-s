/* Wicflow hero storyboard: one function per key frame (ids = beat + time in centiseconds). */
'use strict';

/* ---------- B1 work cards (local box 0..300 x 0..200) ---------- */
const CARD = {
  QUOTE: { cx: 1090, cy: 600, rot: -8 },
  ENQUIRY: { cx: 1420, cy: 800, rot: 6 },
  HOURS: { cx: 1210, cy: 400, rot: 5 },
  REPORT: { cx: 1560, cy: 470, rot: -4 }
};
function cardBody(type, contentOp = 1) {
  const nss = 'vector-effect="non-scaling-stroke"';
  let s = `<rect x="0" y="0" width="300" height="200" rx="20" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.14)" stroke-width="1" ${nss}/>`;
  let c = MONO(24, 46, type, { sz: 28 });
  const ph = 'rgba(255,255,255,.22)';
  if (type === 'QUOTE') {
    c += `<rect x="24" y="72" width="200" height="12" rx="6" fill="${ph}"/><rect x="24" y="96" width="160" height="12" rx="6" fill="${ph}"/><rect x="24" y="120" width="120" height="12" rx="6" fill="${ph}"/>`;
    c += `<rect x="186" y="146" width="90" height="34" rx="17" fill="none" stroke="rgba(255,255,255,.34)" stroke-width="1.2" ${nss}/>` + T(231, 170, 'Open', { f: 'i', sz: 20, w: 500, fill: 'rgba(223,230,243,.8)', anchor: 'middle' });
  } else if (type === 'ENQUIRY') {
    c += `<path d="M42,66 H186 a18,18 0 0 1 18,18 V128 a18,18 0 0 1 -18,18 H64 L44,162 L46,146 H42 a18,18 0 0 1 -18,-18 V84 a18,18 0 0 1 18,-18 Z" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.30)" stroke-width="1.2" ${nss}/>`;
    c += `<rect x="44" y="90" width="124" height="11" rx="5.5" fill="${ph}"/><rect x="44" y="112" width="90" height="11" rx="5.5" fill="${ph}"/>`;
    c += `<path d="M262,160 h-26 a12,12 0 0 1 -12,-12 v-14 M262,160 l-9,-8 M262,160 l-9,8" fill="none" stroke="rgba(185,193,255,.75)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${nss}/>`;
  } else if (type === 'HOURS') {
    const filled = ['0,0', '1,0', '2,1', '3,1', '1,2'];
    for (let r = 0; r < 3; r++) for (let q = 0; q < 5; q++) {
      const f = filled.includes(`${q},${r}`);
      c += `<rect x="${24 + q * 36}" y="${66 + r * 36}" width="28" height="28" rx="7" fill="${f ? 'rgba(97,114,243,.45)' : 'rgba(255,255,255,.04)'}" stroke="${f ? 'rgba(185,193,255,.5)' : 'rgba(255,255,255,.16)'}" stroke-width="1" ${nss}/>`;
    }
  } else if (type === 'REPORT') {
    [40, 64, 52, 80].forEach((h, n) => { c += `<rect x="${28 + n * 36}" y="${172 - h}" width="22" height="${h}" rx="4" fill="url(#barV)"/>`; });
    c += `<line x1="24" y1="176" x2="186" y2="176" stroke="rgba(255,255,255,.18)" stroke-width="1" ${nss}/>`;
    c += `<rect x="206" y="92" width="70" height="10" rx="5" fill="${ph}"/><rect x="206" y="112" width="50" height="10" rx="5" fill="${ph}"/>`;
  }
  return s + `<g opacity="${contentOp}">${c}</g>`;
}
function cardAt(type, dx = 0, dy = 0, drot = 0) {
  const k = CARD[type];
  return `<g filter="url(#shCard)"><g transform="translate(${k.cx + dx},${k.cy + dy}) rotate(${k.rot + drot}) translate(-150,-100)">${cardBody(type)}</g></g>`;
}
function cardMorph(type, toCorners, t, contentOp) {
  const k = CARD[type];
  const from = rotRectCorners(k.cx, k.cy, 300, 200, k.rot);
  const q = from.map((p, n) => lerpP(p, toCorners[n], t));
  return `<g filter="url(#shCard)"><g transform="${affine(q[0], q[1], q[3], 300, 200)}">${cardBody(type, contentOp)}<rect x="0" y="0" width="300" height="200" rx="20" fill="rgba(185,193,255,.05)" stroke="rgba(185,193,255,.5)" stroke-width="1.2" vector-effect="non-scaling-stroke"/></g></g>`;
}
function frame0() {
  return cardAt('HOURS') + cardAt('REPORT') + cardAt('QUOTE') + cardAt('ENQUIRY');
}

const ALL_WIRE = { def: { w: { wire: 1 } } };

/* ---------- B3 chips ---------- */
const CHIP = { sz: 40, pad: 26, gap: 16, y0: 608, h: 64 };
function chipLayout(words) {
  const ws = words.map((w) => measure(w, { f: 'i', sz: CHIP.sz, w: 500 }) + CHIP.pad * 2);
  const total = ws.reduce((a, b) => a + b, 0) + CHIP.gap * (words.length - 1);
  let x = 960 - total / 2;
  return words.map((w, n) => { const o = { word: w, x0: x, w: ws[n], cx: x + ws[n] / 2 }; x += ws[n] + CHIP.gap; return o; });
}
function chip(ch, o = {}) {
  const stroke = o.stroke || 'rgba(255,255,255,.12)';
  const dash = o.dash ? `stroke-dasharray="${o.dash}"` : '';
  let s = `<rect x="${f2(ch.x0)}" y="${CHIP.y0}" width="${f2(ch.w)}" height="${CHIP.h}" rx="32" fill="${o.fill || 'rgba(255,255,255,.06)'}" stroke="${stroke}" stroke-width="${o.sw || 1}" ${dash}/>`;
  s += T(ch.cx, CHIP.y0 + 46, ch.word, { f: 'i', sz: CHIP.sz, w: 500, anchor: 'middle', fill: C.text, op: o.textOp == null ? 1 : o.textOp });
  if (o.bar) s += `<rect x="${f2(ch.x0 + 28)}" y="684" width="${o.bar}" height="4" rx="2" fill="url(#barG)"/>`;
  return s;
}
const HEAT = { 'New customers': 80, Quotes: 120, Enquiries: 98, Hours: 64, Reports: 48 };
function kickerX() { return 960 - measure('AI MAPPING · FIXED PRICE · 1–2 WEEKS', { f: 'm', sz: 40 }) / 2; }
function b3Head(op = 1) {
  return `<g opacity="${op}">${MONO(960, 250, 'AI MAPPING · FIXED PRICE · 1–2 WEEKS', { anchor: 'middle' })}
    ${HL(960, 380, 'First we map', { anchor: 'middle' })}${HL(960, 480, 'where the time goes.', { anchor: 'middle', fill: 'url(#peach)' })}</g>`;
}
function timeline(fillTo, week2) {
  let s = `<line x1="360" y1="760" x2="1560" y2="760" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>`;
  s += `<line x1="360" y1="760" x2="${fillTo}" y2="760" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>`;
  s += `<circle cx="360" cy="760" r="6" fill="#FFFFFF"/>`;
  if (week2 === 'full') s += `<circle cx="1560" cy="760" r="14" fill="rgba(255,217,200,.5)" filter="url(#b6)"/><circle cx="1560" cy="760" r="6" fill="#ffd9c8"/>`;
  else s += `<circle cx="1560" cy="760" r="6" fill="#ffd9c8" opacity=".5"/>`;
  s += MONO(360, 815, 'WEEK 1', { sz: 36, anchor: 'middle' }) + MONO(1560, 815, 'WEEK 2', { sz: 36, anchor: 'middle' });
  return s;
}
function scanGlow(x) {
  return `<defs><radialGradient id="scanG"><stop offset="0" stop-color="rgba(97,114,243,.35)"/><stop offset="1" stop-color="rgba(97,114,243,0)"/></radialGradient></defs>
  <ellipse cx="${x}" cy="760" rx="100" ry="40" fill="url(#scanG)"/><rect x="${x - 0.75}" y="748" width="1.5" height="24" fill="#B9C1FF"/>`;
}

/* ---------- B4 plan card ---------- */
const ROWC = [498, 578, 658, 738, 818];
const PLAN = {
  'New customers': { ret: 160, cost: 96 }, 'Quote follow-ups': { ret: 240, cost: 112 }, 'Enquiries answered': { ret: 196, cost: 104 },
  'Hours to invoices': { ret: 128, cost: 96 }, 'Owner’s weekly report': { ret: 96, cost: 88 }
};
function planCard(dy = 0) {
  return `<rect x="300" y="${170 + dy}" width="1320" height="760" rx="28" fill="rgba(255,255,255,.055)" stroke="rgba(255,255,255,.10)" stroke-width="1" filter="url(#shCard60)"/>`;
}
function planRow(name, cy, o = {}) {
  const d = PLAN[name];
  let s = '';
  if (o.plate) s += `<rect x="330" y="${cy - 39}" width="1260" height="78" rx="16" fill="#1A2246" fill-opacity=".97" stroke="rgba(255,255,255,.14)" filter="url(#shLift)"/>`;
  if (o.num) s += MONO(360, cy + 13, o.num, { sz: 36, fill: o.numFill || C.muted });
  s += T(430, cy + 16, name, { f: 'i', sz: 44, fill: C.text });
  s += `<rect x="1080" y="${cy - 7}" width="${d.ret}" height="14" rx="7" fill="url(#barG)"/>`;
  s += T(1370, cy + 14, '€', { f: 'i', sz: 40, fill: C.muted });
  s += `<rect x="1406" y="${cy - 7}" width="${d.cost}" height="14" rx="7" fill="rgba(223,230,243,.35)"/>`;
  const op = o.op == null ? 1 : o.op;
  const tr = o.scale ? `transform="translate(960,${cy}) scale(${o.scale}) translate(-960,${-cy})"` : '';
  return `<g opacity="${op}" ${tr}>${s}</g>`;
}
function planHeads() {
  return MONO(360, 420, 'Build first', { sz: 36 }) + MONO(1080, 420, 'Returns', { sz: 36 }) + MONO(1370, 420, 'Costs', { sz: 36 }) +
    `<line x1="330" y1="446" x2="1590" y2="446" stroke="rgba(255,255,255,.10)"/>` +
    ROWC.slice(0, 4).map((c) => `<line x1="330" y1="${c + 40}" x2="1590" y2="${c + 40}" stroke="rgba(255,255,255,.06)"/>`).join('');
}
const FOOT = () => MONO(360, 900, 'Example: Kallio Lämpö, a made-up heating company', { sz: 28, fill: 'rgba(223,230,243,.5)' });

/* ---------- B6 automation panel ---------- */
function docGlyph(x, y) {
  return `<g transform="translate(${x},${y})" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5" stroke-linejoin="round">
    <path d="M0,0 H40 L56,16 V72 H0 Z"/><path d="M40,0 V16 H56"/>
    <line x1="10" y1="30" x2="44" y2="30"/><line x1="10" y1="42" x2="40" y2="42"/><line x1="10" y1="54" x2="32" y2="54"/></g>`;
}
function panel(st = {}) {
  let s = `<rect x="980" y="190" width="760" height="700" rx="28" fill="rgba(97,114,243,.10)" stroke="rgba(185,193,255,.35)" stroke-width="1" filter="url(#shCard60)"/>`;
  s += `<rect x="1030" y="236" width="214" height="48" rx="24" fill="#B9C1FF"/>` + MONO(1137, 270, 'First block', { sz: 30, fill: '#0B1220', anchor: 'middle' });
  const pr = st.pulse == null ? 0.5 : st.pulse;
  s += `<circle cx="1508" cy="260" r="${f2(8 + 10 * pr)}" fill="none" stroke="#16B857" stroke-opacity="${f2(0.55 * (1 - pr))}" stroke-width="2"/><circle cx="1508" cy="260" r="6" fill="#16B857"/>`;
  s += MONO(1528, 273, 'Running', { fill: C.text });
  s += T(1030, 360, 'Quote follow-ups', { f: 'h', sz: 56, w: 500, ls: -0.8, fill: C.text });
  s += `<line x1="1010" y1="392" x2="1710" y2="392" stroke="rgba(255,255,255,.10)"/>`;
  const rows = st.rows || [{}, {}, {}];
  [420, 560, 700].forEach((y, n) => {
    const R = rows[n] || {};
    s += `<rect x="1010" y="${y}" width="700" height="120" rx="18" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.10)"/>`;
    if (R.outline) s += `<rect x="1010" y="${y}" width="700" height="120" rx="18" fill="none" stroke="#B9C1FF" stroke-width="2" opacity="${R.outline}"/>`;
    s += `<rect x="1120" y="${y + 38}" width="240" height="14" rx="7" fill="rgba(255,255,255,.20)"/><rect x="1120" y="${y + 64}" width="170" height="14" rx="7" fill="rgba(255,255,255,.20)"/>`;
    if (R.draft) {
      const dx = (1 - R.draft) * -70;
      s += `<g transform="translate(${dx},0)"><rect x="1110" y="${y + 22}" width="110" height="76" rx="10" fill="#1B2253" stroke="rgba(185,193,255,.6)" stroke-width="1.2"/>
        <rect x="1124" y="${y + 38}" width="${f2(76 * Math.min(1, (R.typed == null ? 1 : R.typed) * 3))}" height="7" rx="3.5" fill="rgba(223,230,243,.7)"/>
        <rect x="1124" y="${y + 54}" width="${f2(62 * Math.max(0, Math.min(1, (R.typed == null ? 1 : R.typed) * 3 - 1)))}" height="7" rx="3.5" fill="rgba(223,230,243,.55)"/>
        <rect x="1124" y="${y + 70}" width="${f2(44 * Math.max(0, Math.min(1, (R.typed == null ? 1 : R.typed) * 3 - 2)))}" height="7" rx="3.5" fill="rgba(223,230,243,.55)"/></g>`;
    }
    s += docGlyph(1040, y + 24);
    if (R.track != null) {
      s += `<line x1="1120" y1="${y + 96}" x2="1460" y2="${y + 96}" stroke="rgba(255,255,255,.14)" stroke-width="2"/><line x1="1120" y1="${y + 96}" x2="${R.track}" y2="${y + 96}" stroke="rgba(223,230,243,.5)" stroke-width="2"/>`;
    }
    if (R.ready) {
      s += `<rect x="1436" y="${y + 34}" width="254" height="52" rx="26" fill="#6172F3"/>` + MONO(1563, y + 71, 'Draft ready', { sz: 32, fill: C.text, anchor: 'middle' });
      if (R.sheen != null) {
        const cid = uid('pc');
        s += `<defs><clipPath id="${cid}"><rect x="1436" y="${y + 34}" width="254" height="52" rx="26"/></clipPath></defs><rect x="${1436 + R.sheen * 254 - 30}" y="${y + 20}" width="60" height="80" fill="#fff" opacity=".25" transform="skewX(-20)" transform-origin="${1436 + R.sheen * 254} ${y + 60}" clip-path="url(#${cid})"/>`;
      }
    } else {
      s += `<rect x="1530" y="${y + 34}" width="160" height="52" rx="26" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.14)"/>` + MONO(1610, y + 71, 'Open', { sz: 32, anchor: 'middle' });
    }
  });
  s += MONO(1030, 862, 'Kallio Lämpö · a made-up example', { sz: 28 });
  return s;
}
function quietLine(ops, glowDot = 0) {
  const letters = ['q', 'u', 'i', 'e', 't', '.'];
  const spans = letters.map((l, n) => `<tspan fill-opacity="${ops[n]}">${l}</tspan>`).join('');
  let g = '';
  if (glowDot) {
    const x = 170 + measure('goes quiet', { f: 'h', sz: 96, w: 500, ls: -1.92 }) + 12;
    g = `<circle cx="${f2(x)}" cy="512" r="12" fill="#fff" opacity="${glowDot}" filter="url(#b6)"/>`;
  }
  return g + T(170, 520, `goes ${spans}`, { f: 'h', sz: 96, w: 500, ls: -1.92, fill: C.text, raw: true });
}

/* ---------- B7/B8 list + labels ---------- */
const LIST = [['01', 'Quote follow-ups'], ['02', 'Enquiries answered'], ['03', 'New customers'], ['04', 'Hours to invoices'], ['05', 'Owner’s weekly report']];
function list(ops) {
  return LIST.map(([n, name], i) => {
    const y = 350 + i * 75; const op = ops[i];
    return `<g opacity="${op}">${MONO(170, y - 2, n, { sz: 36, fill: i === 0 ? C.lav : C.muted })}${T(240, y, name, { f: 'i', sz: 44, fill: C.text })}</g>`;
  }).join('');
}
const FIRST_LABEL = (op = 1) => leader(1000, 762.5, 930, 'First block · guaranteed', { op, lx: 982, ly: 944 });
const TOP_LABEL = (op = 1) => `<g opacity="${op}"><line x1="1360" y1="166" x2="1360" y2="118" stroke="rgba(223,230,243,.5)"/><circle cx="1360" cy="112" r="4" fill="#F3F5FA"/>${MONO(1342, 124, 'All of it connected', { fill: C.text, op: 0.85, anchor: 'end' })}</g>`;
function runChips(op = 1, dy = 0) {
  const chipM = (x0, y0, w, txt) => `<rect x="${x0}" y="${y0}" width="${w}" height="64" rx="32" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.10)"/>` + MONO(x0 + 30, y0 + 46, txt, { fill: C.text });
  const w1 = measure('Hosted in Finland', { f: 'm', sz: 40 }) + 60, w2 = measure('One contact at Wicflow', { f: 'm', sz: 40 }) + 60;
  return `<g opacity="${op}" transform="translate(0,${dy})">${chipM(170, 600, f2(w1), 'Hosted in Finland')}${chipM(170, 684, f2(w2), 'One contact at Wicflow')}</g>`;
}
function namedState(map) { const o = {}; for (const k in map) o[KEY_OF[k]] = map[k]; return o; }
function solidNamed(extra = {}) {
  return namedState({
    '01': { w: { peri: 1 }, num: '01', ...(extra['01'] || {}) },
    '02': { w: { solid: 1 }, num: '02', ...(extra['02'] || {}) },
    '03': { w: { solid: 1 }, num: '03', ...(extra['03'] || {}) },
    '04': { w: { solid: 1 }, num: '04', ...(extra['04'] || {}) },
    '05': { w: { solid: 1 }, num: '05', ...(extra['05'] || {}) },
    '06': { w: { solid: 1 }, num: '06', ...(extra['06'] || {}) }
  });
}
function pulsesAt(list) { return list.map(([x, y]) => spark(x, y, 12, 20)).join(''); }

/* ---------- B9 lockup ---------- */
const MARK = { x: 147.64, y: 173.64, w: 199.68, h: 133.12 };
const DIAMOND = [[202, 248], [222, 212], [253, 250], [233, 283]]; // left, top, right, bottom
function markImg(attr = '') {
  return `<image href="../../../harvest/wicflow-mark.png" x="${MARK.x}" y="${MARK.y}" width="${MARK.w}" height="${MARK.h}" filter="url(#markWhite)" ${attr}/>`;
}
const WORD = { sz: 100, x: 350, y: 284 };
function wordmark(x = WORD.x, op = 1) { return T(x, WORD.y, 'wicflow', { f: 'k', sz: WORD.sz, w: 800, ls: -WORD.sz * 0.04, fill: C.text, op }); }

/* ======================================================================= */
const FRAMES = {};
const FRAME_META = [];
function def(id, t, fn) { FRAMES[id] = fn; FRAME_META.push({ id, t }); }

/* B1: the work, as blocks */
def('B01-0000', 0, () => svgDoc(frame0()));
def('B01-0100', 1, () => {
  let s = HL(170, 330, 'Quotes.') + HL(170, 440, 'Enquiries.', { op: 0.85 });
  s += world({ def: { w: { wire: 1 }, dashOff: 2 }, blocks: Object.fromEntries(BLOCKS.map(([c, r, k]) => [`${c},${r},${k}`, (c === 0 && r === 2 && k === 0) ? {} : null])) });
  s += cardAt('HOURS', 0, -4) + cardAt('REPORT', 0, -4);
  s += cardMorph('ENQUIRY', topFaceCardOrder(2, 2, 0), 0.55, 0.4);
  return svgDoc(s);
});
def('B01-0320', 3.2, () => {
  const s = HL(170, 330, 'Quotes.') + HL(170, 430, 'Enquiries.') + HL(170, 530, 'Hours.') + HL(170, 630, 'Reports.');
  return svgDoc(s + world({ def: { w: { wire: 1 }, dashOff: 5 } }));
});

/* B2: off the shelf never fits */
function slab() {
  const top = [P(0, 0, 3), P(3, 0, 3), P(3, 3, 3), P(0, 3, 3)];
  const left = [P(0, 3, 3), P(3, 3, 3), P(3, 3, 2), P(0, 3, 2)];
  const right = [P(3, 3, 3), P(3, 0, 3), P(3, 0, 2), P(3, 3, 2)];
  let s = `<polygon points="${pts([P(0, 0, 1), P(3, 0, 1), P(3, 3, 1), P(0, 3, 1)].map((p) => [p[0], p[1] + 30]))}" fill="#000" opacity=".25" filter="url(#b15)"/>`;
  s += `<polygon points="${pts(top)}" fill="rgba(154,163,181,.30)"/><polygon points="${pts(left)}" fill="rgba(154,163,181,.22)"/><polygon points="${pts(right)}" fill="rgba(154,163,181,.26)"/>`;
  for (const n of [1, 2]) {
    s += `<line x1="${P(n, 0, 3)[0]}" y1="${P(n, 0, 3)[1]}" x2="${P(n, 3, 3)[0]}" y2="${P(n, 3, 3)[1]}" stroke="rgba(200,206,220,.28)" stroke-width="1"/>`;
    s += `<line x1="${P(0, n, 3)[0]}" y1="${P(0, n, 3)[1]}" x2="${P(3, n, 3)[0]}" y2="${P(3, n, 3)[1]}" stroke="rgba(200,206,220,.28)" stroke-width="1"/>`;
  }
  const e = [[P(0, 0, 3), P(3, 0, 3)], [P(3, 0, 3), P(3, 3, 3)], [P(3, 3, 3), P(0, 3, 3)], [P(0, 3, 3), P(0, 0, 3)], [P(0, 3, 3), P(0, 3, 2)], [P(3, 3, 3), P(3, 3, 2)], [P(3, 0, 3), P(3, 0, 2)], [P(0, 3, 2), P(3, 3, 2)], [P(3, 3, 2), P(3, 0, 2)]];
  s += `<path d="${e.map(([a, b]) => `M${a[0]},${a[1]} L${b[0]},${b[1]}`).join(' ')}" stroke="rgba(200,206,220,.60)" stroke-width="1.5" fill="none"/>`;
  const lc = P(1.5, 3, 2.5);
  s += `<g transform="matrix(0.866,0.5,0,1,${lc[0]},${lc[1]})">${T(0, 13, 'OFF THE SHELF', { f: 'm', sz: 36, fill: 'rgba(225,230,240,.62)', anchor: 'middle', ls: 2 })}</g>`;
  return s;
}
def('B02-0490', 4.9, () => {
  let s = SUP(170, 330, 'Software made to work') + SUP(170, 386, 'for every company') + HL(170, 500, 'never quite') + HL(170, 600, 'fits yours.');
  s += world({ def: { w: { wire: 1 }, dashOff: 7 } });
  s += slab();
  s += renderBlock({ c: 0, r: 0, k: 2, w: { orange: 1 } });
  const gaps = [[[1120, 506.5], [1120, 634.5]], [[1360, 645.5], [1360, 773.5]], [[1480, 576], [1480, 704]]];
  s += gaps.map(([a, b]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#FF5A1F" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="6 5"/><circle cx="${b[0]}" cy="${b[1]}" r="3" fill="#FF5A1F" opacity=".8"/>`).join('');
  return svgDoc(s);
});
def('B02-0680', 6.8, () => {
  let s = HL(170, 420, 'Built around') + HL(170, 520, 'how you work.') + SUP(170, 600, 'Custom automation and AI,') + SUP(170, 656, 'not software off the shelf.');
  const base = { def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.55, dashOff: 3 } };
  s += world(base);
  const c = [1420, 669.25], n = [0.5, 0.866];
  const p0 = [c[0] - 60 * n[0], c[1] - 60 * n[1]], p1 = [c[0] + 60 * n[0], c[1] + 60 * n[1]];
  const defs = `<linearGradient id="bandM" gradientUnits="userSpaceOnUse" x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}"><stop offset="0" stop-color="#000"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="bandF" gradientUnits="userSpaceOnUse" x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="band"><rect width="1920" height="1080" fill="url(#bandM)"/></mask><clipPath id="clu">${clusterShapes()}</clipPath>`;
  s += `<g clip-path="url(#clu)"><rect width="1920" height="1080" fill="url(#bandF)"/><line x1="${c[0] + 1000 * 0.866}" y1="${c[1] - 500}" x2="${c[0] - 1000 * 0.866}" y2="${c[1] + 500}" stroke="rgba(255,255,255,.5)" stroke-width="1"/></g>`;
  s += `<g mask="url(#band)"><g filter="url(#b2)" opacity=".8">${world({ def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.85, dashOff: 3 } })}</g>${world({ def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.85, dashOff: 3 } })}</g>`;
  return svgDoc(s, defs);
});

/* B3: first we map where the time goes */
def('B03-0785', 7.85, () => {
  const kx = kickerX();
  let s = MONO(kx, 250, 'AI M') + `<rect x="${f2(kx + measure('AI M', { f: 'm', sz: 40 }) + 4)}" y="222" width="2" height="30" fill="#B9C1FF"/>`;
  const keep = { '2,0,0': { prog: 0.55 }, '1,1,0': { prog: 0.7 }, '2,1,0': { prog: 0.85 }, '0,2,0': { prog: 1 }, '1,2,0': { prog: 1 }, '2,2,0': { prog: 1 } };
  const blocks = {};
  for (const [c, r, k] of BLOCKS) { const key = `${c},${r},${k}`; blocks[key] = keep[key] ? { ...keep[key], op: 0.4 } : null; }
  s += world({ def: { w: { wire: 1 }, dashOff: 4 }, blocks });
  const lay = chipLayout(['Quotes', 'Enquiries', 'Hours', 'Reports']);
  const src = { Quotes: [0, 2, 0], Enquiries: [2, 2, 0], Hours: [0, 1, 1], Reports: [1, 0, 1] };
  const t = 0.35;
  for (const ch of lay) {
    const [c, r, k] = src[ch.word];
    const from = topFaceCardOrder(c, r, k, 24);
    const to = [[ch.x0, CHIP.y0], [ch.x0 + ch.w, CHIP.y0], [ch.x0 + ch.w, CHIP.y0 + CHIP.h], [ch.x0, CHIP.y0 + CHIP.h]];
    const q = from.map((p, n) => lerpP(p, to[n], t));
    const cen = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2];
    const o = topCentre(c, r, k); o[1] -= 24;
    const back = lerpP(cen, o, 0.45);
    s += `<line x1="${f2(cen[0])}" y1="${f2(cen[1])}" x2="${f2(back[0])}" y2="${f2(back[1])}" stroke="rgba(185,193,255,.16)" stroke-width="44" stroke-linecap="round" filter="url(#b10)"/>`;
    s += `<g transform="${affine(q[0], q[1], q[3], ch.w, CHIP.h)}"><rect x="0" y="0" width="${f2(ch.w)}" height="${CHIP.h}" rx="22" fill="rgba(185,193,255,.10)" stroke="rgba(255,255,255,.18)" stroke-width="1" vector-effect="non-scaling-stroke"/></g>`;
    s += T(cen[0], cen[1] + 14, ch.word, { f: 'i', sz: 40, w: 500, anchor: 'middle', op: 0.4 });
  }
  return svgDoc(s);
});
def('B03-0925', 9.25, () => {
  const lay = chipLayout(['New customers', 'Quotes', 'Enquiries', 'Hours', 'Reports']);
  const q = lay[1];
  const scanX = q.x0 + 28 + 60 + 40;
  let s = b3Head() + timeline(scanX) + scanGlow(scanX);
  s += chip(lay[0], { stroke: 'rgba(185,193,255,.55)', bar: 80 });
  s += chip(lay[1], { stroke: '#B9C1FF', sw: 1.5, bar: 60 });
  for (const ch of lay.slice(2)) s += chip(ch, { textOp: 0.72 });
  return svgDoc(s);
});
def('B03-1040', 10.4, () => {
  const lay = chipLayout(['New customers', 'Quotes', 'Enquiries', 'Hours', 'Reports']);
  let s = b3Head() + timeline(1560, 'full') + scanGlow(1560);
  for (const ch of lay) s += chip(ch, { bar: HEAT[ch.word] });
  return svgDoc(s);
});

/* B4: a costed plan, highest return first */
def('B04-1160', 11.6, () => {
  let s = planCard();
  s += `<line x1="330" y1="446" x2="1590" y2="446" stroke="rgba(255,255,255,.10)"/><circle cx="1590" cy="446" r="16" fill="rgba(255,217,200,.45)" filter="url(#b6)"/><circle cx="1590" cy="446" r="3" fill="#ffd9c8" opacity=".8"/>`;
  s += MONO(360, 236, 'AI MAPPING · FIXED PR') + `<rect x="${f2(360 + measure('AI MAPPING · FIXED PR', { f: 'm', sz: 40 }) + 4)}" y="208" width="2" height="30" fill="#B9C1FF"/>`;
  s += HL(360, 352, 'A costed plan', { op: 0.7 });
  const short = ['New customers', null, 'Enquiries', 'Hours', 'Reports'];
  const heat = [80, 120, 98, 64, 48];
  ROWC.forEach((cy, n) => {
    const b = cy + 16;
    if (n === 1) {
      s += `<defs><clipPath id="r2"><rect x="330" y="${cy - 32}" width="1260" height="66"/></clipPath></defs><g clip-path="url(#r2)">${T(430, b - 10, 'Quote follow-ups', { f: 'i', sz: 44, op: 0.9 })}${T(430, b + 36, 'Quotes', { f: 'i', sz: 44, op: 0.3 })}</g>`;
    } else s += T(430, b, short[n], { f: 'i', sz: 44 });
    s += `<rect x="430" y="${b + 18}" width="${heat[n]}" height="4" rx="2" fill="url(#barG)"/>`;
  });
  return svgDoc(s);
});
def('B04-1245', 12.45, () => {
  let s = planCard() + MONO(360, 236, 'AI MAPPING · FIXED PRICE · 1–2 WEEKS') + HL(360, 340, 'A costed plan') + planHeads();
  ['New customers', 'Quote follow-ups', 'Enquiries answered', 'Hours to invoices', 'Owner’s weekly report'].forEach((n, i) => { s += planRow(n, ROWC[i]); });
  return svgDoc(s + FOOT());
});
def('B04-1335', 13.35, () => {
  let s = planCard() + MONO(360, 236, 'AI MAPPING · FIXED PRICE · 1–2 WEEKS') + planHeads();
  s += `<defs><clipPath id="hband"><rect x="330" y="260" width="1200" height="102"/></clipPath></defs><g clip-path="url(#hband)">${HL(360, 412, 'A costed plan', { op: 0.12 })}${HL(360, 332, 'Highest return first.', { op: 0.85 })}</g>`;
  s += planRow('Hours to invoices', 738) + planRow('Owner’s weekly report', 818);
  s += planRow('New customers', 578, { op: 0.85 });
  s += planRow('Enquiries answered', 618, { plate: true, scale: 1.01 });
  s += planRow('Quote follow-ups', 538, { plate: true, scale: 1.01 });
  return svgDoc(s + FOOT());
});
def('B04-1440', 14.4, () => {
  const dy = -2;
  let s = planCard(dy);
  let g = MONO(360, 236, 'AI MAPPING · FIXED PRICE · 1–2 WEEKS') + HL(360, 340, 'Highest return first.') + planHeads();
  g += `<rect x="330" y="462" width="1260" height="72" rx="16" fill="rgba(185,193,255,.16)" stroke="rgba(185,193,255,.75)" stroke-width="1.5"/>`;
  const order = ['Quote follow-ups', 'Enquiries answered', 'New customers', 'Hours to invoices', 'Owner’s weekly report'];
  order.forEach((n, i) => { g += planRow(n, ROWC[i], { num: `0${i + 1}`, numFill: i === 0 ? C.lav : C.muted, op: i === 0 ? 1 : 0.6 }); });
  g += `<rect x="820" y="476" width="217" height="44" rx="22" fill="#B9C1FF"/>` + MONO(928.5, 507, 'First block', { sz: 28, fill: '#0B1220', anchor: 'middle' });
  g += `<defs><clipPath id="rb1"><rect x="1080" y="491" width="240" height="14" rx="7"/></clipPath></defs><rect x="1160" y="485" width="80" height="26" fill="#fff" opacity=".18" clip-path="url(#rb1)"/>`;
  g += FOOT();
  return svgDoc(s + `<g transform="translate(0,${dy})">${g}</g>`);
});

/* B5: first block, guaranteed */
def('B05-1570', 15.7, () => {
  const q = [[650, 466], [1490, 362], [1670, 846], [830, 950]];
  const wire = 'stroke="rgba(223,230,243,.42)" stroke-width="1.5" stroke-dasharray="6 6" fill="none"';
  let s = `<polygon points="${pts(q)}" fill="rgba(255,255,255,.02)"/>`;
  s += `<polygon points="${pts(q)}" stroke="rgba(223,230,243,.25)" stroke-width="6" fill="none" filter="url(#b4)"/>`;
  s += `<polygon points="${pts(q)}" ${wire}/>`;
  const lineUV = (u0, v0, u1, v1, op = 1) => { const a = bil(q, u0, v0), b = bil(q, u1, v1); return `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" ${wire} opacity="${op}"/>`; };
  for (const v of [0.348, 0.681]) s += lineUV(0, v, 1, v);
  for (const v of [0.484, 0.589, 0.8]) s += lineUV(0, v, 1, v, 0.45);
  for (const u of [0.462, 0.739]) s += lineUV(u, 0, u, 1);
  // lifted row
  s += `<g transform="translate(1000,564) rotate(-8) skewX(-10)" filter="url(#shLift2)">
    <rect x="-500" y="-40" width="1000" height="80" rx="16" fill="rgba(185,193,255,.30)" stroke="#B9C1FF" stroke-width="1.5"/>
    <g opacity=".4">${MONO(-470, 13, '01', { sz: 36, fill: C.lav })}${T(-400, 16, 'Quote follow-ups', { f: 'i', sz: 44 })}
    <rect x="-10" y="-22" width="217" height="44" rx="22" fill="#B9C1FF"/>${MONO(98.5, 9, 'First block', { sz: 28, fill: '#0B1220', anchor: 'middle' })}
    <rect x="250" y="-7" width="240" height="14" rx="7" fill="url(#barG)"/></g></g>`;
  return svgDoc(s);
});
function floorLines(op = 1) {
  const wire = `stroke="rgba(223,230,243,.42)" stroke-width="1.5" stroke-dasharray="6 6" fill="none" opacity="${op}"`;
  let s = `<polygon points="${pts([P(0, 0, 0), P(3, 0, 0), P(3, 3, 0), P(0, 3, 0)])}" ${wire}/>`;
  for (const n of [1, 2]) { s += `<path d="M${P(n, 0, 0)} L${P(n, 3, 0)} M${P(0, n, 0)} L${P(3, n, 0)}" ${wire}/>`; }
  return s;
}
def('B05-1675', 16.75, () => {
  let s = floorLines();
  const blocks = {};
  for (const [c, r, k] of BLOCKS) blocks[`${c},${r},${k}`] = null;
  blocks['1,2,0'] = { prog: 0.2 }; blocks['0,1,0'] = { prog: 0.2 };
  blocks['0,2,0'] = { w: { peri: 1 }, studH: 14, glowMul: 0.5 };
  s += world({ def: { w: { wire: 1 }, dashOff: 2 }, blocks });
  return svgDoc(s);
});
function glintArc(c, r, k, dy = 0) {
  const sc = topCentre(c, r, k); const cx = sc[0], cy = sc[1] - STUD.h - dy;
  return `<path d="M${cx - 38},${cy + 12} A44,25.5 0 0 0 ${cx + 6},${cy + 25.3}" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".95"/><path d="M${cx - 38},${cy + 12} A44,25.5 0 0 0 ${cx + 6},${cy + 25.3}" stroke="#fff" stroke-width="6" fill="none" opacity=".5" filter="url(#b3)"/>`;
}
def('B05-1840', 18.4, () => {
  let s = HL(170, 380, 'If it doesn’t do') + HL(170, 480, 'what we agreed,') + HL(170, 580, 'you don’t pay.');
  s += world({ def: { w: { wire: 1 }, dashOff: 9 }, blocks: { '0,2,0': { w: { peri: 1 } } } });
  s += glintArc(0, 2, 0) + FIRST_LABEL(1);
  return svgDoc(s);
});

/* B6: inside the block, it runs */
def('B06-1955', 19.55, () => {
  // giant top face (x4 and beyond) leaving through the frame corners
  const hole = [[960 - 1700, 540], [960, 540 - 980], [960 + 1700, 540], [960, 540 + 980]];
  let s = `<defs><mask id="corners"><rect width="1920" height="1080" fill="#fff"/><polygon points="${pts(hole)}" fill="#000" filter="url(#b12)"/></mask></defs>`;
  s += `<rect width="1920" height="1080" fill="#CDD3FF" opacity=".35" mask="url(#corners)"/>`;
  // radial streaks
  let streaks = '';
  for (let n = 0; n < 28; n++) {
    const a = (n / 28) * Math.PI * 2 + 0.1; const r0 = 250 + (n % 3) * 30, r1 = r0 + 60 + (n % 4) * 25;
    streaks += `<line x1="${f2(1360 + Math.cos(a) * r0 * 1.15)}" y1="${f2(540 + Math.sin(a) * r0)}" x2="${f2(1360 + Math.cos(a) * r1 * 1.15)}" y2="${f2(540 + Math.sin(a) * r1)}" stroke="rgba(185,193,255,.22)" stroke-width="2" stroke-linecap="round"/>`;
  }
  s += `<g filter="url(#b2)">${streaks}</g>`;
  s += `<g transform="translate(1360,540) scale(.6) translate(-1360,-540)"><g filter="url(#b3)">${panel({ rows: [{}, {}, {}], pulse: 0 })}</g></g>`;
  return svgDoc(s);
});
def('B06-2140', 21.4, () => {
  let s = panel({ rows: [{ draft: 1, ready: 1 }, { draft: 1, ready: 1 }, { outline: 1, track: 1330 }], pulse: 0.4 });
  s += HL(170, 420, 'No open quote') + quietLine([0.45, 0.45, 0.55, 0.75, 0.9, 1]);
  s += SUP(170, 600, 'Drafts ready for') + SUP(170, 656, 'the salesperson.');
  return svgDoc(s);
});
def('B06-2240', 22.4, () => {
  let s = panel({ rows: [{ draft: 1, ready: 1, sheen: 0.5 }, { draft: 1, ready: 1 }, { draft: 1, ready: 1, outline: 0.4 }], pulse: 0.5 });
  s += HL(170, 420, 'No open quote') + quietLine([1, 1, 1, 1, 1, 1], 0.55);
  s += SUP(170, 600, 'Drafts ready for') + SUP(170, 656, 'the salesperson.');
  return svgDoc(s);
});

/* B7: block by block */
def('B07-2405', 24.05, () => {
  let s = HL(170, 250, 'Block by block.') + list([1, 0.8, 0.5, 0.5, 0.5]);
  const blocks = namedState({ '01': { w: { peri: 1 }, num: '01' }, '02': { w: { glass: 1, solid: 1 }, wipe: 0.6, dy: 2 }, '06': { w: { wire: 1 } } });
  s += world({ def: { w: { glass: 1 } }, blocks });
  s += FIRST_LABEL(0.7);
  return svgDoc(s);
});
def('B07-2630', 26.3, () => {
  let s = HL(170, 250, 'Block by block.') + list([1, 1, 1, 1, 1]) + SUP(170, 760, 'Every block priced in writing') + SUP(170, 814, 'before we start.');
  const blocks = solidNamed({ '06': { w: { wire: 1 }, num: null } });
  const tc = topCentre(2, 0, 1);
  const light = `<polygon points="${pts([P(2, 0, 2), P(3, 0, 2), P(3, 1, 2), P(2, 1, 2)].map((p) => [p[0], p[1] - 4]))}" fill="#fff" opacity=".35" filter="url(#b8)"/>`;
  s += world({ def: { w: { glass: 1 } }, blocks, level: 4, after: light });
  s += FIRST_LABEL(0.7);
  return svgDoc(s);
});

/* B8: one system, all of it connected */
def('B08-2745', 27.45, () => {
  let s = HL(170, 420, 'One system.');
  const blocks = solidNamed({ '06': { w: { wire: 1 }, num: null } });
  let lines = lightLine(LINES['01-02']) + lightLine(LINES['02-03']) + lightLine(LINES['01-04'], 0.78, { spark: 1 }) + lightLine(LINES['03-05'], 0.48, { spark: 1 }) + lightLine(LINES['04-06'], 0.18, { spark: 1 });
  s += world({ def: { w: { glass: 1 } }, blocks, after: lines, studsOnTop: true });
  s += FIRST_LABEL(0.7);
  return svgDoc(s);
});
function allLines() { return Object.values(LINES).map((l) => lightLine(l)).join(''); }
def('B08-2860', 28.6, () => {
  let s = HL(170, 420, 'One system.') + SUP(170, 500, 'In your name and colours.') + runChips(0.2, 13);
  const blocks = solidNamed({ '01': { studLit: 1 }, '02': { studLit: 1 }, '04': { studLit: 1 }, '03': { studLit: 1 } });
  const wave = `<circle cx="1300" cy="330" r="22" fill="#fff" opacity=".5" filter="url(#b8)"/>${spark(1300, 330, 14, 26)}<circle cx="1540" cy="472" r="22" fill="#fff" opacity=".5" filter="url(#b8)"/>${spark(1540, 472, 14, 26)}`;
  s += world({ def: { w: { glass: 1 } }, blocks, after: allLines(), studsOnTop: true, top: wave });
  s += TOP_LABEL(1) + FIRST_LABEL(0.7);
  return svgDoc(s);
});
function litWorld(extra = {}) {
  const lit = { studLit: 1, glowMul: 1.2 };
  const blocks = solidNamed({ '01': lit, '02': lit, '03': lit, '04': lit, '05': lit, '06': lit });
  const tc = topCentre(0, 0, 2);
  const halo = `<ellipse cx="${tc[0]}" cy="${tc[1] + 40}" rx="170" ry="150" fill="rgba(185,193,255,.22)" filter="url(#b30)"/>`;
  return { def: { w: { glass: 1 } }, blocks, before: halo, studsOnTop: true, ...extra };
}
def('B08-3020', 30.2, () => {
  let s = HL(170, 420, 'One system.') + SUP(170, 500, 'In your name and colours.') + runChips(1, 0);
  s += world(litWorld({ after: allLines(), top: pulsesAt([[1180, 540], [1540, 600], [1420, 330]]) }));
  s += TOP_LABEL(1) + FIRST_LABEL(0.7);
  return svgDoc(s);
});

/* B9: let's find the first thing to build */
def('B09-3145', 31.45, () => {
  let s = world(litWorld({ after: allLines(), top: pulsesAt([[1240, 704], [1540, 620], [1300, 300]]), scale: { s: 0.99, cx: 960, cy: 540 } }));
  const sc = (p) => [960 + (p[0] - 960) * 0.99, 540 + (p[1] - 540) * 0.99 - 24];
  const from = [P(0, 3, 1), P(0, 2, 1), P(1, 2, 1), P(1, 3, 1)].map(sc); // left, top, right, bottom
  const q = from.map((p, n) => lerpP(p, DIAMOND[n], 0.5));
  const cen = [(q[0][0] + q[2][0]) / 2, (q[1][1] + q[3][1]) / 2];
  const back = lerpP(cen, sc(topCentre(0, 2, 0)), 0.22);
  s += `<line x1="${f2(cen[0])}" y1="${f2(cen[1])}" x2="${f2(back[0])}" y2="${f2(back[1])}" stroke="rgba(97,114,243,.45)" stroke-width="70" stroke-linecap="round" filter="url(#b12)"/>`;
  s += `<polygon points="${pts(q)}" fill="#CDD3FF" fill-opacity=".9" stroke="#fff" stroke-width="1" stroke-linejoin="round"/>`;
  return svgDoc(s);
});
def('B09-3195', 31.95, () => {
  let s = world(litWorld({ after: allLines(), top: pulsesAt([[1180, 560], [1600, 506], [1420, 300]]), scale: { s: 0.985, cx: 960, cy: 540 } }));
  const defs = `<radialGradient id="rev" gradientUnits="userSpaceOnUse" cx="228" cy="248" r="118"><stop offset="0" stop-color="#fff"/><stop offset=".52" stop-color="#fff"/><stop offset=".66" stop-color="#000"/></radialGradient><mask id="revM"><rect width="1920" height="1080" fill="url(#rev)"/></mask>`;
  s += `<g mask="url(#revM)">${markImg()}</g>`;
  s += `<polygon points="${pts(DIAMOND)}" fill="#CDD3FF" stroke="#fff" stroke-width="1" stroke-linejoin="round"/>`;
  s += wordmark(336, 0.3);
  return svgDoc(s, defs);
});
function ctaPill(sheenX, nudge = 3) {
  let s = `<rect x="170" y="712" width="600" height="96" rx="48" fill="#FFFFFF"/>`;
  s += T(218, 776, 'Book an AI mapping', { f: 'i', sz: 44, w: 600, fill: '#0B1220' });
  const ax = 712 + nudge;
  s += `<path d="M${ax},760 h34 M${ax + 20},746 l14,14 l-14,14" stroke="#0B1220" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (sheenX != null) s += `<defs><clipPath id="ctaC"><rect x="170" y="712" width="600" height="96" rx="48"/></clipPath><linearGradient id="shG" x1="0" x2="1"><stop offset="0" stop-color="#9fb0ff" stop-opacity="0"/><stop offset=".5" stop-color="#9fb0ff" stop-opacity=".35"/><stop offset="1" stop-color="#9fb0ff" stop-opacity="0"/></linearGradient></defs><g clip-path="url(#ctaC)"><rect x="${sheenX - 60}" y="700" width="120" height="120" fill="url(#shG)" transform="skewX(-20)" transform-origin="${sheenX} 760"/></g>`;
  return s;
}
def('B09-3440', 34.4, () => {
  let s = world(litWorld({ after: allLines(), top: pulsesAt([[1240, 704], [1540, 560], [1300, 340]]), scale: { s: 0.96, cx: 960, cy: 540 } }));
  s += markImg() + wordmark();
  s += HL(170, 450, 'Let’s find the') + HL(170, 550, 'first thing') + HL(170, 650, 'to build.');
  s += ctaPill(470);
  s += MONO(170, 900, '300+ projects built');
  return svgDoc(s);
});

/* B10: back to the work (loop) */
def('B10-3640', 36.4, () => {
  const blocks = namedState({
    '06': { w: { wire: 1 } }, '05': { w: { wire: 0.85, glass: 0.15 } }, '04': { w: { glass: 1 } },
    '03': { w: { glass: 0.75, solid: 0.25 }, num: '03' }, '02': { w: { solid: 1 }, num: '02' }, '01': { w: { peri: 1 }, num: '01', glowMul: 0.6 }
  });
  for (const k of ['1,1,0', '1,2,0', '2,1,0']) blocks[k] = { w: { glass: 0.5, wire: 0.5 } };
  for (const k of ['0,0,0', '1,0,0', '2,0,0', '0,1,0', '0,0,1']) blocks[k] = { w: { glass: 0.8, wire: 0.2 } };
  const lines = lightLine(LINES['01-02'], 0.5) + lightLine(LINES['01-04'], 0.5);
  return svgDoc(world({ def: { w: { glass: 1 } }, blocks, after: lines, studsOnTop: true, scale: { s: 0.98, cx: 960, cy: 540 } }));
});
def('B10-3760', 37.6, () => svgDoc(frame0()));

const FRAME_IDS = FRAME_META.map((m) => m.id);
