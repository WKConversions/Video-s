import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, proxy: { server: process.env.HTTPS_PROXY } });
await ctx.route('**/*', async r => { try { const resp = await r.fetch(); await r.fulfill({ response: resp }); } catch (e) { await r.abort(); } });
const p = await ctx.newPage(); const _unused = ({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto('https://wkconversions.com/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.screenshot({ path: 'assets/site/home-hero.png' });
const H = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0, i = 0; y < H; y += 900, i++) { await p.evaluate(yy => window.scrollTo(0, yy), y); await p.waitForTimeout(700); await p.screenshot({ path: `assets/site/home-${String(i).padStart(2,'0')}.png` }); }
const info = await p.evaluate(() => {
  const cs = e => { const s = getComputedStyle(e); return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, color: s.color, bg: s.backgroundColor, ls: s.letterSpacing }; };
  const q = s => document.querySelector(s);
  const out = {};
  for (const sel of ['body','h1','h2','h3','.brand','header','a.button','.button','button','p','.eyebrow']) { const e = q(sel); if (e) out[sel] = cs(e); }
  const bgs = {}; document.querySelectorAll('*').forEach(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); const a = r.width * r.height; if (a > 2000) { for (const k of [s.backgroundColor, s.color]) bgs[k] = (bgs[k] || 0) + a; } if (s.backgroundImage && s.backgroundImage !== 'none' && !s.backgroundImage.startsWith('url')) bgs['IMG ' + s.backgroundImage.slice(0, 160)] = (bgs['IMG ' + s.backgroundImage.slice(0, 160)] || 0) + a; });
  out.colors = Object.entries(bgs).sort((a, b) => b[1] - a[1]).slice(0, 40);
  return out;
});
console.log(JSON.stringify(info, null, 1));
await b.close();
