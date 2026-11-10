# python3 sheet.py out/test out/sheet.jpg [cols]  -> labelled contact sheet of 480 px tiles
import sys, glob, os
from PIL import Image, ImageDraw
fs = sorted(glob.glob(os.path.join(sys.argv[1], "*.png"))); cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
W = 480; rows = (len(fs) + cols - 1) // cols
s = Image.new("RGB", (W * cols, (W + 18) * rows), "white"); d = ImageDraw.Draw(s)
for i, f in enumerate(fs):
    im = Image.open(f).convert("RGB").resize((W, W)); x, y = (i % cols) * W, (i // cols) * (W + 18)
    s.paste(im, (x, y + 18)); d.text((x + 4, y + 3), os.path.basename(f)[2:-4] + " s", fill="black")
s.save(sys.argv[2], quality=82); print(len(fs))
