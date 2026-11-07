import { Flow } from "./b3-flow";
import { Scene } from "./types";
// B3 S9: part of the continuous Flow (b3-flow.tsx); every scene draws the same function of t, so hand-offs and overlaps are identical.
export const S9: Scene = { id: "S9", t0: 35.1, t1: 38.9, C: ({ t }) => <Flow t={t} /> };
