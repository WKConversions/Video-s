// Scene B — stub (builders replace it; plan/storyboard.md).
import React from "react";
import { f } from "../shared";

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sB") || g >= f("sC")) return null;
  return null;
};
