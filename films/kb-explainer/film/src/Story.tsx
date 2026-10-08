// The stage (storyboard/plan.md): a pale K.B canvas with soft shapes, a small K.B tile in the corner (the brand
// mark the reference keeps there), and the acts, each mounted only while it is on screen. Every move is keyed to a
// label of src/clock.ts (the voice's words), never to a frame number.
import React from "react";
import { T } from "./clock";
import { ARRIVE, C, KBTile } from "./lib";
import { Act1, How } from "./a1";
import { Main } from "./a2";
import { Custom, Need, Tools } from "./a3";
import { End, Launch, Loop, Plan, Team } from "./a4";
import { Bits, Blobs, Box } from "./ui";

const k = (g: number, pos: string, dur: number) => T.k(g, pos, dur, ARRIVE);
const live = (g: number, a: string, b: string, pad = 20) => g >= T.f(a) - 1 && g < T.f(b) + pad;

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const bits = Math.max(1 - k(g, "grow+0.1", 0.6), k(g, "away", 0.5) * (1 - k(g, "audit", 0.5)), k(g, "need", 0.5) * (1 - k(g, "custom", 0.5)), k(g, "loop+0.3", 0.7));
  const corner = k(g, "grow+0.9", 0.45) * (1 - k(g, "talk-0.1", 0.35));
  return (
    <div style={{ position: "absolute", inset: 0, background: C.canvas, overflow: "hidden" }}>
      <Blobs g={g} />
      <Bits g={g} k={bits} />
      {g < T.f("audit") + 20 && <Act1 g={g} />}
      {live(g, "away", "audit") && <How g={g} />}
      {live(g, "audit", "need") && <Main g={g} />}
      {live(g, "need", "custom") && <Need g={g} />}
      {live(g, "custom", "tools") && <Custom g={g} />}
      {live(g, "tools", "team") && <Tools g={g} />}
      {live(g, "team", "launch") && <Team g={g} />}
      {live(g, "launch", "stay") && <Launch g={g} />}
      {live(g, "stay", "loop") && <Plan g={g} />}
      {live(g, "loop", "talk", 30) && <Loop g={g} />}
      {g >= T.f("talk") - 1 && <End g={g} />}
      {corner > 0 && <Box x={1822} y={98} w={74} h={74} s={0.8 + 0.2 * corner} o={corner}><KBTile size={74} /></Box>}
    </div>
  );
};
