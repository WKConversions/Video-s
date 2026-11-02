// S5 (10.45–13.25) "right here in Málaga.": global to local on their own topographic map. The contour lines draw in
// to rings around one summit; the four cards slide along the shortening wave and gather into a fanned stack there, the
// cathedral on top; the wave pulls back into its dot, and the dot arcs down onto the cathedral card like a map pin
// (H.pin at 12.45: S6 takes the dot from there). The stack keeps settling under S6's white circle until 13.25.
import React from "react";
import { INOUT, k, w } from "../kit";
import { H } from "../handoff";
import { Scene } from "./types";
import { T_LAND, T_SPLIT, summitAt } from "./b2-model";
import { Ping, Slot, Stage } from "./b2-parts";

const S5C: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Ping t={t} />
    {t >= T_SPLIT && <Stage t={t} dot={t < H.pin.t} />}
    {t < 12.6 && <Slot t={t} from={-1} outDir={-1} outAt={12.22}
      words={[{ s: "right", at: w("right") - 0.08 }, { s: "here", at: w("here") - 0.08 }, { s: "in", at: w("in") - 0.06 }, { s: "Málaga", at: w("malaga2") - 0.08, cyan: true }]} />}
  </>
);

export const S5: Scene = {
  id: "S5", t0: 10.45, t1: 13.25, C: S5C,
  topo: (t) => {
    const s = summitAt(t);
    return {
      bumps: s.h > 0.001 ? [{ x: 960, y: 600, h: s.h, r: s.r }] : [],
      // the pin's ping through the contours; gone under S6's opening circle, so the white page starts calm
      ripples: [{ x: H.pin.x, y: H.pin.y, age: t - T_LAND, h: 0.28 * (1 - k(t, 12.5, 0.6, INOUT)), w: 60, speed: 700 }],
    };
  },
};
