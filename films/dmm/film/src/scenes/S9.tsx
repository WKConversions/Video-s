// Scene S9 (B4): "and keep the conversation going in our private WhatsApp group." 19.95-23.15 (plan/contract.md).
// The phone in DMM's own colours rises; the pressed pill flies into it and becomes the header (rolling to the group's name,
// the wave mark as avatar); S8's speech bubble drops in as a voice note; their terrace event and Tatiana's talk arrive;
// the wave's dot, tripled, types; the lock closes on 'private'. Then the phone zooms through: its wallpaper is the
// spine's own contour field, so at 23.15 it is the charcoal stage of S10 line for line (H.cut).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene } from "./types";
import { C, Rise, c01, k, mix, sp, IN, INOUT } from "../kit";
import {
  BZ, GAP, HEAD_H, H_I, H_L, H_T, H_V, ImageMsg, LinkMsg, PH_H, PH_W, PILL_LABELS, PILL_X, PILL_YS, PillBar, PhoneState, Q0, SC_H, SC_W, T_DOCK,
  TypingMsg, VB_S, VoiceBubble, WAPillLayer, Wallpaper, XL, YB, bubbleS8, phoneAt, phoneToLayer, waPill,
} from "./b4-kit";

const T_LAND = 20.42, T_IMG = 20.58, T_LINK = 21.05, T_TYP = 21.55;
const PHONE_SHADOW = "0 0 2px rgba(20,24,30,0.10), 0 0 36px rgba(20,24,30,0.14), 0 0 110px rgba(20,24,30,0.16), inset 0 0 0 1.5px rgba(255,255,255,0.09)";

/** the speech bubble from S8 drops into the chat's bottom slot (layer px: body centre, scale) */
const bubbleDrop = (t: number) => {
  const s0 = bubbleS8(20.05), e = INOUT(c01((t - 20.1) / (T_LAND - 20.1)));
  const [tx, ty] = phoneToLayer(phoneAt(t), [BZ + 30 + 180 * VB_S, BZ + YB - 70 * VB_S]);
  return { x: mix(s0.x, tx, e) - 40 * Math.sin(Math.PI * e), y: mix(s0.y, ty, e), s: mix(s0.s, VB_S, e) };
};

/** a message entering at the bottom: rises with the column, popping from its tail corner */
const Msg: React.FC<{ x: number; bot: number; h: number; q: number; children: React.ReactNode }> = ({ x, bot, h, q, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `0px ${h}px`, transform: `translate(${x}px, ${(bot - h).toFixed(2)}px) scale(${mix(0.86, 1, Math.min(1, q))})` }}>{children}</div>
);

const Phone: React.FC<{ t: number; ph: PhoneState }> = ({ t, ph }) => {
  const sI = sp(t, T_IMG, 2.0, 0.72), sL = sp(t, T_LINK, 2.0, 0.72), sT = sp(t, T_TYP, 2.0, 0.72);
  const stI = (H_I + GAP) * sI, stL = (H_L + GAP) * sL, stT = (H_T + GAP) * sT;
  const botV = YB - stI - stL - stT, botI = YB + (H_I + GAP) * (1 - sI) - stL - stT, botL = YB + (H_L + GAP) * (1 - sL) - stT, botT = YB + (H_T + GAP) * (1 - sT);
  // the zoom-through: the column parts at the zoom point (above goes up, below goes down) and the UI blurs on its fastest frames
  const part = 190 * Math.pow(c01((t - 22.7) / 0.45), 2);
  const bl = t >= 22.99 ? 7 / (ph.push * ph.z) : 0, filter = bl > 0 ? `blur(${bl.toFixed(2)}px)` : undefined;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: PH_W, height: PH_H, transformOrigin: `${Q0[0]}px ${Q0[1]}px`, transform: `translate(${ph.ax - Q0[0]}px, ${ph.ay - Q0[1]}px) scale(${ph.z})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "#1B1B1F", boxShadow: PHONE_SHADOW }} />
      <div style={{ position: "absolute", left: BZ, top: BZ, width: SC_W, height: SC_H, borderRadius: 52, overflow: "hidden", background: C.char }}>
        <Wallpaper t={t} ph={ph} />
        <div style={{ position: "absolute", left: 0, top: 0, width: SC_W, height: SC_H, transform: `translateY(${-part}px)`, filter }}>
          {t >= T_LAND && <Msg x={30} bot={botV} h={H_V} q={1}><div style={{ transformOrigin: "0px 0px", transform: `scale(${VB_S})` }}><VoiceBubble t={t} /></div></Msg>}
          {t >= T_IMG && <Msg x={30} bot={botI} h={H_I} q={sI}><ImageMsg /></Msg>}
          {t >= T_DOCK && <PillBar t={t} label={PILL_LABELS[2]} w={SC_W} h={HEAD_H} rT={52} rB={0} lit={waPill(t).lit} shadow={0} header />}
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: SC_W, height: SC_H, transform: `translateY(${part}px)`, filter }}>
          {t >= T_LINK && <Msg x={30} bot={botL} h={H_L} q={sL}><LinkMsg /></Msg>}
          {t >= T_TYP && <Msg x={30} bot={botT} h={H_T} q={sT}><TypingMsg t={t} /></Msg>}
        </div>
      </div>
    </div>
  );
};

/** 'private' / 'WhatsApp group' on the right of the phone (left edge 867 = phone's right edge after the glide + 90) */
const TypeRight: React.FC<{ t: number }> = ({ t }) => {
  const out = k(t, 22.7, 0.28, IN);
  if (t < 21.8 || out >= 1) return null;
  const x0 = XL + PH_W / 2 + 90;
  return <>
    <div style={{ position: "absolute", left: x0, top: 434 }}><Rise text="private" t={t} at={21.84} size={100} color={C.char} out={out} /></div>
    {t >= 22.1 && <div style={{ position: "absolute", left: x0, top: 540 }}><Rise text="WhatsApp group" t={t} at={22.16} times={[22.16, 22.5]} size={100} color={C.char} out={out} /></div>}
  </>;
};

const C9: React.FC<{ t: number }> = ({ t }) => {
  if (t < 20.05) return null;
  const ph = phoneAt(t), b = bubbleDrop(t);
  return (
    <AbsoluteFill style={{ transformOrigin: "960px 540px", transform: `scale(${ph.push})` }}>
      <Phone t={t} ph={ph} />
      {t < T_DOCK && <WAPillLayer t={t} />}
      {t < T_LAND && <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0px 0px", transform: `translate(${b.x - 180 * b.s}px, ${b.y - 70 * b.s}px) scale(${b.s})` }}>
        <VoiceBubble t={t} shadow />
      </div>}
      <TypeRight t={t} />
    </AbsoluteFill>
  );
};

export const S9: Scene = {
  id: "S9", t0: 19.95, t1: 23.15, C: C9,
  // carries S8's press ring on until it has left the frame; nothing near the cut (the stage at 23.15 must be the bare field)
  topo: (t) => ({ ripples: t >= 20.5 && t < 22.3 ? [{ x: PILL_X, y: PILL_YS[2], age: t - 20.02, h: 0.32, w: 140, speed: 850 }] : [] }),
};
