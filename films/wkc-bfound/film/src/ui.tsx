// Shared pieces of the Minimal Gradient SaaS look, in both brands: frosted-glass tiles, the two marks, translucent app
// windows, cables with travelling pulses, monoline glyphs, gradient-keyed headlines, the cursor.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, GLASS, GRAD, clamp01, lerp, rgba } from "./lib";
import { WKC_D, WKC_VIEWBOX } from "./mark";
import { T } from "./clock";
import { ARRIVE } from "./lib";

/** The wkc mark, filled (optionally with the film's gradient), revealed left to right by a soft wipe. */
export const WkcMark: React.FC<{ w: number; color?: string; reveal?: number; id: string; grad?: boolean; style?: React.CSSProperties }> = ({ w, color = C.ink, reveal = 1, id, grad, style }) => {
  const h = (w * 462.37) / 999.08;
  return (
    <svg width={w} height={h} viewBox={WKC_VIEWBOX} style={{ overflow: "visible", flex: "none", display: "block", ...style }}>
      <defs>
        {grad && <linearGradient id={`${id}f`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={C.wkc} /><stop offset="1" stopColor={C.wkcInk} /></linearGradient>}
        {reveal < 1 && (
          <>
            <linearGradient id={`${id}g`} x1="0" x2="1" y1="0" y2="0">
              <stop offset={Math.max(0, reveal * 1.15 - 0.15)} stopColor="#fff" /><stop offset={Math.max(0.001, reveal * 1.15)} stopColor="#000" />
            </linearGradient>
            <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="1040" height="510"><rect x="-20" y="-20" width="1040" height="510" fill={`url(#${id}g)`} /></mask>
          </>
        )}
      </defs>
      <path d={WKC_D} fill={grad ? `url(#${id}f)` : color} mask={reveal < 1 ? `url(#${id}m)` : undefined} />
    </svg>
  );
};

/** bFound's logo (the site's PNG, 1831×466); `mark` shows only the b-loop with its sparkle. */
export const BfLogo: React.FC<{ h: number; mark?: boolean; style?: React.CSSProperties }> = ({ h, mark, style }) => {
  const w = (h * 1831) / 466, mw = h * 1.02;
  return (
    <div style={{ width: mark ? mw : w, height: h, overflow: "hidden", flex: "none", position: "relative", ...style }}>
      <Img src={staticFile("img/bfound-logo.png")} style={{ position: "absolute", left: 0, top: 0, width: w, height: h }} />
    </div>
  );
};

/** A frosted-glass tile: rounded square (radius a fifth of the side), white rim, soft shadow, a coloured glow underneath. */
export const Tile: React.FC<{ size: number; glow?: string; glowK?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ size, glow = C.violet, glowK = 0.5, children, style }) => (
  <div style={{ position: "relative", width: size, height: size, flex: "none", ...style }}>
    <div style={{ position: "absolute", left: "8%", right: "8%", top: "30%", bottom: "-14%", borderRadius: "50%", background: rgba(glow, 0.55 * glowK), filter: `blur(${size * 0.18}px)` }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: size * 0.22, ...GLASS, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </div>
);

/** A translucent app window: traffic-light dots, an optional address bar, content. */
export const Window: React.FC<{ w: number; h: number; url?: React.ReactNode; children?: React.ReactNode; style?: React.CSSProperties; radius?: number }> = ({ w, h, url, children, style, radius = 22 }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: radius, ...GLASS, background: "linear-gradient(170deg, rgba(255,255,255,0.94), rgba(255,255,255,0.8))", overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 46, display: "flex", alignItems: "center", gap: 8, padding: "0 18px", borderBottom: `1px solid ${rgba("#C9CEE0", 0.6)}` }}>
      {["#FF6058", "#FFBD2E", "#29C940"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: rgba(c, 0.75) }} />)}
      {url !== undefined && <div style={{ marginLeft: 14, flex: 1, maxWidth: w * 0.6, height: 28, borderRadius: 14, background: rgba("#E9ECF6", 0.9), display: "flex", alignItems: "center", padding: "0 14px", fontFamily: F.ui, fontSize: 16, color: C.txt2, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden" }}>{url}</div>}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 46, bottom: 0 }}>{children}</div>
  </div>
);

/** A skeleton line (detail that needn't be read). */
export const Skel: React.FC<{ w: number | string; h?: number; c?: string; style?: React.CSSProperties }> = ({ w, h = 10, c = "#E3E6F0", style }) => (
  <div style={{ width: w, height: h, borderRadius: h, background: c, flex: "none", ...style }} />
);

// ---------- cables ----------
export type P = [number, number];
/** A cubic cable from a to b, bowing by `bend` (fraction of the distance) perpendicular to it. */
export const cablePath = (a: P, b: P, bend = 0.18): { d: string; at: (u: number) => P } => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const c1: P = [a[0] + dx * 0.3 + nx * L * bend, a[1] + dy * 0.3 + ny * L * bend], c2: P = [a[0] + dx * 0.7 + nx * L * bend, a[1] + dy * 0.7 + ny * L * bend];
  const at = (u: number): P => {
    const m = 1 - u;
    return [m * m * m * a[0] + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u * u * u * b[0], m * m * m * a[1] + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u * u * u * b[1]];
  };
  return { d: `M${a[0]},${a[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${b[0]},${b[1]}`, at };
};
/** A cable drawn to `k` (0..1) with pulses travelling along it (`flow` = pulses per second, 0 for none). */
export const Cable: React.FC<{ id: string; a: P; b: P; k: number; o?: number; bend?: number; t: number; flow?: number; dashed?: boolean; width?: number; colorA?: string; colorB?: string }> = ({
  id, a, b, k, o = 1, bend = 0.18, t, flow = 1.2, dashed, width = 3, colorA = C.wkc, colorB = C.bf }) => {
  if (k <= 0 || o <= 0.001) return null;
  const { d, at } = cablePath(a, b, bend);
  const n = Math.max(0, Math.round(flow * 2));
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id={`cg${id}`} gradientUnits="userSpaceOnUse" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}><stop offset="0" stopColor={colorA} /><stop offset="1" stopColor={colorB} /></linearGradient>
      </defs>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={width + 5} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
      <path d={d} fill="none" stroke={`url(#cg${id})`} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={dashed ? "0.012 0.014" : `${k} 1`} opacity={dashed ? 0.6 : 1} />
      {k >= 1 && Array.from({ length: n }, (_, i) => {
        const u = (((t * flow * 0.5 + i / n) % 1) + 1) % 1, [x, y] = at(u), f = Math.sin(Math.PI * u);
        return <g key={i} opacity={f}><circle cx={x} cy={y} r={11} fill={rgba(lerpColor(colorA, colorB, u), 0.22)} /><circle cx={x} cy={y} r={5} fill="#fff" stroke={lerpColor(colorA, colorB, u)} strokeWidth={2.5} /></g>;
      })}
      {[a, b].map((p, i) => (k >= (i ? 1 : 0.02)) && <circle key={i} cx={p[0]} cy={p[1]} r={6} fill="#fff" stroke={i ? colorB : colorA} strokeWidth={3} />)}
    </g>
  );
};
const lerpColor = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(k))).toString(16).padStart(2, "0")).join("");
};

// ---------- glyphs (monoline, 24-px grid) ----------
const G: Record<string, React.ReactNode> = {
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  unlock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 7.6-1.7" /></>,
  store: <><path d="M4 9l1.5-4.5h13L20 9" /><path d="M4 9h16v1.5a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0z" /><path d="M5.5 12.5V20h13v-7.5M10 20v-4.5h4V20" /></>,
  bag: <><rect x="4" y="8" width="16" height="12" rx="2.5" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  building: <><rect x="6" y="4" width="12" height="16" rx="1.5" /><path d="M9.5 8h1M13.5 8h1M9.5 11.5h1M13.5 11.5h1M9.5 15h1M13.5 15h1M11 20v-2.5h2V20" /></>,
  rocket: <><path d="M12 3c3 2 4.5 5 4.5 8.5L14 15h-4l-2.5-3.5C7.5 8 9 5 12 3z" /><path d="M10 15l-1.5 3.5M14 15l1.5 3.5M12 9.2v.1" /></>,
  cart: <><path d="M3.5 5h2.2l2 10h10l2-7H7" /><circle cx="9" cy="19" r="1.3" /><circle cx="17" cy="19" r="1.3" /></>,
  chart: <><path d="M4 20h16" /><path d="M7 16v-4M12 16V8M17 16v-7" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  thumb: <><path d="M7 11v9H4.5v-9z" /><path d="M7 11l3.5-7c1.4 0 2.3 1 2 2.4L12 10h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7" /></>,
  heart: <path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z" />,
  clap: <><path d="M8 12l4.5-6.5a1.4 1.4 0 0 1 2.3 1.6L12 11" /><path d="M7.2 9.5l5-6M6 13.5l-1 1a5.5 5.5 0 0 0 7.8 7.8l5.8-5.8a1.5 1.5 0 0 0-2.1-2.1l-2 2" /></>,
  comment: <path d="M4.5 6.5h15v9.5H10l-4.5 3.5v-3.5h-1z" />,
  film: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M3.5 9.5h17M3.5 14.5h17M8 5.5v13M16 5.5v13" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  spark: <path d="M12 3.5l1.8 6.7 6.7 1.8-6.7 1.8-1.8 6.7-1.8-6.7-6.7-1.8 6.7-1.8z" />,
  tag: <><path d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5l8 8a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z" /><circle cx="8.3" cy="8.3" r="1.4" /></>,
};
export const Glyph: React.FC<{ name: string; size: number; color?: string; stroke?: number; fill?: string; style?: React.CSSProperties }> = ({ name, size, color = C.bf, stroke = 1.7, fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", display: "block", ...style }}>{G[name]}</svg>
);

/** A word filled with the film's gradient (WKConversions blue → bFound indigo). */
export const GradText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", paddingBottom: "0.08em", ...style }}>{children}</span>
);

/** A headline that builds word by word on the spoken words (blur-rise) and leaves as one block. Key words carry the gradient. */
export type HW = { t: string; at: string | number; key?: boolean; grey?: boolean; brand?: "wkc" | "bf" };
export const Headline: React.FC<{ g: number; lines: HW[][]; x: number; y: number; size: number; align?: "left" | "center"; out?: string | number; outDur?: number; lh?: number; width?: number }> = ({
  g, lines, x, y, size, align = "left", out, outDur = 0.3, lh = 1.04, width = 1500 }) => {
  const o = out !== undefined ? T.k(g, out, outDur, ARRIVE) : 0;
  if (o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - width / 2 : x, top: y, width, textAlign: align, fontFamily: F.display, fontWeight: 800, fontSize: size, lineHeight: lh,
      letterSpacing: "-0.05em", color: C.ink, opacity: 1 - o, transform: `translateY(${-o * 24}px)`, filter: o > 0 ? `blur(${o * 8}px)` : undefined }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", gap: size * 0.24, justifyContent: align === "center" ? "center" : "flex-start", whiteSpace: "nowrap" }}>
          {ln.map((w, i) => {
            const k = T.k(g, w.at, 0.45);
            if (k <= 0) return <span key={i} style={{ opacity: 0 }}>{w.t}</span>;
            const inner = w.key ? <GradText>{w.t}</GradText> : w.t;
            return <span key={i} style={{ display: "inline-block", opacity: Math.min(1, k * 1.6), transform: `translateY(${(1 - k) * 0.3 * size}px)`, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, color: w.grey ? C.grey : w.brand === "wkc" ? C.wkc : w.brand === "bf" ? C.bf : undefined }}>{inner}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

/** Widely tracked uppercase label (the style's small labels). */
export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 24, color = "#6366A8", style }) => (
  <div style={{ fontFamily: F.ui, fontSize: size, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color, whiteSpace: "nowrap", ...style }}>{children}</div>
);

export const Cursor: React.FC<{ x: number; y: number; s?: number; press?: number; o?: number }> = ({ x, y, s = 1, press = 0, o = 1 }) => (
  <svg width={40 * s} height={48 * s} viewBox="0 0 22 26" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: o, transform: `scale(${1 - 0.14 * press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(11,19,36,.22))" }}>
    <path d="M2 1.5v19l5.2-4.6 3.4 7.6 3.3-1.5-3.3-7.4 7.1-.4z" fill={C.ink} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);
