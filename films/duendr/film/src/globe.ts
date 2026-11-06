// The curved-globe map (Karl: "3D with slight curvature, as if you're looking close-up at the globe").
// The region around the Costa del Sol is magnified onto a unit sphere (angles x k), the sphere is pitched so the
// horizon arcs across the top, and a pinhole camera at distance d looks at it. Coastlines (Natural Earth 10m,
// film/src/geo.json) are clipped to a lon/lat box, densified, clipped at the horizon in 3D, and closed along
// the horizon arc (the shorter way round). Same math as plan/mapproto.py.
import GEO from "./geo.json";

export type Pt = [number, number];
export type View = { lam0: number; phi0: number; k: number; pitch: number; d: number; S: number; cx: number; cy: number };
type V3 = [number, number, number];

export const CITIES: { name: string; lon: number; lat: number }[] = [
  { name: "Málaga", lon: -4.4214, lat: 36.7213 }, { name: "Marbella", lon: -4.8826, lat: 36.5101 }, { name: "Estepona", lon: -5.146, lat: 36.4277 },
  { name: "Fuengirola", lon: -4.6247, lat: 36.5398 }, { name: "Torremolinos", lon: -4.4999, lat: 36.6203 }, { name: "Nerja", lon: -3.8787, lat: 36.758 },
  { name: "Sotogrande", lon: -5.2847, lat: 36.2867 }, { name: "Ronda", lon: -5.167, lat: 36.7462 }, { name: "Sevilla", lon: -5.9845, lat: 37.3891 },
  { name: "Granada", lon: -3.5986, lat: 37.1773 }, { name: "Cádiz", lon: -6.2886, lat: 36.5271 },
];

const LAND = (GEO as { c: string; hole: boolean; p: Pt[] }[]).filter((g) => ["Spain", "Portugal", "Morocco", "Gibraltar", "Algeria"].includes(g.c));
const BOX = [-8.6, -0.4, 34.6, 39.4];

const boxclip = (ring: Pt[]): Pt[] => {
  let R = ring;
  const edges: [number, number, boolean][] = [[0, BOX[0], true], [0, BOX[1], false], [1, BOX[2], true], [1, BOX[3], false]];
  for (const [ax, lim, gt] of edges) {
    const out: Pt[] = [];
    for (let i = 0; i < R.length; i++) {
      const A = R[(i - 1 + R.length) % R.length], B = R[i];
      const ina = gt ? A[ax] >= lim : A[ax] <= lim, inb = gt ? B[ax] >= lim : B[ax] <= lim;
      const cut = (): Pt => { const t = (lim - A[ax]) / (B[ax] - A[ax]); return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]; };
      if (inb) { if (!ina) out.push(cut()); out.push(B); } else if (ina) out.push(cut());
    }
    R = out; if (!R.length) return [];
  }
  const dense: Pt[] = [];
  for (let i = 0; i < R.length; i++) {
    const A = R[(i - 1 + R.length) % R.length], B = R[i]; const n = Math.max(1, Math.floor(Math.max(Math.abs(B[0] - A[0]), Math.abs(B[1] - A[1])) / 0.05));
    for (let j = 1; j <= n; j++) dense.push([A[0] + ((B[0] - A[0]) * j) / n, A[1] + ((B[1] - A[1]) * j) / n]);
  }
  return dense;
};
const CLIPPED = LAND.map((g) => boxclip(g.p)).filter((r) => r.length > 2);

/** a projector for one view: to3 (sphere point), visible test, screen position */
export const makeView = (v: View) => {
  const c0 = Math.cos((v.phi0 * Math.PI) / 180), p = (v.pitch * Math.PI) / 180, zc = 1 / v.d + 0.002, rr = Math.sqrt(1 - zc * zc);
  const to3 = (lon: number, lat: number): V3 => {
    const u = (v.k * (lon - v.lam0) * c0 * Math.PI) / 180, w = (v.k * (lat - v.phi0) * Math.PI) / 180;
    const X = Math.cos(w) * Math.sin(u), Y = Math.sin(w), Z = Math.cos(w) * Math.cos(u);
    return [X, Y * Math.cos(p) + Z * Math.sin(p), -Y * Math.sin(p) + Z * Math.cos(p)];
  };
  const c = to3(v.lam0, v.phi0); const yc = c[1] / (v.d - c[2]);
  const pj = (P: V3): Pt => [v.cx + (P[0] / (v.d - P[2])) * v.S, v.cy - (P[1] / (v.d - P[2]) - yc) * v.S];
  const arc = (E: V3, N: V3): V3[] => {
    const a0 = Math.atan2(E[1], E[0]), a1 = Math.atan2(N[1], N[0]); let span = (((a1 - a0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (span > Math.PI) span -= 2 * Math.PI; const n = Math.max(2, Math.floor(Math.abs(span) / 0.01)); const out: V3[] = [];
    for (let i = 1; i < n; i++) { const a = a0 + (span * i) / n; out.push([rr * Math.cos(a), rr * Math.sin(a), zc]); }
    return out;
  };
  const clipRing = (ring: Pt[]): Pt[] => {
    const P = ring.map(([lo, la]) => to3(lo, la)); const out: V3[] = []; let pend: V3 | null = null;
    for (let i = 0; i < P.length; i++) {
      const A = P[(i - 1 + P.length) % P.length], B = P[i]; const ina = A[2] >= zc, inb = B[2] >= zc;
      const cut = (): V3 => { const t = (zc - A[2]) / (B[2] - A[2]); return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]; };
      if (inb) { if (!ina) { const Nn = cut(); if (pend) { out.push(...arc(pend, Nn)); pend = null; } out.push(Nn); } out.push(B); }
      else if (ina) { const E = cut(); out.push(E); pend = E; }
    }
    if (pend && out.length) out.push(...arc(pend, out[0]));
    return out.map(pj);
  };
  /** the screen position of a lon/lat and whether it faces the camera */
  const at = (lon: number, lat: number): [number, number, boolean] => { const P = to3(lon, lat); const s = pj(P); return [s[0], s[1], P[2] >= zc]; };
  /** the land as one SVG path (even-odd) */
  const landPath = () => CLIPPED.map((r) => clipRing(r)).filter((r) => r.length > 2).map((r) => "M" + r.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("L") + "Z").join("");
  /** the globe's silhouette (the horizon) as an SVG path */
  const limbPath = () => { const pts: string[] = []; for (let i = 0; i <= 240; i++) { const a = (2 * Math.PI * i) / 240; const q = pj([rr * Math.cos(a), rr * Math.sin(a), zc]); pts.push(`${q[0].toFixed(1)} ${q[1].toFixed(1)}`); } return "M" + pts.join("L") + "Z"; };
  /** parallels and meridians (the graticule), visible parts only */
  const gridPath = (step = 0.5) => {
    const segs: string[] = [];
    const line = (pts: [number, number, boolean][]) => { let cur: string[] = []; for (const [x, y, ok] of pts) { if (ok) cur.push(`${x.toFixed(1)} ${y.toFixed(1)}`); else if (cur.length) { if (cur.length > 1) segs.push("M" + cur.join("L")); cur = []; } } if (cur.length > 1) segs.push("M" + cur.join("L")); };
    for (let la = 34.5; la <= 40.5; la += step) { const pts: [number, number, boolean][] = []; for (let lo = -9; lo <= 0; lo += 0.1) pts.push(at(lo, la)); line(pts); }
    for (let lo = -9; lo <= 0; lo += step) { const pts: [number, number, boolean][] = []; for (let la = 34.5; la <= 40.5; la += 0.05) pts.push(at(lo, la)); line(pts); }
    return segs.join("");
  };
  return { at, landPath, limbPath, gridPath, to3 };
};
