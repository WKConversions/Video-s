// node stills.mjs 0.5,1.4,... [scale]  -> out/test/t_XX.XX.png (times in seconds)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";
const times = process.argv[2].split(",").map(Number);
const scale = Number(process.argv[3] || 0.5);
const inputProps = { audio: "none" };
const shells = fs.readdirSync("/opt/pw-browsers").filter((d) => d.startsWith("chromium_headless_shell"));
const cand = [`/opt/pw-browsers/${shells[0]}/chrome-linux/headless_shell`, `/opt/pw-browsers/${shells[0]}/chrome-headless-shell-linux64/chrome-headless-shell`];
const browserExecutable = cand.find((c) => fs.existsSync(c));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Film", inputProps, browserExecutable });
const out = process.env.OUT || "out/test";
fs.mkdirSync(out, { recursive: true });
for (const s of times) {
  await renderStill({ serveUrl, composition, frame: Math.round(s * 60), inputProps, browserExecutable, scale, output: `${out}/t_${s.toFixed(2).padStart(5, "0")}.png` });
}
console.log("done", times.length);
