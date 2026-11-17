import React from "react";
import { Composition } from "remotion";
import { Film, FPS, DUR } from "./Film";
// COYOR RUN promo demo: vertical 1080x1920, 60 fps, 28 s. Real gameplay captured from the game on coyorclo.com.
export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
);
