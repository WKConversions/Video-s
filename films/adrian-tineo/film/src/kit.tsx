// The site's parts, rebuilt for the film at twice the site's 1440-px sizes (S = 2) so they read on a phone:
// the ambient field and the paper shell, the wordmark with its dot, eyebrows with the sage status dot, two-tone
// headlines, white cards around a pale well, floating tags, dark buttons with the arrow, the numbered rows, the icons,
// the chrome sculptures (the site's own SVGs and their gradients). Everything is placed with transforms.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, SH } from "./lib";

export const S = 2;

// ---- icons: the site's own symbols (24-unit viewBox, 1.6 stroke, round caps) --------------------------------------------
const PATHS: Record<string, React.ReactNode> = {
  "arrow-up-right": <path d="M6 18 18 6M6 6h12v12" />,
  "arrow-down": <path d="M12 4v16m-6-6 6 6 6-6" />,
  "arrow-right": <path d="M4 12h16m-6-6 6 6-6 6" />,
  lock: <><rect x="6" y="10" width="12" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M5 12h14M12 5v14" />,
  asterisk: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />,
};
export const Icon: React.FC<{ name: keyof typeof PATHS | string; size?: number; color?: string; stroke?: number }> = ({ name, size = 34, color = C.ink, stroke = 1.6 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block", fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", flexShrink: 0 }}>
    {PATHS[name]}
  </svg>
);

// ---- the ambient field and the shell ----------------------------------------------------------------------------------
/** The dark field behind the site (.ambient): a 130° gradient with three blurred blobs. `drift` 0..1 moves the blobs slowly. */
export const Ambient: React.FC<{ drift?: number; style?: React.CSSProperties }> = ({ drift = 0, style }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: `linear-gradient(130deg, ${C.amb0} 10%, ${C.amb1} 48%, ${C.amb2} 75%, ${C.amb3})`, ...style }}>
    <div style={{ position: "absolute", width: 1248, height: 691, borderRadius: "50%", filter: "blur(140px)", background: C.ambBlob, opacity: 0.6,
      transform: `translate3d(${-557 + 60 * drift}px, ${432 - 30 * drift}px, 0) rotate(-35deg)` }} />
    <div style={{ position: "absolute", width: 1248, height: 691, borderRadius: "50%", filter: "blur(140px)", background: "#080808", opacity: 0.9,
      transform: `translate3d(${768 - 50 * drift}px, ${-108 + 20 * drift}px, 0) rotate(-35deg)` }} />
    <div style={{ position: "absolute", width: 1248, height: 691, borderRadius: "50%", filter: "blur(140px)", background: "#EEEEEE", opacity: 0.25,
      transform: `translate3d(${960 - 40 * drift}px, ${864 - 30 * drift}px, 0) rotate(-35deg)` }} />
  </div>
);

/** The site shell: the paper card with its white hairline, 26-px corners (×S) and the deep soft shadow. */
export const Shell: React.FC<{ x: number; y: number; w: number; h: number; r?: number; bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, r = 26 * S, bg = C.paper, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate3d(${x}px, ${y}px, 0)`, background: bg, borderRadius: r,
    border: "2px solid rgba(255,255,255,0.9)", boxShadow: SH.shell, overflow: "hidden", boxSizing: "border-box", ...style }}>{children}</div>
);

// ---- type -----------------------------------------------------------------------------------------------------------
/** The wordmark: "Adrian Tineo" in Manrope 800, −0.066 em, with the round dot on the baseline. */
export const Wordmark: React.FC<{ size?: number; color?: string; dotK?: number }> = ({ size = 50, color = C.ink, dotK = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "baseline", gap: size * 0.2, whiteSpace: "nowrap", fontFamily: F.ui, fontWeight: 800, fontSize: size,
    letterSpacing: -0.066 * size, lineHeight: 1.2, color }}>
    Adrian Tineo
    <span style={{ width: size * 0.24, height: size * 0.24, borderRadius: "50%", background: color, display: "inline-block", transform: `scale(${dotK})` }} />
  </div>
);

/** The status dot (sage, with its faint ring). */
export const StatusDot: React.FC<{ size?: number; k?: number }> = ({ size = 12, k = 1 }) => (
  <span style={{ width: size, height: size, borderRadius: "50%", background: C.dot, boxShadow: `0 0 0 ${size / 2}px rgba(165,190,184,0.11)`, display: "inline-block",
    flexShrink: 0, transform: `scale(${k})` }} />
);

/** An eyebrow: tiny uppercase, 0.2 em tracking, weight 700, optionally led by the status dot. */
export const Eyebrow: React.FC<{ text: string; size?: number; color?: string; dot?: boolean; style?: React.CSSProperties }> = ({ text, size = 20, color = C.ink, dot, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 1.1, fontFamily: F.ui, fontWeight: 700, fontSize: size, letterSpacing: 0.2 * size, lineHeight: 1.5,
    color, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>
    {dot && <StatusDot size={size * 0.66} />}{text}
  </div>
);

/** A headline the site's way: weight 650, −0.054 em, line height 1.08; the second line in the muted grey. On the dark
 *  panel the lines are #F5F5F2 and #AAA9A1. `lines` may hold React nodes for per-word animation. */
export const Headline: React.FC<{ lines: React.ReactNode[]; size?: number; dark?: boolean; align?: "left" | "center"; tight?: number; grey?: number[];
  style?: React.CSSProperties }> = ({ lines, size = 148, dark, align = "left", tight = -0.054, grey = [1], style }) => (
  <div style={{ fontFamily: F.ui, fontWeight: 650, fontSize: size, letterSpacing: tight * size, lineHeight: 1.08, textAlign: align, whiteSpace: "nowrap", ...style }}>
    {lines.map((l, i) => (
      <div key={i} style={{ color: grey.includes(i) ? (dark ? C.onPanel2 : C.grey2) : (dark ? C.onPanel : C.ink) }}>{l}</div>
    ))}
  </div>
);

/** Body copy: muted, generous line height. */
export const Body: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 30, color = C.muted, style }) => (
  <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: size, lineHeight: 1.7, letterSpacing: -0.01 * size, color, ...style }}>{children}</div>
);

// ---- components -----------------------------------------------------------------------------------------------------
/** A service card: white, 16-px corners (×S), 6 px (×S) of padding around a pale well with its number. */
export const Card: React.FC<{ w: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, children, style }) => (
  <div style={{ width: w, height: h, borderRadius: 16 * S, background: C.white, border: `${S}px solid #fff`, padding: 6 * S, boxSizing: "border-box", boxShadow: SH.card,
    overflow: "hidden", ...style }}>{children}</div>
);
export const Well: React.FC<{ w: number | string; h: number; num?: string; bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, num, bg = C.well, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 11 * S, background: bg, overflow: "hidden", ...style }}>
    {children}
    {num && <span style={{ position: "absolute", top: 14 * S, left: 15 * S, fontFamily: F.ui, fontSize: 8 * S, color: C.num, fontWeight: 500 }}>{num}</span>}
  </div>
);

/** A floating tag (.art-tag): near-white, 10-px corners, an icon tile (pale, or dark with a white glyph). */
export const Tag: React.FC<{ text: string; icon?: string; glyph?: string; dark?: boolean; size?: number; style?: React.CSSProperties }> = ({ text, icon, glyph, dark, size = 1, style }) => {
  const z = S * 1.25 * size;
  return (
    <div style={{ display: "inline-flex", gap: 10 * z, alignItems: "center", padding: `${9 * z}px ${13 * z}px ${9 * z}px ${9 * z}px`, background: "rgba(255,255,255,0.95)",
      borderRadius: 10 * z, boxShadow: SH.tag, border: "1px solid rgba(255,255,255,0.6)", fontFamily: F.ui, fontWeight: 500, fontSize: 9 * z, color: C.ink, whiteSpace: "nowrap", ...style }}>
      <span style={{ display: "grid", placeItems: "center", width: 25 * z, height: 25 * z, borderRadius: 7 * z, background: dark ? C.tagDark : C.tile, color: dark ? "#fff" : C.ink,
        fontSize: 16 * z, lineHeight: 1 }}>
        {icon ? <Icon name={icon} size={15 * z} color={dark ? "#fff" : C.ink} stroke={1.8} /> : glyph}
      </span>
      {text}
    </div>
  );
};

/** The dark button (.button-dark) or the white one on the dark panel, with the arrow up-right. `press` 0..1 sinks it. */
export const Button: React.FC<{ text: string; light?: boolean; size?: number; icon?: string; press?: number; style?: React.CSSProperties }> = ({ text, light, size = 1, icon = "arrow-up-right", press = 0, style }) => {
  const z = S * 1.25 * size;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 26 * z, minHeight: 50 * z, padding: `${14 * z}px ${22 * z}px`, boxSizing: "border-box",
      fontFamily: F.ui, fontWeight: 600, fontSize: 12 * z, lineHeight: 1.3, borderRadius: 10 * z, whiteSpace: "nowrap",
      background: light ? C.white : C.btn, color: light ? "#111" : "#fff", border: light ? "none" : `${z * 0.5}px solid ${C.btnEdge}`,
      boxShadow: light ? "none" : SH.btn, transform: `translateY(${-3 * z * press}px)`, ...style }}>
      {text}<Icon name={icon} size={17 * z} color={light ? "#111" : "#fff"} stroke={1.6} />
    </div>
  );
};

/** A text link with its arrow (.text-link). */
export const TextLink: React.FC<{ text: string; icon?: string; size?: number; color?: string }> = ({ text, icon = "arrow-up-right", size = 1, color = C.ink }) => {
  const z = S * 1.25 * size;
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 13 * z, fontFamily: F.ui, fontWeight: 650, fontSize: 12 * z, color, whiteSpace: "nowrap" }}>
    {text}<Icon name={icon} size={16 * z} color={color} /></div>;
};

/** A thin rule (the site's 1-px lines, 2 px in the film). `k` draws it from the left. */
export const Rule: React.FC<{ w: number; k?: number; color?: string; h?: number }> = ({ w, k = 1, color = C.line, h = 2 }) => (
  <div style={{ width: w, height: h, background: color, transformOrigin: "0 50%", transform: `scaleX(${k})` }} />
);

/** A sculpture: one of the site's chrome SVGs (hero-intelligence, service-strategy, service-build, service-performance,
 *  service-enablement), drawn with mix-blend-mode multiply over its well as on the site. */
export const Sculpture: React.FC<{ name: string; size: number; blend?: boolean; style?: React.CSSProperties }> = ({ name, size, blend = true, style }) => (
  <Img src={staticFile(`img/${name}.svg`)} style={{ width: size, height: size, display: "block", mixBlendMode: blend ? "multiply" : undefined, ...style }} />
);

/** The site's chrome gradients, for new sculptures drawn in the same material: put <MetalDefs id="x" /> inside an <svg>
 *  and fill with url(#x-metal), url(#x-bevel), url(#x-glass), url(#x-darkedge), url(#x-orb), url(#x-light). */
export const MetalDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset=".18" stopColor="#EAEAEA" /><stop offset=".44" stopColor="#B7B7B7" /><stop offset=".55" stopColor="#F4F4F4" /><stop offset=".77" stopColor="#CFCFCF" /><stop offset="1" stopColor="#989898" /></linearGradient>
    <linearGradient id={`${id}-bevel`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#6B6B6B" /><stop offset=".08" stopColor="#E9E9E9" /><stop offset=".2" stopColor="#B0B0B0" /><stop offset=".46" stopColor="#787878" /><stop offset=".5" stopColor="#5E5E5E" /><stop offset=".63" stopColor="#C3C3C3" /><stop offset=".85" stopColor="#A0A0A0" /><stop offset="1" stopColor="#606060" /></linearGradient>
    <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#797979" /><stop offset=".2" stopColor="#434343" /><stop offset=".5" stopColor="#181818" /><stop offset=".8" stopColor="#303030" /><stop offset="1" stopColor="#101010" /></linearGradient>
    <linearGradient id={`${id}-darkedge`}><stop stopColor="#525252" /><stop offset=".15" stopColor="#2B2B2B" /><stop offset=".48" stopColor="#111111" /><stop offset=".5" stopColor="#0A0A0A" /><stop offset=".8" stopColor="#252525" /><stop offset="1" stopColor="#4B4B4B" /></linearGradient>
    <radialGradient id={`${id}-orb`} cx=".27" cy=".2" r=".8"><stop stopColor="#fff" /><stop offset=".15" stopColor="#EBEBEB" /><stop offset=".27" stopColor="#BABABA" /><stop offset=".45" stopColor="#757575" /><stop offset=".58" stopColor="#D4D4D4" /><stop offset=".62" stopColor="#F3F3F3" /><stop offset=".68" stopColor="#929292" /><stop offset=".88" stopColor="#272727" /><stop offset="1" stopColor="#6A6A6A" /></radialGradient>
    <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".75" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
    <radialGradient id={`${id}-bg`} cx=".48" cy=".37" r=".67"><stop stopColor="#F8F8F8" /><stop offset=".62" stopColor="#EDEDED" /><stop offset="1" stopColor="#E3E3E3" /></radialGradient>
    <filter id={`${id}-ground`}><feGaussianBlur stdDeviation="23" /></filter>
    <filter id={`${id}-shadow`} x="-40%" y="-60%" width="180%" height="240%"><feDropShadow dx="0" dy="29" stdDeviation="20" floodColor="#1F1F1F" floodOpacity=".24" /></filter>
  </defs>
);
