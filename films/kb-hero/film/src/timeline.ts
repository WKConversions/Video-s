// K.B hero film: the scene list. LEAD-OWNED. 60 fps, 40.5 s. A scene draws for its local time t in [-0.3, dur + 0.3]
// (the 0.6 s around each boundary is the transition, done by src/Film.tsx with the incoming scene's `trans`).
export const TR = 0.6;
export type SceneDef = { id: string; group: "A" | "B" | "C" | "D" | "E"; start: number; dur: number; trans: "none" | "iris" | "zoom" | "push-up" | "push-left" | "wipe" | "blur"; name: string };
export const SCENES: SceneDef[] = [
  { id: "S1", group: "A", start: 0.0, dur: 4.2, trans: "none", name: "Hook: the technical team you don't have to hire yet + the K.B tile" },
  { id: "S2", group: "A", start: 4.2, dur: 3.8, trans: "iris", name: "The three pillars fan out; the cursor picks the first" },
  { id: "S3", group: "B", start: 8.0, dur: 1.6, trans: "zoom", name: "Text: AI, Agents & Automation" },
  { id: "S4", group: "B", start: 9.6, dur: 4.0, trans: "push-up", name: "Automation canvas: the cursor wires tools together (no text)" },
  { id: "S5", group: "B", start: 13.6, dur: 2.2, trans: "blur", name: "An AI agent working in the background (no text)" },
  { id: "S6", group: "C", start: 15.8, dur: 1.5, trans: "wipe", name: "Text: Software Development" },
  { id: "S7", group: "C", start: 17.3, dur: 4.0, trans: "push-left", name: "Code becomes a website and an app (no text)" },
  { id: "S8", group: "C", start: 21.3, dur: 2.0, trans: "zoom", name: "A business dashboard comes alive (no text)" },
  { id: "S9", group: "D", start: 23.3, dur: 1.6, trans: "wipe", name: "Text: Growth Technology" },
  { id: "S10", group: "D", start: 24.9, dur: 3.2, trans: "push-up", name: "SEO & GEO: search and an AI answer find the business (no text)" },
  { id: "S11", group: "D", start: 28.1, dur: 3.2, trans: "push-left", name: "Conversion and digital product marketing (no text)" },
  { id: "S12", group: "E", start: 31.3, dur: 3.5, trans: "blur", name: "Built together: Diagnose, Build, Run; we stay on" },
  { id: "S13", group: "E", start: 34.8, dur: 2.4, trans: "iris", name: "Proof: a 3D map of Europe and the numbers" },
  { id: "S14", group: "E", start: 37.2, dur: 3.3, trans: "zoom", name: "End: K.B, your tech partner; the cursor books a discovery call" },
];
export const DUR = 40.5;
