import React from "react";
import { Composition } from "remotion";
import { PhoneOnWood } from "./PhoneOnWood";
import { Demo } from "./demo/Demo";
import { Test } from "./demo/test";

// The realism lab: tests of real-time 3D (three.js) and 2.5D photo motion inside Remotion, no API, no cost;
// and the realism demo (src/demo, plan in ../plan/demo.md).
export const Root: React.FC = () => (
  <>
    <Composition id="PhoneOnWood" component={PhoneOnWood} durationInFrames={240} fps={60} width={1920} height={1080} />
    <Composition id="Demo" component={Demo} durationInFrames={543} fps={60} width={1920} height={1080} />
    <Composition id="Test" component={Test} durationInFrames={900} fps={60} width={1920} height={1080}
      defaultProps={{ name: "" }} />
  </>
);
