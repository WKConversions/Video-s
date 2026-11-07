// B3 helpers: camera chains, projection, lift-outs, cursor, spinner, italic font. Shot coordinates = screenshot px (2559 x 1350).
import React from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { C, CX, CY, Cursor, SHADOW, SW, c01, k, mix, OUT, SOFT, sp } from "../kit";

// ------------------------------------------------------------------ italic (the offer's "Prepared by" line)
export const ITA = "InterIt";
const hi = typeof window !== "undefined" ? delayRender("b3-italic") : null;
if (typeof window !== "undefined") {
  const f = new FontFace(ITA, `url(${staticFile("fonts/inter-italic.woff2")})`, { weight: "100 900", style: "italic" });
  f.load().then((ff) => { document.fonts.add(ff); if (hi !== null) continueRender(hi); }).catch(() => { if (hi !== null) continueRender(hi); });
}

// ------------------------------------------------------------------ camera chains
export type CamK = [number, number, number, number]; // t, x, y, s
export type CamV = { x: number; y: number; s: number };
/** C1-continuous camera through keys (Hermite, Catmull-Rom tangents, zero velocity at both ends) */
export const camAt = (keys: CamK[], t: number): CamV => {
  const n = keys.length;
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], s: keys[0][3] };
  if (t >= keys[n - 1][0]) return { x: keys[n - 1][1], y: keys[n - 1][2], s: keys[n - 1][3] };
  let i = 0; while (t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1], h = b[0] - a[0], u = (t - a[0]) / h;
  const tan = (j: number, d: number) => {
    if (j <= 0 || j >= n - 1) return 0;
    return (keys[j + 1][d] - keys[j - 1][d]) / (keys[j + 1][0] - keys[j - 1][0]);
  };
  const out = [0, 0, 0];
  for (let d = 1; d <= 3; d++) {
    const p0 = a[d], p1 = b[d], m0 = tan(i, d) * h, m1 = tan(i + 1, d) * h;
    const u2 = u * u, u3 = u2 * u;
    out[d - 1] = (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1;
  }
  return { x: out[0], y: out[1], s: out[2] };
};
/** frame position of a screen point under a camera */
export const proj = (c: CamV, x: number, y: number) => ({ x: CX + (x - c.x) * c.s, y: CY + (y - c.y) * c.s });

// ------------------------------------------------------------------ a layer: one screen drawn under its own camera
export const Layer: React.FC<{ cam: CamV; op: number; children: React.ReactNode }> = ({ cam, op, children }) => (
  op <= 0.001 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: op }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 6000, transformOrigin: "0 0", transform: `translate(${CX - cam.x * cam.s}px, ${CY - cam.y * cam.s}px) scale(${cam.s})` }}>{children}</div>
    </div>
  )
);
/** opacity of a dissolve a -> a + d */
export const dis = (t: number, a: number, d = 0.3) => k(t, a, d, SOFT);

// ------------------------------------------------------------------ lift-out of a region of a composed page
export type Rect = { x: number; y: number; w: number; h: number };
/** p 0..1: the region (same pixels as the stage) grows from where it sits to scale ts, centred on (tx, ty) in the frame */
export const Lift: React.FC<{ cam: CamV; rect: Rect; p: number; ts: number; tx?: number; ty?: number; r?: number; children: React.ReactNode }> = ({ cam, rect, p, ts, tx = CX, ty = CY, r = 14, children }) => {
  if (p <= 0.001) return null;
  const f0 = proj(cam, rect.x, rect.y);
  const tl = { x: tx - (rect.w * ts) / 2, y: ty - (rect.h * ts) / 2 };
  const s = mix(cam.s, ts, p), left = mix(f0.x, tl.x, p), top = mix(f0.y, tl.y, p);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: rect.w, height: rect.h, transformOrigin: "0 0", transform: `translate(${left}px, ${top}px) scale(${s})`, zIndex: 20 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: SHADOW, opacity: Math.min(1, p * 1.4) }} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: r, background: C.card }}>
        <div style={{ position: "absolute", left: -rect.x, top: -rect.y, width: SW, height: 4000 }}>{children}</div>
      </div>
    </div>
  );
};
/** a lift curve: up at a (spring), down at b (soft) */
export const liftP = (t: number, a: number, b: number, down = 0.38) => (t < b ? Math.min(1, sp(t, a, 1.5, 0.82)) : 1 - k(t, b, down, SOFT) * 1) * (t >= a ? 1 : 0);
export const Veil: React.FC<{ p: number }> = ({ p }) => (p <= 0.001 ? null : <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `rgba(5,15,25,${0.16 * p})`, zIndex: 10 }} />);

// ------------------------------------------------------------------ spinner (replaces the photo's frozen arc so it turns)
export const Spin: React.FC<{ x: number; y: number; t: number; r?: number }> = ({ x, y, t, r = 11 }) => (
  <div style={{ position: "absolute", left: x - r - 2, top: y - r - 2, width: 2 * r + 4, height: 2 * r + 4, background: C.card, borderRadius: r + 2 }}>
    <svg width={2 * r + 4} height={2 * r + 4} viewBox="-13 -13 26 26" style={{ transform: `rotate(${t * 520}deg)` }}>
      <circle r={10} fill="none" stroke="#dbe6f7" strokeWidth={2.4} />
      <path d="M0 -10 A10 10 0 0 1 10 0" fill="none" stroke="#2f7de1" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  </div>
);

// ------------------------------------------------------------------ cursor track
export type Way = { t: number; x: number; y: number; cam: (t: number) => CamV; dur?: number; press?: number };
/** cursor that travels waypoint to waypoint; a target follows its camera, so it stays on the button while the camera moves */
export const cursorAt = (start: { t: number; x: number; y: number }, ways: Way[], t: number) => {
  let px = start.x, py = start.y, pt = start.t;
  let prev: Way | null = null;
  for (const wp of ways) {
    const d = wp.dur ?? 0.45, a = wp.t - d;
    const here = (tt: number) => (prev ? proj(prev.cam(tt), prev.x, prev.y) : { x: px, y: py });
    if (t < a) { const h = here(t); return { x: h.x, y: h.y, press: 0 }; }
    if (t < wp.t) {
      const u = OUT(c01((t - a) / d)); const f = here(t), g = proj(wp.cam(t), wp.x, wp.y);
      return { x: mix(f.x, g.x, u), y: mix(f.y, g.y, u), press: 0 };
    }
    const g = proj(wp.cam(t), wp.x, wp.y);
    const pr = wp.press !== undefined ? c01((t - wp.press) / 0.3) : 0;
    prev = wp; px = g.x; py = g.y; pt = wp.t;
    const nextStart = ways[ways.indexOf(wp) + 1];
    if (!nextStart || t < nextStart.t - (nextStart.dur ?? 0.45)) return { x: g.x, y: g.y, press: pr };
  }
  void pt;
  const L = ways[ways.length - 1]; const g = proj(L.cam(t), L.x, L.y);
  return { x: g.x, y: g.y, press: L.press !== undefined ? c01((t - L.press) / 0.3) : 0 };
};
export const Ptr: React.FC<{ x: number; y: number; press: number; op?: number }> = ({ x, y, press, op = 1 }) => (
  <div style={{ opacity: op }}><Cursor x={x - 3} y={y - 2} press={press} /></div>
);
export { k, sp, c01, mix };
