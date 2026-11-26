import React from "react";
import { C, F, OUT, INOUT, IN, k, enter, breathe, abs, Ring, Title, c01, mix } from "../kit";
import { w } from "./timing";
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

export const S1: React.FC<Props> = ({ t, t1 }) => {
  const reveal = k(t, 0.2, 2.6, INOUT);
  const mapOut = 1 - k(t, t1 - 0.2, 0.9, IN);
  const txtOut = 1 - k(t, t1 - 0.6, 0.6, IN);
  const pinK = k(t, 0.6, 0.4);
  const carry = k(t, t1 - 0.9, 1.4, INOUT);
  const px = mix(M[0], S2PIN[0], carry), py = mix(M[1], S2PIN[1], carry);
  const pinFade = 1 - k(t, t1 + 0.55, 0.3);
  const dy = breathe(t, 5, 7);
  const sub = [["Software", w("software")], ["·", w("software") + 0.5], ["AI", w("ai")], ["·", w("ai") + 0.35], ["Automation", w("automation")]] as [string, number][];
  const out = Array.from(NODES, (n, i) => {
    const s = 5.3 + i * 0.16;
    return { n, lit: k(t, s, 0.5), arc: k(t, s + 0.1, 0.9, INOUT), i };
  });
  const back = (i: number) => 8.5 + (i % 7) * 0.12;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, opacity: mapOut, transform: `translateY(${dy}px)` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {(() => {
            const R = reveal * 1700;
            return DOTS.map(([x, y, f], i) => {
              const d = Math.hypot(x - M[0], y - M[1]);
              const kk = c01((R - d) / 160);
              return kk > 0 ? <circle key={i} cx={x} cy={y} r={3.6 * (0.6 + 0.4 * kk)} fill={C.navy} opacity={f * kk * 0.2} /> : null;
            });
          })()}
          {out.map(({ n, arc, i }) => {
            const [, , cx, cy] = arcPt(M, n, 0.5);
            const flow = k(t, back(i), 1.2, INOUT);
            const fo = flow > 0 ? [0, 1, 2].map((j) => { const p = c01(flow * 1.3 - j * 0.12); return p > 0 && p < 1 ? arcPt(n, M, p) : null; }) : [];
            return (
              <g key={i}>
                <path d={`M${M[0]} ${M[1]} Q${cx} ${cy} ${n[0]} ${n[1]}`} fill="none" stroke={C.blueS} strokeWidth={3} strokeLinecap="round" pathLength={1}
                  strokeDasharray={1} strokeDashoffset={1 - arc} opacity={0.55 * (1 - 0.5 * flow)} />
                {fo.map((q, j) => q ? <circle key={j} cx={q[0]} cy={q[1]} r={7 - j * 1.5} fill={C.navy} opacity={0.9} /> : null)}
              </g>
            );
          })}
          {out.map(({ n, lit, i }) => lit > 0 ? (
            <g key={i}><circle cx={n[0]} cy={n[1]} r={26 * lit} fill={C.blue} opacity={0.35 * (1 - lit * 0.4)} />
              <circle cx={n[0]} cy={n[1]} r={10 * lit} fill={C.blueS} /></g>
          ) : null)}
        </svg>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: txtOut, transform: `translateY(${dy * 0.6}px)` }}>
        <Title size={90} style={{ ...abs(110, 150), ...enter(k(t, w("welcome") - 0.1, 0.7)) }}>Welcome to K.B</Title>
        <div style={{ ...abs(114, 290), display: "flex", gap: 14, fontFamily: F, fontSize: 44, fontWeight: 700, color: C.muted, whiteSpace: "nowrap" }}>
          {sub.map(([s, tt], i) => <span key={i} style={enter(k(t, tt, 0.5), 16)}>{s}</span>)}
        </div>
      </div>
      <div style={{ opacity: pinFade }}>
        <Ring x={M[0]} y={M[1]} p={k(t, 0.95, 0.9, INOUT)} r={90} />
        {(() => {
          const ex = k(t, 8.5, 1.5, INOUT) * (1 - carry);
          return <>
            {ex > 0 && ex < 1 && <div style={{ position: "absolute", left: px - 40 * ex - 13, top: py - 40 * ex - 13, width: 26 + 80 * ex, height: 26 + 80 * ex, borderRadius: 999, border: `3px solid ${C.blueS}`, opacity: 0.5 * (1 - ex) }} />}
            <div style={{ position: "absolute", left: px - 13, top: py - 13 - (1 - OUT(pinK)) * 40, width: 26, height: 26, borderRadius: 999, background: C.navy,
              boxShadow: `0 0 0 8px rgba(111,174,241,0.35)`, opacity: c01(pinK * 2) }} />
          </>;
        })()}
      </div>
    </div>
  );
};
