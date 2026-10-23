// Creoble v5 (Danish): the minimal Apple film. Same script and voice-over as v4; one small sage capsule (the thread)
// morphs into everything, one thing on screen at a time (plan/storyboard.md). Five builders; the kit is ./v5 + ./shared.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FilterDefs, f } from "./shared";
import { C } from "./lib";
import { OUT_FPS } from "./clock";
import { Scene1 } from "./scenes/S1";
import { Scene2 } from "./scenes/S2";
import { Scene3 } from "./scenes/S3";
import { Scene4 } from "./scenes/S4";
import { Scene5 } from "./scenes/S5";

// each scene draws only inside its own span; the hand-offs at h1..h4 are drawn identically on both sides (./v5 Handoff)
export const Story: React.FC = () => {
  const g = useCurrentFrame() / (OUT_FPS / 30);   // the 30-unit clock, fractional at 60 fps
  const S = g < f("h1") ? Scene1 : g < f("h2") ? Scene2 : g < f("h3") ? Scene3 : g < f("h4") ? Scene4 : Scene5;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <FilterDefs />
      <S g={g} />
    </AbsoluteFill>
  );
};
