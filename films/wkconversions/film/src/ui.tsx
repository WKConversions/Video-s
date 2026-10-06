// Shared pieces in the site's UI language (wkconversions.com): white cards with the soft shadow and hairline edge,
// the pill badge, the primary blue button with its arrow, stroke icons, the cursor, the "wkc" mark.
import React from "react";
import { C, F, R, SHADOW, rgba } from "./lib";
import { WKC_D, WKC_VIEWBOX } from "./mark";

export const ICON: Record<string, React.ReactNode> = {
  eye: <><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="2" /></>,
  cube: <><path d="M8 1.8l5.5 3.1v6.2L8 14.2l-5.5-3.1V4.9z" /><path d="M2.5 4.9L8 8l5.5-3.1M8 8v6.2" /></>,
  image: <><rect x="1.8" y="2.8" width="12.4" height="10.4" rx="2" /><circle cx="5.6" cy="6.2" r="1.3" /><path d="M2.2 12l3.8-3.6 2.6 2.3 2.2-1.9 3.2 2.9" /></>,
  play: <path d="M5 3.2v9.6L12.8 8z" />,
  check: <path d="M3 8.5l3 3 7-7" />,
  arrow: <path d="M3 8h10M9 4l4 4-4 4" />,
  target: <><circle cx="8" cy="8" r="6" /><circle cx="8" cy="8" r="3" /><circle cx="8" cy="8" r="0.6" /></>,
  signal: <path d="M5 11a4.2 4.2 0 0 1 0-6M11 5a4.2 4.2 0 0 1 0 6M3 13a7 7 0 0 1 0-10M13 3a7 7 0 0 1 0 10" />,
};
export const Icon: React.FC<{ name: string; size: number; color?: string; stroke?: number; fill?: string; style?: React.CSSProperties }> = ({ name, size, color = C.ink, stroke = 1.5, fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", ...style }}>{ICON[name]}</svg>
);

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number }> = ({ style, children, radius = R.card }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: radius, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, overflow: "hidden", ...style }}>{children}</div>
);

/** The site's primary button: accent blue pill, white label, arrow. */
export const Button: React.FC<{ size?: number; label?: string; press?: number; grey?: boolean; style?: React.CSSProperties }> = ({ size = 26, label = "Start a project", press = 0, grey, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.62}px ${size * 1.05}px`, borderRadius: R.pill,
    background: grey ? C.card2 : C.blue, color: grey ? C.txt3 : "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap",
    boxShadow: grey ? `inset 0 0 0 1.5px ${C.line}` : `0 14px 30px -14px ${rgba(C.blue, 0.7)}`, transform: `scale(${1 - 0.06 * press})`, ...style }}>
    {label}<Icon name="arrow" size={size * 0.9} color={grey ? C.txt3 : "#fff"} stroke={1.8} />
  </div>
);

/** A pill badge (white, hairline edge) with an optional leading dot. */
export const Tag: React.FC<{ children: React.ReactNode; size?: number; dot?: string; style?: React.CSSProperties }> = ({ children, size = 24, dot, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: R.pill, background: C.card,
    boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, fontWeight: 600, fontSize: size, color: C.ink, whiteSpace: "nowrap", letterSpacing: "-0.01em", ...style }}>
    {dot && <span style={{ width: size * 0.42, height: size * 0.42, borderRadius: "50%", background: dot }} />}{children}
  </div>
);

/** The cursor. */
export const Cursor: React.FC<{ x: number; y: number; s?: number; press?: number; o?: number }> = ({ x, y, s = 1, press = 0, o = 1 }) => (
  <svg width={40 * s} height={48 * s} viewBox="0 0 22 26" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: o, transform: `scale(${1 - 0.14 * press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(5,15,25,.22))" }}>
    <path d="M2 1.5v19l5.2-4.6 3.4 7.6 3.3-1.5-3.3-7.4 7.1-.4z" fill={C.ink} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

/** The "wkc" mark (filled), revealed left to right by a soft wipe (`reveal` 0..1), like a pen writing it. */
export const Mark: React.FC<{ w: number; color?: string; reveal?: number; id: string; style?: React.CSSProperties }> = ({ w, color = C.ink, reveal = 1, id, style }) => {
  const h = (w * 462.37) / 999.08;
  return (
    <svg width={w} height={h} viewBox={WKC_VIEWBOX} style={{ overflow: "visible", flex: "none", ...style }}>
      {reveal < 1 && (
        <defs>
          <linearGradient id={`${id}g`} x1="0" x2="1" y1="0" y2="0">
            <stop offset={Math.max(0, reveal * 1.15 - 0.15)} stopColor="#fff" /><stop offset={Math.max(0.001, reveal * 1.15)} stopColor="#000" />
          </linearGradient>
          <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="1040" height="510"><rect x="-20" y="-20" width="1040" height="510" fill={`url(#${id}g)`} /></mask>
        </defs>
      )}
      <path d={WKC_D} fill={color} mask={reveal < 1 ? `url(#${id}m)` : undefined} />
    </svg>
  );
};
