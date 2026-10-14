// Segment 6 parts: glass tiles/cards with the top-left lit rim, white line glyphs for the platform tiles,
// glowing rings, wipe-masked text and the sample compositor (motion blur + RGB split by averaging copies).
import React from "react";
import { clamp01, lerp } from "./lib";
import { tw } from "./kit";

// ---------- numbers
/** per-frame table starting at frame f0, linear between frames, clamped (or linearly extrapolated) outside */
export const tab = (t: number, f0: number, v: number[], extra = false) => {
  const x = t - f0, n = v.length - 1;
  if (x <= 0) return extra ? v[0] + (v[1] - v[0]) * x : v[0];
  if (x >= n) return extra ? v[n] + (v[n] - v[n - 1]) * (x - n) : v[n];
  const i = Math.floor(x);
  return lerp(v[i], v[i + 1], x - i);
};
/** keyframes [[frame, value]] with Catmull-Rom (smooth velocity) interpolation, clamped outside */
export const spline = (t: number, k: [number, number][]) => {
  if (t <= k[0][0]) return k[0][1];
  const n = k.length - 1;
  if (t >= k[n][0]) return k[n][1];
  let i = 0;
  while (t > k[i + 1][0]) i++;
  const [x1, y1] = k[i], [x2, y2] = k[i + 1];
  const m = (j: number) => {
    const a = k[Math.max(0, j - 1)], b = k[Math.min(n, j + 1)];
    return (b[1] - a[1]) / (b[0] - a[0]);
  };
  const h = x2 - x1, s = (t - x1) / h, m1 = m(i) * h, m2 = m(i + 1) * h;
  const s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * y1 + (s3 - 2 * s2 + s) * m1 + (-2 * s3 + 3 * s2) * y2 + (s3 - s2) * m2;
};
/** linear keyframes, clamped */
export const kl = (t: number, k: [number, number][]) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};
const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** mix two #rrggbb colours */
export const mix = (a: string, b: string, t: number, al = 1) => {
  const A = hx(a), B = hx(b);
  return `rgba(${A.map((v, i) => Math.round(lerp(v, B[i], clamp01(t)))).join(",")},${al})`;
};

// ---------- glass (tiles and cards): a dark pane, a soft drop shadow and a rim lit from the top-left
export type Stop = [number, string, number];
export type Rim = { left: Stop[]; top: Stop[] };
export const RIM_TILE: Rim = {
  left: [[0, "#FFFFFF", 1], [0.6, "#FFFFFF", 1], [0.8, "#8DC0FF", 0.9], [0.93, "#3F8CE8", 0.7], [1, "#1B4FB8", 0.5]],
  top: [[0, "#FFFFFF", 1], [0.1, "#E6F0FD", 1], [0.25, "#8DC0FF", 0.9], [0.5, "#3F8CE8", 0.55], [0.62, "#1B4FB8", 0.3], [0.75, "#1B4FB8", 0]],
};
export const RIM_CARD: Rim = {
  left: [[0, "#FFFFFF", 0.95], [0.12, "#E6F0FD", 0.9], [0.4, "#3F8CE8", 0.85], [1, "#1B4FB8", 0.6]],
  top: [[0, "#FFFFFF", 1], [0.2, "#8DC0FF", 0.85], [0.4, "#3F8CE8", 0.7], [0.7, "#1B4FB8", 0.45], [0.85, "#1B4FB8", 0]],
};
export const RIM_BIG: Rim = {
  left: [[0, "#FFFFFF", 1], [0.33, "#FFFFFF", 1], [0.5, "#8DC0FF", 0.95], [0.75, "#3F8CE8", 0.85], [1, "#1B4FB8", 0.7]],
  top: [[0, "#FFFFFF", 1], [0.33, "#8DC0FF", 0.85], [0.66, "#1B4FB8", 0.6], [0.9, "#1B4FB8", 0]],
};

export const Glass: React.FC<{
  id: string; w: number; h: number; r: number; fill: string; rim: Rim; k?: number; lw?: number; shadow?: string; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ id, w, h, r, fill, rim, k = 1, lw = 2.6, shadow = "0 6px 12px rgba(1,4,10,0.55)", style, children }) => {
  const i = lw / 2, ri = r - i;
  const left = `M ${r} ${h - i} A ${ri} ${ri} 0 0 1 ${i} ${h - r} L ${i} ${r} A ${ri} ${ri} 0 0 1 ${r} ${i}`;
  const top = `M ${r} ${i} L ${w - r} ${i}`;
  const gid = `s6g-${id}-${Math.round(w)}-${Math.round(h)}`;
  return (
    <div style={{ position: "absolute", width: w, height: h, borderRadius: r, background: fill, boxShadow: shadow, ...style }}>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id={`${gid}L`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={h}>
            {rim.left.map(([o, c, a], j) => <stop key={j} offset={o} stopColor={c} stopOpacity={a} />)}
          </linearGradient>
          <linearGradient id={`${gid}T`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={w} y2={0}>
            {rim.top.map(([o, c, a], j) => <stop key={j} offset={o} stopColor={c} stopOpacity={a} />)}
          </linearGradient>
        </defs>
        {([[lw * 3.6, 0.1], [lw * 2, 0.28], [lw, 1]] as [number, number][]).map(([sw, op], j) => (
          <g key={j} opacity={op * k} fill="none" strokeWidth={sw} strokeLinecap="round">
            <path d={left} stroke={`url(#${gid}L)`} />
            <path d={top} stroke={`url(#${gid}T)`} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

// ---------- white line glyphs, drawn in a 40-unit-tall box (ar = width / height)
type GlyphDef = { ar: number; el: (c: string) => React.ReactNode };
const S = (c: string, w: number) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });
const note = (c: string) => (
  <>
    <path d="M19 5 V27.5" {...S(c, 4.4)} />
    <circle cx={12.5} cy={28} r={6.5} fill="none" stroke={c} strokeWidth={4.4} />
    <path d="M19 5 C20 11 24.5 14.5 30.5 14.5" {...S(c, 4.4)} />
  </>
);
export const GLYPHS: Record<string, GlyphDef> = {
  browser: { ar: 1.25, el: (c) => (
    <>
      <rect x={2} y={3} width={46} height={34} rx={6} {...S(c, 3.4)} />
      <path d="M2 13.5 H48" {...S(c, 3)} />
      {[8.5, 14, 19.5].map((x) => <circle key={x} cx={x} cy={8.3} r={1.7} fill={c} />)}
    </>
  ) },
  in: { ar: 1, el: (c) => (
    <>
      <rect x={2} y={2} width={36} height={36} rx={8} {...S(c, 3.4)} />
      <circle cx={12.5} cy={11.8} r={2.6} fill={c} />
      <path d="M12.5 18.5 V29" {...S(c, 4.2)} />
      <path d="M19.5 29 V18.5 M19.5 23.5 C19.5 20 22 18.2 25 18.2 C28.2 18.2 29.5 20.5 29.5 23.5 V29" {...S(c, 4.2)} />
    </>
  ) },
  camera: { ar: 1.15, el: (c) => (
    <>
      <path d="M9 11 H14 L17 5.5 H29 L32 11 H37 C40.3 11 43 13.7 43 17 V31 C43 34.3 40.3 37 37 37 H9 C5.7 37 3 34.3 3 31 V17 C3 13.7 5.7 11 9 11 Z" {...S(c, 3.4)} />
      <circle cx={23} cy={23.5} r={7.5} fill="none" stroke={c} strokeWidth={3.4} />
      <circle cx={36.5} cy={17} r={1.8} fill={c} />
    </>
  ) },
  note: { ar: 0.85, el: (c) => (
    <>
      <g transform="translate(-1.7 -1.2)" opacity={0.9}>{note("#5FD3FF")}</g>
      <g transform="translate(1.7 1.2)" opacity={0.9}>{note("#FF5C86")}</g>
      {note(c)}
    </>
  ) },
  x: { ar: 1, el: (c) => <path d="M8 8 L32 32 M32 8 L8 32" {...S(c, 5)} /> },
  megaphone: { ar: 1.15, el: (c) => (
    <>
      <path d="M5 15 H13 L33 5.5 V34.5 L13 25 H5 Z" {...S(c, 3.4)} />
      <path d="M13 25 L16.5 35" {...S(c, 3.4)} />
      <path d="M38.5 14 C41.5 17.5 41.5 22.5 38.5 26" {...S(c, 3.4)} />
    </>
  ) },
  w: { ar: 1.3, el: (c) => <path d="M4 7 L14.5 33 L26 12 L37.5 33 L48 7" {...S(c, 5)} /> },
  infinity: { ar: 1.5, el: (c) => (
    <path d="M30 20 C25.5 12.5 21 8 15 8 C8.4 8 4 13.4 4 20 C4 26.6 8.4 32 15 32 C21 32 25.5 27.5 30 20 C34.5 12.5 39 8 45 8 C51.6 8 56 13.4 56 20 C56 26.6 51.6 32 45 32 C39 32 34.5 27.5 30 20 Z" {...S(c, 5.2)} />
  ) },
  play: { ar: 1.38, el: (c) => (
    <>
      <rect x={2.5} y={3} width={50.2} height={34} rx={10} {...S(c, 3.6)} />
      <path d="M22.5 13 L35 20 L22.5 27 Z" fill={c} stroke={c} strokeWidth={2} strokeLinejoin="round" />
    </>
  ) },
  bag: { ar: 0.9, el: (c) => (
    <>
      <path d="M5 13 H31 L29 37 H7 Z" {...S(c, 3.4)} />
      <path d="M12 17 V11 C12 6 14.7 3 18 3 C21.3 3 24 6 24 11 V17" {...S(c, 3.4)} />
    </>
  ) },
};
export const Glyph: React.FC<{ k: string; h: number; color: string; style?: React.CSSProperties }> = ({ k, h, color, style }) => {
  const d = GLYPHS[k];
  return (
    <svg width={h * d.ar} height={h} viewBox={`0 0 ${40 * d.ar} 40`} style={{ display: "block", overflow: "visible", flex: "none", ...style }}>
      {d.el(color)}
    </svg>
  );
};

// ---------- text with a moving linear opacity ramp (the reference's left-to-right reveal / wipe-out)
export const BASE = 0.8635; // baseline below the top of a line-height:1 box, in em (Inter / Inter Tight: ascender .969, descender .242)
export type Wipe = { front?: number; W?: number; tail?: number; Wout?: number };
export const textBox = (text: string, size: number, weight: number, family: string, track = 0) => {
  const ls = track * size, w = tw(text, size, weight, family, track);
  return { w, vis: w - ls, ls };
};
export const Txt: React.FC<{
  text: string; size: number; weight: number; family: string; track?: number; cx: number; base: number; color?: string;
  shadow?: string; wipe?: Wipe; opacity?: number;
}> = ({ text, size, weight, family, track = 0, cx, base, color = "#FFFFFF", shadow, wipe, opacity = 1 }) => {
  const { vis, ls } = textBox(text, size, weight, family, track);
  const x0 = cx - vis / 2, P = 70;
  let mask: string | undefined;
  if (wipe) {
    const a = (x: number) => {
      let v = 1;
      if (wipe.front !== undefined && wipe.W) v = Math.min(v, clamp01((wipe.front - x) / wipe.W));
      if (wipe.tail !== undefined && wipe.Wout) v = Math.min(v, clamp01((x - wipe.tail) / wipe.Wout));
      return v;
    };
    const L = vis + 2 * P, n = 64, st: string[] = [];
    let all1 = true, all0 = true;
    for (let i = 0; i <= n; i++) {
      const lx = (i / n) * L, v = a(x0 - P + lx);
      if (v < 0.999) all1 = false;
      if (v > 0.001) all0 = false;
      st.push(`rgba(0,0,0,${v.toFixed(3)}) ${lx.toFixed(1)}px`);
    }
    if (all0) return null;
    if (!all1) mask = `linear-gradient(90deg, ${st.join(", ")})`;
  }
  return (
    <div style={{
      position: "absolute", left: x0 - P, top: base - BASE * size - P, padding: P, whiteSpace: "nowrap", fontFamily: family, fontWeight: weight,
      fontSize: size, lineHeight: `${size}px`, letterSpacing: ls, color, textShadow: shadow, opacity, WebkitMaskImage: mask, maskImage: mask,
    }}>{text}</div>
  );
};
export const HEAD_GLOW = "0 0 14px rgba(255,255,255,0.28), 0 0 34px rgba(255,255,255,0.08)";

// ---------- glowing ring arcs (CSS conic gradients masked to a thin circle, plus a soft Gaussian glow ring)
const ARC: Stop[] = [[0, "#FFFFFF", 1], [5, "#E6F0FD", 1], [10, "#8DC0FF", 1], [15, "#3F8CE8", 1], [20, "#3F8CE8", 0.85], [25, "#1B4FB8", 0.75], [30, "#0F2E6B", 0.55], [38, "#0F2E6B", 0]];
const rgba = (h: string, a: number) => { const [r, g, b] = hx(h); return `rgba(${r},${g},${b},${a.toFixed(3)})`; };
const ringMask = (r: number, R: number, prof: [number, number][]) =>
  `radial-gradient(circle ${R}px at 50% 50%, ${prof.map(([d, a]) => `rgba(0,0,0,${a.toFixed(3)}) ${(r + d).toFixed(2)}px`).join(", ")})`;
const CORE: [number, number][] = [[-2.3, 0], [-0.8, 1], [0.8, 1], [2.3, 0]];
const GLOW: [number, number][] = [-27, -22.5, -18, -13.5, -9, -4.5, 0, 4.5, 9, 13.5, 18, 22.5, 27].map((d) => [d, Math.exp((-d * d) / 162)]);
/** a ring of radius r about (cx, cy) with bright comet arcs at the given angles (degrees clockwise from 3 o'clock) */
export const Ring: React.FC<{ r: number; arcs: { a: number; peak: number }[]; cx?: number; cy?: number }> = ({ r, arcs, cx = 960, cy = 540 }) => {
  if (r > 1160 || r < 5) return null;
  const R = r + 30;
  const box: React.CSSProperties = { position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R };
  const cm = ringMask(r, R, CORE), gm = ringMask(r, R, GLOW);
  return (
    <>
      <div style={{ ...box, background: "rgba(141,192,255,0.045)", WebkitMaskImage: cm, maskImage: cm }} />
      {arcs.map(({ a, peak }, i) => {
        const from = a + 90 - 180; // css conic angles start at 12 o'clock
        const st = [...ARC.slice(1).reverse().map(([d, c, al]) => [180 - d, c, al] as Stop), ...ARC.map(([d, c, al]) => [180 + d, c, al] as Stop)];
        const bg = `conic-gradient(from ${from.toFixed(2)}deg at 50% 50%, transparent 0deg, ${st.map(([d, c, al]) => `${rgba(c, al * peak)} ${d}deg`).join(", ")}, transparent 360deg)`;
        return (
          <React.Fragment key={i}>
            <div style={{ ...box, background: bg, WebkitMaskImage: gm, maskImage: gm, opacity: 0.3 }} />
            <div style={{ ...box, background: bg, WebkitMaskImage: cm, maskImage: cm }} />
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------- sample compositor: averages n copies of an opaque frame (plus-lighter, 1/n each) = motion blur;
// with chans, each copy is split into R, G, B (multiply) under its own transform = RGB split.
export type Chan = { color: string; tf: string };
export const Composite: React.FC<{ n: number; render: (u: number) => React.ReactNode; chans?: Chan[] }> = ({ n, render, chans }) => {
  if (n <= 1 && !chans) return <>{render(0)}</>;
  const us = Array.from({ length: Math.max(1, n) }, (_, i) => (n <= 1 ? 0 : (i + 0.5) / n - 0.5));
  const cs: (Chan | null)[] = chans ?? [null];
  return (
    <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
      {cs.map((c, ci) => us.map((u, i) => (
        <div key={`${ci}-${i}`} style={{
          position: "absolute", inset: 0, isolation: "isolate", mixBlendMode: "plus-lighter" as React.CSSProperties["mixBlendMode"], opacity: 1 / us.length,
          transform: c?.tf, transformOrigin: "960px 540px",
        }}>
          {render(u)}
          {c && <div style={{ position: "absolute", inset: -400, background: c.color, mixBlendMode: "multiply" }} />}
        </div>
      )))}
    </div>
  );
};
export const rgbSplit = (k: number): Chan[] => [
  { color: "#FF0000", tf: `scale(${1 + k / 2})` },
  { color: "#00FF00", tf: "scale(1)" },
  { color: "#0000FF", tf: `scale(${1 - k / 2})` },
];
export const rgbShift = (dx: number): Chan[] => [
  { color: "#FF0000", tf: `translateX(${-dx}px)` },
  { color: "#00FF00", tf: "none" },
  { color: "#0000FF", tf: `translateX(${dx}px)` },
];
