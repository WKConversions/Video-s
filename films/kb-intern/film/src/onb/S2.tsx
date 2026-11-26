import React from "react";
import { C, F, OUT, INOUT, IN, k, enter, breathe, Card, Check, Padlock, c01, mix } from "../kit";
import { w, wEnd } from "./timing";
import { S2PIN } from "./S1";

type Props = { t: number; t0: number; t1: number };
const X0 = 200, X1 = 1560;
const yP = (x: number) => 600 + 60 * Math.sin(((x - X0) / (X1 - X0)) * Math.PI * 2);
const CP = [260, 760, 1260];
const LABELS = ["Confidentiality signed", "Laptop secured", "Approved tools + AI use guidelines read"];
const TICK = [w("confidentiality") + 0.5, w("laptop"), wEnd("guidelines") - 0.4];
const frac = (x: number) => (x - X0) / (X1 - X0);
const T0 = w("security");
const KT = [T0 + 0.2, TICK[0] - 0.3, TICK[1] - 0.3, TICK[2] - 0.3, TICK[2] + 0.3];
const KF = [0, frac(CP[0]), frac(CP[1]), frac(CP[2]), 1];
const prog = (t: number) => {
  if (t <= KT[0]) return 0;
  for (let i = 1; i < KT.length; i++) if (t <= KT[i]) return mix(KF[i - 1], KF[i], INOUT(c01((t - KT[i - 1]) / (KT[i] - KT[i - 1]))));
  return 1;
};
const PTS: number[][] = [];
for (let x = X0; x <= X1; x += 8) PTS.push([x, yP(x)]);

export const S2: React.FC<Props> = ({ t, t1 }) => {
  const p = prog(t);
  const n = Math.max(2, Math.round(p * (PTS.length - 1)) + 1);
  const dy = breathe(t, 6, 7);
  const lockIn = k(t, TICK[2] - 1.0, 0.7);
  const open = k(t, wEnd("guidelines"), 0.8);
  const go = k(t, t1 - 0.2, 1.1, INOUT);
  const lx = mix(1700, 960, go), ly = mix(yP(X1) + 40, 330, go);
  const lockS = 1 - 0.45 * go;
  const pinIn = k(t, 11.9, 0.3);
  const fadeOut = 1 - k(t, t1 + 0.1, 0.8, IN);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px)`, opacity: 1 - k(t, t1 + 0.1, 0.7, IN) }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <polyline points={PTS.map((q) => q.join(",")).join(" ")} fill="none" stroke={C.lineSoft} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={k(t, T0 - 0.2, 0.5)} />
          <polyline points={PTS.slice(0, n).map((q) => q.join(",")).join(" ")} fill="none" stroke={C.blueS} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0 ? 1 : 0} />
        </svg>
        {CP.map((x, i) => {
          const y = yP(x), tk = k(t, TICK[i], 0.6);
          const arrive = i === 0 ? pinIn : k(t, KT[i] - 0.5, 0.4);
          const pop = k(t, TICK[i] - 0.3, 0.7);
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x - 36, top: y - 36, opacity: arrive }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.white, border: `3px solid ${C.line}`, transform: `scale(${mix(0.35, 1, OUT(arrive))})`, opacity: 1 - tk }} />
                <Check size={72} p={tk} />
              </div>
              <div style={{ position: "absolute", left: x - 230, top: y - 230, width: 460, ...enter(pop) }}>
                <Card w={460} pad={26} r={26} style={{ textAlign: "center", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, minHeight: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>{LABELS[i]}</Card>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: lockIn * (1 - k(t, t1 + 0.55, 0.35, IN)), transform: `translate(${lx - 60}px, ${ly - 72 + dy * (1 - go)}px) scale(${lockS * mix(0.9, 1, OUT(lockIn))})`, transformOrigin: "50% 50%" }}>
        <Padlock size={120} open={open} />
      </div>
      <div style={{ display: "none", fontFamily: F, opacity: fadeOut }}>{S2PIN[0]}</div>
    </div>
  );
};
