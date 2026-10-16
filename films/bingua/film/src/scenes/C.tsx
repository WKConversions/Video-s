// Scene C (12.45–21.6 s): See a word you want to remember? Save it instantly. / Bingua turns your discoveries into smart flashcards and quizzes, helping new vocabulary stick. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(12.45) || g > f(21.6)) return null;
  return <AbsoluteFill />;
};
