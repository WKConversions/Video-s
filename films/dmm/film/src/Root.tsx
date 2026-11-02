import React from "react";
import { Composition } from "remotion";
import { Test } from "./Test";
import { FPS } from "./kit";
export const Root: React.FC = () => (<>
  <Composition id="Test" component={Test} durationInFrames={120} fps={FPS} width={1920} height={1080} />
</>);
