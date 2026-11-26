import React from "react";
import { IN, k } from "../kit";

/** an exit that is a move: slide + shrink out over [t1, t1+0.9] with IN */
export const exitFx = (t: number, t1: number, dx = -260, dy = 0): React.CSSProperties => {
  const p = k(t, t1 + 0.05, 0.85, IN);
  return { opacity: 1 - p, transform: `translate(${dx * p}px, ${dy * p}px) scale(${1 - 0.08 * p})` };
};
/** a line with a flowing dash on top (animated continuously) */
export const Flow: React.FC<{ d: string; t: number; color: string; width?: number; o?: number; speed?: number }> = ({ d, t, color, width = 6, o = 1, speed = 70 }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`2 ${width * 3.2}`} strokeDashoffset={-t * speed} opacity={o} />
);
/** rising pulse phase 0..1 repeating every `period` seconds from `start` */
export const pulse = (t: number, start: number, period = 1): number => (t < start ? 0 : ((t - start) % period) / period);
