// Scene E (30.4–36.0 s): Talent Hub. Your next connection starts here. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(30.4) || g > f(36.0)) return null;
  return <AbsoluteFill />;
};
