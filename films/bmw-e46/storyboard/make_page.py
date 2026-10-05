"""Builds storyboard/index.html: the film at the top (if deliver/ has it), a frame per moment rendered from the
Remotion project (storyboard/frames/fNNNN.jpg), the time, the words on screen and what moves, then the notes, the QC
numbers and the working tables. Run from films/bmw-e46: python3 storyboard/make_page.py"""
import html, json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
MOMENTS = [
    (12, "Intro", "BMW 330Ci Coupé · E46 · 2001", "The car turns in on the studio floor from a front three-quarter; the title rises word by word."),
    (60, "Intro", "", "Still turning, drifting closer; plate 25-KDB-4 and the photo's details read."),
    (120, "Body", "Coupé-carrosserie · Geen enkel plaatwerkdeel gedeeld met de sedan. · 46 mm lager · raamloze deuren", "Pure side profile; a blue line traces the coupé's roofline from windscreen to boot."),
    (175, "Body", "sedan", "In on the roof: the sedan's roofline (BMW drawing) appears as a grey ghost above."),
    (205, "Body", "46 mm", "The ghost drops onto the coupé line; the bracket reads 46 mm."),
    (240, "Lift", "", "The body lifts off the chassis; the paint sweeps to glass front to back along a blue seam."),
    (275, "Lift", "", "The glass body settles back; the drivetrain shows inside in light clay."),
    (300, "Head", "Cilinderkop", "The car turns and dips its nose; the cylinder head glows blue inside the engine."),
    (360, "Head", "Aluminium, twee nokkenassen en 24 kleppen. · M54B30 · 2.979 cc · 231 pk", "The head is out above the block; the camshafts turn, the valves open in firing order."),
    (430, "VANOS", "Dubbel VANOS", "The front of the engine turns to camera; the VANOS unit lights up on the head's front face."),
    (480, "VANOS", "Verdraait beide nokkenassen traploos, op motorolie. · inlaat 40° · uitlaat 25°", "The unit slides forward; each sprocket turns against its camshaft by its range."),
    (560, "Gearbox", "Automaat", "The car rolls onto its side; the ZF 5HP19 glows behind the engine and drops out."),
    (620, "Gearbox", "Koppelomvormer en planeetwielen · ZF 5HP19 · Steptronic", "The case turns to glass: the torque converter and planetary sets turn; the gear read-out steps 1→5."),
    (690, "Diff", "", "The car turns to the rear; a blue pulse runs down the propshaft from the gearbox to the differential."),
    (740, "Diff", "Differentieel · Draait de kracht 90° naar de achterwielen. · 3,38 : 1", "The differential moves out; the pinion turns the ring gear."),
    (790, "Diff", "buitenwiel sneller · binnenwiel langzamer", "In a corner: the outer rear wheel turns faster than the inner one."),
    (840, "Outro", "BMW 330Ci Coupé", "Parts home; the paint sweeps back rear to front; the car lands."),
    (885, "Outro", "Zescilinder · dubbel VANOS · ZF-automaat", "Front three-quarter, the photo's angle; the car keeps turning slowly."),
]


def main():
    qc = open(os.path.join(ROOT, 'qc.txt')).read() if os.path.exists(os.path.join(ROOT, 'qc.txt')) else 'QC not run yet.'
    film = 'film.mp4' if os.path.exists(os.path.join(ROOT, 'film.mp4')) else None
    cards = []
    for f, beat, words, motion in MOMENTS:
        img = f'frames/f{f:04d}.jpg'
        t = f / 30
        cards.append(f'''<figure class="card"><img src="{img}" alt="{html.escape(beat)} at {t:.1f} s" loading="lazy">
<figcaption><div class="meta"><span class="beat">{html.escape(beat)}</span><span class="time">{t:4.1f} s · f{f}</span></div>
{f'<div class="words">{html.escape(words)}</div>' if words else ''}<div class="motion">{html.escape(motion)}</div></figcaption></figure>''')
    page = f'''<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BMW 330Ci storyboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {{ --bg:#F4F5F7; --ink:#0E1116; --sub:#4A5260; --blue:#1C69D4; --card:#FFFFFF; --rule:#DDE1E7; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#0F1216; --ink:#ECEFF3; --sub:#A3ACB9; --blue:#5B9BFF; --card:#171B21; --rule:#2A3038; }} }}
:root[data-theme="dark"] {{ --bg:#0F1216; --ink:#ECEFF3; --sub:#A3ACB9; --blue:#5B9BFF; --card:#171B21; --rule:#2A3038; }}
* {{ box-sizing:border-box; }} body {{ margin:0; background:var(--bg); color:var(--ink); font-family:Barlow,system-ui,sans-serif; }}
main {{ max-width:1200px; margin:0 auto; padding:40px 16px 80px; }}
h1 {{ font-weight:600; font-size:clamp(28px,4vw,44px); margin:0 0 6px; }} h2 {{ font-weight:600; font-size:22px; margin:40px 0 12px; }}
p.lead {{ color:var(--sub); font-size:18px; margin:0 0 24px; max-width:760px; }}
video {{ width:100%; border-radius:12px; background:#000; }}
.grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:16px; }}
.card {{ margin:0; background:var(--card); border:1px solid var(--rule); border-radius:12px; overflow:hidden; }}
.card img {{ width:100%; display:block; aspect-ratio:16/9; object-fit:cover; }}
figcaption {{ padding:12px 14px 14px; }} .meta {{ display:flex; justify-content:space-between; font-size:13px; color:var(--sub); text-transform:uppercase; letter-spacing:.06em; }}
.beat {{ color:var(--blue); font-weight:600; }} .words {{ font-weight:600; margin-top:6px; }} .motion {{ color:var(--sub); margin-top:4px; line-height:1.35; }}
pre {{ white-space:pre-wrap; background:var(--card); border:1px solid var(--rule); border-radius:12px; padding:14px; font-size:13px; overflow-x:auto; }}
</style></head><body><main>
<h1>BMW 330Ci Coupé (E46, 2001)</h1>
<p class="lead">30 seconden, 16:9. De auto van je broer draait in een lichte studio; de carrosserie wordt glas en vijf onderdelen worden in de auto aangewezen, eruit gehaald en uitgelegd.</p>
{f'<video src="{film}" controls playsinline></video>' if film else ''}
<h2>Frames</h2><div class="grid">{''.join(cards)}</div>
<h2>Kwaliteitscontrole</h2><pre>{html.escape(qc)}</pre>
</main></body></html>'''
    open(os.path.join(ROOT, 'index.html'), 'w').write(page)
    print('storyboard/index.html written,', len(cards), 'frames')


if __name__ == '__main__':
    main()
