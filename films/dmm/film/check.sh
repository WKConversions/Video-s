#!/bin/bash
# Renders one scene on its own (src/solo/<ID>.tsx) between two film times at 960x540, then measures it:
#   bash check.sh S3 12.0 16.5      -> out/<ID>.mp4, out/<ID>-sheet.png (frames every 0.25 s), motion and shake lines
set -u
ID=$1; A=$2; B=$3; cd "$(dirname "$0")"
B_=$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell | head -1)
F0=$(python3 -c "print(int(round($A*60)))"); F1=$(python3 -c "print(int(round($B*60))-1)")
npx remotion render src/solo/$ID.tsx Solo out/$ID.mp4 --frames=$F0-$F1 --scale=0.5 --concurrency=2 --muted --browser-executable=$B_ --log=error || exit 1
S=/home/user/Video-s/skills/senior-motion-designer/library/scripts
python3 $S/motion_check.py out/$ID.mp4 --profile | head -1 | cut -c1-110
python3 $S/jitter_check.py out/$ID.mp4 | grep -v '^look' | cut -c1-120
python3 -I - "$ID" "$A" <<'PY'
import cv2, sys
from PIL import Image, ImageDraw
ID, A = sys.argv[1], float(sys.argv[2]); cap = cv2.VideoCapture(f"out/{ID}.mp4"); n = int(cap.get(7)); step = 15
idx = list(range(0, n, step)); W, H = 480, 270; cols = 6; rows = (len(idx) + cols - 1) // cols
sh = Image.new("RGB", (cols * W, rows * (H + 16)), "black"); d = ImageDraw.Draw(sh)
for i, f in enumerate(idx):
    cap.set(1, f); ok, fr = cap.read()
    if not ok: continue
    im = Image.fromarray(cv2.cvtColor(fr, cv2.COLOR_BGR2RGB)).resize((W, H)); x, y = (i % cols) * W, (i // cols) * (H + 16); sh.paste(im, (x, y)); d.text((x + 4, y + H + 2), f"{A + f / 60:.2f}s", fill="white")
sh.save(f"out/{ID}-sheet.png"); print(f"sheet: out/{ID}-sheet.png ({len(idx)} frames, 0.25 s apart)")
PY
