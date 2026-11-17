# The logo reveals the text: the text slides out from behind the logo's right edge while the logo travels to its
# place (frames 346-369); the logo itself is kept exactly as in the original frames (un-composited from white by its
# green alpha), the original text pop is removed. Frames 370+ stay original.   python3 logo_reveal.py <frames dir> <out dir>
import sys, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
ld = lambda n: np.asarray(Image.open(f'{src}/f{n:03d}.png').convert('RGB')).astype(np.float32)
fin = ld(400); X = np.arange(fin.shape[1])[None, :, None]
text = np.full_like(fin, 255.0); text[:, 285:] = fin[:, 285:]          # the final text (logo excluded), on white
D, N0, N1, FE = 360.0, 347, 369, 14.0
ease = lambda u: 1 - (1 - min(max(u, 0), 1)) ** 3
for n in range(346, 370):
    f = ld(n); r, g, b = f[..., 0], f[..., 1], f[..., 2]
    nonw = np.maximum(255 - b, 1)
    a = np.where(((g - b) / nonw > 0.4) & (255 - b > 6), np.clip((255 - b) / 195.0, 0, 1), 0)[..., None]   # the logo's alpha
    green = ((g > r + 25) & (g > b + 25)); cols = np.where(green.sum(0) > 2)[0]
    edge = (cols.min() + cols.max()) / 2 if len(cols) else 0   # Karl: the logo clearly OVER the text: it comes out from under the logo's centre
    dx = int(round(-(1 - ease((n - N0) / (N1 - N0))) * D))
    sh = np.full_like(text, 255.0)
    if dx < 0: sh[:, :dx] = text[:, -dx:]
    else: sh[:] = text
    m = np.clip((X - edge) / FE, 0, 1)
    under = 255 + (sh - 255) * m
    fl = np.where(a > 0, f, 255.0)                                         # only the logo (the original text pop removed)
    o = fl + (under - 255) * (1 - a)                                      # logo over the new background
    Image.fromarray(np.clip(o + 0.5, 0, 255).astype(np.uint8)).save(f'{out}/f{n:03d}.png')
print('ok')
