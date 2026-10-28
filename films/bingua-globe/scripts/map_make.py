# Makes the data for a map animation: a dot map of a region (Amargier Advisory's EMEA, spreading out from Málaga) or
# country shapes with highlights (TopJobsAbroad's Europe, with the route of a move), fitted to the 1920×1080 frame,
# with the cities the film marks. Karl's favourite way to show place (design/maps.md). Natural Earth via the
# world-atlas package: public domain, no credit needed.
#   python3 map_make.py dots      --bbox=-26,64,-36,71 --cities "Málaga,London,Dubai" --out src/map.json
#   python3 map_make.py countries --bbox=-11,32,34,61 --highlight "Spain,Greece,Sweden" --cities "Madrid,Athens" --out src/map.json
#   [--frame 1250,545,960]   centre x, centre y and height in px the map's latitude range fills (default: centred, 960)
#   [--step 1.15]            dot spacing in degrees (dots); smaller is denser
#   [--city "Name:lon,lat"]  a place that isn't in the built-in list (repeatable)
# Projection: Mercator for country shapes (they look the way people know them), equal spacing for dots.
# Output JSON: dots: [[x, y, edgeFade]]  or  countries: [{n, hl, d}] (SVG path data in frame px), and cities: {name: [x, y]}.
# Use with the kit's map components (scripts/maps.tsx): DotMap, CountryMap, Pin, Route.
import argparse, json, math, os, urllib.request

CACHE = os.path.join(os.path.expanduser("~"), ".cache", "world-atlas")
CITIES = {  # lon, lat
    "Amsterdam": (4.9, 52.37), "Athens": (23.73, 37.98), "Barcelona": (2.17, 41.39), "Berlin": (13.4, 52.52), "Brussels": (4.35, 50.85),
    "Budapest": (19.04, 47.5), "Copenhagen": (12.57, 55.68), "Dublin": (-6.26, 53.35), "Edinburgh": (-3.19, 55.95), "Frankfurt": (8.68, 50.11),
    "Geneva": (6.14, 46.2), "Gothenburg": (11.97, 57.71), "Hamburg": (9.99, 53.55), "Helsinki": (24.94, 60.17), "Istanbul": (28.98, 41.01),
    "Lisbon": (-9.14, 38.72), "London": (-0.13, 51.5), "Madrid": (-3.7, 40.42), "Málaga": (-4.42, 36.72), "Malta": (14.51, 35.9),
    "Milan": (9.19, 45.46), "Munich": (11.58, 48.14), "Oslo": (10.75, 59.91), "Paris": (2.35, 48.86), "Prague": (14.42, 50.08),
    "Rome": (12.5, 41.9), "Rotterdam": (4.48, 51.92), "Stockholm": (18.07, 59.33), "Vienna": (16.37, 48.21), "Warsaw": (21.01, 52.23),
    "Zurich": (8.54, 47.37), "Cairo": (31.24, 30.04), "Casablanca": (-7.59, 33.57), "Dubai": (55.27, 25.2), "Riyadh": (46.7, 24.7),
    "Tel Aviv": (34.78, 32.08), "Lagos": (3.38, 6.52), "Nairobi": (36.82, -1.29), "Johannesburg": (28.04, -26.2), "Cape Town": (18.42, -33.92),
    "New York": (-74.0, 40.71), "San Francisco": (-122.42, 37.77), "Los Angeles": (-118.24, 34.05), "Toronto": (-79.38, 43.65), "Chicago": (-87.63, 41.88),
    "Mexico City": (-99.13, 19.43), "São Paulo": (-46.63, -23.55), "Buenos Aires": (-58.38, -34.6), "Mumbai": (72.88, 19.08), "Delhi": (77.21, 28.61),
    "Bangalore": (77.59, 12.97), "Singapore": (103.82, 1.35), "Hong Kong": (114.17, 22.32), "Shanghai": (121.47, 31.23), "Beijing": (116.4, 39.9),
    "Tokyo": (139.69, 35.69), "Seoul": (126.98, 37.57), "Sydney": (151.21, -33.87), "Melbourne": (144.96, -37.81), "Bali": (115.19, -8.41),
}

def topo(kind):
    os.makedirs(CACHE, exist_ok=True); f = os.path.join(CACHE, f"{kind}-50m.json")
    if not os.path.exists(f):
        urllib.request.urlretrieve(f"https://cdn.jsdelivr.net/npm/world-atlas@2/{kind}-50m.json", f)
    return json.load(open(f))

def decode(t):
    sx, sy = t["transform"]["scale"]; tx, ty = t["transform"]["translate"]; arcs = []
    for a in t["arcs"]:
        x = y = 0; pts = []
        for dx, dy in a: x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    def ring(idx):
        out = []
        for i in idx:
            p = arcs[i] if i >= 0 else arcs[~i][::-1]
            out += p if not out else p[1:]
        return out
    return ring

def polygons(t, obj):
    ring = decode(t)
    for g in t["objects"][obj]["geometries"]:
        polys = g["arcs"] if g["type"] == "MultiPolygon" else ([g["arcs"]] if g["type"] == "Polygon" else [])
        yield g.get("properties", {}).get("name", ""), [[ring(r) for r in poly] for poly in polys]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("kind", choices=["dots", "countries"])
    ap.add_argument("--bbox", required=True, help="lon0,lon1,lat0,lat1 (write --bbox=-11,32,34,61: a leading minus needs the =)"); ap.add_argument("--cities", default="")
    ap.add_argument("--city", action="append", default=[]); ap.add_argument("--highlight", default="")
    ap.add_argument("--frame", default="960,540,960"); ap.add_argument("--step", type=float, default=1.15); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    LON0, LON1, LAT0, LAT1 = map(float, a.bbox.split(",")); CX, CY, HPX = map(float, a.frame.split(","))
    for c in a.city:
        n, ll = c.split(":"); CITIES[n] = tuple(map(float, ll.split(",")))
    # Mercator, so shapes look the way people know them; fitted so the latitude range fills HPX
    my = lambda lat: math.log(math.tan(math.pi / 4 + math.radians(max(-85, min(85, lat))) / 2))
    k = HPX / (my(LAT1) - my(LAT0)); lonc = (LON0 + LON1) / 2; myc = (my(LAT0) + my(LAT1)) / 2
    proj = lambda lon, lat: (round(CX + math.radians(lon - lonc) * k, 1), round(CY - (my(lat) - myc) * k, 1))
    if a.kind == "dots":   # dots sit on an even grid: an equal-spaced projection keeps the rows even (Mercator stripes them)
        kq = HPX / (LAT1 - LAT0); latc = (LAT0 + LAT1) / 2; cs = math.cos(math.radians(latc))
        proj = lambda lon, lat: (round(CX + (lon - lonc) * kq * cs, 1), round(CY - (lat - latc) * kq, 1))
    out = {"bbox": [LON0, LON1, LAT0, LAT1], "cities": {}}
    for n in [c.strip() for c in a.cities.split(",") if c.strip()] + [c.split(":")[0] for c in a.city]:
        if n not in CITIES: raise SystemExit(f"unknown city {n}: add it with --city \"{n}:lon,lat\"")
        out["cities"][n] = proj(*CITIES[n])
    pad = 8
    if a.kind == "countries":
        hl = {h.strip().lower() for h in a.highlight.split(",") if h.strip()}; shapes = []
        for name, polys in polygons(topo("countries"), "countries"):
            d = ""
            for rings in polys:
                xs = [p[0] for p in rings[0]]; ys = [p[1] for p in rings[0]]
                if max(xs) < LON0 - pad or min(xs) > LON1 + pad or max(ys) < LAT0 - pad or min(ys) > LAT1 + pad: continue
                for r in rings:
                    pts = [proj(*p) for p in r]
                    d += "M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z"
            if d: shapes.append({"n": name, "hl": name.lower() in hl, "d": d})
        missing = hl - {s["n"].lower() for s in shapes}
        if missing: print("not found (check the Natural Earth name):", ", ".join(sorted(missing)))
        out["countries"] = shapes; print(len(shapes), "countries,", sum(s["hl"] for s in shapes), "highlighted")
    else:
        polys = []
        for _, ps in polygons(topo("land"), "land"):
            for rings in ps:
                xs = [p[0] for p in rings[0]]; ys = [p[1] for p in rings[0]]
                if max(xs) < LON0 - 5 or min(xs) > LON1 + 5 or max(ys) < LAT0 - 5 or min(ys) > LAT1 + 5: continue
                polys.append((min(xs), max(xs), min(ys), max(ys), rings))
        def pip(r, lon, lat):
            c = False
            for i in range(len(r)):
                x1, y1 = r[i - 1]; x2, y2 = r[i]
                if (y1 > lat) != (y2 > lat) and lon < (x2 - x1) * (lat - y1) / (y2 - y1 + 1e-12) + x1: c = not c
            return c
        inside = lambda lon, lat: any(x0 <= lon <= x1 and y0 <= lat <= y1 and pip(rs[0], lon, lat) and not any(pip(h, lon, lat) for h in rs[1:]) for x0, x1, y0, y1, rs in polys)
        dots, row, lat, st = [], 0, LAT1, a.step
        while lat > LAT0:
            lon = LON0 + (row % 2) * st / 2
            while lon < LON1:
                if inside(lon, lat):
                    fade = max(0.0, min(1.0, (LON1 - lon) / 10, (lon - LON0) / 8, (LAT1 - lat) / 6, (lat - LAT0) / 6))
                    if fade > 0.05: dots.append([*proj(lon, lat), round(fade, 2)])
                lon += st
            lat -= st * 0.88; row += 1
        out["dots"] = dots; print(len(dots), "dots")
    json.dump(out, open(a.out, "w")); print("->", a.out)

if __name__ == "__main__":
    main()
