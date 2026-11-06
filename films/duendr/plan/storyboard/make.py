# Builds the Duendr storyboard page from the build itself: frames pulled from the 540p render at the times below,
# the film as a web encode at the top, the motion numbers beside it. Re-run after every revision, then republish
# site/index.html with the files listed in site/files.json.
#   python3 make.py ../../film/out/film540.mp4 [--motion ../../film/out/film-motion.txt]
import html, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.join(HERE, "site"); FR = os.path.join(SITE, "frames")
SRC = sys.argv[1]; MOTION = sys.argv[sys.argv.index("--motion") + 1] if "--motion" in sys.argv else None
VERSION = "v1"; DATE = "7 Nov 2026"

# (id, title, t0, t1, VO line, on-screen words, what moves (the scene), transition out, [(time, caption), ...])
BEATS = [
  ("s1", "Hook", 0.0, 2.75, "Looking for your next creative connection?", "Looking · for your · next · creative connection?",
   "Your reference 1: one giant word on a plain frame shrinks as the next words join; the frame scales down into a card in a row of creatives' work; Duendr's coral card slides in, fills the frame and finishes the question word by word.",
   "The coral field condenses into the icon's coral circle.", []),
  ("s2", "Meet Duendr", 2.45, 4.0, "Meet Duendr.", "duendr (the wordmark)",
   "The coral field condenses into the icon's circle; the cream bar shoots up beside it (the \"d\"); the wordmark slides out from behind it, its coral dot last.",
   "The lockup lifts away as the circle splits into three.", []),
  ("s3", "Creatives, venues, brands", 3.7, 8.75, "The platform connecting creatives, venues, and brands across the Costa del Sol.", "Costa del Sol",
   "Three coral nodes bloom on their words into creatives (demo profiles with their work playing), venues and a brand, linked by lines that light up; then all three fly down onto the curved globe and the coast lights up from Estepona to Nerja.",
   "The camera dives to Málaga, which becomes one coral dot.", []),
  ("s4", "Showcase and availability", 8.6, 11.6, "Showcase your work and share your availability.", "Lucía Moreno · Available this weekend",
   "The dot becomes Lucía's profile (a demo creative); her work fills in as playing tiles; the app's new-post flow: \"I'm available\", then her Available post with Fri, Sat, Sun lighting up.",
   "Her post gives way to the board.", []),
  ("s5", "Gigs and collaborators", 11.5, 14.6, "Find local gigs, discover collaborators,", "Find work · gig titles · Let's collab",
   "Gig cards in the app's design arrive as a stack that flips forward one by one; the switch to people: a column of creatives, one lifts out big with a coral \"Let's collab\".",
   "The cards sink as the globe rises.", []),
  ("s6", "The map", 14.3, 16.7, "and explore opportunities on the map.", "the 11 city names",
   "Your map: a close-up of the globe with a curved horizon; coral pins pop on all eleven places with their labels; Marbella shows its count and the app's map sheet rises beside it.",
   "The map sinks and darkens; the Find work / Find talent switch arrives in front.", []),
  ("s7", "Hiring", 16.6, 21.8, "Hiring creative talent? Post what you need and browse portfolios to find the right fit.", "Hiring creative talent? · the venue's post",
   "The switch flips to Find talent; a venue's post builds in the app's design and flies onto the board; portfolios slide past; one (Javi Ortega, a demo DJ) lifts forward with a coral check: the right fit.",
   "His card opens into the conversation.", []),
  ("s8", "Connect, chat, book", 21.6, 25.7, "Connect directly, chat about the details, and confirm your booking.", "Connect → · chat lines · Booked on Duendr",
   "Connect is pressed; a short chat in the app's bubbles; Confirm booking; the Booked tile stamps in with the gig clip playing inside.",
   "Everything we've seen gathers around the booking.", []),
  ("s9", "All in one place", 25.6, 27.4, "All in one place.", "",
   "The pieces of the film (profile, gig card, map sheet, chat, switch) fly in around the booking and converge into the app.",
   "The fee comes forward out of the booking.", []),
  ("s10", "Full fee", 27.2, 30.7, "Creatives keep their full fee, with zero commission.", "€280 · 0% commission",
   "The booking's €280 comes forward big and lands whole beside the creative; the icon's coral circle rolls in and becomes the 0 of \"0% commission\".",
   "The booking returns, completed.", []),
  ("s11", "Recommendations", 30.6, 36.05, "After each completed booking, recommendations help build trust and strengthen your reputation.", "Completed · Recommended · short quotes",
   "The booking is stamped completed; recommendation cards rise out of it and stack under the creative's profile; the profile grows and its badge lights up.",
   "A cream circle grows out of the badge until the frame is cream.", []),
  ("s12", "Outro", 36.05, 42.4, "From your next project to your next partnership, find your people on Duendr.", "From your next project · to your next partnership · find your people · duendr",
   "Your reference 16: on cream the line arrives word by word (key words coral), the first phrase tightening as it completes; the next phrases swap in with a wave; the last is pushed off left as the coral circle rolls in, and on \"Duendr\" their app icon grows around it; the icon moves left and the wordmark slides out; the lockup breathes to the end.",
   "End.", []),
]
NOTES = [        # (heading, text) for the notes section
  ("Nothing from your account", "Every profile, venue, gig and fee on screen is a demo: fictional names (Lucía Moreno, Javi Ortega, Casa Brisa, "
   "La Terraza and others) and €280 as the example fee. The faces are cropped from the royalty-free clips; the work in the cards is "
   "Mixkit footage. Your name, photo, roles and card never appear, and neither do real members."),
  ("Screens not in your screenshots", "The chat thread, the booking confirmation, the completed stamp and the recommendation cards "
   "aren't in the screenshots. They're built from Duendr's own card system (same type, colours, radii and pills). If the real screens "
   "look different, send a screenshot and they'll be matched."),
  ("The fee beat", "It shows the €280 agreed in the chat staying whole and \"0% commission\". It doesn't show a payment inside the app, "
   "because the site says venues and creatives book each other directly."),
  ("The map", "Natural Earth coastlines on a curved globe: Andalusia magnified onto a sphere and seen at an angle, so the horizon and the "
   "graticule curve as if you're close to the globe. All eleven places are pinned at their real coordinates, in the app's coral pin style."),
  ("Hook and outro", "The hook follows your reference 1 (a giant word shrinking as the next words join, the frame becoming a card in a "
   "row, the brand card filling the frame). The outro follows reference 16 (words one by one with the spacing tightening, wave swaps, "
   "the line pushed out as the logo arrives, then the lockup)."),
  ("Sound", "Mixkit \"Gimme that groove\" (free, no credit needed), fitted to 42.4 s with its lift on \"Meet\". Effects lead on the "
   "picture's events; the music sits under the voice."),
]
QUESTIONS = [    # open questions for Karl
  "The film follows a demo DJ (Javi Ortega) booked by a demo beach club (Casa Brisa) for €280. Keep these demo names, or would Duendr "
  "rather show other professions, or real members who agree to appear?",
  "Recommendations are shown as short written quotes from the venue (\"Packed dance floor, perfect set.\"). Is that how they look in the app?",
  "Should the end card also carry duendr.app or \"Request an invite\" under the lockup? The script ends on \"find your people on Duendr\", "
  "so it isn't there now.",
]
REVISIONS = []    # (before, after, why)

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
