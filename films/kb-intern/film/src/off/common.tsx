import React from "react";
import { C, Cursor, IN, c01, cursorAt, float, k } from "../kit";

/** scene exit: a move (slide left + shrink) with IN, during [t1, t1+0.9] */
export const Exit: React.FC<{ t: number; t1: number; children: React.ReactNode }> = ({ t, t1, children }) => {
  const b = k(t, t1, 0.9, IN);
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - b, transform: `translateX(${(-160 * b).toFixed(1)}px) scale(${(1 - 0.08 * b).toFixed(4)})` }}>{children}</div>;
};
export const bar = (w: number, h = 18, color = "rgba(23,43,68,0.12)"): React.CSSProperties => ({ width: w, height: h, borderRadius: h / 2, background: color });
/** transform for a centred (at()) element entering: rise/slide + scale, p 0..1 */
export const entT = (p: number, dx = 0, dy = 36) => `translate(-50%,-50%) translate(${((1 - p) * dx).toFixed(1)}px,${((1 - p) * dy).toFixed(1)}px) scale(${(0.93 + 0.07 * p).toFixed(4)})`;
export const fl = (t: number, seed: number, amp = 8): React.CSSProperties => {
  const f = float(t, seed, amp);
  return { transform: `translate(${f.x.toFixed(2)}px, ${f.y.toFixed(2)}px) rotate(${f.r.toFixed(3)}deg)` };
};
/** soft drifting shapes on the navy page: depth and constant motion */
export const Ambient: React.FC<{ t: number; seed?: number }> = ({ t, seed = 0 }) => (
  <>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const f = float(t, i + seed * 7, 26), sz = 50 + ((i * 37 + seed * 11) % 5) * 28;
      const x = [160, 1760, 300, 1640, 980, 90, 1830][i], y = [330, 400, 880, 900, 960, 650, 700][i];
      return <div key={i} style={{ position: "absolute", left: x + f.x * 2, top: y + f.y * 2, width: sz, height: sz, borderRadius: i % 2 ? "50%" : sz * 0.28, background: C.blue, opacity: 0.06 + (i % 3) * 0.03, transform: `rotate(${(t * 6 + i * 40) % 360}deg)` }} />;
    })}
  </>
);
/** a cursor driven by waypoints [t,x,y]; presses at the click times */
export const Cur: React.FC<{ t: number; pts: [number, number, number][]; clicks: number[]; tin: number; tout: number }> = ({ t, pts, clicks, tin, tout }) => {
  const o = k(t, tin, 0.3) * (1 - k(t, tout, 0.4, IN));
  if (o <= 0.001) return null;
  const { x, y } = cursorAt(pts, t);
  const last = clicks.filter((c) => c - 0.05 <= t).pop();
  const press = last === undefined ? 0 : c01((t - (last - 0.05)) / 0.45);
  return <Cursor x={x} y={y} press={press} o={o} />;
};
export const pulse = (t: number, t0: number, period = 1.1) => (t < t0 ? 0 : ((t - t0) % period) / period);
