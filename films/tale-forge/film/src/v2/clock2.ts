// v2 timing: the v1 labels (clock.ts) plus the new opening and conversation beats. Film time = VO time + 1.0 s.
import { timeline } from "../timeline";
import WORDS from "../words.json";
import { BEATS, FPS } from "../clock";

import { V2 } from "./labels";
export { V2 };
export const T2 = timeline(FPS, { ...BEATS, ...V2, ...(WORDS as Record<string, number>) });
