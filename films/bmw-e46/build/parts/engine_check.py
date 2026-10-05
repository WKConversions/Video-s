#!/usr/bin/env python3
"""
QA for film/public/models/engine.glb (run after engine.py):  python3 build/parts/engine_check.py
  - BVH overlap tests between engine nodes that must not touch, and against drivetrain / wheels / interior
  - ray-parity test against the closed body skin (which engine vertices are outside the car)
  - valve-spring local ranges (origin at the spring top, spring hangs down to the head floor)
  - topology of the cylinder head (zero-area faces, non-manifold edges)
Writes build/parts/engine_check.json and prints a summary.
"""
import bpy, bmesh, os, sys, json, math
from mathutils import Vector
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
MODELS = os.path.join(ROOT, "film", "public", "models")


def load(path, tag):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    for o in new:
        o["src"] = tag
    return new


def top_name(o, stop=("valves",)):
    while o.parent is not None and o.parent.name not in stop:
        o = o.parent
    return o.name


def world_mesh(obs):
    verts, polys = [], []
    dg = bpy.context.evaluated_depsgraph_get()
    for o in obs:
        if o.type != "MESH":
            continue
        me = o.data
        mw = o.matrix_world
        off = len(verts)
        verts += [mw @ v.co for v in me.vertices]
        polys += [[off + i for i in p.vertices] for p in me.polygons]
    return verts, polys


def bvh(obs):
    v, p = world_mesh(obs)
    if not p:
        return None, v
    return BVHTree.FromPolygons(v, p, epsilon=0.0), v


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    eng = load(os.path.join(MODELS, "engine.glb"), "engine")
    groups = {}
    for o in eng:
        if o.type == "MESH":
            groups.setdefault(top_name(o, stop=()), []).append(o)
    # sub-groups that matter
    sub = {}
    for o in eng:
        if o.type == "MESH":
            sub.setdefault(o.name, []).append(o)
    res = {}
    T = {k: bvh(v) for k, v in groups.items()}

    def ov(a_obs, b_obs):
        A, _ = bvh(a_obs)
        B, _ = bvh(b_obs)
        if A is None or B is None:
            return -1
        return len(A.overlap(B))

    pairs = [("camshaft_intake", "valve_cover"), ("camshaft_exhaust", "valve_cover"), ("valves", "valve_cover"),
             ("engine_front", "intake_manifold"), ("vanos_unit", "vanos_sprocket_intake"),
             ("vanos_unit", "vanos_sprocket_exhaust"), ("vanos_unit", "timing_chain"),
             ("vanos_unit", "valve_cover"), ("timing_chain", "valve_cover"), ("vanos_sprocket_intake", "valve_cover"),
             ("vanos_sprocket_exhaust", "valve_cover"), ("vanos_sprocket_intake", "vanos_sprocket_exhaust"),
             ("timing_chain", "cylinder_head"), ("exhaust_manifold", "engine_block"),
             ("exhaust_manifold", "intake_manifold"), ("intake_manifold", "valve_cover"),
             ("vanos_unit", "engine_front"), ("radiator", "engine_front"), ("oil_pan", "engine_front"),
             ("camshaft_intake", "cylinder_head"), ("camshaft_exhaust", "cylinder_head")]
    res["overlaps_engine"] = {}
    for a, b in pairs:
        if a in groups and b in groups:
            res["overlaps_engine"][f"{a} x {b}"] = ov(groups[a], groups[b])
    # fan (child of engine_front) vs radiator / front
    fan = [o for o in eng if o.type == "MESH" and o.name.startswith("fan")]
    if fan:
        res["overlaps_engine"]["fan x radiator"] = ov(fan, groups["radiator"])
        res["overlaps_engine"]["fan x engine_front(own meshes)"] = ov(
            fan, [o for o in groups["engine_front"] if not o.name.startswith("fan")])
    # other GLBs
    others = {}
    for nm in ("drivetrain", "wheels", "interior", "details"):
        p = os.path.join(MODELS, nm + ".glb")
        if os.path.exists(p):
            others[nm] = load(p, nm)
    res["overlaps_other"] = {}
    for nm, obs in others.items():
        og = {}
        for o in obs:
            if o.type == "MESH":
                og.setdefault(top_name(o, stop=()), []).append(o)
        for on, oobs in og.items():
            B, _ = bvh(oobs)
            if B is None:
                continue
            for en, eobs in groups.items():
                A = T[en][0]
                if A is None:
                    continue
                n = len(A.overlap(B))
                if n:
                    res["overlaps_other"][f"{en} x {nm}:{on}"] = n
    # ray parity against the body skin
    body = load(os.path.join(MODELS, "body.glb"), "body")
    Bb, _ = bvh([o for o in body if o.type == "MESH"])
    d = Vector((0.013, 0.021, 1.0)).normalized()        # Blender up (= glTF +Y), slightly skewed

    def inside(p):
        n = 0
        o = p.copy()
        for _ in range(64):
            hit = Bb.ray_cast(o, d, 10.0)
            if hit[0] is None:
                break
            n += 1
            o = hit[0] + d * 1e-5
        return n % 2 == 1
    res["outside_body"] = {}
    for en, (tree, verts) in T.items():
        step = max(1, len(verts) // 1500)
        out = [v for v in verts[::step] if not inside(v)]
        if out:
            res["outside_body"][en] = {"n_outside_sampled": len(out), "n_sampled": len(verts[::step]),
                                       "min_y_gltf": round(min(v.z for v in out), 4),
                                       "x_range": [round(min(v.x for v in out), 3), round(max(v.x for v in out), 3)]}
    # lowest points of the oil pan and the A/C compressor area
    res["lowest_y_gltf"] = {en: round(min(v.z for v in T[en][1]), 4) for en in groups if T[en][1]}
    # springs: local ranges (Blender local z = glTF local y)
    sp = {}
    for o in eng:
        if o.name.startswith("spring_") and o.type == "MESH":
            zs = [v.co.z for v in o.data.vertices]
            sp[o.name] = [round(min(zs), 4), round(max(zs), 4), round(o.scale.z, 4)]
    res["springs_local_y"] = dict(list(sorted(sp.items()))[:4])
    # head topology
    for nm in ("cylinder_head", "engine_block"):
        if nm not in groups:
            continue
        info = {}
        for o in groups[nm]:
            bm = bmesh.new()
            bm.from_mesh(o.data)
            zero = sum(1 for f in bm.faces if f.calc_area() < 1e-9)
            nonman = sum(1 for e in bm.edges if not e.is_manifold)
            bnd = sum(1 for e in bm.edges if e.is_boundary)
            info[o.name] = {"faces": len(bm.faces), "zero_area": zero, "non_manifold_edges": nonman,
                            "boundary_edges": bnd}
            bm.free()
        res["topology_" + nm] = info
    with open(os.path.join(HERE, "engine_check.json"), "w") as f:
        json.dump(res, f, indent=1)
    print(json.dumps(res, indent=1))


main()
