// LEAD-OWNED. What a package file (src/shots/<id>.tsx) exports.
import type React from "react";
/** A package draws its stretch of the film. t = seconds since the package's first reference frame (film time minus f0 / 24).
 *  It is drawn only for 0 <= t < its length; every edge of a package is a hard cut. */
export type PkgComp = React.FC<{ t: number }>;
/** A sound event: t in package-local seconds; kind from the sound map (plan/sound-map.md); ref = the reference frame of
 *  the sound it replicates, when it replicates one; keep = never thinned out by the cue builder (a run that must sound
 *  on every step). */
export type Sfx = { t: number; kind: string; note?: string; ref?: number; db?: number; keep?: boolean };
export type Pkg = { id: string; Comp: PkgComp; sfx: Sfx[] };
