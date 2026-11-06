// S8 "Connect directly, chat about the details, and confirm your booking." (21.6-25.7, B3)
// Javi's card (same pose as S7's end) is connected from Casa Brisa's tile by a coral line; both avatars fly into a chat's header,
// three bubbles with typing dots, the footer becomes "Confirm booking", is pressed, and the BookedTile stamps in: H.booking at 25.7.
import React from "react";
import { Sequence } from "remotion";
import { C, GLOW, SHADOW, INOUT, IN, SOFT, SNAP, c01, k, mix, sp } from "../kit";
import { BookedTile, Badge, Ico } from "../ui";
import { Scene } from "./types";
import { Cap, ChatPanel, CHAT, F, HDR_C, HDR_J, JaviGroup, javiPose } from "./b3-ui";

const S8C: React.FC<{ t: number }> = ({ t }) => {
  const jp = javiPose(t);
  const shift = k(t, 21.9, 0.6, INOUT);
  const mo = k(t, 22.85, 0.55, INOUT);            // morph card -> chat
  const cx = mix(960 + 190 * shift, 960, mo);
  const cs = jp.s * (1 - 0.25 * mo);
  const cardOp = 1 - k(t, 22.9, 0.35, SOFT);
  const AV_Y = jp.y + 98;                          // Javi's avatar row on the card (scale 1.55)
  // Casa Brisa tile
  const tq = sp(t, 21.95, 1.8, 0.7);
  const tx = mix(400, HDR_C[0], mo), ty = mix(AV_Y, HDR_C[1], mo), ts = mix(200, 64, mo);
  // line
  const ax = 960 + 190 * shift - 251 * (jp.s / 1.55);   // Javi's avatar centre x on the card
  const lp = k(t, 22.1, 0.3, SNAP);
  const lx0 = 500, lx1 = ax - 40;
  const lineOp = 1 - k(t, 22.75, 0.2, SOFT);
  const ring = sp(t, 22.35, 2, 0.65);
  const jx = mix(ax, HDR_J[0], mo), jy = mix(AV_Y, HDR_J[1], mo), js = mix(68, 64, mo);
  // chat panel
  const cq = sp(t, 22.9, 1.6, 0.8);
  const xk = k(t, 25.0, 0.35, INOUT);
  const pS = mix(0.7, CHAT.s, c01(cq)) * (1 - 0.45 * xk);
  const pO = c01((t - 22.9) / 0.2) * (1 - xk);
  const pY = mix(CHAT.y, 540, xk);
  // booking tile
  const bs = mix(2.6, 2, k(t, 25.1, 0.42));
  const bO = c01((t - 25.08) / 0.1);
  const chk = sp(t, 25.18, 2, 0.65) * (1 - k(t, 25.4, 0.12, IN));
  const flash = k(t, 25.1, 0.5);
  return (
    <>
      <Cap t={t} text="Connect directly." times={[22.04, 22.32]} exit={22.8} />
      <Cap t={t} text="Chat about the details." times={[23.28, 23.42, 23.6, 23.74]} exit={24.3} />
      <Cap t={t} text="Confirm your booking." times={[24.54, 24.9, 25.1]} exit={25.25} />
      {t < 23.3 && <JaviGroup t={t} x={cx} y={jp.y} s={cs} opacity={cardOp} />}
      {t >= 21.95 && t < 23.4 && <>
        <div style={{ position: "absolute", left: lx0, top: AV_Y - 4, width: lx1 - lx0, height: 8, borderRadius: 4, background: C.coral, boxShadow: GLOW, opacity: lineOp * c01(lp * 5), transformOrigin: "0 50%", transform: `scaleX(${lp})` }} />
        {lp >= 1 && lineOp > 0 && <div style={{ position: "absolute", left: lx0, top: AV_Y - 9, width: 18, height: 18, borderRadius: 9, background: C.cream, opacity: lineOp, transform: `translateX(${((t - 22.4) * 1.2 % 1) * (lx1 - lx0 - 18)}px)` }} />}
        <div style={{ position: "absolute", left: tx - 100, top: ty - 100, width: 200, height: 200, transform: `scale(${(ts / 200) * Math.max(0.0001, tq)})`, opacity: c01(tq * 3) }}>
          <div style={{ width: 200, height: 200, borderRadius: 48, background: C.cream, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", ...F(120, 800, C.ink) }}>C</div>
        </div>
        {mo < 0.3 && <div style={{ position: "absolute", left: tx - 150, top: ty + 118, width: 300, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, opacity: c01(tq * 2) * (1 - mo * 3), ...F(34, 700) }}>Casa Brisa<Badge s={28} /></div>}
        {ring > 0.01 && t < 23.2 && <div style={{ position: "absolute", left: jx - 46, top: jy - 46, width: 92, height: 92, borderRadius: 46, border: `4px solid ${C.coral}`, boxShadow: GLOW, opacity: c01(ring) * (1 - k(t, 22.9, 0.25)), transform: `scale(${mix(1.5, 1, c01(ring))})` }} />}
        {t >= 22.3 && <div style={{ position: "absolute", left: jx - js / 2, top: jy - js / 2, width: js, height: js, borderRadius: js / 2, background: C.card2, display: "flex", alignItems: "center", justifyContent: "center", ...F(js * 0.34, 700, C.muted) }}>JO</div>}
      </>}
      {pO > 0.01 && <div style={{ position: "absolute", left: 960 - CHAT.w / 2, top: 540 - CHAT.h / 2, width: CHAT.w, height: CHAT.h, opacity: pO, transform: `translate(0px,${pY - 540}px) scale(${pS})` }}><ChatPanel t={t} /></div>}
      {t >= 25.08 && <>
        <div style={{ position: "absolute", left: 810, top: 488, width: 300, height: 104, opacity: bO, transform: `scale(${bs})` }}>
          <Sequence from={Math.round(24.9 * 60)} layout="none"><BookedTile mon="NOV" day="21" dow="Sat" name="Javi Ortega" at="Casa Brisa" time="Sat · 20:00" img="clips/dj-stage.mp4" /></Sequence>
        </div>
        {flash < 1 && <div style={{ position: "absolute", left: 960 - 300, top: 540 - 104, width: 600, height: 208, borderRadius: 28, border: `3px solid ${C.coral}`, opacity: 0.8 * (1 - flash), transform: `scale(${mix(1, 1.5, flash)})` }} />}
        {chk > 0.01 && <div style={{ position: "absolute", left: 1260 - 35, top: 436 - 35, width: 70, height: 70, borderRadius: 35, background: C.coral, boxShadow: GLOW, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.max(0, chk)})` }}><Ico n="check" s={40} w={3} /></div>}
      </>}
    </>
  );
};
export const S8: Scene = { id: "S8", t0: 21.6, t1: 25.7, C: S8C };
