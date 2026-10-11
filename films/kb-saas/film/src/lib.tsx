// K.B's look, measured on kruslockbosconsultancy.com (brand.json): a pale grey canvas, white cards, navy ink and buttons,
// one bright cyan accent for shapes only (never text on a light ground), Montserrat, the Copperplate "K.B" logotype.
// The motion follows Karl's 11 October references (library: motion/speed-graphs.md, measured section): arrivals start at
// speed and decay by a constant ratio, exits accelerate and are shorter, the change sits on the fastest frame, no overshoot.
import React from "react";
import { Easing } from "remotion";
import { T } from "./clock";

export const C = {
  page: "#F7F7F7", white: "#FFFFFF", ink: "#252525", navy: "#293A51", navy2: "#3D5574", kb: "#394F6D",
  cyan: "#38C8FF", cyanSoft: "#D7F2FF", cyanPale: "#EDF9FF", muted: "#49525B", muted2: "#7A838C", line: "#E2E8F0",
  pale: "#EBECF4", paleCool: "#F1F5F9", onNavy: "#BCC2C9", green: "#16A34A", greenSoft: "#DCF5E6", red: "#E5484D",
  redSoft: "#FDE8E8", amber: "#F5A524", amberSoft: "#FEF3DC",
};
export const F = { ui: "Montserrat", logo: "Copperplate" };

/** Exponential ease-out that starts at speed and loses a constant ratio r of it every frame (the references: r ≈ 0.8).
 *  n frames long; it reaches exactly 1 on the last frame. */
export const expoOut = (n: number, r = 0.8) => (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return (1 - Math.pow(r, c * n)) / (1 - Math.pow(r, n));
};
/** The mirror: an exit that speeds up by 1/r every frame. */
export const expoIn = (n: number, r = 0.8) => (t: number) => 1 - expoOut(n, r)(1 - t);
export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.45, 0, 0.25, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const LIN = (t: number) => t;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progress of a move that starts at a label (or label±s): 0..1. */
export const k = (g: number, pos: string | number, dur: number, ease: (t: number) => number = ARRIVE) => T.k(g, pos, dur, ease);
/** An exponential arrival of `frames` frames at a label (decay ratio r). */
export const kx = (g: number, pos: string | number, frames: number, r = 0.8) => T.k(g, pos, frames / 30, expoOut(frames, r));
/** An accelerating exit of `frames` frames at a label. */
export const kxi = (g: number, pos: string | number, frames: number, r = 0.8) => T.k(g, pos, frames / 30, expoIn(frames, r));
export const f = (pos: string | number) => T.f(pos);
export const s = (pos: string | number) => T.s(pos);

export const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const rgba = (h: string, a: number) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
export const mix = (a: string, b: string, t: number) => {
  const x = hex(a), y = hex(b);
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp01(t)))).join(",")})`;
};
/** Absolute placement by centre, on transforms only. */
export const at = (x: number, y: number, sc = 1, o = 1, extra = ""): React.CSSProperties =>
  ({ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${sc}) ${extra}`, opacity: o });
export const SHADOW = "0 40px 80px -40px rgba(41,58,81,0.35), 0 2px 8px rgba(41,58,81,0.06)";
export const SHADOW_SOFT = "0 24px 50px -30px rgba(41,58,81,0.30), 0 1px 3px rgba(41,58,81,0.05)";

/** A push from rest that gets to speed in about 3 f and then decays: chat-scroll pushes on things already on screen. */
export const PUSH = Easing.bezier(0.3, 0, 0.1, 1);
/** Frame of a label (or label±s). */
export const W = (pos: string, d = 0) => T.f(pos) + Math.round(d * 30);
/** 0..1 between two frames, eased. */
export const pr = (g: number, a: number, n: number, ease: (t: number) => number = ARRIVE) => ease(clamp01((g - a) / Math.max(1, n)));
/** Exponential arrival between frames (starts at speed). */
export const px = (g: number, a: number, n: number, r = 0.8) => expoOut(n, r)(clamp01((g - a) / n));
/** Accelerating exit between frames. */
export const pxi = (g: number, a: number, n: number, r = 0.8) => expoIn(n, r)(clamp01((g - a) / n));
/** A click: squeezed in 4 f, held 2 f, released in 3 f, from frame a. */
export const press = (g: number, a: number) => g < a ? 0 : g < a + 4 ? (g - a) / 4 : g < a + 6 ? 1 : g < a + 9 ? 1 - (g - a - 6) / 3 : 0;
/** Cursor tip offset for a cursor of size s (the tip sits at 19%, 11% of the box). */
export const tip = (s: number) => ({ dx: -0.19 * s, dy: -0.11 * s });
