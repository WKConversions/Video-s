// Scene A (0–3.8 s): Turn scrolling into learning. / Meet Bingua. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(0) || g > f(3.8)) return null;
  return <AbsoluteFill />;
};
