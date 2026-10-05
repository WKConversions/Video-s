#!/usr/bin/env python3
"""
BMW E46/2 330Ci coupe (2001, LHD, automatic) interior for the film: two front seats, the contoured 2+1 rear bench,
the dashboard with the instrument binnacle and cluster, the steering wheel (pre-facelift 4-spoke multifunction),
the centre console with the Steptronic selector and the handbrake, the door cards and rear side trims, the parcel shelf.

Re-runnable:  python3 build/parts/interior.py              (build + export GLB + fit check + preview renders)
              python3 build/parts/interior.py --no-render  (build + export + fit check)
              python3 build/parts/interior.py --no-check   (skip the fit check against the body field)

Coordinate system: see build/SPEC.md (glTF: +X forward, +Y up, +Z right; LHD, driver on the left = -Z).
Built in Blender Z-up with X = car forward, Y = car LEFT, Z = up; every mapping function below is written in CAR
coordinates (X fwd, Y up, Z right) and converted with B(). Upholstery is built as quad cages (grid_solid) shaped by
mapping functions and smoothed with Catmull-Clark subdivision.
Dimensions: BMW ST034 E46/2 dimension drawing (seat positions digitised, headroom 953/926, shoulder room 1384/1338,
elbow room 1447/1402), see build/parts/interior.md.
"""
import bpy, bmesh, math, os, sys, json
from mathutils import Vector, Matrix

D2R = math.pi / 180.0
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))           # films/bmw-e46
OUT_GLB = os.path.join(ROOT, "film", "public", "models", "interior.glb")
PREV_DIR = os.path.join(HERE, "previews")
ATLAS = os.path.join(HERE, "interior_atlas.png")
FONT_DIR = os.path.join(ROOT, "build", "fonts")
ARGS = sys.argv[1:]

# ----------------------------------------------------------------------------------------------
# Key positions (car coordinates, metres). Digitised from BMW's E46/2 dimension drawing (side view: front axle
# x=504 px, rear axle x=1270 px, ground y=779 px, 3.557 mm/px, drawing heights x 1369/1401).
# ----------------------------------------------------------------------------------------------
SEAT_Z = 0.37              # front seat centrelines Z = -0.37 (driver) / +0.37 (passenger), plan view ~0.35-0.38
SEAT_O = (-0.10, 0.20)     # front seat node origin (X, Y): on the floor (Y 0.20) under the cushion middle
H_POINT = (-0.126, 0.44)   # front headroom-arrow foot on the cushion (drawing)
WHEEL_C = (0.238, 0.874)   # steering-wheel centre (drawing: rim from (0.31, 1.03) to (0.167, 0.718))
COL_ANG = 24.5 * D2R       # wheel plane 24.5 deg from vertical = column 24.5 deg below horizontal (drawing)
REAR_O = (-0.85, 0.20)     # rear bench node origin
SEL_PIVOT = (0.335, 0.505) # Steptronic lever pivot (X, Y), Z = 0
HB_PIVOT = (0.10, 0.548)   # handbrake lever pivot

MAT_DEF = {  # name: (base colour RGBA (linear), metallic, roughness)
    "leather_grey":  ((0.135, 0.135, 0.14, 1), 0.0, 0.50),   # seats + door inserts (the car: grey leather)
    "leather_black": ((0.022, 0.022, 0.024, 1), 0.0, 0.42),  # steering-wheel rim, selector knob/boot, handbrake
    "interior_black": ((0.028, 0.028, 0.030, 1), 0.0, 0.62), # dashboard, door cards, console (grained plastic)
    "plastic_black": ((0.012, 0.012, 0.013, 1), 0.0, 0.40),  # switches, vents, bezels
    "trim_titan":    ((0.30, 0.30, 0.31, 1), 0.75, 0.34),    # satin trim strips, selector surround
    "alu_machined":  ((0.80, 0.80, 0.80, 1), 1.00, 0.22),    # door handles, dial rings, headrest posts
    "steel_dark":    ((0.13, 0.13, 0.14, 1), 0.85, 0.48),    # seat rails
    "gauges":        ((1.0, 1.0, 1.0, 1), 0.0, 0.45),        # textured: dial faces, PRND plate, roundel
    "needle_white":  ((0.85, 0.85, 0.82, 1), 0.0, 0.40),
}
MATS = {}

# ----------------------------------------------------------------------------------------------
# math helpers
# ----------------------------------------------------------------------------------------------
def B(X, Y, Z):
    """car (X fwd, Y up, Z right) -> Blender (x fwd, y left, z up)"""
    return Vector((X, -Z, Y))

def T(x, y, z):
    return Matrix.Translation((x, y, z))

def Rx(a):
    return Matrix.Rotation(a, 4, "X")

def Ry(a):
    return Matrix.Rotation(a, 4, "Y")

def Rz(a):
    return Matrix.Rotation(a, 4, "Z")

def lerp(a, b, t):
    return a + (b - a) * t

def clamp(x, a, b):
    return max(a, min(b, x))

def smoothstep(a, b, x):
    t = clamp((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)

def gauss(x, c, w):
    return math.exp(-((x - c) / w) ** 2)

def interp(pts, x):
    """piecewise-linear interpolation through [(x, y), ...] (sorted by x), smoothed with smoothstep per segment"""
    if x <= pts[0][0]:
        return pts[0][1]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x <= x1:
            t = (x - x0) / (x1 - x0)
            t = t * t * (3 - 2 * t)
            return y0 + (y1 - y0) * t
    return pts[-1][1]

def frame(x_axis, z_hint, origin):
    """4x4 with local +X along x_axis, local +Z as close as possible to z_hint, at origin (Blender vectors)."""
    x = Vector(x_axis).normalized()
    z = Vector(z_hint)
    z = (z - x * z.dot(x)).normalized()
    y = z.cross(x)
    m = Matrix.Identity(4)
    for i in range(3):
        m[i][0], m[i][1], m[i][2], m[i][3] = x[i], y[i], z[i], origin[i]
    return m

# ----------------------------------------------------------------------------------------------
# scene / materials
# ----------------------------------------------------------------------------------------------
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    make_materials()

def make_materials():
    for name, (col, met, rough) in MAT_DEF.items():
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = col
        b.inputs["Metallic"].default_value = met
        b.inputs["Roughness"].default_value = rough
        m.diffuse_color = col
        if name == "gauges":
            img = bpy.data.images.load(ATLAS)
            img.pack()
            tx = m.node_tree.nodes.new("ShaderNodeTexImage")
            tx.image = img
            tx.interpolation = "Linear"
            m.node_tree.links.new(tx.outputs["Color"], b.inputs["Base Color"])
        if name.startswith("leather"):
            try:
                b.inputs["Sheen Weight"].default_value = 0.25
            except Exception:
                pass
        MATS[name] = m

# ----------------------------------------------------------------------------------------------
# texture atlas (1024 px): dial faces (coupe: grey faces, white italic numerals), PRND plate, roundel
# ----------------------------------------------------------------------------------------------
UV = {  # atlas regions (u0, v0, size) in 0..1, v up (Blender UV)
    "speedo": (0.0, 0.5, 0.5), "tacho": (0.5, 0.5, 0.5),
    "fuel": (0.0, 0.25, 0.25), "temp": (0.25, 0.25, 0.25),
    "prnd": (0.5, 0.25, 0.25), "roundel": (0.75, 0.25, 0.25),
    "black": (0.0, 0.0, 0.25),
}

def make_atlas():
    from PIL import Image, ImageDraw, ImageFont
    S = 1024
    im = Image.new("RGB", (S, S), (6, 6, 6))
    dr = ImageDraw.Draw(im)
    grey = (92, 94, 98)
    white = (236, 236, 232)
    red = (210, 40, 30)

    def font(sz, bold=True):
        f = "BarlowCondensed-SemiBold.ttf" if bold else "BarlowCondensed-Medium.ttf"
        return ImageFont.truetype(os.path.join(FONT_DIR, f), sz)

    def italic_text(img, xy, txt, sz, col=white, anchor="mm"):
        f = font(sz)
        w, h = int(sz * 0.62 * len(txt) + sz), int(sz * 1.6)
        t = Image.new("L", (w, h), 0)
        ImageDraw.Draw(t).text((w / 2, h / 2), txt, font=f, fill=255, anchor="mm")
        t = t.transform(t.size, Image.AFFINE, (1, 0.18, -0.18 * h / 2, 0, 1, 0), resample=Image.BICUBIC)
        col_img = Image.new("RGB", t.size, col)
        img.paste(col_img, (int(xy[0] - w / 2), int(xy[1] - h / 2)), t)

    def region_px(key):
        u0, v0, s = UV[key]
        x0 = int(u0 * S)
        y0 = int((1 - v0 - s) * S)
        return x0, y0, int(s * S)

    def dial(key, a0, a1, n_major, n_minor, labels, label_r=0.66, tick_r=(0.80, 0.93), sz=44, red_from=None):
        x0, y0, s = region_px(key)
        cx, cy, R = x0 + s / 2, y0 + s / 2, s / 2 * 0.985
        dr.ellipse((cx - R, cy - R, cx + R, cy + R), fill=grey)
        tot = (n_major - 1) * n_minor
        for i in range(tot + 1):
            a = (a0 + (a1 - a0) * i / tot) * D2R
            major = i % n_minor == 0
            r0 = R * (tick_r[0] if major else tick_r[0] + 0.06)
            r1 = R * tick_r[1]
            col = white
            if red_from is not None and i / tot >= red_from:
                col = red
            dr.line((cx + r0 * math.sin(a), cy - r0 * math.cos(a), cx + r1 * math.sin(a), cy - r1 * math.cos(a)),
                    fill=col, width=int(R * (0.035 if major else 0.016)))
        for j, lab in enumerate(labels):
            if not lab:
                continue
            a = (a0 + (a1 - a0) * j / (len(labels) - 1)) * D2R
            italic_text(im, (cx + R * label_r * math.sin(a), cy - R * label_r * math.cos(a)), lab, sz)
        if red_from is not None:
            for k in range(30):
                t = red_from + (1 - red_from) * k / 29
                a = (a0 + (a1 - a0) * t) * D2R
                rr = R * 0.955
                dr.ellipse((cx + rr * math.sin(a) - 4, cy - rr * math.cos(a) - 4, cx + rr * math.sin(a) + 4,
                            cy - rr * math.cos(a) + 4), fill=red)
        return cx, cy, R

    # speedometer 0..260 km/h, 0 at about 7.30 o'clock, 260 at about 4.30 o'clock
    cx, cy, R = dial("speedo", -128, 128, 14, 2, ["", "20", "40", "60", "80", "100", "120", "140", "160", "180",
                                                  "200", "220", "240", "260"], sz=46)
    italic_text(im, (cx, cy + R * 0.42), "km/h", 30)
    # rev counter 0..7 x1000/min, red from 6.5, economy gauge inset at the bottom
    cx, cy, R = dial("tacho", -128, 100, 8, 4, ["0", "1", "2", "3", "4", "5", "6", "7"], sz=56, red_from=6.5 / 7)
    italic_text(im, (cx, cy - R * 0.30), "1/min x1000", 26)
    ex, ey, er = cx + R * 0.05, cy + R * 0.52, R * 0.30
    for k in range(9):
        a = (-70 + 140 * k / 8) * D2R
        dr.line((ex + er * 0.75 * math.sin(a), ey - er * 0.75 * math.cos(a), ex + er * math.sin(a),
                 ey - er * math.cos(a)), fill=white, width=4)
    italic_text(im, (ex, ey + er * 0.25), "L/100km", 20)
    # fuel and coolant temperature
    cx, cy, R = dial("fuel", -60, 60, 3, 2, ["0", "1/2", "1/1"], sz=34, label_r=0.58, tick_r=(0.74, 0.92))
    dr.rectangle((cx - 10, cy + R * 0.18, cx + 10, cy + R * 0.42), fill=white)
    cx, cy, R = dial("temp", -60, 60, 2, 4, ["", ""], sz=30, label_r=0.6, tick_r=(0.74, 0.92))
    dr.rectangle((cx - R * 0.62, cy - R * 0.62, cx - R * 0.44, cy - R * 0.44), fill=(40, 90, 210))
    dr.rectangle((cx + R * 0.44, cy - R * 0.62, cx + R * 0.62, cy - R * 0.44), fill=red)
    # Steptronic gate plate (pre-9/2001: forward = +): P R N D column, M/S gate on the left with + forward, - back
    x0, y0, s = region_px("prnd")
    dr.rectangle((x0, y0, x0 + s, y0 + s), fill=(10, 10, 11))
    col_x = x0 + s * 0.66
    for k, ch in enumerate("PRND"):
        italic_text(im, (col_x, y0 + s * (0.16 + 0.22 * k)), ch, 52)
        dr.line((col_x - s * 0.16, y0 + s * (0.16 + 0.22 * k), col_x - s * 0.10, y0 + s * (0.16 + 0.22 * k)),
                fill=white, width=4)
    dr.ellipse((col_x + s * 0.13 - 6, y0 + s * 0.16 - 6, col_x + s * 0.13 + 6, y0 + s * 0.16 + 6),
               fill=(255, 120, 20))
    italic_text(im, (x0 + s * 0.24, y0 + s * 0.46), "+", 48)
    italic_text(im, (x0 + s * 0.24, y0 + s * 0.70), "M/S", 30)
    italic_text(im, (x0 + s * 0.24, y0 + s * 0.90), "-", 52)
    # roundel
    x0, y0, s = region_px("roundel")
    try:
        r = Image.open(os.path.join(ROOT, "build", "roundel.png")).convert("RGBA").resize((s, s), Image.LANCZOS)
        bg = Image.new("RGBA", (s, s), (10, 10, 10, 255))
        bg.alpha_composite(r)
        im.paste(bg.convert("RGB"), (x0, y0))
    except Exception as e:
        print("roundel missing", e)
    im.save(ATLAS)

# ----------------------------------------------------------------------------------------------
# bmesh builders (closed geometry; all coordinates passed through B() unless noted)
# ----------------------------------------------------------------------------------------------
def grid_solid(bm, us, vs, ws, f, M=None):
    """Closed quad surface of the unit box sampled at params us x vs x ws, mapped by f(u, v, w) -> car (X, Y, Z),
    or, when M is given, f returns Blender-local coordinates that M maps to the world."""
    nu, nv, nw = len(us), len(vs), len(ws)
    cache = {}

    def V(i, j, k):
        key = (i, j, k)
        if key not in cache:
            p = f(us[i], vs[j], ws[k])
            cache[key] = bm.verts.new(B(*p) if M is None else M @ Vector(p))
        return cache[key]

    def quad(a, b, c, d):
        try:
            bm.faces.new((a, b, c, d))
        except ValueError:
            pass
    for i in (0, nu - 1):
        for j in range(nv - 1):
            for k in range(nw - 1):
                quad(V(i, j, k), V(i, j + 1, k), V(i, j + 1, k + 1), V(i, j, k + 1))
    for j in (0, nv - 1):
        for i in range(nu - 1):
            for k in range(nw - 1):
                quad(V(i, j, k), V(i + 1, j, k), V(i + 1, j, k + 1), V(i, j, k + 1))
    for k in (0, nw - 1):
        for i in range(nu - 1):
            for j in range(nv - 1):
                quad(V(i, j, k), V(i + 1, j, k), V(i + 1, j + 1, k), V(i, j + 1, k))
    return list(cache.values())

def lin(n, a=0.0, b=1.0):
    return [a + (b - a) * i / (n - 1) for i in range(n)]

def edge_params(n, e=0.05):
    """params 0..1 with extra loops near both ends (keeps subdivided edges tight)"""
    inner = lin(n, e, 1 - e)
    return [0.0] + inner + [1.0]

def add_box(bm, c, size, M=None, bevel=0.0, seg=2):
    """Box centred at car point c with car-axis sizes (sx, sy, sz); optional local rotation M (Blender 3x3/4x4)."""
    before = set(bm.verts)
    r = bmesh.ops.create_cube(bm, size=1.0)
    vs = r["verts"]
    sx, sy, sz = size
    bmesh.ops.scale(bm, vec=(sx, sz, sy), verts=vs)
    if bevel > 0:
        edges = list({e for v in vs for e in v.link_edges})
        bmesh.ops.bevel(bm, geom=edges + vs, offset=bevel, offset_type="OFFSET", segments=seg, profile=0.5,
                        affect="EDGES", clamp_overlap=True)
        vs = [v for v in bm.verts if v not in before]
    if M is not None:
        bmesh.ops.transform(bm, matrix=M, verts=vs)
    bmesh.ops.translate(bm, vec=B(*c), verts=vs)
    return vs

def add_box_local(bm, M, c, size, bevel=0.0, seg=1):
    """Box with sizes `size` along the local axes of M (Blender 4x4), centred at local point c."""
    before = set(bm.verts)
    vs = bmesh.ops.create_cube(bm, size=1.0)["verts"]
    bmesh.ops.scale(bm, vec=size, verts=vs)
    if bevel > 0:
        edges = list({e for v in vs for e in v.link_edges})
        bmesh.ops.bevel(bm, geom=edges + vs, offset=bevel, offset_type="OFFSET", segments=seg, profile=0.5,
                        affect="EDGES", clamp_overlap=True)
        vs = [v for v in bm.verts if v not in before]
    bmesh.ops.transform(bm, matrix=M @ T(*c), verts=vs)
    return vs

def add_lathe(bm, prof, M, seg=24):
    """Revolve [(r, z), ...] about local Z; points with r==0 sit on the axis. M: local -> Blender world."""
    rings = []
    for (r, z) in prof:
        if r <= 1e-9:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z))
                          for i in range(seg)])
    for A, Bv in zip(rings, rings[1:]):
        for i in range(seg):
            i2 = (i + 1) % seg
            if len(A) == 1 and len(Bv) == 1:
                continue
            if len(A) == 1:
                bm.faces.new((A[0], Bv[i], Bv[i2]))
            elif len(Bv) == 1:
                bm.faces.new((A[i], Bv[0], A[i2]))
            else:
                bm.faces.new((A[i], Bv[i], Bv[i2], A[i2]))
    if len(rings[0]) > 2:
        bm.faces.new(list(reversed(rings[0])))
    if len(rings[-1]) > 2:
        bm.faces.new(rings[-1])
    vs = [v for r in rings for v in r]
    bmesh.ops.transform(bm, matrix=M, verts=vs)
    return vs

def add_cyl(bm, p0, p1, r, seg=16, r1=None):
    """Cylinder between car points p0 and p1."""
    a, b = B(*p0), B(*p1)
    d = b - a
    M = frame(d.orthogonal(), d, a)          # local Z along d
    return add_lathe(bm, [(0, 0), (r, 0), (r if r1 is None else r1, d.length), (0, d.length)], M, seg)

def add_loft(bm, loops, cap=True):
    """Connect equal-length closed loops of Blender points; cap the ends with n-gons."""
    rings = [[bm.verts.new(p) for p in loop] for loop in loops]
    m = len(loops[0])
    for A, Bv in zip(rings, rings[1:]):
        for i in range(m):
            j = (i + 1) % m
            bm.faces.new((A[i], A[j], Bv[j], Bv[i]))
    if cap:
        bm.faces.new(list(reversed(rings[0])))
        bm.faces.new(rings[-1])
    return [v for r in rings for v in r]

def ptf_frames(P, up):
    tans = []
    for i in range(len(P)):
        if i == 0:
            t = P[1] - P[0]
        elif i == len(P) - 1:
            t = P[-1] - P[-2]
        else:
            t = (P[i + 1] - P[i]).normalized() + (P[i] - P[i - 1]).normalized()
        tans.append(t.normalized())
    n = Vector(up) - tans[0] * Vector(up).dot(tans[0])
    n.normalize()
    out = []
    for i, t in enumerate(tans):
        if i > 0:
            t0 = tans[i - 1]
            ax = t0.cross(t)
            if ax.length > 1e-9:
                n = Matrix.Rotation(math.acos(clamp(t0.dot(t), -1, 1)), 3, ax.normalized()) @ n
            n = (n - t * n.dot(t)).normalized()
        out.append((t, n, t.cross(n)))
    return out

def add_sweep(bm, path_car, prof, up_car=(0, 1, 0), scales=None):
    """Sweep a closed 2D profile [(a, b)] (a along the frame normal ~ up, b along the binormal) along a car path."""
    P = [B(*p) for p in path_car]
    fr = ptf_frames(P, B(*up_car))
    loops = []
    for i, p in enumerate(P):
        t, n, bn = fr[i]
        s = scales[i] if scales else 1.0
        sa, sb = (s, s) if not isinstance(s, tuple) else s
        loops.append([p + n * (a * sa) + bn * (b * sb) for (a, b) in prof])
    return add_loft(bm, loops)

def rrect(w, h, r, n=3):
    r = min(r, w / 2 - 1e-5, h / 2 - 1e-5)
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180),
                       (w / 2 - r, -h / 2 + r, 270)):
        for k in range(n + 1):
            a = (a0 + 90 * k / n) * D2R
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts

def catmull2(points, n=4, closed=True):
    P = [Vector(p) for p in points]
    m = len(P)
    out = []
    rng = range(m) if closed else range(m - 1)
    for i in rng:
        p0 = P[(i - 1) % m] if closed or i > 0 else P[0] * 2 - P[1]
        p1, p2 = P[i], P[(i + 1) % m]
        p3 = P[(i + 2) % m] if closed or i + 2 < m else P[-1] * 2 - P[-2]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
                              (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    if not closed:
        out.append(P[-1])
    return out

def add_disc_uv(bm, uvl, center, normal, up, r, region, seg=40, thick=0.002, inset=1.0):
    """Thin textured disc (closed): front face mapped to atlas `region`; center/normal/up are Blender vectors."""
    n = Vector(normal).normalized()
    u = (Vector(up) - n * Vector(up).dot(n)).normalized()
    s = u.cross(n)                     # screen-right as seen from the front (looking along -n)
    u0, v0, sz = UV[region]
    cu, cv, rr = u0 + sz / 2, v0 + sz / 2, sz / 2 * inset
    front = [bm.verts.new(center + (s * math.cos(2 * math.pi * i / seg) + u * math.sin(2 * math.pi * i / seg)) * r)
             for i in range(seg)]
    back = [bm.verts.new(v.co - n * thick) for v in front]
    cf = bm.verts.new(center)
    cb = bm.verts.new(center - n * thick)
    faces_front = []
    for i in range(seg):
        j = (i + 1) % seg
        faces_front.append(bm.faces.new((cf, front[i], front[j])))
        bm.faces.new((cb, back[j], back[i]))
        bm.faces.new((front[i], back[i], back[j], front[j]))
    for f in faces_front:
        for lp in f.loops:
            d = lp.vert.co - center
            lp[uvl].uv = (cu + d.dot(s) / r * rr, cv + d.dot(u) / r * rr)
    return front + back + [cf, cb]

def add_quad_uv(bm, uvl, center, normal, up, w, h, region, thick=0.002):
    """Thin textured rectangle; front mapped to the full atlas region."""
    n = Vector(normal).normalized()
    u = (Vector(up) - n * Vector(up).dot(n)).normalized()
    s = u.cross(n)
    corners = [(-1, -1), (1, -1), (1, 1), (-1, 1)]
    F = [bm.verts.new(center + s * (cx * w / 2) + u * (cy * h / 2)) for cx, cy in corners]
    Bk = [bm.verts.new(v.co - n * thick) for v in F]
    ff = bm.faces.new(F)
    bm.faces.new(list(reversed(Bk)))
    for i in range(4):
        j = (i + 1) % 4
        bm.faces.new((F[i], Bk[i], Bk[j], F[j]))
    u0, v0, sz = UV[region]
    for lp in ff.loops:
        d = lp.vert.co - center
        lp[uvl].uv = (u0 + (d.dot(s) / w + 0.5) * sz, v0 + (d.dot(u) / h + 0.5) * sz)

# ----------------------------------------------------------------------------------------------
# objects / nodes
# ----------------------------------------------------------------------------------------------
class Piece:
    """Collects bmesh geometry per (material, subdivision level); becomes Blender objects."""
    def __init__(self, name):
        self.name = name
        self.bms = {}

    def bm(self, mat, subd=0):
        key = (mat, subd)
        if key not in self.bms:
            self.bms[key] = bmesh.new()
        return self.bms[key]

    def uv(self, mat, subd=0):
        b = self.bm(mat, subd)
        lay = b.loops.layers.uv.active or b.loops.layers.uv.new("UVMap")
        return b, lay

    def objects(self):
        obs = []
        for (mat, subd), bm in self.bms.items():
            if not bm.verts:
                bm.free()
                continue
            me = bpy.data.meshes.new(f"{self.name}_{mat}")
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            bm.to_mesh(me)
            bm.free()
            ob = bpy.data.objects.new(f"{self.name}_{mat}_{subd}", me)
            bpy.context.scene.collection.objects.link(ob)
            me.materials.append(MATS[mat])
            if subd > 0:
                m = ob.modifiers.new("subd", "SUBSURF")
                m.levels = subd
                m.render_levels = subd
                m.quality = 3
                apply_mods(ob)
            for p in ob.data.polygons:
                p.use_smooth = True
            obs.append(ob)
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

def join(obs, name):
    obs = [o for o in obs if o is not None]
    if len(obs) > 1:
        ctx = {"active_object": obs[0], "selected_editable_objects": obs, "selected_objects": obs}
        with bpy.context.temp_override(**ctx):
            bpy.ops.object.join()
    o = obs[0]
    o.name = name
    o.data.name = name
    return o

def shade(ob, angle=40):
    me = ob.data
    for p in me.polygons:
        p.use_smooth = True
    try:
        me.set_sharp_from_angle(angle=angle * D2R)
    except Exception:
        pass

def make_node(name, piece, M_world, parent=None, extras=None, angle=40):
    """Join the piece (built in world coordinates) into one object whose origin/axes are M_world."""
    ob = join(piece.objects(), name)
    ob.data.transform(M_world.inverted())
    ob.matrix_world = M_world
    shade(ob, angle)
    if parent is not None:
        ob.parent = parent
        ob.matrix_parent_inverse = parent.matrix_world.inverted()
        ob.matrix_world = M_world
    for k, v in (extras or {}).items():
        ob[k] = v
    return ob

def empty_node(name, M_world, parent=None, extras=None):
    ob = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(ob)
    ob.empty_display_size = 0.05
    ob.matrix_world = M_world
    if parent is not None:
        ob.parent = parent
        ob.matrix_parent_inverse = parent.matrix_world.inverted()
        ob.matrix_world = M_world
    for k, v in (extras or {}).items():
        ob[k] = v
    return ob

def tri_count(ob):
    if ob.type != "MESH":
        return 0
    return sum(len(p.vertices) - 2 for p in ob.data.polygons)

def Tcar(X, Y, Z):
    return Matrix.Translation(B(X, Y, Z))

def add_torus(bm, center, normal, R, r, seg=48, seg2=10, r_ax=None):
    """Torus (Blender coords): ring radius R about `normal`, tube radii r (radial) / r_ax (axial)."""
    n = Vector(normal).normalized()
    M = frame(n.orthogonal(), n, center)
    ra = r if r_ax is None else r_ax
    rings = []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        ring = []
        for k in range(seg2):
            b = 2 * math.pi * k / seg2
            rr = R + r * math.cos(b)
            ring.append(bm.verts.new(M @ Vector((rr * math.cos(a), rr * math.sin(a), ra * math.sin(b)))))
        rings.append(ring)
    for i in range(seg):
        A, Bv = rings[i], rings[(i + 1) % seg]
        for k in range(seg2):
            k2 = (k + 1) % seg2
            bm.faces.new((A[k], Bv[k], Bv[k2], A[k2]))

def disc_map(s, t):
    """square [-1,1]^2 -> unit disc (keeps a quad grid well spread)"""
    return s * math.sqrt(max(0.0, 1 - t * t / 2)), t * math.sqrt(max(0.0, 1 - s * s / 2))

# ==============================================================================================
# SEATS
# ==============================================================================================
TH_BACK = 23.5 * D2R       # front backrest angle from vertical (drawing: 23-24 deg)

def front_seat(P, zc, side):
    """One front seat (grey leather) at lateral centre zc; side = -1 driver (outboard -Z) / +1 passenger."""
    ox, oy = SEAT_O
    sa, ca = math.sin(TH_BACK), math.cos(TH_BACK)
    A = (-sa, ca)               # up along the backrest
    N = (ca, sa)                # forward normal of the backrest
    R0 = (-0.19, 0.20)          # backrest bottom-rear (local)
    HB = 0.57

    def cushion(u, v, w):
        s = 2 * u - 1
        W = lerp(0.50, 0.475, v)
        x = lerp(-0.17, 0.37, v)
        ybot = 0.175 + 0.02 * v
        yc = interp([(0, 0.243), (0.3, 0.246), (0.6, 0.262), (0.85, 0.284), (1.0, 0.29)], v)
        bol = 0.048 * smoothstep(0.48, 0.84, abs(s)) * (1 - 0.55 * smoothstep(0.55, 1.0, v))
        seam = -0.006 * gauss(abs(s), 0.46, 0.05) * (1 - smoothstep(0.85, 1.0, v))   # bolster seam groove
        y = lerp(ybot, yc + bol + seam, w)
        return (ox + x, oy + y, zc + s * W / 2)
    us = [0, 0.03, 0.1, 0.18, 0.24, 0.3, 0.4, 0.5, 0.6, 0.7, 0.76, 0.82, 0.9, 0.97, 1]
    grid_solid(P.bm("leather_grey", 2), us, [0, 0.04, 0.15, 0.3, 0.45, 0.6, 0.72, 0.84, 0.93, 0.97, 1],
               [0, 0.35, 0.75, 0.93, 1], cushion)

    def back(u, v, w):
        s = 2 * u - 1
        W = lerp(0.50, 0.445, smoothstep(0.15, 1.0, v))
        lumb = 0.022 * gauss(v, 0.28, 0.14)
        bol = 0.055 * smoothstep(0.48, 0.84, abs(s)) * (1 - 0.6 * smoothstep(0.55, 1.0, v))
        seam = -0.006 * gauss(abs(s), 0.46, 0.05) * (1 - smoothstep(0.85, 1.0, v))
        tf = 0.085 + lumb + bol + seam
        tr = -0.012 * (1 - s * s)
        t = lerp(tr, tf, w)
        d = v * HB
        x = R0[0] + d * A[0] + t * N[0]
        y = R0[1] + d * A[1] + t * N[1]
        return (ox + x, oy + y, zc + s * W / 2)
    grid_solid(P.bm("leather_grey", 2), us, [0, 0.05, 0.15, 0.28, 0.42, 0.56, 0.7, 0.82, 0.92, 0.97, 1],
               [0, 0.3, 0.7, 0.92, 1], back)

    # headrest on two chrome posts (drawing: X -0.44..-0.545, Y 0.98..1.155)
    th = 14 * D2R
    ah, nh = (-math.sin(th), math.cos(th)), (math.cos(th), math.sin(th))
    hc = (-0.397, 0.866)

    def head(u, v, w):
        s, q = 2 * u - 1, 2 * v - 1
        Wd = 0.27 * (1 - 0.10 * smoothstep(0.0, 1.0, q))
        h = q * 0.086
        t = lerp(-0.047 + 0.008 * s * s, 0.052 - 0.014 * s * s, w)
        return (ox + hc[0] + h * ah[0] + t * nh[0], oy + hc[1] + h * ah[1] + t * nh[1], zc + s * Wd / 2)
    grid_solid(P.bm("leather_grey", 2), edge_params(6, 0.06), edge_params(5, 0.07), [0, 0.12, 0.88, 1], head)
    top = (R0[0] + HB * A[0] + 0.045 * N[0], R0[1] + HB * A[1] + 0.045 * N[1])
    hb = (hc[0] - 0.05 * ah[0], hc[1] - 0.05 * ah[1])
    for dz in (-0.075, 0.075):
        add_cyl(P.bm("alu_machined"), (ox + top[0] - 0.06 * A[0], oy + top[1] - 0.06 * A[1], zc + dz),
                (ox + hb[0], oy + hb[1], zc + dz), 0.0065, seg=12)

    # seat pan (black plastic shell under the cushion) and the outboard side shield with the recliner hub
    def pan(u, v, w):
        s = 2 * u - 1
        return (ox + lerp(-0.21, 0.35, v), oy + lerp(0.10, 0.19, w), zc + s * 0.236)
    grid_solid(P.bm("interior_black", 1), edge_params(4, 0.06), edge_params(4, 0.06), [0, 0.1, 0.9, 1], pan)

    def shield(u, v, w):
        zz = side * lerp(0.236, 0.262, w)
        x = lerp(-0.25, 0.30, u)
        ytop = lerp(0.215, 0.255, smoothstep(0.0, 0.5, 1 - u)) - 0.03 * smoothstep(0.7, 1.0, u)
        return (ox + x, oy + lerp(0.09, ytop, v), zc + zz)
    grid_solid(P.bm("interior_black", 1), edge_params(5, 0.05), edge_params(3, 0.08), [0, 1], shield)
    hub = (ox - 0.165, oy + 0.245)
    add_cyl(P.bm("plastic_black"), (hub[0], hub[1], zc + side * 0.255), (hub[0], hub[1], zc + side * 0.285), 0.042,
            seg=24, r1=0.036)
    add_box(P.bm("plastic_black"), (ox + 0.17, oy + 0.15, zc + side * 0.266), (0.10, 0.018, 0.012), bevel=0.004)

    # rails and risers (floor at Y 0.20)
    for dz in (-0.17, 0.17):
        add_box(P.bm("steel_dark"), (ox + 0.0, oy + 0.016, zc + dz), (0.66, 0.032, 0.036), bevel=0.003, seg=1)
        for x in (-0.20, 0.26):
            add_box(P.bm("steel_dark"), (ox + x, oy + 0.07, zc + dz), (0.03, 0.08, 0.022), bevel=0.002, seg=1)

REAR_PHI = 37 * D2R        # rear backrest angle from vertical (drawing)

def rear_bench(P):
    ox, oy = REAR_O

    def cushion(u, v, w):
        s = 2 * u - 1
        hw = lerp(0.552, 0.58, v)
        z = s * hw
        az = abs(z)
        base = interp([(0, 0.272), (0.3, 0.286), (0.6, 0.306), (0.85, 0.338), (1.0, 0.35)], v)
        cont = (-0.026 * gauss(az, 0.34, 0.12) + 0.006 * gauss(z, 0, 0.07) + 0.014 * gauss(az, 0.165, 0.045)
                + 0.024 * smoothstep(0.47, 0.55, az))
        cont *= 0.35 + 0.65 * smoothstep(0.0, 0.45, v)
        y = lerp(0.185, base + cont, w)
        return (ox + lerp(-0.20, 0.27, v), oy + y, z)
    us = [0, 0.015] + lin(23, 0.04, 0.96) + [0.985, 1]
    grid_solid(P.bm("leather_grey", 2), us, [0, 0.04, 0.15, 0.3, 0.5, 0.7, 0.85, 0.94, 0.98, 1],
               [0, 0.4, 0.85, 1], cushion)

    sp, cp = math.sin(REAR_PHI), math.cos(REAR_PHI)
    A, N = (-sp, cp), (cp, sp)
    R0, HB = (-0.12, 0.25), 0.62

    def back(u, v, w):
        s = 2 * u - 1
        hw = 0.555 + 0.06 * smoothstep(0.45, 0.62, v) - 0.04 * smoothstep(0.9, 1.0, v)
        z = s * hw
        az = abs(z)
        front = (-0.024 * gauss(az, 0.34, 0.13) + 0.03 * gauss(az, hw - 0.02, 0.06) + 0.018 * gauss(az, 0.15, 0.045)
                 + 0.016 * gauss(v, 0.32, 0.2))
        t = lerp(-0.13, front, w)
        d = v * HB
        return (ox + R0[0] + d * A[0] + t * N[0], oy + R0[1] + d * A[1] + t * N[1], z)
    grid_solid(P.bm("leather_grey", 2), us, [0, 0.05, 0.15, 0.3, 0.45, 0.55, 0.65, 0.78, 0.9, 0.96, 1],
               [0, 0.3, 0.8, 1], back)
    # integrated rear head restraints for the two outboard seats (a headrest per outboard passenger)
    th = 30 * D2R
    ah, nh = (-math.sin(th), math.cos(th)), (math.cos(th), math.sin(th))
    top = (R0[0] + HB * A[0] - 0.035 * N[0], R0[1] + HB * A[1] - 0.035 * N[1])
    for zc in (-0.34, 0.34):
        def head(u, v, w, zc=zc):
            s, q = 2 * u - 1, 2 * v - 1
            Wd = 0.23 * (1 - 0.12 * smoothstep(0.0, 1.0, q))
            h = 0.045 + q * 0.06
            t = lerp(-0.040, 0.040 - 0.012 * s * s, w)
            return (ox + top[0] + h * ah[0] + t * nh[0], oy + top[1] + h * ah[1] + t * nh[1], zc + s * Wd / 2)
        grid_solid(P.bm("leather_grey", 2), edge_params(5, 0.07), edge_params(4, 0.08), [0, 0.15, 0.85, 1], head)

# ==============================================================================================
# DASHBOARD (loft of side profiles along Z; driver-side cluster recess under the binnacle hood)
# ==============================================================================================
DASH_TOP = [(0.868, 0.900), (0.78, 0.915), (0.66, 0.924), (0.55, 0.926), (0.47, 0.921)]
PROF_DRV = DASH_TOP + [(0.425, 0.906), (0.398, 0.880), (0.386, 0.848), (0.384, 0.818), (0.386, 0.795),
                       (0.389, 0.770), (0.398, 0.745), (0.43, 0.68), (0.47, 0.64), (0.53, 0.612), (0.62, 0.60),
                       (0.74, 0.605), (0.82, 0.67), (0.862, 0.80)]
PROF_PAS = DASH_TOP + [(0.425, 0.906), (0.398, 0.880), (0.386, 0.848), (0.384, 0.818), (0.386, 0.795),
                       (0.389, 0.770), (0.398, 0.745), (0.42, 0.69), (0.45, 0.625), (0.50, 0.578), (0.58, 0.56),
                       (0.70, 0.565), (0.80, 0.62), (0.855, 0.75)]
PROF_CLU = [(0.868, 0.900), (0.78, 0.915), (0.70, 0.922), (0.62, 0.924), (0.555, 0.918), (0.537, 0.908),
            (0.522, 0.888), (0.512, 0.862), (0.505, 0.840), (0.47, 0.827), (0.405, 0.820), (0.396, 0.795),
            (0.398, 0.745)] + PROF_DRV[12:]
CLU_Z, CLU_HW = -SEAT_Z, 0.215          # binnacle centre (on the steering column) and arch half-width
DASH_END = 0.685

def dash_profile(Z):
    wc = smoothstep(CLU_HW + 0.02, CLU_HW - 0.015, abs(Z - CLU_Z))
    wd = smoothstep(-0.10, -0.16, Z)
    base = [(lerp(p[0], d[0], wd), lerp(p[1], d[1], wd)) for p, d in zip(PROF_PAS, PROF_DRV)]
    prof = [(lerp(b[0], c[0], wc), lerp(b[1], c[1], wc)) for b, c in zip(base, PROF_CLU)]
    pts = catmull2(prof, n=2)
    # ends: shrink toward the profile centre, a soft rounded end against the door cards
    e = smoothstep(DASH_END - 0.03, DASH_END, abs(Z))
    if e > 0:
        cx = sum(p[0] for p in pts) / len(pts)
        cy = sum(p[1] for p in pts) / len(pts)
        k = 1 - 0.10 * e
        pts = [Vector((cx + (p[0] - cx) * k, cy + (p[1] - cy) * k)) for p in pts]
    # plan curvature: the face sweeps slightly rearward toward the doors
    return [(p[0] - 0.012 * (abs(Z) / DASH_END) ** 2 * smoothstep(0.62, 0.40, p[0]), p[1]) for p in pts]

def dash_stations():
    zs = set(round(z, 4) for z in lin(47, -DASH_END, DASH_END))
    for a, b in ((CLU_Z - CLU_HW - 0.03, CLU_Z - CLU_HW + 0.03), (CLU_Z + CLU_HW - 0.03, CLU_Z + CLU_HW + 0.03),
                 (-0.17, -0.09), (-DASH_END, -DASH_END + 0.035), (DASH_END - 0.035, DASH_END)):
        for z in lin(8, a, b):
            zs.add(round(z, 4))
    return sorted(zs)

def vent(P, c, w, h, n_slats=5):
    """Air vent on the dash face: surround, dark opening, horizontal slats, a satin adjuster knob. c = car point
    on the face (X = face), w along Z, h along Y."""
    X, Y, Z = c
    add_box(P.bm("interior_black"), (X + 0.022, Y, Z), (0.05, h + 0.016, w + 0.016), bevel=0.005)
    add_box(P.bm("plastic_black"), (X + 0.012, Y, Z), (0.05, h, w), bevel=0.002, seg=1)
    for k in range(n_slats):
        yy = Y - h / 2 + h * (k + 0.5) / n_slats
        add_box(P.bm("interior_black"), (X - 0.004, yy, Z), (0.03, 0.0035, w - 0.004), bevel=0.0012, seg=1)
    add_box(P.bm("trim_titan"), (X - 0.013, Y, Z), (0.012, 0.016, 0.009), bevel=0.003)

def build_dashboard():
    P = Piece("dashboard")
    loops = [[B(x, y, z) for (x, y) in dash_profile(z)] for z in dash_stations()]
    add_loft(P.bm("interior_black"), loops)

    # binnacle hood: a visor swept along an arch around the cluster (E46: deep hood over four dials)
    Yc, b_ax = 0.835, 0.158
    prof = [(0.0, 0.0), (0.012, 0.008), (0.020, 0.04), (0.022, 0.10), (0.015, 0.16), (-0.005, 0.22), (-0.035, 0.28),
            (-0.075, 0.33), (-0.095, 0.33), (-0.088, 0.15), (-0.045, 0.05), (-0.012, 0.012)]
    loops = []
    for i in range(41):
        t = (-12 + 204 * i / 40) * D2R
        z, y = CLU_Z + CLU_HW * math.cos(t), Yc + b_ax * math.sin(t)
        nz, ny = math.cos(t) / CLU_HW, math.sin(t) / b_ax
        L = math.hypot(nz, ny)
        nz, ny = nz / L, ny / L
        lip_x = 0.372
        loops.append([B(lip_x + dx, y + dr * ny, z + dr * nz) for (dr, dx) in prof])
    add_loft(P.bm("interior_black", 1), loops)

    # centre stack (radio + automatic climate control) below the centre vents
    def stack(u, v, w):
        s = 2 * u - 1
        Xr = lerp(0.392, 0.386, v)
        return (lerp(Xr, 0.60, w), lerp(0.565, 0.835, v), s * lerp(0.118, 0.126, v))
    grid_solid(P.bm("interior_black", 1), edge_params(4, 0.06), edge_params(5, 0.05), [0, 0.06, 1], stack)
    face_x = lambda y: lerp(0.392, 0.386, (y - 0.565) / 0.27)
    for (y0, y1, wdt) in ((0.732, 0.796, 0.205), (0.642, 0.718, 0.205), (0.586, 0.628, 0.17)):
        yc = (y0 + y1) / 2
        add_box(P.bm("plastic_black"), (face_x(yc) + 0.004, yc, 0), (0.03, y1 - y0, wdt), bevel=0.004)
    # radio: display + preset buttons; climate: two temperature displays + button rows
    add_box(P.bm("trim_titan"), (face_x(0.776) - 0.012, 0.776, 0), (0.006, 0.014, 0.07), bevel=0.001, seg=1)
    for k in range(6):
        add_box(P.bm("interior_black"), (face_x(0.748) - 0.012, 0.748, -0.075 + 0.03 * k), (0.008, 0.011, 0.022),
                bevel=0.002, seg=1)
    for zz in (-0.085, 0.085):
        add_cyl(P.bm("trim_titan"), (face_x(0.764) - 0.010, 0.764, zz), (face_x(0.764) - 0.022, 0.764, zz), 0.011,
                seg=20)
    for k in range(5):
        for row, yy in enumerate((0.700, 0.662)):
            add_box(P.bm("interior_black"), (face_x(yy) - 0.012, yy, -0.08 + 0.04 * k), (0.008, 0.014, 0.03),
                    bevel=0.002, seg=1)
    # centre vents (two, side by side) and the outer vents at the dash ends
    vent(P, (0.383, 0.871, -0.061), 0.112, 0.062)
    vent(P, (0.383, 0.871, 0.061), 0.112, 0.062)
    for zs in (-1, 1):
        vent(P, (0.387, 0.868, zs * 0.615), 0.105, 0.058)
    # trim strip across the passenger side and the centre (above the glovebox / below the vents)
    loops = []
    for z in lin(30, -0.128, DASH_END - 0.03):
        prof = dash_profile(z)
        # find the face X at Y 0.795 (trim height)
        best = min(prof, key=lambda p: abs(p[1] - 0.795) + (0 if p[0] < 0.5 else 1))
        fx = best[0]
        loops.append([B(fx - dx, 0.795 + dy, z) for (dx, dy) in rrect(0.012, 0.042, 0.004, 2)])
    add_loft(P.bm("trim_titan"), loops)
    # steering column shroud and the two stalks (indicator left, wiper right)
    ca, sa = math.cos(COL_ANG), math.sin(COL_ANG)
    axis = Vector((ca, -sa))
    nrm = Vector((sa, ca))                   # column-normal direction in X-Y (toward 12 o'clock)
    loops = []
    for k in lin(8, 0.075, 0.27):
        p = Vector(WHEEL_C) + axis * k
        sc = lerp(0.85, 1.12, (k - 0.075) / 0.195)
        loops.append([B(p.x + nrm.x * dy * sc, p.y + nrm.y * dy * sc, -SEAT_Z + dz * sc)
                      for (dz, dy) in rrect(0.094, 0.082, 0.03, 3)])
    add_loft(P.bm("plastic_black", 1), loops)
    p_st = Vector(WHEEL_C) + axis * 0.10
    for sgn in (-1, 1):
        add_cyl(P.bm("plastic_black"), (p_st.x, p_st.y + 0.008, -SEAT_Z + sgn * 0.04),
                (p_st.x - 0.03, p_st.y + 0.03, -SEAT_Z + sgn * 0.17), 0.0075, seg=10, r1=0.0055)
    # light switch (rotary, left of the column)
    add_cyl(P.bm("plastic_black"), (0.402, 0.735, -0.615), (0.385, 0.735, -0.615), 0.026, seg=24)
    add_cyl(P.bm("trim_titan"), (0.385, 0.735, -0.615), (0.379, 0.735, -0.615), 0.020, seg=24)
    return P

def build_cluster():
    """The instrument cluster in the recess: fuel, speedometer, rev counter, coolant temp (left to right)."""
    P = Piece("instrument_cluster")
    bm_t, uvl = P.uv("gauges")
    # face plane: through (0.505, 0.84) and (0.537, 0.908) in X-Y
    f0, f1 = Vector((0.505, 0.840)), Vector((0.530, 0.900))
    d = (f1 - f0).normalized()
    n2 = Vector((-d.y, d.x))                  # rearward-up normal
    if n2.x > 0:
        n2 = -n2
    def on_face(y, z, off):
        t = (y - f0.y) / d.y
        p = f0 + d * t + n2 * off
        return B(p.x, p.y, z)
    nB = B(n2.x, n2.y, 0) - B(0, 0, 0)
    upB = B(d.x, d.y, 0) - B(0, 0, 0)
    # black panel behind the dials
    loops = []
    for k, off in enumerate((-0.012, 0.003)):
        loop = []
        for (zz, yy) in rrect(0.395, 0.088, 0.035, 4):
            loop.append(on_face(0.872 + yy, CLU_Z + zz, off))
        loops.append(loop)
    add_loft(P.bm("plastic_black"), loops)
    dials = [("fuel", -0.168, 0.866, 0.030), ("speedo", -0.062, 0.874, 0.047), ("tacho", 0.062, 0.874, 0.047),
             ("temp", 0.168, 0.866, 0.030)]
    for key, dz, yy, r in dials:
        c = on_face(yy, CLU_Z + dz, 0.0045)
        add_disc_uv(bm_t, uvl, c, nB, upB, r, key, seg=40, thick=0.002)
        add_torus(P.bm("alu_machined"), c + nB * 0.0015, nB, r + 0.0022, 0.0022, seg=48, seg2=8)
        # needle (resting at zero) and hub
        a0 = {"fuel": -60, "speedo": -128, "tacho": -128, "temp": -60}[key] * D2R
        right = upB.cross(nB).normalized() * -1
        tip = c + nB * 0.003 + (upB * math.cos(a0) + right * math.sin(a0)) * r * 0.86
        base = c + nB * 0.003 - (upB * math.cos(a0) + right * math.sin(a0)) * r * 0.12
        mid = (tip + base) / 2
        L = (tip - base).length
        ydir = (tip - base).normalized()
        za = nB.normalized()
        xa = ydir.cross(za).normalized()
        Mn = Matrix.Identity(4)
        for i in range(3):
            Mn[i][0], Mn[i][1], Mn[i][2], Mn[i][3] = xa[i], ydir[i], za[i], mid[i]
        add_box_local(P.bm("needle_white"), Mn, (0, 0, 0), (0.0026, L, 0.0015))
        hub_c = c + nB * 0.003
        add_lathe(P.bm("plastic_black"), [(0, 0), (r * 0.16, 0), (r * 0.14, 0.006), (0, 0.006)],
                  frame(upB, nB, hub_c), seg=16)
    return P

# ==============================================================================================
# STEERING WHEEL (pre-facelift E46 4-spoke multifunction wheel); local frame: X = column axis toward the dash,
# Z = 12 o'clock, Y = 9 o'clock (driver's left)
# ==============================================================================================
def wheel_frame():
    ca, sa = math.cos(COL_ANG), math.sin(COL_ANG)
    return frame(B(ca, -sa, 0) - B(0, 0, 0), B(sa, ca, 0) - B(0, 0, 0), B(WHEEL_C[0], WHEEL_C[1], -SEAT_Z))

def build_steering_wheel():
    P = Piece("steering_wheel")
    M = wheel_frame()
    R = 0.1725
    add_torus(P.bm("leather_black"), M @ Vector((0, 0, 0)), M.to_3x3() @ Vector((1, 0, 0)), R, 0.0145, seg=72,
              seg2=14, r_ax=0.0165)

    def pad(u, v, w):
        s, t = 2 * u - 1, 2 * v - 1
        a, b = disc_map(s, t)
        hw = 0.088 * (1 - 0.14 * smoothstep(0.0, -1.0, t))
        y = a * hw
        z = 0.006 + b * 0.079
        r2 = min(1.0, a * a + b * b)
        xf = -0.036 - 0.009 * (1 - r2)
        x = lerp(0.028, xf, w)
        return (x, y, z)
    grid_solid(P.bm("interior_black", 2), edge_params(6, 0.06), edge_params(6, 0.06), [0, 0.5, 0.9, 1], pad, M=M)
    bm_t, uvl = P.uv("gauges")
    add_disc_uv(bm_t, uvl, M @ Vector((-0.0455, 0, 0.006)), M.to_3x3() @ Vector((-1, 0, 0)),
                M.to_3x3() @ Vector((0, 0, 1)), 0.0215, "roundel", seg=40, thick=0.002)
    # horizontal spokes with the multifunction buttons
    for sg in (-1, 1):
        def spoke(u, v, w, sg=sg):
            yy = sg * lerp(0.07, 0.168, u)
            hh = lerp(0.052, 0.030, u)
            zc = lerp(-0.012, -0.020, u)
            xf = lerp(-0.030, -0.010, u)
            return (lerp(xf + 0.017, xf, w), yy, zc + (v - 0.5) * hh)
        grid_solid(P.bm("interior_black", 1), edge_params(5, 0.05), edge_params(3, 0.1), [0, 1], spoke, M=M)
        for (yy, zz) in ((0.093, 0.006), (0.093, -0.024), (0.118, -0.010)):
            xf = lerp(-0.030, -0.010, (yy - 0.07) / 0.098)
            add_box_local(P.bm("plastic_black"), M, (xf - 0.002, sg * yy, zz), (0.008, 0.017, 0.013), bevel=0.002)
    # lower spokes (about 5 and 7 o'clock)
    for sg in (-1, 1):
        a = (180 - 34) * D2R
        rim = Vector((-0.004, sg * R * math.sin(a) * 0.93, R * math.cos(a) * 0.93))
        hub = Vector((-0.024, sg * 0.032, -0.062))
        path = [hub.lerp(rim, t) for t in lin(5, 0, 1)]
        prof = rrect(0.014, 0.026, 0.006, 2)
        P_w = [M @ p for p in path]
        fr = ptf_frames(P_w, M.to_3x3() @ Vector((-1, 0, 0)))
        loops = [[p + n * a_ + bn * b_ for (a_, b_) in prof] for p, (t_, n, bn) in zip(P_w, fr)]
        add_loft(P.bm("interior_black", 1), loops)
    # back cover / column hub
    add_lathe(P.bm("plastic_black"), [(0, 0.02), (0.050, 0.02), (0.046, 0.06), (0.036, 0.085), (0, 0.085)],
              M @ Matrix(((0, 0, 1, 0), (0, 1, 0, 0), (-1, 0, 0, 0), (0, 0, 0, 1))), seg=28)
    return P, M

# ==============================================================================================
# CENTRE CONSOLE, STEPTRONIC SELECTOR, HANDBRAKE
# ==============================================================================================
CON_TOP = 0.592            # console top at the selector surround
GATE_C = (0.322, -0.012)   # gate insert centre (X, Z); P-R-N-D lane at Z = 0, M/S lane to its left (-Z)

def build_console():
    P = Piece("centre_console")

    def body(u, v, w):
        s = 2 * u - 1
        X = lerp(0.47, -0.50, v)
        hw = interp([(-0.50, 0.092), (-0.19, 0.096), (0.10, 0.098), (0.17, 0.118), (0.47, 0.124)], X)
        ytop = interp([(-0.50, 0.626), (-0.21, 0.626), (-0.17, 0.585), (0.13, 0.585), (0.17, CON_TOP),
                       (0.47, CON_TOP)], X)
        ybot = interp([(-0.50, 0.47), (0.10, 0.47), (0.30, 0.50), (0.47, 0.53)], X)
        return (X, lerp(ybot, ytop, w), s * hw)
    grid_solid(P.bm("interior_black", 1), [0, 0.04, 0.2, 0.5, 0.8, 0.96, 1], [0, 0.015] + lin(26, 0.03, 0.97) +
               [0.985, 1], [0, 0.5, 0.88, 1], body)

    # selector surround plate (satin trim) with the gate insert and the window switches
    def plate(u, v, w):
        s = 2 * u - 1
        return (lerp(0.445, 0.168, v), lerp(CON_TOP - 0.003, CON_TOP + 0.006, w), s * 0.111)
    grid_solid(P.bm("trim_titan", 1), edge_params(4, 0.05), edge_params(4, 0.05), [0, 1], plate)
    add_box(P.bm("plastic_black"), (GATE_C[0], CON_TOP + 0.0065, GATE_C[1]), (0.145, 0.006, 0.078), bevel=0.0025)
    bm_t, uvl = P.uv("gauges")
    add_quad_uv(bm_t, uvl, B(GATE_C[0] + 0.004, CON_TOP + 0.0102, -0.066), B(0, 1, 0) - B(0, 0, 0),
                B(1, 0, 0) - B(0, 0, 0), 0.030, 0.048, "prnd", thick=0.002)
    for (x, z) in ((0.405, -0.094), (0.370, -0.094), (0.405, 0.080), (0.370, 0.080)):
        add_box(P.bm("plastic_black"), (x, CON_TOP + 0.010, z), (0.026, 0.012, 0.018), bevel=0.003)
    # hazard warning + central locking buttons behind the selector, then the handbrake slot
    add_box(P.bm("plastic_black"), (0.196, CON_TOP + 0.009, -0.028), (0.026, 0.010, 0.036), bevel=0.003)
    add_box(P.bm("plastic_black"), (0.196, CON_TOP + 0.009, 0.020), (0.026, 0.010, 0.024), bevel=0.003)
    add_box(P.bm("plastic_black"), (-0.035, 0.585, 0.0), (0.25, 0.006, 0.046), bevel=0.002)
    # handbrake gaiter (static) around the lever root
    loops = []
    for j, h in enumerate(lin(6, 0, 1)):
        w_ = lerp(0.044, 0.036, h)
        L_ = lerp(0.11, 0.05, h)
        cx = lerp(0.055, 0.025, h)
        cy = lerp(0.584, 0.598, h)
        fold = 0.003 * math.sin(h * math.pi * 3)
        loops.append([B(cx + dx, cy, dz) for (dx, dz) in rrect(L_ + fold, w_ + fold, 0.012, 3)])
    loops.append([B(0.025 + dx * 0.5, 0.600, dz * 0.6) for (dx, dz) in rrect(0.05, 0.036, 0.012, 3)])
    add_loft(P.bm("leather_black", 1), loops)
    # armrest lid (grey leather) over the storage box between the seats
    def lid(u, v, w):
        s = 2 * u - 1
        top = 0.664 + 0.006 * (1 - s * s)
        return (lerp(-0.205, -0.495, v), lerp(0.622, top, w), s * 0.093)
    grid_solid(P.bm("leather_grey", 2), edge_params(5, 0.06), edge_params(5, 0.05), [0, 0.5, 0.88, 1], lid)
    return P

def build_selector():
    """Steptronic lever: stalk, leather gaiter and knob. Built upright = P; node origin at the pivot."""
    P = Piece("selector")
    px, py = SEL_PIVOT
    add_cyl(P.bm("steel_dark"), (px, py, 0), (px, CON_TOP + 0.09, 0), 0.0065, seg=12)
    loops = []
    for j, h in enumerate(lin(9, 0, 1)):
        Lx = lerp(0.082, 0.034, h ** 0.75)
        Lz = lerp(0.058, 0.032, h ** 0.75)
        fold = 0.0035 * math.sin(h * math.pi * 3.5) * (1 - h)
        y = CON_TOP + 0.009 + h * 0.068
        loops.append([B(px + dx, y, dz) for (dx, dz) in rrect(Lx + fold, Lz + fold, min(Lx, Lz) * 0.45, 3)])
    loops.append([B(px + dx * 0.6, CON_TOP + 0.079, dz * 0.6) for (dx, dz) in rrect(0.034, 0.032, 0.015, 3)])
    add_loft(P.bm("leather_black", 1), loops)
    y0 = CON_TOP + 0.066
    prof = [(0, 0), (0.0168, 0), (0.0172, 0.012), (0.0186, 0.032), (0.0207, 0.058), (0.0224, 0.082),
            (0.0226, 0.096), (0.0212, 0.107), (0.0168, 0.1145), (0.0085, 0.1185), (0, 0.1195)]
    add_lathe(P.bm("leather_black"), prof, Matrix.Translation(B(px, y0, 0)), seg=32)
    return P

HB_ANG = 14 * D2R

def build_handbrake():
    P = Piece("handbrake")
    px, py = HB_PIVOT
    d = Vector((-math.cos(HB_ANG), math.sin(HB_ANG)))
    up = Vector((math.sin(HB_ANG), math.cos(HB_ANG)))
    def section(s_, w, h, r):
        c = Vector((px, py)) + d * s_
        return [B(c.x + up.x * b, c.y + up.y * b, a) for (a, b) in rrect(w, h, r, 3)]
    add_loft(P.bm("interior_black"), [section(s_, 0.030, 0.028, 0.010) for s_ in (-0.02, 0.15)])
    grip = []
    for s_ in lin(8, 0.13, 0.285):
        t = (s_ - 0.13) / 0.155
        k = 1 + 0.18 * math.sin(math.pi * clamp(t * 1.1, 0, 1))
        grip.append(section(s_, 0.034 * k, 0.034 * k, 0.014 * k))
    add_loft(P.bm("leather_black", 1), grip)
    c = Vector((px, py)) + d * 0.285
    c2 = Vector((px, py)) + d * 0.297
    add_cyl(P.bm("plastic_black"), (c.x, c.y, 0), (c2.x, c2.y, 0), 0.011, seg=20)
    return P

# ==============================================================================================
# DOOR CARDS (front doors) and REAR SIDE TRIMS (coupe quarter panels)
# ==============================================================================================
def door_zi(Y):
    """inner surface |Z| of the front door card by height (elbow room 1447 -> 0.7235, shoulder 1384 -> 0.692)"""
    return interp([(0.255, 0.748), (0.30, 0.735), (0.42, 0.728), (0.55, 0.734), (0.62, 0.732), (0.70, 0.725),
                   (0.78, 0.718), (0.83, 0.705), (0.86, 0.694), (0.885, 0.700)], Y)

def door_x(u, Y):
    xf = 0.715 - 0.11 * smoothstep(0.55, 0.88, Y)
    xr = -0.300 - 0.19 * (Y - 0.255) / 0.63
    return lerp(xf, xr, u)

def build_door(P, sg):
    def card(u, v, w):
        Y = lerp(0.255, 0.885, v)
        zi = door_zi(Y) + 0.012 * (1 - smoothstep(0.0, 0.05, u)) + 0.012 * smoothstep(0.95, 1.0, u)
        return (door_x(u, Y), Y, sg * lerp(zi + 0.03, zi, w))
    grid_solid(P.bm("interior_black", 1), [0, 0.02] + lin(10, 0.05, 0.95) + [0.98, 1],
               [0, 0.03, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.78, 0.84, 0.88, 0.92, 0.96, 1], [0, 1], card)

    def insert(u, v, w):
        Y = lerp(0.665, 0.805, v)
        uu = lerp(0.16, 0.86, u)
        zi = door_zi(Y)
        return (door_x(uu, Y), Y, sg * lerp(zi + 0.008, zi - 0.005, w))
    grid_solid(P.bm("leather_grey", 1), edge_params(8, 0.04), edge_params(3, 0.1), [0, 1], insert)
    # armrest (grey) with the satin grab handle sweeping up to the opener
    zc = 0.731
    path = [(-0.26, 0.615), (-0.05, 0.617), (0.15, 0.622), (0.26, 0.634)]
    prof = [(-0.022, -0.012), (0.018, -0.012), (0.026, 0.010), (0.026, 0.050), (0.020, 0.064), (0.005, 0.069),
            (-0.015, 0.064), (-0.024, 0.040)]
    prof_s = [(a, -sg * b) for (a, b) in prof]
    add_sweep(P.bm("leather_grey", 1), [(x, y, sg * zc) for x, y in catmull2(path, 4, closed=False)], prof_s)
    path2 = [(0.20, 0.628), (0.30, 0.648), (0.38, 0.695), (0.435, 0.752), (0.462, 0.792)]
    pts2 = catmull2(path2, 4, closed=False)
    prof2 = [(a * 0.55, -sg * (b * 0.75)) for (a, b) in prof]
    add_sweep(P.bm("trim_titan", 1), [(x, y, sg * (door_zi(y) + 0.002)) for x, y in pts2], prof2)
    # opener: dark bezel + chrome lever, top front of the card
    zo = door_zi(0.818) - 0.003
    add_box(P.bm("plastic_black"), (0.375, 0.818, sg * zo), (0.13, 0.036, 0.016), bevel=0.006)
    add_box(P.bm("alu_machined"), (0.372, 0.818, sg * (zo - 0.008)), (0.10, 0.012, 0.010), bevel=0.004)
    # speaker grille (front, low) and the door pocket lip
    zs = door_zi(0.38) - 0.002
    add_cyl(P.bm("plastic_black"), (0.50, 0.38, sg * (zs + 0.004)), (0.50, 0.38, sg * (zs - 0.004)), 0.072, seg=36)
    add_box(P.bm("interior_black"), (0.08, 0.345, sg * 0.722), (0.58, 0.085, 0.028), bevel=0.008)
    # lock pin at the rear of the sill
    add_cyl(P.bm("alu_machined"), (-0.39, 0.86, sg * 0.715), (-0.39, 0.905, sg * 0.715), 0.0045, seg=10)

def rear_zi(Y, u):
    return interp([(0.40, 0.700), (0.55, 0.695), (0.62, 0.690), (0.70, 0.685), (0.80, 0.676), (0.88, 0.672),
                   (0.92, 0.680), (0.955, 0.700)], Y) - 0.012 * smoothstep(0.5, 1.0, u)

def build_rear_trim(P, sg):
    def ybot(u):
        return lerp(0.40, 0.725, smoothstep(0.40, 0.55, u))

    def yt(u):
        return lerp(0.940, 0.955, u)

    def xx(u, Y):
        xf = -0.328 - 0.19 * (Y - 0.255) / 0.63
        xr = lerp(-1.38, -1.43, smoothstep(0.72, 0.95, Y))
        return lerp(xf, xr, u)

    def trim(u, v, w):
        Y = lerp(ybot(u), yt(u), v)
        zi = rear_zi(Y, u) + 0.010 * (1 - smoothstep(0.0, 0.05, u))
        return (xx(u, Y), Y, sg * lerp(zi + 0.03, zi, w))
    grid_solid(P.bm("interior_black", 1), [0, 0.02] + lin(12, 0.05, 0.95) + [0.98, 1],
               [0, 0.03] + lin(9, 0.08, 0.92) + [0.97, 1], [0, 1], trim)

    def insert(u, v, w):
        Y = lerp(0.70, 0.86, v)
        uu = lerp(0.10, 0.62, u)
        zi = rear_zi(Y, uu)
        return (xx(uu, Y), Y, sg * lerp(zi + 0.008, zi - 0.005, w))
    grid_solid(P.bm("leather_grey", 1), edge_params(6, 0.05), edge_params(3, 0.1), [0, 1], insert)
    # rear armrest bulge
    prof = [(-0.020, -0.012), (0.016, -0.012), (0.024, 0.010), (0.024, 0.040), (0.016, 0.052), (-0.012, 0.052),
            (-0.022, 0.035)]
    path = [(-0.47, 0.618), (-0.62, 0.624), (-0.78, 0.626), (-0.90, 0.634)]
    add_sweep(P.bm("interior_black", 1), [(x, y, sg * 0.692) for x, y in catmull2(path, 3, closed=False)],
              [(a, -sg * b) for (a, b) in prof])

# ==============================================================================================
# PARCEL SHELF
# ==============================================================================================
def build_parcel_shelf():
    P = Piece("parcel_shelf")

    def shelf(u, v, w):
        s = 2 * u - 1
        hw = lerp(0.665, 0.63, v)
        z = s * hw
        xr = -1.84 + 0.11 * (abs(s) ** 2.2)
        X = lerp(-1.385, xr, v)
        ytop = lerp(0.962, 0.982, v)
        return (X, lerp(ytop - 0.014, ytop, w), z)
    grid_solid(P.bm("interior_black", 1), edge_params(10, 0.03), edge_params(5, 0.04), [0, 1], shelf)
    return P

# ==============================================================================================
# assembly / export
# ==============================================================================================
def build_all():
    reset_scene()
    nodes = {}
    I4 = Matrix.Identity(4)
    seats = empty_node("seats", I4, extras={"description": "front seats, rear 2+1 bench (grey leather)"})
    for name, sg in (("seat_driver", -1), ("seat_passenger", 1)):
        P = Piece(name)
        front_seat(P, sg * SEAT_Z, sg)
        nodes[name] = make_node(name, P, Tcar(SEAT_O[0], SEAT_O[1], sg * SEAT_Z), parent=seats, extras={
            "description": "front sports seat on its rails; the coupe seat glides 90 mm forward for rear access",
            "easy_entry_slide_m": 0.09})
    P = Piece("rear_bench")
    rear_bench(P)
    nodes["rear_bench"] = make_node("rear_bench", P, Tcar(REAR_O[0], REAR_O[1], 0), parent=seats, extras={
        "description": "rear bench: two contoured outboard seats with head restraints, narrow centre seat"})
    nodes["seats"] = seats

    dash = make_node("dashboard", build_dashboard(), Tcar(0.60, 0.75, 0.0), angle=50)
    nodes["dashboard"] = dash
    cl_c = B(0.515, 0.872, CLU_Z)
    nodes["instrument_cluster"] = make_node("instrument_cluster", build_cluster(), Matrix.Translation(cl_c),
                                            parent=dash, extras={"description": "fuel, speedometer, rev counter, "
                                                                 "coolant temperature (coupe: grey dial faces)"})
    P, M = build_steering_wheel()
    nodes["steering_wheel"] = make_node("steering_wheel", P, M, extras={
        "description": "4-spoke multifunction wheel; spins about its local X axis (the steering column)",
        "spin_axis_local": [1, 0, 0]})
    nodes["centre_console"] = make_node("centre_console", build_console(), Tcar(0.0, 0.55, 0.0), extras={
        "description": "centre console: selector surround with P-R-N-D plate, window switches, hazard button, "
                       "handbrake gaiter, armrest"})
    nodes["selector"] = make_node("selector", build_selector(), Tcar(SEL_PIVOT[0], SEL_PIVOT[1], 0.0), extras={
        "description": "Steptronic selector lever (ZF 5HP19 / A5S 325Z). Origin = lever pivot. Rest pose = P.",
        "positions_deg_about_local_z_gltf": {"P": 0, "R": 6, "N": 12, "D": 18},
        "ms_gate_deg_about_local_x_gltf": -12,
        "tip_deg_about_local_z_gltf": {"+ (upshift, forward, up to MY2001)": -5, "- (downshift, back)": 5},
        "note": "+Z rotation (glTF) tips the knob rearward; -X rotation tips it left into the M/S gate"})
    nodes["handbrake"] = make_node("handbrake", build_handbrake(), Tcar(HB_PIVOT[0], HB_PIVOT[1], 0.0), extras={
        "description": "handbrake lever; pull = rotate about local Z (glTF) by about -20 deg (tip rises)"})
    dc = empty_node("door_cards", I4, extras={"description": "front door cards and rear side trims"})
    for name, sg, fn in (("door_card_left", -1, build_door), ("door_card_right", 1, build_door),
                         ("rear_trim_left", -1, build_rear_trim), ("rear_trim_right", 1, build_rear_trim)):
        P = Piece(name)
        fn(P, sg)
        org = Tcar(0.2, 0.6, sg * 0.72) if name.startswith("door") else Tcar(-0.9, 0.75, sg * 0.69)
        nodes[name] = make_node(name, P, org, parent=dc)
    nodes["door_cards"] = dc
    nodes["parcel_shelf"] = make_node("parcel_shelf", build_parcel_shelf(), Tcar(-1.6, 0.97, 0.0))
    return nodes

def export():
    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
    for ob in list(bpy.data.objects):
        if ob.type in ("CAMERA", "LIGHT"):
            bpy.data.objects.remove(ob, do_unlink=True)
    bpy.ops.export_scene.gltf(filepath=OUT_GLB, export_format="GLB", export_apply=True, export_yup=True,
                              export_extras=True, export_cameras=False, export_lights=False,
                              export_materials="EXPORT", export_normals=True, export_texcoords=True)
    print("exported", OUT_GLB, os.path.getsize(OUT_GLB) // 1024, "KB")

def report():
    rows = {}
    tot = 0
    for ob in bpy.data.objects:
        n = tri_count(ob)
        if n:
            rows[ob.name] = n
            tot += n
    for k in sorted(rows, key=lambda k: -rows[k]):
        print(f"  {k:22s} {rows[k]:7d}")
    print("  TOTAL triangles", tot)
    return rows, tot

# ----------------------------------------------------------------------------------------------
# fit check: every vertex must lie inside the body shell (implicit field of build/carfield.py) with a margin
# ----------------------------------------------------------------------------------------------
def check_fit(margin_mm=15.0):
    import numpy as np
    sys.path.insert(0, os.path.join(ROOT, "build"))
    from carfield import Car, HSCALE, SC
    car = Car()
    res = {}
    dg = bpy.context.evaluated_depsgraph_get()
    for ob in bpy.data.objects:
        if ob.type != "MESH":
            continue
        M = ob.matrix_world
        V = np.array([tuple(M @ v.co) for v in ob.data.vertices])
        X, Zc, Y = V[:, 0], -V[:, 1], V[:, 2]
        f = car.field(SC - X * 1000, Zc * 1000, Y * 1000 / HSCALE)
        i = int(np.argmax(f))
        res[ob.name] = {"min_clearance_mm": round(float(-f.max()), 1), "worst_at_car_xyz":
                        [round(float(X[i]), 3), round(float(Y[i]), 3), round(float(Zc[i]), 3)],
                        "n_below_margin": int((f > -margin_mm).sum())}
    for k, v in res.items():
        flag = "OK " if v["min_clearance_mm"] >= margin_mm else "LOW"
        print(f"  fit {flag} {k:22s} clearance {v['min_clearance_mm']:7.1f} mm at {v['worst_at_car_xyz']}"
              f"  ({v['n_below_margin']} verts < {margin_mm} mm)")
    return res

# ----------------------------------------------------------------------------------------------
# preview renders (Cycles CPU, white studio)
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
    sc.cycles.transparent_max_bounces = 16
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.film_transparent = False
    sc.view_settings.view_transform = "AgX"
    w = bpy.data.worlds.new("studio")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.92, 0.92, 0.93, 1)
    bg.inputs["Strength"].default_value = 0.6
    sc.world = w

    def area(name, loc, size, energy):
        l = bpy.data.lights.new(name, "AREA")
        l.size = size
        l.energy = energy
        o = bpy.data.objects.new(name, l)
        o.location = loc
        d = Vector((0, 0, 0.7)) - Vector(loc)
        o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
        sc.collection.objects.link(o)
    area("key", (3.0, 3.0, 4.0), 3.0, 600)
    area("fill", (-3.0, -3.5, 3.0), 4.0, 300)
    area("top", (0.0, 0.0, 5.0), 4.0, 400)

def look(loc, target, lens=50, ortho=None):
    sc = bpy.context.scene
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    cd.clip_start = 0.01
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    co = bpy.data.objects.new("cam", cd)
    sc.collection.objects.link(co)
    co.location = loc
    co.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    sc.camera = co
    return co

def render(name, loc, target, lens=50, ortho=None, res=None, samples=None):
    sc = bpy.context.scene
    if res:
        sc.render.resolution_x, sc.render.resolution_y = res
    if samples:
        sc.cycles.samples = samples
    cam = look(loc, target, lens, ortho)
    path = os.path.join(PREV_DIR, f"interior_{name}.png")
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam, do_unlink=True)
    print("rendered", path, flush=True)
    return path

def import_glb(name, mat=None, alpha=None):
    p = os.path.join(ROOT, "film", "public", "models", name + ".glb")
    if not os.path.exists(p):
        return []
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=p)
    new = [o for o in set(bpy.data.objects) - before]
    if mat is not None:
        for ob in new:
            if ob.type == "MESH":
                ob.data.materials.clear()
                ob.data.materials.append(mat)
    return new

def ghost_mat(col=(0.55, 0.65, 0.85, 1), alpha=0.12):
    m = bpy.data.materials.new("ghost")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = col
    b.inputs["Alpha"].default_value = alpha
    b.inputs["Roughness"].default_value = 0.3
    return m

def car_paint():
    m = bpy.data.materials.new("paint")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.01, 0.01, 0.012, 1)
    b.inputs["Roughness"].default_value = 0.18
    try:
        b.inputs["Coat Weight"].default_value = 1.0
    except Exception:
        pass
    return m

def glass_mat():
    m = bpy.data.materials.new("glass_prev")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.6, 0.65, 0.7, 1)
    b.inputs["Alpha"].default_value = 0.22
    b.inputs["Roughness"].default_value = 0.05
    return m

def side_overlay(render_path, ortho, res, cx, cy):
    """Blend BMW's side drawing (scaled to the render) over an orthographic left-side render."""
    from PIL import Image
    import numpy as np
    src = os.path.join(ROOT, "assets", "ref", "body",
                       "MODELREF-ONLY_bmw-st034_e46-2-coupe_dimensions_side-front-rear-top.png")
    dr = Image.open(src).convert("L")
    ren = Image.open(render_path).convert("RGB")
    W, H = res
    mpp = ortho / W                        # metres per render pixel
    # drawing px -> car: X = 1.3625 - (px - 504) * 3.5574e-3 ; Y = (779 - py) * 3.5574e-3 * 1369/1401
    k = 3.5574e-3
    ky = k * 1369 / 1401
    # render px (i, j) -> car X = cx - (i - W/2) * mpp (front at the left), Y = cy + (H/2 - j) * mpp
    # drawing px from render px: px = 504 + (1.3625 - X)/k ; py = 779 - Y/ky
    a = mpp / k
    b0 = 504 + (1.3625 - cx) / k - (W / 2) * a
    d = mpp / ky
    e0 = 779 - cy / ky - (H / 2) * d
    warped = dr.transform((W, H), Image.AFFINE, (a, 0, b0, 0, d, e0), resample=Image.BILINEAR, fillcolor=255)
    wa = np.asarray(warped).astype(np.float32) / 255.0
    ra = np.asarray(ren).astype(np.float32)
    out = ra.copy()
    line = wa < 0.55
    out[line] = out[line] * 0.15 + np.array([230, 30, 30]) * 0.85
    Image.fromarray(out.astype(np.uint8)).save(render_path.replace(".png", "_drawing.png"))

def previews():
    os.makedirs(PREV_DIR, exist_ok=True)
    setup_studio()
    # 1) interior alone, 3/4 from the front-left, and from the rear-right
    render("front34", B(1.9, 1.9, -2.1), B(-0.35, 0.62, 0.0), lens=38)
    render("rear34_right", B(-2.6, 1.9, 1.9), B(-0.2, 0.62, 0.0), lens=38)
    # 2) cockpit (driver's view from the rear seat), selector close-up, rear bench
    hid = [o for o in bpy.data.objects if o.name in ("seat_driver", "seat_passenger", "seats")]
    for o in hid:
        o.hide_render = True
    render("cockpit", B(-0.55, 1.12, -0.30), B(0.45, 0.80, -0.12), lens=24)
    render("selector", B(0.02, 0.86, 0.16), B(0.31, 0.63, -0.01), lens=40)
    for o in hid:
        o.hide_render = False
    render("rear_bench", B(0.35, 1.05, 0.0), B(-1.05, 0.62, 0.0), lens=28)
    # 3) inside the ghosted body: side (with BMW's drawing overlaid), top
    ghost = ghost_mat()
    body = import_glb("body", ghost)
    res = (1200, 600)
    p = render("in_body_side", B(-0.1, 0.70, -6.0), B(-0.1, 0.70, 0.0), ortho=4.8, res=res, samples=12)
    side_overlay(p, 4.8, res, -0.1, 0.70)
    render("in_body_top", B(-0.1, 6.0, 0.0), B(-0.1, 0.0, 0.0), ortho=4.8, res=res, samples=12)
    render("in_body_front34", B(3.2, 2.4, -3.0), B(-0.2, 0.7, 0.0), lens=40, res=(960, 540), samples=16)
    # 4) the real look: black body + glass, through the windscreen (cf. build/photo_front.png)
    paint = car_paint()
    for ob in body:
        if ob.type == "MESH":
            ob.data.materials.clear()
            ob.data.materials.append(paint)
    import_glb("glass", glass_mat())
    import_glb("details")
    import_glb("wheels")
    # cut the opaque body away inside the glass outline is not possible here; render the glass region only by
    # hiding the body skin above the belt line with a boolean-free trick: a clipping box is too costly, so the
    # body is shown at 35% alpha in this view
    for ob in body:
        if ob.type == "MESH":
            ob.data.materials.clear()
            ob.data.materials.append(ghost_mat((0.02, 0.02, 0.025, 1), 0.35))
    render("through_glass", B(5.2, 1.6, -2.4), B(0.0, 0.85, -0.1), lens=50, res=(960, 540), samples=24)

if __name__ == "__main__":
    make_atlas()
    nodes = build_all()
    rows, tot = report()
    fit = {} if "--no-check" in ARGS else check_fit()
    with open(os.path.join(HERE, "interior_stats.json"), "w") as f:
        json.dump({"triangles": rows, "total": tot, "fit": fit}, f, indent=1)
    export()
    if "--no-render" not in ARGS:
        previews()
