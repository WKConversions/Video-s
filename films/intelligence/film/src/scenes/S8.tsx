import { Flow } from "./b3-flow";
import { Scene } from "./types";
// B3 S8: part of the continuous Flow (b3-flow.tsx); every scene draws the same function of t, so hand-offs and overlaps are identical.
export const S8: Scene = { id: "S8", t0: 31.9, t1: 35.3, C: ({ t }) => <Flow t={t} /> };
