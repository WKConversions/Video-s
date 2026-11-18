#!/usr/bin/env bash
# The smoothness check of ONE scene: renders it at full size in a single browser tab (so neighbouring frames share one
# raster history, as in the final render) and runs the skill's shake check on it.
#   bash tools/smooth.sh <group A-E|G> <SceneId>      -> out/sm_<Scene>.mp4 and the report
# Times in the report are CLIP times: local scene time = clip time - 0.3 s. Takes about 1-2 minutes.
set -euo pipefail
g=$1; id=$2
npx remotion render src/entry$g.tsx "$id" "out/sm_$id.mp4" --concurrency=1 --muted --crf=16 --log=error >/dev/null
python3 ../../../skills/senior-motion-designer/library/scripts/jitter_check.py "out/sm_$id.mp4" || true
