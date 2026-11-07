// S3 (B1): see b1-flow.tsx - the shared timeline for 0 - 17.2 s; this scene owns 11.4 - 17.2 s.
import { Scene } from "./types";
import { Flow } from "./b1-flow";
export const S3: Scene = { id: "S3", t0: 11.4, t1: 17.2, C: ({ t }) => <Flow t={t} /> };
