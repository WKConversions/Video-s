# Renders one still per voice-over line from the Remotion project and lays them out as a labelled storyboard sheet.
#   python3 storyboard_sheet.py <film dir> <out.jpg>
import subprocess, sys
from PIL import Image, ImageDraw, ImageFont
film, out = sys.argv[1], sys.argv[2]
SHOTS = [(1.7, "Turn scrolling into learning."), (3.0, "Meet Bingua."), (4.3, "Learn languages…"), (6.8, "…through real videos and everyday conversations."),
         (9.2, "Follow along with translations…"), (10.4, "…that make unfamiliar words…"), (12.2, "…and sentences easy to understand."),
         (14.2, "See a word you want to remember?"), (15.6, "Save it instantly."), (18.4, "Bingua turns your discoveries into smart flashcards…"),
         (19.3, "…and quizzes,"), (21.0, "helping new vocabulary stick."), (22.8, "No endless word lists."), (24.8, "No repetitive textbook exercises."),
         (26.9, "Just content you enjoy,"), (28.1, "a growing vocabulary,"), (30.6, "and more confidence with every video,"), (31.75, "at your own pace."),
         (33.0, "Bingua."), (36.0, "Learn languages by scrolling.")]
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
