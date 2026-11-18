// LEAD-OWNED. Builder B's own entry: only the kit and src/scenes/B.tsx are bundled, so another builder's half-written file can never break your checks.
//   bash tools/sheet.sh B <SceneId> <n frames> out/<name>.png
import React from "react";
import { Composition, registerRoot } from "remotion";
import { FPS } from "./kit";
import { SCENES } from "./timeline";
import { sceneTest } from "./SceneTest";
import { GROUP } from "./scenes/B";
registerRoot(() => <>{SCENES.filter((s) => s.group === "B").map((s) => <Composition key={s.id} id={s.id} component={sceneTest(GROUP, s.id, s.dur)} durationInFrames={Math.round((s.dur + 0.6) * FPS)} fps={FPS} width={1920} height={1080} />)}</>);
