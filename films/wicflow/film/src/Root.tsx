import React from "react";
import { Composition } from "remotion";
import { LookTest } from "./LookTest";
import { WorldTest } from "./WorldTest";
import { MarkTest } from "./MarkTest";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="LookTest" component={LookTest} durationInFrames={30} fps={30} width={1920} height={1080} />
    <Composition id="WorldTest" component={WorldTest as React.FC<{ s: number; th: number }>} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ s: 0.8, th: 42 }} />
    <Composition id="MarkTest" component={MarkTest} durationInFrames={30} fps={30} width={1920} height={1080} />
  </>
);
