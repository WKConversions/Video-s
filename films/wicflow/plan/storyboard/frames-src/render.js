// Renders every styleframe: NODE_PATH=$(npm root -g) node render.js [outPngDir] [id ...]
const { chromium } = require('playwright');
const path = require('path');
const { execFileSync } = require('child_process');
const fs = require('fs');
(async () => {
  const outPng = process.argv[2] || '/tmp/wf-frames';
  const only = process.argv.slice(3);
  fs.mkdirSync(outPng, { recursive: true });
  const site = path.join(__dirname, '..', 'site', 'frames');
  fs.mkdirSync(site, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const url = 'file://' + path.join(__dirname, 'frame.html');
  p.on('pageerror', (e) => console.error('PAGEERROR', e.message));
  await p.goto(url); await p.waitForFunction(() => window.READY === true);
  const ids = only.length ? only : await p.evaluate(() => FRAME_IDS);
  for (const id of ids) {
    await p.goto(`${url}?f=${id}`); await p.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
    const png = path.join(outPng, `${id}.png`);
    await p.screenshot({ path: png });
    const jpg = path.join(site, `${id}.jpg`);
    execFileSync('convert', [png, '-resize', '1600x', '-quality', '86', '-sampling-factor', '4:2:0', '-strip', jpg]);
    console.log(id, fs.statSync(jpg).size);
  }
  await b.close();
})();
