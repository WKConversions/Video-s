// Cursor lab (not in the film): the hand cursor's moves, one after another, for Karl to judge.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, SANS, SERIF } from "./lib";
import { Hand, handAt, HandKey } from "./hand";

const KEYS: HandKey[] = [
  { at: 0, x: 500, y: 700 },
  { at: 2.2, x: 1420, y: 700, early: 0.3 },            // right
  { at: 4.2, x: 500, y: 700, early: 0.3 },             // left
  { at: 6.0, x: 500, y: 330, early: 0.3 },             // up
  { at: 7.8, x: 500, y: 760, early: 0.3 },             // down
  { at: 9.8, x: 1380, y: 360, early: 0.3 },            // diagonal
  { at: 12.2, x: 960, y: 560, click: true },           // arrives early, rests, clicks
  { at: 13.4, x: 960, y: 560, click: true },           // a second click in place
  { at: 16.2, x: 1320, y: 760, click: true },          // glide to a button, rest, click
];
const LABELS: [number, string][] = [[0.4, "Naar rechts"], [2.5, "Naar links"], [4.5, "Omhoog"], [6.3, "Omlaag"], [8.1, "Schuin"], [10.4, "Vroeg aankomen, rusten, klikken"], [13.0, "Nog een klik"], [14.2, "Naar een knop glijden, rusten, klikken"]];
export const HandLab: React.FC = () => {
  const g = useCurrentFrame() / 2, t = g / 30, h = handAt(g, KEYS, { size: 230 });
  const label = [...LABELS].reverse().find(([a]) => t >= a)?.[1] ?? "";
  const pr = (at: number) => { const d = t - at; return d < 0 ? 0 : d < 0.1 ? d / 0.1 : d < 0.2 ? 1 : Math.exp(-(d - 0.2) * 7) * Math.cos((d - 0.2) * 16); };
  const b1 = Math.max(pr(12.2), pr(13.4)), b2 = pr(16.2);
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: SERIF, fontSize: 64, letterSpacing: "-0.02em", color: C.ink }}>{label}</div>
      <div style={{ position: "absolute", left: 960 - 190, top: 560 - 44, width: 380, height: 88, borderRadius: 14, background: C.white, boxShadow: `0 0 0 1px ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.ink, opacity: t > 10.2 && t < 14.4 ? 1 : 0, transform: `scale(${1 - 0.04 * b1})` }}>Virksomhedsnavn</div>
      <div style={{ position: "absolute", left: 1320 - 130, top: 760 - 40, width: 260, height: 80, borderRadius: 12, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 500, opacity: t > 14.2 ? 1 : 0, transform: `scale(${1 - 0.05 * b2})` }}>Fortsæt</div>
      <Hand {...h} />
    </AbsoluteFill>
  );
};
