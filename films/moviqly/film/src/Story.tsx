// Moviqly — "One sentence. One finished video." A SaaS explainer in the platform's own style: warm paper, the purple–
// blue–cyan glow, DM Sans, the app's real screens rebuilt (prompt box, studio, narrated activity, storyboard, preview,
// export). Hook, problem, solution, use case, showcase, outro, CTA: eight scenes on the voice-over's words
// (plan/storyboard.md); the kit is ./shared.
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
      <SceneA g={g} /><SceneB g={g} /><SceneC g={g} /><SceneD g={g} /><SceneE g={g} /><SceneF g={g} /><SceneG g={g} /><SceneH g={g} />
    </AbsoluteFill>
  );
};
