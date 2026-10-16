// Scene A (0–3.4 s): Looking for qualified talent? Meet Talent Hub. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(0) || g > f(3.4)) return null;
  return <AbsoluteFill />;
};
