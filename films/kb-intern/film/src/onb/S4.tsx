import React from "react";
import { C, F, INOUT, IN, k, enter, Card, Avatar, Title, mix, Camera, floatStyle, warp, Cursor, cursorAt, ToolIcon, Ring } from "../kit";
import { w } from "./timing";
import { exitFx, pulse } from "./fx";

type Props = { t: number; t0: number; t1: number };
const COLS = ["Backlog", "In Progress", "Done"];
const CX = (i: number) => 40 + i * 450;
const DX = (i: number) => 40 + i * 268;
const BX = 260, BY = 100, SLOT = (s: number) => 190 + s * 170;
const GREY = "#DFE1E6", JB = "#0052CC";
const Bar: React.FC<{ w: number; h?: number; c?: string; style?: React.CSSProperties }> = ({ w: ww, h = 14, c = GREY, style }) => <div style={{ width: ww, height: h, borderRadius: h / 2, background: c, ...style }} />;
const Issue: React.FC<{ type: "blue" | "green"; children?: React.ReactNode; hl?: boolean }> = ({ type, children, hl }) => (
  <div style={{ width: 420, height: 150, boxSizing: "border-box", background: C.white, borderRadius: 10, padding: 20, boxShadow: hl ? "0 20px 40px -12px rgba(9,30,66,0.4)" : "0 1px 2px rgba(9,30,66,0.25)", border: hl ? `2px solid ${JB}` : "none" }}>
    {children ?? (<><Bar w={300} h={16} /><Bar w={200} style={{ marginTop: 12 }} /></>)}
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
      <div style={{ width: 24, height: 24, borderRadius: 6, background: type === "blue" ? "#4BADE8" : "#36B37E" }} /><Bar w={70} h={12} /><div style={{ flex: 1 }} /><Avatar size={32} />
    </div>
  </div>
);
const EXTRA: [number, number, "blue" | "green"][] = [[0, 1, "blue"], [0, 2, "green"], [1, 1, "blue"], [2, 1, "green"]];

export const S4: React.FC<Props> = ({ t, t0, t1 }) => {
  const wt = warp(t, [[37.4, 38.0], [39.7, 40.2], [43.4, 44.0]]);
  const bIn = k(t, 34.9, 0.9);
  const m1 = k(t, w("progress") - 0.2, 0.7, INOUT), m2 = k(t, w("done") - 0.2, 0.7, INOUT);
  const cal = k(t, w("plan") - 0.1, 0.9, INOUT);
  const cardX = CX(0) + (CX(1) - CX(0)) * m1 + (CX(2) - CX(1)) * m2;
  const drag = k(t, 37.6, 0.2) * (1 - k(t, 39.94, 0.25));
  const live = k(t, w("live") - 0.1, 0.6);
  const sprint = k(t, w("sprint") - 0.1, 0.7);
  const gx = (c: number) => BX + c + 170, gy = BY + SLOT(0) + 70;
  const cur = cursorAt([[36.9, 1560, 900], [37.55, gx(CX(0)), gy], [38.4, gx(CX(0)), gy], [39.1, gx(CX(1)), gy], [39.24, gx(CX(1)), gy], [39.94, gx(CX(2)), gy],
    [40.7, 1500, 760], [42.9, 1500, 820], [43.55, BX + DX(0) + 120, BY + 400], [44.4, BX + DX(1), BY + 520]], t);
  const curO = Math.max(k(t, 36.9, 0.3) * (1 - k(t, 40.4, 0.4, IN)), k(t, 42.9, 0.3) * (1 - k(t, 44.1, 0.4, IN)));
  const clicks = [37.5, 39.94, 43.5];
  const pressNow = clicks.reduce((a, c) => (t >= c && t < c + 0.4 ? (t - c) / 0.4 : a), 0);
  const hdr = mix(0, 1, cal);
  return (
    <Camera t={wt} t0={t0} t1={t1}>
      <div style={{ position: "absolute", left: BX, top: BY, ...exitFx(t, t1, -300, 0) }}>
        <div style={{ ...enter(bIn, 50), ...floatStyle(wt, 4, 6) }}>
          <Card w={1400} h={860} r={28} pad={0} style={{ overflow: "hidden", position: "relative", background: C.white }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1400, height: 100, background: JB }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 1400, height: 100, background: C.navy, opacity: hdr }} />
            <div style={{ position: "absolute", left: 36, top: 18, display: "flex", alignItems: "center", gap: 20 }}>
              <ToolIcon tool="jira" size={64} />
              <Title size={46} style={{ color: C.white }}>KB · Marketing</Title>
            </div>
            <div style={{ position: "absolute", left: 0, top: 100, width: 1400, height: 760, background: "#FAFBFC" }} />
            {COLS.map((c, i) => (
              <div key={i} style={{ position: "absolute", left: CX(i), top: 130, width: 420, height: 700, borderRadius: 12, background: "#F4F5F7", opacity: 1 - cal, transform: `translateY(${cal * 30}px)` }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 26, color: "#5E6C84", padding: "18px 20px" }}>{c}</div>
              </div>
            ))}
            {EXTRA.map(([c, s, ty], i) => (
              <div key={i} style={{ position: "absolute", left: CX(c), top: SLOT(s) - 60 + 60 - 0, opacity: (1 - cal) * k(t, 35.5 + i * 0.12, 0.6), transform: `translateY(${cal * 30}px)` }}><Issue type={ty} /></div>
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ position: "absolute", left: DX(i), top: 130, width: 248, opacity: cal, transform: `translateY(${(1 - cal) * 30}px)` }}>
                <Bar w={248} h={40} c={GREY} />
                <div style={{ height: 640, borderRadius: 12, background: C.white, border: `2px solid ${GREY}`, marginTop: 16 }}>
                  <Bar w={90} h={14} style={{ margin: 18 }} />
                </div>
              </div>
            ))}
            <div style={{ position: "absolute", left: DX(0) + 12, top: 130 + 56 + 60, width: 224, opacity: sprint, transform: `translateY(${(1 - sprint) * 16}px) scale(${mix(0.9, 1, sprint)})`, transformOrigin: "0 0" }}>
              <div style={{ background: JB, color: C.white, borderRadius: 10, padding: "20px 16px", fontFamily: F, fontWeight: 800, fontSize: 28, lineHeight: 1.15, boxShadow: "0 10px 24px -8px rgba(0,82,204,0.6)", borderLeft: "8px solid #4C9AFF" }}>Monday: sprint planning</div>
            </div>
            <div style={{ position: "absolute", left: cardX, top: SLOT(0) - 0, opacity: (1 - cal) * k(t, 35.3, 0.6), transform: `translateY(${cal * 30 - drag * 8}px) rotate(${(drag * 3).toFixed(2)}deg)` }}>
              <Issue type="blue" hl>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar size={44} /><div style={{ fontFamily: F, fontWeight: 800, fontSize: 30, color: "#172B4D", whiteSpace: "nowrap" }}>LinkedIn post</div>
                </div>
                <Bar w={320} style={{ marginTop: 14, height: 12 }} />
              </Issue>
              <div style={{ position: "absolute", right: 14, top: -26, opacity: live * (cardX > CX(1) + 200 ? 1 : 0), transform: `translateY(${(1 - live) * 14}px)` }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: C.white, border: `2px solid #36B37E`, fontFamily: F, fontWeight: 800, fontSize: 30, color: "#172B4D", boxShadow: "0 8px 20px -8px rgba(9,30,66,0.4)" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 999, background: C.green }} />Done = live
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Ring x={BX + DX(0) + 120} y={BY + 400} p={t > 43.5 && t < 45 ? pulse(t, 43.5, 1) : 0} r={90} color={C.blue} />
      <Cursor x={cur.x} y={cur.y} press={pressNow} o={curO} />
    </Camera>
  );
};
