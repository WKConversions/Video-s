import React from "react";
import { Composition } from "remotion";
import { TestMap, TestUI } from "./Test";
import { FPS } from "./kit";
export const Root: React.FC = () => (<>
  <Composition id="TestMap" component={TestMap} durationInFrames={120} fps={FPS} width={1920} height={1080} />
  <Composition id="TestUI" component={TestUI} durationInFrames={60} fps={FPS} width={1920} height={1080} />
</>);
