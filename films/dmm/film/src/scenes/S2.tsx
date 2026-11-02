// S2 (2.90–6.60) "but finding your people isn't always easy": their contour lines crowd into a steep ridge between the two
// people and push them apart (dimmed, desaturated); the line snaps on the ridge, its dot searches along the ridge's contours,
// turns toward card B and is bent back, then loops into a knot that pulls tight on 'easy'. Ridge: topoS2 (spine) plus a
// cyan tint of the same lines (b1-core RidgeTint). Shared stage: b1-core.tsx (S2 draws it 3.32–5.80).
import React from "react";
import { C, INOUT, k } from "../kit";
import { Cam, Slot, Stage, topoS2 } from "./b1-core";
import { Scene } from "./types";

const View: React.FC<{ t: number }> = ({ t }) => (
  <>
    {t >= 3.32 && t < 5.8 && <Stage t={t} id="b1s2" />}
    <Cam t={t}>
      <Slot t={t} top={155} size={100} color="rgba(255,255,255,0.85)" words={[{ s: "finding", at: 3.5 }, { s: "your", at: 3.92 }, { s: "people", at: 4.12, c: C.cyan }]}
        out={k(t, 5.7, 0.35, INOUT)} outDy={24} />
    </Cam>
  </>
);

export const S2: Scene = { id: "S2", t0: 2.9, t1: 6.6, C: View, topo: topoS2 };
