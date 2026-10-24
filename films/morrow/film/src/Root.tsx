import React from "react";
import { Composition } from "remotion";
import { Loop } from "./Loop";

// Morrow House: a 12 s seamless loop (three evenings from the calendar, 4 s each), from the client's site.
export const Root: React.FC = () => (
  <Composition id="Loop" component={Loop} durationInFrames={720} fps={60} width={1920} height={1080} />
);
