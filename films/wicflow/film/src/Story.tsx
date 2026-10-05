// The one continuous stage: the paper and its colour fields (each grows out of a named object and recedes back into it),
// the world, the one full AI-blue field ("more customers"), the screen-facing cards, the captions, the end card.
import React from "react";
import { AbsoluteFill } from "remotion";
import { T } from "./clock";
import { C, clamp01, lerp } from "./lib";
import { EASE } from "./kinetic";
import { proj } from "./iso";
import { VIEW } from "./map";
import { World } from "./World";
import { OverlayAbove, OverlayBelow, badgeAt, BOOKED } from "./Overlay";
import { Captions } from "./Captions";
import { Finale } from "./Finale";
import { MOVE, k, roofXY } from "./scene";

const R_FULL = 2500;
/** A colour field as a soft-edged circle growing out of an object (a feathered radial mask, never a hard wipe). */
const Field: React.FC<{ x: number; y: number; r: number; bg: string; feather?: number }> = ({ x, y, r, bg, feather = 180 }) =>
  r <= 0 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: bg,
      WebkitMaskImage: `radial-gradient(circle at ${x}px ${y}px, #000 ${Math.max(0, r - feather)}px, transparent ${r}px)`,
      maskImage: `radial-gradient(circle at ${x}px ${y}px, #000 ${Math.max(0, r - feather)}px, transparent ${r}px)` }} />
  );

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const v = VIEW(g);
  // pale fields on the paper: blue out of the market (P9–P12), sage out of the loop's junction (P13–P14), sand out of the paper stack (P18)
  const [mx, my] = proj(v, -520, -545, 0);
  const [jx, jy] = proj(v, 190, 0, 0);
  const [sx, sy] = proj(v, -285, 285, 40);
  const wash = (a: string, b: string) => R_FULL * (k(g, a, 0.8, EASE.soft) - k(g, b, 0.65, MOVE));
  const w1 = wash("wash1", "wash1Out"), w2 = wash("wash2", "wash2Out"), w3 = R_FULL * k(g, "wash3", 0.8, EASE.soft) * (g / 30 > T.s("blue") + 0.7 ? 0 : 1);
  // the AI-blue field: out of the farthest booked company on "customers", back into the business's roof on "turn"
  const [fx, fy] = badgeAt(g, BOOKED - 1);
  const [rx, ry] = roofXY(g);
  const grow = k(g, "blue", 0.6, EASE.soft), shrink = k(g, "gather", 0.5, MOVE);
  const blueR = R_FULL * grow * (1 - shrink);
  const bx = lerp(fx, rx, shrink), by = lerp(fy, ry, shrink);
  // the captions turn white while the field covers them
  const capD = Math.hypot(bx - 500, by - 930);
  const onBlue = clamp01((blueR - 160 - capD) / 60);
  // the OG card's pale-blue circle grows out of the roof on "growth" and stays as the end card's field
  const og = k(g, "f3+0.2", 0.8, EASE.soft);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {w1 > 0 && <Field x={mx} y={my} r={w1} bg={C.tBlue[1]} />}
      {w2 > 0 && <Field x={jx} y={jy} r={w2} bg={C.tSage[1]} />}
      {w3 > 0 && <Field x={sx} y={sy} r={w3} bg={C.tSand[1]} />}
      {og > 0 && (() => {
        const m = k(g, "out", 0.65, MOVE);
        const cx = lerp(rx, 960, m), cy = lerp(ry + 20, 615, m), r = lerp(480, 462, m) * og;
        return <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "#E3E9F4" }} />;
      })()}
      <World g={g} />
      <OverlayBelow g={g} />
      {blueR > 0 && <Field x={bx} y={by} r={blueR} bg={C.blue} feather={160} />}
      <OverlayAbove g={g} />
      <Captions g={g} onBlue={onBlue} />
      <Finale g={g} />
    </AbsoluteFill>
  );
};
export { MOVE };
