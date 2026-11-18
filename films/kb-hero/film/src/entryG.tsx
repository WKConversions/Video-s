// LEAD-OWNED. The lead's own scene entry (S13, the globe): bash tools/sheet.sh G S13 8 out/g13.png
import React from "react";
import { Composition, registerRoot } from "remotion";
import { FPS } from "./kit";
import { SCENES } from "./timeline";
import { sceneTest } from "./SceneTest";
import { S13, S13_HAND, S13_SFX } from "./scenes/S13globe";
const GROUP = { scenes: { S13 }, hand: { S13: S13_HAND }, sfx: { S13: S13_SFX } };
registerRoot(() => <>{SCENES.filter((s) => s.id === "S13").map((s) => <Composition key={s.id} id={s.id} component={sceneTest(GROUP, s.id, s.dur)} durationInFrames={Math.round((s.dur + 0.6) * FPS)} fps={FPS} width={1920} height={1080} />)}</>);
