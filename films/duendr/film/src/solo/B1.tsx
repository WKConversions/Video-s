import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { DUR, FPS } from "../kit";
import { Spine } from "../spine";
import { S1 } from "../scenes/S1";
import { S2 } from "../scenes/S2";
import { S3 } from "../scenes/S3";

const SCENES = [S1, S2, S3];
const Solo: React.FC = () => <Spine t={useCurrentFrame() / FPS} scenes={SCENES} />;
registerRoot(() => <Composition id="Solo" component={Solo} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />);
