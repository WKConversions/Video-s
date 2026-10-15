// The film's stage: everything lives in scenes.tsx (storyboard/plan.md).
import React from "react";
import { Film_ } from "./scenes";

export const Story: React.FC<{ g: number }> = ({ g }) => <Film_ g={g} />;
