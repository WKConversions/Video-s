# Anonymises Karl's platform screenshots for the explainer: every sensitive word (from tesseract's word boxes, 2x upscaled)
# is painted over in its own background colour and re-set in Inter at the original's size, weight, colour and baseline; the WKC
# logo becomes a neutral "nova" wordmark and the "K" avatar an "S". The settings screen (API key, workspace ID) is left out.
#   python3 anonymize.py <screens folder> <ocr folder> <out folder>   -> out/NN.png (01..36 in the order Karl took them)
import csv, glob, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OCR, OUT = sys.argv[1:4]
FONT = {400: "/usr/share/fonts/opentype/inter/Inter-Regular.otf", 500: "/usr/share/fonts/opentype/inter/Inter-Medium.otf",
        600: "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf", 700: "/usr/share/fonts/opentype/inter/Inter-Bold.otf"}
SKIP = {"034419"}  # settings: never used in the film
EMAIL = "sam@novastudio.com"
RULES = [(re.compile(r"[\w.\-]*@wkconversions\.com", re.I), EMAIL), (re.compile(r"wkconversions\.com", re.I), "novastudio.com"),
         (re.compile(r"WKConversions|Wkconversions", re.I), "Nova"), (re.compile(r"W[KI]{1,2}[CG](?=\W|$|'s|’s)"), "Nova"),
         (re.compile(r"Karl"), "Sam"), (re.compile(r"Kessel"), "Dijk"), (re.compile(r"Raphael"), "Daniel"),
         (re.compile(r"Unicorn"), "Harbor"), (re.compile(r"M[aá]laga"), "Lisbon"), (re.compile(r"UFM"), "HFL"), (re.compile(r"Bingo"), "Night")]

def font(w, size): return ImageFont.truetype(FONT[w], max(6, int(round(size))))

def replace(text, prev):
    out = text
    for rx, rep in RULES: out = rx.sub(rep, out)
    if re.fullmatch(r"Wind[,.;:]?", text) and prev in ("Raphael", "Daniel"): out = text.replace("Wind", "Bos")
    return out if out != text else None

def ring_color(A, x0, y0, x1, y1, pad=3):
    H, W = A.shape[:2]; xa, ya, xb, yb = max(0, x0 - pad), max(0, y0 - pad), min(W - 1, x1 + pad), min(H - 1, y1 + pad)
    ring = np.concatenate([A[ya, xa:xb], A[yb, xa:xb], A[ya:yb, xa], A[ya:yb, xb]])
    return tuple(int(v) for v in np.median(ring, axis=0))

def ink(A, box, bg):
    x0, y0, x1, y1 = box; reg = A[y0:y1, x0:x1].astype(int); d = np.abs(reg - np.array(bg)).sum(axis=2)
    return reg, d

def patch(im, A, box, old, new):
    x0, y0, x1, y1 = box; bg = ring_color(A, x0, y0, x1, y1)
    reg, d = ink(A, box, bg)
    if d.max() < 60: return False
    dark = reg[d > d.max() * 0.6]; col = tuple(int(v) for v in np.median(dark, axis=0))
    cover = (d / max(1, d.max())).sum() / max(1, (x1 - x0))          # ink per column, to pick the weight
    best = None
    for w in FONT:
        f = font(w, 100); bb = f.getbbox(old, anchor="ls"); h = bb[3] - bb[1]
        if h <= 0: continue
        size = 100 * (y1 - y0) / h; f2 = font(w, size); bb2 = f2.getbbox(old, anchor="ls")
        tmp = Image.new("L", (bb2[2] - bb2[0] + 4, bb2[3] - bb2[1] + 4), 0); ImageDraw.Draw(tmp).text((2 - bb2[0], 2 - bb2[1]), old, font=f2, fill=255, anchor="ls")
        c = np.array(tmp).astype(float).sum() / 255 / max(1, tmp.width - 4)
        score = abs(c - cover) + 0.02 * abs((bb2[2] - bb2[0]) - (x1 - x0))
        if best is None or score < best[0]: best = (score, w, size, bb2)
    _, w, size, bb2 = best; f2 = font(w, size)
    base_y = y0 - bb2[1]; nb = f2.getbbox(new, anchor="ls"); nw = nb[2] - nb[0]
    dr = ImageDraw.Draw(im); dr.rectangle([x0 - 2, y0 - 2, max(x1, x0 + nw) + 2, y1 + 2], fill=bg)
    room = (x1 - x0) * 1.12 + size * 0.25
    if nw > room:   # squeeze slightly rather than run into the next word
        tmp = Image.new("RGBA", (nw + 6, nb[3] - nb[1] + 6), bg + (0,)); ImageDraw.Draw(tmp).text((3 - nb[0], 3 - nb[1]), new, font=f2, fill=col + (255,), anchor="ls")
        tmp = tmp.resize((int(room) + 6, tmp.height), Image.LANCZOS); im.alpha_composite(tmp, (x0 + nb[0] - 3, y0 - 3)) if im.mode == "RGBA" else im.paste(tmp, (x0 + nb[0] - 3, y0 - 3), tmp)
    else:
        dr.text((x0 - bb2[0] + nb[0], base_y), new, font=f2, fill=col, anchor="ls")
    return True

def logo_and_avatar(im, A):
    G = A.mean(axis=2); dr = ImageDraw.Draw(im)
    reg = G[5:65, 600:900]; ys, xs = np.where(reg < 110)
    if len(xs):
        x0, y0, x1, y1 = 600 + xs.min(), 5 + ys.min(), 600 + xs.max(), 5 + ys.max(); bg = ring_color(A, x0, y0, x1, y1, 5)
        dr.rectangle([x0 - 4, y0 - 4, x1 + 4, y1 + 4], fill=bg); f = font(700, (y1 - y0) * 1.05)
        bb = f.getbbox("nova", anchor="ls"); dr.text((x0 - bb[0], y0 + (y1 - y0) * 0.86), "nova", font=f, fill=(20, 22, 26), anchor="ls")
    reg = G[5:65, 1798:1880]; ys, xs = np.where(reg < 60)
    if len(xs):
        x0, y0, x1, y1 = 1798 + xs.min(), 5 + ys.min(), 1798 + xs.max(), 5 + ys.max(); d = max(x1 - x0, y1 - y0); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        bg = ring_color(A, int(cx - d / 2), int(cy - d / 2), int(cx + d / 2), int(cy + d / 2), 4)
        sub = A[y0:y1 + 1, x0:x1 + 1].reshape(-1, 3); cc = tuple(int(v) for v in np.median(sub[sub.sum(axis=1) < 180], axis=0))
        dr.rectangle([cx - d / 2 - 2, cy - d / 2 - 2, cx + d / 2 + 2, cy + d / 2 + 2], fill=bg); dr.ellipse([cx - d / 2, cy - d / 2, cx + d / 2, cy + d / 2], fill=cc)
        f = font(600, d * 0.46); dr.text((cx, cy + d * 0.02), "S", font=f, fill=(255, 255, 255), anchor="mm")

def main():
    os.makedirs(OUT, exist_ok=True); report = []
    files = sorted(glob.glob(os.path.join(SRC, "*.png")))
    for i, f in enumerate(files, 1):
        key = os.path.basename(f)[-10:-4]
        if key in SKIP: continue
        im = Image.open(f).convert("RGB"); A = np.array(im); n = 0
        rows = [r for r in csv.DictReader(open(os.path.join(OCR, key + ".tsv")), delimiter="\t", quoting=csv.QUOTE_NONE) if (r.get("text") or "").strip()]
        lines = {}
        for r in rows: lines.setdefault((r["block_num"], r["par_num"], r["line_num"]), []).append(r)
        for ws in lines.values():
            texts = [w["text"].strip() for w in ws]; reps = []
            for j, t in enumerate(texts): reps.append(replace(t, texts[j - 1] if j else ""))
            idx = [j for j, r in enumerate(reps) if r]
            if not idx: continue
            # group sensitive words that are at most 3 words apart into one span
            spans = [[idx[0], idx[0]]]
            for j in idx[1:]:
                if j - spans[-1][1] <= 3: spans[-1][1] = j
                else: spans.append([j, j])
            for a, b in spans:
                bx = [tuple(int(ws[j][k]) // 2 for k in ("left", "top", "width", "height")) for j in range(a, b + 1)]
                x0 = min(v[0] for v in bx); y0 = min(v[1] for v in bx); x1 = max(v[0] + v[2] for v in bx); y1 = max(v[1] + v[3] for v in bx)
                old_t = " ".join(texts[a:b + 1]); new_t = " ".join(reps[j] or texts[j] for j in range(a, b + 1))
                if patch(im, A, (x0, y0, x1, y1), old_t, new_t): n += 1; report.append(f"{i:02d} {key} {old_t} -> {new_t}")
        logo_and_avatar(im, A); im.save(os.path.join(OUT, f"{i:02d}.png")); print(f"{i:02d} {key}: {n} words")
    open(os.path.join(OUT, "_report.txt"), "w").write("\n".join(report))

if __name__ == "__main__": main()
