// Creoble v4 (Danish) — a new film for creoble.dk's hero and LinkedIn, in Creoble's own brand: an editorial, Apple-
// minimal SaaS explainer that follows one client's website (Holm Fysioterapi) from the first words to live on its own
// domain. Five builders, four hand-offs (plan/storyboard.md); the kit is ./shared.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { breath, k } from "./shared";
import { C, INOUT } from "./lib";
import { Scene1 } from "./scenes/S1";
import { Scene2 } from "./scenes/S2";
import { Scene3 } from "./scenes/S3";
import { Scene4 } from "./scenes/S4";
import { Scene5 } from "./scenes/S5";

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const b = breath(g), rest = 1 - k(g, "w:byg2", 1.6, INOUT);   // the breath settles for the sign-off
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${b.x * rest}px, ${b.y * rest}px) scale(${1 + (b.s - 1) * rest})` }}>
        <Scene1 g={g} /><Scene2 g={g} /><Scene3 g={g} /><Scene4 g={g} /><Scene5 g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
