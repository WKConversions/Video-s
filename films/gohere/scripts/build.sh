#!/usr/bin/env bash
# Builds a revised cut of the GoHere film from the client's own render.
#   bash scripts/build.sh <A|B> <out.mp4>          (run from films/gohere)
# Frames 0-1013 are the source untouched. From 1014 the box left of the phone and under the button
# (x 0-1210, y 752-1080; pure white in the source except the old "APPS BY" row) is replaced by the
# overlay, rendered on white (at 4x, scaled down). After the source's last frame (1105) its picture holds while the new
# row finishes. The sound is scripts/sound.py: the source track plus the new section's effects.
set -euo pipefail
MODE=$1; OUT=$2
cd "$(dirname "$0")/.."
WORK=${WORK:-$(mktemp -d)}
END=$(node overlay/render.mjs timing "$MODE" | python3 -c "import json,sys; print(json.load(sys.stdin)['$MODE']['end'])")
SRC_FRAMES=1106
HOLD=$((END - SRC_FRAMES))
echo "$MODE: $END frames ($(python3 -c "print(f'{$END/30:.2f}')") s), holding the last frame for $HOLD"

# drawn at 4x and scaled down (box filter): slow moves glide in quarter pixels
SS=4 node overlay/render.mjs frames "$MODE" 1014 $((END - 1)) "$WORK/ov" 6
python3 scripts/sound.py "$MODE" "$WORK/mix.wav"

ffmpeg -v error -y \
  -i source/gohere-v1.mp4 \
  -framerate 30 -start_number 1014 -i "$WORK/ov/o%04d.png" \
  -i "$WORK/mix.wav" \
  -filter_complex "[0:v]setpts=N/30/TB,tpad=stop_mode=clone:stop=$HOLD[base];[1:v]scale=1210:328:flags=area,setpts=PTS+1014/30/TB[ov];[base][ov]overlay=x=0:y=752:eof_action=pass:format=yuv420,format=yuv420p[v]" \
  -map "[v]" -map 2:a \
  -c:v libx264 -preset slow -crf 15 -profile:v high -level 4.0 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 256k -ar 48000 \
  -frames:v "$END" -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration:stream=codec_name,nb_frames,width,height -of compact "$OUT"
