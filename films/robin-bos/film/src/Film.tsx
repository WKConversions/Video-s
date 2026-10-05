// The film: one continuous stage under one breathing camera (motion/camera.md), motion blur around the camera,
// audio outside the blur wrapper (production/build-gotchas.md).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { fontsReady } from "./fonts";
import { breathe } from "./kinetic";
import { C } from "./lib";
import { Story } from "./Story";

export const FILM_DURATION = 900;
export type FilmProps = { blurSamples: number; audio: "vo" | "mix" | "none" };

const Camera: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "rest", 0.04);
  return (
    <AbsoluteFill style={{ background: C.canvas, overflow: "hidden" }}>
      <AbsoluteFill data-probe="camera" style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", willChange: "transform" }}>
        <Story g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Film: React.FC<FilmProps> = ({ blurSamples = 1, audio = "vo" }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.canvas }} />;
  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      {blurSamples > 1 ? (
        <CameraMotionBlur samples={blurSamples} shutterAngle={180}><Camera /></CameraMotionBlur>
      ) : (
        <Camera />
      )}
      {audio !== "none" && (
        <Sequence from={0} layout="none">
          <Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
