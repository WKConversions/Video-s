#!/usr/bin/env bash
# A contact sheet or a clip of ONE package alone.
#   bash tools/sheet.sh R03 12 out/R03.png        12 evenly spaced frames, 4 per row, 480 px tiles
#   bash tools/sheet.sh R03 clip out/R03.mp4      a 960x540 60 fps clip (for motion and shake checks)
set -euo pipefail
id=$1; n=$2; out=$3
frames=$(node -e "const s=require('fs').readFileSync('src/timeline.ts','utf8'); const m=s.match(new RegExp('id: \"$id\", f0: ([0-9]+), f1: ([0-9]+)')); console.log(Math.round((+m[2]+1-+m[1])*2.5))")
if [ "$n" = "clip" ]; then npx remotion render src/entry$id.tsx Pkg "$out" --scale=0.5 --concurrency=2 --muted --log=error; echo "$out"; exit 0; fi
tmp=$(mktemp -d); every=$(( frames / n )); [ $every -lt 1 ] && every=1
npx remotion render src/entry$id.tsx Pkg "$tmp/f" --sequence --image-format=jpeg --every-nth-frame=$every --scale=0.25 --concurrency=2 --log=error >/dev/null
cnt=$(ls "$tmp/f" | wc -l); cols=4; rows=$(( (cnt + cols - 1) / cols ))
ffmpeg -v error -y -pattern_type glob -framerate 1 -i "$tmp/f/*.jpeg" -vf "pad=iw+6:ih+6:3:3:white,tile=${cols}x${rows}:color=white" -frames:v 1 "$out"
echo "$out: $cnt frames, every ${every}th frame ($(node -e "console.log(($every/60).toFixed(3))") s apart)"
rm -rf "${tmp:?}"
