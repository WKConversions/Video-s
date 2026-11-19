// K.B team film: the twelve packages in order, cut hard at the reference's cuts. LEAD-OWNED.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, PKGS, REF_FPS } from "./timeline";
import type { Pkg } from "./types";
import { PKG as R01 } from "./shots/R01"; import { PKG as R02 } from "./shots/R02"; import { PKG as R03 } from "./shots/R03";
import { PKG as R04 } from "./shots/R04"; import { PKG as R05 } from "./shots/R05"; import { PKG as R06 } from "./shots/R06";
import { PKG as R07 } from "./shots/R07"; import { PKG as R08 } from "./shots/R08"; import { PKG as R09 } from "./shots/R09";
import { PKG as R10 } from "./shots/R10"; import { PKG as R11 } from "./shots/R11"; import { PKG as R12 } from "./shots/R12";
export const ALL: Pkg[] = [R01, R02, R03, R04, R05, R06, R07, R08, R09, R10, R11, R12];
export const Film: React.FC = () => {
  const T = useCurrentFrame() / FPS, n = T * REF_FPS;
  const i = Math.max(0, PKGS.findIndex((p) => n >= p.f0 && n < p.f1 + 1));
  const P = ALL[i].Comp;
  return <AbsoluteFill style={{ background: "#F7F7F7" }}><P t={T - PKGS[i].f0 / REF_FPS} /></AbsoluteFill>;
};
