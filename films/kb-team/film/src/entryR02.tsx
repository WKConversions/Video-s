// LEAD-OWNED. Package R02 alone (its builder's own entry: only the kit and src/shots/R02.tsx are bundled).
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { FPS, PKGS, W, H } from "./timeline";
import { PKG } from "./shots/R02";
const def = PKGS.find((p) => p.id === "R02")!;
// the film's own frames of this package: film frame ceil(f0 * 2.5) + k, at the film's time (see Film.tsx)
const FIRST = Math.ceil(def.f0 * 2.5), LAST = Math.ceil((def.f1 + 1) * 2.5);
const Test: React.FC = () => <PKG.Comp t={(FIRST + useCurrentFrame()) / FPS - def.f0 / 24 + 2.5e-6} />;
registerRoot(() => <Composition id="Pkg" component={Test} durationInFrames={LAST - FIRST} fps={FPS} width={W} height={H} />);
