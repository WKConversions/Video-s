// Intelligence platform explainer: the shared kit. Every scene imports from here; nothing scene-specific lives here.
// The film is made of Karl's REAL platform screens (anonymised PNGs in public/screens/NN.png, 2559 x 1350 px, the numbers of
// his screenshots in the order he took them) animated as motion design, with every example text replaced by custom content
// re-set in the platform's own type (Inter Tight headings, Inter body). Screen coordinates are screenshot pixels.
import React from "react";
import { continueRender, delayRender, Easing, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import WORDS_RAW from "./words.json";

// ------------------------------------------------------------------ clock
export const FPS = 60, VO = 0.4, DUR = 49.8, W = 1920, H = 1080, CX = 960, CY = 540;
type Word = { word: string; start: number; end: number };
const WORDS = (WORDS_RAW as { words: Word[] }).words;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");
/** film time of the n-th (0-based) occurrence of a VO word, e.g. w("offer", 1) */
export const w = (word: string, n = 0) => { const hits = WORDS.filter((x) => norm(x.word) === norm(word)); const h = hits[Math.min(n, hits.length - 1)]; if (!h) throw new Error(`no VO word ${word}`); return h.start + VO; };
export const we = (word: string, n = 0) => { const hits = WORDS.filter((x) => norm(x.word) === norm(word)); return hits[Math.min(n, hits.length - 1)].end + VO; };

// ------------------------------------------------------------------ the platform's look (sampled from the screens)
export const C = { page: "#f7f7f8", card: "#ffffff", ink: "#050f19", muted: "#5f666f", soft: "#8a9099", line: "#e6e7ea", chip: "#f0f1f3",
  diffRed: "#f0d2c7", diffGreen: "#dcf3e5", stage: "#eceef1" };
export const SANS = "Inter", HEAD = "Inter Tight";
export const SHADOW = "0 1px 2px rgba(5,15,25,0.06), 0 12px 32px rgba(5,15,25,0.10), 0 40px 90px rgba(5,15,25,0.12)";

const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[400, 500, 600, 700].map((wt) => loadFont({ family: SANS, url: staticFile("fonts/inter-normal.woff2"), weight: String(wt) })),
    ...[400, 500, 600, 700].map((wt) => loadFont({ family: HEAD, url: staticFile("fonts/inter-tight.woff2"), weight: String(wt) })),
  ]).then(() => fh !== null && continueRender(fh));
}

// ------------------------------------------------------------------ timing helpers
export const OUT = Easing.bezier(0.22, 1, 0.36, 1), INOUT = Easing.bezier(0.65, 0, 0.35, 1), IN = Easing.bezier(0.55, 0, 0.9, 0.4);
export const SOFT = Easing.bezier(0.4, 0, 0.15, 1);
export const c01 = (x: number) => Math.min(1, Math.max(0, x));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const k = (t: number, a: number, d: number, e: (x: number) => number = OUT) => e(c01((t - a) / d));
/** an under-damped spring 0 -> 1 from a (f Hz, z damping) */
export const sp = (t: number, a: number, f = 1.8, z = 0.7) => {
  const u = t - a; if (u <= 0) return 0; const om = 2 * Math.PI * f, wd = om * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * om * u) * (Math.cos(wd * u) + ((z * om) / wd) * Math.sin(wd * u));
};

// ------------------------------------------------------------------ screens
export const SW = 2559, SH = 1350;
/** a whole screen (screenshot px); children are drawn in the same coordinates (covers, re-set text) */
export const Shot: React.FC<{ n: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ n, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, overflow: "hidden", ...style }}>
    <Img src={staticFile(`screens/${n}.png`)} style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH }} />
    {children}
  </div>
);
/** the camera on a screen: puts screen point (x, y) at the frame centre at scale s (s >= 0.8 keeps the frame full) */
export const Cam: React.FC<{ x: number; y: number; s: number; children?: React.ReactNode }> = ({ x, y, s, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: `translate(${CX - x * s}px, ${CY - y * s}px) scale(${s})` }}>{children}</div>
);
/** one region of a screen as its own object (for lift-outs); children are in the region's own coordinates */
export const Crop: React.FC<{ n: string; x: number; y: number; w: number; h: number; r?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ n, x, y, w: cw, h: ch, r = 0, children, style }) => (
  <div style={{ position: "relative", width: cw, height: ch, overflow: "hidden", borderRadius: r, ...style }}>
    <Img src={staticFile(`screens/${n}.png`)} style={{ position: "absolute", left: -x, top: -y, width: SW, height: SH }} />
    {children}
  </div>
);
/** hides original text: a rectangle in the local background colour (screen px) */
export const Cover: React.FC<{ x: number; y: number; w: number; h: number; c?: string; r?: number }> = ({ x, y, w: cw, h: ch, c = C.card, r = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: cw, height: ch, background: c, borderRadius: r }} />
);
/** re-set text in the platform's type (screen px): body Inter, headings Inter Tight; children may use <b> for bold runs */
export const T: React.FC<{ x: number; y: number; w?: number; size: number; lh?: number; weight?: number; color?: string; head?: boolean; children?: React.ReactNode; style?: React.CSSProperties }> =
  ({ x, y, w: tw, size, lh = 1.5, weight = 400, color = C.ink, head, children, style }) => (
    <div style={{ position: "absolute", left: x, top: y, width: tw, fontFamily: head ? HEAD : SANS, fontSize: size, lineHeight: lh, fontWeight: weight, color, letterSpacing: head ? "-0.02em" : "-0.003em", ...style }}>{children}</div>
  );
/** text typed in over [at, at + dur] with a caret while typing */
export const Typed: React.FC<{ text: string; t: number; at: number; dur: number; caret?: boolean }> = ({ text, t, at, dur, caret = true }) => {
  const n = Math.round(text.length * c01((t - at) / dur)); const typing = t >= at && n < text.length;
  return <>{text.slice(0, n)}{caret && typing && <span style={{ display: "inline-block", width: "0.06em", height: "1.05em", background: "currentColor", verticalAlign: "-0.15em", marginLeft: "0.04em" }} />}</>;
};
/** a macOS-style pointer at frame position (x, y); press 0..1 squeezes it and drops a ripple */
export const Cursor: React.FC<{ x: number; y: number; press?: number; s?: number }> = ({ x, y, press = 0, s = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${s * (1 - 0.12 * Math.sin(Math.PI * c01(press)))})`, transformOrigin: "0 0", zIndex: 50 }}>
    {press > 0 && press < 1 && <div style={{ position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: 26, border: `2px solid rgba(5,15,25,${0.35 * (1 - press)})`, transform: `scale(${0.4 + press})` }} />}
    <svg width={34} height={42} viewBox="0 0 34 42" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}>
      <path d="M3 2 L3 33 L11 25.5 L16.5 38 L22 35.6 L16.6 23.4 L27.5 23.4 Z" fill="#111" stroke="#fff" strokeWidth={2.4} strokeLinejoin="round" />
    </svg>
  </div>
);
