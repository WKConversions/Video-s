# Builds site/storyboard-frames.jpg: every storyboard frame in reading order, images only (no labels, numbers or times).
# Run: python3 make_frames_sheet.py
import os
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
FR = os.path.join(HERE, 'site', 'frames')
files = sorted(f for f in os.listdir(FR) if f.endswith('.jpg'))
COLS, TW, TH, GAP, M, R = 6, 800, 450, 28, 56, 16
rows = [files[i:i + COLS] for i in range(0, len(files), COLS)]
W = M * 2 + COLS * TW + (COLS - 1) * GAP
H = M * 2 + len(rows) * TH + (len(rows) - 1) * GAP
sheet = Image.new('RGB', (W, H), (238, 240, 244))
mask = Image.new('L', (TW * 4, TH * 4), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, TW * 4 - 1, TH * 4 - 1), R * 4, fill=255)
mask = mask.resize((TW, TH), Image.LANCZOS)
for r, row in enumerate(rows):
    x0 = M + (COLS - len(row)) * (TW + GAP) // 2          # a short last row sits centred
    for c, f in enumerate(row):
        im = Image.open(os.path.join(FR, f)).convert('RGB').resize((TW, TH), Image.LANCZOS)
        sheet.paste(im, (x0 + c * (TW + GAP), M + r * (TH + GAP)), mask)
out = os.path.join(HERE, 'site', 'storyboard-frames.jpg')
sheet.save(out, quality=92, subsampling=0)
sheet.resize((W // 10, H // 10)).save(os.path.join(os.environ.get('SCRATCH', '/tmp'), 'sheet-small.png'))
print(out, sheet.size, os.path.getsize(out) // 1024, 'KB')
