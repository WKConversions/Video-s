// Group E: PLACEHOLDER scenes until the builder replaces this file.
import React from "react";
import { C, FONT, Stage } from "../kit";
import type { Group, Scene } from "../types";
const ph = (id: string): Scene => ({ t, dur }) => (<Stage t={t}><div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 120, color: C.navy }}>{id} · {t.toFixed(1)} / {dur}</div></Stage>);
export const GROUP: Group = { scenes: { S12: ph("S12"), S13: ph("S13"), S14: ph("S14"), }, hand: {}, sfx: {} };
