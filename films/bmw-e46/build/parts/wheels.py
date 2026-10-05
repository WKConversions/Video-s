#!/usr/bin/env python3
"""Four wheels of Karl's brother's E46 330Ci coupe -> film/public/models/wheels.glb

Re-runnable:  python3 build/parts/wheels.py            (build GLB + preview renders)
              python3 build/parts/wheels.py --no-render (GLB only)
              python3 build/parts/wheels.py --views face,photo (only some previews)

The car wears aftermarket anthracite 8Jx18 alloys: 10 thin spokes arranged as 5 narrow V pairs that meet at the hub,
concave face, 5 lug bolts (PCD 5x120), small gunmetal centre cap, 225/40 R18 tyres. Behind the spokes: vented discs
(front 325x25, rear 320x22 with drum-in-hat parking brake) and a dark single-piston floating caliper on the trailing
(rear) side of each disc. See wheels.md for sources and the reasoning behind each number.

Blender frame (SPEC): X = car forward, Y = car LEFT, Z = up. glTF export (+Y up) gives X fwd, Y up, Z = car right.
Node tree per corner (C = FL, FR, RL, RR):
    wheel_C              translation = wheel centre, identity rotation
      spin_C             origin = wheel centre; rotate about the axle (glTF Z) to roll the wheel
        tyre_C, rim_C, brake_disc_C, bolts_C, cap_C
      caliper_C          fixed (does not spin)
Every node also carries extras {"part": "<tyre|rim|...>", "corner": "C"} because three.js renames duplicate names.
"""
import math
import os
import sys

import numpy as np
import bpy
import bmesh

HERE = os.path.dirname(os.path.abspath(__file__))
FILM_ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
GLB_PATH = os.path.join(FILM_ROOT, "film", "public", "models", "wheels.glb")
PREVIEW_DIR = os.path.join(HERE, "previews")

TAU = 2.0 * math.pi
IN = 0.0254

# ----------------------------------------------------------------------------------------------------------------
# Dimensions (metres). Wheel-local frame for a LEFT wheel: axial coordinate a along +Y (outward = the face side),
# radial plane = X (forward) / Z (up); angle theta measured from the top (+Z) toward the front (+X).
# ----------------------------------------------------------------------------------------------------------------
WHEEL_Z = 0.318                       # SPEC wheel-centre height
CORNERS = {                           # name: (X, Blender Y, front?)
    "FL": (+1.3625, +0.7355, True),
    "FR": (+1.3625, -0.7355, True),
    "RL": (-1.3625, +0.7390, False),
    "RR": (-1.3625, -0.7390, False),
}

RB = 18 * IN / 2                      # bead-seat radius of an 18" rim = 0.2286
RIM_HALF_W = 8 * IN / 2               # 8J: 203.2 mm between the flanges -> 0.1016
FLANGE_TOP = RB + 0.0175              # J flange height 17.5 mm -> 0.2461
LIP_A = 0.1125                        # outer face of the flange / lip (axial)
R_TYRE = RB + 0.40 * 0.225            # 225/40 R18 -> 0.3186 (outer diameter 637 mm)
ET = 0.035                            # wheel mounting face, 35 mm outboard of the rim centre line
HUB_FACE = 0.0680                     # front face of the hub pad (concave face: ~44 mm behind the lip)
PCD_R = 0.060                         # 5 x 120
LUG_POCKET_R = 0.0118                 # 23.6 mm bolt pocket
LUG_HOLE_R = 0.0076                   # M14 through hole
LUG_SEAT_A = 0.0460                   # bolt seat (bottom of the pocket)
BOSS_R = 0.0175                       # metal around each bolt pocket (hub outline reaches 77.5 mm at the lugs)
HUB_CORE_R = 0.0470                   # central ring between the bosses (the V stems sit on it)
CAP_R = 0.0280                        # centre cap ~56 mm (measured in the photo)
# Spokes (measured on the photo, rectified to a face-on view): 10 spokes, rim ends evenly spaced every 36 deg,
# radial from r ~ 90 mm outward; each pair curves toward its partner inside r ~ 90 mm and merges into one stem
# between two bolt pockets at r ~ 40 mm. Face width ~20 mm near the hub tapering to ~13.5 mm at the rim.
SPOKE_R_ROOT = 0.0360
SPOKE_R_END = 0.2262
SPOKE_HALF_ANGLE = math.radians(18.0)
SPOKE_BEND_L = 0.0140                 # e-folding length of the bend toward the partner spoke
SPOKE_TOP_HUB = HUB_FACE + 0.0012
SPOKE_TOP_RIM = 0.0990                # spoke face where it runs into the lip's inner wall
SPOKE_R_FLAT = 0.068                  # spokes are flat on the hub up to here, then sweep up (concave)
CONCAVE_POW = 1.45


def a_face(r):
    """Axial height of the concave spoke face as a function of radius."""
    r = np.asarray(r, float)
    t = np.clip((r - SPOKE_R_FLAT) / (SPOKE_R_END - SPOKE_R_FLAT), 0.0, 1.0)
    rise = np.clip((r - SPOKE_R_ROOT) / 0.012, 0.0, 1.0)
    emerge = -0.0020 * (1.0 - rise * rise * (3 - 2 * rise))     # the stem grows out of the hub face
    return SPOKE_TOP_HUB + emerge + (SPOKE_TOP_RIM - SPOKE_TOP_HUB) * t ** CONCAVE_POW


# ----------------------------------------------------------------------------------------------------------------
# Generic mesh helpers
# ----------------------------------------------------------------------------------------------------------------
def to_xyz(a, r, th):
    """wheel-local polar -> Blender local xyz (left wheel)."""
    return np.stack([r * np.sin(th), a, r * np.cos(th)], axis=-1)


def revolve(profile, n, theta=None, mat_idx=None, closed=True):
    """Revolve a profile [(a, r), ...] around the axle. Returns verts, faces, face material indices.
    `theta` may be an (n,) array of angles or an (n, m) array (per profile point, for twisted tread)."""
    P = np.asarray(profile, float)
    m = len(P)
    if theta is None:
        theta = np.arange(n) * TAU / n
    theta = np.asarray(theta, float)
    if theta.ndim == 1:
        theta = np.repeat(theta[:, None], m, axis=1)
    A = np.repeat(P[None, :, 0], n, axis=0)
    R = np.repeat(P[None, :, 1], n, axis=0)
    V = to_xyz(A, R, theta).reshape(-1, 3)
    faces, mats = [], []
    seg = m if closed else m - 1
    for j in range(n):
        j1 = (j + 1) % n
        for i in range(seg):
            i1 = (i + 1) % m
            faces.append((j * m + i, j1 * m + i, j1 * m + i1, j * m + i1))
            mats.append(0 if mat_idx is None else mat_idx[i])
    return V, faces, mats


def sweep(loops, cap=True):
    """Skin a list of closed loops (each (k,3)) into a closed tube with fan caps."""
    S, k = len(loops), len(loops[0])
    V = [np.asarray(l, float) for l in loops]
    verts = np.concatenate(V)
    faces = []
    for s in range(S - 1):
        for i in range(k):
            i1 = (i + 1) % k
            faces.append((s * k + i, s * k + i1, (s + 1) * k + i1, (s + 1) * k + i))
    if cap:
        c0 = len(verts)
        c1 = c0 + 1
        verts = np.concatenate([verts, V[0].mean(0)[None], V[-1].mean(0)[None]])
        for i in range(k):
            i1 = (i + 1) % k
            faces.append((c0, i1, i))
            faces.append((c1, (S - 1) * k + i, (S - 1) * k + i1))
    return verts, faces


def box_arc(a0, a1, r0, r1, t0, t1, n=6):
    """Closed block bounded by two axial planes, two cylinders and two angles (an 'arc box')."""
    th = np.linspace(t0, t1, n + 1)
    loops = []
    for t in th:
        loops.append(to_xyz(np.array([a0, a1, a1, a0]), np.array([r0, r0, r1, r1]), np.full(4, t)))
    return sweep(loops)


def cylinder_axial(cx, cz, rad, a0, a1, n=24):
    """Cylinder whose axis is parallel to the axle, centred at local (x=cx, z=cz)."""
    t = np.arange(n) * TAU / n
    loops = []
    for a in (a0, a1):
        loops.append(np.stack([cx + rad * np.sin(t), np.full(n, a), cz + rad * np.cos(t)], -1))
    return sweep(loops)


MATERIALS = {}


def material(name, base, metallic, roughness, spec=0.5, coat=0.0):
    if name in MATERIALS:
        return MATERIALS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*base, 1.0)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in b.inputs:
        b.inputs["Specular IOR Level"].default_value = spec
    if coat and "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    m.diffuse_color = (*base, 1.0)
    MATERIALS[name] = m
    return m


def setup_materials():
    MATERIALS.clear()
    material("rubber", (0.028, 0.028, 0.030), 0.0, 0.82, spec=0.30)
    material("rim_gunmetal", (0.115, 0.118, 0.128), 0.80, 0.36)
    material("brake_disc", (0.40, 0.40, 0.40), 1.0, 0.42)
    material("caliper", (0.075, 0.076, 0.080), 0.35, 0.55)
    material("steel", (0.56, 0.56, 0.57), 1.0, 0.28)
    material("steel_dark", (0.13, 0.125, 0.12), 0.75, 0.58)


def new_mesh_obj(name, verts, faces, mats=None, mat_names=("rim_gunmetal",), smooth_deg=32.0, coll=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata(np.asarray(verts, float).tolist(), [], [tuple(int(i) for i in f) for f in faces])
    me.update()
    for mn in mat_names:
        me.materials.append(MATERIALS[mn])
    if mats is not None:
        me.polygons.foreach_set("material_index", np.asarray(mats, np.int32))
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    bmesh.ops.dissolve_degenerate(bm, dist=1e-8, edges=bm.edges)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    (coll or bpy.context.scene.collection).objects.link(obj)
    set_smooth(obj, smooth_deg)
    return obj


def set_smooth(obj, deg):
    me = obj.data
    me.shade_smooth()
    if deg is not None:
        me.set_sharp_from_angle(angle=math.radians(deg))


def apply_modifiers(obj):
    bpy.context.view_layer.objects.active = obj
    for o in bpy.context.selected_objects:
        o.select_set(False)
    obj.select_set(True)
    for mod in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=mod.name)


def boolean(obj, other, op, solver="EXACT", self_inter=False):
    mod = obj.modifiers.new("bool", "BOOLEAN")
    mod.operation = op
    mod.solver = solver
    if other.type == "MESH":
        mod.object = other
    if solver == "EXACT":
        mod.use_self = self_inter
        mod.use_hole_tolerant = False
    apply_modifiers(obj)


def join(objs, name):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    objs[0].name = name
    objs[0].data.name = name
    return objs[0]


def delete(obj):
    me = obj.data if obj.type == "MESH" else None
    bpy.data.objects.remove(obj, do_unlink=True)
    if me is not None and me.users == 0:
        bpy.data.meshes.remove(me)


def bevel(obj, width, segments=2, angle=40.0):
    mod = obj.modifiers.new("bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(angle)
    mod.harden_normals = False
    apply_modifiers(obj)


def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)


# ----------------------------------------------------------------------------------------------------------------
# Tyre 225/40 R18
# ----------------------------------------------------------------------------------------------------------------
N_PITCH = 60          # tread pitches around the tyre
TREAD_DEPTH = 0.0065


def tyre_profile_half():
    """(a, r) points from the bead toe on the outer side up to (not including) the crown centre."""
    side = [
        (0.1006, 0.2296),   # bead toe (sits on the bead seat, inside the flange)
        (0.1006, 0.2418),   # bead against the flange
        (0.1030, 0.2470),   # over the flange curl
        (0.1100, 0.2490),
        (0.1150, 0.2500),   # rim-protector rib hangs just outside the flange
        (0.1172, 0.2545),
        (0.1166, 0.2600),   # rib crest
        (0.1150, 0.2690),
        (0.1138, 0.2780),   # max section width ~ 228 mm
        (0.1112, 0.2870),
        (0.1068, 0.2955),
        (0.1008, 0.3030),   # shoulder
        (0.0938, 0.3095),
        (0.0870, 0.3140),
        (0.0815, 0.3160),   # tread edge
    ]
    crown = lambda a: R_TYRE - 0.0024 * (a / 0.0815) ** 2
    tread_a = [0.0720, 0.0640,
               0.0603, 0.0596, 0.0524, 0.0517,      # outer circumferential groove
               0.0400,
               0.0263, 0.0256, 0.0174, 0.0167,      # inner circumferential groove
               0.0080]
    groove_bottom = {0.0596, 0.0524, 0.0256, 0.0174}
    tread = [(a, crown(a) - (TREAD_DEPTH if a in groove_bottom else 0.0)) for a in tread_a]
    return side + tread


def build_tyre(name, coll):
    half = tyre_profile_half()
    prof = half + [(0.0, R_TYRE)] + [(-a, r) for (a, r) in reversed(half)]
    # closing segment along the bead base is implicit (closed loop from the inner bead toe back to the outer)
    P = np.array(prof)
    m = len(P)
    # angular columns: per pitch, groove edge / groove bottom / groove bottom / groove edge, then the block
    pitch = TAU / N_PITCH
    cols = []
    kinds = []
    for p in range(N_PITCH):
        base = p * pitch
        for frac, kind in ((0.00, "edge"), (0.09, "bottom"), (0.21, "bottom"), (0.30, "edge")):
            cols.append(base + frac * pitch)
            kinds.append(kind)
    cols = np.array(cols)
    n = len(cols)
    absA = np.abs(P[:, 0])
    # slant the lateral grooves across the shoulder (directional look): angular offset grows with |a|
    slant = np.clip((absA - 0.0603) / (0.100 - 0.0603), 0.0, 1.0) * math.radians(1.6)
    theta = cols[:, None] + slant[None, :]
    A = np.repeat(P[None, :, 0], n, 0)
    R = np.repeat(P[None, :, 1], n, 0)
    # lateral grooves in the shoulder blocks (from the outer circumferential groove out over the shoulder)
    is_bottom = np.array([k == "bottom" for k in kinds])
    in_shoulder = (absA >= 0.0603) & (absA <= 0.1010)
    depth = np.where(absA <= 0.0720, TREAD_DEPTH, TREAD_DEPTH * np.clip((0.0870 - absA) / (0.0870 - 0.0720), 0, 1))
    is_groove_floor = np.isin(np.round(absA, 4), [0.0596, 0.0524, 0.0256, 0.0174])
    dep = np.where(in_shoulder, depth, 0.0)
    # short notches into the intermediate rib from the outer groove (0.0400 -> 0.0517), half depth
    notch = (absA > 0.0399) & (absA < 0.0518)
    dep = np.where(notch, TREAD_DEPTH * 0.6, dep)
    R = R - np.where(is_bottom[:, None] & ~is_groove_floor[None, :], dep[None, :], 0.0)
    V = to_xyz(A, R, theta).reshape(-1, 3)
    faces = []
    for j in range(n):
        j1 = (j + 1) % n
        for i in range(m):
            i1 = (i + 1) % m
            faces.append((j * m + i, j1 * m + i, j1 * m + i1, j * m + i1))
    return new_mesh_obj(name, V, faces, mat_names=("rubber",), smooth_deg=50.0, coll=coll)


# ----------------------------------------------------------------------------------------------------------------
# Rim: barrel (revolved), hub pad, 10 spokes in 5 V pairs, boolean union, lug pockets
# ----------------------------------------------------------------------------------------------------------------
N_RIM = 128


def rim_barrel_profile():
    """Closed (a, r) loop: outer (tyre) contour from the front lip to the back flange, back along the inside."""
    return [
        # front lip face (the visible flat ring) and flange
        (LIP_A, 0.2352), (LIP_A, 0.2405), (0.1118, 0.2435), (0.1098, 0.2455), (0.1068, 0.2461),
        (0.1036, 0.2450), (0.1018, 0.2420),
        # front bead seat, hump, drop-centre well (outboard), long inner bead seat
        (RIM_HALF_W, 0.2300), (0.0990, RB), (0.0860, RB - 0.0003), (0.0820, RB + 0.0008), (0.0780, RB - 0.0003),
        (0.0700, 0.2095), (0.0680, 0.2085), (0.0440, 0.2085), (0.0410, 0.2095), (0.0320, RB - 0.0003),
        (-0.0780, RB - 0.0003), (-0.0820, RB + 0.0008), (-0.0860, RB - 0.0003), (-0.0990, RB), (-RIM_HALF_W, 0.2300),
        # inner flange
        (-0.1018, 0.2420), (-0.1036, 0.2450), (-0.1068, 0.2461), (-0.1098, 0.2455), (-0.1118, 0.2430),
        (-LIP_A, 0.2395), (-LIP_A, 0.2330), (-0.1110, 0.2270), (-0.1080, 0.2230),
        # inside of the barrel (seen through the spokes), thicker under the well, then up into the lip
        (-0.1040, 0.2215), (0.0250, 0.2215), (0.0300, 0.2030), (0.0330, 0.2022), (0.0680, 0.2022),
        (0.0700, 0.2048), (0.0760, 0.2108), (0.0830, 0.2168), (0.0900, 0.2208), (0.0960, 0.2238),
        (0.1000, 0.2260), (0.1032, 0.2280), (0.1062, 0.2298), (0.1092, 0.2318), (0.1113, 0.2335),
    ]


def build_barrel(name, coll):
    V, F, _ = revolve(rim_barrel_profile(), N_RIM)
    return new_mesh_obj(name, V, F, mat_names=("rim_gunmetal",), smooth_deg=38.0, coll=coll)


def lug_angles(phase):
    return phase + np.arange(5) * TAU / 5


def hub_outline(th, phase):
    """Outer radius of the hub pad vs angle: a central ring plus a boss around every bolt pocket (smooth union)."""
    p, b = PCD_R, BOSS_R
    R = np.full_like(th, HUB_CORE_R)
    for tl in lug_angles(phase + TAU / 10):
        d = np.angle(np.exp(1j * (th - tl)))
        s = p * np.sin(d)
        inside = np.abs(s) < b
        rb = np.where(inside, p * np.cos(d) + np.sqrt(np.clip(b * b - s * s, 0, None)), 0.0)
        k = 0.0016                                       # fillet size of the smooth max
        R = k * np.log(np.exp(R / k) + np.exp(rb / k))
    return R


def build_hub(name, coll, phase):
    """Hub pad: mounting face at ET, front face at HUB_FACE, scalloped outline, centre bore + cap pocket."""
    n = 200
    th = np.arange(n) * TAU / n
    Ro = hub_outline(th, phase)
    rows = [  # (a, radius offset from the outline or None, fixed radius)
        (ET, -0.0030, None), (ET + 0.0030, 0.0, None), (HUB_FACE - 0.0045, 0.0, None),
        (HUB_FACE - 0.0013, -0.0013, None), (HUB_FACE, -0.0045, None),
        (HUB_FACE, None, CAP_R + 0.0035), (HUB_FACE - 0.0012, None, CAP_R + 0.0008),
        (HUB_FACE - 0.0040, None, CAP_R + 0.0006), (0.0520, None, CAP_R + 0.0006), (0.0520, None, 0.0365),
        (ET, None, 0.0365),
    ]
    m = len(rows)
    A = np.array([[r[0] for r in rows]] * n)
    R = np.array([[(Ro[j] + r[1]) if r[1] is not None else r[2] for r in rows] for j in range(n)])
    V = to_xyz(A, R, np.repeat(th[:, None], m, 1)).reshape(-1, 3)
    F = []
    for j in range(n):
        j1 = (j + 1) % n
        for i in range(m):
            i1 = (i + 1) % m
            F.append((j * m + i, j1 * m + i, j1 * m + i1, j * m + i1))
    return new_mesh_obj(name, V, F, mat_names=("rim_gunmetal",), smooth_deg=40.0, coll=coll)


def spoke_section(W, H):
    """Closed cross-section (lateral l, depth d below the face), counter-clockwise looking down the spoke."""
    Wb = W * 0.72
    rt, rb = min(0.0024, W * 0.18), 0.0015
    s45 = math.sin(math.pi / 4)
    pts = [
        (-W / 2 + rt, 0.0), (0.0, 0.0004), (W / 2 - rt, 0.0),
        (W / 2 - rt + rt * s45, -(rt - rt * s45)), (W / 2, -rt),
        (Wb / 2, -H + rb), (Wb / 2 - rb + rb * s45, -H + rb - rb * s45), (Wb / 2 - rb, -H),
        (-Wb / 2 + rb, -H), (-Wb / 2 + rb - rb * s45, -H + rb - rb * s45), (-Wb / 2, -H + rb),
        (-W / 2, -rt), (-W / 2 + rt - rt * s45, -(rt - rt * s45)),
    ]
    return pts


def spoke_centre(r, tv, side):
    """Centre line of one leg in the face plane: radial at tv + side*18deg outside, bending into the stem at tv."""
    phi = SPOKE_HALF_ANGLE * (1.0 - np.exp(-(np.asarray(r) - SPOKE_R_ROOT) / SPOKE_BEND_L))
    t = tv + side * phi
    return np.stack([r * np.sin(t), r * np.cos(t)], -1)


def spoke_width(r):
    w = np.interp(r, [0.0, 0.085, 0.215, 1.0], [0.0210, 0.0210, 0.0145, 0.0145])
    flare = 0.0045 * np.clip((r - 0.212) / (SPOKE_R_END - 0.212), 0, 1) ** 2
    return w + flare


def build_spoke(tv, side):
    rs = np.array([0.0360, 0.0390, 0.0425, 0.0465, 0.0510, 0.0560, 0.0615, 0.0680, 0.0755, 0.0840, 0.0940,
                   0.1060, 0.1200, 0.1350, 0.1500, 0.1650, 0.1800, 0.1940, 0.2060, 0.2150, 0.2210, SPOKE_R_END])
    C = spoke_centre(rs, tv, side)
    loops = []
    for i, r in enumerate(rs):
        d = C[min(i + 1, len(rs) - 1)] - C[max(i - 1, 0)]
        d /= np.linalg.norm(d)
        nrm = np.array([d[1], -d[0]])
        W = float(spoke_width(r))
        H = float(np.interp(r, [0.0, 0.08, SPOKE_R_END], [0.0270, 0.0260, 0.0190]))
        loop = []
        for (l, dd) in spoke_section(W, H):
            q = C[i] + l * nrm
            rq = math.hypot(q[0], q[1])
            loop.append((q[0], float(a_face(rq)) + dd, q[1]))
        loops.append(loop)
    return sweep(loops)


def build_rim(name, coll, phase):
    """phase = angle (theta) of the first V-pair stem. Bolt pockets sit midway between the pairs."""
    barrel = build_barrel(name + "_barrel", coll)
    hub = build_hub(name + "_hub", coll, phase)
    spokes = []
    for k in range(5):
        tv = phase + k * TAU / 5
        for side in (-1, 1):
            V, F = build_spoke(tv, side)
            spokes.append(new_mesh_obj(f"{name}_spoke{k}{side}", V, F, mat_names=("rim_gunmetal",),
                                       smooth_deg=38.0, coll=coll))
    spk = join(spokes, name + "_spokes")
    # union everything into one cast wheel
    boolean(hub, spk, "UNION", self_inter=True)
    delete(spk)
    boolean(barrel, hub, "UNION")
    delete(hub)
    # bolt pockets and through holes, midway between the V pairs
    cutters = []
    for t in lug_angles(phase + TAU / 10):
        cx, cz = PCD_R * math.sin(t), PCD_R * math.cos(t)
        V, F = cylinder_axial(cx, cz, LUG_POCKET_R, LUG_SEAT_A, 0.095, n=28)
        cutters.append(new_mesh_obj("cut", V, F, smooth_deg=None, coll=coll))
        V, F = cylinder_axial(cx, cz, LUG_HOLE_R, 0.010, LUG_SEAT_A + 0.0006, n=20)
        cutters.append(new_mesh_obj("cut", V, F, smooth_deg=None, coll=coll))
    cut = join(cutters, "cutters")
    boolean(barrel, cut, "DIFFERENCE")
    delete(cut)
    barrel.name = name
    barrel.data.name = name
    set_smooth(barrel, 38.0)
    return barrel


def build_bolts(name, coll, phase):
    """Five M14x1.25 wheel bolts: 17 mm hex, conical seat collar, seated at the bottom of the pockets."""
    objs = []
    for t in lug_angles(phase + TAU / 10):
        cx, cz = PCD_R * math.sin(t), PCD_R * math.cos(t)
        # collar (60 deg seat) as a revolve around the bolt axis
        S = LUG_SEAT_A + 0.0002
        prof = [(S, 0.0050), (S, 0.0104), (S + 0.0030, 0.0104), (S + 0.0038, 0.0096), (S + 0.0038, 0.0050)]
        n = 20
        ang = np.arange(n) * TAU / n
        Vs = []
        for (a, r) in prof:
            Vs.append(np.stack([cx + r * np.sin(ang), np.full(n, a), cz + r * np.cos(ang)], -1))
        V, F = sweep(Vs)
        objs.append(new_mesh_obj("bc", V, F, mat_names=("steel_dark",), smooth_deg=40.0, coll=coll))
        # hex head (across flats 17 mm) with a chamfered top
        rh = 0.0085 / math.cos(math.pi / 6)
        hexa = np.arange(6) * TAU / 6 + t
        loops = []
        for (a, s) in ((S + 0.0034, 1.0), (S + 0.0124, 1.0), (S + 0.0135, 0.80)):
            loops.append(np.stack([cx + s * rh * np.sin(hexa), np.full(6, a), cz + s * rh * np.cos(hexa)], -1))
        V, F = sweep(loops)
        objs.append(new_mesh_obj("bh", V, F, mat_names=("steel_dark",), smooth_deg=30.0, coll=coll))
    return join(objs, name)


def build_cap(name, coll):
    """Small gunmetal centre cap, slightly domed, with a recessed emblem disc."""
    prof = [
        (0.0510, 0.0), (0.0510, CAP_R - 0.0004), (HUB_FACE - 0.0010, CAP_R - 0.0004),
        (HUB_FACE + 0.0016, CAP_R - 0.0002), (HUB_FACE + 0.0030, CAP_R - 0.0016),
        (HUB_FACE + 0.0040, 0.0230), (HUB_FACE + 0.0044, 0.0185),
        (HUB_FACE + 0.0038, 0.0178), (HUB_FACE + 0.0038, 0.0),
    ]
    mats = [0, 0, 0, 0, 0, 0, 0, 1, 1]
    V, F, M = revolve(prof, 64, mat_idx=mats, closed=False)
    obj = new_mesh_obj(name, V, F, M, mat_names=("rim_gunmetal", "steel_dark"), smooth_deg=40.0, coll=coll)
    return obj


# ----------------------------------------------------------------------------------------------------------------
# Brake discs (vented) and calipers
# ----------------------------------------------------------------------------------------------------------------
DISC = {
    # front 325 x 25 vented: friction faces at a = +0.0126 / -0.0124 (centred on the tyre mid-plane)
    True: dict(R=0.1625, Ri=0.1060, out=0.0126, inn=-0.0124, plate=0.0075, hat_r=0.0860, hat_t=0.0060, vanes=36),
    # rear 320 x 22 vented with drum-in-hat (parking brake drum inside the hat, ~185 mm)
    False: dict(R=0.1600, Ri=0.1100, out=0.0070, inn=-0.0150, plate=0.0065, hat_r=0.1010, hat_t=0.0065, vanes=36),
}


def build_disc(name, coll, front):
    d = DISC[front]
    R, Ri, ao, ai, pt, hr, ht = d["R"], d["Ri"], d["out"], d["inn"], d["plate"], d["hat_r"], d["hat_t"]
    objs = []
    # hat + outer plate (one revolved solid). material 0 = steel_dark (hat), 1 = brake_disc (swept faces)
    prof = [
        (ET, 0.0370), (ET, hr - 0.0025), (ET - 0.0015, hr), (ao + 0.0010, hr),             # hat top + wall
        (ao, hr + 0.0010), (ao, Ri - 0.0015), (ao + 0.0004, Ri),                          # recessed ring
        (ao + 0.0004, R - 0.0012), (ao - 0.0006, R),                                      # swept face
        (ao - pt + 0.0006, R), (ao - pt, R - 0.0010), (ao - pt, Ri),                       # back of outer plate
        (ao - pt, hr - ht + 0.0015), (ao - pt + 0.0020, hr - ht),                          # under the hat wall
        (ET - ht, hr - ht), (ET - ht, 0.0370),
    ]
    mats = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
    V, F, M = revolve(prof, 96, mat_idx=mats)
    objs.append(new_mesh_obj(name + "_hat", V, F, M, mat_names=("steel_dark", "brake_disc"), smooth_deg=35.0,
                             coll=coll))
    # inner plate
    prof = [(ai + pt, Ri), (ai + pt, R - 0.0010), (ai + pt - 0.0006, R), (ai + 0.0006, R), (ai - 0.0004, R - 0.0012),
            (ai - 0.0004, Ri + 0.0010), (ai, Ri)]
    mats = [0, 0, 1, 1, 1, 0, 0]
    V, F, M = revolve(prof, 96, mat_idx=mats)
    objs.append(new_mesh_obj(name + "_inner", V, F, M, mat_names=("steel_dark", "brake_disc"), smooth_deg=35.0,
                             coll=coll))
    # straight radial vanes between the plates (cooling channels open at the inner and outer edge)
    for k in range(d["vanes"]):
        t = (k + 0.5) * TAU / d["vanes"]
        w = 0.0042 / R
        V, F = box_arc(ai + pt - 0.0005, ao - pt + 0.0005, Ri + 0.0012, R - 0.0008, t - w / 2, t + w / 2, n=1)
        objs.append(new_mesh_obj("vane", V, F, mat_names=("steel_dark",), smooth_deg=None, coll=coll))
    return join(objs, name)


def build_caliper(name, coll, front):
    """ATE-style single-piston floating (fist) caliper on its carrier, trailing side of the disc.
    Built for a LEFT wheel in the wheel-local frame; theta_c = -80 deg puts it behind the axle, a bit above centre."""
    d = DISC[front]
    R, Ri, ao, ai = d["R"], d["Ri"], d["out"], d["inn"]
    tc = math.radians(-80.0 if front else -84.0)
    pad = 0.0150                          # pad + backing plate thickness
    span = math.radians(21.0 if front else 19.0)
    rmid = 0.5 * (R + Ri)
    objs = []
    rr0, rr1 = R + 0.0035, R + 0.0225     # bridge over the disc edge
    a_out1 = ao + pad + 0.0115            # outboard finger face
    a_in1 = ai - pad - 0.0140             # inboard housing back
    # bridge
    V, F = box_arc(a_in1 + 0.006, a_out1, rr0, rr1, tc - span, tc + span, n=8)
    objs.append(new_mesh_obj("cb", V, F, mat_names=("caliper",), smooth_deg=None, coll=coll))
    # two outboard fingers
    for s in (-1, 1):
        V, F = box_arc(ao + pad, a_out1, Ri + 0.006, rr0 + 0.004, tc + s * span * 0.52 - span * 0.40,
                       tc + s * span * 0.52 + span * 0.40, n=3)
        objs.append(new_mesh_obj("cf", V, F, mat_names=("caliper",), smooth_deg=None, coll=coll))
    # web between the fingers (upper part only, leaves a window onto the pad)
    V, F = box_arc(ao + pad + 0.003, a_out1, rmid + 0.012, rr0 + 0.004, tc - span * 0.3, tc + span * 0.3, n=2)
    objs.append(new_mesh_obj("cw", V, F, mat_names=("caliper",), smooth_deg=None, coll=coll))
    # inboard piston housing: cylinder along the axle centred on the pad (57 mm piston -> ~78 mm housing)
    cx, cz = rmid * math.sin(tc), rmid * math.cos(tc)
    V, F = cylinder_axial(cx, cz, 0.039 if front else 0.033, a_in1, ai - pad + 0.002, n=28)
    objs.append(new_mesh_obj("cp", V, F, mat_names=("caliper",), smooth_deg=None, coll=coll))
    # housing body joining the piston bore to the bridge
    V, F = box_arc(a_in1, ai - pad + 0.002, rmid - 0.010, rr1, tc - span * 0.62, tc + span * 0.62, n=4)
    objs.append(new_mesh_obj("ch", V, F, mat_names=("caliper",), smooth_deg=None, coll=coll))
    # guide-pin bosses (inboard, both ends) and the carrier horns that hold the pads (both ends, over the edge)
    for s in (-1, 1):
        tb = tc + s * (span + math.radians(6.0))
        bx, bz = (Ri + 0.030) * math.sin(tb), (Ri + 0.030) * math.cos(tb)
        V, F = cylinder_axial(bx, bz, 0.0105, a_in1 + 0.004, ai - 0.002, n=16)
        objs.append(new_mesh_obj("cg", V, F, mat_names=("caliper",), smooth_deg=None, coll=coll))
        th0 = tc + s * span
        V, F = box_arc(ai - pad - 0.004, ao + pad - 0.002, R - 0.018, R + 0.010,
                       min(th0, th0 + s * math.radians(7.5)), max(th0, th0 + s * math.radians(7.5)), n=2)
        objs.append(new_mesh_obj("cc", V, F, mat_names=("caliper",), smooth_deg=None, coll=coll))
    body = join(objs, name)
    bevel(body, 0.0018, segments=2, angle=35.0)
    # pads (backing plate + lining) on both sides of the disc
    pads = []
    for (a0, a1) in ((ao + 0.0004, ao + pad), (ai - pad, ai - 0.0004)):
        V, F = box_arc(a0, a1, Ri + 0.003, R - 0.002, tc - span * 0.82, tc + span * 0.82, n=6)
        pads.append(new_mesh_obj("pad", V, F, mat_names=("steel_dark",), smooth_deg=None, coll=coll))
    padobj = join(pads, name + "_pads")
    bevel(padobj, 0.0010, segments=1, angle=35.0)
    body = join([body, padobj], name)
    set_smooth(body, 35.0)
    return body


# ----------------------------------------------------------------------------------------------------------------
# Assembly
# ----------------------------------------------------------------------------------------------------------------
def rotate180_mesh(obj):
    """Bake a 180-degree rotation about the vertical (Z) axis into the mesh: left wheel -> right wheel.
    A real non-directional wheel is the same part on both sides, so this is the physically correct 'mirror'."""
    me = obj.data
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    co[:, 0] *= -1
    co[:, 1] *= -1
    me.vertices.foreach_set("co", co.ravel())
    me.update()


def mirror_y_mesh(obj):
    """Mirror across the car's centre plane (left caliper -> right caliper) and fix the winding."""
    me = obj.data
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    co[:, 1] *= -1
    me.vertices.foreach_set("co", co.ravel())
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.reverse_faces(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    me.update()


def make_empty(name, parent=None, loc=(0, 0, 0), coll=None):
    e = bpy.data.objects.new(name, None)
    e.empty_display_type = "PLAIN_AXES"
    e.empty_display_size = 0.1
    (coll or bpy.context.scene.collection).objects.link(e)
    e.location = loc
    if parent is not None:
        e.parent = parent
    return e


def tag(obj, part, corner):
    obj["part"] = part
    obj["corner"] = corner


PHASE = math.radians(18.6)      # angle of the first V-pair vertex (only matters for the photo-match preview)


def build_all():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    setup_materials()
    scene = bpy.context.scene
    work = bpy.data.collections.new("work")
    scene.collection.children.link(work)

    # --- masters (left side, wheel-local frame) ---
    tyre_L = build_tyre("tyre_master", work)
    rim_L = build_rim("rim_master", work, PHASE)
    bolts_L = build_bolts("bolts_master", work, PHASE)
    cap_L = build_cap("cap_master", work)
    disc_L = {f: build_disc("disc_master_" + ("F" if f else "R"), work, f) for f in (True, False)}
    cal_L = {f: build_caliper("caliper_master_" + ("F" if f else "R"), work, f) for f in (True, False)}

    def right_copy(obj, how):
        o = obj.copy()
        o.data = obj.data.copy()
        work.objects.link(o)
        (rotate180_mesh if how == "rot" else mirror_y_mesh)(o)
        return o

    masters = {
        "L": dict(tyre=tyre_L, rim=rim_L, bolts=bolts_L, cap=cap_L),
        "R": dict(tyre=right_copy(tyre_L, "rot"), rim=right_copy(rim_L, "rot"), bolts=right_copy(bolts_L, "rot"),
                  cap=right_copy(cap_L, "rot")),
    }
    discs = {("L", f): disc_L[f] for f in (True, False)}
    discs.update({("R", f): right_copy(disc_L[f], "rot") for f in (True, False)})
    calipers = {("L", f): cal_L[f] for f in (True, False)}
    calipers.update({("R", f): right_copy(cal_L[f], "mirror") for f in (True, False)})

    out = bpy.data.collections.new("wheels")
    scene.collection.children.link(out)
    stats = {}
    for corner, (x, y, front) in CORNERS.items():
        side = "L" if y > 0 else "R"
        wheel = make_empty(f"wheel_{corner}", loc=(x, y, WHEEL_Z), coll=out)
        tag(wheel, "wheel", corner)
        spin = make_empty(f"spin_{corner}", parent=wheel, coll=out)
        tag(spin, "spin", corner)
        parts = [("tyre", masters[side]["tyre"], spin), ("rim", masters[side]["rim"], spin),
                 ("brake_disc", discs[(side, front)], spin), ("bolts", masters[side]["bolts"], spin),
                 ("cap", masters[side]["cap"], spin), ("caliper", calipers[(side, front)], wheel)]
        tris = 0
        for part, master, parent in parts:
            o = bpy.data.objects.new(f"{part}_{corner}", master.data)     # shared mesh data (GLB instancing)
            out.objects.link(o)
            o.parent = parent
            tag(o, part, corner)
            tris += tri_count(o)
        stats[corner] = tris
    # name the shared mesh datablocks sensibly
    for side in ("L", "R"):
        for part, o in masters[side].items():
            o.data.name = f"{part}_{side}"
    for (side, f), o in discs.items():
        o.data.name = f"brake_disc_{'front' if f else 'rear'}_{side}"
    for (side, f), o in calipers.items():
        o.data.name = f"caliper_{'front' if f else 'rear'}_{side}"
    # drop the work collection from the scene (its objects are only mesh holders now)
    for o in list(work.objects):
        work.objects.unlink(o)
    bpy.data.collections.remove(work)
    per_part = {p: tri_count(o) for p, o in masters["L"].items()}
    per_part["disc_front"] = tri_count(disc_L[True])
    per_part["disc_rear"] = tri_count(disc_L[False])
    per_part["caliper_front"] = tri_count(cal_L[True])
    per_part["caliper_rear"] = tri_count(cal_L[False])
    return stats, per_part


def export_glb():
    os.makedirs(os.path.dirname(GLB_PATH), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.ops.export_scene.gltf(filepath=GLB_PATH, export_format="GLB", export_apply=True, export_yup=True,
                              export_extras=True, export_cameras=False, export_lights=False,
                              use_selection=False, export_materials="EXPORT")


def check_glb():
    import trimesh  # noqa
    import pygltflib
    g = pygltflib.GLTF2().load(GLB_PATH)
    names = [n.name for n in g.nodes]
    print("nodes:", names)
    sc = trimesh.load(GLB_PATH)
    print("bounds (glTF, Y up):", np.round(sc.bounds, 4))
    for n in ("wheel_FL", "wheel_FR", "wheel_RL", "wheel_RR"):
        T, _ = sc.graph.get(n)
        print(n, "centre", np.round(T[:3, 3], 4))
    return names


if __name__ == "__main__":
    args = sys.argv[1:]
    stats, per_part = build_all()
    print("triangles per wheel:", stats)
    print("triangles per part:", per_part)
    export_glb()
    check_glb()
    if "--no-render" not in args:
        views = None
        if "--views" in args:
            views = args[args.index("--views") + 1].split(",")
        sys.path.insert(0, HERE)
        import wheels_preview
        wheels_preview.render_all(views)
