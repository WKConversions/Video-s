import React from "react";
import { IN, k } from "../kit";
/** scene exit: fade and sink during [t1, t1+0.8] */
export const Exit: React.FC<{ t: number; t1: number; children: React.ReactNode }> = ({ t, t1, children }) => {
  const b = k(t, t1, 0.8, IN);
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - b, transform: `translateY(${(b * 18).toFixed(2)}px)` }}>{children}</div>;
};
export const bar = (w: number, h = 18, color = "rgba(23,43,68,0.12)"): React.CSSProperties => ({ width: w, height: h, borderRadius: h / 2, background: color });
