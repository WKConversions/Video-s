// The Future Unicorn Founders film's kit (version 1, 42.5 s, 60 fps, five builders). FUF's look (the site at
// test.fuf-16d.workers.dev): editorial and warm. Cream #F7F4EF, ink #272624, warm greys #4E4A45 / #655F58, bronze
// #8F765E for the italic serif accent words, sand #EEE7DF / #DDD5CB; headlines in a Didot/Bodoni serif (Bodoni Moda
// here) with italic bronze accents, small text in a clean sans (Avenir on the site; Nunito Sans here); the unicorn
// line mark. Everything is a pure function of t (seconds of film time, fractional at 60 fps).
import React from "react";
import { continueRender, delayRender, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import WORDS from "./words.json";
import { UNICORN_PTS } from "./unicorn";

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodonimoda.woff2"), weight: "400 700", style: "normal" }),
    loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodonimoda-italic.woff2"), weight: "400 700", style: "italic" }),
    loadFont({ family: "Nunito Sans", url: staticFile("fonts/nunitosans.woff2"), weight: "400 700" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const F = {
  cream: "#F7F4EF", ink: "#272624", grey: "#4E4A45", muted: "#655F58", bronze: "#8F765E", tan: "#BBA791",
  sand: "#EEE7DF", sand2: "#DDD5CB", line: "rgba(39,38,36,0.12)", white: "#FFFFFF", sunset: "#E8B98A",
};
export const SERIF = "Bodoni Moda";
export const SANS = "Nunito Sans";
export const SHADOW = "0 2px 6px rgba(39,38,36,0.06), 0 40px 100px -40px rgba(39,38,36,0.35)";

// The voice-over's word starts (vo/words.json): w("connections") = 2.22 s. A repeated word is numbered
// ("founders2", "conversations2"); non-ASCII letters are dropped ("Málaga" -> "mlaga", "isn't" -> "isnt").
export const W = WORDS as Record<string, number>;
export const w = (key: string) => { const v = W["w:" + key]; if (v === undefined) throw new Error("no word " + key); return v; };

export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const inout = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
// a damped spring from 0 to 1 starting at t0 (s). FUF's motion is premium and confident: damping 0.8 (a small,
// elegant settle) for most things, 1 for big carries, 0.65 for the few playful pops.
export const spring = (t: number, t0: number, response = 0.55, damping = 0.8) => {
  const x = t - t0; if (x <= 0) return 0;
  const om = (2 * Math.PI) / response, z = damping;
  if (z >= 1) return 1 - Math.exp(-om * x) * (1 + om * x);
  const wd = om * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * om * x) * (Math.cos(wd * x) + ((z * om) / wd) * Math.sin(wd * x));
};

// The unicorn mark (transparent PNGs made from the site's mark): tone "ink" | "cream" | "bronze".
export const Mark: React.FC<{ size: number; tone?: "ink" | "cream" | "bronze"; style?: React.CSSProperties }> = ({ size, tone = "ink", style }) => (
  <Img src={staticFile(`img/unicorn-${tone}.png`)} style={{ width: size, height: size, display: "block", ...style }} />
);
// The wordmark lockup as on the site: the mark, a hairline, "Future / Unicorn Founders" in the serif.
export const Lockup: React.FC<{ size: number; tone?: "ink" | "cream" }> = ({ size, tone = "ink" }) => {
  const c = tone === "ink" ? F.ink : F.cream;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
      <Mark size={size} tone={tone} />
      <div style={{ width: Math.max(1, size * 0.012), height: size * 0.7, background: c, opacity: 0.35 }} />
      <div style={{ fontFamily: SERIF, color: c, fontSize: size * 0.3, lineHeight: 1.05, letterSpacing: "-0.01em" }}>Future<br />Unicorn Founders</div>
    </div>
  );
};

// A photo filling a w x h box (object-fit cover) with a slow push: z is the zoom (1 = fit), (fx, fy) the focus point
// 0..1. Photos: img/hero-malaga.jpg (sunset terrace over Málaga, two people talking), img/malaga-skyline-detail.jpg.
export const Photo: React.FC<{ src: string; w: number; h: number; z?: number; fx?: number; fy?: number; r?: number; style?: React.CSSProperties }> = ({ src, w, h, z = 1, fx = 0.5, fy = 0.5, r = 0, style }) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: r, ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover",
      transform: `scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }} />
  </div>
);

// SerifLine: an editorial headline whose words rise into view through a mask, one after another, each starting at
// its own time (pass the voice-over's word times). Italic words are set in bronze (the site's accent).
export type Word = { text: string; at: number; it?: boolean };
export const SerifLine: React.FC<{ t: number; words: Word[]; x: number; y: number; size: number; align?: "left" | "center"; color?: string; accent?: string; out?: number }> = ({ t, words, x, y, size, align = "left", color = F.ink, accent = F.bronze, out = 9999 }) => {
  const o = clamp((t - out) / 0.35);
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - 1500 : x, top: y, width: align === "center" ? 3000 : undefined, display: "flex", flexWrap: "nowrap", justifyContent: align === "center" ? "center" : "flex-start",
      gap: size * 0.26, fontFamily: SERIF, fontSize: size, lineHeight: 1.12, letterSpacing: "-0.02em", whiteSpace: "pre" }}>
      {words.map((wd, i) => {
        const p = spring(t, wd.at, 0.6, 0.85);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110 + o * -110}%)`, fontStyle: wd.it ? "italic" : "normal", color: wd.it ? accent : color }}>{wd.text}</span>
          </span>
        );
      })}
    </div>
  );
};

// Kicker: a small uppercase sans label with wide tracking (the site's labels), sliding in.
export const Kicker: React.FC<{ t: number; at: number; text: string; x: number; y: number; color?: string; size?: number }> = ({ t, at, text, x, y, color = F.bronze, size = 26 }) => {
  const p = spring(t, at, 0.5, 0.9);
  return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x + (1 - p) * -30}px, ${y}px)`, opacity: clamp(p * 1.5), fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "0.22em", textTransform: "uppercase", color }}>{text}</div>;
};

// seeded(): deterministic pseudo-random numbers.
export const seeded = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export type Pt = { x: number; y: number };

// DrawLine: a single continuous line drawn progressively (p 0..1), like a one-line drawing. d is an SVG path in
// frame pixels; the stroke draws along the path from its start.
export const DrawLine: React.FC<{ d: string; p: number; color?: string; width?: number; style?: React.CSSProperties }> = ({ d, p, color = F.bronze, width = 5, style }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
    <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} />
  </svg>
);
// The unicorn mark's outline as points (fractions of its 400 x 400 image) and as SVG paths in a box of side `size`
// centred on (cx, cy): draw the mark as one line with DrawLine.
export { UNICORN_PTS };
export const unicornPath = (cx: number, cy: number, size: number) => {
  const P = UNICORN_PTS.map(([u, v]) => [cx + (u - 0.5) * size, cy + (v - 0.5) * size]);
  return "M" + P.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";
};

// ---- Hand-offs between the five builders. Each is drawn IDENTICALLY by both neighbours during its window
// [boundary - 0.25 s, boundary + 0.25 s]: the outgoing builder morphs INTO it by boundary - 0.25 s, the incoming one
// morphs OUT of it from boundary + 0.25 s. Each moves visibly on its own (motion_check must never see a still frame).
// H1 (9.8 s, after "Meet Future Unicorn Founders."): a bronze wax seal (a 420 px disc with a scalloped rim) with the
// cream unicorn mark, centred on cream, turning and breathing.
export const H1 = 9.8;
export const H1Seal: React.FC<{ t: number }> = ({ t }) => {
  const k = t - H1, R = 210, n = 28;
  const rim = Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? R : R - 14; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(" ");
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 600, transform: `translate(660px, 240px) rotate(${k * 40}deg) scale(${1 + Math.sin(k * 5) * 0.03})` }}>
      <svg width={600} height={600} style={{ position: "absolute", inset: 0 }}><g transform="translate(300 300)">
        <polygon points={rim} fill={F.bronze} /><circle r={R - 34} fill="none" stroke={F.sand} strokeOpacity={0.35} strokeWidth={3} />
      </g></svg>
      <div style={{ position: "absolute", left: 150, top: 150, transform: `rotate(${-k * 40}deg)` }}><Mark size={300} tone="cream" /></div>
    </div>
  );
};
// H2 (16.85 s, after "...together in Málaga."): the Málaga sunset photo, full frame, pushing in and panning right.
export const H2 = 16.85;
export const H2Malaga: React.FC<{ t: number }> = ({ t }) => {
  const k = t - H2;
  return <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${-k * 60}px)` }}><Photo src="hero-malaga.jpg" w={2000} h={1080} z={1.12 + k * 0.05} fx={0.7} fy={0.6} /></div>;
};
// H3 (24.25 s, after "...opportunities grow."): the ink field, a warm bronze light band sweeping across it.
export const H3 = 24.25;
export const H3Ink: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: F.ink, overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -300, bottom: -300, width: 700, left: mix(-800, 2000, clamp((t - (H3 - 0.3)) / 0.7)), transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(143,118,94,0), rgba(143,118,94,0.45), rgba(143,118,94,0))" }} />
  </div>
);
// H4 (32.85 s, after "...connections that matter."): a full frame of warm sunset light (a radial glow from the centre,
// cream to sunset), breathing, with a soft highlight circling.
export const H4 = 32.85;
export const H4Glow: React.FC<{ t: number }> = ({ t }) => {
  const k = t - H4, cx = 960 + Math.cos(k * 3) * 160, cy = 540 + Math.sin(k * 3) * 90;
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${F.sunset} 0%, #F1D7B8 38%, ${F.cream} 80%)` }}>
      <div style={{ position: "absolute", left: cx - 380, top: cy - 380, width: 760, height: 760, borderRadius: 760, background: "radial-gradient(circle, rgba(255,255,255,0.55), rgba(255,255,255,0))" }} />
    </div>
  );
};
