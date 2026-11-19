#!/usr/bin/env bash
# The reference (left) beside our film (right), in step, with OUR sound: the fastest way to judge a rebuild.
#   bash tools/sidebyside.sh out/v2_540.mp4 ../sound/mix.wav out/sbs.mp4      (our film may be any size; output 1920x540, 60 fps)
set -euo pipefail
ours=$1; mix=$2; out=$3
ffmpeg -v error -y -i ../reference/base44.mp4 -i "$ours" -i "$mix" -filter_complex \
 "[0:v]fps=60,scale=960:540,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='reference':x=16:y=14:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.45:boxborderw=6[a];[1:v]fps=60,scale=960:540,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='K.B':x=16:y=14:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.45:boxborderw=6[b];[a][b]hstack=inputs=2[v]" \
 -map "[v]" -map 2:a -c:v libx264 -crf 20 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$out"
echo "$out"
