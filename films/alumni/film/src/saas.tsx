// The minimal-gradient-SaaS kit (library style `minimal-gradient-saas`), built from Alumni's own colours (lib.tsx):
// a grainy mesh gradient glowing up through a white frame, frosted-glass tiles and app windows, thin cables with
// travelling orbs, and type whose key phrase is filled with the palette gradient.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, G, GRAD, M, clamp01, mix } from "./lib";

/** The canvas: near-white where the type sits, a slow mesh of the palette's hues in the corners, and the grain.
 *  `tint` 0 → 1 moves the hue balance (a new chapter); `bloom` lifts the gradient's saturation. */
export const Mesh: React.FC<{ g: number; tint?: number; bloom?: number }> = ({ g, tint = 0, bloom = 1 }) => {
  const t = g / 30;
  const blobs = [
    { x: 0.06, y: 0.1, r: 900, c: mixHex(M.a, M.c, tint), sx: 60, sy: 40, p: 0 },
    { x: 0.96, y: 0.06, r: 820, c: mixHex(M.b, M.d, tint), sx: 50, sy: 50, p: 2 },
    { x: 0.92, y: 0.98, r: 980, c: mixHex(M.c, M.a, tint), sx: 70, sy: 40, p: 4 },
    { x: 0.04, y: 0.96, r: 760, c: mixHex(M.d, M.b, tint), sx: 40, sy: 60, p: 1 },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", background: C.paper }}>
      {blobs.map((b, i) => {
        const x = b.x * 1920 + Math.sin(t * 0.55 + b.p) * b.sx * 2.2, y = b.y * 1080 + Math.cos(t * 0.45 + b.p * 1.3) * b.sy * 2.2;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: b.r * 2, height: b.r * 2, borderRadius: "50%",
          transform: `translate(${x - b.r}px, ${y - b.r}px)`, opacity: 0.9 * bloom,
          background: `radial-gradient(circle at 50% 50%, ${b.c} 0%, ${b.c}CC 22%, ${b.c}55 48%, ${b.c}00 70%)` }} />;
      })}
      {/* the white frame the type sits in */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 62% 58% at 50% 50%, ${C.paper}F2 0%, ${C.paper}C0 45%, ${C.paper}00 78%)` }} />
    </div>
  );
};

/** Fixed grain over everything (never moves: it breaks banding without adding motion). */
export const Grain: React.FC<{ o?: number }> = ({ o = 0.055 }) => (
  <Img src={staticFile("img/grain.png")} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o, mixBlendMode: "overlay", pointerEvents: "none" }} />
);

/** Frosted glass: the style's tile and window surface (faked without backdrop-filter, which renders slowly). */
export const glass = (glow = G.a, o = 1): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(255,255,255,${0.9 * o}) 0%, rgba(255,255,255,${0.72 * o}) 100%)`,
  border: "1.5px solid rgba(255,255,255,0.95)",
  boxShadow: `0 1px 0 rgba(255,255,255,0.9) inset, 0 30px 60px -18px ${glow}66, 0 18px 40px rgba(18,38,30,0.10)`,
});

/** A positioned box (transform placement, so slow moves glide instead of stepping a pixel at a time). */
export const Box: React.FC<{ x: number; y: number; w: number; h: number; s?: number; r?: number; o?: number; rot?: number; blur?: number; z?: number;
  style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, s = 1, r = 28, o = 1, rot = 0, blur = 0, z, style, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, opacity: o, zIndex: z,
    transform: `translate(${x - w / 2}px, ${y - h / 2}px) scale(${s}) rotate(${rot}deg)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, ...style }}>
    {children}
  </div>
);

/** An app window: frosted, traffic-light dots, an optional title. */
export const Win: React.FC<{ x: number; y: number; w: number; h: number; s?: number; o?: number; rot?: number; blur?: number; title?: string; glow?: string;
  z?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, s = 1, o = 1, rot = 0, blur = 0, title, glow, z, style, children }) => (
  <Box x={x} y={y} w={w} h={h} s={s} o={o} rot={rot} blur={blur} r={26} z={z} style={{ ...glass(glow), overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", left: 22, top: 20, display: "flex", gap: 9 }}>
      {["#FF6159", "#FFBD2E", "#28C941"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85 }} />)}
    </div>
    {title && <div style={{ position: "absolute", left: 0, right: 0, top: 15, textAlign: "center", fontFamily: C.font, fontWeight: 600, fontSize: 18, color: C.muted, letterSpacing: "0.01em" }}>{title}</div>}
    <div style={{ position: "absolute", left: 0, right: 0, top: 52, height: 1, background: "rgba(20,40,32,0.06)" }} />
    {children}
  </Box>
);

/** A skeleton line, where detail isn't needed. */
export const Skel: React.FC<{ w: number; h?: number; o?: number; style?: React.CSSProperties }> = ({ w, h = 14, o = 1, style }) => (
  <div style={{ width: w, height: h, borderRadius: h, background: "rgba(20,48,38,0.09)", opacity: o, ...style }} />
);

/** Type filled with the palette gradient (the key phrase of a line). */
export const Grad: React.FC<{ children: React.ReactNode; k?: number; style?: React.CSSProperties }> = ({ children, k = 0, style }) => (
  <span style={{ backgroundImage: `linear-gradient(90deg, ${GRAD})`, backgroundSize: `${100 + 60 * (1 - k)}% 100%`, WebkitBackgroundClip: "text", backgroundClip: "text",
    color: "transparent", WebkitTextFillColor: "transparent", ...style }}>{children}</span>
);

/** A thin cable: an SVG path drawn by k, picking up the gradient, with an orb travelling at `orb` (0..1) and a glowing end dot. */
export const Cable: React.FC<{ d: string; k: number; orb?: number; w?: number; color?: string; dot?: boolean; id: string; o?: number }> = ({ d, k, orb, w = 3, color, dot = true, id, o = 1 }) => {
  if (k <= 0) return null;
  const nums = (d.match(/-?[0-9.]+/g) ?? []).map(Number), xv = nums.filter((_, i) => i % 2 === 0);
  const xs = [nums[0] ?? 0, xv[xv.length - 1] ?? 1];
  if (Math.abs(xs[1] - xs[0]) < 1) xs[1] = xs[0] + 1;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o, pointerEvents: "none" }}>
      <defs>
        {/* user-space gradient: a straight horizontal cable has a zero-height box, where a bounding-box gradient draws nothing */}
        <linearGradient id={`cg-${id}`} gradientUnits="userSpaceOnUse" x1={xs[0]} x2={xs[1]} y1={0} y2={0}>{color ? <><stop offset="0" stopColor={color} /><stop offset="1" stopColor={color} /></> :
          <><stop offset="0" stopColor={C.orange} /><stop offset="0.3" stopColor={C.amber} /><stop offset="0.62" stopColor={C.lime} /><stop offset="1" stopColor={C.green} /></>}</linearGradient>
        <filter id={`gl-${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <path id={`p-${id}`} d={d} fill="none" stroke={`url(#cg-${id})`} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      {orb !== undefined && orb > 0 && orb < 1 && <Orb pathId={`p-${id}`} d={d} t={orb} id={id} />}
    </svg>
  );
};
// the orb rides the path: its point is computed from an off-screen SVG path element (deterministic per frame)
const pathCache: Record<string, SVGPathElement> = {};
const pointAt = (d: string, t: number) => {
  if (typeof document === "undefined") return { x: 0, y: 0 };
  let p = pathCache[d];
  if (!p) { p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", d); pathCache[d] = p; }
  const L = p.getTotalLength(); const q = p.getPointAtLength(clamp01(t) * L); return { x: q.x, y: q.y };
};
export const Orb: React.FC<{ pathId: string; d: string; t: number; id: string }> = ({ d, t, id }) => {
  const q = pointAt(d, t);
  return (
    <g>
      <circle cx={q.x} cy={q.y} r={16} fill={G.a} opacity={0.45} filter={`url(#gl-${id})`} />
      <circle cx={q.x} cy={q.y} r={7} fill="#FFFFFF" stroke={G.deep} strokeWidth={3} />
    </g>
  );
};
export { pointAt };

/** A small rounded label chip. */
export const Chip: React.FC<{ text: string; size?: number; on?: number; icon?: React.ReactNode; style?: React.CSSProperties }> = ({ text, size = 24, on = 0, icon, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: size * 2, whiteSpace: "nowrap",
    fontFamily: C.font, fontWeight: 600, fontSize: size, lineHeight: 1, color: on > 0.5 ? "#FFFFFF" : C.ink,
    background: on > 0.5 ? C.deep : "rgba(255,255,255,0.92)", border: on > 0.5 ? "1.5px solid transparent" : `1.5px solid ${C.line}`,
    boxShadow: "0 8px 22px rgba(18,38,30,0.08)", ...style }}>{icon}{text}</div>
);

/** A tracked uppercase label (the style's eyebrow). */
export const Eyebrow: React.FC<{ text: string; size?: number; style?: React.CSSProperties }> = ({ text, size = 20, style }) => (
  <div style={{ fontFamily: C.font, fontWeight: 600, fontSize: size, letterSpacing: "0.32em", textTransform: "uppercase", color: C.muted, whiteSpace: "nowrap", ...style }}>{text}</div>
);

/** Monoline icons (muted ink; `grad` fills the stroke with the palette gradient). */
export const Icon: React.FC<{ name: string; size?: number; color?: string; sw?: number }> = ({ name, size = 40, color = C.ink, sw = 2.2 }) => {
  const P: Record<string, React.ReactNode> = {
    cap: <><path d="M4 18 L24 9 L44 18 L24 27 Z" /><path d="M12 22 V31 C16 35 32 35 36 31 V22" /><path d="M44 18 V28" /></>,
    briefcase: <><rect x="6" y="15" width="36" height="25" rx="5" /><path d="M17 15 V11 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 V15" /><path d="M6 26 H42" /></>,
    building: <><rect x="10" y="6" width="22" height="36" rx="3" /><path d="M32 18 H40 V42 H32" /><path d="M16 13 h2 M24 13 h2 M16 20 h2 M24 20 h2 M16 27 h2 M24 27 h2 M19 42 v-7 h4 v7" /></>,
    users: <><circle cx="18" cy="17" r="6" /><path d="M7 38 c0 -7 5 -11 11 -11 s11 4 11 11" /><circle cx="33" cy="15" r="5" /><path d="M31 26 c6 0 10 4 10 10" /></>,
    link: <><path d="M20 28 l8 -8" /><path d="M22 14 l4 -4 a8 8 0 0 1 11 11 l-4 4" /><path d="M26 34 l-4 4 a8 8 0 0 1 -11 -11 l4 -4" /></>,
    globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41" /><path d="M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
    pin: <><path d="M24 43 c-9 -10 -14 -17 -14 -24 a14 14 0 0 1 28 0 c0 7 -5 14 -14 24 Z" /><circle cx="24" cy="19" r="5" /></>,
    spark: <><path d="M24 6 L27 21 L42 24 L27 27 L24 42 L21 27 L6 24 L21 21 Z" /></>,
    arrow: <><path d="M8 24 H38" /><path d="M28 14 L38 24 L28 34" /></>,
    plane: <><path d="M6 27 L42 13 L35 38 L25 30 L18 37 L18 28 Z" /><path d="M18 28 L42 13" /></>,
    check: <><path d="M10 25 L20 34 L38 14" /></>,
    chat: <><path d="M8 12 a5 5 0 0 1 5 -5 h22 a5 5 0 0 1 5 5 v14 a5 5 0 0 1 -5 5 H20 l-8 7 v-7 h0 a5 5 0 0 1 -4 -5 Z" /></>,
    search: <><circle cx="21" cy="21" r="12" /><path d="M30 30 L41 41" /></>,
    star: <><path d="M24 7 l5 11 12 1 -9 8 3 12 -11 -7 -11 7 3 -12 -9 -8 12 -1 Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={sw * (48 / size) * (size / 40)} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>{P[name]}</svg>;
};

/** A round avatar with initials on the palette gradient (no invented faces). */
export const Avatar: React.FC<{ i: string; size?: number; hue?: number; style?: React.CSSProperties }> = ({ i, size = 64, hue = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: size, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.font, fontWeight: 700,
    fontSize: size * 0.36, color: "#FFFFFF", background: `linear-gradient(135deg, ${[G.deep, G.a, G.c, G.b][hue % 4]}, ${[G.a, G.c, G.b, G.deep][hue % 4]})`,
    border: "3px solid #FFFFFF", boxShadow: "0 8px 20px rgba(18,38,30,0.14)", ...style }}>{i}</div>
);

// helpers
export function mixHex(a: string, b: string, k: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(mix(v, pb[i], clamp01(k))).toString(16).padStart(2, "0")).join("");
}
