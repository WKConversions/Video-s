// The loop under a running-mean motion blur (no camera breath: a loop must end exactly where it starts).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Story } from "./Story";
import { DURATION } from "./clock";

export const FILM_DURATION = DURATION;
export type FilmProps = { blurSamples: number };
const fontsReady = Promise.all([
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope.woff2"), weight: "500 700" }),
  loadFont({ family: "DM Sans", url: staticFile("fonts/dm-sans-normal.woff2"), weight: "400 700" }),
]);
const Frame: React.FC = () => <Story g={useCurrentFrame()} />;
export const Film: React.FC<FilmProps> = ({ blurSamples = 1 }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#f3f0e9" }} />;
  return (
    <AbsoluteFill style={{ background: "#f3f0e9" }}>
      {Array.from({ length: blurSamples }, (_, i) => (
        <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1) }}>
          <Freeze frame={(f - 0.5 * (i / Math.max(1, blurSamples - 1)) + DURATION) % DURATION}><Frame /></Freeze>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
