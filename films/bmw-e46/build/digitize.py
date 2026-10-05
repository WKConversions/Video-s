"""Digitize BMW's E46/2 (coupe) dimension drawing into silhouettes in millimetres.
The drawing is modelling reference only (BMW ST034 training manual); nothing of it appears in the film.
Outputs build/bp/*.npz: masks on a 2 mm grid in car coordinates.
Side: s = mm from the front bumper (0..4488), h = mm above ground. Plan: s and y (lateral, + = right).
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'assets/ref/body/MODELREF-ONLY_bmw-st034_e46-2-coupe_dimensions_side-front-rear-top.png'
im = np.array(Image.open(SRC).convert('L')).astype(np.float32)
K = 1.21  # displayed->original

def silhouette(crop, ground_row=None, seed=(2, 2), close=2):
    x0, y0, x1, y1 = [int(round(v * K)) for v in crop]
    a = im[y0:y1, x0:x1]
    dark = a < 150
    dark = ndi.binary_dilation(dark, iterations=close)
    if ground_row is not None:
        dark[ground_row - y0 - 2:, :] = True  # treat everything below the ground as wall
    ext = ndi.label(~dark)[0]
    outside = ext == ext[seed[1], seed[0]]
    sil = ~outside
    sil = ndi.binary_erosion(sil, iterations=close)  # undo the dilation on the outer edge
    return sil, (x0, y0)

# ---- side view: crop (225,310)-(1300,800) displayed; ground at crop row 404, front axle col 232, rear axle col 998
side, (sx0, sy0) = silhouette((225, 310, 1300, 800), ground_row=None)
MM = 2725 / 766.0
fx = 232 - 774 / MM        # front end in crop px
g = 404
H, W = side.shape
# cut the ground line and dimension lines: keep rows above the ground
side[g - 1:, :] = False
np.savez_compressed('build/bp/side_mask.npz', mask=side, mm=MM, fx=fx, g=g)
ys, xs = np.nonzero(side)
print('side extent s', (xs.min() - fx) * MM, (xs.max() - fx) * MM, 'h', (g - ys.max()) * MM, (g - ys.min()) * MM)
Image.fromarray((side * 255).astype(np.uint8)).save('build/bp/side_mask.png')

# ---- plan view: crop (205,1300)-(1300,1780) displayed
top, (tx0, ty0) = silhouette((205, 1300, 1300, 1780))
np.savez_compressed('build/bp/top_mask.npz', mask=top)
Image.fromarray((top * 255).astype(np.uint8)).save('build/bp/top_mask.png')
ys, xs = np.nonzero(top)
print('top extent cols', xs.min(), xs.max(), 'rows', ys.min(), ys.max())

# ---- front view: crop (225,810)-(780,1250)
front, _ = silhouette((225, 810, 780, 1250))
Image.fromarray((front * 255).astype(np.uint8)).save('build/bp/front_mask.png')
np.savez_compressed('build/bp/front_mask.npz', mask=front)
ys, xs = np.nonzero(front); print('front extent cols', xs.min(), xs.max(), 'rows', ys.min(), ys.max())
rear, _ = silhouette((800, 810, 1300, 1250))
Image.fromarray((rear * 255).astype(np.uint8)).save('build/bp/rear_mask.png')
np.savez_compressed('build/bp/rear_mask.npz', mask=rear)
ys, xs = np.nonzero(rear); print('rear extent cols', xs.min(), xs.max(), 'rows', ys.min(), ys.max())
