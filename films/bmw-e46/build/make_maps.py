"""Rasterise the E46 surface details (details2d.py) into projection maps for the body shader, 1 px per mm, 2x
supersampled. Outputs film/public/tex/{side,side2,top,front,front2,rear}.png (RGBA) and a preview sheet.
Map frames (real mm; v up):
  side/side2: u = s + 60 over 4620, v = h - 100 over 1300
  top:        u = s + 60 over 4620, v = y + 920 over 1840 (y = lateral, + right)
  front/front2: u = y + 920 over 1840, v = h - 100 over 1000
  rear:       u = y + 920 over 1840, v = h - 100 over 1100   (y as seen in car coordinates, + right)
"""
import os, sys
sys.path.insert(0, 'build')
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from outline import catmull
import details2d as D

SS = 2
OUT = 'film/public/tex'
os.makedirs(OUT, exist_ok=True)


class Map:
    def __init__(self, w, h, u0, v0):
        self.W, self.H, self.u0, self.v0 = w, h, u0, v0
        self.ch = {c: Image.new('L', (w * SS, h * SS), 0) for c in 'RGBA'}

    def px(self, u, v):
        return ((u - self.u0) * SS, (self.H - (v - self.v0)) * SS)

    def poly(self, c, pts, smooth=True, val=255, closed=True):
        P = catmull(pts, n=10, closed=closed) if smooth and len(pts) > 3 else pts
        ImageDraw.Draw(self.ch[c]).polygon([self.px(u, v) for u, v in P], fill=val)

    def line(self, c, pts, w, smooth=True, val=255):
        P = catmull(pts, n=10, closed=False) if smooth and len(pts) > 3 else pts
        P = [self.px(u, v) for u, v in P]
        ImageDraw.Draw(self.ch[c]).line(P, fill=val, width=max(1, int(round(w * SS))), joint='curve')
        r = w * SS / 2
        for x, y in (P[0], P[-1]):
            ImageDraw.Draw(self.ch[c]).ellipse([x - r, y - r, x + r, y + r], fill=val)

    def ring(self, c, pts, w, smooth=True):  # outline of a closed shape
        P = catmull(pts, n=10, closed=True) if smooth and len(pts) > 3 else list(pts) + [pts[0]]
        if smooth:
            P = list(P) + [P[0]]
        self.line(c, P, w, smooth=False)

    def circle(self, c, cu, cv, r, val=255):
        x, y = self.px(cu, cv)
        ImageDraw.Draw(self.ch[c]).ellipse([x - r * SS, y - r * SS, x + r * SS, y + r * SS], fill=val)

    def band(self, c, pts, outer, inner=0.0, smooth=True):
        """the band between the shape grown by `outer` mm and grown by `inner` mm (a trim around a window)"""
        tmp = Image.new('L', self.ch[c].size, 0)
        P = catmull(pts, n=10, closed=True) if smooth else pts
        ImageDraw.Draw(tmp).polygon([self.px(u, v) for u, v in P], fill=255)
        a = np.array(tmp) > 0
        from scipy import ndimage as ndi
        dout = ndi.distance_transform_edt(~a) / SS
        din = ndi.distance_transform_edt(a) / SS
        sd = np.where(a, -din, dout)
        m = (sd <= outer) & (sd > inner)
        cur = np.array(self.ch[c])
        self.ch[c] = Image.fromarray(np.maximum(cur, (m * 255).astype(np.uint8)))

    def save(self, name):
        chans = [self.ch[c].resize((self.W, self.H), Image.BOX) for c in 'RGBA']
        Image.merge('RGBA', chans).save(f'{OUT}/{name}.png', optimize=True)
        return chans


def sym(P, lat=0):
    """a half shape that starts and ends on the centre line (coordinate `lat` = 0) -> the whole symmetric shape"""
    P = list(P)
    if lat == 0:
        m = [(-u, v) for u, v in P[::-1]]
    else:
        m = [(u, -v) for u, v in P[::-1]]
    return P + m[1:-1]

def symline(P, lat=0):
    """a half line ending on the centre line -> the whole line through it"""
    P = list(P)
    m = [(-u, v) for u, v in P[::-1]] if lat == 0 else [(u, -v) for u, v in P[::-1]]
    return P + m[1:]


hs, ls = D.HS, D.LS
side_pts = lambda P: [(s, h * hs) for s, h in P]
fr_pts = lambda P: [(y * ls, h * hs) for y, h in P]

# ------------------------------------------------------------------------------ side
side = Map(4620, 1300, -60, 100)
side.poly('R', side_pts(D.DLO))
side.band('G', side_pts(D.DLO), outer=15.0, inner=0.0)
side.line('G', side_pts(D.B_LINE), 13, smooth=False)
for L in (D.DOOR_FRONT, D.DOOR_REAR, D.FRONT_BUMPER_TOP, D.REAR_BUMPER_TOP, D.REAR_BUMPER_FRONT):
    side.line('B', side_pts(L), 3.5)
side.line('B', side_pts(D.SILL_LINE), 2.5, smooth=False)
side.ring('B', side_pts(D.DOOR_HANDLE), 2.5)
side.save('side')
side2 = Map(4620, 1300, -60, 100)
side2.poly('R', side_pts(D.HEADLIGHT_SIDE))
side2.poly('G', side_pts(D.TAILLIGHT_SIDE))
side2.poly('B', side_pts(D.SIDE_REPEATER))
side2.ring('A', side_pts(D.FUEL_FLAP), 3.0)
side2.save('side2')

# ------------------------------------------------------------------------------ top
top = Map(4620, 1840, -60, -920)
top.poly('R', sym(D.WINDSCREEN, 1))
top.poly('G', sym(D.REAR_WINDOW, 1))
top.line('B', symline(D.HOOD_EDGE[::-1], 1), 3.5)
top.line('B', symline(D.TRUNK_EDGE[:5][::-1], 1), 3.5)
for sgn in (1, -1):
    flip = lambda P: [(s, sgn * y) for s, y in P]
    top.line('B', flip(D.TRUNK_EDGE[4:]), 3.5)
top.poly('A', sym(D.COWL[:6] + D.COWL[6:], 1))
top.save('top')

# ------------------------------------------------------------------------------ front
front = Map(1840, 1000, -920, 100)
front2 = Map(1840, 1000, -920, 100)
for sgn in (1, -1):
    F = lambda P: [(sgn * y, h) for y, h in fr_pts(P)]
    front.poly('R', F(D.HEADLIGHT))
    front.poly('G', F(D.KIDNEY_OUT))
    front.poly('A', F(D.KIDNEY_IN))
    front.poly('A', F(D.FOG_HOUSING))

    for L in (D.BUMPER_TOP_F, D.BUMPER_STRIP_F, D.LOWER_LIP):
        front.line('B', F(L), 3.5)

    (fy, fh), fr = D.FOG
    front2.circle('R', sgn * fy * ls, fh * hs, fr)
    for L in D.CHROME_STRIPS_F:
        front.line('G', F(L), 7.0, smooth=False)

front.poly('A', sym(fr_pts(D.LOWER_INTAKE)), smooth=False)
front.ring('B', sym(fr_pts(D.PLATE_RECESS_F)), 3.0, smooth=False)
front2.poly('G', sym(fr_pts(D.PLATE_RECESS_F)), smooth=False)
# the kidney chrome is the ring between the outer and inner outlines
g = np.array(front.ch['G']); a = np.array(front.ch['A'])
kid_in = Image.new('L', front.ch['G'].size, 0)
for sgn in (1, -1):
    ImageDraw.Draw(kid_in).polygon([front.px(u, v) for u, v in catmull([(sgn * y, h) for y, h in fr_pts(D.KIDNEY_IN)], n=10)], fill=255)
front.ch['G'] = Image.fromarray(np.where(np.array(kid_in) > 0, 0, g).astype(np.uint8))
front2.ch['B'] = kid_in
mesh_img = Image.new('L', front.ch['G'].size, 0)
ImageDraw.Draw(mesh_img).polygon([front.px(u, v) for u, v in sym(fr_pts(D.LOWER_INTAKE))], fill=255)
front2.ch['A'] = mesh_img
front.save('front')
front2.save('front2')

# ------------------------------------------------------------------------------ rear
rear = Map(1840, 1100, -920, 100)
for sgn in (1, -1):
    F = lambda P: [(sgn * y, h) for y, h in fr_pts(P)]
    # taillights: red above the split, indicator / reverse below
    for T in (D.TAIL_OUTER, D.TAIL_INNER):
        rear.poly('R', F(T), smooth=False)

    rear.line('B', F(D.BUMPER_TOP_R), 3.5)
    for L in D.BUMPER_LINES_R:
        rear.line('B', F(L), 3.0, smooth=False)
    rear.poly('A', F(D.REFLECTOR))
rear.ring('B', sym(fr_pts(D.PLATE_RECESS_R)), 3.0, smooth=False)
rear.line('B', symline(fr_pts(D.TRUNK_SHUT_R)), 3.5)
# split the lights: G = the part below the split line (indicator / reverse)
r = np.array(rear.ch['R']).copy()
rows = np.arange(r.shape[0])[:, None]
split_row = (rear.H - (D.TAIL_SPLIT * hs - rear.v0)) * SS
rear.ch['G'] = Image.fromarray(np.where(rows > split_row, r, 0).astype(np.uint8))
rear.ch['R'] = Image.fromarray(np.where(rows > split_row, 0, r).astype(np.uint8))
rear.save('rear')

# ------------------------------------------------------------------------------ preview sheet
def rgb(name, scale):
    im = Image.open(f'{OUT}/{name}.png')
    R, G, B, A = im.split()
    base = Image.new('RGB', im.size, (245, 245, 245))
    arr = np.array(base).astype(float)
    for ch, col in ((R, (60, 120, 220)), (G, (230, 170, 30)), (B, (0, 0, 0)), (A, (200, 40, 160))):
        m = np.array(ch)[..., None] / 255.0
        arr = arr * (1 - m) + np.array(col) * m
    return Image.fromarray(arr.astype(np.uint8)).resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)

s1, s2, t, f, f2, r_ = rgb('side', 0.3), rgb('side2', 0.3), rgb('top', 0.3), rgb('front', 0.5), rgb('front2', 0.5), rgb('rear', 0.5)
W = max(s1.width, f.width + f2.width + r_.width)
sheet = Image.new('RGB', (W, s1.height + s2.height + t.height + f.height + 30), 'white')
y = 0
for im in (s1, s2, t):
    sheet.paste(im, (0, y)); y += im.height + 5
sheet.paste(f, (0, y)); sheet.paste(f2, (f.width + 5, y)); sheet.paste(r_, (f.width + f2.width + 10, y))
sheet.save('build/maps_preview.png')
print('maps written')
