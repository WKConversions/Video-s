// S4 (8.30–10.95) "a global community of digital marketers,": their hero, rebuilt and alive. The logo's wave (H.mark)
// stretches across the frame; three cyan rings ripple out of its dot over the contour map ('global'); the hero's four
// rounded photo cards rise onto its peaks and valleys at their different heights; a light pulse runs along the line and
// lifts each card in turn. The top slot quotes their hero line. Model and parts: b2-model.ts, b2-parts.tsx.
import React from "react";
import { w } from "../kit";
import { H } from "../handoff";
import { Scene } from "./types";
import { RING_C, RING_SPEED, RING_T, T_SPLIT } from "./b2-model";
import { Rings, Slot, Stage } from "./b2-parts";

const S4C: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Rings t={t} />
    {t >= H.mark.t && t < T_SPLIT && <Stage t={t} />}
    <Slot t={t} from={1} outDir={1} outAt={w("of") - 0.16}
      words={[{ s: "a", at: w("a") - 0.07 }, { s: "global", at: w("global") - 0.07 }, { s: "community", at: w("community") - 0.1, cyan: true }]} />
    <Slot t={t} from={-1} outDir={1} outAt={w("right") - 0.22}
      words={[{ s: "of", at: w("of") - 0.07 }, { s: "digital", at: w("digital2") - 0.07 }, { s: "marketers", at: w("marketers") - 0.07 }]} />
  </>
);

export const S4: Scene = {
  id: "S4", t0: 8.3, t1: 10.95, C: S4C,
  // the rings travel through the contour lines too (the spine merges these)
  topo: (t) => ({ ripples: RING_T.map((a) => ({ x: RING_C[0], y: RING_C[1], age: t - a, h: 0.32, w: 70, speed: RING_SPEED })) }),
};
