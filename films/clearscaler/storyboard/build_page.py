# Builds the one-page storyboard (production/output-format.md) from storyboard/frames.json and the rendered frames.
#   python3 storyboard/build_page.py   -> storyboard/index.html (frames referenced from storyboard/frames/, film as film.mp4)
# Dark single-theme page in ClearScaler's own type (Outfit, Manrope, Geist Mono), like the film.
import json, os, html
R = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(R, "frames.json")))
e = lambda s: html.escape(str(s))

CSS = """
/* Layout: one reading column, the film first, then a frame per phrase in a wrapping grid; ClearScaler's dark site as the ground. */
:root {
  --night: #07080C; --panel: #101012; --raise: #19191B; --rule: #2B2B2D;
  --ink: #EDEFF3; --ink2: #B0B1B3; --ink3: #8E8F91; --orange: #FC7F48; --green: #4BC680;
  --display: "Outfit", "Manrope", system-ui, sans-serif; --body: "Manrope", system-ui, sans-serif; --mono: "Geist Mono", ui-monospace, Menlo, monospace;
  color-scheme: dark;
}
body { background: var(--night); color: var(--ink); font: 15px/1.6 var(--body); margin: 0; }
.wrap { max-width: 1240px; margin: 0 auto; padding-inline: 20px; padding-block: 40px 96px; display: grid; gap: 44px; }
h1 { font: 600 clamp(34px, 5vw, 56px)/1.02 var(--display); letter-spacing: -0.045em; margin: 0; text-wrap: balance; }
h1 em { font-style: normal; color: var(--orange); }
h2 { font: 600 24px/1.2 var(--display); letter-spacing: -0.03em; margin: 0 0 14px; text-wrap: balance; }
h3 { font: 600 18px/1.3 var(--display); letter-spacing: -0.02em; margin: 0; }
.eyebrow, .mono { font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink3); }
.lede { color: var(--ink2); max-width: 68ch; margin: 10px 0 0; }
video { width: 100%; max-width: 100%; aspect-ratio: 16 / 9; border-radius: 14px; background: #000; border: 1px solid var(--rule); display: block; }
.qc { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.qc span { border: 1px solid var(--rule); background: var(--panel); border-radius: 999px; padding: 4px 12px; font-size: 13px; color: var(--ink2); }
.qc b { color: var(--ink); font-weight: 600; }
.dir { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: 14px; overflow: hidden; }
.dir div { background: var(--panel); padding: 14px 16px; min-width: 0; }
.dir b { display: block; margin-bottom: 4px; }
.beat { display: grid; gap: 14px; padding-top: 22px; border-top: 1px solid var(--rule); }
.beat-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; }
.cap { font: 600 22px/1.25 var(--display); letter-spacing: -0.025em; }
.cap em { font-style: normal; color: var(--orange); }
.idea { color: var(--ink2); max-width: 80ch; margin: 0; }
.frames { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 18px; }
.fr { display: grid; gap: 6px; min-width: 0; }
.fr img { width: 100%; max-width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 10px; border: 1px solid var(--rule); background: #000; display: block; }
.fr .t { font-family: var(--mono); font-size: 12px; color: var(--ink3); font-variant-numeric: tabular-nums; }
.fr .s { font-size: 13.5px; }
.fr .m { font-size: 13px; color: var(--ink2); }
ul { margin: 0; padding-left: 20px; display: grid; gap: 6px; max-width: 90ch; }
.tbl { overflow-x: auto; border: 1px solid var(--rule); border-radius: 12px; }
table { border-collapse: collapse; width: 100%; font-size: 13.5px; min-width: 720px; }
th, td { text-align: left; vertical-align: top; padding: 10px 12px; border-bottom: 1px solid var(--rule); }
th { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink3); font-weight: 500; background: var(--panel); }
details { border: 1px solid var(--rule); border-radius: 12px; background: var(--panel); }
details + details { margin-top: 10px; }
summary { cursor: pointer; padding: 12px 16px; font-weight: 600; }
summary:focus-visible, a:focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }
pre { margin: 0; padding: 0 16px 16px; white-space: pre-wrap; font: 12.5px/1.55 var(--mono); color: var(--ink2); overflow-x: auto; }
a { color: var(--orange); }
@media (max-width: 520px) { .wrap { padding-inline: 16px; gap: 34px; } .cap { font-size: 19px; } }
"""

def cap(text, keys):
    out = []
    for w in text.split(" "):
        out.append(f"<em>{e(w)}</em>" if w in keys else e(w))
    return " ".join(out)

o = [f"<title>{e(d['title'])}</title>",
     '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
     '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600&family=Manrope:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">',
     f"<style>{CSS}</style>", '<div class="wrap">',
     f'<header><div class="eyebrow">{e(d["eyebrow"])}</div><h1>{d["headline"]}</h1><p class="lede">{e(d["subtitle"])}</p></header>']
if d.get("film"):
    o.append(f'<section><video controls muted playsinline preload="metadata" poster="{e(d.get("poster", ""))}" src="{e(d["film"])}"></video>')
    if d.get("qc"):
        o.append('<div class="qc">' + "".join(f"<span><b>{e(k)}</b> {e(v)}</span>" for k, v in d["qc"].items()) + "</div>")
    o.append("</section>")
o.append('<section><h2>Project direction</h2><div class="dir">' + "".join(f'<div><b class="mono">{e(k)}</b>{e(v)}</div>' for k, v in d["direction"].items()) + "</div></section>")
o.append('<section><h2>Storyboard</h2><p class="lede" style="margin:0 0 6px">A frame per phrase, rendered from the Remotion project itself. Captions are the narration: the film is silent.</p>')
for b in d["beats"]:
    o.append(f'<div class="beat"><div class="beat-head"><span class="mono">{e(b["id"])} · {e(b["time"])}</span><h3>{e(b["title"])}</h3></div>')
    if b.get("caption"): o.append(f'<div class="cap">{cap(b["caption"], b.get("key", []))}</div>')
    if b.get("idea"): o.append(f'<p class="idea">{e(b["idea"])}</p>')
    o.append('<div class="frames">')
    for f in b["frames"]:
        o.append(f'<div class="fr"><img loading="lazy" src="frames/f{int(f["frame"]):04d}.png" alt="{e(f.get("shows", ""))}">'
                 f'<div class="t">{float(f["frame"]) / 30:.1f} s · frame {f["frame"]}</div>'
                 f'<div class="s">{e(f.get("shows", ""))}</div><div class="m">{e(f.get("moves", ""))}</div></div>')
    o.append("</div></div>")
o.append("</section>")
def lst(title, items):
    if items: o.append(f"<section><h2>{e(title)}</h2><ul>" + "".join(f"<li>{e(i)}</li>" for i in items) + "</ul></section>")
lst("Notes", d.get("notes"))
if d.get("revisions"):
    o.append('<section><h2>Revision log</h2><div class="tbl"><table><tr><th>Before</th><th>After</th><th>Why</th></tr>'
             + "".join(f"<tr><td>{e(r[0])}</td><td>{e(r[1])}</td><td>{e(r[2])}</td></tr>" for r in d["revisions"]) + "</table></div></section>")
lst("Open questions", d.get("open"))
if d.get("appendix"):
    o.append("<section><h2>Appendix</h2>" + "".join(f"<details><summary>{e(k)}</summary><pre>{e(v)}</pre></details>" for k, v in d["appendix"].items()) + "</section>")
o.append("</div>")
open(os.path.join(R, "index.html"), "w").write("\n".join(o))
print("storyboard/index.html")
