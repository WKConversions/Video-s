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
NT = 96                     # angular samples of the housing
FL_T = 0.016                 # bell flange thickness
R_INNER = 0.160              # converter cavity radius
R_OPEN = 0.1635
R_WALL = 0.009
R_HOLE = 0.040               # pump hub bore through the bell back wall
BELL_END = -0.170            # bell / main case split (one casting on the 5HP19; split for the film)
CASE_END = -0.588            # start of the tail (extension) housing
TAIL_END = -0.673
OUT_FACE = -0.700            # output flange face (flex disc starts here)
RAIL_Z = -0.128              # oil-pan gasket face below the axis
RAIL_HW = 0.145              # half width of the pan (290 mm)
PAN_X0, PAN_X1 = -0.132, -0.584
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
    a = max(RF[k] - 0.016, R_INNER + R_WALL + 0.004)
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
        add_cyl(pc.bm("steel_dark"), 0.0068, 0.0012, T(-0.00105, y, z) @ Ry(math.pi / 2), seg=12, z0=0.0)
        add_cyl(sb, 0.0105, 0.004, T(-FL_T - 0.026, y, z) @ Ry(math.pi / 2), seg=16, z0=-0.002)   # washer face
        add_hex(sb, 0.0088, 0.008, T(-FL_T - 0.028, y, z) @ Ry(-math.pi / 2), z0=0.0)
    obs = pc.objects()
    return obs


def build_case():
    pc = Piece("case")
    ab = pc.bm("alu_cast")
    xs = list(np.linspace(BELL_END, CASE_END, 34))
    tail = [(0.094, -0.600), (0.090, -0.610), (0.082, -0.627), (0.070, -0.645), (0.059, -0.657),
            (0.050, -0.664), (0.046, -0.666), (0.046, TAIL_END), (0.033, TAIL_END), (0.033, -0.40)]

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
                   Vector((xc + 0.12, yc + 0.030, zc + 0.045)), Vector((-0.150, 0.160, 0.040)),
                   Vector((-0.112, 0.178, 0.080))], 6)
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
    cab2 = [Vector((xs_ + 0.003, ys_ + 0.041, zs_ + 0.068)), Vector((xs_ + 0.003, ys_ + 0.041, zs_ + 0.092))]
    add_cyl(kb, 0.0062, 0.026, Matrix.Translation(cab2[0]), seg=12, z0=0.0, bevel=0.0015)   # cable end (cut)
    # two ATF cooler-line fittings (left side, front of the case) and the steel lines running forward
    for i, (zf, yf) in enumerate(((-0.020, 0.112), (-0.052, 0.122))):
        xf = -0.205 - 0.022 * i
        add_hex(sb, 0.012, 0.012, T(xf, yf - 0.002, zf) @ Rx(-math.pi / 2), z0=0)
        line = fillet_path([Vector((xf, yf + 0.010, zf)), Vector((xf, yf + 0.030, zf)),
                            Vector((-0.120, 0.172 + 0.012 * i, zf + 0.006)), Vector((-0.070, 0.200 + 0.012 * i, zf + 0.010)),
                            Vector((-0.052, 0.236 + 0.010 * i, zf + 0.010)), Vector((-0.040, 0.262 + 0.010 * i, zf + 0.010))],
                           0.02, 5)
        add_sweep(sb, line, circle_prof(0.0055, 10))
        add_hex(sb, 0.0095, 0.016, Matrix.Translation(line[-1]) @ align_z(line[-1] - line[-2]), z0=-0.004)
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
    return pc.objects(), T(xm, 0, RAIL_Z - 0.0010)


# ---------------------------------------------------------------------------------------------
# torque converter W254 (local frame: origin on the axis at the converter centre plane, axis = local x)
# ---------------------------------------------------------------------------------------------
TC_RT, TC_XT, TC_A, TC_B = 0.098, -0.009, 0.033, 0.013     # fluid torus centre radius / x, outer/core radii


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
            (0.032, -0.064), (0.032, -0.093), (0.028, -0.096), (0.0215, -0.096), (0.0215, -0.058), (0, -0.058)]
    lathe_x(sb, prof, 56)
    lathe_x(sb, [(0.1378, 0.0145), (0.1392, 0.0115), (0.1392, 0.0085), (0.1378, 0.0055), (0.136, 0.008)], 64, closed=True)
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
    poly = half_annulus(TC_A - 0.0012, TC_B, math.pi, 2 * math.pi, 7)
    for k in range(27):
        blade_prism(ib, poly, 2 * math.pi * k / 27, 0.0016)
    core = [(TC_RT + TC_B * math.cos(a), TC_XT + TC_B * math.sin(a)) for a in np.linspace(math.pi, 2 * math.pi, 7)]
    core += [(TC_RT + (TC_B - 0.003) * math.cos(a), TC_XT + (TC_B - 0.003) * math.sin(a)) for a in np.linspace(2 * math.pi, math.pi, 7)]
    lathe_x(ib, core, 36, closed=True)
    parts["impeller"] = pc.objects()
    # turbine blades (front half) + core half + hub to the turbine shaft
    pc = Piece("turbine")
    tb = pc.bm("alu_machined")
    poly = half_annulus(TC_A - 0.0012, TC_B, 0.0, math.pi, 7)
    for k in range(29):
        blade_prism(tb, poly, 2 * math.pi * (k + 0.5) / 29, 0.0016)
    core = [(TC_RT + TC_B * math.cos(a), TC_XT + TC_B * math.sin(a)) for a in np.linspace(0, math.pi, 7)]
    core += [(TC_RT + (TC_B - 0.003) * math.cos(a), TC_XT + (TC_B - 0.003) * math.sin(a)) for a in np.linspace(math.pi, 0, 7)]
    lathe_x(tb, core, 36, closed=True)
    # turbine hub (splined onto the turbine/input shaft)
    lathe_x(pc.bm("steel"), [(0.016, -0.002), (0.046, -0.002), (0.054, 0.004), (0.058, 0.010), (0.058, 0.014),
                             (0.040, 0.016), (0.022, 0.020), (0.016, 0.020)], 40, closed=True)
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
    lathe_x(lb, [(0.030, 0.0290), (0.112, 0.0290), (0.114, 0.0310), (0.112, 0.0330), (0.046, 0.0330),
                 (0.036, 0.0355), (0.030, 0.0355)], 56, closed=True)
    cb = pc.bm("copper")
    lathe_x(cb, [(0.090, 0.0333), (0.111, 0.0333), (0.111, 0.0358), (0.090, 0.0358)], 56, closed=True)
    lathe_x(cb, [(0.090, 0.0378), (0.111, 0.0378), (0.111, 0.0403), (0.090, 0.0403)], 56, closed=True)
    lathe_x(pc.bm("steel_dark"), [(0.087, 0.0360), (0.1125, 0.0360), (0.1125, 0.0376), (0.087, 0.0376)], 56, closed=True)
    parts["lockup_clutch"] = pc.objects()
    return parts


# ---------------------------------------------------------------------------------------------
# planetary gear train: Ravigneaux set + tail (single) planetary set, clutch packs, shafts
# ---------------------------------------------------------------------------------------------
MOD = 0.0030
RAV_X = -0.326          # Ravigneaux set centre (G x)
TAIL_X = -0.470         # tail set centre
LONG_N, SHORT_N, SUNL_N, SUNS_N, RING_N = 13, 11, 24, 17, 50
TAIL_SUN_N, TAIL_PL_N = 20, 15
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


def spider_plate(bm, pins, hub_r, bore_r, arm_w, x0, x1, n=96):
    """Carrier plate shaped as a hub with one rounded arm per planet pin (pins: [(r, theta)]), so the gears stay
    visible from the front. Plate lies between local x0 and x1."""
    outer, inner = [], []
    for k in range(n):
        th = 2 * math.pi * k / n
        best = hub_r
        for (L, thp) in pins:
            phi = math.atan2(math.sin(th - thp), math.cos(th - thp))
            c, sn = math.cos(phi), abs(math.sin(phi))
            if c > 0:
                t_side = min(arm_w / max(sn, 1e-6), L / c)
                best = max(best, t_side)
            disc = arm_w ** 2 - (L * sn) ** 2
            if disc >= 0 and c > 0:
                best = max(best, L * c + math.sqrt(disc))
        outer.append((best * math.cos(th), best * math.sin(th)))
        inner.append((bore_r * math.cos(th), bore_r * math.sin(th)))
    # plate local XY -> (y, z) via MP-like map: local (u, v, w) -> (w, u, v); here u = y?  use explicit matrix
    M = Matrix(((0, 0, 1, 0), (0, 1, 0, 0), (1, 0, 0, 0), (0, 0, 0, 1)))   # (u, v, w) -> (w, v, u): u=z, v=y
    add_ring2d(bm, outer, inner, abs(x1 - x0), M, z0=min(x0, x1))


def build_planetary():
    """Returns dict of sub-node name -> (objects, local->G matrix)."""
    out = {}
    # --- Ravigneaux (local origin at RAV_X on the axis): rear zone = large sun + long planets + ring gear;
    #     front zone = small sun + short planets (which also mesh with the long planets)
    xr0, xr1 = -0.004, -0.030          # rear zone (ring gear width 26 mm)
    xf0, xf1 = 0.026, 0.002            # front zone
    pc = Piece("rav_ring")
    ring_x(pc.bm("steel"), RING_N, RING_N * MOD / 2, xr1 - xr0, 0.084, xr0)
    lathe_x(pc.bm("steel"), [(0.084, xr1), (0.084, xr1 - 0.010), (0.034, xr1 - 0.016), (0.034, xr1 - 0.022),
                              (0.026, xr1 - 0.022), (0.026, xr1 - 0.014), (0.078, xr1 - 0.006), (0.078, xr1)], 64,
            closed=True)
    out["rav_ring"] = (pc.objects(), T(RAV_X, 0, 0))
    pc = Piece("rav_sun_large")
    spur_x(pc.bm("steel"), SUNL_N, SUNL_N * MOD / 2, xr1 - xr0, 0.016, xr0)
    lathe_x(pc.bm("steel"), [(0.016, xr0), (0.022, xr0), (0.022, -0.040), (0.016, -0.040)], 24, closed=True)
    out["rav_sun_large"] = (pc.objects(), T(RAV_X, 0, 0))
    pc = Piece("rav_sun_small")
    spur_x(pc.bm("alu_machined"), SUNS_N, SUNS_N * MOD / 2, xf1 - xf0, 0.0145, xf0)
    lathe_x(pc.bm("alu_machined"), [(0.0145, xf0), (0.019, xf0), (0.019, 0.075), (0.0145, 0.075)], 24, closed=True)
    out["rav_sun_small"] = (pc.objects(), T(RAV_X, 0, 0))
    # carrier: front + rear plates, bridges, pins (planets are children)
    pc = Piece("rav_carrier")
    cb = pc.bm("steel_dark")
    pins = []
    for k in range(3):
        th_l = 2 * math.pi * k / 3
        th_s = th_l + RAV_DPHI
        pins.append(("long", k, th_l))
        pins.append(("short", k, th_s))
        # bridge between the plates, away from the planets
        thb = th_l - 0.70
        y, z = 0.044 * math.sin(thb), 0.044 * math.cos(thb)
        add_box(cb, (xf0 - xr1), 0.008, 0.007, T((xf0 + xr1) / 2, y, z) @ Rx(-thb), bevel=0.001)
    pin_rt = [((RAV_LONG_R if kind == "long" else RAV_SHORT_R), th) for kind, k, th in pins]
    pin_rt += [(0.044, 2 * math.pi * k / 3 - 0.70) for k in range(3)]          # bridge arms
    spider_plate(cb, pin_rt, 0.031, 0.023, 0.0095, xf0 + 0.0005, xf0 + 0.0045, n=72)
    spider_plate(cb, pin_rt, 0.031, 0.024, 0.0095, xr1 - 0.0005, xr1 - 0.0045, n=72)
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
    lathe_x(pc.bm("steel"), [(0.084, w0), (0.084, w0 + 0.010), (0.030, w0 + 0.016), (0.030, w0 + 0.022),
                              (0.024, w0 + 0.022), (0.024, w0 + 0.014), (0.078, w0 + 0.006), (0.078, w0)], 64,
            closed=True)
    out["tail_ring"] = (pc.objects(), T(TAIL_X, 0, 0))
    pc = Piece("tail_sun")
    spur_x(pc.bm("alu_machined"), TAIL_SUN_N, TAIL_SUN_N * MOD / 2, w1 - w0, 0.016, w0)
    lathe_x(pc.bm("alu_machined"), [(0.016, w0), (0.021, w0), (0.021, 0.080), (0.016, 0.080)], 24, closed=True)
    out["tail_sun"] = (pc.objects(), T(TAIL_X, 0, 0))
    pc = Piece("tail_carrier")
    cb = pc.bm("steel_dark")
    tpins = [(TAIL_PL_R, 2 * math.pi * k / 4) for k in range(4)] + [(0.037, 2 * math.pi * k / 4 + math.pi / 4) for k in range(4)]
    spider_plate(cb, tpins, 0.033, 0.022, 0.0100, w0 + 0.0005, w0 + 0.0045, n=72)
    spider_plate(cb, tpins, 0.034, 0.020, 0.0100, w1 - 0.0005, w1 - 0.0050, n=72)
    lathe_x(cb, [(0.020, w1 - 0.005), (0.030, w1 - 0.005), (0.030, w1 - 0.016), (0.020, w1 - 0.016)], 40, closed=True)
    for k in range(4):
        th = 2 * math.pi * k / 4
        _, y, z = polar_pt(TAIL_PL_R, th)
        add_cyl(pc.bm("steel"), 0.0055, (w0 - w1) + 0.008, T(0, y, z) @ Ry(math.pi / 2), seg=12)
        thb = th + math.pi / 4
        y, z = 0.037 * math.sin(thb), 0.037 * math.cos(thb)
        add_box(cb, (w0 - w1), 0.008, 0.007, T(0, y, z) @ Rx(-thb), bevel=0.001)
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
             ("C", -0.296, 6, 0.089, 0.100), ("D", -0.380, 7, 0.072, 0.096), ("F", -0.410, 6, 0.040, 0.068),
             ("G", -0.494, 6, 0.072, 0.093)]
    for name, x0, n, ri, ro in packs:
        x0 = x0 + 0.35
        n = 4
        for i in range(n):
            xa = x0 - i * 0.0034
            mat = "steel" if i % 2 == 0 else "steel_dark"
            r_in = ri if i % 2 == 0 else ri + 0.003
            r_out = ro - 0.003 if i % 2 == 0 else ro
            lathe_x(pc.bm(mat), [(r_in, xa), (r_out, xa), (r_out, xa - 0.0026), (r_in, xa - 0.0026)], 30, closed=True)
        # pressure plate / drum lip
        xe = x0 - n * 0.0034
        lathe_x(pc.bm("alu_machined"), [(ri - 0.002, xe), (ro + 0.001, xe), (ro + 0.001, xe - 0.004), (ri - 0.002, xe - 0.004)],
                30, closed=True)
    out["clutch_packs"] = (pc.objects(), T(-0.35, 0, 0))
    # input (turbine) shaft from the converter to the clutches
    pc = Piece("input_shaft")
    lathe_x(pc.bm("alu_machined"), [(0.0, 0.142), (0.0125, 0.142), (0.0135, 0.137), (0.0135, -0.140),
                                     (0.020, -0.145), (0.020, -0.160), (0.0, -0.160)], 32)
    out["input_shaft"] = (pc.objects(), T(-0.200, 0, 0))
    return out


def build_output_shaft():
    """Output shaft + three-arm output flange; local origin on the axis at the flange face (G x = OUT_FACE)."""
    pc = Piece("output")
    sb = pc.bm("steel")
    db = pc.bm("steel_dark")
    lathe_x(sb, [(0, 0.215), (0.018, 0.215), (0.020, 0.207), (0.020, 0.030), (0.016, 0.026), (0.016, 0.0)], 32)
    # flange hub (runs in the tail seal) + three arms (flex-disc bolt circle 96 mm, ETK) at 90/210/330 deg
    lathe_x(db, [(0, 0.024), (0.027, 0.024), (0.031, 0.020), (0.031, 0.0), (0, 0.0)], 40)
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
    add_sweep(db, path, sec, up=(1, 0, 0))
    for sy in (-1, 1):
        for dx in (-0.018, 0.018):
            add_hex(pc.bm("steel"), 0.008, 0.007, T(xg + dx, sy * 0.300, zt + 0.003), z0=0)
    return pc.objects()


# ==============================================================================================
# 3. Propshaft (two-piece: flex disc, front tube, centre bearing, U-joint, rear tube, CV joint)
#    ETK automatic shaft L = 1403 mm; flex disc 6 holes on 96 mm; centre bearing 55/30 mm; CV joint 6 x M10 on 86 mm
# ==============================================================================================
PIN_DZ = -0.030              # hypoid offset: pinion axis 30 mm below the ring-gear centre (estimate)
PIN_FACE = 0.240             # pinion-flange face ahead of the axle line (ETK shaft length -> 1403 mm)
PA = M_G @ Vector((OUT_FACE, 0, 0))                       # gearbox output-flange face centre
PB = M_D @ Vector((PIN_FACE, 0, PIN_DZ))                  # diff pinion-flange face centre
PROP_L = (PA - PB).length
M_P = frame_axes(PA - PB, (0, 0, 1), origin=PA)           # local +X forward along the shaft, origin at PA
CB_S = 0.648                                              # centre bearing distance from PA


def arms3(bm, th0, x0, thick, r_arm=0.060, boss_r=0.0105, bolt_r=0.048):
    """Three-arm flange (arms at th0 + k*120 deg) in a frame whose axis is local x; plate from x0 to x0+thick."""
    for k in range(3):
        th = th0 + k * 2 * math.pi / 3
        arm = [(0.0, -0.016), (0.040, -0.0125), (0.052, -0.012), (r_arm, 0.0), (0.052, 0.012), (0.040, 0.0125), (0.0, 0.016)]
        er = Vector((0, math.sin(th), math.cos(th)))
        et = Vector((0, math.cos(th), -math.sin(th)))
        Mm = Matrix.Identity(4)
        for i in range(3):
            Mm[i][0], Mm[i][1], Mm[i][2] = er[i], et[i], (1, 0, 0)[i]
        add_prism(bm, arm, thick, Mm, z0=x0, bevel=0.002)
        y, z = bolt_r * math.sin(th), bolt_r * math.cos(th)
        add_cyl(bm, boss_r, thick + 0.002, T(x0 + thick / 2, y, z) @ Ry(math.pi / 2), seg=16, bevel=0.0015)


def boot_profile(y0, y1, r0, r1, n_conv=3, amp=0.004):
    """Convoluted rubber boot from (r0 at y0) to (r1 at y1): list of (r, y) for a solid lathe."""
    pts = []
    m = 4 * n_conv + 1
    for i in range(m + 1):
        t = i / m
        r = lerp(r0, r1, t) + (amp if i % 2 == 1 else -amp * 0.2) * (1 if 0 < i < m else 0)
        pts.append((r, lerp(y0, y1, t)))
    return pts


def build_propshaft():
    pc = Piece("prop")
    sb, db, rb = pc.bm("steel"), pc.bm("steel_dark"), pc.bm("rubber")
    L = PROP_L
    # flex disc (Hardy disc / guibo) with six steel sleeves
    lathe_x(rb, [(0.022, -0.0015), (0.062, -0.0015), (0.066, -0.006), (0.066, -0.025), (0.062, -0.0295),
                 (0.022, -0.0295)], 56, closed=True)
    for j in range(6):
        th = (30 + 60 * j) * D2R
        y, z = 0.048 * math.sin(th), 0.048 * math.cos(th)
        add_tube(sb, 0.0092, 0.006, 0.032, T(-0.0155, y, z) @ Ry(math.pi / 2), seg=12)
        if j % 2 == 1:      # 90/210/330: bolts from the gearbox flange -> nuts on the disc's rear face
            add_hex(sb, 0.0095, 0.008, T(-0.0315, y, z) @ Ry(-math.pi / 2), z0=0.0)
        else:               # 30/150/270: bolts from the shaft flange -> nuts in front, between the gearbox arms
            add_hex(sb, 0.0095, 0.008, T(0.0005, y, z) @ Ry(math.pi / 2), z0=0.0)
            add_hex(sb, 0.0095, 0.008, T(-0.0465, y, z) @ Ry(-math.pi / 2), z0=0.0)
    # shaft flange (3 arms at 30/150/270 deg) + centring neck
    arms3(db, 30 * D2R, -0.0455, 0.014)
    lathe_x(db, [(0.0, -0.030), (0.031, -0.030), (0.031, -0.050), (0.026, -0.070), (0.026, -0.092), (0.0, -0.092)], 40)
    # front tube (76 mm) stepping down to the splined stub through the centre bearing
    lathe_x(db, [(0.0, -0.088), (0.026, -0.088), (0.038, -0.112), (0.038, -0.585), (0.030, -0.604), (0.022, -0.614),
                 (0.0215, -CB_S - 0.024), (0.0, -CB_S - 0.024)], 48)
    # centre universal joint: two yokes + cross with 4 bearing caps
    xu = -0.700
    lathe_x(sb, [(0.0, -0.670), (0.027, -0.670), (0.029, -0.674), (0.029, -0.680), (0.0, -0.680)], 32)
    lathe_x(sb, [(0.0, -0.720), (0.029, -0.720), (0.029, -0.726), (0.027, -0.730), (0.0, -0.730)], 32)
    for ths, xa, xb in ((0.0, -0.679, -0.712), (90 * D2R, -0.688, -0.721)):
        for sgn in (1, -1):
            th = ths + (0 if sgn > 0 else math.pi)
            er = Vector((0, math.sin(th), math.cos(th)))
            add_box(sb, xb - xa if xb > xa else xa - xb, 0.024, 0.009,
                    Matrix.Translation(Vector(((xa + xb) / 2, 0, 0)) + er * 0.026) @ Rx(-th), bevel=0.002)
            add_cyl(sb, 0.0105, 0.012, Matrix.Translation(Vector((xu, 0, 0)) + er * 0.024) @ align_z(er), seg=16,
                    bevel=0.0015)
    add_cyl(db, 0.0075, 0.050, T(xu, 0, 0), seg=12)
    add_cyl(db, 0.0075, 0.050, T(xu, 0, 0) @ Rx(math.pi / 2), seg=12)
    add_box(db, 0.016, 0.016, 0.016, T(xu, 0, 0), bevel=0.003)
    # rear tube (68 mm) to the CV joint
    lathe_x(db, [(0.0, -0.729), (0.028, -0.729), (0.034, -0.748), (0.034, -1.282), (0.024, -1.302), (0.016, -1.312),
                 (0.0, -1.312)], 48)
    # CV boot + CV joint body bolted to the pinion flange (6 x M10 on 86 mm)
    bp = [(0.0, -1.300)] + [(r, -y) for (r, y) in boot_profile(1.300, 1.352, 0.016, 0.031, 2, 0.003)] + [(0.0, -1.352)]
    lathe_x(rb, bp, 40)
    lathe_x(sb, [(0.0, -1.352), (0.034, -1.352), (0.044, -1.355), (0.050, -1.360), (0.052, -1.366), (0.052, -L + 0.004),
                 (0.049, -L), (0.0, -L)], 48)
    for j in range(6):
        th = (60 * j) * D2R
        y, z = 0.043 * math.sin(th), 0.043 * math.cos(th)
        add_hex(sb, 0.0082, 0.007, T(-1.360, y, z) @ Ry(math.pi / 2), z0=0.0)
    return pc.objects()


def build_prop_support():
    pc = Piece("prop_support")
    rb, db, sb = pc.bm("rubber"), pc.bm("steel_dark"), pc.bm("steel")
    x = -CB_S
    lathe_x(sb, [(0.0216, x + 0.009), (0.0285, x + 0.009), (0.0285, x - 0.009), (0.0216, x - 0.009)], 40, closed=True)
    lathe_x(rb, [(0.0285, x + 0.017), (0.054, x + 0.017), (0.058, x + 0.012), (0.058, x - 0.012), (0.054, x - 0.017),
                 (0.0285, x - 0.017)], 48, closed=True)
    lathe_x(db, [(0.058, x + 0.015), (0.062, x + 0.015), (0.062, x - 0.015), (0.058, x - 0.015)], 48, closed=True)
    # bracket: top plate with two feet (bolted to the tunnel), side straps down to the hoop
    add_box(db, 0.030, 0.190, 0.004, T(x, 0, 0.074), bevel=0.0012)
    for sy in (-1, 1):
        add_box(db, 0.026, 0.004, 0.030, T(x, sy * 0.055, 0.058) @ Rx(sy * 0.45), bevel=0.001)
        add_hex(sb, 0.0085, 0.006, T(x, sy * 0.080, 0.076), z0=0)
    return pc.objects()


# ==============================================================================================
# 4. Rear differential 188K (ring gear 188 mm), I = 3.38 = 44/13 (ETK 33 10 7 505 394 'I=3,38', automatic)
#    Frame D: origin = ring-gear centre on the rear axle line; pinion axis along +X, 30 mm below the centre.
#    Ring gear on the car's LEFT of the pinion (with the engine turning clockwise seen from the front this drives
#    the car forward); hypoid (spiral) teeth; open differential with two spider and two side gears.
# ==============================================================================================
RING_N, PIN_N = 44, 13
CONE_K = 1.0 / math.tan(math.atan(RING_N / PIN_N))       # pitch-cone slope of the ring face (tan 16.5 deg)


def ring_yroot(r):
    return CONE_K * r + 0.0055


def build_ring_gear():
    pc = Piece("ring")
    sb = pc.bm("steel")
    prof = [(0.058, 0.056), (0.0935, 0.056), (0.0948, 0.0545), (0.0948, ring_yroot(0.0948) + 0.0015),
            (0.0935, ring_yroot(0.0935)), (0.068, ring_yroot(0.068)), (0.058, ring_yroot(0.058))]
    add_lathe_closed(sb, prof, 88, MPY)
    r_mid = 0.081
    for k in range(RING_N):
        phi0 = 2 * math.pi * k / RING_N
        pts, ns, bs, sc = [], [], [], []
        S = 6
        for i in range(S + 1):
            t = i / S
            r = 0.0695 + t * (0.0930 - 0.0695)
            phi = phi0 + 0.24 * (t - 0.5)
            pts.append(Vector((r * math.cos(phi), ring_yroot(r), r * math.sin(phi))))
            sc.append(r / r_mid)
        for i in range(S + 1):
            tng = (pts[min(i + 1, S)] - pts[max(i - 1, 0)]).normalized()
            n = Vector((0, -1, 0))
            b = n.cross(tng).normalized()
            ns.append(n)
            bs.append(b)
        tooth_sweep(sb, pts, ns, bs, 0.0068, 0.0026, 0.0095, emb=0.0015, scales=sc)
    return pc.objects()


def build_pinion():
    """Pinion with spiral teeth, shaft, bearings and the drive flange; local origin on the pinion axis at
    x = 0.081 (D frame), local +X forward."""
    pc = Piece("pinion")
    sb, db = pc.bm("steel"), pc.bm("steel_dark")
    x0 = 0.081
    k = CONE_K

    def rr(xa):
        return k * xa - 0.0055
    lathe_x(sb, [(0.0, 0.062 - x0), (rr(0.062), 0.062 - x0), (rr(0.100), 0.100 - x0), (0.0245, 0.101 - x0),
                 (0.0195, 0.104 - x0), (0.0195, 0.215 - x0), (0.0, 0.215 - x0)], 40)
    for kt in range(PIN_N):
        psi0 = 2 * math.pi * kt / PIN_N
        pts, ns, bs, sc = [], [], [], []
        S = 6
        for i in range(S + 1):
            t = i / S
            xa = 0.0645 + t * (0.0985 - 0.0645)
            psi = psi0 - 0.50 * (t - 0.5)
            r = rr(xa)
            pts.append(Vector((xa - x0, r * math.sin(psi), r * math.cos(psi))))
            sc.append(xa / x0)
        for i in range(S + 1):
            tng = (pts[min(i + 1, S)] - pts[max(i - 1, 0)]).normalized()
            p = pts[i]
            n = Vector((0, p.y, p.z)).normalized()
            n = (n - tng * n.dot(tng)).normalized()
            b = n.cross(tng).normalized()
            ns.append(n)
            bs.append(b)
        tooth_sweep(sb, pts, ns, bs, 0.0068, 0.0026, 0.0092, emb=0.0012, scales=sc)
    # taper roller bearings (cones + rollers ring), spacer, drive flange with 6 threaded bosses
    lathe_x(sb, [(0.0195, 0.104 - x0), (0.033, 0.106 - x0), (0.030, 0.122 - x0), (0.0195, 0.122 - x0)], 40, closed=True)
    lathe_x(sb, [(0.0195, 0.170 - x0), (0.0285, 0.170 - x0), (0.0265, 0.185 - x0), (0.0195, 0.185 - x0)], 40, closed=True)
    lathe_x(db, [(0.0, 0.186 - x0), (0.0275, 0.186 - x0), (0.0275, 0.2195 - x0), (0.0, 0.2195 - x0)], 40)
    lathe_x(db, [(0.0, 0.2195 - x0), (0.050, 0.2195 - x0), (0.054, 0.2235 - x0), (0.054, PIN_FACE - 0.002 - x0),
                 (0.052, PIN_FACE - x0), (0.0, PIN_FACE - x0)], 56)
    for j in range(6):
        th = (60 * j) * D2R
        add_cyl(db, 0.0078, 0.006, T(0.2195 - x0, 0.043 * math.sin(th), 0.043 * math.cos(th)) @ Ry(math.pi / 2), seg=12,
                z0=-0.006)
    return pc.objects()


def bevel_teeth(bm, n, axis, e1, e2, gamma, rho0, rho1, depth, w_root, w_tip, phase=0.0, twist=0.0):
    """Straight/spiral bevel teeth on a cone with apex at the local origin. axis: gear axis unit vector;
    e1, e2: orthonormal radial basis; gamma: pitch-cone half angle; rho: distance along the generatrix."""
    axis, e1, e2 = Vector(axis), Vector(e1), Vector(e2)
    for k in range(n):
        psi0 = phase + 2 * math.pi * k / n
        pts, ns, bs, sc = [], [], [], []
        S = 4
        for i in range(S + 1):
            t = i / S
            rho = rho0 + t * (rho1 - rho0)
            psi = psi0 + twist * (t - 0.5)
            er = e1 * math.cos(psi) + e2 * math.sin(psi)
            p = er * (rho * math.sin(gamma)) + axis * (rho * math.cos(gamma))
            nrm = er * math.cos(gamma) - axis * math.sin(gamma)
            pts.append(p)
            ns.append(nrm)
            sc.append(rho / ((rho0 + rho1) / 2))
        for i in range(S + 1):
            tng = (pts[min(i + 1, S)] - pts[max(i - 1, 0)]).normalized()
            bs.append(ns[i].cross(tng).normalized())
        tooth_sweep(bm, pts, ns, bs, w_root, w_tip, depth, emb=0.0012, scales=sc)


SIDE_N, SPIDER_N = 14, 10
G_SIDE = math.atan2(SIDE_N, SPIDER_N)        # side-gear pitch-cone half angle (54.5 deg)
G_SPID = math.pi / 2 - G_SIDE


def cone_root(gamma, rho, axis_sign=1):
    """(radius, axial) of a point on the root cone (0.003 below the pitch cone)."""
    r = rho * math.sin(gamma) - 0.003 * math.cos(gamma)
    a = rho * math.cos(gamma) + 0.003 * math.sin(gamma)
    return r, a


def build_spider():
    """Differential carrier (case) + cross pin + ring-gear bolts; and the four bevel gears as separate pieces."""
    out = {}
    pc = Piece("carrier")
    db, sb = pc.bm("steel_dark"), pc.bm("steel")
    for sg in (1, -1):
        if sg > 0:
            prof = [(0.020, 0.040), (0.050, 0.040), (0.0525, 0.044), (0.0525, 0.056), (0.072, 0.056), (0.072, 0.063),
                    (0.036, 0.065), (0.030, 0.070), (0.030, 0.082), (0.020, 0.082)]
        else:
            prof = [(0.020, -0.040), (0.050, -0.040), (0.0525, -0.044), (0.0525, -0.056), (0.036, -0.062),
                    (0.030, -0.068), (0.030, -0.082), (0.020, -0.082)]
        add_lathe_closed(db, prof, 40, MPY)
    for sz in (1, -1):        # bridges carrying the cross pin (pin vertical at the export pose)
        add_box(db, 0.032, 0.090, 0.012, T(0, 0, sz * 0.050), bevel=0.003, seg=1)
    add_cyl(sb, 0.0085, 0.114, Matrix.Identity(4), seg=16, bevel=0.001)
    for j in range(10):
        a = 2 * math.pi * (j + 0.5) / 10
        add_hex(sb, 0.0072, 0.006, T(0.064 * math.cos(a), 0.063, 0.064 * math.sin(a)) @ Rx(-math.pi / 2), z0=0.0)
    out["carrier"] = pc.objects()
    rho0, rho1 = 0.024, 0.040
    for sg, nm in ((1, "side_gear_left"), (-1, "side_gear_right")):
        pc = Piece(nm)
        gb = pc.bm("steel")
        ax = Vector((0, sg, 0))
        bevel_teeth(gb, SIDE_N, ax, (1, 0, 0), (0, 0, 1), G_SIDE, rho0, rho1, 0.0058, 0.0062, 0.0026,
                    phase=(0.5 if sg < 0 else 0.0) * 2 * math.pi / SIDE_N)
        r0, a0 = cone_root(G_SIDE, rho0)
        r1, a1 = cone_root(G_SIDE, rho1)
        prof = [(0.011, a0), (r0, a0), (r1, a1), (r1 + 0.0015, a1 + 0.002), (0.034, 0.033), (0.020, 0.036),
                (0.0195, 0.052), (0.011, 0.052)]
        add_lathe_closed(gb, [(r, sg * y) for r, y in prof], 36, MPY)
        out[nm] = pc.objects()
    for sz, nm in ((1, "spider_gear_top"), (-1, "spider_gear_bottom")):
        pc = Piece(nm)
        gb = pc.bm("alu_machined")
        ax = Vector((0, 0, sz))
        bevel_teeth(gb, SPIDER_N, ax, (1, 0, 0), (0, 1, 0), G_SPID, rho0, rho1, 0.0058, 0.0062, 0.0026,
                    phase=(0.5 if sz < 0 else 0.0) * 2 * math.pi / SPIDER_N)
        r0, a0 = cone_root(G_SPID, rho0)
        r1, a1 = cone_root(G_SPID, rho1)
        prof = [(0.0088, a0), (r0, a0), (r1, a1), (r1 + 0.001, a1 + 0.002), (0.024, 0.040), (0.016, 0.0435),
                (0.0088, 0.0435)]
        add_lathe_closed(gb, [(r, sz * zz) for r, zz in prof], 32)
        out[nm] = pc.objects()
    return out


FINNED_COVER = False        # stock 330Ci cover 33 11 7 508 901 has no cooling fins (finned = Z4 / upgrade part, diff.md)
COVER_W, COVER_H, COVER_ZC, COVER_R = 0.272, 0.250, 0.006, 0.058   # rear-cover outline (lateral, vertical, centre z)
EYE_X, EYE_Z = -0.080, 0.172                                       # rear mount eye (bush axis fore-aft)
LUG_X, LUG_Y, LUG_Z = 0.153, 0.088, -0.036                         # front mount lugs beside the nose (fore-aft bolts)


def cover_outline(scale=1.0, n=4):
    return [(u * scale, v * scale) for (u, v) in rrect_prof(COVER_H, COVER_W, COVER_R, n)]


def build_diff_housing():
    """188K housing ('K' = compact: no side-bearing covers). Front: two low lugs beside the nose take fore-aft
    M12 bolts into rubber mounts in the subframe; two vibration absorbers on top (automatic only)."""
    pc = Piece("dh")
    db, sb, rb = pc.bm("steel_dark"), pc.bm("steel"), pc.bm("rubber")
    # main bowl around the axle axis, flattened at the cover joint (x = -0.040)
    prof = [(0.0, -0.104), (0.040, -0.104), (0.062, -0.096), (0.090, -0.080), (0.107, -0.058), (0.116, -0.030),
            (0.118, 0.000), (0.118, 0.040), (0.112, 0.068), (0.097, 0.090), (0.070, 0.105), (0.040, 0.112), (0.0, 0.112)]
    vs = add_lathe(db, prof, 56, MPY)
    for v in vs:
        if v.co.x < -0.040:
            v.co.x = -0.040
    # pinion nose (tapered) with a seal collar
    lathe_x(db, [(0.034, 0.030), (0.078, 0.030), (0.074, 0.065), (0.064, 0.095), (0.057, 0.120), (0.054, 0.150),
                 (0.054, 0.190), (0.050, 0.196), (0.043, 0.200), (0.043, 0.2170), (0.031, 0.2170), (0.031, 0.170),
                 (0.034, 0.150)], 48, T(0, 0, PIN_DZ), closed=True)
    lathe_x(db, [(0.054, 0.150), (0.060, 0.152), (0.060, 0.160), (0.054, 0.162)], 48, T(0, 0, PIN_DZ), closed=True)
    # longitudinal stiffening ribs on the nose (ST034 p.23 drawing)
    for a in (-62, 62, 180 - 50, 180 + 50):
        th = a * D2R
        add_box(db, 0.120, 0.007, 0.018, T(0.110, 0.052 * math.sin(th), PIN_DZ + 0.052 * math.cos(th)) @ Rx(-th) @ Ry(-0.10),
                bevel=0.002)
    # output collars (90 mm seals), no bolted side covers on the 188K
    for sg in (1, -1):
        prof = [(0.031, 0.078), (0.058, 0.078), (0.058, 0.098), (0.052, 0.106), (0.046, 0.107), (0.046, 0.121), (0.031, 0.121)]
        add_lathe_closed(db, [(r, sg * y) for r, y in prof], 48, MPY)
    # front mount lugs (eye axis fore-aft) with webs to the nose
    for sg in (1, -1):
        add_cyl(db, 0.019, 0.026, T(LUG_X, sg * LUG_Y, LUG_Z) @ Ry(math.pi / 2), seg=20, bevel=0.003)
        add_box(db, 0.060, 0.042, 0.022, T(LUG_X - 0.022, sg * (LUG_Y - 0.026), LUG_Z), bevel=0.004, seg=1)
        add_box(db, 0.070, 0.016, 0.050, T(LUG_X - 0.040, sg * (LUG_Y - 0.038), LUG_Z + 0.018) @ Rx(sg * 0.25),
                bevel=0.004, seg=1)
    # joint flange for the rear cover
    MXP = Matrix(((0, 0, 1, 0), (0, 1, 0, 0), (1, 0, 0, 0), (0, 0, 0, 1)))     # (u vertical, v lateral, w) -> (w, v, u)
    add_prism(db, cover_outline(1.0), 0.010, T(0, 0, COVER_ZC) @ MXP, z0=-0.040)
    add_cyl(sb, 0.006, 0.014, T(0.040, 0.030, 0.112), seg=12, bevel=0.002, z0=0.0)        # breather
    # two vibration absorbers (tuned masses) on brackets on top - automatic only (ETK 33 10 7 513 897 / 513 902)
    for sg, r, L in ((1, 0.033, 0.064), (-1, 0.029, 0.054)):
        y0 = sg * 0.060
        add_box(db, 0.050, 0.060, 0.006, T(0.005, y0, 0.121), bevel=0.0015)
        add_box(db, 0.050, 0.006, 0.040, T(0.005, y0 - sg * 0.028, 0.140), bevel=0.0015)
        add_cyl(db, r, L, T(0.005, y0 + sg * 0.004, 0.124 + r + 0.004) @ Rx(math.pi / 2), seg=28, bevel=0.004)
        add_tube(rb, r + 0.001, r * 0.6, 0.008, T(0.005, y0 - sg * (L / 2 - 0.004), 0.124 + r + 0.004) @ Rx(math.pi / 2), seg=28)
        for dx in (-0.016, 0.016):
            add_hex(sb, 0.0085, 0.006, T(0.005 + dx, y0 + sg * 0.020, 0.124), z0=0.0)
    return pc.objects()


def build_diff_cover():
    """Rear cover 'TYP 188K' (cast aluminium, sealed with liquid gasket): plain rounded-rectangle cover with cast
    cross ribs, the rear rubber mount eye on top (hydro bush, M14 x 133 bolt fore-aft), fill + drain plugs."""
    pc = Piece("dc")
    ab, sb, rb = pc.bm("alu_cast"), pc.bm("steel"), pc.bm("rubber")
    path = [Vector((x, 0, COVER_ZC)) for x in (-0.040, -0.0505, -0.052, -0.068, -0.086, -0.098, -0.104)]
    sc = [1.0, 1.0, 0.95, 0.92, 0.84, 0.72, 0.60]
    add_sweep(ab, path, cover_outline(1.0, 5), up=(0, 0, 1), scales=sc)
    # cast ribs on the back: an X plus a horizontal rib (follow the domed back roughly)
    for ang in (0.70, -0.70, 0.0):
        L = 0.230 if ang else 0.200
        add_box(ab, 0.012, L, 0.008, T(-0.100, 0, COVER_ZC) @ Rx(ang), bevel=0.003)
    if FINNED_COVER:
        for zf in np.linspace(-0.084, 0.072, 8):
            add_box(ab, 0.030, COVER_W * 0.70, 0.0045, T(-0.104, 0, COVER_ZC + zf), bevel=0.0012)
    # cover bolts on the flange
    ol = cover_outline(1.0, 3)
    for j in range(10):
        k = int(j * len(ol) / 10)
        u, v = ol[k]
        d = math.hypot(u, v)
        u2, v2 = u * (d - 0.009) / d, v * (d - 0.009) / d
        add_hex(sb, 0.0072, 0.006, T(-0.0505, v2, COVER_ZC + u2) @ Ry(-math.pi / 2), z0=0.0)
    # rear mount eye on top: cast boss + eye (axis fore-aft) + hydro bush + steel sleeve + M14 x 133 bolt
    add_box(ab, 0.046, 0.060, 0.050, T(EYE_X + 0.002, 0, 0.128), bevel=0.006, seg=1)
    add_tube(ab, 0.035, 0.026, 0.044, T(EYE_X, 0, EYE_Z) @ Ry(math.pi / 2), seg=32, bevel=0.002)
    add_tube(rb, 0.026, 0.0115, 0.046, T(EYE_X, 0, EYE_Z) @ Ry(math.pi / 2), seg=32)
    add_tube(sb, 0.0115, 0.0072, 0.058, T(EYE_X, 0, EYE_Z) @ Ry(math.pi / 2), seg=20)
    add_cyl(sb, 0.0070, 0.133, T(EYE_X - 0.002, 0, EYE_Z) @ Ry(math.pi / 2), seg=12)
    add_hex(sb, 0.0115, 0.009, T(EYE_X + 0.0645, 0, EYE_Z) @ Ry(math.pi / 2), z0=0.0)
    add_hex(sb, 0.0115, 0.011, T(EYE_X - 0.0685, 0, EYE_Z) @ Ry(-math.pi / 2), z0=0.0)
    # fill plug (upper, right) and drain plug (lower) - M22 x 1.5
    for (yy, zz) in ((-0.070, 0.050), (-0.040, -0.085)):
        add_cyl(ab, 0.016, 0.008, T(-0.094, yy, COVER_ZC + zz) @ Ry(-math.pi / 2), seg=20, bevel=0.002, z0=0.0)
        add_hex(sb, 0.0125, 0.007, T(-0.101, yy, COVER_ZC + zz) @ Ry(-math.pi / 2), z0=0.0)
    return pc.objects()


# ==============================================================================================
# 5. Half-shafts: output flange (LK 86 mm / M10, automatic), disc-type inner CV joint + boot, solid shaft,
#    bell-type outer CV joint + boot, splined stub through the wheel bearing, hub flange and axle nut.
#    Local origin on the axle axis at the output-flange face; spins about local Y (glTF Z).
# ==============================================================================================
HS_FACE = 0.165


def build_halfshaft(sg):
    pc = Piece("hs")
    sb, db, rb = pc.bm("steel"), pc.bm("steel_dark"), pc.bm("rubber")
    hub_face = HUB_Z + 0.0165       # hub flange face against the brake-disc hat (hat plate |Z| 0.756-0.767)

    def L(prof, mat, seg=40, closed=True):
        q = [(r, sg * (y - HS_FACE)) for r, y in prof]
        if closed:
            add_lathe_closed(pc.bm(mat), q, seg, MPY)
        else:
            add_lathe(pc.bm(mat), q, seg, MPY)
    # output flange (plugs into the side gear) + 6 bosses
    L([(0.0, 0.040), (0.0105, 0.040), (0.0105, 0.124), (0.029, 0.124), (0.031, 0.128), (0.031, 0.150), (0.052, 0.152),
       (0.054, 0.155), (0.054, 0.165), (0.0, 0.165)], "steel_dark", 34, closed=False)
    for j in range(6):
        a = 2 * math.pi * j / 6
        add_cyl(db, 0.0078, 0.010, T(0.043 * math.cos(a), sg * (0.150 - HS_FACE), 0.043 * math.sin(a)) @ Rx(-math.pi / 2),
                seg=12, z0=-0.005)
    # inner CV joint (disc type) with 6 bolts
    L([(0.0, 0.165), (0.047, 0.165), (0.050, 0.168), (0.050, 0.196), (0.046, 0.199), (0.0, 0.199)], "steel", 34, closed=False)
    for j in range(6):
        a = 2 * math.pi * j / 6
        add_hex(sb, 0.0082, 0.007, T(0.043 * math.cos(a), sg * (0.199 - HS_FACE), 0.043 * math.sin(a)) @ Rx(-sg * math.pi / 2),
                z0=0.0)
    # inner boot
    bp = [(0.0, 0.198)] + boot_profile(0.198, 0.262, 0.034, 0.0205, 3, 0.0035) + [(0.0, 0.262)]
    L(bp, "rubber", 28, closed=False)
    # solid shaft
    L([(0.0, 0.255), (0.017, 0.255), (0.017, 0.565), (0.0, 0.565)], "steel_dark", 24, closed=False)   # ETK D = 34 mm
    # outer boot + outer CV (bell)
    bp = [(0.0, 0.555)] + boot_profile(0.555, 0.611, 0.0205, 0.038, 3, 0.0035) + [(0.0, 0.611)]
    L(bp, "rubber", 28, closed=False)
    L([(0.0, 0.606), (0.040, 0.606), (0.044, 0.615), (0.045, 0.630), (0.041, 0.644), (0.031, 0.652), (0.021, 0.656),
       (0.0, 0.656)], "steel", 34, closed=False)
    # splined stub into the wheel hub; hub sleeve + flange behind the brake-disc hat (wheels.glb models the hub
    # core as a 44 mm-radius cylinder from |Z| 0.682 to 0.774, so the flange is an annulus around it)
    L([(0.0, 0.655), (0.0135, 0.655), (0.0135, 0.700), (0.0, 0.700)], "steel", 20, closed=False)
    L([(0.0445, 0.690), (0.0505, 0.690), (0.0505, hub_face - 0.0140), (0.066, hub_face - 0.0135),
       (0.068, hub_face - 0.0115), (0.068, hub_face), (0.0445, hub_face)], "steel_dark", 34)
    return pc.objects()


# ==============================================================================================
# 6. Exhaust (ETK E46 330Ci EU: front silencer 18 10 7 504 168, centre silencer 18 10 7 506 018 (automatic),
#    rear silencer 18 10 7 504 172 with twin tail pipes on the left). Two pipes all the way (50 mm clamps).
#    Built directly in car coordinates (helper C) - node origin at the world origin.
# ==============================================================================================
PIPE_R = 0.0255
FS_X0, FS_X1, FS_ZC = 0.215, -0.285, 0.070           # front silencer (ribbed, under the gearbox tail / front seats)
CS_X0, CS_X1, CS_ZC = -0.415, -0.715, 0.0            # centre silencer
RS_X0, RS_X1, RS_Z0, RS_Z1 = -1.712, -2.118, -0.590, -0.215   # rear silencer (behind the axle, left)
RS_Y0, RS_Y1 = 0.240, 0.412


def exhaust_paths():
    o_a, o_b = REF["EXH_OUT"]                  # a: cylinders 1-3 (Z 0.205), b: cylinders 4-6 (Z 0.275)
    tips = sorted(REF["TIPS"], key=lambda t: -t["z"])          # inner tip first (Z -0.488), outer (-0.564)
    paths = []
    for i, (o, dz) in enumerate(((o_a, -0.035), (o_b, 0.035))):
        Zs = -o.y                               # car Z of the outlet
        ty = tips[i] if len(tips) == 2 else dict(front_x=-2.14, y=0.278, z=-0.488 - 0.076 * i, r=0.03)
        zr = (-0.342, -0.270)[i]                # over the left half-shaft / into the rear silencer
        pts = [(o.x - 0.004, o.z, Zs), (0.80, 0.180, Zs - 0.008), (0.62, 0.188, Zs - 0.020), (0.43, 0.192, Zs - 0.025),
               (0.33, 0.205, FS_ZC + dz + 0.06), (FS_X0 + 0.02, 0.215, FS_ZC + dz)]
        front = [C(*p) for p in pts]
        mid = [C(FS_X1 - 0.02, 0.215, FS_ZC + dz), C(-0.335, 0.215, FS_ZC + dz - 0.03), C(CS_X0 + 0.02, 0.215, CS_ZC + dz)]
        rear = [C(CS_X1 - 0.02, 0.215, CS_ZC + dz), C(-0.83, 0.208, CS_ZC + dz - 0.030), C(-0.96, 0.205, dz - 0.085),
                C(-1.08, 0.212, dz - 0.100), C(-1.165, 0.262, zr + 0.060), C(-1.255, 0.352, zr), C(-1.36, 0.412, zr),
                C(-1.47, 0.398, zr), C(-1.57, 0.352, zr), C(RS_X0 + 0.025, 0.330, zr)]
        tail = [C(RS_X1 + 0.02, ty["y"], ty["z"]), C(ty["front_x"] - 0.016, ty["y"], ty["z"])]
        paths.append((front, mid, rear, tail, ty))
    return paths


def silencer_profile(w, h, r):
    return [(v, u) for (u, v) in rrect_prof(w, h, r, 4)]


def build_exhaust():
    pc = Piece("exhaust")
    db, sb, rb = pc.bm("steel_dark"), pc.bm("steel"), pc.bm("rubber")
    prof = circle_prof(PIPE_R, 14)
    for front, mid, rear, tail, ty in exhaust_paths():
        for seg in (front, mid, rear):
            add_sweep(db, resample(catmull(seg, 10), 0.025), prof, up=(0, 0, 1))
        add_sweep(sb, resample(tail, 0.02), circle_prof(min(PIPE_R, ty["r"] - 0.005), 14), up=(0, 0, 1))
        # mating flange at the manifold outlet + 2 nuts
        o = front[0]
        add_cyl(db, 0.042, 0.008, Matrix.Translation(o + Vector((0.0, 0, 0))) @ Ry(math.pi / 2), seg=24, z0=-0.004, bevel=0.0015)
        for dz in (-0.030, 0.030):
            add_hex(sb, 0.008, 0.007, T(o.x - 0.004, o.y, o.z + dz) @ Ry(-math.pi / 2), z0=0.0)
        # clamps (50 mm, ETK) at the joints front/centre and centre/rear
        for p0, p1 in ((mid[0], mid[1]), (rear[1], rear[2])):
            d = (p1 - p0).normalized()
            add_tube(sb, PIPE_R + 0.004, PIPE_R - 0.001, 0.030, Matrix.Translation(p0.lerp(p1, 0.5)) @ align_z(d), seg=16)
    # front silencer: flat oval box with transverse pressed ribs
    L = FS_X0 - FS_X1
    path = [C(FS_X0 - L * t, 0.2205, FS_ZC) for t in np.linspace(0, 1, 9)]
    sc = [(0.82, 0.86), (0.97, 0.98), 1, 1, 1, 1, 1, (0.97, 0.98), (0.84, 0.88)]
    add_sweep(sb, path, silencer_profile(0.250, 0.104, 0.040), up=(0, 0, 1), scales=sc)
    for t in np.linspace(0.14, 0.86, 6):
        x = FS_X0 - L * t
        add_box(sb, 0.016, 0.200, 0.006, Matrix.Translation(C(x, 0.2205 + 0.052, FS_ZC)), bevel=0.0025)
    # centre silencer (automatic version)
    L = CS_X0 - CS_X1
    path = [C(CS_X0 - L * t, 0.2195, CS_ZC) for t in np.linspace(0, 1, 7)]
    sc = [(0.80, 0.85), (0.97, 0.98), 1, 1, 1, (0.97, 0.98), (0.80, 0.85)]
    add_sweep(sb, path, silencer_profile(0.200, 0.096, 0.040), up=(0, 0, 1), scales=sc)
    add_box(sb, 0.014, 0.160, 0.005, Matrix.Translation(C((CS_X0 + CS_X1) / 2, 0.2195 + 0.048, CS_ZC)), bevel=0.002)
    # rear silencer: big box behind the axle on the left, pressed ribs, twin outlets to the tips
    L = RS_X0 - RS_X1
    zc, yc = (RS_Z0 + RS_Z1) / 2, (RS_Y0 + RS_Y1) / 2
    path = [C(RS_X0 - L * t, yc, zc) for t in np.linspace(0, 1, 9)]
    sc = [(0.86, 0.90), (0.98, 0.985), 1, 1, 1, 1, 1, (0.98, 0.985), (0.88, 0.92)]
    add_sweep(sb, path, silencer_profile(RS_Z1 - RS_Z0, RS_Y1 - RS_Y0, 0.060), up=(0, 0, 1), scales=sc)
    for t in (0.22, 0.45, 0.68):
        add_box(sb, 0.020, 0.008, (RS_Z1 - RS_Z0) * 0.80,
                Matrix.Translation(C(RS_X0 - L * t, RS_Y1 + 0.001, zc)) @ Rx(math.pi / 2), bevel=0.003)
    # rubber hangers with brackets (front silencer rear, rear silencer front and rear)
    for p in (C(FS_X1 + 0.03, 0.275, FS_ZC), C(RS_X0 - 0.05, RS_Y1, RS_Z1 + 0.05), C(RS_X1 + 0.06, RS_Y1, RS_Z0 + 0.08)):
        add_box(sb, 0.030, 0.006, 0.012, T(p.x, p.y, p.z + 0.004), bevel=0.0015)
        add_cyl(rb, 0.016, 0.034, T(p.x, p.y, p.z + 0.010), seg=16, z0=0.0, bevel=0.004)
        add_cyl(sb, 0.004, 0.030, T(p.x, p.y, p.z + 0.044), seg=8, z0=0.0)
    return pc.objects()


# ==============================================================================================
# 7. Fuel tank: plastic saddle tank under the rear seat (63 l), two pods joined over the tunnel, pump/sender
#    flanges on top, two steel straps, filler neck to the flap on the right rear (ETK 16 11 6 766 940)
# ==============================================================================================
TK_X0, TK_X1 = -0.615, -1.095


def build_tank():
    pc = Piece("tank")
    kb, sb, db = pc.bm("plastic_black"), pc.bm("steel"), pc.bm("steel_dark")
    L = TK_X0 - TK_X1
    for sg in (1, -1):
        zc = sg * 0.365
        path = [C(TK_X0 - L * t, 0.290, zc) for t in np.linspace(0, 1, 9)]
        sc = [(0.80, 0.86), (0.96, 0.98), 1, 1, 1, 1, 1, (0.96, 0.98), (0.82, 0.88)]
        add_sweep(kb, path, silencer_profile(0.300, 0.228, 0.060), up=(0, 0, 1), scales=sc)
        # service flange (pump right, level sender left) on top
        p = C(-0.86, 0.404, sg * 0.36)
        add_cyl(kb, 0.066, 0.012, T(p.x, p.y, p.z), seg=36, z0=0.0, bevel=0.003)
        add_tube(sb, 0.070, 0.060, 0.010, T(p.x, p.y, p.z + 0.006), seg=36)
        add_cyl(kb, 0.050, 0.020, T(p.x, p.y, p.z), seg=28, z0=0.0, bevel=0.004)
        # tension strap under the pod, front to back
        st = [C(TK_X0 + 0.01, 0.40, sg * 0.30), C(TK_X0 + 0.005, 0.24, sg * 0.30), C(TK_X0 - 0.06, 0.172, sg * 0.30),
              C(TK_X1 + 0.06, 0.172, sg * 0.30), C(TK_X1 - 0.005, 0.24, sg * 0.30), C(TK_X1 - 0.01, 0.40, sg * 0.30)]
        add_sweep(sb, resample(fillet_path(st, 0.04, 5), 0.02), [(0.0015, -0.0125), (0.0015, 0.0125), (-0.0015, 0.0125),
                                                                  (-0.0015, -0.0125)], up=(0, 0, 1))
    # bridge over the tunnel (propshaft + exhaust run underneath)
    path = [C(-0.665 - 0.38 * t, 0.408, 0.0) for t in np.linspace(0, 1, 5)]
    add_sweep(kb, path, silencer_profile(0.520, 0.075, 0.025), up=(0, 0, 1), scales=[(0.9, 0.9), 1, 1, 1, (0.9, 0.9)])
    # filler neck to the flap (right rear quarter, above the wheel) + vent line
    neck = [C(-1.02, 0.40, 0.44), C(-1.06, 0.50, 0.50), C(-1.18, 0.64, 0.58), C(-1.36, 0.74, 0.66), C(-1.50, 0.79, 0.72),
            C(-1.58, 0.805, 0.765)]
    add_sweep(kb, resample(catmull(neck, 8), 0.025), circle_prof(0.030, 16), up=(0, 0, 1))
    add_cyl(kb, 0.040, 0.020, Matrix.Translation(neck[-1]) @ align_z(neck[-1] - neck[-2]), seg=24, z0=-0.004, bevel=0.003)
    vent = [C(-1.00, 0.405, 0.40), C(-1.10, 0.52, 0.47), C(-1.30, 0.70, 0.60), C(-1.50, 0.78, 0.69)]
    add_sweep(kb, resample(catmull(vent, 8), 0.03), circle_prof(0.007, 8), up=(0, 0, 1))
    return pc.objects()


# ==============================================================================================
# 8. Chassis: front axle carrier, rear axle carrier (E46 'Z-axle' subframe), simplified struts / springs / arms
# ==============================================================================================
def box_sweep(bm, pts, w, h, r=0.006, up=(0, 0, 1), fil=0.05):
    path = resample(fillet_path([Vector(p) for p in pts], fil, 5), 0.02)
    add_sweep(bm, path, rrect_prof(w, h, r, 2), up=up)


def bushing(pc, p, axis, ro, length, ri=0.012):
    M = Matrix.Translation(p) @ align_z(axis)
    add_tube(pc.bm("steel_dark"), ro, ro - 0.004, length, M, seg=18)
    add_tube(pc.bm("rubber"), ro - 0.004, ri, length * 0.92, M, seg=18)
    add_tube(pc.bm("steel"), ri, ri * 0.6, length * 1.05, M, seg=12)


def coil_spring(bm, p0, p1, r_coil, wire, turns, barrel=0.0, n_per=14):
    p0, p1 = Vector(p0), Vector(p1)
    ax = (p1 - p0)
    Lh = ax.length
    M = Matrix.Translation(p0) @ align_z(ax)
    pts = []
    N = int(turns * n_per)
    for i in range(N + 1):
        t = i / N
        a = 2 * math.pi * turns * t
        # closed (flat) end coils
        z = Lh * (0.5 - 0.5 * math.cos(math.pi * t)) if False else Lh * t
        e = min(t, 1 - t)
        if e < 0.5 / turns:
            z = Lh * (0.0 if t < 0.5 else 1.0) + (1 if t < 0.5 else -1) * wire * 1.1 + (z - Lh * (0.0 if t < 0.5 else 1.0)) * 0.35
        rr = r_coil * (1 + barrel * math.sin(math.pi * t))
        pts.append(M @ Vector((rr * math.cos(a), rr * math.sin(a), z)))
    add_sweep(bm, pts, circle_prof(wire, 7), up=tuple(ax.normalized().orthogonal()))


def build_subframe_front():
    pc = Piece("sf_front")
    db = pc.bm("steel_dark")
    X = 1.385
    # crossmember: flat under the oil pan's shallow front section, rising at the ends to the body rails
    pts = [C(X, 0.300, -0.505), C(X, 0.262, -0.445), C(X, 0.2195, -0.360), C(X, 0.2195, 0.360), C(X, 0.262, 0.445),
           C(X, 0.300, 0.505)]
    box_sweep(db, pts, 0.035, 0.130, 0.009, up=(0, 0, 1), fil=0.06)
    for sg in (1, -1):
        p = C(X, 0.322, sg * 0.505)
        add_box(db, 0.110, 0.070, 0.008, T(p.x, p.y, p.z), bevel=0.002)
        for dx in (-0.035, 0.035):
            add_hex(pc.bm("steel"), 0.010, 0.008, T(p.x + dx, p.y, p.z + 0.004), z0=0.0)
        # wishbone front pivot brackets
        q = C(X + 0.02, 0.222, sg * 0.405)
        add_box(db, 0.050, 0.010, 0.040, T(q.x, q.y + 0.022, q.z), bevel=0.002)
        add_box(db, 0.050, 0.010, 0.040, T(q.x, q.y - 0.022, q.z), bevel=0.002)
    return pc.objects()


def build_subframe_rear():
    """Tubular rear axle carrier (13.8 kg, four rubber body mounts). The diff hangs on three rubber mounts: two at
    the front (bushes in the carrier beside the pinion flange, fore-aft M12 bolts into the diff lugs) and one at the
    rear (hydro bush in the cover eye, fore-aft M14 bolt through a U-bracket on the rear tube)."""
    pc = Piece("sf_rear")
    db, sb, rb = pc.bm("steel_dark"), pc.bm("steel"), pc.bm("rubber")
    ax, ay = AXLE_X, AXLE_Y
    cx = ax + 0.170                          # front cross tube, arched over the diff nose
    pts = [C(cx + 0.040, 0.412, -0.480), C(cx, 0.446, -0.385), C(cx, 0.450, -0.130), C(cx, 0.450, 0.130),
           C(cx, 0.446, 0.385), C(cx + 0.040, 0.412, 0.480)]
    add_sweep(db, resample(catmull(pts, 8), 0.02), circle_prof(0.030, 16), up=(0, 0, 1))
    # front diff mounts: rubber bushes (axis fore-aft) beside the pinion flange, hung from the tube by two plates
    for sg in (1, -1):
        hc = C(ax + 0.186, ay + LUG_Z, sg * LUG_Y)
        M = Matrix.Translation(hc) @ Ry(math.pi / 2)
        add_tube(db, 0.031, 0.025, 0.036, M, seg=24, bevel=0.002)
        add_tube(rb, 0.025, 0.009, 0.034, M, seg=24)
        add_hex(sb, 0.0105, 0.009, T(hc.x + 0.018, hc.y, hc.z) @ Ry(math.pi / 2), z0=0.0)
        add_cyl(sb, 0.006, 0.062, T(hc.x - 0.012, hc.y, hc.z) @ Ry(math.pi / 2), seg=10)
        leg = [C(ax + 0.186, ay + LUG_Z + 0.018, sg * (LUG_Y + 0.020)), C(ax + 0.180, 0.380, sg * 0.130),
               C(cx, 0.440, sg * 0.150)]
        add_sweep(db, resample(leg, 0.02), rrect_prof(0.010, 0.040, 0.003, 2), up=(1, 0, 0))
    # rear cross tube arched behind the diff + U-bracket holding the cover eye's fore-aft M14 bolt
    pts = [C(ax - 0.255, 0.405, -0.430), C(ax - 0.190, 0.470, -0.330), C(ax - 0.160, 0.533, -0.120),
           C(ax - 0.160, 0.533, 0.120), C(ax - 0.190, 0.470, 0.330), C(ax - 0.255, 0.405, 0.430)]
    add_sweep(db, resample(catmull(pts, 8), 0.02), circle_prof(0.028, 16), up=(0, 0, 1))
    add_box(db, 0.120, 0.070, 0.006, Matrix.Translation(C(ax - 0.102, ay + 0.215, 0.0)), bevel=0.0015)
    for xp in (-0.050, -0.108):
        add_prism(db, [(-0.034, 0.140), (0.034, 0.140), (0.034, 0.218), (-0.034, 0.218)], 0.006,
                  T(ax + xp - 0.003, 0, ay) @ Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1))),
                  z0=0.0, bevel=0.0015)
    # side members joining front and rear mounts (outboard of the diff, inboard of the springs)
    for sg in (1, -1):
        pts = [C(cx + 0.040, 0.405, sg * 0.470), C(ax - 0.05, 0.395, sg * 0.450), C(ax - 0.255, 0.405, sg * 0.430)]
        box_sweep(db, pts, 0.045, 0.042, 0.010, fil=0.08)
        # four body-mount bushings (vertical)
        bushing(pc, C(cx + 0.040, 0.415, sg * 0.490), (0, 0, 1), 0.040, 0.075)
        bushing(pc, C(ax - 0.262, 0.415, sg * 0.440), (0, 0, 1), 0.036, 0.070)
        # control-arm pick-up brackets
        add_box(db, 0.050, 0.030, 0.060, Matrix.Translation(C(ax + 0.02, 0.378, sg * 0.425)), bevel=0.003)
        add_box(db, 0.050, 0.030, 0.060, Matrix.Translation(C(ax - 0.120, 0.330, sg * 0.425)), bevel=0.003)
    return pc.objects()


def build_susp_rear():
    pc = Piece("susp_r")
    db, sb, rb, ab = pc.bm("steel_dark"), pc.bm("steel"), pc.bm("rubber"), pc.bm("alu_cast")
    ax, ay = AXLE_X, AXLE_Y
    for sg in (1, -1):
        Z = lambda z: sg * z
        # wheel carrier (bearing housing around the hub) - the E46 trailing arm ends in it
        pcen = C(ax, ay, Z(0.676))
        add_tube(ab, 0.066, 0.0515, 0.048, Matrix.Translation(pcen) @ Rx(math.pi / 2), seg=24, bevel=0.003)
        # trailing arm: from the body bracket ahead of the axle to the carrier
        ta = [C(-0.925, 0.300, Z(0.555)), C(-1.04, 0.302, Z(0.580)), C(-1.125, 0.306, Z(0.596)), C(-1.18, 0.308, Z(0.630)),
              C(ax + 0.055, 0.312, Z(0.668))]
        add_sweep(ab, resample(catmull(ta, 8), 0.025), rrect_prof(0.050, 0.034, 0.010, 2), up=(0, 0, 1))
        bushing(pc, C(-0.925, 0.300, Z(0.555)), C(0, 0, 1) - C(0, 0, 0) if False else Vector((0, 1, 0)), 0.034, 0.060)
        add_box(db, 0.080, 0.070, 0.006, Matrix.Translation(C(-0.925, 0.345, Z(0.555))), bevel=0.002)
        # lower control arm with the spring seat (spring sits inboard of the wheel, behind the axle)
        la = [C(ax - 0.120, 0.300, Z(0.425)), C(ax - 0.078, 0.245, Z(0.537)), C(ax - 0.020, 0.228, Z(0.640))]
        add_sweep(db, resample(catmull(la, 8), 0.02), rrect_prof(0.060, 0.020, 0.008, 2), up=(0, 0, 1))
        seat = C(ax - 0.080, 0.258, Z(0.537))
        add_cyl(db, 0.058, 0.010, Matrix.Translation(seat), seg=24, z0=-0.010, bevel=0.002)
        coil_spring(sb, seat + Vector((0, 0, 0.004)), C(ax - 0.080, 0.470, Z(0.537)), 0.046, 0.0065, 5.2, barrel=0.12)
        add_cyl(rb, 0.056, 0.010, Matrix.Translation(C(ax - 0.080, 0.470, Z(0.537))), seg=20, z0=0.0, bevel=0.003)
        # upper control arm (link above the half-shaft)
        ua = [C(ax + 0.020, 0.395, Z(0.430)), C(ax + 0.010, 0.420, Z(0.630))]
        add_sweep(db, resample(ua, 0.02), circle_prof(0.012, 10), up=(0, 0, 1))
        add_box(ab, 0.040, 0.030, 0.060, Matrix.Translation(C(ax + 0.010, 0.405, Z(0.640))), bevel=0.004)
        add_box(ab, 0.040, 0.030, 0.060, Matrix.Translation(C(ax - 0.010, 0.238, Z(0.645))), bevel=0.004)
        # shock absorber (behind the axle, inboard of the tyre)
        s0, s1 = C(ax - 0.168, 0.232, Z(0.582)), C(ax - 0.190, 0.600, Z(0.552))
        d = (s1 - s0).normalized()
        M = Matrix.Translation(s0) @ align_z(d)
        Ls = (s1 - s0).length
        add_cyl(db, 0.021, 0.250, M, seg=14, z0=0.0, bevel=0.002)
        add_cyl(sb, 0.0085, Ls - 0.24, M, seg=12, z0=0.24)
        add_cyl(rb, 0.026, 0.120, M, seg=14, z0=0.215, bevel=0.004)
        add_tube(sb, 0.016, 0.008, 0.026, M @ Rx(math.pi / 2), seg=16)
        add_cyl(rb, 0.032, 0.022, Matrix.Translation(s1) @ align_z(d), seg=14, z0=-0.011, bevel=0.004)
        add_box(db, 0.040, 0.030, 0.050, Matrix.Translation(C(ax - 0.150, 0.240, Z(0.600))), bevel=0.004)
    return pc.objects()


def build_susp_front():
    pc = Piece("susp_f")
    db, sb, rb, ab = pc.bm("steel_dark"), pc.bm("steel"), pc.bm("rubber"), pc.bm("alu_cast")
    fx = REF["wheel_FL"][0] if "wheel_FL" in REF else 1.3625
    fy = 0.318
    for sg in (1, -1):
        Z = lambda z: sg * z
        # McPherson strut: tube clamped in the knuckle, piston rod to the top mount; spring between the seats
        b0, b1 = C(fx + 0.012, 0.372, Z(0.574)), C(fx - 0.022, 0.805, Z(0.512))
        d = (b1 - b0).normalized()
        M = Matrix.Translation(b0) @ align_z(d)
        Ls = (b1 - b0).length
        add_cyl(db, 0.026, 0.250, M, seg=18, z0=0.0, bevel=0.002)
        add_cyl(sb, 0.0105, Ls - 0.24, M, seg=12, z0=0.24)
        add_cyl(db, 0.064, 0.008, M, seg=24, z0=0.215, bevel=0.002)          # lower spring seat
        add_cyl(rb, 0.026, 0.150, M, seg=14, z0=0.250, bevel=0.004)          # dust boot / bump stop
        add_cyl(db, 0.066, 0.010, M, seg=24, z0=Ls - 0.062, bevel=0.002)      # upper seat
        add_cyl(rb, 0.058, 0.030, M, seg=24, z0=Ls - 0.052, bevel=0.006)      # top mount
        add_cyl(sb, 0.016, 0.012, M, seg=6, z0=Ls - 0.022)
        coil_spring(sb, b0 + d * 0.224, b0 + d * (Ls - 0.063), 0.052, 0.0062, 5.0)
        add_box(db, 0.040, 0.050, 0.012, M @ T(0.0, 0.032, 0.150), bevel=0.002)       # brake hose bracket
        # knuckle: clamp around the strut foot down to the hub bearing ring and the lower ball joint
        add_tube(ab, 0.034, 0.026, 0.060, Matrix.Translation(b0 + d * 0.030) @ align_z(d), seg=18)
        hub = C(fx, fy, Z(0.655))
        add_tube(ab, 0.062, 0.046, 0.040, Matrix.Translation(hub) @ Rx(math.pi / 2), seg=24, bevel=0.003)
        k1 = [C(fx + 0.006, 0.372, Z(0.585)), C(fx + 0.004, 0.360, Z(0.640))]
        add_sweep(ab, resample(k1, 0.02), rrect_prof(0.040, 0.030, 0.008, 2), up=(1, 0, 0))
        k2 = [C(fx, 0.262, Z(0.650)), C(fx + 0.004, 0.220, Z(0.640))]
        add_sweep(ab, resample(k2, 0.02), rrect_prof(0.044, 0.030, 0.008, 2), up=(1, 0, 0))
        add_sweep(ab, [C(fx - 0.03, 0.330, Z(0.615)), C(fx - 0.125, 0.330, Z(0.585))], rrect_prof(0.026, 0.020, 0.006, 2),
                  up=(0, 0, 1))                                                # steering arm (tie rod behind)
        # lower control arm (wishbone): ball joint -> front pivot on the axle carrier + rear (thrust) bushing
        bj = C(fx + 0.004, 0.216, Z(0.630))
        add_cyl(sb, 0.020, 0.020, Matrix.Translation(bj), seg=14, z0=-0.010, bevel=0.003)
        arm = [C(fx + 0.025, 0.222, Z(0.405)), bj, C(fx - 0.300, 0.228, Z(0.435))]
        add_sweep(db, resample(catmull(arm, 10), 0.02), rrect_prof(0.022, 0.034, 0.007, 2), up=(0, 0, 1))
        bushing(pc, C(fx + 0.025, 0.222, Z(0.405)), (1, 0, 0), 0.020, 0.040, 0.008)
        bushing(pc, C(fx - 0.300, 0.228, Z(0.435)), (0, 0, 1), 0.034, 0.036, 0.010)
        add_box(db, 0.060, 0.010, 0.050, Matrix.Translation(C(fx - 0.300, 0.252, Z(0.435))), bevel=0.002)
    return pc.objects()


# ==============================================================================================
# 9. Assembly
# ==============================================================================================
GROUPS = ["gearbox", "propshaft", "diff", "halfshafts", "exhaust", "tank", "chassis"]
NODE_INFO = {}


def place(name, obs, M, parent=None, extras=None, smooth=34):
    ob = make_node(name, obs, M, parent=parent, smooth_angle=smooth)
    for k, v in (extras or {}).items():
        ob[k] = v
    NODE_INFO[name] = extras or {}
    return ob


def place_empty(name, M, parent=None, extras=None):
    ob = empty_node(name, M, parent=parent)
    for k, v in (extras or {}).items():
        ob[k] = v
    NODE_INFO[name] = extras or {}
    return ob


def assemble_gearbox(nodes):
    global RF
    RF = flange_outline()
    G = M_G
    nodes["bell_housing"] = place("bell_housing", build_bell(), G, extras={
        "description": "ZF 5HP19 (BMW A5S 325Z) converter bell, cast aluminium; face mates the M54 block's rear face",
        "origin": "crank/input axis on the bell face (= engine_block origin); local +X forward"})
    nodes["gearbox_case"] = place("gearbox_case", build_case(), G, extras={
        "description": "5HP19 main case + tail housing with ribs, EGS connector, selector shaft + lever, ATF cooler fittings",
        "origin": "crank/input axis on the bell face; local +X forward"})
    pan_obs, pan_M = build_pan()
    nodes["gearbox_pan"] = place("gearbox_pan", pan_obs, G @ pan_M, extras={
        "description": "ribbed steel oil pan, 22 bolts, drain plug (bottom) and filler plug (left side)",
        "origin": "centre of the pan gasket face; drop along local -Y (glTF) to remove"})
    tc = build_converter()
    root = place_empty("torque_converter", G @ T(TC_X, 0, 0), extras={
        "description": "ZF W254 torque converter (254 mm) with two-lining lock-up clutch",
        "rotation": "all children spin about local +X (glTF +X); engine turns clockwise seen from the front = "
                    "negative rotation about +X",
        "children": "torque_converter_shell (cover+impeller shell), impeller, turbine, stator, lockup_clutch"})
    nodes["torque_converter"] = root
    for nm, obs in tc.items():
        place(nm, obs, G @ T(TC_X, 0, 0), parent=root, smooth=40)
    ps = build_planetary()
    proot = place_empty("planetary_sets", G @ T(-0.35, 0, 0), extras={
        "description": "5HP19 gear train: Ravigneaux set (large+small sun, 3 long + 3 short planets, ring) and the "
                       "single tail planetary set (sun, 4 planets, ring), clutch packs A-G, input shaft",
        "rotation": "every gear node spins about its own local +X; planets are children of their carrier"})
    nodes["planetary_sets"] = proot
    rav = place_empty("ravigneaux_set", G @ T(RAV_X, 0, 0), parent=proot)
    tail = place_empty("tail_planetary_set", G @ T(TAIL_X, 0, 0), parent=proot)
    for nm in ("rav_ring", "rav_sun_large", "rav_sun_small", "rav_carrier"):
        obs, M = ps[nm]
        place(nm, obs, G @ M, parent=rav, smooth=20)
    for nm in ("tail_ring", "tail_sun", "tail_carrier"):
        obs, M = ps[nm]
        place(nm, obs, G @ M, parent=tail, smooth=20)
    rc = bpy.data.objects["rav_carrier"]
    tcar = bpy.data.objects["tail_carrier"]
    for nm, (obs, M) in ps.items():
        if nm.startswith("rav_planet"):
            place(nm, obs, G @ M, parent=rc, smooth=20)
        elif nm.startswith("tail_planet"):
            place(nm, obs, G @ M, parent=tcar, smooth=20)
    for nm in ("clutch_packs", "input_shaft"):
        obs, M = ps[nm]
        place(nm, obs, G @ M, parent=proot, smooth=20)
    nodes["output_shaft"] = place("output_shaft", build_output_shaft(), G @ T(OUT_FACE, 0, 0), extras={
        "description": "output shaft with the three-arm output flange (flex-disc side)",
        "origin": "on the axis at the output-flange face; spins about local +X"})
    nodes["gearbox_crossmember"] = place("gearbox_crossmember", build_gb_crossmember(), G, extras={
        "description": "gearbox support crossmember with two rubber mounts"})


def assemble_propshaft(nodes):
    nodes["propshaft"] = place("propshaft", build_propshaft(), M_P, extras={
        "description": "two-piece propshaft, automatic (ETK L = 1403 mm): flex disc (guibo), 76 mm front tube, centre "
                       "bearing, U-joint, 68 mm rear tube, CV joint bolted to the pinion flange",
        "origin": "on the shaft axis at the gearbox output-flange face; local +X points forward along the shaft "
                  "(%.1f deg nose-up); spin about local +X (clockwise seen from the front = negative)" %
                  (math.degrees(math.atan2((PA - PB).z, (PA - PB).x))),
        "length_m": round(PROP_L, 4)})
    nodes["propshaft_support"] = place("propshaft_support", build_prop_support(), M_P, extras={
        "description": "centre bearing (55/30 mm ball bearing in a rubber mount) and its bracket - does not spin"})


def assemble_diff(nodes):
    D = M_D
    nodes["diff_housing"] = place("diff_housing", build_diff_housing(), D, extras={
        "description": "BMW 188K final drive housing (188 mm ring gear), I = 3.38 (automatic): pinion nose with ribs, "
                       "output collars, two front mount lugs (fore-aft bolts), two automatic-only vibration absorbers",
        "origin": "ring-gear centre on the rear axle line (X -1.3625, Y 0.318)"})
    nodes["diff_cover"] = place("diff_cover", build_diff_cover(), D, extras={
        "description": "rear cover 'TYP 188K' with cast ribs and the rear mount eye on top (hydro bush, fore-aft "
                       "M14 x 133 bolt), fill + drain plug; no cooling fins on the stock 330Ci (FINNED_COVER switch)",
        "origin": "ring-gear centre"})
    nodes["ring_gear"] = place("ring_gear", build_ring_gear(), D, smooth=25, extras={
        "description": "hypoid crown wheel, 44 teeth (44/13 = 3.385), on the car's left of the pinion",
        "rotation": "spins about local Z (glTF) = the axle; driving forward = NEGATIVE rotation about +Z (glTF) "
                    "(clockwise seen from the car's right, like the wheels rolling forward); angle = pinion angle / 3.385",
        "teeth": RING_N})
    nodes["pinion"] = place("pinion", build_pinion(), D @ T(0.081, 0, PIN_DZ), smooth=25, extras={
        "description": "hypoid pinion, 13 spiral teeth, with taper bearings and the drive flange (propshaft CV joint)",
        "origin": "on the pinion axis (30 mm below the ring-gear centre) at the tooth centre; spins about local +X "
                  "together with the propshaft", "teeth": PIN_N})
    sp = build_spider()
    car = place("spider_gears", sp["carrier"], D, smooth=30, extras={
        "description": "open differential: carrier (case) with cross pin + ring-gear bolts; children: side_gear_left/right "
                       "(on the half-shafts), spider_gear_top/bottom (on the cross pin)",
        "rotation": "the carrier turns with ring_gear about local Z (glTF). Differential action: side gears turn "
                    "+/-d about local Z relative to the carrier, the spider gears turn about local Y (glTF, the "
                    "vertical cross pin) by d*14/10 in opposite senses"})
    nodes["spider_gears"] = car
    for nm in ("side_gear_left", "side_gear_right", "spider_gear_top", "spider_gear_bottom"):
        place(nm, sp[nm], D, parent=car, smooth=30)


def assemble_halfshafts(nodes):
    for sg, nm in ((1, "halfshaft_left"), (-1, "halfshaft_right")):
        nodes[nm] = place(nm, build_halfshaft(sg), M_D @ T(0, sg * HS_FACE, 0), smooth=40, extras={
            "description": "drive flange (LK 86 mm / M10), disc-type inner CV joint + boot, solid shaft, outer CV joint "
                           "+ boot, stub and hub flange behind the brake-disc hat",
            "origin": "on the axle axis at the diff output-flange face; spins about local Z (glTF)"})


def assemble_exhaust(nodes):
    nodes["exhaust_system"] = place("exhaust_system", build_exhaust(), Matrix.Identity(4), extras={
        "description": "twin-pipe exhaust from the manifold outlets: front silencer, centre silencer (automatic), over the "
                       "left half-shaft to the rear silencer and the twin tail pipes (details.glb tips, left rear)"})


def assemble_tank(nodes):
    nodes["fuel_tank"] = place("fuel_tank", build_tank(), Matrix.Identity(4), extras={
        "description": "plastic saddle tank (63 l) under the rear seat, ahead of the rear axle; pump + sender flanges, "
                       "straps, filler neck to the flap on the right rear"})


def assemble_chassis(nodes):
    nodes["subframe_front"] = place("subframe_front", build_subframe_front(), Matrix.Identity(4), extras={
        "description": "front axle carrier (crossmember under the oil pan's shallow front section)"})
    nodes["subframe_rear"] = place("subframe_rear", build_subframe_rear(), Matrix.Identity(4), extras={
        "description": "tubular rear axle carrier: front tube over the diff nose with the two front diff mounts, rear "
                       "tube with the U-bracket for the cover-eye mount, side members, four rubber body mounts"})
    nodes["suspension_front"] = place("suspension_front", build_susp_front(), Matrix.Identity(4), extras={
        "description": "simplified McPherson struts with coil springs, knuckles, lower control arms"})
    nodes["suspension_rear"] = place("suspension_rear", build_susp_rear(), Matrix.Identity(4), extras={
        "description": "simplified E46 'Z-axle': trailing arms with wheel carriers, lower arms with barrel springs, "
                       "upper links, dampers behind the axle"})


ASSEMBLERS = {"gearbox": assemble_gearbox, "propshaft": assemble_propshaft, "diff": assemble_diff,
              "halfshafts": assemble_halfshafts, "exhaust": assemble_exhaust, "tank": assemble_tank,
              "chassis": assemble_chassis}


def build_all(groups):
    reset_scene()
    nodes = {}
    for g in groups:
        if g in ASSEMBLERS:
            print("building", g)
            ASSEMBLERS[g](nodes)
    return nodes


def export(nodes):
    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
    for ob in list(bpy.data.objects):
        if ob.type in ("CAMERA", "LIGHT"):
            bpy.data.objects.remove(ob, do_unlink=True)
    bpy.ops.export_scene.gltf(filepath=OUT_GLB, export_format="GLB", export_apply=True, export_yup=True,
                              export_extras=True, export_cameras=False, export_lights=False,
                              export_materials="EXPORT", export_normals=True, export_texcoords=False)
    print("exported", OUT_GLB, os.path.getsize(OUT_GLB) // 1024, "KB")


def _top(ob):
    while ob.parent is not None:
        ob = ob.parent
    return ob.name


def report():
    per_top, per_node = {}, {}
    tot = 0
    for ob in bpy.data.objects:
        n = tri_count(ob)
        if not n:
            continue
        tot += n
        per_node[ob.name] = n
        per_top[_top(ob)] = per_top.get(_top(ob), 0) + n
    for k in sorted(per_top, key=lambda k: -per_top[k]):
        print(f"  {k:26s} {per_top[k]:7d}")
    print("  TOTAL triangles", tot)
    return per_top, per_node, tot


# ==============================================================================================
# 11. Previews
# ==============================================================================================
def _hide_all_but(names):
    hidden = []
    for ob in bpy.data.objects:
        if ob.type in ("MESH", "EMPTY") and _top(ob) not in names and not ob.hide_render:
            ob.hide_render = True
            hidden.append(ob)
    return hidden


def _hide(names):
    hidden = []
    for ob in bpy.data.objects:
        if ob.type in ("MESH", "EMPTY") and (ob.name in names or _top(ob) in names) and not ob.hide_render:
            ob.hide_render = True
            hidden.append(ob)
    return hidden


def _unhide(obs):
    for ob in obs:
        ob.hide_render = False


def import_others(names=("engine", "wheels", "details")):
    obs = []
    for n in names:
        p = os.path.join(MODELS, n + ".glb")
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=p)
        new = [o for o in bpy.data.objects if o not in before]
        for o in new:
            o["_ext"] = n
        obs += new
    return obs


GB_SET = ["bell_housing", "gearbox_case", "gearbox_pan", "torque_converter", "planetary_sets", "output_shaft",
          "gearbox_crossmember"]


def previews_gearbox(P):
    c = M_G @ Vector((-0.36, 0, -0.02))
    h = _hide_all_but(GB_SET)
    render(P("gearbox_left_rear34"), c + Vector((-0.95, 1.05, 0.55)), c, lens=50)
    render(P("gearbox_left_front34"), c + Vector((1.15, 0.95, 0.45)), c, lens=50)
    render(P("gearbox_right"), c + Vector((0.10, -1.45, 0.20)), c, lens=50)
    render(P("gearbox_below"), c + Vector((0.2, 0.3, -1.4)), c, lens=50)
    render(P("gearbox_front_face"), M_G @ Vector((1.0, 0.0, 0.0)), M_G @ Vector((0, 0, 0)), ortho=0.62)
    h2 = _hide(["bell_housing", "gearbox_case", "gearbox_pan", "gearbox_crossmember"])
    render(P("gearbox_internals"), c + Vector((-0.55, 0.75, 0.35)), c + Vector((0.1, 0, 0)), lens=50)
    h4 = _hide(["clutch_packs", "torque_converter", "input_shaft"])
    pc_ = M_G @ Vector((-0.40, 0, 0))
    render(P("planetary_sets"), pc_ + Vector((0.32, 0.36, 0.20)), pc_ + Vector((0.0, 0, 0)), lens=50)
    _unhide(h4)
    h3 = _hide(["torque_converter_shell", "lockup_clutch"])
    tcc = M_G @ Vector((TC_X, 0, 0))
    render(P("converter_open"), tcc + Vector((0.45, 0.35, 0.22)), tcc, lens=55)
    _unhide(h3)
    _unhide(h2)
    _unhide(h)


# ==============================================================================================
# 10. Clearance checks: interpenetration with engine / wheels / details, and vertices outside the body shell
# ==============================================================================================
def _bvh_of(obs):
    from mathutils.bvhtree import BVHTree
    verts, polys = [], []
    dg = bpy.context.evaluated_depsgraph_get()
    for ob in obs:
        if ob.type != "MESH":
            continue
        me = ob.evaluated_get(dg).to_mesh()
        mw = ob.matrix_world
        off = len(verts)
        verts += [mw @ v.co for v in me.vertices]
        polys += [tuple(off + i for i in p.vertices) for p in me.polygons]
        ob.evaluated_get(dg).to_mesh_clear()
    if not polys:
        return None, verts
    return BVHTree.FromPolygons(verts, polys, epsilon=0.0), verts


def check_clearance(my_tops, ext):
    """my_tops: names of my top-level nodes; ext: imported external objects (with ob['_ext'])."""
    from mathutils.bvhtree import BVHTree
    res = {}
    groups = {}
    for ob in ext:
        if ob.type == "MESH":
            groups.setdefault(ob["_ext"], []).append(ob)
    # body shell parity test (point inside the closed outer skin?)
    body_bvh = None
    if "body" in groups:
        body_bvh, _ = _bvh_of(groups["body"])
    ext_bvh = {}
    for g, obs in groups.items():
        if g == "body":
            continue
        # per external node (top-level name) for readable reports
        by = {}
        for ob in obs:
            by.setdefault(_top(ob), []).append(ob)
        for nm, o in by.items():
            b, _ = _bvh_of(o)
            if b:
                ext_bvh[f"{g}:{nm}"] = b
    for top in my_tops:
        obs = [o for o in bpy.data.objects if o.type == "MESH" and _top(o) == top]
        b, verts = _bvh_of(obs)
        if b is None:
            continue
        hits = {}
        tri_c = None
        for nm, eb in ext_bvh.items():
            pairs = b.overlap(eb)
            if pairs:
                if tri_c is None:
                    polys = []
                    dg = bpy.context.evaluated_depsgraph_get()
                    for ob in obs:
                        me = ob.evaluated_get(dg).to_mesh()
                        polys += [sum((ob.matrix_world @ me.vertices[i].co for i in pl.vertices), Vector()) / len(pl.vertices)
                                  for pl in me.polygons]
                        ob.evaluated_get(dg).to_mesh_clear()
                    tri_c = polys
                cs = [tri_c[i] for i, _ in pairs if i < len(tri_c)]
                lo = [round(min(c[k] for c in cs), 3) for k in range(3)]
                hi = [round(max(c[k] for c in cs), 3) for k in range(3)]
                hits[nm] = (len(pairs), "car X %.3f..%.3f Y %.3f..%.3f Z %.3f..%.3f" % (lo[0], hi[0], lo[2], hi[2], -hi[1], -lo[1]))
        out = 0
        below = 0
        outs = []
        if body_bvh is not None:
            up = Vector((0, 0, 1))
            for v in verts[::3]:
                n = 0
                o = v.copy()
                for _ in range(12):
                    loc, nor, idx, dist = body_bvh.ray_cast(o, up)
                    if loc is None:
                        break
                    n += 1
                    o = loc + up * 1e-5
                if n % 2 == 0:
                    out += 1
                    outs.append(v)
                    if v.z < 0.16:
                        below += 1
        box = ""
        if outs:
            box = "car X %.3f..%.3f Y %.3f..%.3f |Z| %.3f..%.3f" % (min(v.x for v in outs), max(v.x for v in outs),
                                                                   min(v.z for v in outs), max(v.z for v in outs),
                                                                   min(abs(v.y) for v in outs), max(abs(v.y) for v in outs))
        res[top] = {"overlaps": hits, "verts_outside_shell": out, "of_sampled": len(verts[::3]),
                    "outside_below_Y0.16": below, "outside_box": box}
        print(f"  {top:22s} outside shell {out:6d}/{len(verts[::3]):6d} (below floor {below:5d}) {box}")
        for k, v in hits.items():
            print(f"      overlap {k}: {v}")
    # pairs of my own parts that must not intersect (touching contacts excluded by design gaps)
    pairs = [("exhaust_system", t) for t in ("gearbox_case", "gearbox_pan", "gearbox_crossmember", "bell_housing",
                                               "propshaft", "propshaft_support", "fuel_tank", "subframe_rear",
                                               "subframe_front", "diff_housing", "diff_cover", "halfshaft_left",
                                               "suspension_rear", "suspension_front")]
    pairs += [("fuel_tank", t) for t in ("propshaft", "propshaft_support", "subframe_rear", "suspension_rear")]
    pairs += [("propshaft", t) for t in ("gearbox_crossmember", "subframe_rear", "diff_housing", "gearbox_case")]
    pairs += [("subframe_rear", t) for t in ("diff_housing", "halfshaft_left", "halfshaft_right", "suspension_rear")]
    pairs += [("suspension_rear", t) for t in ("halfshaft_left", "halfshaft_right")]
    pairs += [("gearbox_crossmember", "gearbox_pan"), ("gearbox_pan", "gearbox_case"), ("subframe_front", "suspension_front")]
    cache = {}
    cent = {}
    print("  internal pairs:")
    for a_, b_ in pairs:
        for nm in (a_, b_):
            if nm not in cache:
                cache[nm] = _bvh_of([o for o in bpy.data.objects if o.type == "MESH" and _top(o) == nm])[0]
        if cache[a_] is None or cache[b_] is None:
            continue
        ov = cache[a_].overlap(cache[b_])
        n = len(ov)
        if n:
            if a_ not in cent:
                dg = bpy.context.evaluated_depsgraph_get()
                cs = []
                for ob in [o for o in bpy.data.objects if o.type == "MESH" and _top(o) == a_]:
                    me = ob.evaluated_get(dg).to_mesh()
                    cs += [ob.matrix_world @ (sum((me.vertices[i].co for i in pl.vertices), Vector()) / len(pl.vertices))
                           for pl in me.polygons]
                    ob.evaluated_get(dg).to_mesh_clear()
                cent[a_] = cs
            pts = [cent[a_][i] for i, _ in ov]
            loc = "car X %.3f..%.3f Y %.3f..%.3f Z %.3f..%.3f" % (min(q.x for q in pts), max(q.x for q in pts),
                                                                  min(q.z for q in pts), max(q.z for q in pts),
                                                                  min(-q.y for q in pts), max(-q.y for q in pts))
            print(f"      {a_} x {b_}: {n}  {loc}")
            res.setdefault("_internal", {})[f"{a_} x {b_}"] = [n, loc]
    return res


# ==============================================================================================
# 11. Previews
# ==============================================================================================
def ghost_material():
    m = bpy.data.materials.new("ghost")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.35, 0.5, 0.85, 1)
    b.inputs["Alpha"].default_value = 0.12
    b.inputs["Roughness"].default_value = 0.3
    m.blend_method = "BLEND"
    return m


def previews(groups, ext):
    setup_studio(samples=16)
    os.makedirs(PREV_DIR, exist_ok=True)
    P = lambda n: os.path.join(PREV_DIR, f"drivetrain_{n}.png")
    want = lambda key: ("--prev" not in ARGS) or (key in ARGS[ARGS.index("--prev") + 1].split(","))
    ext_by = {}
    for o in ext:
        ext_by.setdefault(o.get("_ext"), []).append(o)
    for o in ext:                      # hide external models by default
        o.hide_render = True
    if "gearbox" in groups and want("gearbox"):
        previews_gearbox(P)
    if "diff" in groups and want("diff"):
        h = _hide_all_but(["diff_housing", "diff_cover", "ring_gear", "pinion", "spider_gears", "halfshaft_left",
                           "halfshaft_right"])
        c = M_D @ Vector((0.03, 0, 0.0))
        render(P("diff_rear_left34"), c + Vector((-0.70, 0.55, 0.40)), c, lens=50)
        render(P("diff_front_right34"), c + Vector((0.70, -0.55, 0.30)), c, lens=50)
        h2 = _hide(["diff_housing", "diff_cover", "halfshaft_left", "halfshaft_right"])
        render(P("diff_internals"), c + Vector((-0.30, -0.42, 0.30)), c + Vector((0.03, 0, -0.01)), lens=50)
        render(P("diff_internals_top"), c + Vector((0.05, 0.0, 0.55)), c + Vector((0.03, 0, 0)), lens=50)
        _unhide(h2)
        _unhide(h)
    if want("overview"):
        for o in ext_by.get("engine", []) + ext_by.get("wheels", []) + ext_by.get("details", []):
            o.hide_render = False
        c = Vector((-0.2, 0, 0.35))
        render(P("overview_rear_left_above"), c + Vector((-2.6, 2.4, 1.9)), c, lens=35)
        render(P("overview_below"), c + Vector((0.2, 0.6, -3.2)), c, lens=32)
        render(P("overview_side"), Vector((-0.2, 4.2, 0.45)), Vector((-0.2, 0, 0.42)), ortho=4.8)
        render(P("joint_engine_gearbox"), M_G @ Vector((-0.05, 0.75, 0.25)), M_G @ Vector((-0.08, 0, -0.03)), lens=50)
        render(P("rear_axle_below"), C(-1.45, 0.3, 0.0) + Vector((0.5, 0.4, -1.3)), C(-1.45, 0.3, 0.0), lens=40)
        for o in ext_by.get("body", []):
            o.hide_render = False
        render(P("in_body_side"), Vector((-0.1, 4.5, 0.6)), Vector((-0.1, 0, 0.6)), ortho=4.9)
        render(P("in_body_top"), Vector((-0.1, 0.0, 4.5)), Vector((-0.1, 0, 0.5)), ortho=4.9)
        render(P("in_body_rear"), Vector((-4.5, 0.0, 0.55)), Vector((0, 0, 0.55)), ortho=2.0)
        for o in ext:
            o.hide_render = True


if __name__ == "__main__":
    groups = GROUPS
    if "--only" in ARGS:
        groups = ARGS[ARGS.index("--only") + 1].split(",")
    nodes = build_all(groups)
    per_top, per_node, tot = report()
    export(nodes)
    my_tops = sorted({_top(o) for o in bpy.data.objects if o.type in ("MESH", "EMPTY")})
    ext = []
    chk = {}
    if "--no-check" not in ARGS or "--no-render" not in ARGS:
        ext = import_others(("engine", "wheels", "details", "body"))
        for o in ext:
            if o.type == "MESH" and o.get("_ext") == "body":
                gm = ghost_material()
                o.data.materials.clear()
                o.data.materials.append(gm)
    if "--no-check" not in ARGS:
        print("clearance check:")
        chk = check_clearance(my_tops, ext)
    with open(os.path.join(HERE, "drivetrain_tris.json"), "w") as f:
        json.dump({"per_top_node": per_top, "total": tot, "clearance": chk}, f, indent=1)
    if "--no-render" not in ARGS:
        previews(groups, ext)
