// FULLSCREEN VERTICAL gameplay capture (Karl: "it has to be fullscreen"). The game renders at 4K (its own resolution
// scaling: canvas 3840x2160, world 960x540 x4); per mode a 9:16 camera window follows the player and is drawn to a
// 1080x1920 frame; where the window reaches above the world (Abdel, Rahim) the sky is continued from its top row.
// The game's HUD text and panels are left out (the film draws its own vertical HUD). Mobile mode, virtual 60 fps clock,
// autopilot, the game's admin god mode, login gate hidden locally; nothing leaves the machine.
//   NODE_PATH=$(npm root -g) node tools/capture_v.js <char 0-3> <seconds> <outDir> <every> <warmup s> <view>
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const [who, secs, outDir, every = '1', warm = '0', view = ''] = process.argv.slice(2);
// view: 'x,w' (centred on the world height, or ground-aligned with ',g') or 'follow,w' (Paulie's car)
const VIEW = (() => { const [a, w, g] = view.split(','); return a === 'follow' ? { w: +w, follow: true } : { x: +a, w: +w, ground: g === 'g' }; })();
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  await ctx.addInitScript(() => {
    let t = 1000, id = 0; const q = new Map();
    performance.now = () => t; const D = Date.now(); Date.now = () => D + t;
    window.requestAnimationFrame = (cb) => { q.set(++id, cb); return id; };
    window.cancelAnimationFrame = (i) => q.delete(i);
    window.__step = (ms) => { t += ms; const cbs = [...q.values()]; q.clear(); for (const cb of cbs) cb(t); };
    window.fetch = () => Promise.reject(new Error('offline'));
  });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 160)));
  await p.goto('file://' + path.resolve(__dirname, '../../harvest/game_cap.html'));
  await p.waitForTimeout(800);
  await p.evaluate((who) => {
    document.getElementById('accessGate').style.display = 'none';
    __eval(`authorized = true; adminMode = true; godMode = true; try { unlockedCharacters = [0, 1, 2, 3]; } catch (e) {}
      refreshGameCanvasResolution = () => {}; goldenHUD = () => {};
      canvas.width = 3840; canvas.height = 2160; g.setTransform(4, 0, 0, 4, 0, 0); g.imageSmoothingEnabled = true;
      { const ft = g.fillText.bind(g); g.fillText = (s, x, y, m) => { if (y < 150) return; return m === undefined ? ft(s, x, y) : ft(s, x, y, m); };
        const fr = g.fillRect.bind(g); g.fillRect = (x, y, w, h) => { if (typeof g.fillStyle === 'string' && /rgba/.test(g.fillStyle) && y < 120 && h < 150 && w >= 180 && w < 960) return; return fr(x, y, w, h); };
        const sr = g.strokeRect.bind(g); g.strokeRect = (x, y, w, h) => { if (y < 120 && h < 150) return; return sr(x, y, w, h); }; }
      runCharacter(${+who}); if (mode === 'ready') start();`);
    window.__out = document.createElement('canvas'); __out.width = 1080; __out.height = 1920;
  }, who);
  const pilot = () => {
    try {
      const px = p.x, py = p.y;
      if (chosen === 2 && zone === 'crew') {
        const near = (ln) => carTraffic.some((c) => c.lane === ln && c.y > 120 && c.y < 470);
        if (near(carLane)) { const opts = [carLane - 1, carLane + 1].filter((l) => l >= 0 && l <= 2 && !near(l)); if (opts.length) moveCar(opts[0] - carLane); }
        return;
      }
      if (chosen === 1 && zone === 'crew') {
        const pipes = objects.filter((o) => o.type === 'pipe' && o.x + o.w > px - 10).sort((a, b) => a.x - b.x);
        let target = 270;
        if (pipes.length) { const up = pipes.find((o) => !o.lower), lo = pipes.find((o) => o.lower); if (up && lo) target = (up.h + lo.y) / 2; }
        if (py + p.h / 2 > target + 18 && p.vy > -120) jump();
        return;
      }
      if (chosen === 3 && (zone === 'crew' || mode === 'boss')) { if (Math.random() < 0.18) fireLaser(); }
      const ahead = objects.filter((o) => o.x + (o.w || 0) > px && o.x - px < 190).sort((a, b) => a.x - b.x)[0];
      if (ahead && ahead.type === 'bird') { if (!duckHeld && ahead.x - px < 150) duckHeld = true; }
      else { if (duckHeld) duckHeld = false; if (ahead && ahead.x - px < 120 && ahead.x - px > 30 && p.onGround) jump(); }
    } catch (e) {}
  };
  const snap = (V) => {   // the 9:16 camera window -> 1080x1920
    const o = window.__out, c = o.getContext('2d'), src = document.getElementById('game');
    let x = V.x;
    if (V.follow) { const cx = __eval('280 + carLaneVisual * 200'); window.__cx = window.__cx == null ? cx : window.__cx + (cx - window.__cx) * 0.18; x = Math.max(170, Math.min(790 - V.w, window.__cx - V.w / 2)); }
    const h = V.w * 16 / 9, y = V.ground ? 540 - h : (540 - h) / 2, f = 1080 / V.w, K = 4;
    const top = Math.max(0, y);
    if (y < 0) c.drawImage(src, x * K, 10, V.w * K, 2, 0, 0, 1080, -y * f + 2);           // the sky, continued from the world's top row
    c.drawImage(src, x * K, top * K, V.w * K, (Math.min(540, y + h) - top) * K, 0, (top - y) * f, 1080, (Math.min(540, y + h) - top) * f);
    return o.toDataURL('image/jpeg', 0.9);
  };
  const N = Math.round(+secs * 60), W = Math.round(+warm * 60); let k = 0;
  for (let f = 0; f < W + N; f++) {
    await p.evaluate(`__eval(${JSON.stringify('(' + pilot.toString() + ')()')}); __step(1000/60)`);
    if (f >= W && (f - W) % +every === 0) {
      const url = await p.evaluate(`(${snap.toString()})(${JSON.stringify(VIEW)})`);
      fs.writeFileSync(path.join(outDir, `v${String(k++).padStart(4, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
    }
  }
  console.log(who, k, 'frames', JSON.stringify(await p.evaluate(() => __eval('({ mode, zone, chosen })'))));
  await b.close();
})();
