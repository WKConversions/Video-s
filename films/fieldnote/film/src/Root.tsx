import React from "react";
import { Composition } from "remotion";
import { Loop } from "./Loop";

// Fieldnote: a 12 s seamless loop product explainer (Capture on site → Make it actionable → Close the loop), from the client's site.
export const Root: React.FC = () => (
  <Composition id="Loop" component={Loop} durationInFrames={720} fps={60} width={1920} height={1080} />
);
