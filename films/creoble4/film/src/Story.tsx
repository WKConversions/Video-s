// Creoble v4 (Danish) — a new film for creoble.dk's hero and LinkedIn, in Creoble's own brand. Version 3: Apple-style
// motion design with bounce, Liquid Glass, a morphing ink capsule, liquid merges and bento grids, at 60 fps. Five
// builders (plan/storyboard.md); the kit is ./shared.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { breath, k, FilterDefs } from "./shared";
import { C, INOUT } from "./lib";
import { OUT_FPS } from "./clock";
import { Scene1 } from "./scenes/S1";
import { Scene2 } from "./scenes/S2";
import { Scene3 } from "./scenes/S3";
import { Scene4 } from "./scenes/S4";
import { Scene5 } from "./scenes/S5";

export const Story: React.FC = () => {
  const g = useCurrentFrame() / (OUT_FPS / 30);   // the 30-unit animation clock, fractional at 60 fps
  const b = breath(g), rest = 1 - k(g, "w:byg2", 1.6, INOUT);
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <FilterDefs />
      <AbsoluteFill style={{ transform: `translate(${b.x * rest}px, ${b.y * rest}px) scale(${1 + (b.s - 1) * rest})` }}>
        <Scene1 g={g} /><Scene2 g={g} /><Scene3 g={g} /><Scene4 g={g} /><Scene5 g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
