// Shared pieces: the wkc monogram, the glossy arrow cursor, grain, text measuring and glow helpers.
import React from "react";
import { staticFile } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { F } from "./lib";
import { WKC_PATH, WKC_VIEW } from "./mark";

const cache: Record<string, number> = {};
/** Text width in px (Inter Tight by default). tracking is in em. */
export const tw = (text: string, size: number, weight = 800, family: string = F.head, tracking = 0) => {
  const key = `${text}|${size}|${weight}|${family}`;
  if (!(key in cache)) cache[key] = measureText({ text, fontFamily: family, fontSize: size, fontWeight: String(weight) }).width;
  return cache[key] + tracking * size * text.length;
};

/** The wkc monogram, w px wide, filled with a colour or a CSS gradient (via an SVG gradient id defined by the caller). */
export const WkcMark: React.FC<{ w: number; fill?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, fill = "#fff", style, children }) => (
  <svg width={w} height={(w * WKC_VIEW.h) / WKC_VIEW.w} viewBox={`0 0 ${WKC_VIEW.w} ${WKC_VIEW.h}`} style={{ display: "block", overflow: "visible", ...style }}>
    {children}
    <path d={WKC_PATH} fill={fill} />
  </svg>
);

/**
 * The reference's cursor: a glossy dark arrow with a bevelled white rim. (x, y) is the tip; h its height in px;
 * press 0..1 shrinks it a little for a click; rot tilts it (degrees).
 */
export const Pointer: React.FC<{ x: number; y: number; h?: number; press?: number; rot?: number; opacity?: number; blur?: number }> = ({ x, y, h = 90, press = 0, rot = 0, opacity = 1, blur = 0 }) => {
  const s = (h / 100) * (1 - 0.12 * press);
  return (
    <svg width={100} height={100} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity, transformOrigin: "0 0",
      transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${s})`, filter: `drop-shadow(0 6px 10px rgba(0,0,0,0.35))${blur ? ` blur(${blur}px)` : ""}` }}>
      <defs>
        <linearGradient id="ptr-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A3D55" /><stop offset="0.55" stopColor="#1A1C2C" /><stop offset="1" stopColor="#0C0D16" /></linearGradient>
        <linearGradient id="ptr-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></linearGradient>
        <filter id="ptr-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
      {/* the tip is at (0, 0): a dart pointing up-left with a notch at the back, 100 across */}
      <path d="M0 0 L100 40 L54 54 L40 100 Z" fill="url(#ptr-body)" stroke="#07080E" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M40 100 L0 0 L100 40" fill="none" stroke="url(#ptr-rim)" strokeWidth={5} strokeLinejoin="round" filter="url(#ptr-glow)" />
      <path d="M40 100 L0 0 L100 40" fill="none" stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M0 0 L54 54" fill="none" stroke="#B9C2FF" strokeOpacity={0.25} strokeWidth={1.2} />
    </svg>
  );
};

/** Film grain over a picture. */
export const Grain: React.FC<{ opacity?: number; seed?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ opacity = 0.08, seed = 0, blend = "overlay" }) => (
  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("img/grain.png")})`, backgroundSize: "512px 512px",
    backgroundPosition: `${(seed * 173) % 512}px ${(seed * 97) % 512}px`, opacity, mixBlendMode: blend, pointerEvents: "none" }} />
);

/** A soft glow: an ellipse of colour, blurred. */
export const Glow: React.FC<{ x: number; y: number; w: number; h?: number; color: string; blur?: number; opacity?: number; rot?: number }> =
  ({ x, y, w, h, color, blur = 120, opacity = 1, rot = 0 }) => {
    const hh = h ?? w;
    return <div style={{ position: "absolute", left: 0, top: 0, width: w, height: hh, borderRadius: "50%", background: color, filter: `blur(${blur}px)`, opacity,
      transform: `translate3d(${x - w / 2}px, ${y - hh / 2}px, 0) rotate(${rot}deg)` }} />;
  };

/** text-shadow for glowing type: a tight bright halo and a wide soft one */
export const textGlow = (color: string, k = 1) => `0 0 ${6 * k}px ${color}, 0 0 ${18 * k}px ${color}, 0 0 ${42 * k}px ${color}`;
