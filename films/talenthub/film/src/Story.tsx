// Talent Hub — "Your next connection starts here." A bright SaaS explainer that animates the platform still in
// development (a prototype): the candidate pool, the dashboard, filters, unlocking a profile with a credit, and
// connecting; for graduates and for employers. It shares the JongLeren films' visual family (warm ivory ground, soft
// red ripples, white cards, red pills, a red dot and line) as a bridge, without referring to them. Five scenes on the
// voice-over's words (plan/storyboard.md); the kit is ./shared.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./lib";
import { Ripples } from "./shared";
import { SceneA } from "./scenes/A";
import { SceneB } from "./scenes/B";
import { SceneC } from "./scenes/C";
import { SceneD } from "./scenes/D";
import { SceneE } from "./scenes/E";

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ivory, overflow: "hidden" }}>
      <Ripples g={g} x={1500} y={300} a={0.8} />
      <SceneA g={g} />
      <SceneB g={g} />
      <SceneC g={g} />
      <SceneD g={g} />
      <SceneE g={g} />
    </AbsoluteFill>
  );
};
