// Runs every scene's render function in node across its span and collects the cursor's "[hand]" warnings
// (compressed glides, tight rests), which the Remotion render log does not pass through.  node tools/handcheck.mjs
import { build } from "esbuild";
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const React = require("react"), { renderToString } = require("react-dom/server");
const W = []; const ow = console.warn; console.warn = (...a) => { const s = a.join(" "); if (s.includes("[hand]")) W.push(s); };
const oe = console.error; console.error = () => {};
const spans = { A: [0, 20.5], B: [20.5, 44.65], C: [44.65, 65.2], Z: [0, 3] };
for (const s of (process.argv[2] ? process.argv[2].split(",") : ["A", "B", "C"])) {
  const out = `out/_hc_${s}.cjs`;
  await build({ entryPoints: [`src/scenes/${s}.tsx`], bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "error",
    external: ["react", "react-dom", "@remotion/*"], alias: { remotion: "./tools/remotion-shim.cjs" }, loader: { ".json": "json" }, jsx: "automatic" });
  const m = require(fs.realpathSync(out)), C = m[`Scene${s}`]; let n = 0, err = 0;
  for (let t = spans[s][0]; t < spans[s][1]; t += 1 / 30) { try { globalThis.__frame = Math.round(t * 60); renderToString(React.createElement(C, { g: t * 30 })); n++; } catch (e) { err++; if (err < 2) ow(s, "render error", String(e).slice(0, 200)); } }
  ow(`${s}: ${n} frames rendered, ${err} errors`);
}
console.warn = ow; console.error = oe;
console.log([...new Set(W)].join("\n") || "no [hand] warnings");
