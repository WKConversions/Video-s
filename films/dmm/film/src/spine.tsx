// The stage under every scene: the colour field (their site's order: charcoal hero, white content, charcoal again, the
// footer) and the live topographic lines, with every scene's summits, rings and walls merged in.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C, CX, CY, Topo, k, OUT, mix } from "./kit";
import { topoPath } from "./topo";
import { H } from "./handoff";
import { Scene, TopoPart } from "./scenes/types";

/** the field colour (the white comes in as S6's circle, which covers the frame by 13.2) */
export const fieldAt = (t: number) => (t >= 13.2 && t < H.cut.t ? C.paper : C.char);

export const Spine: React.FC<{ t: number; scenes: Scene[] }> = ({ t, scenes }) => {
  const parts: TopoPart[] = scenes.filter((s) => t >= s.t0 - 0.5 && t < s.t1 + 0.5 && s.topo).map((s) => s.topo!(t));
  const bumps = parts.flatMap((p) => p.bumps ?? []), ripples = parts.flatMap((p) => p.ripples ?? []), ridges = parts.flatMap((p) => p.ridges ?? []);
  const light = t >= 13.2 && t < H.cut.t;
  // frame 0: the map draws out from the centre; after the zoom-through it eases in from 1.06 (speed-matched)
  const reveal = t < 1.6 ? { x: CX, y: CY, r: mix(200, 1500, k(t, 0, 1.4)), soft: 0.4 } : undefined;
  const zoom = t >= H.cut.t && t < H.cut.t + 0.8 ? mix(1.06, 1, k(t, H.cut.t, 0.7, OUT)) : 1;
  const visible = scenes.filter((s) => t >= s.t0 && t < s.t1);
  const d = topoPath({ t, bumps, ripples, ridges });
  return (
    <AbsoluteFill style={{ background: fieldAt(t), overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Topo o={{ t, bumps, ripples, ridges }} d={d} color={light ? "rgba(73,216,237,0.30)" : "rgba(255,255,255,0.10)"} width={2} reveal={reveal} id="spine" />
        {/* frame 0: the lines light up cyan as the map draws out from the centre */}
        {reveal && <Topo o={{ t }} d={d} color="rgba(73,216,237,0.55)" width={2.5} ring={{ x: CX, y: CY, r: reveal.r * 0.82, w: 220 }} id="spine-ring" opacity={1 - k(t, 1.1, 0.5)} />}
      </AbsoluteFill>
      {visible.map((s) => <s.C key={s.id} t={t} />)}
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("img/dither.png")})`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
