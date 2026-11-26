# The K.B 2026 recolour LUT: python3 make_lut.py out.cube
# A smooth colour field in Lab: each anchor moves its old brand colour to the new one; colours near an anchor move
# with it (Gaussian falloff), neutrals (low chroma) do not move.
import sys, numpy as np

def srgb2lin(c): return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def lin2srgb(c): return np.where(c <= 0.0031308, 12.92 * c, 1.055 * np.clip(c, 0, None) ** (1 / 2.4) - 0.055)
M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
WP = np.array([0.95047, 1.0, 1.08883])
def rgb2lab(rgb):
    xyz = srgb2lin(rgb) @ M.T / WP
    f = np.where(xyz > (6 / 29) ** 3, np.cbrt(xyz), xyz / (3 * (6 / 29) ** 2) + 4 / 29)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)
def lab2rgb(lab):
    fy = (lab[..., 0] + 16) / 116; fx = fy + lab[..., 1] / 500; fz = fy - lab[..., 2] / 200
    f = np.stack([fx, fy, fz], -1)
    xyz = np.where(f > 6 / 29, f ** 3, 3 * (6 / 29) ** 2 * (f - 4 / 29)) * WP
    return lin2srgb(xyz @ np.linalg.inv(M).T)
hx = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)]) / 255

ANCHORS = [  # old -> new, sigma (Lab)
    ("#3A5170", "#172B44", 20),   # slate: the old logo tile and UI panels -> navy
    ("#2A3B52", "#0F2036", 16),   # old navy (headlines, darker panels) -> deep navy (keeps it darker than the panels)
    ("#38C0F8", "#99CDFC", 18),   # the bright cyan -> the kit's light blue
    ("#D0E0F0", "#D3E5F7", 9),    # pale blue glows: pinned (a touch toward the kit's ice blue)
    ("#E8E8F0", "#E8E8F0", 6),    # the light canvas: pinned
    ("#306080", "#1C3A5E", 14),   # mid blue panels -> a navy tint
]
N = 65
g = np.linspace(0, 1, N)
B, G, R = np.meshgrid(g, g, g, indexing="ij")          # .cube order: R fastest
rgb = np.stack([R, G, B], -1).reshape(-1, 3)
lab = rgb2lab(rgb)
chroma = np.hypot(lab[:, 1], lab[:, 2])
gate = np.clip((chroma - 4) / 8, 0, 1); gate = gate * gate * (3 - 2 * gate)
num = np.zeros_like(lab); den = np.zeros(len(lab)); fall = np.zeros(len(lab))
for o, n, s in ANCHORS:
    lo, ln = rgb2lab(hx(o)), rgb2lab(hx(n))
    d2 = ((lab - lo) ** 2).sum(1)
    w = np.exp(-d2 / (2 * s * s))
    wp = w ** 6 + 1e-30
    num += wp[:, None] * (ln - lo); den += wp; fall = np.maximum(fall, w)
delta = num / np.maximum(den, 1e-9)[:, None] * (fall * gate)[:, None]
out = np.clip(lab2rgb(lab + delta), 0, 1)
with open(sys.argv[1], "w") as f:
    f.write(f"TITLE \"KB 2026 rebrand\"\nLUT_3D_SIZE {N}\n")
    for r, gg, b in out: f.write(f"{r:.6f} {gg:.6f} {b:.6f}\n")
for o, n, s in ANCHORS:
    i = (np.round(hx(o)[2] * (N - 1)) * N * N + np.round(hx(o)[1] * (N - 1)) * N + np.round(hx(o)[0] * (N - 1))).astype(int)
    print(o, "->", "#%02X%02X%02X" % tuple((out[i] * 255).round().astype(int)), "(target", n + ")")
for t in ["#FFFFFF", "#E8E8F0", "#D0E0F0", "#252525", "#7A8494", "#F7F7F7"]:
    v = hx(t); i = int(np.round(v[2] * (N - 1)) * N * N + np.round(v[1] * (N - 1)) * N + np.round(v[0] * (N - 1)))
    print(t, "->", "#%02X%02X%02X" % tuple((out[i] * 255).round().astype(int)))
