"""The E46 coupe (pre-facelift) as a smooth implicit solid, v2.

Built from BMW's E46/2 dimension drawing (modelling reference only): two side outlines (the lower body or 'tub', and
the greenhouse), the plan outline, the front-view section and the plan view of the glass. Every lateral shape is a
function of the station s, so the character lines of the real car are explicit:
  - the shoulder crease from the headlight to the taillight (rising 730 -> 855 mm),
  - the belt step where the glass sits inboard of the shoulder,
  - the tumblehome of the side glass and the roof edge,
  - the wrap of the windscreen and rear window (their corners recede in plan),
  - the rounded nose and tail in plan (each height keeps its own side profile, shifted back at the corners),
  - wheel arches with a lip.
Drawing units: s = mm from the front bumper, y = lateral mm (+ right), h = mm above ground in drawing units (the
drawing runs 2.3% tall; HSCALE corrects at export). field(s, y, h) < 0 inside.
"""
import numpy as np
from scipy import ndimage as ndi
from scipy.interpolate import PchipInterpolator
from scipy.spatial import cKDTree
from matplotlib.path import Path

from outline import catmull

HSCALE = 1369 / 1401.0
SC = 774 + 2725 / 2  # wheelbase centre, s
WHEELS = ((774.0, 327.0), (3499.0, 327.0))  # wheel centres (s, h) in drawing units


def pchip(pts):
    a = np.array(pts, float)
    f = PchipInterpolator(a[:, 0], a[:, 1], extrapolate=False)
    lo, hi = a[0], a[-1]

    def g(x):
        x = np.asarray(x, float)
        return np.where(x <= lo[0], lo[1], np.where(x >= hi[0], hi[1], f(np.clip(x, lo[0], hi[0]))))
    return g


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def smin(a, b, k):
    hh = np.maximum(k - np.abs(a - b), 0) / k
    return np.minimum(a, b) - hh * hh * k * 0.25


def smax(a, b, k):
    return -smin(-a, -b, k)


# ------------------------------------------------------------------------------------------------ 2D outline SDFs
class Outline2D:
    """Exact signed distance to a closed spline outline in (s, h), tabulated on a 2 mm grid."""

    def __init__(self, pts, res=2.0, pad=150):
        c = catmull(pts, n=24)
        # dense resample for exact distances
        seg = np.vstack([c, c[:1]])
        d = np.linalg.norm(np.diff(seg, axis=0), axis=1)
        dense = []
        for i in range(len(c)):
            k = max(1, int(d[i] / 0.5))
            t = np.linspace(0, 1, k, endpoint=False)[:, None]
            dense.append(seg[i] + (seg[i + 1] - seg[i]) * t)
        dense = np.vstack(dense)
        tree = cKDTree(dense)
        self.s0, self.h0 = c[:, 0].min() - pad, c[:, 1].min() - pad
        s1, h1 = c[:, 0].max() + pad, c[:, 1].max() + pad
        self.res = res
        ss = np.arange(self.s0, s1, res)
        hh = np.arange(self.h0, h1, res)
        S, H = np.meshgrid(ss, hh, indexing='ij')
        P = np.stack([S.ravel(), H.ravel()], 1)
        dist, _ = tree.query(P, workers=-1)
        inside = Path(c).contains_points(P)
        self.grid = np.where(inside, -dist, dist).reshape(S.shape).astype(np.float32)
        # cubic B-spline coefficients: a C2-smooth field, so the shading has no grid bands
        self.coef = ndi.spline_filter(self.grid.astype(np.float64), order=3, mode='nearest')

    def __call__(self, s, h):
        si = (np.asarray(s) - self.s0) / self.res
        hi = (np.asarray(h) - self.h0) / self.res
        return ndi.map_coordinates(self.coef, [si.ravel(), hi.ravel()], order=3, mode='nearest',
                                   prefilter=False).reshape(np.shape(s))


# The lower body: nose, bonnet, the belt line through the cabin, the boot lid, tail and underside.
TUB = [
    (150, 203), (95, 212), (70, 235), (62, 280), (58, 340), (45, 380), (32, 420), (28, 470), (32, 525), (48, 545),
    (70, 553), (78, 580), (88, 640), (100, 690), (116, 728), (140, 760), (180, 788), (240, 812),
    (350, 836), (500, 866), (650, 893), (800, 914), (1000, 946), (1100, 960), (1150, 964), (1200, 962),
    (1300, 966), (1600, 975), (2000, 985), (2500, 995), (3000, 1005), (3400, 1015), (3700, 1035), (3900, 1058),
    (3975, 1068), (4040, 1049), (4193, 1028), (4335, 1009), (4398, 999), (4418, 988),
    (4420, 968), (4407, 935), (4403, 850), (4406, 760), (4418, 690), (4434, 646), (4470, 620), (4490, 578),
    (4489, 520), (4475, 450), (4462, 380), (4447, 322), (4410, 280), (4350, 247), (4250, 238),
    (4000, 223), (3750, 212), (3350, 176), (3100, 168), (2000, 166), (1150, 166), (1000, 184), (600, 204), (420, 200),
]
# The greenhouse: windscreen, roof, rear window, closed below the belt (it overlaps the tub there).
GLASS = [
    (1180, 900), (1245, 967), (1290, 990), (1418, 1065), (1560, 1137), (1702, 1209), (1845, 1276), (1987, 1338),
    (2070, 1361), (2160, 1377), (2270, 1389), (2400, 1396), (2550, 1399), (2700, 1397), (2850, 1390), (3000, 1380),
    (3150, 1364), (3268, 1345), (3339, 1326), (3410, 1305), (3481, 1279), (3624, 1220), (3766, 1163), (3908, 1098),
    (3975, 1068), (4030, 1020), (4040, 900), (3000, 860), (2000, 860),
]

# ------------------------------------------------------------------------------------------------ plan and sections
# body-side half-width along the car (mm), the widest point of each station (mirrors removed)
W_SIDE = pchip([(-100, 845), (300, 852), (534, 856), (700, 866), (900, 870), (1050, 866), (1200, 857), (1450, 864),
                (1700, 872), (2100, 878), (2600, 879), (2900, 874), (3150, 866), (3350, 872), (3500, 874), (3700, 866),
                (3826, 856), (4004, 836), (4182, 812), (4360, 790), (4600, 780)])
# plan outline (max over heights) near the ends; the corners
W_PLAN = pchip([(-60, 0), (0, 120), (40, 330), (89, 460), (178, 675), (267, 767), (356, 810), (445, 840), (534, 853),
                (623, 860), (900, 875), (3700, 880), (3826, 858), (4004, 832), (4093, 818), (4182, 802), (4271, 781),
                (4360, 742), (4420, 676), (4470, 525), (4500, 305), (4530, 0)])
# how far the nose and tail recede at lateral offset y (from the plan outline), mm
NOSE_BACK = pchip([(0, 0), (120, 2), (330, 18), (460, 60), (560, 105), (675, 168), (767, 245), (810, 300), (900, 330)])
TAIL_FWD = pchip([(0, 0), (300, 20), (525, 48), (676, 98), (742, 150), (781, 230), (802, 300), (900, 330)])

# the shoulder crease height (drawing units) along the car
H_CREASE = pchip([(0, 700), (250, 722), (700, 760), (1400, 795), (2500, 822), (3300, 844), (4300, 850), (4600, 852)])
# the lower character line along the doors (drawing units) and its step (mm the lower surface sits in)
H_LOWLINE = pchip([(300, 575), (1100, 563), (2000, 563), (3100, 565), (4400, 568)])
LOWLINE_STEP = 3.0
# the bonnet's two creases (lateral position along the bonnet) and the rise of the panel between them
HOOD_CREASE = pchip([(141, 348), (600, 400), (1197, 473)])
HOOD_RISE = 7.0
# wheel arches: opening radius and the eyebrow (flare) radius, front and rear (from the drawing)
ARCH = {774.0: (372.0, 430.0), 3499.0: (348.0, 414.0)}
FLARE = 5.0
# lower body section: half-width fraction by height above/below the crease (relative to W_SIDE)
#   below the crease: full width with a gentle tuck under toward the sill
LOW = pchip([(100, 0.905), (170, 0.93), (250, 0.962), (350, 0.982), (450, 0.995), (560, 1.0), (700, 0.997)])
#   above the crease the shoulder turns in toward the belt: fraction lost per mm above the crease
SHOULDER_SLOPE = 0.00085   # ~0.74 mm inward per mm up (a 36 degree shoulder), measured against the front and rear views
CREASE_DROP = 0.0          # no step at the crease itself; the change of slope makes the line

# greenhouse plan: glass half-width at the belt (Wb) and at the roof edge (Wr), and the heights
WB = pchip([(1200, 665), (1380, 688), (1600, 720), (1900, 745), (2300, 755), (2800, 755), (3200, 745), (3500, 725),
            (3800, 690), (4050, 650)])
WR = pchip([(1200, 520), (1700, 545), (1950, 556), (2300, 572), (2700, 572), (3000, 558), (3285, 525), (3600, 490),
            (4050, 470)])
H_BELT = pchip([(1200, 905), (1460, 905), (2000, 918), (2500, 932), (3000, 945), (3500, 957), (4050, 965)])
ROOF_EDGE_DROP = 55.0       # the roof edge sits this far below the centre-line roof (crown)
# windscreen and rear window wrap in plan: their corners recede (mm at the glass edge)
WS_WRAP, RW_WRAP = 135.0, 140.0

# crown of the bonnet and boot (mm lower at the side than on the centre line)
CROWN = pchip([(-100, 40), (300, 52), (700, 58), (1150, 60), (1300, 45), (3800, 45), (4000, 52), (4400, 45)])


class Car:
    def __init__(self):
        self.tub = Outline2D(TUB)
        self.glass = Outline2D(GLASS)

    # -------------------------------------------------------------------------------------------- lower body
    def tub_field(self, s, y, h):
        ay = np.abs(y)
        # nose and tail recede at the corners: each height keeps its own side profile, shifted
        wn = 1 - smoothstep(500, 1150, s)
        wt = smoothstep(3500, 3950, s)
        sh = s - NOSE_BACK(np.minimum(ay, 900)) * wn + TAIL_FWD(np.minimum(ay, 900)) * wt
        # crowned top: the bonnet and boot fall away toward the sides
        Wn = np.maximum(W_SIDE(s), 1)
        top_w = smoothstep(560, 760, h)
        hh = h + CROWN(s) * np.clip(ay / Wn, 0, 1.15) ** 2 * top_w
        # the raised centre panel of the bonnet between its two creases
        hood = (1 - smoothstep(1150, 1230, s)) * smoothstep(120, 200, s) * smoothstep(640, 720, h)
        hc_ = HOOD_CREASE(s)
        hh = hh - HOOD_RISE * hood * (1 - smoothstep(hc_ - 10, hc_ + 10, ay))
        d_side = self.tub(sh, hh)
        # lateral: the section with the shoulder crease
        hc = H_CREASE(s)
        frac = np.where(h <= hc, LOW(np.clip(h, 100, 700)) * (h <= 700) + LOW(700) * (h > 700),
                        LOW(700) - CREASE_DROP - (h - hc) * SHOULDER_SLOPE)
        hw = W_SIDE(s) * frac
        # the lower character line: the surface below it sits a few mm in
        sideband = smoothstep(350, 500, s) * (1 - smoothstep(4300, 4450, s))
        hw = hw - LOWLINE_STEP * sideband * (1 - smoothstep(H_LOWLINE(s) - 4, H_LOWLINE(s) + 4, h))
        # wheel-arch eyebrows: the wing swells a little around each arch and returns at the flare line
        for sc, (Ro, Rf) in ARCH.items():
            r = np.sqrt((s - sc) ** 2 + (h - 327.0) ** 2)
            hw = hw + FLARE * (1 - smoothstep(Rf - 30, Rf + 6, r)) * smoothstep(Ro - 5, Ro + 25, r) * (h > 250)
        # plan corners at the very ends
        hw = np.minimum(hw, W_PLAN(np.clip(s, -60, 4530)) * np.where(frac > 0.98, 1.0, frac / 0.98))
        d_lat = (ay - hw) * 0.97
        f = smax(d_side, d_lat, 26.0)
        return f

    # -------------------------------------------------------------------------------------------- greenhouse
    def glass_field(self, s, y, h):
        ay = np.abs(y)
        wb, wr = WB(s), WR(s)
        # windscreen and rear window wrap: the glass corners recede in plan
        u = np.clip(ay / np.maximum(wb, 1), 0, 1.3)
        w_ws = 1 - smoothstep(1950, 2250, s)
        w_rw = smoothstep(3150, 3450, s)
        sh = s - WS_WRAP * u ** 2 * w_ws + RW_WRAP * u ** 2 * w_rw
        # roof crown
        hh = h + ROOF_EDGE_DROP * np.clip(ay / np.maximum(wr, 1), 0, 1.3) ** 2 * smoothstep(1150, 1300, h)
        d_side = self.glass(sh, hh)
        # tumblehome: glass from the belt (wb) to the roof edge (wr)
        hb = H_BELT(s)
        top = 1399.0
        t = np.clip((h - hb) / (top - ROOF_EDGE_DROP - hb), 0, 1.2)
        # side glass is slightly convex: quicker turn-in near the top
        hw = wb + (wr - wb) * (0.82 * t + 0.18 * t * t)
        d_lat = (ay - hw) * 0.9
        f = smax(d_side, d_lat, 30.0)
        # only above the belt (below it the tub owns the shape)
        f = smax(f, (hb - 12) - h, 6.0)
        return f

    # -------------------------------------------------------------------------------------------- whole body
    def field(self, s, y, h, arches=True):
        f = smin(self.tub_field(s, y, h), self.glass_field(s, y, h), 10.0)
        if arches:
            ay = np.abs(y)
            for sc, hc in WHEELS:
                r = np.sqrt((s - sc) ** 2 + (h - hc) ** 2)
                R = ARCH[sc][0]
                cut = np.maximum(r - R, 600 - ay)
                f = smax(f, -cut, 8.0)
        return f
