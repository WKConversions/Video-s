import React from "react";
import { Avatar, C, Card, Check, F, INOUT, OUT, Padlock, Title, at, breathe, k, mix } from "../kit";
import { bar } from "./common";
import { w } from "./timing";

const Row: React.FC<{ p: number; label: string; mark: React.ReactNode }> = ({ p, label, mark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, height: 96, borderRadius: 22, background: C.ice, padding: "0 28px", fontFamily: F, fontWeight: 800, fontSize: 38,
    color: C.navy, letterSpacing: "-0.03em", whiteSpace: "nowrap", opacity: p, transform: `translateY(${((1 - p) * 24).toFixed(1)}px)` }}>
    {mark}<span>{label}</span>
  </div>
);

export const S5: React.FC<{ t: number; t0: number; t1: number }> = ({ t }) => {
  const lock = k(t, w("confidentiality"), 0.8), txt = k(t, w("confidentiality") + 0.1, 0.7);
  const m = k(t, w("no") - 0.1, 0.9, INOUT);
  const prof = k(t, w("no") + 0.1, 0.7);
  const r1 = k(t, w("client"), 0.6), c1 = k(t, w("names"), 0.6);
  const r2 = k(t, w("without"), 0.6), c2 = k(t, w("approval", 2), 0.4, OUT);
  const clear = k(t, 43.6, 0.45, OUT);
  const end = k(t, w("good"), 0.8);
  const body = 1 - clear;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: body }}>
        <div style={{ ...at(mix(960, 470, m), mix(470, 500, m) + breathe(t, 6, 6.5)), opacity: lock, display: "flex", flexDirection: "column", alignItems: "center", gap: 36,
          transform: `translate(-50%,-50%) translateY(${((1 - lock) * 28).toFixed(1)}px) scale(${mix(1, 0.55, m).toFixed(4)})` }}>
          <Padlock size={170} />
          <div style={{ opacity: txt }}><Title size={88}>Confidentiality continues</Title></div>
        </div>
        <div style={{ ...at(1290, 540 + breathe(t + 1, 6, 6.5)), opacity: prof, transform: `translate(-50%,-50%) translateY(${((1 - prof) * 28).toFixed(1)}px) scale(${(0.96 + 0.04 * prof).toFixed(4)})` }}>
          <Card w={860} pad={44}>
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 36 }}>
              <Avatar size={120} />
              <div><div style={bar(340, 28, "rgba(23,43,68,0.2)")} /><div style={{ ...bar(480, 20), marginTop: 18 }} /></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <Row p={r1} label="Role and skills: yes" mark={<Check size={56} p={c1} color={C.greenInk} />} />
              <Row p={r2} label="Client names: only with approval" mark={
                <svg width={56} height={56} viewBox="0 0 100 100" style={{ opacity: c2, transform: `scale(${mix(0.6, 1, c2).toFixed(3)})` }}>
                  <circle cx={50} cy={50} r={46} fill={C.navy} /><rect x={44} y={24} width={12} height={34} rx={6} fill={C.blue} /><circle cx={50} cy={74} r={7} fill={C.blue} />
                </svg>} />
            </div>
          </Card>
        </div>
      </div>
      <div style={{ ...at(960, 690 + breathe(t, 6, 6)), opacity: end, transform: `translate(-50%,-50%) translateY(${((1 - end) * 28).toFixed(1)}px) scale(${(0.96 + 0.04 * end).toFixed(4)})`, whiteSpace: "nowrap" }}>
        <Title size={104}>Good luck!</Title>
      </div>
    </>
  );
};
