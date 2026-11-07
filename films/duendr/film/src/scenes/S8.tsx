// S8 "Connect directly, chat about the details, and confirm your booking." (21.6-25.7, B3)
// Javi's card (same pose as S7's end) is connected from Casa Brisa's tile by a coral line; both avatars fly into a chat's header,
// three bubbles with typing dots, the footer becomes "Confirm booking", is pressed, and the BookedTile stamps in: H.booking at 25.7.
import React from "react";
import { Sequence } from "remotion";
import { C, GLOW, SHADOW, INOUT, IN, SOFT, SNAP, c01, k, mix, sp } from "../kit";
import { BookedTile, Badge, Ico } from "../ui";
import { Scene } from "./types";
import { Cap, ChatPanel, CHAT, F, HDR_C, HDR_J, JaviGroup, javiPose } from "./b3-ui";

const BASE_X = 899, BASE_Y = 673;                  // flying pieces start here (Javi's avatar on the card at x1.55, shift 1)
const S8C: React.FC<{ t: number }> = ({ t }) => {
  const jp = javiPose(t);
  const shift = k(t, 21.9, 0.6, INOUT);
  const mo = k(t, 22.85, 0.55, INOUT);            // avatars fly into the chat header
  const cx = 960 + 190 * shift;
  const cardOp = 1 - k(t, 22.85, 0.15, SOFT);
  const AV_Y = jp.y + 98;                          // Javi's avatar row on the card (scale 1.55)
  // Casa Brisa tile
  const tq = sp(t, 21.95, 1.8, 0.7);
  const tx = mix(400, HDR_C[0], mo), ty = mix(AV_Y, HDR_C[1], mo), ts = mix(200, 78, mo);
  // line
  const ax = 960 + 190 * shift - 251 * (jp.s / 1.55);   // Javi's avatar centre x on the card
  const lp = k(t, 22.1, 0.3, SNAP);
  const lx0 = 500, lx1 = ax - 40;
  const lineOp = 1 - k(t, 22.75, 0.2, SOFT);
  const ring = sp(t, 22.35, 2, 0.65);
  const jx = mix(ax, HDR_J[0], mo), jy = mix(AV_Y, HDR_J[1], mo), js = mix(68, 78, mo);
  // chat panel: starts at the card's own rect, opaque, and settles
  const cq = sp(t, 22.85, 1.6, 0.8);
  const xk = k(t, 25.0, 0.35, INOUT);
  const pS = mix(1.40, CHAT.s, cq) * (1 - 0.45 * xk);
  const pX = mix(1150, 960, cq);
  const pY = mix(mix(575, CHAT.y, cq), 540, xk);
  const pO = t >= 22.85 ? 1 - xk : 0;
  const inner = k(t, 22.95, 0.25, SOFT);
  // booking tile grows out of the pressed Confirm pill (centre 960,938)
  const bq = k(t, 25.02, 0.5);
  const bs = mix(2.2, 2, bq);
  const by = 398 * (1 - bq);
  const bI = mix(35, 0, bq);
  const chk = sp(t, 25.18, 2, 0.65) * (1 - k(t, 25.4, 0.12, IN));
  const flash = k(t, 25.02, 0.5);
  return (
    <>
      {t >= 21.6 && <Cap t={t} text="Find the right fit." times={[20.66, 20.88, 21.06, 21.28]} exit={21.66} />}
      <Cap t={t} text="Connect directly." times={[22.04, 22.32]} exit={22.8} />
      <Cap t={t} text="Chat about the details." times={[23.28, 23.42, 23.6, 23.74]} exit={24.28} />
      <Cap t={t} text="Confirm your booking." times={[24.54, 24.9, 25.1]} exit={25.44} />
      {pO > 0.01 && <div style={{ position: "absolute", left: 960 - CHAT.w / 2, top: 540 - CHAT.h / 2, width: CHAT.w, height: CHAT.h, opacity: pO, transform: `translate(${pX - 960}px,${pY - 540}px) scale(${pS})` }}><ChatPanel t={t} inner={inner} hideConfirm={t >= 25.02} /></div>}
      {t < 23.1 && <JaviGroup t={t} x={cx} y={jp.y} s={jp.s} opacity={cardOp} />}
      {t >= 21.95 && t < 23.4 && <>
        <div style={{ position: "absolute", left: lx0, top: AV_Y - 4, width: lx1 - lx0, height: 8, borderRadius: 4, background: C.coral, boxShadow: GLOW, opacity: lineOp * c01(lp * 5), transformOrigin: "0 50%", transform: `scaleX(${lp})` }} />
        {lp >= 1 && lineOp > 0 && <div style={{ position: "absolute", left: lx0, top: AV_Y - 9, width: 18, height: 18, borderRadius: 9, background: C.cream, opacity: lineOp, transform: `translateX(${((t - 22.4) * 1.2 % 1) * (lx1 - lx0 - 18)}px)` }} />}
        <div style={{ position: "absolute", left: 400 - 100, top: BASE_Y - 100, width: 200, height: 200, transform: `translate(${tx - 400}px,${ty - BASE_Y}px) scale(${(ts / 200) * Math.max(0.0001, tq)})`, opacity: c01(tq * 3) }}>
          <div style={{ width: 200, height: 200, borderRadius: 48, background: C.cream, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", ...F(120, 800, C.ink) }}>C</div>
        </div>
        {mo < 0.3 && <div style={{ position: "absolute", left: 400 - 150, top: BASE_Y + 118, width: 300, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, opacity: c01(tq * 2) * (1 - mo * 3), transform: `translate(${tx - 400}px,${ty - BASE_Y}px)`, ...F(34, 700) }}>Casa Brisa<Badge s={28} /></div>}
        {ring > 0.01 && t < 23.2 && <div style={{ position: "absolute", left: BASE_X - 46, top: BASE_Y - 46, width: 92, height: 92, borderRadius: 46, border: `4px solid ${C.coral}`, boxShadow: GLOW, opacity: c01(ring) * (1 - k(t, 22.9, 0.25)), transform: `translate(${jx - BASE_X}px,${jy - BASE_Y}px) scale(${mix(1.5, 1, c01(ring))})` }} />}
        {t >= 22.3 && <div style={{ position: "absolute", left: BASE_X - 34, top: BASE_Y - 34, width: 68, height: 68, borderRadius: 34, background: C.card2, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${jx - BASE_X}px,${jy - BASE_Y}px) scale(${js / 68})`, ...F(23, 700, C.muted) }}>JO</div>}
      </>}
      {t >= 25.02 && <>
        <div style={{ position: "absolute", left: 810, top: 488, width: 300, height: 104, transform: `translate(0px,${by}px) scale(${bs})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 14, boxShadow: SHADOW, opacity: bq * bq }} />
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(${bI}px 0px ${bI}px 0px round ${mix(18, 14, bq)}px)` }}>
            <Sequence from={Math.round(24.9 * 60)} layout="none"><BookedTile mon="NOV" day="21" dow="Sat" name="Javi Ortega" at="Casa Brisa" time="Sat · 20:00" img="clips/dj-stage.mp4" /></Sequence>
            <div style={{ position: "absolute", inset: 0, background: C.coral, opacity: 1 - k(t, 25.02, 0.2, SOFT) }} />
          </div>
        </div>
        {flash < 1 && <div style={{ position: "absolute", left: 960 - 300, top: 540 - 104, width: 600, height: 208, borderRadius: 28, border: `3px solid ${C.coral}`, opacity: 0.8 * (1 - flash), transform: `translate(0px,${by}px) scale(${(bs / 2) * mix(1, 1.5, flash)})` }} />}
        {chk > 0.01 && <div style={{ position: "absolute", left: 960 + 150 * bs - 35, top: 540 + by - 52 * bs - 35, width: 70, height: 70, borderRadius: 35, background: C.coral, boxShadow: GLOW, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.max(0, chk)})` }}><Ico n="check" s={40} w={3} /></div>}
      </>}
    </>
  );
};
export const S8: Scene = { id: "S8", t0: 21.6, t1: 25.7, C: S8C };
