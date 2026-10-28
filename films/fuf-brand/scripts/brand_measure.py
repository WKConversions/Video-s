# Brand colours by measurement, not by eye (seen colours drift toward familiar defaults by a ΔE of 10+).
#   python3 brand_measure.py measure site.png logo.png --out brand.json [--k 8]
#       -> the palette of each image (hex, share of the image), and the roles it suggests: background,
#          text, accent; brand.json keeps them with the measurement settings
#   python3 brand_measure.py verify out/test/f*.png --brand brand.json [--tolerance 12]
#       -> for each frame, how much of it is drawn in colours the brand doesn't have (ΔE2000 above the
#          tolerance from every brand colour), which colours those are, and whether the accent appears
#   python3 brand_measure.py contrast "#121212/#F6F4F1" "#FFFFFF/#BD1717" ...
#       -> the WCAG contrast ratio of each text/background pair (4.5:1 body text, 3:1 large type and UI)
# Photos in a frame are off-palette by nature: read the report with the frame beside it. Needs numpy,
# OpenCV, Pillow.
import json, sys
import numpy as np

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

def load(path, w=480):
    from PIL import Image
    im = Image.open(path).convert("RGBA")
    im.thumbnail((w, w))
    a = np.asarray(im).astype(np.float32)
    rgb, alpha = a[..., :3].reshape(-1, 3), a[..., 3].reshape(-1)
    return rgb[alpha > 200]                      # transparent pixels (a logo's background) don't count

def srgb_to_lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T
    xyz /= np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[:, 1] - 16, 500 * (f[:, 0] - f[:, 1]), 200 * (f[:, 1] - f[:, 2])], 1)

def de2000(a, b):
    """CIEDE2000 between Lab rows a (n,3) and b (m,3) -> (n,m)."""
    L1, a1, b1 = [a[:, i][:, None] for i in range(3)]
    L2, a2, b2 = [b[:, i][None, :] for i in range(3)]
    C1, C2 = np.hypot(a1, b1), np.hypot(a2, b2); Cb = (C1 + C2) / 2
    G = 0.5 * (1 - np.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p, h2p = np.degrees(np.arctan2(b1, a1p)) % 360, np.degrees(np.arctan2(b2, a2p)) % 360
    dL, dC = L2 - L1, C2p - C1p
    dh = h2p - h1p; dh = np.where(dh > 180, dh - 360, np.where(dh < -180, dh + 360, dh)); dh = np.where(C1p * C2p == 0, 0, dh)
    dH = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lbp, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    hs = h1p + h2p
    hbp = np.where(C1p * C2p == 0, hs, np.where(np.abs(h1p - h2p) <= 180, hs / 2, np.where(hs < 360, (hs + 360) / 2, (hs - 360) / 2)))
    T = 1 - 0.17 * np.cos(np.radians(hbp - 30)) + 0.24 * np.cos(np.radians(2 * hbp)) + 0.32 * np.cos(np.radians(3 * hbp + 6)) - 0.20 * np.cos(np.radians(4 * hbp - 63))
    Sl = 1 + 0.015 * (Lbp - 50) ** 2 / np.sqrt(20 + (Lbp - 50) ** 2); Sc = 1 + 0.045 * Cbp; Sh = 1 + 0.015 * Cbp * T
    Rt = -2 * np.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) * np.sin(np.radians(60 * np.exp(-(((hbp - 275) / 25) ** 2))))
    return np.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh))

def palette(px, k):
    import cv2
    lab = srgb_to_lab(px).astype(np.float32)
    k = min(k, max(1, len(np.unique(px.astype(np.uint8), axis=0))))
    _, lbl, cen = cv2.kmeans(lab, k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5), 4, cv2.KMEANS_PP_CENTERS)
    lbl = lbl.ravel(); out = []
    for i in range(k):
        sel = px[lbl == i]
        if not len(sel): continue
        rgb = np.median(sel, axis=0)             # the median pixel, not the centroid: a real colour of the image
        out.append({"hex": "#%02X%02X%02X" % tuple(int(round(v)) for v in rgb), "share": round(float((lbl == i).mean()), 4),
                    "lab": [round(float(v), 2) for v in srgb_to_lab(rgb[None])[0]]})
    return sorted(out, key=lambda c: -c["share"])

def lum(hexs):
    c = np.array([int(hexs[i:i + 2], 16) for i in (1, 3, 5)]) / 255
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(fg, bg):
    a, b = sorted([lum(fg), lum(bg)], reverse=True)
    return (a + 0.05) / (b + 0.05)

def roles(pal):
    chroma = lambda c: float(np.hypot(c["lab"][1], c["lab"][2]))
    bg = max(pal[:3], key=lambda c: c["share"] * (1 if chroma(c) < 12 else 0.3))
    text = max((c for c in pal if c is not bg), key=lambda c: ratio(c["hex"], bg["hex"]), default=bg)
    acc = [c for c in pal if chroma(c) > 25 and c["share"] > 0.003]
    return {"background": bg["hex"], "text": text["hex"], "accent": max(acc, key=chroma)["hex"] if acc else None}

def main():
    mode = sys.argv[1]
    files = [a for a in sys.argv[2:] if not a.startswith("--") and sys.argv[sys.argv.index(a) - 1] not in ("--out", "--k", "--brand", "--tolerance")]
    if mode == "measure":
        k = int(arg("--k", 8)); res = {"measurement": {"method": "k-means in CIELAB, median pixel per cluster", "k": k}, "images": {}}
        allp = []
        for f in files:
            pal = palette(load(f), k); res["images"][f] = {"palette": pal, "roles": roles(pal)}; allp += pal
            print(f"{f}: " + "  ".join(f"{c['hex']} {c['share'] * 100:.1f}%" for c in pal) + f"   roles {roles(pal)}")
        res["palette"] = [{"hex": c["hex"], "lab": c["lab"]} for c in allp if c["share"] > 0.002]
        if arg("--out"): json.dump(res, open(arg("--out"), "w"), indent=1); print("->", arg("--out"))
    elif mode == "verify":
        brand = json.load(open(arg("--brand"))); tol = float(arg("--tolerance", 12))
        blab = np.array([c["lab"] for c in brand.get("palette", [])] + [srgb_to_lab(np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)]], float))[0] for h in brand.get("tokens", {}).values()])
        accent = brand.get("accent")
        for f in files:
            pal = palette(load(f), 10)
            d = de2000(np.array([c["lab"] for c in pal]), blab).min(axis=1)
            off = [(c, dd) for c, dd in zip(pal, d) if dd > tol]
            share = sum(c["share"] for c, _ in off)
            acc = ""
            if accent:
                da = de2000(np.array([c["lab"] for c in pal]), srgb_to_lab(np.array([[int(accent[i:i + 2], 16) for i in (1, 3, 5)]], float)))[:, 0]
                acc = f"  accent {'present' if (da < tol).any() else 'absent'}"
            flag = "OFF-BRAND" if share > 0.15 else "ok"
            print(f"{flag:9s} {f}: {share * 100:4.1f}% off-palette" + ("" if not off else " (" + ", ".join(f"{c['hex']} {c['share'] * 100:.1f}% ΔE{dd:.0f}" for c, dd in off[:4]) + ")") + acc)
    elif mode == "contrast":
        for pair in files:
            fg, bg = pair.split("/"); r = ratio(fg, bg)
            print(f"{fg} on {bg} = {r:.1f}:1  {'body ok' if r >= 4.5 else 'large type only' if r >= 3 else 'FAILS'}")

main()
