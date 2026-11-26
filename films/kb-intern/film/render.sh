#!/bin/bash
# Final render of one film with its mix:  bash render.sh Onboarding onb [layer]
#   layer: all (default) | noLogo | logoOnly (ProRes 4444 with alpha, no sound)
set -euo pipefail; cd "$(dirname "$0")"
comp=$1; id=$2; layer=${3:-all}
B=$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-headless-shell-linux64/chrome-headless-shell /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell 2>/dev/null | head -1)
mkdir -p out
if [ "$layer" = logoOnly ]; then
  npx remotion render src/index.ts $comp out/$id-logo-layer.mov --props="{\"layer\":\"logoOnly\"}" --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --concurrency=4 --browser-executable=$B --log=error --muted
  exit 0
fi
npx remotion render src/index.ts $comp out/$id-$layer-v.mp4 --props="{\"layer\":\"$layer\"}" --concurrency=4 --crf=16 --browser-executable=$B --log=error --muted
ffmpeg -v error -y -i out/$id-$layer-v.mp4 -i public/audio/$id-mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/$id-$layer.mp4
rm out/$id-$layer-v.mp4
echo "out/$id-$layer.mp4"
