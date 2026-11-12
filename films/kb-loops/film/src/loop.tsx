// K.B client-case loops (10 s, 1920×1080, 60 fps, silent, seamless). Shared clock and motion for every case.
// - useT(): seconds 0 → 10 inside the loop. The picture at t = 10 must equal t = 0 (the loop seam): end every case by
//   returning to its opening state, and make anything that runs the whole time periodic (cyc).
// - seg(t, a, b, ease): 0 → 1 between a and b seconds.   cyc(t, period, phase): 0 → 1 repeating (period divides 10).
// - pop(t, at, o): Karl's house motion (Nov 2026: "everything should bounce a bit"; "heavy Apple-style"): a soft start and a
//   small settle (o.over 0.03 for big surfaces, 0.05–0.08 for small things; o.dur = time to the peak).
//   popOut(t, at, o): the reverse. The camera never bounces.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, useCurrentFrame } from "remotion";
import { fontsReady } from "./fonts";
import { C } from "./kb";

export const FPS = 60, SECONDS = 10, FRAMES = FPS * SECONDS, W = 1920, H = 1080;
export const SAFE = { x: 144, y: 96, w: 1632, h: 888 };
export const useT = () => useCurrentFrame() / FPS;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1), OUT = Easing.bezier(0.22, 1, 0.36, 1), SOFT = Easing.bezier(0.42, 0, 0.18, 1);
export const seg = (t: number, a: number, b: number, ease: (x: number) => number = SOFT) => ease(clamp01((t - a) / (b - a)));
export const cyc = (t: number, period: number, phase = 0) => (((t / period + phase) % 1) + 1) % 1;
const springOver = (t: number, over: number) => {
  const L = Math.log(Math.max(1e-4, over)), z = Math.max(0.35, Math.min(0.95, -L / Math.sqrt(Math.PI * Math.PI + L * L)));
  const wd = Math.PI, w0 = wd / Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
};
const soft = (t: number, a = 0.18) => (t <= 0 ? 0 : t < a ? (t * t) / (2 * a) : t - a / 2);
export const pop = (t: number, at: number, o: { dur?: number; over?: number } = {}) => {
  const u = (t - at) / (o.dur ?? 0.6);
  return u <= 0 ? 0 : springOver(soft(u) * 1.09, o.over ?? 0.05);
};
export const popOut = (t: number, at: number, o: { dur?: number; over?: number } = {}) => {
  const u = clamp01((t - at) / (o.dur ?? 0.5)), antic = (o.over ?? 0.03) * Math.sin(Math.PI * clamp01(u / 0.3));
  return t <= at ? 1 : 1 + antic - u * u * (3 - 2 * u) * (1 + antic);
};
// Frame: the K.B canvas, fonts loaded before the first frame. Put each case inside it.
export const Frame: React.FC<{ children?: React.ReactNode; bg?: string }> = ({ children, bg = C.canvas }) => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => { fontsReady.then(() => continueRender(h)); }, [h]);
  return <AbsoluteFill style={{ background: bg, overflow: "hidden", fontFamily: "Montserrat" }}>{children}</AbsoluteFill>;
};
