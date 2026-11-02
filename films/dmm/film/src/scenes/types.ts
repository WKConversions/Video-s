import React from "react";
import { Bump, Ridge, Ripple } from "../topo";

/** what a scene adds to the shared topographic field at time t (summits, rings, walls); merged by the spine */
export type TopoPart = { bumps?: Bump[]; ripples?: Ripple[]; ridges?: Ridge[] };
/** a scene: drawn while t0 <= t < t1 (film seconds), above the spine's colour field and contour lines */
export type Scene = { id: string; t0: number; t1: number; C: React.FC<{ t: number }>; topo?: (t: number) => TopoPart };
