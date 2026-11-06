// The stage under every scene: Duendr's dark field (#161413) and a static dither. Scenes that need another field
// (the hook's cream and coral frames, the outro's cream) draw it themselves, as full-frame layers that grow out of objects.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "./kit";
import { Scene } from "./scenes/types";

export const Spine: React.FC<{ t: number; scenes: Scene[] }> = ({ t, scenes }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    {scenes.filter((s) => t >= s.t0 && t < s.t1).map((s) => <s.C key={s.id} t={t} />)}
    <AbsoluteFill style={{ backgroundImage: `url(${staticFile("img/dither.png")})`, pointerEvents: "none" }} />
  </AbsoluteFill>
);
