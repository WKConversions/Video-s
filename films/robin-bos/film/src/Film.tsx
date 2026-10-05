// The film: one continuous stage under one breathing camera (motion/camera.md), motion blur around the camera,
// audio outside the blur wrapper (production/build-gotchas.md).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Freeze } from "remotion";

/** Camera motion blur as a running mean: sample i is composited at opacity 1/(i+1) over the samples before it, so the
 *  result is the exact average of the samples (±1 level). @remotion/motion-blur's CameraMotionBlur adds the samples with
 *  plus-lighter at opacity 1/N, which rounds every colour to a multiple of N (the canvas white 252 → 255, the sky 237,244,251
 *  → 240,240,255, the grain gone) and ramps the sample count over the first N/2 frames (a tint swing). The shutter is 180°:
 *  the samples span half a frame back from the frame itself. */
const MotionBlur: React.FC<{ samples: number; shutterAngle?: number; children: React.ReactNode }> = ({ samples, shutterAngle = 180, children }) => {
  const f = useCurrentFrame();
  const span = shutterAngle / 360;
  return (
    <AbsoluteFill>
      {Array.from({ length: samples }, (_, i) => (
        <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1) }}>
          <Freeze frame={Math.max(0, f - span * (i / Math.max(1, samples - 1)))}>{children}</Freeze>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
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
        <MotionBlur samples={blurSamples} shutterAngle={180}><Camera /></MotionBlur>
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
