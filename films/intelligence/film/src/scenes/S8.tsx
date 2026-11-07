import { Flow } from "./b3-flow";
import { Scene } from "./types";
// B3 S8: part of the continuous Flow (b3-flow.tsx); every scene draws the same function of t, so hand-offs and overlaps are identical.
export const S8: Scene = { id: "S8", t0: 39.2, t1: 44.0, C: ({ t }) => <Flow t={t} /> };
