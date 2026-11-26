import React from "react";
import { C, F, OUT, INOUT, IN, k, enter, Card, Check, Padlock, ToolIcon, c01, mix, Camera, floatStyle, warp, Cursor, cursorAt, Ring } from "../kit";
import { w, wEnd } from "./timing";
import { S2PIN } from "./S1";
import { exitFx, Flow, pulse } from "./fx";

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
const LOCK = [1700, yP(X1) + 40];

const DocSign: React.FC = () => (
  <svg width={88} height={104} viewBox="0 0 88 104">
    <rect x={4} y={4} width={80} height={96} rx={10} fill={C.ice} stroke={C.blueS} strokeWidth={4} />
    <rect x={18} y={20} width={44} height={7} rx={3.5} fill={C.blue} /><rect x={18} y={36} width={52} height={7} rx={3.5} fill={C.blue} />
    <path d="M16 80 C22 62 28 62 30 74 C32 82 38 66 44 70 C48 74 52 70 58 68" fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" />
    <line x1={14} y1={86} x2={72} y2={86} stroke={C.muted} strokeWidth={2.5} />
  </svg>
);
const LaptopLock: React.FC = () => (
  <svg width={110} height={92} viewBox="0 0 110 92">
    <rect x={18} y={6} width={74} height={52} rx={7} fill={C.navy} /><rect x={24} y={12} width={62} height={40} rx={3} fill={C.ice2} />
    <path d="M4 64 H106 L98 80 a6 6 0 0 1 -5 3 H17 a6 6 0 0 1 -5 -3 Z" fill={C.blueS} />
    <rect x={44} y={30} width={22} height={18} rx={4} fill={C.navy} /><path d="M49 30 V25 a6 6 0 0 1 12 0 V30" fill="none" stroke={C.navy} strokeWidth={4} />
  </svg>
);
const GuideDoc: React.FC = () => (
  <div style={{ position: "relative", width: 96, height: 104 }}>
    <svg width={96} height={104} viewBox="0 0 96 104" style={{ position: "absolute", inset: 0 }}>
      <rect x={4} y={4} width={88} height={96} rx={10} fill={C.white} stroke="#1868DB" strokeWidth={4} />
      <rect x={14} y={42} width={60} height={7} rx={3.5} fill={C.ice2} /><rect x={14} y={58} width={68} height={7} rx={3.5} fill={C.ice2} /><rect x={14} y={74} width={46} height={7} rx={3.5} fill={C.ice2} />
    </svg>
    <ToolIcon tool="confluence" size={34} tile={false} style={{ position: "absolute", left: 14, top: 10 }} />
  </div>
);
const ICONS = [<DocSign key={0} />, <LaptopLock key={1} />, <GuideDoc key={2} />];

export const S2: React.FC<Props> = ({ t, t0, t1 }) => {
  const wt = warp(t, [TICK[0] - 0.4, TICK[1] - 0.4, TICK[2] - 0.4, wEnd("guidelines") - 0.4].map((c) => [c, c + 0.9] as [number, number]));
  const p = prog(t);
  const n = Math.max(2, Math.round(p * (PTS.length - 1)) + 1);
  const lockIn = k(t, TICK[2] - 1.0, 0.7);
  const open = k(t, wEnd("guidelines"), 0.8);
  const go = k(t, t1 - 0.2, 1.1, INOUT);
  const lx = mix(LOCK[0], 960, go), ly = mix(LOCK[1], 330, go);
  const lockS = 1 - 0.45 * go;
  const pinIn = k(t, 11.9, 0.3);
  const path = PTS.map((q) => q.join(",")).join(" ");
  const cur = cursorAt([
    [12.2, 700, 250], [TICK[0] - 0.3, CP[0] + 12, yP(CP[0]) + 8], [TICK[0] + 0.3, CP[0] + 12, yP(CP[0]) + 8],
    [TICK[1] - 0.3, CP[1] + 12, yP(CP[1]) + 8], [TICK[1] + 0.3, CP[1] + 12, yP(CP[1]) + 8],
    [TICK[2] - 0.2, CP[2] + 12, yP(CP[2]) + 8], [wEnd("guidelines") - 0.08, LOCK[0] + 30, LOCK[1] + 30], [wEnd("guidelines") + 0.8, LOCK[0] + 200, LOCK[1] + 140]], t);
  const clicks = [TICK[0] - 0.12, TICK[1] - 0.12, TICK[2] - 0.12, wEnd("guidelines") - 0.1];
  const press = Math.max(...clicks.map((c) => k(t, c, 0.45, (x) => x)));
  const pressNow = clicks.reduce((a, c) => (t >= c && t < c + 0.45 ? (t - c) / 0.45 : a), 0);
  const curO = k(t, 12.3, 0.4) * (1 - k(t, wEnd("guidelines") + 0.4, 0.4, IN));
  return (
    <Camera t={wt} t0={t0} t1={t1}>
      <div style={{ position: "absolute", inset: 0, ...exitFx(t, t1, -300, 40) }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <polyline points={path} fill="none" stroke="rgba(153,205,252,0.18)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={k(t, T0 - 0.2, 0.5)} />
          <polyline points={PTS.slice(0, n).map((q) => q.join(",")).join(" ")} fill="none" stroke={C.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0 ? 1 : 0} />
          {p > 0.02 && <Flow d={"M" + PTS.slice(0, n).map((q) => q.join(" ")).join(" L")} t={t} color={C.white} width={5} o={0.8} />}
        </svg>
        {CP.map((x, i) => {
          const y = yP(x), tk = k(t, TICK[i], 0.6);
          const arrive = i === 0 ? pinIn : k(t, KT[i] - 0.5, 0.4);
          const pop = k(t, TICK[i] - 0.3 - 0.1, 0.7);
          return (
            <React.Fragment key={i}>
              <Ring x={x} y={y} p={tk > 0 ? pulse(t, TICK[i], 1) * (t < TICK[i] + 2.2 ? 1 : 0) : 0} r={70} color={C.blue} />
              <div style={{ position: "absolute", left: x - 36, top: y - 36, opacity: arrive, ...floatStyle(wt, i + 3, 4) }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.white, transform: `scale(${mix(0.35, 1, OUT(arrive))})` }} />
                <Check size={72} p={tk} />
              </div>
              <div style={{ position: "absolute", left: x - 235, top: y - 300, width: 470, ...floatStyle(wt, i + 8, 10) }}>
                <div style={enter(pop)}>
                  <Card w={470} pad={24} r={28} style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, minHeight: 150 }}>
                    <div style={{ width: 110, display: "flex", justifyContent: "center", flexShrink: 0 }}>{ICONS[i]}</div><span>{LABELS[i]}</span>
                  </Card>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: lockIn * (1 - k(t, t1 + 0.55, 0.35, IN)), transform: `translate(${lx - 60}px, ${ly - 72}px) scale(${lockS * mix(0.9, 1, OUT(lockIn))})`, transformOrigin: "50% 50%" }}>
        <div style={floatStyle(wt, 20, 8 * (1 - go))}>
          <Padlock size={120} open={open} body={C.white} style={{ filter: `drop-shadow(0 0 ${14 + 10 * open}px rgba(153,205,252,0.7))` }} />
        </div>
      </div>
      <Ring x={LOCK[0]} y={LOCK[1] + 30} p={t > TICK[2] - 0.5 && t < wEnd("guidelines") + 0.3 ? pulse(t, TICK[2] - 0.5, 1) : 0} r={100} color={C.blue} />
      <Cursor x={cur.x} y={cur.y} press={pressNow} o={curO} />
      <div style={{ display: "none", fontFamily: F }}>{S2PIN[0]}{press}</div>
    </Camera>
  );
};
