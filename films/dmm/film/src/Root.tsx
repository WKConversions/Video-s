import React from "react";
import { Composition } from "remotion";
import { Story } from "./Story";
import { DUR, FPS } from "./kit";

// Digital Marketing Málaga: 36.4 s community film, 60 fps (plan/contract.md).
export const Root: React.FC = () => <Composition id="Film" component={Story} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />;
