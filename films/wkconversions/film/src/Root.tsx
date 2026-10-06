import React from "react";
import { Composition } from "remotion";
import { Film, FILM_DURATION } from "./Film";
import { Proto } from "./Proto";

const P = Proto as unknown as React.FC<Record<string, number>>;
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={FILM_DURATION} fps={30} width={1920} height={1080} defaultProps={{ blurSamples: 1, audio: "vo" as const }} />
    <Composition id="Proto" component={P} durationInFrames={90} fps={30} width={1920} height={1080}
      defaultProps={{ orbit: 1, drift: 0, dark: 0, ppl: 170, pr: 7, screens: 0, pv: 1 }} />
  </>
);
