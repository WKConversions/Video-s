import React from "react";
/** a scene: drawn while t0 <= t < t1 (film seconds), in a 1920 x 1080 frame, above the dark field */
export type Scene = { id: string; t0: number; t1: number; C: React.FC<{ t: number }> };
