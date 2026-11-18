#!/usr/bin/env bash
# A contact sheet of one scene, alone (its own entry, so other builders' files don't matter).
#   bash tools/sheet.sh <group A-E> <SceneId> <n> <out.png> [scale=0.25]
# Renders n evenly spaced frames of the scene (0.3 s pre-roll and post-roll included), 4 per row, 480 px tiles.
#   bash tools/sheet.sh <group> <SceneId> clip <out.mp4>       a 960x540 60 fps clip of the scene (for tools/flow.py)
set -euo pipefail
g=$1; id=$2; n=$3; out=$4
frames=$(node -e "const s=require('fs').readFileSync('src/timeline.ts','utf8'); const m=s.match(new RegExp('id: \"$id\"[^}]*dur: ([0-9.]+)')); console.log(Math.round((parseFloat(m[1])+0.6)*60))")
if [ "$n" = "clip" ]; then npx remotion render src/entry$g.tsx "$id" "$out" --scale=0.5 --concurrency=2 --muted --log=error; echo "$out"; exit 0; fi
tmp=$(mktemp -d); every=$(( frames / n )); [ $every -lt 1 ] && every=1
npx remotion render src/entry$g.tsx "$id" "$tmp/f" --sequence --image-format=jpeg --every-nth-frame=$every --scale=0.25 --concurrency=2 --log=error >/dev/null
cnt=$(ls "$tmp/f" | wc -l); cols=4; rows=$(( (cnt + cols - 1) / cols ))
ffmpeg -v error -y -pattern_type glob -framerate 1 -i "$tmp/f/*.jpeg" -vf "pad=iw+6:ih+6:3:3:white,tile=${cols}x${rows}:color=white" -frames:v 1 "$out"
echo "$out: $cnt frames, every ${every}th frame ($(node -e "console.log(($every/60).toFixed(2))") s apart), local time of frame k = k*$every/60 - 0.3 s"
rm -rf "${tmp:?}"
