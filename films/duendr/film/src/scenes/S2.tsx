// S2 "Meet Duendr." (2.45-4.0): the coral field condenses into the icon's circle, the bar rises, the wordmark slides out, the lockup lifts to the header.
import React from "react";
import { Scene } from "./types";
import { Brand } from "./b1-lib";

export const S2: Scene = { id: "S2", t0: 2.45, t1: 4.0, C: ({ t }) => <Brand t={t} /> };
