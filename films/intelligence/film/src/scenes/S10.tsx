import { Flow } from "./b3-flow";
import { Scene } from "./types";
// B3 S10: part of the continuous Flow (b3-flow.tsx); every scene draws the same function of t, so hand-offs and overlaps are identical.
export const S10: Scene = { id: "S10", t0: 48.2, t1: 54.0, C: ({ t }) => <Flow t={t} /> };
