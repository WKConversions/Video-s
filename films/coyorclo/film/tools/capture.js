// Captures real COYOR RUN gameplay frame by frame (mobile mode, virtual 60 fps clock, an autopilot, no death) from the
// game embedded in coyorclo.com (harvest/game.html). The login gate is hidden locally; nothing is sent anywhere.
//   NODE_PATH=$(npm root -g) node tools/capture.js <char 0-3|story> <seconds> <outDir> [every=1] [warmup=0]
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const [who, secs, outDir, every = '1', warm = '0'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  await ctx.addInitScript(() => {
    let t = 1000, id = 0; const q = new Map();
    performance.now = () => t;
    const D = Date.now(); Date.now = () => D + t;
    window.requestAnimationFrame = (cb) => { q.set(++id, cb); return id; };
    window.cancelAnimationFrame = (i) => q.delete(i);
    window.__step = (ms) => { t += ms; const cbs = [...q.values()]; q.clear(); for (const cb of cbs) cb(t); };
    // never let the network block anything
    window.fetch = () => Promise.reject(new Error('offline'));
  });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 160)));
  await p.goto('file://' + path.resolve(__dirname, '../../harvest/game_cap.html'));
  await p.waitForTimeout(800);
  await p.evaluate((who) => {
    document.getElementById('accessGate').style.display = 'none';
    __eval(`authorized = true; adminMode = true; godMode = true; try { unlockedCharacters = [0, 1, 2, 3]; } catch (e) {}
      ${who === 'story' ? 'start()' : 'runCharacter(' + (+who) + ')'}; if (mode === 'ready') start();`);
  }, who);
  // autopilot: one decision per frame from the game's own state
  const pilot = () => {
    try {
      const px = p.x, py = p.y;
      if (chosen === 2 && zone === 'crew') {               // Paulie: leave a lane with a car coming
        const near = (ln) => carTraffic.some((c) => c.lane === ln && c.y > 120 && c.y < 470);
        if (near(carLane)) { const opts = [carLane - 1, carLane + 1].filter((l) => l >= 0 && l <= 2 && !near(l)); if (opts.length) moveCar(opts[0] - carLane); }
        return;
      }
      if (chosen === 1 && zone === 'crew') {               // Bram: hold the next gap's centre
        const pipes = objects.filter((o) => o.type === 'pipe' && o.x + o.w > px - 10).sort((a, b) => a.x - b.x);
        let target = 270;
        if (pipes.length) { const up = pipes.find((o) => !o.lower), lo = pipes.find((o) => o.lower); if (up && lo) target = (up.h + lo.y) / 2; }
        if (py + p.h / 2 > target + 18 && p.vy > -120) jump();
        return;
      }
      if (chosen === 3 && (zone === 'crew' || mode === 'boss')) { if (Math.random() < 0.18) fireLaser(); }
      // runners: jump ground obstacles, duck birds
      const ahead = objects.filter((o) => o.x + (o.w || 0) > px && o.x - px < 190).sort((a, b) => a.x - b.x)[0];
      if (ahead && ahead.type === 'bird') { if (!duckHeld && ahead.x - px < 150) { duckHeld = true; } }
      else { if (duckHeld) duckHeld = false; if (ahead && ahead.x - px < 120 && ahead.x - px > 30 && p.onGround) jump(); }
    } catch (e) {}
  };
  const N = Math.round(+secs * 60), W = Math.round(+warm * 60);
  let k = 0;
  for (let f = 0; f < W + N; f++) {
    await p.evaluate(`__eval(${JSON.stringify('(' + pilot.toString() + ')()')}); __step(1000/60)`);
    if (f >= W && (f - W) % +every === 0) {
      const url = await p.evaluate(() => document.getElementById('game').toDataURL('image/png'));
      fs.writeFileSync(path.join(outDir, `c${String(k++).padStart(4, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
    }
  }
  const st = await p.evaluate(() => __eval('({ mode, zone, chosen })'));
  console.log(who, k, 'frames', JSON.stringify(st));
  await b.close();
})();
