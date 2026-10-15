// Scene D (18.8–25.45 s): preview for free; happy, it's yours, 499 kroner. See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(18.8) || g > f(25.45)) return null;
  return <AbsoluteFill />;
};
