// Bingua's tokens (bingua.app: CSS and the app's own screenshots, measured): the iOS greys of the app, its blue
// #2FAFEE (action) and #189DDF, the icon's navy #0E1826 → #122033 and its bar blue #5E9DC6; Inter.
import React from "react";
import { Easing } from "remotion";

export const C = {
  navy: "#0E1826", navy2: "#122033", navy3: "#1A2B42", ink: "#1C1C1E", grey: "#8E8E93", grey2: "#636366", grey3: "#AEAEB2",
  line: "#E5E5EA", bg: "#F2F2F7", white: "#FFFFFF", blue: "#2FAFEE", blueD: "#189DDF", blueSoft: "#E3F1FB", bar: "#5E9DC6",
  red: "#FF3B30", redSoft: "#FDECEB", green: "#34C759", greenD: "#248A3D", greenSoft: "#E8F8EC", orange: "#FF9500", yellow: "#FFD60A",
};
export const F = { sans: "Inter" };
export const KIT = { font: F.sans, serif: F.sans, ink: C.white, word: C.blue, mark: C.blueSoft, under: C.blue, strike: C.red };

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.4, 0, 0.15, 1);
export const OUT = Easing.bezier(0.45, 0, 0.8, 0.5);
export const IN = Easing.bezier(0.3, 0.7, 0.4, 1);
export const FLICK = Easing.bezier(0.2, 0.9, 0.3, 1);   // a thumb's flick: fast, then a long glide
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const txt = (size: number, weight = 600, color: string = C.ink, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: F.sans, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...extra,
});

/** The Bingua icon, rebuilt as vectors from the site's app icon: the navy tile, the cyan play triangle (the video)
 *  and two bars (the dual subtitles: white, then blue). `parts` fades the triangle and bars in (0..1). */
export const BinguaIcon: React.FC<{ size: number; parts?: number; radius?: number; style?: React.CSSProperties }> = ({ size, parts = 1, radius, style }) => (
  <svg width={size} height={size} viewBox="0 0 180 180" style={{ display: "block", ...style }}>
    <defs><linearGradient id="bgi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E1826" /><stop offset="1" stopColor="#152741" /></linearGradient></defs>
    <rect width="180" height="180" rx={radius ?? 40} fill="url(#bgi)" />
    <g opacity={parts}>
      <path d="M73 38 L118 63 Q123 66 118 69 L73 94 Q68 97 68 91 L68 41 Q68 35 73 38Z" fill={C.blue} />
      <rect x="37" y="114" width="106" height="15" rx="7.5" fill="#FFFFFF" />
      <rect x="52" y="138" width="76" height="13" rx="6.5" fill={C.bar} />
    </g>
  </svg>
);

/** Simple flags (drawn, no emoji font needed). */
export const Flag: React.FC<{ code: "es" | "fr" | "it" | "de"; size: number }> = ({ code, size }) => {
  const w = size, h = size * 0.7, r = size * 0.12;
  const body = code === "es" ? <><rect width={w} height={h} fill="#C60B1E" /><rect y={h * 0.25} width={w} height={h * 0.5} fill="#FFC400" /></>
    : code === "fr" ? <><rect width={w / 3} height={h} fill="#0055A4" /><rect x={w / 3} width={w / 3} height={h} fill="#FFFFFF" /><rect x={(2 * w) / 3} width={w / 3} height={h} fill="#EF4135" /></>
    : code === "it" ? <><rect width={w / 3} height={h} fill="#009246" /><rect x={w / 3} width={w / 3} height={h} fill="#FFFFFF" /><rect x={(2 * w) / 3} width={w / 3} height={h} fill="#CE2B37" /></>
    : <><rect width={w} height={h / 3} fill="#000000" /><rect y={h / 3} width={w} height={h / 3} fill="#DD0000" /><rect y={(2 * h) / 3} width={w} height={h / 3} fill="#FFCE00" /></>;
  return <svg width={w} height={h} style={{ display: "block", borderRadius: r, overflow: "hidden", flex: "none" }}><g>{body}</g></svg>;
};
