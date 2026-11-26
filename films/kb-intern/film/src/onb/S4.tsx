import React from "react";
import { C, F, OUT, INOUT, IN, k, enter, breathe, Card, Avatar, Title, mix } from "../kit";
import { w } from "./timing";

type Props = { t: number; t0: number; t1: number };
const COLS = ["Backlog", "In Progress", "Done"];
const CX = (i: number) => 300 + i * 450;
const DAYS_X = (i: number) => 300 + i * 268;
const Bar: React.FC<{ w: number; h?: number; style?: React.CSSProperties }> = ({ w: ww, h = 16, style }) => <div style={{ width: ww, height: h, borderRadius: h / 2, background: C.ice2, ...style }} />;

export const S4: React.FC<Props> = ({ t, t1 }) => {
  const dy = breathe(t, 6, 7);
  const bIn = k(t, 34.9, 0.9);
  const m1 = k(t, w("progress") - 0.2, 0.7, INOUT), m2 = k(t, w("done") - 0.2, 0.7, INOUT);
  const col = m2 > 0 ? mix(1, 2, m2) : mix(0, 1, m1);
  const cal = k(t, w("plan") - 0.1, 0.9, INOUT);
  const cardX = mix(CX(0), CX(2), 0) + (CX(1) - CX(0)) * m1 + (CX(2) - CX(1)) * m2;
  const out = k(t, t1 + 0.1, 0.8, IN);
  const live = k(t, w("live") - 0.1, 0.6);
  const sprint = k(t, w("sprint") - 0.1, 0.7);
  const colOp = 1 - cal;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${dy}px)` }}>
      <div style={{ position: "absolute", left: 260, top: 100, ...enter(bIn, 40), transform: `translateY(${(1 - bIn) * 40 + cal * 20}px)` }}>
        <Card w={1400} h={860} r={36} pad={0}>
          <div style={{ position: "relative", width: 1400, height: 860 }}>
            <Title size={64} style={{ position: "absolute", left: 40, top: 36, opacity: 1 }}>KB · Marketing</Title>
            {COLS.map((c, i) => (
              <div key={i} style={{ position: "absolute", left: CX(i) - 260, top: 190, width: 420, height: 620, opacity: colOp, transform: `translateY(${cal * 30}px)` }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 36, color: C.navy, marginBottom: 20 }}>{c}</div>
                <div style={{ height: 540, borderRadius: 24, background: C.ice, opacity: 0.8 }} />
              </div>
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ position: "absolute", left: DAYS_X(i) - 260, top: 190, width: 248, opacity: cal, transform: `translateY(${(1 - cal) * 30}px)` }}>
                <Bar w={248} h={44} style={{ background: C.ice2 }} />
                <div style={{ height: 540, borderRadius: 24, background: C.ice, marginTop: 24 }} />
              </div>
            ))}
            <div style={{ position: "absolute", left: DAYS_X(0) - 260 + 14, top: 190 + 44 + 24 + 20, width: 220, opacity: sprint, transform: `translateY(${(1 - sprint) * 16}px)` }}>
              <div style={{ background: C.navy, color: C.white, borderRadius: 18, padding: "18px 16px", fontFamily: F, fontWeight: 800, fontSize: 28, lineHeight: 1.15, boxShadow: "0 8px 24px -10px rgba(23,43,68,0.4)" }}>Monday: sprint planning</div>
            </div>
            <div style={{ position: "absolute", left: cardX - 260 + 20, top: 270, width: 380, opacity: 1 - cal, transform: `translateY(${cal * 30}px)` }}>
              <Card w={380} pad={24} r={24} style={{ border: `1.5px solid ${C.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar size={56} />
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 32, whiteSpace: "nowrap" }}>LinkedIn post</div>
                </div>
                <Bar w={320} style={{ marginTop: 22 }} /><Bar w={240} style={{ marginTop: 12 }} />
              </Card>
              <div style={{ marginTop: 22, opacity: live, transform: `translateY(${(1 - live) * 14}px)`, visibility: cardX > CX(1) ? "visible" : "hidden" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 24px", borderRadius: 999, background: C.white, border: `1.5px solid ${C.line}`, fontFamily: F, fontWeight: 800, fontSize: 32, color: C.navy, boxShadow: "0 8px 24px -10px rgba(23,43,68,0.22)" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 999, background: C.green }} />Done = live
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div style={{ display: "none" }}>{col}{OUT(0)}</div>
    </div>
  );
};
