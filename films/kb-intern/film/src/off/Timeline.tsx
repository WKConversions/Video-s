import React from "react";
import { C, F, INOUT, OUT, Ring, at, abs, k, mix } from "../kit";
import { W, w } from "./timing";
import { pulse } from "./common";

const STOPS = ["2 weeks before", "Last week", "Last day", "Afterwards"];
const s5 = W.find((x) => x.s === 5 && x.w === "your")!.t;
const ACT = [w("two"), w("last"), w("last", 2), s5];
const POP = [w("here's"), w("wrap"), w("up"), w("properly")];

export const Timeline: React.FC<{ t: number }> = ({ t }) => {
  if (t < 5.0) return null;
  const g = k(t, 7.78, 0.8, INOUT);
  const fade = 1 - k(t, 43.8, 0.4, OUT);
  if (fade <= 0.001) return null;
  const xs = [0, 1, 2, 3].map((i) => mix(330 + i * 420, 410 + i * 366, g));
  const y = mix(720, 112, g);
  const lh = mix(8, 5, g);
  const draw = k(t, 5.1, 1.2, OUT);
  const act = ACT.filter((a) => t >= a).length - 1;
  const fp = [1, 2, 3].reduce((s, i) => s + k(t, ACT[i], 0.7, INOUT), 0);
  const x0 = xs[0], x3 = xs[3];
  const fillW = act >= 0 ? fp * (xs[1] - xs[0]) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, fontFamily: F }}>
      <div style={abs(x0, y - lh / 2, (x3 - x0) * draw, lh, { background: "rgba(255,255,255,0.2)", borderRadius: lh })} />
      <div style={abs(x0, y - lh / 2, Math.min(fillW, (x3 - x0) * draw), lh, { borderRadius: lh, backgroundImage: `repeating-linear-gradient(90deg, ${C.blue} 0px, ${C.blue} 26px, ${C.blueS} 26px, ${C.blueS} 52px)`, backgroundPosition: `${(t * 90).toFixed(1)}px 0` })} />
      {act >= 0 && <Ring x={xs[act]} y={y} p={pulse(t, ACT[act])} r={mix(70, 46, g)} color={C.blue} />}
      {STOPS.map((label, i) => {
        const pop = k(t, POP[i], 0.5, OUT);
        const isAct = act === i, done = act > i;
        const a = k(t, ACT[i], 0.4, OUT);
        const r = mix(18, 11, g) * (0.4 + 0.6 * pop) * (isAct ? 1 + 0.3 * a : 1);
        return (
          <React.Fragment key={i}>
            <div style={at(xs[i], y, { width: r * 2, height: r * 2, borderRadius: "50%", opacity: pop, boxSizing: "border-box",
              background: isAct || done ? C.blue : "rgba(255,255,255,0.4)", boxShadow: isAct ? `0 0 0 ${mix(9, 6, g) * a}px rgba(153,205,252,0.35)` : "none" })} />
            <div style={at(xs[i], y + mix(62, 42, g), { opacity: pop * (isAct ? 1 : 0.6), fontSize: mix(44, 28, g), fontWeight: isAct ? 800 : 600, color: C.white,
              whiteSpace: "nowrap", letterSpacing: "-0.02em", transform: `translate(-50%, -50%) translateY(${((1 - pop) * 14).toFixed(1)}px)` })}>{label}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
