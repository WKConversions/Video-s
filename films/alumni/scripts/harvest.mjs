// Harvests the Alumni site (a single-page Next.js app): a first-screen and a full-page screenshot, the
// page text, the brand values from site_extract.js, the computed styles of the main elements
// (style_extract.js), a first-screen screenshot of every section, each "Our approach" tab, the inline
// SVGs, and the links on the page (same-host pages, if any, are harvested the same way).
//   node scripts/harvest.mjs            (run from films/alumni; writes harvest/pages/ and harvest/svg/)
// Playwright comes from the sister project's node_modules (read only); Chromium from PLAYWRIGHT_BROWSERS_PATH.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/Video-s/films/jongleren/package.json');
const { chromium } = require('playwright');

const BASE = 'https://small-salad-e287.raphael-0d6.workers.dev/';
const OUT = 'harvest/pages', SVG = 'harvest/svg';
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(SVG, { recursive: true });
const extract = fs.readFileSync('scripts/site_extract.js', 'utf8');
const styles = fs.readFileSync('scripts/style_extract.js', 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-GB', deviceScaleFactor: 1 });
const sleep = ms => page.waitForTimeout(ms);

async function load(url) {
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); }
  catch (e) { console.log(url, 'load:', e.message.split('\n')[0]); }
  for (const t of ['Accept', 'Accept all', 'Allow all', 'I agree', 'OK']) {
    const b = page.getByRole('button', { name: t, exact: true }); if (await b.count()) { await b.first().click().catch(() => {}); break; }
  }
  await page.evaluate(() => document.fonts.ready); await sleep(900);
}
async function revealAll() {   // the page fades sections in (.will-reveal) as they scroll into view
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h + 900; y += 450) { await page.evaluate(yy => window.scrollTo(0, yy), y); await sleep(160); }
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(900);
}

async function harvest(url, name, withSections) {
  await load(url);
  await page.screenshot({ path: path.join(OUT, `${name}-top.png`) });
  await revealAll();
  await page.screenshot({ path: path.join(OUT, `${name}-full.png`), fullPage: true });
  fs.writeFileSync(path.join(OUT, `${name}.txt`), await page.evaluate(() => document.body.innerText));
  const data = await page.evaluate(src => eval(src), extract);
  data.styles = await page.evaluate(src => eval(src), styles);
  data.links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ text: a.innerText.trim().replace(/\s+/g, ' '), href: a.href })));
  if (withSections) {
    // one first-screen screenshot per section, top of the section at the top of the viewport
    // (a section taller than the screen gets a second shot further down: section-NNb.png)
    const secs = await page.evaluate(() => [...document.querySelectorAll('main > *, footer')].map(e => {
      const r = e.getBoundingClientRect();
      return { tag: e.tagName.toLowerCase(), id: e.id || '', cls: e.className || '', y: Math.round(r.top + scrollY), h: Math.round(r.height),
        heading: (e.querySelector('h1, h2, h3')?.innerText || '').trim().replace(/\s+/g, ' ') };
    }).filter(s => s.h > 40));
    // the fixed pill nav would cover each section's eyebrow: hide it for these shots (home-top.png has it)
    const hide = await page.addStyleTag({ content: '.site-header{visibility:hidden!important}' });
    let i = 0;
    for (const s of secs) {
      i += 1; const n = String(i).padStart(2, '0');
      await page.evaluate(y => window.scrollTo(0, y), s.y); await sleep(1100);
      s.file = `section-${n}.png`; await page.screenshot({ path: path.join(OUT, s.file) });
      if (s.h > 980) { await page.evaluate(y => window.scrollTo(0, y), s.y + 800); await sleep(1100);
        s.file2 = `section-${n}b.png`; await page.screenshot({ path: path.join(OUT, s.file2) }); }
    }
    await hide.evaluate(e => e.remove());
    data.sections = secs;
    // "Our approach": four tabs, one panel at a time; click each and keep its text and a screenshot
    const tabs = page.locator('.journey-tabs button');
    data.journey = [];
    for (let t = 0; t < await tabs.count(); t++) {
      await tabs.nth(t).scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -260));
      await tabs.nth(t).click(); await sleep(700);
      const panel = await page.evaluate(() => { const p = document.querySelector('.journey-panel');
        return p ? { heading: p.querySelector('h3')?.innerText.trim(), text: p.innerText.trim() } : null; });
      data.journey.push({ tab: (await tabs.nth(t).innerText()).trim().split('\n').map(s => s.trim()).filter(Boolean), panel });
      await page.screenshot({ path: path.join(OUT, `journey-0${t + 1}.png`) });
    }
    // the film placeholder opens a modal: keep its wording
    const film = page.locator('.film-play, .film-placeholder button, .film-copy .text-link').first();
    if (await film.count()) {
      await film.scrollIntoViewIfNeeded(); await film.click().catch(() => {}); await sleep(800);
      data.filmModal = await page.evaluate(() => document.querySelector('dialog[open], .modal[open]')?.innerText.trim() || null);
      if (data.filmModal) await page.screenshot({ path: path.join(OUT, 'film-modal.png') });
      await page.keyboard.press('Escape'); await sleep(400);
    }
    // inline SVGs (icons, value shapes, journey route) with their place on the page
    const svgs = await page.evaluate(() => [...document.querySelectorAll('svg')].map((s, k) => {
      const owner = s.closest('[class]'); const r = s.getBoundingClientRect();
      return { k, owner: owner ? owner.className.toString().slice(0, 60) : '', w: Math.round(r.width), h: Math.round(r.height),
        stroke: getComputedStyle(s).stroke, color: getComputedStyle(s).color, markup: s.outerHTML };
    }));
    svgs.forEach(s => fs.writeFileSync(path.join(SVG, `svg-${String(s.k).padStart(2, '0')}-${(s.owner.split(' ')[0] || 'x').replace(/[^\w-]/g, '')}.svg`),
      s.markup.includes('xmlns') ? s.markup : s.markup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')));
    data.svgs = svgs.map(({ markup, ...r }) => ({ ...r, len: markup.length }));
  }
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data, null, 1));
  console.log(name, data.text.length, 'chars,', (data.images || []).length, 'images,', (data.sections || []).length, 'sections');
  return data;
}

const home = await harvest(BASE, 'home', true);
// other pages on the same host, if the page links to any (anchors on the same page don't count)
const base = new URL(BASE);
const more = [...new Set(home.links.map(l => l.href).filter(h => { const u = new URL(h);
  return u.host === base.host && (u.pathname !== '/' || u.search) && !/\.(png|jpe?g|pdf|svg|webp)$/i.test(u.pathname); })
  .map(h => h.split('#')[0]))];
console.log('same-host pages:', more.length ? more : 'none');
for (const u of more) await harvest(u, new URL(u).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'page', false);
await browser.close();
