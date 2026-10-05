"""3D details on the E46 body, each placed on the body surface (carfield) from the measured 2D positions:
headlight internals (chrome housings, reflector bowls, projector lenses, angel-eye rings), fog-light reflectors,
door mirrors with their black sails, kidney chrome surrounds, the Dutch plates 25-KDB-4 (front with the dealer's
'GEAR UP automotive' holder), BMW roundels on bonnet and boot, wipers, twin exhaust tips (left), the green
environmental sticker behind the windscreen. Output: film/public/models/details.glb (named nodes, PBR materials)."""
import sys, math
sys.path.insert(0, 'build')
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial
from trimesh.visual import TextureVisuals
from PIL import Image, ImageDraw, ImageFont
from carfield import Car, HSCALE, SC
import details2d as D
from outline import catmull

car = Car()
LS = D.LS

# ------------------------------------------------------------------------------------------------ surface queries
def fld(s, y, h):
    s, y, h = np.broadcast_arrays(np.atleast_1d(np.asarray(s, float)), np.atleast_1d(np.asarray(y, float)),
                                  np.atleast_1d(np.asarray(h, float)))
    return car.field(s, y, h)

def first_inside(f, xs):
    i = int(np.argmax(f < 0))
    if f[i] >= 0: return None
    a, b = xs[i - 1], xs[i]; fa, fb = f[i - 1], f[i]
    return a + (b - a) * fa / (fa - fb)

def front_s(y, h):
    xs = np.arange(-150, 1400, 0.5); return first_inside(fld(xs, y, h), xs)

def rear_s(y, h):
    xs = np.arange(4650, 3000, -0.5); return first_inside(fld(xs, y, h), xs)

def side_y(s, h, sign=1):
    ys = np.arange(1000, 0, -0.5); v = first_inside(fld(s, ys, h), ys)
    return None if v is None else sign * v

def top_h(s, y):
    hs = np.arange(1500, 100, -0.5); return first_inside(fld(s, y, hs), hs)

def normal(s, y, h, e=2.0):
    g = np.array([(fld(s + e, y, h) - fld(s - e, y, h))[0], (fld(s, y + e, h) - fld(s, y - e, h))[0],
                  (fld(s, y, h + e) - fld(s, y, h - e))[0]])
    n = np.array([-g[0], g[2] / HSCALE, g[1]]); return n / np.linalg.norm(n)   # export frame

def P(s, y, h):
    """drawing (s, y real, h drawing) -> export metres"""
    return np.array([(SC - s) / 1000.0, h * HSCALE / 1000.0, y / 1000.0])


def tube(path, radius, sections=14, closed=True):
    """a smooth tube along a polyline (parallel-transport frames)"""
    P = np.asarray(path, float)
    if closed and np.linalg.norm(P[0] - P[-1]) > 1e-6: P = np.vstack([P, P[:1]])
    T = np.gradient(P, axis=0); T /= np.linalg.norm(T, axis=1, keepdims=True) + 1e-12
    n0 = np.cross(T[0], [0, 0, 1.0]);
    if np.linalg.norm(n0) < 1e-3: n0 = np.cross(T[0], [0, 1.0, 0])
    n0 /= np.linalg.norm(n0); N = [n0]
    for i in range(1, len(P)):
        v = N[-1] - np.dot(N[-1], T[i]) * T[i]; v /= np.linalg.norm(v) + 1e-12; N.append(v)
    N = np.array(N); B = np.cross(T, N)
    a = np.linspace(0, 2 * np.pi, sections, endpoint=False)
    ring = np.cos(a)[None, :, None] * N[:, None, :] + np.sin(a)[None, :, None] * B[:, None, :]
    V = (P[:, None, :] + radius * ring).reshape(-1, 3)
    F = []
    for i in range(len(P) - 1):
        for j in range(sections):
            a0 = i * sections + j; a1 = i * sections + (j + 1) % sections; b0 = a0 + sections; b1 = a1 + sections
            F += [[a0, b0, a1], [a1, b0, b1]]
    m = trimesh.Trimesh(V, F, process=True); m.fix_normals(); return m

# ------------------------------------------------------------------------------------------------ materials
def mat(name, color, metal=0.0, rough=0.5, emissive=None, alpha=None, tex=None):
    c = list(color) + ([alpha] if alpha is not None else [1.0])
    kw = dict(name=name, baseColorFactor=c, metallicFactor=metal, roughnessFactor=rough)
    if emissive is not None: kw['emissiveFactor'] = emissive
    if alpha is not None: kw['alphaMode'] = 'BLEND'
    if tex is not None: kw['baseColorTexture'] = tex
    return PBRMaterial(**kw)

M = {
    'chrome': mat('chrome', (0.92, 0.93, 0.95), 1.0, 0.06),
    'chrome_soft': mat('chrome_soft', (0.78, 0.8, 0.84), 1.0, 0.22),
    'black': mat('black_plastic', (0.012, 0.012, 0.014), 0.0, 0.5),
    'black_gloss': mat('black_gloss', (0.01, 0.01, 0.012), 0.0, 0.12),
    'paint': mat('paint', (0.027, 0.035, 0.05), 0.55, 0.36),
    'mirror': mat('mirror_glass', (0.55, 0.6, 0.66), 1.0, 0.03),
    'lens': mat('lens_glass', (0.85, 0.9, 0.95), 0.0, 0.02, alpha=0.35),
    'ring': mat('angel_ring', (0.8, 0.84, 0.9), 0.3, 0.3, emissive=(0.28, 0.3, 0.34)),
    'housing': mat('lamp_housing', (0.22, 0.23, 0.25), 0.9, 0.28),
    'bowl': mat('reflector', (0.48, 0.5, 0.53), 1.0, 0.12),
    'proj': mat('projector_lens', (0.05, 0.06, 0.07), 0.0, 0.03),
    'rubber': mat('rubber', (0.02, 0.02, 0.02), 0.0, 0.8),
    'tip_in': mat('soot', (0.03, 0.03, 0.03), 0.2, 0.9),
}

def colored(m, material):
    m.visual = TextureVisuals(material=material); return m

scene = trimesh.Scene()

def add(name, mesh):
    scene.add_geometry(mesh, node_name=name, geom_name=name)

def frame_from_normal(n):
    n = n / np.linalg.norm(n)
    up = np.array([0, 1.0, 0]) if abs(n[1]) < 0.9 else np.array([1.0, 0, 0])
    a = np.cross(up, n); a /= np.linalg.norm(a); b = np.cross(n, a)
    T = np.eye(4); T[:3, 0], T[:3, 1], T[:3, 2] = a, b, n
    return T

def place(mesh, origin, n):
    """mesh built around +Z (facing out); rotate so +Z is the normal n and move to origin"""
    T = frame_from_normal(n); T[:3, 3] = origin; mesh.apply_transform(T); return mesh

# ------------------------------------------------------------------------------------------------ headlights
parts = []
for sgn in (1, -1):
    bowls = []
    for (ly, lh), r in D.LAMPS:
        y = sgn * ly * LS; s0 = front_s(y, lh)
        o = P(s0, y, lh); n = normal(s0, y, lh)
        fwd = np.array([1.0, 0, 0]) * 0.7 + n * 0.3; fwd /= np.linalg.norm(fwd)
        R = r / 1000.0
        # reflector bowl: a paraboloid dish opening forward
        th = np.linspace(0, 2 * np.pi, 48); rr = np.linspace(0.0, 1.0, 12)
        TT, RR = np.meshgrid(th, rr)
        x = RR * R * np.cos(TT); yy = RR * R * np.sin(TT); z = (RR ** 2) * 0.030
        verts = np.stack([x.ravel(), yy.ravel(), z.ravel()], 1)
        faces = []
        nt = len(th)
        for i in range(len(rr) - 1):
            for j in range(nt - 1):
                a, b = i * nt + j, i * nt + j + 1; c, d = a + nt, b + nt
                faces += [[a, c, b], [b, c, d]]
        bowl = trimesh.Trimesh(verts, faces, process=True)
        bowl.apply_translation([0, 0, -0.072])
        place(bowl, o, fwd); parts.append(('headlight_bowls', colored(bowl, M['bowl'])))
        lensm = trimesh.creation.icosphere(subdivisions=3, radius=0.034)
        lensm.apply_scale([1, 1, 0.55]); lensm.apply_translation([0, 0, -0.046])
        place(lensm, o, fwd); parts.append(('headlight_lenses', colored(lensm, M['proj'])))
        core = trimesh.creation.icosphere(subdivisions=2, radius=0.012); core.apply_translation([0, 0, -0.058])
        place(core, o, fwd); parts.append(('headlight_lenses', colored(core, M['chrome'])))
        ring = trimesh.creation.torus(major_radius=R * 1.0, minor_radius=0.0026, major_sections=64, minor_sections=10)
        ring.apply_translation([0, 0, -0.040])
        place(ring, o, fwd); parts.append(('angel_eyes', colored(ring, M['ring'])))
    # fog light reflector
    (fy, fh), fr = D.FOG
    y = sgn * fy * LS; s0 = front_s(y, fh); o = P(s0, y, fh); n = normal(s0, y, fh)
    dish = trimesh.creation.cylinder(radius=fr / 1000 * 0.95, height=0.012, sections=40)
    dish.apply_translation([0, 0, -0.022]); place(dish, o, n); parts.append(('fog_lights', colored(dish, M['housing'])))
    bulb = trimesh.creation.icosphere(subdivisions=2, radius=0.014); bulb.apply_translation([0, 0, -0.012])
    place(bulb, o, n); parts.append(('fog_lights', colored(bulb, M['proj'])))

# headlight housing backs: the headlight region of the body, 60 mm in
d = np.load('build/body_raw.npz'); BV, BN, BF = d['V'], d['N'], d['F']
bs = SC - BV[:, 0] * 1000; bh = BV[:, 1] * 1000; by = BV[:, 2] * 1000
front_map = np.array(Image.open('film/public/tex/front.png')).astype(float) / 255
side2_map = np.array(Image.open('film/public/tex/side2.png')).astype(float) / 255
def samp(img, u, v):
    H, W = img.shape[:2]; return img[np.clip(((1 - v) * H).astype(int), 0, H - 1), np.clip((u * W).astype(int), 0, W - 1)]
hm = np.maximum(samp(front_map, (by + 920) / 1840, (bh - 100) / 1000)[:, 0] * (BN[:, 0] > 0.1) * (bs < 500),
                samp(side2_map, (bs + 60) / 4620, (bh - 100) / 1300)[:, 0] * (np.abs(BN[:, 2]) > 0.1) * (bs < 480))
keep = hm > 0.01
for _ in range(2):
    t = keep[BF].any(1); keep = np.zeros_like(keep); keep[BF[t].ravel()] = True
t = keep[BF].all(1); Fs = BF[t]; used = np.unique(Fs); remap = -np.ones(len(BV), int); remap[used] = np.arange(len(used))
back = trimesh.Trimesh(BV[used] - BN[used] * 0.085, remap[Fs], process=False)
parts.append(('headlight_housing', colored(back, M['housing'])))

# ------------------------------------------------------------------------------------------------ kidney surrounds
for sgn in (1, -1):
    pts = catmull([(sgn * y * LS, h) for y, h in D.KIDNEY_OUT], n=8)
    path = []
    for y, h in pts:
        s0 = front_s(y, h)
        if s0 is None: continue
        path.append(P(s0 - 6, y, h))
    parts.append(('kidney_surround', colored(tube(path, 0.0085, 14, True), M['chrome'])))

# ------------------------------------------------------------------------------------------------ mirrors
def superellipsoid(ax, ay, az, e=0.32, nu=40, nv=28):
    u = np.linspace(-np.pi, np.pi, nu, endpoint=False); v = np.linspace(-np.pi / 2, np.pi / 2, nv)
    U, Vv = np.meshgrid(u, v)
    f = lambda w, m: np.sign(w) * np.abs(w) ** m
    x = ax * f(np.cos(Vv), e) * f(np.cos(U), e); y = ay * f(np.cos(Vv), e) * f(np.sin(U), e); z = az * f(np.sin(Vv), e)
    verts = np.stack([x.ravel(), y.ravel(), z.ravel()], 1)
    faces = []
    for i in range(nv - 1):
        for j in range(nu):
            a = i * nu + j; b = i * nu + (j + 1) % nu; c = a + nu; dd = b + nu
            faces += [[a, b, c], [b, dd, c]]
    m = trimesh.Trimesh(verts, faces, process=True); m.fix_normals(); return m

for sgn in (1, -1):
    # housing (coupe mirror): an aerodynamic shell, wide laterally, rounded nose toward the front, flat glass face
    # toward the rear; centre at s 1690, |y| 902, h 1008 (drawing). Local frame: x fore-aft, y up, z lateral.
    hs_ = superellipsoid(0.056, 0.055, 0.104, e=0.62)
    v = hs_.vertices.copy()
    v[:, 0] = np.where(v[:, 0] > 0, v[:, 0] * 1.35, v[:, 0] * 0.42)            # long nose, short tail
    v[:, 1] = v[:, 1] - np.clip(-v[:, 1], 0, None) * 0.0 + np.where(v[:, 1] < 0, 0.0, 0.0)
    # the aerodynamic ridge underneath: pull the underside down a little along the middle
    v[:, 1] = v[:, 1] - 0.010 * np.exp(-(v[:, 0] / 0.03) ** 2) * (v[:, 1] < -0.04)
    # taper toward the inboard end (the arm side)
    zt = (v[:, 2] * sgn + 0.100) / 0.200
    v[:, 1] = v[:, 1] * (0.72 + 0.28 * np.clip(zt, 0, 1))
    v[:, 0] = v[:, 0] * (0.80 + 0.20 * np.clip(zt, 0, 1))
    hs_.vertices = v
    gl = trimesh.creation.box(extents=[0.004, 0.092, 0.172]); gl.apply_translation([-0.028, 0, 0])
    T = np.eye(4); c = P(1690, sgn * 900, 1008); T[:3, 3] = c
    hs_.apply_transform(T); gl.apply_transform(T)
    parts.append(('mirrors', colored(hs_, M['paint']))); parts.append(('mirrors', colored(gl, M['mirror'])))
    # arm from the door to the housing
    arm = trimesh.creation.box(extents=[0.07, 0.035, 0.07]); arm.apply_translation(P(1700, sgn * 808, 978))
    parts.append(('mirrors', colored(arm, M['black'])))
    # the black sail in the front corner of the side glass
    tri = [(1408, 916), (1655, 918), (1655, 1010), (1560, 1004)]
    vs = []
    for s_, h_ in tri:
        yv = side_y(s_, h_, sgn)
        vs.append(P(s_, (abs(yv) + 2.5) * sgn, h_))
    vs = np.array(vs)
    sail = trimesh.Trimesh(np.vstack([vs, vs - np.array([0, 0, 0.006 * sgn])]),
                           [[0, 1, 2], [0, 2, 3], [4, 6, 5], [4, 7, 6], [0, 4, 1], [1, 4, 5], [1, 5, 2], [2, 5, 6],
                            [2, 6, 3], [3, 6, 7], [3, 7, 0], [0, 7, 4]], process=True)
    sail.fix_normals(); parts.append(('mirrors', colored(sail, M['black'])))

# ------------------------------------------------------------------------------------------------ plates
FONT = 'build/fonts/BarlowCondensed-SemiBold.ttf'
def plate_texture(text, holder=None):
    W, H = 1040, 220 + (60 if holder else 0)
    im = Image.new('RGB', (W, H), (16, 16, 18))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([4, 4, W - 5, 215], radius=14, fill=(246, 196, 20), outline=(20, 20, 20), width=4)
    d.rounded_rectangle([10, 10, 92, 209], radius=8, fill=(0, 51, 153))
    for k in range(12):
        a = k / 12 * 2 * math.pi; cx, cy = 51 + 26 * math.cos(a), 62 + 26 * math.sin(a)
        d.regular_polygon((cx, cy, 5), 5, fill=(255, 204, 0))
    d.text((51, 160), 'NL', font=ImageFont.truetype(FONT, 58), fill=(255, 255, 255), anchor='mm')
    f = ImageFont.truetype(FONT, 190)
    d.text((W / 2 + 46, 116), text, font=f, fill=(12, 12, 12), anchor='mm')
    if holder:
        d.text((W / 2, 250), holder, font=ImageFont.truetype(FONT, 40), fill=(225, 225, 225), anchor='mm')
    return im

def plate_mesh(tex_img, w, h, name):
    m = trimesh.creation.box(extents=[w, h, 0.003])
    # planar UVs on the front face
    uv = np.stack([(m.vertices[:, 0] / w) + 0.5, (m.vertices[:, 1] / h) + 0.5], 1)
    m.visual = TextureVisuals(uv=uv, material=mat(name, (1, 1, 1), 0.0, 0.35, tex=tex_img))
    return m

front_tex = plate_texture('25-KDB-4', holder='GEAR  UP  automotive')
rear_tex = plate_texture('25-KDB-4')
front_tex.save('build/plate_front.png'); rear_tex.save('build/plate_rear.png')
for which, tex, hcen, hw in (('front', front_tex, 452, 0.140), ('rear', rear_tex, 783, 0.110)):
    if which == 'front':
        s0 = min(front_s(y, hcen) for y in (-250, 0, 250)); o = P(s0 - 6, 0, hcen); n = np.array([1.0, 0, 0])
        h_m = 0.140 if True else 0.110
    else:
        s0 = max(rear_s(y, hcen) for y in (-250, 0, 250)); o = P(s0 + 6, 0, hcen); n = np.array([-1.0, 0, 0])
    m = plate_mesh(tex, 0.520, hw, f'plate_{which}')
    if which == 'front':
        m.apply_translation([0, -0.015, 0])
    T = np.eye(4); z = n; x = np.cross([0, 1, 0], z); x /= np.linalg.norm(x); yv = np.cross(z, x)
    T[:3, 0], T[:3, 1], T[:3, 2], T[:3, 3] = x, yv, z, o
    m.apply_transform(T); parts.append((f'plate_{which}', m))

# ------------------------------------------------------------------------------------------------ roundels
def roundel_texture(px=512):
    im = Image.new('RGBA', (px, px), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = px / 2
    d.ellipse([2, 2, px - 3, px - 3], fill=(205, 208, 214, 255))                 # chrome rim
    d.ellipse([14, 14, px - 15, px - 15], fill=(12, 12, 14, 255))                 # black ring
    ri = px * 0.30
    d.pieslice([c - ri, c - ri, c + ri, c + ri], 180, 270, fill=(28, 105, 212, 255))
    d.pieslice([c - ri, c - ri, c + ri, c + ri], 270, 360, fill=(245, 245, 245, 255))
    d.pieslice([c - ri, c - ri, c + ri, c + ri], 0, 90, fill=(28, 105, 212, 255))
    d.pieslice([c - ri, c - ri, c + ri, c + ri], 90, 180, fill=(245, 245, 245, 255))
    d.ellipse([c - ri, c - ri, c + ri, c + ri], outline=(190, 194, 200, 255), width=5)
    f = ImageFont.truetype('build/fonts/Barlow-Bold.ttf', int(px * 0.15))
    for ch, ang in (('B', 140), ('M', 90), ('W', 40)):
        a = math.radians(ang); rr = px * 0.40
        L = Image.new('RGBA', (int(px * 0.2), int(px * 0.2)), (0, 0, 0, 0))
        ImageDraw.Draw(L).text((L.width / 2, L.height / 2), ch, font=f, fill=(245, 245, 245, 255), anchor='mm')
        L = L.rotate(ang - 90, resample=Image.BICUBIC)
        im.alpha_composite(L, (int(c + rr * math.cos(a) - L.width / 2), int(c - rr * math.sin(a) - L.height / 2)))
    return im

rt = roundel_texture(); rt.save('build/roundel.png')
def roundel(o, n, dia, name):
    m = trimesh.creation.cylinder(radius=dia / 2, height=0.004, sections=64)
    uv = np.stack([m.vertices[:, 0] / dia + 0.5, m.vertices[:, 1] / dia + 0.5], 1)
    m.visual = TextureVisuals(uv=uv, material=PBRMaterial(name='roundel', baseColorTexture=rt, metallicFactor=0.3,
                                                          roughnessFactor=0.25, alphaMode='MASK', alphaCutoff=0.5))
    place(m, o + n * 0.002, n); parts.append((name, m))

h0 = top_h(175, 0); roundel(P(175, 0, h0), normal(175, 0, h0), 0.082, 'roundel_bonnet')
s0 = rear_s(0, 943); roundel(P(s0, 0, 943), normal(s0, 0, 943), 0.074, 'roundel_boot')

# ------------------------------------------------------------------------------------------------ wipers
ws = np.array(D.WINDSCREEN, float)
base = ws[ws[:, 1].argsort()][:5]  # the base arc points (s, |y|) at small s
base_arc = np.array([p for p in D.WINDSCREEN if p[0] < 1400])
def s_base(y):
    a = base_arc[np.argsort(base_arc[:, 1])]; return np.interp(abs(y), a[:, 1], a[:, 0])
for name, (y0, y1, up) in (('wiper_driver', (-640, -40, 55)), ('wiper_passenger', (-30, 560, 95))):
    ys = np.linspace(y0, y1, 24); pts = []
    for y in ys:
        s_ = s_base(y) + up; h_ = top_h(s_, y)
        n = normal(s_, y, h_); pts.append(P(s_, y, h_) + n * 0.016)
    segs = []
    for a, b in zip(pts[:-1], pts[1:]):
        segs.append(trimesh.creation.cylinder(radius=0.0075, segment=[a, b], sections=8))
    arm_a = pts[0]; arm_b = P(s_base(y0) - 40, y0 + 60, top_h(s_base(y0) - 40, y0 + 60) + 15)
    segs.append(trimesh.creation.cylinder(radius=0.006, segment=[arm_a, (np.array(pts[len(pts) // 2]))], sections=8))
    parts.append((name, colored(trimesh.util.concatenate(segs), M['black_gloss'])))

# ------------------------------------------------------------------------------------------------ exhaust tips (left)
for (ey, eh), er in D.EXHAUST:
    y = ey * LS; s0 = rear_s(y, eh + 40) or 4440
    a = P(s0 - 120, y, eh); b = P(s0 + 22, y, eh)
    outer = trimesh.creation.annulus(r_min=er / 1000 - 0.0025, r_max=er / 1000, segment=[a, b], sections=40)
    inner = trimesh.creation.cylinder(radius=er / 1000 - 0.003, segment=[a + (b - a) * 0.55, a + (b - a) * 0.56], sections=32)
    parts.append(('exhaust_tips', colored(outer, M['chrome']))); parts.append(('exhaust_tips', colored(inner, M['tip_in'])))

# ------------------------------------------------------------------------------------------------ sticker (passenger side, behind the screen)
def sticker_texture():
    im = Image.new('RGBA', (256, 256), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.ellipse([4, 4, 251, 251], fill=(46, 160, 70, 255), outline=(240, 240, 240, 255), width=6)
    d.text((128, 120), '4', font=ImageFont.truetype('build/fonts/Barlow-Bold.ttf', 150), fill=(15, 15, 15, 255), anchor='mm')
    return im
st = sticker_texture()
y = 330; s_ = s_base(y) + 95; h_ = top_h(s_, y); n = normal(s_, y, h_)
m = trimesh.creation.cylinder(radius=0.040, height=0.0008, sections=48)
uv = np.stack([m.vertices[:, 0] / 0.08 + 0.5, m.vertices[:, 1] / 0.08 + 0.5], 1)
m.visual = TextureVisuals(uv=uv, material=PBRMaterial(name='sticker', baseColorTexture=st, roughnessFactor=0.6,
                                                      alphaMode='MASK', alphaCutoff=0.5))
place(m, P(s_, y, h_) - n * 0.008, n); parts.append(('sticker', m))

# ------------------------------------------------------------------------------------------------ export
groups = {}
for name, m in parts:
    groups.setdefault(name, []).append(m)
for name, ms in groups.items():
    for i, m in enumerate(ms):
        scene.add_geometry(m, node_name=f'{name}_{i}' if len(ms) > 1 else name, geom_name=f'{name}_{i}')
scene.export('film/public/models/details.glb')
print({k: len(v) for k, v in groups.items()})
