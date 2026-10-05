"""Mesh the implicit E46 body: marching cubes, a Newton step onto the surface, normals from the field.
Usage: python3 build/build_body.py [voxel_mm] -> build/body_raw.npz and film/public/models/body.glb"""
import sys, time
sys.path.insert(0, 'build')
import numpy as np
from skimage import measure
import trimesh
from carfield import Car, HSCALE, SC

VOX = float(sys.argv[1]) if len(sys.argv) > 1 else 8.0
t0 = time.time()
car = Car()
print('outlines', round(time.time() - t0, 1), flush=True)
s1 = np.arange(-80, 4580, VOX); y1 = np.arange(-910, 910 + VOX, VOX); h1 = np.arange(120, 1440, VOX)
F = np.empty((len(s1), len(y1), len(h1)), np.float32)
for i in range(0, len(s1), 40):  # chunks along s
    S, Y, H = np.meshgrid(s1[i:i + 40], y1, h1, indexing='ij')
    F[i:i + 40] = car.field(S, Y, H)
print('field', F.shape, round(time.time() - t0, 1), flush=True)
v, f, _, _ = measure.marching_cubes(F, level=0.0, spacing=(VOX, VOX, VOX))
v += np.array([s1[0], y1[0], h1[0]])
print('mc', len(v), len(f), round(time.time() - t0, 1), flush=True)
TARGET = int(sys.argv[2]) if len(sys.argv) > 2 else 280000
if len(f) > TARGET:
    import fast_simplification
    v, f = fast_simplification.simplify(v.astype(np.float32), f.astype(np.int32), target_reduction=1 - TARGET / len(f), agg=5)
    v = v.astype(np.float64)
    print('decimated', len(v), len(f), round(time.time() - t0, 1), flush=True)

def grad(p, e=2.5):
    s, y, h = p[:, 0], p[:, 1], p[:, 2]
    g = np.stack([(car.field(s + e, y, h) - car.field(s - e, y, h)),
                  (car.field(s, y + e, h) - car.field(s, y - e, h)),
                  (car.field(s, y, h + e) - car.field(s, y, h - e))], 1) / (2 * e)
    return g

for it in range(3):  # Newton steps onto the zero level set
    g = grad(v); fv = car.field(v[:, 0], v[:, 1], v[:, 2])
    gn = (g ** 2).sum(1, keepdims=True) + 1e-9
    v = v - np.clip(fv[:, None] * g / gn, -VOX * 0.5, VOX * 0.5)
n = grad(v); n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-9
print('refined', round(time.time() - t0, 1), flush=True)
X = (SC - v[:, 0]) / 1000; Yu = v[:, 2] * HSCALE / 1000; Z = v[:, 1] / 1000
V = np.stack([X, Yu, Z], 1)
N = np.stack([-n[:, 0], n[:, 2] / HSCALE, n[:, 1]], 1); N /= np.linalg.norm(N, axis=1, keepdims=True)
np.savez_compressed('build/body_raw.npz', V=V.astype(np.float32), N=N.astype(np.float32), F=f.astype(np.int32))
trimesh.Trimesh(V, f, vertex_normals=N, process=False).export('film/public/models/body.glb')
print('done', V.min(0), V.max(0), round(time.time() - t0, 1))
