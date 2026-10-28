# Renders one still per voice-over line from the Remotion project and lays them out as a labelled storyboard sheet.
#   python3 storyboard_sheet.py <film dir> <out.jpg>
import json, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
film, out = sys.argv[1], sys.argv[2]
# Creoble v4: one shot per voice-over sentence, taken late in the sentence (its picture event has landed), from
# vo/sentences.json; plus the last frame.
import os
SENT = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "vo", "sentences.json")))
SHOTS = [(s["start"] + 0.8 * (s["end"] - s["start"]) + 0.15, s["text"]) for s in SENT if s["text"] != "dk."]
OUT_FPS = 60   # version 3 renders at 60 fps; times stay in seconds
LAST = min(int(round((SENT[-1]["end"] + 2.3) * OUT_FPS)), 3308)   # the film ends at frame 3310
SHOTS.append((LAST / OUT_FPS, "Last frame"))
frames = [min(round(t * OUT_FPS), LAST) for t, _ in SHOTS]
subprocess.run(["node", "stills.mjs", ",".join(map(str, frames)), "1"], cwd=film, check=True, capture_output=True)
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17)
W, H, cols = 480, 270, 6
rows = (len(SHOTS) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 34)), (26, 22, 20))
for i, ((t, text), fr) in enumerate(zip(SHOTS, frames)):
    im = Image.open(f"{film}/out/test/f{fr:04d}.png").convert("RGB").resize((W, H))
    x, y = (i % cols) * W, (i // cols) * (H + 34)
    sheet.paste(im, (x, y + 34))
    ImageDraw.Draw(sheet).text((x + 10, y + 8), f"{t:.1f}s  {text}", fill="white", font=font)
sheet.save(out, quality=90)
print(out)
