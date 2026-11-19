#!/usr/bin/env python3
# Side by side with the reference: for reference frames A..B, the reference frame on top and OUR frame at the same
# moment below it (our film frame = reference frame x 2.5). Renders only your package (its own entry).
#   python3 tools/compare.py R03 188 205 out/cmp_R03.png [--step 1] [--cols 9] [--w 320]
# Run from films/kb-team/film. Look at the sheet with the Read tool: composition, sizes, positions, timing of every
# arrival and cut, frame for frame. --step 1 around changes; larger steps for an overview.
import glob, os, shutil, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.join(HERE, ".."); REF = os.path.join(FILM, "..", "reference", "frames")
PK = {"R01": (0, 92), "R02": (93, 187), "R03": (188, 264), "R04": (265, 384), "R05": (385, 474), "R06": (475, 556), "R07": (557, 662), "R08": (663, 732), "R09": (733, 832), "R10": (833, 961), "R11": (962, 1079), "R12": (1080, 1200)}
def arg(name, default):
    return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
pid, A, B, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
step, cols, w = arg("--step", 1), arg("--cols", 9), arg("--w", 320)
f0, f1 = PK[pid]; A, B = max(A, f0), min(B, f1); h = round(w * 9 / 16)
loc = lambda n: min(round((n - f0) * 2.5), round((f1 + 1 - f0) * 2.5) - 1)
a, b = loc(A), loc(B)
tmp = os.path.join(FILM, "out", f"_cmp_{pid}_{os.getpid()}"); os.makedirs(tmp, exist_ok=True)
r = subprocess.run(["npx", "remotion", "render", f"src/entry{pid}.tsx", "Pkg", tmp, "--sequence", "--image-format=jpeg", f"--scale={w / 1920:.5f}", f"--frames={a}-{b}", "--concurrency=2", "--log=error"], cwd=FILM, capture_output=True, text=True)
files = sorted(glob.glob(os.path.join(tmp, "*.jpeg")))
if not files: sys.exit("render failed:\n" + r.stdout[-2000:] + r.stderr[-2000:])
ns = list(range(A, B + 1, step)); rows = (len(ns) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 4) + 4, rows * (2 * h + 44) + 4), "white"); d = ImageDraw.Draw(sheet)
fp = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; f = ImageFont.truetype(fp, 13) if os.path.exists(fp) else ImageFont.load_default()
for k, n in enumerate(ns):
    x, y = 4 + (k % cols) * (w + 4), 4 + (k // cols) * (2 * h + 44)
    ref = Image.open(os.path.join(REF, f"f{n:04d}.jpg")).resize((w, h), Image.LANCZOS)
    ours = Image.open(files[min(len(files) - 1, loc(n) - a)]).convert("RGB").resize((w, h), Image.LANCZOS)
    d.text((x + 2, y + 1), f"REF f{n}  {n / 24:.3f}s", fill=(190, 0, 0), font=f); sheet.paste(ref, (x, y + 17))
    d.text((x + 2, y + 18 + h), f"K.B  +{(n - f0) / 24:.3f}s (frame {loc(n)})", fill=(0, 80, 160), font=f); sheet.paste(ours, (x, y + 34 + h))
sheet.save(out); shutil.rmtree(tmp, ignore_errors=True); print(out, sheet.size, len(ns), "pairs")
