# Makes the dot globe for the film: dots evenly spaced over the sphere (equal-area rows), each tagged with the
# country it falls in, from Natural Earth via world-atlas (50m countries, public domain).
#   python3 globe_dots.py film/src/globe.json [--step 0.9]
import json, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from map_make import topo, polygons
from PIL import Image, ImageDraw
import numpy as np
out = sys.argv[1]; step = float(sys.argv[sys.argv.index("--step") + 1]) if "--step" in sys.argv else 0.9
t = topo("countries"); RES = 10  # raster px per degree
im = Image.new("I", (360 * RES, 180 * RES), 0); dr = ImageDraw.Draw(im)
names = [""]
for name, polys in polygons(t, "countries"):
    names.append(name); idx = len(names) - 1
    for poly in polys:
        for k, r in enumerate(poly):
            pts = [((lon + 180) * RES, (90 - lat) * RES) for lon, lat in r]
            if len(pts) > 2: dr.polygon(pts, fill=idx if k == 0 else 0)
a = np.array(im)
dots = []
lat = 90 - step / 2
while lat > -90:
    n = max(1, round(360 * math.cos(math.radians(lat)) / step))
    for i in range(n):
        lon = -180 + (i + 0.5) * 360 / n
        c = int(a[min(179 * RES, int((90 - lat) * RES)), min(359 * RES, int((lon + 180) * RES))])
        if c: dots.append([round(lat, 2), round(lon, 2), c])
    lat -= step
json.dump({"names": names, "dots": dots}, open(out, "w"), separators=(",", ":"))
print(len(dots), "dots;", len(names) - 1, "countries;", os.path.getsize(out) // 1024, "KB")
for n in ["Spain", "France", "Japan", "Brazil", "Italy"]:
    i = names.index(n); print(n, i, sum(1 for d in dots if d[2] == i))
