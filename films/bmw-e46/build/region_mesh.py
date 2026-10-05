"""Sub-meshes of the body for the transparent layers: the glass (windscreen, side and rear glass) and the light
lenses (headlights, fog lights). The regions come from the same projection maps the paint shader reads, sampled at
the vertices with a margin; the shader cuts the exact outline. Glass sits 3 mm inboard, lenses 1 mm."""
import sys
sys.path.insert(0, 'build')
import numpy as np
from PIL import Image
import trimesh

d = np.load('build/body_raw.npz'); V, N, F = d['V'], d['N'], d['F']
SC = 2136.5
s = SC - V[:, 0] * 1000; h = V[:, 1] * 1000; y = V[:, 2] * 1000
n = N

def tex(name):
    return np.array(Image.open(f'film/public/tex/{name}.png')).astype(np.float32) / 255.0

def sample(img, u, v):
    H, W = img.shape[:2]
    x = np.clip((u * W).astype(int), 0, W - 1); r = np.clip(((1 - v) * H).astype(int), 0, H - 1)
    return img[r, x]

def sm(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

S, S2, T, Fr, F2 = tex('side'), tex('side2'), tex('top'), tex('front'), tex('front2')
uvS = ((s + 60) / 4620, (h - 100) / 1300); uvT = ((s + 60) / 4620, (y + 920) / 1840); uvF = ((y + 920) / 1840, (h - 100) / 1000)
wS = sm(0.05, 0.25, np.abs(n[:, 2])); wT = sm(0.05, 0.25, n[:, 1]); wF = sm(0.02, 0.2, n[:, 0]) * (s < 700)
glass = np.maximum(sample(S, *uvS)[:, 0] * wS, np.maximum(sample(T, *uvT)[:, 0], sample(T, *uvT)[:, 1]) * wT)
lens = np.maximum(sample(Fr, *uvF)[:, 0] * wF, sample(S2, *uvS)[:, 0] * wS * (s < 480))
lens = np.maximum(lens, sample(F2, *uvF)[:, 0] * wF)

def sub(mask, inset, name):
    keep = mask > 0.01
    # grow by two rings of neighbours so the shader, not the triangles, decides the outline
    for _ in range(3):
        tri = keep[F].any(1)
        keep = np.zeros_like(keep); keep[F[tri].ravel()] = True
    tri = keep[F].all(1) | keep[F].any(1)
    Fs = F[tri]
    used = np.unique(Fs); remap = -np.ones(len(V), int); remap[used] = np.arange(len(used))
    Vs = V[used] - N[used] * inset; Ns = N[used]
    m = trimesh.Trimesh(Vs, remap[Fs], vertex_normals=Ns, process=False)
    m.export(f'film/public/models/{name}.glb')
    print(name, len(Vs), len(Fs))

sub(glass, 0.003, 'glass')
sub(lens, 0.001, 'lens')
