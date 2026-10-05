import React from "react";
import { Composition } from "remotion";
import { Film, FilmProps } from "./Film";
import { DURATION, FPS } from "./lib";

export const RemotionRoot: React.FC = () => (
  <Composition id="Film" component={Film as React.FC<FilmProps>} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ audio: true }} />
);
