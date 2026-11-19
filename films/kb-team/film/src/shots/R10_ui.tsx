// R10 helpers: the pictures (colour fields, sketches, stills) and small UI pieces. Everything is drawn in the
// reference's 1280 x 720 units inside a `Px` wrapper that scales by 1.5 to the film's 1920 x 1080.
import React from "react";
import { Img, staticFile } from "remotion";
import { C } from "../kit";
import type { P } from "../kit";

export const Px: React.FC<{ children?: React.ReactNode; style?: P }> = ({ children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transformOrigin: "0 0", transform: "scale(1.5)", ...style }}>{children}</div>
);
export const A = (x: number, y: number, w?: number, h?: number, more: P = {}): P => ({ position: "absolute", left: x, top: y, width: w, height: h, ...more });

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1.6 -.2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
export const Grain: React.FC<{ o?: number }> = ({ o = 0.35 }) => <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "90px 90px", opacity: o, mixBlendMode: "overlay" }} />;

// ---- the pictures. k picks one; they fill their parent.
export type PicK = "leaf" | "bloom" | "dots" | "pebble" | "mint" | "glyph" | "plant" | "sketch";
const Sk: React.FC = () => (
  <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
    <path d="M38 22 C32 6 54 4 58 15 C60 22 51 29 46 27 M44 27 L45 33 M22 36 C42 29 62 35 80 31 C67 41 30 38 23 47 C42 53 70 46 83 55 C60 61 30 58 22 67 C44 73 75 66 85 75 C62 81 30 80 20 89 C46 93 78 89 93 91" fill="none" stroke="#4a4140" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Pic: React.FC<{ k: PicK; style?: P }> = ({ k, style }) => {
  const base: P = { position: "absolute", inset: 0, overflow: "hidden", ...style };
  if (k === "leaf") return (
    <div style={{ ...base, background: "linear-gradient(170deg, #4a68d8 0%, #5b57c4 55%, #7a4fb5 100%)" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "blur(2.4px)" }}>
        <g fill="#3cc4ad" opacity=".85"><ellipse cx="38" cy="22" rx="14" ry="3.4" transform="rotate(14 38 22)" /><ellipse cx="62" cy="26" rx="13" ry="3.6" transform="rotate(-14 62 26)" /><ellipse cx="40" cy="42" rx="14" ry="3.6" transform="rotate(8 40 42)" /><ellipse cx="62" cy="48" rx="15" ry="3.8" transform="rotate(14 62 48)" /><ellipse cx="50" cy="66" rx="17" ry="3.8" /><ellipse cx="38" cy="82" rx="14" ry="3.4" transform="rotate(10 38 82)" /></g>
        <g fill="#c4447f" opacity=".55"><ellipse cx="56" cy="88" rx="16" ry="4" transform="rotate(-16 56 88)" /><ellipse cx="62" cy="74" rx="10" ry="3" transform="rotate(-20 62 74)" /></g>
        <rect x="47.5" y="14" width="4" height="86" fill="#7a58c0" opacity=".7" />
      </svg>
      <Grain o={0.18} />
    </div>
  );
  if (k === "bloom") return (
    <div style={{ ...base, background: "linear-gradient(160deg, #8a6bb8 0%, #7a68ad 50%, #6a7fb0 100%)" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "blur(2.2px)" }}>
        <g fill="#45b790"><ellipse cx="62" cy="40" rx="30" ry="22" /><ellipse cx="44" cy="58" rx="22" ry="12" transform="rotate(-8 44 58)" /><ellipse cx="82" cy="52" rx="14" ry="16" /><ellipse cx="22" cy="26" rx="14" ry="5" transform="rotate(-8 22 26)" /><ellipse cx="68" cy="68" rx="30" ry="12" /></g>
        <g fill="#5fcfae" opacity=".7"><ellipse cx="62" cy="34" rx="18" ry="12" /><ellipse cx="46" cy="60" rx="12" ry="6" /></g>
        <ellipse cx="50" cy="104" rx="60" ry="14" fill="#4d94b8" />
      </svg>
      <Grain o={0.3} />
    </div>
  );
  if (k === "dots") return (
    <div style={{ ...base, background: "#4b4649" }}>
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2, x = 50 + 40 * Math.cos(a), y = 50 + 22 * Math.sin(a); const r = -0.3, X = 50 + (x - 50) * Math.cos(r) - (y - 50) * Math.sin(r), Y = 50 + (x - 50) * Math.sin(r) + (y - 50) * Math.cos(r); return <circle key={i} cx={X} cy={Y} r={1.4} fill="#fff" />; })}
      </svg>
      <Grain o={0.5} />
    </div>
  );
  if (k === "pebble") return (
    <div style={{ ...base, background: "#3fb6b8" }}>
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        <ellipse cx="52" cy="14" rx="27" ry="13" fill="#f2f5f2" /><ellipse cx="54" cy="45" rx="27" ry="14" fill="#1f6b52" /><ellipse cx="46" cy="86" rx="34" ry="32" fill="#0b3b33" />
      </svg>
      <Grain o={0.55} />
    </div>
  );
  if (k === "mint") return (
    <div style={{ ...base, background: "linear-gradient(150deg, #4fcaa0, #6fd9b6 60%, #55c9a6)" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "blur(3px)" }}>
        <g fill="#aeeed4" opacity=".7"><ellipse cx="30" cy="30" rx="22" ry="12" transform="rotate(-30 30 30)" /><ellipse cx="68" cy="60" rx="24" ry="14" transform="rotate(25 68 60)" /><ellipse cx="40" cy="80" rx="14" ry="8" /></g>
      </svg>
      <Grain o={0.4} />
    </div>
  );
  if (k === "glyph") return (
    <div style={{ ...base, background: "#2a2a2c" }}>
      <Img src={staticFile("stills/F1-1.jpg")} style={{ position: "absolute", left: "-20%", top: 0, width: "140%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.25) brightness(.95)" }} />
      {[[14, 14], [50, 14], [86, 14], [14, 50], [86, 50], [14, 86], [50, 86], [86, 86]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: "9%", height: "9%", marginLeft: "-4.5%", marginTop: "-4.5%", borderRadius: "50%", background: "#d6e2de" }} />)}
      <Grain o={0.3} />
    </div>
  );
  if (k === "plant") return (
    <div style={{ ...base, background: "#2cb888" }}>
      <Img src={staticFile("stills/AA-1.jpg")} style={{ position: "absolute", left: "-40%", top: "-10%", width: "180%", height: "130%", objectFit: "cover", filter: "saturate(2.6) hue-rotate(95deg) contrast(1.5)", mixBlendMode: "normal" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,90,140,.45), rgba(40,220,140,.0) 55%, rgba(255,120,60,.35))", mixBlendMode: "screen" }} />
      <Grain o={0.5} />
    </div>
  );
  return (
    <div style={{ ...base, background: "#aeaaa6" }}>
      <Sk />
      <Grain o={0.6} />
    </div>
  );
};

// ---- small icons
export const IcoHeart: React.FC<{ s?: number; c?: string; fill?: string }> = ({ s = 10, c = "currentColor", fill = "none" }) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" fill={fill} stroke={c} strokeWidth="2.2" strokeLinejoin="round" /></svg>;
export const IcoStar: React.FC<{ s?: number; c?: string; fill?: string }> = ({ s = 10, c = "currentColor", fill = "none" }) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z" fill={fill} stroke={c} strokeWidth="2" strokeLinejoin="round" /></svg>;
export const IcoPlay: React.FC<{ s?: number; c?: string }> = ({ s = 10, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill={c} /></svg>;
export const IcoPause: React.FC<{ s?: number; c?: string }> = ({ s = 10, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" fill={c} /><rect x="14" y="4" width="5" height="16" fill={c} /></svg>;
export const IcoShuffle: React.FC<{ s?: number; c?: string }> = ({ s = 12, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3" /></svg>;
export const IcoPrev: React.FC<{ s?: number; c?: string }> = ({ s = 12, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M18 5v14L8 12z" fill={c} /><rect x="5" y="5" width="2.5" height="14" fill={c} /></svg>;
export const IcoNext: React.FC<{ s?: number; c?: string }> = ({ s = 12, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M6 5v14l10-7z" fill={c} /><rect x="16.5" y="5" width="2.5" height="14" fill={c} /></svg>;
export const IcoRepeat: React.FC<{ s?: number; c?: string }> = ({ s = 12, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4" /></svg>;
export const IcoSearch: React.FC<{ s?: number; c?: string }> = ({ s = 12, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>;
export const IcoMonitor: React.FC<{ s?: number; c?: string }> = ({ s = 12, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>;

// ---- a cursor with a name tag (screen px, tip at x, y)
export const Cur: React.FC<{ x: number; y: number; label?: string; c: string; s?: number }> = ({ x, y, label, c, s = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`, willChange: "transform" }}>
    <svg width={22 * s} height={26 * s} viewBox="0 0 22 26" style={{ position: "absolute", left: -2 * s, top: -2 * s, overflow: "visible", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.25))" }}><path d="M2 2 L2 20 L7 15.5 L11 24 L14.5 22.5 L10.5 14 L17 13.5 Z" fill={c} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
    {label && <div style={{ position: "absolute", left: 14 * s, top: 20 * s, background: c, color: "#fff", fontSize: 12.5 * s, fontWeight: 600, padding: `${3 * s}px ${8 * s}px`, borderRadius: 5 * s, whiteSpace: "nowrap", lineHeight: 1.2 }}>{label}</div>}
  </div>
);
export const Sticky: React.FC<{ x: number; y: number; w: number; h: number; bg: string; tag: string; text: React.ReactNode; chip: string; fs?: number }> = ({ x, y, w, h, bg, tag, text, chip, fs = 9 }) => (
  <div style={A(x, y, w, h, { background: bg, boxShadow: "0 2px 8px rgba(0,0,0,.12)", color: "#1c1c1c", boxSizing: "border-box", padding: "8px 9px" })}>
    <div style={{ fontSize: fs * 0.7, color: "#6b6552", letterSpacing: 0.2, fontWeight: 500 }}>⌄ {tag}</div>
    <div style={{ fontSize: fs, fontWeight: 500, lineHeight: 1.25, marginTop: 8 }}>{text}</div>
    <div style={A(9, h - 22, 14, 14, { borderRadius: 7, background: "rgba(0,0,0,.14)", fontSize: 6, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>{chip}</div>
  </div>
);
export const TileMark: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => <Img src={staticFile("logo/kb-logo-tile.svg")} style={A(x, y, s, s, { borderRadius: s * 0.075, opacity: o })} />;
export const KBmark: React.FC<{ c?: string }> = ({ c = "#525252" }) => (
  <div style={{ position: "absolute", left: 28, top: 26, display: "flex", alignItems: "center", gap: 9, color: c, fontSize: 24, fontWeight: 600, letterSpacing: -0.8 }}>
    <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 28, height: 28, borderRadius: 5, filter: "grayscale(1)", opacity: 0.8 }} />K.B
  </div>
);
export const Ink = C.ink;
