// Prints every scene's EVENTS as JSON (the scenes compute times from expressions, so they are evaluated, not parsed).
//   node tools/events.mjs > ../sound/events.json
import { build } from "esbuild";
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url), all = [];
for (const s of ["A", "B", "C"]) {
  const out = `out/_ev_${s}.cjs`;
  await build({ entryPoints: [`src/scenes/${s}.tsx`], bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "error",
    external: ["react", "react-dom", "remotion", "@remotion/*"], loader: { ".json": "json" }, jsx: "automatic" });
  const m = require(fs.realpathSync(out));
  for (const e of m.EVENTS || []) all.push({ ...e, scene: s });
}
all.sort((a, b) => a.t - b.t);
process.stdout.write(JSON.stringify(all, null, 1));
