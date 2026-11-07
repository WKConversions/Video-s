// full-size stills of the framings (privacy check)
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Spine } from "../spine";
import { S8 } from "../scenes/S8";
import { S9 } from "../scenes/S9";
import { S10 } from "../scenes/S10";
import { S11 } from "../scenes/S11";
const TS = [32.3, 33.9, 34.6, 36.2, 36.9, 37.45, 38.1, 38.55, 39.05, 39.9, 40.5, 41.3, 41.9, 42.4, 42.95, 43.9, 44.3, 45.5, 46.8, 49.7];
const Shot: React.FC = () => <Spine t={TS[useCurrentFrame()]} scenes={[S8, S9, S10, S11]} />;
registerRoot(() => <Composition id="Shots" component={Shot} durationInFrames={TS.length} fps={60} width={1920} height={1080} />);
