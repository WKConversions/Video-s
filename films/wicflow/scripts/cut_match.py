# Checks that a hand-off between two frames matches (production/build-gotchas.md).
#   python3 cut_match.py a.png b.png [--box x0,y0,x1,y1] [--dark 60]
# Prints the bounding box of dark pixels (the carried object) in each frame and their offset, plus the
# mean pixel difference. A matched cut has boxes within 2 px; correct the next camera by the offset.
import sys
import numpy as np
from PIL import Image

args = sys.argv[1:]
a, b = args[0], args[1]
box = None; dark = 60
if "--box" in args: box = [int(v) for v in args[args.index("--box") + 1].split(",")]
if "--dark" in args: dark = int(args[args.index("--dark") + 1])
def load(p):
    g = np.asarray(Image.open(p).convert("L")).astype(int)
    return g[box[1]:box[3], box[0]:box[2]] if box else g
ga, gb = load(a), load(b)
def bbox(g):
    ys, xs = np.where(g < dark)
    return (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None
ba, bb = bbox(ga), bbox(gb)
print("box A", ba); print("box B", bb)
if ba and bb:
    print("offset B-A  x %+d  y %+d  size %+d x %+d" % (bb[0] - ba[0], bb[1] - ba[1], (bb[2] - bb[0]) - (ba[2] - ba[0]), (bb[3] - bb[1]) - (ba[3] - ba[1])))
print("mean abs difference %.2f (0-255); pixels differing by >20: %.1f%%" % (np.abs(ga - gb).mean(), 100 * (np.abs(ga - gb) > 20).mean()))
