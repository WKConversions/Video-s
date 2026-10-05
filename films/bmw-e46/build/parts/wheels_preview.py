"""Preview renders for wheels.py (Cycles CPU, soft white studio). Called from wheels.py after the build, with the
built wheel objects in the current bpy scene. Also writes side-by-side comparisons with the brother's photo."""
import math
import os

import bpy
import numpy as np
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
FILM_ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
PREVIEW_DIR = os.path.join(HERE, "previews")
BODY_GLB = os.path.join(FILM_ROOT, "film", "public", "models", "body.glb")
PHOTO = os.path.join(FILM_ROOT, "assets", "brother-car.jpg")

FR = Vector((1.3625, -0.7355, 0.318))


def studio():
    """Approximation of the film's three.js studio (three_kit.tsx): dark surroundings with soft light panels that the
    metals reflect, an ambient fill, a key from above-left; rendered with a transparent film over white + a shadow
    catcher floor, so the background reads as the film's bright studio."""
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 40
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 8
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0
    w = scene.world or bpy.data.worlds.new("studio")
    scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    # three.js ambientLight(1.1) gives albedo * 1.1 / pi of diffuse light -> a uniform world of ~0.35
    bg.inputs["Color"].default_value = (0.35, 0.35, 0.36, 1)
    bg.inputs["Strength"].default_value = 1.0
    if "ground" not in bpy.data.objects:
        bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0))
        g = bpy.context.active_object
        g.name = "ground"
        g.is_shadow_catcher = True
    # the film's Lightformer panels (radiance = three.js intensity -> P = L * pi * area) and its two directional
    # lights (three.js intensity == Cycles sun strength for diffuse); three.js (x, y, z) -> Blender (x, -z, y)
    for name, loc, rot, size, energy in (
        ("panel_top", (0.0, -4.0, 6.0), (math.radians(34), 0, 0), (12.0, 4.0), 2.2 * math.pi * 48.0),
        ("panel_left", (-8.0, -2.0, 2.0), (0, math.radians(-90), 0), (10.0, 4.0), 1.2 * math.pi * 40.0),
        ("panel_right", (8.0, 2.0, 1.0), (0, math.radians(90), 0), (8.0, 4.0), 0.8 * math.pi * 32.0),
    ):
        if name in bpy.data.objects:
            continue
        ld = bpy.data.lights.new(name, "AREA")
        ld.shape = "RECTANGLE"
        ld.size, ld.size_y = size
        ld.energy = energy
        lo = bpy.data.objects.new(name, ld)
        bpy.context.scene.collection.objects.link(lo)
        lo.location = loc
        lo.rotation_euler = rot
    for name, frm, strength in (("key", (-6.0, -8.0, 10.0), 2.4), ("fill", (8.0, -6.0, 3.0), 0.9)):
        if name in bpy.data.objects:
            continue
        ld = bpy.data.lights.new(name, "SUN")
        ld.energy = strength
        ld.angle = math.radians(4.0)
        lo = bpy.data.objects.new(name, ld)
        bpy.context.scene.collection.objects.link(lo)
        lo.rotation_euler = (Vector(frm)).to_track_quat("Z", "Y").to_euler()


def on_white(path):
    from PIL import Image
    im = Image.open(path).convert("RGBA")
    bgimg = Image.new("RGBA", im.size, (246, 246, 246, 255))
    bgimg.alpha_composite(im)
    bgimg.convert("RGB").save(path)


def camera(name, loc, target, lens=50.0, res=(960, 540), ortho=None):
    scene = bpy.context.scene
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_fit = "VERTICAL"
    cd.sensor_height = 24.0
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    co = bpy.data.objects.new(name, cd)
    scene.collection.objects.link(co)
    co.location = loc
    d = Vector(target) - Vector(loc)
    co.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    scene.camera = co
    scene.render.resolution_x, scene.render.resolution_y = res
    scene.render.resolution_percentage = 100
    return co


def render(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    on_white(path)
    print("wrote", path)


def set_visible(pred):
    for o in bpy.data.objects:
        if o.type in ("MESH",) and o.name != "ground":
            o.hide_render = not pred(o)


def import_body():
    if any(o.get("is_body") for o in bpy.data.objects):
        return
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=BODY_GLB)
    paint = bpy.data.materials.new("preview_black_paint")
    paint.use_nodes = True
    bsdf = paint.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.012, 0.012, 0.014, 1)
    bsdf.inputs["Roughness"].default_value = 0.25
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = 1.0
    for o in set(bpy.data.objects) - before:
        o["is_body"] = True
        if o.type == "MESH":            # the body GLB's own material renders white here; black paint for the check
            for slot in o.material_slots:
                slot.material = paint


def photo_crop(box, size):
    from PIL import Image
    im = Image.open(PHOTO).convert("RGB")
    return im.crop(box).resize(size, Image.LANCZOS)


def side_by_side(left, right_path, out, labels=("photo", "model")):
    from PIL import Image, ImageDraw
    r = Image.open(right_path).convert("RGB")
    left = left.resize((int(left.width * r.height / left.height), r.height))
    c = Image.new("RGB", (left.width + r.width + 10, r.height), (255, 255, 255))
    c.paste(left, (0, 0))
    c.paste(r, (left.width + 10, 0))
    d = ImageDraw.Draw(c)
    d.text((8, 8), labels[0], fill=(255, 0, 0))
    d.text((left.width + 18, 8), labels[1], fill=(255, 0, 0))
    c.save(out)
    print("wrote", out)


def rectified_photo(px_per_mm=1.0, half_mm=350, centre=(0.0, 0.0)):
    """The photo's front-right wheel un-projected to a face-on view (affine: the rim lip ellipse -> circle, plus a
    depth-dependent shift for the concave face). Front of the car to the right, as in a right-side face view."""
    from PIL import Image
    from scipy.ndimage import map_coordinates
    im = np.asarray(Image.open(PHOTO).convert("RGB")).astype(float)
    cx, cy, ax, by = 871.5, 2096.5, 81.5, 116.5           # rim-lip ellipse in the photo (pixels)
    mmpx = 246.0 / by                                    # lip radius 246 mm (18" J flange)
    n = int(2 * half_mm * px_per_mm)
    u = np.linspace(-half_mm, half_mm, n)
    U, V = np.meshgrid(u, u)
    U, V = U + centre[0], V + centre[1]
    r = np.hypot(U, V)
    depth = np.where(r > 246, 0, np.clip(40 * (246 - r) / (246 - 60), 0, 40))
    xs = cx + U / mmpx * (ax / by) + depth * 0.714 / mmpx
    ys = cy + V / mmpx
    out = np.stack([map_coordinates(im[..., c], [ys, xs], order=1) for c in range(3)], -1)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def compare_face(model_path, out, half_mm=350, centre=(0.0, 0.0)):
    from PIL import Image, ImageDraw
    m = Image.open(model_path).convert("RGB")
    ph = rectified_photo(px_per_mm=m.width / (2.0 * half_mm), half_mm=half_mm, centre=centre).resize(m.size)
    blend = Image.blend(ph, m, 0.5)
    c = Image.new("RGB", (m.width * 3 + 20, m.height), (255, 255, 255))
    for i, im in enumerate((ph, m, blend)):
        c.paste(im, (i * (m.width + 10), 0))
    d = ImageDraw.Draw(c)
    for i, t in enumerate(("photo (rectified)", "model", "overlay")):
        d.text((i * (m.width + 10) + 8, 8), t, fill=(255, 0, 0))
    c.save(out)
    print("wrote", out)


def wheel_dir(az_deg, el_deg, outward=-1):
    """Unit vector from a wheel centre: az measured from the outward axle toward the car front."""
    az, el = math.radians(az_deg), math.radians(el_deg)
    return Vector((math.sin(az) * math.cos(el), outward * math.cos(az) * math.cos(el), math.sin(el)))


def render_all(views=None):
    os.makedirs(PREVIEW_DIR, exist_ok=True)
    studio()
    want = lambda v: views is None or v in views
    is_wheel = lambda o: not o.get("is_body")

    if want("photo"):
        # Brother's photo (assets/brother-car.jpg) is a front-RIGHT three-quarter: the car front is to the image right.
        # Camera fitted to the photo: the rim-lip ellipse ratio 0.70 -> view 45.6 deg off the axle; the cap shifts
        # 12.5 px toward the front and ~0 px vertically -> camera nearly level with the hub; lip diameter 233 px.
        set_visible(lambda o: is_wheel(o) and o.get("corner") == "FR")
        lip = FR + Vector((0, -0.107, 0))
        loc = lip + wheel_dir(45.6, 3.0) * 4.0
        cam = camera("cam_photo", loc, lip, lens=119.7, res=(640, 760))
        cam.data.shift_x = (320 - 265) / 760.0
        cam.data.shift_y = (399 - 380) / 760.0
        p = os.path.join(PREVIEW_DIR, "wheels_photo_match.png")
        render(p)
        crop = photo_crop((739, 1897, 1059, 2277), (640, 760))
        side_by_side(crop, p, os.path.join(PREVIEW_DIR, "wheels_compare_photo.png"))
        from PIL import Image
        Image.blend(crop, Image.open(p).convert("RGB"), 0.5).save(os.path.join(PREVIEW_DIR, "wheels_overlay_photo.png"))
    if want("face"):
        set_visible(lambda o: is_wheel(o) and o.get("corner") == "FR")
        loc = FR + wheel_dir(0.0, 0.0) * 6.0
        camera("cam_face", loc, FR, lens=100, res=(700, 700), ortho=0.70)
        p = os.path.join(PREVIEW_DIR, "wheels_face.png")
        render(p)
        compare_face(p, os.path.join(PREVIEW_DIR, "wheels_compare_face.png"))
    if want("hub"):
        set_visible(lambda o: is_wheel(o) and o.get("corner") == "FR")
        loc = FR + wheel_dir(0.0, 0.0) * 6.0
        camera("cam_hub", loc, FR, lens=100, res=(900, 900), ortho=0.30)
        p = os.path.join(PREVIEW_DIR, "wheels_hub.png")
        render(p)
        # the rectified photo's hub centre sits ~(-3.3, -5) mm off the rim-lip centre (depth model) -> recentre
        compare_face(p, os.path.join(PREVIEW_DIR, "wheels_compare_hub.png"), half_mm=150, centre=(-3.3, -5.0))
    if want("brakes"):
        # inside view: no tyre, from behind the wheel (car centre side), front-left wheel
        FL = Vector((1.3625, 0.7355, 0.318))
        set_visible(lambda o: is_wheel(o) and o.get("corner") == "FL" and o.get("part") not in ("tyre",))
        loc = FL + Vector((-0.9, -1.6, 0.45))
        camera("cam_brakes", loc, FL, lens=60, res=(800, 700))
        render(os.path.join(PREVIEW_DIR, "wheels_brakes_inside.png"))
    if want("caliper"):
        # front-left brake without tyre and rim, from outside and behind: the caliper on the trailing side
        FL = Vector((1.3625, 0.7355, 0.318))
        set_visible(lambda o: is_wheel(o) and o.get("corner") == "FL" and o.get("part") in ("brake_disc", "caliper"))
        tgt = FL + Vector((-0.135, 0.0, 0.025))
        camera("cam_caliper", tgt + wheel_dir(-18.0, 10.0, outward=1) * 0.75, tgt, lens=55, res=(800, 600))
        render(os.path.join(PREVIEW_DIR, "wheels_caliper_FL.png"))
        camera("cam_caliper2", tgt + wheel_dir(-70.0, 25.0, outward=1) * 0.75, tgt, lens=55, res=(800, 600))
        render(os.path.join(PREVIEW_DIR, "wheels_caliper_FL_rear.png"))
    if want("cut"):
        # caliper/disc seen from outside through a tyre-less rim, rear-right wheel, to check the trailing side
        RR = Vector((-1.3625, -0.739, 0.318))
        set_visible(lambda o: is_wheel(o) and o.get("corner") == "RR" and o.get("part") != "tyre")
        loc = RR + wheel_dir(-25.0, 10.0) * 2.6
        camera("cam_cut", loc, RR, lens=70, res=(760, 700))
        render(os.path.join(PREVIEW_DIR, "wheels_rear_right_no_tyre.png"))
    if want("car"):
        import_body()
        set_visible(lambda o: True)
        loc = Vector((5.6, -3.6, 1.15))
        camera("cam_car", loc, Vector((0.6, 0, 0.45)), lens=35, res=(1280, 720))
        render(os.path.join(PREVIEW_DIR, "wheels_on_car_front_right.png"))
    if want("left"):
        import_body()
        set_visible(lambda o: True)
        loc = Vector((-4.8, 4.6, 1.0))
        camera("cam_left", loc, Vector((-0.3, 0, 0.45)), lens=35, res=(1280, 720))
        render(os.path.join(PREVIEW_DIR, "wheels_on_car_rear_left.png"))
    if want("set"):
        set_visible(lambda o: is_wheel(o))
        loc = Vector((4.2, -4.4, 2.6))
        camera("cam_set", loc, Vector((0, 0, 0.3)), lens=40, res=(1280, 720))
        render(os.path.join(PREVIEW_DIR, "wheels_set.png"))
