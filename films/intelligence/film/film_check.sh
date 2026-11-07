#!/bin/bash
# The whole film at 960x540 with the mix: out/film540.mp4 (+ ../deliver/dmm-preview-540p60.mp4), motion, shake,
# and one sheet per scene group (frames 0.25 s apart): out/sheet-<a>-<b>.png
set -u; cd "$(dirname "$0")"
B_=$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell | head -1)
npx remotion render src/index.ts Film out/film540-v.mp4 --scale=0.5 --concurrency=4 --muted --browser-executable=$B_ --log=error || exit 1
ffmpeg -v error -y -i out/film540-v.mp4 -i public/audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/film540.mp4
cp out/film540.mp4 ../deliver/intelligence-preview-540p60.mp4
S=/home/user/Video-s/skills/senior-motion-designer/library/scripts
python3 $S/motion_check.py out/film540.mp4 --profile > out/film-motion.txt 2>&1; head -2 out/film-motion.txt | cut -c1-120
python3 $S/jitter_check.py out/film540.mp4 > out/film-shake.txt 2>&1; grep -v '^look' out/film-shake.txt | cut -c1-120
python3 -I - <<'PY'
import cv2, json
from PIL import Image, ImageDraw
cap = cv2.VideoCapture("out/film540.mp4")
SPANS = [(0, 6), (5.5, 12), (11.5, 18), (17.5, 24), (23.5, 30), (29.5, 36), (35.5, 42), (41.5, 49.8)]
for a, b in SPANS:
    ts = [a + 0.25 * i for i in range(int((b - a) / 0.25) + 1)]; W, H = 480, 270; cols = 6; rows = (len(ts) + cols - 1) // cols
    sh = Image.new("RGB", (cols * W, rows * (H + 16)), "black"); d = ImageDraw.Draw(sh)
    for i, t in enumerate(ts):
        cap.set(1, int(round(t * 60))); ok, fr = cap.read()
        if not ok: continue
        x, y = (i % cols) * W, (i // cols) * (H + 16); sh.paste(Image.fromarray(cv2.cvtColor(fr, cv2.COLOR_BGR2RGB)).resize((W, H)), (x, y)); d.text((x + 4, y + H + 2), f"{t:.2f}s", fill="white")
    sh.save(f"out/sheet-{a:g}-{b:g}.png")
print("sheets written")
PY
