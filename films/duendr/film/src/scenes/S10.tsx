// S10 "Creatives keep their full fee, with zero commission." (27.2-30.7, B4)
// The EUR 280 grows out of the booking tile in the phone, huge, and lands whole in Javi's card (their "Full fee" pill pops beside it); the
// card drops away and the app icon's coral circle rolls in and becomes the "0" of "0% commission"; the "0" ends as the disc S11 turns into the tile.
import React from "react";
import { C, SANS, k, sp, mix, c01, INOUT, IN, SOFT } from "../kit";
import { DISC, FEE_SLOT, FeeCard, Place, PUSH, RiseL, Seq } from "./b4-parts";
import { Scene } from "./types";

const T0 = 27.2;
const T = { creatives: 27.5, keep: 28.06, their: 28.26, full: 28.5, fee: 28.82, zero: 29.52, comm: 29.88 };
const GX = 960, GY = 560;          // the giant fee, centred
const GS = 300;                    // its font size
const CARD_S = 1.7, CARD_Y1 = 560; // Javi's card, big
const PCT = 320;                   // the "%" is as tall as the ring
const PCT_GAP = 18;

const S10C: React.FC<{ t: number }> = ({ t }) => {
  // the giant fee: emerges from the tile (960, 354) with a real spring, flies into the card's slot
  const em = Math.max(0, sp(t, 27.42, 1.7, 0.72));
  const fl = k(t, 28.42, 0.55, INOUT);                           // flight into the slot
  // Javi's card rises from below on "keep", and drops out of frame before the ring rolls in
  const cy = mix(mix(1350, CARD_Y1, sp(t, 28.06, 1.5, 0.75)), 1500, k(t, 29.3, 0.4, IN));
  const slotX = 960 + FEE_SLOT.x * CARD_S, slotY = cy + FEE_SLOT.y * CARD_S;
  const gs = mix(GS, 64 * CARD_S, fl) / GS;
  const gx = mix(GX, slotX, fl), gy = mix(mix(354, GY, em), slotY, fl);
  const gO = c01(em * 2);
  const drift = 1 + 0.05 * k(t, 27.7, 0.9, SOFT) * (1 - fl);
  const pill = sp(t, 28.92, 1.8, 0.6);
  // the "0"
  const roll = sp(t, 29.05, 1.1, 0.9);
  const dx = mix(-260, DISC.x, roll);
  const hole = sp(t, 29.56, 1.8, 0.7);
  const marker = (1 - k(t, 29.5, 0.25)) ;
  const ang = ((dx - DISC.x) / DISC.R) * (180 / Math.PI);
  const exit = k(t, 30.38, 0.32, IN);
  const pct = sp(t, 29.66, 1.9, 0.7);
  const blur = 1.5 * (1 - c01((roll - 0.85) / 0.13));
  const bob = Math.sin(t * 2.7 + 8) * 5 * c01((roll - 0.9) / 0.1) * (1 - k(t, 30.3, 0.3));
  const push = PUSH(t);
  return (
    <>
      {/* the headline, one line */}
      <div style={{ position: "absolute", left: 0, top: 150, width: 1920, display: "flex", justifyContent: "center", opacity: 1 - k(t, 29.15, 0.3) }}>
        <RiseL text="Creatives keep their full fee" t={t} at={T.creatives} size={108} times={[T.creatives, T.keep, T.their, T.full, T.fee]} colors={[, , , C.coral, C.coral]} out={k(t, 29.15, 0.3, IN)} />
      </div>
      {/* Javi's card */}
      <Place t={t} x={960} y={cy} s={CARD_S}><div style={{ boxShadow: "0 0 30px rgba(0,0,0,0.4)", borderRadius: 18 }}><FeeCard info={k(t, 28.9, 0.25)} pill={pill} /></div></Place>
      {/* the fee */}
      <Place t={t} x={gx} y={gy} s={gs * mix(0.25, 1, em) * drift} o={gO}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: GS, color: C.cream, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap" }}>€280</div>
      </Place>
      {/* 0% commission */}
      {t > 29.1 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: `scale(${push})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${dx - DISC.R}px, ${DISC.y - DISC.R + bob}px)`, opacity: 1, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
            <svg width={DISC.R * 2} height={DISC.R * 2} viewBox={`${-DISC.R} ${-DISC.R} ${DISC.R * 2} ${DISC.R * 2}`}>
              <circle r={DISC.R} fill={C.coral} />
              <circle r={DISC.R * 0.52 * Math.max(0, hole)} fill={C.bg} />
              <g transform={`rotate(${ang})`}><circle cx={DISC.R * 0.72} cy={0} r={13} fill={C.cream} opacity={marker} /></g>
            </svg>
          </div>
          <Place x={DISC.x + DISC.R + PCT_GAP + PCT * 0.43} y={DISC.y + 4} s={pct} o={c01(pct * 3) * (1 - exit)}><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: PCT, color: C.cream, letterSpacing: "-0.04em", lineHeight: 1 }}>%</div></Place>
          <div style={{ position: "absolute", left: 0, top: 610, width: 1920, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
            <RiseL text="commission" t={t} at={T.comm} size={170} times={[T.comm]} />
          </div>
        </div>
      )}
    </>
  );
};
export const S10: Scene = { id: "S10", t0: T0, t1: 30.7, C: (p) => <Seq from={T0}><S10C {...p} /></Seq> };
