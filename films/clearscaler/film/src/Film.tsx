// The film: one continuous stage under one breathing camera (motion/camera.md), with a running-mean motion blur around
// the camera. Silent by brief: no audio track.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, continueRender, delayRender, useCurrentFrame } from "remotion";
import { fontsReady } from "./fonts";
import { breathe } from "./kinetic";
import { C } from "./lib";
import { Story } from "./Story";
import { DURATION } from "./clock";

export const FILM_DURATION = DURATION;
export type FilmProps = { blurSamples: number; audio?: "none" };

/** Camera motion blur as a running mean (from the Robin Bos film): sample i is composited at opacity 1/(i+1) over the
 *  samples before it, so the result is the exact average. The shutter is 180°: the samples span half a frame back. */
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

const Camera: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "rest", 0.035);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill data-probe="camera" style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", willChange: "transform" }}>
        <Story g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Film: React.FC<FilmProps> = ({ blurSamples = 1 }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.night }} />;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {blurSamples > 1 ? <MotionBlur samples={blurSamples} shutterAngle={180}><Camera /></MotionBlur> : <Camera />}
    </AbsoluteFill>
  );
};
