import React from "react";
import { Composition } from "remotion";
import { Loop } from "./Loop";

// Klyro: a 12 s seamless loop explainer (signals in → Klyro decides → next best action out), from the client's site.
export const Root: React.FC = () => (
  <Composition id="Loop" component={Loop} durationInFrames={720} fps={60} width={1920} height={1080} />
);
