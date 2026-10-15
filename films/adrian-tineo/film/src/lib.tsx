// Adrian Tineo's look, measured on the site (harvest/live/styles.css): warm paper (#f4f4f2) on a dark ambient field,
// near-black ink, a muted second line in every headline, one quiet sage accent (the status dot), Manrope only, tight
// negative tracking on headlines and wide tracking on the tiny uppercase eyebrows; white cards with 6 px of inner
// padding around a pale image well; chrome-and-glass monochrome sculptures.
// The motion is the site's own: one curve, cubic-bezier(.22,1,.36,1); reveals rise 22 px (site) while fading in over
// 0.85 s with 80–100 ms steps between siblings; floats breathe slowly (9 s and 7 s, ease-in-out). No overshoot.
import React from "react";
import { Easing } from "remotion";
import { T } from "./clock";

export const C = {
  paper: "#F4F4F2", ink: "#151514", muted: "#71716E", line: "#DDDDD8", lineSoft: "#EAEAE6", lineFaq: "#D8D8D1",
  accent: "#A5BEB8", dot: "#88A397", select: "#BDD0C9", focus: "#7A9A8F",
  grey2: "#777772",                 // the second line of every headline
  white: "#FFFFFF", well: "#E9E9E7", wellHero: "#EAEAE7", tile: "#F0F0ED", chip: "#F3F3F0", logoGrey: "#5C5C59",
  btn: "#171716", btnEdge: "#343432", btnHover: "#30302C", tagDark: "#242423",
  // the dark contact panel
  panel: "#141413", onPanel: "#F5F5F2", onPanel2: "#AAA9A1", onPanel3: "#92928B", panelRule: "#393933", panelLabel: "#85857C",
  // the ambient field behind the site shell
  amb0: "#090909", amb1: "#4B4B49", amb2: "#B0B0AA", amb3: "#353534", ambBlob: "#B8B8B2", body: "#242423",
  label: "#777770", rule: "#C9C9C2", sig: "#BDBDB6", desc: "#4F4F4B", faint: "#888882", num: "#757571",
};
export const F = { ui: "Manrope" };

/** The site's one curve: --ease: cubic-bezier(.22,1,.36,1). */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
/** The site's floats: ease-in-out (CSS `ease-in-out`). */
export const INOUT = Easing.bezier(0.42, 0, 0.58, 1);
/** A move between two held states (the camera's and big objects'), symmetric and calm. */
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
/** Exits: they leave a little faster than things arrive, and accelerate. */
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const LIN = (t: number) => t;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Frame of a label (or label±s), plus d seconds. */
export const W = (pos: string, d = 0) => T.f(pos) + Math.round(d * 30);
/** 0..1 between frame a and a+n, eased (the site's curve by default). */
export const pr = (g: number, a: number, n: number, ease: (t: number) => number = EASE) => ease(clamp01((g - a) / Math.max(1, n)));
/** Seconds to frames. */
export const sf = (s: number) => Math.round(s * 30);

export const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const rgba = (h: string, a: number) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
export const mix = (a: string, b: string, t: number) => {
  const x = hex(a), y = hex(b);
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp01(t)))).join(",")})`;
};
/** Absolute placement by centre, on transforms only (no left/top under a scale: no pixel snapping). */
export const at = (x: number, y: number, sc = 1, o = 1, extra = ""): React.CSSProperties =>
  ({ position: "absolute", left: 0, top: 0, transform: `perspective(2000px) translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${sc}) ${extra} rotateX(0.01deg)`, opacity: o });
/** A vertical offset that glides at sub-pixel steps (no whole-pixel snapping on slow text). */
export const rise = (dy: number, dx = 0) => `perspective(2000px) translate3d(${dx}px, ${dy}px, 0) rotateX(0.01deg)`;

/** The site's reveal (.js-motion .reveal): opacity 0→1 and a rise of `dy` px → 0 over 0.85 s on its curve, after `delay` frames. */
export const reveal = (g: number, a: number, delay = 0, dy = 34, dur = 26): React.CSSProperties => {
  const k = pr(g, a + delay, dur);
  return { opacity: k, transform: `translate3d(0, ${dy * (1 - k)}px, 0)` };
};
/** The site's floats: sculpture 9 s (−9 px, 1.5°), tags 7 s (−6 px), as an offset at frame g (period in s, phase in s). */
export const float = (g: number, period = 9, amp = 1, phase = 0) => {
  const t = (((g / 30 + phase) % period) + period) % period / period;          // 0..1 over a period
  const k = t < 0.5 ? INOUT(t * 2) : INOUT(2 - t * 2);                          // up and back, eased both ways
  return k * amp;
};

// the site's shadows (scaled ×2 for the film where noted)
export const SH = {
  shell: "0 60px 200px rgba(0,0,0,0.2)",
  card: "0 32px 70px rgba(0,0,0,0.03)",
  tag: "0 12px 36px rgba(0,0,0,0.04)",
  nav: "0 16px 52px rgba(0,0,0,0.02)",
  btn: "0 6px 10px rgba(0,0,0,0.13), inset 0 2px 4px rgba(255,255,255,0.14)",
  soft: "0 30px 60px rgba(0,0,0,0.06)",
};
