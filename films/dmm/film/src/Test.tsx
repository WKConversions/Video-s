import React from "react";
import { AbsoluteFill, useCurrentFrame, staticFile } from "remotion";
import { C, Topo, Logo, WaveLink, Pill, Photo, Banner, Rise, CX, CY } from "./kit";
export const Test: React.FC = () => {
  const t = useCurrentFrame() / 60;
  return (
    <AbsoluteFill style={{ background: C.char }}>
      <Topo o={{ t, bumps: [{ x: 600, y: 540, h: 0.9, r: 160 }, { x: 1320, y: 540, h: 0.9, r: 160 }], ripples: [{ x: CX, y: CY, age: t - 0.2 }] }} reveal={{ x: CX, y: CY, r: 300 + t * 900 }} />
      <WaveLink x1={600} y1={540} x2={1320} y2={540} p={Math.min(1, t)} phase={t * 6} dot={1} />
      <div style={{ position: "absolute", left: 120, top: 120 }}><Logo size={90} p={Math.min(1, t / 1.2)} /></div>
      <div style={{ position: "absolute", left: 1300, top: 820 }}><Pill text="JOIN US" t={t} press={1} /></div>
      <div style={{ position: "absolute", left: 1200, top: 100 }}><Photo src="street.jpg" w={300} h={380} /></div>
      <div style={{ position: "absolute", left: 120, top: 700 }}><Banner name="tatiana" w={560} /></div>
      <div style={{ position: "absolute", left: 760, top: 900 }}><Rise text="Let's grow together." t={t} at={0.3} size={70} grad /></div>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("img/dither.png")})` }} />
    </AbsoluteFill>
  );
};
