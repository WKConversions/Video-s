// Map components for Remotion films, with the data from scripts/map_make.py (design/maps.md). Copy next to kinetic.tsx.
//   import MAP from "./map.json";
//   <DotMap data={MAP} reveal={k(g, "w:across", 1.2, MOVE)} from={MAP.cities["Málaga"]} color={C.navy} />
//   <CountryMap data={MAP} land={C.land} landHi={C.landHi} border="#fff" hl={k(g, "w:europe", 0.6)} />
//   <Pin x y k={k(g, "w:here", 0.5)} color={C.accent} />   <Route pts={[MAP.cities.Copenhagen, MAP.cities.Athens]} k={…} color={C.gold} />
// Everything moves the way Karl approved: smooth ease-outs, no overshoot, the map revealed from the place the line
// is about, never panned across quickly (a camera pan reads as a spike: motion/camera.md).
import React from "react";

type P = [number, number] | number[];
type DotData = { dots: number[][] };
type CountryData = { countries: { n: string; hl: boolean; d: string }[] };

/** A dot map that spreads out from a place: dots appear as a soft wave from `from`, `reveal` 0→1 (Amargier's EMEA). */
export const DotMap: React.FC<{ data: DotData; reveal: number; from: P; color: string; r?: number; wave?: number; out?: number; style?: React.CSSProperties }> = ({
  data, reveal, from, color, r = 3.6, wave = 160, out = 0, style }) => {
  if (reveal <= 0) return null;
  const R = reveal * 1700;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
      {data.dots.map(([x, y, f], i) => {
        const d = Math.hypot(x - from[0], y - from[1]);
        const k = Math.min(1, Math.max(0, (R - d) / wave));
        const o = Math.min(1, Math.max(0, (out * 1900 - (1900 - d)) / wave));          // clears from the far edge back
        return k > 0 && o < 1 ? <circle key={i} cx={x} cy={y} r={r * (0.6 + 0.4 * k)} fill={color} opacity={f * k * (1 - o)} /> : null;
      })}
    </svg>
  );
};

/** Country shapes; the highlighted ones (map_make --highlight) fill to `landHi` as `hl` goes 0→1 (TopJobsAbroad's Europe). */
export const CountryMap: React.FC<{ data: CountryData; land: string; landHi: string; border?: string; hl?: number; o?: number; style?: React.CSSProperties }> = ({
  data, land, landHi, border = "#fff", hl = 1, o = 1, style }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o, ...style }}>
    {data.countries.map((c) => <path key={c.n} d={c.d} fill={c.hl && hl > 0 ? mix(land, landHi, hl) : land} stroke={border} strokeWidth={2.2} strokeLinejoin="round" />)}
  </svg>
);

/** A place marker: a dot that lands with a ring going out once. */
export const Pin: React.FC<{ x: number; y: number; k: number; color: string; size?: number }> = ({ x, y, k, color, size = 26 }) =>
  k <= 0 ? null : (
    <>
      {k < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: size * 4, height: size * 4, borderRadius: 999, border: `3px solid ${color}`,
        transform: `translate(${x - size * 2}px, ${y - size * 2}px) scale(${0.3 + k * 0.9})`, opacity: 1 - k }} />}
      <div style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: 999, background: color, boxShadow: `0 0 0 ${size * 0.3}px ${color}33`,
        transform: `translate(${x - size / 2}px, ${y - size / 2 - (1 - k) * 30}px)`, opacity: Math.min(1, k * 2) }} />
    </>
  );

/** A route between places, drawn as `k` goes 0→1: a faint dotted guide, the travelled line over it, and a head. */
export const Route: React.FC<{ pts: P[]; k: number; color: string; guide?: string; width?: number; arc?: number }> = ({ pts, k, color, guide = "#00000033", width = 7, arc = 0.18 }) => {
  if (k <= 0 || pts.length < 2) return null;
  const path: number[][] = [];                                              // a gentle arc between each pair, like a flight
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], mx = (x0 + x1) / 2, my = (y0 + y1) / 2, len = Math.hypot(x1 - x0, y1 - y0);
    const nx = -(y1 - y0) / len, ny = (x1 - x0) / len, cx = mx + nx * len * arc, cy = my + ny * len * arc;
    for (let j = 0; j <= 40; j++) { const t = j / 40; path.push([(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1]); }
  }
  const n = Math.max(2, Math.round(k * (path.length - 1)) + 1), head = path[n - 1];
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <polyline points={path.map((p) => p.join(",")).join(" ")} fill="none" stroke={guide} strokeWidth={width * 0.7} strokeLinecap="round" strokeDasharray={`1 ${width * 1.8}`} />
      <polyline points={path.slice(0, n).map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={head[0]} cy={head[1]} r={width * 1.3} fill={color} />
    </svg>
  );
};

const mix = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * Math.min(1, Math.max(0, t)))).join(",")})`;
};
