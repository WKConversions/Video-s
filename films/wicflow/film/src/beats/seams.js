/* Lead-owned: exact pictures at the seams between builders (both sides call the same function). */
import * as K from '../engine/kit.js';
import { DASH } from '../engine/anim.js';
const { f2 } = K;

/* 8.60 (B2 -> B3), round 2: the company's five processes as the AI mapping's own tiles (the same size and style as
   mapBody's unscanned tiles: K.tile(x, y, K.NS, icon, { is: 1.6, isw: 3 })), in the company's OWN loose arrangement
   (not yet mapped), linked in their order by one dashed path that marches on the film clock. Nothing else on screen.
   B2 ends exactly here; B3 opens from it (on "First, we map" the tiles glide into the mapping's flow, NODES). */
export const SEAM_AB_TILES = [
  { key: 'cust', icon: 'personPlus', x: 560, y: 470 },
  { key: 'enq', icon: 'chat', x: 790, y: 650 },
  { key: 'quote', icon: 'doc', x: 960, y: 430 },
  { key: 'hours', icon: 'clock', x: 1150, y: 640 },
  { key: 'report', icon: 'chart', x: 1360, y: 450 },
];
export function seamABPath(T, op = 1) {
  const P = SEAM_AB_TILES, r = K.NS / 2 + 10;
  let d = '';
  for (let i = 1; i < P.length; i++) {
    const a = P[i - 1], b = P[i], L = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L;
    d += `M${f2(a.x + ux * r)},${f2(a.y + uy * r)} L${f2(b.x - ux * r)},${f2(b.y - uy * r)} `;
  }
  return `<path d="${d}" fill="none" stroke="rgba(223,230,243,.38)" stroke-width="2" stroke-dasharray="6 8" stroke-dashoffset="${f2(-DASH(T))}" stroke-linecap="round" opacity="${op}"/>`;
}
export const seamABTile = (n) => K.tile(n.x, n.y, K.NS, n.icon, { is: 1.6, isw: 3, stroke: 'rgba(255,255,255,.15)' });
export function seamAB(T) {
  return seamABPath(T) + SEAM_AB_TILES.map(seamABTile).join('');
}
