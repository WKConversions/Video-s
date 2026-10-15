// Second pass: the page scrolls inside a container, so find it and screenshot every screen; also the dark theme,
// and the text of the companies, recruiters, pricing and why pages.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/Video-s/films/jongleren/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-GB' });
async function shots(url, name, dark) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.log(e.message.split('\n')[0]));
  for (const t of ['Accept', 'Accept all', 'Allow all']) { const b = page.getByRole('button', { name: t, exact: true }); if (await b.count()) { await b.first().click().catch(() => {}); break; } }
  if (dark) {
    const tog = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="mode" i]');
    if (await tog.count()) { await tog.first().click().catch(() => {}); } else console.log('no theme toggle found');
    await page.waitForTimeout(800);
  }
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    let best = document.scrollingElement, bh = document.scrollingElement.scrollHeight;
    for (const el of document.querySelectorAll('*')) { const s = getComputedStyle(el); if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > bh) { best = el; bh = el.scrollHeight; } }
    best.setAttribute('data-scroller', '1'); return { h: bh, tag: best.tagName, cls: best.className?.toString().slice(0, 80) };
  });
  console.log(name, info);
  fs.writeFileSync(`harvest/${name}.txt`, await page.evaluate(() => document.body.innerText));
  for (let y = 0, i = 0; y < info.h && i < 16; y += 820, i++) {
    await page.evaluate((y) => { const s = document.querySelector('[data-scroller]'); s.scrollTo(0, y); window.scrollTo(0, y); }, y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `harvest/pages/${name}-s${String(i).padStart(2, '0')}.png` });
  }
}
await shots('https://creoble.dk/', 'home', false);
await browser.close();
