# Fits the overlay's type to the original row: renders the old "APPS BY" row in place with each
# candidate style and compares it with the film's last frame, pixel by pixel.
#   python3 scripts/calibrate.py <work dir>      (run from films/gohere; needs ffmpeg and node)
import itertools, json, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = sys.argv[1]
os.makedirs(WORK, exist_ok=True)
ref_png = os.path.join(WORK, "ref.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "36.83", "-i", os.path.join(ROOT, "source", "gohere-v1.mp4"),
                "-frames:v", "1", ref_png], check=True)
ref = np.asarray(Image.open(ref_png).convert("L")).astype(float)[752:1080, 0:1210]

# boxes inside the 1210 x 328 crop
NAMES = [(282, 70, 480, 110), (563, 70, 735, 110), (816, 70, 935, 110), (1020, 70, 1190, 110)]
LABEL = [(60, 70, 200, 110)]

def run(jobs):
    jf = os.path.join(WORK, "jobs.json"); out = os.path.join(WORK, "out")
    for f in os.listdir(out) if os.path.isdir(out) else []: os.remove(os.path.join(out, f))
    json.dump(jobs, open(jf, "w"))
    subprocess.run(["node", os.path.join(ROOT, "overlay", "render.mjs"), "calib", jf, out], check=True)
    return [np.asarray(Image.open(os.path.join(out, f)).convert("L")).astype(float) for f in sorted(os.listdir(out))]

def err(img, boxes):
    return sum(np.abs(img[y0:y1, x0:x1] - ref[y0:y1, x0:x1]).mean() for x0, y0, x1, y1 in boxes) / len(boxes)

best = {}
names = [dict(nameSize=s, nameWeight=w, nameDy=dy) for s, w, dy in itertools.product([21.5, 22, 22.5, 23], [700, 800, 900], [-1, 0, 1])]
imgs = run(names)
scores = sorted((err(i, NAMES), j) for j, i in zip(names, imgs))
print("names:", scores[:4]); best.update(scores[0][1])

labels = [dict(best, labelSize=s, labelWeight=w, labelTrack=t, labelFamily=fam, labelDy=dy)
          for s, w, t, fam, dy in itertools.product([19, 20, 21], [700, 800], [0.16, 0.18, 0.2, 0.22], ["Nunito", "Nunito Sans"], [0, 1, 2])]
imgs = run(labels)
scores = sorted((err(i, LABEL), j) for j, i in zip(labels, imgs))
print("label:", scores[:4]); best.update(scores[0][1])

colors = [dict(best, nameColor=nc, labelColor=lc) for nc, lc in itertools.product(
    ["#000000", "#0b0b1c", "#14142b", "#1a1a33"], ["#3d3c4f", "#454457", "#4d4c60", "#55546a"])]
imgs = run(colors)
scores = sorted((err(i, NAMES + LABEL), j) for j, i in zip(colors, imgs))
print("colors:", scores[:3]); best.update(scores[0][1])
json.dump(best, open(os.path.join(ROOT, "overlay", "style.json"), "w"), indent=1)
print("best:", best)
