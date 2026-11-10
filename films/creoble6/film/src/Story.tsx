// Creoble v6 (Danish), Willads' feedback round: the same script and voice-over (paced to 65.2 s), a new film after his
// reference: a 3D camera moving through the scene, the product big, kinetic type beats between product beats, the new
// logo's dots as the recurring element (plan/contract.md). Three builders own A (0 – h1), B (h1 – h2), C (h2 – end).
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { FilterDefs, f } from "./shared";
import { C } from "./lib";
import { OUT_FPS } from "./clock";
import { SceneA } from "./scenes/A";
import { SceneB } from "./scenes/B";
import { SceneC } from "./scenes/C";

export const Story: React.FC = () => {
  const g = useCurrentFrame() / (OUT_FPS / 30);   // the 30-unit clock, fractional at 60 fps
  const S = g < f("h1") ? SceneA : g < f("h2") ? SceneB : SceneC;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <FilterDefs />
      <S g={g} />
      {/* a static dither (±1–2 shade levels, never moves): breaks the 8-bit banding of the soft shadows on cream */}
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("img/dither.png")})`, backgroundRepeat: "repeat", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
