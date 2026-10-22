import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./kit";

// Test harness for the UI builder: render one UI or 2D shot by name (props.name).
export const Test: React.FC<{ name: string }> = () => <AbsoluteFill style={{ background: C.night }} />;
