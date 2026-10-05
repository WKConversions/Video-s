import React from "react";
import { Composition } from "remotion";
import { FILM_DURATION, Film, FilmProps } from "./Film";
import { EXPLAINER_DURATION, Explainer, ExplainerProps } from "./explainer/Explainer";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film as React.FC<FilmProps>} durationInFrames={FILM_DURATION} fps={30} width={1920} height={1080}
      defaultProps={{ blurSamples: 1, audio: "vo" }} />
    <Composition id="Explainer" component={Explainer as React.FC<ExplainerProps>} durationInFrames={EXPLAINER_DURATION} fps={30} width={1920} height={1080}
      defaultProps={{ blurSamples: 1 }} />
  </>
);
