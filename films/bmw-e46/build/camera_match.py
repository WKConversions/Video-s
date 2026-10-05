"""Solve the camera of the photo of the car (assets/brother-car.jpg) from points matched by hand to the model, so
the model can be rendered from exactly the photo's viewpoint and overlaid."""
import sys, json
sys.path.insert(0, 'build')
import numpy as np, cv2
from carfield import Car, HSCALE, SC
car = Car()
def fld(s, y, h): return car.field(np.atleast_1d(float(s)) * np.ones(1), np.atleast_1d(float(y)), np.atleast_1d(float(h)))
def front_s(y, h):
    xs = np.arange(-150, 1400, 0.5); f = car.field(xs, np.full_like(xs, y), np.full_like(xs, h)); i = int(np.argmax(f < 0)); return xs[i]
def top_h(s, y):
    hs = np.arange(1500, 100, -0.5); f = car.field(np.full_like(hs, s), np.full_like(hs, y), hs); i = int(np.argmax(f < 0)); return hs[i]
X = lambda s, y, h: [(SC - s) / 1000, h * HSCALE / 1000, y / 1000]
pts3, pts2 = [], []
def add(p3, p2): pts3.append(p3); pts2.append(p2)
s0 = front_s(0, 459) - 6
add(X(s0, 0, 459), (1388, 2068))                 # plate centre
add(X(s0, 255, 459), (1286, 2068))               # plate end, car's right
add(X(s0, -255, 459), (1490, 2068))              # plate end, car's left
add([1.3625, 0.318, 0.80], (865, 2105))          # front-right wheel centre (cap)
add([-1.3625, 0.318, 0.80], (405, 2005))         # rear-right wheel centre (cap)
add(X(front_s(0, 652), 0, 652), (1368, 1970))    # between the kidneys
add(X(175, 0, top_h(175, 0)), (1348, 1908))      # bonnet roundel
add(X(front_s(438, 667), 438, 667), (1148, 1962))  # right headlight, inner lamp
add(X(front_s(603, 667), 603, 667), (1068, 1962))  # right headlight, outer lamp
add(X(front_s(-603, 667), -603, 667), (1540, 1955))  # left headlight, outer lamp
pts3 = np.array(pts3, np.float64); pts2 = np.array(pts2, np.float64)
W, H = 1932, 2576
best = None
for fpx in np.linspace(1200, 3200, 81):
    K = np.array([[fpx, 0, W / 2], [0, fpx, H / 2], [0, 0, 1]])
    ok, rv, tv = cv2.solvePnP(pts3, pts2, K, None, flags=cv2.SOLVEPNP_ITERATIVE)
    if not ok: continue
    proj, _ = cv2.projectPoints(pts3, rv, tv, K, None)
    err = np.sqrt(((proj[:, 0] - pts2) ** 2).sum(1)).mean()
    if best is None or err < best[0]: best = (err, fpx, rv, tv)
err, fpx, rv, tv = best
R, _ = cv2.Rodrigues(rv)
cam = (-R.T @ tv).ravel()
# OpenCV camera looks down +z with y down; three.js looks down -z with y up
fwd = R.T @ np.array([0, 0, 1.0]); up = R.T @ np.array([0, -1.0, 0])
vfov = 2 * np.degrees(np.arctan(H / 2 / fpx))
proj, _ = cv2.projectPoints(pts3, rv, tv, np.array([[fpx, 0, W / 2], [0, fpx, H / 2], [0, 0, 1]]), None)
print('mean reprojection error px', round(err, 1), 'focal px', round(fpx), 'vfov', round(vfov, 2))
for a, b in zip(proj[:, 0], pts2): print('  ', np.round(a), b)
out = dict(position=cam.tolist(), target=(cam + fwd * 5).tolist(), up=up.tolist(), vfov=vfov, width=W, height=H)
json.dump(out, open('build/photo_camera.json', 'w'), indent=1)
print(out)
