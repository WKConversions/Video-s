// Solo entry for one builder: renders only these scenes on the spine (copy to src/solo/<ID>.tsx, list your scenes).
// Render and measure: bash check.sh <ID> <t0> <t1>
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { DUR, FPS } from "../kit";
import { Spine } from "../spine";
import { S7 } from "../scenes/S7";
import { S8 } from "../scenes/S8";

const SCENES = [S7, S8];
const Solo: React.FC = () => <Spine t={useCurrentFrame() / FPS} scenes={SCENES} />;
registerRoot(() => <Composition id="Solo" component={Solo} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />);
