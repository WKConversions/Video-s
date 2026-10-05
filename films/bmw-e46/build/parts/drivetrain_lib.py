"""
Shared bmesh/bpy helpers for build/parts/drivetrain.py (adapted from build/parts/engine.py so that the
drivetrain build does not depend on the engine script). Blender frame: X = car forward, Y = car LEFT, Z = up.
"""
import bpy, bmesh, math
from mathutils import Vector, Matrix

D2R = math.pi / 180.0

MAT_DEF = {  # name: (base colour RGBA (linear), metallic, roughness) - same values as engine.glb where shared
    "alu_cast":      ((0.56, 0.56, 0.54, 1), 0.85, 0.52),
    "alu_machined":  ((0.80, 0.80, 0.80, 1), 1.00, 0.24),
    "steel":         ((0.52, 0.53, 0.55, 1), 1.00, 0.33),
    "steel_dark":    ((0.13, 0.13, 0.14, 1), 0.85, 0.48),
    "plastic_black": ((0.022, 0.022, 0.024, 1), 0.0, 0.42),
    "rubber":        ((0.015, 0.015, 0.015, 1), 0.0, 0.85),
    "copper":        ((0.80, 0.42, 0.25, 1), 1.00, 0.32),
}
MATS = {}


def T(x, y, z):
    return Matrix.Translation((x, y, z))


def Rx(a):
    return Matrix.Rotation(a, 4, "X")


def Ry(a):
    return Matrix.Rotation(a, 4, "Y")


def Rz(a):
    return Matrix.Rotation(a, 4, "Z")


def Sc(x, y, z):
    m = Matrix.Identity(4)
    m[0][0], m[1][1], m[2][2] = x, y, z
    return m


# lathe/prism local Z -> X (u, v, w) -> (w, u, v)
MP = Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1)))
# lathe local Z -> Y : (u, v, w) -> (v, w, u)
MPY = Matrix(((0, 1, 0, 0), (0, 0, 1, 0), (1, 0, 0, 0), (0, 0, 0, 1)))


def C(X, Y, Z):
    """Car coordinates (SPEC / glTF: X fwd, Y up, Z right) -> Blender vector."""
    return Vector((X, -Z, Y))


def align_z(v):
    v = Vector(v).normalized()
    z = Vector((0, 0, 1))
    if (v - z).length < 1e-9:
        return Matrix.Identity(4)
    if (v + z).length < 1e-9:
        return Rx(math.pi)
    ax = z.cross(v).normalized()
    ang = math.acos(max(-1, min(1, z.dot(v))))
    return Matrix.Rotation(ang, 4, ax)


def frame_axes(x_axis, z_hint, origin=(0, 0, 0)):
    x = Vector(x_axis).normalized()
    z = Vector(z_hint)
    z = (z - x * z.dot(x)).normalized()
    y = z.cross(x)
    m = Matrix.Identity(4)
    for i in range(3):
        m[i][0], m[i][1], m[i][2] = x[i], y[i], z[i]
        m[i][3] = origin[i]
    return m


def smax(a, b, k=0.004):
    m = max(a, b)
    return m + k * math.log(math.exp((a - m) / k) + math.exp((b - m) / k))


def smin(a, b, k=0.004):
    return -smax(-a, -b, k)


def lerp(a, b, t):
    return a + (b - a) * t


def ease(t):
    t = max(0.0, min(1.0, t))
    return 0.5 - 0.5 * math.cos(math.pi * t)


# ----------------------------------------------------------------------------------------------
# Scene / materials
# ----------------------------------------------------------------------------------------------
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    MATS.clear()
    make_materials()


def make_materials():
    for name, (col, met, rough) in MAT_DEF.items():
        m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
        m.use_fake_user = True
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = col
        b.inputs["Metallic"].default_value = met
        b.inputs["Roughness"].default_value = rough
        m.diffuse_color = col
        MATS[name] = m


# ----------------------------------------------------------------------------------------------
# bmesh builders (all add closed geometry to bm, transformed by M)
# ----------------------------------------------------------------------------------------------
def _tx(bm, verts, M):
    bmesh.ops.transform(bm, matrix=M, verts=verts)


def add_box(bm, sx, sy, sz, M=Matrix.Identity(4), bevel=0.0, seg=1, center=(0, 0, 0)):
    before = set(bm.verts) if bevel > 0 else None
    r = bmesh.ops.create_cube(bm, size=1.0)
    vs = r["verts"]
    bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=vs)
    bmesh.ops.translate(bm, vec=center, verts=vs)
    if bevel > 0:
        edges = list({e for v in vs for e in v.link_edges})
        bmesh.ops.bevel(bm, geom=edges + vs, offset=bevel, offset_type="OFFSET", segments=seg,
                        profile=0.5, affect="EDGES", clamp_overlap=True)
        vs = [v for v in bm.verts if v not in before]
    _tx(bm, vs, M)
    return vs


def add_lathe(bm, prof, seg=24, M=Matrix.Identity(4)):
    """Revolve profile [(r, z), ...] around local Z (closed body of revolution; r==0 points collapse)."""
    rings = []
    for (r, z) in prof:
        if r <= 1e-9:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z))
                          for i in range(seg)])
    for k in range(len(rings) - 1):
        A, B = rings[k], rings[k + 1]
        for i in range(seg):
            i2 = (i + 1) % seg
            if len(A) == 1 and len(B) == 1:
                continue
            if len(A) == 1:
                bm.faces.new((A[0], B[i], B[i2]))
            elif len(B) == 1:
                bm.faces.new((A[i], B[0], A[i2]))
            else:
                bm.faces.new((A[i], B[i], B[i2], A[i2]))
    if len(rings[0]) > 2:
        bm.faces.new(list(reversed(rings[0])))
    if len(rings[-1]) > 2:
        bm.faces.new(rings[-1])
    vs = [v for ring in rings for v in ring]
    _tx(bm, vs, M)
    return vs


def add_lathe_closed(bm, prof, seg=24, M=Matrix.Identity(4), a0=0.0):
    """Revolve a CLOSED profile loop (no point on the axis) -> ring-like closed solid."""
    rings = []
    for (r, z) in prof:
        rings.append([bm.verts.new((r * math.cos(a0 + 2 * math.pi * i / seg), r * math.sin(a0 + 2 * math.pi * i / seg), z))
                      for i in range(seg)])
    m = len(rings)
    for k in range(m):
        A, B = rings[k], rings[(k + 1) % m]
        for i in range(seg):
            i2 = (i + 1) % seg
            bm.faces.new((A[i], B[i], B[i2], A[i2]))
    vs = [v for ring in rings for v in ring]
    _tx(bm, vs, M)
    return vs


def add_cyl(bm, r, h, M=Matrix.Identity(4), seg=24, bevel=0.0, z0=None, r2=None):
    if z0 is None:
        z0 = -h / 2
    r2 = r if r2 is None else r2
    b = min(bevel, h / 2.5, r * 0.45)
    if b > 0:
        prof = [(0, z0), (r - b, z0), (r, z0 + b), (r2, z0 + h - b), (r2 - b, z0 + h), (0, z0 + h)]
    else:
        prof = [(0, z0), (r, z0), (r2, z0 + h), (0, z0 + h)]
    return add_lathe(bm, prof, seg, M)


def add_tube(bm, ro, ri, h, M=Matrix.Identity(4), seg=24, z0=None, bevel=0.0):
    if z0 is None:
        z0 = -h / 2
    b = min(bevel, (ro - ri) / 2.5, h / 2.5)
    prof = [(ri, z0 + b), (ri + b, z0), (ro - b, z0), (ro, z0 + b), (ro, z0 + h - b), (ro - b, z0 + h),
            (ri + b, z0 + h), (ri, z0 + h - b)] if b > 0 else [(ri, z0), (ro, z0), (ro, z0 + h), (ri, z0 + h)]
    return add_lathe_closed(bm, prof, seg, M)


def add_hex(bm, r, h, M=Matrix.Identity(4), z0=None):
    """Hex head / nut (across-corners radius r) along local Z with a small chamfer."""
    return add_cyl(bm, r, h, M @ Rz(math.pi / 6), seg=6, bevel=min(0.0008, h / 4), z0=z0)


def _signed_area(pts):
    a = 0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        a += x1 * y2 - x2 * y1
    return a / 2


def add_prism(bm, pts, h, M=Matrix.Identity(4), z0=0.0, bevel=0.0, seg=1, fan=False):
    """Polygon pts [(x, y), ...] in local XY extruded along +Z from z0 to z0+h. fan=True triangulates caps
    from the centroid (safe for star-shaped concave outlines)."""
    if _signed_area(pts) < 0:
        pts = list(reversed(pts))
    before = set(bm.verts) if bevel > 0 else None
    bot = [bm.verts.new((x, y, z0)) for (x, y) in pts]
    top = [bm.verts.new((x, y, z0 + h)) for (x, y) in pts]
    n = len(pts)
    extra = []
    if fan:
        cx = sum(p[0] for p in pts) / n
        cy = sum(p[1] for p in pts) / n
        cb = bm.verts.new((cx, cy, z0))
        ct = bm.verts.new((cx, cy, z0 + h))
        extra = [cb, ct]
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((cb, bot[j], bot[i]))
            bm.faces.new((ct, top[i], top[j]))
    else:
        bm.faces.new(list(reversed(bot)))
        bm.faces.new(top)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((bot[i], bot[j], top[j], top[i]))
    vs = bot + top + extra
    if bevel > 0:
        edges = list({e for v in bot + top for e in v.link_edges if e.other_vert(v) not in extra})
        bmesh.ops.bevel(bm, geom=edges, offset=bevel, offset_type="OFFSET", segments=seg, profile=0.5,
                        affect="EDGES", clamp_overlap=True)
        vs = [v for v in bm.verts if v not in before]
    _tx(bm, vs, M)
    return vs


def add_ring2d(bm, outer, inner, h, M=Matrix.Identity(4), z0=0.0):
    """Planar ring between two loops with the same vertex count, extruded along Z."""
    n = len(outer)
    assert len(inner) == n
    ob = [bm.verts.new((x, y, z0)) for x, y in outer]
    ot = [bm.verts.new((x, y, z0 + h)) for x, y in outer]
    ib = [bm.verts.new((x, y, z0)) for x, y in inner]
    it = [bm.verts.new((x, y, z0 + h)) for x, y in inner]
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((ob[i], ob[j], ot[j], ot[i]))
        bm.faces.new((ib[j], ib[i], it[i], it[j]))
        bm.faces.new((ot[i], ot[j], it[j], it[i]))
        bm.faces.new((ob[j], ob[i], ib[i], ib[j]))
    vs = ob + ot + ib + it
    _tx(bm, vs, M)
    return vs


def add_layers(bm, layers, M=Matrix.Identity(4)):
    """Stack of (outer_loop3d, inner_loop3d) layers (equal counts) -> closed solid between them.
    Each loop is a list of 3D tuples. First/last layers are capped with ring faces."""
    R = []
    for outer, inner in layers:
        R.append(([bm.verts.new(p) for p in outer], [bm.verts.new(p) for p in inner]))
    n = len(layers[0][0])
    for k in range(len(R) - 1):
        (oa, ia), (ob, ib) = R[k], R[k + 1]
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((oa[i], oa[j], ob[j], ob[i]))
            bm.faces.new((ia[j], ia[i], ib[i], ib[j]))
    for (o, i_), flip in ((R[0], True), (R[-1], False)):
        for i in range(n):
            j = (i + 1) % n
            f = (o[i], o[j], i_[j], i_[i])
            bm.faces.new(tuple(reversed(f)) if flip else f)
    vs = [v for o, i_ in R for v in o + i_]
    _tx(bm, vs, M)
    return vs


def add_polar(bm, n_theta, prof_fn, M=Matrix.Identity(4), th0=None, th1=None):
    """Theta-dependent revolve around local X. prof_fn(k, theta) -> closed loop [(r, x), ...] (same length
    for all theta). Point = (x, r sin(theta), r cos(theta)): theta 0 = up (+Z), +90 deg = left (+Y).
    Full revolution unless th0/th1 given (then the arc is capped at both ends)."""
    full = th0 is None
    rings = []
    cnt = n_theta if full else n_theta + 1
    for k in range(cnt):
        th = 2 * math.pi * k / n_theta if full else th0 + (th1 - th0) * k / n_theta
        prof = prof_fn(k, th)
        s, c = math.sin(th), math.cos(th)
        rings.append([bm.verts.new((x, r * s, r * c)) for (r, x) in prof])
    m = len(rings[0])
    segs = n_theta if full else n_theta
    for k in range(segs):
        A, B = rings[k], rings[(k + 1) % len(rings)]
        for i in range(m):
            j = (i + 1) % m
            bm.faces.new((A[i], A[j], B[j], B[i]))
    if not full:
        bm.faces.new(rings[0])
        bm.faces.new(list(reversed(rings[-1])))
    vs = [v for r in rings for v in r]
    _tx(bm, vs, M)
    return vs


def ptf_frames(path, up_hint=(0, 0, 1)):
    P = [Vector(p) for p in path]
    tans = []
    for i in range(len(P)):
        if i == 0:
            t = P[1] - P[0]
        elif i == len(P) - 1:
            t = P[-1] - P[-2]
        else:
            t = (P[i + 1] - P[i]).normalized() + (P[i] - P[i - 1]).normalized()
        tans.append(t.normalized())
    up = Vector(up_hint)
    n = (up - tans[0] * up.dot(tans[0]))
    if n.length < 1e-6:
        n = Vector((1, 0, 0)) - tans[0] * tans[0].x
        if n.length < 1e-6:
            n = Vector((0, 1, 0)) - tans[0] * tans[0].y
    n.normalize()
    frames = []
    for i, t in enumerate(tans):
        if i > 0:
            t0 = tans[i - 1]
            ax = t0.cross(t)
            if ax.length > 1e-9:
                ang = math.acos(max(-1, min(1, t0.dot(t))))
                n = Matrix.Rotation(ang, 3, ax.normalized()) @ n
            n = (n - t * n.dot(t)).normalized()
        b = t.cross(n)
        frames.append((t, n, b))
    return frames


def add_sweep(bm, path, prof, M=Matrix.Identity(4), cap=True, up=(0, 0, 1), frames=None, scales=None,
              closed=False):
    """Sweep 2D profile [(u, v), ...] (u along frame normal n, v along binormal b) along a 3D path."""
    P = [Vector(p) for p in path]
    if frames is None:
        frames = ptf_frames(P, up)
    rings = []
    for i, p in enumerate(P):
        t, n, b = frames[i]
        s = scales[i] if scales else 1.0
        if isinstance(s, (tuple, list)):
            su, sv = s
        else:
            su = sv = s
        rings.append([bm.verts.new(p + n * (u * su) + b * (v * sv)) for (u, v) in prof])
    m = len(prof)
    cnt = len(rings) if closed else len(rings) - 1
    for k in range(cnt):
        A, B = rings[k], rings[(k + 1) % len(rings)]
        for i in range(m):
            j = (i + 1) % m
            bm.faces.new((A[i], A[j], B[j], B[i]))
    if cap and not closed:
        bm.faces.new(list(reversed(rings[0])))
        bm.faces.new(rings[-1])
    vs = [v for r in rings for v in r]
    _tx(bm, vs, M)
    return vs


def circle_prof(r, n=12):
    return [(r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def rrect_prof(w, h, r, n=3):
    r = min(r, w / 2 - 1e-5, h / 2 - 1e-5)
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180),
                       (w / 2 - r, -h / 2 + r, 270)):
        for k in range(n + 1):
            a = (a0 + 90 * k / n) * D2R
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def catmull(points, n_per=8):
    P = [Vector(p) for p in points]
    out = []
    for i in range(len(P) - 1):
        p0 = P[i - 1] if i > 0 else P[i] * 2 - P[i + 1]
        p1, p2 = P[i], P[i + 1]
        p3 = P[i + 2] if i + 2 < len(P) else P[i + 1] * 2 - P[i]
        for k in range(n_per):
            t = k / n_per
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
                              (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-1])
    return out


def resample(path, step):
    P = [Vector(p) for p in path]
    L = [0.0]
    for i in range(1, len(P)):
        L.append(L[-1] + (P[i] - P[i - 1]).length)
    total = L[-1]
    n = max(2, int(round(total / step)) + 1)
    out = []
    j = 0
    for k in range(n):
        s = total * k / (n - 1)
        while j < len(P) - 2 and L[j + 1] < s:
            j += 1
        seg = L[j + 1] - L[j]
        t = 0 if seg == 0 else (s - L[j]) / seg
        out.append(P[j].lerp(P[j + 1], t))
    return out


def fillet_path(points, radius, n_arc=6):
    """Polyline with rounded corners (pipe bends): returns a dense point list."""
    P = [Vector(p) for p in points]
    out = [P[0]]
    for i in range(1, len(P) - 1):
        a, b, c = P[i - 1], P[i], P[i + 1]
        d1 = (a - b)
        d2 = (c - b)
        l1, l2 = d1.length, d2.length
        d1.normalize()
        d2.normalize()
        ang = math.acos(max(-1, min(1, d1.dot(d2))))
        if ang > math.pi - 1e-3:
            out.append(b)
            continue
        t = radius / math.tan(ang / 2)
        t = min(t, l1 * 0.48, l2 * 0.48)
        p1 = b + d1 * t
        p2 = b + d2 * t
        for k in range(n_arc + 1):
            s = k / n_arc
            # quadratic bezier approximates the arc well enough for pipes
            q = (1 - s) ** 2 * p1 + 2 * (1 - s) * s * b + s * s * p2
            out.append(q)
    out.append(P[-1])
    return out


# ----------------------------------------------------------------------------------------------
# gear profiles
# ----------------------------------------------------------------------------------------------
TOOTH_F = [(0.00, "r"), (0.10, "r"), (0.27, "a"), (0.46, "a"), (0.63, "r")]


def gear_loop(n, rp, m, internal=False, phase=0.0):
    """Spur tooth outline [(u, v)] (5 points per tooth). internal: teeth point inward (ring gear)."""
    if internal:
        ra, rr = rp - m, rp + 1.25 * m
    else:
        ra, rr = rp + m, rp - 1.25 * m
    pts = []
    for k in range(n):
        base = phase + 2 * math.pi * k / n
        for f, kind in TOOTH_F:
            a = base + 2 * math.pi * f / n
            r = ra if kind == "a" else rr
            pts.append((r * math.cos(a), r * math.sin(a)))
    return pts


def loop_at_radius(loop, r):
    return [(r * math.cos(math.atan2(y, x)), r * math.sin(math.atan2(y, x))) for x, y in loop]


def add_spur(bm, n, rp, m, width, bore, M=Matrix.Identity(4), z0=None):
    """External spur gear along local Z (centred unless z0)."""
    loop = gear_loop(n, rp, m)
    inner = loop_at_radius(loop, bore)
    return add_ring2d(bm, loop, inner, width, M, z0=(-width / 2 if z0 is None else z0))


def add_ring_gear(bm, n, rp, m, width, r_out, M=Matrix.Identity(4), z0=None):
    loop = gear_loop(n, rp, m, internal=True)
    outer = loop_at_radius(loop, r_out)
    return add_ring2d(bm, outer, loop, width, M, z0=(-width / 2 if z0 is None else z0))


def tooth_sweep(bm, centre_pts, n_dirs, b_dirs, w_root, w_tip, depth, emb=0.0015, scales=None):
    """One gear tooth: trapezoid profile (root embedded by `emb`, tip at `depth`) swept along centre_pts.
    n_dirs: unit vectors pointing from root to tip; b_dirs: tangential unit vectors (tooth width)."""
    rings = []
    for i, p in enumerate(centre_pts):
        s = scales[i] if scales else 1.0
        n, b = n_dirs[i], b_dirs[i]
        prof = [(-emb, -w_root / 2 * s), (-emb, w_root / 2 * s), (depth, w_tip / 2 * s), (depth, -w_tip / 2 * s)]
        rings.append([bm.verts.new(p + n * u + b * v) for (u, v) in prof])
    for k in range(len(rings) - 1):
        A, B = rings[k], rings[k + 1]
        for i in range(4):
            j = (i + 1) % 4
            bm.faces.new((A[i], A[j], B[j], B[i]))
    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])


# ----------------------------------------------------------------------------------------------
# objects / nodes
# ----------------------------------------------------------------------------------------------
def bm_to_obj(bm, name, mat):
    me = bpy.data.meshes.new(name)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    me.materials.append(MATS[mat])
    return ob


class Piece:
    def __init__(self, name):
        self.name = name
        self.bms = {}

    def bm(self, mat):
        if mat not in self.bms:
            self.bms[mat] = bmesh.new()
        return self.bms[mat]

    def objects(self):
        obs = []
        for mat, bm in self.bms.items():
            if len(bm.verts) == 0:
                bm.free()
                continue
            obs.append(bm_to_obj(bm, f"{self.name}_{mat}", mat))
        self.bms = {}
        return obs


def apply_mods(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    ev = ob.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
    old = ob.data
    ob.modifiers.clear()
    ob.data = me
    bpy.data.meshes.remove(old)


def boolean(target, cutters, op="DIFFERENCE", solver="EXACT"):
    if not cutters:
        return target
    coll = bpy.data.collections.new("cutters_tmp")
    bpy.context.scene.collection.children.link(coll)
    for c in cutters:
        for uc in c.users_collection:
            uc.objects.unlink(c)
        coll.objects.link(c)
    mod = target.modifiers.new("bool", "BOOLEAN")
    mod.operation = op
    mod.solver = solver
    mod.operand_type = "COLLECTION"
    mod.collection = coll
    if solver == "EXACT":
        mod.use_self = True
        mod.use_hole_tolerant = True
    apply_mods(target)
    for c in cutters:
        bpy.data.objects.remove(c, do_unlink=True)
    bpy.data.collections.remove(coll)
    return target


def bevel_mod(ob, width, seg=2, angle=35):
    m = ob.modifiers.new("bevel", "BEVEL")
    m.width = width
    m.segments = seg
    m.limit_method = "ANGLE"
    m.angle_limit = angle * D2R
    m.harden_normals = False
    m.miter_outer = "MITER_ARC"
    apply_mods(ob)
    return ob


def join(obs, name):
    obs = [o for o in obs if o is not None]
    if len(obs) == 1:
        obs[0].name = name
        obs[0].data.name = name
        return obs[0]
    ctx = {"active_object": obs[0], "selected_editable_objects": obs, "selected_objects": obs}
    with bpy.context.temp_override(**ctx):
        bpy.ops.object.join()
    o = obs[0]
    o.name = name
    o.data.name = name
    return o


def shade(ob, angle=34):
    me = ob.data
    for p in me.polygons:
        p.use_smooth = True
    try:
        me.set_sharp_from_angle(angle=angle * D2R)
    except Exception:
        pass


def make_node(name, obs, local_to_world, parent=None, smooth_angle=34):
    """Join pieces (built in the node's local frame) into one mesh object placed at local_to_world."""
    ob = join(obs, name)
    shade(ob, smooth_angle)
    ob.matrix_world = local_to_world
    if parent is not None:
        ob.parent = parent
        ob.matrix_parent_inverse = parent.matrix_world.inverted()
        ob.matrix_world = local_to_world
    return ob


def empty_node(name, local_to_world, parent=None):
    ob = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(ob)
    ob.empty_display_size = 0.05
    ob.matrix_world = local_to_world
    if parent is not None:
        ob.parent = parent
        ob.matrix_parent_inverse = parent.matrix_world.inverted()
        ob.matrix_world = local_to_world
    return ob


def tri_count(ob):
    if ob.type != "MESH":
        return 0
    return sum(len(p.vertices) - 2 for p in ob.data.polygons)


# ----------------------------------------------------------------------------------------------
# rendering
# ----------------------------------------------------------------------------------------------
def setup_studio(samples=16, res=(960, 540)):
    import addon_utils
    addon_utils.enable("cycles", default_set=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = "OPENIMAGEDENOISE"
    except Exception:
        pass
    sc.cycles.max_bounces = 6
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.film_transparent = False
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "None"
    w = bpy.data.worlds.new("studio")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.92, 0.92, 0.93, 1)
    bg.inputs["Strength"].default_value = 0.55
    sc.world = w

    def area(name, loc, rot, size, energy):
        l = bpy.data.lights.new(name, "AREA")
        l.size = size
        l.energy = energy
        o = bpy.data.objects.new(name, l)
        o.location = loc
        o.rotation_euler = rot
        sc.collection.objects.link(o)
        return o
    return [area("key", (3.0, -3.0, 4.0), (0.6, 0.0, 0.8), 3.0, 260),
            area("fill", (-3.0, 3.5, 3.0), (-0.7, 0.0, -2.3), 4.0, 110),
            area("top", (0.5, 0.0, 5.0), (0, 0, 0), 4.0, 130),
            area("under", (0.0, 0.0, -3.0), (math.pi, 0, 0), 5.0, 60)]


def look_at_cam(loc, target, lens=50, name="cam", ortho=None):
    sc = bpy.context.scene
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.clip_start = 0.01
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    co = bpy.data.objects.new(name, cd)
    sc.collection.objects.link(co)
    co.location = loc
    d = Vector(target) - Vector(loc)
    co.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    sc.camera = co
    return co


def render(path, loc, target, lens=50, ortho=None, samples=None, res=None):
    sc = bpy.context.scene
    if samples:
        sc.cycles.samples = samples
    if res:
        sc.render.resolution_x, sc.render.resolution_y = res
    cam = look_at_cam(loc, target, lens, ortho=ortho)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam, do_unlink=True)
    print("rendered", path)
