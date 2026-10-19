#!/usr/bin/env bash
# A quick draft clip of a frame range: half size, no motion blur, no audio. Run from a Remotion project folder.
#   bash draft.sh <first frame> <last frame> <out.mp4>
set -euo pipefail
a=$1; b=$2; out=$3
browser=$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell 2>/dev/null | head -1)
npx remotion render src/index.ts Film "$out" --frames="$a-$b" --props='{"blurSamples":1,"audio":"none"}' --scale=0.5 \
  --concurrency=1 --muted --crf=18 --log=error ${browser:+--browser-executable="$browser"}
echo "$out: frames $a-$b"
