// Harvests recruitingrewards.com: first-screen and full-page screenshots (desktop), the page text, the computed
// brand values (colours, fonts, CSS variables), images and SVGs, and the same-host links.
//   node scripts/harvest.mjs   (run from films/recruiting; writes harvest/)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/Video-s/films/jongleren/package.json');
const { chromium } = require('playwright');
const BASE = 'https://www.recruitingrewards.com/';
fs.mkdirSync('harvest/pages', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-GB' });
async function load(url) {
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) { console.log(url, e.message.split('\n')[0]); }
  for (const t of ['Accept', 'Accept all', 'Allow all', 'I agree', 'OK', 'Got it']) {
    const b = page.getByRole('button', { name: t, exact: true }); if (await b.count()) { await b.first().click().catch(() => {}); break; }
  }
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1200);
  // scroll through so lazy content and reveal animations run
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(250); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
}
async function harvest(url, name) {
  await load(url);
  await page.screenshot({ path: `harvest/pages/${name}-first.png` });
  await page.screenshot({ path: `harvest/pages/${name}-full.png`, fullPage: true });
  fs.writeFileSync(`harvest/${name}.txt`, await page.evaluate(() => document.body.innerText));
  fs.writeFileSync(`harvest/${name}.html`, await page.content());
  const brand = await page.evaluate(() => {
    const cs = (el) => getComputedStyle(el);
    const count = {}, fonts = {}, bgs = {};
    for (const el of document.querySelectorAll('body *')) {
      const s = cs(el); if (s.display === 'none' || s.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect(); if (r.width * r.height < 4) continue;
      count[s.color] = (count[s.color] || 0) + 1;
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs[s.backgroundColor] = (bgs[s.backgroundColor] || 0) + r.width * r.height;
      if (s.backgroundImage && s.backgroundImage !== 'none' && s.backgroundImage.includes('gradient')) bgs[s.backgroundImage.slice(0, 160)] = (bgs[s.backgroundImage.slice(0, 160)] || 0) + r.width * r.height;
      fonts[s.fontFamily] = (fonts[s.fontFamily] || 0) + 1;
    }
    const vars = {};
    for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) { if (r.selectorText === ':root' || r.selectorText === '.dark' || r.selectorText === 'html') for (const p of r.style) if (p.startsWith('--')) vars[(r.selectorText) + ' ' + p] = r.style.getPropertyValue(p).trim(); } } catch (e) {} }
    const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
    const imgs = [...document.querySelectorAll('img')].map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight }));
    const links = [...document.querySelectorAll('a[href]')].map((a) => a.href);
    const heads = [...document.querySelectorAll('h1,h2,h3')].map((h) => ({ tag: h.tagName, text: h.innerText.trim().slice(0, 120), font: cs(h).fontFamily, size: cs(h).fontSize, weight: cs(h).fontWeight, color: cs(h).color }));
    const fontFaces = []; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.constructor.name === 'CSSFontFaceRule') fontFaces.push(r.cssText.slice(0, 300)); } catch (e) {} }
    return { colors: top(count, 14), backgrounds: top(bgs, 14), fonts: top(fonts, 6), vars, imgs, links: [...new Set(links)], heads, fontFaces: fontFaces.slice(0, 12), bodyBg: cs(document.body).backgroundColor, svgs: document.querySelectorAll('svg').length };
  });
  fs.writeFileSync(`harvest/${name}-brand.json`, JSON.stringify(brand, null, 1));
  // the inline SVGs (logo, icons)
  const svgs = await page.evaluate(() => [...document.querySelectorAll('svg')].slice(0, 60).map((s) => ({ w: s.getBoundingClientRect().width, h: s.getBoundingClientRect().height, html: s.outerHTML.slice(0, 6000), parent: (s.closest('a,button,header,nav')?.tagName || '') })));
  fs.writeFileSync(`harvest/${name}-svgs.json`, JSON.stringify(svgs, null, 1));
  // a screenshot per viewport-height slice for reading
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0, i = 0; y < h && i < 14; y += 900, i++) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(500); await page.screenshot({ path: `harvest/pages/${name}-s${String(i).padStart(2, '0')}.png` }); }
  return brand;
}
const b = await harvest(BASE, 'home');
console.log('links', b.links.filter((l) => l.includes('recruitingrewards')).join(' '));
await browser.close();
