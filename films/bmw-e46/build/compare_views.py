"""Overlay the model's orthographic silhouettes on BMW's drawing (front, rear, top, side) and score the match.
Writes build/cmp/<view>.png (blueprint grey, model outline red) and prints IoU per view."""
import sys
sys.path.insert(0, 'build')
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

d = np.load(sys.argv[1] if len(sys.argv) > 1 else 'build/body_raw.npz')
V, F = d['V'], d['F']
# back to drawing units: s, y, h (drawing heights)
SC = 774 + 2725 / 2; HS = 1369 / 1401.0
s = SC - V[:, 0] * 1000; y = V[:, 2] * 1000; h = V[:, 1] * 1000 / HS
import os
os.makedirs('build/cmp', exist_ok=True)
SRC = 'assets/ref/body/MODELREF-ONLY_bmw-st034_e46-2-coupe_dimensions_side-front-rear-top.png'
bp = Image.open(SRC).convert('L')
K = 1.21

def raster(u, v, size):
    img = Image.new('L', size, 0)
    dr = ImageDraw.Draw(img)
    P = np.stack([u, v], 1)
    tri = P[F]
    # skip degenerate
    for t in tri:
        dr.polygon([tuple(t[0]), tuple(t[1]), tuple(t[2])], fill=255)
    return np.array(img) > 0

def overlay(name, crop, to_px, mask_bp):
    x0, y0, x1, y1 = [int(round(c * K)) for c in crop]
    base = bp.crop((x0, y0, x1, y1)).convert('RGB')
    W, H = base.size
    u, v = to_px
    m = raster(u, v, (W, H))
    m = ndi.binary_fill_holes(m)
    edge = m ^ ndi.binary_erosion(m, iterations=2)
    arr = np.array(base)
    arr[edge] = [230, 30, 30]
    Image.fromarray(arr).save(f'build/cmp/{name}.png')
    if mask_bp is not None:
        inter = (m & mask_bp).sum(); uni = (m | mask_bp).sum()
        # mean boundary distance (mm) from the blueprint outline to the model outline
        print(f'{name}: IoU {inter / uni:.4f}')
    return m

MM = 2725 / 766.0
# side: crop (225,310)-(1300,800); s -> col: fx + s/MM, h -> row: g - h/MM
fx = 232 - 774 / MM; g = 404
sm = np.load('build/bp/side_mask.npz')['mask']
overlay('side', (225, 310, 1300, 800), (fx + s / MM, g - h / MM), None)
# front view crop (225,810)-(780,1250): need centre col and ground row; scale: assume same mm/px as side
fm = np.load('build/bp/front_mask.npz')['mask']
ground_f = 411; cen_f = None
rows = np.nonzero(fm.any(1))[0]
r = ground_f - 120
c = np.nonzero(fm[r])[0]; cen_f = (c.min() + c.max()) / 2
cen_f = 296.0
print('front centre col', cen_f)
# front: viewer looks at the car's nose; the car's right (+y) appears on the image's left
overlay('front', (225, 810, 780, 1250), (cen_f - y / MM, ground_f - h / MM), None)
rm = np.load('build/bp/rear_mask.npz')['mask']
ground_r = 411
c = np.nonzero(rm[ground_r - 120])[0]; cen_r = (c.min() + c.max()) / 2
print('rear centre col', cen_r)
overlay('rear', (800, 810, 1300, 1250), (cen_r + y / MM, ground_r - h / MM), None)
# top: crop (205,1300)-(1300,1780); col = 27 + s/MMp, row = 289 + y/MMp (sign: image top = car's left?)
MMp = 4488 / (1288 - 27)
overlay('top', (205, 1300, 1300, 1780), (27 + s / MMp, 289 - y / MMp), None)

# ---- numeric section comparison: half-width per height, model vs drawing (mirrors excluded by the 1100-mm cap)
def halfwidths(mask, cen, ground):
    out = {}
    for hmm in range(150, 1400, 50):
        r = int(round(ground - hmm / MM))
        if r < 0 or r >= mask.shape[0]: continue
        c = np.nonzero(mask[r])[0]
        if len(c) == 0: continue
        # keep the run that contains the centre
        cc = int(round(cen)); 
        if not mask[r, cc]: continue
        lft = cc; 
        while lft > 0 and mask[r, lft - 1]: lft -= 1
        rgt = cc
        while rgt < mask.shape[1] - 1 and mask[r, rgt + 1]: rgt += 1
        out[hmm] = ((cc - lft) * MM, (rgt - cc) * MM)
    return out

def model_mask(name, crop, uv):
    x0, y0, x1, y1 = [int(round(c * K)) for c in crop]
    return ndi.binary_fill_holes(raster(uv[0], uv[1], (x1 - x0, y1 - y0)))

for name, crop, mbp, cen, uv in (('front', (225, 810, 780, 1250), fm, cen_f, (cen_f - y / MM, ground_f - h / MM)),
                                 ('rear', (800, 810, 1300, 1250), rm, cen_r, (cen_r + y / MM, ground_r - h / MM))):
    mm_ = model_mask(name, crop, uv)
    bpm = ndi.binary_opening(mbp, iterations=2)
    a, b = halfwidths(bpm, cen, 411), halfwidths(mm_, cen, 411)
    print(f'--- {name}: h  drawing(L,R)  model(L,R)  diff')
    for k in sorted(a):
        if k in b:
            dl = (a[k][0] + a[k][1]) / 2; ml = (b[k][0] + b[k][1]) / 2
            print(f'  {k:5d}  {a[k][0]:5.0f} {a[k][1]:5.0f}   {b[k][0]:5.0f} {b[k][1]:5.0f}   {ml - dl:+5.0f}')
