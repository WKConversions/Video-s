#!/usr/bin/env python3
# The whole film beside the reference: python3 tools/filmcompare.py out/p540.mp4 out/fc [--every 12] [--cols 10] [--w 190]
# For every Nth reference frame: the reference frame on top, our film frame at the same moment below. Several sheets.
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); REF = os.path.join(HERE, "..", "..", "reference", "frames")
def arg(name, default): return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
src, out = sys.argv[1], sys.argv[2]; every, cols, w = arg("--every", 12), arg("--cols", 10), arg("--w", 190); h = round(w * 9 / 16)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps=24,scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
n = len(raw) // (w * h * 3); ns = list(range(0, min(n, 1201), every)); per = cols * 4
f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 11)
for s in range(0, len(ns), per):
    part = ns[s:s + per]; rows = (len(part) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (w + 4) + 4, rows * (2 * h + 22) + 4), "white"); d = ImageDraw.Draw(sheet)
    for k, fr in enumerate(part):
        x, y = 4 + (k % cols) * (w + 4), 4 + (k // cols) * (2 * h + 22)
        sheet.paste(Image.open(os.path.join(REF, f"f{fr:04d}.jpg")).resize((w, h)), (x, y + 14))
        sheet.paste(Image.frombytes("RGB", (w, h), raw[fr * w * h * 3:(fr + 1) * w * h * 3]), (x, y + 16 + h))
        d.text((x + 2, y + 1), f"f{fr} {fr / 24:.2f}s", fill=(190, 0, 0), font=f)
    p = f"{out}_{s // per}.png"; sheet.save(p); print(p, sheet.size)
