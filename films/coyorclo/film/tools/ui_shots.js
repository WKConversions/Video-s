// Fullscreen 9:16 shots of the game's mobile UI (1080x1920): the outfit shop (in-game fits, real COYOR products), a crate
// reveal, the studio/customize screen, the leaderboard. Local copy, login gate hidden locally, admin mode for the full shop.
//   NODE_PATH=$(npm root -g) node tools/ui_shots.js <outDir>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 1080 / 390, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 160)));
  await p.goto('file://' + path.resolve(__dirname, '../../harvest/game_cap.html'));
  await p.waitForTimeout(1200);
  await p.evaluate(() => { document.getElementById('accessGate').style.display = 'none'; __eval(`authorized = true; adminMode = true;`); });
  const shot = async (name) => { await p.waitForTimeout(700); await p.screenshot({ path: path.join(out, name + '.png') }); console.log(name); };
  const tryDo = async (label, fn) => { try { await fn(); } catch (e) { console.log(label, 'failed:', e.message.slice(0, 140)); } };
  await shot('00-home');
  await tryDo('shop', async () => { await p.evaluate(() => document.getElementById('openShop').click()); await shot('10-shop'); });
  await tryDo('game shop', async () => {
    await p.evaluate(() => [...document.querySelectorAll('#outfitShop button')].find((e) => /Game Shop/.test(e.innerText)).click()); await shot('11-gameshop');
    await p.evaluate(() => { const d = document.querySelector('#outfitShop'); const sc = [...d.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY !== 'visible') || d; sc.scrollTop = 560; }); await shot('12-gameshop-scrolled');
  });
  await tryDo('crate', async () => {
    await p.evaluate(() => __eval(`shopAccount = shopAccount || { coins: 0, owned: [], top: null, bottom: null }; shopAccount.coins = 99999; openShopCrate(crateOffers[1]);`));
    for (let k = 0; k < 8; k++) { await p.waitForTimeout(350); await p.screenshot({ path: path.join(out, `20-crate-${k}.png`) }); }
    console.log('crate');
  });
  await tryDo('locker', async () => {
    await p.evaluate(() => { const d = document.getElementById('crateReveal'); if (d && d.open) d.close(); [...document.querySelectorAll('#outfitShop button')].find((e) => /Locker/.test(e.innerText)).click(); }); await shot('30-locker');
  });
  await tryDo('real shop', async () => {
    await p.evaluate(() => [...document.querySelectorAll('#outfitShop button')].find((e) => /Real Shop/.test(e.innerText)).click()); await shot('13-realshop');
  });
  await tryDo('tabs', async () => {
    const tabs = await p.evaluate(() => [...document.querySelectorAll('#outfitShop button, #outfitShop [role=tab]')].map((e) => (e.innerText || '').trim()).filter(Boolean).slice(0, 20));
    console.log('shop buttons:', JSON.stringify(tabs));
  });
  await b.close();
})();
