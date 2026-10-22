import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { FPS, OnQuad, Quad } from "./kit";
import { PHONE_WAKE_GLOW, PhoneForm, PhoneWake } from "./ui";
import round from "../../public/tracks/round.json";
import wood from "../../public/tracks/wood.json";

// The two real-footage shots (Mixkit, graded low-key), each with a UI pinned on the tracked phone screen and its
// light spilling onto the surface. t = local seconds; the shot plays from its own Sequence start, so the video and
// the track line up frame for frame (tracks: public/tracks/*.json, one quad per 60 fps frame, TL TR BR BL).
export const ROUND_DUR = 2.2;
export const WOOD_DUR = 1.45;

const Footage: React.FC<{ t: number; src: string; quads: number[][][]; uiW: number; uiH: number; glow: number; spill: number;
  children: React.ReactNode }> = ({ t, src, quads, uiW, uiH, glow, spill, children }) => {
  const f = Math.round(t * FPS);
  const q = quads[Math.min(f, quads.length - 1)] as Quad;
  const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: 1920, height: 1080, filter: "brightness(0.62) contrast(1.18) saturate(0.78)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,40,60,0.35), rgba(5,12,18,0.25))", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 820px 560px at ${cx}px ${cy}px, rgba(168,196,187,${0.55 * glow * spill}) 0%, rgba(135,168,158,${0.22 * glow * spill}) 40%, rgba(0,0,0,0) 72%)`, mixBlendMode: "screen" }} />
      <OnQuad w={uiW} h={uiH} q={q}>{children}</OnQuad>
      <OnQuad w={uiW} h={uiH} q={q} style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%)" }}><div /></OnQuad>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const RoundShot: React.FC<{ t: number }> = ({ t }) => (
  <Footage t={t} src="footage/seg_round.mp4" quads={round.quads} uiW={600} uiH={1300} glow={PHONE_WAKE_GLOW(t)} spill={1}>
    <PhoneWake t={t} />
  </Footage>
);

export const WoodShot: React.FC<{ t: number }> = ({ t }) => (
  <Footage t={t} src="footage/seg_wood.mp4" quads={wood.quads} uiW={750} uiH={1334} glow={1} spill={0.7}>
    <PhoneForm t={t} />
  </Footage>
);
