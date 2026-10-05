# Builds the storyboard page (production/output-format.md) from storyboard/frames.json and frames extracted from the film:
#   python3 storyboard/build_page.py   -> storyboard/index.html (frames from storyboard/frames/, the film as film.mp4)
# In Wicflow's own type and palette (Space Grotesk, Manrope; white, ink, the live-AI blue), light and dark.
import json, os, html
R = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(R, "frames.json")))
qc = json.load(open(os.path.join(R, "qc.json"))) if os.path.exists(os.path.join(R, "qc.json")) else {}
e = lambda s: html.escape(str(s))

CSS = """
/* One reading column: the film first, then the direction, then a frame per phrase in a wrapping grid. */
:root {
  --paper: #FFFFFF; --surface: #F6F7F9; --ink: #17171B; --muted: #5F606A; --line: #E2E3E8;
  --blue: #1769C2; --tint: #E6EDF7; --sand: #F0E9DC; --sage: #E5EEE6;
  --display: "Space Grotesk", "Manrope", system-ui, sans-serif; --body: "Manrope", system-ui, -apple-system, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --paper: #0F1013; --surface: #17181C; --ink: #EDEEF2; --muted: #A3A4AD; --line: #2A2B32;
  --blue: #5A9BE8; --tint: #172338; --sand: #2A251C; --sage: #1C2A20; color-scheme: dark } }
:root[data-theme="dark"] {
  --paper: #0F1013; --surface: #17181C; --ink: #EDEEF2; --muted: #A3A4AD; --line: #2A2B32;
  --blue: #5A9BE8; --tint: #172338; --sand: #2A251C; --sage: #1C2A20; color-scheme: dark }
body { background: var(--paper); color: var(--ink); font: 16px/1.6 var(--body); margin: 0; }
.wrap { max-width: 1180px; margin: 0 auto; padding-inline: 20px; padding-block: 48px 96px; display: grid; gap: 56px; }
header { display: grid; gap: 14px; }
.eyebrow { font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 10px; }
.eyebrow::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: var(--blue); box-shadow: 0 0 0 5px color-mix(in srgb, var(--blue) 18%, transparent); }
h1 { font: 600 clamp(36px, 5.6vw, 64px)/1.02 var(--display); letter-spacing: -0.045em; margin: 0; text-wrap: balance; }
h1 em, .cap em { font-style: normal; color: var(--blue); }
h2 { font: 600 28px/1.15 var(--display); letter-spacing: -0.035em; margin: 0 0 18px; text-wrap: balance; }
h3 { font: 600 21px/1.25 var(--display); letter-spacing: -0.025em; margin: 0; }
.lede { color: var(--muted); max-width: 70ch; margin: 0; }
video { width: 100%; max-width: 100%; aspect-ratio: 16 / 9; border-radius: 20px; background: var(--surface); display: block; border: 1px solid var(--line); }
.qc { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.qc span { border: 1px solid var(--line); background: var(--surface); border-radius: 999px; padding: 5px 13px; font-size: 13.5px; color: var(--muted); }
.qc b { color: var(--ink); font-weight: 700; font-variant-numeric: tabular-nums; }
.dir { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; }
.dir div { background: var(--paper); padding: 16px 18px; min-width: 0; font-size: 15px; }
.dir b { display: block; font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
.beat { display: grid; gap: 16px; padding-top: 28px; border-top: 1px solid var(--line); }
.beat-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; }
.tc { font-size: 13px; font-weight: 700; color: var(--blue); font-variant-numeric: tabular-nums; }
.cap { font: 600 24px/1.25 var(--display); letter-spacing: -0.03em; text-wrap: balance; }
.idea { color: var(--muted); max-width: 82ch; margin: 0; }
.frames { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 20px; }
.fr { display: grid; gap: 6px; min-width: 0; align-content: start; }
.fr img { width: 100%; max-width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 12px; border: 1px solid var(--line); background: var(--surface); display: block; }
.fr .t { font-size: 12.5px; font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums; }
.fr .s { font-size: 14.5px; line-height: 1.45; }
.fr .m { font-size: 13px; color: var(--muted); }
ul { margin: 0; padding-left: 20px; display: grid; gap: 8px; max-width: 90ch; }
.tbl { overflow-x: auto; border: 1px solid var(--line); border-radius: 16px; }
table { border-collapse: collapse; width: 100%; font-size: 14px; min-width: 760px; }
th, td { text-align: left; vertical-align: top; padding: 11px 14px; border-bottom: 1px solid var(--line); }
tr:last-child td { border-bottom: 0; }
th { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 700; background: var(--surface); }
.credits { font-size: 14px; color: var(--muted); max-width: 90ch; display: grid; gap: 6px; }
a { color: var(--blue); }
a:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; border-radius: 4px; }
@media (max-width: 520px) { .wrap { padding-inline: 16px; gap: 40px; } .cap { font-size: 20px; } }
"""

def cap(text, keys):
    return " ".join(f"<em>{e(w)}</em>" if w in keys else e(w) for w in text.split(" "))

o = [f"<title>{e(d['title'])}</title>",
     '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
     '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@500;600&display=swap">',
     f"<style>{CSS}</style>", '<div class="wrap">',
     f'<header><div class="eyebrow">{e(d["eyebrow"])}</div><h1>{d["headline"]}</h1><p class="lede">{e(d["subtitle"])}</p></header>']
o.append(f'<section><video controls playsinline preload="metadata" poster="{e(d["poster"])}" src="{e(d["film"])}"></video>')
if qc:
    o.append('<div class="qc">' + "".join(f"<span><b>{e(k)}</b> {e(v)}</span>" for k, v in qc.items()) + "</div>")
o.append("</section>")
o.append('<section><h2>Direction</h2><div class="dir">' + "".join(f"<div><b>{e(k)}</b>{e(v)}</div>" for k, v in d["direction"].items()) + "</div></section>")
o.append('<section><h2>Storyboard</h2><p class="lede" style="margin-bottom:8px">A frame per phrase, taken from the finished film. Times are seconds into the film; the picture leads each spoken word by about four frames.</p>')
for b in d["beats"]:
    o.append(f'<div class="beat"><div class="beat-head"><span class="tc">{e(b["id"])} · {e(b["time"])}</span><h3>{e(b["title"])}</h3></div>')
    o.append(f'<div class="cap">{cap(b["caption"], b.get("key", []))}</div><p class="idea">{e(b["idea"])}</p><div class="frames">')
    for f in b["frames"]:
        o.append(f'<div class="fr"><img loading="lazy" src="frames/f{int(f["frame"]):04d}.jpg" alt="{e(f["shows"])}">'
                 f'<div class="t">{f["frame"] / 30:.1f} s</div><div class="s">{e(f["shows"])}</div><div class="m">{e(f["moves"])}</div></div>')
    o.append("</div></div>")
o.append("</section>")
o.append('<section><h2>Revision log</h2><div class="tbl"><table><tr><th>Before</th><th>After</th><th>Why</th></tr>'
         + "".join(f"<tr><td>{e(r[0])}</td><td>{e(r[1])}</td><td>{e(r[2])}</td></tr>" for r in d["revisions"]) + "</table></div></section>")
o.append("<section><h2>Open questions</h2><ul>" + "".join(f"<li>{e(i)}</li>" for i in d["open"]) + "</ul></section>")
o.append('<section class="credits"><h2>Credits</h2>'
         '<div>Voice: ElevenLabs, Christina (energetic commercial), supplied by Karl. Music: "It\'s Love" by Michael Ramir C., Mixkit (Mixkit Stock Music Free License). Effects: generated for this film.</div>'
         '<div>Copy, demo data, logo, fonts and the 15 tool logos: wicflow.com, as the site shows them. Made with Remotion by WKConversions.</div></section>')
o.append("</div>")
open(os.path.join(R, "index.html"), "w").write("\n".join(o))
print("storyboard/index.html")
