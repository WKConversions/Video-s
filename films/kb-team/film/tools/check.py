#!/usr/bin/env python3
# Scores a package against the reference, frame for frame, and writes the pair sheets to look at
# (the reference frame above OUR frame at the same moment). Run from films/kb-team/film.
#   python3 -I tools/check.py R05                       render the package small, score every shot, write all sheets
#   python3 -I tools/check.py R05 --from 420 --to 433 --w 480 --cols 4    sheets of a range only, larger tiles
#   python3 -I tools/check.py R05 --no-render           score the last render again (after looking, before editing)
#   python3 -I tools/check.py R05 --no-sheets           scores only
# What it scores, per shot (plan/shots.json), always at the reference's own cadence (24 pictures a second):
#   LAYOUT  where the picture is. On a flat ground: the share of the frame that is covered, in the reference and in
#           ours, and how well the two covered areas overlap (1.00 = the same area). On a full-frame picture: whether
#           ours is full-frame too, and how alike the light-dark composition is (tone, 1.00 = the same).
#   MOTION  the share of the frame that changes from one picture to the next, in the reference and in ours, and how
#           alike the two curves are over the shot (corr, 1.00 = it moves at the same moments, as strongly).
#   STEPS   while the reference is in continuous motion (three or more moving steps in a row): the share of our
#           60 fps frames that repeat the frame before. Motion drawn in steps instead of gliding shows up here. A cut,
#           a flash, a typed letter or a rest is not counted: there, holding is right.
# A shot PASSES when: layout overlap >= 0.60 and cover within x0.7-x1.4 (flat ground) or full-frame with tone >= 0.45;
# motion within x0.55-x1.8 of the reference and corr >= 0.45; under 30% stepping while the reference moves. Filmed shots only
# need to be full-frame. The numbers find the misses; the sheets show what they are. Passing numbers with a picture
# that is not the reference's picture is still a miss.
import glob, json, math, os, shutil, subprocess, sys
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.join(HERE, ".."); ROOT = os.path.join(FILM, "..")
REF = os.path.join(ROOT, "reference", "frames"); SHOTS = json.load(open(os.path.join(ROOT, "plan", "shots.json")))
def arg(name, default): return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
pid = sys.argv[1]; pk = SHOTS[pid]; f0, f1 = pk["f0"], pk["f1"]
film = lambda n: math.ceil(n * 2.5 - 1e-9)          # the film frame on which reference frame n starts (or the first after it)
total = film(f1 + 1) - film(f0)
out = os.path.join(FILM, "out", "chk"); seq = os.path.join(out, pid); os.makedirs(out, exist_ok=True)
# our frame for reference frame n: the first FILM frame at or after the moment the reference frame starts, counted from
# the package's first film frame (the package entry renders exactly the film's frames of this package)
loc = lambda n: min(film(n) - film(f0), total - 1)

if "--no-render" not in sys.argv:
    shutil.rmtree(seq, ignore_errors=True)
    r = subprocess.run(["npx", "remotion", "render", f"src/entry{pid}.tsx", "Pkg", seq, "--sequence", "--image-format=jpeg", "--jpeg-quality=88",
                        "--scale=0.33334", "--concurrency=2", "--log=error"], cwd=FILM, capture_output=True, text=True)
    if len(glob.glob(os.path.join(seq, "*.jpeg"))) < total: sys.exit("RENDER FAILED:\n" + (r.stdout + r.stderr)[-3000:])
files = sorted(glob.glob(os.path.join(seq, "*.jpeg")))
if len(files) < total: sys.exit(f"no render of {pid} yet: run without --no-render")
def ours(i): return cv2.imread(files[i])
def ref(n): return cv2.imread(os.path.join(REF, f"f{n:04d}.jpg"))
def small(img): return cv2.resize(img, (320, 180), interpolation=cv2.INTER_AREA)
def gray(img): return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
def ink(img):
    """(flat ground?, covered mask) of a 320x180 frame"""
    b = np.concatenate([img[:6].reshape(-1, 3), img[-6:].reshape(-1, 3), img[:, :6].reshape(-1, 3), img[:, -6:].reshape(-1, 3)]).astype(np.int32)
    q = b // 12; key = q[:, 0] * 10000 + q[:, 1] * 100 + q[:, 2]; vals, cnt = np.unique(key, return_counts=True)
    if cnt.max() < 0.45 * len(key): return False, np.ones(img.shape[:2], bool)
    bg = b[key == vals[cnt.argmax()]].mean(0); return True, np.abs(img.astype(np.int32) - bg).max(2) > 22
def tone(a, b):
    x = cv2.resize(a, (32, 18), interpolation=cv2.INTER_AREA).ravel(); y = cv2.resize(b, (32, 18), interpolation=cv2.INTER_AREA).ravel()
    return 0.0 if x.std() < 1 or y.std() < 1 else float(np.corrcoef(x, y)[0, 1])
def change(a, b): return float((np.abs(a - b) > 8).mean())

if "--from" not in sys.argv:
    R = {n: small(ref(n)) for n in range(f0, f1 + 1)}; O = {n: small(ours(loc(n))) for n in range(f0, f1 + 1)}
    G60 = [gray(small(ours(i))) for i in range(total)]; same60 = [True] + [float(np.abs(G60[i] - G60[i - 1]).max()) < 6 for i in range(1, total)]
    fails = []; print(f"{pid}  reference f{f0}-f{f1}  ({total} film frames)")
    for name, a, b, kind in pk["shots"]:
        ns = list(range(a, b + 1)); flat = []; iou = []; cr = []; co = []; tn = []; of = []; worst = []
        for n in ns:
            fr_, mr = ink(R[n]); fo_, mo = ink(O[n]); flat.append(fr_); of.append(fo_); cr.append(mr.mean()); co.append(mo.mean())
            tn.append(tone(gray(R[n]), gray(O[n])))
            if fr_ and fo_: iou.append((mr & mo).sum() / max(1, (mr | mo).sum())); worst.append((iou[-1], n))
            elif fr_ != fo_: iou.append(0.0); worst.append((0.0, n))
            else: worst.append((tn[-1], n))
        mref = [change(gray(R[n]), gray(R[n - 1])) for n in ns[1:]]; mour = [change(gray(O[n]), gray(O[n - 1])) for n in ns[1:]]
        mr_, mo_ = (float(np.mean(mref)), float(np.mean(mour))) if mref else (0.0, 0.0)
        corr = float(np.corrcoef(mref, mour)[0, 1]) if len(mref) >= 7 and np.std(mref) > 1e-4 and np.std(mour) > 1e-4 else None
        # stepping: our film frames that repeat the frame before, counted only while the reference itself is moving
        # (continuous motion only: a reference step counts when the steps before and after it move too; a cut, a flash
        #  or a typed letter is one change between two holds, and at 60 fps its picture has to repeat)
        glide = [0.002 <= m < 0.25 for m in mref]; cont = [k_ for k_ in range(1, len(mref) - 1) if glide[k_ - 1] and glide[k_] and glide[k_ + 1]]
        mv = [i for k_ in cont for i in range(loc(ns[k_]) + 1, loc(ns[k_ + 1]) + 1)]
        s60 = float(np.mean([same60[i] for i in mv])) if mv else 0.0; sref = float(np.mean([m < 0.0005 for m in mref])) if mref else 0.0
        flatshare = float(np.mean(flat)); bad = []
        if kind == "film":
            lay = f"filmed: ours full-frame in {100 * (1 - np.mean(of)):.0f}% of frames"
            if np.mean(of) > 0.1: bad.append("layout")
        elif flatshare >= 0.6:
            ratio = (np.mean(co) + 1e-4) / (np.mean(cr) + 1e-4); lay = f"flat ground: cover ref {100 * np.mean(cr):.1f}% ours {100 * np.mean(co):.1f}% (x{ratio:.2f}), overlap {np.mean(iou):.2f}"
            if np.mean(iou) < 0.60 or not 0.7 <= ratio <= 1.4: bad.append("layout")
        else:
            full_ours = 1 - float(np.mean([o for o, f_ in zip(of, flat) if not f_])) if not all(flat) else 1.0
            lay = f"full-frame in the reference ({100 * (1 - flatshare):.0f}% of frames): ours full-frame in {100 * full_ours:.0f}% of those, tone {np.mean(tn):.2f}"
            if full_ours < 0.9 or np.mean(tn) < 0.45: bad.append("layout")
        mot = f"motion ref {100 * mr_:.2f}% ours {100 * mo_:.2f}%" + (f" (x{mo_ / mr_:.2f})" if mr_ > 1e-5 else "") + (f" corr {corr:.2f}" if corr is not None else "")
        if kind != "film" and mref:
            if mr_ >= 0.003 and not 0.55 <= mo_ / mr_ <= 1.8: bad.append("motion amount")
            if mr_ < 0.003 and mo_ > mr_ + 0.01: bad.append("motion amount (the reference rests here)")
            if corr is not None and mr_ >= 0.003 and corr < 0.45: bad.append("motion timing")
            if s60 > 0.3: bad.append("steps")
        print(f"  {name:4s} f{a}-f{b}  {'PASS' if not bad else 'MISS: ' + ', '.join(bad)}\n       {lay}\n       {mot}; while the reference moves, {100 * s60:.0f}% of our 60 fps frames repeat (stepping); the reference itself holds in {100 * sref:.0f}% of its frames")
        if bad and kind != "film": print("       worst frames: " + ", ".join(f"f{n} ({v:.2f})" for v, n in sorted(worst)[:5]))
        if bad: fails.append(name)
    print(f"GATES: {len(pk['shots']) - len(fails)} of {len(pk['shots'])} shots pass" + ("" if not fails else "; missing: " + ", ".join(fails)))

if "--no-sheets" not in sys.argv:
    A, B = max(f0, arg("--from", f0)), min(f1, arg("--to", f1)); w, cols = arg("--w", 316), arg("--cols", 6); h = round(w * 9 / 16); per = cols * 4
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12); ns = list(range(A, B + 1)); made = []
    cutset = {a for _, a, _, _ in pk["shots"]}
    for s in range(0, len(ns), per):
        part = ns[s:s + per]; rows = (len(part) + cols - 1) // cols; sheet = Image.new("RGB", (cols * (w + 4) + 4, rows * (2 * h + 20) + 4), "white"); d = ImageDraw.Draw(sheet)
        for k, n in enumerate(part):
            x, y = 4 + (k % cols) * (w + 4), 4 + (k // cols) * (2 * h + 20)
            d.text((x + 2, y), f"f{n}  {n / 24:.2f}s" + ("  CUT" if n in cutset else ""), fill=(190, 0, 0), font=font)
            sheet.paste(Image.open(os.path.join(REF, f"f{n:04d}.jpg")).resize((w, h), Image.LANCZOS), (x, y + 14))
            sheet.paste(Image.open(files[loc(n)]).convert("RGB").resize((w, h), Image.LANCZOS), (x, y + 16 + h))
        p = os.path.join(out, f"{pid}_f{part[0]:04d}.png"); sheet.save(p); made.append(os.path.relpath(p, FILM))
    print("pair sheets (reference above, ours below): " + "  ".join(made))
