#!/usr/bin/env python3
"""
BMW M54B30 engine (E46 330Ci, 2001) for the film: block, cylinder head, valvetrain, double VANOS,
timing chains, valve cover, intake (DISA) and exhaust manifolds, oil pan, front accessories, radiator + fan.

Re-runnable:  python3 build/parts/engine.py            (build + export GLB + preview renders)
              python3 build/parts/engine.py --no-render (build + export only)

Coordinate system: see build/SPEC.md. Built in Blender Z-up with X = car forward, Y = car left, Z = up;
the glTF exporter converts to Y-up (glTF x, y, z) = (Blender x, z, -y).

Frames used while modelling (all right-handed, Blender axes):
  W  car frame (Blender world).
  E  engine frame: x along the crank (forward), y = engine left (intake side), z = up along the bores,
     origin on the crank axis at the rear face of the block (bell-housing flange).
     W <- E : translate (X0, 0, CRANK_Z) * rotate about +X by +TILT (top leans to the car's RIGHT).
  H  head frame: E translated to the centre of the head's bottom face (x = 0 mid-length).
Each exported node's local frame is the frame its mesh was built in, so e.g. the camshafts spin about
their local X axis and the cylinder head can be "un-tilted" by zeroing its rotation.
"""
import bpy, bmesh, math, os, sys, json
from mathutils import Vector, Matrix

D2R = math.pi / 180.0
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))           # films/bmw-e46
OUT_GLB = os.path.join(ROOT, "film", "public", "models", "engine.glb")
PREV_DIR = os.path.join(HERE, "previews")
ARGS = sys.argv[1:]

# ----------------------------------------------------------------------------------------------
# Key dimensions (metres). Sources in build/parts/engine.md
# ----------------------------------------------------------------------------------------------
TILT = 30.0 * D2R          # engine leans 30 deg to the right (exhaust side down)
X0 = 0.82                  # rear face of the block (bell-housing flange) in car X (SPEC)
CRANK_Z = 0.42             # crank axis height (SPEC)
BORE = 0.084
STROKE = 0.0896
ROD = 0.135
SPACING = 0.091            # bore spacing (M50 family)
BLOCK_LEN = 0.615          # rear face .. front face of the block
CYL_X = [0.5355 - i * SPACING for i in range(6)]     # E-frame x of cylinders 1..6 (cyl 1 at the front)
DECK_Z = 0.213             # crank axis -> deck: stroke/2 + rod 135 + compression height ~33
HEAD_Z0 = 0.2145           # head bottom face (1.5 mm head gasket)
HEAD_LEN = 0.615
HEAD_X0 = HEAD_LEN / 2     # head frame origin x in E
RAIL_Z = 0.128             # head top rail (valve cover gasket face) above head bottom
CAM_Y = 0.060              # camshaft axes at y = +-60 mm (intake +y, exhaust -y)
CAM_Z = 0.125              # camshaft axes above the head bottom face
BEAR_X = [CYL_X[0] + SPACING / 2 - i * SPACING for i in range(7)]   # 7 cam/main bearing planes (E x)
FIRING = [1, 5, 3, 6, 2, 4]
VALVE_ANG = {"in": 20.25 * D2R, "ex": 19.25 * D2R}   # M50-family valve angles (20 deg 15', 19 deg 15')
VALVE_D = {"in": 0.033, "ex": 0.0305}
VALVE_DX = {"in": 0.0185, "ex": 0.0175}             # valve pair half spacing along x
CAM_BASE_R = 0.0175
CAM_LIFT = 0.0097          # M54B30 cam lift 9.7 mm (BMW ST036)
LOBE_HALF = 75.0           # cam degrees from lobe peak to zero lift (flat-follower-feasible profile)
LOBE_EXP = 1.6
BUCKET_R = 0.0165
BUCKET_H = 0.024
TAPPET_GAP = 0.004         # bucket crown thickness above the valve tip
VALVE_FACE_Z = 0.0075      # valve face height above head bottom face (chamber roof at 0.0085)
SPROCKET_SEC_T = 28        # secondary chain sprockets (exhaust front row + intake)
SPROCKET_PRI_T = 38        # exhaust primary sprocket (2:1 with the crank sprocket)
CRANK_SPROCKET_T = 19
CHAIN_PITCH = 0.009525     # 3/8 in simplex chain

MAT_DEF = {  # name: (base colour RGBA (linear), metallic, roughness)
    "alu_cast":      ((0.56, 0.56, 0.54, 1), 0.85, 0.52),
    "alu_machined":  ((0.80, 0.80, 0.80, 1), 1.00, 0.24),
    "steel":         ((0.52, 0.53, 0.55, 1), 1.00, 0.33),
    "steel_dark":    ((0.13, 0.13, 0.14, 1), 0.85, 0.48),
    "plastic_black": ((0.022, 0.022, 0.024, 1), 0.0, 0.42),
    "rubber":        ((0.015, 0.015, 0.015, 1), 0.0, 0.85),
    "chain":         ((0.20, 0.20, 0.22, 1), 1.00, 0.40),
    "copper":        ((0.80, 0.42, 0.25, 1), 1.00, 0.32),
}
MATS = {}

# ----------------------------------------------------------------------------------------------
# Small math helpers
# ----------------------------------------------------------------------------------------------
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

def align_z(v):
    """Rotation matrix taking local +Z onto vector v."""
    v = Vector(v).normalized()
    z = Vector((0, 0, 1))
    if (v - z).length < 1e-9:
        return Matrix.Identity(4)
    if (v + z).length < 1e-9:
        return Rx(math.pi)
    ax = z.cross(v).normalized()
    ang = math.acos(max(-1, min(1, z.dot(v))))
    return Matrix.Rotation(ang, 4, ax)

def frame_axes(x_axis, z_hint):
    """4x4 rotation with local +X along x_axis and local +Z as close as possible to z_hint."""
    x = Vector(x_axis).normalized()
    z = Vector(z_hint)
    z = (z - x * z.dot(x)).normalized()
    y = z.cross(x)
    m = Matrix.Identity(4)
    for i in range(3):
        m[i][0], m[i][1], m[i][2] = x[i], y[i], z[i]
    return m

M_E = T(X0, 0, CRANK_Z) @ Rx(TILT)          # W <- E
M_H = M_E @ T(HEAD_X0, 0, HEAD_Z0)          # W <- H

def e2w(p):
    return M_E @ Vector(p)

def w2e(p):
    return M_E.inverted() @ Vector(p)

# ----------------------------------------------------------------------------------------------
# Scene / materials
# ----------------------------------------------------------------------------------------------
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    make_materials()

def make_materials():
    for name, (col, met, rough) in MAT_DEF.items():
        if name in bpy.data.materials:
            MATS[name] = bpy.data.materials[name]
            MATS[name].use_fake_user = True
            continue
        m = bpy.data.materials.new(name)
        m.use_fake_user = True
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = col
        b.inputs["Metallic"].default_value = met
        b.inputs["Roughness"].default_value = rough
        m.diffuse_color = col
        MATS[name] = m

# ----------------------------------------------------------------------------------------------
# bmesh primitive builders: every builder adds closed geometry to `bm`, transformed by M
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

def _island(seed):
    seen = set(seed)
    stack = list(seed)
    while stack:
        v = stack.pop()
        for e in v.link_edges:
            o = e.other_vert(v)
            if o not in seen:
                seen.add(o)
                stack.append(o)
    return list(seen)

def add_lathe(bm, prof, seg=24, M=Matrix.Identity(4), close_ends=True, a0=0.0, a1=2 * math.pi):
    """Revolve a profile [(r, z), ...] around local Z. Points with r==0 collapse to the axis."""
    full = abs((a1 - a0) - 2 * math.pi) < 1e-9
    n = seg if full else seg + 1
    rings = []
    for (r, z) in prof:
        ring = []
        if r <= 1e-9:
            ring = [bm.verts.new((0, 0, z))]
        else:
            for i in range(n):
                a = a0 + (a1 - a0) * i / seg
                ring.append(bm.verts.new((r * math.cos(a), r * math.sin(a), z)))
        rings.append(ring)
    faces = []
    for k in range(len(rings) - 1):
        A, B = rings[k], rings[k + 1]
        cnt = seg if full else seg
        for i in range(cnt):
            i2 = (i + 1) % n if full else i + 1
            if len(A) == 1 and len(B) == 1:
                continue
            if len(A) == 1:
                faces.append(bm.faces.new((A[0], B[i], B[i2])))
            elif len(B) == 1:
                faces.append(bm.faces.new((A[i], B[0], A[i2])))
            else:
                faces.append(bm.faces.new((A[i], B[i], B[i2], A[i2])))
    if close_ends and full:
        if len(rings[0]) > 2:
            faces.append(bm.faces.new(list(reversed(rings[0]))))
        if len(rings[-1]) > 2:
            faces.append(bm.faces.new(rings[-1]))
    vs = [v for ring in rings for v in ring]
    _tx(bm, vs, M)
    return vs

def add_cyl(bm, r, h, M=Matrix.Identity(4), seg=24, bevel=0.0, z0=None, r2=None):
    """Cylinder along local Z, from z0 (default -h/2) to z0+h; optional chamfer `bevel`."""
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

def add_lathe_closed(bm, prof, seg=24, M=Matrix.Identity(4)):
    """Revolve a CLOSED profile loop (no point on the axis) -> torus-like closed solid."""
    rings = []
    for (r, z) in prof:
        rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z))
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

def add_prism(bm, pts, h, M=Matrix.Identity(4), z0=0.0, bevel=0.0, seg=1):
    """Polygon pts [(x, y), ...] (CCW) in local XY, extruded along +Z from z0 to z0+h."""
    if _signed_area(pts) < 0:
        pts = list(reversed(pts))
    before = set(bm.verts) if bevel > 0 else None
    bot = [bm.verts.new((x, y, z0)) for (x, y) in pts]
    top = [bm.verts.new((x, y, z0 + h)) for (x, y) in pts]
    n = len(pts)
    bm.faces.new(list(reversed(bot)))
    bm.faces.new(top)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((bot[i], bot[j], top[j], top[i]))
    vs = bot + top
    if bevel > 0:
        edges = list({e for v in vs for e in v.link_edges})
        bmesh.ops.bevel(bm, geom=edges + vs, offset=bevel, offset_type="OFFSET", segments=seg, profile=0.5,
                        affect="EDGES", clamp_overlap=True)
        vs = [v for v in bm.verts if v not in before]
    _tx(bm, vs, M)
    return vs

def _signed_area(pts):
    a = 0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        a += x1 * y2 - x2 * y1
    return a / 2

def add_ring2d(bm, outer, inner, h, M=Matrix.Identity(4), z0=0.0):
    """Planar ring between two loops with the same vertex count, extruded along Z (e.g. sprockets)."""
    n = len(outer)
    assert len(inner) == n
    ob = [bm.verts.new((x, y, z0)) for x, y in outer]
    ot = [bm.verts.new((x, y, z0 + h)) for x, y in outer]
    ib = [bm.verts.new((x, y, z0)) for x, y in inner]
    it = [bm.verts.new((x, y, z0 + h)) for x, y in inner]
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((ob[i], ob[j], ot[j], ot[i]))      # outer wall
        bm.faces.new((ib[j], ib[i], it[i], it[j]))      # inner wall
        bm.faces.new((ot[i], ot[j], it[j], it[i]))      # top
        bm.faces.new((ob[j], ob[i], ib[i], ib[j]))      # bottom
    vs = ob + ot + ib + it
    _tx(bm, vs, M)
    return vs

def ptf_frames(path, up_hint=(0, 0, 1)):
    """Parallel-transport frames along a polyline. Returns list of (t, n, b)."""
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
    n.normalize()
    frames = []
    for i, t in enumerate(tans):
        if i > 0:
            # rotate previous normal by the rotation between tangents
            t0 = tans[i - 1]
            ax = t0.cross(t)
            if ax.length > 1e-9:
                ang = math.acos(max(-1, min(1, t0.dot(t))))
                n = Matrix.Rotation(ang, 3, ax.normalized()) @ n
            n = (n - t * n.dot(t)).normalized()
        b = t.cross(n)
        frames.append((t, n, b))
    return frames

def add_sweep(bm, path, prof, M=Matrix.Identity(4), closed=False, cap=True, up=(0, 0, 1), frames=None,
              scales=None):
    """Sweep 2D profile [(u, v), ...] (CCW, u along frame normal n, v along binormal b) along a 3D path."""
    P = [Vector(p) for p in path]
    if frames is None:
        frames = ptf_frames(P + ([P[0], P[1]] if False else []), up)
    if closed:
        # fix seam twist: rely on caller to provide closed path without repeated end point
        pass
    rings = []
    for i, p in enumerate(P):
        t, n, b = frames[i]
        s = scales[i] if scales else 1.0
        rings.append([bm.verts.new(p + n * (u * s) + b * (v * s)) for (u, v) in prof])
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
    """Rounded rectangle, w along u, h along v, corner radius r, n segments per corner."""
    r = min(r, w / 2 - 1e-5, h / 2 - 1e-5)
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180),
                       (w / 2 - r, -h / 2 + r, 270)):
        for k in range(n + 1):
            a = (a0 + 90 * k / n) * D2R
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts

def bezier(p0, p1, p2, p3, n):
    p0, p1, p2, p3 = map(Vector, (p0, p1, p2, p3))
    out = []
    for i in range(n + 1):
        t = i / n
        out.append(((1 - t) ** 3) * p0 + 3 * ((1 - t) ** 2) * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3)
    return out

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

# ----------------------------------------------------------------------------------------------
# Object helpers
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
    """Collects geometry per material, then becomes one or more Blender objects."""
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
            obs.append(bm_to_obj(bm, f"{self.name}_{mat}", mat))
        self.bms = {}
        return obs

def boolean(target, cutters, op="DIFFERENCE", solver="EXACT"):
    """Apply boolean(s) to target; cutters is a list of objects (deleted afterwards)."""
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

def apply_mods(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    ev = ob.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
    old = ob.data
    ob.modifiers.clear()
    ob.data = me
    bpy.data.meshes.remove(old)

def bevel_mod(ob, width, seg=2, angle=35, limit="ANGLE"):
    m = ob.modifiers.new("bevel", "BEVEL")
    m.width = width
    m.segments = seg
    m.limit_method = limit
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

def make_node(name, obs, local_to_world, parent=None, parent_world=None):
    """Join pieces (already in local coordinates) into one mesh object and place it."""
    ob = join(obs, name)
    shade(ob)
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
# Valvetrain geometry (H frame)
# ----------------------------------------------------------------------------------------------
def lobe_f(theta_deg):
    """Normalised lift (0..1) at `theta_deg` cam degrees from the lobe peak (flat-follower lift law)."""
    t = abs(theta_deg)
    if t >= LOBE_HALF:
        return 0.0
    return math.cos(t / LOBE_HALF * math.pi / 2) ** LOBE_EXP

def wrap180(a):
    a = (a + 180.0) % 360.0 - 180.0
    return a

def valve_table():
    """24 valves: name, cylinder, kind, x (H), axis (H, toward the cam), closed tip, face, length,
    lobe peak cam angle (deg, measured in the engine's rotation sense from the export pose) and lift at export.
    Export pose = crank at cylinder-1 firing TDC; firing order 1-5-3-6-2-4; intake lobe centre 105 deg ATDC,
    exhaust lobe centre 110 deg BTDC (crank)."""
    out = []
    for ci in range(6):
        cyl = ci + 1
        xh = CYL_X[ci] - HEAD_X0
        p = FIRING.index(cyl)
        for kind, sgn in (("in", 1.0), ("ex", -1.0)):
            a = VALVE_ANG[kind]
            axis = Vector((0.0, sgn * math.sin(a), math.cos(a)))
            peak_crank = 120.0 * p + (465.0 if kind == "in" else 250.0)
            peak_cam = (peak_crank / 2.0) % 360.0
            lift0 = CAM_LIFT * lobe_f(wrap180(-peak_cam))
            for k, dx in ((1, VALVE_DX[kind]), (2, -VALVE_DX[kind])):
                cam_pt = Vector((xh + dx, sgn * CAM_Y, CAM_Z))
                tip = cam_pt - axis * (TAPPET_GAP + CAM_BASE_R)
                L = (tip.z - VALVE_FACE_Z) / axis.z
                face = tip - axis * L
                out.append(dict(name=f"valve_c{cyl}_{kind}{k}", cyl=cyl, kind=kind, k=k, x=xh + dx, axis=axis,
                                tip=tip, face=face, L=L, sgn=sgn, peak_cam=peak_cam, lift0=lift0,
                                D=VALVE_D[kind]))
    return out

VALVES = valve_table()

def cam_profile(n=64):
    """2D cam lobe outline in the lobe frame (x = nose direction) from the support function
    h(th) = r0 + L f(th): point = h n + h' t. Returns list of (a, b)."""
    pts = []
    eps = 1e-4
    # denser sampling near the nose
    angs = []
    for i in range(n):
        u = -1 + 2 * i / n
        angs.append(180.0 * u)
    for th in angs:
        h = CAM_BASE_R + CAM_LIFT * lobe_f(th)
        hp = CAM_LIFT * (lobe_f(th + eps / D2R) - lobe_f(th - eps / D2R)) / (2 * eps)
        r = th * D2R
        nx, ny = math.cos(r), math.sin(r)
        tx, ty = -math.sin(r), math.cos(r)
        pts.append((h * nx + hp * tx, h * ny + hp * ty))
    return pts

# ----------------------------------------------------------------------------------------------
# CYLINDER HEAD (H frame: origin = centre of the bottom face, x forward, y left/intake, z up)
# ----------------------------------------------------------------------------------------------
HEAD_PROFILE = [  # outer cross-section (y, z), after BMW ST034 p.15 head section, scaled to cam spacing
    (-0.090, 0.000), (0.112, 0.000), (0.112, 0.020),
    (0.0774, 0.066),                      # sloped intake port face (normal 37 deg above horizontal)
    (0.090, 0.078), (0.111, 0.104), (0.111, RAIL_Z),
    (-0.110, RAIL_Z), (-0.110, 0.112), (-0.101, 0.086), (-0.096, 0.068), (-0.090, 0.064),
]
INTAKE_PORT_C = Vector((0.0, 0.0947, 0.043))
INTAKE_PORT_DIR = Vector((0.0, math.cos(37 * D2R), math.sin(37 * D2R)))
EXHAUST_PORT_C = Vector((0.0, -0.090, 0.040))
EXHAUST_PORT_DIR = Vector((0.0, -1.0, 0.0))
FLOOR_Z = 0.064

def build_head():
    hx = HEAD_LEN / 2
    # --- main casting: profile extruded along x
    pc = Piece("head_body")
    bm = pc.bm("alu_cast")
    # prism in local (y,z) plane extruded along x: build in XY then rotate: local X->y, Y->z, Z->x
    Mprof = Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # maps (u,v,w)->(w,u,v)
    add_prism(bm, HEAD_PROFILE, HEAD_LEN, Mprof, z0=-hx)
    body = pc.objects()[0]

    cut = Piece("head_cut")
    cb = cut.bm("alu_cast")
    # cam-carrier valley (open top)
    valley = [(-0.083, FLOOR_Z), (0.056, FLOOR_Z), (0.070, 0.082), (0.087, 0.094), (0.102, 0.112),
              (0.102, 0.20), (-0.101, 0.20), (-0.101, 0.114), (-0.092, 0.090), (-0.083, 0.072)]
    add_prism(cb, valley, HEAD_LEN - 0.024, Mprof, z0=-hx + 0.012)
    # chamber recesses + spark-plug holes + head bolt holes + coolant holes
    for ci in range(6):
        xh = CYL_X[ci] - HEAD_X0
        add_cyl(cb, BORE / 2 - 0.0005, 0.0095, T(xh, 0, 0), seg=40, z0=-0.001)
        add_cyl(cb, 0.0125, 0.06, T(xh, 0, 0), seg=20, z0=0.030)          # plug well (coil boot bore)
        add_cyl(cb, 0.0062, 0.04, T(xh, 0, 0), seg=12, z0=0.0)            # plug thread bore
        for sy in (-1, 1):                                                 # coolant holes in the deck
            add_cyl(cb, 0.0055, 0.016, T(xh + 0.022, sy * 0.068, 0), seg=10, z0=-0.002)
    for bx in BEAR_X:
        for sy in (-1, 1):
            add_cyl(cb, 0.0066, 0.2, T(bx - HEAD_X0, sy * 0.030, 0), seg=12, z0=-0.01)   # 14 head bolts
    # intake ports (one per cylinder, splitting inside), exhaust ports (one per cylinder)
    for ci in range(6):
        xh = CYL_X[ci] - HEAD_X0
        # intake: tapered rounded-rect channel along the port axis
        c = INTAKE_PORT_C + Vector((xh, 0, 0))
        path = [c - INTAKE_PORT_DIR * 0.045, c + INTAKE_PORT_DIR * 0.03]
        fr = [(INTAKE_PORT_DIR, Vector((1, 0, 0)), INTAKE_PORT_DIR.cross(Vector((1, 0, 0))))] * 2
        add_sweep(cb, path, rrect_prof(0.040, 0.029, 0.010, 3), frames=fr, scales=[0.72, 1.0])
        c = EXHAUST_PORT_C + Vector((xh, 0, 0))
        path = [c - EXHAUST_PORT_DIR * 0.040, c + EXHAUST_PORT_DIR * 0.03]
        fr = [(EXHAUST_PORT_DIR, Vector((1, 0, 0)), EXHAUST_PORT_DIR.cross(Vector((1, 0, 0))))] * 2
        add_sweep(cb, path, rrect_prof(0.036, 0.028, 0.012, 3), frames=fr, scales=[0.7, 1.0])
    cutter = cut.objects()[0]
    boolean(body, [cutter])
    bevel_mod(body, 0.0018, seg=2, angle=40)

    # --- interior details (separate overlapping solids, alu_cast)
    det = Piece("head_det")
    db = det.bm("alu_cast")
    # bucket tappet bores (merged pairs) standing on the floor
    for v in VALVES:
        ax = v["axis"]
        s_floor = (FLOOR_Z - 0.006 - v["tip"].z) / ax.z
        s_top = -0.0035
        M = T(*v["tip"]) @ align_z(ax)
        add_tube(db, 0.0196, BUCKET_R + 0.0004, s_top - s_floor, M, seg=16, z0=s_floor, bevel=0.0008)
    # cam bearing saddles (lower halves) with semicircular journal seats
    for bx in BEAR_X:
        xh = bx - HEAD_X0
        for sy in (-1, 1):
            yc = sy * CAM_Y
            if sy > 0:
                pts = [(yc - 0.026, FLOOR_Z - 0.004), (yc + 0.012, FLOOR_Z - 0.004), (yc + 0.026, 0.086),
                       (yc + 0.026, CAM_Z)]
            else:
                pts = [(yc - 0.012, FLOOR_Z - 0.004), (yc + 0.026, FLOOR_Z - 0.004), (yc + 0.026, CAM_Z)]
                pts = [(yc - 0.026, 0.084)] + pts
            for k in range(13):
                a = 0 - math.pi * k / 12
                pts.append((yc + 0.0153 * math.cos(a), CAM_Z + 0.0153 * math.sin(a)))
            pts.append((yc - 0.026, CAM_Z))
            add_prism(db, list(reversed(pts)) if _signed_area(pts) < 0 else pts, 0.021, Mprof, z0=xh - 0.0105)
    # spark-plug well bosses (centre line), protruding slightly above the rail
    for ci in range(6):
        xh = CYL_X[ci] - HEAD_X0
        add_tube(db, 0.0178, 0.0127, RAIL_Z + 0.010 - (FLOOR_Z - 0.004), T(xh, 0, 0), seg=24,
                 z0=FLOOR_Z - 0.004, bevel=0.0012)
    # secondary-air gallery along the exhaust side
    add_cyl(db, 0.0085, HEAD_LEN - 0.03, T(0, -0.097, 0.075) @ Ry(math.pi / 2), seg=12, bevel=0.002)
    # front chain-tunnel lip + lifting eye (front, intake side)
    add_prism(db, [(0.0, 0.0), (0.05, 0.0), (0.05, 0.035), (0.03, 0.065), (0.012, 0.065), (0.0, 0.035)],
              0.008, T(hx - 0.034, 0.088, RAIL_Z - 0.004) @ Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1))) @ Rz(0) , bevel=0.0015)
    detail_obj = det.objects()

    # --- bearing caps (alu_machined faces read as separate parts) + bolts
    cap = Piece("head_caps")
    kb = cap.bm("alu_cast")
    sb = cap.bm("steel")
    for bx in BEAR_X:
        xh = bx - HEAD_X0
        for sy in (-1, 1):
            yc = sy * CAM_Y
            pts = [(yc + 0.027, CAM_Z + 0.0003), (yc + 0.027, CAM_Z + 0.010), (yc + 0.0165, CAM_Z + 0.011),
                   (yc + 0.0150, CAM_Z + 0.020), (yc + 0.0085, CAM_Z + 0.0255), (yc - 0.0085, CAM_Z + 0.0255),
                   (yc - 0.0150, CAM_Z + 0.020), (yc - 0.0165, CAM_Z + 0.011), (yc - 0.027, CAM_Z + 0.010),
                   (yc - 0.027, CAM_Z + 0.0003)]
            for k in range(13):
                a = math.pi - math.pi * k / 12
                pts.append((yc + 0.0153 * math.cos(a), CAM_Z + 0.0003 + 0.0153 * math.sin(a)))
            add_prism(kb, pts, 0.020, Mprof, z0=xh - 0.010, bevel=0.0010, seg=1)
            for by in (-0.0215, 0.0215):
                add_cyl(sb, 0.0050, 0.0055, T(xh, yc + by, CAM_Z + 0.010 + 0.00275 + 0.0012), seg=6, bevel=0.0006)
                add_cyl(sb, 0.0060, 0.0012, T(xh, yc + by, CAM_Z + 0.0106), seg=14)
    cap_obs = cap.objects()

    # --- spark plugs (deep in the wells; tip visible in the chamber)
    pl = Piece("plugs")
    pb = pl.bm("steel")
    wb = pl.bm("alu_machined")
    for ci in range(6):
        xh = CYL_X[ci] - HEAD_X0
        add_cyl(pb, 0.0080, 0.009, T(xh, 0, 0.035), seg=6, bevel=0.0008)            # hex
        add_cyl(pb, 0.0059, 0.026, T(xh, 0, 0.0185), seg=10)                        # thread body
        add_cyl(pb, 0.0012, 0.0035, T(xh, 0, 0.006), seg=6)                         # centre electrode
        add_lathe(wb, [(0, 0.0395), (0.0075, 0.0395), (0.0072, 0.055), (0.0045, 0.060), (0.0035, 0.068),
                       (0.0, 0.068)], 12, T(xh, 0, 0))                              # ceramic insulator
    plug_obs = pl.objects()
    return [body] + detail_obj + cap_obs + plug_obs

# ----------------------------------------------------------------------------------------------
# CAMSHAFTS (local frame: origin on the cam axis at head-frame x = 0; x along the axis)
# ----------------------------------------------------------------------------------------------
def build_camshaft(kind):
    sgn = 1.0 if kind == "in" else -1.0
    pc = Piece(f"cam_{kind}")
    bm = pc.bm("steel")
    jm = pc.bm("alu_machined")
    rot = Ry(math.pi / 2)   # local z -> x
    x_rear = -HEAD_LEN / 2 + 0.016
    x_front = HEAD_LEN / 2 + 0.002          # through the front wall to the sprocket flange
    # core shaft
    add_cyl(bm, 0.0125, x_front - x_rear, T((x_rear + x_front) / 2, 0, 0) @ rot, seg=16, bevel=0.001)
    # journals (7) - machined bands
    for bx in BEAR_X:
        add_cyl(jm, 0.0150, 0.0205, T(bx - HEAD_X0, 0, 0) @ rot, seg=24, bevel=0.0006)
    # thrust collar + front nose (spline) + hex for the holding tool
    add_cyl(jm, 0.0190, 0.006, T(BEAR_X[0] - HEAD_X0 + 0.0155, 0, 0) @ rot, seg=24, bevel=0.0008)
    add_cyl(bm, 0.0105, 0.012, T(BEAR_X[0] - HEAD_X0 - 0.024, 0, 0) @ rot, seg=6, bevel=0.0008)   # hex
    add_cyl(jm, 0.0160, 0.016, T(HEAD_LEN / 2 + 0.008, 0, 0) @ rot, seg=24, bevel=0.0008)
    # lobes
    prof = cam_profile(48)
    for v in VALVES:
        if v["kind"] != kind:
            continue
        # nose direction at the export pose: R_x(+peak) applied to -axis
        u = (Matrix.Rotation(v["peak_cam"] * D2R, 3, "X") @ (-v["axis"])).normalized()
        w = Vector((0, -u.z, u.y))
        M = Matrix(((0, 0, 1, v["x"]), (u.x, w.x, 0, 0), (u.y, w.y, 0, 0), (u.z, w.z, 0, 0)))
        # columns: local X->u, Y->w, Z->x axis; build prism in (a,b) plane extruded along z
        M = Matrix.Identity(4)
        M.col[0] = (u.x, u.y, u.z, 0)
        M.col[1] = (w.x, w.y, w.z, 0)
        M.col[2] = (1, 0, 0, 0)
        M.col[3] = (v["x"] + (0.0015 if v["k"] == 1 else -0.0015), 0, 0, 1)
        add_prism(bm, prof, 0.0155, M, z0=-0.00775, bevel=0.0006, seg=1)
    return pc.objects()

# ----------------------------------------------------------------------------------------------
# VALVES: per valve node (origin at the valve tip, local +Z (glTF +Y) along the stem toward the cam).
# Valve + spring retainer + bucket tappet move together; the spring is a child node whose origin is the
# spring's top (under the retainer) so it can be compressed by scaling its local Z (glTF Y).
# ----------------------------------------------------------------------------------------------
SPRING_TOP = -0.0068

def valve_spring_height(v):
    s_seat = (FLOOR_Z - v["tip"].z) / v["axis"].z
    return SPRING_TOP - s_seat

def build_valve(v):
    pc = Piece(v["name"])
    st = pc.bm("steel")
    bk = pc.bm("alu_machined")
    L = v["L"]
    R = v["D"] / 2
    prof = [(0, -L), (R, -L), (R, -L + 0.0011), (R - 0.0016, -L + 0.0027), (R * 0.62, -L + 0.0055),
            (R * 0.36, -L + 0.0105), (0.0040, -L + 0.0175), (0.0030, -L + 0.0255), (0.0030, -0.0005),
            (0.0024, 0.0), (0, 0.0)]
    add_lathe(st, prof, 12)
    # spring retainer (cone washer) + keepers
    add_lathe_closed(st, [(0.0031, -0.0105), (0.0058, -0.0105), (0.0124, -0.0074), (0.0124, SPRING_TOP + 0.0006),
                          (0.0031, -0.0040)], 12)
    # bucket tappet: open-bottom cup, crown TAPPET_GAP above the tip
    top = TAPPET_GAP
    add_lathe(bk, [(0, top), (BUCKET_R - 0.0008, top), (BUCKET_R, top - 0.0008), (BUCKET_R, top - BUCKET_H),
                   (BUCKET_R - 0.0018, top - BUCKET_H), (BUCKET_R - 0.0018, 0.0006), (0.0055, 0.0006),
                   (0.0055, -0.0012), (0.0, -0.0012)], 16)
    obs = pc.objects()
    # spring (separate child)
    H0 = valve_spring_height(v)
    sp = Piece("spring_" + v["name"][6:])
    sb = sp.bm("steel_dark")
    coils = 4.5
    wire = 0.0019
    rad = 0.0112
    n = int(coils * 9)
    path = []
    for i in range(n + 1):
        t = i / n
        a = 2 * math.pi * coils * t
        # closed (flat) end coils: compress pitch near the ends
        zt = t + 0.10 * math.sin(2 * math.pi * t) / (2 * math.pi) * -1.0
        z = -wire - (H0 - 2 * wire) * zt
        path.append((rad * math.cos(a), rad * math.sin(a), z))
    add_sweep(sb, path, circle_prof(wire, 5), up=(0, 0, 1))
    spring = sp.objects()
    return obs, spring, H0

# ----------------------------------------------------------------------------------------------
# Preview rendering (Cycles CPU, white studio)
# ----------------------------------------------------------------------------------------------
def setup_studio(samples=24, res=(960, 540)):
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
    lights = [area("key", (3.0, -3.0, 4.0), (0.6, 0.0, 0.8), 3.0, 260),
              area("fill", (-3.0, 3.5, 3.0), (-0.7, 0.0, -2.3), 4.0, 110),
              area("top", (0.5, 0.0, 5.0), (0, 0, 0), 4.0, 130)]
    return lights

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

# ----------------------------------------------------------------------------------------------
# DOUBLE VANOS: sprockets (on the cam noses), timing chains, VANOS housing (H frame)
# ----------------------------------------------------------------------------------------------
HEAD_FRONT = HEAD_LEN / 2                   # head front face x (H)
PRI_X = HEAD_FRONT + 0.0120                 # primary chain / exhaust rear sprocket plane
SEC_X = HEAD_FRONT + 0.0265                 # secondary chain plane (exhaust front row + intake)
SPROCKET_ORIGIN_X = HEAD_FRONT + 0.020
CRANK_H = Vector((0.0, 0.0, -HEAD_Z0))      # crank axis in H (y, z)

def pcd_r(n):
    return CHAIN_PITCH / (2 * math.sin(math.pi / n))

def sprocket_loops(n, ring_w=0.0075, per=10):
    R = pcd_r(n)
    root = R - 0.00335
    tip = CHAIN_PITCH / 2 * (0.58 + 1 / math.tan(math.pi / n))
    ds = [0.0, 0.30, 0.52, 0.76, 1.0]
    gs = [0.0, 0.04, 0.50, 0.93, 1.0]
    outer = []
    for k in range(n):
        base = 2 * math.pi * k / n
        half = math.pi / n
        seq = [(d, g) for d, g in zip(ds, gs)] + [(2 - d, g) for d, g in list(reversed(list(zip(ds, gs))))[1:-1]]
        for d, g in seq:
            a = base + d * half
            r = root + (tip - root) * g
            outer.append((r * math.cos(a), r * math.sin(a)))
    rin = root - ring_w
    m = len(outer)
    inner = [(rin * math.cos(math.atan2(y, x)), rin * math.sin(math.atan2(y, x))) for x, y in outer]
    return outer, inner, R, root, rin

def add_sprocket(bm_teeth, bm_web, n, x_center, thick, Mloc, web_r_in=0.022, web_thick=0.0045, phase=0.0):
    outer, inner, R, root, rin = sprocket_loops(n)
    # build in local XY (sprocket plane), Z along axis -> map to H x axis
    M = Mloc @ T(x_center, 0, 0) @ Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1))) @ Rz(phase)
    add_ring2d(bm_teeth, outer, inner, thick, M @ Matrix.Rotation(0, 4, "Z"), z0=-thick / 2)
    # web disc
    add_tube(bm_web, rin + 0.0008, web_r_in, web_thick, M, seg=48, bevel=0.0006)
    return R

def build_sprocket(kind):
    """Local frame: origin on the cam axis at x = SPROCKET_ORIGIN_X (H), axes as H."""
    pc = Piece(f"sprocket_{kind}")
    tb = pc.bm("steel")
    wb = pc.bm("steel")
    hb = pc.bm("alu_machined")
    db = pc.bm("steel_dark")
    rot = Ry(math.pi / 2)
    o = SPROCKET_ORIGIN_X
    rows = [(SEC_X, SPROCKET_SEC_T, 0.0)]
    if kind == "ex":
        rows.append((PRI_X, SPROCKET_PRI_T, 0.0))
    for xc, n, ph in rows:
        add_sprocket(tb, wb, n, xc - o, 0.0072, Matrix.Identity(4), phase=ph)
    # VANOS hub (helical-gear cup) + front flange with 4 bolts + impulse wheel (sensor)
    x_back = HEAD_FRONT + 0.003 - o
    x_front = SEC_X + 0.016 - o
    add_cyl(hb, 0.0215, x_front - x_back, T((x_back + x_front) / 2, 0, 0) @ rot, seg=32, bevel=0.0012)
    add_cyl(hb, 0.0300, 0.004, T(SEC_X + 0.0060 - o, 0, 0) @ rot, seg=40, bevel=0.0008)
    for k in range(4):
        a = math.pi / 4 + k * math.pi / 2
        add_cyl(db, 0.0042, 0.004, T(SEC_X + 0.0095 - o, 0.024 * math.cos(a), 0.024 * math.sin(a)) @ rot,
                seg=6, bevel=0.0005)
    # impulse wheel: thin disc with 4 raised segments (camshaft sensor trigger), behind the secondary row
    iw_x = (SEC_X - 0.0075 if kind == "in" else PRI_X + 0.0072) - o
    add_tube(db, 0.036, 0.0215, 0.0016, T(iw_x, 0, 0) @ rot, seg=40)
    for k in range(4 if kind == "ex" else 3):
        a0 = k * 2 * math.pi / (4 if kind == "ex" else 3)
        add_lathe_closed(db, [(0.036, -0.0008), (0.041, -0.0008), (0.041, 0.0008), (0.036, 0.0008)], 6,
                         T(iw_x, 0, 0) @ rot @ Rz(a0))
    return pc.objects()

def belt_path(circles, n_arc=24):
    """Closed path wrapping convex-ordered circles [(c(Vector2), r)], traversed counter-clockwise.
    Returns list of 2D points and their 'outward' normals."""
    k = len(circles)
    tang = []
    for i in range(k):
        c1, r1 = circles[i]
        c2, r2 = circles[(i + 1) % k]
        d = c2 - c1
        L = d.length
        ang = math.atan2(d.y, d.x)
        # external tangent on the right-hand side for CCW traversal
        beta = math.acos(max(-1, min(1, (r1 - r2) / L)))
        a1 = ang - beta
        p1 = c1 + Vector((math.cos(a1), math.sin(a1))) * r1
        p2 = c2 + Vector((math.cos(a1), math.sin(a1))) * r2
        tang.append((a1, p1, p2))
    pts = []
    for i in range(k):
        c, r = circles[i]
        a_in = tang[i - 1][0]
        a_out = tang[i][0]
        while a_out < a_in:
            a_out += 2 * math.pi
        steps = max(2, int(n_arc * (a_out - a_in) / (2 * math.pi)) + 1)
        for s in range(steps + 1):
            a = a_in + (a_out - a_in) * s / steps
            pts.append(c + Vector((math.cos(a), math.sin(a))) * r)
    return pts

def chain_links(bm_plate, bm_roll, path2d, x_plane, Mplane):
    """Place chain links at CHAIN_PITCH along a closed 2D path (in the (y,z) plane at x = x_plane)."""
    P = [Vector(p) for p in path2d]
    P.append(P[0])
    L = [0.0]
    for i in range(1, len(P)):
        L.append(L[-1] + (P[i] - P[i - 1]).length)
    total = L[-1]
    n = max(4, int(round(total / CHAIN_PITCH)))
    if n % 2:
        n += 1
    pitch = total / n

    def at(s):
        s %= total
        j = 0
        while j < len(P) - 2 and L[j + 1] < s:
            j += 1
        seg = L[j + 1] - L[j]
        t = 0 if seg == 0 else (s - L[j]) / seg
        return P[j].lerp(P[j + 1], t)
    joints = [at(i * pitch) for i in range(n)]
    for i in range(n):
        a = joints[i]
        b = joints[(i + 1) % n]
        mid = (a + b) / 2
        d = (b - a).normalized()
        ang = math.atan2(d.y, d.x)
        inner = (i % 2 == 0)
        half_w = 0.0040 if inner else 0.0052
        for sz in (-1, 1):
            M = Mplane @ T(x_plane + sz * half_w, mid.x, mid.y) @ Rx(ang)
            add_box(bm_plate, 0.0012, pitch + 0.0042, 0.0078 if inner else 0.0074, M)
        # roller / pin at joint a
        add_cyl(bm_roll, 0.0031, 0.0094 if inner else 0.0118, Mplane @ T(x_plane, a.x, a.y) @ Ry(math.pi / 2), seg=6)
    return n

def build_timing_chain():
    """Secondary chain (exhaust -> intake) and primary chain (crank -> exhaust), crank sprocket, rails.
    Built in the H frame."""
    pc = Piece("timing_chain")
    pb = pc.bm("chain")
    rb = pc.bm("steel")
    gb = pc.bm("plastic_black")
    ex = Vector((-CAM_Y, CAM_Z))
    it = Vector((CAM_Y, CAM_Z))
    cr = Vector((CRANK_H.y, CRANK_H.z))
    Rs = pcd_r(SPROCKET_SEC_T)
    Rp = pcd_r(SPROCKET_PRI_T)
    Rc = pcd_r(CRANK_SPROCKET_T)
    # secondary: CCW order in (y,z): exhaust (right, low y) then intake
    sec = belt_path([(it, Rs), (ex, Rs)])
    n_sec = chain_links(pb, rb, sec, SEC_X, Matrix.Identity(4))
    pri = belt_path([(ex, Rp), (cr, Rc)], n_arc=40)
    n_pri = chain_links(pb, rb, pri, PRI_X, Matrix.Identity(4))
    # crank sprocket
    add_sprocket(rb, rb, CRANK_SPROCKET_T, PRI_X, 0.0072, Matrix.Identity(4), web_r_in=0.012)
    add_cyl(rb, 0.020, 0.030, T(PRI_X, cr.x, cr.y) @ Ry(math.pi / 2), seg=24)
    # guide rail (intake side) and tensioner rail (exhaust side) along the primary chain straights
    for side in (-1, 1):
        # straight between the tangent points: find chain points with y sign = side, below the cam
        pts = [p for p in pri if (p.x * side > 0.005 and cr.y + 0.04 < p.y < ex.y - 0.03)]
        if len(pts) < 2:
            continue
        pts.sort(key=lambda p: p.y)
        a, b = pts[0], pts[-1]
        d = (b - a)
        nrm = Vector((d.y, -d.x)).normalized() * side
        if nrm.x * side < 0:
            nrm = -nrm
        mid = (a + b) / 2 + nrm * 0.0085
        ang = math.atan2(d.y, d.x)
        M = T(PRI_X, mid.x, mid.y) @ Rx(ang)
        add_box(gb, 0.016, d.length * 0.92, 0.0075, M, bevel=0.002, seg=2)
    # secondary tensioner pad under the lower run
    add_box(gb, 0.014, 0.060, 0.007, T(SEC_X, 0.0, CAM_Z - Rs - 0.0085), bevel=0.0015, seg=1)
    add_box(rb, 0.022, 0.026, 0.020, T(SEC_X - 0.004, 0.0, CAM_Z - Rs - 0.022), bevel=0.002, seg=1)
    return pc.objects(), n_sec, n_pri

def convex_hull(points):
    pts = sorted(set((round(p[0], 6), round(p[1], 6)) for p in points))
    if len(pts) <= 2:
        return pts
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]

def offset_loop(loop, d):
    """Offset a CCW convex loop inward by d (vertex normals)."""
    n = len(loop)
    out = []
    for i in range(n):
        p0 = Vector(loop[i - 1]); p1 = Vector(loop[i]); p2 = Vector(loop[(i + 1) % n])
        e1 = (p1 - p0).normalized(); e2 = (p2 - p1).normalized()
        n1 = Vector((-e1.y, e1.x)); n2 = Vector((-e2.y, e2.x))
        nn = (n1 + n2)
        nn = nn.normalized() if nn.length > 1e-9 else n1
        cosh = max(0.35, nn.dot(n1))
        q = p1 + nn * (d / cosh)
        out.append((q.x, q.y))
    return out

def vanos_outline():
    pts = []
    for (cy, cz, r) in ((-CAM_Y, CAM_Z, 0.069), (CAM_Y, CAM_Z, 0.060)):
        for k in range(48):
            a = 2 * math.pi * k / 48
            pts.append((cy + r * math.cos(a), cz + r * math.sin(a)))
    pts += [(-0.098, 0.052), (0.104, 0.050), (0.124, 0.072), (0.124, 0.128)]
    hull = convex_hull(pts)
    # resample hull uniformly for a clean ring
    P = [Vector(p) for p in hull] + [Vector(hull[0])]
    res = resample(P, 0.006)[:-1]
    return [(p.x, p.y) for p in res]

def build_vanos():
    """VANOS housing, piston-cylinder domes with caps, solenoids, oil feed (H frame; node origin is
    placed by the caller at the head front face, cam height)."""
    pc = Piece("vanos")
    ab = pc.bm("alu_cast")
    mb = pc.bm("alu_machined")
    sb = pc.bm("steel")
    kb = pc.bm("plastic_black")
    Mp = Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # (u,v,w)->(w,u,v): prism along x
    outline = vanos_outline()
    if _signed_area(outline) < 0:
        outline = list(reversed(outline))
    inner = offset_loop(outline, 0.0065)
    x_rim0, x_rim1 = HEAD_FRONT + 0.0004, HEAD_FRONT + 0.0400
    add_ring2d(ab, outline, inner, x_rim1 - x_rim0, Mp, z0=x_rim0)
    x_pl1 = x_rim1 + 0.0105
    add_prism(ab, outline, x_pl1 - x_rim1 + 0.0004, Mp, z0=x_rim1 - 0.0004, bevel=0.0016, seg=2)
    # raised gasket lip around the upper half (valve-cover seal face)
    lip_in = offset_loop(outline, 0.0075)
    add_ring2d(mb, outline, lip_in, 0.0042, Mp, z0=x_pl1 - 0.0002)
    # piston-cylinder domes coaxial with the camshafts
    for (cy, r, h) in ((-CAM_Y, 0.0445, 0.034), (CAM_Y, 0.0415, 0.032)):
        prof = [(0, 0), (r, 0), (r, h * 0.62), (r - 0.0035, h * 0.86), (r - 0.010, h), (0.0172, h), (0.0172, h + 0.0012),
                (0, h + 0.0012)]
        add_lathe(ab, prof, 40, T(x_pl1 - 0.001, cy, CAM_Z) @ Ry(math.pi / 2))
        # machined piston cap (plug) with an 8 mm hex socket
        add_cyl(mb, 0.0168, 0.0042, T(x_pl1 + h + 0.0012, cy, CAM_Z) @ Ry(math.pi / 2), seg=32, z0=-0.001,
                bevel=0.0008)
        add_cyl(sb, 0.0052, 0.0008, T(x_pl1 + h + 0.0012 + 0.0030, cy, CAM_Z) @ Ry(math.pi / 2), seg=6)
        # 4 bolts on the dome flange
        for k in range(4):
            a = math.pi / 4 + k * math.pi / 2
            add_cyl(sb, 0.0040, 0.0040, T(x_pl1 + 0.0020, cy + (r + 0.0065) * math.cos(a),
                                          CAM_Z + (r + 0.0065) * math.sin(a)) @ Ry(math.pi / 2), seg=6, bevel=0.0005)
    # cast lattice ribs between the domes
    ribs = [((-0.016, 0.075), (-0.016, 0.178)), ((0.018, 0.075), (0.018, 0.172)),
            ((-0.016, 0.125), (0.018, 0.125)), ((-0.016, 0.100), (0.018, 0.150)),
            ((-0.090, 0.064), (0.090, 0.064))]
    for (a, b) in ribs:
        a, b = Vector(a), Vector(b)
        d = b - a
        M = T(x_pl1 + 0.0055, (a.x + b.x) / 2, (a.y + b.y) / 2) @ Rx(math.atan2(d.y, d.x))
        add_box(ab, 0.012, d.length, 0.0045, M, bevel=0.0012, seg=1)
    # perimeter flange bolts (to the head)
    for p in resample([Vector(q) for q in inner] + [Vector(inner[0])], 0.05)[:-1]:
        add_cyl(sb, 0.0046, 0.0045, T(x_pl1 + 0.0022, p.x, p.y) @ Ry(math.pi / 2), seg=6, bevel=0.0005)
    # intake solenoid: vertical (head up) on the intake end
    sx, sy = HEAD_FRONT + 0.027, 0.113
    add_cyl(mb, 0.0165, 0.080, T(sx, sy, 0.068), seg=24, z0=0.0, bevel=0.0015)
    add_cyl(sb, 0.0135, 0.010, T(sx, sy, 0.062), seg=6, bevel=0.001)
    add_box(kb, 0.024, 0.022, 0.024, T(sx, sy, 0.157), bevel=0.003, seg=2)
    add_box(ab, 0.030, 0.030, 0.030, T(sx - 0.002, sy - 0.004, 0.050), bevel=0.004, seg=2)    # oil gallery block
    # exhaust solenoid: horizontal, pointing to the exhaust side under the exhaust dome
    ex_y0, ex_y1, ez = -0.045, -0.128, 0.040
    add_cyl(mb, 0.0160, ex_y0 - ex_y1, T(sx, (ex_y0 + ex_y1) / 2, ez) @ Rx(math.pi / 2), seg=24, bevel=0.0015)
    add_cyl(sb, 0.0135, 0.010, T(sx, ex_y0 - 0.004, ez) @ Rx(math.pi / 2), seg=6, bevel=0.001)
    add_box(kb, 0.024, 0.022, 0.024, T(sx, ex_y1 - 0.010, ez), bevel=0.003, seg=2)
    add_box(ab, 0.032, 0.030, 0.026, T(sx - 0.002, -0.038, 0.046), bevel=0.004, seg=2)
    # oil feed: banjo bolt on the intake end + steel line down to the oil filter housing (front left of block)
    banjo = Vector((sx + 0.016, 0.100, 0.040))
    add_cyl(sb, 0.0095, 0.006, T(*banjo) @ Ry(math.pi / 2), seg=6, z0=0.0, bevel=0.0008)
    add_cyl(sb, 0.0105, 0.012, T(banjo.x - 0.008, banjo.y, banjo.z) @ Ry(math.pi / 2), seg=16)
    line = catmull([banjo + Vector((-0.008, 0.0, -0.010)), Vector((sx, 0.125, -0.010)),
                    Vector((HEAD_FRONT - 0.010, 0.165, -0.040)), Vector((HEAD_FRONT - 0.035, 0.190, -0.052))], 6)
    add_sweep(sb, line, circle_prof(0.0042, 8))
    return pc.objects()

# ----------------------------------------------------------------------------------------------
# Helpers to convert positions given in the car's (untilted) cross-section into the E frame
# ----------------------------------------------------------------------------------------------
def wE(x, yw, zw):
    """Point given as (E-frame x, car-left offset yw, height zw above the crank axis) -> E frame."""
    c, s = math.cos(TILT), math.sin(TILT)
    return Vector((x, yw * c + zw * s, -yw * s + zw * c))

def h2e(p):
    return Vector((p[0] + HEAD_X0, p[1], p[2] + HEAD_Z0))

R_LEVEL = Rx(-TILT)        # orientation in E of something that is level in the car
MP = Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # prism (u,v,w) -> (w,u,v): along x

# ----------------------------------------------------------------------------------------------
# ENGINE BLOCK (E frame) + lower timing cover, head gasket, bores and pistons
# ----------------------------------------------------------------------------------------------
def piston_drop(cyl):
    """Piston position below TDC at the export pose (crank at cyl-1 firing TDC)."""
    p = FIRING.index(cyl)
    th = (-120.0 * p) % 720.0 % 360.0 * D2R
    r = STROKE / 2
    return r * (1 - math.cos(th)) + ROD - math.sqrt(ROD ** 2 - (r * math.sin(th)) ** 2)

def build_block():
    pc = Piece("block")
    ab = pc.bm("alu_cast")
    L = BLOCK_LEN
    # crankcase (lower) profile
    lower = [(-0.084, 0.105), (0.084, 0.105), (0.140, 0.040), (0.140, -0.050), (0.147, -0.052), (0.147, -0.060),
             (-0.147, -0.060), (-0.147, -0.052), (-0.140, -0.050), (-0.140, 0.040)]
    add_prism(ab, lower, L, MP, z0=0.0, bevel=0.003, seg=2)
    # cylinder bank: core + 6 elliptic barrels (shows the six cylinders on the outside)
    add_box(ab, L, 0.164, 0.120, T(L / 2, 0.0, 0.145), bevel=0.003, seg=1)
    for ci in range(6):
        add_cyl(ab, 1.0, 0.118, T(CYL_X[ci], 0.001, 0.0) @ Sc(0.0485, 0.0965, 1.0), seg=40, z0=0.085)
    # deck plate
    add_box(ab, L, 0.199, 0.014, T(L / 2, 0.0015, DECK_Z - 0.007), bevel=0.002, seg=1)
    # bearing-plane ribs on the crankcase sides + rear flange
    for bx in BEAR_X:
        for sy in (-1, 1):
            add_box(ab, 0.010, 0.010, 0.085, T(bx, sy * 0.143, -0.008), bevel=0.002, seg=1)
    flange = [(-0.155, -0.064), (0.155, -0.064), (0.158, 0.06), (0.105, 0.150), (0.100, DECK_Z - 0.002),
              (-0.098, DECK_Z - 0.002), (-0.104, 0.150), (-0.158, 0.06)]
    add_prism(ab, flange, 0.014, MP, z0=0.0, bevel=0.002, seg=1)
    # engine mount brackets (both sides, between cyl 2 and 3)
    for sy in (-1, 1):
        add_box(pc.bm("steel_dark"), 0.070, 0.050, 0.012, T(0.40, sy * 0.170, 0.010) @ Rx(sy * 0.35), bevel=0.003)
    block = pc.objects()
    body = join(block, "block_tmp")
    # bores (boolean)
    cut = Piece("bores")
    cb = cut.bm("alu_cast")
    for ci in range(6):
        add_cyl(cb, BORE / 2, 0.11, T(CYL_X[ci], 0, DECK_Z + 0.01), seg=40, z0=-0.11)
    boolean(body, cut.objects())
    det = Piece("block_det")
    lb = det.bm("steel_dark")
    pb = det.bm("alu_machined")
    for ci in range(6):
        cyl = ci + 1
        # cast-iron liner rim + piston crown at its export-pose height
        add_tube(lb, BORE / 2 + 0.0035, BORE / 2 - 0.0002, 0.025, T(CYL_X[ci], 0, DECK_Z - 0.0003 - 0.025), seg=40,
                 z0=0.0)
        top = DECK_Z - 0.0008 - piston_drop(cyl)
        add_lathe(pb, [(0, top - 0.045), (BORE / 2 - 0.0004, top - 0.045), (BORE / 2 - 0.0004, top - 0.002),
                       (BORE / 2 - 0.0020, top), (0.020, top + 0.0012), (0, top + 0.0014)], 40,
                  T(CYL_X[ci], 0, 0))
    # head gasket (MLS steel) with bore holes
    gk = Piece("gasket")
    add_box(gk.bm("steel_dark"), L - 0.004, 0.196, 0.0011, T(L / 2, 0.0015, DECK_Z + 0.00075))
    g = gk.objects()[0]
    gc = Piece("gcut")
    for ci in range(6):
        add_cyl(gc.bm("alu_cast"), BORE / 2 + 0.0015, 0.01, T(CYL_X[ci], 0, DECK_Z), seg=40)
    boolean(g, gc.objects())
    # lower timing cover (front of block, up to the VANOS)
    tc = Piece("tcover")
    tb = tc.bm("alu_cast")
    out = [(-0.136, -0.058), (0.136, -0.058), (0.136, 0.020), (0.104, 0.095), (0.098, HEAD_Z0 + 0.052),
           (0.040, HEAD_Z0 + 0.054), (-0.040, HEAD_Z0 + 0.050), (-0.100, HEAD_Z0 + 0.050), (-0.104, 0.095),
           (-0.136, 0.020)]
    add_prism(tb, out, 0.038, MP, z0=L, bevel=0.006, seg=3)
    add_cyl(tb, 0.050, 0.012, T(L + 0.042, 0.085, 0.150) @ Ry(math.pi / 2), seg=32, bevel=0.002)  # water pump boss
    add_cyl(tb, 0.042, 0.010, T(L + 0.041, 0.0, 0.0) @ Ry(math.pi / 2), seg=32, bevel=0.002)      # crank seal boss
    add_cyl(tc.bm("steel"), 0.013, 0.012, T(L + 0.030, -0.104, 0.205) @ Rx(math.pi / 2), seg=6, bevel=0.0015)  # tensioner plug
    for k in range(10):
        a = 2 * math.pi * k / 10
        add_cyl(tc.bm("steel"), 0.0045, 0.004, T(L + 0.040, 0.118 * math.cos(a) * 0.95,
                                                    0.06 + 0.12 * math.sin(a)) @ Ry(math.pi / 2), seg=6)
    # dipstick tube + handle (left side, front)
    db = det.bm("steel")
    p0 = wE(0.50, 0.135, -0.05)
    tube = catmull([p0, wE(0.52, 0.150, 0.10), wE(0.55, 0.135, 0.26), wE(0.56, 0.120, 0.33)], 8)
    add_sweep(db, tube, circle_prof(0.0055, 8))
    add_box(det.bm("copper"), 0.026, 0.008, 0.030, Matrix.Translation(wE(0.56, 0.118, 0.345)) @ R_LEVEL, bevel=0.003, seg=2)
    return [body, g] + det.objects() + tc.objects()

# ----------------------------------------------------------------------------------------------
# OIL PAN (E frame) - aluminium, shallow front over the front axle carrier, deep rear sump,
# bottom level in the car (engine is tilted)
# ----------------------------------------------------------------------------------------------
def clip_halfplane(poly, a, b, c):
    """Keep points with a*y + b*z >= c (Sutherland-Hodgman)."""
    out = []
    n = len(poly)
    for i in range(n):
        P, Q = poly[i], poly[(i + 1) % n]
        fp = a * P[0] + b * P[1] - c
        fq = a * Q[0] + b * Q[1] - c
        if fp >= 0:
            out.append(P)
        if (fp >= 0) != (fq >= 0):
            t = fp / (fp - fq)
            out.append((P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])))
    return out

def pan_section(zw_bottom, half_w=0.139, top=-0.061):
    poly = [(-half_w, top), (half_w, top), (half_w - 0.010, -0.45), (-half_w + 0.010, -0.45)]
    s, c = math.sin(TILT), math.cos(TILT)
    return clip_halfplane(poly, s, c, zw_bottom)       # zw = y sin + z cos >= bottom

def build_oil_pan():
    pc = Piece("pan")
    ab = pc.bm("alu_cast")
    add_prism(ab, [(-0.147, -0.068), (0.147, -0.068), (0.147, -0.0605), (-0.147, -0.0605)], BLOCK_LEN - 0.006, MP,
              z0=0.003, bevel=0.0015)
    shallow = pan_section(-0.150)
    deep = pan_section(-0.245, half_w=0.132)
    add_prism(ab, shallow, BLOCK_LEN - 0.28, MP, z0=0.27, bevel=0.012, seg=3)
    add_prism(ab, deep, 0.29, MP, z0=0.012, bevel=0.014, seg=3)
    # cooling ribs under the deep sump (level in the car) + drain plug
    for k in range(5):
        x = 0.05 + k * 0.05
        p = wE(x, -0.01, -0.247)
        add_box(ab, 0.006, 0.20, 0.010, Matrix.Translation(p) @ R_LEVEL, bevel=0.002)
    add_cyl(pc.bm("steel"), 0.010, 0.010, Matrix.Translation(wE(0.20, 0.06, -0.250)) @ R_LEVEL, seg=6, bevel=0.001)
    return pc.objects()

# ----------------------------------------------------------------------------------------------
# VALVE COVER (H frame): black plastic shell with front nose over the VANOS, ribbed coil cover with
# raised BMW letters, oil filler cap, coils, hold-down nuts
# ----------------------------------------------------------------------------------------------
VC_TOP = RAIL_Z + 0.066
VC_NOSE_X = 0.403

def text_mesh(txt, size, extrude, M, mat_piece_bm=None):
    cu = bpy.data.curves.new("txt", "FONT")
    cu.body = txt
    fp = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
    if os.path.exists(fp):
        cu.font = bpy.data.fonts.load(fp, check_existing=True)
    cu.size = size
    cu.extrude = extrude
    cu.align_x = "CENTER"
    cu.align_y = "CENTER"
    cu.resolution_u = 3
    cu.space_character = 1.05
    ob = bpy.data.objects.new("txt", cu)
    bpy.context.scene.collection.objects.link(ob)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob, do_unlink=True)
    me.transform(M)
    o = bpy.data.objects.new("txtmesh", me)
    bpy.context.scene.collection.objects.link(o)
    return o

def build_valve_cover():
    pc = Piece("vcover")
    kb = pc.bm("plastic_black")
    x0, x1 = -0.314, 0.300
    # outer shell: rounded box (bottom edges extend below the rail, hidden in the head's top)
    add_box(kb, x1 - x0, 0.226, VC_TOP - RAIL_Z + 0.03, T((x0 + x1) / 2, 0.0, (VC_TOP + RAIL_Z - 0.03) / 2),
            bevel=0.026, seg=4)
    # nose over the VANOS
    add_box(kb, VC_NOSE_X - 0.26, 0.246, VC_TOP - 0.083, T((VC_NOSE_X + 0.26) / 2, -0.010, (VC_TOP + 0.083) / 2 - 0.004),
            bevel=0.030, seg=4)
    shell = pc.objects()[0]
    inner = Piece("vc_in")
    ib = inner.bm("plastic_black")
    add_box(ib, x1 - x0 - 0.008, 0.218, VC_TOP - RAIL_Z + 0.03, T((x0 + x1) / 2, 0.0, (VC_TOP + RAIL_Z - 0.03) / 2 - 0.004),
            bevel=0.022, seg=2)
    add_box(ib, VC_NOSE_X - 0.26 - 0.008, 0.238, VC_TOP - 0.083 - 0.004,
            T((VC_NOSE_X + 0.26) / 2 - 0.004, -0.010, (VC_TOP + 0.083) / 2 - 0.008), bevel=0.026, seg=2)
    # open the underside: cut everything below the rail plane (main) and below the nose bottom
    add_box(ib, 0.9, 0.5, 0.2, T(0.0, 0.0, RAIL_Z - 0.1))
    add_box(ib, 0.2, 0.5, 0.2, T(0.36, 0.0, 0.083 - 0.1 + 0.0004))
    boolean(shell, inner.objects())
    # gasket flange lip along the rail
    det = Piece("vc_det")
    fb = det.bm("plastic_black")
    sb = det.bm("steel")
    rb = det.bm("rubber")
    mb = det.bm("alu_machined")
    add_box(fb, x1 - x0 + 0.006, 0.232, 0.007, T((x0 + x1) / 2 - 0.003, 0.0, RAIL_Z + 0.0036), bevel=0.0025, seg=1)
    # hold-down nuts with rubber grommets along both sides
    for i in range(7):
        x = x0 + 0.04 + i * (x1 - x0 - 0.08) / 6
        for sy in (-1, 1):
            p = (x, sy * 0.103, RAIL_Z + 0.030)
            add_cyl(rb, 0.0105, 0.004, T(*p), seg=16, z0=0.0, bevel=0.001)
            add_cyl(sb, 0.0072, 0.007, T(p[0], p[1], p[2] + 0.004), seg=6, z0=0.0, bevel=0.0008)
    # coil cover (raised, ribbed) on top over the plug line
    cx0, cx1 = -0.272, 0.215
    add_box(fb, cx1 - cx0, 0.126, 0.026, T((cx0 + cx1) / 2, 0.0, VC_TOP + 0.006), bevel=0.008, seg=3)
    ztop = VC_TOP + 0.019
    lx0, lx1 = 0.075, 0.190            # BMW logo panel
    nrib = 11
    for k in range(nrib):
        y = -0.050 + 0.100 * k / (nrib - 1)
        for (a, b) in ((cx0 + 0.012, lx0 - 0.006), (lx1 + 0.006, cx1 - 0.012)):
            add_box(mb, b - a, 0.0042, 0.0034, T((a + b) / 2, y, ztop + 0.0012), bevel=0.0012, seg=1)
    add_box(fb, lx1 - lx0, 0.112, 0.0022, T((lx0 + lx1) / 2, 0.0, ztop + 0.0005), bevel=0.001, seg=1)
    # oil filler cap (front, intake-side shoulder) with grip ribs
    cap_p = (0.215, 0.080, VC_TOP - 0.004)
    add_cyl(fb, 0.031, 0.021, T(*cap_p), seg=32, z0=0.0, bevel=0.004)
    for k in range(12):
        a = 2 * math.pi * k / 12
        add_box(fb, 0.006, 0.004, 0.016, T(cap_p[0] + 0.031 * math.cos(a), cap_p[1] + 0.031 * math.sin(a),
                                            cap_p[2] + 0.009) @ Rz(a), bevel=0.001)
    add_box(fb, 0.008, 0.040, 0.008, T(cap_p[0], cap_p[1], cap_p[2] + 0.023), bevel=0.003, seg=2)
    # ignition coils under the coil cover: bodies + boots down into the plug wells
    for ci in range(6):
        xh = CYL_X[ci] - HEAD_X0
        add_box(fb, 0.030, 0.070, 0.016, T(xh, 0.004, VC_TOP - 0.004), bevel=0.004, seg=1)
        add_cyl(det.bm("rubber"), 0.0115, VC_TOP - 0.004 - 0.075, T(xh, 0, 0.075), seg=16, z0=0.0)
    obs = [shell] + det.objects()
    # BMW letters: read from the car's right side (rear -> front), letter tops toward the intake side
    t = text_mesh("BMW", 0.040, 0.0016, T((lx0 + lx1) / 2, 0.0, ztop + 0.0035) @ Rz(0.0))
    t.data.materials.append(MATS["alu_machined"])
    obs.append(t)
    return obs

# ----------------------------------------------------------------------------------------------
# INTAKE MANIFOLD (E frame): plastic resonance manifold, 6 ram tubes arching over to a split plenum
# low on the left, DISA flap valve on the plenum's outer side, throttle body at the front, fuel rail cover
# ----------------------------------------------------------------------------------------------
def runner_path(x):
    pc = h2e(INTAKE_PORT_C + Vector((x - HEAD_X0, 0, 0)))
    d = h2e(INTAKE_PORT_C + INTAKE_PORT_DIR + Vector((x - HEAD_X0, 0, 0))) - pc
    d.normalize()
    p0 = pc - d * 0.010
    p1 = pc + d * 0.030
    c1 = pc + d * 0.085
    apex = wE(x, 0.075, 0.405)
    pa = wE(x, 0.150, 0.355)
    pe = wE(x, 0.255, 0.212)
    pts = [p0, p1] + bezier(p1, c1, wE(x, 0.020, 0.420), apex, 10)[1:] + \
        bezier(apex, wE(x, 0.120, 0.392), wE(x, 0.135, 0.380), pa, 4)[1:] + \
        bezier(pa, wE(x, 0.200, 0.315), wE(x, 0.250, 0.290), pe, 8)[1:]
    return pts

def build_intake():
    pc = Piece("intake")
    kb = pc.bm("plastic_black")
    mb = pc.bm("alu_machined")
    sb = pc.bm("steel")
    rb = pc.bm("rubber")
    # head flange (on the sloped port face)
    c = h2e(INTAKE_PORT_C)
    d = INTAKE_PORT_DIR
    M = T(c.x, c.y, c.z) @ Matrix(((1, 0, 0, 0), (0, d.y, -d.z, 0), (0, d.z, d.y, 0), (0, 0, 0, 1)))
    # local: x along engine, y along port axis, z perpendicular (up the face)
    Mf = T(HEAD_X0, c.y, c.z) @ Rx(math.atan2(d.z, d.y) - math.pi / 2)
    add_box(kb, HEAD_LEN - 0.03, 0.050, 0.010, Mf @ T(0, 0, 0.007), bevel=0.003, seg=1)
    # runners
    for ci in range(6):
        path = runner_path(CYL_X[ci])
        add_sweep(kb, path, rrect_prof(0.046, 0.040, 0.014, 3), up=(1, 0, 0))
        # injector boss + injector into the runner near the head
        p = path[2] + (wE(CYL_X[ci], -0.030, 0.400) - path[2]).normalized() * 0.010
        inj_top = wE(CYL_X[ci], -0.020, 0.372)
        add_sweep(sb, [path[2], inj_top], circle_prof(0.0075, 10))
    # fuel rail + ribbed injector cover (parallel to the coil cover)
    rail_c = wE(HEAD_X0, -0.022, 0.378)
    add_cyl(sb, 0.009, 0.52, Matrix.Translation(rail_c) @ Ry(math.pi / 2), seg=12, bevel=0.002)
    cov_c = wE(HEAD_X0 + 0.02, -0.022, 0.392)
    Mc = Matrix.Translation(cov_c) @ Rx(-TILT * 0.35)
    add_box(kb, 0.53, 0.070, 0.020, Mc, bevel=0.007, seg=3)
    for k in range(3):
        add_box(mb, 0.50, 0.0055, 0.0030, Mc @ T(0, -0.016 + 0.016 * k, 0.0105), bevel=0.0013, seg=1)
    # split plenum (front: cyl 1-3, rear: cyl 4-6) with neck + DISA valve between
    pc_y, pc_z = 0.262, 0.140
    for (xa, xb) in ((0.330, 0.585), (0.025, 0.290)):
        p = wE((xa + xb) / 2, pc_y, pc_z)
        add_box(kb, xb - xa, 0.098, 0.150, Matrix.Translation(p) @ R_LEVEL, bevel=0.032, seg=4)
    add_box(kb, 0.10, 0.070, 0.090, Matrix.Translation(wE(0.31, pc_y + 0.008, pc_z - 0.012)) @ R_LEVEL,
            bevel=0.022, seg=3)
    # resonance tube along the top outer edge connecting both halves
    add_sweep(kb, [wE(0.08, pc_y + 0.030, pc_z + 0.050), wE(0.31, pc_y + 0.042, pc_z + 0.062),
                   wE(0.54, pc_y + 0.030, pc_z + 0.050)], circle_prof(0.026, 16), up=(0, 0, 1))
    # DISA valve: flange + body + actuator with connector, pointing out to the left of the car
    base = wE(0.31, pc_y + 0.043, pc_z - 0.015)
    Mout = Matrix.Translation(base) @ R_LEVEL @ Rz(-math.pi / 2) @ Rx(-math.pi / 2)   # local +Z -> car left
    Mout = Matrix.Translation(base) @ R_LEVEL @ Rx(-math.pi / 2)
    add_box(kb, 0.062, 0.062, 0.008, Mout @ T(0, 0, 0.004), bevel=0.004, seg=1)
    add_cyl(kb, 0.026, 0.050, Mout @ T(0, 0, 0.008), seg=24, z0=0.0, bevel=0.003)
    add_cyl(kb, 0.031, 0.022, Mout @ T(0, 0, 0.058), seg=24, z0=0.0, bevel=0.004)
    add_box(kb, 0.022, 0.016, 0.026, Mout @ T(0, 0.030, 0.070), bevel=0.003, seg=1)
    for k in range(4):
        a = math.pi / 4 + k * math.pi / 2
        add_cyl(sb, 0.004, 0.004, Mout @ T(0.024 * math.cos(a), 0.024 * math.sin(a), 0.010), seg=6, z0=0.0)
    # throttle body (EDK) at the front end of the front plenum + rubber boot toward the airbox
    tb_c = wE(0.585, pc_y, pc_z + 0.01)
    add_cyl(mb, 0.040, 0.050, Matrix.Translation(tb_c) @ Ry(math.pi / 2), seg=32, z0=0.0, bevel=0.003)
    add_box(kb, 0.050, 0.060, 0.070, Matrix.Translation(wE(0.612, pc_y + 0.055, pc_z + 0.01)) @ R_LEVEL,
            bevel=0.008, seg=2)                    # throttle actuator housing
    boot = [tb_c + Vector((0.048, 0, 0)), wE(0.70, pc_y + 0.02, pc_z + 0.03), wE(0.78, pc_y + 0.08, pc_z + 0.06)]
    boot = catmull(boot, 6)
    add_sweep(rb, boot, circle_prof(0.042, 20), up=(0, 0, 1))
    return pc.objects()

# ----------------------------------------------------------------------------------------------
# EXHAUST MANIFOLDS (E frame): two cast 3-into-1 manifolds with close-coupled catalysts
# ----------------------------------------------------------------------------------------------
EXH_OUTLETS = []

def build_exhaust():
    EXH_OUTLETS.clear()
    pc = Piece("exhaust")
    db = pc.bm("steel_dark")
    sb = pc.bm("steel")
    groups = [(0, 1, 2), (3, 4, 5)]
    for gi, g in enumerate(groups):
        xs = [CYL_X[i] for i in g]
        xm = xs[1] - 0.02
        # flange plate on the head face
        fx0, fx1 = max(xs) + 0.036, min(xs) - 0.036
        fc = h2e((0.0, EXHAUST_PORT_C.y - 0.006, EXHAUST_PORT_C.z))
        add_box(db, fx0 - fx1, 0.012, 0.056, T((fx0 + fx1) / 2, fc.y, fc.z), bevel=0.003, seg=1)
        coll = wE(xm, -0.300, 0.040)
        for x in xs:
            p0 = h2e((x - HEAD_X0, EXHAUST_PORT_C.y - 0.004, EXHAUST_PORT_C.z))
            pts = [p0, p0 + Vector((0, -0.028, 0)), wE(x + (xm - x) * 0.35, -0.268, 0.125),
                   wE(x + (xm - x) * 0.8, -0.296, 0.070), coll]
            add_sweep(db, catmull(pts, 6), circle_prof(0.0185, 14), up=(1, 0, 0))
            # studs + nuts
            for dz in (-0.020, 0.020):
                q = h2e((x - HEAD_X0 + (0.024 if dz > 0 else -0.024), EXHAUST_PORT_C.y - 0.012, EXHAUST_PORT_C.z + dz))
                add_cyl(sb, 0.0058, 0.008, T(*q) @ Rx(math.pi / 2), seg=6, bevel=0.0008)
        # collector cone + catalyst can down and back + outlet pipe
        c0 = wE(xm, -0.300, 0.035)
        c1 = wE(xm - 0.06, -0.300, -0.020)
        can0 = wE(xm - 0.08, -0.297, -0.040)
        can1 = wE(xm - 0.22, -0.270, -0.170)
        add_sweep(db, [c0, c1, can0], circle_prof(0.030, 18), scales=[1.0, 1.4, 1.8], up=(1, 0, 0))
        add_sweep(sb, resample([can0, can1], 0.02), circle_prof(0.058, 24), up=(1, 0, 0))
        # heat-shield ribs on the can
        axis = (can1 - can0)
        for k in range(1, 6):
            p = can0 + axis * (k / 6)
            add_cyl(sb, 0.061, 0.006, Matrix.Translation(p) @ align_z(axis), seg=24)
        out_end = wE(-0.10, -0.205 if gi == 0 else -0.275, -0.225)
        mid = wE(xm - 0.30, -0.24 if gi == 0 else -0.28, -0.215)
        pipe = catmull([can1, can1 + axis.normalized() * 0.04, mid, out_end], 6)
        add_sweep(db, pipe, circle_prof(0.026, 14), up=(1, 0, 0))
        add_cyl(db, 0.042, 0.008, Matrix.Translation(out_end) @ Ry(-math.pi / 2), seg=20, bevel=0.002)
        EXH_OUTLETS.append(out_end)
        # oxygen sensors (pre-cat on the collector, post-cat on the outlet)
        for pp, dirv in ((c0 + Vector((0.0, -0.01, 0.0)), wE(0, -0.6, 0.8) - wE(0, 0, 0)),
                         (can1 + axis.normalized() * 0.05, wE(0, -0.4, -0.4) - wE(0, 0, 0))):
            add_cyl(sb, 0.0095, 0.040, Matrix.Translation(pp) @ align_z(dirv), seg=12, z0=0.02)
            add_cyl(sb, 0.012, 0.010, Matrix.Translation(pp) @ align_z(dirv), seg=6, z0=0.03)
    return pc.objects()

# ----------------------------------------------------------------------------------------------
# FRONT: crank damper, water pump pulley, alternator, power-steering pump, A/C compressor, belts,
# oil filter housing (E frame).  Fan is a child node.
# ----------------------------------------------------------------------------------------------
BELT_X = BLOCK_LEN + 0.064
WP = (0.085, 0.150)
PULLEYS = {"crank": ((0.0, 0.0), 0.083), "alt": ((0.175, -0.040), 0.029), "wp": (WP, 0.055),
           "ps": ((0.088, -0.122), 0.060), "ac": ((-0.200, -0.070), 0.058)}

def add_pulley(bm, rb, c, r, x0, w, grooves=5, M=Matrix.Identity(4)):
    prof = [(0, x0), (r - 0.002, x0), (r, x0 + 0.002)]
    for g in range(grooves):
        z = x0 + 0.003 + (w - 0.006) * (g + 0.5) / grooves
        prof += [(r, z - 0.0018), (r - 0.0016, z), (r, z + 0.0018)]
    prof += [(r, x0 + w - 0.002), (r - 0.002, x0 + w), (r * 0.45, x0 + w), (r * 0.40, x0 + w + 0.004),
             (0, x0 + w + 0.004)]
    add_lathe(bm, prof, 40, M @ T(0, c[0], c[1]) @ Ry(math.pi / 2) @ Rz(0) @ Matrix(((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1))))

def lathe_x(bm, prof, c, seg=32):
    """Lathe around an axis parallel to E x through (y, z) = c; profile (r, x)."""
    add_lathe(bm, prof, seg, T(0, c[0], c[1]) @ Ry(math.pi / 2) @ Rz(math.pi / 2))

def build_front():
    pc = Piece("front")
    sb = pc.bm("steel")
    db = pc.bm("steel_dark")
    ab = pc.bm("alu_cast")
    kb = pc.bm("plastic_black")
    rb = pc.bm("rubber")
    bx = BELT_X
    # crank vibration damper / pulley
    lathe_x(db, [(0, bx - 0.030), (0.030, bx - 0.030), (0.034, bx - 0.012), (0.075, bx - 0.012), (0.083, bx - 0.010),
                 (0.083, bx + 0.020), (0.078, bx + 0.024), (0.040, bx + 0.024), (0.036, bx + 0.030), (0, bx + 0.030)],
            PULLEYS["crank"][0], 48)
    lathe_x(rb, [(0.0665, bx + 0.0238), (0.0705, bx + 0.0238), (0.0705, bx + 0.0246), (0.0665, bx + 0.0246)],
            PULLEYS["crank"][0], 48)
    for k in range(6):
        a = 2 * math.pi * k / 6
        add_cyl(sb, 0.0055, 0.006, T(bx + 0.032, 0.022 * math.cos(a), 0.022 * math.sin(a)) @ Ry(math.pi / 2), seg=6)
    # A/C groove (rear) on the damper
    lathe_x(db, [(0.04, bx - 0.031), (0.074, bx - 0.031), (0.074, bx - 0.012), (0.04, bx - 0.012)], (0, 0), 40)
    # water pump pulley
    c = PULLEYS["wp"][0]
    lathe_x(sb, [(0, bx - 0.012), (0.053, bx - 0.012), (0.055, bx - 0.010), (0.055, bx + 0.012), (0.050, bx + 0.014),
                 (0.025, bx + 0.014), (0, bx + 0.014)], c, 40)
    # alternator (body behind its pulley)
    c, r = PULLEYS["alt"]
    lathe_x(ab, [(0, bx - 0.150), (0.058, bx - 0.150), (0.064, bx - 0.140), (0.064, bx - 0.040), (0.058, bx - 0.028),
                 (0.020, bx - 0.022), (0, bx - 0.022)], c, 36)
    for k in range(12):
        a = 2 * math.pi * k / 12
        add_box(ab, 0.060, 0.004, 0.010, T(bx - 0.090, c[0] + 0.065 * math.cos(a), c[1] + 0.065 * math.sin(a)) @ Rx(a),
                bevel=0.0012)
    lathe_x(sb, [(0, bx - 0.022), (0.012, bx - 0.022), (0.012, bx - 0.012), (r, bx - 0.012), (r, bx + 0.012),
                 (0.012, bx + 0.012), (0.010, bx + 0.020), (0, bx + 0.020)], c, 24)
    # power-steering pump
    c, r = PULLEYS["ps"]
    lathe_x(db, [(0, bx - 0.085), (0.045, bx - 0.085), (0.048, bx - 0.075), (0.048, bx - 0.028), (0.020, bx - 0.020),
                 (0, bx - 0.020)], c, 28)
    lathe_x(sb, [(0, bx - 0.020), (r - 0.002, bx - 0.012), (r, bx - 0.010), (r, bx + 0.012), (r - 0.004, bx + 0.014),
                 (0.02, bx + 0.014), (0, bx + 0.014)], c, 36)
    # A/C compressor (rear groove plane)
    c, r = PULLEYS["ac"]
    lathe_x(ab, [(0, bx - 0.190), (0.055, bx - 0.190), (0.062, bx - 0.180), (0.062, bx - 0.060), (0.055, bx - 0.050),
                 (0, bx - 0.050)], c, 32)
    lathe_x(sb, [(0, bx - 0.050), (r, bx - 0.050), (r, bx - 0.012), (0.02, bx - 0.010), (0, bx - 0.010)], c, 36)
    # tensioner (spring-loaded idler) on the main belt between alternator and water pump
    tens_c = (0.168, 0.075)
    lathe_x(sb, [(0, bx - 0.012), (0.032, bx - 0.012), (0.032, bx + 0.012), (0, bx + 0.012)], tens_c, 28)
    lathe_x(db, [(0, bx - 0.040), (0.018, bx - 0.040), (0.018, bx - 0.012), (0, bx - 0.012)], tens_c, 16)
    # belts: main (crank, ps, alt, tensioner, wp) and A/C (crank rear groove, compressor)
    def V2(t):
        return Vector(t)
    main = [(V2(PULLEYS["alt"][0]), PULLEYS["alt"][1]), (V2(tens_c), 0.032), (V2(PULLEYS["wp"][0]), PULLEYS["wp"][1]),
            (V2(PULLEYS["crank"][0]), PULLEYS["crank"][1]), (V2(PULLEYS["ps"][0]), PULLEYS["ps"][1])]
    path = belt_path(main, n_arc=48)
    add_sweep(rb, [Vector((bx, p.x, p.y)) for p in path], [(0.0, -0.011), (0.0045, -0.011), (0.0045, 0.011), (0.0, 0.011)],
              closed=True, cap=False, up=(1, 0, 0), frames=_belt_frames(path, bx))
    ac = [(V2(PULLEYS["crank"][0]), 0.0745), (V2(PULLEYS["ac"][0]), PULLEYS["ac"][1])]
    path2 = belt_path(ac, n_arc=48)
    add_sweep(rb, [Vector((bx - 0.0215, p.x, p.y)) for p in path2],
              [(0.0, -0.008), (0.004, -0.008), (0.004, 0.008), (0.0, 0.008)], closed=True, cap=False,
              frames=_belt_frames(path2, bx - 0.0215))
    # oil filter housing (front left of the block, canister vertical in the car) + bracket
    ofh = wE(0.575, 0.092, 0.200)
    add_cyl(kb, 0.042, 0.095, Matrix.Translation(ofh) @ R_LEVEL, seg=32, z0=0.0, bevel=0.004)
    add_cyl(kb, 0.034, 0.012, Matrix.Translation(ofh) @ R_LEVEL, seg=6, z0=0.095, bevel=0.002)
    add_cyl(ab, 0.046, 0.030, Matrix.Translation(ofh) @ R_LEVEL, seg=32, z0=-0.030, bevel=0.003)
    add_sweep(ab, [ofh + R_LEVEL.to_3x3() @ Vector((0, 0, -0.015)), wE(0.575, 0.050, 0.160), wE(0.575, 0.020, 0.130)],
              rrect_prof(0.040, 0.030, 0.008, 2), up=(1, 0, 0))
    return pc.objects()

def _belt_frames(path, x):
    """Frames for a belt in the plane x = const: n = +x (belt width), b = outward normal."""
    P = [Vector((x, p.x, p.y)) for p in path]
    n = len(P)
    frames = []
    cen = sum(P, Vector()) / n
    for i in range(n):
        t = (P[(i + 1) % n] - P[i - 1]).normalized()
        nn = Vector((1, 0, 0))
        b = t.cross(nn)
        if b.dot(P[i] - cen) < 0:
            b = -b
        # keep (t, n, b) right-handed: b = t x n
        nn = b.cross(t)
        frames.append((t, nn, b))
    return frames

def build_fan():
    """Viscous fan clutch + 9-blade fan on the water-pump axis. Local frame: origin on the axis at the
    clutch's rear face; local +X forward (E axes)."""
    pc = Piece("fan")
    ab = pc.bm("alu_cast")
    kb = pc.bm("plastic_black")
    sb = pc.bm("steel")
    # clutch body with radial fins
    add_lathe(ab, [(0, 0.0), (0.030, 0.0), (0.040, 0.008), (0.062, 0.010), (0.064, 0.040), (0.058, 0.048), (0.030, 0.052),
                   (0, 0.052)], 48, Ry(math.pi / 2) @ Rz(math.pi / 2))
    for k in range(24):
        a = 2 * math.pi * k / 24
        add_box(ab, 0.032, 0.0025, 0.016, T(0.030, 0.056 * math.cos(a), 0.056 * math.sin(a)) @ Rx(a), bevel=0.0006)
    add_cyl(sb, 0.016, 0.006, T(0.054, 0, 0) @ Ry(math.pi / 2), seg=24, z0=0.0, bevel=0.0015)
    # spider + blades
    add_lathe(kb, [(0.060, 0.044), (0.085, 0.044), (0.085, 0.060), (0.060, 0.060)], 40, Ry(math.pi / 2) @ Rz(math.pi / 2))
    nb = 9
    for k in range(nb):
        a0 = 2 * math.pi * k / nb
        rows = []
        for j, r in enumerate([0.072, 0.11, 0.15, 0.185, 0.200]):
            chord = [0.050, 0.060, 0.066, 0.064, 0.050][j]
            pitch = [42, 34, 28, 24, 22][j] * D2R
            rows.append((r, chord, pitch))
        # blade as a swept thin profile along the radius
        path = []
        frames = []
        for (r, chord, pitch) in rows:
            path.append(Vector((0.052, r * math.cos(a0), r * math.sin(a0))))
        radial = Vector((0, math.cos(a0), math.sin(a0)))
        tang = Vector((0, -math.sin(a0), math.cos(a0)))
        for (r, chord, pitch) in rows:
            # chord direction: mostly tangential, tilted toward x by pitch
            cd = (tang * math.cos(pitch) + Vector((1, 0, 0)) * math.sin(pitch)).normalized()
            nn = cd
            b = radial.cross(nn)
            frames.append((radial, nn, b))
        prof = [(-0.5, 0.0), (-0.3, 0.0035), (0.2, 0.0045), (0.5, 0.0), (0.2, -0.0012), (-0.3, -0.0010)]
        rings = []
        verts_all = []
        for i, (r, chord, pitch) in enumerate(rows):
            t, nn, b = frames[i]
            ring = [kb.verts.new(path[i] + nn * (u * chord) + b * v) for (u, v) in prof]
            rings.append(ring)
        for i in range(len(rings) - 1):
            A, B = rings[i], rings[i + 1]
            m = len(prof)
            for q in range(m):
                q2 = (q + 1) % m
                kb.faces.new((A[q], A[q2], B[q2], B[q]))
        kb.faces.new(list(reversed(rings[0])))
        kb.faces.new(rings[-1])
    return pc.objects()

# ----------------------------------------------------------------------------------------------
# RADIATOR + fan shroud (car frame W)
# ----------------------------------------------------------------------------------------------
RAD_X = 1.790

def build_radiator(fan_center_w):
    pc = Piece("radiator")
    db = pc.bm("steel_dark")
    kb = pc.bm("plastic_black")
    ab = pc.bm("alu_cast")
    cy0, cy1, hw = 0.300, 0.715, 0.300
    # core with fin texture (horizontal tubes)
    add_box(db, 0.032, 2 * hw, cy1 - cy0, T(RAD_X, 0, (cy0 + cy1) / 2))
    for k in range(18):
        z = cy0 + 0.012 + k * (cy1 - cy0 - 0.024) / 17
        add_box(ab, 0.003, 2 * hw - 0.01, 0.004, T(RAD_X - 0.0170, 0, z))
    # side tanks (plastic) + filler / expansion tank on the right (car right = -Y in Blender)
    for sy in (-1, 1):
        add_box(kb, 0.052, 0.050, cy1 - cy0 + 0.04, T(RAD_X, sy * (hw + 0.022), (cy0 + cy1) / 2), bevel=0.008, seg=2)
    add_cyl(kb, 0.046, 0.150, T(RAD_X - 0.050, -(hw - 0.030), 0.640), seg=32, bevel=0.006)
    add_cyl(kb, 0.026, 0.020, T(RAD_X - 0.050, -(hw - 0.030), 0.722), seg=24, bevel=0.004)
    add_sweep(kb, [Vector((RAD_X - 0.05, -(hw - 0.03), 0.57)), Vector((RAD_X - 0.03, -(hw + 0.015), 0.55))],
              circle_prof(0.010, 10))
    # fan shroud: plate with a round opening + ring around the fan
    fc = Vector(fan_center_w)
    ring_r = 0.214
    N = 72
    outer = []
    inner = []
    sx0, sx1, sz0, sz1 = -hw + 0.01, hw - 0.01, cy0 + 0.005, cy1 + 0.02
    for k in range(N):
        a = 2 * math.pi * k / N
        dy, dz = math.cos(a), math.sin(a)
        # ray from the fan centre to the rectangle border
        ts = []
        for (lim, comp, base) in ((sx1, dy, fc.y), (sx0, dy, fc.y), (sz1, dz, fc.z), (sz0, dz, fc.z)):
            if abs(comp) > 1e-9:
                t = (lim - base) / comp
                if t > 0:
                    ts.append(t)
        t = min(ts)
        outer.append((fc.y + dy * t, fc.z + dz * t))
        inner.append((fc.y + dy * ring_r, fc.z + dz * ring_r))
    plate_x = RAD_X - 0.040
    add_ring2d(kb, outer, inner, 0.010, MP, z0=plate_x - 0.005)
    add_tube(kb, ring_r + 0.006, ring_r, 0.150, T(plate_x - 0.075, fc.y, fc.z) @ Ry(math.pi / 2), seg=72)
    # upper/lower hoses toward the engine (thermostat / water pump)
    return pc.objects()

# ----------------------------------------------------------------------------------------------
# ASSEMBLY
# ----------------------------------------------------------------------------------------------
def place(name, obs, M_frame, origin=(0, 0, 0), parent=None, extras=None):
    o = Vector(origin)
    for ob in obs:
        if ob.type == "MESH" and o.length > 0:
            ob.data.transform(T(-o.x, -o.y, -o.z))
    node = make_node(name, obs, M_frame @ T(o.x, o.y, o.z), parent=parent)
    if extras:
        for k, v in extras.items():
            node[k] = v
    return node

def build_all():
    reset_scene()
    nodes = {}
    rot_note = ("Export pose: crank at cylinder-1 firing TDC. Engine turns clockwise seen from the front; "
                "camshaft angle = crank angle / 2, i.e. rotate about local +X by -(crank angle)/2.")
    nodes["engine_block"] = place("engine_block", build_block(), M_E, (0, 0, 0), extras={
        "description": "M54B30 aluminium crankcase with cast-iron liners, pistons at the export pose, head gasket, lower timing cover, dipstick",
        "tilt_deg": TILT / D2R, "tilt_direction": "top of the engine leans to the car's right (exhaust side down)",
        "firing_order": "1-5-3-6-2-4", "cylinder_1": "front", "export_pose": rot_note})
    nodes["oil_pan"] = place("oil_pan", build_oil_pan(), M_E, (HEAD_X0, 0, -0.064))
    nodes["cylinder_head"] = place("cylinder_head", build_head(), M_H, (0, 0, 0), extras={
        "description": "Aluminium DOHC cross-flow head, 4 valves/cyl, bucket tappets, 7 cam bearings per shaft",
        "origin": "centre of the head's bottom (gasket) face; local +Y (glTF) = head up; zero the node rotation to undo the 30 deg tilt",
        "assembly_moves_with_head": ["camshaft_intake", "camshaft_exhaust", "valves", "vanos_unit",
                                     "vanos_sprocket_intake", "vanos_sprocket_exhaust", "valve_cover"]})
    for kind, name in (("in", "camshaft_intake"), ("ex", "camshaft_exhaust")):
        sgn = 1 if kind == "in" else -1
        nodes[name] = place(name, build_camshaft(kind), M_H @ T(0, sgn * CAM_Y, CAM_Z), (0, 0, 0), extras={
            "rotation": rot_note, "lobes": 12, "cam_lift_m": CAM_LIFT, "base_circle_r_m": CAM_BASE_R})
    vroot = empty_node("valves", M_H)
    vroot["description"] = ("24 valves. Each child valve_c{cyl}_{in|ex}{1=front,2=rear}: origin at the valve tip, "
                            "local +Y along the stem toward the camshaft. Valve, retainer and bucket move together; "
                            "open by translating along local -Y. Child 'spring_*' has its origin at the spring top; "
                            "compress it with scale.y = (H0 - lift)/H0.")
    vroot["lift_law"] = (f"lift = {CAM_LIFT} * cos(|d| / {LOBE_HALF} * 90deg)^{LOBE_EXP} for |d| < {LOBE_HALF} deg, else 0; "
                         "d = camshaft angle (deg, in the rotation sense, 0 = export pose) - peak_cam_deg")
    nodes["valves"] = vroot
    for v in VALVES:
        obs, spring, H0 = build_valve(v)
        lift0 = v["lift0"]
        Mv = M_H @ T(*(v["tip"] - v["axis"] * lift0)) @ align_z(v["axis"])
        vn = make_node(v["name"], obs, Mv, parent=vroot)
        vn["cylinder"] = v["cyl"]
        vn["kind"] = "intake" if v["kind"] == "in" else "exhaust"
        vn["valve_head_d_m"] = v["D"]
        vn["peak_cam_deg"] = round(v["peak_cam"], 3)
        vn["lift_at_export_m"] = round(lift0, 6)
        vn["closed_offset_local_y_m"] = round(lift0, 6)
        s = (H0 - lift0) / H0
        sp = make_node("spring_" + v["name"][6:], spring, Mv @ T(0, 0, SPRING_TOP) @ Sc(1, 1, s), parent=vn)
        # mesh was built with its top at SPRING_TOP in valve coordinates -> shift so origin = spring top
        sp.data.transform(T(0, 0, -SPRING_TOP))
        sp["installed_height_H0_m"] = round(H0, 5)
    nodes["timing_chain"] = place("timing_chain", build_timing_chain()[0], M_H, (PRI_X, 0, (CAM_Z - HEAD_Z0) / 2))
    for kind, name in (("in", "vanos_sprocket_intake"), ("ex", "vanos_sprocket_exhaust")):
        sgn = 1 if kind == "in" else -1
        nodes[name] = place(name, build_sprocket(kind), M_H @ T(SPROCKET_ORIGIN_X, sgn * CAM_Y, CAM_Z), (0, 0, 0),
                            extras={"description": ("VANOS sprocket: " + ("secondary-chain sprocket" if kind == "in" else
                                    "primary (crank) + secondary sprockets") + " on the helical-gear hub"),
                                    "vanos_shift": "turn about local X relative to the camshaft to show the timing shift"})
    nodes["vanos_unit"] = place("vanos_unit", build_vanos(), M_H, (HEAD_FRONT, 0, CAM_Z), extras={
        "description": "Double-VANOS housing bolted to the front of the head: two piston cylinders coaxial with the "
                       "camshafts (piston caps on the front), 2 solenoid valves, oil feed from the oil filter housing"})
    nodes["valve_cover"] = place("valve_cover", build_valve_cover(), M_H, (0.0, 0, RAIL_Z))
    pc = h2e(INTAKE_PORT_C)
    nodes["intake_manifold"] = place("intake_manifold", build_intake(), M_E, (HEAD_X0, pc.y, pc.z), extras={
        "description": "Plastic resonance intake (6 ram tubes, split plenum, DISA resonance flap valve on the left side, "
                       "throttle body at the front)"})
    pe = h2e(EXHAUST_PORT_C)
    nodes["exhaust_manifold"] = place("exhaust_manifold", build_exhaust(), M_E, (HEAD_X0, pe.y, pe.z))
    outs = [list(M_E @ p) for p in EXH_OUTLETS]
    nodes["exhaust_manifold"]["outlets_car_blender_xyz"] = [round(c, 4) for p in outs for c in p]
    nodes["exhaust_manifold"]["outlets_gltf_xyz"] = [round(c, 4) for p in outs for c in (p[0], p[2], -p[1])]
    fr = place("engine_front", build_front(), M_E, (BELT_X, 0, 0))
    nodes["engine_front"] = fr
    fan_o = Vector((BELT_X + 0.014, WP[0], WP[1]))
    nodes["fan"] = place("fan", build_fan(), M_E @ T(*fan_o), (0, 0, 0), parent=fr,
                         extras={"description": "viscous fan, spins about local X with the water pump"})
    fan_w = M_E @ (fan_o)
    nodes["radiator"] = place("radiator", build_radiator(fan_w), Matrix.Identity(4), (RAD_X, 0, 0.5075))
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

def report(nodes):
    tot = 0
    rows = []
    for ob in bpy.data.objects:
        if ob.type != "MESH":
            continue
        n = tri_count(ob)
        tot += n
        top = ob
        while top.parent is not None and top.parent.name != "valves":
            top = top.parent
        rows.append((ob.name, n))
    agg = {}
    for name, n in rows:
        key = "valves" if (name.startswith("valve_c") and name != "valve_cover") or name.startswith("spring_") else name
        agg[key] = agg.get(key, 0) + n
    for k in sorted(agg, key=lambda k: -agg[k]):
        print(f"  {k:26s} {agg[k]:7d}")
    print("  TOTAL triangles", tot)
    return agg, tot

def group_transform(names, M):
    """Apply a world transform to a set of top-level nodes (preview helper)."""
    for n in names:
        ob = bpy.data.objects[n]
        ob.matrix_world = M @ ob.matrix_world

def previews(tag=""):
    setup_studio(samples=20)
    P = lambda n: os.path.join(PREV_DIR, f"engine_{n}{tag}.png")
    c = M_E @ Vector((0.33, 0.0, 0.15))
    render(P("front34_left"), c + Vector((1.25, 0.95, 0.75)), c + Vector((0.0, 0.0, 0.05)), lens=45)
    render(P("right_side"), c + Vector((0.25, -1.55, 0.45)), c + Vector((0.0, 0.0, -0.02)), lens=45)
    render(P("front"), c + Vector((1.8, 0.0, 0.85)), c + Vector((0.0, 0.0, 0.02)), lens=42)
    render(P("top"), c + Vector((0.0, 0.0, 1.9)), c, lens=40)
    # valve cover off: VANOS + cams
    vc = bpy.data.objects["valve_cover"]
    vc.hide_render = True
    hc = M_H @ Vector((0.22, 0.0, 0.12))
    render(P("vanos_cover_off"), hc + Vector((0.55, -0.35, 0.40)), hc, lens=50)
    vu = bpy.data.objects["vanos_unit"]
    vu.hide_render = True
    render(P("sprockets_chain"), hc + Vector((0.55, -0.30, 0.25)), hc + Vector((0.0, 0.0, -0.06)), lens=45)
    vu.hide_render = False
    vc.hide_render = False
    # cylinder head lifted out alone, upright (tilt undone), with cams/valves/VANOS
    head_set = ["cylinder_head", "camshaft_intake", "camshaft_exhaust", "valves", "vanos_unit",
                "vanos_sprocket_intake", "vanos_sprocket_exhaust"]
    keep = set(head_set)
    def _top(o):
        while o.parent is not None:
            o = o.parent
        return o.name
    hidden = []
    for ob in bpy.data.objects:
        if ob.type in ("MESH", "EMPTY") and _top(ob) not in keep:
            if not ob.hide_render:
                ob.hide_render = True
                hidden.append(ob)
    lift = T(0, 0, 0.45) @ M_H @ Rx(-TILT) @ M_H.inverted()
    group_transform(head_set, lift)
    hc2 = lift @ M_H @ Vector((0.0, 0.0, 0.07))
    render(P("head_lifted"), hc2 + Vector((0.75, -0.75, 0.55)), hc2, lens=45)
    render(P("head_lifted_bottom"), hc2 + Vector((0.55, 0.65, -0.55)), hc2, lens=45)
    render(P("head_lifted_intake"), hc2 + Vector((0.45, 0.95, 0.30)), hc2, lens=45)
    group_transform(head_set, lift.inverted())
    for ob in hidden:
        ob.hide_render = False

if __name__ == "__main__":
    nodes = build_all()
    agg, tot = report(nodes)
    with open(os.path.join(HERE, "engine_tris.json"), "w") as f:
        json.dump({"per_node": agg, "total": tot}, f, indent=1)
    export(nodes)
    if "--no-render" not in ARGS:
        previews()

