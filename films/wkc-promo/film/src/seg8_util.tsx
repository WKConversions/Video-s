// Segment 8 helpers: tables, the dark blue ground, radial chromatic aberration and a sub-frame motion blur.
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, lerp } from "./lib";

/** per-frame table lookup: [[frame, v0, v1, ...], ...] -> linearly interpolated row (clamped at the ends) */
export const tab = (g: number, rows: number[][]): number[] => {
  if (g <= rows[0][0]) return rows[0].slice(1);
  for (let i = 1; i < rows.length; i++) {
    if (g <= rows[i][0]) {
      const a = rows[i - 1], b = rows[i], t = (g - a[0]) / (b[0] - a[0]);
      return a.slice(1).map((v, k) => lerp(v, b[k + 1], t));
    }
  }
  return rows[rows.length - 1].slice(1);
};
/** single-value table lookup */
export const tv = (g: number, rows: [number, number][]) => tab(g, rows)[0];
export const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
/** expo in-out on 0..1 */
export const expoInOut = (t: number) => {
  const c = clamp01(t);
  if (c === 0 || c === 1) return c;
  return c < 0.5 ? Math.pow(2, 20 * c - 10) / 2 : (2 - Math.pow(2, -20 * c + 10)) / 2;
};
export const hex = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b), k = clamp01(t);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(",")})`;
};

/**
 * The ground of the whole segment (the reference's indigo night re-coloured into WKC ink blues): a left-to-right
 * gradient, a soft blue glow rising from the bottom centre and a faint haze behind the centre text.
 */
export const Ground: React.FC<{ glow?: number; haze?: number; corner?: number }> = ({ glow = 1, haze = 1, corner = 0 }) => (
  <AbsoluteFill style={{ background: "linear-gradient(90deg, #09131F 0%, #08121D 45%, #050C16 100%)" }}>
    <div style={{ position: "absolute", left: 960 - 900, top: 1000 - 620, width: 1800, height: 1240, borderRadius: "50%", opacity: glow,
      background: "radial-gradient(closest-side, rgba(16,40,70,0.95) 0%, rgba(14,36,62,0.6) 45%, rgba(12,30,52,0) 100%)" }} />
    <div style={{ position: "absolute", left: 960 - 700, top: 540 - 380, width: 1400, height: 760, borderRadius: "50%", opacity: haze,
      background: "radial-gradient(closest-side, rgba(14,30,48,0.55) 0%, rgba(14,30,48,0) 100%)" }} />
    {corner > 0 && (
      <div style={{ position: "absolute", left: 40 - 520, top: 900 - 420, width: 1040, height: 840, borderRadius: "50%", opacity: corner,
        background: "radial-gradient(closest-side, rgba(22,44,86,0.75) 0%, rgba(22,44,86,0) 100%)" }} />
    )}
  </AbsoluteFill>
);

/**
 * Radial chromatic aberration about the frame centre: the picture drawn three times, one channel each, red scaled
 * x1.0025 and blue x0.9978 (about +-2.4 px at the frame edge), summed with screen. The children must be opaque.
 */
export const ChromAb: React.FC<{ on: boolean; children: React.ReactNode; r?: number; b?: number }> = ({ on, children, r = 1.0025, b = 0.9978 }) => {
  if (!on) return <>{children}</>;
  const ch: [string, number, string][] = [["r", r, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"], ["g", 1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"], ["b", b, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"]];
  return (
    <AbsoluteFill style={{ isolation: "isolate", background: "#000" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          {ch.map(([c, , m]) => (
            <filter key={c} id={`s8ca-${c}`} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values={m} /></filter>
          ))}
        </defs>
      </svg>
      {ch.map(([c, k], i) => (
        <AbsoluteFill key={c} style={{ filter: `url(#s8ca-${c})`, transform: `scale(${k})`, transformOrigin: "960px 540px", mixBlendMode: i ? "screen" : "normal" }}>
          {children}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/**
 * Shutter motion blur: the layer drawn at n sub-frame times t_i (averaged with plus-lighter, like CameraMotionBlur).
 * render(t) draws the layer at film time t.
 */
export const ShutterBlur: React.FC<{ times: number[]; render: (t: number) => React.ReactNode }> = ({ times, render }) => {
  if (times.length === 1) return <>{render(times[0])}</>;
  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      {times.map((t, i) => (
        <AbsoluteFill key={i} style={{ mixBlendMode: "plus-lighter", filter: `opacity(${1 / times.length})` }}>{render(t)}</AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

const inkCache: Record<string, { l: number; r: number; w: number }> = {};
/**
 * Ink extents of a line drawn from x = 0 (alphabetic start): l = ink left edge, r = ink right edge, w = advance.
 * Uses a canvas with the same letter / word spacing the SVG text gets.
 */
export const ink = (text: string, size: number, weight: number, family: string, letterPx = 0, wordPx = 0) => {
  const key = `${text}|${size}|${weight}|${family}|${letterPx}|${wordPx}`;
  if (!inkCache[key]) {
    const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D & { letterSpacing: string; wordSpacing: string };
    ctx.font = `${weight} ${size}px "${family}"`;
    ctx.letterSpacing = `${letterPx}px`;
    ctx.wordSpacing = `${wordPx}px`;
    const m = ctx.measureText(text);
    inkCache[key] = { l: -m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, w: m.width };
  }
  return inkCache[key];
};
