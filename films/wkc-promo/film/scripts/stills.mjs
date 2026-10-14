// Test frames: node scripts/stills.mjs 0,45,120 [outDir]  -> outDir/f0000.png ... (default out/test). Bundles once.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";

const frames = process.argv[2].split(",").map(Number);
const outDir = process.argv[3] || "out/test";
const inputProps = { blurSamples: 1, audio: "none" };
const shells = fs.existsSync("/opt/pw-browsers") ? fs.readdirSync("/opt/pw-browsers").filter((d) => d.startsWith("chromium_headless_shell")) : [];
const browserExecutable = process.env.BROWSER || (shells[0] ? `/opt/pw-browsers/${shells[0]}/chrome-linux/headless_shell` : undefined);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Film", inputProps, browserExecutable });
fs.mkdirSync(outDir, { recursive: true });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, inputProps, browserExecutable, output: path.join(outDir, `f${String(frame).padStart(4, "0")}.png`) });
  process.stdout.write(`${frame} `);
}
console.log("done");
