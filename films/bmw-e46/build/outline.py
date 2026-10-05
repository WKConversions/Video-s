"""Clean side outline of the E46 coupe, digitised by hand from BMW's dimension drawing (drawing units, mm).
s = from the front bumper, h = above ground (drawing heights run 2.3% tall)."""
import numpy as np

SIDE = [
    # front face, bottom to top
    (150, 203), (95, 212), (70, 235), (62, 280), (58, 340), (45, 380), (32, 420), (28, 470), (32, 525), (48, 545),
    (70, 553), (78, 580), (88, 640), (100, 690), (116, 728), (140, 760), (180, 788), (240, 812),
    # bonnet, scuttle, windscreen, roof, rear window, boot lid
    (350, 836), (500, 866), (650, 893), (800, 914), (1000, 946), (1100, 960), (1150, 964), (1200, 960), (1245, 967),
    (1290, 990), (1418, 1065), (1560, 1137), (1702, 1209), (1845, 1276), (1987, 1338), (2070, 1361), (2160, 1377),
    (2270, 1389), (2400, 1396), (2550, 1399), (2700, 1397), (2850, 1390), (3000, 1380), (3150, 1364), (3268, 1345),
    (3339, 1326), (3410, 1305), (3481, 1279), (3624, 1220), (3766, 1163), (3908, 1098), (3975, 1068), (4040, 1049),
    (4193, 1028), (4335, 1009), (4398, 999), (4418, 988),
    # rear face, top to bottom
    (4420, 968), (4407, 935), (4403, 850), (4406, 760), (4418, 690), (4434, 646), (4470, 620), (4490, 578),
    (4489, 520), (4475, 450), (4462, 380), (4447, 322), (4410, 280), (4350, 247), (4250, 238),
    # underside, rear to front
    (4000, 223), (3750, 212), (3350, 176), (3100, 168), (2000, 166), (1150, 166), (1000, 184), (600, 204), (420, 200),
]

def catmull(points, n=12, closed=True, centripetal=False):
    """Catmull-Rom through the points; centripetal=True uses the centripetal parameterisation (no overshoot or loops
    where the point spacing changes)."""
    P = np.array(points, float)
    if closed:
        P = np.vstack([P[-1], P, P[0], P[1]])
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        if not centripetal:
            for t in np.linspace(0, 1, n, endpoint=False):
                t2, t3 = t * t, t * t * t
                out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
            continue
        t0 = 0.0
        t1 = t0 + max(np.linalg.norm(p1 - p0), 1e-6) ** 0.5
        t2_ = t1 + max(np.linalg.norm(p2 - p1), 1e-6) ** 0.5
        t3_ = t2_ + max(np.linalg.norm(p3 - p2), 1e-6) ** 0.5
        for t in np.linspace(t1, t2_, n, endpoint=False):
            a1 = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1
            a2 = (t2_ - t) / (t2_ - t1) * p1 + (t - t1) / (t2_ - t1) * p2
            a3 = (t3_ - t) / (t3_ - t2_) * p2 + (t - t2_) / (t3_ - t2_) * p3
            b1 = (t2_ - t) / (t2_ - t0) * a1 + (t - t0) / (t2_ - t0) * a2
            b2 = (t3_ - t) / (t3_ - t1) * a2 + (t - t1) / (t3_ - t1) * a3
            out.append((t2_ - t) / (t2_ - t1) * b1 + (t - t1) / (t2_ - t1) * b2)
    return np.array(out)
