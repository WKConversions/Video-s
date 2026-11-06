// S4 "Showcase your work and share your availability." 8.6-11.6. From H.dot: the dot becomes Lucía's avatar ring, her profile and work
// tiles assemble, the "+" opens the new-post flow, the available post flips in, and flips on into the first gig card (S5's deck).
import React from "react";
import { Media, Rise, C, INOUT, c01, k, mix, sp, GLOW } from "../kit";
import { Badge, Ico } from "../ui";
import { H } from "../handoff";
import { Scene } from "./types";
import { DECK_Y, GigFace, PanelA, PanelB, Seq, deckScale } from "./b2-shared";

const TILES = [{ src: "clips/model-shoot.mp4", at: 8.98, x: 150 }, { src: "clips/portrait-hair.mp4", at: 9.3, x: 700 }, { src: "clips/photog-lens.mp4", at: 9.58, x: 1250 }];
const AV = { x: 600, y: 215, R: 100 };

const Body: React.FC<{ t: number }> = ({ t }) => {
  if (t < H.dot.t) return null;                   // S3 owns the frame until 8.75
  // dot -> avatar ring
  const g = k(t, H.dot.t, 0.5), R = mix(H.dot.r, AV.R, g), p = k(t, 8.9, 0.6, INOUT);
  const cx = mix(960, AV.x, p), cy = mix(540, AV.y, p), img = k(t, 8.86, 0.25);
  const pulse = c01((t - 9.45) / 0.8);
  const bk = k(t, 10.12, 0.3), grp = 1 - k(t, 10.56, 0.2);   // profile + tiles step back (scale, rise, dim) as the sheet opens, then fade
  const plus = sp(t, 9.86, 1.8, 0.7) * (1 - k(t, 10.1, 0.2));
  // the sheet: grows out of the "+", flips A -> B -> the gig card
  const q = c01(sp(t, 10.06, 1.5, 0.8)), qs = mix(0.06, 1.9, q), qy = mix(950, 560, q);
  const f1 = k(t, 10.56, 0.34, INOUT), f2 = k(t, 11.12, 0.38, INOUT);
  const ang = 180 * f1 + 180 * f2;
  const sc = f2 > 0 ? mix(qs, deckScale(t), f2) : qs;
  const cyy = mix(qy, DECK_Y, f2);
  const sheet = t > 10.06;
  return (
    <>
      {/* profile */}
      <div style={{ position: "absolute", inset: 0, opacity: grp, transform: `translateY(${-40 * bk}px) scale(${1 - 0.1 * bk})`, transformOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 740, top: 132 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Rise text="Lucía Moreno" t={t} at={9.0} gap={0.1} size={96} style={{ display: "inline-block" }} />
            <div style={{ transform: `scale(${sp(t, 9.4, 1.8, 0.6)})` }}><Badge kind="founding" s={54} /></div>
          </div>
          <div style={{ marginTop: 8 }}><Rise text="Photographer, Model +1 · Málaga" t={t} at={9.25} gap={0.05} size={38} weight={600} color={C.muted} spacing="-0.01em" /></div>
        </div>
        {TILES.map((tl, i) => { const s = sp(t, tl.at, 1.7, 0.72);
          return <div key={tl.src} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${tl.x}px, ${400 + (1 - s) * 110}px) scale(${0.84 + 0.16 * s})`, opacity: c01(s * 2.2) }}>
            <Seq from={tl.at}><Media src={tl.src} w={520} h={390} r={26} zoom={1.03} /></Seq>
          </div>; })}
      {/* the dot becomes the avatar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transform: `translate(${cx}px, ${cy}px)` }}>
        <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: R, background: C.coral, boxShadow: g > 0.05 ? GLOW : undefined }} />
        {pulse > 0 && pulse < 1 && <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: R, border: `3px solid rgba(226,90,61,${0.8 * (1 - pulse)})`, transform: `scale(${1 + pulse * 0.9})` }} />}
        <div style={{ position: "absolute", left: -(R - 8), top: -(R - 8), width: 2 * (R - 8), height: 2 * (R - 8), borderRadius: R, overflow: "hidden", opacity: img }}>
          <Media src="img/avatars/lucia.jpg" w={2 * (R - 8)} h={2 * (R - 8)} r={R} shadow="none" />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#161413", opacity: 0.85 * bk }} />
      </div>
      {/* "+" */}
      {plus > 0.01 && <div style={{ position: "absolute", left: 960 - 44, top: 950 - 44, width: 88, height: 88, borderRadius: 44, background: C.coral, boxShadow: GLOW, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${plus})` }}><Ico n="plus" s={44} w={2.6} /></div>}
      {/* the sheet */}
      {sheet && <div style={{ position: "absolute", left: 738, top: 0, width: 444, height: 0, transform: `translateY(${cyy}px) perspective(2400px) rotateY(${ang}deg) scale(${sc})`, transformOrigin: "50% 0", transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: "translateY(-50%)", backfaceVisibility: "hidden", visibility: t < 10.8 ? "visible" : "hidden" }}>
          <PanelA t={t} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.coral, opacity: 1 - k(t, 10.06, 0.22) }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: "translateY(-50%) rotateY(180deg)", backfaceVisibility: "hidden", visibility: t > 10.7 && t < 11.3 ? "visible" : "hidden" }}><PanelB t={t} /></div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: "translateY(-50%) rotateY(360deg)", backfaceVisibility: "hidden", visibility: t > 11.2 ? "visible" : "hidden" }}><GigFace i={0} /></div>
      </div>}
    </>
  );
};
export const S4: Scene = { id: "S4", t0: 8.6, t1: 11.6, C: ({ t }) => <div style={{ position: "absolute", inset: 0 }}><Body t={t} /></div> };
