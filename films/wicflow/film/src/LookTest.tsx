import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile } from "remotion";
import { fontsReady } from "./fonts";
import { C, F, SHADOW, rgba } from "./lib";
import { View, proj, pts, depth, hash } from "./iso";
import { MARK_D } from "./mark";

type B = { x0: number; y0: number; x1: number; y1: number; h: number; tint: "blue" | "sage" | "sand" | "grey"; on?: boolean };
const TINT = { blue: [C.tBlue, C.sideBlue], sage: [C.tSage, C.sideSage], sand: [C.tSand, C.sideSand], grey: [C.tGrey, C.sideGrey] } as const;

const Block: React.FC<{ v: View; b: B }> = ({ v, b }) => {
  const P = (x: number, y: number, z: number) => proj(v, x, y, z);
  const [t, s] = TINT[b.tint];
  const top: [number, number][] = [P(b.x0, b.y0, b.h), P(b.x1, b.y0, b.h), P(b.x1, b.y1, b.h), P(b.x0, b.y1, b.h)];
  const right: [number, number][] = [P(b.x1, b.y0, 0), P(b.x1, b.y1, 0), P(b.x1, b.y1, b.h), P(b.x1, b.y0, b.h)];
  const front: [number, number][] = [P(b.x0, b.y1, 0), P(b.x1, b.y1, 0), P(b.x1, b.y1, b.h), P(b.x0, b.y1, b.h)];
  const sh: [number, number][] = [P(b.x0 + 10, b.y1, 0), P(b.x1, b.y1, 0), P(b.x1, b.y0 + 10, 0), P(b.x1 + b.h * 0.9, b.y0 + 10 + b.h * 0.5, 0), P(b.x1 + b.h * 0.9, b.y1 + b.h * 0.5, 0), P(b.x0 + 10 + b.h * 0.9, b.y1 + b.h * 0.5, 0)];
  return (
    <g>
      <polygon points={pts(sh)} fill={rgba("#17171B", 0.07)} filter="url(#soft)" />
      <polygon points={pts(front)} fill={b.on ? "#1B5FAE" : s[1]} />
      <polygon points={pts(right)} fill={b.on ? "#2A74C8" : s[0]} />
      <polygon points={pts(top)} fill={b.on ? C.blue : t[0]} stroke={b.on ? "#5D9BE0" : "#FFFFFF"} strokeWidth={1.5} />
    </g>
  );
};

export const LookTest: React.FC = () => {
  const [h] = useState(() => delayRender("fonts"));
  const [ok, setOk] = useState(false);
  useEffect(() => { fontsReady.then(() => { setOk(true); continueRender(h); }); }, [h]);
  if (!ok) return null;
  const v: View = { th: (45 * Math.PI) / 180, s: 1, fx: 600, fy: 600, cx: 1180, cy: 520 };
  const bl: B[] = [];
  for (let i = -4; i < 9; i++) for (let j = -4; j < 9; j++) {
    if (hash(i, j, 9) < 0.1) continue;
    const w = 110 * (0.6 + 0.4 * hash(i, j, 1)), d = 110 * (0.6 + 0.4 * hash(i, j, 2));
    const tint = i < 2 ? "blue" : j < 2 ? "sage" : i > 5 ? "sand" : "grey";
    bl.push({ x0: i * 170, y0: j * 170, x1: i * 170 + w, y1: j * 170 + d, h: 16 + 60 * hash(i, j, 6) ** 1.6, tint, on: i === 3 && j === 4 });
  }
  bl.sort((a, b) => depth(v, a.x1, a.y1) - depth(v, b.x1, b.y1));
  const P = (x: number, y: number, z = 0) => proj(v, x, y, z);
  const ground: [number, number][] = [P(-800, -800), P(1600, -800), P(1600, 1600), P(-800, 1600)];
  const route: [number, number][] = [P(3 * 170 + 55, 4 * 170 + 130), P(3 * 170 + 55, 7 * 170 - 30), P(6 * 170 - 30, 7 * 170 - 30), P(6 * 170 - 30, 6 * 170 + 60)];
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
          <radialGradient id="gr" cx="0.6" cy="0.45" r="0.7"><stop offset="0" stopColor="#F4F7FC" /><stop offset="1" stopColor="#FFFFFF" /></radialGradient></defs>
        <rect width={1920} height={1080} fill="url(#gr)" />
        <polygon points={pts(ground)} fill={C.paper2} stroke={C.line2} />
        {bl.map((b, n) => <Block key={n} v={v} b={b} />)}
        <polyline points={pts(route)} fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={route[3][0]} cy={route[3][1]} r={26} fill={rgba(C.blue, 0.15)} /><circle cx={route[3][0]} cy={route[3][1]} r={9} fill={C.blue} />
      </svg>
      <div style={{ position: "absolute", left: 110, top: 90, width: 640, padding: "26px 30px", borderRadius: 24, background: "#fff", boxShadow: SHADOW.card + "," + SHADOW.edge, fontFamily: F.ui }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, fontWeight: 700, color: C.ink }}>
          <span style={{ width: 12, height: 12, borderRadius: 9, background: C.blue, boxShadow: `0 0 0 6px ${C.blueHalo}` }} />AI at work</div>
        <div style={{ height: 1, background: C.line2, margin: "18px 0" }} />
        <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>Found a company that fits</div>
        <div style={{ fontSize: 24, color: C.muted, marginTop: 6 }}>Building firm · 40 staff · Tampere</div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 840, fontFamily: F.display, fontWeight: 600, fontSize: 76, letterSpacing: "-0.045em", color: C.ink }}>
        Finding the right <span style={{ color: C.blue }}>prospects.</span></div>
      <svg viewBox="43 43 298 194" width={160} height={104} style={{ position: "absolute", right: 110, top: 100 }}><path d={MARK_D} fill={C.inkStrong} fillRule="evenodd" /></svg>
      <Img src={staticFile("logos/hubspot.svg")} style={{ position: "absolute", right: 120, top: 260, width: 60 }} />
    </AbsoluteFill>
  );
};
