// Scene D (22.6–30.8 s): For graduates… For employers and recruiters… See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(22.6) || g > f(30.8)) return null;
  return <AbsoluteFill />;
};
