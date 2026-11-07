// S2 (B1): see b1-flow.tsx - the shared timeline for 0 - 17.2 s; this scene owns 5.6 - 11.6 s.
import { Scene } from "./types";
import { Flow } from "./b1-flow";
export const S2: Scene = { id: "S2", t0: 5.6, t1: 11.6, C: ({ t }) => <Flow t={t} /> };
