// Building blocks: a morphing photo frame, kinetic serif words, small caps labels, the letter morph and the night globe.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { Img, staticFile } from "remotion";
import GLOBE from "./globe.json";
import { C, SANS, SERIF, clamp01, lerp, p, SOFT } from "./kit";

export type Layer = { src: string; fx?: number; fy?: number; z?: number; o?: number; dx?: number };
export type Box = { x: number; y: number; w: number; h: number; r?: number | [number, number, number, number]; o?: number; rotY?: number; rot?: number };

/** A photo frame drawn from its centre; corner radii can differ (an arch is [r, r, small, small]); layers crossfade. */
export const Frame: React.FC<{ b: Box; layers: Layer[]; fill?: string; shadow?: number; children?: React.ReactNode; z?: number }> = ({ b, layers, fill = C.paper, shadow = 1, children, z }) => {
  if ((b.o ?? 1) <= 0.002 || b.w < 1 || b.h < 1) return null;
  const r = Array.isArray(b.r) ? b.r : [b.r ?? 0, b.r ?? 0, b.r ?? 0, b.r ?? 0];
  const rr = r.map((v) => Math.min(v, b.w / 2, b.h / 2));
  return (
    <div style={{
      position: "absolute", left: b.x - b.w / 2, top: b.y - b.h / 2, width: b.w, height: b.h, zIndex: z,
      borderRadius: `${rr[0]}px ${rr[1]}px ${rr[2]}px ${rr[3]}px`, overflow: "hidden", background: fill, opacity: b.o ?? 1,
      transform: `perspective(1600px) rotateY(${b.rotY ?? 0}deg) rotate(${b.rot ?? 0}deg)`,
      boxShadow: shadow ? `0 ${24 * shadow}px ${60 * shadow}px -${26 * shadow}px rgba(41,41,41,${0.38 * shadow})` : undefined,
    }}>
      {layers.map((l, i) => (l.o ?? 1) > 0.002 && (
        <Img key={i} src={staticFile("img/" + l.src)} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          objectPosition: `${l.fx ?? 50}% ${l.fy ?? 50}%`, opacity: l.o ?? 1,
          transform: `translateX(${(l.dx ?? 0) * 100}%) scale(${l.z ?? 1})`, transformOrigin: `${l.fx ?? 50}% ${l.fy ?? 50}%`,
        }} />
      ))}
      {children}
    </div>
  );
};

export type Wd = { s: string; at: number; it?: boolean; br?: boolean };
/** Serif words that rise out of a soft blur on their voice-over word; italic words take the site's bronze. */
export const Words: React.FC<{ t: number; items: Wd[]; x: number; y: number; size: number; width?: number; align?: "center" | "left"; out?: number; color?: string; lh?: number; weight?: number }> = ({ t, items, x, y, size, width = 960, align = "center", out, color = C.ink, lh = 1.08, weight = 400 }) => {
  if (t < items[0].at - 0.05) return null;
  const o = out === undefined ? 0 : p(t, out, 0.35, SOFT);
  if (o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - width / 2 : x, top: y, width, textAlign: align, fontFamily: SERIF, fontSize: size, lineHeight: lh, fontWeight: weight, letterSpacing: "-0.01em", color, opacity: 1 - o, transform: `translateY(${-o * 24}px)` }}>
      {items.map((it, i) => {
        if (it.br) return <br key={i} />;
        const k = p(t, it.at, 0.55);
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: k, transform: `translateY(${(1 - k) * size * 0.32}px)`, filter: k < 1 ? `blur(${(1 - k) * 7}px)` : undefined, fontStyle: it.it ? "italic" : "normal", color: it.it ? C.bronze : undefined }}>
            {it.s}{i < items.length - 1 && !items[i + 1]?.br ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

/** The site's small spaced capitals. */
export const Caps: React.FC<{ t: number; at: number; out?: number; text: string; x: number; y: number; size?: number; color?: string; align?: "center" | "left" }> = ({ t, at, out, text, x, y, size = 19, color = C.muted, align = "center" }) => {
  const k = p(t, at, 0.5), o = out === undefined ? 0 : p(t, out, 0.3, SOFT);
  if (k <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - 500 : x, top: y, width: align === "center" ? 1000 : undefined, textAlign: align, fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "0.2em", color, opacity: k * (1 - o), transform: `translateY(${(1 - k) * 14 - o * 10}px)`, whiteSpace: "nowrap" }}>{text}</div>
  );
};

/** One word turning into another: shared letters glide to their new places, the rest fall away or drop in. */
export const LetterMorph: React.FC<{ t: number; from: string; to: string; map: number[]; at: number; dur: number; x: number; y: number; size: number; inAt: number; out?: number }> = ({ t, from, to, map, at, dur, x, y, size, inAt, out }) => {
  const font = `italic 400 ${size}px 'Bodoni Moda'`;
  const pos = useMemo(() => {
    const cv = document.createElement("canvas").getContext("2d")!;
    cv.font = font;
    const xs = (s: string) => { const tot = cv.measureText(s).width; return [...s].map((_, i) => cv.measureText(s.slice(0, i)).width - tot / 2); };
    return { a: xs(from), b: xs(to) };
  }, [font, from, to]);
  const kin = p(t, inAt, 0.6), m = p(t, at, dur, (v) => v * v * (3 - 2 * v)), o = out === undefined ? 0 : p(t, out, 0.35, SOFT);
  if (kin <= 0 || o >= 1) return null;
  const col = (k: number) => `rgb(${Math.round(lerp(0x80, 0x29, k))},${Math.round(lerp(0x67, 0x29, k))},${Math.round(lerp(0x50, 0x29, k))})`;
  const span = (ch: string, px: number, op: number, dy: number, key: string, blur = 0) => (
    <span key={key} style={{ position: "absolute", left: x + px, top: y + dy, fontFamily: SERIF, fontStyle: "italic", fontSize: size, lineHeight: 1, color: col(m), opacity: op * kin * (1 - o), filter: blur ? `blur(${blur}px)` : undefined, whiteSpace: "pre" }}>{ch}</span>
  );
  const out_: React.ReactNode[] = [];
  [...from].forEach((ch, i) => {
    const j = map[i];
    if (j >= 0) out_.push(span(ch, lerp(pos.a[i], pos.b[j], m), 1, (1 - kin) * size * 0.3, "a" + i, (1 - kin) * 6));
    else out_.push(span(ch, pos.a[i], 1 - clamp01(m * 1.6), m * size * 0.35 + (1 - kin) * size * 0.3, "a" + i, m * 8));
  });
  [...to].forEach((ch, j) => {
    if (map.includes(j)) return;
    const k = clamp01((m - 0.35) / 0.65);
    out_.push(span(ch, pos.b[j], k, -(1 - k) * size * 0.35, "b" + j, (1 - k) * 8));
  });
  return <>{out_}</>;
};

// ---- the night globe (the qualification page's Earth at night), drawn on a canvas -------------------------------------
const D2R = Math.PI / 180;
const RAW = (GLOBE as { dots: number[][] }).dots;
const N = RAW.length;
const GX = new Float32Array(N), GY = new Float32Array(N), GZ = new Float32Array(N), SEED = new Float32Array(N);
RAW.forEach(([la, lo], i) => { const a = la * D2R, b = lo * D2R; GX[i] = Math.cos(a) * Math.sin(b); GY[i] = Math.sin(a); GZ[i] = Math.cos(a) * Math.cos(b); SEED[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1; });
export type Cam = { lon: number; lat: number; R: number; cx: number; cy: number };
export const proj = (v: Cam, lon: number, lat: number) => {
  const a = lat * D2R, b = (lon - v.lon) * D2R, ph = v.lat * D2R;
  const x = Math.cos(a) * Math.sin(b), y0 = Math.sin(a), z0 = Math.cos(a) * Math.cos(b);
  const y = y0 * Math.cos(ph) - z0 * Math.sin(ph), z = y0 * Math.sin(ph) + z0 * Math.cos(ph);
  return { x: v.cx + v.R * x, y: v.cy - v.R * y, z };
};
export const Globe: React.FC<{ v: Cam; o: number; twinkle: number }> = ({ v, o, twinkle }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const { R, cx, cy } = v;
    const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    body.addColorStop(0, "#3A3631"); body.addColorStop(0.7, "#24221F"); body.addColorStop(1, "#161514");
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    const cl = Math.cos(v.lon * D2R), sl = Math.sin(v.lon * D2R), cp = Math.cos(v.lat * D2R), sp = Math.sin(v.lat * D2R);
    const r0 = R * 0.0052;
    const buckets: number[][] = [[], [], [], []];
    for (let i = 0; i < N; i++) {
      const x = GX[i] * cl - GZ[i] * sl, z0 = GZ[i] * cl + GX[i] * sl;
      const y = GY[i] * cp - z0 * sp, z = GY[i] * sp + z0 * cp;
      if (z <= 0.03) continue;
      const lit = SEED[i] > 0.86 - 0.04 * Math.sin(twinkle + i) ? 3 : z < 0.25 ? 0 : z < 0.55 ? 1 : 2;
      buckets[lit].push(cx + R * x, cy - R * y, r0 * (0.55 + 0.45 * Math.sqrt(z)) * (lit === 3 ? 1.35 : 1));
    }
    const cols = ["rgba(186,164,143,0.28)", "rgba(186,164,143,0.5)", "rgba(224,198,173,0.72)", "rgba(255,230,196,0.98)"];
    buckets.forEach((b, j) => {
      ctx.fillStyle = cols[j]; ctx.beginPath();
      for (let i = 0; i < b.length; i += 3) { ctx.moveTo(b[i] + b[i + 2], b[i + 1]); ctx.arc(b[i], b[i + 1], b[i + 2], 0, Math.PI * 2); }
      ctx.fill();
    });
  });
  return <canvas ref={ref} width={1080} height={1080} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1080, opacity: o }} />;
};
