// The film: one continuous stage. Each scene is a state of the same world; every hand-off grows out of an object:
// the door's light becomes the room, the book's light becomes the book scene, Iris becomes the page S2, the chosen
// branch blooms into S3B, the ending's medallion becomes the lamp-lit room, the window becomes the sky, the book
// becomes the astronaut's book, Natt becomes Morgon. Sound sits outside the motion-blur wrapper.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { fontsReady } from "./fonts";
import { C, SETTLE, SOFT, lerp } from "./lib";
import { T, VO_AT } from "./clock";
import { NightHome, Room1, Room2 } from "./Theatre";
import { BookScene, HeroScene, MapScene, MorningScene, ReaderScene, ShelfScene, SkyScene, TogetherScene } from "./StoryWorld";

export type FilmProps = { blurSamples: number; audio?: "mix" | "vo" | "none" };

const MotionBlur: React.FC<{ samples: number; children: React.ReactNode }> = ({ samples, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: samples }, (_, i) => (
        <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1) }}>
          <Freeze frame={Math.max(0, f - 0.5 * (i / Math.max(1, samples - 1)))}>{children}</Freeze>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/** a scene mounted for its span */
const Span: React.FC<{ g: number; a: string; b: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ g, a, b, children, style }) =>
  g >= T.f(a) && g < T.f(b) ? <AbsoluteFill style={style}>{children}</AbsoluteFill> : null;

const Stage: React.FC = () => {
  const g = useCurrentFrame();
  // the camera only breathes: under 8 px and 1.5 % over the whole film
  const s = 1.012 + 0.006 * Math.sin(g / 150);
  const x = 6 * Math.sin(g / 110), y = 4 * Math.cos(g / 130);
  // hand-off masks
  const door = T.k(g, "inside", 0.9, SETTLE);              // the room grows out of the open door (x 1272–1330, y 704–812)
  const doorClip = `inset(${lerp(704, 0, door)}px ${lerp(1920 - 1330, 0, door)}px ${lerp(1080 - 812, 0, door)}px ${lerp(1272, 0, door)}px round ${lerp(4, 0, door)}px)`;
  const med = T.k(g, "room2", 1.1, SETTLE);                // the room grows out of the ending's medallion (960, 520, r 330)
  const medClip = `circle(${lerp(330, 1250, med)}px at 960px 520px)`;
  const win = T.k(g, "sky", 1.0, SETTLE);                  // the sky grows out of the room's window (x 1480–1810, y 170–570)
  const winClip = `inset(${lerp(170, 0, win)}px ${lerp(1920 - 1810, 0, win)}px ${lerp(1080 - 570, 0, win)}px ${lerp(1480, 0, win)}px)`;
  const shelfIn = T.k(g, "close+0.6", 0.35, SOFT);
  const morning = T.k(g, "tomorrow", 0.4, SOFT);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill data-probe="camera" style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "50% 50%", willChange: "transform" }}>
        <Span g={g} a="open" b="inside+1.0"><NightHome g={g} /></Span>
        <Span g={g} a="inside" b="bookUp+1.3" style={{ clipPath: door < 1 ? doorClip : undefined }}><Room1 g={g} /></Span>
        <Span g={g} a="bookUp" b="adventure+1.0"><BookScene g={g} /></Span>
        <Span g={g} a="adventure+0.95" b="inside2+1.25"><HeroScene g={g} /></Span>
        <Span g={g} a="inside2+1.2" b="map+0.8"><ReaderScene g={g} /></Span>
        <Span g={g} a="map" b="together+1.45" style={{ opacity: T.k(g, "map", 0.5, SOFT) }}><MapScene g={g} /></Span>
        <Span g={g} a="together+1.4" b="close+1.0"><TogetherScene g={g} /></Span>
        <Span g={g} a="close+0.6" b="room2+1.15" style={{ opacity: shelfIn }}><ShelfScene g={g} /></Span>
        <Span g={g} a="room2" b="sky+1.05" style={{ clipPath: med < 1 ? medClip : undefined }}><Room2 g={g} /></Span>
        <Span g={g} a="sky" b="tomorrow+0.45" style={{ clipPath: win < 1 ? winClip : undefined, opacity: T.k(g, "sky", 0.3, SOFT) }}><SkyScene g={g} /></Span>
        <Span g={g} a="tomorrow" b="end+1" style={{ opacity: morning }}><MorningScene g={g} /></Span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Film: React.FC<FilmProps> = ({ blurSamples = 1, audio = "mix" }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.night }} />;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {blurSamples > 1 ? <MotionBlur samples={blurSamples}><Stage /></MotionBlur> : <Stage />}
      {audio === "mix" && <Sequence from={0} layout="none"><Audio src={staticFile("audio/mix.wav")} /></Sequence>}
      {audio === "vo" && <Sequence from={Math.round(VO_AT * 30)} layout="none"><Audio src={staticFile("audio/vo.wav")} /></Sequence>}
    </AbsoluteFill>
  );
};
