// K.B team film: the twelve packages in order, cut hard at the reference's cuts. LEAD-OWNED.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, PKGS, REF_FPS } from "./timeline";
import type { Pkg } from "./types";
import { PKG as R01 } from "./shots/R01"; import { PKG as R02 } from "./shots/R02"; import { PKG as R03 } from "./shots/R03";
import { PKG as R04 } from "./shots/R04"; import { PKG as R05 } from "./shots/R05"; import { PKG as R06 } from "./shots/R06";
import { PKG as R07 } from "./shots/R07"; import { PKG as R08 } from "./shots/R08"; import { PKG as R09 } from "./shots/R09";
import { PKG as R10 } from "./shots/R10"; import { PKG as R11 } from "./shots/R11"; import { PKG as R12 } from "./shots/R12";
export const TICK = 2.5e-6;
export const ALL: Pkg[] = [R01, R02, R03, R04, R05, R06, R07, R08, R09, R10, R11, R12];
export const Film: React.FC = () => {
  // a package owns the film frames from the one on which its first reference frame starts (reference frame n starts at
  // film frame n * 2.5; whole-number arithmetic, so a boundary never slips a frame)
  const fr = useCurrentFrame(), T = fr / FPS;
  const i = Math.max(0, PKGS.findIndex((p) => fr >= Math.ceil(p.f0 * 2.5) && fr < Math.ceil((p.f1 + 1) * 2.5)));
  const P = ALL[i].Comp;
  // + TICK: a hair of time (a 400th of a millisecond), so that "t >= the start of reference frame n" is true on the film
  // frame that starts exactly there. T - f0 / 24 loses a few bits; without it such a cut can land one film frame late.
  return <AbsoluteFill style={{ background: "#F7F7F7" }}><P t={T - PKGS[i].f0 / REF_FPS + TICK} /></AbsoluteFill>;
};
