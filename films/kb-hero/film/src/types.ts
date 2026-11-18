// LEAD-OWNED. What a scene file (src/scenes/<group>.tsx) exports.
import type React from "react";
export type Scene = React.FC<{ t: number; dur: number }>;   // t = the scene's local time in seconds (-0.3 .. dur + 0.3)
export type HandKey = { at: number; x: number; y: number; click?: boolean; early?: number; dur?: number };   // at = LOCAL seconds; x, y = screen px of the target
export type Sfx = { t: number; kind: "click" | "pop" | "whoosh" | "type" | "tick" | "success" | "slide" | "snap" | "open" | "glitch" | "rise" | "fall" | "sparkle" | "thud"; note?: string };   // t = LOCAL seconds
export type Group = { scenes: Record<string, Scene>; hand: Record<string, HandKey[]>; sfx: Record<string, Sfx[]> };
