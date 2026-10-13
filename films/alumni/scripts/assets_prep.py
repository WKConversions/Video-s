# Makes film-ready copies of the harvested Alumni assets (originals in assets/site/ stay untouched):
#  - assets/site/brand/alumni-logo-cutout.png : the AL monogram on a transparent background, cropped
#    to the mark + 4% padding. The site's PNG is RGB on a noisy near-white (#FCFCFC-#FFFFFF) square,
#    so the white is unmixed from each pixel (alpha = how far the pixel is from white towards its
#    nearest brand colour), which keeps anti-aliased edges and the lime/green join.
#  - assets/site/svg/*.svg : the page's inline SVGs (value shapes, audience icons, journey route) with
#    the CSS variables and the class styling they inherit written in, so they render on their own.
#   python3 -I scripts/assets_prep.py        (run from films/alumni)
import re
from pathlib import Path
import numpy as np
from PIL import Image

VARS = {'--orange': '#fe6c02', '--lime': '#6abb24', '--green': '#028b45', '--green-accessible': '#006b38', '--ink': '#17271f'}

def logo():
    a = np.asarray(Image.open('assets/site/brand/alumni-logo.png').convert('RGB')).astype(np.float64)
    W = np.array([254.0, 254.0, 254.0])
    F = np.array([[254, 108, 1], [106, 188, 36], [2, 140, 69]], np.float64)   # measured: orange A, lime L stem, green L foot
    d = a - W
    best = np.full(a.shape[:2], -1.0)
    for f in F:   # projection of (pixel - white) onto (brand colour - white): 0 = white, 1 = the brand colour
        v = f - W; t = (d @ v) / (v @ v)
        best = np.maximum(best, t)
    alpha = np.clip(best, 0, 1)
    alpha[alpha < 0.05] = 0
    al = np.where(alpha > 0, alpha, 1)[..., None]
    rgb = np.clip((a - (1 - alpha[..., None]) * W) / al, 0, 255)   # unpremultiply the white out
    out = np.dstack([rgb, alpha * 255]).round().astype(np.uint8)
    ys, xs = np.where(alpha > 0.5)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    pad = int(round(0.04 * (x1 - x0)))
    im = Image.fromarray(out, 'RGBA').crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
    im.save('assets/site/brand/alumni-logo-cutout.png', optimize=True)
    print('logo cutout', im.size, 'mark bbox in original', (int(x0), int(y0), int(x1), int(y1)))

def svgs():
    src = Path('harvest/svg'); dst = Path('assets/site/svg'); dst.mkdir(parents=True, exist_ok=True)
    names = {'svg-07-object.svg': 'value-connection.svg', 'svg-08-object.svg': 'value-growth.svg',
             'svg-09-object.svg': 'value-guidance.svg', 'svg-10-object.svg': 'value-opportunity.svg',
             'svg-11-audience-card-icon.svg': 'icon-graduates.svg', 'svg-13-audience-card-icon.svg': 'icon-employers.svg',
             'svg-15-audience-card-icon.svg': 'icon-agencies.svg', 'svg-17-journey-route.svg': 'journey-route.svg',
             'svg-00-nav-contact.svg': 'arrow-up-right.svg', 'svg-01-button.svg': 'arrow-right.svg'}
    for s, n in names.items():
        t = (src / s).read_text()
        t = re.sub(r'var\((--[\w-]+)\)', lambda m: VARS[m.group(1)], t)
        if 'value-shape' in t:   # .value-shape{stroke-width:12px} + round caps/joins on its paths
            t = t.replace('<svg ', '<svg stroke-width="12" stroke-linecap="round" stroke-linejoin="round" ', 1)
        if 'currentColor' in t:  # audience icons are drawn in --green-accessible on the page; arrows in ink
            t = t.replace('currentColor', '#006b38' if n.startswith('icon-') else '#17271f')
        if '<path d="M5 19 19 5M5 5h14v14"' in t or '<path d="M5 12h14' in t or 'stroke=' not in t:
            t = t.replace('<svg ', '<svg stroke="#17271f" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ', 1)
        t = re.sub(r' class="[^"]*"| aria-hidden="true"| focusable="false"', '', t)
        (dst / n).write_text(t + '\n')
    print('svgs', sorted(p.name for p in dst.glob('*.svg')))

logo(); svgs()
