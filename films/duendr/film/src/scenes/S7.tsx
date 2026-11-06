// S7 "Hiring creative talent? Post what you need and browse portfolios to find the right fit." (16.6-21.8, B3)
// From H.toggle: the switch flips to Find talent, the headline rises; the switch sinks and Casa Brisa's post grows out of it,
// is typed, posted and flies off; a row of portfolio cards slides past and slows on Javi Ortega, who lifts forward with a coral ring.
import React from "react";
import { C, INOUT, SOFT, IN, c01, k, mix, sp } from "../kit";
import { Segmented } from "../ui";
import { Scene } from "./types";
import { Cap, PostCard, TAL, TalentCard, JaviGroup, javiPose, rowOff } from "./b3-ui";

const Toggle: React.FC<{ t: number }> = ({ t }) => {
  const on = sp(t, 16.82, 1.7, 0.72);
  const kk = k(t, 17.9, 0.75, INOUT);
  const s = mix(2.4 + 0.04 * k(t, 16.7, 1.2, SOFT), 0.9, kk);
  const y = 540 + 470 * kk;
  const op = 1 - k(t, 20.55, 0.35, SOFT);
  const rp = k(t, 17.44, 0.7);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 738, top: 518, width: 444, height: 44, opacity: op, transform: `translate(0px,${y - 540}px) scale(${s})` }}>
      {rp > 0 && rp < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 22, border: `2px solid ${C.coral}`, opacity: 0.8 * (1 - rp), transform: `scale(${mix(1, 1.22, rp)})` }} />}
      <Segmented on={on} />
    </div>
  );
};

const Row: React.FC<{ t: number }> = ({ t }) => {
  if (t < 19.38) return null;
  const off = rowOff(t);
  const q2 = k(t, 20.7, 0.5, SOFT);
  const fade = 1 - k(t, 21.3, 0.4, SOFT);
  return <>{TAL.map((p, i) => {
    if (i === 3) return null;
    const side = i < 3 ? -1 : 1;
    const x = 960 + (i - 3) * 520 + off + side * 150 * q2;
    const op = (1 - 0.7 * q2) * fade;
    if (op <= 0.01 || x < -300 || x > 2300) return null;
    return <div key={i} style={{ position: "absolute", left: 760, top: 340, width: 400, height: 400, opacity: op, transform: `translate(${x - 960}px,${590 + 25 * q2 - 540}px) scale(${1.2 * (1 - 0.15 * q2)})` }}><TalentCard p={p} /></div>;
  })}</>;
};

const S7C: React.FC<{ t: number }> = ({ t }) => {
  // post card
  const pq = sp(t, 18.12, 1.5, 0.78);
  const m = k(t, 19.2, 0.5, INOUT);
  const ex = k(t, 19.85, 0.35, IN);
  const pS = mix(mix(0.5, 1.8, pq), 0.42, m);
  const pX = mix(960, 170, m);
  const pY = mix(mix(700, 590, pq), 150, m) - 320 * ex;
  const pO = c01(pq * 4) * (1 - k(t, 19.95, 0.3));
  const jp = javiPose(t);
  return (
    <>
      <Toggle t={t} />
      <Cap t={t} text="Hiring creative talent?" times={[16.84, 17.12, 17.44]} exit={18.15} y={300} size={120} />
      {pO > 0.01 && <div style={{ position: "absolute", left: 738, top: 370, width: 444, height: 340, opacity: pO, transform: `translate(${pX - 960}px,${pY - 540}px) scale(${pS})` }}><PostCard t={t} /></div>}
      <Cap t={t} text="Post what you need." times={[18.42, 18.62, 18.86, 18.98]} exit={19.2} />
      <Cap t={t} text="Browse portfolios." times={[19.46, 19.72]} exit={20.5} />
      <Row t={t} />
      {t >= 19.38 && <JaviGroup t={t} x={jp.x} y={jp.y} s={jp.s} />}
      <Cap t={t} text="Find the right fit." times={[20.66, 20.88, 21.06, 21.28]} exit={21.5} />
    </>
  );
};
export const S7: Scene = { id: "S7", t0: 16.6, t1: 21.8, C: S7C };
