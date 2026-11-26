import React from "react";
import { Composition } from "remotion";
import { FPS, Layer } from "./kit";
import { Onboarding } from "./onb/Film";
import { Offboarding } from "./off/Film";
import { DUR as DUR_ON } from "./onb/timing";
import { DUR as DUR_OFF } from "./off/timing";

// props.layer: "all" (the film), "noLogo" (the film without the logo layer), "logoOnly" (only the logo, transparent)
export const Root: React.FC = () => (
  <>
    <Composition id="Onboarding" component={Onboarding} durationInFrames={Math.round(DUR_ON * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{ layer: "all" as Layer }} />
    <Composition id="Offboarding" component={Offboarding} durationInFrames={Math.round(DUR_OFF * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{ layer: "all" as Layer }} />
  </>
);
