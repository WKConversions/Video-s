// Scene E (25.2–30.2 s): hosting covered; no coding, no complexity. See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(25.2) || g > f(30.2)) return null;
  return <AbsoluteFill />;
};
