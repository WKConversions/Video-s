# Builds the one-page storyboard (production/output-format.md) from storyboard/frames.json and the rendered frames.
#   python3 storyboard/build_page.py            -> storyboard/index.html (+ copies frames into storyboard/frames/)
# frames.json: {"direction": {...}, "beats": [{"id": "B1", "title": "...", "vo": "...", "frames": [{"frame": 12, "time": "0.4",
#   "phrase": "a business", "words": "none", "shows": "...", "moves": "...", "transition": "..."}]}], "notes": [...], "revisions": [...],
#   "assets": [...], "tools": [...], "open": [...], "appendix": {"beats_md": "...", "variety": "...", "continuity": "..."}, "film": "film.mp4", "qc": {...}}
import json, os, html, shutil, sys
R = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(R)
d = json.load(open(os.path.join(R, "frames.json")))
os.makedirs(os.path.join(R, "frames"), exist_ok=True)
def esc(s): return html.escape(str(s))
out = [f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(d.get('title','Storyboard'))}</title>
<style>
:root{{--ink:#0E2038;--muted:#586B80;--line:#D9E3EE;--haze:#EFF6FC;--accent:#79B9FF;--bg:#FCFDFE}}
@media (prefers-color-scheme:dark){{:root:not([data-theme=light]){{--ink:#EAF1F8;--muted:#9FB0C3;--line:#2A3B52;--haze:#152538;--bg:#0E1A2B}}}}
:root[data-theme=dark]{{--ink:#EAF1F8;--muted:#9FB0C3;--line:#2A3B52;--haze:#152538;--bg:#0E1A2B}}
body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 Manrope,Inter,system-ui,sans-serif;padding:0 16px 80px}}
main{{max-width:1240px;margin:0 auto}} h1{{font-size:34px;letter-spacing:-.03em;margin:28px 0 4px}} h2{{font-size:22px;margin:40px 0 10px;letter-spacing:-.02em}} h3{{font-size:16px;margin:18px 0 6px}}
.sub{{color:var(--muted)}} .dir{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px 24px;background:var(--haze);padding:16px;border-radius:14px}}
.dir b{{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}}
.beat{{border-top:1px solid var(--line);padding-top:14px;margin-top:22px}} .vo{{font-size:18px;font-weight:600;margin:4px 0 10px}}
.frames{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}}
.fr img{{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:1px solid var(--line);background:#fff}}
.fr .t{{font-size:12px;color:var(--muted);margin-top:6px}} .fr .p{{font-weight:600}} .fr .s{{font-size:13px}} .fr .m{{font-size:13px;color:var(--muted)}}
table{{border-collapse:collapse;width:100%;font-size:13px}} td,th{{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}}
details{{margin:10px 0}} summary{{cursor:pointer;font-weight:600}} pre{{white-space:pre-wrap;background:var(--haze);padding:12px;border-radius:10px;font-size:12px}}
video{{width:100%;border-radius:12px;background:#000}} .qc{{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:var(--muted)}}
ul{{padding-left:20px}} li{{margin:4px 0}}
</style></head><body><main>
<h1>{esc(d.get('title','Storyboard'))}</h1><div class="sub">{esc(d.get('subtitle',''))}</div>"""]
if d.get("film"):
    out.append(f'<h2>The film</h2><video controls preload="metadata" src="{esc(d["film"])}"></video>')
    if d.get("qc"): out.append('<div class="qc">' + "".join(f"<span><b>{esc(k)}</b> {esc(v)}</span>" for k, v in d["qc"].items()) + "</div>")
out.append("<h2>Project direction</h2><div class=\"dir\">" + "".join(f"<div><b>{esc(k)}</b>{esc(v)}</div>" for k, v in d.get("direction", {}).items()) + "</div>")
out.append("<h2>Storyboard</h2><div class=\"sub\">A frame per phrase, rendered from the Remotion project itself.</div>")
for b in d.get("beats", []):
    out.append(f'<div class="beat"><h3>{esc(b["id"])} · {esc(b["title"])} <span class="sub">{esc(b.get("time",""))}</span></h3><div class="vo">“{esc(b["vo"])}”</div>')
    if b.get("idea"): out.append(f'<div class="s" style="margin-bottom:10px">{esc(b["idea"])}</div>')
    out.append('<div class="frames">')
    for f in b.get("frames", []):
        src = os.path.join(P, "film", "out", "test", f"f{int(f['frame']):04d}.png")
        dst = os.path.join(R, "frames", f"f{int(f['frame']):04d}.png")
        if os.path.exists(src): shutil.copy(src, dst)
        out.append(f'<div class="fr"><img src="frames/f{int(f["frame"]):04d}.png" alt=""><div class="t">{esc(f.get("time",""))} s · frame {f["frame"]} · <span class="p">{esc(f.get("phrase",""))}</span></div>'
                   f'<div class="s"><b>On screen:</b> {esc(f.get("words","none"))} · {esc(f.get("shows",""))}</div><div class="m"><b>Moves:</b> {esc(f.get("moves",""))}</div>'
                   + (f'<div class="m"><b>Into next:</b> {esc(f["transition"])}</div>' if f.get("transition") else "") + "</div>")
    out.append("</div></div>")
def section(title, items):
    if items: out.append(f"<h2>{esc(title)}</h2><ul>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ul>")
section("Notes", d.get("notes"))
if d.get("revisions"):
    out.append("<h2>Revision log</h2><table><tr><th>Before</th><th>After</th><th>Why</th></tr>" + "".join(f"<tr><td>{esc(r[0])}</td><td>{esc(r[1])}</td><td>{esc(r[2])}</td></tr>" for r in d["revisions"]) + "</table>")
section("Asset requests", d.get("assets")); section("Tool requests", d.get("tools")); section("Open questions", d.get("open"))
if d.get("appendix"):
    out.append("<h2>Appendix</h2>")
    for k, v in d["appendix"].items(): out.append(f"<details><summary>{esc(k)}</summary><pre>{esc(v)}</pre></details>")
out.append("</main></body></html>")
open(os.path.join(R, "index.html"), "w").write("\n".join(out)); print("storyboard/index.html")
