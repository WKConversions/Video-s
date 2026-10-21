import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { Story } from "./Story";

export const Film: React.FC<{ blurSamples: number; audio: string }> = ({ blurSamples, audio }) => (
  <AbsoluteFill style={{ background: "#F4F7FB" }}>
    {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}><Story /></CameraMotionBlur> : <Story />}
    {/* audio stays outside the blur wrapper (build-gotchas) */}
    {audio && audio !== "none" && <Sequence from={0} layout="none"><Audio src={staticFile(audio)} /></Sequence>}
  </AbsoluteFill>
);
