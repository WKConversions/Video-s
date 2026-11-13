/* B9 "Let's find the first thing to build." + the CTA press. 27.55-33.00. Builder D. No loop: it ends on the card. */
import * as K from '../engine/kit.js';
import { E, pop, seg, mix, clamp01, wobble } from '../engine/anim.js';
import { w } from '../timeline.js';
import { system } from './D_shared.js';
const f2 = (n) => Math.round(n * 100) / 100;
const BTN = { x: 700, y: 846, w: 520, h: 88 }, TIP = [1080, 890];
const CLICK = 30.3, DEEP = CLICK + 0.11;
export const HAND = [
  { at: 28.95, x: 2000, y: 1150 },
  { at: CLICK, x: TIP[0], y: TIP[1], click: true },
  { at: 31.4, x: TIP[0] + 160, y: TIP[1] + 160 },
];
const WORDS = ['Let’s', 'find', 'the', 'first', 'thing', 'to', 'build.'];
const WT = [w('let\'s'), w('find'), w('the', 3), w('first', 4), w('thing'), w('to'), w('build')];
const LS = { f: 'h', sz: 60, w: 500, ls: -1.2 };

function line(T) {
  let s = '';
  const total = K.measure(WORDS.join(' '), LS), x0 = 960 - total / 2;
  WORDS.forEach((wd, i) => {
    const t0 = WT[i] - 0.02, p = pop(T, t0, { dur: 0.55, over: 0.05 });
    if (p <= 0) return;
    const x = x0 + (i ? K.measure(WORDS.slice(0, i).join(' ') + ' ', LS) : 0);
    s += K.T(x, 790 + 26 * (1 - p), wd, { ...LS, op: f2(E(T, t0, 0.3, 'out')) });
  });
  return s;
}
function mark(T) {
  const pm = E(T, 28.35, 0.6, 'inOut'), pw = pop(T, 28.55, { dur: 0.55, over: 0.04 });
  let s = '';
  const ms = 0.66, mw = K.MARK.w * ms, mh = K.MARK.h * ms;
  const ww = K.measure('wicflow', { f: 'k', sz: 92, w: 800, ls: -3.68 }), total = mw + 18 + ww, x0 = 960 - total / 2;
  if (pm > 0) {   // a soft radial wipe on the mark
    const id = K.uid('mk'), mx = x0 + mw / 2, my = 628;
    const R = mix(10, 130, pm);
    s += `<defs><mask id="${id}"><circle cx="${f2(mx)}" cy="${my}" r="${f2(R)}" fill="#fff" filter="url(#b8)"/></mask></defs><g mask="url(#${id})">${K.lockup({ wordOp: 0 })}</g>`;
  }
  if (pw > 0) s += `<g transform="translate(0,${f2(12 * (1 - Math.min(1, pw)))})">${K.T(x0 + mw + 18, 628 + 92 * 0.34, 'wicflow', { f: 'k', sz: 92, w: 800, ls: -3.68, fill: K.C.text, op: f2(E(T, 28.55, 0.4, 'out')) })}</g>`;
  return s;
}
/* press amount: 0 rest, 1 deepest (at DEEP), then a spring release with a small overshoot */
const press = (T) => (T < DEEP ? E(T, DEEP - 0.14, 0.14, 'inOut') : 1 - pop(T, DEEP, { dur: 0.45, over: 0.12 }));
function cta(T) {
  const pin = pop(T, 29.0, { dur: 0.5, over: 0.06 });
  if (pin <= 0) return '';
  const { x: bx, y: by, w: bw, h: bh } = BTN, cx = bx + bw / 2, cy = by + bh / 2;
  const pr = press(T), alive = E(T, 31.3, 0.8, 'inOut');
  const sc = (0.9 + 0.1 * Math.min(pin, 1.2)) * (1 - 0.04 * pr) * (1 + 0.005 * Math.sin(((T - 31.3) * 2 * Math.PI) / 3.6) * alive);
  const tint = clamp01(pr), fill = `rgb(${Math.round(255 - 50 * tint)},${Math.round(255 - 43 * tint)},255)`;
  const nudge = 9 * Math.sin(Math.PI * E(T, DEEP + 0.05, 0.6, 'inOut')) + 1.2 * Math.sin(((T - 31.3) * 2 * Math.PI) / 3.2) * alive;
  const ax = bx + bw - 86 + nudge, op = E(T, 29.0, 0.25, 'out');
  const sh = E(T, 30.85, 0.9, 'inOut'), sx = bx + bw * (sh * 1.4 - 0.2);
  const cid = K.uid('cc'), gid = K.uid('sg');
  let s = `<g opacity="${f2(op)}" transform="translate(${cx},${cy}) scale(${f2(sc * 1000) / 1000}) translate(${-cx},${-cy})">`;
  s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="44" fill="${fill}"/>`;
  s += K.T(bx + 54, by + 57, 'Book an AI mapping', { f: 'i', sz: 38, w: 600, fill: '#0B1220' });
  s += `<path d="M${f2(ax)},${by + 44} h32 M${f2(ax + 18)},${by + 31} l14,13 l-14,13" stroke="#0B1220" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (sh > 0 && sh < 1) s += `<defs><clipPath id="${cid}"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="44"/></clipPath><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0" stop-color="#8fa2ff" stop-opacity="0"/><stop offset=".5" stop-color="#8fa2ff" stop-opacity=".42"/><stop offset="1" stop-color="#8fa2ff" stop-opacity="0"/></linearGradient></defs><g clip-path="url(#${cid})"><rect x="${f2(sx - 60)}" y="${by - 10}" width="120" height="${bh + 22}" fill="url(#${gid})" transform="skewX(-20)" transform-origin="${f2(sx)} ${by + 44}"/></g>`;
  s += '</g>';
  // ripple from the fingertip at the deepest point of the click
  for (const [d, r1, wd] of [[0, 84, 3], [0.1, 56, 2]]) {
    const u = seg(T, DEEP + d, 0.7);
    if (u > 0 && u < 1) s += `<circle cx="${TIP[0]}" cy="${TIP[1]}" r="${f2(6 + r1 * (1 - Math.pow(1 - u, 2.4)))}" fill="none" stroke="#7B8BFF" stroke-width="${f2(wd * (1 - 0.6 * u))}" opacity="${f2(0.8 * Math.pow(1 - u, 1.4))}"/>`;
  }
  return s;
}
export function draw(T) {
  const s = system(T);
  return s + mark(T) + line(T) + cta(T);
}
