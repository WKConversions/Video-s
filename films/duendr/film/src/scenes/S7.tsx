// S7 "Hiring creative talent? Post what you need and browse portfolios to find the right fit." (16.6-21.8, B3)
// From H.toggle: the switch flips to Find talent, the headline rises; the switch sinks and Casa Brisa's post grows out of it,
// is typed, posted and flies off; a row of portfolio cards slides past and slows on Javi Ortega, who lifts forward with a coral ring.
import React from "react";
import { C, INOUT, SOFT, c01, k, mix, sp } from "../kit";
import { Segmented } from "../ui";
import { Scene } from "./types";
import { Cap, PostCard, TAL, TalentCard, JaviGroup, javiPose, rowOff } from "./b3-ui";

const Toggle: React.FC<{ t: number }> = ({ t }) => {
  if (t < 16.7) return null;
  const on = sp(t, 16.70, 1.7, 0.72);
  const s = 2.4 + 0.12 * k(t, 16.7, 1.4, SOFT);
  const op = 1 - k(t, 17.62, 0.28, SOFT);
  const rp = k(t, 17.44, 0.7);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 738, top: 518, width: 444, height: 44, opacity: op, transform: `scale(${s})` }}>
      {rp > 0 && rp < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 22, border: `2px solid ${C.coral}`, opacity: 0.8 * (1 - rp), transform: `scale(${mix(1, 1.22, rp)})` }} />}
      <Segmented on={on} />
    </div>
  );
};

// the cream thumb becomes the post card (plain rounded rect, no text)
const lerpHex = (a: [number, number, number], b: [number, number, number], u: number) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], u))).join(",")})`;
const Morph: React.FC<{ t: number }> = ({ t }) => {
  if (t < 17.62 || t >= 18.25) return null;
  const g = k(t, 17.62, 0.6, SOFT);
  const w = mix(544, 799, g), h = mix(96, 612, g);
  return <div style={{ position: "absolute", left: 960 - 400, top: 540 - 306, width: w, height: h, marginLeft: (799 - w) / 2, marginTop: (612 - h) / 2, borderRadius: mix(48, 36, g), background: lerpHex([240, 235, 225], [30, 27, 25], c01(g / 0.6)), border: `1px solid ${C.border}`, boxSizing: "border-box", transform: `translate(${mix(280, 0, g)}px,${mix(0, 50, g)}px)` }} />;
};

const Row: React.FC<{ t: number }> = ({ t }) => {
  if (t < 19.38) return null;
  const off = rowOff(t);
  const q2 = k(t, 20.7, 0.5, SOFT);
  const fade = 1 - k(t, 21.3, 0.4, SOFT);
  return <>{TAL.map((p, i) => {
    if (i === 3) return null;
    const side = i < 3 ? -1 : 1;
    const x = 960 + (i - 3) * 580 + off + side * 100 * q2;
    const op = (1 - 0.7 * q2) * fade;
    if (op <= 0.01 || x < -300 || x > 2300) return null;
    return <div key={i} style={{ position: "absolute", left: 760, top: 340, width: 400, height: 400, opacity: op, transform: `translate(${x - 960}px,${590 + 25 * q2 - 540}px) scale(${1.35 * (1 - 0.15 * q2)})` }}><TalentCard p={p} /></div>;
  })}</>;
};

const S7C: React.FC<{ t: number }> = ({ t }) => {
  // post card: grows out of the thumb, then rides out with the row
  const m = k(t, 19.15, 0.4, INOUT);
  const pS = 1.8 + (1.35 - 1.8) * m;
  const pX = 960 - (rowOff(19.0) - rowOff(t));
  const pO = c01((t - 17.95) / 0.25);
  const jp = javiPose(t);
  return (
    <>
      <Toggle t={t} />
      <Cap t={t} text="Hiring creative talent?" times={[16.84, 17.12, 17.44]} exit={17.85} y={300} size={120} />
      <Morph t={t} />
      {pO > 0.01 && pX > -500 && <div style={{ position: "absolute", left: 738, top: 370, width: 444, height: 340, opacity: pO, transform: `translate(${pX - 960}px,50px) scale(${pS})` }}><PostCard t={t} /></div>}
      <Cap t={t} text="Post what you need." times={[18.42, 18.62, 18.86, 18.98]} exit={19.25} />
      <Cap t={t} text="Browse portfolios." times={[19.46, 19.72]} exit={20.4} />
      <Row t={t} />
      {t >= 19.38 && t < 21.6 && <JaviGroup t={t} x={jp.x} y={jp.y} s={jp.s} />}
      {t < 21.6 && <Cap t={t} text="Find the right fit." times={[20.66, 20.88, 21.06, 21.28]} exit={21.66} />}
    </>
  );
};
export const S7: Scene = { id: "S7", t0: 16.6, t1: 21.8, C: S7C };
