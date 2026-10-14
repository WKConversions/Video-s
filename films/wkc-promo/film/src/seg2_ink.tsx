// Segment 2 helpers: ink-box text metrics from the browser's own font rasteriser (so text can be placed by its ink edge,
// baseline or centre exactly like the reference measurements), table lookups and small drawing pieces.
import React from "react";
import { F, clamp01, lerp } from "./lib";

export type Ink = { l: number; r: number; asc: number; desc: number; w: number };
let ctx: CanvasRenderingContext2D | null = null;
const cache = new Map<string, Ink>();

/** ink metrics of a string set in family/weight/size with tracking (px). l: ink left = origin - l; r: ink right = origin + r. */
export const ink = (text: string, weight: number, size: number, family: string = F.head, track = 0): Ink => {
  const key = `${text}|${weight}|${size}|${family}|${track}`;
  const hit = cache.get(key);
  if (hit) return hit;
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  const c = ctx as CanvasRenderingContext2D;
  c.font = `${weight} ${size}px "${family}"`;
  (c as unknown as { letterSpacing: string }).letterSpacing = `${track}px`;
  const m = c.measureText(text);
  const v = { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, asc: m.actualBoundingBoxAscent, desc: m.actualBoundingBoxDescent, w: m.width };
  cache.set(key, v);
  return v;
};

/** origin x of every character of text (kerning kept), relative to the string origin */
export const charX = (text: string, weight: number, size: number, family: string = F.head, track = 0) => {
  const xs: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const pre = ink(text.slice(0, i + 1), weight, size, family).w;
    const own = ink(text[i], weight, size, family).w;
    xs.push(pre - own + i * track);
  }
  return xs;
};

/** value of a per-frame table that starts at frame a (clamped at both ends) */
export const at = (arr: number[], a: number, g: number) => arr[Math.max(0, Math.min(arr.length - 1, Math.round(g - a)))];

/** piecewise-linear keyframes with an optional ease between keys */
export const kf = (g: number, k: [number, number][], ease: (t: number) => number = (t) => t) => {
  if (g <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (g <= k[i][0]) return lerp(k[i - 1][1], k[i][1], ease(clamp01((g - k[i - 1][0]) / (k[i][0] - k[i - 1][0]))));
  return k[k.length - 1][1];
};

/** WKC "keyframe pinwheel": four rounded keyframe diamonds in a 2×2 pinwheel, size px across, centred on (0, 0) */
export const Pinwheel: React.FC<{ size: number; glow?: boolean }> = ({ size, glow = true }) => {
  const s = size / 2;
  const cols = ["#3F8CE8", "#7FD3FF", "#1266C9", "#E6F0FD"];
  // each diamond sits in one quadrant, rotated a little so the four read as a pinwheel
  const quads: [number, number, number][] = [[-1, -1, 0], [1, -1, 90], [1, 1, 180], [-1, 1, 270]];
  const d = s * 0.5;
  return (
    <g style={glow ? { filter: "drop-shadow(0 0 6px rgba(63,140,232,0.75))" } : undefined}>
      {quads.map(([qx, qy, r], i) => (
        <g key={i} transform={`translate(${qx * s * 0.47} ${qy * s * 0.47}) rotate(${r + 12})`}>
          <rect x={-d * 0.72} y={-d * 0.72} width={d * 1.44} height={d * 1.44} rx={d * 0.32} transform="rotate(45)" fill={cols[i]} />
        </g>
      ))}
    </g>
  );
};

/** a four-point concave sparkle (astroid), unit radius 1, centred on 0,0 */
export const SPARK = "M0,-1 Q0.3,-0.3 1,0 Q0.3,0.3 0,1 Q-0.3,0.3 -1,0 Q-0.3,-0.3 0,-1 Z";
