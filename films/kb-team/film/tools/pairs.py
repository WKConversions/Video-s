#!/usr/bin/env python3
# Reference above OUR film, frame for frame, from a film that is already rendered (no Remotion call).
#   python3 -I tools/pairs.py ../deliver/kb-team-50s-1080p60.mp4 0 63 out/pairs.png [--step 2] [--cols 8] [--w 236] [--ref-only]
# Our frame for reference frame n is film frame ceil(n * 2.5): the first one at or after that moment. Run from films/kb-team/film.
import math, os, sys, cv2
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); REF = os.path.join(HERE, "..", "..", "reference", "frames")
def arg(name, default): return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
film, A, B, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
step, cols, w = arg("--step", 1), arg("--cols", 8), arg("--w", 236); only = "--ref-only" in sys.argv; h = round(w * 9 / 16)
ns = list(range(A, B + 1, step)); rows = (len(ns) + cols - 1) // cols; rh = (h + 16) if only else (2 * h + 20)
sheet = Image.new("RGB", (cols * (w + 4) + 4, rows * rh + 4), "white"); d = ImageDraw.Draw(sheet)
f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
cap = None if only else cv2.VideoCapture(film)
for k, n in enumerate(ns):
    x, y = 4 + (k % cols) * (w + 4), 4 + (k // cols) * rh
    d.text((x + 2, y), f"f{n}  {n / 24:.2f}s", fill=(190, 0, 0), font=f)
    sheet.paste(Image.open(os.path.join(REF, f"f{n:04d}.jpg")).resize((w, h), Image.LANCZOS), (x, y + 14))
    if not only:
        cap.set(cv2.CAP_PROP_POS_FRAMES, math.ceil(n * 2.5 - 1e-9)); ok, fr = cap.read()
        if ok: sheet.paste(Image.fromarray(cv2.cvtColor(cv2.resize(fr, (w, h), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)), (x, y + 16 + h))
sheet.save(out); print(out, sheet.size)
