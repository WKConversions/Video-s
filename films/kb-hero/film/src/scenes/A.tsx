// Group A: PLACEHOLDER scenes until the builder replaces this file.
import React from "react";
import { C, FONT, Stage } from "../kit";
import type { Group, Scene } from "../types";
const ph = (id: string): Scene => ({ t, dur }) => (<Stage t={t}><div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 120, color: C.navy }}>{id} · {t.toFixed(1)} / {dur}</div></Stage>);
export const GROUP: Group = { scenes: { S1: ph("S1"), S2: ph("S2"), }, hand: {}, sfx: {} };
