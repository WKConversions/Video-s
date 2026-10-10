import React from "react";
import { Composition } from "remotion";
import { Film, FilmProps } from "./Film";
import { DURATION, FPS } from "./clock";

export const RemotionRoot: React.FC = () => (
  <Composition id="Film" component={Film as React.FC<FilmProps>} durationInFrames={DURATION} fps={FPS} width={1920} height={1080}
    defaultProps={{ blurSamples: 1, audio: "mix" }} />
);
