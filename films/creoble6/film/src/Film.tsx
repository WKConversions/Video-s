import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { Story } from "./Story";
import { OUT_FPS } from "./clock";
import { BLUR as BA } from "./scenes/A";
import { BLUR as BB } from "./scenes/B";
import { BLUR as BC } from "./scenes/C";

// Motion blur only inside the windows the scenes list (fast camera moves, fly-throughs, whips): there the frame is
// rendered `blurSamples` times across a 180° shutter and blended. Elsewhere one sample (calm moves need none).
const WINDOWS: [number, number][] = [...BA, ...BB, ...BC];
export const Film: React.FC<{ blurSamples: number; audio: string }> = ({ blurSamples, audio }) => {
  const t = useCurrentFrame() / OUT_FPS;
  const blur = blurSamples > 1 && WINDOWS.some(([a, b]) => t >= a && t <= b);
  return (
    <AbsoluteFill style={{ background: "#FAFAF8" }}>
      {blur ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}><Story /></CameraMotionBlur> : <Story />}
      {/* audio stays outside the blur wrapper (build-gotchas) */}
      {audio && audio !== "none" && <Sequence from={0} layout="none"><Audio src={staticFile(audio)} /></Sequence>}
    </AbsoluteFill>
  );
};
