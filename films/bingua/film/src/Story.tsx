// Bingua — "Learn languages by scrolling." A bright SaaS explainer on the site's own iOS-light ground: it explains
// what Bingua does with UI and visual animation (real video cards, dual-language transcripts, a word pop-up, + Save,
// flashcards and quizzes), not a phone on screen all the time. The film scrolls between its five scenes like the
// app's feed (plan/storyboard.md). The shared kit is ./shared; each scene draws only inside its own window.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./lib";
import { SceneA } from "./scenes/A";
import { SceneB } from "./scenes/B";
import { SceneC } from "./scenes/C";
import { SceneD } from "./scenes/D";
import { SceneE } from "./scenes/E";

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <SceneA g={g} />
      <SceneB g={g} />
      <SceneC g={g} />
      <SceneD g={g} />
      <SceneE g={g} />
    </AbsoluteFill>
  );
};
