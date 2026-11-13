// Builds site/storyboard-overview.png: the whole storyboard as one landscape image (3200 px wide).
// Run: NODE_PATH=$(npm root -g) node make_overview.js   (needs the frames in site/frames/)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const HARVEST = path.join(HERE, '..', '..', 'harvest');
const sb = JSON.parse(fs.readFileSync(path.join(HERE, 'storyboard.json'), 'utf8'));
const url = (p) => 'file://' + p;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const STYLE = { 'flat-ui': ['Flat UI', '#7FE0B4'], '3d-blocks': ['3D blocks', '#B9C1FF'], mixed: ['Lockup', '#C7B6FF'] };
const total = sb.length_s;
const t2 = (t) => t.toFixed(2);

const seg = sb.beats.map((b) => {
  const [, col] = STYLE[b.style];
  return `<div class="seg" style="flex-basis:${((b.t1 - b.t0) / total * 100).toFixed(3)}%;border-top-color:${col}"><span>${b.id}</span></div>`;
}).join('');
const ticks = [0, 10, 20, 30].map((t) => `<span style="left:${(t / total * 100).toFixed(2)}%">${t} s</span>`).join('') + `<span class="end" style="left:100%">${total} s</span>`;

const beats = sb.beats.map((b) => {
  const [label, col] = STYLE[b.style];
  const figs = b.frames.map((f) => `<figure><img src="${url(path.join(HERE, f.file))}"><span class="tc">${t2(f.t)} s</span></figure>`);
  if (figs.length === 2) figs.push(`<figure class="loop"><div><span class="arr">↺</span><span>Loops to B1 · 0.00 s</span></div></figure>`);
  const words = b.textOutsideUI.length ? `<p class="ost"><span class="lbl">On screen</span>${b.id === 'B9' ? 'wicflow · “Let’s find the first thing to build.” · [ Book an AI mapping → ]' : '“' + esc(b.textOutsideUI[0]) + '”'}</p>` : '';
  const vo = b.vo.startsWith('(') ? '<em>No VO: the music bed carries the loop.</em>' : esc(b.vo);
  return `<section class="beat">
    <div class="bh"><span class="bid">${b.id}</span><span class="name">${esc(b.name)}</span><span class="time">${t2(b.t0)}–${t2(b.t1)} s</span><span class="tag"><i style="background:${col}"></i>${label}</span></div>
    <div class="frames">${figs.join('')}</div>
    <p class="vo"><span class="lbl">VO</span>${vo}</p>${words}
  </section>`;
}).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'WF Headline';src:url(${url(path.join(HARVEST, 'stack-sans-headline.woff2'))}) format('woff2');font-weight:200 700}
@font-face{font-family:'WF Inter';src:url(${url(path.join(HARVEST, 'inter.woff2'))}) format('woff2');font-weight:100 900}
@font-face{font-family:'WF Mono';src:url(${url(path.join(HARVEST, 'fragment-mono.woff2'))}) format('woff2');font-weight:400}
@font-face{font-family:'WF Mark';src:url(${url(path.join(HARVEST, 'manrope-latin-7.woff2'))}) format('woff2');font-weight:800}
*{box-sizing:border-box}
html,body{margin:0;background:#0B1220;color:#F3F5FA;font-family:'WF Inter',sans-serif}
.sheet{width:3200px;padding:56px 64px 44px;background:radial-gradient(1800px 1100px at 50% 0%,#131C3A 0%,#0E1630 45%,#0B1220 100%)}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:80px;padding-bottom:36px;border-bottom:1px solid rgba(255,255,255,.10)}
.brand{display:flex;align-items:center;gap:16px;margin-bottom:18px}
.brand img{height:40px;filter:invert(1)}
.brand b{font:800 40px/1 'WF Mark';letter-spacing:-1.6px}
h1{font:500 76px/1.02 'WF Headline';letter-spacing:-1.6px;margin:0}
.sub{font:400 24px/1.4 'WF Mono';color:rgba(223,230,243,.6);margin:16px 0 0;letter-spacing:.02em}
.right{width:1240px;flex:none}
.bar{display:flex;gap:3px;position:relative;padding-bottom:30px}
.seg{height:44px;border-radius:8px;background:rgba(255,255,255,.06);border-top:4px solid;display:flex;align-items:center;justify-content:center;font:400 18px/1 'WF Mono';color:rgba(243,245,250,.85);min-width:0}
.ticks{position:absolute;left:0;right:0;bottom:0;height:20px}
.ticks span{position:absolute;font:400 16px/1 'WF Mono';color:rgba(223,230,243,.5);white-space:nowrap}
.ticks span.end{transform:translateX(-100%)}
.legend{display:flex;gap:28px;align-items:center;margin-top:18px;font:400 19px/1.3 'WF Inter';color:rgba(223,230,243,.72);flex-wrap:wrap}
.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:8px;vertical-align:-1px}
.legend .tb{margin-left:auto;color:#F3F5FA}
.legend .tb em{font-style:normal;color:#B9C1FF}
.grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(5,auto);grid-auto-flow:column;column-gap:64px;row-gap:34px;margin-top:36px}
.beat{min-width:0}
.bh{display:flex;align-items:baseline;gap:16px;margin-bottom:14px;white-space:nowrap}
.bid{font:400 22px/1 'WF Mono';background:rgba(185,193,255,.14);color:#CDD3FF;border-radius:8px;padding:7px 10px}
.name{font:500 36px/1 'WF Headline';letter-spacing:-.5px}
.time{font:400 22px/1 'WF Mono';color:rgba(223,230,243,.72)}
.tag{margin-left:auto;font:400 18px/1 'WF Mono';color:rgba(223,230,243,.6);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:7px 12px}
.tag i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:8px}
.frames{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
figure{margin:0;position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#060B16;box-shadow:0 0 0 1px rgba(255,255,255,.08)}
figure img{width:100%;height:100%;display:block}
.tc{position:absolute;left:10px;bottom:10px;font:400 17px/1 'WF Mono';background:rgba(6,11,22,.78);color:#CDD3FF;border-radius:6px;padding:6px 8px}
figure.loop{display:flex;align-items:center;justify-content:center;background:transparent;box-shadow:inset 0 0 0 1.5px rgba(185,193,255,.28);border:0}
figure.loop div{display:flex;flex-direction:column;align-items:center;gap:10px;font:400 20px/1.3 'WF Mono';color:rgba(223,230,243,.6)}
figure.loop .arr{font:400 56px/1 'WF Inter';color:#B9C1FF}
.vo{margin:14px 0 0;font:400 25px/1.35 'WF Inter';color:#F3F5FA}
.vo em{color:rgba(223,230,243,.6)}
.lbl{display:inline-block;font:400 16px/1 'WF Mono';color:rgba(223,230,243,.55);letter-spacing:.08em;text-transform:uppercase;border:1px solid rgba(255,255,255,.14);border-radius:6px;padding:5px 7px;margin-right:12px;vertical-align:3px}
.ost{margin:8px 0 0;font:400 22px/1.35 'WF Mono';color:#B9C1FF}
.ost .lbl{color:#B9C1FF;border-color:rgba(185,193,255,.4)}
.foot{display:flex;justify-content:space-between;margin-top:34px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08);font:400 18px/1.4 'WF Mono';color:rgba(223,230,243,.45)}
</style></head><body><div class="sheet">
<header class="top">
  <div>
    <div class="brand"><img src="${url(path.join(HARVEST, 'wicflow-mark.png'))}"><b>wicflow</b></div>
    <h1>Wicflow hero explainer · storyboard v2 · ~37 s</h1>
    <p class="sub">The work, in blocks · 1920×1080 · 60 fps · loops at ${total} s · English VO · ${sb.beats.length} beats · ${sb.beats.reduce((a, b) => a + b.frames.length, 0)} key frames</p>
  </div>
  <div class="right">
    <div class="bar">${seg}<div class="ticks">${ticks}</div></div>
    <div class="legend"><span><i style="background:#B9C1FF"></i>3D blocks</span><span><i style="background:#7FE0B4"></i>Flat UI</span><span><i style="background:#C7B6FF"></i>Lockup</span>
      <span class="tb">Text outside the product UI: <em>${sb.textBudget.used} moments</em> (B5 · B8 · B9)</span></div>
  </div>
</header>
<main class="grid">${beats}</main>
<div class="foot"><span>The voice-over carries the words; the pictures show what it says. Kallio Lämpö is wicflow.com’s made-up example company. No figures on screen.</span><span>WKConversions · 13 Nov 2026</span></div>
</div></body></html>`;

(async () => {
  const tmp = path.join(HERE, '.overview.html');
  fs.writeFileSync(tmp, html);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 3200, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(url(tmp), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const out = process.argv[2] || path.join(HERE, 'site', 'storyboard-overview.png');
  await p.locator('.sheet').screenshot({ path: out });
  await b.close();
  fs.unlinkSync(tmp);
  console.log(out, fs.statSync(out).size);
})();
