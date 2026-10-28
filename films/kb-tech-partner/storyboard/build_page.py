# Builds the one-page storyboard (production/output-format.md) from storyboard/frames.json, storyboard/revisions.json,
# storyboard/qc.json and the frames rendered from the final film.
#   python3 storyboard/build_page.py   -> storyboard/artifact.html (published as the private artifact, with film.mp4 and frames/)
#                                         storyboard/index.html    (the same page with a document skeleton, for the repo)
# K.B's own look: the site's light canvas and navy, Montserrat, cyan only as a mark.
import json, os, html
R = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(R, "frames.json")))
rev = json.load(open(os.path.join(R, "revisions.json"))) if os.path.exists(os.path.join(R, "revisions.json")) else []
qc = json.load(open(os.path.join(R, "qc.json"))) if os.path.exists(os.path.join(R, "qc.json")) else {}
e = lambda s: html.escape(str(s))
read = lambda p: open(os.path.join(R, p)).read() if os.path.exists(os.path.join(R, p)) else ""

CSS = """
/* Layout: one reading column; the film first, then a frame per phrase in a wrapping grid, then notes and the working tables. */
:root {
  --bg: #F7F7F7; --panel: #FFFFFF; --ink: #252525; --muted: #49525B; --navy: #293A51; --line: #E2E8F0; --cyan: #38C8FF; --chip: #EBECF4;
  --sans: "Montserrat", "Segoe UI", system-ui, sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #111923; --panel: #18222F; --ink: #EEF2F7; --muted: #A9B4C2; --navy: #A8C1E2; --line: #2A3546; --cyan: #38C8FF; --chip: #212D3D; color-scheme: dark } }
:root[data-theme="dark"] { --bg: #111923; --panel: #18222F; --ink: #EEF2F7; --muted: #A9B4C2; --navy: #A8C1E2; --line: #2A3546; --cyan: #38C8FF; --chip: #212D3D; color-scheme: dark }
body { background: var(--bg); color: var(--ink); font: 15px/1.6 var(--sans); }
.wrap { max-width: 1180px; margin: 0 auto; padding-inline: 20px; padding-block: 40px 96px; display: grid; gap: 48px; }
h1 { font: 800 clamp(34px, 5.4vw, 60px)/1.02 var(--sans); letter-spacing: -0.04em; margin: 6px 0 0; text-wrap: balance; color: var(--navy); }
h1 em { font-style: normal; box-shadow: inset 0 -0.16em 0 var(--cyan); }
h2 { font: 700 22px/1.25 var(--sans); letter-spacing: -0.02em; margin: 0 0 14px; text-wrap: balance; color: var(--navy); }
h3 { font: 700 17px/1.35 var(--sans); letter-spacing: -0.01em; margin: 0; text-wrap: balance; }
.eyebrow, .mono { font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.lede { color: var(--muted); max-width: 68ch; margin: 12px 0 0; }
video { width: 100%; max-width: 100%; aspect-ratio: 16 / 9; border-radius: 16px; background: #000; display: block; box-shadow: 0 30px 70px -40px rgba(41,58,81,.5); }
.qc { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.qc span { background: var(--chip); border-radius: 999px; padding: 5px 13px; font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
.qc b { color: var(--ink); font-weight: 700; }
.dir { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.dir div { background: var(--panel); padding: 14px 16px; min-width: 0; }
.dir b { display: block; margin-bottom: 4px; }
.beat { display: grid; gap: 14px; padding-top: 24px; border-top: 1px solid var(--line); }
.beat-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; }
.frames { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 20px; }
.fr { display: grid; gap: 6px; align-content: start; min-width: 0; }
.fr img { width: 100%; max-width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 10px; background: var(--chip); display: block; }
.fr .t { font-family: var(--mono); font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.fr .p { font-weight: 700; font-size: 14px; }
.fr .w { font-size: 12.5px; color: var(--navy); }
.fr .w::before { content: "on screen: "; color: var(--muted); }
.fr .m { font-size: 13.5px; color: var(--muted); }
ul { margin: 0; padding-left: 20px; display: grid; gap: 6px; max-width: 90ch; }
.tbl { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
table { border-collapse: collapse; width: 100%; font-size: 13.5px; min-width: 760px; }
th, td { text-align: left; vertical-align: top; padding: 10px 12px; border-bottom: 1px solid var(--line); }
tr:last-child td { border-bottom: 0; }
th { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
td.n { font-variant-numeric: tabular-nums; white-space: nowrap; }
.ok { color: #1F8A5B; font-weight: 700; } .no { color: #C2410C; font-weight: 700; }
details { border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
details + details { margin-top: 10px; }
summary { cursor: pointer; padding: 12px 16px; font-weight: 700; }
summary:focus-visible, a:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
pre { margin: 0; padding: 0 16px 16px; white-space: pre-wrap; font: 12.5px/1.55 var(--mono); color: var(--muted); overflow-x: auto; }
a { color: var(--navy); }
@media (max-width: 520px) { .wrap { padding-inline: 16px; gap: 36px; } }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
"""

o = [f"<title>{e(d['title'])}</title>",
     '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
     '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap">',
     f"<style>{CSS}</style>", '<div class="wrap">',
     f'<header><div class="eyebrow">{e(d["eyebrow"])}</div><h1>{d["headline"]}</h1><p class="lede">{e(d["subtitle"])}</p></header>']
o.append(f'<section><video controls playsinline preload="metadata" poster="{e(d["poster"])}" src="{e(d["film"])}"></video>')
if qc.get("chips"):
    o.append('<div class="qc">' + "".join(f"<span><b>{e(k)}</b> {e(v)}</span>" for k, v in qc["chips"].items()) + "</div>")
o.append("</section>")
o.append('<section><h2>Project direction</h2><div class="dir">' + "".join(f'<div><b class="mono">{e(k)}</b>{e(v)}</div>' for k, v in d["direction"].items()) + "</div></section>")
o.append('<section><h2>Storyboard</h2><p class="lede" style="margin:0 0 8px">A frame per phrase, taken from the delivered film. "On screen" lists the only words the film shows; everything else is picture.</p>')
for b in d["beats"]:
    o.append(f'<div class="beat"><div class="beat-head"><span class="mono">Beat {e(b["id"])} · {e(b["time"])}</span><h3>{e(b["title"])}</h3></div><div class="frames">')
    for f in b["frames"]:
        o.append(f'<figure class="fr" style="margin:0"><img loading="lazy" src="frames/t{float(f["t"]):05.2f}.jpg" alt="{e(f["phrase"])} at {e(f["t"])} s">'
                 f'<span class="t">{e(f["t"])} s</span><span class="p">{e(f["phrase"])}</span>'
                 + (f'<span class="w">{e(f["words"])}</span>' if f.get("words") else "") + f'<span class="m">{e(f["what"])}</span></figure>')
    o.append("</div></div>")
o.append("</section>")
o.append('<section><h2>Notes</h2><ul>' + "".join(f"<li>{e(n)}</li>" for n in d["notes"]) + "</ul></section>")
o.append('<section><h2>Open questions</h2><ul>' + "".join(f"<li>{e(n)}</li>" for n in d["questions"]) + "</ul></section>")
if rev:
    o.append('<section><h2>Revision log</h2><p class="lede" style="margin:0 0 12px">From the art-director pass: four independent reviews (story, truth, legibility, brand) and a judgement pass on the draft.</p><div class="tbl"><table><tr><th>Before</th><th>After</th><th>Why</th></tr>'
             + "".join(f"<tr><td>{e(r['before'])}</td><td>{e(r['after'])}</td><td>{e(r['why'])}</td></tr>" for r in rev) + "</table></div></section>")
if qc.get("rows"):
    o.append('<section><h2>Quality check</h2><div class="tbl"><table><tr><th>Check</th><th>Result</th><th>Target</th><th></th></tr>'
             + "".join(f"<tr><td>{e(r[0])}</td><td class=\"n\">{e(r[1])}</td><td>{e(r[2])}</td><td class=\"{'ok' if r[3] else 'no'}\">{'pass' if r[3] else 'look'}</td></tr>" for r in qc["rows"])
             + "</table></div>" + (f'<p class="lede">{e(qc["note"])}</p>' if qc.get("note") else "") + "</section>")
o.append('<section><h2>Appendix</h2>')
for name, f in [("Beat sheet and arc", "beats.md"), ("Production plan (phrases, continuity, variety)", "plan.md"), ("Thesis and allowed patterns", "thesis.md"), ("Brief", "brief.md")]:
    t = read(f)
    if t: o.append(f"<details><summary>{e(name)}</summary><pre>{e(t)}</pre></details>")
o.append("</section></div>")
body = "\n".join(o)
open(os.path.join(R, "artifact.html"), "w").write(body)
open(os.path.join(R, "index.html"), "w").write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
                                                '<style>body{margin:0}img{max-width:100%}</style></head><body>' + body + "</body></html>")
print("storyboard/artifact.html and storyboard/index.html:", len(body) // 1024, "KB")
