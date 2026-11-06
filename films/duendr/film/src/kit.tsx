// Duendr: the shared kit. Every scene imports from here; nothing scene-specific lives here.
// Brand from duendr.app (harvest/facts.md): dark #161413, card #1E1B19, border #2E2A27, cream #F0EBE1, muted #BDB3A6,
// coral #E25A3D; light theme cream #F3EEE4; Inter everywhere; the "duendr" wordmark (traced) with its coral dot; the icon
// (a coral circle and a cream bar making a "d").
import React from "react";
import { continueRender, delayRender, Easing, Img, OffthreadVideo, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import WM from "./wordmark.json";

// ------------------------------------------------------------------ clock
export const FPS = 60, DUR = 42.4, VO = 0.3, W = 1920, H = 1080, CX = 960, CY = 540;
type Word = { word: string; start: number; end: number };
import WORDS_RAW from "./words.json";
const WORDS = (WORDS_RAW as { words: Word[] }).words;
/** film time of the n-th (0-based) occurrence of a VO word (case/punctuation-insensitive), e.g. w("next", 1) */
export const w = (word: string, n = 0) => { const key = word.toLowerCase(); const hits = WORDS.filter((x) => x.word.toLowerCase().replace(/[^a-z0-9áéíóúñ']/g, "") === key); const h = hits[Math.min(n, hits.length - 1)]; if (!h) throw new Error(`no VO word ${word}`); return h.start + VO; };
export const we = (word: string, n = 0) => { const key = word.toLowerCase(); const hits = WORDS.filter((x) => x.word.toLowerCase().replace(/[^a-z0-9áéíóúñ']/g, "") === key); return hits[Math.min(n, hits.length - 1)].end + VO; };

// ------------------------------------------------------------------ brand
export const C = {
  bg: "#161413", card: "#1E1B19", card2: "#24201E", border: "#2E2A27", cream: "#F0EBE1", muted: "#BDB3A6", dim: "#8D857B",
  coral: "#E25A3D", coralD: "#D3462B", coralL: "#F08A6E", paper: "#F3EEE4", ink: "#161413", inkMuted: "#6E665E", gold: "#E8B64C", blue: "#4C8DF6",
};
export const SANS = "Inter";
export const SHADOW = "0 0 2px rgba(0,0,0,0.25), 0 0 30px rgba(0,0,0,0.35), 0 0 90px rgba(0,0,0,0.45)";       // on dark
export const SHADOW_L = "0 0 2px rgba(22,20,19,0.06), 0 0 28px rgba(22,20,19,0.08), 0 0 90px rgba(22,20,19,0.12)"; // on cream
export const GLOW = "0 0 26px rgba(226,90,61,0.45), 0 0 80px rgba(226,90,61,0.25)";

const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[400, 500, 600, 700, 800, 900].map((wt) => loadFont({ family: SANS, url: staticFile("fonts/inter-normal.woff2"), weight: String(wt) })),
    ...[500, 600, 700, 800].map((wt) => loadFont({ family: SANS, url: staticFile("fonts/inter-italic.woff2"), weight: String(wt), style: "italic" })),
  ]).then(() => fh !== null && continueRender(fh));
}

// ------------------------------------------------------------------ timing helpers
export const OUT = Easing.bezier(0.22, 1, 0.36, 1), INOUT = Easing.bezier(0.65, 0, 0.35, 1), IN = Easing.bezier(0.55, 0, 0.9, 0.4);
export const SOFT = Easing.bezier(0.4, 0, 0.15, 1), SNAP = Easing.bezier(0.2, 0.9, 0.25, 1);
export const c01 = (x: number) => Math.min(1, Math.max(0, x));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const k = (t: number, a: number, d: number, e: (x: number) => number = OUT) => e(c01((t - a) / d));
/** an under-damped spring 0 -> 1 from a (f Hz, z damping) */
export const sp = (t: number, a: number, f = 1.8, z = 0.65) => {
  const u = t - a; if (u <= 0) return 0; const om = 2 * Math.PI * f, wd = om * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * om * u) * (Math.cos(wd * u) + ((z * om) / wd) * Math.sin(wd * u));
};
export const win = (t: number, a: number, b: number, din = 0.35, dout = 0.35) => Math.min(k(t, a, din), 1 - k(t, b - dout, dout, INOUT));
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ------------------------------------------------------------------ brand marks
/** the "duendr" wordmark (traced from duendr.app); h = height in px; color for the letters; the dot is coral */
export const Wordmark: React.FC<{ h: number; color?: string; dot?: number; style?: React.CSSProperties }> = ({ h, color = C.cream, dot = 1, style }) => {
  const a = (WM as { aspect: number }).aspect;
  return (
    <svg width={h * a} height={h} viewBox={`0 0 ${a} 1`} style={{ overflow: "visible", ...style }}>
      <path d={(WM as { word: string }).word} fill={color} fillRule="evenodd" />
      <circle cx={a - 0.105} cy={0.47} r={0.105 * c01(dot)} fill={C.coral} />
    </svg>
  );
};
/** the app icon: dark rounded tile, coral circle and cream bar ("d"); s = side in px; parts animate with circle/bar 0..1 */
export const Icon: React.FC<{ s: number; tile?: boolean; circle?: number; bar?: number; barColor?: string; style?: React.CSSProperties }> = ({ s, tile = true, circle = 1, bar = 1, barColor = C.cream, style }) => (
  <svg width={s} height={s} viewBox="0 0 512 512" style={{ overflow: "visible", ...style }}>
    {tile && <rect x="0" y="0" width="512" height="512" rx="114" fill="#151413" />}
    <circle cx="199.5" cy="311.5" r={106.5 * c01(circle)} fill={C.coral} />
    <rect x="333" y={418 - 325 * c01(bar)} width="85" height={325 * c01(bar)} fill={barColor} />
  </svg>
);

// ------------------------------------------------------------------ type
/** word-by-word type rising out of a blur; times: one start per word (or at + j * gap). Moving words get their own layer only while they move. */
export const Rise: React.FC<{ text: string; t: number; at: number; size: number; color?: string; weight?: number; italic?: boolean; gap?: number; times?: number[]; out?: number; spacing?: string; style?: React.CSSProperties; colors?: (string | undefined)[] }> =
  ({ text, t, at, size, color = C.cream, weight = 800, italic, gap = 0.07, times, out = 0, spacing = "-0.035em", style, colors }) => (
    <div style={{ fontFamily: SANS, fontWeight: weight, fontSize: size, color, lineHeight: 1.04, letterSpacing: spacing, whiteSpace: "nowrap", fontStyle: italic ? "italic" : undefined, ...style }}>
      {text.split(" ").map((wd, j) => { const q = c01(sp(t, times ? times[j] : at + j * gap, 1.8, 0.75)); const o = c01(out); const off = (1 - q) * 0.4 * size - o * 0.3 * size;
        return <span key={j} style={{ display: "inline-block", marginRight: "0.24em", color: colors?.[j] ?? color, opacity: c01(q * 1.6) * (1 - o), transform: `translateY(${Math.abs(off) < 0.6 ? 0 : off}px)`,
          filter: q < 0.97 || o > 0.01 ? `blur(${(1 - q) * 10 + o * 10}px)` : undefined }}>{wd}</span>; })}
    </div>
  );

// ------------------------------------------------------------------ media
/** a rounded media card: an image (img/...) or a looping clip (clips/..., muted) */
export const Media: React.FC<{ src: string; w: number; h: number; r?: number; zoom?: number; pos?: string; shadow?: string; style?: React.CSSProperties; children?: React.ReactNode; startFrom?: number }> =
  ({ src, w: wd, h: ht, r = 22, zoom = 1, pos = "50% 50%", shadow = SHADOW, style, children, startFrom = 0 }) => (
    <div style={{ width: wd, height: ht, borderRadius: r, overflow: "hidden", position: "relative", background: C.card, boxShadow: shadow, ...style }}>
      {src.endsWith(".mp4")
        ? <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})` }} />
        : <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})` }} />}
      {children}
    </div>
  );

export const Center: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
