# The movement graph: how much a film moves, through the whole film, as one picture Karl can read at a glance.
#   python3 motion_graph.py film.mp4 movement.png [--words src/words.json] [--marks "4.2:Problem,9.8:Product"]
#                           [--tone calm|confident|energetic] [--title "K.B website film v3"] [--json movement.json]
# Top to bottom:
#   the three motion numbers, the same as motion_check.py: frames where something moves (target 90%+), how much of a
#     typical frame moves (Karl's references: median 3.5%, 0.5–6.6; K.B v3, approved: 1.7), the longest still;
#   a filmstrip on the time axis, so every peak and dip has a picture;
#   how much of the picture moves, frame by frame (the 160×90 measure of motion_check.py, averaged over 0.2 s), with
#     the references' median and K.B v3 as lines, and every hold longer than the tone's limit marked
#     (motion/timing.md: calm 1.2 s, confident or not stated 0.8 s, energetic 0.5 s);
#   how fast the fastest thing on screen moves, in px/s at the film's own size (optical flow, kept only where moving the
#     picture along the flow explains the change, so fades, dissolves and wipes don't count as movement);
#   the voice-over's phrases (--words, as phrase_check.py splits them) and the beats (--marks) as bands and lines.
# The end card (the last 2 s, on films longer than 4 s) is shaded: motion_check.py leaves it out of the moving share
# and the longest still, and so do these numbers; a frozen end card is still marked, since the end card keeps working
# to the last frame (motion/animation-grammar.md).
# Run it on every draft and final (qc.sh does) and send the picture to Karl with the film. About 45 s per minute of
# 1080p film. Needs numpy, opencv-python-headless and Pillow.
import argparse, json, math, os, sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

LIMIT = {"calm": 1.2, "standard": 0.8, "confident": 0.8, "energetic": 0.5}   # longest still by the brief's tone row
# in motion/timing.md: calm, warm, human, premium 1.2 s; confident, clear or not stated 0.8 s; energetic 0.5 s
TARGET = 90                                                   # % of frames that move (evaluation/quality-check.md)
REF_MEDIAN, REF_RANGE, KB_V3 = 3.5, (0.5, 6.6), 1.7           # % of the frame in motion (references/benchmarks.md)

# ---------------------------------------------------------------- measuring
_grid = {}
def fastest(a, b):
    """The fastest movement between two grey frames, in px per frame at their size: the 90th percentile of the optical
    flow over the pixels that changed, keeping only the pixels the flow explains (moving b back along the flow brings it
    at least halfway back to a). A fade, a dissolve or a wipe changes pixels without moving them, so it isn't counted."""
    d0 = cv2.absdiff(a, b)
    changed = d0 > 8
    if changed.sum() < 20: return 0.0
    fl = cv2.calcOpticalFlowFarneback(a, b, None, 0.5, 5, 21, 4, 7, 1.5, 0)
    h, w = a.shape
    if (h, w) not in _grid: _grid[(h, w)] = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    gx, gy = _grid[(h, w)]
    back = cv2.remap(b, gx + fl[..., 0], gy + fl[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    near = cv2.dilate(changed.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    ok = near & (cv2.absdiff(back, a).astype(np.float32) < 0.5 * np.maximum(d0.astype(np.float32), 8))
    if ok.sum() < 20: return 0.0
    return float(np.percentile(np.hypot(fl[..., 0], fl[..., 1])[ok], 90))

def measure(path):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened(): sys.exit(f"can't open {path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    amount, speed, thumbs, recent = [], [], [], []
    prev = None; n = 0; size = None
    every = max(1, round(fps / 2))                               # two filmstrip candidates a second
    while True:
        ok, fr = cap.read()
        if not ok: break
        H, W = fr.shape[:2]; size = (W, H)
        g = cv2.cvtColor(cv2.resize(fr, (160, 90), interpolation=cv2.INTER_LINEAR), cv2.COLOR_BGR2GRAY).astype(np.float32)
        k = 320 / max(W, H); fw, fh = max(32, round(W * k)), max(32, round(H * k))
        f = cv2.cvtColor(cv2.resize(fr, (fw, fh), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
        if prev is not None:
            amount.append(float((np.abs(g - prev) > 6).mean()))   # motion_check.py's measure, unchanged
            v = fastest(recent[-1], f)
            if v == 0.0 and len(recent) >= 3: v = fastest(recent[-3], f) / 3   # a slow drift moves too little in one frame
            speed.append(v * (W / fw) * fps)                      # px/s at the film's size
        if n % every == 0:
            t = 360 / max(W, H)
            thumbs.append((n / fps, cv2.cvtColor(cv2.resize(fr, (round(W * t), round(H * t)), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)))
        prev = g; recent = (recent + [f])[-3:]; n += 1
    if n < 3: sys.exit(f"{path}: fewer than 3 frames")
    return fps, n, size, np.array(amount), np.array(speed), thumbs

def runs(mask):
    out, i = [], 0
    while i < len(mask):
        if mask[i]:
            j = i
            while j + 1 < len(mask) and mask[j + 1]: j += 1
            out.append((i, j)); i = j + 1
        else: i += 1
    return out

def smooth(x, k):
    if k <= 1 or len(x) < k: return x.copy()
    return np.convolve(np.pad(x, (k // 2, k - 1 - k // 2), mode="edge"), np.ones(k) / k, mode="valid")

def median5(x):
    """A rolling median over 5 frames: a slow drift's sub-pixel flicker settles, a lurch keeps its walls."""
    if len(x) < 5: return x.copy()
    p = np.pad(x, 2, mode="edge"); return np.median(np.stack([p[k:len(p) - 4 + k] for k in range(5)]), axis=0)

# ---------------------------------------------------------------- drawing
S = 2                                                          # drawn at twice the size, then scaled down: smooth lines
SURF, INK, INK2, MUTED = (252, 252, 251), (11, 11, 11), (82, 81, 78), (128, 127, 122)
GRID, RULE, BLUE = (233, 232, 228), (150, 149, 144), (42, 120, 214)
BAND, ENDBAND, CRIT, GOOD = (243, 242, 239), (236, 235, 231), (208, 59, 59), (12, 163, 12)

def font_path(weight):
    names = {"regular": ["Inter-Regular.otf", "Inter-Regular.ttf", "Arial.ttf", "arial.ttf", "Helvetica.ttc", "DejaVuSans.ttf", "LiberationSans-Regular.ttf"],
             "semibold": ["Inter-SemiBold.otf", "Inter-SemiBold.ttf", "Arial Bold.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf"],
             "bold": ["InterDisplay-Bold.otf", "Inter-Bold.otf", "Inter-Bold.ttf", "Arial Bold.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf"]}[weight]
    dirs = ["/usr/share/fonts", "/usr/local/share/fonts", os.path.expanduser("~/.fonts"), os.path.expanduser("~/Library/Fonts"),
            "/Library/Fonts", "/System/Library/Fonts", "/System/Library/Fonts/Supplemental", "C:/Windows/Fonts"]
    try:
        import matplotlib; dirs.append(os.path.join(os.path.dirname(matplotlib.__file__), "mpl-data", "fonts", "ttf"))
    except Exception: pass
    for name in names:
        for d in dirs:
            if not os.path.isdir(d): continue
            for root, _, files in os.walk(d):
                if name in files: return os.path.join(root, name)
    return None

_fonts = {}
def F(size, weight="regular"):
    key = (size, weight)
    if key not in _fonts:
        p = font_path(weight)
        try: _fonts[key] = ImageFont.truetype(p, size * S) if p else ImageFont.load_default(size * S)
        except Exception: _fonts[key] = ImageFont.load_default()
    return _fonts[key]

class Canvas:
    def __init__(self, w, h):
        self.w, self.h = w, h; self.im = Image.new("RGBA", (w * S, h * S), SURF + (255,)); self.d = ImageDraw.Draw(self.im)
    def s(self, *v): return [round(x * S) for x in v]
    def rect(self, x0, y0, x1, y1, fill, alpha=255):
        if alpha == 255: self.d.rectangle(self.s(x0, y0, x1, y1), fill=fill); return
        layer = Image.new("RGBA", self.im.size, (0, 0, 0, 0)); ImageDraw.Draw(layer).rectangle(self.s(x0, y0, x1, y1), fill=fill + (alpha,))
        self.im.alpha_composite(layer)
    def poly(self, pts, fill, alpha=255):
        layer = Image.new("RGBA", self.im.size, (0, 0, 0, 0))
        ImageDraw.Draw(layer).polygon([(round(x * S), round(y * S)) for x, y in pts], fill=fill + (alpha,)); self.im.alpha_composite(layer)
    def line(self, pts, fill, width=1):
        self.d.line([(x * S, y * S) for x, y in pts], fill=fill, width=max(1, round(width * S)), joint="curve")
    def text(self, x, y, s, size=20, weight="regular", fill=INK, anchor="la", halo=False):
        f = F(size, weight)
        if halo:
            b = self.d.textbbox((x * S, y * S), s, font=f, anchor=anchor); pad = 5 * S
            self.d.rounded_rectangle((b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad), radius=4 * S, fill=SURF)
        self.d.text((x * S, y * S), s, font=f, fill=fill, anchor=anchor)
    def tw(self, s, size=20, weight="regular"): return self.d.textlength(s, font=F(size, weight)) / S
    def dot(self, x, y, r, fill):
        self.d.ellipse(self.s(x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=SURF)       # a surface ring
        self.d.ellipse(self.s(x - r, y - r, x + r, y + r), fill=fill)
    def status(self, x, y, good):
        r = 13; self.d.ellipse(self.s(x - r, y - r, x + r, y + r), fill=GOOD if good else CRIT)
        if good: self.line([(x - 6, y + 0.5), (x - 1.5, y + 5), (x + 6.5, y - 5)], (255, 255, 255), 3)
        else: self.line([(x - 5, y - 5), (x + 5, y + 5)], (255, 255, 255), 3); self.line([(x - 5, y + 5), (x + 5, y - 5)], (255, 255, 255), 3)
    def save(self, path):
        self.im.convert("RGB").resize((self.w, self.h), Image.LANCZOS).save(path, optimize=True)

def nice_step(span, target):
    raw = span / max(1, target); mag = 10 ** math.floor(math.log10(raw))
    for m in (1, 2, 2.5, 5, 10):
        if m * mag >= raw: return m * mag
    return 10 * mag

def fmt_int(v): return f"{v:,.0f}"

# ---------------------------------------------------------------- the picture
def draw(path, out, fps, n, size, amount, speed, thumbs, a):
    W0, H0 = size; dur = n / fps; limit = LIMIT[a.tone]
    t = (np.arange(len(amount)) + 1) / fps                       # the change into frame i+1
    cut = int(2 * fps) if len(amount) > 4 * fps else 0
    body = amount[:len(amount) - cut]
    moving = 100 * (1 - (body < 0.001).mean())
    typical = 100 * float(np.median(amount))
    still_runs = runs(amount < 0.001)
    longest = max([(j - i + 1) / fps for i, j in runs(body < 0.001)] or [0.0])
    long_holds = [(i, j) for i, j in still_runs if (j - i + 1) / fps > limit]

    CW, ML, MR = 2400, 150, 64; PW = CW - ML - MR
    X = lambda sec: ML + PW * min(max(sec, 0), dur) / dur
    # the filmstrip: as many frames as fit at a readable size, each taken from the middle of its slot
    tw_target = 150 if W0 >= H0 else 92
    ncol = max(6, round(PW / tw_target)); th_w = PW / ncol; th_h = th_w * H0 / W0
    phrases = []
    if a.words:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from phrase_check import phrases as split
        phrases = split(json.load(open(a.words)))
    marks = []
    for m in [x for x in (a.marks or "").split(",") if x.strip()]:
        sec, _, label = m.partition(":"); marks.append((float(sec), label.strip()))

    Y = {"title": 44, "sub": 96, "stats": 150}; y = 330
    Y["l1t"] = y; y += 22                                       # lane title, then its filmstrip, then the plot
    Y["strip"] = y; y += th_h + 8
    Y["marks"] = y; y += 34 if marks else 10
    Y["l1"] = (y, y + 390); y += 390
    Y["still"] = (y + 8, y + 26); y += 44
    Y["l2t"] = y + 24; y += 56; Y["l2"] = (y, y + 230); y += 230
    Y["axis"] = y + 10; y += 56
    Y["foot"] = y + 6; y += 70
    c = Canvas(CW, int(y))

    # header
    c.text(ML, Y["title"], a.title or "Movement through the film", 46, "bold", anchor="ls")
    c.text(ML, Y["sub"], f"{os.path.basename(path)}  ·  {dur:.1f} s  ·  {W0}×{H0}  ·  {fps:g} fps  ·  {a.tone} tone", 22, fill=INK2, anchor="ls")
    blocks = [("Something moves in", f"{moving:.0f}% of frames", f"target {TARGET}% or more", moving >= TARGET),
              ("A typical frame moves", f"{typical:.1f}% of the picture",
               f"Karl's references: median {REF_MEDIAN}% ({REF_RANGE[0]}–{REF_RANGE[1]}) · K.B v3, approved: {KB_V3}%", None),
              ("Longest still", f"{longest:.2f} s", f"limit {limit} s for a {a.tone} film", longest <= limit)]
    bw = PW / 3
    for k, (label, value, note, ok) in enumerate(blocks):
        x = ML + k * bw
        c.text(x, Y["stats"], label, 22, fill=INK2, anchor="lt")
        c.text(x, Y["stats"] + 36, value, 50, "semibold", anchor="lt")
        if ok is not None:
            vx = x + c.tw(value, 50, "semibold") + 30
            c.status(vx, Y["stats"] + 64, ok)
            c.text(vx + 22, Y["stats"] + 64, "on target" if ok else ("below target" if k == 0 else "too long"), 21, fill=INK2, anchor="lm")
        c.text(x, Y["stats"] + 112, note, 19, fill=MUTED, anchor="lt")

    # filmstrip
    for k in range(ncol):
        sec = (k + 0.5) * dur / ncol
        _, img = min(thumbs, key=lambda p: abs(p[0] - sec))
        im = Image.fromarray(img).resize((max(1, round((th_w - 3) * S)), max(1, round(th_h * S))), Image.LANCZOS)
        c.im.paste(im, (round((ML + k * th_w + 1.5) * S), round(Y["strip"] * S)))

    # time gridlines shared by both lanes
    step = nice_step(dur, 14) if dur > 2 else 0.5
    ticks = [k * step for k in range(int(dur / step) + 1)]
    for lane in ("l1", "l2"):
        y0, y1 = Y[lane]
        for sec in ticks: c.line([(X(sec), y0), (X(sec), y1)], GRID, 1)

    # lane 1: how much of the picture moves
    y0, y1 = Y["l1"]
    c.text(ML, Y["l1t"], "How much of the picture moves", 26, "semibold", anchor="ls")
    c.text(ML + c.tw("How much of the picture moves", 26, "semibold") + 14, Y["l1t"],
           "share of the frame that changes from one frame to the next, averaged over 0.2 s", 19, fill=MUTED, anchor="ls")
    for k, (p0, p1, _) in enumerate(phrases):
        if k % 2 == 0: c.rect(X(p0), y0, X(p1), y1, BAND)
    if cut:
        c.rect(X(dur - 2), y0, X(dur), y1, ENDBAND)
        c.text(X(dur) - 10, y0 + 40, "end card: not in the numbers", 17, fill=MUTED, anchor="rt")
    for i, j in long_holds:
        c.rect(X(t[i] - 1 / fps), y0, X(t[j]), y1, CRIT, 26)
    sm = 100 * smooth(amount, max(1, round(0.2 * fps)))
    top = max(5.0, 1.15 * float(np.percentile(sm, 97)))
    st = nice_step(top, 4); top = st * math.ceil(top / st)
    Yv = lambda v: y1 - (y1 - y0) * min(v, top) / top
    for k in range(int(round(top / st)) + 1):
        v = k * st; c.line([(ML, Yv(v)), (ML + PW, Yv(v))], GRID, 1)
        c.text(ML - 14, Yv(v), f"{v:g}%", 19, fill=INK2, anchor="rm")
    for v, label in ((REF_MEDIAN, f"Karl's references, median {REF_MEDIAN}%"), (KB_V3, f"K.B v3, approved {KB_V3}%")):
        if v < top:                                              # labelled at the right: the end card is usually calm
            c.line([(ML, Yv(v)), (ML + PW, Yv(v))], RULE, 1.5)
            c.text(ML + PW - 12, Yv(v) - 6, label, 17, fill=INK2, anchor="rb", halo=True)
    pts = [(X(tt), Yv(v)) for tt, v in zip(t, sm)]
    c.poly([(X(t[0]), y1)] + pts + [(X(t[-1]), y1)], BLUE, 30)
    c.line(pts, BLUE, 2)
    # peaks cut off by the scale: label the biggest few, never two on top of each other
    over = [i for i in range(1, len(sm) - 1) if sm[i] > top and sm[i] >= sm[i - 1] and sm[i] >= sm[i + 1]]
    placed = []
    for i in sorted(over, key=lambda i: -sm[i]):
        x = X(t[i])
        if any(abs(x - p) < 90 for p in placed) or len(placed) >= 6: continue
        placed.append(x); c.text(x, y0 + 4, f"↑ {sm[i]:.0f}%", 17, "semibold", fill=INK2, anchor="mt", halo=True)
    c.line([(ML, y1), (ML + PW, y1)], RULE, 1)

    # the still row: every frame where nothing moves, and the holds that are too long
    s0, s1 = Y["still"]
    c.text(ML - 14, (s0 + s1) / 2, "still", 19, fill=INK2, anchor="rm")
    c.rect(ML, s0, ML + PW, s1, BAND)
    for i, j in still_runs:
        c.rect(X(t[i] - 1 / fps), s0, max(X(t[j]), X(t[i] - 1 / fps) + 1.2), s1, MUTED)
    for i, j in long_holds:
        xa, xb = X(t[i] - 1 / fps), X(t[j]); c.rect(xa, s0, xb, s1, CRIT)
        end = t[j] > dur - 2 and cut
        c.text((xa + xb) / 2, y1 - 30, f"still {(j - i + 1) / fps:.1f} s" + (" (end card)" if end else ""), 18, "semibold", anchor="mb", halo=True)

    # lane 2: how fast the fastest thing moves (log scale)
    y0, y1 = Y["l2"]
    title2 = "How fast the fastest thing moves"
    c.text(ML, Y["l2t"], title2, 26, "semibold", anchor="ls")
    c.text(ML + c.tw(title2, 26, "semibold") + 14, Y["l2t"],
           f"px per second at {W0}×{H0}; fades, dissolves and wipes don't count as movement", 19, fill=MUTED, anchor="ls")
    for k, (p0, p1, _) in enumerate(phrases):
        if k % 2 == 0: c.rect(X(p0), y0, X(p1), y1, BAND)
    sp = median5(speed)
    lo = 3.0; hi = 10 ** max(3, math.ceil(math.log10(max(float(np.percentile(sp, 99.5)), 1.0))))
    Ys = lambda v: y1 - (y1 - y0) * (math.log10(min(max(v, lo), hi)) - math.log10(lo)) / (math.log10(hi) - math.log10(lo))
    v = 10
    while v <= hi:
        c.line([(ML, Ys(v)), (ML + PW, Ys(v))], GRID, 1); c.text(ML - 14, Ys(v), fmt_int(v), 19, fill=INK2, anchor="rm"); v *= 10
    pts = [(X(tt), Ys(v)) for tt, v in zip(t, sp)]
    c.poly([(X(t[0]), y1)] + pts + [(X(t[-1]), y1)], BLUE, 30)
    c.line(pts, BLUE, 2)
    if sp.max() > lo:
        i = int(np.argmax(sp)); x, yy = X(t[i]), Ys(sp[i]); c.dot(x, yy, 5, BLUE)
        label = f"fastest {fmt_int(sp[i])} px/s at {t[i]:.1f} s"
        c.text(min(max(x, ML + c.tw(label, 18, 'semibold') / 2 + 4), ML + PW - c.tw(label, 18, 'semibold') / 2 - 4), max(yy - 12, y0 + 22),
               label, 18, "semibold", fill=INK, anchor="mb", halo=True)
    c.line([(ML, y1), (ML + PW, y1)], RULE, 1)

    # phrase numbers and beat marks
    if phrases:
        y0 = Y["l1"][0]
        for k, (p0, p1, _) in enumerate(phrases):
            if X(p1) - X(p0) >= 26: c.text((X(p0) + X(p1)) / 2, y0 + 10, str(k + 1), 15, fill=MUTED, anchor="mt")
    for sec, label in marks:
        x = X(sec)
        for y0, y1 in (Y["l1"], Y["l2"]): c.line([(x, y0), (x, y1)], (160, 159, 154), 1.5)
        c.line([(x, Y["marks"] + 4), (x, Y["l1"][0])], (160, 159, 154), 1.5)
        if label: c.text(x + 6, Y["marks"] + 24, label, 18, "semibold", fill=INK, anchor="ls")

    # time axis and footer
    for sec in ticks:
        c.line([(X(sec), Y["l2"][1]), (X(sec), Y["l2"][1] + 8)], RULE, 1)
        c.text(X(sec), Y["axis"] + 10, f"{sec:g} s", 19, fill=INK2, anchor="mt")
    foot = ("Measured on the encode by scripts/motion_graph.py. The numbers match motion_check.py"
            + ("; the end card (last 2 s) is left out of the moving share and the longest still." if cut else ".")
            + f" Red: a hold longer than {limit} s." + ("  Bands: the voice-over's phrases." if phrases else ""))
    c.text(ML, Y["foot"] + 24, foot, 18, fill=MUTED, anchor="ls")
    c.save(out)
    return dict(moving=moving, typical=typical, longest=longest, holds=[(round(t[i] - 1 / fps, 2), round(t[j], 2)) for i, j in long_holds])

def main():
    ap = argparse.ArgumentParser(description="The movement graph of a film.")
    ap.add_argument("video"); ap.add_argument("out", nargs="?", default="movement.png")
    ap.add_argument("--words", help="words.json of the voice-over: phrases drawn as bands")
    ap.add_argument("--marks", help='beats as "seconds:label,..." (labels optional)')
    ap.add_argument("--tone", default="confident", choices=list(LIMIT))
    ap.add_argument("--title"); ap.add_argument("--json", help="also write the measurements here")
    a = ap.parse_args()
    fps, n, size, amount, speed, thumbs = measure(a.video)
    r = draw(a.video, a.out, fps, n, size, amount, speed, thumbs, a)
    print(f"moving in {r['moving']:.0f}% of frames (target {TARGET}+), median {r['typical']:.1f}% of the frame in motion, "
          f"longest still {r['longest']:.2f} s (limit {LIMIT[a.tone]} s, {a.tone})"
          + (f"; holds over the limit at " + ", ".join(f"{x0:.1f}–{x1:.1f} s" for x0, x1 in r["holds"]) if r["holds"] else "")
          + f"\nwrote {a.out}")
    if a.json:
        json.dump({"fps": fps, "frames": n, "size": size, "tone": a.tone, **r,
                   "amount": [round(v, 5) for v in amount.tolist()], "speed_px_s": [round(v, 1) for v in speed.tolist()]}, open(a.json, "w"))

if __name__ == "__main__":
    main()
