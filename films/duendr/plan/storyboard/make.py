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
   "Your reference 1: one giant word on a plain cream frame shrinks as the next words join; the frame closes into a card in a row of creatives' work sliding past; Duendr's coral card slides in with \"next\", fills the frame and finishes the question word by word.",
   "The words drop away and the coral field condenses into the icon's circle.",
   [(0.10, "Frame 0 is already moving: one giant word on a plain cream frame."), (0.85, "The frame becomes one card in a row of creatives' work sliding past."),
    (1.25, "Duendr's coral card slides in carrying \"next\"."), (2.00, "The coral card fills the frame; \"creative connection?\" joins word by word.")]),
  ("s2", "Meet Duendr", 2.45, 4.0, "Meet Duendr.", "duendr (the wordmark)",
   "The coral field condenses into the icon's circle; on \"Duendr\" the cream bar shoots up beside it (the \"d\") and the wordmark slides out, its coral dot last.",
   "The wordmark lifts into the header; the circle stays as the platform's node.",
   [(3.25, "On \"Duendr\": the cream bar shoots up beside the circle and the wordmark slides out."), (3.75, "The wordmark lifts into the header; the circle stays as the platform.")]),
  ("s3", "Creatives, venues, brands", 3.7, 8.75, "The platform connecting creatives, venues, and brands across the Costa del Sol.", "Creatives · Venues · Brands · Costa del Sol",
   "The circle splits into three nodes joined by lines; each blooms on its word into Duendr cards: a creative (Javi Ortega, a demo DJ, his work playing), a venue (Casa Brisa) and a brand (Atelier Mar). The lines light up coral, then everything flies down onto the curved globe and the coast lights up from Estepona to Nerja.",
   "The camera dives toward Málaga, which becomes one coral dot.",
   [(4.25, "\"The platform connecting\": the circle splits into three connected nodes."), (5.25, "\"creatives\": the first node blooms into a creative's card, work playing."),
    (7.00, "\"venues, and brands\": Casa Brisa and Atelier Mar; the connections light up coral."), (7.75, "\"across the Costa del Sol\": the clusters fly onto the curved globe."),
    (8.50, "The coast lights up under \"Costa del Sol\"; the camera dives to Málaga.")]),
  ("s4", "Showcase and availability", 8.6, 11.6, "Showcase your work and share your availability.", "Lucía Moreno · Available this weekend",
   "The Málaga dot becomes Lucía Moreno's avatar (a demo creative); her work springs in as playing tiles; the app's new-post sheet, \"I'm available\" pressed; it flips to her Available post with Fri, Sat, Sun lighting up.",
   "Her post flips into the first gig card.",
   [(9.75, "\"Showcase your work\": her profile, her work springing in, clips playing."), (10.55, "\"share\": the app's new-post sheet, \"I'm available\" pressed."),
    (11.10, "\"your availability\": her Available post, Fri, Sat, Sun lit coral.")]),
  ("s5", "Gigs and collaborators", 11.5, 14.6, "Find local gigs, discover collaborators,", "Find local gigs, · discover collaborators,",
   "Gig cards in the app's design flip forward one by one; then the people list, and Nadia Vega's row opens into her dance work with a coral \"Let's collab\".",
   "The globe grows out of the \"Let's collab\" pill.",
   [(12.25, "\"Find local gigs\": gig cards flip forward one by one."), (13.75, "\"discover collaborators\": the people list; Nadia's row opens into her work."),
    (14.25, "A coral \"Let's collab\" pops on her card.")]),
  ("s6", "The map", 14.3, 16.7, "and explore opportunities on the map.", "the eleven place names · Marbella · 6 open jobs",
   "Your map: a close-up of the globe with a curved horizon and graticule; coral pins pop on all eleven places with their labels, linked by coral arcs; Marbella's map sheet rises (\"6 open jobs\", from the app's own screen).",
   "The map sinks; the Find work / Find talent switch arrives in front.",
   [(15.00, "\"explore\": the globe grows out of the pill; the first pins land."), (15.50, "\"opportunities\": pins pop along the coast; Marbella's sheet rises."),
    (16.00, "\"on the map\": all eleven places pinned and labelled, linked by arcs.")]),
  ("s7", "Hiring", 16.6, 21.8, "Hiring creative talent? Post what you need and browse portfolios to find the right fit.", "Hiring creative talent? · Post what you need. · Browse portfolios. · Find the right fit.",
   "The switch flips to Find talent; its thumb becomes Casa Brisa's post, which writes itself (Live DJ for sunset sessions, Fri 20 Nov, €280) and posts; a row of portfolios slides past, clips playing; Javi Ortega's card lifts forward with a coral ring: Right fit.",
   "Connect is pressed on his card.",
   [(17.50, "\"Hiring creative talent?\": the switch flips to Find talent."), (19.10, "\"Post what you need\": Casa Brisa's post writes itself."),
    (20.25, "\"browse portfolios\": a row of creatives' work slides past."), (21.50, "\"find the right fit\": Javi's card lifts forward with a coral ring.")]),
  ("s8", "Connect, chat, book", 21.6, 25.7, "Connect directly, chat about the details, and confirm your booking.", "Connect directly. · Chat about the details. · Confirm your booking.",
   "Connect is pressed and a coral line joins Casa Brisa to Javi (Connected); his card becomes a chat with three short lines; Confirm booking is pressed and the Booked on Duendr tile stamps in out of the pill, the gig clip playing inside.",
   "The pieces of the film gather around the booking.",
   [(22.50, "\"Connect directly\": a line joins Casa Brisa to Javi: Connected."), (24.25, "\"chat about the details\": his card becomes the chat."),
    (24.80, "\"confirm\": the Confirm booking pill."), (25.30, "\"your booking\": the Booked on Duendr tile stamps in.")]),
  ("s9", "All in one place", 25.6, 27.4, "All in one place.", "",
   "The pieces of the film (Lucía's profile, a gig card, the Marbella sheet, the chat, the switch) fly in around the booking and converge into the app; the phone grows out of the booking tile.",
   "The fee comes forward out of the phone.",
   [(26.30, "\"All\": the pieces of the film fly in around the booking."), (26.90, "\"in one place\": they converge into the app.")]),
  ("s10", "Full fee", 27.2, 30.7, "Creatives keep their full fee, with zero commission.", "€280 · Full fee · 0% commission",
   "The €280 agreed in the chat comes forward big and lands whole on Javi's card with a \"Full fee\" pill; the icon's coral circle rolls in and becomes the 0 of \"0% commission\". No payment screen: the site says they book each other directly.",
   "The 0 becomes the booking again.",
   [(27.80, "\"Creatives keep\": the €280 from the booking comes forward."), (29.10, "\"their full fee\": it lands whole on Javi's card."),
    (30.30, "\"zero commission\": the coral circle becomes the 0.")]),
  ("s11", "Recommendations", 30.6, 36.05, "After each completed booking, recommendations help build trust and strengthen your reputation.", "Completed · Recommendations · Build trust · Strengthen your reputation",
   "The booking is stamped Completed; recommendation cards rise out of it (short quotes from Casa Brisa, La Terraza and Atelier Mar) and land on Javi's profile (\"Recommended by\"); his profile grows and his row lifts in the people list.",
   "A cream circle grows out of his badge until the frame is cream.",
   [(31.90, "\"completed booking\": the booking returns, stamped Completed."), (32.90, "\"recommendations\": short quotes from the venues rise out of it."),
    (34.10, "\"build trust\": they land on Javi's profile."), (35.40, "\"your reputation\": his row lifts in the people list."),
    (35.80, "A cream circle grows out of his badge.")]),
  ("s12", "Outro", 36.05, 42.4, "From your next project to your next partnership, find your people on Duendr.", "From your next project · to your next partnership · find your people · duendr",
   "Your reference 16: on cream the line arrives word by word (key words coral), centred, each word joining from the right with a gap that tightens; the next phrases swap in with a wave; the last is pushed out as the coral circle comes in; on \"Duendr\" their app icon grows around it and holds big, shrinks at the centre, moves left, and the wordmark slides in, its coral dot last.",
   "The lockup breathes to the last frame.",
   [(36.75, "\"From your next project\": words join one by one, centred."), (38.00, "\"to your next partnership\" swaps in with a wave."),
    (39.50, "\"find your people\"."), (40.55, "\"Duendr\": their app icon grows around the circle and holds big."),
    (42.00, "The lockup: the icon and the wordmark, its coral dot last.")]),
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
  ("Next pass", "Scale up the app UI where it reads small (the S3 cards, the chat, the recommendation cards) and the map labels; smooth "
   "the few spots of sub-pixel shake the checks still flag; align every sound effect to the final picture; then the 1080p render."),
  ("Sound", "Mixkit \"Gimme that groove\" (free, no credit needed), fitted to 42.4 s with its lift on \"Meet\". Effects lead on the "
   "picture's events; the music sits under the voice."),
]
QUESTIONS = [    # open questions for Karl
  "Most middle beats carry a short headline that repeats the voice-over (\"Post what you need.\", \"Find the right fit.\", \"Build trust\"). "
  "They make the film work with the sound off, but they read like subtitles. My recommendation: keep only the words that add something "
  "(\"Hiring creative talent?\", Creatives / Venues / Brands, Costa del Sol, €280, 0% commission) and let the UI carry the rest. Keep, trim or drop?",
  "The film follows a demo DJ (Javi Ortega) booked by a demo beach club (Casa Brisa) for €280. Keep these demo names, or would Duendr "
  "rather show other professions, or real members who agree to appear?",
  "Recommendations are shown as short written quotes from the venue (\"Packed dance floor, perfect set.\"). Is that how they look in the app?",
  "Should the end card also carry duendr.app or \"Request an invite\" under the lockup? The script ends on \"find your people on Duendr\", "
  "so it isn't there now.",
]
REVISIONS = [    # (before, after, why)
  ("The fee beat showed a wallet card and a \"Duendr fee −€0\" row", "The €280 lands whole on the creative's card with \"Full fee\"; then \"0% commission\"", "The site doesn't say payments run through the app"),
  ("Málaga's pin showed a count of 12", "No count on Málaga; Marbella keeps \"6 open jobs\" from the app's own screen", "No invented numbers"),
  ("The Marbella sheet listed a gig by a Málaga brand", "Two Casa Brisa gigs in Marbella", "Demo data stays consistent"),
  ("The new-post sheet had invented app copy", "Only the app's own labels: I'm available, Let's collab, Add new work, Continue", "Facts only"),
  ("A recommendation counter (1, 2, 3)", "\"Recommended by\" with the venues' discs", "No invented numbers"),
  ("The hook's row of work jumped and stopped", "One strip slides at a steady speed and the coral card lands centred", "Your reference 1's carousel"),
  ("The booking clip restarted where two scenes meet", "The clip runs on across the hand-off", "Continuity"),
  ("The outro's first phrase built off-centre", "The visible words stay centred, each new word joining from the right", "Your reference 16"),
  ("The push to the logo started while \"people\" was still spoken", "Timed to the voice's measured onsets; the icon holds big before the lockup", "The payoff word stays readable; reference 16 holds the symbol"),
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
