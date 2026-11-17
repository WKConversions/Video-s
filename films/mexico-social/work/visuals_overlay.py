import cv2, numpy as np, json
from PIL import Image
A = np.vstack([np.load('A_psd2ref.npy'), [0, 0, 1]])
tr = {int(k): v for k, v in json.load(open('track.json')).items()}
W, H = 1400, 720
def sprite(path):
    im = np.asarray(Image.open(path)).astype(np.float32)
    ys, xs = np.where(im[..., 3] > 0); return im, (xs.min(), ys.min(), xs.max(), ys.max())
SP = [('psd_statue.png', 188), ('psd_logo.png', 200)]   # (sprite, rise start frame): the statue with the tall tower, the logo with the second tower
SP = [(sprite(p), f0) for p, f0 in SP]
DUR = 14
ease = lambda u: 1 - (1 - min(max(u, 0), 1)) ** 3
for n in range(186, 243):
    M = tr.get(min(n, 240))[0]; Mn = np.vstack([M, [0, 0, 1]]) @ A
    fade = {241: 0.5, 242: 0.0}.get(n, 1.0)
    out = np.zeros((H, W, 4), np.float32)
    for (im, (x0, y0, x1, y1)), f0 in SP:
        p = ease((n - f0) / DUR)
        if p <= 0: continue
        hgt = y1 - y0 + 1
        # rise: the sprite slides up from below its own base line, clipped at that line (as the buildings emerge)
        T = np.array([[1, 0, 0], [0, 1, (1 - p) * hgt], [0, 0, 1]], np.float32)
        clip = im.copy(); 
        w = cv2.warpAffine(clip, (Mn @ T)[:2], (W, H), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
        base = (Mn @ np.array([0, y1 + 1, 1]))[1]
        w[int(np.ceil(base)):, :, 3] = 0
        a = w[..., 3:4] / 255.0 * fade; o = out[..., 3:4] / 255.0
        out[..., :3] = w[..., :3] * a + out[..., :3] * (1 - a); out[..., 3:4] = (a + o * (1 - a)) * 255
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA').save(f'ov/o{n:03d}.png')
print('ok')
