// The site's topographic texture, made live: contour lines of a smooth noise field (simplex fbm) plus
// "summits" (gaussian bumps: people, places, the logo) and expanding ring ripples. Marching squares on a
// coarse grid; the result is one SVG path of line segments per call. Deterministic: a pure function of time.

const F3 = 1 / 3, G3 = 1 / 6;
const grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
const perm = new Uint8Array(512);
(() => {
  const p = new Uint8Array(256); for (let i = 0; i < 256; i++) p[i] = i;
  let s = 1337; for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); const t = p[i]; p[i] = p[j]; p[j] = t; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
})();

export function noise3(x: number, y: number, z: number): number {
  const s = (x + y + z) * F3; const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
  const t = (i + j + k) * G3; const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) { if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; } }
  else { if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } }
  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3, x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3, x3 = x0 - 1 + 0.5, y3 = y0 - 1 + 0.5, z3 = z0 - 1 + 0.5;
  const ii = i & 255, jj = j & 255, kk = k & 255;
  const c = (gx: number, gy: number, gz: number, g: number[]) => { let tt = 0.6 - gx * gx - gy * gy - gz * gz; if (tt < 0) return 0; tt *= tt; return tt * tt * (g[0] * gx + g[1] * gy + g[2] * gz); };
  const n0 = c(x0, y0, z0, grad3[perm[ii + perm[jj + perm[kk]]] % 12]);
  const n1 = c(x1, y1, z1, grad3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12]);
  const n2 = c(x2, y2, z2, grad3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12]);
  const n3 = c(x3, y3, z3, grad3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12]);
  return 32 * (n0 + n1 + n2 + n3);
}

export type Bump = { x: number; y: number; h: number; r: number };          // a summit: height h (field units), radius r (px)
export type Ripple = { x: number; y: number; age: number; h?: number; w?: number; speed?: number }; // a ring travelling out from (x, y); age in s
/** a ridge (a wall of tightly packed contours) along the segment (x1, y1)-(x2, y2): height h, half-width w px */
export type Ridge = { x1: number; y1: number; x2: number; y2: number; h: number; w: number };
export type TopoOpts = {
  t: number; w?: number; h?: number; cell?: number; scale?: number; drift?: number; amp?: number;
  spacing?: number; offset?: number; bumps?: Bump[]; ripples?: Ripple[]; ridges?: Ridge[]; seed?: number; calm?: number;
};

/** the contour path ("M x y L x y ..." segments) for the field at time t */
export function topoPath(o: TopoOpts): string {
  const W = o.w ?? 1920, H = o.h ?? 1080, cell = o.cell ?? 10, sc = o.scale ?? 1 / 860, drift = o.drift ?? 0.05, amp = o.amp ?? 1;
  const sp = o.spacing ?? 0.085, off = o.offset ?? 0, seed = o.seed ?? 0, calm = o.calm ?? 0;
  const gw = Math.ceil(W / cell) + 1, gh = Math.ceil(H / cell) + 1; const f = new Float32Array(gw * gh);
  const z = o.t * drift + seed * 10;
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const x = i * cell, y = j * cell;
    let v = amp * (1 - calm) * (noise3(x * sc, y * sc, z) + 0.32 * noise3(x * sc * 2.1 + 17, y * sc * 2.1 - 9, z * 1.3));
    if (o.bumps) for (const b of o.bumps) { const dx = x - b.x, dy = y - b.y; v += b.h * Math.exp(-(dx * dx + dy * dy) / (b.r * b.r)); }
    if (o.ripples) for (const r of o.ripples) {
      if (r.age < 0) continue; const R = r.age * (r.speed ?? 900), wd = r.w ?? 90; const d = Math.hypot(x - r.x, y - r.y);
      v += (r.h ?? 0.5) * Math.exp(-((d - R) * (d - R)) / (wd * wd)) * Math.exp(-r.age * 1.2);
    }
    if (o.ridges) for (const g of o.ridges) {
      const vx = g.x2 - g.x1, vy = g.y2 - g.y1, L2 = vx * vx + vy * vy || 1; const u = Math.max(0, Math.min(1, ((x - g.x1) * vx + (y - g.y1) * vy) / L2));
      const px = g.x1 + vx * u - x, py = g.y1 + vy * u - y; v += g.h * Math.exp(-(px * px + py * py) / (g.w * g.w));
    }
    f[j * gw + i] = v;
  }
  let lo = Infinity, hi = -Infinity; for (let n = 0; n < f.length; n++) { if (f[n] < lo) lo = f[n]; if (f[n] > hi) hi = f[n]; }
  const parts: string[] = [];
  const first = Math.ceil((lo - off) / sp) * sp + off;
  for (let L = first; L < hi; L += sp) {
    for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) {
      const a = f[j * gw + i], b = f[j * gw + i + 1], c = f[(j + 1) * gw + i + 1], d = f[(j + 1) * gw + i];
      const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * cell, y = j * cell;
      const top = () => [x + cell * (L - a) / (b - a), y], right = () => [x + cell, y + cell * (L - b) / (c - b)];
      const bottom = () => [x + cell * (L - d) / (c - d), y + cell], left = () => [x, y + cell * (L - a) / (d - a)];
      const seg = (p: number[], q: number[]) => parts.push(`M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
      switch (idx) {
        case 1: case 14: seg(left(), bottom()); break;
        case 2: case 13: seg(bottom(), right()); break;
        case 3: case 12: seg(left(), right()); break;
        case 4: case 11: seg(top(), right()); break;
        case 6: case 9: seg(top(), bottom()); break;
        case 7: case 8: seg(left(), top()); break;
        case 5: seg(left(), top()); seg(bottom(), right()); break;
        case 10: seg(top(), right()); seg(left(), bottom()); break;
      }
    }
  }
  return parts.join("");
}
