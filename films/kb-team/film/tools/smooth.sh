#!/usr/bin/env bash
# The smoothness check of ONE package: renders it at full size in one browser tab and runs the skill's shake check.
#   bash tools/smooth.sh R03      -> out/sm_R03.mp4 and the report (times are package-local seconds)
set -euo pipefail
id=$1
npx remotion render src/entry$id.tsx Pkg "out/sm_$id.mp4" --concurrency=1 --muted --crf=18 --log=error >/dev/null
python3 ../../../skills/senior-motion-designer/library/scripts/jitter_check.py "out/sm_$id.mp4" || true
