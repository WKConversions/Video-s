# Builds the film's vector assets from the site: the logo mark (traced), the word guitar, the low-poly instruments
# (re-triangulated from Karl's screenshot so they stay sharp at 1080p), and the partner logos (cropped from the site strips).
import json, numpy as np, cv2, random
from PIL import Image, ImageFont, ImageDraw
from scipy.spatial import Delaunay
OUT = 'film/src/assets.json'; A = {}
# 1 logo mark: rows 60-120 of logo.jpg, upscaled 8x, white on teal
im = np.array(Image.open('harvest/img/logo.jpg').convert('L'))[58:120, :]
big = cv2.resize(im, None, fx=8, fy=8, interpolation=cv2.INTER_CUBIC); big = cv2.GaussianBlur(big, (9, 9), 0)
_, th = cv2.threshold(big, 170, 255, cv2.THRESH_BINARY)
cs, hier = cv2.findContours(th, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
xs = np.concatenate([c[:, 0, 0] for c in cs]); ys = np.concatenate([c[:, 0, 1] for c in cs])
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max(); s = 1 / (y1 - y0)
paths = []
for c in cs:
    if cv2.contourArea(c) < 200: continue
    c = cv2.approxPolyDP(c, 2.0, True)[:, 0, :]
    paths.append('M' + 'L'.join(f'{(x - x0) * s:.4f},{(y - y0) * s:.4f}' for x, y in c) + 'Z')
A['mark'] = {'d': ' '.join(paths), 'aspect': float((x1 - x0) / (y1 - y0))}
# 2 the word guitar (1000 x 1000 px box, tilted 22 degrees, neck to the upper right)
W, H = 760, 1000; m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
cx = W // 2
d.ellipse((cx - 300, 560, cx + 300, 990), 255)                 # lower bout
d.ellipse((cx - 225, 380, cx + 225, 700), 255)                 # upper bout
d.rectangle((cx - 190, 600, cx + 190, 760), 255)               # waist
d.rectangle((cx - 58, 120, cx + 58, 420), 255)                 # neck
d.rounded_rectangle((cx - 80, 0, cx + 80, 150), 30, 255)       # headstock
d.ellipse((cx - 70, 640, cx + 70, 780), 0)                     # sound hole
mask = np.array(m) > 128
fonts = {w: f'plan/ttf/m{i}.ttf' for i, w in ((1, 500), (2, 700), (3, 800))}
WORDS = ['music', 'melody', 'rhythm', 'piano', 'guitar', 'violin', 'singing', 'drums', 'song', 'tempo', 'concert', 'sound',
         'lessons', 'notes', 'harmony', 'chords', 'voice', 'stage', 'practice', 'learn', 'play', 'scales', 'beat', 'duet']
random.seed(11); out = []; y = 4
SIZES = [16, 20, 24, 30, 36, 44, 54, 66]
while y < H - 12:
    span_w = mask[min(y + 10, H - 1)].sum()
    size = random.choices(SIZES, weights=[3, 4, 4, 4, 3, 3, 2, 1.2] if span_w > 250 else [5, 5, 4, 3, 1, 0.5, 0, 0])[0]; h = int(size * 0.8)
    band = mask[y:y + h].all(0) if y + h < H else np.zeros(W, bool)
    spans = []; inr = False
    for x in range(W):
        if band[x] and not inr: sx = x; inr = True
        if (not band[x] or x == W - 1) and inr: spans.append((sx, x)); inr = False
    for sx, ex in spans:
        if ex - sx < size * 1.8: continue
        row = []; x = sx; tries = 0
        while tries < 20:
            wd = random.choice(WORDS); case = random.choice(['lower', 'upper', 'lower', 'title'])
            t = wd.upper() if case == 'upper' else wd.title() if case == 'title' else wd
            wt = random.choice([500, 700, 800, 800]); f = ImageFont.truetype(fonts[wt], size)
            tw = f.getlength(t)
            if x + tw <= ex: row.append([t, x, tw, wt]); x += tw + size * 0.22; tries = 0
            else: tries += 1
        if row:
            gap = (ex - (row[-1][1] + row[-1][2]))
            n = len(row)
            for i, (t, rx, tw, wt) in enumerate(row):
                off = gap * i / (n - 1) if n > 1 else gap / 2
                key = t.lower() in ('piano', 'guitar', 'violin', 'singing', 'drums')
                out.append({'t': t, 'x': round(rx + off, 1), 'y': y, 's': size, 'w': wt, 'k': int(key)})
    y += h + 3
A['guitarBox'] = [W, H]
A['guitar'] = out; print('guitar words', len(out))
# 3 low-poly instruments from screenshot 6 (409 x 525)
src = np.array(Image.open('harvest/6.png').convert('RGB')).astype(np.float32)
nonwhite = (src.min(-1) < 236) | ((src.max(-1) - src.min(-1)) > 30)
nonwhite = cv2.morphologyEx(nonwhite.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
blur = cv2.GaussianBlur(src, (0, 0), 2.5)
pts = []
cs, _ = cv2.findContours(nonwhite.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
for c in cs:
    if cv2.contourArea(c) < 80: continue
    for p in cv2.approxPolyDP(c, 1.2, True)[:, 0, :]: pts.append(p)
rng = np.random.default_rng(3)
for yy in range(0, 525, 26):
    for xx in range(0, 409, 26):
        p = np.array([xx + rng.uniform(-9, 9), yy + rng.uniform(-9, 9)])
        if 0 <= p[0] < 409 and 0 <= p[1] < 525 and nonwhite[int(p[1]), int(p[0])]: pts.append(p)
pts = np.array(pts, float); tri = Delaunay(pts); polys = []
for simp in tri.simplices:
    P = pts[simp]; c = P.mean(0)
    if not nonwhite[int(c[1]), int(c[0])]: continue
    msk = np.zeros(nonwhite.shape, np.uint8); cv2.fillConvexPoly(msk, P.astype(np.int32), 1)
    sel = (msk > 0) & nonwhite
    col = np.median(blur[sel], 0) if sel.sum() > 3 else blur[int(c[1]), int(c[0])]
    polys.append({'p': [round(v, 1) for v in P.flatten()], 'c': '#%02x%02x%02x' % tuple(int(v) for v in col), 'cx': round(c[0], 1), 'cy': round(c[1], 1)})
A['poly'] = {'w': 409, 'h': 525, 'tris': polys}; print('triangles', len(polys))
json.dump(A, open(OUT, 'w'))
# 4 partner logos
crops = [('harvest/img/logo-web-nueva-1-1030x146.png', [(24, 225, 'bosendorfer'), (300, 474, 'trinity'), (550, 831, 'laschapas')]),
         ('harvest/img/logo-web2-9-1030x146.png', [(20, 298, 'gobierno'), (362, 479, 'svenska'), (550, 769, 'montessori'), (841, 956, 'deutsche')])]
for f, cl in crops:
    a = Image.open(f).convert('RGBA')
    for x0, x1, n in cl:
        c = a.crop((x0 - 4, 0, x1 + 4, a.height)); bb = c.getbbox(); c = c.crop(bb); c.save(f'film/public/img/logos/{n}.png'); print(n, c.size)
