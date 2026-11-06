// S1 Hook (0.00-2.6): Karl's reference 1 as Duendr's own: a cream frame with one giant word, it shrinks to a card in a sliding row of work,
// a coral card pushes the row away and grows to the full coral frame, the words settle and drop away; the coral field becomes S2's circle.
import React from "react";
import { C, Media, OUT, SHADOW, k, mix, sp } from "../kit";
import { Scene } from "./types";
import { WordLine } from "./b1-lib";

const CW = 800, CH = 430, WW = 560, WH = 330, KW = 760, KH = 400, GAPX = 40;
const R0 = 0.68, R1 = 1.38, D = CW / 2 + GAPX + WW + GAPX + KW / 2;
// one rigid strip, one cruise-and-land curve
const travel = (t: number) => { const a = 0.12, d = 0.28, T = R1 - R0, v = D / (T - a / 2 - d / 2), u = Math.min(T, Math.max(0, t - R0)); return u < a ? (v * u * u) / (2 * a) : u < T - d ? v * (u - a / 2) : D - (v * (T - u) ** 2) / (2 * d); };
const CLIPS = ["clips/model-shoot.mp4", "clips/dj-stage.mp4", "clips/paint-brush.mp4", "clips/pottery.mp4", "clips/design-tablet.mp4"];

const Inset: React.FC<{ l: number; r: number; tp: number; b: number; rad: number; bg: string; dx?: number; children?: React.ReactNode; z?: number }> = ({ l, r, tp, b, rad, bg, children, z }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, zIndex: z }}>
    <div style={{ position: "absolute", inset: 0, background: bg, clipPath: `inset(${tp}px ${r}px ${b}px ${l}px round ${rad}px)` }}>{children}</div>
  </div>
);
const Shadow: React.FC<{ l: number; r: number; tp: number; b: number; rad: number }> = ({ l, r, tp, b, rad }) => {
  const w = Math.max(1, 1920 - l - r), h = Math.max(1, 1080 - tp - b);
  return <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: rad, boxShadow: SHADOW, background: C.card, transform: `translate(${l}px, ${tp}px)` }} />;
};

const S1C: React.FC<{ t: number }> = ({ t }) => {
  const creamX = 960 - travel(t), coralX = creamX + D;
  const drift = (t - 0.8) * 22; // work cards: a slow push inside the frame
  const sx = (WW + GAPX);
  const cards = [
    { x: creamX + CW / 2 + GAPX + WW / 2, i: 2 }, { x: coralX + KW / 2 + GAPX + WW / 2, i: 3 }, { x: coralX + KW / 2 + GAPX + WW * 1.5 + GAPX, i: 4 },
    { x: creamX - CW / 2 - GAPX - WW / 2, i: 0 }, { x: creamX - CW / 2 - GAPX - WW / 2 - sx, i: 1 },
  ];
  // cream card: full frame -> card
  const g1 = k(t, 0.66, 0.3, OUT);
  const cl = mix(0, creamX - CW / 2, g1), cr = mix(0, 1920 - (creamX + CW / 2), g1), ct = mix(0, (1080 - CH) / 2, g1);
  // coral card: grows to the full frame
  const g2 = Math.min(1, sp(t, 1.24, 1.7, 0.85)), kl = (coralX - KW / 2) * (1 - g2), kr = (1920 - (coralX + KW / 2)) * (1 - g2), kt = ((1080 - KH) / 2) * (1 - g2), krad = mix(34, 0, g2);
  const zoom = 1.12 - 0.12 * k(t, 0, 0.9, OUT);
  const lookSize = mix(300, 86, k(t, 0.34, 0.34, OUT)) * zoom;
  const creamTx = creamX - 960;
  const sz1 = mix(170, 108, k(t, 1.2, 0.4, OUT));
  const drop = (i: number) => 2.2 + 0.08 * i;
  const slow = 1 + 0.11 * Math.max(0, t - 1.6);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* the row of work */}
      {t > 0.6 && g2 < 0.995 && cards.map((c, n) => c.x + WW / 2 > -20 && c.x - WW / 2 < 1940 && (
        <div key={n} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${c.x - WW / 2}px, ${(1080 - WH) / 2}px)`, opacity: g1 }}>
          <Media src={CLIPS[c.i]} w={WW} h={WH} r={26} zoom={1.12 + drift * 0.0012} shadow={SHADOW} />
        </div>))}
      {/* cream card */}
      {creamX + CW / 2 > -40 && (
        <>
          {g1 > 0.02 && <Shadow l={cl} r={cr} tp={ct} b={ct} rad={mix(0, 34, g1)} />}
          <Inset l={cl} r={cr} tp={ct} b={ct} rad={mix(0, 34, g1)} bg={C.paper}>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${creamTx * g1}px) scale(${mix(1, 0.86, g1)})`, transformOrigin: "960px 540px" }}>
              <WordLine t={t} size={lookSize} weight={900} items={[{ text: "Looking", at: -0.4 }, { text: "for", at: 0.54 }, { text: "your", at: 0.82 }]} />
            </div>
          </Inset>
        </>
      )}
      {/* coral card */}
      {g1 > 0.02 && coralX - KW / 2 < 1930 && (
        <>
          {g2 < 0.98 && <Shadow l={kl} r={kr} tp={kt} b={kt} rad={krad} />}
          <Inset l={kl} r={kr} tp={kt} b={kt} rad={krad} bg={C.coral}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 70% at ${50 + 14 * Math.sin(t * 2.2)}% ${46 + 8 * Math.cos(t * 1.7)}%, rgba(240,138,110,${0.5 * g2 * (1 - k(t, 2.34, 0.26))}) 0%, rgba(226,90,61,0) 70%)` }} />
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${coralX - 960 - 60 * Math.max(0, t - 1.6)}px) scale(${slow})`, transformOrigin: "50% 50%" }}>
              <WordLine t={t} size={sz1} weight={900} color={C.cream} items={[{ text: "next", at: 0.96, out: drop(0) }, { text: "creative", at: 1.24, out: drop(1) }, { text: "connection?", at: 1.62, out: drop(2) }]} />
            </div>
          </Inset>
        </>
      )}
    </div>
  );
};
export const S1: Scene = { id: "S1", t0: 0, t1: 2.6, C: S1C };
