// Harvests jongleren.es: a full-page and a first-screen screenshot of each page, its text, and the
// brand values from site_extract.js (colours, fonts, logo, images).
//   node scripts/harvest.mjs            (run from films/jongleren; writes harvest/pages/)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PAGES = ['', 'student', 'stage', 'jongleren-es-app', 'coaching', 'locaties', 'over-ons', 'planjeintake',
  'faq', 'ervaringen', 'stagevacatures', 'taalles', 'referenties', 'zakelijk'];
const OUT = 'harvest/pages';
fs.mkdirSync(OUT, { recursive: true });
const extract = fs.readFileSync('scripts/site_extract.js', 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'nl-NL' });
for (const p of PAGES) {
  const name = p || 'home';
  try {
    await page.goto(`https://jongleren.es/${p}${p ? '/' : ''}`, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) { console.log(name, 'load:', e.message.split('\n')[0]); }
  // dismiss a cookie banner if there is one
  for (const t of ['Accepteren', 'Alles accepteren', 'Accept', 'Akkoord', 'Accept all']) {
    const b = page.getByRole('button', { name: t }); if (await b.count()) { await b.first().click().catch(() => {}); break; }
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `${name}-top.png`) });
  for (let y = 0; y < 20000; y += 700) { await page.evaluate(yy => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${name}-full.png`), fullPage: true });
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(path.join(OUT, `${name}.txt`), text);
  const data = await page.evaluate(src => eval(src), extract);
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data, null, 1));
  console.log(name, text.length, 'chars,', (data.images || []).length, 'images');
}
await browser.close();
