import React from "react";
import { Composition } from "remotion";
import { PhoneOnWood } from "./PhoneOnWood";

// The realism lab: tests of real-time 3D (three.js) and 2.5D photo motion inside Remotion, no API, no cost.
export const Root: React.FC = () => (
  <Composition id="PhoneOnWood" component={PhoneOnWood} durationInFrames={240} fps={60} width={1920} height={1080} />
);
