// B3 helpers: camera chains, projection, lift-outs, cursor, spinner, italic font. Shot coordinates = screenshot px (2559 x 1350).
import React from "react";
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { C, CX, CY, Cursor, INOUT, SHADOW, SW, c01, k, mix, SOFT, sp } from "../kit";

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
export const Lift: React.FC<{ cam: CamV; rect: Rect; p: number; ts: number; bre?: number; tx?: number; ty?: number; r?: number; children: React.ReactNode }> = ({ cam, rect, p, ts: ts0, bre = 0, tx = CX, ty = CY, r = 14, children }) => {
  const ts = ts0 * (1 + 0.018 * bre);
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
/** a calm lift: rises 0.55 s with no overshoot at a, holds (a slow breath), settles back 0.4 s from b. Returns p (0..1) and the breath (0..1) */
export const LIFTE = Easing.bezier(0.3, 0.7, 0.25, 1);
export const liftP = (t: number, a: number, b: number) => (t < a ? 0 : k(t, a, 0.55, LIFTE) * (1 - k(t, b, 0.4, SOFT)));
export const breath = (t: number, a: number, b: number) => c01((t - a - 0.55) / Math.max(0.1, b - a - 0.55)) * (t < b ? 1 : 1 - k(t, b, 0.4, SOFT));
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
/** a click: glide a -> b (INOUT) to screen point (x, y), rest, press at tp (0.12 s squeeze, 0.2 s release) */
export type Mv = { a: number; b: number; x: number; y: number; tp: number };
const warp = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u < 0.375 ? (0.5 * u) / 0.375 : 0.5 + (0.5 * (u - 0.375)) / 0.625);
/** hover 0..1 (the target reacts as the cursor arrives) and pressed 0..1 for move m */
export const hovP = (t: number, m: Mv) => k(t, m.b - 0.04, 0.16, SOFT);
export const prsP = (t: number, m: Mv) => (t < m.tp ? 0 : t < m.tp + 0.12 ? c01((t - m.tp) / 0.12) : 1 - 0.7 * c01((t - m.tp - 0.12) / 0.2));
export const cursorPos = (start: { x: number; y: number }, mvs: Mv[], t: number, cam: (t: number) => CamV) => {
  let cur = -1; for (let i = 0; i < mvs.length; i++) if (t >= mvs[i].a) cur = i;
  if (cur < 0) return { x: start.x, y: start.y, press: 0 };
  const m = mvs[cur];
  const g = proj(cam(t), m.x, m.y);
  const from = cur > 0 ? proj(cam(t), mvs[cur - 1].x, mvs[cur - 1].y) : start;
  const u = INOUT(c01((t - m.a) / (m.b - m.a)));
  return { x: mix(from.x, g.x, u), y: mix(from.y, g.y, u), press: warp(c01((t - m.tp) / 0.32)) };
};
/** a hover / press tint over a nav pill or a button (screen px). kind "pill": a soft dark tint; "btn": a light tint on a black button */
export const Tint: React.FC<{ x: number; y: number; w: number; h: number; hov: number; prs: number; kind?: "pill" | "btn" }> = ({ x, y, w: tw, h: th, hov, prs, kind = "pill" }) => {
  if (hov <= 0.001) return null;
  const bg = kind === "pill" ? `rgba(5,15,25,${0.075 * hov + 0.07 * prs})` : `rgba(255,255,255,${0.2 * hov * (1 - 0.8 * prs)})`;
  return <div style={{ position: "absolute", left: x, top: y, width: tw, height: th, borderRadius: Math.min(tw, th) / 2, background: bg }} />;
};
export const Ptr: React.FC<{ x: number; y: number; press: number; op?: number }> = ({ x, y, press, op = 1 }) => (
  <div style={{ opacity: op }}><Cursor x={x - 3} y={y - 2} press={press} /></div>
);
export { k, sp, c01, mix };
