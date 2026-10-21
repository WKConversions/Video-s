import React from "react";
import { Para, Caps, vis, k, s, rnd, ARRIVE, MOVE, OUT, SOFT, clamp01, lerp, Img, staticFile, SANS, INK, CREAM, TAUPE } from "./brand";
import MAP from "../data/malaga-map.json";
import FINE from "../data/malaga-map-fine.json";

// ---- C. Málaga: "An international networking community bringing founders, entrepreneurs, builders and investors
// together in Málaga." A charcoal dot map (Americas → Middle East) spreads out from Málaga; fine taupe arcs fly in from
// thirteen cities, staggered, each with a light point that lights the map beneath it; the four roles appear beside an
// arriving arc on their words; Málaga's ring closes as the arcs land. On "together" the camera closes in (the dot grid
// hands over to a finer one, so the coast stays drawn), and Málaga's ring opens as an iris onto the city.
// Data (map_make.py, from films/fuf/film):
//   python3 ../scripts/map_make.py dots --bbox=-130,72,-40,72 --frame 960,540,1176 --step 1.15 --cities "Málaga" --out src/data/malaga-map.json
//   python3 ../scripts/map_make.py dots --bbox=-28,22,20,54 --frame 960,540,1080 --step 0.3 --cities "Málaga" --out src/data/malaga-map-fine.json

// World space = the coarse map's px (map_make's equal-spaced projection); the fine grid is reprojected into it.
const prj = (bb: number[], hpx: number) => {
  const lonc = (bb[0] + bb[1]) / 2, latc = (bb[2] + bb[3]) / 2, kq = hpx / (bb[3] - bb[2]), cs = Math.cos((latc * Math.PI) / 180);
  return { to: (lon: number, lat: number): [number, number] => [960 + (lon - lonc) * kq * cs, 540 - (lat - latc) * kq],
    from: (x: number, y: number): [number, number] => [(x - 960) / (kq * cs) + lonc, (540 - y) / kq + latc] };
};
const WORLD = prj(MAP.bbox, 1176), FINEP = prj(FINE.bbox, 1080);
const COARSE = MAP.dots as number[][];
const FINED = (FINE.dots as number[][]).map(([x, y, f]) => { const [wx, wy] = WORLD.to(...FINEP.from(x, y)); return [wx, wy, f]; });
const M = WORLD.to(-4.42, 36.72);                                                     // Málaga, 36.72° N 4.42° W

// ---- The camera: Málaga's place on screen (Q) and the scale (S). A slow, constant push toward Málaga through the
// map; on "together" it closes in (MOVE) and brings Málaga to the centre, where the iris opens.
const T0 = 9.77, T1 = 15.05, ZD = 1.1, S0 = 0.9, S1 = 1.12, SZ = 7.5, Q0 = [1170, 332], Q1 = [960, 540];
const camera = (t: number) => {
  const l = (t - T0) / (T1 - T0), z = MOVE(clamp01((t - T1) / ZD));
  const S = Math.exp(Math.log(S0) + Math.log(S1 / S0) * l + Math.log(SZ / S1) * z);
  const q = clamp01(0.25 * clamp01(l) + 0.75 * z);
  return { S, qx: lerp(Q0[0], Q1[0], q), qy: lerp(Q0[1], Q1[1], q) };
};

// ---- The arcs: a city, departure (s), flight (s); a role label rides beside four of them, set on its word.
type Arc = { lon: number; lat: number; dep: number; dur: number; role?: string; at?: number; flip?: boolean; inner?: boolean };
const ARCS: Arc[] = [
  { lon: -9.14, lat: 38.72, dep: 10.15, dur: 0.8 },                                   // Lisbon
  { lon: -0.13, lat: 51.5, dep: 10.3, dur: 1.0 },                                     // London
  { lon: -79.38, lat: 43.65, dep: 10.45, dur: 1.85 },                                 // Toronto
  { lon: 2.35, lat: 48.86, dep: 10.8, dur: 1.0 },                                     // Paris
  { lon: 34.78, lat: 32.08, dep: 10.95, dur: 1.4 },                                   // Tel Aviv
  { lon: -74.0, lat: 40.71, dep: 11.3, dur: 1.8, role: "FOUNDERS", at: 12.16, inner: true },       // New York
  { lon: 4.9, lat: 52.37, dep: 11.65, dur: 1.0 },                                     // Amsterdam
  { lon: -99.13, lat: 19.43, dep: 11.85, dur: 2.0 },                                  // Mexico City
  { lon: 18.07, lat: 59.33, dep: 12.5, dur: 1.35, role: "ENTREPRENEURS", at: 13.04, flip: true }, // Stockholm
  { lon: 8.54, lat: 47.37, dep: 12.85, dur: 1.0 },                                    // Zurich
  { lon: -46.63, lat: -23.55, dep: 12.95, dur: 2.0, role: "BUILDERS", at: 13.96 },    // São Paulo
  { lon: 13.4, lat: 52.52, dep: 13.55, dur: 1.15 },                                   // Berlin
  { lon: 55.27, lat: 25.2, dep: 14.12, dur: 1.3, role: "INVESTORS", at: 14.76 },      // Dubai
];
const GEO = ARCS.map((a) => {
  const [ox, oy] = WORLD.to(a.lon, a.lat), dx = M[0] - ox, dy = M[1] - oy, len = Math.hypot(dx, dy);
  let nx = -dy / len, ny = dx / len;
  if (ny > 0 || (Math.abs(ny) < 0.05 && nx > 0)) { nx = -nx; ny = -ny; }              // bow north, like a flight
  if (a.flip) { nx = -nx; ny = -ny; }
  const bow = len * 0.2, cx = (ox + M[0]) / 2 + nx * bow, cy = (oy + M[1]) / 2 + ny * bow;
  const at = (u: number): [number, number] => [(1 - u) ** 2 * ox + 2 * (1 - u) * u * cx + u * u * M[0], (1 - u) ** 2 * oy + 2 * (1 - u) * u * cy + u * u * M[1]];
  return { ox, oy, len, nx, ny, at, land: a.dep + a.dur };
});
const N = 96;

// Dots as one path per opacity step (thousands of dots, a few dozen DOM nodes).
const STEP = 0.025, NB = 36;
const dotsPaths = (pts: number[][], r: number, color: string, op: (x: number, y: number, f: number) => number, cam: ReturnType<typeof camera>, key: string) => {
  const b: string[][] = Array.from({ length: NB + 1 }, () => []);
  const rr = r.toFixed(2), d2 = (2 * r).toFixed(2);
  for (const [x, y, f] of pts) {
    const sx = cam.qx + (x - M[0]) * cam.S, sy = cam.qy + (y - M[1]) * cam.S;
    if (sx < -20 || sx > 1940 || sy < -20 || sy > 1100) continue;
    const o = op(sx, sy, f), i = Math.min(NB, Math.round(o / STEP));
    if (i > 0) b[i].push(`M${(sx - r).toFixed(1)} ${sy.toFixed(1)}a${rr} ${rr} 0 1 0 ${d2} 0a${rr} ${rr} 0 1 0 -${d2} 0`);
  }
  return b.map((p, i) => (p.length ? <path key={key + i} d={p.join("")} fill={color} opacity={i * STEP} /> : null));
};

const LIGHT = "#F3EBE1";

export const Malaga: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "an-0.25", "through-0.1");
  if (o <= 0) return null;
  const t = g / 30, cam = camera(t);
  const P = (x: number, y: number): [number, number] => [cam.qx + (x - M[0]) * cam.S, cam.qy + (y - M[1]) * cam.S];
  const [mx, my] = [cam.qx, cam.qy];

  // how far the arrivals have got: the ring closes and Málaga warms as each one lands
  const landed = GEO.reduce((a, q) => a + k(g, q.land - 0.05, 0.45, SOFT), 0) / GEO.length;
  // the reveal: the map spreads out from Málaga
  const R = lerp(0, 2300, k(g, T0, 1.7, SOFT));
  // light points in flight, which light the map beneath them
  const heads = ARCS.map((a, i) => {
    const u = MOVE(clamp01((t - a.dep) / a.dur));
    const on = t > a.dep && t < GEO[i].land + 0.3 ? Math.min(1, (t - a.dep) / 0.15) * (1 - k(g, GEO[i].land - 0.05, 0.3)) : 0;
    const [hx, hy] = P(...GEO[i].at(u));
    return { u, on, hx, hy };
  });
  const lit = heads.filter((h) => h.on > 0.02);
  const warmR = (110 + 170 * landed) * cam.S;
  const light = (sx: number, sy: number) => {
    let a = 0;
    for (const h of lit) { const d2 = (sx - h.hx) ** 2 + (sy - h.hy) ** 2; if (d2 < 22000) a += 0.5 * h.on * Math.exp(-d2 / 5200); }
    const dm = (sx - mx) ** 2 + (sy - my) ** 2;
    return a + (0.08 + 0.26 * landed) * Math.exp(-dm / (warmR * warmR));
  };
  const reveal = (sx: number, sy: number) => clamp01((R - Math.hypot(sx - mx, sy - my)) / 260);
  const coarseA = 1 - clamp01((cam.S - 2.6) / 2.4), fineA = clamp01((cam.S - 2.3) / 2.2);
  const rC = 1.85 * Math.pow(cam.S / S0, 0.45);

  // the iris: Málaga's ring opens onto the city
  const ik = MOVE(k(g, 15.62, 0.64, (x) => x));
  const ir = lerp(14, 1200, ik);
  const push = 1 + 0.07 * k(g, 15.6, 2.2, ARRIVE);
  const labelsOut = 1 - k(g, 15.0, 0.35, OUT);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK, overflow: "hidden" }}>
      {ik < 1 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="mlg-halo"><stop offset="0" stopColor={LIGHT} stopOpacity={0.55} /><stop offset="0.35" stopColor={LIGHT} stopOpacity={0.16} /><stop offset="1" stopColor={LIGHT} stopOpacity={0} /></radialGradient>
            <radialGradient id="mlg-warm"><stop offset="0" stopColor={TAUPE} stopOpacity={1} /><stop offset="1" stopColor={TAUPE} stopOpacity={0} /></radialGradient>
          </defs>
          {/* Málaga's warmth on the charcoal */}
          <circle cx={mx} cy={my} r={warmR * 2.2} fill="url(#mlg-warm)" opacity={0.05 + 0.1 * landed} />
          {/* the dot map: coarse grid, then the fine grid as the camera closes in */}
          {coarseA > 0 && dotsPaths(COARSE, rC, TAUPE, (sx, sy, f) => coarseA * reveal(sx, sy) * Math.min(0.95, 0.24 * f + light(sx, sy)), cam, "c")}
          {fineA > 0 && dotsPaths(FINED, 1.9, TAUPE, (sx, sy, f) => fineA * Math.min(0.95, 0.26 * f + light(sx, sy)), cam, "f")}
          {/* arcs */}
          {ARCS.map((a, i) => {
            const q = GEO[i], h = heads[i];
            if (t < a.dep - 0.4) return null;
            const appear = k(g, a.dep - 0.4, 0.4);
            const [ox, oy] = P(q.ox, q.oy);
            const flash = k(g, a.dep - 0.1, 0.2) * (1 - k(g, a.dep + 0.25, 0.9, SOFT));
            const out: React.ReactNode[] = [
              <circle key="o" cx={ox} cy={oy} r={2.4} fill={TAUPE} opacity={0.85 * appear} />,
              <circle key="of" cx={ox} cy={oy} r={2.4} fill={LIGHT} opacity={flash} />,
            ];
            if (h.u > 0) {
              const pts: string[] = [];
              const n = Math.max(2, Math.ceil(h.u * N));
              for (let j = 0; j <= n; j++) { const [x, y] = P(...q.at((h.u * j) / n)); pts.push(`${x.toFixed(1)},${y.toFixed(1)}`); }
              const lineO = 0.62 - 0.3 * k(g, q.land, 0.9, SOFT);
              out.push(<polyline key="l" points={pts.join(" ")} fill="none" stroke={TAUPE} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={lineO} />);
              // the bright tail behind the light point
              const tail = Math.min(0.16, h.u);
              if (h.on > 0.01) for (let j = 0; j < 6; j++) {
                const u0 = h.u - tail * (1 - j / 6), u1 = h.u - tail * (1 - (j + 1) / 6);
                const [x0, y0] = P(...q.at(u0)), [x1, y1] = P(...q.at(u1));
                out.push(<line key={"t" + j} x1={x0} y1={y0} x2={x1} y2={y1} stroke={LIGHT} strokeWidth={1.7} strokeLinecap="round" opacity={h.on * ((j + 1) / 6) * 0.85} />);
              }
              if (h.on > 0.01) out.push(<circle key="hh" cx={h.hx} cy={h.hy} r={18} fill="url(#mlg-halo)" opacity={h.on} />, <circle key="h" cx={h.hx} cy={h.hy} r={2.7} fill={LIGHT} opacity={h.on} />);
              // after landing, a faint light keeps travelling the longer routes: the flow into Málaga goes on
              if (t > q.land + 0.4 && q.len > 250) {
                const per = 2.9, st = q.land + 0.6 + rnd(i + 3) * 1.4, ph = ((t - st) % per + per) % per;
                if (t > st && ph < 1.6) {
                  const pu = MOVE(ph / 1.6), [px, py] = P(...q.at(pu));
                  out.push(<circle key="p" cx={px} cy={py} r={1.9} fill={LIGHT} opacity={0.5 * Math.sin(Math.PI * (ph / 1.6)) * labelsOut} />);
                }
              }
            }
            return <g key={i}>{out}</g>;
          })}
          {/* Málaga: a point, a faint ring, and the ring closing as the arcs land */}
          <circle cx={mx} cy={my} r={14} fill="none" stroke={TAUPE} strokeWidth={1.2} opacity={0.35 * (1 - ik)} />
          <circle cx={mx} cy={my} r={14} fill="none" stroke={LIGHT} strokeWidth={1.6} opacity={0.95 * (1 - ik)}
            strokeDasharray={`${(2 * Math.PI * 14 * landed).toFixed(2)} 200`} transform={`rotate(-90 ${mx} ${my})`} />
          <circle cx={mx} cy={my} r={3.4} fill={LIGHT} opacity={k(g, T0, 0.5) * (1 - ik)} />
        </svg>
      )}

      {/* the place name on the map, and the four roles beside their arcs */}
      {ik < 1 && <Label t="MÁLAGA" x={mx + 24} y={my + 14} o={k(g, 10.1, 0.6) * labelsOut} size={15} color={TAUPE} />}
      {ARCS.map((a, i) => {
        if (!a.role || !a.at) return null;
        const q = GEO[i], ua = MOVE(clamp01((a.at - a.dep) / a.dur));
        const [wx, wy] = q.at(ua), [ax, ay] = P(wx, wy);
        const lo = k(g, a.at - 0.05, 0.5) * labelsOut;
        if (lo <= 0) return null;
        // the label sits on the outer side of the bow
        const sd = a.inner ? -1 : 1, nx = q.nx * sd, ny = q.ny * sd;          // outer side of the bow, or under it
        return (
          <React.Fragment key={a.role}>
            <div style={{ position: "absolute", left: ax - 3.5, top: ay - 3.5, width: 7, height: 7, borderRadius: 9, background: LIGHT, opacity: lo }} />
            <Label t={a.role} x={ax + nx * 22} y={ay + ny * 22} o={lo} size={19} color="#EAE0D4" alignRight={nx < -0.2} center={Math.abs(nx) <= 0.2} above={ny < 0} />
          </React.Fragment>
        );
      })}

      {/* the iris onto Málaga, pushing slowly */}
      {ik > 0 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `circle(${ir.toFixed(1)}px at ${mx.toFixed(1)}px ${my.toFixed(1)}px)` }}>
          <Img src={staticFile("img/hero-malaga.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", objectPosition: "62% 50%", transform: `scale(${push})`, transformOrigin: "55% 48%" }} />
        </div>
      )}
      {ik > 0 && ik < 1 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={mx} cy={my} r={ir} fill="none" stroke={LIGHT} strokeWidth={1.6} opacity={0.9 * (1 - ik)} />
        </svg>
      )}
      <Para g={g} lines={[["malaga-0.15", "Málaga"]]} x={136} y={150} size={124} color={INK} accent={INK} />
      <div style={{ position: "absolute", left: 142, top: 312, width: lerp(0, 150, k(g, "malaga+0.02", 0.7, MOVE)), height: 1.5, background: INK, opacity: 0.8 }} />
      <Caps t="36.72° N  ·  4.42° W" x={142} y={330} o={0.85 * k(g, "malaga+0.15", 0.5)} color={INK} size={19} />
    </div>
  );
};

/** Small caps on the map (the kit's Caps, anchored to a point on either side). */
const Label: React.FC<{ t: string; x: number; y: number; o: number; size: number; color: string; alignRight?: boolean; center?: boolean; above?: boolean }> = ({ t, x, y, o, size, color, alignRight, center, above }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, whiteSpace: "nowrap", fontFamily: SANS, fontSize: size, fontWeight: 500, letterSpacing: "0.32em", color, opacity: o,
      transform: `translate(${alignRight ? "-100%" : center ? "-50%" : "0"}, ${above ? "-100%" : "0"}) translateY(${(1 - o) * 8}px)` }}>{t}</div>
  );
