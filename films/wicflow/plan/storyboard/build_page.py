#!/usr/bin/env python3
"""Builds site/index.html (the storyboard page) from storyboard.json.
Self-contained: Wicflow's own fonts are embedded, frames load from site/frames/.
Run: python3 build_page.py"""
import base64
import html
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
HARVEST = os.path.join(HERE, '..', '..', 'harvest')
sb = json.load(open(os.path.join(HERE, 'storyboard.json'), encoding='utf-8'))
E = html.escape


def font(name, file, weight):
    data = base64.b64encode(open(os.path.join(HARVEST, file), 'rb').read()).decode()
    return (f"@font-face{{font-family:'{name}';src:url(data:font/woff2;base64,{data}) format('woff2');"
            f"font-weight:{weight};font-display:swap}}")


FONTS = '\n'.join([
    font('WF Headline', 'stack-sans-headline.woff2', '200 700'),
    font('WF Inter', 'inter.woff2', '100 900'),
    font('WF Mono', 'fragment-mono.woff2', '400'),
])

STYLE_LABEL = {'mixed': 'Mixed', '3d-blocks': '3D blocks', 'kinetic-type': 'Kinetic type', 'flat-ui': 'Flat UI'}


def secs(t):
    return f"{t:.2f}".rstrip('0').rstrip('.') if t % 1 else f"{t:.1f}"


def tfmt(t):
    return f"{t:05.2f}".replace('.', '.')


def note_parts(n):
    m = re.match(r"^(.*?[.:])\s+(.*)$", n, re.S)
    if not m:
        return n, ''
    return m.group(1).rstrip('.:'), m.group(2)


total = sb['length_s']
beats = sb['beats']
nframes = sum(len(b['frames']) for b in beats)

# ---- beat bar
bar = []
for b in beats:
    w = (b['t1'] - b['t0']) / total * 100
    bar.append(f'<a class="seg s-{b["style"]}" href="#{b["id"].lower()}" style="flex-basis:{w:.3f}%" '
               f'title="{E(b["id"])} · {E(b["name"])} · {secs(b["t0"])}–{secs(b["t1"])} s"><span>{E(b["id"])}</span></a>')
ticks = ''.join(f'<span style="left:{t / total * 100:.3f}%">{t:g}s</span>' for t in (0, 10, 20, 30)) + \
    f'<span class="end" style="left:100%">{total:g}s</span>'

# ---- notes
notes = []
for n in sb['notes']:
    head, body = note_parts(n)
    notes.append(f'<article class="note"><h3>{E(head)}</h3><p>{E(body)}</p></article>')

# ---- beats
sections = []
for b in beats:
    frames = b['frames']
    figs = []
    for i, f in enumerate(frames):
        src = f['file'].replace('site/', '')
        wide = ' wide' if (len(frames) % 2 == 1 and i == 0) else ''
        figs.append(f'''<figure class="frame{wide}">
      <img src="{E(src)}" width="1600" height="900" loading="lazy" decoding="async" alt="{E(b['id'])} at {secs(f['t'])} s: {E(f['caption'])}">
      <figcaption><span class="tc">{f['t']:.2f} s</span><span class="cap">{E(f['caption'])}</span></figcaption>
      <details class="draw"><summary>Drawing spec</summary><p>{E(f['draw'])}</p></details>
    </figure>''')
    sections.append(f'''<section class="beat" id="{b['id'].lower()}">
  <header class="beat-head">
    <div class="meta"><span class="bid">{E(b['id'])}</span><span class="span">{b['t0']:.2f}–{b['t1']:.2f} s</span><span class="dur">{b['t1'] - b['t0']:.1f} s</span><span class="tag s-{b['style']}">{E(STYLE_LABEL.get(b['style'], b['style']))}</span></div>
    <h2>{E(b['name'])}</h2>
  </header>
  <div class="lines">
    <div class="line vo"><h4>Voice-over</h4><p>{E(b['vo'])}</p></div>
    <div class="line os"><h4>On screen</h4><p>{E(b['onScreen'])}</p></div>
  </div>
  <div class="frames n{len(frames)}">
    {''.join(figs)}
  </div>
  <div class="spec">
    <div><h4>Visual</h4><p>{E(b['visual'])}</p></div>
    <div><h4>Motion</h4><p>{E(b['motion'])}</p></div>
    <div><h4>Transition out</h4><p>{E(b['transitionOut'])}</p></div>
  </div>
</section>''')

questions = ''.join(f'<li>{E(q)}</li>' for q in sb['questions'])
devs = ''.join(f'<li>{E(d)}</li>' for d in sb.get('styleframes', {}).get('deviations', []))
cover = beats[4]['frames'][2]['file'].replace('site/', '')
title_main = sb['title'].split(':')[1].split('(')[0].strip() if ':' in sb['title'] else sb['title']
title_main = title_main[:1].upper() + title_main[1:]

page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wicflow Hero Storyboard</title>
<meta name="description" content="Storyboard for Wicflow’s hero explainer: {nframes} styleframes across {len(beats)} beats, {total:g} s, looping.">
<style>
{FONTS}
:root{{
  --bg:#F5F6FA; --surface:#FFFFFF; --surface-2:#EEF0F7; --ink:#0B1220; --muted:#4B556A; --faint:#7A8398;
  --line:rgba(11,18,32,.10); --accent:#4C5BDB; --accent-soft:rgba(97,114,243,.10); --peach:#C2643F;
  --plate:#0B1220; --shadow:0 1px 2px rgba(11,18,32,.06),0 12px 32px rgba(11,18,32,.08);
  --s-mixed:#8A6BE0; --s-3d:#4C5BDB; --s-kin:#C2643F; --s-ui:#1F8A63;
  color-scheme:light;
}}
@media (prefers-color-scheme: dark){{
  :root:not([data-theme="light"]){{
    --bg:#0B1220; --surface:#101930; --surface-2:#141E38; --ink:#F3F5FA; --muted:rgba(223,230,243,.72); --faint:rgba(223,230,243,.5);
    --line:rgba(255,255,255,.10); --accent:#B9C1FF; --accent-soft:rgba(185,193,255,.10); --peach:#ffd9c8;
    --plate:#060B16; --shadow:0 0 0 1px rgba(255,255,255,.06),0 18px 40px rgba(0,0,0,.35);
    --s-mixed:#C7B6FF; --s-3d:#B9C1FF; --s-kin:#ffc4ad; --s-ui:#7FE0B4;
    color-scheme:dark;
  }}
}}
:root[data-theme="dark"]{{
  --bg:#0B1220; --surface:#101930; --surface-2:#141E38; --ink:#F3F5FA; --muted:rgba(223,230,243,.72); --faint:rgba(223,230,243,.5);
  --line:rgba(255,255,255,.10); --accent:#B9C1FF; --accent-soft:rgba(185,193,255,.10); --peach:#ffd9c8;
  --plate:#060B16; --shadow:0 0 0 1px rgba(255,255,255,.06),0 18px 40px rgba(0,0,0,.35);
  --s-mixed:#C7B6FF; --s-3d:#B9C1FF; --s-kin:#ffc4ad; --s-ui:#7FE0B4;
  color-scheme:dark;
}}
*{{box-sizing:border-box}}
html{{-webkit-text-size-adjust:100%}}
body{{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.6 'WF Inter',system-ui,-apple-system,'Segoe UI',sans-serif;overflow-x:hidden}}
img{{max-width:100%;height:auto;display:block}}
a{{color:inherit}}
.wrap{{max-width:1280px;margin:0 auto;padding:0 16px}}
@media (min-width:720px){{.wrap{{padding:0 32px}}}}
h1,h2,h3{{font-family:'WF Headline','WF Inter',system-ui,sans-serif;font-weight:500;letter-spacing:-.02em;line-height:1.05;margin:0}}
h4{{font:400 12px/1.4 'WF Mono',ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);margin:0 0 8px}}
.mono{{font-family:'WF Mono',ui-monospace,Menlo,monospace}}
.top{{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0}}
.brandline{{font:400 13px/1.3 'WF Mono',ui-monospace,monospace;color:var(--muted);letter-spacing:.04em}}
.toggle{{font:500 13px/1 'WF Inter',system-ui,sans-serif;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:9px 14px;cursor:pointer;flex:none}}
.toggle:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
.hero{{padding:32px 0 8px}}
.eyebrow{{font:400 13px/1.4 'WF Mono',ui-monospace,monospace;color:var(--accent);letter-spacing:.06em;text-transform:uppercase;margin-bottom:16px}}
.hero h1{{font-size:clamp(40px,7vw,84px);max-width:14ch}}
.logline{{font-size:clamp(17px,1.6vw,20px);line-height:1.6;color:var(--muted);max-width:68ch;margin:24px 0 0}}
.facts{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:16px;overflow:hidden;margin:32px 0 0}}
.facts div{{background:var(--surface);padding:14px 16px}}
.facts dt{{font:400 11px/1.4 'WF Mono',ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--faint)}}
.facts dd{{margin:4px 0 0;font-weight:500;font-size:15px;line-height:1.35}}
.cover{{margin:32px 0 0;border-radius:18px;overflow:hidden;background:var(--plate);box-shadow:var(--shadow)}}
.cover figcaption{{padding:10px 16px;font-size:13px;color:#C9D0E0;background:var(--plate);display:flex;gap:12px;flex-wrap:wrap}}
.cover figcaption .tc{{font-family:'WF Mono',ui-monospace,monospace;color:#B9C1FF}}
.barwrap{{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line);margin-top:40px}}
.bar{{display:flex;gap:2px;padding:12px 0 22px;position:relative}}
.seg{{flex:0 1 auto;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;text-decoration:none;font:400 11px/1 'WF Mono',ui-monospace,monospace;color:var(--ink);background:var(--surface-2);border-top:3px solid var(--s-3d);min-width:0;overflow:hidden}}
.seg span{{white-space:nowrap}}
.seg:hover,.seg:focus-visible{{background:var(--accent-soft);outline:none}}
.ticks{{position:absolute;left:0;right:0;bottom:4px;height:14px}}
.ticks span{{position:absolute;transform:translateX(0);font:400 10px/1 'WF Mono',ui-monospace,monospace;color:var(--faint)}}
.ticks span.end{{transform:translateX(-100%)}}
.s-mixed{{--sc:var(--s-mixed)}} .s-3d-blocks{{--sc:var(--s-3d)}} .s-kinetic-type{{--sc:var(--s-kin)}} .s-flat-ui{{--sc:var(--s-ui)}}
.seg{{border-top-color:var(--sc)}}
.legend{{display:flex;flex-wrap:wrap;gap:8px 16px;margin:16px 0 0;font-size:13px;color:var(--muted)}}
.legend span::before{{content:"";display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--sc);margin-right:6px;vertical-align:-1px}}
section.block{{padding:72px 0 0}}
.section-title{{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px}}
.section-title h2{{font-size:clamp(28px,3.4vw,40px)}}
.section-title p{{margin:0;color:var(--muted);font-size:14px}}
.notes{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:16px}}
.note{{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px 22px}}
.note h3{{font-size:20px;margin-bottom:10px}}
.note p{{margin:0;font-size:14.5px;line-height:1.65;color:var(--muted);overflow-wrap:anywhere}}
.beat{{padding:80px 0 0;scroll-margin-top:72px}}
.beat-head .meta{{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;font:400 13px/1.3 'WF Mono',ui-monospace,monospace;color:var(--muted)}}
.bid{{color:var(--ink);font-weight:400;background:var(--surface-2);border-radius:6px;padding:4px 8px}}
.span{{color:var(--ink)}}
.tag{{border:1px solid var(--line);border-radius:999px;padding:3px 10px}}
.tag::before{{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--sc);margin-right:6px}}
.beat-head h2{{font-size:clamp(30px,4.2vw,52px);margin:14px 0 0;max-width:22ch}}
.lines{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:16px;margin:24px 0 0}}
.line{{border-left:2px solid var(--line);padding:2px 0 2px 16px}}
.line.vo{{border-left-color:var(--accent)}}
.line p{{margin:0;font-size:17px;line-height:1.55}}
.line.vo p{{font-family:'WF Headline','WF Inter',sans-serif;font-size:21px;letter-spacing:-.01em;line-height:1.35}}
.frames{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:24px 20px;margin:28px 0 0}}
.frame{{margin:0;min-width:0}}
.frame img{{border-radius:14px;background:var(--plate);box-shadow:var(--shadow);aspect-ratio:16/9;width:100%}}
@media (min-width:1000px){{.frame.wide{{grid-column:1/-1}}}}
.frame figcaption{{display:flex;gap:12px;align-items:baseline;margin:12px 2px 0;font-size:15px;line-height:1.45}}
.tc{{font:400 13px/1.4 'WF Mono',ui-monospace,monospace;color:var(--accent);flex:none;min-width:58px}}
.draw{{margin:8px 2px 0 72px}}
.draw summary{{cursor:pointer;font:400 12px/1.4 'WF Mono',ui-monospace,monospace;color:var(--faint);letter-spacing:.04em;list-style:none;display:inline-flex;gap:6px;align-items:center}}
.draw summary::-webkit-details-marker{{display:none}}
.draw summary::before{{content:"+";display:inline-block;width:12px;text-align:center}}
.draw[open] summary::before{{content:"–"}}
.draw p{{margin:8px 0 0;font-size:13px;line-height:1.6;color:var(--muted);overflow-wrap:anywhere}}
@media (max-width:560px){{.draw{{margin-left:0}}}}
.spec{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px 32px;margin:32px 0 0;padding:24px 0 0;border-top:1px solid var(--line)}}
.spec p{{margin:0;font-size:14.5px;line-height:1.7;color:var(--muted);overflow-wrap:anywhere}}
.questions ol{{margin:0;padding:0;list-style:none;counter-reset:q;display:grid;gap:12px}}
.questions li{{counter-increment:q;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px 20px 18px 64px;position:relative;font-size:16px;line-height:1.6}}
.questions li::before{{content:counter(q,decimal-leading-zero);position:absolute;left:20px;top:19px;font:400 14px/1.5 'WF Mono',ui-monospace,monospace;color:var(--accent)}}
.devs{{margin:16px 0 0;padding-left:20px;color:var(--muted);font-size:14px;line-height:1.65}}
.devs li{{margin:0 0 6px}}
details.more{{margin:24px 0 0;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:16px 20px}}
details.more summary{{cursor:pointer;font-weight:500}}
footer{{padding:72px 0 48px;color:var(--faint);font-size:13px}}
footer p{{margin:0 0 6px;max-width:80ch}}
@media (prefers-reduced-motion:no-preference){{html{{scroll-behavior:smooth}}}}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div class="brandline">Wicflow · WKConversions</div>
    <button class="toggle" type="button" id="themeBtn" aria-label="Switch colour theme">Theme</button>
  </div>
  <header class="hero">
    <div class="eyebrow">Hero explainer · Storyboard</div>
    <h1>{E(title_main)}</h1>
    <p class="logline">{E(sb['logline'])}</p>
    <dl class="facts">
      <div><dt>Length</dt><dd>{total:g} s, loops</dd></div>
      <div><dt>Format</dt><dd>16:9 · 1920×1080</dd></div>
      <div><dt>Frame rate</dt><dd>60 fps</dd></div>
      <div><dt>Sound</dt><dd>Works muted · optional English VO</dd></div>
      <div><dt>Beats</dt><dd>{len(beats)}</dd></div>
      <div><dt>Styleframes</dt><dd>{nframes}, rendered</dd></div>
    </dl>
    <figure class="cover">
      <img src="{E(cover)}" width="1600" height="900" alt="Styleframe B5 at 18.4 s: the periwinkle first block in the wireframe company, labelled First block · guaranteed.">
      <figcaption><span class="tc">B5 · 18.40 s</span><span>{E(beats[4]['frames'][2]['caption'])} The signature beat: the costed plan lies down as the ground and its top row rises as the first block.</span></figcaption>
    </figure>
  </header>
</div>
<div class="barwrap"><div class="wrap"><nav class="bar" aria-label="Beats on the timeline">{''.join(bar)}<div class="ticks" aria-hidden="true">{ticks}</div></nav></div></div>
<div class="wrap">
  <div class="legend"><span class="s-3d-blocks">3D blocks</span><span class="s-flat-ui">Flat UI</span><span class="s-kinetic-type">Kinetic type</span><span class="s-mixed">Mixed</span></div>
  <section class="block" id="direction">
    <div class="section-title"><h2>Direction</h2><p>The rules every beat follows.</p></div>
    <div class="notes">{''.join(notes)}</div>
  </section>
  <main>
    {''.join(sections)}
  </main>
  <section class="block questions" id="questions">
    <div class="section-title"><h2>Open questions</h2><p>For Karl and Wicflow before the animatic.</p></div>
    <ol>{questions}</ol>
    <details class="more"><summary>Where the styleframes differ from the drawing specs</summary><ul class="devs">{devs}</ul></details>
  </section>
  <footer>
    <p>Styleframes are drawn as code (HTML and SVG, 1920×1080) with Wicflow’s own fonts and mark, harvested from wicflow.com; the source is in <span class="mono">films/wicflow/plan/storyboard/frames-src/</span>, and the full storyboard is <span class="mono">storyboard.json</span>.</p>
    <p>Kallio Lämpö is the made-up example company from wicflow.com. Every on-screen phrase comes from the site.</p>
  </footer>
</div>
<script>
(function () {{
  var root = document.documentElement, btn = document.getElementById('themeBtn');
  function stored() {{ try {{ return localStorage.getItem('wf-theme'); }} catch (e) {{ return null; }} }}
  function current() {{
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }}
  function label() {{ btn.textContent = current() === 'dark' ? 'Light theme' : 'Dark theme'; }}
  var s = stored(); if (s === 'light' || s === 'dark') root.setAttribute('data-theme', s);
  label();
  btn.addEventListener('click', function () {{
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {{ localStorage.setItem('wf-theme', next); }} catch (e) {{}}
    label();
  }});
}})();
</script>
</body>
</html>
'''
open(os.path.join(HERE, 'site', 'index.html'), 'w', encoding='utf-8').write(page)
print('wrote site/index.html', len(page), 'bytes;', nframes, 'frames')
