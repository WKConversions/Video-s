import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, Layer, LogoLayer, Page, useFont } from "../kit";
import { SCENE } from "./timing";
import { LOGO } from "./logo";
import { Timeline } from "./Timeline";
import { S1 } from "./S1";
import { S2 } from "./S2";
import { S3 } from "./S3";
import { S4 } from "./S4";
import { S5 } from "./S5";

const SCENES = [S1, S2, S3, S4, S5];
const TAIL = 1.0; // a scene stays mounted this long past its window, so its exit overlaps the next entrance

export const Offboarding: React.FC<{ layer: Layer }> = ({ layer }) => {
  const ok = useFont();
  const t = useCurrentFrame() / FPS;
  if (!ok) return null;
  return (
    <AbsoluteFill style={{ background: layer === "logoOnly" ? "transparent" : undefined }}>
      {layer !== "logoOnly" && <Page />}
      {layer !== "logoOnly" && SCENES.map((Sc, i) => (t >= SCENE[i][0] - 0.001 && t < SCENE[i][1] + TAIL ? <Sc key={i} t={t} t0={SCENE[i][0]} t1={SCENE[i][1]} /> : null))}
      {layer !== "logoOnly" && <Timeline t={t} />}
      {layer !== "noLogo" && <LogoLayer track={LOGO} t={t} />}
    </AbsoluteFill>
  );
};
