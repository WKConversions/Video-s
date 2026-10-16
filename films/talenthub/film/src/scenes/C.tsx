// Scene C (12.0–22.95 s): Filter by skills, experience, and qualifications… Discover profiles, unlock contact details, connect directly. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(12.0) || g > f(22.95)) return null;
  return <AbsoluteFill />;
};
