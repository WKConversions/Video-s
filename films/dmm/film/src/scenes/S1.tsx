// S1 (0.00–3.40) "Great marketing starts with great connections": their wave mark draws itself on the topographic
// charcoal, then stretches into the line between two people: card A (the woman in the Málaga street, their hero) blooms
// out of its cap, card B (Diego, organizing team) out of its dot. 'Great connections' rises in the top slot; a glint runs
// the line, the cards tilt toward each other and a ring pings from the dot. Shared stage: b1-core.tsx (S1 draws it < 3.32).
import React from "react";
import { C } from "../kit";
import { Cam, Slot, Stage, topoS1 } from "./b1-core";
import { Scene } from "./types";

const View: React.FC<{ t: number }> = ({ t }) => (
  <>
    {t < 3.32 && <Stage t={t} id="b1s1" />}
    <Cam t={t}>
      <Slot t={t} top={150} size={112} words={[{ s: "Great", at: 1.7 }, { s: "connections", at: 2.14, c: C.cyan }]} outAt={2.95} outDur={0.3} outDy={-30} layer />
    </Cam>
  </>
);

export const S1: Scene = { id: "S1", t0: 0, t1: 3.4, C: View, topo: topoS1 };
