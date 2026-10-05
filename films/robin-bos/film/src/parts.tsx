// Recurring pieces of the Robin Bos stage: the portrait cut-out, the sky-blue square, logo tiles, cards, counters.
// Everything is placed with transforms (never left/top on moving things: production/build-gotchas.md).
import React from "react";
import { Img, staticFile } from "remotion";
import { C, SHADOW } from "./lib";
import { Digit } from "./kinetic";

/** Robin's studio cut-out (1072×1467). h = rendered height in px; anchored at its bottom-centre (x, y). */
export const Portrait: React.FC<{ x: number; y: number; h: number; o?: number; blur?: number; name?: string; style?: React.CSSProperties }> = ({ x, y, h, o = 1, blur = 0, name = "robin", style }) => {
  const w = (h * 1072) / 1467;
  return (
    <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${x - w / 2}px, ${y - h}px)`, opacity: o, filter: blur ? `blur(${blur}px)` : undefined, willChange: "transform", ...style }}>
      <Img src={staticFile("img/robin-cutout.png")} style={{ width: w, height: h, display: "block", filter: "drop-shadow(0 30px 40px rgba(14,32,56,.18))" }} />
    </div>
  );
};

/** The sky-blue square: the site's period. Centred on (x, y), side s. */
export const Sq: React.FC<{ x: number; y: number; s: number; o?: number; color?: string; r?: number; name?: string; rot?: number; style?: React.CSSProperties }> = ({ x, y, s, o = 1, color = C.accent, r = 0, name, rot = 0, style }) => (
  <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: s, height: s, background: color, borderRadius: r, opacity: o, transform: `translate(${x - s / 2}px, ${y - s / 2}px) rotate(${rot}deg)`, willChange: "transform", ...style }} />
);

/** A logo image fitted into a box (w×h) centred on (x, y). `mono` renders it in ink via grayscale. */
export const Logo: React.FC<{ src: string; x: number; y: number; w: number; h: number; o?: number; s?: number; mono?: boolean; name?: string; style?: React.CSSProperties; imgStyle?: React.CSSProperties }> = ({ src, x, y, w, h, o = 1, s = 1, mono = false, name, style, imgStyle }) => (
  <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${x - w / 2}px, ${y - h / 2}px) scale(${s})`, opacity: o, display: "flex", alignItems: "center", justifyContent: "center", willChange: "transform", ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: mono ? "grayscale(1) contrast(1.05)" : undefined, ...imgStyle }} />
  </div>
);

/** A white card with the site's radius and shadow, centred on (x, y). */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; o?: number; s?: number; r?: number; bg?: string; name?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, o = 1, s = 1, r = 20, bg = C.white, name, style, children }) => (
  <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, background: bg, boxShadow: SHADOW.card, transform: `translate(${x - w / 2}px, ${y - h / 2}px) scale(${s})`, opacity: o, overflow: "hidden", willChange: "transform", ...style }}>
    {children}
  </div>
);

/** A photo inside a rounded card (the team photo), object-fit cover, centred on (x, y). */
export const Photo: React.FC<{ src: string; x: number; y: number; w: number; h: number; o?: number; s?: number; r?: number; pos?: string; zoom?: number; name?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ src, x, y, w, h, o = 1, s = 1, r = 24, pos = "50% 50%", zoom = 1, name, style, children }) => (
  <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, overflow: "hidden", boxShadow: SHADOW.soft, transform: `translate(${x - w / 2}px, ${y - h / 2}px) scale(${s})`, opacity: o, willChange: "transform", ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos, display: "block" }} />
    {children}
  </div>
);

/** A number that rolls like an odometer to v (digits only; prefix/suffix as plain spans). */
export const Odometer: React.FC<{ v: number; digits: number; size: number; color?: string; weight?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ v, digits, size, color = C.ink, weight = 700, prefix, suffix, style }) => {
  const vv = Math.max(0, v);
  const cols = Array.from({ length: digits }, (_, i) => digits - 1 - i).map((p) => (vv / 10 ** p) % 10);
  return (
    <div style={{ display: "flex", alignItems: "center", fontFamily: "Manrope", fontWeight: weight, fontSize: size, color, letterSpacing: "-0.05em", lineHeight: 1, ...style }}>
      {prefix && <span style={{ marginRight: size * 0.06 }}>{prefix}</span>}
      {cols.map((d, i) => <Digit key={i} v={d} size={size} width={0.6} />)}
      {suffix && <span style={{ marginLeft: size * 0.04 }}>{suffix}</span>}
    </div>
  );
};

/** A small uppercase micro-label, the site's eyebrow style. */
export const Micro: React.FC<{ x: number; y: number; text: string; o?: number; color?: string; size?: number; align?: "left" | "right" | "center"; name?: string; style?: React.CSSProperties }> = ({ x, y, text, o = 1, color = C.muted, size = 26, align = "left", name, style }) => (
  <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, opacity: o, fontFamily: "Manrope", fontWeight: 600, fontSize: size, letterSpacing: "0.1em", textTransform: "uppercase", color, whiteSpace: "nowrap", textAlign: align, ...(align === "right" ? { right: 0 } : {}), willChange: "transform", ...style }}>{text}</div>
);

/** Plain type block, placed with a transform. */
export const Text: React.FC<{ x: number; y: number; size: number; weight?: number; color?: string; ls?: number; o?: number; children: React.ReactNode; name?: string; style?: React.CSSProperties }> = ({ x, y, size, weight = 500, color = C.ink, ls = -0.045, o = 1, children, name, style }) => (
  <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, opacity: o, fontFamily: "Manrope", fontWeight: weight, fontSize: size, letterSpacing: `${ls}em`, lineHeight: 1.05, color, whiteSpace: "nowrap", willChange: "transform", ...style }}>{children}</div>
);

/** A hairline in the site's line colour, from (x, y) with width w (or height h for vertical), drawn by k 0→1. */
export const Rule: React.FC<{ x: number; y: number; w?: number; h?: number; k?: number; color?: string; thick?: number; o?: number }> = ({ x, y, w = 0, h = 0, k = 1, color = C.line, thick = 2, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w || thick, height: h || thick, background: color, opacity: o, transform: `translate(${x}px, ${y}px) ${w ? `scaleX(${k})` : `scaleY(${k})`}`, transformOrigin: "0 0" }} />
);

/** The ↗ arrow of the site's links, in a thin stroke. */
export const Arrow: React.FC<{ x: number; y: number; s: number; color?: string; o?: number; k?: number }> = ({ x, y, s, color = C.ink, o = 1, k = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - s / 2}px, ${y - s / 2}px)`, opacity: o }}>
    <path d="M5 19 19 5M5 5h14v14" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${k} 1`} />
  </svg>
);
