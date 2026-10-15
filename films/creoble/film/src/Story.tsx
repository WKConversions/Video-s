// Creoble v2 — "Just your website, made simple." An Apple-style product film on cream: a different picture idea for every
// phrase, 3D UI planes that turn slowly, objects that become the next thing, big statements that rise and sharpen.
// The stage: the cream ground with two light-blue blooms drifting, then six scenes on the voice-over's words
// (plan/v2-storyboard.md). The shared kit is ./shared; each scene draws only inside its own window.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C } from "./lib";
import { SceneA } from "./scenes/A";
import { SceneB } from "./scenes/B";
import { SceneC } from "./scenes/C";
import { SceneD } from "./scenes/D";
import { SceneE } from "./scenes/E";
import { SceneF } from "./scenes/F";

// The ground: cream, two soft light-blue blooms drifting at the edges, and a whisper of grain so the blooms don't band.
export const Ground: React.FC<{ g: number }> = ({ g }) => {
  const b = (cx: number, cy: number, r: number, a: number, px: number, py: number, sx: number, sy: number) => (
    <div style={{ position: "absolute", left: cx + Math.sin(g / px) * sx - r, top: cy + Math.cos(g / py) * sy - r, width: 2 * r, height: 2 * r, borderRadius: "50%",
      background: `radial-gradient(circle, rgba(74,163,245,${a}) 0%, rgba(74,163,245,${a * 0.45}) 35%, rgba(74,163,245,0) 70%)` }} />
  );
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: "hidden" }}>
      {b(260, 180, 620, 0.10, 170, 210, 90, 60)}
      {b(1700, 930, 700, 0.09, 190, 150, 80, 70)}
      <Img src={staticFile("img/grain.png")} style={{ position: "absolute", inset: 0, width: 1920, height: 1080, opacity: 0.035, mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Ground g={g} />
      <SceneA g={g} />
      <SceneB g={g} />
      <SceneC g={g} />
      <SceneD g={g} />
      <SceneE g={g} />
      <SceneF g={g} />
    </AbsoluteFill>
  );
};
