import React from "react";
import { Composition } from "remotion";
import { FILM_DURATION, Film, FilmProps } from "./Film";

export const RemotionRoot: React.FC = () => (
  <Composition id="Film" component={Film as React.FC<FilmProps>} durationInFrames={FILM_DURATION} fps={30} width={1920} height={1080}
    defaultProps={{ blurSamples: 1, audio: "mix" }} />
);
