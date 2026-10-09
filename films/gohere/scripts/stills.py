# Test stills: the overlay composited on the film at chosen frames, tiled into one sheet.
#   python3 scripts/stills.py <A|B> <frame,frame,...> <out.png>   (run from films/gohere)
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mode, frames, out = sys.argv[1], [int(x) for x in sys.argv[2].split(",")], sys.argv[3]
LAST = 1105  # the source's last frame; later frames hold it
tmp = tempfile.mkdtemp()
for f in frames:
    subprocess.run(["node", os.path.join(ROOT, "overlay", "render.mjs"), "frames", mode, str(f), str(f), tmp, "1"], check=True)
tiles = []
for f in frames:
    src = os.path.join(tmp, f"src{f}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(ROOT, "source", "gohere-v1.mp4"),
                    "-vf", f"select=eq(n\\,{min(f, LAST)})", "-frames:v", "1", src], check=True)
    im = Image.open(src).convert("RGB")
    if f >= 1014:
        im.paste(Image.open(os.path.join(tmp, f"o{f:04d}.png")).convert("RGB"), (0, 752))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 260, 60), fill="black"); d.text((12, 12), f"f{f}  {f / 30:.2f}s", fill="white", font_size=32)
    tiles.append(im)
cols = 2 if len(tiles) > 1 else 1
rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (960 * cols, 540 * rows), "white")
for i, im in enumerate(tiles):
    sheet.paste(im.resize((960, 540), Image.LANCZOS), (960 * (i % cols), 540 * (i // cols)))
sheet.save(out)
print(out)
