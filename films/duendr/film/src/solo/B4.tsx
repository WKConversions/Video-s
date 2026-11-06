// Solo entry for one builder: renders only these scenes on the spine (copy to src/solo/<ID>.tsx, list your scenes).
// Render and measure: bash check.sh <ID> <t0> <t1>
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { DUR, FPS } from "../kit";
import { Spine } from "../spine";
import { S9 } from "../scenes/S9";
import { S10 } from "../scenes/S10";
import { S11 } from "../scenes/S11";

const SCENES = [S9, S10, S11];
const Solo: React.FC = () => <Spine t={useCurrentFrame() / FPS} scenes={SCENES} />;
registerRoot(() => <Composition id="Solo" component={Solo} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />);
