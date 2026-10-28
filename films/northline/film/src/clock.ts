// A 12-second loop with no voice: the beats in seconds. The opening beat wraps round the loop's end.
import { timeline } from "./timeline";
export const FPS = 30;
export const DURATION = 360; // 12 s, seamless
export const BEATS: Record<string, number | string> = { open: 0, b1: 3.0, b2: 5.6, b3: 8.2, back: 10.6, rest: 11, end: 12 };
export const T = timeline(FPS, BEATS);
