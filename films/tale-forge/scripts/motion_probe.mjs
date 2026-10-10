// Renders a Remotion film through the motion probe (scripts/probe.tsx) without screenshots and writes every frame's
// element boxes to a JSON-lines file, for scripts/motion_probe.py.  Run from the project folder:
//   cp ../../library/scripts/motion_probe.mjs scripts/ && node scripts/motion_probe.mjs out/probe.jsonl [--from 0 --to 300]
// The project must export Film and FILM_DURATION from src/Film.tsx (every film in Karl's repository does).
import { bundle } from "@remotion/bundler";
import { renderFrames, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";
const out = process.argv[2] || "out/probe.jsonl";
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const here = path.dirname(new URL(import.meta.url).pathname);
// probe.tsx sits next to this script, or in the library (when this script was copied into a project's scripts/)
const probeSrc = [path.join(here, "probe.tsx"), path.resolve(here, "../../../library/scripts/probe.tsx")].find((f) => fs.existsSync(f));
fs.copyFileSync(probeSrc, "src/__probe.tsx");
fs.writeFileSync("src/__probe_entry.tsx", `import React from "react";
import { Composition, registerRoot } from "remotion";
import { FILM_DURATION, Film } from "./Film";
import { withProbe } from "./__probe";
const P = withProbe(Film as React.FC<Record<string, unknown>>);
registerRoot(() => <Composition id="Probe" component={P} durationInFrames={FILM_DURATION} fps={30} width={1920} height={1080} defaultProps={{ blurSamples: 1, audio: "none" }} />);
`);
const shells = fs.existsSync("/opt/pw-browsers") ? fs.readdirSync("/opt/pw-browsers").filter((d) => d.startsWith("chromium_headless_shell")) : [];
const browserExecutable = process.env.BROWSER || (shells[0] ? `/opt/pw-browsers/${shells[0]}/chrome-linux/headless_shell` : undefined);
try {
  const serveUrl = await bundle({ entryPoint: path.resolve("src/__probe_entry.tsx") });
  const composition = await selectComposition({ serveUrl, id: "Probe", inputProps: {}, browserExecutable });
  const lines = [];
  const from = arg("--from", 0), to = arg("--to", composition.durationInFrames - 1);
  await renderFrames({ serveUrl, composition, inputProps: {}, browserExecutable, imageFormat: "none", frameRange: [from, to], concurrency: 4, logLevel: "error",
    outputDir: null, onStart: () => {}, onFrameUpdate: () => {},
    onBrowserLog: (l) => { if (l.text.startsWith("PROBE ")) lines.push(l.text.slice(6)); } });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join("\n"));
  console.log(`${lines.length} frames probed -> ${out}`);
} finally {
  fs.rmSync("src/__probe.tsx", { force: true }); fs.rmSync("src/__probe_entry.tsx", { force: true });
}
