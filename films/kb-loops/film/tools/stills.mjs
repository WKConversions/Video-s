// Renders stills of the Film (or another composition) from ONE bundle, at quarter scale by default, into out/.
//   node tools/stills.mjs <prefix> <frame> [frame …] [--comp=Film] [--scale=0.25]
// Frames are 60 fps frame numbers (seconds × 60). Then make a contact sheet:  python3 tools/sheet.py out/<prefix>_*.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const args = process.argv.slice(2), opt = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const [prefix, ...frames] = args.filter((a) => !a.startsWith("--"));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const inputProps = { blurSamples: 1, audio: "none" };
const composition = await selectComposition({ serveUrl, id: opt.comp ?? "Film", inputProps });
for (const fr of frames) {
  const out = `out/${prefix}_${String(fr).padStart(4, "0")}.png`;
  await renderStill({ composition, serveUrl, output: out, frame: Number(fr), scale: Number(opt.scale ?? 0.25), inputProps });
  console.log(out);
}
