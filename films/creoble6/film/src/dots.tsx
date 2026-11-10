// Creoble's new logo (Willads, Nov 2026): six dots forming a C, largest at the top right, getting smaller counter-
// clockwise; the app icon is a sage rounded square with the dots in white. Vectorised from his files: the dot centres
// lie exactly on one circle (centre 53.89 / 51.08, radius 28.31 in a 100-unit box). The dots are the film's recurring
// element: the loading spinner while the site generates (scene 3), small spinners for "setting up" states, and at the
// end they fly in and assemble into the C before the wordmark appears (scene 9). Calm: no bounce, no overshoot.
import React from "react";
import { C, OUT, INOUT, clamp01, mix } from "./lib";

export const LOGO = [
  { x: 60.31, y: 23.5, r: 11.19 }, { x: 34.0, y: 30.94, r: 9.94 }, { x: 25.81, y: 54.69, r: 8.75 },
  { x: 37.5, y: 74.19, r: 7.5 }, { x: 57.31, y: 79.19, r: 6.31 }, { x: 73.69, y: 71.31, r: 5.12 },
];
export const RING = { x: 53.89, y: 51.08, r: 28.31 };
export const BOX_C = { x: 47.94, y: 48.9 };   // the C's visual centre (its bounding box): centre a standalone mark on this
export const ANG = LOGO.map((d) => Math.atan2(d.y - RING.y, d.x - RING.x));   // radians, −76.9° … 45.6°
export const ICON_R = 19;    // the app icon's corner radius, % of its size

// dotsAt: the six dots for a logo of `size` px (the 100-unit box scaled), centred on (cx, cy) = the RING centre,
// turned by `spin` degrees (a spinner turns clockwise: spin grows). Returns screen-space circles.
export const dotsAt = (size: number, cx = 0, cy = 0, spin = 0) => {
  const s = size / 100, a0 = (spin * Math.PI) / 180;
  return LOGO.map((d, i) => ({ x: cx + Math.cos(ANG[i] + a0) * RING.r * s, y: cy + Math.sin(ANG[i] + a0) * RING.r * s, r: d.r * s }));
};

// Dots: draws circles (any positions, e.g. from dotsAt or a fly-in you computed) in an absolutely positioned SVG.
// Coordinates are relative to the element's origin (put it in a Plane or a positioned box).
export const Dots: React.FC<{ dots: { x: number; y: number; r: number; o?: number }[]; color?: string; style?: React.CSSProperties }> = ({ dots, color = C.sage, style }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }} width={1} height={1}>
    {dots.map((d, i) => (d.r > 0.01 ? <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} opacity={d.o ?? 1} /> : null))}
  </svg>
);

// Spinner: the logo turning as a loading indicator (constant speed, deg per second), centred on (0, 0).
// p 0..1 brings it in (each dot grows from nothing in turn, largest first) and back out when it falls.
export const Spinner: React.FC<{ g: number; size: number; speed?: number; p?: number; color?: string; style?: React.CSSProperties }> = ({ g, size, speed = 240, p = 1, color = C.sage, style }) => {
  const ds = dotsAt(size, 0, 0, (g / 30) * speed).map((d, i) => ({ ...d, r: d.r * OUT(clamp01(p * 1.6 - i * 0.12)) }));
  return <Dots dots={ds} color={color} style={style} />;
};

// assemble: dots flying in from `from` (screen-space start circles, any count ≥ 6 is fine; the first 6 are used)
// to the logo (size, cx, cy). Each dot leaves in turn (stagger s), travels on a soft arc (bend px, perpendicular to
// its path), INOUT, and lands without overshoot. t = seconds since the move began; dur = each dot's travel (s).
export const assemble = (t: number, from: { x: number; y: number; r: number }[], size: number, cx: number, cy: number, o: { dur?: number; stagger?: number; bend?: number; spin?: number } = {}) => {
  const to = dotsAt(size, cx, cy, o.spin ?? 0), dur = o.dur ?? 1.1, st = o.stagger ?? 0.07, bend = o.bend ?? 120;
  return to.map((d, i) => {
    const a = from[i] ?? from[0], q = INOUT(clamp01((t - i * st) / dur));
    const mx = (a.x + d.x) / 2, my = (a.y + d.y) / 2, dx = d.x - a.x, dy = d.y - a.y, L = Math.hypot(dx, dy) || 1;
    const bx = mx - (dy / L) * bend * (i % 2 ? -1 : 1), by = my + (dx / L) * bend * (i % 2 ? -1 : 1);
    const u = 1 - q;   // quadratic Bézier through the bend point
    return { x: u * u * a.x + 2 * u * q * bx + q * q * d.x, y: u * u * a.y + 2 * u * q * by + q * q * d.y, r: mix(a.r, d.r, q) };
  });
};

// Icon: the app icon (sage rounded square, white dots), size px, centred on (0, 0). p 0..1 grows the square
// behind the dots (scale from the dots' size), spin turns the dots.
export const Icon: React.FC<{ size: number; p?: number; spin?: number; style?: React.CSSProperties }> = ({ size, p = 1, spin = 0, style }) => {
  const q = OUT(clamp01(p));
  return (
    <div style={{ position: "absolute", left: -size / 2, top: -size / 2, width: size, height: size, ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: `${ICON_R}%`, background: C.sage, transform: `scale(${mix(0.6, 1, q)})`, opacity: q }} />
      <Dots dots={dotsAt(size, size * RING.x / 100, size * RING.y / 100, spin)} color={C.white} />
    </div>
  );
};
