// Realism kit: the generic pieces for pinning a UI on a real screen (tracked footage or a 3D plate).
// Copy into the film's src/ and import from it. Quads are TL, TR, BR, BL of the upright UI, in the parent's pixels.
import React from "react";
import { Easing } from "remotion";

export const FPS = 60;
export type Pt = [number, number];
export type Quad = [Pt, Pt, Pt, Pt];
export const OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const ramp = (t: number, a: number, d: number, e: (x: number) => number = OUT) => e(clamp01((t - a) / d));

/** CSS matrix3d that maps a w×h box (origin 0 0) onto the quad (a projective transform, Heckbert). */
export const quadMatrix = (w: number, h: number, q: Quad): string => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  let g = 0, hh = 0;
  if (Math.abs(sx) > 1e-9 || Math.abs(sy) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (sx * dy2 - dx2 * sy) / den;
    hh = (dx1 * sy - sx * dy1) / den;
  }
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  const A = a / w, B = b / h, D = d / w, E = e / h, G = g / w, H = hh / h;
  return `matrix3d(${A},${D},0,${G},${B},${E},0,${H},0,0,1,0,${c},${f},0,1)`;
};

/** Pins a w×h UI onto a screen quad given in the parent's pixel space. */
export const OnQuad: React.FC<{ w: number; h: number; q: Quad; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, q, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0 0", transform: quadMatrix(w, h, q), overflow: "hidden", ...style }}>
    {children}
  </div>
);

/** The low-key grade, screen spill, glass sheen and vignette of the reference look, around a pinned UI. */
export const lowKey = { filter: "brightness(0.62) contrast(1.18) saturate(0.78)" };
export const spill = (cx: number, cy: number, glow: number, rgb = "168,196,187") =>
  `radial-gradient(ellipse 820px 560px at ${cx}px ${cy}px, rgba(${rgb},${0.55 * glow}) 0%, rgba(${rgb},${0.22 * glow}) 40%, rgba(0,0,0,0) 72%)`;
