#!/usr/bin/env python3
"""
E46 330Ci (2001, automatic) drivetrain for the film: ZF 5HP19 (BMW A5S 325Z) automatic gearbox with cutaway
internals (torque converter W254, Ravigneaux + tail planetary sets, clutch packs, output shaft), two-piece
propshaft (flex disc, centre bearing, U-joint, CV joint), 188K rear differential (3.38:1 = 44/13) with ring gear,
pinion, spider gears and carrier, half-shafts with CV joints and boots, exhaust system (front, centre and rear
silencer), saddle fuel tank, front and rear subframes and simplified struts/springs.

Re-runnable:   python3 build/parts/drivetrain.py               (build + export + checks + previews)
               python3 build/parts/drivetrain.py --no-render   (build + export + checks)
               python3 build/parts/drivetrain.py --no-check    (skip the clearance checks)

Coordinates: build/SPEC.md. Built in Blender Z-up with X = car forward, Y = car LEFT, Z = up; the glTF exporter
maps Blender (x, y, z) -> glTF (x, z, -y). Every exported node's local frame is the frame its mesh was built in,
so rotating parts spin about a local axis through their origin (see the node extras and drivetrain.md).

The gearbox is fitted to film/public/models/engine.glb at build time: the bell-housing face is placed on the
engine_block node's origin (crank axis on the block's rear face) and its outline follows the block's rear flange
(section of the engine_block mesh), including the engine's 30 deg tilt. Rear-wheel hub positions come from
wheels.glb, the twin tail-pipe positions from details.glb, the manifold outlets from engine.glb.
"""
import bpy, bmesh, math, os, sys, json
import numpy as np
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from drivetrain_lib import *  # noqa

ROOT = os.path.dirname(os.path.dirname(HERE))
MODELS = os.path.join(ROOT, "film", "public", "models")
OUT_GLB = os.path.join(MODELS, "drivetrain.glb")
PREV_DIR = os.path.join(HERE, "previews")
ARGS = sys.argv[1:]

# ==============================================================================================
# 1. Read the parts that already exist (engine, wheels, details) so this one fits them
# ==============================================================================================
def _scene_meshes(path, prefix):
    import trimesh
    sc = trimesh.load(path)
    out = []
    for name in sc.graph.nodes_geometry:
        if not name.startswith(prefix):
            continue
        Tm, g = sc.graph[name]
        m = sc.geometry[g].copy()
        m.apply_transform(Tm)
        out.append(m)
    return out


def load_refs():
    import pygltflib, trimesh
    R = {}
    eg = os.path.join(MODELS, "engine.glb")
    g = pygltflib.GLTF2().load(eg)
    nb = next(n for n in g.nodes if n.name == "engine_block")
    t = nb.translation or [0, 0, 0]
    q = nb.rotation or [0, 0, 0, 1]
    R["X0"], R["CZ"], R["Z0"] = t[0], t[1], t[2]
    R["TILT"] = 2 * math.atan2(q[0], q[3])
    # block rear flange outline: section of the engine_block mesh 3 mm in front of its rear face
    blk = trimesh.util.concatenate(_scene_meshes(eg, "engine_block"))
    xr = blk.bounds[0][0]
    R["X_REAR"] = xr
    sec = blk.section(plane_origin=[xr + 0.003, 0, 0], plane_normal=[1, 0, 0])
    best, area = None, 0
    for loop in sec.discrete:
        yb = -loop[:, 2]                       # Blender y (car left)
        zb = loop[:, 1] - R["CZ"]              # height above the crank axis
        a = 0.5 * abs(np.dot(yb, np.roll(zb, 1)) - np.dot(zb, np.roll(yb, 1)))
        if a > area:
            best, area = np.stack([yb, zb], 1), a
    R["BLOCK_OUTLINE"] = best
    # exhaust manifold outlets (engine.py: out_end = wE(-0.10, yw, -0.225), yw = -0.205 / -0.275, E frame)
    c, s = math.cos(R["TILT"]), math.sin(R["TILT"])
    outs = []
    for yw in (-0.205, -0.275):
        ex, ey, ez = -0.10, yw * c + (-0.225) * s, -yw * s + (-0.225) * c
        # W <- E: translate (X0, 0, CZ) * Rx(TILT)
        outs.append(Vector((R["X0"] + ex, c * ey - s * ez, R["CZ"] + s * ey + c * ez)))
    exm = trimesh.util.concatenate(_scene_meshes(eg, "exhaust_manifold"))
    for o in outs:   # sanity check against the mesh (flange disc radius 42 mm)
        v = exm.vertices
        d = np.sqrt((v[:, 0] - o.x) ** 2 + (v[:, 1] - o.z) ** 2 + (v[:, 2] + o.y) ** 2)
        print("  exhaust outlet", tuple(round(a, 3) for a in o), "mesh verts within 45 mm:", int((d < 0.045).sum()))
    R["EXH_OUT"] = outs
    # rear wheels
    wg = pygltflib.GLTF2().load(os.path.join(MODELS, "wheels.glb"))
    for n in wg.nodes:
        if n.name in ("wheel_RL", "wheel_RR", "wheel_FL", "wheel_FR"):
            R[n.name] = n.translation
    # tail pipes (details.glb exhaust_tips_0 / _2 = the two tubes)
    tips = []
    for nm in ("exhaust_tips_0", "exhaust_tips_2"):
        ms = _scene_meshes(os.path.join(MODELS, "details.glb"), nm)
        if ms:
            b = ms[0].bounds
            tips.append(dict(front_x=b[1][0], y=(b[0][1] + b[1][1]) / 2, z=(b[0][2] + b[1][2]) / 2,
                             r=(b[1][1] - b[0][1]) / 2))
    R["TIPS"] = tips
    return R


REF = load_refs()
X0, CZ, TILT = REF["X0"], REF["CZ"], REF["TILT"]
print("engine block rear face X=%.4f crank Y=%.4f tilt=%.1f deg" % (X0, CZ, TILT / D2R))

M_G = T(X0, 0, CZ)                                  # gearbox frame: origin = crank axis on the bell face
AXLE_X = REF["wheel_RL"][0] if "wheel_RL" in REF else -1.3625
AXLE_Y = REF["wheel_RL"][1] if "wheel_RL" in REF else 0.318
HUB_Z = abs(REF["wheel_RL"][2]) if "wheel_RL" in REF else 0.739
M_D = T(AXLE_X, 0, AXLE_Y)                          # diff frame: ring-gear centre on the rear axle line

# ==============================================================================================
# 2. ZF 5HP19 (A5S 325Z) - gearbox frame G (x forward, axis = crank axis, x=0 on the bell face)
#    Dimensions: harvest/research/gearbox.md (BMW ST034 section scaled by the 254 mm converter, 0.58 mm/px)
# ==============================================================================================
NT = 112                     # angular samples of the housing
FL_T = 0.016                 # bell flange thickness
R_INNER = 0.160              # converter cavity radius
R_OPEN = 0.1635
R_WALL = 0.009
R_HOLE = 0.040               # pump hub bore through the bell back wall
BELL_END = -0.170            # bell / main case split (one casting on the 5HP19; split for the film)
CASE_END = -0.588            # start of the tail (extension) housing
TAIL_END = -0.684
OUT_FACE = -0.700            # output flange face (flex disc starts here)
RAIL_Z = -0.128              # oil-pan gasket face below the axis
RAIL_HW = 0.145              # half width of the pan (290 mm)
PAN_X0, PAN_X1 = -0.132, -0.592
PAN_BOT = -0.214             # pan bottom 214 mm below the axis
TC_X = -0.080                # torque-converter centre plane
BOX = [(-0.130, -0.030), (0.130, -0.030), (RAIL_HW, RAIL_Z), (-RAIL_HW, RAIL_Z)]   # valve-body / rail box (y, z)


def _ray_poly_max(poly, d):
    """Largest distance along unit direction d (from the origin) at which the ray crosses polygon edges."""
    best = 0.0
    n = len(poly)
    dx, dy = d
    for i in range(n):
        ax, ay = poly[i]
        bx, by = poly[(i + 1) % n]
        ex, ey = bx - ax, by - ay
        den = dx * ey - dy * ex
        if abs(den) < 1e-12:
            continue
        t = (ax * ey - ay * ex) / den
        u = (ax * dy - ay * dx) / den
        if t > 0 and 0 <= u <= 1:
            best = max(best, t)
    return best


def _thetas():
    return [2 * math.pi * k / NT for k in range(NT)]


def flange_outline():
    """Polar radius of the bell flange outline per theta: block rear flange (tilted with the engine) united with
    a level lower skirt that bolts to the oil-pan rear (bottom 180-190 mm below the axis, BMW section)."""
    blk = [tuple(p) for p in REF["BLOCK_OUTLINE"]]
    skirt = [(0.150, 0.050), (0.200, -0.020), (0.212, -0.110), (0.188, -0.165), (0.140, -0.186),
             (-0.085, -0.186), (-0.132, -0.170), (-0.152, -0.128), (-0.120, -0.060), (0.0, 0.0)]
    r = []
    for th in _thetas():
        d = (math.sin(th), math.cos(th))
        r.append(max(_ray_poly_max(blk, d), _ray_poly_max(skirt, d)))
    r = np.array(r)
    for _ in range(3):     # light circular smoothing (no sharp concave notches in the casting)
        r = 0.25 * np.roll(r, 1) + 0.5 * r + 0.25 * np.roll(r, -1)
    r = np.maximum(r + 0.004, 0.188)
    return r


RF = None


def cavity_r(x):
    if x > -0.112:
        return R_INNER
    if x > -0.150:
        return 0.075 + (R_INNER - 0.075) * (x + 0.150) / 0.038
    return R_HOLE


def box_r(th):
    return _ray_poly_max(BOX, (math.sin(th), math.cos(th)))


def case_top_r(x):
    u = max(0.0, min(1.0, (BELL_END - x) / (BELL_END - CASE_END)))
    return 0.116 - 0.019 * u


def case_r(th, x):
    return smax(case_top_r(x), box_r(th), 0.006)


def bell_outer(k, th, x):
    a = max(RF[k] - 0.024, R_INNER + R_WALL + 0.004)
    b = case_r(th, BELL_END)
    t = (x + FL_T) / (BELL_END + FL_T)
    # top: long sloping roof; bottom: drum, then a quick step up to the rail
    up = 0.5 + 0.5 * math.cos(th)                      # 1 at the top, 0 at the bottom
    t0 = 0.05 * up + 0.30 * (1 - up)
    w = 1.0 - ease((t - t0) / (1.0 - t0))
    r = b + (a - b) * w
    r = smax(r, cavity_r(x) + R_WALL, 0.004)
    return r


def build_bell():
    pc = Piece("bell")
    ab = pc.bm("alu_cast")
    xs = list(np.linspace(-FL_T, BELL_END, 18))

    def prof(k, th):
        rf = RF[k]
        pts = [(R_OPEN, 0.0), (rf, 0.0), (rf, -FL_T)]
        for i, x in enumerate(xs):
            r = bell_outer(k, th, x)
            if i == 0:
                r = min(r, rf - 0.006)
            pts.append((r, x))
        pts += [(R_HOLE, BELL_END), (R_HOLE, -0.150), (0.075, -0.150), (R_INNER, -0.112), (R_INNER, -0.003)]
        return pts
    add_polar(ab, NT, prof)
    # radial gussets on the bell (cast ribs from the flange back along the cone)
    th_list = [a * D2R for a in (20, 62, 105, 140, 220, 255, 298, 340)]
    for thg in th_list:
        k = int(round(thg / (2 * math.pi) * NT)) % NT
        x2 = -0.085

        def gprof(_k, th, k=k, thg=thg):
            r0 = bell_outer(k, thg, -FL_T) - 0.004
            r1 = RF[k] - 0.010
            r2 = bell_outer(k, thg, x2)
            return [(r0, -FL_T - 0.001), (r1, -FL_T - 0.001), (r2 + 0.007, x2), (r2 - 0.004, x2)]
        dth = 0.0035 / max(0.12, RF[k])
        add_polar(ab, 1, gprof, th0=thg - dth, th1=thg + dth)
    # bolt bosses on the flange back + Torx bolt heads (bolts go from the gearbox side into the block)
    sb = pc.bm("steel")
    pts = [(RF[k] * math.sin(th), RF[k] * math.cos(th)) for k, th in enumerate(_thetas())]
    L = [0.0]
    for i in range(1, NT + 1):
        a, b = pts[i - 1], pts[i % NT]
        L.append(L[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    nb = 12
    boss = []
    for j in range(nb):
        s = L[-1] * (j + 0.35) / nb
        i = next(i for i in range(NT) if L[i + 1] >= s)
        th = 2 * math.pi * i / NT
        rr = RF[i] - 0.014
        y, z = rr * math.sin(th), rr * math.cos(th)
        boss.append((y, z))
        add_cyl(ab, 0.0125, 0.026, T(-FL_T - 0.013 + 0.002, y, z) @ Ry(math.pi / 2), seg=16, bevel=0.002)
        add_cyl(sb, 0.0105, 0.004, T(-FL_T - 0.026, y, z) @ Ry(math.pi / 2), seg=16, z0=-0.002)   # washer face
        add_hex(sb, 0.0088, 0.008, T(-FL_T - 0.028, y, z) @ Ry(-math.pi / 2), z0=0.0)
    obs = pc.objects()
    return obs


def build_case():
    pc = Piece("case")
    ab = pc.bm("alu_cast")
    xs = list(np.linspace(BELL_END, CASE_END, 34))
    tail = [(0.094, -0.600), (0.090, -0.610), (0.083, -0.628), (0.072, -0.648), (0.061, -0.662),
            (0.052, -0.670), (0.047, -0.674), (0.047, TAIL_END), (0.030, TAIL_END), (0.030, -0.40)]

    def prof(k, th):
        pts = [(R_HOLE, BELL_END)]
        for x in xs:
            pts.append((case_r(th, x), x))
        return pts + tail
    add_polar(ab, NT, prof)
    # raised circumferential bands (upper half) and longitudinal ribs, as on the BMW render (ST034 fig. 1)
    for xb in (-0.236, -0.330, -0.424, -0.520):
        def bprof(k, th, xb=xb):
            r = case_r(th, xb)
            return [(r - 0.004, xb + 0.006), (r + 0.0055, xb + 0.005), (r + 0.0055, xb - 0.005), (r - 0.004, xb - 0.006)]
        add_polar(ab, 64, bprof, th0=-118 * D2R, th1=118 * D2R)
    for thr in (0.0, 36.0, -36.0, 70.0, -70.0):
        th = thr * D2R
        xr = list(np.linspace(BELL_END - 0.01, CASE_END - 0.004, 12))

        def rprof(k, _th, th=th, xr=xr):
            lo = [(case_r(th, x) - 0.004, x) for x in xr]
            hi = [(case_r(th, x) + 0.0065, x) for x in reversed(xr)]
            return lo + hi
        dth = 0.0032 / 0.11
        add_polar(ab, 1, rprof, th0=th - dth, th1=th + dth)
    # tail-housing joint flange + bolts
    sb = pc.bm("steel")

    def jprof(k, th):
        r = max(case_r(th, CASE_END), 0.094)
        return [(r - 0.006, CASE_END + 0.010), (r + 0.007, CASE_END + 0.008), (r + 0.007, CASE_END - 0.006),
                (r - 0.006, CASE_END - 0.008)]
    add_polar(ab, 64, jprof, th0=-112 * D2R, th1=112 * D2R)
    for a in (-95, -60, -25, 25, 60, 95):
        th = a * D2R
        r = case_top_r(CASE_END) + 0.002
        add_hex(sb, 0.0068, 0.006, T(CASE_END - 0.006, r * math.sin(th), r * math.cos(th)) @ Ry(-math.pi / 2), z0=0)
    # bosses (pressure ports / sensor bosses) on the case
    kb = pc.bm("plastic_black")
    for (x, a, rr, h) in ((-0.205, 112, 0.016, 0.018), (-0.280, -100, 0.013, 0.014), (-0.470, -108, 0.014, 0.016),
                          (-0.395, 0, 0.010, 0.012), (-0.560, 120, 0.012, 0.014)):
        th = a * D2R
        r = case_r(th, x)
        d = Vector((0, math.sin(th), math.cos(th)))
        M = T(x, 0, 0) @ Matrix.Translation(d * (r - 0.004)) @ align_z(d)
        add_cyl(ab, rr, h, M, seg=20, bevel=0.002, z0=0.0)
        add_cyl(sb, rr * 0.55, 0.006, M, seg=6, z0=h - 0.002)
    # breather cap on top
    add_cyl(kb, 0.007, 0.012, T(-0.395, 0, case_r(0, -0.395) + 0.012), seg=12, bevel=0.002, z0=0)
    # --- left side (car left = +Y): electrical connector, selector shaft + lever, ATF cooler fittings, ID plate
    # electrical connector (EGS plug) on the left above the pan rail
    xc, yc, zc = -0.300, 0.131, -0.078
    add_cyl(ab, 0.025, 0.012, T(xc, yc - 0.004, zc) @ Rx(-math.pi / 2), seg=24, bevel=0.002, z0=0)
    add_cyl(kb, 0.019, 0.034, T(xc, yc + 0.008, zc) @ Rx(-math.pi / 2), seg=24, bevel=0.003, z0=0)
    add_tube(sb, 0.0215, 0.0175, 0.009, T(xc, yc + 0.012, zc) @ Rx(-math.pi / 2), seg=24, z0=0)
    cab = catmull([Vector((xc, yc + 0.040, zc)), Vector((xc + 0.03, yc + 0.055, zc + 0.01)),
                   Vector((xc + 0.12, yc + 0.030, zc + 0.045)), Vector((-0.140, 0.150, 0.010)),
                   Vector((-0.060, 0.205, 0.030))], 6)
    add_sweep(kb, cab, circle_prof(0.0065, 10))
    # selector shaft with lever (P-R-N-D) and the cable bracket
    xs_, ys_, zs_ = -0.470, 0.128, -0.092
    add_cyl(ab, 0.019, 0.016, T(xs_, ys_ - 0.004, zs_) @ Rx(-math.pi / 2), seg=24, bevel=0.002, z0=0)
    add_cyl(sb, 0.0085, 0.040, T(xs_, ys_, zs_) @ Rx(-math.pi / 2), seg=16, z0=0)
    lever = [(-0.010, 0.0), (0.010, 0.0), (0.012, -0.070), (-0.006, -0.072)]
    db = pc.bm("steel_dark")
    add_prism(db, lever, 0.005, T(xs_, ys_ + 0.026, zs_) @ Rx(-math.pi / 2) @ Rz(0.0) @ Matrix(((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1))),
              z0=0, bevel=0.0015)
    add_hex(sb, 0.010, 0.007, T(xs_, ys_ + 0.031, zs_) @ Rx(-math.pi / 2), z0=0)
    add_cyl(sb, 0.006, 0.016, T(xs_ + 0.003, ys_ + 0.031, zs_ + 0.068) @ Rx(-math.pi / 2), seg=12, z0=0)
    # cable bracket on the tail + selector cable going up into the tunnel
    add_box(db, 0.035, 0.004, 0.050, T(-0.560, 0.100, -0.040), bevel=0.0012)
    cab2 = catmull([Vector((xs_ + 0.003, ys_ + 0.040, zs_ + 0.068)), Vector((xs_ - 0.04, ys_ + 0.036, zs_ + 0.075)),
                    Vector((-0.560, 0.112, -0.040)), Vector((-0.610, 0.105, 0.040)), Vector((-0.640, 0.080, 0.120))], 6)
    add_sweep(kb, cab2, circle_prof(0.0045, 8))
    # two ATF cooler-line fittings (left side, front of the case) and the steel lines running forward
    for i, (zf, yf) in enumerate(((-0.020, 0.112), (-0.052, 0.122))):
        xf = -0.205 - 0.022 * i
        add_hex(sb, 0.012, 0.012, T(xf, yf - 0.002, zf) @ Rx(-math.pi / 2), z0=0)
        line = fillet_path([Vector((xf, yf + 0.010, zf)), Vector((xf, yf + 0.030, zf)),
                            Vector((-0.120, 0.165 + 0.012 * i, zf + 0.010)), Vector((-0.040, 0.205 + 0.010 * i, zf + 0.030)),
                            Vector((-0.020, 0.212 + 0.010 * i, zf + 0.030)), Vector((-0.010, 0.214 + 0.010 * i, zf - 0.050))],
                           0.02, 5)
        add_sweep(sb, line, circle_prof(0.0055, 10))
        add_hex(sb, 0.0095, 0.016, Matrix.Translation(line[-1]) @ Rx(math.pi), z0=0)
    # ZF identification plate (rear left)
    pl = pc.bm("alu_machined")
    add_box(pl, 0.042, 0.002, 0.026, T(-0.545, 0.131, -0.060) @ Rx(-0.12), bevel=0.0006)
    obs = pc.objects()
    return obs


def pan_outline(inset=0.0, n_round=4):
    """Pan plan outline (x, y): front corners chamfered, rear corners rounded; inset by `inset`."""
    x0, x1, hw = PAN_X0 - inset, PAN_X1 + inset, RAIL_HW - inset
    ch = max(0.004, 0.045 - inset * 0.4)
    rr = max(0.004, 0.026 - inset * 0.6)
    pts = [(x0, -hw + ch), (x0, hw - ch), (x0 - ch, hw)]
    for k in range(n_round + 1):
        a = 90 * D2R * k / n_round
        pts.append((x1 + rr - rr * math.sin(a), hw - rr + rr * math.cos(a)))
    for k in range(n_round + 1):
        a = 90 * D2R * k / n_round
        pts.append((x1 + rr - rr * math.cos(a), -hw + rr - rr * math.sin(a)))
    pts.append((x0 - ch, -hw))
    return pts


def _resample_loop(pts, n):
    P = [Vector((p[0], p[1], 0)) for p in pts] + [Vector((pts[0][0], pts[0][1], 0))]
    out = resample(P, 1e9)  # placeholder to keep API (unused)
    L = [0.0]
    for i in range(1, len(P)):
        L.append(L[-1] + (P[i] - P[i - 1]).length)
    res = []
    j = 0
    for k in range(n):
        s = L[-1] * k / n
        while L[j + 1] < s:
            j += 1
        t = (s - L[j]) / max(1e-9, (L[j + 1] - L[j]))
        q = P[j].lerp(P[j + 1], t)
        res.append((q.x, q.y))
    return res


def build_pan():
    """Ribbed oil pan with bolt flange (22 bolts), drain + filler plug. Local frame: origin at the pan's
    gasket face centre (G: x mid, y 0, z RAIL_Z)."""
    xm = (PAN_X0 + PAN_X1) / 2
    pc = Piece("pan")
    sbm = pc.bm("steel_dark")
    st = pc.bm("steel")
    N = 72
    fl = [(x - xm, y) for x, y in _resample_loop(pan_outline(0.0), N)]
    add_prism(sbm, fl, 0.006, T(0, 0, -0.006), z0=0, fan=True)
    # body: loft of inset outlines (draft + rounded bottom)
    depth = RAIL_Z - PAN_BOT
    lay = [(0.012, -0.006), (0.016, -depth * 0.55), (0.020, -depth + 0.010), (0.027, -depth + 0.003), (0.034, -depth)]
    rings = []
    for ins, z in lay:
        lp = [(x - xm, y) for x, y in _resample_loop(pan_outline(ins), N)]
        rings.append([sbm.verts.new((x, y, z)) for x, y in lp])
    for k in range(len(rings) - 1):
        A, B = rings[k], rings[k + 1]
        for i in range(N):
            j = (i + 1) % N
            sbm.faces.new((A[i], A[j], B[j], B[i]))
    ctr = sbm.verts.new((sum(v.co.x for v in rings[-1]) / N, 0.0, -depth))
    for i in range(N):
        sbm.faces.new((rings[-1][(i + 1) % N], rings[-1][i], ctr))
    top_c = sbm.verts.new((sum(v.co.x for v in rings[0]) / N, 0.0, -0.006))
    for i in range(N):
        sbm.faces.new((rings[0][i], rings[0][(i + 1) % N], top_c))
    # stamped stiffening ribs + magnets dimples on the bottom (BMW S24 00 U01 underside view)
    zb = -depth
    L = PAN_X0 - PAN_X1
    for fx in (0.30, 0.52, 0.74):
        add_box(sbm, 0.010, 2 * RAIL_HW - 0.085, 0.006, T((PAN_X0 - L * fx) - xm, 0, zb + 0.0015), bevel=0.002)
    for yy in (-0.045, 0.045):
        add_box(sbm, L - 0.08, 0.010, 0.006, T((PAN_X0 + PAN_X1) / 2 - xm - 0.01, yy, zb + 0.0015), bevel=0.002)
    for yy in (-0.085, 0.0, 0.085):
        add_cyl(sbm, 0.020, 0.006, T(PAN_X0 - L * 0.16 - xm, yy, zb + 0.0015), seg=24, bevel=0.002)
    # drain plug (front left, bottom) and filler plug (left side, rear)
    add_hex(st, 0.0115, 0.009, T(PAN_X0 - 0.050 - xm, 0.085, zb - 0.0075), z0=0)
    add_hex(st, 0.0125, 0.010, T(PAN_X1 + 0.075 - xm, RAIL_HW - 0.023, -depth * 0.45) @ Rx(-math.pi / 2), z0=0)
    # 22 flange bolts
    bl = [(x - xm, y) for x, y in _resample_loop(pan_outline(0.0065), 22)]
    for x, y in bl:
        add_hex(st, 0.0058, 0.0045, T(x, y, -0.006) @ Rx(math.pi), z0=0)
    return pc.objects(), T(xm, 0, RAIL_Z)


# ---------------------------------------------------------------------------------------------
# torque converter W254 (local frame: origin on the axis at the converter centre plane, axis = local x)
# ---------------------------------------------------------------------------------------------
TC_RT, TC_XT, TC_A, TC_B = 0.098, -0.003, 0.034, 0.013     # fluid torus centre radius / x, outer/core radii


def lathe_x(bm, prof, seg=48, M=Matrix.Identity(4), closed=False):
    if closed:
        return add_lathe_closed(bm, prof, seg, M @ MP)
    return add_lathe(bm, prof, seg, M @ MP)


def blade_prism(bm, poly_rx, th, thick):
    er = Vector((0, math.sin(th), math.cos(th)))
    et = Vector((0, math.cos(th), -math.sin(th)))
    ex = Vector((1, 0, 0))
    M = Matrix.Identity(4)
    for i in range(3):
        M[i][0], M[i][1], M[i][2] = er[i], ex[i], et[i]
    add_prism(bm, poly_rx, thick, M, z0=-thick / 2)


def half_annulus(a, b, psi0, psi1, n=10):
    out = [(TC_RT + a * math.cos(psi0 + (psi1 - psi0) * i / n), TC_XT + a * math.sin(psi0 + (psi1 - psi0) * i / n))
           for i in range(n + 1)]
    inn = [(TC_RT + b * math.cos(psi1 - (psi1 - psi0) * i / n), TC_XT + b * math.sin(psi1 - (psi1 - psi0) * i / n))
           for i in range(n + 1)]
    return out + inn


def build_converter():
    parts = {}
    # shell: front cover (lugs + pilot) welded to the impeller shell, pump-drive hub at the rear
    pc = Piece("tc_shell")
    sb = pc.bm("steel")
    prof = [(0, 0.062), (0.017, 0.062), (0.019, 0.058), (0.019, 0.052), (0.045, 0.051), (0.090, 0.049),
            (0.116, 0.045), (0.129, 0.037), (0.1355, 0.025), (0.1375, 0.010), (0.1365, -0.004), (0.132, -0.020),
            (0.122, -0.036), (0.106, -0.048), (0.086, -0.055), (0.064, -0.056), (0.046, -0.052), (0.036, -0.056),
            (0.032, -0.064), (0.032, -0.093), (0.028, -0.096), (0, -0.096)]
    lathe_x(sb, prof, 72)
    lathe_x(sb, [(0.1378, 0.0145), (0.1392, 0.0115), (0.1392, 0.0085), (0.1378, 0.0055), (0.136, 0.008)], 72, closed=True)
    for k in range(3):    # drive lugs with M10 studs (3 x M10 to the drive plate)
        th = k * 2 * math.pi / 3 + math.pi / 6
        r = 0.112
        y, z = r * math.sin(th), r * math.cos(th)
        add_box(sb, 0.010, 0.024, 0.024, T(0.054, y, z) @ Rx(-th), bevel=0.002)
        add_cyl(sb, 0.0048, 0.014, T(0.058, y, z) @ Ry(math.pi / 2), seg=12, z0=0)
    parts["torque_converter_shell"] = pc.objects()
    # impeller blades (rear half of the torus) + core half
    pc = Piece("impeller")
    ib = pc.bm("steel")
    poly = half_annulus(TC_A - 0.0012, TC_B, math.pi, 2 * math.pi)
    for k in range(27):
        blade_prism(ib, poly, 2 * math.pi * k / 27, 0.0016)
    core = [(TC_RT + TC_B * math.cos(a), TC_XT + TC_B * math.sin(a)) for a in np.linspace(math.pi, 2 * math.pi, 9)]
    core += [(TC_RT + (TC_B - 0.003) * math.cos(a), TC_XT + (TC_B - 0.003) * math.sin(a)) for a in np.linspace(2 * math.pi, math.pi, 9)]
    lathe_x(ib, core, 64, closed=True)
    parts["impeller"] = pc.objects()
    # turbine blades (front half) + core half + hub to the turbine shaft
    pc = Piece("turbine")
    tb = pc.bm("alu_machined")
    poly = half_annulus(TC_A - 0.0012, TC_B, 0.0, math.pi)
    for k in range(29):
        blade_prism(tb, poly, 2 * math.pi * (k + 0.5) / 29, 0.0016)
    core = [(TC_RT + TC_B * math.cos(a), TC_XT + TC_B * math.sin(a)) for a in np.linspace(0, math.pi, 9)]
    core += [(TC_RT + (TC_B - 0.003) * math.cos(a), TC_XT + (TC_B - 0.003) * math.sin(a)) for a in np.linspace(math.pi, 0, 9)]
    lathe_x(tb, core, 64, closed=True)
    # turbine shell (stamped bowl behind the blades' outer edge, front side) + hub
    shell = [(TC_RT + (TC_A + 0.0005) * math.cos(a), TC_XT + (TC_A + 0.0005) * math.sin(a)) for a in np.linspace(0.05, math.pi - 0.25, 12)]
    shell += [(TC_RT + (TC_A + 0.0022) * math.cos(a), TC_XT + (TC_A + 0.0022) * math.sin(a)) for a in np.linspace(math.pi - 0.25, 0.05, 12)]
    lathe_x(tb, shell, 72, closed=True)
    lathe_x(pc.bm("steel"), [(0.016, 0.004), (0.050, 0.004), (0.058, 0.010), (0.064, 0.016), (0.064, 0.020),
                             (0.040, 0.022), (0.022, 0.026), (0.016, 0.026)], 48, closed=True)
    parts["turbine"] = pc.objects()
    # stator (reactor) on its one-way clutch, between impeller and turbine at the inner radius
    pc = Piece("stator")
    stb = pc.bm("steel_dark")
    lathe_x(stb, [(0.030, -0.010), (0.044, -0.010), (0.044, 0.006), (0.030, 0.006)], 48, closed=True)
    lathe_x(stb, [(0.0665, -0.009), (0.0695, -0.009), (0.0695, 0.005), (0.0665, 0.005)], 64, closed=True)
    for k in range(15):
        th = 2 * math.pi * k / 15
        er = Vector((0, math.sin(th), math.cos(th)))
        M = Matrix.Translation(Vector((-0.002, 0, 0)) + er * 0.0555) @ Rx(-th) @ Rz(0) @ Ry(0)
        M = M @ Matrix.Rotation(35 * D2R, 4, "Z")
        add_box(stb, 0.015, 0.0028, 0.024, M, bevel=0.0006)
    parts["stator"] = pc.objects()
    # lock-up clutch: piston + lamella with two friction linings (2.8/3.0-litre version)
    pc = Piece("lockup")
    lb = pc.bm("steel")
    lathe_x(lb, [(0.034, 0.0335), (0.122, 0.0335), (0.124, 0.0355), (0.122, 0.0375), (0.050, 0.0375),
                 (0.040, 0.034 + 0.006), (0.034, 0.040)], 72, closed=True)
    cb = pc.bm("copper")
    lathe_x(cb, [(0.098, 0.0378), (0.121, 0.0378), (0.121, 0.0405), (0.098, 0.0405)], 72, closed=True)
    lathe_x(cb, [(0.098, 0.0425), (0.121, 0.0425), (0.121, 0.0452), (0.098, 0.0452)], 72, closed=True)
    lathe_x(pc.bm("steel_dark"), [(0.095, 0.0407), (0.1225, 0.0407), (0.1225, 0.0423), (0.095, 0.0423)], 72, closed=True)
    parts["lockup_clutch"] = pc.objects()
    return parts


# ---------------------------------------------------------------------------------------------
# planetary gear train: Ravigneaux set + tail (single) planetary set, clutch packs, shafts
# ---------------------------------------------------------------------------------------------
MOD = 0.0025
RAV_X = -0.326          # Ravigneaux set centre (G x)
TAIL_X = -0.462         # tail set centre
LONG_N, SHORT_N, SUNL_N, SUNS_N, RING_N = 16, 13, 28, 20, 60
TAIL_SUN_N, TAIL_PL_N = 24, 18
RAV_LONG_R = (SUNL_N + LONG_N) * MOD / 2                  # 0.055
RAV_SHORT_R = (SUNS_N + SHORT_N) * MOD / 2                # 0.04125
_cosd = (RAV_SHORT_R ** 2 + RAV_LONG_R ** 2 - ((SHORT_N + LONG_N) * MOD / 2) ** 2) / (2 * RAV_SHORT_R * RAV_LONG_R)
RAV_DPHI = math.acos(_cosd)                               # angle long -> short planet (~41 deg)
TAIL_PL_R = (TAIL_SUN_N + TAIL_PL_N) * MOD / 2            # 0.0525


def spur_x(bm, n, rp, width, bore, x0, phase=0.0, M=Matrix.Identity(4)):
    """Spur gear along local x from x0 to x0+width (negative width allowed)."""
    loop = gear_loop(n, rp, MOD, phase=phase)
    inner = loop_at_radius(loop, bore)
    add_ring2d(bm, loop, inner, abs(width), M @ T(min(x0, x0 + width), 0, 0) @ MP, z0=0.0)


def ring_x(bm, n, rp, width, r_out, x0, M=Matrix.Identity(4)):
    loop = gear_loop(n, rp, MOD, internal=True)
    outer = loop_at_radius(loop, r_out)
    add_ring2d(bm, outer, loop, abs(width), M @ T(min(x0, x0 + width), 0, 0) @ MP, z0=0.0)


def polar_pt(r, th):
    return (0.0, r * math.sin(th), r * math.cos(th))


def build_planetary():
    """Returns dict of sub-node name -> (objects, local->G matrix)."""
    out = {}
    # --- Ravigneaux (local origin at RAV_X on the axis): rear zone = large sun + long planets + ring gear;
    #     front zone = small sun + short planets (which also mesh with the long planets)
    xr0, xr1 = -0.004, -0.030          # rear zone (ring gear width 26 mm)
    xf0, xf1 = 0.026, 0.002            # front zone
    pc = Piece("rav_ring")
    ring_x(pc.bm("steel"), RING_N, RING_N * MOD / 2, xr1 - xr0, 0.084, xr0)
    lathe_x(pc.bm("steel"), [(0.084, xr1), (0.084, xr1 - 0.004), (0.030, xr1 - 0.010), (0.030, xr1 - 0.016),
                              (0.024, xr1 - 0.016), (0.024, xr1 - 0.004), (0.080, xr1)], 64, closed=True)
    out["rav_ring"] = (pc.objects(), T(RAV_X, 0, 0))
    pc = Piece("rav_sun_large")
    spur_x(pc.bm("steel"), SUNL_N, SUNL_N * MOD / 2, xr1 - xr0, 0.016, xr0)
    lathe_x(pc.bm("steel"), [(0.016, xr0), (0.022, xr0), (0.022, 0.050), (0.016, 0.050)], 24, closed=True)
    out["rav_sun_large"] = (pc.objects(), T(RAV_X, 0, 0))
    pc = Piece("rav_sun_small")
    spur_x(pc.bm("alu_machined"), SUNS_N, SUNS_N * MOD / 2, xf1 - xf0, 0.0145, xf0)
    lathe_x(pc.bm("alu_machined"), [(0.0145, xf0), (0.019, xf0), (0.019, 0.075), (0.0145, 0.075)], 24, closed=True)
    out["rav_sun_small"] = (pc.objects(), T(RAV_X, 0, 0))
    # carrier: front + rear plates, bridges, pins (planets are children)
    pc = Piece("rav_carrier")
    cb = pc.bm("steel_dark")
    lathe_x(cb, [(0.023, xf0 + 0.0045), (0.066, xf0 + 0.0045), (0.066, xf0 + 0.0005), (0.023, xf0 + 0.0005)], 64, closed=True)
    lathe_x(cb, [(0.024, xr1 - 0.0005), (0.064, xr1 - 0.0005), (0.064, xr1 - 0.0045), (0.024, xr1 - 0.0045)], 64, closed=True)
    pins = []
    for k in range(3):
        th_l = 2 * math.pi * k / 3
        th_s = th_l + RAV_DPHI
        pins.append(("long", k, th_l))
        pins.append(("short", k, th_s))
        # bridge between the plates, away from the planets
        thb = th_l - 0.95
        y, z = 0.060 * math.sin(thb), 0.060 * math.cos(thb)
        add_box(cb, (xf0 - xr1), 0.010, 0.008, T((xf0 + xr1) / 2, y, z) @ Rx(-thb), bevel=0.001)
    for kind, k, th in pins:
        r = RAV_LONG_R if kind == "long" else RAV_SHORT_R
        _, y, z = polar_pt(r, th)
        add_cyl(pc.bm("steel"), 0.0055, xf0 - xr1 + 0.008, T((xf0 + xr1) / 2, y, z) @ Ry(math.pi / 2), seg=12)
    out["rav_carrier"] = (pc.objects(), T(RAV_X, 0, 0))
    for kind, k, th in pins:
        pc = Piece(f"rav_{kind}")
        r = RAV_LONG_R if kind == "long" else RAV_SHORT_R
        _, y, z = polar_pt(r, th)
        if kind == "long":
            spur_x(pc.bm("steel"), LONG_N, LONG_N * MOD / 2, xf0 - 0.003 - (xr1 + 0.001), 0.0058, xr1 + 0.001,
                   phase=th)
        else:
            spur_x(pc.bm("alu_machined"), SHORT_N, SHORT_N * MOD / 2, xf0 - 0.003 - (xf1 - 0.001), 0.0058, xf1 - 0.001,
                   phase=th + math.pi / SHORT_N)
        out[f"rav_planet_{kind}_{k + 1}"] = (pc.objects(), T(RAV_X, y, z))
    # --- tail (single) planetary set (local origin at TAIL_X)
    w0, w1 = 0.012, -0.012
    pc = Piece("tail_ring")
    ring_x(pc.bm("steel"), RING_N, RING_N * MOD / 2, w1 - w0, 0.084, w0)
    lathe_x(pc.bm("steel"), [(0.084, w0), (0.084, w0 + 0.004), (0.026, w0 + 0.012), (0.026, w0 + 0.018),
                              (0.020, w0 + 0.018), (0.020, w0 + 0.006), (0.080, w0)], 64, closed=True)
    out["tail_ring"] = (pc.objects(), T(TAIL_X, 0, 0))
    pc = Piece("tail_sun")
    spur_x(pc.bm("alu_machined"), TAIL_SUN_N, TAIL_SUN_N * MOD / 2, w1 - w0, 0.016, w0)
    lathe_x(pc.bm("alu_machined"), [(0.016, w0), (0.021, w0), (0.021, 0.090), (0.016, 0.090)], 24, closed=True)
    out["tail_sun"] = (pc.objects(), T(TAIL_X, 0, 0))
    pc = Piece("tail_carrier")
    cb = pc.bm("steel_dark")
    lathe_x(cb, [(0.022, w0 + 0.0045), (0.064, w0 + 0.0045), (0.064, w0 + 0.0005), (0.022, w0 + 0.0005)], 64, closed=True)
    lathe_x(cb, [(0.020, w1 - 0.0005), (0.064, w1 - 0.0005), (0.064, w1 - 0.0050), (0.020, w1 - 0.0050)], 64, closed=True)
    lathe_x(cb, [(0.020, w1 - 0.005), (0.030, w1 - 0.005), (0.030, w1 - 0.016), (0.020, w1 - 0.016)], 40, closed=True)
    for k in range(4):
        th = 2 * math.pi * k / 4
        _, y, z = polar_pt(TAIL_PL_R, th)
        add_cyl(pc.bm("steel"), 0.0055, (w0 - w1) + 0.008, T(0, y, z) @ Ry(math.pi / 2), seg=12)
        thb = th + math.pi / 4
        y, z = 0.060 * math.sin(thb), 0.060 * math.cos(thb)
        add_box(cb, (w0 - w1), 0.012, 0.008, T(0, y, z) @ Rx(-thb), bevel=0.001)
    out["tail_carrier"] = (pc.objects(), T(TAIL_X, 0, 0))
    for k in range(4):
        th = 2 * math.pi * k / 4
        _, y, z = polar_pt(TAIL_PL_R, th)
        pc = Piece("tail_planet")
        spur_x(pc.bm("steel"), TAIL_PL_N, TAIL_PL_N * MOD / 2, (w1 + 0.001) - (w0 - 0.001), 0.0058, w0 - 0.001,
               phase=th + math.pi / TAIL_PL_N)
        out[f"tail_planet_{k + 1}"] = (pc.objects(), T(TAIL_X, y, z))
    # --- clutch packs A-G (plates alternate steel / friction) - static node for the film's labels
    pc = Piece("clutches")
    packs = [("B", -0.198, 7, 0.064, 0.091), ("A", -0.228, 7, 0.050, 0.080), ("E", -0.258, 6, 0.052, 0.080),
             ("C", -0.296, 6, 0.089, 0.101), ("D", -0.392, 7, 0.074, 0.100), ("F", -0.420, 6, 0.052, 0.082),
             ("G", -0.494, 6, 0.074, 0.100)]
    for name, x0, n, ri, ro in packs:
        for i in range(n):
            xa = x0 - i * 0.0034
            mat = "steel" if i % 2 == 0 else "steel_dark"
            r_in = ri if i % 2 == 0 else ri + 0.003
            r_out = ro - 0.003 if i % 2 == 0 else ro
            lathe_x(pc.bm(mat), [(r_in, xa), (r_out, xa), (r_out, xa - 0.0026), (r_in, xa - 0.0026)], 56, closed=True)
        # pressure plate / drum lip
        xe = x0 - n * 0.0034
        lathe_x(pc.bm("alu_machined"), [(ri - 0.002, xe), (ro + 0.001, xe), (ro + 0.001, xe - 0.004), (ri - 0.002, xe - 0.004)],
                56, closed=True)
    out["clutch_packs"] = (pc.objects(), T(-0.35, 0, 0))
    # input (turbine) shaft from the converter to the clutches
    pc = Piece("input_shaft")
    lathe_x(pc.bm("alu_machined"), [(0.0, -0.095 + 0.20), (0.0125, 0.105), (0.0135, 0.100), (0.0135, -0.140),
                                     (0.020, -0.145), (0.020, -0.160), (0.0, -0.160)], 32)
    out["input_shaft"] = (pc.objects(), T(-0.200, 0, 0))
    return out


def build_output_shaft():
    """Output shaft + three-arm output flange; local origin on the axis at the flange face (G x = OUT_FACE)."""
    pc = Piece("output")
    sb = pc.bm("steel")
    db = pc.bm("steel_dark")
    lathe_x(sb, [(0, 0.225), (0.018, 0.225), (0.020, 0.215), (0.020, 0.030), (0.016, 0.026), (0.016, 0.0)], 32)
    # flange hub + three arms (bolt circle 96 mm, ETK) at 90/210/330 deg
    lathe_x(db, [(0, 0.020), (0.026, 0.020), (0.031, 0.016), (0.031, 0.0), (0, 0.0)], 40)
    for k in range(3):
        th = (90 + 120 * k) * D2R
        arm = [(0.0, -0.016), (0.040, -0.0125), (0.052, -0.012), (0.060, 0.0), (0.052, 0.012), (0.040, 0.0125), (0.0, 0.016)]
        M = Rx(-th) @ T(0.0, 0, 0)
        # arm polygon in the (r, tangential) plane, extruded along x from 0 to 0.014
        er = Vector((0, math.sin(th), math.cos(th)))
        et = Vector((0, math.cos(th), -math.sin(th)))
        Mm = Matrix.Identity(4)
        for i in range(3):
            Mm[i][0], Mm[i][1], Mm[i][2] = er[i], et[i], (1, 0, 0)[i]
        add_prism(db, arm, 0.014, Mm, z0=0.0, bevel=0.002)
        y, z = 0.048 * math.sin(th), 0.048 * math.cos(th)
        add_cyl(db, 0.0105, 0.016, T(0.0, y, z) @ Ry(math.pi / 2), seg=16, z0=0.0, bevel=0.0015)
        add_hex(sb, 0.0095, 0.008, T(0.016, y, z) @ Ry(math.pi / 2), z0=0.0)       # bolt head (gearbox side)
    add_cyl(sb, 0.0115, 0.030, Ry(math.pi / 2), seg=24, z0=-0.030, bevel=0.002)        # centring stub
    add_hex(sb, 0.0165, 0.010, T(0.020, 0, 0) @ Ry(math.pi / 2), z0=0.0)              # collar nut
    return pc.objects()


def build_gb_crossmember():
    """Gearbox support (crossmember) with two rubber mounts under the tail housing (G frame)."""
    pc = Piece("gbx")
    db = pc.bm("steel_dark")
    rb = pc.bm("rubber")
    xg = -0.625
    zt = -0.079                                    # tail housing bottom at the mounts
    # bracket bolted under the tail housing
    add_box(db, 0.050, 0.200, 0.006, T(xg, 0, zt - 0.010), bevel=0.0015)
    add_box(db, 0.046, 0.030, 0.020, T(xg, 0, zt - 0.000), bevel=0.002)
    for sy in (-1, 1):
        add_cyl(rb, 0.026, 0.034, T(xg, sy * 0.075, zt - 0.013), seg=24, z0=-0.034, bevel=0.004)
        add_cyl(db, 0.029, 0.004, T(xg, sy * 0.075, zt - 0.047), seg=24, z0=-0.004)
    # crossmember: flat centre, ends rising to the tunnel flanks with two-bolt feet
    sec = rrect_prof(0.060, 0.026, 0.006, 2)
    path = fillet_path([Vector((xg, -0.330, zt - 0.010)), Vector((xg, -0.250, zt - 0.010)), Vector((xg, -0.180, zt - 0.062)),
                        Vector((xg, 0.180, zt - 0.062)), Vector((xg, 0.250, zt - 0.010)), Vector((xg, 0.330, zt - 0.010))],
                       0.04, 5)
    add_sweep(db, path, [(v, u) for u, v in sec], up=(1, 0, 0))
    for sy in (-1, 1):
        for dx in (-0.018, 0.018):
            add_hex(pc.bm("steel"), 0.008, 0.007, T(xg + dx, sy * 0.300, zt + 0.003), z0=0)
    return pc.objects()
