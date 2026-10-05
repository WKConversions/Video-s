// Drawing the bright isometric world: extruded blocks with a white top, two tinted sides and a soft ground shadow;
// ground lines and rings; routes. Everything is a pure function of the view and the block's state at the frame.
import React from "react";
import { C, lerp, mix, rgba } from "./lib";
import { View, proj, pts } from "./iso";

export type Tint = "blue" | "sage" | "sand" | "grey" | "ink" | "ai";
const FACES: Record<Tint, [string, string, string]> = {          // top, right side, front side
  blue: ["#F4F7FC", C.sideBlue[0], C.sideBlue[1]],
  sage: ["#F4F8F4", C.sideSage[0], C.sideSage[1]],
  sand: ["#FAF7F1", C.sideSand[0], C.sideSand[1]],
  grey: ["#FFFFFF", "#E6E6EB", "#D9D9E0"],
  ink: ["#2A2A30", "#141418", "#0A0A0D"],
  ai: ["#3C86D6", "#1F6CC0", "#155AA6"],
};
export const faces = (t: Tint) => FACES[t];

export type BoxState = { h: number; tint: Tint; to?: Tint; k?: number; o?: number; edge?: number; topFill?: string; lift?: number };
/** One block: x0..x1, y0..y1 on the ground, height h; `to`/`k` blends its colours to another tint (a district lighting up);
 *  `edge` draws the AI-blue outline on its top (selected); `lift` floats it above the ground (a hover). */
export const Box: React.FC<{ v: View; x0: number; y0: number; x1: number; y1: number; s: BoxState; shadow?: boolean; children?: React.ReactNode }> = ({ v, x0, y0, x1, y1, s, shadow = true, children }) => {
  const o = s.o ?? 1;
  if (o <= 0.001) return null;
  const z0 = s.lift ?? 0, h = Math.max(0.5, s.h);
  const P = (x: number, y: number, z: number) => proj(v, x, y, z + z0);
  const a = FACES[s.tint], b = FACES[s.to ?? s.tint], k = s.k ?? 0;
  const col = (i: number) => (k > 0 ? mix(a[i], b[i], k) : a[i]);
  const top: [number, number][] = [P(x0, y0, h), P(x1, y0, h), P(x1, y1, h), P(x0, y1, h)];
  const right: [number, number][] = [P(x1, y0, 0), P(x1, y1, 0), P(x1, y1, h), P(x1, y0, h)];
  const front: [number, number][] = [P(x0, y1, 0), P(x1, y1, 0), P(x1, y1, h), P(x0, y1, h)];
  // the shadow falls toward the viewer's lower right, longer for taller blocks and for a lifted block
  const L = (h + z0) * 0.55 + 10;
  const sh: [number, number][] = [proj(v, x0 + 6, y1, 0), proj(v, x1, y1, 0), proj(v, x1, y0 + 6, 0), proj(v, x1 + L, y0 + 6 + L * 0.35, 0), proj(v, x1 + L, y1 + L * 0.35, 0), proj(v, x0 + 6 + L, y1 + L * 0.35, 0)];
  const edge = s.edge ?? 0;
  return (
    <g opacity={o}>
      {shadow && <polygon points={pts(sh)} fill={rgba("#17171B", 0.075 * Math.min(1, h / 30 + 0.3) / (1 + z0 / 80))} filter="url(#soft)" />}
      <polygon points={pts(front)} fill={col(2)} />
      <polygon points={pts(right)} fill={col(1)} />
      <polygon points={pts(top)} fill={s.topFill ?? col(0)} stroke={s.tint === "ink" ? "#3A3A42" : s.tint === "grey" ? "#E2E2E8" : "#FFFFFF"} strokeWidth={1.4} strokeLinejoin="round" />
      {edge > 0 && <polygon points={pts(top)} fill="none" stroke={C.blue} strokeWidth={3} strokeLinejoin="round" opacity={edge} />}
      {children}
    </g>
  );
};

/** The defs every world SVG needs (the soft shadow blur). */
export const WorldDefs: React.FC = () => (
  <defs>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
  </defs>
);

/** An ellipse on the ground (a ring, a scan): radius r in world units around (x, y). */
export const groundRing = (v: View, x: number, y: number, r: number, n = 72): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = (i / n) * Math.PI * 2; return proj(v, x + Math.cos(a) * r, y + Math.sin(a) * r, 0); });

export const poly = (p: [number, number][]) => pts(p);
export { lerp };
