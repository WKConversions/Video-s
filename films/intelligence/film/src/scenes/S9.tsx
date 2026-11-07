import { Flow } from "./b3-flow";
import { Scene } from "./types";
// B3 S9: part of the continuous Flow (b3-flow.tsx); every scene draws the same function of t, so hand-offs and overlaps are identical.
export const S9: Scene = { id: "S9", t0: 43.8, t1: 48.4, C: ({ t }) => <Flow t={t} /> };
