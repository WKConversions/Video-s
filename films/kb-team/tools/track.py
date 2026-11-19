#!/usr/bin/env python3
# Measures the reference's animation so it can be copied frame by frame. Run from films/kb-team.
# Every number is in K.B FILM PIXELS (1920x1080): the reference's 1280x720 frames x 1.5. Frames are numbered from 0.
#
#   python3 -I tools/track.py boxes A B [--step 1] [--max 6] [--join 14] [--thr 18] [--sheet out.png]
#       Every frame: the ground colour, how much of the frame is covered, and the boxes of what stands on the ground
#       (x y w h, largest first, with the box's own colour and how solid it is: 1.00 = a filled block, 0.2 = text).
#       --join N merges things closer than N px (letters into a line; raise it to get one box for a paragraph, lower
#       it to separate neighbours). --sheet draws the numbered boxes on the frames.
#   python3 -I tools/track.py follow A B x y [--join 14] [--thr 18] [--ts]
#       One element through time: start from the box under the point (x, y) in frame A and follow it to frame B.
#       Prints frame, x, y, w, h, centre; --ts prints it as a keyframe list for kf() in the kit.
#   python3 -I tools/track.py cam A B [--region x,y,w,h]
#       A picture that moves as a whole (a zoom, a pan, a filmed shot, a screen that fills the frame): scale and shift
#       of every frame against frame A (scale 1.10 = 10% larger), from tracked points. --region limits the points.
#   python3 -I tools/track.py ink A B
#       Every frame: ground colour and the share of the frame that is covered.
#   python3 -I tools/track.py text A B x y w h
#       A text block inside a box: per frame the height of the lines (so the font size) and where the ink ends on the
#       right (so how far the typing has come). Use a box that contains only that text.
import os, sys
import cv2, numpy as np
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."); REF = os.path.join(ROOT, "reference", "frames720"); K = 1.5

def arg(name, default):
    return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
def frame(n): return cv2.imread(os.path.join(REF, f"f{n:04d}.jpg"))
def hexc(bgr): return "#%02X%02X%02X" % (int(round(bgr[2])), int(round(bgr[1])), int(round(bgr[0])))

def ground(img):
    """the flat ground's colour (BGR), or None when the picture runs to the edges (footage, a full-bleed screen)"""
    b = np.concatenate([img[:10].reshape(-1, 3), img[-10:].reshape(-1, 3), img[:, :10].reshape(-1, 3), img[:, -10:].reshape(-1, 3)]).astype(np.int32)
    q = b // 10; key = q[:, 0] * 10000 + q[:, 1] * 100 + q[:, 2]; vals, cnt = np.unique(key, return_counts=True)
    if cnt.max() < 0.45 * len(key): return None
    return b[key == vals[cnt.argmax()]].mean(0)

def inkmask(img, thr):
    g = ground(img)
    if g is None: return None, np.ones(img.shape[:2], bool)
    return g, np.abs(img.astype(np.int32) - g).max(2) > thr

def boxes_of(img, thr, join, mx, minarea=0.0006):
    g, m = inkmask(img, thr)
    if g is None: return None, 1.0, [(0, 0, 1920, 1080, hexc(img.reshape(-1, 3).mean(0)), 1.0)]
    j = max(1, int(round(join / K))); k = cv2.getStructuringElement(cv2.MORPH_RECT, (2 * j + 1, max(3, j | 1)))
    closed = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, k)
    n, lab, st, _ = cv2.connectedComponentsWithStats(closed, 8); out = []
    for i in range(1, n):
        x, y, w, h, a = st[i]
        if w * h < minarea * m.size: continue
        sel = m[y:y + h, x:x + w] & (lab[y:y + h, x:x + w] == i)
        col = img[y:y + h, x:x + w][sel].mean(0) if sel.any() else img[y:y + h, x:x + w].reshape(-1, 3).mean(0)
        out.append((round(x * K), round(y * K), round(w * K), round(h * K), hexc(col), round(float(sel.sum()) / (w * h), 2)))
    out.sort(key=lambda b: -b[2] * b[3])
    return g, float(m.mean()), out[:mx]

cmd = sys.argv[1]
if cmd in ("boxes", "ink"):
    A, B = int(sys.argv[2]), int(sys.argv[3]); step, mx, join, thr = arg("--step", 1), arg("--max", 6), arg("--join", 14), arg("--thr", 18)
    sheet = arg("--sheet", ""); tiles = []
    for n in range(A, B + 1, step):
        img = frame(n); g, cov, bx = boxes_of(img, thr, join, mx)
        head = f"f{n:4d} {n / 24:6.2f}s  ground {'none (full frame)' if g is None else hexc(g)}  covered {100 * cov:5.1f}%"
        print(head if cmd == "ink" else head + "  " + "  ".join(f"[{k}] {x},{y} {w}x{h} {c} {s:.2f}" for k, (x, y, w, h, c, s) in enumerate(bx)))
        if sheet:
            t = cv2.resize(img, (480, 270), interpolation=cv2.INTER_AREA)
            for k, (x, y, w, h, c, s) in enumerate(bx):
                p0, p1 = (int(x / 4), int(y / 4)), (int((x + w) / 4), int((y + h) / 4)); cv2.rectangle(t, p0, p1, (0, 0, 255), 1); cv2.putText(t, str(k), (p0[0] + 2, p0[1] + 12), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 255), 1)
            cv2.putText(t, f"f{n}", (4, 266), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 0, 0), 1); tiles.append(t)
    if sheet and tiles:
        cols = 4; rows = (len(tiles) + cols - 1) // cols; S = np.full((rows * 274, cols * 484, 3), 255, np.uint8)
        for i, t in enumerate(tiles): S[(i // cols) * 274:(i // cols) * 274 + 270, (i % cols) * 484:(i % cols) * 484 + 480] = t
        cv2.imwrite(sheet, S); print(sheet)
elif cmd == "follow":
    A, B, px, py = int(sys.argv[2]), int(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]); join, thr = arg("--join", 14), arg("--thr", 18)
    rows = []; cx, cy, pw, ph = px, py, None, None
    for n in range(A, B + 1):
        g, cov, bx = boxes_of(frame(n), thr, join, 40, 0.00015)
        if g is None or not bx: rows.append((n, None)); continue
        def cost(b):
            x, y, w, h = b[:4]; inside = x <= cx <= x + w and y <= cy <= y + h
            d = np.hypot(x + w / 2 - cx, y + h / 2 - cy); size = 0 if pw is None else abs(np.log((w * h + 1) / (pw * ph + 1))) * 120
            return d + size - (60 if inside else 0)
        b = min(bx, key=cost); x, y, w, h = b[:4]; cx, cy, pw, ph = x + w / 2, y + h / 2, w, h; rows.append((n, (x, y, w, h, cx, cy, b[4])))
    if "--ts" in sys.argv:
        ok = [(n, r) for n, r in rows if r]
        for name, i in (("cx", 4), ("cy", 5), ("w", 2), ("h", 3)): print(f"const {name}: [number, number][] = [" + ", ".join(f"[{n}, {r[i]:.0f}]" for n, r in ok) + "];")
    else:
        for n, r in rows: print(f"f{n:4d} {n / 24:6.2f}s  " + ("(no flat ground in this frame)" if r is None else f"x {r[0]:5d} y {r[1]:5d} w {r[2]:5d} h {r[3]:5d}   centre {r[4]:7.1f},{r[5]:7.1f}  {r[6]}"))
elif cmd == "cam":
    A, B = int(sys.argv[2]), int(sys.argv[3]); reg = arg("--region", ""); S, dx, dy = 1.0, 0.0, 0.0
    prev = cv2.cvtColor(frame(A), cv2.COLOR_BGR2GRAY); mask = None
    if reg:
        x, y, w, h = [int(float(v) / K) for v in reg.split(",")]; mask = np.zeros(prev.shape, np.uint8); mask[y:y + h, x:x + w] = 255
    print(f"f{A:4d}  scale 1.0000  dx     0.0  dy     0.0   (against f{A})")
    for n in range(A + 1, B + 1):
        cur = cv2.cvtColor(frame(n), cv2.COLOR_BGR2GRAY); note = ""
        p = cv2.goodFeaturesToTrack(prev, 600, 0.01, 8, mask=mask)
        M = None
        if p is not None and len(p) >= 12:
            q, st, err = cv2.calcOpticalFlowPyrLK(prev, cur, p, None, winSize=(31, 31), maxLevel=4); ok = st.ravel() == 1
            if ok.sum() >= 12:
                M, inl = cv2.estimateAffinePartial2D(p[ok], q[ok], method=cv2.RANSAC, ransacReprojThreshold=2.0)
                if M is not None: note = f"{int(inl.sum())}/{int(ok.sum())} points"
        if M is None: print(f"f{n:4d}  (could not follow: a cut or too little texture)"); prev = cur; continue
        s = float(np.hypot(M[0, 0], M[1, 0])); cxp, cyp = 640.0, 360.0
        # the frame centre's shift under this step, then accumulate: scale multiplies, shift adds (scaled into frame A's scale)
        sx = M[0, 0] * cxp + M[0, 1] * cyp + M[0, 2] - cxp; sy = M[1, 0] * cxp + M[1, 1] * cyp + M[1, 2] - cyp
        S *= s; dx += sx * K; dy += sy * K
        print(f"f{n:4d}  scale {S:.4f}  dx {dx:7.1f}  dy {dy:7.1f}   step x{s:.4f} ({note})"); prev = cur
elif cmd == "text":
    A, B = int(sys.argv[2]), int(sys.argv[3]); x, y, w, h = [int(float(v) / K) for v in sys.argv[4:8]]; thr = arg("--thr", 40)
    for n in range(A, B + 1):
        c = frame(n)[y:y + h, x:x + w].astype(np.int32); bg = np.median(c.reshape(-1, 3), 0); m = np.abs(c - bg).max(2) > thr
        rows_ = m.any(1); cols_ = m.any(0)
        if not rows_.any(): print(f"f{n:4d}  (empty)"); continue
        # the lines: runs of rows with ink
        runs, s = [], None
        for i, v in enumerate(list(rows_) + [False]):
            if v and s is None: s = i
            if not v and s is not None: runs.append((s, i)); s = None
        runs = [(a, b) for a, b in runs if b - a >= 3]
        right = int(np.max(np.nonzero(cols_))) if cols_.any() else 0; left = int(np.min(np.nonzero(cols_))) if cols_.any() else 0
        lines = "  ".join(f"line {i + 1}: top {round((y + a) * K)} height {round((b - a) * K)}" for i, (a, b) in enumerate(runs))
        print(f"f{n:4d} {n / 24:6.2f}s  ink from x {round((x + left) * K)} to x {round((x + right) * K)}   {lines}")
else:
    sys.exit("commands: boxes, follow, cam, ink, text (see the head of this file)")
