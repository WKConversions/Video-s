// Robin's own forms, rebuilt live from his site: the name lockup, the stacked statement, the valuation, the end card.
import React from "react";
import { T } from "./clock";
import { ARRIVE, DEPART, MOVE, Line, measure, W } from "./kinetic";
import { C } from "./lib";
import { Text, Micro, Rule, Arrow } from "./parts";

const k = (g: number, at: string, d: number, e = ARRIVE) => T.k(g, at, d, e);

/** Width of the ROBIN BOS lockup at a size (700, -0.08em), and where its period sits. */
export const nameMetrics = (size: number) => {
  const w1 = measure("ROBIN", size, 700, -0.08), w2 = measure("BOS", size, 700, -0.08), gap = size * 0.22;
  return { w: w1 + gap + w2, w1, w2, gap, period: { dx: w1 + gap + w2 + size * 0.1, dy: size * 0.72 }, sq: size * 0.12 };
};

/** "ROBIN BOS" in the site's display setting; each word rises on its spoken word. The period is the caller's square. */
export const NameLockup: React.FC<{ g: number; x: number; y: number; size: number; at?: [string, string]; out?: string; color?: string }> = ({ g, x, y, size, at = ["w:robin", "w:bos"], out, color = C.ink }) => {
  const m = nameMetrics(size);
  return (
    <div data-probe="name" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, willChange: "transform" }}>
      <Line g={g} words={[{ t: "ROBIN", at: at[0] }, { t: "BOS", at: at[1] }]} x={0} y={0} size={size} weight={700} ls={-0.08} color={color} out={out} style={{ gap: m.gap, lineHeight: 1 }} />
    </div>
  );
};

/** "People. / Process. / Technology." stacked, each line rising on its word, each period a sky-blue square. */
export const Statement: React.FC<{ g: number; x: number; y: number; size: number; at?: [string, string, string]; out?: string; lead?: number }> = ({ g, x, y, size, at = ["w:people", "w:process", "w:technology"], out, lead = 1.12 }) => {
  const rows: [string, string, string][] = [["People", at[0], C.ink], ["Process", at[1], C.ink], ["Technology", at[2], C.blue]];
  return (
    <div data-probe="statement" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, willChange: "transform" }}>
      {rows.map(([t, a, col], i) => {
        const kk = k(g, a, 0.42), o = out ? k(g, out, 0.3, DEPART) : 0, w = measure(t, size, 500, -0.045);
        return (
          <div key={t} style={{ position: "absolute", left: 0, top: i * size * lead, height: size, opacity: Math.min(1, kk * 1.7) * (1 - o), transform: `translateY(${((1 - kk) * 0.32 - o * 0.3) * size}px)`, filter: kk < 1 || o > 0 ? `blur(${(1 - kk) * 9 + o * 9}px)` : undefined, fontFamily: "Manrope", fontWeight: 500, fontSize: size, letterSpacing: "-0.045em", lineHeight: 1, color: col, whiteSpace: "nowrap" }}>
            {t}
            <div style={{ position: "absolute", left: w + size * 0.07, top: size * 0.74, width: size * 0.13, height: size * 0.13, background: C.accent, transform: `scale(${k(g, a, 0.5, MOVE) > 0.6 ? 1 : 0})`, transition: "none" }} />
          </div>
        );
      })}
    </div>
  );
};

/** A row of the site's contact list: label above, value, hairline below, the arrow at the right. */
export const ContactRow: React.FC<{ g: number; x: number; y: number; w: number; label: string; value: string; at: string; light?: boolean; valueSize?: number }> = ({ g, x, y, w, label, value, at, light = false, valueSize = 44 }) => {
  const kk = k(g, at, 0.5), ink = light ? C.white : C.ink, mut = light ? "rgba(255,255,255,.6)" : C.muted, line = light ? "rgba(255,255,255,.22)" : C.line;
  return (
    <div data-probe={`row-${label}`} style={{ position: "absolute", left: 0, top: 0, width: w, transform: `translate(${x}px, ${y + (1 - kk) * 24}px)`, opacity: Math.min(1, kk * 1.6), willChange: "transform" }}>
      <Micro x={0} y={0} text={label} color={mut} size={22} />
      <Text x={0} y={40} size={valueSize} weight={500} color={ink} ls={-0.02}>{value}</Text>
      <Arrow x={w - 22} y={56} s={44} color={ink} k={kk} />
      <Rule x={0} y={112} w={w} k={k(g, at, 0.7, MOVE)} color={line} />
    </div>
  );
};

/** The site's "Start a conversation ↗" pill, ink with a white label (or inverted), centred-left at (x, y). */
export const Button: React.FC<{ g: number; x: number; y: number; at: string; label?: string; w?: number; h?: number; press?: string; light?: boolean }> = ({ g, x, y, at, label = "Start a conversation", w = 520, h = 104, press, light = false }) => {
  const kk = k(g, at, 0.5), p = press ? Math.sin(Math.min(1, Math.max(0, T.k(g, press, 0.24, (t) => t))) * Math.PI) : 0;
  const bg = light ? C.white : C.ink, fg = light ? C.ink : C.white;
  return (
    <div data-probe="button" style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 999, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${h * 0.34}px 0 ${h * 0.42}px`, boxSizing: "border-box",
      fontFamily: "Manrope", fontWeight: 600, fontSize: h * 0.36, letterSpacing: "-0.02em", transform: `translate(${x}px, ${y + (1 - kk) * 30}px) scale(${1 - p * 0.03})`, opacity: Math.min(1, kk * 1.6), boxShadow: "0 12px 40px rgba(14,32,56,.18)", willChange: "transform" }}>
      <span>{label}</span>
      <svg width={h * 0.34} height={h * 0.34} viewBox="0 0 24 24"><path d="M5 19 19 5M5 5h14v14" fill="none" stroke={fg} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
};

/** A cursor (the site's arrow pointer) that travels from (x0,y0) to (x1,y1) between `from` and `to` labels and presses on `press`. */
export const Cursor: React.FC<{ g: number; from: string; to: string; x0: number; y0: number; x1: number; y1: number; press?: string; out?: string }> = ({ g, from, to, x0, y0, x1, y1, press, out }) => {
  const a = T.k(g, from, Math.max(0.1, T.s(to) - T.s(from)), MOVE), vis = Math.min(1, T.k(g, from, 0.2) * 2) * (out ? 1 - T.k(g, out, 0.25, DEPART) : 1);
  const p = press ? Math.sin(Math.min(1, Math.max(0, T.k(g, press, 0.24, (t) => t))) * Math.PI) : 0;
  const x = x0 + (x1 - x0) * a, y = y0 + (y1 - y0) * a - Math.sin(a * Math.PI) * 40;
  return (
    <svg data-probe="cursor" width={40} height={46} viewBox="0 0 20 23" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${1 - p * 0.12})`, opacity: vis, filter: "drop-shadow(0 6px 10px rgba(14,32,56,.3))" }}>
      <path d="M2 2 L2 18 L6.5 14 L9.5 21 L12.5 19.8 L9.6 13 L15.5 13 Z" fill={C.white} stroke={C.ink} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
};

export type { W };
