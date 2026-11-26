import React from "react";
import { C, Camera, IN, OUT, Ring, F, at, k } from "../kit";
import { warp } from "../kit";
import { Ambient, Exit, fl } from "./common";
import { w } from "./timing";

const TXT = "Thank you!";
export const S1: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  
  const tw = warp(t, [[1.0, 1.6]]);
const tout = k(t, 4.9, 0.7, IN), ts = w("thank");
  const dots = [[430, 250, 26], [1500, 200, 18], [1620, 560, 32], [300, 640, 20], [1180, 850, 14], [760, 880, 22]];
  return (
    <Exit t={t} t1={t1}><Camera t={tw} t0={t0} t1={t1}>
      <Ambient t={tw} seed={1} />
      {dots.map(([x, y, r], i) => (
        <div key={i} style={{ ...at(x, y), opacity: k(t, 0.7 + i * 0.12, 0.8) * (1 - tout) * 0.7 }}>
          <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: i % 2 ? C.blue : C.blueS, ...fl(tw, i + 3, 16) }} />
        </div>
      ))}
      {[0, 0.45].map((d, i) => { const p = k(t, 1.0 + d, 1.1, OUT); return <Ring key={i} x={960} y={350} p={p < 1 ? p : 0} r={230} color={C.blue} />; })}
      <div style={{ ...at(960, 600 + k(t, 4.9, 0.7, IN) * -50), opacity: 1 - tout, fontFamily: F, fontWeight: 800, fontSize: 124, color: C.white, letterSpacing: "-0.04em", whiteSpace: "pre", ...{} }}>
        <div style={fl(tw, 2, 6)}>
          {TXT.split("").map((ch, i) => {
            const p = k(t, ts + i * 0.06, 0.4);
            return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${((1 - p) * 30).toFixed(1)}px)` }}>{ch}</span>;
          })}
        </div>
      </div>
    </Camera></Exit>
  );
};
