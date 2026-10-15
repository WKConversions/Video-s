// Scene C (12.0–19.0 s): the site builds; change it by describing. See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(12.0) || g > f(19.0)) return null;
  return <AbsoluteFill />;
};
