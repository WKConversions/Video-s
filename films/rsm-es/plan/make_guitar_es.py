# Spanish word guitar for the Royal School of Music film (rsm-es): the same packing as rsm/plan/make_assets.py with Spanish words.
import json, random, numpy as np
from PIL import Image, ImageDraw, ImageFont
A = json.load(open('rsm-es/film/src/assets.json'))
W, H = 760, 1000; m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
cx = W // 2
d.ellipse((cx - 300, 560, cx + 300, 990), 255)                 # lower bout
d.ellipse((cx - 225, 380, cx + 225, 700), 255)                 # upper bout
d.rectangle((cx - 190, 600, cx + 190, 760), 255)               # waist
d.rectangle((cx - 58, 120, cx + 58, 420), 255)                 # neck
d.rounded_rectangle((cx - 80, 0, cx + 80, 150), 30, 255)       # headstock
d.ellipse((cx - 70, 640, cx + 70, 780), 0)                     # sound hole
mask = np.array(m) > 128
fonts = {w: f'rsm/plan/ttf/m{i}.ttf' for i, w in ((1, 500), (2, 700), (3, 800))}
WORDS = ['música', 'melodía', 'ritmo', 'piano', 'guitarra', 'violín', 'canto', 'batería', 'canción', 'tempo', 'concierto', 'sonido',
         'clases', 'notas', 'armonía', 'acordes', 'voz', 'escenario', 'práctica', 'aprende', 'toca', 'escalas', 'compás', 'dúo']
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
                key = t.lower() in ('piano', 'guitarra', 'violín', 'canto', 'batería')
                out.append({'t': t, 'x': round(rx + off, 1), 'y': y, 's': size, 'w': wt, 'k': int(key)})
    y += h + 3
A['guitar'] = out; A['guitarBox'] = [W, H]
json.dump(A, open('rsm-es/film/src/assets.json', 'w')); print('guitar words', len(out))
