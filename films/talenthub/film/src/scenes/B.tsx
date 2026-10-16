// Scene B (2.9–12.4 s): The platform connecting graduates with international career opportunities. Browse a database… all in one intuitive dashboard. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(2.9) || g > f(12.4)) return null;
  return <AbsoluteFill />;
};
