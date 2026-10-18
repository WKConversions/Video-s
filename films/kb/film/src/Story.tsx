// K.B. Network Intelligence — a clean, Apple-style SaaS explainer of the pipeline in brand/pipeline.pdf: everyday
// information is captured, summarised by Claude, approved, stored in the knowledge core, analysed with outside data
// into opportunities, developed by specialist agents, reviewed by management at four gates, sent as personalised
// outreach and tracked — and every outcome feeds back. Eight scenes on the voice-over's words (plan/storyboard.md);
// the kit is ./shared.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Ground } from "./shared";
import { SceneA } from "./scenes/A";
import { SceneB } from "./scenes/B";
import { SceneC } from "./scenes/C";
import { SceneD } from "./scenes/D";
import { SceneE } from "./scenes/E";
import { SceneF } from "./scenes/F";
import { SceneG } from "./scenes/G";
import { SceneH } from "./scenes/H";

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Ground g={g} />
      <SceneA g={g} />
      <SceneB g={g} />
      <SceneC g={g} />
      <SceneD g={g} />
      <SceneE g={g} />
      <SceneF g={g} />
      <SceneG g={g} />
      <SceneH g={g} />
    </AbsoluteFill>
  );
};
