import React from "react";
import { C, F, IN, k, enter, Card, Avatar, Title, Camera, floatStyle, warp, Cursor, cursorAt, ToolIcon, mix, OUT, INOUT } from "../kit";
import { w } from "./timing";
import { pulse } from "./fx";

type Props = { t: number; t0: number; t1: number };
const Bar: React.FC<{ w: number; h?: number; style?: React.CSSProperties }> = ({ w: ww, h = 18, style }) => <div style={{ width: ww, height: h, borderRadius: h / 2, background: "#E4E8EE", ...style }} />;
const BubbleIcon: React.FC = () => (
  <svg width={96} height={96} viewBox="0 0 96 96">
    <path d="M10 12 H86 a6 6 0 0 1 6 6 V62 a6 6 0 0 1 -6 6 H44 L24 86 V68 H10 a6 6 0 0 1 -6 -6 V18 a6 6 0 0 1 6 -6 Z" fill={C.ice} stroke={C.navy} strokeWidth={4} strokeLinejoin="round" />
    <rect x={20} y={32} width={56} height={14} rx={7} fill={C.blue} /><line x1={14} y1={52} x2={82} y2={26} stroke={C.navy} strokeWidth={6} strokeLinecap="round" />
  </svg>
);
const WarnIcon: React.FC = () => (
  <svg width={96} height={96} viewBox="0 0 96 96">
    <path d="M48 8 L90 82 H6 Z" fill={C.ice} stroke={C.blueS} strokeWidth={5} strokeLinejoin="round" />
    <rect x={44} y={34} width={8} height={26} rx={4} fill={C.navy} /><circle cx={48} cy={70} r={5} fill={C.navy} />
  </svg>
);
const Glyph: React.FC<{ kind: number; c: string }> = ({ kind, c }) => (
  <svg width={40} height={40} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round">
    {kind === 0 && <path d="M8 18 H14 V34 H8 Z M14 18 L20 5 C24 5 25 9 24 13 L23 17 H33 C35 17 36 19 35 21 L32 32 C31 33.5 30 34 28 34 H14" />}
    {kind === 1 && <path d="M6 8 H34 V26 H18 L10 33 V26 H6 Z" />}
    {kind === 2 && <path d="M8 16 L14 10 L20 16 M14 10 V24 C14 28 16 30 20 30 H30 M32 24 L26 30 L32 36 M26 30 H20" transform="translate(0 -3)" />}
    {kind === 3 && <path d="M5 6 L35 20 L5 34 L11 20 Z M11 20 H35" />}
  </svg>
);
const LI = "#0A66C2";
export const S5: React.FC<Props> = ({ t, t0, t1 }) => {
  const wt = warp(t, [[w("post") - 0.2, w("post") + 0.7]]);
  const r1 = k(t, w("never") - 0.2, 0.7), r2 = k(t, w("report") - 0.2, 0.7);
  const rulesOut = k(t, w("first") - 0.1, 0.8, IN);
  const post = k(t, w("first") + 0.2, 0.8);
  const postOut = k(t, w("welcome", 2) - 0.45, 0.6, IN);
  const end = k(t, w("welcome", 2) + 0.2, 0.8);
  const likeT = w("post") + 0.1, like = k(t, likeT, 0.4);
  const cur = cursorAt([[53.6, 1500, 900], [likeT - 0.15, 600, 790], [likeT + 0.9, 900, 860]], t);
  const curO = k(t, 53.6, 0.3) * (1 - k(t, 54.75, 0.3, IN));
  const pressNow = t >= likeT - 0.1 && t < likeT + 0.3 ? (t - likeT + 0.1) / 0.4 : 0;
  const rule = (txt: string, p: number, y: number, col: string, icon: React.ReactNode, seed: number) => (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(calc(-50% - ${rulesOut * 900}px), -50%)`, opacity: (1 - rulesOut) * p }}>
      <div style={floatStyle(wt, seed, 10)}>
        <div style={{ ...enter(p), transform: `translateX(${(1 - OUT(p)) * 200}px)`, opacity: p }}>
          <Card w={1260} r={30} pad={0} style={{ overflow: "hidden", display: "flex", alignItems: "stretch" }}>
            <div style={{ width: 18, background: col }} />
            <div style={{ padding: "36px 44px", display: "flex", alignItems: "center", gap: 36, fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              <div style={{ flexShrink: 0 }}>{icon}</div><span>{txt}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
  return (
    <Camera t={wt} t0={t0} t1={t1} push={0.05}>
      {rule("No client names in public without approval", r1, 400, C.navy, <BubbleIcon />, 1)}
      {rule("Something wrong? Report it the same day", r2, 640, C.blueS, <WarnIcon />, 2)}
      <div style={{ position: "absolute", inset: 0, opacity: post * (1 - postOut), transform: `translateY(${-postOut * 80}px) scale(${1 - 0.06 * postOut})` }}>
        <div style={floatStyle(wt, 5, 6)}>
          <Title size={72} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 70, ...enter(k(t, w("linkedin") - 0.1, 0.6)) }}>Introduction post</Title>
        </div>
        <div style={{ position: "absolute", left: 560, top: 210, ...enter(post, 40) }}>
          <div style={floatStyle(wt, 6, 6)}>
            <Card w={800} pad={36} r={20} style={{ position: "relative" }}>
              <ToolIcon tool="linkedin" size={56} tile={false} style={{ position: "absolute", right: 30, top: 28 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <Avatar size={84} />
                <div><Bar w={260} h={22} /><Bar w={180} style={{ marginTop: 12 }} /></div>
              </div>
              <Bar w={700} style={{ marginTop: 28 }} /><Bar w={520} style={{ marginTop: 12 }} />
              <div style={{ height: 300, borderRadius: 12, background: `linear-gradient(135deg, ${C.ice2}, ${C.blue})`, marginTop: 26 }} />
              <div style={{ display: "flex", gap: 24, marginTop: 28, alignItems: "center" }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, width: 160, transform: i === 0 ? `scale(${1 + 0.25 * Math.sin(Math.PI * like)})` : undefined }}>
                    <Glyph kind={i} c={i === 0 && like > 0.3 ? LI : "#8794A6"} /><Bar w={80} h={14} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, ...floatStyle(wt, 7, 8) }}>
        <Title size={92} style={{ textAlign: "center", fontFamily: F, ...enter(end) }}>Welcome to the team!</Title>
      </div>
      <Cursor x={cur.x} y={cur.y} press={pressNow} o={curO * (1 - rulesOut * 0 )} />
      <div style={{ display: "none" }}>{pulse(t, 0)}{mix(0, 1, 0)}{INOUT(0)}</div>
    </Camera>
  );
};
