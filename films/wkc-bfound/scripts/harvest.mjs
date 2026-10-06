// Harvest a page: full-text, screenshots down the page, computed colours/fonts, logo/img candidates.
//   node scripts/harvest.mjs <url> <name>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const [url, name] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, proxy: { server: process.env.HTTPS_PROXY } });
await ctx.route('**/*', async r => { try { const resp = await r.fetch(); await r.fulfill({ response: resp }); } catch (e) { await r.abort(); } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await p.waitForTimeout(2500);
fs.mkdirSync('assets/site', { recursive: true }); fs.mkdirSync('harvest/pages', { recursive: true });
const H = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0, i = 0; y < H && i < 14; y += 900, i++) { await p.evaluate(yy => window.scrollTo(0, yy), y); await p.waitForTimeout(600); await p.screenshot({ path: `assets/site/${name}-${String(i).padStart(2, '0')}.png` }); }
const info = await p.evaluate(() => {
  const cs = e => { const s = getComputedStyle(e); return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, color: s.color, bg: s.backgroundColor, ls: s.letterSpacing }; };
  const out = { text: document.body.innerText, title: document.title };
  for (const sel of ['body', 'h1', 'h2', 'h3', 'p', 'a', 'button', 'header', 'nav']) { const e = document.querySelector(sel); if (e) out[sel] = cs(e); }
  const bgs = {}; document.querySelectorAll('*').forEach(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); const a = r.width * r.height; if (a > 2000) { for (const k of [s.backgroundColor, s.color]) bgs[k] = (bgs[k] || 0) + a; } if (s.backgroundImage && s.backgroundImage !== 'none') bgs['IMG ' + s.backgroundImage.slice(0, 200)] = (bgs['IMG ' + s.backgroundImage.slice(0, 200)] || 0) + a; });
  out.colors = Object.entries(bgs).sort((a, b) => b[1] - a[1]).slice(0, 30);
  out.imgs = [...document.querySelectorAll('img, svg')].slice(0, 40).map(e => ({ tag: e.tagName, src: e.currentSrc || e.getAttribute('src') || '', alt: e.getAttribute('alt') || '', cls: (e.getAttribute('class') || '').slice(0, 60), w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height, svg: e.tagName === 'svg' ? e.outerHTML.slice(0, 3000) : '' }));
  out.fonts = [...new Set([...document.querySelectorAll('*')].map(e => getComputedStyle(e).fontFamily))].slice(0, 10);
  out.links = [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href);
  return out;
});
fs.writeFileSync(`harvest/pages/${name}.txt`, info.text);
delete info.text;
fs.writeFileSync(`harvest/pages/${name}.json`, JSON.stringify(info, null, 1));
console.log(name, info.title, 'height', H);
await b.close();
