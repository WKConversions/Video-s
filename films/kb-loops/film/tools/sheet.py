# Contact sheet of stills (each tile 480 px wide, frame number + seconds under it).  python3 tools/sheet.py out/A_*.png [-o out/A_sheet.png]
import sys, glob, os
from PIL import Image, ImageDraw
args = sys.argv[1:]; out = "out/sheet.png"
if "-o" in args: i = args.index("-o"); out = args[i + 1]; args = args[:i] + args[i + 2:]
files = sorted(f for a in args for f in glob.glob(a))
cols = 4; tw = 480; th = 270
sheet = Image.new("RGB", (cols * tw, ((len(files) + cols - 1) // cols) * (th + 22)), "white"); d = ImageDraw.Draw(sheet)
for n, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((tw, th)); x, y = (n % cols) * tw, (n // cols) * (th + 22)
    sheet.paste(im, (x, y)); fr = int(os.path.basename(f).split("_")[-1].split(".")[0]); d.text((x + 6, y + th + 4), f"{fr}  {fr / 60:.2f}s", fill=(0, 0, 0))
sheet.save(out); print(out, len(files), "tiles")
