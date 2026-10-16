// Scene B (3.25–12.95 s): Learn languages through real videos and everyday conversations. / Follow along with translations… See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(3.25) || g > f(12.95)) return null;
  return <AbsoluteFill />;
};
