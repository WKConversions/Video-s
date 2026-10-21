// The TNOA film's kit (version 2: ~12 shots in 20 s, four builders). TNOA's brand from thenetworkofagents.com:
// navy #0B1220, blue #2563EB, sky #1DA1F2, soft background #F4F7FB, hairline #E2E8F1, green #34D399 (done),
// amber #FBBF24 (human review); the site sets the system sans, DM Sans stands in for it. Everything here is pure
// functions of t (seconds, global film time, fractional at 60 fps).
import React from "react";
import "./lib";   // loads DM Sans

export const B = { navy: "#0B1220", text: "#1A2233", muted: "#5A6678", light: "#AAB4C4", blue: "#2563EB", sky: "#1DA1F2", bg: "#F4F7FB", white: "#FFFFFF", line: "#E2E8F1", green: "#34D399", greenInk: "#047857", amber: "#FBBF24", amberInk: "#92400E" };
export const SANS = "DM Sans";
export const MONO = "monospace";
export const SHADOW = "0 2px 6px rgba(11,18,32,0.06), 0 40px 100px -40px rgba(11,18,32,0.38)";

export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
// cubic ease-out over [0, 1] (arrivals) and in-out (carries)
export const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const inout = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
// a damped spring from 0 to 1 starting at t0 (s). response = period (s); damping 1 = critically damped (big carries),
// 0.55-0.7 = Apple bouncy (pops, landings, snaps): it passes 1 and settles back.
export const spring = (t: number, t0: number, response = 0.45, damping = 0.62) => {
  const x = t - t0; if (x <= 0) return 0;
  const w = (2 * Math.PI) / response, z = damping;
  if (z >= 1) return 1 - Math.exp(-w * x) * (1 + w * x);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + ((z * w) / wd) * Math.sin(wd * x));
};
export const bounce = (t: number, t0: number, response = 0.5) => spring(t, t0, response, 0.6);

// Glass: Apple's frosted glass panel (CSS backdrop blur; no SVG filters, they render in seams). Put it over moving
// content so the blur shows. Position it with a transform from left/top 0.
export const Glass: React.FC<{ w: number; h: number; r?: number; transform?: string; children?: React.ReactNode; tint?: string }> = ({ w, h, r = 36, transform = "", children, tint = "rgba(255,255,255,0.55)" }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, transform, overflow: "hidden", background: tint,
    backdropFilter: "blur(18px) saturate(140%)", WebkitBackdropFilter: "blur(18px) saturate(140%)",
    boxShadow: "inset 0 1.5px 1px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.45), 0 30px 70px -30px rgba(11,18,32,0.35)", fontFamily: SANS }}>
    {children}
  </div>
);

// Island: a Dynamic-Island navy capsule. p 0..1(+) opens it from a 180 x 54 pill to w x h (pass a bounce); placed
// by its centre (cx, cy) with transforms only (no per-frame box geometry, so it glides).
export const Island: React.FC<{ cx: number; cy: number; w: number; h: number; p: number; children?: React.ReactNode }> = ({ cx, cy, w, h, p, children }) => {
  const W = mix(180, w, p), H = mix(54, h, p);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${cx - w / 2}px, ${cy - h / 2}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: B.navy, clipPath: `inset(${(h - H) / 2}px ${(w - W) / 2}px round ${H / 2}px)`, boxShadow: "0 20px 50px -20px rgba(11,18,32,0.6)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontFamily: SANS, fontWeight: 600, fontSize: Math.round(h * 0.34), opacity: clamp((p - 0.55) * 3) }}>{children}</div>
    </div>
  );
};

// BounceWords: a headline whose letters spring up one after another (Apple's bouncy build). Centred on cx.
export const BounceWords: React.FC<{ t: number; at: number; text: string; cx: number; y: number; size: number; color?: string; accentFrom?: number; accent?: string; stagger?: number; weight?: number }> = ({ t, at, text, cx, y, size, color = B.navy, accentFrom = 9999, accent = B.blue, stagger = 0.025, weight = 700 }) => (
  <div style={{ position: "absolute", left: cx - 1600, top: y, width: 3200, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.035em", whiteSpace: "pre", lineHeight: 1.05 }}>
    {text.split("").map((ch, i) => { const p = bounce(t, at + i * stagger, 0.5); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * size * 0.7}px) scale(${0.55 + 0.45 * p})`, opacity: clamp(p * 2), color: i >= accentFrom ? accent : color }}>{ch}</span>; })}
  </div>
);

// ---- Hand-offs between the four builders. Each is drawn IDENTICALLY by both neighbours during its window
// [boundary - 0.25 s, boundary + 0.25 s]: the outgoing builder morphs INTO it by boundary - 0.25 s, the incoming one
// morphs OUT of it from boundary + 0.25 s. Each keeps moving inside its window, so the cut point is never still.

// H1 (t = 5.0 s): the white app card, 1200 x 680, centred, turning gently in 3D.
export const H1 = 5.0;
export const H1Card: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 680, borderRadius: 40, background: B.white, boxShadow: SHADOW,
    transform: `perspective(1800px) rotateY(${Math.sin((t - H1) * 2.4) * 5}deg) rotateX(${Math.cos((t - H1) * 2) * 3}deg) translateY(${Math.sin((t - H1) * 3) * 10}px)` }} />
);
// H2 (t = 10.0 s): the whole frame is TNOA blue, with a soft light sweeping across it.
export const H2 = 10.0;
export const H2Blue: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: B.blue }}>
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 900, left: mix(-900, 1920, clamp((t - (H2 - 0.6)) / 1.2)), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />
  </div>
);
// H3 (t = 15.0 s): a navy Dynamic-Island capsule, 640 x 120, at the centre, breathing.
export const H3 = 15.0;
export const H3Capsule: React.FC<{ t: number }> = ({ t }) => (
  <Island cx={960} cy={540 + Math.sin((t - H3) * 4) * 8} w={640} h={120} p={1 + Math.sin((t - H3) * 6) * 0.03} />
);
