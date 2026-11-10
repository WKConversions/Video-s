import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright'); import fs from "node:fs"; import http from "node:http"; import path from "node:path";
const root = process.cwd();
const srv = http.createServer((q, s) => { const p = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(p, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : p.endsWith(".html") ? "text/html" : "application/octet-stream" }); s.end(d); }); }).listen(8123);
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await b.newPage(); pg.on("console", (m) => console.log("page:", m.text())); pg.on("pageerror", (e) => console.log("err:", e.message));
await pg.goto("http://localhost:8123/page.html"); await pg.waitForFunction("window.ready === true", null, { timeout: 60000 });
console.log(JSON.stringify(await pg.evaluate("window.info")));
fs.mkdirSync("out", { recursive: true });
const A = Array.from({ length: 17 }, (_, i) => -40 + 5 * i);
for (const rx of A) for (const ry of A) { const u = await pg.evaluate(([x, y]) => window.shot(x, y), [rx, ry]); fs.writeFileSync(`out/h_${rx}_${ry}.png`, Buffer.from(u.split(",")[1], "base64")); }
await b.close(); srv.close(); console.log("done");
