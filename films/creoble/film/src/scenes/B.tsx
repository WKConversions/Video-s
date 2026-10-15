// Scene B (4.1–12.4 s): tell us about your business, then AI. See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(4.1) || g > f(12.4)) return null;
  return <AbsoluteFill />;
};
