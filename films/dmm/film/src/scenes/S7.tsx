// Scene S7 (15.05–17.25, B3): "learn from industry professionals,"
// The event card from S6 shows thin seams and splits into three panels, the talk still running across them like a
// triptych; the panels flip one after another (the banners' flip family) to the speakers' own portraits cut from
// their banners, morph into portrait cards, and the names rise. One wave of the logo draws under all three names and
// runs off in its dot. Hand-off at 17.25 (H.trio): exactly the three cards, at rest, nothing else.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, SANS, SHADOW_L, W, H, c01, k, mix, sp, IN, INOUT, OUT, SOFT, sinePoints, Pt } from "../kit";
import { H as HO } from "../handoff";
import { Scene } from "./types";
import { EV, PHOTO, Poly, arcLen, dipOf, evScale, evZoom, flip, pointAt } from "./b3-kit";

const SPK = [
  { src: "speaker-tatiana.jpg", iw: 457, ih: 663, name: "Tatiana Benito" },
  { src: "speaker-yago.jpg", iw: 435, ih: 631, name: "Yago González" },
  { src: "speaker-charlie.jpg", iw: 465, ih: 675, name: "Charlie Titherley" },
];
const TR = HO.trio;
const BW = 480, BH = 780;                  // each panel's layout box (larger than any panel: 453 x 745 at most)
const THIRD = EV.w / 3;
const NAME_Y = 880, UL_Y = 930, NAME_SIZE = 42;
// one wave under the three names (the connection line), then a short straight run to the right end of the row
const WAVE = sinePoints(120, 336, UL_Y, 1604, UL_Y, 3, 9, 0, true);
const ROW_END = TR.xs[2] + TR.w / 2;
const RUN: Pt[] = WAVE.concat([1, 2, 3, 4, 5, 6].map((j): Pt => [mix(1604, ROW_END, j / 6), UL_Y]));
const FW = arcLen(WAVE) / arcLen(RUN);
const drawOf = (t: number) => k(t, 16.45, 0.5, SOFT) * FW + k(t, 17.0, 0.16, INOUT) * (1 - FW);
/** when the drawing head passes under each name (the card above it lifts as the wave links it) */
const PASS = TR.xs.map((x) => { let a = 16.45, b = 16.95; for (let n = 0; n < 30; n++) { const m = (a + b) / 2; if (pointAt(RUN, drawOf(m))[0] < x) a = m; else b = m; } return (a + b) / 2; });

/** a name under its card: words rise on a spring, then drop away (exit accelerating) */
const Name: React.FC<{ t: number; text: string; x: number; at: number; out: number }> = ({ t, text, x, at, out }) => (
  <div style={{ position: "absolute", left: x - 300, top: NAME_Y - NAME_SIZE * 0.8, width: 600, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: NAME_SIZE,
    lineHeight: `${NAME_SIZE * 1.6}px`, color: C.char, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
    {text.split(" ").map((wd, j) => {
      const e = sp(t, at + 0.06 * j, 1.7, 0.75), o = k(t, out + 0.02 * j, 0.16, IN);
      return <span key={j} style={{ display: "inline-block", margin: `0 ${NAME_SIZE * 0.12}px`, opacity: c01(e * 1.6) * (1 - o),
        transform: `translateY(${((1 - e) * 0.42 * NAME_SIZE + o * 0.55 * NAME_SIZE).toFixed(2)}px)`,
        filter: e < 0.97 || o > 0.01 ? `blur(${((1 - c01(e)) * 9 + o * 8).toFixed(2)}px)` : undefined }}>{wd}</span>;
    })}
  </div>
);

const S7C: React.FC<{ t: number }> = ({ t }) => {
  const done = t >= 17.2;                                   // from here every card is exactly the hand-off state
  const s = evScale(t), zoom = evZoom(t);                   // the card as S6 left it (its growth spring is still settling)
  // 15.05 thin seams; 15.10 the card divides into three 440 x 744 panels, the gaps opening to 40 px
  const seam = k(t, 15.05, 0.1, OUT), split = done ? 1 : sp(t, 15.1, 1.6, 0.78);
  const gap = 3 * seam + 37 * split, pw0 = THIRD - (THIRD - 440) * split, sep = pw0 + gap;
  // 15.95 the panels morph into the 430 x 620 portrait cards at y 520: height first, width after, radius mid-move
  const hP = done ? 1 : sp(t, 15.95, 1.5, 0.8), wP = done ? 1 : sp(t, 16.05, 1.5, 0.8);
  const ph = mix(EV.h * s, TR.h, hP), pw = mix(pw0 * s, TR.w, wP), pcy = mix(EV.cy, TR.y, hP);
  const rIn = 20 * c01(split), rAll = k(t, 16.02, 0.26, INOUT);
  const zS = done ? 1 : 1.05 - 0.05 * k(t, 15.45, 1.75, SOFT);   // the portraits settle inside their cards until the hand-off
  // 16.45 the wave draws under the names, its dot leading; 17.00 the dot runs on to the row's end and the line follows it in
  const drawP = drawOf(t);
  const tail = k(t, 17.0, 0.19, IN), dotS = (t < 16.45 ? 0 : sp(t, 16.45, 3, 0.6)) * (1 - k(t, 17.13, 0.08, IN));

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
      {SPK.map((p, i) => {
        const f = done ? 1 : flip(t, 15.38 + 0.1 * i), ang = 180 * f, back = ang >= 90, loc = back ? ang - 180 : ang;
        const cx = done ? TR.xs[i] : EV.cx + (i - 1) * sep * s;
        // outer corners keep the card's 28; the cut corners round as the panels part; a turned panel shows its back mirrored
        let rl = i === 0 ? EV.r : rIn, rr = i === 2 ? EV.r : rIn;
        if (back) { const x = rl; rl = rr; rr = x; }
        rl = mix(rl, TR.r, rAll); rr = mix(rr, TR.r, rAll);
        const dip = 1 - 0.04 * dipOf(f), shade = 0.3 * Math.abs(Math.sin((loc * Math.PI) / 180));
        const lift = 12 * Math.sin(Math.PI * c01((t - PASS[i] + 0.16) / 0.4)) ** 2;   // a 0.4 s bob, done by ~17.0
        const bx = cx - BW / 2, by = pcy - lift - BH / 2, ix = (BW - pw) / 2, iy = (BH - ph) / 2;
        const radii = `${rl.toFixed(2)}px ${rr.toFixed(2)}px ${rr.toFixed(2)}px ${rl.toFixed(2)}px`;
        // front: the talk's slice, carried by its panel; back: the portrait covering the panel
        const d = (i - 1) * (sep - THIRD);
        const X0 = EV.cx + (d - EV.w / 2) * s - bx, Y0 = EV.cy + (PHOTO.top - EV.h / 2) * s - by;
        const cover = Math.max(pw / p.iw, ph / p.ih) * zS;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH,
            transform: `translate(${bx.toFixed(3)}px, ${by.toFixed(3)}px) perspective(2000px) rotateY(${loc.toFixed(3)}deg) scale(${dip.toFixed(5)})` }}>
            <div style={{ position: "absolute", left: ix, top: iy, width: pw, height: ph, borderRadius: radii, boxShadow: SHADOW_L }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, background: C.charL,
              clipPath: `inset(${iy.toFixed(3)}px ${ix.toFixed(3)}px ${iy.toFixed(3)}px ${ix.toFixed(3)}px round ${radii})` }}>
              {back
                ? <Img src={staticFile(`img/${p.src}`)} style={{ position: "absolute", left: (BW - p.iw) / 2, top: (BH - p.ih) / 2, width: p.iw, height: p.ih, transform: `scale(${cover.toFixed(5)})` }} />
                : <Img src={staticFile(`img/${PHOTO.src}`)} style={{ position: "absolute", left: 0, top: 0, width: PHOTO.w, height: PHOTO.h, transformOrigin: "0 0",
                    transform: `translate(${X0.toFixed(3)}px, ${Y0.toFixed(3)}px) scale(${(s * zoom).toFixed(5)})` }} />}
              {shade > 0.002 && <div style={{ position: "absolute", inset: 0, background: `rgba(16,16,20,${shade.toFixed(3)})` }} />}
            </div>
          </div>
        );
      })}
      {t < 17.22 && SPK.map((p, i) => <Name key={`n${i}`} t={t} text={p.name} x={TR.xs[i]} at={16.1 + 0.08 * i} out={16.96 + 0.03 * i} />)}
      {t >= 16.45 && t < 17.22 && <Poly pts={RUN} c1={C.cyanD} c2={C.cyan} width={9} p={drawP} from={tail} dot={dotS} dotR={8} />}
    </div>
  );
};

export const S7: Scene = { id: "S7", t0: 15.05, t1: 17.25, C: S7C };
