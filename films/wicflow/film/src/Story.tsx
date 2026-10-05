// The one continuous stage: the paper and its colour fields (each grows out of a named object and recedes back into it),
// the world, the one full AI-blue field ("more customers"), the screen-facing cards, the captions, the end card.
import React from "react";
import { AbsoluteFill } from "remotion";
import { T } from "./clock";
import { C, clamp01, lerp } from "./lib";
import { Iris } from "./kinetic";
import { proj } from "./iso";
import { VIEW } from "./map";
import { World } from "./World";
import { OverlayAbove, OverlayBelow, badgeAt, BOOKED } from "./Overlay";
import { Captions } from "./Captions";
import { Finale } from "./Finale";
import { ARRIVE, DEPART, MOVE, k, roofXY } from "./scene";

const R_FULL = 2500;

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const v = VIEW(g);
  // pale fields on the paper: blue out of the market (P9–P12), sage out of the loop's junction (P13–P14), sand out of the paper stack (P18)
  const [mx, my] = proj(v, -520, -545, 0);
  const [jx, jy] = proj(v, 190, 0, 0);
  const [sx, sy] = proj(v, -285, 285, 40);
  const wash = (a: string, b: string) => R_FULL * (k(g, a, 0.7, ARRIVE) - k(g, b, 0.55, DEPART));
  const w1 = wash("wash1", "wash1Out"), w2 = wash("wash2", "wash2Out"), w3 = R_FULL * k(g, "wash3", 0.7) * (g / 30 > T.s("blue") + 0.6 ? 0 : 1);
  // the AI-blue field: out of the farthest booked company on "customers", back into the business's roof on "turn"
  const [fx, fy] = badgeAt(g, BOOKED - 1);
  const [rx, ry] = roofXY(g);
  const grow = k(g, "blue", 0.55, ARRIVE), shrink = k(g, "gather", 0.45, DEPART);
  const blueR = R_FULL * grow * (1 - shrink);
  const bx = lerp(fx, rx, shrink), by = lerp(fy, ry, shrink);
  // the captions turn white while the field covers them
  const capD = Math.hypot(bx - 500, by - 930);
  const onBlue = clamp01((blueR - capD) / 60);
  // the OG card's pale-blue circle grows out of the roof on "growth" and stays as the end card's field
  const og = k(g, "f3", 0.8, ARRIVE);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {w1 > 0 && <Iris x={mx} y={my} r={w1} bg={C.tBlue[1]} />}
      {w2 > 0 && <Iris x={jx} y={jy} r={w2} bg={C.tSage[1]} />}
      {w3 > 0 && <Iris x={sx} y={sy} r={w3} bg={C.tSand[1]} />}
      {og > 0 && <div style={{ position: "absolute", left: rx - 640 * og, top: ry - 640 * og + 40, width: 1280 * og, height: 1280 * og, borderRadius: "50%", background: "#E3E9F4" }} />}
      <World g={g} />
      <OverlayBelow g={g} />
      {blueR > 0 && <Iris x={bx} y={by} r={blueR} bg={C.blue} />}
      <OverlayAbove g={g} />
      <Captions g={g} onBlue={onBlue} />
      <Finale g={g} />
    </AbsoluteFill>
  );
};
export { MOVE };
