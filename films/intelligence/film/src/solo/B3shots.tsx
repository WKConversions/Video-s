// full-size stills of the framings (privacy check)
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Spine } from "../spine";
import { S8 } from "../scenes/S8";
import { S9 } from "../scenes/S9";
import { S10 } from "../scenes/S10";
import { S11 } from "../scenes/S11";
const TS = [40.55, 42.9, 44.1, 46.9, 49.3, 51.7, 54.9, 56.9, 58.3, 60.9];
const Shot: React.FC = () => <Spine t={TS[useCurrentFrame()]} scenes={[S8, S9, S10, S11]} />;
registerRoot(() => <Composition id="Shots" component={Shot} durationInFrames={TS.length} fps={60} width={1920} height={1080} />);
