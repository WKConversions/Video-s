// Moviqly film 2 — "Behind this prompt". The film follows one film (for the fictional brand Fjello) through the AI
// studio that sits behind Moviqly's prompt box: the brief, the scan, the earlier films, the form, the idea, the art
// direction, the storyboard, the fact check, the review, then the studio itself (play, refine, portrait, export) and
// back out to the prompt. Fourteen beats on the voice-over's words (plan/storyboard.md); the kit is ./shared.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Ground, breath, k } from "./shared";
import { SceneA } from "./scenes/A";
import { SceneB } from "./scenes/B";
import { SceneC } from "./scenes/C";
import { SceneD } from "./scenes/D";
import { SceneE } from "./scenes/E";
import { SceneF } from "./scenes/F";
import { SceneG } from "./scenes/G";
import { SceneH } from "./scenes/H";
import { SceneI } from "./scenes/I";
import { SceneJ } from "./scenes/J";
import { SceneK } from "./scenes/K";
import { SceneL } from "./scenes/L";
import { SceneM } from "./scenes/M";
import { SceneN } from "./scenes/N";
import { CRAFT } from "./lib";

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  // the studio floor's dot grid appears as we go behind the prompt, and leaves as we come back out to it
  const dots = k(g, "w:prompt", 2.2, CRAFT) * (1 - k(g, "w:make2-0.2", 0.8, CRAFT));
  // the camera's one slow breath, settling to rest for the sign-off
  const b = breath(g), rest = 1 - k(g, "sN", 1.6, CRAFT);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Ground g={g} dots={dots} />
      <AbsoluteFill style={{ transform: `translate(${b.x * rest}px, ${b.y * rest}px) scale(${1 + (b.s - 1) * rest})` }}>
        <SceneA g={g} /><SceneB g={g} /><SceneC g={g} /><SceneD g={g} /><SceneE g={g} /><SceneF g={g} /><SceneG g={g} />
        <SceneH g={g} /><SceneI g={g} /><SceneJ g={g} /><SceneK g={g} /><SceneL g={g} /><SceneM g={g} /><SceneN g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
