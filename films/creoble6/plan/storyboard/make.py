# Builds the Creoble v6 storyboard page from the build itself: frames pulled from the 540p render at the times below,
# the film as a web encode at the top, the motion numbers beside it. Re-run after every revision, then republish
# site/index.html with the files listed in site/files.json.
#   python3 make.py ../../film/out/film540.mp4 [--motion ../../film/out/film-motion.txt]
import html, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.join(HERE, "site"); FR = os.path.join(SITE, "frames")
SRC = sys.argv[1]; MOTION = sys.argv[sys.argv.index("--motion") + 1] if "--motion" in sys.argv else None
VERSION = "v6"; DATE = "10 Nov 2026"

# (id, title, t0, t1, VO line, on-screen words, what moves (the scene), transition out, [(time, caption), ...])
from beats import BEATS, NOTES, QUESTIONS, REVISIONS

def grab(t, name):
    out = os.path.join(FR, name)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", SRC, "-frames:v", "1", "-q:v", "4", out], check=True)
    return f"frames/{name}"

def esc(s): return html.escape(s, quote=True)

def main():
    os.makedirs(FR, exist_ok=True); files = {}
    motion = ""
    if MOTION and os.path.exists(MOTION): motion = open(MOTION).read().splitlines()[0].split("(")[0].strip()
    poster = grab(1.5, "poster.jpg"); files[poster] = os.path.join(SITE, poster)
    film = os.path.join(SITE, "film.mp4")
    if os.path.exists(film): files["film.mp4"] = film
    nav, sections, n = [], [], 0
    for (bid, title, t0, t1, vo, words, shown, out, frames) in BEATS:
        nav.append(f'<a href="#{bid}"><span class="tc">{t0:.2f}</span>{esc(title)}</a>')
        figs = []
        for j, (t, cap) in enumerate(frames):
            n += 1; src = grab(t, f"{bid}-{j + 1}.jpg"); files[src] = os.path.join(SITE, src)
            figs.append(f'<figure><img src="{src}" alt="{esc(title)} at {t:.2f} s: {esc(cap)}" loading="lazy" width="960" height="540">'
                        f'<figcaption><span class="tc">{t:.2f}</span><span>{esc(cap)}</span></figcaption></figure>')
        words_row = f'<div><dt>On screen</dt><dd>{esc(words)}</dd></div>' if words else '<div><dt>On screen</dt><dd>No words: the picture carries it.</dd></div>'
        sections.append(f'''<section class="beat" id="{bid}">
  <header class="beat-head">
    <p class="tc range">{t0:.2f}–{t1:.2f} s</p>
    <h2>{esc(title)}</h2>
    <blockquote class="vo">“{esc(vo)}”</blockquote>
    <dl class="spec">{words_row}<div><dt>What happens</dt><dd>{esc(shown)}</dd></div><div><dt>Into the next beat</dt><dd>{esc(out)}</dd></div></dl>
  </header>
  <div class="frames">{"".join(figs)}</div>
</section>''')
    notes = "".join(f"<div><h3>{esc(h)}</h3><p>{esc(p)}</p></div>" for h, p in NOTES)
    qs = "".join(f"<li>{esc(q)}</li>" for q in QUESTIONS)
    revs = "".join(f"<tr><td>{esc(a)}</td><td>{esc(b)}</td><td>{esc(c)}</td></tr>" for a, b, c in REVISIONS)
    video = (f'<video src="film.mp4" controls playsinline preload="metadata" poster="{poster}"></video>' if "film.mp4" in files
             else f'<img src="{poster}" alt="Frame from the film at 1.5 s" width="960" height="540">')
    page = TEMPLATE
    for k, v in {"VERSION": VERSION, "DATE": DATE, "VIDEO": video, "MOTION": esc(motion or "measured on the draft render"), "FRAMES": str(n),
                 "NAV": "".join(nav), "SECTIONS": "\n".join(sections), "NOTES": notes, "QUESTIONS": qs, "REVISIONS": revs}.items():
        page = page.replace(f"@@{k}@@", v)
    open(os.path.join(SITE, "index.html"), "w").write(page)
    json.dump(files, open(os.path.join(SITE, "files.json"), "w"), indent=1)
    print(f"{n} frames, {len(files)} files -> {SITE}/index.html")

TEMPLATE = open(os.path.join(HERE, "template.html")).read()
if __name__ == "__main__": main()
