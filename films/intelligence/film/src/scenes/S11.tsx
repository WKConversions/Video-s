import { Flow } from "./b3-flow";
import { Scene } from "./types";
// B3 S11: part of the continuous Flow (b3-flow.tsx); every scene draws the same function of t, so hand-offs and overlaps are identical.
export const S11: Scene = { id: "S11", t0: 43.2, t1: 49.8, C: ({ t }) => <Flow t={t} /> };
