// K.B intern films: the shared kit. Brand from the 2026 K.B brand kit (kb-consultancy-brand-kit site CSS):
// navy #172B44, deep #0D1C2D, light blue #99CDFC, strong blue #6FAEF1, ice #EAF5FF, page #F5F8FB, muted #66768A,
// Manrope. Flat 2D, rounded cards, white space. Motion: one signature ease-out (no overshoot, ever), one in-out for
// moves of things already on screen; entrances rise 28 px + fade + scale from 0.96; exits fade and sink.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, Img, staticFile, Easing } from "remotion";

export const FPS = 60;
export const C = {
  navy: "#172B44", deep: "#0D1C2D", blue: "#99CDFC", blueS: "#6FAEF1", ice: "#EAF5FF", ice2: "#DCEEFF",
  page: "#F5F8FB", white: "#FFFFFF", muted: "#66768A", line: "rgba(23,43,68,0.14)", lineSoft: "rgba(23,43,68,0.08)",
  green: "#75EFA6", greenInk: "#1F9D5C",
};
export const F = "Manrope, Arial, sans-serif";
export const SHADOW = "0 18px 50px -18px rgba(23,43,68,0.22), 0 2px 6px rgba(23,43,68,0.05)";
export const SHADOW_S = "0 8px 24px -10px rgba(23,43,68,0.22)";

// ------------------------------------------------------------------ motion
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);      // the signature curve: entrances, landings
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);   // moves of things already on screen
export const IN = Easing.bezier(0.5, 0, 0.75, 0);       // exits
export const c01 = (x: number) => Math.min(1, Math.max(0, x));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
/** progress 0..1 of a move that starts at t0 and lasts dur, eased */
export const k = (t: number, t0: number, dur: number, ease: (x: number) => number = OUT) => ease(c01((t - t0) / dur));
/** entrance style: rise + fade + scale, p = 0..1 */
export const enter = (p: number, rise = 28): React.CSSProperties => ({ opacity: p, transform: `translateY(${((1 - p) * rise).toFixed(2)}px) scale(${(0.96 + 0.04 * p).toFixed(4)})` });
/** in at tIn (dur din), out at tOut (dur dout): combined style */
export const inOut = (t: number, tIn: number, tOut: number, din = 0.6, dout = 0.4, rise = 28): React.CSSProperties => {
  const a = k(t, tIn, din), b = k(t, tOut, dout, IN);
  return { opacity: a * (1 - b), transform: `translateY(${((1 - a) * rise + b * 14).toFixed(2)}px) scale(${(0.96 + 0.04 * a - 0.03 * b).toFixed(4)})` };
};
/** a slow continuous drift so no frame is ever still: returns px (or deg) */
export const breathe = (t: number, amp = 6, period = 7) => Math.sin((t / period) * Math.PI * 2) * amp;

// ------------------------------------------------------------------ font
let fontReady = false;
export const useFont = () => {
  const [ok, setOk] = useState(fontReady);
  const [h] = useState<number | null>(() => (fontReady ? null : delayRender("font")));
  useEffect(() => {
    if (fontReady) { setOk(true); return; }
    const face = new FontFace("Manrope", `url(${staticFile("fonts/manrope-var.ttf")})`, { weight: "200 800" });
    face.load().then((f) => { document.fonts.add(f); return Promise.all([500, 600, 700, 800].map((wt) => document.fonts.load(`${wt} 40px Manrope`))); })
      .then(() => { fontReady = true; setOk(true); });
  }, []);
  useEffect(() => { if (ok && h !== null) continueRender(h); }, [ok, h]);
  return ok;
};

// ------------------------------------------------------------------ layout helpers
type P = React.CSSProperties;
export const abs = (x: number, y: number, w?: number, h?: number, s: P = {}): P => ({ position: "absolute", left: x, top: y, width: w, height: h, ...s });
/** centred at (cx, cy) */
export const at = (cx: number, cy: number, s: P = {}): P => ({ position: "absolute", left: cx, top: cy, transform: "translate(-50%, -50%)", ...s });

// ------------------------------------------------------------------ building blocks
/** the calm still page every scene sits on */
export const Page: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 50% 40%, #FFFFFF 0%, ${C.page} 55%, #EDF2F7 100%)` }} />
);
/** a white rounded card */
export const Card: React.FC<{ w: number; h?: number; r?: number; pad?: number; dark?: boolean; style?: P; children?: React.ReactNode }> = ({ w, h, r = 28, pad = 32, dark, style, children }) => (
  <div style={{ width: w, height: h, borderRadius: r, padding: pad, boxSizing: "border-box", background: dark ? C.navy : C.white, color: dark ? C.white : C.navy,
    boxShadow: SHADOW, border: dark ? "none" : `1px solid ${C.lineSoft}`, fontFamily: F, ...style }}>{children}</div>
);
/** a neutral tool chip: "Tool: what it is for" as text, never a logo */
export const Chip: React.FC<{ name: string; rest?: string; size?: number; style?: P; children?: React.ReactNode }> = ({ name, rest, size = 34, style, children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.5}px ${size * 0.75}px`, borderRadius: 999, background: C.white,
    border: `1.5px solid ${C.line}`, boxShadow: SHADOW_S, fontFamily: F, fontSize: size, color: C.navy, whiteSpace: "nowrap", ...style }}>
    <span><b style={{ fontWeight: 800 }}>{name}</b>{rest !== undefined && <span style={{ fontWeight: 500 }}>{rest}</span>}</span>{children}
  </div>
);
/** a placeholder avatar: head and shoulders in a circle, no face */
export const Avatar: React.FC<{ size: number; tone?: "blue" | "navy" | "ice"; style?: P }> = ({ size, tone = "blue", style }) => {
  const bg = tone === "navy" ? C.navy : tone === "ice" ? C.ice2 : C.ice;
  const fg = tone === "navy" ? C.blue : C.blueS;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", ...style }}>
      <defs><clipPath id={`av${tone}`}><circle cx={50} cy={50} r={50} /></clipPath></defs>
      <circle cx={50} cy={50} r={50} fill={bg} />
      <g clipPath={`url(#av${tone})`} fill={fg}><circle cx={50} cy={39} r={17} /><ellipse cx={50} cy={92} rx={33} ry={27} /></g>
    </svg>
  );
};
/** a check: the circle fills (p 0..0.45), then the tick draws (0.45..1) */
export const Check: React.FC<{ size: number; p: number; color?: string; style?: P }> = ({ size, p, color = C.blueS, style }) => {
  const fill = c01(p / 0.45), tick = c01((p - 0.45) / 0.55);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", ...style }}>
      <circle cx={50} cy={50} r={46} fill="none" stroke={C.line} strokeWidth={6} />
      <circle cx={50} cy={50} r={46 * fill} fill={color} />
      <path d="M29 52 L44 66 L72 36" fill="none" stroke={C.white} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
    </svg>
  );
};
/** a padlock; open 0..1 lifts and swings the shackle */
export const Padlock: React.FC<{ size: number; open?: number; body?: string; style?: P }> = ({ size, open = 0, body = C.navy, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ display: "block", overflow: "visible", ...style }}>
    <g transform={`translate(0 ${-14 * open}) rotate(${-28 * c01((open - 0.35) / 0.65)} 76 52)`}>
      <path d="M26 54 V36 a24 24 0 0 1 48 0 V54" fill="none" stroke={body} strokeWidth={11} strokeLinecap="round" />
    </g>
    <rect x={12} y={50} width={76} height={62} rx={16} fill={body} />
    <circle cx={50} cy={76} r={7} fill={C.blue} /><rect x={46.5} y={78} width={7} height={16} rx={3.5} fill={C.blue} />
  </svg>
);
/** a small shield badge with text (e.g. "2FA") */
export const Shield: React.FC<{ size: number; text: string; style?: P }> = ({ size, text, style }) => (
  <div style={{ position: "relative", width: size, height: size * 1.15, ...style }}>
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{ position: "absolute", inset: 0 }}>
      <path d="M50 4 L92 18 V54 C92 82 74 100 50 111 C26 100 8 82 8 54 V18 Z" fill={C.navy} />
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: size * 0.08,
      fontFamily: F, fontWeight: 800, fontSize: size * 0.3, color: C.blue, letterSpacing: "-0.02em" }}>{text}</div>
  </div>
);
/** a headline line in the brand's display style */
export const Title: React.FC<{ size?: number; color?: string; weight?: number; style?: P; children: React.ReactNode }> = ({ size = 72, color = C.navy, weight = 800, style, children }) => (
  <div style={{ fontFamily: F, fontWeight: weight, fontSize: size, color, letterSpacing: "-0.04em", lineHeight: 1.05, whiteSpace: "nowrap", ...style }}>{children}</div>
);
/** a soft ring that pulses out from a point (attention, a landing) */
export const Ring: React.FC<{ x: number; y: number; p: number; r?: number; color?: string }> = ({ x, y, p, r = 70, color = C.blueS }) =>
  p <= 0 || p >= 1 ? null : <div style={{ position: "absolute", left: x - r * p, top: y - r * p, width: 2 * r * p, height: 2 * r * p, borderRadius: "50%", border: `3px solid ${color}`, opacity: 1 - p }} />;

// ------------------------------------------------------------------ the logo, on its own layer
// One file (public/brand/logo.png) and one layer: replace the file, or render the film with layer "noLogo" and lay a
// new logo over it using the "logoOnly" render (transparent). Scenes never draw the logo themselves; each film gives
// a logo track: keyframes of position (centre), size and opacity.
export type LogoKey = { t: number; x: number; y: number; size: number; o: number };
export const logoAt = (track: LogoKey[], t: number): LogoKey => {
  if (t <= track[0].t) return track[0];
  for (let i = 1; i < track.length; i++) {
    if (t <= track[i].t) {
      const a = track[i - 1], b = track[i], p = OUT(c01((t - a.t) / Math.max(1e-6, b.t - a.t)));
      return { t, x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), size: mix(a.size, b.size, p), o: mix(a.o, b.o, p) };
    }
  }
  return track[track.length - 1];
};
export const LogoLayer: React.FC<{ track: LogoKey[]; t: number }> = ({ track, t }) => {
  const L = logoAt(track, t);
  if (L.o <= 0.001) return null;
  return (
    <Img src={staticFile("brand/logo.png")} style={{ position: "absolute", left: L.x - L.size / 2, top: L.y - L.size / 2, width: L.size, height: L.size,
      borderRadius: L.size * 0.2, opacity: L.o, boxShadow: `0 ${L.size * 0.12}px ${L.size * 0.3}px -${L.size * 0.1}px rgba(23,43,68,${(0.35 * L.o).toFixed(3)})` }} />
  );
};
export type Layer = "all" | "noLogo" | "logoOnly";
