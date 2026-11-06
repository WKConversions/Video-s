// S10 "Creatives keep their full fee, with zero commission." (27.2-30.7, B4)
// The EUR 280 grows out of the booking tile in the phone, huge, and lands whole in Javi's wallet card; then the app icon's coral circle
// rolls in and becomes the "0" of "0% commission"; the card's fee line is struck through ("Duendr fee -EUR 0"); the "0" ends as the disc S11 turns into the tile.
import React from "react";
import { C, SANS, k, sp, mix, c01, INOUT, OUT, IN, Rise } from "../kit";
import { DISC, Place, Seq, Wallet, WALLET_SLOT } from "./b4-parts";
import { Scene } from "./types";

const T0 = 27.2;
const T = { creatives: 27.5, keep: 28.06, their: 28.26, full: 28.5, fee: 28.82, zero: 29.52, comm: 29.88 };
const GX = 960, GY = 560;          // the giant fee, centred
const GS = 300;                    // its font size
const CARD_S1 = 1.7, CARD_Y1 = 560; // the wallet card, big

const S10C: React.FC<{ t: number }> = ({ t }) => {
  // the giant fee: emerges from the tile (960, 354), flies into the card's slot
  const em = sp(t, 27.42, 1.7, 0.72);
  const fl = k(t, 28.55, 0.6, INOUT);                            // flight into the slot
  // wallet card state: big, then low and small
  const cm = k(t, 29.25, 0.6, INOUT);
  const cs = mix(CARD_S1, 0.9, cm), cy = mix(CARD_Y1, 905, cm);
  const cardIn = k(t, 28.35, 0.4);
  const slotX = 960 + WALLET_SLOT.x * cs, slotY = cy + WALLET_SLOT.y * cs;
  const slotSize = 64 * cs;
  const gs = mix(GS, slotSize, fl) / GS;
  const gx = mix(GX, slotX, fl), gy = mix(mix(354, GY, c01(em)), slotY, fl);
  const gO = c01(em * 2);
  const drift = 1 + 0.012 * c01((t - 28.0) / 1.2);
  // the "0"
  const roll = sp(t, 29.05, 1.1, 0.9);
  const dx = mix(-260, DISC.x, roll);
  const hole = sp(t, 29.56, 1.8, 0.7);
  const marker = (1 - k(t, 29.5, 0.25)) ;
  const ang = ((dx - DISC.x) / DISC.R) * (180 / Math.PI);
  const exit = k(t, 30.38, 0.32, IN);
  const pct = sp(t, 29.66, 1.9, 0.7);
  return (
    <>
      {/* the headline, one line */}
      <div style={{ position: "absolute", left: 0, top: 150, width: 1920, display: "flex", justifyContent: "center", opacity: t < 29.35 ? 1 : 1 - k(t, 29.2, 0.25) }}>
        <Rise text="Creatives keep their full fee" t={t} at={T.creatives} size={108} times={[T.creatives, T.keep, T.their, T.full, T.fee]} colors={[, , , C.coral, C.coral]} out={k(t, 29.15, 0.3, IN)} />
      </div>
      {/* the wallet card */}
      <Place t={t} x={960} y={cy} s={cs * (1 + 0.02 * cardIn)} o={cardIn * (1 - exit)}><div style={{ boxShadow: "0 0 30px rgba(0,0,0,0.4)", borderRadius: 18 }}><Wallet strike={k(t, 30.05, 0.4, OUT)} show={k(t, 29.6, 0.3)} /></div></Place>
      {/* the fee */}
      <Place t={t} x={gx} y={gy} s={gs * (em < 1 ? mix(0.25, 1, c01(em)) : 1) * (fl > 0 ? 1 : 1) * drift} o={gO * (1 - exit)}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: GS, color: C.cream, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap" }}>€280</div>
      </Place>
      {/* 0% commission */}
      {t > 29.1 && (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${dx - DISC.R}px, ${DISC.y - DISC.R + (roll > 0.9 ? Math.sin(t * 2.7 + 8) * 5 : 0)}px)`, opacity: 1, filter: roll < 0.98 ? "blur(1.5px)" : undefined }}>
            <svg width={DISC.R * 2} height={DISC.R * 2} viewBox={`${-DISC.R} ${-DISC.R} ${DISC.R * 2} ${DISC.R * 2}`}>
              <circle r={DISC.R} fill={C.coral} />
              <circle r={DISC.R * 0.52 * Math.max(0, hole)} fill={C.bg} />
              <g transform={`rotate(${ang})`}><circle cx={DISC.R * 0.72} cy={0} r={13} fill={C.cream} opacity={marker} /></g>
            </svg>
          </div>
          <Place t={t} x={1105} y={DISC.y + 4} s={pct} o={c01(pct * 3) * (1 - exit)}><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 270, color: C.cream, letterSpacing: "-0.04em", lineHeight: 1 }}>%</div></Place>
          <div style={{ position: "absolute", left: 0, top: 520 + Math.sin(t * 2.7) * 4, width: 1920, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
            <Rise text="commission" t={t} at={T.comm} size={170} times={[T.comm]} />
          </div>
        </>
      )}
    </>
  );
};
export const S10: Scene = { id: "S10", t0: T0, t1: 30.7, C: (p) => <Seq from={T0}><S10C {...p} /></Seq> };
