// full-size stills of the framings (privacy check)
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Spine } from "../spine";
import { S8 } from "../scenes/S8";
import { S9 } from "../scenes/S9";
import { S10 } from "../scenes/S10";
import { S11 } from "../scenes/S11";
const TS = [37.45, 41.0, 41.3, 44.3, 39.3, 42.8, 38.9, 40.2];
const Shot: React.FC = () => <Spine t={TS[useCurrentFrame()]} scenes={[S8, S9, S10, S11]} />;
registerRoot(() => <Composition id="Shots" component={Shot} durationInFrames={TS.length} fps={60} width={1920} height={1080} />);
