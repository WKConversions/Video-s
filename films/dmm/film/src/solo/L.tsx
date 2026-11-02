// Solo entry for the lead's scenes (S10-S12).
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { DUR, FPS } from "../kit";
import { Spine } from "../spine";
import { S10 } from "../scenes/S10";
import { S11 } from "../scenes/S11";
import { S12 } from "../scenes/S12";

const SCENES = [S10, S11, S12];
const Solo: React.FC = () => <Spine t={useCurrentFrame() / FPS} scenes={SCENES} />;
registerRoot(() => <Composition id="Solo" component={Solo} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />);
