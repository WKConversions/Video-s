// Bingua, portrait (1080×1920): the same film as Story.tsx — same scenes, words, timings and sound — re-laid out for
// a vertical frame (plan/portrait.md). Each scene's portrait version lives in ./portrait/.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./lib";
import { SceneAP } from "./portrait/A";
import { SceneBP } from "./portrait/B";
import { SceneCP } from "./portrait/C";
import { SceneDP } from "./portrait/D";
import { SceneEP } from "./portrait/E";

export const StoryPortrait: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <SceneAP g={g} />
      <SceneBP g={g} />
      <SceneCP g={g} />
      <SceneDP g={g} />
      <SceneEP g={g} />
    </AbsoluteFill>
  );
};
