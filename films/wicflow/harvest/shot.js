const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('https://wicflow.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: 'home-hero.png' });
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 900, i = 1; y < Math.min(h, 9000); y += 900, i++) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(700); await p.screenshot({ path: `home-s${String(i).padStart(2, '0')}.png` }); }
  await b.close();
})();
