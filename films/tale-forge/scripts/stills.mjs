// Test frames from a Remotion project, bundled once (production/remotion.md, evaluation/quality-check.md).
// Run from the project folder:  node stills.mjs 0,45,120 [samples] [composition]
// -> out/test/f0000.png ... ; samples is passed as the blurSamples prop (1 = no blur).
// In a sandbox, set BROWSER to the pre-installed headless shell (defaults to /opt/pw-browsers/...).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";

const frames = process.argv[2].split(",").map(Number);
const inputProps = { blurSamples: Number(process.argv[3] || 1) };
const id = process.argv[4] || "Film";
const shells = fs.existsSync("/opt/pw-browsers") ? fs.readdirSync("/opt/pw-browsers").filter((d) => d.startsWith("chromium_headless_shell")) : [];
const browserExecutable = process.env.BROWSER || (shells[0] ? `/opt/pw-browsers/${shells[0]}/chrome-linux/headless_shell` : undefined);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, inputProps, browserExecutable });
fs.mkdirSync("out/test", { recursive: true });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, inputProps, browserExecutable, output: `out/test/f${String(frame).padStart(4, "0")}.png` });
  process.stdout.write(`${frame} `);
}
console.log("done");
