// S1 (B1): see b1-flow.tsx - the shared timeline for 0 - 20.2 s; this scene owns 0 - 6.8 s.
import { Scene } from "./types";
import { Flow } from "./b1-flow";
export const S1: Scene = { id: "S1", t0: 0, t1: 6.8, C: ({ t }) => <Flow t={t} /> };
