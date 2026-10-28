// The FUF brand kit shared by every scene: palette, type, timing helpers and the building blocks (serif lines that
// build word by word, spaced small caps, photo cards). Scenes live in scenes/*.tsx, one per stretch of the voice-over.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "../clock";
import { Line, W, measure } from "../kinetic";
import { ARRIVE, KIT, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp } from "../lib";
export { T, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile };

export const SERIF = "Bodoni Moda", SANS = "Nunito Sans";
KIT.font = SERIF; KIT.serif = SERIF; KIT.strike = "#B9A595";
export const INK = "#2B2B2B", CREAM = "#F7F4EF", TAUPE = "#B9A595", TAUPE_D = "#8C7765";
export const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
export const s = (pos: string) => T.s(pos);

/** Lines of serif type that build word by word; each line starts on its own label. *word* is set in italic. */
export type L = [string, string];
export const Para: React.FC<{ g: number; lines: L[]; x: number; y: number; size: number; color: string; accent?: string; out?: string; center?: boolean; lh?: number; strike?: (string | undefined)[] }> =
  ({ g, lines, x, y, size, color, accent = TAUPE, out, center, lh = 1.12, strike = [] }) => (
    <>{lines.map(([label, text], i) => {
      const words: W[] = text.split(" ").map((t, j) => {
        const it = t.startsWith("*");
        return { t: t.replace(/\*/g, ""), at: (s(label) + 0.07 * j).toFixed(3), serif: it, color: it ? accent : undefined, strike: j === 0 ? strike[i] : undefined };
      });
      const w = words.reduce((a, q) => a + measure(q.t, size, 400, -0.02, !!q.serif), 0) + 0.26 * size * (words.length - 1);
      return <Line key={i} g={g} words={words} x={center ? 960 - w / 2 : x} y={y + i * size * lh} size={size} weight={400} color={color} ls={-0.02} out={out} outDur={0.35} />;
    })}</>
  );
export const Caps: React.FC<{ t: string; x: number; y: number; o: number; color?: string; size?: number; center?: boolean }> = ({ t, x, y, o, color = TAUPE, size = 22, center }) => (
  <div style={{ position: "absolute", left: center ? 0 : x, right: center ? 0 : undefined, top: y, textAlign: center ? "center" : "left", fontFamily: SANS, fontSize: size, fontWeight: 500, letterSpacing: "0.32em", color, opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>{t}</div>
);
/** A scene's presence: fades in at `a`, out at `b`. */
export const vis = (g: number, a: string, b: string) => g < T.f(a) - 15 || g > T.f(b) + 20 ? 0 : k(g, a, 0.5) * (1 - k(g, b, 0.45, OUT));
export const Photo: React.FC<{ src: string; x: number; y: number; w: number; h: number; a: number; zoom?: number; pos?: string; radius?: number; shadow?: boolean }> = ({ src, x, y, w, h, a, zoom = 1, pos = "50% 50%", radius = 6, shadow = true }) => a <= 0 ? null : (
  <div style={{ position: "absolute", left: x, top: y + (1 - a) * 40, width: w, height: h, overflow: "hidden", borderRadius: radius, opacity: Math.min(1, a * 1.5), clipPath: `inset(${(1 - a) * 100}% 0 0 0 round ${radius}px)`, boxShadow: shadow ? "0 30px 70px rgba(30,24,18,0.22)" : undefined }}>
    <Img src={staticFile("img/" + src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})` }} />
  </div>
);

/** Deterministic pseudo-random 0..1 for index i (no Math.random: renders must repeat). */
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
