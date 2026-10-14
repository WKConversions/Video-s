// Harvests gucci.com (NL, English): first screen and every screen down the page, the page text, fonts and colours,
// and the images and SVGs on the page.   node scripts/harvest.mjs   (run from films/gucci)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/Video-s/films/jongleren/package.json');
const { chromium } = require('playwright');
const URL = 'https://www.gucci.com/nl/en_gb/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-GB',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' });
const page = await ctx.newPage();
try { await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }); } catch (e) { console.log('goto', e.message.split('\n')[0]); }
await page.waitForTimeout(6000);
for (const t of ['Accept All Cookies', 'Accept all', 'Accept All', 'Accept', 'I accept', 'OK']) {
  const b = page.getByRole('button', { name: t }); if (await b.count()) { await b.first().click().catch(() => {}); console.log('clicked', t); break; }
}
await page.waitForTimeout(2000);
console.log('title', await page.title());
fs.writeFileSync('harvest/home.txt', await page.evaluate(() => document.body?.innerText || ''));
fs.writeFileSync('harvest/home.html', await page.content());
await page.screenshot({ path: 'harvest/pages/first.png' });
const info = await page.evaluate(() => {
  const cs = (el) => getComputedStyle(el); const fonts = {}, cols = {};
  for (const el of document.querySelectorAll('body *')) { const s = cs(el); fonts[s.fontFamily] = (fonts[s.fontFamily] || 0) + 1; cols[s.color] = (cols[s.color] || 0) + 1; }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const imgs = [...document.querySelectorAll('img, source')].map((i) => ({ src: i.currentSrc || i.src || i.srcset, alt: i.alt || '', w: i.naturalWidth || 0 })).filter((i) => i.src);
  const vids = [...document.querySelectorAll('video')].map((v) => ({ src: v.currentSrc || v.src, poster: v.poster }));
  const ff = []; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.constructor.name === 'CSSFontFaceRule') ff.push(r.cssText.slice(0, 260)); } catch (e) {} }
  return { fonts: top(fonts, 8), colors: top(cols, 10), bg: cs(document.body).backgroundColor, imgs: imgs.slice(0, 80), vids, ff: ff.slice(0, 20), h: document.documentElement.scrollHeight, svgs: document.querySelectorAll('svg').length };
});
fs.writeFileSync('harvest/brand.json', JSON.stringify(info, null, 1));
const svgs = await page.evaluate(() => [...document.querySelectorAll('svg')].slice(0, 40).map((s) => ({ w: s.getBoundingClientRect().width, h: s.getBoundingClientRect().height, aria: s.getAttribute('aria-label') || s.closest('[aria-label]')?.getAttribute('aria-label') || '', html: s.outerHTML.slice(0, 8000) })));
fs.writeFileSync('harvest/svgs.json', JSON.stringify(svgs, null, 1));
for (let y = 0, i = 0; y < info.h && i < 14; y += 860, i++) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(1500); await page.screenshot({ path: `harvest/pages/s${String(i).padStart(2, '0')}.png` }); }
console.log('h', info.h, 'imgs', info.imgs.length, 'vids', info.vids.length, 'fonts', JSON.stringify(info.fonts.slice(0, 4)));
await browser.close();
