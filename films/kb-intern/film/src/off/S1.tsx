import React from "react";
import { C, IN, OUT, Ring, Title, at, breathe, k } from "../kit";
import { Exit } from "./common";
import { w } from "./timing";

export const S1: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t1 }) => {
  const tin = k(t, w("thank"), 0.7), tout = k(t, 4.9, 0.6, IN);
  const dots = [[430, 300, 26, 0], [1500, 240, 18, 2], [1620, 520, 32, 4], [300, 600, 20, 1], [1180, 820, 14, 3]];
  return (
    <Exit t={t} t1={t1}>
      {dots.map(([x, y, r, ph], i) => (
        <div key={i} style={at(x + breathe(t + ph, 14, 6), y + breathe(t + ph * 2, 12, 5), { width: r * 2, height: r * 2, borderRadius: "50%", background: i % 2 ? C.blue : C.ice2,
          opacity: k(t, 0.8 + i * 0.2, 1.0) * (1 - tout) })} />
      ))}
      <Ring x={960} y={380} p={k(t, 1.0, 1.0, OUT) < 1 ? k(t, 1.0, 1.0, OUT) : 0} r={190} />
      <div style={{ ...at(960, 590 + breathe(t, 5, 6)), opacity: tin * (1 - tout), transform: `translate(-50%,-50%) translateY(${((1 - tin) * 28 - tout * 40).toFixed(1)}px) scale(${(0.96 + 0.04 * tin).toFixed(3)})` }}>
        <Title size={116}>Thank you!</Title>
      </div>
    </Exit>
  );
};
