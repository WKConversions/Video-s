// Digital Marketing Málaga: the shared kit. Every scene imports from here; nothing scene-specific lives here.
// Brand from digitalmarketingmalaga.com (harvest/facts.md): charcoal #2C2C31, cyan #49D8ED → #9EE6FD (the logo wave),
// Albert Sans (site type), the serif logotype (Source Serif 4), the topographic contour texture, the cyan pills.
import React from "react";
import { continueRender, delayRender, Easing, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { WORDS } from "./words";
import { topoPath, TopoOpts } from "./topo";

// ------------------------------------------------------------------ clock
export const FPS = 60, DUR = 36.4, VO = 0.4, W = 1920, H = 1080, CX = 960, CY = 540;
/** film time (s) of a VO word's start / end; keys in ./words (repeats numbered: great2, malaga3 ...) */
export const w = (key: string) => WORDS[key][0] + VO;
export const we = (key: string) => WORDS[key][1] + VO;

// ------------------------------------------------------------------ brand
export const C = {
  char: "#2C2C31", charD: "#232327", charL: "#38383F", white: "#FFFFFF", paper: "#F5F5F5", ink: "#2C2C31", grey: "#9A999E", greyD: "#5F5E64",
  cyan: "#49D8ED", cyanL: "#9EE6FD", cyanD: "#1FB9D2", blue: "#066AAB", line: "rgba(255,255,255,0.10)", lineDark: "rgba(44,44,49,0.10)",
};
export const GRAD = `linear-gradient(90deg, ${C.cyan}, ${C.cyanL})`;
export const SANS = "Albert Sans", SERIF = "Source Serif 4";
/** even all-round soft shadows (Apple style): no offset, layered; on charcoal they read as a soft lift */
export const SHADOW = "0 0 2px rgba(0,0,0,0.10), 0 0 30px rgba(0,0,0,0.16), 0 0 100px rgba(0,0,0,0.22)";
export const SHADOW_L = "0 0 2px rgba(20,24,30,0.06), 0 0 28px rgba(20,24,30,0.08), 0 0 90px rgba(20,24,30,0.11)";   // on white
export const GLOW = "0 0 24px rgba(73,216,237,0.45), 0 0 70px rgba(73,216,237,0.25)";

const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[400, 500, 600, 700, 800].map((wt) => loadFont({ family: SANS, url: staticFile("fonts/albertsans.woff2"), weight: String(wt) })),
    ...[600, 700].map((wt) => loadFont({ family: SERIF, url: staticFile("fonts/sourceserif4.woff2"), weight: String(wt) })),
  ]).then(() => fh !== null && continueRender(fh));
}

// ------------------------------------------------------------------ timing helpers
export const OUT = Easing.bezier(0.22, 1, 0.36, 1), INOUT = Easing.bezier(0.65, 0, 0.35, 1), IN = Easing.bezier(0.55, 0, 0.9, 0.4);
export const SOFT = Easing.bezier(0.4, 0, 0.15, 1), SINE = Easing.bezier(0.37, 0, 0.63, 1);
export const c01 = (x: number) => Math.min(1, Math.max(0, x));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
/** eased progress from a over d seconds */
export const k = (t: number, a: number, d: number, e: (x: number) => number = OUT) => e(c01((t - a) / d));
/** an under-damped spring 0 → 1 from a (f in Hz, z damping 0..1); overshoots a little when z < 0.7 */
export const sp = (t: number, a: number, f = 1.8, z = 0.65) => {
  const u = t - a; if (u <= 0) return 0; const om = 2 * Math.PI * f, wd = om * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * om * u) * (Math.cos(wd * u) + ((z * om) / wd) * Math.sin(wd * u));
};
/** in-hold-out window: 0 before a, rises over din, holds, falls over dout ending at b */
export const win = (t: number, a: number, b: number, din = 0.35, dout = 0.35) => Math.min(k(t, a, din), 1 - k(t, b - dout, dout, INOUT));
/** deterministic pseudo-random in [0, 1) */
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ------------------------------------------------------------------ the topographic field
/** the site's contour texture, alive. reveal: a soft circle (x, y, r) outside which the lines are hidden (to draw the map in from a point). */
export const Topo: React.FC<{ o: TopoOpts; color?: string; width?: number; opacity?: number; reveal?: { x: number; y: number; r: number; soft?: number }; id?: string; style?: React.CSSProperties }> =
  ({ o, color = C.line, width = 2, opacity = 1, reveal, id = "topo", style }) => {
    const d = topoPath(o); const Wd = o.w ?? W, Hd = o.h ?? H;
    return (
      <svg width={Wd} height={Hd} viewBox={`0 0 ${Wd} ${Hd}`} style={{ position: "absolute", left: 0, top: 0, opacity, ...style }}>
        {reveal && <defs>
          <radialGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" cx={reveal.x} cy={reveal.y} r={Math.max(1, reveal.r)}>
            <stop offset={`${Math.max(0, 1 - (reveal.soft ?? 0.35)) * 100}%`} stopColor="#fff" /><stop offset="100%" stopColor="#000" /></radialGradient>
          <mask id={`${id}-m`}><rect width={Wd} height={Hd} fill={`url(#${id}-g)`} /></mask></defs>}
        <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" mask={reveal ? `url(#${id}-m)` : undefined} />
      </svg>
    );
  };

// ------------------------------------------------------------------ the wave mark (from the logo), as a stroke
export const MARK_D = "M5 67 C8 42 16 25 28 25 C40 25 45 79 57 79 C71 79 89 11 104 11 C119 11 125 69 136 69 C140 69 144 66 146 62";
let gid = 0;
/** the logo's wave mark; width in px (height = width * 90 / 160); p draws it on (0..1), dot pops the dot (0..1) */
export const WaveMark: React.FC<{ width: number; p?: number; dot?: number; style?: React.CSSProperties; flat?: string }> = ({ width, p = 1, dot = 1, style, flat }) => {
  const id = React.useMemo(() => `wm${gid++}`, []);
  return (
    <svg width={width} height={(width * 90) / 160} viewBox="0 0 160 90" style={{ overflow: "visible", ...style }}>
      <defs><linearGradient id={id} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.cyanL} /></linearGradient></defs>
      <path d={MARK_D} pathLength={1} stroke={flat ?? `url(#${id})`} strokeWidth={14} strokeLinecap="round" fill="none" strokeDasharray={`${c01(p)} 2`} />
      <circle cx={155} cy={51} r={6.6 * c01(dot)} fill={flat ?? C.cyanL} />
    </svg>
  );
};

/** a wave stretched between two points: the connection line. cycles along the line, amp in px, phase travels it,
 *  p draws it from (x1, y1) to (x2, y2), dot pops a dot at the end. Absolute-positioned in a 1920 x 1080 frame. */
export const WaveLink: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; cycles?: number; amp?: number; phase?: number; width?: number; dot?: number; color?: string; taper?: boolean }> =
  ({ x1, y1, x2, y2, p = 1, cycles = 2.5, amp = 26, phase = 0, width = 9, dot = 0, color, taper = true }) => {
    const id = React.useMemo(() => `wl${gid++}`, []);
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L; const N = 140; const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const u = (i / N) * c01(p); const env = taper ? Math.sin(Math.PI * Math.min(1, u / Math.max(0.001, c01(p)))) ** 0.6 : 1;
      const a = amp * env * Math.sin(u * cycles * Math.PI * 2 + phase);
      pts.push(`${(x1 + dx * u + nx * a).toFixed(1)},${(y1 + dy * u + ny * a).toFixed(1)}`);
    }
    const ex = x1 + dx * c01(p), ey = y1 + dy * c01(p);
    return (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.cyanL} /></linearGradient></defs>
        {p > 0.002 && <polyline points={pts.join(" ")} stroke={color ?? `url(#${id})`} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
        {dot > 0 && <circle cx={ex} cy={ey} r={width * 0.95 * c01(dot)} fill={color ?? C.cyanL} />}
      </svg>
    );
  };

// ------------------------------------------------------------------ the logotype
/** "Digital / Marketing / Málaga" in the logo serif with the wave mark; size = font size in px. p builds it (lines rise, mark draws). */
export const Logo: React.FC<{ size: number; p?: number; color?: string; mark?: boolean; style?: React.CSSProperties }> = ({ size, p = 1, color = C.white, mark = true, style }) => {
  const lines = ["Digital", "Marketing", "Málaga"];
  return (
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 0.98, color, letterSpacing: "-0.012em", fontVariationSettings: "'opsz' 60", ...style }}>
      {lines.map((l, i) => { const q = c01((p - i * 0.14) / 0.5); const e = OUT(q);
        return <div key={l} style={{ display: "flex", alignItems: "baseline", gap: size * 0.2, opacity: c01(q * 2), transform: `translateY(${(1 - e) * size * 0.45}px)`, filter: q < 0.98 ? `blur(${(1 - e) * 8}px)` : undefined }}>
          <span>{l}</span>
          {i === 2 && mark && <WaveMark width={size * 1.25} p={c01((p - 0.45) / 0.45)} dot={c01((p - 0.86) / 0.14)} style={{ transform: `translateY(${size * 0.1}px)` }} />}
        </div>; })}
    </div>
  );
};

// ------------------------------------------------------------------ type
/** word-by-word type rising out of a blur; times: one start per word (or at + j * gap) */
export const Rise: React.FC<{ text: string; t: number; at: number; size: number; color?: string; weight?: number; serif?: boolean; gap?: number; times?: number[]; out?: number; spacing?: string; style?: React.CSSProperties; grad?: boolean }> =
  ({ text, t, at, size, color = C.white, weight = 700, serif, gap = 0.07, times, out = 0, spacing, style, grad }) => (
    <div style={{ fontFamily: serif ? SERIF : SANS, fontWeight: weight, fontSize: size, color, lineHeight: 1.06, letterSpacing: spacing ?? (serif ? "-0.01em" : "-0.025em"), whiteSpace: "nowrap", ...style }}>
      {text.split(" ").map((wd, j) => { const q = c01(sp(t, times ? times[j] : at + j * gap, 1.7, 0.72)); const o = c01(out);
        return <span key={j} style={{ display: "inline-block", marginRight: "0.24em", opacity: c01(q * 1.6) * (1 - o), transform: `translateY(${(1 - q) * 0.42 * size - o * 0.3 * size}px)`,
          filter: q < 0.97 || o > 0.01 ? `blur(${(1 - q) * 10 + o * 10}px)` : undefined, ...(grad ? { backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) }}>{wd}</span>; })}
    </div>
  );

// ------------------------------------------------------------------ components from the site
/** their pill buttons: cyan ("JOIN US", "OK, spam me") or dark ("Read More"); press = time of the press (springs back) */
export const Pill: React.FC<{ text: string; t: number; size?: number; dark?: boolean; press?: number; style?: React.CSSProperties }> = ({ text, t, size = 40, dark, press, style }) => {
  const pr = press !== undefined && t > press ? 1 - 0.07 * Math.sin(Math.min(Math.PI, (t - press) * 11)) * Math.exp(-(t - press) * 3) : 1;
  return <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: size * 2.1, padding: `0 ${size * 1.25}px`, borderRadius: size * 1.05, background: dark ? C.char : C.cyan,
    color: dark ? "#F7F8FA" : C.char, fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: "0.02em", boxShadow: dark ? SHADOW_L : GLOW, transform: `scale(${pr})`, whiteSpace: "nowrap", ...style }}>{text}</div>;
};

/** a rounded photo card (the hero's scattered photos) */
export const Photo: React.FC<{ src: string; w: number; h: number; r?: number; zoom?: number; pos?: string; shadow?: string; style?: React.CSSProperties; children?: React.ReactNode }> =
  ({ src, w: wd, h: ht, r = 18, zoom = 1, pos = "50% 50%", shadow = SHADOW, style, children }) => (
    <div style={{ width: wd, height: ht, borderRadius: r, overflow: "hidden", boxShadow: shadow, position: "relative", background: C.charL, ...style }}>
      <Img src={staticFile(`img/${src}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos }} />
      {children}
    </div>
  );

/** one of their event banners (img/banner-<name>.png: tatiana, yago, charlie are 1600 px wide; reddit, human, ferdinand, vanessa, aiseo, nicole are ~700 px: keep those under ~900 px wide) */
export const Banner: React.FC<{ name: string; w: number; style?: React.CSSProperties; shadow?: string }> = ({ name, w: wd, style, shadow = SHADOW }) => (
  <div style={{ width: wd, height: wd * 0.546, borderRadius: wd * 0.022, overflow: "hidden", boxShadow: shadow, background: C.char, ...style }}>
    <Img src={staticFile(`img/banner-${name}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

/** a speech / chat bubble in their palette; side "l" (incoming, white) or "r" (outgoing, cyan) */
export const Bubble: React.FC<{ children: React.ReactNode; side?: "l" | "r"; size?: number; style?: React.CSSProperties }> = ({ children, side = "l", size = 30, style }) => (
  <div style={{ display: "inline-block", maxWidth: size * 16, padding: `${size * 0.5}px ${size * 0.7}px`, borderRadius: size * 0.9, borderBottomLeftRadius: side === "l" ? size * 0.2 : size * 0.9,
    borderBottomRightRadius: side === "r" ? size * 0.2 : size * 0.9, background: side === "r" ? C.cyan : "#FFFFFF", color: C.char, fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: 1.25, boxShadow: SHADOW_L, ...style }}>{children}</div>
);

export const Center: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
