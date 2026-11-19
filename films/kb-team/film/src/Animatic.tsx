// The timing demo: the storyboard frames cut at the reference's shot times (reference frame n = n / 24 s). LEAD-OWNED.
//   npx remotion render src/Animatic.tsx Animatic out/animatic540.mp4 --scale=0.5 --muted
import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { FR } from "./Storyboard";
import { useFonts } from "./kit";
import { DUR_FRAMES, FPS, H, REF_FPS, W } from "./timeline";
// the first reference frame of each storyboard frame, in film order
const AT = [0, 42, 64, 75, 93, 130, 144, 188, 205, 254, 265, 295, 312, 336, 385, 417, 434, 475, 484, 513, 528, 557, 606, 618, 622, 639, 663, 679, 733, 760, 787, 810, 833, 847, 900, 962, 1007, 1050, 1080, 1152, 1164];
const Animatic: React.FC = () => {
  const ok = useFonts(), n = (useCurrentFrame() / FPS) * REF_FPS;
  if (!ok) return <AbsoluteFill style={{ background: "#F6F6F4" }} />;
  let i = 0; while (i + 1 < AT.length && n >= AT[i + 1]) i++;
  const Fr = FR[i], p = Math.min(1, (n - AT[i]) / Math.max(1, (AT[i + 1] ?? 1201) - AT[i]));
  return <AbsoluteFill style={{ background: "#111A27" }}><AbsoluteFill style={{ transform: `scale(${(1 + 0.03 * p).toFixed(4)})` }}><Fr /></AbsoluteFill></AbsoluteFill>;
};
registerRoot(() => <Composition id="Animatic" component={Animatic} durationInFrames={DUR_FRAMES} fps={FPS} width={W} height={H} />);
