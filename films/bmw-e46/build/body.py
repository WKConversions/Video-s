"""Procedural BMW E46 coupe body (pre-facelift), built as a smooth implicit solid from BMW's dimension drawing
(side silhouette, plan width, front-view section) and meshed with marching cubes.
Drawing units: s = mm from the front bumper, h = mm above ground (drawing heights run 2.3% tall; scaled at export),
y = mm lateral. Export: GLB in metres, +X = front, +Y = up, +Z = right, origin on the ground under the wheelbase centre.
"""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from scipy.interpolate import PchipInterpolator
from skimage import measure
import trimesh

VOX = float(sys.argv[1]) if len(sys.argv) > 1 else 7.0
HSCALE = 1369 / 1401.0
SC = 774 + 2725 / 2  # wheelbase centre, s

# ---------------------------------------------------------------- side silhouette -> SDF on a 1.5 mm grid
sys.path.insert(0, 'build')
from outline import SIDE, catmull
from PIL import ImageDraw
RES = 1.5
S0, H0 = -120.0, 0.0
NW, NH = int(4700 / RES), int(1500 / RES)
poly = catmull(SIDE, n=16)
img = Image.new('L', (NW, NH), 0)
ImageDraw.Draw(img).polygon([((s - S0) / RES, (NH - 1) - (h - H0) / RES) for s, h in poly], fill=255)
mk = np.array(img) > 127
din = ndi.distance_transform_edt(mk) * RES
dout = ndi.distance_transform_edt(~mk) * RES
sdf_side = ndi.gaussian_filter(dout - din, 1.0)

def side_lookup(s, h):
    ci = (s - S0) / RES
    ri = (NH - 1) - (h - H0) / RES
    return ndi.map_coordinates(sdf_side, [ri.ravel(), ci.ravel()], order=1, mode='nearest').reshape(s.shape)

# ---------------------------------------------------------------- plan half-width W(s) (mm), mirrors removed
Wk = np.array([[-60, 0], [0, 120], [40, 330], [89, 460], [178, 675], [267, 767], [356, 810], [445, 840], [534, 853],
               [623, 858], [800, 865], [1000, 865], [1200, 856], [1450, 864], [1700, 870], [2100, 878], [2600, 879],
               [2900, 873], [3200, 868], [3500, 870], [3700, 864], [3826, 854], [4004, 829], [4093, 815], [4182, 799],
               [4271, 778], [4360, 738], [4420, 670], [4470, 520], [4500, 300], [4530, 0]], float)
Wf = PchipInterpolator(Wk[:, 0], Wk[:, 1])
# front-view section: half-width fraction by height (drawing heights)
Pk = np.array([[100, 0.90], [170, 0.925], [250, 0.962], [400, 0.985], [550, 1.0], [720, 1.0], [800, 0.992], [860, 0.978],
               [905, 0.955], [950, 0.915], [1000, 0.874], [1066, 0.826], [1149, 0.776], [1233, 0.718], [1317, 0.66],
               [1359, 0.62], [1420, 0.55]], float)
Pf = PchipInterpolator(Pk[:, 0], Pk[:, 1])
# extra inward taper of the greenhouse at the rear window / C-pillar (mm)
Ek = np.array([[0, 0], [3200, 0], [3500, 25], [3800, 45], [4100, 45], [4600, 45]], float)
Ef = PchipInterpolator(Ek[:, 0], Ek[:, 1])
# crown of the top surfaces (mm drop at the side edge)
Ck = np.array([[-100, 30], [1100, 32], [1300, 40], [2000, 48], [3200, 48], [3900, 40], [4600, 30]], float)
Cf = PchipInterpolator(Ck[:, 0], Ck[:, 1])

def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def smax(a, b, k):
    hh = np.maximum(k - np.abs(a - b), 0) / k
    return np.maximum(a, b) + hh * hh * k * 0.25

# ---------------------------------------------------------------- the 3D field
s1 = np.arange(-70, 4570, VOX)
y1 = np.arange(-905, 905 + VOX, VOX)
h1 = np.arange(110, 1440, VOX)
S, Y, Hm = np.meshgrid(s1, y1, h1, indexing='ij')
W = Wf(np.clip(S, -60, 4530))
ay = np.abs(Y)
# side SDF with crowned top surfaces
cr = Cf(S) * (np.clip(ay / np.maximum(W, 1), 0, 1.2) ** 2) * smoothstep(500, 760, Hm)
dS = side_lookup(S, Hm + cr)
# lateral
hw = W * Pf(np.clip(Hm, 100, 1420)) - Ef(S) * smoothstep(900, 1150, Hm)
dL = ay - hw
F = smax(dS, dL, 55.0)
# wheel arches
for sc, R in ((774, 382), (3499, 388)):
    hc = 327 / HSCALE * HSCALE  # tyre centre in drawing units ~ 327
    dA = np.sqrt((S - sc) ** 2 + (Hm - 327) ** 2) - R
    yin = 600
    cutA = np.maximum(dA, yin - ay)
    F = smax(F, -cutA, 14.0)
del dS, dL, cr, hw
print('field', F.shape, F.min(), F.max(), flush=True)
verts, faces, _, _ = measure.marching_cubes(F.astype(np.float32), level=0.0, spacing=(VOX, VOX, VOX), step_size=1)
verts += np.array([s1[0], y1[0], h1[0]])
# normals from the field gradient (smooth shading)
gs, gy, gh = np.gradient(F.astype(np.float32), VOX)
idx = [(verts[:, 0] - s1[0]) / VOX, (verts[:, 1] - y1[0]) / VOX, (verts[:, 2] - h1[0]) / VOX]
n = np.stack([ndi.map_coordinates(a, idx, order=1) for a in (gs, gy, gh)], 1)
n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-9
print('mesh', len(verts), len(faces), flush=True)
# to export space (metres): X = front, Y = up, Z = right
X = (SC - verts[:, 0]) / 1000; Yu = verts[:, 2] * HSCALE / 1000; Z = verts[:, 1] / 1000
V = np.stack([X, Yu, Z], 1)
N = np.stack([-n[:, 0], n[:, 2] / HSCALE, n[:, 1]], 1); N /= np.linalg.norm(N, axis=1, keepdims=True)
# marching cubes winding in (s,y,h) with the s axis flipped -> flip faces
mesh = trimesh.Trimesh(V, faces, vertex_normals=N, process=False)
np.savez_compressed('build/body_raw.npz', V=V.astype(np.float32), N=N.astype(np.float32), F=faces.astype(np.int32))
print('bounds', mesh.bounds)
