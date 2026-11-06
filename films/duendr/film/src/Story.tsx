// The whole Duendr film: every scene on the spine, in order (later scenes draw on top during overlaps).
import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS } from "./kit";
import { Spine } from "./spine";
import { Scene } from "./scenes/types";
import { S1 } from "./scenes/S1";
import { S2 } from "./scenes/S2";
import { S3 } from "./scenes/S3";
import { S4 } from "./scenes/S4";
import { S5 } from "./scenes/S5";
import { S6 } from "./scenes/S6";
import { S7 } from "./scenes/S7";
import { S8 } from "./scenes/S8";
import { S9 } from "./scenes/S9";
import { S10 } from "./scenes/S10";
import { S11 } from "./scenes/S11";
import { S12 } from "./scenes/S12";

export const SCENES: Scene[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];
export const Story: React.FC = () => <Spine t={useCurrentFrame() / FPS} scenes={SCENES} />;
