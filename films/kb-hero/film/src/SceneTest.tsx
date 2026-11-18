// LEAD-OWNED. Plays ONE scene alone, with its 0.3 s pre-roll and post-roll and its own hand keys, for the builders' checks.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FPS, useFonts } from "./kit";
import type { Group } from "./types";
import { Hand, handAt } from "./hand";
export const sceneTest = (g: Group, id: string, dur: number): React.FC => () => {
  const t = useCurrentFrame() / FPS - 0.3, ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.bg }} />;
  const Comp = g.scenes[id], keys = g.hand[id] || [];
  const h = keys.length ? handAt(t * 30, keys, { size: 170 }) : null;
  return <AbsoluteFill style={{ background: C.bg }}><AbsoluteFill style={{ isolation: "isolate" }}><Comp t={t} dur={dur} /></AbsoluteFill>{h && <AbsoluteFill style={{ zIndex: 1000 }}><Hand {...h} /></AbsoluteFill>}</AbsoluteFill>;
};
