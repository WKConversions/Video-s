import React from "react";
import { C, F, OUT, INOUT, IN, k, enter, breathe, Card, Avatar, Title } from "../kit";
import { w } from "./timing";

type Props = { t: number; t0: number; t1: number };
const Bar: React.FC<{ w: number; h?: number; style?: React.CSSProperties }> = ({ w: ww, h = 18, style }) => <div style={{ width: ww, height: h, borderRadius: h / 2, background: C.ice2, ...style }} />;
export const S5: React.FC<Props> = ({ t }) => {
  const dy = breathe(t, 6, 7);
  const r1 = k(t, w("never") - 0.2, 0.7), r2 = k(t, w("report") - 0.2, 0.7);
  const rulesOut = k(t, w("first") - 0.1, 0.8, INOUT);
  const post = k(t, w("first") + 0.2, 0.8);
  const postOut = k(t, w("welcome", 2) - 0.45, 0.6, IN);
  const end = k(t, w("welcome", 2) + 0.2, 0.8);
  const rule = (txt: string, p: number, y: number) => (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(calc(-50% - ${rulesOut * 340}px), -50%) scale(${1 - 0.15 * rulesOut})`, opacity: (1 - rulesOut) * p }}>
      <div style={enter(p)}>
        <Card w={1180} pad={44} r={32} style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: 28 }}>
          <span style={{ width: 20, height: 64, borderRadius: 10, background: C.blueS, flexShrink: 0 }} />{txt}
        </Card>
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px)` }}>
      {rule("No client names in public without approval", r1, 400)}
      {rule("Something wrong? Report it the same day", r2, 620)}
      <div style={{ position: "absolute", inset: 0, opacity: post * (1 - postOut), transform: `translateY(${-postOut * 20}px)` }}>
        <Title size={72} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 70, ...enter(k(t, w("linkedin") - 0.1, 0.6)) }}>Introduction post</Title>
        <div style={{ position: "absolute", left: 960 - 400, top: 210, ...enter(post, 40) }}>
          <Card w={800} pad={36} r={32}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <Avatar size={84} />
              <div><Bar w={260} h={22} /><Bar w={180} style={{ marginTop: 12 }} /></div>
            </div>
            <Bar w={700} style={{ marginTop: 28 }} /><Bar w={520} style={{ marginTop: 12 }} />
            <div style={{ height: 300, borderRadius: 24, background: `linear-gradient(135deg, ${C.ice2}, ${C.blue})`, marginTop: 26, opacity: 0.8 }} />
            <div style={{ display: "flex", gap: 24, marginTop: 28 }}><Bar w={150} h={26} /><Bar w={150} h={26} /><Bar w={150} h={26} /></div>
          </Card>
        </div>
      </div>
      <Title size={88} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 640, fontFamily: F, ...enter(end) }}>Welcome to the team!</Title>
      <div style={{ display: "none" }}>{OUT(0)}</div>
    </div>
  );
};
