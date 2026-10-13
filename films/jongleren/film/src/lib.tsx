// The film's tokens: JongLeren's colours (measured, ../brand.json), Roboto, the motion identity
// (energetic-clean: expo-out arrivals, small overshoot only on small things), and shared pieces.
import React from "react";
import { continueRender, delayRender, Easing, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  red: "#D2020C", redDeep: "#B30109", white: "#FFFFFF", warm: "#F4F1EE", grey: "#EFEDED",
  ink: "#26231F", text: "#545454", soft: "#8A8580", line: "#D9D4CF",
  pink: "#F54A86", terracotta: "#DB8D3D", sand: "#E9DCCF", leaf: "#C5E499", sky: "#DCEBF5",
};
export const KIT = { font: "Roboto", serif: "Roboto", ink: C.ink, word: C.red, mark: "#F9D5D6", under: C.red, strike: C.red };

// Motion identity: signature arrival (expo-out), carried moves, departures; a small overshoot for small things.
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const CARRY = Easing.bezier(0.65, 0, 0.35, 1);
// a colour field growing out of a ball: starts slow enough to be seen leaving the ball, then fills
export const GROW = Easing.bezier(0.45, 0, 0.2, 1);
export const LEAVE = Easing.bezier(0.55, 0, 0.9, 0.4);
export const SMALLPOP = Easing.bezier(0.3, 1.35, 0.6, 1);

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
const weights: [string, string][] = [["400", "400"], ["500", "500"], ["700", "700"], ["900", "900"]];
if (typeof window !== "undefined") {
  Promise.all(weights.flatMap(([w]) => [
    loadFont({ family: "Roboto", url: staticFile(`fonts/roboto-latin-${w}-normal.woff2`), weight: w }),
    loadFont({ family: "Roboto", url: staticFile(`fonts/roboto-latin-ext-${w}-normal.woff2`), weight: w,
      unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF" }),
  ])).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** The thread: a red ball (the logo's juggling ball). */
export const Ball: React.FC<{ x: number; y: number; r: number; color?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, r, color = C.red, style, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 2 * r, height: 2 * r, borderRadius: "50%", background: color,
    transform: `translate(${x - r}px, ${y - r}px)`, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);

/** A drawn tick (white on red unless told otherwise); k 0 → 1 draws it. */
export const Tick: React.FC<{ k: number; size: number; color?: string; width?: number }> = ({ k, size, color = C.white, width = 0.14 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d="M22 53 L42 72 L78 32" fill="none" stroke={color} strokeWidth={width * 100} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
  </svg>
);

/** A rounded photo card with a soft shadow; `zoom` and `pos` frame the photo inside. */
export const Photo: React.FC<{ src: string; w: number; h: number; zoom?: number; pos?: string; radius?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  src, w, h, zoom = 1, pos = "50% 50%", radius = 28, style, children }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: radius, overflow: "hidden", background: C.grey,
    boxShadow: "0 30px 70px rgba(38,35,31,0.18), 0 6px 18px rgba(38,35,31,0.10)", ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos }} />
    {children}
  </div>
);

/** A white pill with red text: a to-do, a chip, a label. */
export const Pill: React.FC<{ text: string; size?: number; bg?: string; color?: string; style?: React.CSSProperties; icon?: React.ReactNode }> = ({ text, size = 34, bg = C.white, color = C.red, style, icon }) => (
  <div style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center", gap: size * 0.35, whiteSpace: "nowrap", padding: `${size * 0.42}px ${size * 0.8}px`,
    borderRadius: size * 2, background: bg, color, fontFamily: "Roboto", fontWeight: 700, fontSize: size, lineHeight: 1,
    boxShadow: "0 14px 34px rgba(38,35,31,0.16)", ...style }}>{icon}{text}</div>
);

export const Mark: React.FC<{ h: number; white?: boolean; style?: React.CSSProperties }> = ({ h, white, style }) => (
  <Img src={staticFile(white ? "img/jl-mark-white.png" : "img/jl-mark.png")} style={{ position: "absolute", height: h, width: (h * 900) / 1120, ...style }} />
);
