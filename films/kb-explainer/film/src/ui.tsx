// The interface kit of the explainer: K.B-styled windows, a phone, cursors, pills, toggles, avatars (initials only:
// no team photos), line icons, and the background (soft blobs, small drifting shapes). Everything is drawn here, in
// K.B's palette and Montserrat; nothing is taken from the reference's screens.
import React from "react";
import { T } from "./clock";
import { track, Track } from "./kinetic";
import { C, F, SHADOW, lerp } from "./lib";

export const U = {
  body: "#F8FAFC", chrome: "#E8ECF1", dots: "#C9D1DB", skel: "#E2E8F0", skelD: "#CBD5E1", tint: "#EEF2F7", line: "#D5DCE5",
  warnInk: "#B42318", okSoft: "#DCF4EA", okInk: "#0E6B4A", link: "#AEBBCB",
};
export const STRIP = 44, BAR = 72;

/** Keys must run forward in time; a key out of order makes an object jump, so it throws while building. */
export const trk = (g: number, keys: Track[]) => {
  for (let i = 1; i < keys.length; i++) if (T.f(keys[i][0]) < T.f(keys[i - 1][0])) throw new Error(`track keys out of order: ${keys[i - 1][0]} > ${keys[i][0]}`);
  return track(g, keys);
};
export const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, Math.min(1, Math.max(0, t))));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

/** Absolute box placed by its centre; scale and rotation about the centre. */
export const Box: React.FC<{ x: number; y: number; w: number; h: number; s?: number; o?: number; rot?: number; z?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  x, y, w, h, s = 1, o = 1, rot = 0, z, style, children }) =>
  o <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o, zIndex: z,
      transform: s !== 1 || rot ? `scale(${s}) rotate(${rot}deg)` : undefined, ...style }}>{children}</div>
  );
/** Absolute box placed by its top-left corner (inside a window body). */
export const Abs: React.FC<{ x: number; y: number; w?: number; h?: number; o?: number; dx?: number; dy?: number; s?: number; z?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  x, y, w, h, o = 1, dx = 0, dy = 0, s = 1, z, style, children }) =>
  o <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, zIndex: z,
      transform: dx || dy || s !== 1 ? `translate(${dx}px, ${dy}px) scale(${s})` : undefined, ...style }}>{children}</div>
  );

// ---- line icons (24 × 24, stroked) ----------------------------------------------------------------------------------
const ICONS: Record<string, string> = {
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5",
  userPlus: "M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2.5 21c0-4 3.4-6.5 7.5-6.5 1.7 0 3.2.4 4.5 1.1 M19 13v6 M16 16h6",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 20c0-3.6 3.1-5.8 7-5.8s7 2.2 7 5.8 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18.5 14.6c2.1.7 3.5 2.6 3.5 5.4",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z",
  bolt: "M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z",
  file: "M6 2.5h8.5l4.5 4.5v14.5H6z M14.5 2.5V7H19 M9 12h6 M9 16h6",
  receipt: "M6 2.5h12v19l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6 M9 16h4",
  chart: "M3.5 20.5h17 M6.5 17v-6 M11 17V6 M15.5 17v-8 M20 17V4",
  mobile: "M7.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V4a1.5 1.5 0 0 1 1.5-1.5z M10.5 18.5h3",
  calendar: "M4.5 5.5h15v15h-15z M4.5 10h15 M8.5 3v4 M15.5 3v4",
  chat: "M4 5h16v11H9l-5 4z",
  mail: "M3.5 6h17v12h-17z M3.5 6.5l8.5 7 8.5-7",
  clipboard: "M8 4H6v17h12V4h-2 M9 2.5h6v3H9z M9 11h6 M9 15h6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  search: "M10.5 17.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M15.5 15.5l5.5 5.5",
  code: "M8.5 6.5 3 12l5.5 5.5 M15.5 6.5 21 12l-5.5 5.5",
  play: "M7 4.5v15l12-7.5z",
  eye: "M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  sparkle: "M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z",
  alert: "M12 3.5 2.5 20h19z M12 10v4.5 M12 17.2v.3",
  chevron: "M6 9l6 6 6-6",
  grid: "M4 4h6.5v6.5H4z M13.5 4H20v6.5h-6.5z M4 13.5h6.5V20H4z M13.5 13.5H20V20h-6.5z",
  layers: "M12 3 2.5 8l9.5 5 9.5-5z M2.5 12.5l9.5 5 9.5-5 M2.5 16.5l9.5 5 9.5-5",
  hash: "M9 3.5 7 20.5 M17 3.5l-2 17 M4 9h16.5 M3.5 15H20",
  server: "M4 4h16v6.5H4z M4 13.5h16V20H4z M7.5 7.25h.5 M7.5 16.75h.5",
  wrench: "M14.5 6.5a4.5 4.5 0 0 0 5.6 5.6L13 19.2a2.1 2.1 0 0 1-3-3l7.1-7.1 M14.5 6.5l3-3a4.5 4.5 0 0 0-5.4 5.4",
  send: "M3 11.5 21 3l-8.5 18-2.2-7.3z M10.3 13.7 21 3",
  plus: "M12 5v14 M5 12h14",
  drag: "M9 6h.5 M14.5 6h.5 M9 12h.5 M14.5 12h.5 M9 18h.5 M14.5 18h.5",
  rocket: "M12 15.5 8.5 12c1.5-4.5 4.5-8 11-8.5-.5 6.5-4 9.5-8.5 11z M8.5 12 5 11.5l3-3.5h4 M12 15.5l.5 3.5 3.5-3v-4 M6.5 17.5 4 20",
};
export const Icon: React.FC<{ name: string; size: number; color?: string; width?: number; style?: React.CSSProperties }> = ({ name, size, color = C.navy, width = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flex: "none", ...style }}>
    <path d={ICONS[name]} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconBox: React.FC<{ name: string; size: number; bg?: string; color?: string }> = ({ name, size, bg = U.tint, color = C.navy }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
    <Icon name={name} size={size * 0.56} color={color} width={2.1} />
  </div>
);

// ---- type -----------------------------------------------------------------------------------------------------------
export const txt = (size: number, weight = 600, color: string = C.navy, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: F.sans, fontSize: size, fontWeight: weight, color, lineHeight: 1.15, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...extra,
});
export const Skel: React.FC<{ w: number; h?: number; c?: string; style?: React.CSSProperties }> = ({ w, h = 12, c = U.skel, style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: c, flex: "none", ...style }} />
);

// ---- window and phone ------------------------------------------------------------------------------------------------
/** A desktop window: a pale chrome strip with three dots, the navy app bar (optional K.B logotype, a title, a right
 *  slot), and the body. Drawn at w × h from its top-left; place it with a Box. */
export const Win: React.FC<{ w: number; h: number; title?: React.ReactNode; right?: React.ReactNode; logo?: boolean; bg?: string; chrome?: number; children?: React.ReactNode }> = ({
  w, h, title, right, logo = true, bg = U.body, chrome = 1, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 26, overflow: "hidden", background: bg, boxShadow: SHADOW.card }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: STRIP, background: U.chrome, display: "flex", alignItems: "center", gap: 10, paddingLeft: 26, opacity: chrome }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: U.dots }} />)}
    </div>
    <div style={{ position: "absolute", left: 0, top: STRIP, width: w, height: BAR, background: C.navy, display: "flex", alignItems: "center", padding: "0 30px", gap: 22, opacity: chrome }}>
      {logo && <span style={{ fontFamily: F.logo, fontWeight: 800, fontSize: 30, color: C.white, lineHeight: 1, paddingTop: 4 }}>K.B</span>}
      {logo && <div style={{ width: 2, height: 30, background: "rgba(255,255,255,0.28)" }} />}
      <div style={{ position: "relative", flex: 1, height: BAR, overflow: "hidden" }}>{title}</div>
      {right}
    </div>
    <div style={{ position: "absolute", left: 0, top: STRIP + BAR, width: w, height: h - STRIP - BAR, overflow: "hidden" }}>{children}</div>
  </div>
);
/** A title in the app bar that rises in and leaves upward (rolls between titles). */
export const BarTitle: React.FC<{ g: number; text: string; at: string; out?: string; children?: React.ReactNode }> = ({ g, text, at, out, children }) => {
  const i = T.k(g, at, 0.4), o = out ? T.k(g, out, 0.3) : 0;
  if (i <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: BAR, display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, i * 1.6) * (1 - o),
      transform: `translateY(${(1 - i) * 26 - o * 26}px)`, ...txt(28, 600, C.white) }}>{children ?? text}</div>
  );
};
export const PHONE = { w: 380, h: 780 };
export const Phone: React.FC<{ children?: React.ReactNode; bg?: string }> = ({ children, bg = U.body }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w, height: PHONE.h, borderRadius: 60, background: C.navyDeep, padding: 13, boxShadow: SHADOW.card }}>
    <div style={{ position: "relative", width: PHONE.w - 26, height: PHONE.h - 26, borderRadius: 48, overflow: "hidden", background: bg }}>
      {children}
      <div style={{ position: "absolute", left: (PHONE.w - 26) / 2 - 52, top: 12, width: 104, height: 30, borderRadius: 15, background: C.navyDeep }} />
    </div>
  </div>
);

// ---- small parts -----------------------------------------------------------------------------------------------------
export const Toggle: React.FC<{ on: number; w?: number; color?: string }> = ({ on, w = 68, color = C.cyan }) => {
  const h = w * 0.56, d = h - 8;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: h / 2, background: mix(U.skelD, color, on), flex: "none" }}>
      <div style={{ position: "absolute", top: 4, left: 4 + (w - 8 - d) * on, width: d, height: d, borderRadius: d / 2, background: C.white, boxShadow: "0 2px 5px rgba(41,58,81,0.25)" }} />
    </div>
  );
};
export const Check: React.FC<{ size: number; bg?: string; color?: string }> = ({ size, bg = C.cyan, color = C.navy }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px -6px rgba(41,58,81,0.35)", flex: "none" }}>
    <Icon name="check" size={size * 0.6} color={color} width={3} />
  </div>
);
export const Pill: React.FC<{ bg: string; color: string; size: number; icon?: string; dot?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ bg, color, size, icon, dot, children, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, height: size * 1.9, padding: `0 ${size * 0.75}px`, borderRadius: 999, background: bg, ...txt(size, 700, color), flex: "none", ...style }}>
    {dot && <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: size, background: dot }} />}
    {icon && <Icon name={icon} size={size * 1.05} color={color} width={2.4} />}
    {children}
  </div>
);
/** A person as initials in a circle (never a photo); `kb` draws the K.B tile instead. */
export const Avatar: React.FC<{ size: number; text?: string; bg?: string; kb?: boolean; ring?: string }> = ({ size, text = "", bg = U.tint, kb, ring = C.white }) =>
  kb ? (
    <div style={{ width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(90deg, ${C.kbL}, ${C.kbR})`, border: `${Math.max(2, size * 0.05)}px solid ${ring}`, boxSizing: "border-box",
      display: "flex", alignItems: "center", justifyContent: "center", flex: "none", boxShadow: "0 6px 14px -6px rgba(41,58,81,0.4)" }}>
      <span style={{ fontFamily: F.logo, fontWeight: 800, fontSize: size * 0.36, color: C.white, lineHeight: 1, paddingTop: size * 0.05 }}>K.B</span>
    </div>
  ) : (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, border: `${Math.max(2, size * 0.05)}px solid ${ring}`, boxSizing: "border-box",
      display: "flex", alignItems: "center", justifyContent: "center", flex: "none", ...txt(size * 0.34, 700, C.navy), boxShadow: "0 6px 14px -6px rgba(41,58,81,0.3)" }}>{text}</div>
  );
/** A pointer with an optional name tag; `press` 0..1..0 squeezes it and sends out a ring. */
export const Cursor: React.FC<{ label?: string; tone?: "kb" | "you"; press?: number; ring?: number }> = ({ label, tone = "kb", press = 0, ring = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0 }}>
    {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: 6 - 40 * ring, top: 4 - 40 * ring, width: 80 * ring, height: 80 * ring, borderRadius: "50%", border: `4px solid ${C.cyan}`, opacity: 1 - ring }} />}
    <svg width={46} height={52} viewBox="0 0 30 34" style={{ position: "absolute", left: 0, top: 0, transform: `scale(${1 - press * 0.14})`, transformOrigin: "4px 2px", filter: "drop-shadow(0 4px 6px rgba(41,58,81,0.35))" }}>
      <path d="M4 2 4 28.5 11 22 15.5 32.5 20.3 30.4 15.9 20.3 25.5 20.3Z" fill={C.white} stroke={C.navy} strokeWidth={2.2} strokeLinejoin="round" />
    </svg>
    {label && (
      <div style={{ position: "absolute", left: 38, top: 40, height: 40, padding: "0 16px", borderRadius: 999, display: "flex", alignItems: "center",
        background: tone === "kb" ? C.navy : C.cyan, ...txt(22, 700, tone === "kb" ? C.white : C.navy) }}>{label}</div>
    )}
  </div>
);
export const press = (g: number, at: string) => { const d = g - T.f(at); return d < -3 || d > 6 ? 0 : d < 0 ? (d + 3) / 3 : 1 - d / 6; };
export const ripple = (g: number, at: string) => { const d = (g - T.f(at)) / 14; return d <= 0 || d >= 1 ? 0 : d; };

// ---- background --------------------------------------------------------------------------------------------------------
const sm = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
/** Big soft shapes in the canvas's corners, drifting slowly (the depth of the page). */
export const Blobs: React.FC<{ g: number }> = ({ g }) => {
  const B = [
    { x: -60, y: 120, r: 520, p: 0 }, { x: 1990, y: 1010, r: 560, p: 2 }, { x: 1720, y: -260, r: 380, p: 4 }, { x: 240, y: 1180, r: 360, p: 1 },
  ];
  return (
    <>
      {B.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.x - b.r, top: b.y - b.r, width: 2 * b.r, height: 2 * b.r, borderRadius: "50%", background: "#EEF0F4",
          transform: `translate(${Math.sin(g / 100 + b.p) * 70}px, ${Math.cos(g / 120 + b.p) * 50}px)` }} />
      ))}
    </>
  );
};
type Bit = { x: number; y: number; kind: "tri" | "half" | "dot" | "ring" | "squig" | "plus"; c: string; s: number; r: number; vr: number; p: number };
const BITS: Bit[] = [
  { x: 210, y: 170, kind: "tri", c: C.cyan, s: 40, r: 10, vr: 0.6, p: 0 },
  { x: 1640, y: 230, kind: "half", c: C.navy, s: 34, r: 40, vr: -0.4, p: 1 },
  { x: 1500, y: 880, kind: "ring", c: C.cyan, s: 30, r: 0, vr: 0, p: 2 },
  { x: 330, y: 860, kind: "plus", c: C.kb, s: 30, r: 15, vr: 0.5, p: 3 },
  { x: 120, y: 520, kind: "dot", c: C.cyan, s: 18, r: 0, vr: 0, p: 4 },
  { x: 1800, y: 600, kind: "squig", c: C.navy, s: 52, r: -20, vr: 0.3, p: 5 },
  { x: 760, y: 110, kind: "dot", c: C.kb, s: 14, r: 0, vr: 0, p: 6 },
  { x: 1180, y: 980, kind: "tri", c: C.navy, s: 30, r: -30, vr: -0.5, p: 7 },
  { x: 560, y: 990, kind: "half", c: C.cyan, s: 28, r: 200, vr: 0.4, p: 8 },
  { x: 1300, y: 120, kind: "squig", c: C.cyan, s: 46, r: 30, vr: -0.3, p: 9 },
];
const Bit: React.FC<{ b: Bit }> = ({ b }) => {
  const s = b.s, sw = Math.max(4, s * 0.14);
  switch (b.kind) {
    case "tri": return <svg width={s} height={s} viewBox="0 0 40 40"><path d="M20 5 35 33H5Z" fill="none" stroke={b.c} strokeWidth={sw * 40 / s} strokeLinejoin="round" /></svg>;
    case "half": return <svg width={s} height={s / 2} viewBox="0 0 40 20"><path d="M0 20A20 20 0 0 1 40 20Z" fill={b.c} /></svg>;
    case "dot": return <div style={{ width: s, height: s, borderRadius: s, background: b.c }} />;
    case "ring": return <div style={{ width: s, height: s, borderRadius: s, border: `${sw}px solid ${b.c}`, boxSizing: "border-box" }} />;
    case "plus": return <svg width={s} height={s} viewBox="0 0 30 30"><path d="M15 4v22 M4 15h22" stroke={b.c} strokeWidth={sw * 30 / s} strokeLinecap="round" /></svg>;
    default: return <svg width={s} height={s * 0.4} viewBox="0 0 50 20"><path d="M3 10q5.5-8 11 0t11 0 11 0 11 0" fill="none" stroke={b.c} strokeWidth={sw * 50 / s} strokeLinecap="round" /></svg>;
  }
};
/** The small shapes at the edges (the open, "How?", "Need more?", the loop, the end): they drift and turn, and come
 *  in from (and go back past) the frame's edges with `k` (0..1). */
export const Bits: React.FC<{ g: number; k: number }> = ({ g, k }) =>
  k <= 0.001 ? null : (
    <>
      {BITS.map((b, i) => {
        const dx = b.x - 960, dy = b.y - 540, d = Math.hypot(dx, dy), out = (1 - sm(k)) * 260;
        const x = b.x + (dx / d) * out + Math.sin(g / 47 + b.p) * 16, y = b.y + (dy / d) * out + Math.cos(g / 53 + b.p * 1.3) * 14;
        return (
          <div key={i} style={{ position: "absolute", left: x - b.s / 2, top: y - b.s / 2, opacity: sm(k * 1.4), transform: `rotate(${b.r + g * b.vr}deg)` }}><Bit b={b} /></div>
        );
      })}
    </>
  );
