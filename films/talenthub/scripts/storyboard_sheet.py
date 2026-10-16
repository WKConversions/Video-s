# Renders one still per voice-over line from the Remotion project and lays them out as a labelled storyboard sheet.
#   python3 storyboard_sheet.py <film dir> <out.jpg> [nl]
# nl: the Dutch build (set LANG = "nl" in src/lang.ts first); each shot moves to the same moment of the Dutch
# voice-over (the English labels' times mapped onto src/words_nl.json) and is captioned with the Dutch line.
import json, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
film, out = sys.argv[1], sys.argv[2]
SHOTS = [(1.2, "Looking for qualified talent?"), (2.7, "Meet Talent Hub."), (4.9, "The platform connecting graduates…"), (6.6, "…with international career opportunities."),
         (9.0, "Browse a database of qualified candidates,"), (11.6, "all in one intuitive dashboard."), (13.3, "Filter by skills,"), (15.0, "experience, and qualifications…"),
         (16.4, "…to find the right match."), (18.3, "Discover candidate profiles,"), (19.9, "unlock contact details,"), (21.9, "and connect directly with potential hires."),
         (24.6, "For graduates, it's a gateway…"), (26.0, "…to exciting opportunities abroad."), (27.8, "For employers and recruiters,"), (29.9, "it's a smarter way to discover talent."),
         (31.3, "Talent Hub."), (35.0, "Your next connection starts here.")]
if len(sys.argv) > 3 and sys.argv[3] == "nl":
    en, nl = json.load(open(f"{film}/src/words.json")), json.load(open(f"{film}/src/words_nl.json"))
    pairs = sorted((en[k], nl[k]) for k in en)
    xs, ys = [0.0] + [a for a, _ in pairs] + [en["w:here"] + 3.0], [0.0] + [b for _, b in pairs] + [nl["w:here"] + 3.0]
    NL_LINES = ["Op zoek naar gekwalificeerd talent?", "Maak kennis met Talent Hub.", "Het platform dat afgestudeerden verbindt…", "…met internationale carrièremogelijkheden.",
                "Ontdek een database vol gekwalificeerde kandidaten,", "overzichtelijk verzameld in één dashboard.", "Filter op vaardigheden,", "werkervaring en kwalificaties…",
                "…om de juiste match te vinden.", "Bekijk kandidaatprofielen,", "ontgrendel contactgegevens,", "en kom direct in contact met potentiële werknemers.",
                "Voor afgestudeerden opent Talent Hub de deur…", "…naar nieuwe kansen in het buitenland.", "Voor werkgevers en recruiters…", "…wordt talent vinden eenvoudiger.",
                "Talent Hub.", "Jouw volgende connectie begint hier."]
    SHOTS = [(float(np.interp(t, xs, ys)), line) for (t, _), line in zip(SHOTS, NL_LINES)]
frames = [round(t * 30) for t, _ in SHOTS]
subprocess.run(["node", "stills.mjs", ",".join(map(str, frames)), "1"], cwd=film, check=True, capture_output=True)
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17)
W, H, cols = 480, 270, 4
rows = (len(SHOTS) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 34)), (15, 26, 41))
for i, ((t, text), fr) in enumerate(zip(SHOTS, frames)):
    im = Image.open(f"{film}/out/test/f{fr:04d}.png").convert("RGB").resize((W, H))
    x, y = (i % cols) * W, (i // cols) * (H + 34)
    sheet.paste(im, (x, y + 34))
    ImageDraw.Draw(sheet).text((x + 10, y + 8), f"{t:.1f}s  {text}", fill="white", font=font)
sheet.save(out, quality=90)
print(out)
