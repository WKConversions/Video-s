# Renders one still per voice-over line from the Remotion project and lays them out as a labelled storyboard sheet.
#   python3 storyboard_sheet.py <film dir> <out.jpg>
import json, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
film, out = sys.argv[1], sys.argv[2]
SHOTS = [(0.9, "One sentence."), (2.5, "One finished video."), (4.9, "Motion design takes designers,"), (6.0, "expensive tools,"),
         (7.5, "and weeks of revisions."), (9.8, "Most teams simply can't keep up."), (11.4, "Meet Moviqly."), (12.9, "Describe your idea,"),
         (14.6, "…reads your website,"), (16.1, "understands your business,"), (17.2, "writes the story,"), (18.4, "designs the look"),
         (19.6, "and checks every fact."), (21.2, "Launching a product…"), (22.3, "…or announcing a new feature?"), (25.7, "Just type: Make a 25 second video…"),
         (27.6, "Watch every step happen live"), (29.8, "and get your film in just minutes."), (31.6, "Refine it right in the chat,"), (32.6, "then export"),
         (33.0, "landscape,"), (33.9, "portrait,"), (34.6, "or square."), (35.8, "A little idea."),
         (37.6, "A whole new world of motion."), (39.5, "Make it Moviqly."), (40.6, "Get started today."), (43.2, "Last frame")]
frames = [min(round(t * 30), 1299) for t, _ in SHOTS]
subprocess.run(["node", "stills.mjs", ",".join(map(str, frames)), "1"], cwd=film, check=True, capture_output=True)
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17)
W, H, cols = 480, 270, 6
rows = (len(SHOTS) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 34)), (15, 26, 41))
for i, ((t, text), fr) in enumerate(zip(SHOTS, frames)):
    im = Image.open(f"{film}/out/test/f{fr:04d}.png").convert("RGB").resize((W, H))
    x, y = (i % cols) * W, (i // cols) * (H + 34)
    sheet.paste(im, (x, y + 34))
    ImageDraw.Draw(sheet).text((x + 10, y + 8), f"{t:.1f}s  {text}", fill="white", font=font)
sheet.save(out, quality=90)
print(out)
