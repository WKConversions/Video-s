# Builds storyboard-film.jpg: the FINAL film (deliver/wicflow-33s-1080p60.mp4) as one image, 24 key moments in story
# order, frames only (no labels, numbers or times), one end frame (the CTA press). Frames: film-frames/00-23.jpg,
# taken at 1.06 1.50 2.95 3.22 4.90 5.40 6.10 7.50 9.55 10.40 10.90 12.30 13.00 14.20 14.80 16.30 17.70 19.80 21.85
# 23.05 24.15 25.90 27.30 30.47 s.   Run: python3 make_film_sheet.py
import os
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); FR = os.path.join(HERE, 'film-frames')
files = sorted(f for f in os.listdir(FR) if f.endswith('.jpg'))
COLS, TW, TH, GAP, M, R = 6, 800, 450, 28, 56, 16
rows = [files[i:i + COLS] for i in range(0, len(files), COLS)]
W = M * 2 + COLS * TW + (COLS - 1) * GAP; H = M * 2 + len(rows) * TH + (len(rows) - 1) * GAP
sheet = Image.new('RGB', (W, H), (238, 240, 244))
mask = Image.new('L', (TW * 4, TH * 4), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, TW * 4 - 1, TH * 4 - 1), R * 4, fill=255)
mask = mask.resize((TW, TH), Image.LANCZOS)
for r, row in enumerate(rows):
    x0 = M + (COLS - len(row)) * (TW + GAP) // 2
    for c, f in enumerate(row):
        sheet.paste(Image.open(os.path.join(FR, f)).convert('RGB').resize((TW, TH), Image.LANCZOS), (x0 + c * (TW + GAP), M + r * (TH + GAP)), mask)
out = os.path.join(HERE, 'storyboard-film.jpg'); sheet.save(out, quality=92, subsampling=0)
print(out, sheet.size, os.path.getsize(out) // 1024, 'KB')
