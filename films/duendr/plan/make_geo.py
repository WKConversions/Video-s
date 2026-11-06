# The coastlines for the curved map: Natural Earth 10m countries (world-atlas topojson, public domain) around Andalusia,
# decoded and simplified (Douglas-Peucker 0.004 deg) to film/src/geo.json as lon/lat rings.
import json, sys
import numpy as np
T = json.load(open('harvest/geo/countries-10m.json'))
sc, tr = T['transform']['scale'], T['transform']['translate']
arcs = []
for a in T['arcs']:
    a = np.cumsum(np.array(a, dtype=float), axis=0); a[:, 0] = a[:, 0] * sc[0] + tr[0]; a[:, 1] = a[:, 1] * sc[1] + tr[1]; arcs.append(a)
def ring(idx):
    pts = []
    for i in idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a.tolist() if not pts else a[1:].tolist())
    return np.array(pts)
BB = (-12.0, 4.0, 31.5, 42.5)
def dp(pts, eps):
    if len(pts) < 3: return pts
    st = [(0, len(pts) - 1)]; keep = np.zeros(len(pts), bool); keep[0] = keep[-1] = True
    while st:
        a, b = st.pop(); p, q = pts[a], pts[b]; seg = q - p; L = float(np.hypot(*seg)) or 1e-9
        if b > a + 1:
            v = pts[a + 1:b] - p; d = np.abs(seg[0] * v[:, 1] - seg[1] * v[:, 0]) / L
            if d.max() > eps: i = a + 1 + int(d.argmax()); keep[i] = True; st += [(a, i), (i, b)]
    return pts[keep]
out, names = [], {}
for g in T['objects']['countries']['geometries']:
    nm = (g.get('properties') or {}).get('name')
    polys = [g['arcs']] if g['type'] == 'Polygon' else g['arcs'] if g['type'] == 'MultiPolygon' else []
    for poly in polys:
        for k, r in enumerate(poly):
            p = ring(r)
            if len(p) < 3: continue
            if p[:, 0].max() < BB[0] or p[:, 0].min() > BB[1] or p[:, 1].max() < BB[2] or p[:, 1].min() > BB[3]: continue
            # a closed ring: split at the point farthest from the start, simplify both halves
            far = int(np.argmax(np.hypot(*(p - p[0]).T))); s = np.concatenate([dp(p[:far + 1], 0.004)[:-1], dp(p[far:], 0.004)])
            if len(s) >= 4:
                out.append({'c': nm, 'hole': k > 0, 'p': [[round(float(x), 4), round(float(y), 4)] for x, y in s]}); names[nm] = names.get(nm, 0) + 1
print(names, len(out), sum(len(o['p']) for o in out))
json.dump(out, open('film/src/geo.json', 'w'))
