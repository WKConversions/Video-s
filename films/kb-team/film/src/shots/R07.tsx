// Package R07: a placeholder until its builder replaces it.
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Pkg } from "../types";
const Comp: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }}>R07 · {t.toFixed(2)} s</AbsoluteFill>
);
export const PKG: Pkg = { id: "R07", Comp, sfx: [] };
