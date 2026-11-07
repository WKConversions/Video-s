// Solo entry for builder B2 (S4-S7, 20.0-39.4)
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { DUR, FPS } from "../kit";
import { Spine } from "../spine";
import { S4 } from "../scenes/S4";
import { S5 } from "../scenes/S5";
import { S6 } from "../scenes/S6";
import { S7 } from "../scenes/S7";

const SCENES = [S4, S5, S6, S7];
const Solo: React.FC = () => <Spine t={useCurrentFrame() / FPS} scenes={SCENES} />;
registerRoot(() => <Composition id="Solo" component={Solo} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />);
