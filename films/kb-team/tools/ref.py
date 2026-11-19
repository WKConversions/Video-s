#!/usr/bin/env python3
# Tools for reading the reference film (reference/base44.mp4: 1280x720, 24 fps, 1201 frames, 50.06 s) frame by frame.
# Frames are numbered from 0; time = frame / 24. Small copies of every frame are in reference/frames/fNNNN.jpg (640x360).
# Run from films/kb-team:
#   python3 -I tools/ref.py strip 188 206 out.png [--step 1] [--cols 6] [--w 320]   a labelled contact sheet of frames A..B
#   python3 -I tools/ref.py full 254 out.png                                         one frame at full size (1280x720)
#   python3 -I tools/ref.py crop 254 x y w h out.png [--scale 2]                     a region of a full-size frame, enlarged
#   python3 -I tools/ref.py diff 188 206                                             % of the picture changing into each frame
#   python3 -I tools/ref.py color 254 x y [r]                                        the average colour (hex) around a point
#   python3 -I tools/ref.py cuts                                                     the hard cuts (frame numbers)
# Coordinates are full-size pixels (1280x720). The K.B film is 1920x1080: multiply by 1.5.
import os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); REF = os.path.join(HERE, "..", "reference"); VID = os.path.join(REF, "base44.mp4"); FPS = 24
CUTS = [64, 75, 93, 130, 188, 192, 196, 200, 205, 254, 265, 295, 385, 387, 393, 396, 399, 402, 405, 408, 411, 414, 417, 420, 423, 426, 429, 431, 434, 475, 478, 484, 513, 528, 557, 606, 610, 618, 622, 639, 663, 679, 699, 733, 748, 760, 771, 787, 810, 833, 847, 871, 900, 925, 962, 1007, 1050, 1080, 1152, 1164]
def arg(name, default):
    return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
def full(n):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", VID, "-vf", f"select=eq(n\\,{n})", "-vframes", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return Image.frombytes("RGB", (1280, 720), raw)
def font(size):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"):
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
cmd = sys.argv[1]
if cmd == "strip":
    a, b, out = int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]; step, cols, w = arg("--step", 1), arg("--cols", 6), arg("--w", 320)
    ns = list(range(a, b + 1, step)); h = round(w * 9 / 16); rows = (len(ns) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (w + 4) + 4, rows * (h + 22) + 4), "white"); d = ImageDraw.Draw(sheet); f = font(14)
    for k, n in enumerate(ns):
        im = Image.open(os.path.join(REF, "frames", f"f{n:04d}.jpg")).resize((w, h), Image.LANCZOS) if w <= 640 else full(n).resize((w, h), Image.LANCZOS)
        x, y = 4 + (k % cols) * (w + 4), 4 + (k // cols) * (h + 22)
        sheet.paste(im, (x, y + 18)); cut = " CUT" if n in CUTS else ""
        d.text((x + 2, y + 1), f"f{n}  {n / FPS:.3f}s{cut}", fill=(200, 0, 0) if cut else (0, 0, 0), font=f)
    sheet.save(out); print(out, sheet.size, len(ns), "frames")
elif cmd == "full":
    full(int(sys.argv[2])).save(sys.argv[3]); print(sys.argv[3])
elif cmd == "crop":
    n, x, y, w, h, out = int(sys.argv[2]), *map(int, sys.argv[3:7]), sys.argv[7]; s = arg("--scale", 2.0)
    im = full(n).crop((x, y, x + w, y + h)); im.resize((round(w * s), round(h * s)), Image.LANCZOS).save(out); print(out)
elif cmd == "diff":
    a, b = int(sys.argv[2]), int(sys.argv[3]); fr = np.load(os.path.join(REF, "frac.npy"))
    for n in range(max(1, a), b + 1): print(f"f{n:4d} {n / FPS:7.3f}s  {fr[n - 1]:5.1f}% {'#' * int(min(60, fr[n - 1]))}{'  CUT' if n in CUTS else ''}")
elif cmd == "color":
    n, x, y = int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]); r = int(sys.argv[5]) if len(sys.argv) > 5 else 2
    px = np.asarray(full(n))[max(0, y - r):y + r + 1, max(0, x - r):x + r + 1].reshape(-1, 3).mean(0); print("#%02X%02X%02X" % tuple(int(round(v)) for v in px))
elif cmd == "cuts":
    print(" ".join(f"{c}({c / FPS:.3f}s)" for c in CUTS))
