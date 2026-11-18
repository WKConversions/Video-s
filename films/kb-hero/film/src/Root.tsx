import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS } from "./kit";
import { DUR } from "./timeline";
export const Root: React.FC = () => <Composition id="Film" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />;
