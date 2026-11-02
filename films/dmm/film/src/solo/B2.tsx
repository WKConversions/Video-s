// Solo entry for B2: S4 + S5 on the spine. Render: bash check.sh B2 8.3 13.3
// STAND-INS (this file only, never in the film): until B1's S3 and B3's S6 exist, a minimal S3 tail (the mark gliding
// into H.mark by 8.55) and S6 head (the pin dot swelling at 12.45, the white circle from 12.62) show the joins.
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { C, DUR, FPS, INOUT, OUT, WaveMark, k, mix } from "../kit";
import { H } from "../handoff";
import { Spine } from "../spine";
import { Scene } from "../scenes/types";
import { S3 } from "../scenes/S3";
import { S4 } from "../scenes/S4";
import { S5 } from "../scenes/S5";
import { S6 } from "../scenes/S6";

const S3stand: Scene = { id: "S3stand", t0: 8.0, t1: H.mark.t, C: ({ t }) => {
  const p = k(t, 8.0, 0.55, OUT); const wd = mix(520, H.mark.width, p), cx = mix(1150, H.mark.cx, p), cy = mix(640, H.mark.cy, p);
  return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cx - wd / 2}px, ${cy - (wd * 90) / 160 / 2}px)` }}><WaveMark width={wd} /></div>;
} };
const S6stand: Scene = { id: "S6stand", t0: H.pin.t, t1: 13.4, C: ({ t }) => {
  const r = t < 12.62 ? mix(H.pin.r, 35, k(t, H.pin.t, 0.17, INOUT)) : mix(35, 1250, k(t, 12.62, 0.55, INOUT));
  const white = t >= 12.62;
  return <div style={{ position: "absolute", left: 0, top: 0, width: r * 2, height: r * 2, borderRadius: r, background: white ? C.paper : C.cyanL,
    border: white ? `6px solid ${C.cyan}` : undefined, boxSizing: "border-box", transform: `translate(${H.pin.x - r}px, ${H.pin.y - r}px)` }} />;
} };

const real = (s: Scene) => s.t1 > s.t0;
const SCENES = [real(S3) ? S3 : S3stand, S4, S5, real(S6) ? S6 : S6stand];
const Solo: React.FC = () => <Spine t={useCurrentFrame() / FPS} scenes={SCENES} />;
registerRoot(() => <Composition id="Solo" component={Solo} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1920} height={1080} />);
