import React from "react";
import { C, F, OUT, INOUT, IN, k, enter, abs, Ring, Title, c01, mix, Camera, warp, floatStyle } from "../kit";
import { w } from "./timing";
import { exitFx, pulse } from "./fx";
import MAP from "../map-europe.json";

type Props = { t: number; t0: number; t1: number };
const M = (MAP as any).cities["Málaga"] as number[];
const DOTS = (MAP as any).dots as number[][];
const cand = DOTS.filter((d) => d[2] > 0.9 && Math.hypot(d[0] - M[0], d[1] - M[1]) > 300);
const NODES: number[][] = [];
for (let i = 0; i < 14 && cand.length; i++) NODES.push(cand[(i * 97 + 13) % cand.length]);
const arcPt = (a: number[], b: number[], p: number) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const cx = mx - ((b[1] - a[1]) / len) * len * 0.2, cy = my + ((b[0] - a[0]) / len) * len * 0.2;
  return [(1 - p) ** 2 * a[0] + 2 * (1 - p) * p * cx + p * p * b[0], (1 - p) ** 2 * a[1] + 2 * (1 - p) * p * cy + p * p * b[1], cx, cy];
};
export const S2PIN = [260, 600 + 60 * Math.sin(((260 - 200) / 1360) * Math.PI * 2)];

export const S1: React.FC<Props> = ({ t, t0, t1 }) => {
  const wt = warp(t, []);
  const reveal = k(t, 0.2, 2.6, INOUT);
  const mapOut = 1 - k(t, t1 - 0.2, 0.9, IN);
  const pinK = k(t, 0.6, 0.4);
  const carry = k(t, t1 - 0.9, 1.4, INOUT);
  const px = mix(M[0], S2PIN[0], carry), py = mix(M[1], S2PIN[1], carry);
  const pinFade = 1 - k(t, t1 + 0.55, 0.3);
  const sub = [["Software", w("software")], ["·", w("software") + 0.5], ["AI", w("ai")], ["·", w("ai") + 0.35], ["Automation", w("automation")]] as [string, number][];
  const out = Array.from(NODES, (n, i) => {
    const s = 5.3 + i * 0.16;
    return { n, lit: k(t, s, 0.5), arc: k(t, s + 0.1, 0.9, INOUT), i };
  });
  const back = (i: number) => 8.5 + (i % 7) * 0.12;
  return (
    <Camera t={wt} t0={t0} t1={t1}>
      <div style={{ position: "absolute", inset: 0, opacity: mapOut }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {(() => {
            const R = reveal * 1700;
            return DOTS.map(([x, y, f], i) => {
              const d = Math.hypot(x - M[0], y - M[1]);
              const kk = c01((R - d) / 160);
              const tw = 0.85 + 0.15 * Math.sin(t * 1.3 + i * 0.7);
              return kk > 0 ? <circle key={i} cx={x} cy={y} r={3.6 * (0.6 + 0.4 * kk)} fill={C.blue} opacity={f * kk * 0.32 * tw} /> : null;
            });
          })()}
          {out.map(({ n, arc, i }) => {
            const [, , cx, cy] = arcPt(M, n, 0.5);
            const flow = k(t, back(i), 1.2, INOUT);
            const fo = flow > 0 ? [0, 1, 2].map((j) => { const p = c01(flow * 1.3 - j * 0.12); return p > 0 && p < 1 ? arcPt(n, M, p) : null; }) : [];
            const d = `M${M[0]} ${M[1]} Q${cx} ${cy} ${n[0]} ${n[1]}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" pathLength={1}
                  strokeDasharray={1} strokeDashoffset={1 - arc} opacity={0.6 * (1 - 0.5 * flow)} />
                {arc > 0.99 && <path d={d} fill="none" stroke={C.white} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 26" strokeDashoffset={-t * 60} opacity={0.5} />}
                {fo.map((q, j) => q ? <circle key={j} cx={q[0]} cy={q[1]} r={8 - j * 1.8} fill={C.white} opacity={0.95} /> : null)}
              </g>
            );
          })}
          {out.map(({ n, lit, i }) => lit > 0 ? (
            <g key={i}><circle cx={n[0]} cy={n[1]} r={(30 + 6 * Math.sin(t * 2 + i)) * lit} fill={C.blue} opacity={0.28} />
              <circle cx={n[0]} cy={n[1]} r={11 * lit} fill={C.blue} /><circle cx={n[0]} cy={n[1]} r={4.5 * lit} fill={C.white} /></g>
          ) : null)}
        </svg>
      </div>
      <div style={{ position: "absolute", inset: 0, ...exitFx(t, t1 - 0.5, -300, -40) }}>
        <div style={floatStyle(wt, 1, 6)}>
          <Title size={96} style={{ ...abs(110, 140), ...enter(k(t, w("welcome") - 0.1, 0.7)) }}>Welcome to K.B</Title>
        </div>
        <div style={{ ...abs(114, 290), display: "flex", gap: 14, fontFamily: F, fontSize: 46, fontWeight: 700, color: C.blue, whiteSpace: "nowrap", ...floatStyle(wt, 2, 5) }}>
          {sub.map(([s, tt], i) => <span key={i} style={enter(k(t, tt, 0.5), 16)}>{s}</span>)}
        </div>
      </div>
      <div style={{ opacity: pinFade }}>
        <Ring x={px} y={py} p={pulse(t, 1.0, 1.1) * (1 - carry) * (t < 10.5 ? 1 : 0)} r={90} color={C.blue} />
        <div style={{ position: "absolute", left: px - 15, top: py - 15 - (1 - OUT(pinK)) * 40, width: 30, height: 30, borderRadius: 999, background: C.blue,
          boxShadow: `0 0 0 10px rgba(153,205,252,0.3), 0 0 30px rgba(153,205,252,0.7)`, opacity: c01(pinK * 2) }} />
      </div>
    </Camera>
  );
};
