import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";

// Version 3 renders at 60 fps for Apple-smooth motion. All animation runs on the 30-unit clock g = frame / 2
// (Story), so every move is sampled twice as often; durations and labels are unchanged.
export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={1200} fps={60} width={1920} height={1080}
    defaultProps={{ blurSamples: 1, audio: "none" }} />
);
