#!/bin/bash
# Proves a new setup renders like the original: renders the loop templates at 540p and checks motion and the loop seam
# against test/reference.json. Usage: bash test/verify.sh [klyro fieldnote morrow]   (about 2–4 min per template)
# Needs: node_modules in each template (npm ci, or `cp -al <existing>/node_modules templates/<x>/`), ffmpeg, python3
# with numpy and opencv-python-headless, Chromium headless_shell (path below, or set B).
set -u
SKILL=$(cd "$(dirname "$0")/.." && pwd)
B=${B:-$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell 2>/dev/null | head -1)}
OUT=${OUT:-/tmp/smd-verify}; mkdir -p "$OUT"
LIST=${*:-klyro fieldnote morrow}; FAIL=0
for T in $LIST; do
  D="$SKILL/templates/$T"
  [ -d "$D/node_modules" ] || { echo "$T: no node_modules (run npm ci in $D)"; FAIL=1; continue; }
  (cd "$D" && npx remotion render src/index.ts Loop "$OUT/$T.mp4" --scale=0.5 --concurrency=4 --muted \
     ${B:+--browser-executable=$B} --log=error) || { echo "$T: render failed"; FAIL=1; continue; }
  python3 - "$OUT/$T.mp4" "$T" "$SKILL/test/reference.json" <<'PY' || FAIL=1
import cv2, json, numpy as np, sys
path, name, ref = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
r = ref["templates"][name]; cap = cv2.VideoCapture(path); fr = []
while True:
    ok, f = cap.read()
    if not ok: break
    fr.append(cv2.cvtColor(cv2.resize(f, (160, 90)), cv2.COLOR_BGR2GRAY).astype(np.float32))
d = [float((np.abs(b - a) > 6).mean()) for a, b in zip(fr, fr[1:])]
med = 100 * np.median(d); moving = 100 * np.mean(np.array(d) >= 0.001)
step = np.median([np.abs(b - a).mean() for a, b in zip(fr, fr[1:])]); seam = np.abs(fr[0] - fr[-1]).mean()
target = r.get("median_540p", r.get("median_1080p"))
ok = abs(med - target) <= ref["tolerance_median"] + (0 if "median_540p" in r else 0.4) and moving >= 99 \
     and seam <= ref["seam_max_ratio"] * max(step, 0.5)
print(f"{name}: median {med:.1f}% (ref {target}), moving {moving:.0f}%, seam {seam:.2f} vs step {step:.2f} -> {'PASS' if ok else 'FAIL'}")
sys.exit(0 if ok else 1)
PY
done
[ $FAIL = 0 ] && echo "ALL PASS: this setup renders like the original." || echo "SOME FAILED: see above."
exit $FAIL
