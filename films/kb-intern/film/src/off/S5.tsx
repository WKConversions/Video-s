import React from "react";
import { Avatar, C, Camera, Card, Check, F, INOUT, OUT, Padlock, Title, ToolIcon, at, k, mix } from "../kit";
import { warp } from "../kit";
import { Ambient, Cur, bar, entT, fl, pulse } from "./common";
import { w } from "./timing";
import { Ring } from "../kit";

const Row: React.FC<{ p: number; label: string; mark: React.ReactNode }> = ({ p, label, mark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, height: 96, borderRadius: 22, background: C.ice, padding: "0 28px", fontFamily: F, fontWeight: 800, fontSize: 38,
    color: C.navy, letterSpacing: "-0.03em", whiteSpace: "nowrap", opacity: p, transform: `translateX(${((1 - p) * 60).toFixed(1)}px)` }}>
    {mark}<span>{label}</span>
  </div>
);

export const S5: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const lock = k(t, w("confidentiality"), 0.8), txt = k(t, w("confidentiality") + 0.1, 0.7);
  const m = k(t, w("no") - 0.1, 0.9, INOUT);
  const prof = k(t, w("no") + 0.1, 0.7);
  const r1 = k(t, w("client"), 0.6), c1 = k(t, w("names"), 0.6);
  const r2 = k(t, w("without"), 0.6), c2 = k(t, w("approval", 2), 0.4, OUT);
  const clear = k(t, 43.6, 0.45, OUT);
  const end = k(t, w("good"), 0.8);
  const body = 1 - clear;
  const p1 = w("names"), p2 = w("approval", 2);
  const pts: [number, number, number][] = [[w("no") - 0.2, 1700, 950], [p1 - 0.05, 960, 631], [p1 + 0.4, 960, 631], [p1 + 1.2, 1400, 650], [w("without"), 1200, 735], [p2 - 0.05, 960, 749], [p2 + 0.5, 1000, 760]];

  const tw = warp(t, [[p1 - 0.1, p1 + 0.5], [p2 - 0.1, p2 + 0.5]]);
  const tout = 43.4;
  return (
    <Camera t={tw} t0={t0} t1={t1} push={0.04}>
      <Ambient t={tw} seed={5} />
      <div style={{ position: "absolute", inset: 0, opacity: body, transform: `translateY(${(-60 * clear).toFixed(1)}px) scale(${(1 - 0.06 * clear).toFixed(3)})` }}>
        <div style={{ ...at(mix(960, 470, m), mix(470, 500, m)), opacity: lock, transform: `translate(-50%,-50%) translateY(${((1 - lock) * 36).toFixed(1)}px) scale(${mix(1, 0.55, m).toFixed(4)})` }}>
          <div style={{ ...fl(tw, 8, 8), display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
            <div style={{ position: "relative" }}><Padlock size={170} body={C.white} /><Ring x={85} y={110} p={pulse(t, w("confidentiality"), 1.3)} r={150} color={C.blue} /></div>
            <div style={{ opacity: txt, transform: `translateY(${((1 - txt) * 20).toFixed(1)}px)` }}><Title size={88}>Confidentiality continues</Title></div>
          </div>
        </div>
        <div style={{ ...at(1290, 540), opacity: prof, transform: entT(prof, 200, 0) }}>
          <div style={fl(tw, 9, 9)}>
            <Card w={860} pad={0} style={{ overflow: "hidden", position: "relative" }}>
              <div style={{ height: 150, background: "#0A66C2", position: "relative" }}>
                <ToolIcon tool="linkedin" size={64} style={{ position: "absolute", right: 28, top: 24 }} />
              </div>
              <div style={{ position: "absolute", left: 44, top: 150 - 70, width: 148, height: 148, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}><Avatar size={132} /></div>
              <div style={{ padding: "90px 44px 44px" }}>
                <div style={bar(340, 28, "rgba(23,43,68,0.2)")} /><div style={{ ...bar(500, 20), marginTop: 18 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 34 }}>
                  <Row p={r1} label="Role and skills: yes" mark={<Check size={56} p={c1} color={C.greenInk} />} />
                  <Row p={r2} label="Client names: only with approval" mark={
                    <svg width={56} height={56} viewBox="0 0 100 100" style={{ opacity: c2, transform: `scale(${mix(0.6, 1, c2).toFixed(3)})` }}>
                      <circle cx={50} cy={50} r={46} fill="#F5A524" /><rect x={44} y={24} width={12} height={34} rx={6} fill={C.navy} /><circle cx={50} cy={74} r={7} fill={C.navy} />
                    </svg>} />
                </div>
              </div>
            </Card>
          </div>
        </div>
        <Cur t={t} pts={pts} clicks={[p1, p2]} tin={w("no") - 0.2} tout={tout} />
      </div>
      <div style={{ ...at(960, 700), opacity: end, transform: entT(end, 0, 40) }}>
        <div style={fl(tw, 12, 8)}><Title size={108}>Good luck!</Title></div>
      </div>
    </Camera>
  );
};
