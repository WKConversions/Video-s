import React from "react";
import { Avatar, C, Card, F, INOUT, OUT, Title, at, breathe, k, mix } from "../kit";
import { Exit, bar } from "./common";
import { w, wEnd } from "./timing";

export const S2: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t1 }) => {
  const dIn = k(t, w("send"), 0.7), av = k(t, w("supervisor"), 0.7);
  const st = k(t, w("written"), 0.35, OUT);
  const slide = k(t, wEnd("approval"), 1.0, INOUT);
  const hl = k(t, w("confidential"), 0.8);
  const cx = mix(700, 1130, slide), cy = 610 + breathe(t, 6, 6.5);
  const sc = mix(1, 0.55, slide);
  const op = (1 - Math.max(0, (slide - 0.8) / 0.2));
  const rows = [380, 300, 420, 340];
  return (
    <Exit t={t} t1={t1}>
      <div style={{ ...at(1430, 600), opacity: av, transform: `translate(-50%,-50%) translateY(${((1 - av) * 28).toFixed(1)}px) scale(${(0.96 + 0.04 * av).toFixed(4)})`, textAlign: "center" }}>
        <Avatar size={220} />
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 44, color: C.navy, marginTop: 24, letterSpacing: "-0.03em", textAlign: "center" }}>Supervisor</div>
      </div>
      <div style={{ ...at(cx, cy), opacity: dIn * op, transform: `translate(-50%,-50%) translateY(${((1 - dIn) * 28).toFixed(1)}px) scale(${((0.96 + 0.04 * dIn) * sc).toFixed(4)})` }}>
        <Card w={580} h={640} pad={44}>
          <Title size={48}>Internship report</Title>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 26 }}>
            {rows.map((rw, i) => {
              const p = k(t, w("send") + 0.3 + i * 0.25, 0.6);
              return <div key={i} style={{ ...bar(rw * p), opacity: p }} />;
            })}
            <div style={{ position: "relative", width: 480, height: 18 }}>
              <div style={bar(480)} /><div style={{ position: "absolute", left: 0, top: 0, ...bar(480 * hl, 18, C.blue) }} />
            </div>
            <div style={bar(360 * k(t, w("send") + 1.3, 0.6))} />
            <div style={bar(440 * k(t, w("send") + 1.5, 0.6))} />
          </div>
          <div style={{ position: "absolute", left: 150, top: 330, opacity: st, transform: `rotate(-6deg) scale(${mix(1.15, 1, st).toFixed(4)})`, transformOrigin: "center",
            border: `7px solid ${C.navy}`, borderRadius: 18, padding: "14px 26px", color: C.navy, fontFamily: F, fontWeight: 800, fontSize: 42, whiteSpace: "nowrap",
            background: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em" }}>K.B approval needed</div>
        </Card>
      </div>
    </Exit>
  );
};
