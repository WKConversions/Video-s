// Package R06 · reference f475–f556 · shots P Q R S, rebuilt frame by frame from the measured reference.
//   P  f475–f483  dark ground, two lines, the big circles slide left (violet pill alone, "?" from f478, "AI" from f481)
//   Q  f484–f512  the full-frame browser (R06_q.tsx): chat scrolls, notes scroll, the key lights at f492
//   R  f513–f527  filmed (clip R, on twos), the reference's tiny camera drift
//   S  f528–f556  split screen (R06_s.tsx): filmed half + the ranking, "Your business" climbs 9th -> 2nd
// Every change of shot is a hard cut on its reference frame. t = seconds since f475.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, Footage, abs, kf, onTwos, refN, useFonts } from "../kit";
import type { Pkg, Sfx } from "../types";
import { ShotQ } from "./R06_q";
import { ShotS, TRIG } from "./R06_s";

const F0 = 475;
const at = (n: number) => (n - F0) / 24;
const refAt = (t: number) => refN(t, F0) + 1e-4;

const Mark: React.FC = () => (
  <div style={{ position: "absolute", left: 28, top: 24, height: 32, display: "flex", alignItems: "center", gap: 8, opacity: 0.6, fontFamily: F }}>
    <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 28, height: 28, borderRadius: 6 }} />
    <span style={{ fontSize: 27, fontWeight: 600, color: "#9AA4B2", letterSpacing: "-0.02em" }}>K.B</span>
  </div>
);

// ---------------------------------------------------------------- P: circles on dark (all numbers measured, film px)
const D = 627; // every circle's diameter
const ShotP: React.FC<{ n: number }> = ({ n }) => {
  const vr = kf(n, [[475, 475], [476, 469], [477, 460], [478, 448], [479, 435], [480, 420], [481, 403], [482, 385], [483, 366], [484, 346]]); // right edge of the violet pill
  const fx = kf(n, [[478, 925.5], [479, 906], [480, 886.5], [481, 865.5], [482, 847], [483, 826], [484, 806]]);                                  // centre of the "?" circle
  const gx = kf(n, [[481, 1639.5], [482, 1620], [483, 1600.5], [484, 1581]]);                                                                      // centre of the "AI" circle
  const label: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#16202E", fontSize: 165, letterSpacing: "-0.02em", fontFamily: F };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "#222A36", overflow: "hidden" }}>
      <div style={abs(0, 123, 1920, 16, { background: "#323B49" })} />
      <div style={abs(0, 913, 1920, 16, { background: "#323B49" })} />
      <div style={abs(-1200, 627, vr + 1200, D, { borderRadius: D / 2, background: "#B3A8F2", transform: "translate3d(0,0,0)" })} />
      {n >= 478 && <div style={abs(0, 213, D, D, { ...label, borderRadius: D / 2, background: C.cyan, transform: `translate3d(${(fx - D / 2).toFixed(2)}px, 0, 0)`, willChange: "transform" })}>?</div>}
      {n >= 481 && <div style={abs(0, 140 - D / 2, D, D, { ...label, borderRadius: D / 2, background: C.mint, transform: `translate3d(${(gx - D / 2).toFixed(2)}px, 0, 0)`, willChange: "transform" })}>AI</div>}
      <Mark />
    </div>
  );
};

// ---------------------------------------------------------------- R: the filmed customer, the reference's camera drift
const CDX: [number, number][] = [[513, 0], [514, -1.7], [515, -4], [516, -6.1], [517, -7.3], [518, -7.9], [519, -7.4], [520, -4.8], [521, -2.7], [522, -0.6], [523, 1.3], [524, 1.1], [525, 1.2], [526, 0.8], [527, -0.3]];
const CDY: [number, number][] = [[513, 0], [514, -0.3], [515, -0.4], [516, 0.9], [517, 1], [518, 0.3], [519, -1.3], [520, -3.1], [521, -4.1], [522, -5.1], [523, -5.5], [524, -4.5], [525, -4], [526, -3.7], [527, -3.9]];
const ShotR: React.FC<{ t: number }> = ({ t }) => {
  const tw = onTwos("R", t - at(513), 0.625), nn = 513 + tw.sj * 24;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <Footage name="R" at={tw.at} scale={1.012} x={kf(nn, CDX)} y={kf(nn, CDY)} />
      <Mark />
    </div>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  const n = refAt(t);
  if (!ok) return <div style={{ position: "absolute", inset: 0, background: n >= 484 && n < 513 ? "#FFFFFF" : "#222A36" }} />;
  if (n >= 528) return <ShotS t={t} n={n} t0={at(528)} />;
  if (n >= 513) return <ShotR t={t} />;
  if (n >= 484) return <ShotQ n={n} />;
  return <ShotP n={n} />;
};

const sfx: Sfx[] = [
  // P: the two circles that appear
  { t: at(478), kind: "pop", note: "the ? circle appears", ref: 478 },
  { t: at(481), kind: "pop", note: "the AI circle appears", ref: 481 },
  // Q: a note arrives on its frame, the key lights
  ...[485, 487, 489, 491, 493].map((f, i) => ({ t: at(f), kind: "pop", note: `a result arrives (${i + 1})`, ref: f, db: -6 })),
  { t: at(492), kind: "sparkle", note: "the Your business key lights up", ref: 492 },
  // S: one tick for every place the row takes (seven places, ninth to second)
  ...TRIG.map((tg, i) => ({ t: at(tg), kind: "tick", note: `the row takes place ${8 - i}`, ref: Math.round(tg), db: 2, keep: true })),
];

export const PKG: Pkg = { id: "R06", Comp, sfx };
