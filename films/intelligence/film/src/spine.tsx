// The stage under every scene: the platform's page colour. Scenes draw the screens, lift-outs and cursor on top.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./kit";
import { Scene } from "./scenes/types";
export const Spine: React.FC<{ t: number; scenes: Scene[] }> = ({ t, scenes }) => (
  <AbsoluteFill style={{ background: C.page, overflow: "hidden" }}>
    {scenes.filter((s) => t >= s.t0 && t < s.t1).map((s) => <s.C key={s.id} t={t} />)}
  </AbsoluteFill>
);
