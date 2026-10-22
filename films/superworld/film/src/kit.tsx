// The SuperWorld film's kit: brand, springs, the logo, a prototype city map, pins, avatars, glass, the Island and the
// hand-offs between the four builders. SuperWorld's look (map.superworldapp.com): cream #FFFAF0, white panels with
// a #E0E0E0 hairline, ink #1A1A1A, grey #424242, SuperWorld blue #276FF3, the logo's gradient #1E3AD6 -> #307EE7 ->
// #44C6FA, a gold leaderboard pill, red hearts, amber stars; type Instrument Sans. Everything is a pure function of t
// (seconds of film time, fractional at 60 fps).
import React from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { LOGO_GRADS, LOGO_PATHS } from "./logo";

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  loadFont({ family: "Instrument Sans", url: staticFile("fonts/instrumentsans.woff2"), weight: "400 700" })
    .then(() => fontHandle !== null && continueRender(fontHandle));
}

export const S = {
  cream: "#FFFAF0", white: "#FFFFFF", ink: "#1A1A1A", grey: "#424242", muted: "#6B6B6B", soft: "#9E9E9E", line: "#E0E0E0", panel: "#F5F5F5",
  blue: "#276FF3", deep: "#1E3AD6", mid: "#307EE7", sky: "#44C6FA", violet: "#7B61FF", night: "#0B0D12",
  gold: "#7A5C12", goldBg: "#FFF3D1", red: "#E53935", amber: "#FFAB00", orange: "#FF6D00", green: "#2EB872",
  land: "#F3F0E8", water: "#BFDFFF", park: "#D7EFCF", street: "#FFFFFF", casing: "#E4DED2", label: "#8C8577",
};
export const GRAD = `linear-gradient(135deg, ${S.deep} 0%, ${S.mid} 45%, ${S.sky} 100%)`;   // the logo's gradient
export const BTN = `linear-gradient(90deg, ${S.blue} 0%, ${S.violet} 100%)`;               // the app's primary button
export const SANS = "Instrument Sans";
export const SHADOW = "0 2px 6px rgba(26,26,26,0.06), 0 40px 100px -40px rgba(26,26,26,0.35)";

export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const inout = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
// a damped spring from 0 to 1 starting at t0 (s): response = period (s); damping 1 = no overshoot (big carries),
// 0.55-0.7 = Apple bouncy (pops, landings, snaps).
export const spring = (t: number, t0: number, response = 0.45, damping = 0.62) => {
  const x = t - t0; if (x <= 0) return 0;
  const w = (2 * Math.PI) / response, z = damping;
  if (z >= 1) return 1 - Math.exp(-w * x) * (1 + w * x);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + ((z * w) / wd) * Math.sin(wd * x));
};
export const bounce = (t: number, t0: number, response = 0.5) => spring(t, t0, response, 0.6);

// The SuperWorld "S" mark, size px square.
export const Logo: React.FC<{ size: number; id?: string }> = ({ size, id = "lg" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block" }}>
    <defs>{LOGO_GRADS.map((g) => (
      <linearGradient key={g.id} id={`${id}-${g.id}`} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} gradientUnits="userSpaceOnUse">
        {g.stops.map((s, i) => <stop key={i} offset={s.o} stopColor={s.c} />)}
      </linearGradient>))}</defs>
    {LOGO_PATHS.map((p, i) => <path key={i} d={p.d} fill={`url(#${id}-${p.grad})`} />)}
  </svg>
);

// ---- The prototype map: a clean vector city (a river, a bay, parks, a rotated street grid and an avenue cutting
// across it, district labels). Map units are px at zoom 1; the map is MAP_W x MAP_H. A camera {cx, cy, z} puts map
// point (cx, cy) at the frame centre at zoom z. Use toScreen() to place pins and cards on map points.
export const MAP_W = 3600, MAP_H = 2400;
export type Cam = { cx: number; cy: number; z: number; rot?: number };
export const toScreen = (x: number, y: number, c: Cam) => {
  const a = ((c.rot ?? 0) * Math.PI) / 180, dx = (x - c.cx) * c.z, dy = (y - c.cy) * c.z;
  return { x: 960 + dx * Math.cos(a) - dy * Math.sin(a), y: 540 + dx * Math.sin(a) + dy * Math.cos(a) };
};
// named places on the map (map units), for pins
export const PLACES = {
  museum: { x: 1980, y: 820, name: "The Metropolitan Museum of Art" },
  w47: { x: 1720, y: 1180, name: "West 47th Street" },
  maths: { x: 900, y: 700, name: "Department of Mathematics" },
  cafe: { x: 2180, y: 1420, name: "Casa Haga" },
  park: { x: 2050, y: 1000, name: "Central Park" },
  pier: { x: 1350, y: 1650, name: "Pier" },
  bridge: { x: 2600, y: 1800, name: "Bridge" },
};
const GRID = (() => {
  const v: number[] = [], h: number[] = [];
  for (let i = -6; i <= 30; i++) v.push(i * 120);
  for (let j = -6; j <= 26; j++) h.push(j * 90);
  return { v, h };
})();
export const CityMap: React.FC<{ cam: Cam; dim?: number; labels?: boolean }> = ({ cam, dim = 0, labels = true }) => {
  const tr = `translate(960 540) rotate(${cam.rot ?? 0}) scale(${cam.z}) translate(${-cam.cx} ${-cam.cy})`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={tr}>
        <rect x={-1200} y={-1200} width={MAP_W + 2400} height={MAP_H + 2400} fill={S.land} />
        {/* the island's street grid, rotated like Manhattan's */}
        <g transform="rotate(-29 1800 1200)">
          {GRID.v.map((x, i) => <line key={"v" + i} x1={x} y1={-800} x2={x} y2={MAP_H + 800} stroke={S.casing} strokeWidth={i % 3 === 0 ? 22 : 13} />)}
          {GRID.h.map((y, i) => <line key={"h" + i} x1={-800} y1={y} x2={MAP_W + 800} y2={y} stroke={S.casing} strokeWidth={i % 4 === 0 ? 18 : 11} />)}
          {GRID.v.map((x, i) => <line key={"vs" + i} x1={x} y1={-800} x2={x} y2={MAP_H + 800} stroke={S.street} strokeWidth={i % 3 === 0 ? 16 : 8} />)}
          {GRID.h.map((y, i) => <line key={"hs" + i} x1={-800} y1={y} x2={MAP_W + 800} y2={y} stroke={S.street} strokeWidth={i % 4 === 0 ? 13 : 6} />)}
          <rect x={1880} y={420} width={260} height={1000} rx={18} fill={S.park} />
        </g>
        <path d="M1500 -600 C1480 300 1380 800 1260 1400 C1180 1800 1120 2300 1100 3000 L-1200 3000 L-1200 -600 Z" fill={S.water} />
        <path d="M-1200 1150 C-200 1090 400 1250 900 1200 C1050 1185 1150 1300 1180 1500 L1080 3000 L-1200 3000 Z" fill={S.land} opacity={0} />
        <path d="M2780 -600 C2700 400 2620 1100 2560 1600 C2520 2000 2660 2400 2900 3000 L4800 3000 L4800 -600 Z" fill={S.water} />
        <path d="M600 2100 C1200 1950 2000 2050 2700 2200 L2900 3000 L500 3000 Z" fill={S.water} />
        <path d="M-400 400 L-1200 400 L-1200 1000 C-800 900 -500 700 -400 400 Z" fill={S.park} />
        {/* an avenue cutting across the grid */}
        <path d="M1560 -200 C1700 600 1820 1200 2080 2100" stroke={S.casing} strokeWidth={30} fill="none" />
        <path d="M1560 -200 C1700 600 1820 1200 2080 2100" stroke="#FFE7B8" strokeWidth={20} fill="none" />
        {labels && <g fontFamily={SANS} fontWeight={600} fill={S.label} letterSpacing="6">
          <text x={1980} y={1260} fontSize={46}>MANHATTAN</text>
          <text x={560} y={980} fontSize={40}>JERSEY CITY</text>
          <text x={760} y={480} fontSize={34}>HOBOKEN</text>
          <text x={2950} y={1500} fontSize={42}>BROOKLYN</text>
          <text x={1880} y={2380} fontSize={34} fill="#6FA5D9">UPPER BAY</text>
        </g>}
      </g>
      {dim > 0 && <rect width={1920} height={1080} fill={S.cream} opacity={dim} />}
    </svg>
  );
};

// An avatar: a coloured disc with initials (no photos of real people).
export const AVATAR_COLORS = ["#276FF3", "#7B61FF", "#FF6D00", "#2EB872", "#E53935", "#44C6FA", "#FFAB00"];
export const Avatar: React.FC<{ name: string; size: number; i?: number; ring?: string }> = ({ name, size, i = 0, ring = S.white }) => (
  <div style={{ width: size, height: size, borderRadius: size, background: AVATAR_COLORS[i % AVATAR_COLORS.length], border: `${Math.max(2, size * 0.06)}px solid ${ring}`,
    display: "flex", alignItems: "center", justifyContent: "center", color: S.white, fontFamily: SANS, fontWeight: 700, fontSize: size * 0.42, boxSizing: "border-box", flex: "none" }}>
    {name.replace(/^@/, "").slice(0, 1).toUpperCase()}
  </div>
);

// A map pin: a white teardrop with an avatar (or an emoji) inside; its tip sits on (x, y). p 0..1(+) drops it in.
export const Pin: React.FC<{ x: number; y: number; p: number; name?: string; emoji?: string; i?: number; size?: number }> = ({ x, y, p, name = "", emoji, i = 0, size = 64 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: size, height: size * 1.3, transform: `translate(${x - size / 2}px, ${y - size * 1.3 - (1 - Math.min(1, p)) * 160}px) scale(${0.4 + 0.6 * p})`, transformOrigin: "50% 100%", opacity: clamp(p * 3) }}>
    <svg width={size} height={size * 1.3} viewBox="0 0 64 83" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 8px 10px rgba(26,26,26,0.25))" }}>
      <path d="M32 0 C49.7 0 64 14.3 64 32 C64 52 32 83 32 83 C32 83 0 52 0 32 C0 14.3 14.3 0 32 0 Z" fill={S.white} />
    </svg>
    <div style={{ position: "absolute", left: size * 0.09, top: size * 0.09 }}>
      {emoji ? <div style={{ width: size * 0.82, height: size * 0.82, borderRadius: size, background: S.panel, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.44 }}>{emoji}</div>
        : <Avatar name={name} size={size * 0.82} i={i} ring={S.white} />}
    </div>
  </div>
);

// Glass: a frosted panel (CSS backdrop blur; no SVG filters). Place it with a transform from left/top 0.
export const Glass: React.FC<{ w: number; h: number; r?: number; transform?: string; children?: React.ReactNode; tint?: string }> = ({ w, h, r = 32, transform = "", children, tint = "rgba(255,255,255,0.62)" }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, transform, overflow: "hidden", background: tint,
    backdropFilter: "blur(18px) saturate(140%)", WebkitBackdropFilter: "blur(18px) saturate(140%)",
    boxShadow: "inset 0 1.5px 1px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.5), 0 30px 70px -30px rgba(26,26,26,0.35)", fontFamily: SANS }}>
    {children}
  </div>
);

// Island: a Dynamic-Island capsule (ink), opening from a 180 x 54 pill to w x h with p (pass a bounce). Centre (cx, cy).
export const Island: React.FC<{ cx: number; cy: number; w: number; h: number; p: number; children?: React.ReactNode; color?: string }> = ({ cx, cy, w, h, p, children, color = S.ink }) => {
  const W = mix(180, w, p), H = mix(54, h, p);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${cx - w / 2}px, ${cy - h / 2}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: color, clipPath: `inset(${(h - H) / 2}px ${(w - W) / 2}px round ${H / 2}px)` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: S.white, fontFamily: SANS, fontWeight: 600, fontSize: Math.round(h * 0.34), opacity: clamp((p - 0.55) * 3) }}>{children}</div>
    </div>
  );
};

// BounceWords: a headline whose letters spring up one after another, centred on cx.
export const BounceWords: React.FC<{ t: number; at: number; text: string; cx: number; y: number; size: number; color?: string; accentFrom?: number; accent?: string; stagger?: number; weight?: number }> = ({ t, at, text, cx, y, size, color = S.ink, accentFrom = 9999, accent = S.blue, stagger = 0.022, weight = 700 }) => (
  <div style={{ position: "absolute", left: cx - 1600, top: y, width: 3200, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.03em", whiteSpace: "pre", lineHeight: 1.05 }}>
    {text.split("").map((ch, i) => { const p = bounce(t, at + i * stagger, 0.5); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * size * 0.7}px) scale(${0.55 + 0.45 * p})`, opacity: clamp(p * 2), color: i >= accentFrom ? accent : color }}>{ch}</span>; })}
  </div>
);

// ---- Hand-offs between the four builders. Each is drawn IDENTICALLY by both neighbours during its window
// [boundary - 0.25 s, boundary + 0.25 s]: the outgoing builder morphs INTO it by boundary - 0.25 s, the incoming one
// morphs OUT of it from boundary + 0.25 s. Each keeps moving inside its window, so the cut is never still.

// H1 (t = 10.0 s): the city map, full frame, the camera gliding north-east over Manhattan.
export const H1 = 10.0;
export const h1Cam = (t: number): Cam => ({ cx: 1760 + (t - H1) * 90, cy: 1150 - (t - H1) * 40, z: 0.9, rot: 0 });
export const H1Map: React.FC<{ t: number }> = ({ t }) => <CityMap cam={h1Cam(t)} />;
// H2 (t = 20.0 s): a white app panel, 820 x 960, centred, turning gently in 3D, over the cream background.
export const H2 = 20.0;
export const H2Panel: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 550, top: 60, width: 820, height: 960, borderRadius: 48, background: S.white, boxShadow: SHADOW, border: `1.5px solid ${S.line}`,
    transform: `perspective(1800px) rotateY(${Math.sin((t - H2) * 2.4) * 5}deg) rotateX(${Math.cos((t - H2) * 2) * 3}deg) translateY(${Math.sin((t - H2) * 3) * 10}px)` }} />
);
// H3 (t = 30.0 s): the whole frame in the logo's gradient, a soft light sweeping across it.
export const H3 = 30.0;
export const H3Gradient: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: GRAD }}>
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 900, left: mix(-900, 1920, clamp((t - (H3 - 0.6)) / 1.2)), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
  </div>
);
