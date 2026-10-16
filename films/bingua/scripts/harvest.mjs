// Harvest bingua.app: full-page screenshots (desktop), the visible text, the computed colours and fonts, and the logo/images.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/Video-s/films/jongleren/package.json');
const { chromium } = require('playwright');
const out = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-GB' });
const urls = ['https://bingua.app/'];
await page.goto(urls[0], { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.log(e.message.split('\n')[0]));
for (const t of ['Accept', 'Accept all', 'Allow all', 'Got it']) { const b = page.getByRole('button', { name: t, exact: true }); if (await b.count()) { await b.first().click().catch(() => {}); break; } }
await page.waitForTimeout(1500);
// scroll through to trigger lazy content
const H = await page.evaluate(() => document.scrollingElement.scrollHeight);
for (let y = 0; y < H; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(250); }
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/pages/home-full.png`, fullPage: true });
for (let i = 0, y = 0; y < H && i < 14; y += 900, i++) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(400); await page.screenshot({ path: `${out}/pages/home-${String(i).padStart(2, '0')}.png` }); }
fs.writeFileSync(`${out}/home.txt`, await page.evaluate(() => document.body.innerText));
fs.writeFileSync(`${out}/home.html`, await page.content());
const info = await page.evaluate(() => {
  const cols = {}, bgs = {}, fonts = {};
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el); const r = el.getBoundingClientRect(); const a = r.width * r.height;
    if (a < 4) continue;
    cols[s.color] = (cols[s.color] || 0) + (el.childNodes.length && el.innerText ? el.innerText.length : 0);
    if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs[s.backgroundColor] = (bgs[s.backgroundColor] || 0) + a;
    if (s.backgroundImage !== 'none' && s.backgroundImage.includes('gradient')) bgs['G ' + s.backgroundImage.slice(0, 160)] = (bgs['G ' + s.backgroundImage.slice(0, 160)] || 0) + a;
    fonts[s.fontFamily.split(',')[0] + ' ' + s.fontWeight] = (fonts[s.fontFamily.split(',')[0] + ' ' + s.fontWeight] || 0) + 1;
  }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const imgs = [...document.querySelectorAll('img, svg image, link[rel*=icon]')].map((i) => i.src || i.href).filter(Boolean);
  const vars = {}; const cs = getComputedStyle(document.documentElement);
  for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) { if (r.selectorText === ':root' || r.selectorText === ':root, :host') for (const p of r.style) if (p.startsWith('--')) vars[p] = cs.getPropertyValue(p).trim(); } } catch (e) {} }
  return { colors: top(cols, 20), backgrounds: top(bgs, 20), fonts: top(fonts, 12), images: [...new Set(imgs)].slice(0, 60), vars, title: document.title };
});
fs.writeFileSync(`${out}/brand.json`, JSON.stringify(info, null, 1));
console.log(JSON.stringify({ title: info.title, colors: info.colors.slice(0, 10), backgrounds: info.backgrounds.slice(0, 12), fonts: info.fonts, nvars: Object.keys(info.vars).length }, null, 1));
await browser.close();
