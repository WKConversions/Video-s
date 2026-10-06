// The camera: the world's own view (azimuth, scale, focus), never a layer transform. It never stops: a slow orbit
// (12° to 78°, never through the flat 90° view) the whole film long with eased pushes and pull-backs between keys, through a smooth (Catmull-Rom) curve, so the
// speed changes gently and nothing spikes. Each key aims a world point at a point of the frame.
import { View, K } from "./iso";
import { centre, YOU } from "./map";

const D2R = Math.PI / 180;
const Y = centre(YOU);
/** The focus that puts world point (wx, wy) at screen point (sx, sy) for azimuth th (deg) and scale s. */
const aim = (th: number, s: number, w: [number, number], sx: number, sy: number): [number, number] => {
  const c = Math.cos(th * D2R), n = Math.sin(th * D2R);
  const X = (sx - 960) / s, Yy = (sy - 540) / (s * K);
  const dx = X * c + Yy * n, dy = -X * n + Yy * c;
  return [w[0] - dx, w[1] - dy];
};
type Key = [number, number, number, [number, number], number, number];   // t, th, s, world point, screen x, screen y
const KEYS: Key[] = [
  [0.0, 12.0, 1.36, Y, 1430, 410],
  [3.6, 19.5, 1.5, Y, 1465, 440],
  [6.4, 24.3, 1.44, Y, 1450, 500],
  [9.0, 28.1, 1.24, Y, 1380, 620],
  [11.4, 31.3, 1.14, Y, 1330, 640],
  [13.6, 34.3, 1.2, Y, 1350, 665],
  [15.6, 37.0, 1.3, Y, 1380, 680],
  [18.6, 41.0, 1.36, Y, 1410, 700],
  [22.4, 46.1, 1.36, Y, 1390, 730],
  [25.2, 49.8, 1.28, Y, 1330, 780],
  [27.8, 53.3, 1.34, Y, 1370, 812],
  [31.2, 57.9, 1.42, Y, 1405, 842],
  [34.6, 62.4, 1.45, Y, 1410, 850],
  [37.0, 65.7, 1.4, Y, 1350, 830],
  [40.0, 69.7, 1.2, Y, 1180, 805],
  [43.0, 73.7, 1.08, Y, 1040, 785],
  [46.2, 78.0, 1.0, Y, 960, 770],
  [47.4, 78.8, 0.99, Y, 950, 768],
];
const ROWS = KEYS.map(([t, th, s, w, sx, sy]) => { const f = aim(th, s, w, sx, sy); return [t, th, s, f[0], f[1]]; });
/** Non-uniform Catmull-Rom through the keys (velocity continuous, never a stop between keys). */
const spline = (t: number, col: number) => {
  const n = ROWS.length;
  let i = 0;
  while (i < n - 2 && t > ROWS[i + 1][0]) i++;
  const p0 = ROWS[Math.max(0, i - 1)], p1 = ROWS[i], p2 = ROWS[i + 1], p3 = ROWS[Math.min(n - 1, i + 2)];
  const h = p2[0] - p1[0], u = Math.min(1, Math.max(0, (t - p1[0]) / h));
  const m1 = ((p2[col] - p0[col]) / Math.max(1e-6, p2[0] - p0[0])) * h, m2 = ((p3[col] - p1[col]) / Math.max(1e-6, p3[0] - p1[0])) * h;
  const u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * p1[col] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[col] + (u3 - u2) * m2;
};
export const VIEW = (g: number): View => {
  const t = g / 30;
  return { th: spline(t, 1) * D2R, s: spline(t, 2), fx: spline(t, 3), fy: spline(t, 4), cx: 960, cy: 540 };
};
