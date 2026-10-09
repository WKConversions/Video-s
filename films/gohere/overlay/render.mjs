// Renders the end-card overlay with Chromium.
//   node render.mjs frames <A|B> <from> <to> <outDir> [workers]
//       every film frame from..to (inclusive), as PNG crops of the overlay box (see CLIP)
//   node render.mjs calib <jobs.json> <outDir>
//       one crop per STYLE_OVERRIDE in jobs.json, of the original row rebuilt in place
// The page is served over a local http server so the fonts load the way they do in a browser.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const DIR = path.dirname(fileURLToPath(import.meta.url));
// The box the overlay owns: everything left of the phone's shadow, under the button.
export const CLIP = { x: 0, y: 752, width: 1210, height: 328 };
const TYPES = { '.html': 'text/html', '.png': 'image/png', '.woff2': 'font/woff2', '.js': 'text/javascript' };

function serve() {
  const server = http.createServer((req, res) => {
    const p = path.join(DIR, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(DIR) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

// SS: supersampling. Frames are drawn at SS x the film's pixels (positions on a 1/SS px grid) and the
// build scales them down, so slow moves glide instead of stepping a whole pixel at a time.
const SS = +(process.env.SS || 1);
async function openPage(browser, port, mode, style) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: SS });
  await page.addInitScript(ss => { window.SS = ss; }, SS);
  if (style) await page.addInitScript(s => { window.STYLE_OVERRIDE = s; }, style);
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  const timing = await page.evaluate(m => window.setup(m), mode);
  return { page, timing };
}

const [cmd, ...args] = process.argv.slice(2);
const server = await serve();
const port = server.address().port;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
try {
  if (cmd === 'calib') {
    const [jobsFile, out] = args;
    fs.mkdirSync(out, { recursive: true });
    const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
    for (const [i, style] of jobs.entries()) {
      const { page } = await openPage(browser, port, 'calib', style);
      await page.evaluate(() => window.frame(1105));
      await page.screenshot({ path: path.join(out, `c${String(i).padStart(4, '0')}.png`), clip: { x: 0, y: 752, width: 1210, height: 328 } });
      await page.close();
    }
  } else if (cmd === 'frames') {
    const [mode, from, to, out, workers = '4'] = args;
    fs.mkdirSync(out, { recursive: true });
    // each tab renders one contiguous block of frames (the studio's rule: neighbouring frames from
    // different tabs can rasterize differently)
    const a = +from, b = +to, n = +workers, size = Math.ceil((b - a + 1) / n);
    await Promise.all(Array.from({ length: n }, async (_, w) => {
      const { page } = await openPage(browser, port, mode);
      for (let f = a + w * size; f <= Math.min(b, a + (w + 1) * size - 1); f++) {
        await page.evaluate(fr => window.frame(fr), f);
        await page.screenshot({ path: path.join(out, `o${String(f).padStart(4, '0')}.png`), clip: CLIP });
      }
      await page.close();
    }));
  } else if (cmd === 'timing') {
    const { timing } = await openPage(browser, port, args[0] || 'A');
    console.log(JSON.stringify(timing));
  } else {
    console.error('usage: render.mjs frames|calib|timing ...'); process.exitCode = 2;
  }
} finally {
  await browser.close();
  server.close();
}
