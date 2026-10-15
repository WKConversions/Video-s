// Scene F (29.9–35.6 s): just your website, made simple; Creoble. See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneF: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(29.9) || g > f(35.6)) return null;
  return <AbsoluteFill />;
};
