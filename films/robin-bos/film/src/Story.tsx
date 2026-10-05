// Placeholder stage for the toolchain smoke test; replaced by the storyboard's stage.
import React from "react";
import { C } from "./lib";
import { T } from "./clock";
import { Line, centred } from "./kinetic";

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const words = [{ t: "A", at: "w:a" }, { t: "business", at: "w:business" }, { t: "is", at: "w:is" }, { t: "only", at: "w:only" }, { t: "as", at: "w:as" }, { t: "strong", at: "w:strong", accent: true }];
  const size = 96;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `linear-gradient(180deg, ${C.canvas} 0%, ${C.haze} 100%)` }} />
      <Line g={g} words={words} x={centred(words, size, 960, 700)} y={460} size={size} weight={700} ls={-0.06} />
      <div data-probe="square" style={{ position: "absolute", left: 940 + T.k(g, "w:strong", 0.5) * 300, top: 600, width: 40, height: 40, background: C.accent }} />
    </>
  );
};
