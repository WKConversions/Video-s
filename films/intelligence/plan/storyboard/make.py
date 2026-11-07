# Builds the intelligence platform explainer storyboard page from the build itself: frames pulled from the 540p render at the times below,
# the film as a web encode at the top, the motion numbers beside it. Re-run after every revision, then republish
# site/index.html with the files listed in site/files.json.
#   python3 make.py ../../film/out/film540.mp4 [--motion ../../film/out/film-motion.txt]
import html, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.join(HERE, "site"); FR = os.path.join(SITE, "frames")
SRC = sys.argv[1]; MOTION = sys.argv[sys.argv.index("--motion") + 1] if "--motion" in sys.argv else None
VERSION = "v2"; DATE = "7 Nov 2026"

# (id, title, t0, t1, VO line, on-screen words, what moves (the scene), transition out, [(time, caption), ...])
BEATS = [
  ("s1", "Home", 0.0, 7.4, "Meet your intelligence platform. Everything about how your company works, in one place.", "Good morning, Sam · Knowledge base · Offer · Strategy",
   "The home screen assembles: the greeting rises, then the three places of the platform spring up one after another: Knowledge base, Offer, Strategy.",
   "The cursor opens the Knowledge base.", [(1.6, "The home screen builds with the voice: the greeting."), (4.0, "\"how your company works\": the three places, one by one."), (5.4, "\"in one place\": all three, settled.")]),
  ("s2", "Knowledge base", 7.4, 14.0, "The knowledge base covers every department, from sales and marketing to operations and finance.", "Sales · Marketing · Operations · Customer Success · Finance · People",
   "The knowledge base with its six departments; Sales, Marketing, Operations and Finance each lift on their word.",
   "The cursor opens Sales.", [(8.7, "The knowledge base: all six departments lift as one grid."), (10.2, "\"sales and marketing\" light up in turn."), (12.2, "\"operations and finance\".")]),
  ("s3", "Three layers", 14.0, 20.2, "Each starts with one strategy document, followed by how you work and detailed playbooks.", "Strategy · How we work · Playbooks",
   "Inside Sales: the one strategy document (layer 1) lifts, then How we work (layer 2), then the Playbooks (layer 3).",
   "Back to the page; the cursor heads for Strategy.", [(15.3, "\"one strategy document\": layer 1 lifts."), (17.3, "\"how you work\": layer 2."), (19.2, "\"detailed playbooks\": layer 3.")]),
  ("s4", "Tell the agent", 20.2, 29.4, "Need something to change? Open Strategy and just tell the agent, like: \"Raise our minimum project price to €450.\"", "Raise our minimum project price to €450",
   "Strategy opens; the Sales strategy with its agent panel; the panel lifts and the request is typed in with the voice.",
   "Send.", [(22.9, "\"Open Strategy\": the tab is clicked."), (25.7, "\"tell the agent\": the Strategy agent panel lifts."), (27.5, "The request is typed in.")]),
  ("s5", "The suggestion", 29.4, 32.4, "It suggests the exact edit.", "€400 → €450",
   "The agent thinks, replies with what it took from the request and suggests the exact change in the pricing table.",
   "The cursor on Approve.", [(30.3, "\"suggests\": the agent replies with the exact change."), (31.7, "\"exact edit\": €400 becomes €450.")]),
  ("s6", "Approve", 32.4, 34.2, "You approve.", "Approve",
   "Approve is pressed; the strategy is updated.", "The update spreads.", [(33.1, "\"You approve\": Approve is pressed.")]),
  ("s7", "Every document follows", 34.2, 39.4, "Every related document updates to match, ready for your review.", "Updating 15 related documents · Review updated documents",
   "Fifteen related documents update; the four that changed wait in Review updated documents; Approve all.",
   "All approved; the cursor heads for Offer.", [(35.0, "\"Every related document\": 15 updating."), (35.9, "Four changed documents, ready to check."), (37.7, "\"ready for your review\": Review updated documents.")]),
  ("s8", "Paste the transcript", 39.4, 44.2, "Had a client call? Paste the transcript into Offer.", "the Fernwood call transcript",
   "Offer opens; the transcript box lifts and a (custom) client call pours in; Read transcript.",
   "The platform reads the call.", [(40.6, "\"Had a client call?\" Offer is clicked."), (43.0, "\"Paste the transcript\": the call pours in."), (44.1, "Read transcript.")]),
  ("s9", "What matters", 44.2, 48.4, "It pulls out what matters, needs, budget and timeline,", "Needs · Budget signals · Timeline",
   "\"Here's what I took from it\": the summary and eight cards; Needs, Budget signals and Timeline lift on their words.",
   "Make an offer.", [(45.6, "\"what matters\": what the platform took from the call."), (46.0, "\"needs\"."), (46.8, "\"budget\"."), (47.3, "\"timeline\".")]),
  ("s10", "The offer", 48.4, 53.8, "and writes a tailored offer from your own prices and process, in minutes.", "Offer for Fernwood Coffee Roasters · Scope and price",
   "The offer is written: the title, what we heard, and the scope and price table from Nova's own prices with the timeline.",
   "Back to the strategy.", [(49.3, "Make an offer."), (50.6, "\"a tailored offer\": Offer for Fernwood Coffee Roasters."), (51.2, "\"your own prices\": scope and price."), (51.8, "\"and process\": the timeline.")]),
  ("s11", "One source of truth", 53.8, 61.0, "One source of truth, always in sync, and every offer on point.", "",
   "The strategy (the source), the knowledge base rippling in sync, the offer, and the home screen to rest.",
   "End.", [(55.0, "\"One source of truth\": the strategy."), (57.1, "\"always in sync\": every department."), (58.1, "\"every offer on point\"."), (60.2, "The platform at rest.")]),
]
NOTES = [
  ("Your real screens, nobody's data", "Every screen is your own screenshot. The logo is a neutral \"nova\", the avatar an \"S\", the names Sam van Dijk and Daniel Bos. The settings screen (API key, workspace ID) is never shown."),
  ("Every example is custom", "All readable example content is new: Nova (a brand and web studio), the €400 → €450 pricing change, a call with Fernwood Coffee Roasters, the details pulled from it and the full offer. It is set in the platform's own fonts and sizes over the real screens."),
  ("Sound", "Your own Motionix sounds (clicks, pops, UI opens) on every action, and a calm Mixkit music bed (free, no credit needed) that opens up when the strategy agent arrives."),
  ("Kept out of the public repo", "Your screenshots, their OCR text and the anonymised screens stay in this session only; the repo has the code and the custom content."),
]
QUESTIONS = ["Does the platform have a name for the first line and the logo? It is a neutral \"nova\" now.",
             "Is the demo story right for your buyers (a studio raising its minimum price; a coffee roaster's website offer), or should the examples come from another industry?"]
REVISIONS = [
  ("v1: hasty; clicks and changes squeezed into the voice-over", "v2: a pause after every sentence; each sentence's visual finishes before the next one starts", "Your feedback: sentence by sentence, clearer"),
  ("v1: quick cursor jumps", "v2: the cursor glides, the target lights up, the press is visible, then the platform responds", "Clear click moments"),
  ("v1: camera moves during dissolves and lifts", "v2: the camera stands still during clicks, screen changes and lifts", "Smoother, no ghosting or shimmer"),
  ("v1: an almost empty opening", "v2: the home screen builds with the first lines", "No dead start"),
]

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
