import React from "react";
import { C, F, IN, k, enter, Card, Avatar, Title, Camera, floatStyle, warp, Cursor, cursorAt, ToolIcon, mix, OUT, INOUT, Check, Ring, Tool } from "../kit";
import { w } from "./timing";
import { pulse, Flow } from "./fx";

type Props = { t: number; t0: number; t1: number };
const Bar: React.FC<{ w: number; h?: number; style?: React.CSSProperties }> = ({ w: ww, h = 18, style }) => <div style={{ width: ww, height: h, borderRadius: h / 2, background: "#E4E8EE", ...style }} />;
const BubbleIcon: React.FC<{ strike?: number }> = ({ strike = 1 }) => (
  <svg width={96} height={96} viewBox="0 0 96 96">
    <path d="M10 12 H86 a6 6 0 0 1 6 6 V62 a6 6 0 0 1 -6 6 H44 L24 86 V68 H10 a6 6 0 0 1 -6 -6 V18 a6 6 0 0 1 6 -6 Z" fill={C.ice} stroke={C.navy} strokeWidth={4} strokeLinejoin="round" />
    <rect x={20} y={32} width={56} height={14} rx={7} fill={C.blue} /><line x1={14} y1={52} x2={82} y2={26} stroke={C.navy} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
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
const Clock: React.FC<{ t: number }> = ({ t }) => (
  <svg width={70} height={70} viewBox="0 0 70 70">
    <circle cx={35} cy={35} r={31} fill={C.white} stroke={C.navy} strokeWidth={5} />
    <line x1={35} y1={35} x2={35} y2={14} stroke={C.navy} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(t * 220) % 360} 35 35)`} />
    <line x1={35} y1={35} x2={49} y2={35} stroke={C.blueS} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(t * 18) % 360} 35 35)`} />
  </svg>
);
const ORBIT: Tool[] = ["jira", "confluence", "dolibarr", "1password", "linkedin"];
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
  const rule = (txt: string, p: number, y: number, col: string, icon: React.ReactNode, seed: number, badge: React.ReactNode, bp: number) => (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(calc(-50% - ${rulesOut * 900}px), -50%)`, opacity: (1 - rulesOut) * p }}>
      <div style={floatStyle(wt, seed, 10)}>
        <div style={{ ...enter(p), transform: `translateX(${(1 - OUT(p)) * 200}px)`, opacity: p }}>
          <Card w={1260} r={30} pad={0} style={{ overflow: "hidden", display: "flex", alignItems: "stretch" }}>
            <div style={{ width: 18, background: col }} />
            <div style={{ padding: "36px 44px", display: "flex", alignItems: "center", gap: 36, fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              <div style={{ flexShrink: 0, transform: `rotate(${(Math.sin(t * 2.4 + seed) * 5).toFixed(2)}deg) scale(${(1 + 0.05 * Math.sin(t * 3.1 + seed)).toFixed(3)})` }}>{icon}</div><span>{txt}</span>
            </div>
          </Card>
          <div style={{ position: "absolute", right: -26, top: -30, opacity: bp, transform: `scale(${mix(0.4, 1, OUT(bp))}) rotate(${((1 - OUT(bp)) * -30).toFixed(1)}deg)` }}>{badge}</div>
        </div>
      </div>
    </div>
  );
  return (
    <Camera t={wt} t0={t0} t1={t1}>
      {[0, 1].map((i) => {
        const sh = k(t, (i ? w("rules") : w("two", 2)) - 0.1, 0.5), y = i ? 640 : 400;
        const gone = (i ? r2 : r1) * 1 + rulesOut;
        return sh > 0 && gone < 1 ? (
          <svg key={"sh" + i} width={1300} height={190} style={{ position: "absolute", left: 960 - 650, top: y - 95, opacity: sh * (1 - Math.min(1, gone)), transform: `translateY(${(1 - OUT(sh)) * 40}px)` }}>
            <rect x={4} y={4} width={1292} height={182} rx={30} fill="rgba(153,205,252,0.08)" stroke={C.blue} strokeWidth={3} strokeDasharray="16 12" strokeDashoffset={-t * 60} />
          </svg>
        ) : null;
      })}
      {rule("No client names in public without approval", r1, 400, C.navy, <BubbleIcon strike={k(t, w("client"), 0.5)} />, 1, <Check size={72} p={k(t, w("approval"), 0.6)} />, k(t, w("approval") - 0.1, 0.5))}
      {rule("Something wrong? Report it the same day", r2, 640, C.blueS, <div style={{ transform: `scale(${(1 + (t > w("problems") ? 0.08 * Math.sin((t - w("problems")) * 8) : 0)).toFixed(3)})` }}><WarnIcon /></div>, 2, <Clock t={t} />, k(t, w("same") - 0.1, 0.5))}
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
      {end > 0 && [0, 1, 2].map((j) => <Ring key={"r" + j} x={960} y={440} p={pulse(t, w("welcome", 2) + 0.4 + j * 0.35, 1.05)} r={330} color="rgba(153,205,252,0.55)" />)}
      {end > 0 && ORBIT.map((tool, i) => {
        const a = (i / ORBIT.length) * Math.PI * 2 + (t - 55) * 0.5;
        const pin = k(t, w("welcome", 2) + 0.25 + i * 0.1, 0.7);
        const x = 960 + Math.cos(a) * 760 * mix(0.6, 1, OUT(pin)), y = 420 + Math.sin(a) * 215 * mix(0.6, 1, OUT(pin));
        const sz = 104 * (0.88 + 0.12 * Math.sin(a));
        return <div key={tool} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, opacity: pin, transform: `scale(${mix(0.3, 1, OUT(pin))})` }}><ToolIcon tool={tool} size={sz} /></div>;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 630, display: "flex", justifyContent: "center", gap: 26, ...floatStyle(wt, 7, 8) }}>
        {["Welcome", "to", "the", "team!"].map((wd, j) => (
          <Title key={wd} size={92} style={{ fontFamily: F, ...enter(k(t, w("welcome", 2) + 0.15 + j * 0.12, 0.6), 50) }}>{wd}</Title>
        ))}
      </div>
      {end > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={`M ${960 - 380 * k(t, w("team"), 0.8)} 760 L ${960 + 380 * k(t, w("team"), 0.8)} 760`} stroke={C.blue} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
          <Flow d={`M ${960 - 380 * k(t, w("team"), 0.8)} 760 L ${960 + 380 * k(t, w("team"), 0.8)} 760`} t={t} color={C.white} width={4} o={0.9} />
        </svg>
      )}
      {end > 0 && [0, 1, 2, 3, 4].map((i) => {
        const ap = k(t, w("team") + 0.15 + i * 0.09, 0.6);
        return <div key={"av" + i} style={{ position: "absolute", left: 960 + (i - 2) * 130 - 48, top: 815, opacity: ap, transform: `translateY(${(1 - OUT(ap)) * 60}px)` }}>
          <div style={floatStyle(t, 40 + i, 9)}><Avatar size={96} tone={i % 2 ? "ice" : "blue"} style={{ border: `4px solid ${C.white}`, borderRadius: "50%" }} /></div>
        </div>;
      })}
      <Cursor x={cur.x} y={cur.y} press={pressNow} o={curO * (1 - rulesOut * 0 )} />
      <div style={{ display: "none" }}>{pulse(t, 0)}{mix(0, 1, 0)}{INOUT(0)}</div>
    </Camera>
  );
};
