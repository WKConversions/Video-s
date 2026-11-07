// S4 "Showcase your work and share your availability." 8.6-11.9. From H.dot: the dot becomes Lucía's avatar ring, her profile and work
// tiles assemble; then ONE move: her Available post rises into the centre while the profile dims and recedes. Fri, Sat, Sun light up
// on "availability", a slow push-in holds it, and the post sinks away (11.45-11.85) as S5's gig fan rises.
import React from "react";
import { Media, Rise, C, INOUT, OUT, SOFT, c01, k, mix, sp, GLOW } from "../kit";
import { Badge } from "../ui";
import { H } from "../handoff";
import { Scene } from "./types";
import { PanelB, Seq } from "./b2-shared";

const TILES = [{ src: "clips/model-shoot.mp4", at: 8.98, x: 150 }, { src: "clips/portrait-hair.mp4", at: 9.3, x: 700 }, { src: "clips/photog-lens.mp4", at: 9.58, x: 1250 }];
const AV = { x: 600, y: 215, R: 100 };

const Body: React.FC<{ t: number }> = ({ t }) => {
  if (t < H.dot.t) return null;                   // S3 owns the frame until 8.75
  const g = k(t, H.dot.t, 0.5), R = mix(H.dot.r, AV.R, g), p = k(t, 8.9, 0.6, INOUT);
  const cx = mix(960, AV.x, p), cy = mix(540, AV.y, p), img = k(t, 8.86, 0.25);
  const pulse = c01((t - 9.45) / 0.8);
  const bk = k(t, 9.95, 0.45, INOUT), grp = 1 - k(t, 11.5, 0.35);   // the profile dims and recedes behind the post, fades as the post sinks
  // the post: one rise 9.95-10.4, slow push-in to 11.45, sink 11.45-11.85
  const rise = k(t, 9.95, 0.45, OUT), push = k(t, 10.4, 1.1, SOFT), sink = k(t, 11.45, 0.4, INOUT);
  const sc = mix(1.7, 2.2, rise) + 0.12 * push - 0.35 * sink;
  const y = 560 + (1 - rise) * 430 + 300 * sink;
  const op = c01(rise * 2.5) * (1 - c01((sink - 0.55) / 0.45));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: grp, transform: `scale(${1 - 0.07 * bk})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 740, top: 132 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Rise text="Lucía Moreno" t={t} at={9.0} gap={0.1} size={96} style={{ display: "inline-block" }} />
            <div style={{ transform: `scale(${sp(t, 9.4, 1.8, 0.6)})` }}><Badge kind="founding" s={54} /></div>
          </div>
          <div style={{ marginTop: 8 }}><Rise text="Photographer, Model +1 · Málaga" t={t} at={9.25} gap={0.05} size={38} weight={600} color={C.muted} spacing="-0.01em" /></div>
        </div>
        {TILES.map((tl) => { const s = sp(t, tl.at, 1.7, 0.72);
          return <div key={tl.src} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${tl.x}px, ${400 + (1 - s) * 110}px) scale(${0.84 + 0.16 * s})`, opacity: c01(s * 2.2) }}>
            <Seq from={tl.at}><Media src={tl.src} w={520} h={390} r={26} zoom={1.03} /></Seq>
          </div>; })}
        <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transform: `translate(${cx}px, ${cy}px)` }}>
          <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: R, background: C.coral, boxShadow: g > 0.05 ? GLOW : undefined }} />
          {pulse > 0 && pulse < 1 && <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: R, border: `3px solid rgba(226,90,61,${0.8 * (1 - pulse)})`, transform: `scale(${1 + pulse * 0.9})` }} />}
          <div style={{ position: "absolute", left: -(R - 8), top: -(R - 8), width: 2 * (R - 8), height: 2 * (R - 8), borderRadius: R, overflow: "hidden", opacity: img }}>
            <Media src="img/avatars/lucia.jpg" w={2 * (R - 8)} h={2 * (R - 8)} r={R} shadow="none" />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "#161413", opacity: 0.8 * bk }} />
      </div>
      {t > 9.94 && op > 0 && <div style={{ position: "absolute", left: 738, top: 0, width: 444, height: 0, transform: `translateY(${y}px) scale(${sc})`, transformOrigin: "50% 0", opacity: op, willChange: "transform" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: "translateY(-50%)" }}><PanelB t={t} /></div>
      </div>}
    </>
  );
};
export const S4: Scene = { id: "S4", t0: 8.6, t1: 11.9, C: ({ t }) => <div style={{ position: "absolute", inset: 0 }}><Body t={t} /></div> };
