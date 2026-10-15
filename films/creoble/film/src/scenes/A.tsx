// Scene A (0–4.85 s): the question and Meet Creoble. See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(0) || g > f(4.85)) return null;
  return <AbsoluteFill />;
};
