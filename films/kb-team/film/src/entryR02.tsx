// LEAD-OWNED. Package R02 alone (its builder's own entry: only the kit and src/shots/R02.tsx are bundled).
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { FPS, PKGS, W, H } from "./timeline";
import { PKG } from "./shots/R02";
const def = PKGS.find((p) => p.id === "R02")!;
const Test: React.FC = () => <PKG.Comp t={useCurrentFrame() / FPS} />;
registerRoot(() => <Composition id="Pkg" component={Test} durationInFrames={Math.round((def.f1 + 1 - def.f0) * 2.5)} fps={FPS} width={W} height={H} />);
