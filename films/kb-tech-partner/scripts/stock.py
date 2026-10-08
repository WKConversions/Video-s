# Finds royalty-free footage and photos, measures them for the film, and keeps the credits.
#   python3 stock.py search "rome street" --kind video|photo --out stock/ [--n 16] [--page 1]
#                                          [--pexels 2064827,1797161] [--min-width 1600]
#   python3 stock.py get stock/candidates.json 3,7 --to public/footage      (full resolution + credits)
# Sources that answer scripts from the build sandbox (Pexels and Pixabay search pages, Unsplash and
# Wikimedia block or rate-limit them):
#   video  Mixkit       mixkit.co tag pages; Mixkit Stock Video Free License: commercial use, no credit
#   photo  Openverse    api.openverse.org (Flickr, Wikimedia and more), filtered to licences that allow
#                       commercial use and changes (CC0, public domain, CC BY, CC BY-SA); BY and BY-SA
#                       need the attribution line it records
#   photo  Pexels       by photo ID only (find IDs with a web search: "site:pexels.com rome street");
#                       Pexels licence: commercial use, no credit needed
# search downloads a preview of each candidate and measures it: size, brightness, colour, how busy it
# is (edge density) and which third is calmest (room for type); for video also length and camera motion
# (static, drift, pan, fast) and whether the clip cuts inside. It writes candidates.json and a contact
# sheet, candidates.png. get downloads the chosen ones at full size and appends to <to>/CREDITS.md and
# credits.json; copy the attribution lines into the film's README. Needs numpy, Pillow, OpenCV.
import json, os, re, subprocess, sys, urllib.parse, urllib.request
import numpy as np

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

def get(url, path=None):
    import time, urllib.error
    if "wikimedia.org" in url: time.sleep(1.0)       # Wikimedia asks scripts to go slowly
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
    except urllib.error.HTTPError as e:
        if e.code != 429: raise
        time.sleep(4.0); data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
    if path: open(path, "wb").write(data)
    return data

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]

def mixkit(q, page):
    url = f"https://mixkit.co/free-stock-video/discover/{slug(q)}/" + (f"?page={page}" if page > 1 else "")
    html = get(url).decode("utf8", "ignore")
    out, seen = [], set()
    for s, vid in re.findall(r'href="(?:https://mixkit\.co)?/free-stock-video/([a-z0-9-]+)-(\d+)/"', html):
        if vid in seen: continue
        seen.add(vid)
        out.append({"source": "mixkit", "id": vid, "kind": "video", "title": s.replace("-", " ").capitalize(),
                    "page": f"https://mixkit.co/free-stock-video/{s}-{vid}/",
                    "preview": f"https://assets.mixkit.co/videos/{vid}/{vid}-360.mp4",
                    "full": f"https://assets.mixkit.co/videos/{vid}/{vid}-1080.mp4",
                    "licence": "Mixkit Stock Video Free License (commercial use, no credit needed)", "attribution": None})
    return out

def wm_thumb(url, px):
    """Wikimedia serves originals to scripts only slowly; its standard thumbnail sizes are the polite way."""
    m = re.match(r"https://upload\.wikimedia\.org/wikipedia/commons/(\w)/(\w\w)/(.+)$", url or "")
    return f"https://upload.wikimedia.org/wikipedia/commons/thumb/{m[1]}/{m[2]}/{m[3]}/{px}px-{m[3]}" + (".jpg" if m[3].lower().endswith((".tif", ".tiff")) else "") if m else url

def openverse(q, n, page, large=False):
    o = {"q": q, "page_size": n, "page": page, "license_type": "commercial,modification", "mature": "false"}
    if large: o["size"] = "large"
    p = urllib.parse.urlencode(o)
    data = json.loads(get("https://api.openverse.org/v1/images/?" + p))
    out = []
    for r in data.get("results", []):
        lic = (r.get("license") or "").upper()
        out.append({"source": "openverse/" + (r.get("source") or ""), "id": r["id"], "kind": "photo", "title": r.get("title") or "",
                    "page": r.get("foreign_landing_url"), "preview": wm_thumb(r["url"], 960) if "wikimedia" in r["url"] else (r.get("thumbnail") or r["url"]),
                    "full": wm_thumb(r["url"], 1920) if "wikimedia" in r["url"] else r["url"],
                    "width": r.get("width"), "height": r.get("height"),
                    "licence": f"CC {lic} {r.get('license_version') or ''}".strip() if lic not in ("CC0", "PDM") else ("CC0" if lic == "CC0" else "public domain"),
                    "attribution": r.get("attribution") if lic not in ("CC0", "PDM") else None})
    return out

def pexels(ids):
    return [{"source": "pexels", "id": i, "kind": "photo", "title": f"Pexels {i}", "page": f"https://www.pexels.com/photo/{i}/",
             "preview": f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=800",
             "full": f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=2400",
             "licence": "Pexels License (commercial use, no credit needed)", "attribution": None} for i in ids]

def look(img):
    """img: HxWx3 uint8. Brightness, colourfulness, busy-ness, the calmest third (room for type)."""
    import cv2
    g = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(cv2.resize(g, (480, int(480 * g.shape[0] / g.shape[1]))), 80, 160) > 0
    thirds = [edges[:, k * edges.shape[1] // 3:(k + 1) * edges.shape[1] // 3].mean() for k in range(3)]
    rg, yb = img[..., 0].astype(float) - img[..., 1], 0.5 * (img[..., 0].astype(float) + img[..., 1]) - img[..., 2]
    small = cv2.resize(img, (64, 36)).reshape(-1, 3).astype(np.float32)
    _, lab, cen = cv2.kmeans(small, 3, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0), 3, cv2.KMEANS_PP_CENTERS)
    order = np.argsort(-np.bincount(lab.ravel(), minlength=3))
    return {"brightness": round(float(g.mean() / 255), 2), "colourful": round(float(np.hypot(rg.std(), yb.std()) + 0.3 * np.hypot(rg.mean(), yb.mean())), 1),
            "busy": round(float(edges.mean()), 3), "calm_third": ["left", "centre", "right"][int(np.argmin(thirds))],
            "palette": ["#%02x%02x%02x" % tuple(int(v) for v in cen[k]) for k in order]}

def frames(path, every=1, w=480):
    """Decode every n-th frame of a video at width w; returns the frames, the length (s) and the frame rate."""
    import cv2
    cap = cv2.VideoCapture(path)
    rate = cap.get(cv2.CAP_PROP_FPS) or 30.0
    out, i = [], 0
    while True:
        ok, f = cap.read()
        if not ok: break
        if i % every == 0:
            h = int(round(w * f.shape[0] / f.shape[1] / 2)) * 2
            out.append(cv2.cvtColor(cv2.resize(f, (w, h), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB))
        i += 1
    return np.array(out), i / rate, rate

def motion(fr, rate):
    """The camera's speed from frame-to-frame phase correlation, in % of the frame width per second, and cuts."""
    import cv2
    win = cv2.createHanningWindow(fr.shape[1:3][::-1], cv2.CV_64F)
    g = [cv2.cvtColor(f, cv2.COLOR_RGB2GRAY).astype(np.float64) for f in fr]
    speeds, cuts = [], 0
    for a, b in zip(g, g[1:]):
        (dx, dy), resp = cv2.phaseCorrelate(a.copy(), b.copy(), win)
        if np.abs(a - b).mean() > 40: cuts += 1; continue
        speeds.append(np.hypot(dx, dy) * rate / fr.shape[2] * 100)
    s = float(np.median(speeds)) if speeds else 0.0
    kind = "static" if s < 0.5 else "drift" if s < 3 else "pan" if s < 12 else "fast"
    return round(s, 1), kind, cuts

def measure(c, d):
    from PIL import Image
    p = os.path.join(d, f"{c['source'].split('/')[0]}-{slug(str(c['id']))[:24]}" + (".mp4" if c["kind"] == "video" else ".jpg"))
    if not os.path.exists(p):
        try: get(c["preview"], p)
        except Exception:                      # Openverse's thumbnail proxy fails at times: take the original
            if c["full"] == c["preview"]: raise
            get(c["full"], p)
    c["preview_file"] = p
    if c["kind"] == "video":
        step = 4
        fr, dur, rate = frames(p, every=step, w=320)
        sp, kind, cuts = motion(fr, rate / step)
        c.update({"duration": round(dur, 1), "camera": kind, "camera_speed": sp, "cuts_inside": cuts, **look(fr[len(fr) // 2])})
        c["thumb"] = [fr[int(len(fr) * k)] for k in (0.1, 0.5, 0.9)]
    else:
        im = np.array(Image.open(p).convert("RGB"))
        c.update(look(im)); c["thumb"] = [im]
        if not c.get("width"): c["width"], c["height"] = im.shape[1], im.shape[0]
    return c

def sheet(cands, path):
    from PIL import Image, ImageDraw
    TW, TH, cols = 300, 169, 4
    rows = (len(cands) + cols - 1) // cols
    im = Image.new("RGB", (cols * (TW + 10) + 10, rows * (TH + 70) + 10), "white"); d = ImageDraw.Draw(im)
    for i, c in enumerate(cands):
        x, y = 10 + (i % cols) * (TW + 10), 10 + (i // cols) * (TH + 70)
        th = c["thumb"]
        for k, t in enumerate(th):
            w = TW // len(th)
            src = Image.fromarray(t); sw = src.width / len(th) if len(th) > 1 else src.width
            crop = src if len(th) == 1 else src.crop((int((src.width - sw) / 2), 0, int((src.width + sw) / 2), src.height))
            crop = crop.resize((w, TH)) if len(th) > 1 else src.resize((TW, int(TW * src.height / src.width))).crop((0, 0, TW, TH))
            im.paste(crop, (x + k * w, y))
        d.rectangle([x, y, x + 26, y + 18], fill=(20, 20, 48)); d.text((x + 5, y + 3), str(i), fill=(255, 255, 255))
        d.text((x, y + TH + 4), c["title"][:44], fill=(0, 0, 0))
        info = (f"{c['duration']} s  {c['camera']}  " if c["kind"] == "video" else f"{c.get('width')}×{c.get('height')}  ") + f"busy {c['busy']}  room {c['calm_third']}"
        d.text((x, y + TH + 20), info, fill=(70, 70, 70))
        d.text((x, y + TH + 36), f"{c['source']}  {c['licence'][:30]}", fill=(110, 110, 110))
        for k, col in enumerate(c["palette"]): d.rectangle([x + TW - 54 + k * 18, y + TH + 38, x + TW - 38 + k * 18, y + TH + 50], fill=col)
    im.save(path)

def search():
    q, kind, out = sys.argv[2], arg("--kind", "video"), arg("--out", "stock")
    n, page, minw = int(arg("--n", 16)), int(arg("--page", 1)), int(arg("--min-width", 0))
    os.makedirs(os.path.join(out, "preview"), exist_ok=True)
    cands = []
    if kind == "video": cands += mixkit(q, page)[:n]
    else:
        if arg("--pexels"): cands += pexels(arg("--pexels").split(","))
        cands += [c for c in openverse(q, n, page, large=minw >= 1200) if not minw or not c.get("width") or c["width"] >= minw]
    keep = []
    for c in cands:
        try: keep.append(measure(c, os.path.join(out, "preview")))
        except Exception as e: print("skip", c["title"][:40], e)
    sheet(keep, os.path.join(out, "candidates.png"))
    for c in keep: c.pop("thumb", None)
    json.dump(keep, open(os.path.join(out, "candidates.json"), "w"), indent=1)
    for i, c in enumerate(keep):
        v = f"{c['duration']:5.1f} s {c['camera']:6s} {c['camera_speed']:4.1f}%/s cuts {c['cuts_inside']}" if c["kind"] == "video" else f"{c.get('width')}×{c.get('height')}"
        print(f"{i:2d} {c['title'][:46]:46s} {v}  busy {c['busy']:.3f} room {c['calm_third']:6s} light {c['brightness']:.2f}  {c['source']}")
    print(f"sheet: {out}/candidates.png")

def fetch():
    cands = json.load(open(sys.argv[2])); picks = [int(i) for i in sys.argv[3].split(",")]
    to = arg("--to", "footage"); os.makedirs(to, exist_ok=True)
    cred_path = os.path.join(to, "credits.json")
    credits = json.load(open(cred_path)) if os.path.exists(cred_path) else []
    for i in picks:
        c = cands[i]
        fn = os.path.join(to, slug(c["title"]) + "-" + slug(str(c["id"]))[:12] + (".mp4" if c["kind"] == "video" else ".jpg"))
        if c["source"] == "mixkit":           # the clip's own page names its best free file and its licence
            page = get(c["page"]).decode("utf8", "ignore")
            m = re.search(r'"contentUrl":"(https://assets\.mixkit\.co/videos/[^"]+\.mp4)"', page)
            lic = re.search(r'"license":"([^"]+)"', page)
            if lic and "videoFree" not in lic[1] and "--force" not in sys.argv:
                print(f"skip {c['title']}: licence {lic[1]}, not the free one"); continue
            if m: c["full"] = m[1]
        get(c["full"], fn)
        credits = [k for k in credits if k["file"] != os.path.basename(fn)] + [{"file": os.path.basename(fn), "title": c["title"], "source": c["source"],
                   "page": c["page"], "licence": c["licence"], "attribution": c["attribution"]}]
        size = ""
        if c["kind"] == "video":
            import cv2
            cap = cv2.VideoCapture(fn); W, H = int(cap.get(3)), int(cap.get(4))
            size = f"{W}×{H}" + ("  (below 1080p: use it small, behind blur, or not full frame)" if H < 1080 else "")
        print(f"{fn}  {size}  ({c['licence']})")
    json.dump(credits, open(cred_path, "w"), indent=1)
    lines = ["# Credits", "", "| file | title | source | licence | credit line |", "|---|---|---|---|---|"]
    lines += [f"| {k['file']} | [{k['title']}]({k['page']}) | {k['source']} | {k['licence']} | {k['attribution'] or 'not required'} |" for k in credits]
    open(os.path.join(to, "CREDITS.md"), "w").write("\n".join(lines) + "\n")

{"search": search, "get": fetch}[sys.argv[1]]()
