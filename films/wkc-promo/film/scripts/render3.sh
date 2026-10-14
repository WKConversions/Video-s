#!/usr/bin/env bash
# bundle once, render contiguous chunks in parallel (one tab each), join
set -uo pipefail
cd /home/user/Video-s/films/wkc-promo/film
mkdir -p out/parts
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
rm -rf out/bundle && npx remotion bundle src/index.ts --out-dir=out/bundle --log=error >/dev/null
IFS=, read -ra K <<< "$1"
pids=()
for ((i = 0; i < ${#K[@]} - 1; i++)); do
  a=${K[i]}; b=$(( K[i + 1] - 1 ))
  npx remotion render out/bundle Film out/parts/p$a.mp4 --frames="$a-$b" --props='{"blurSamples":1,"audio":"none"}' --concurrency=1 --muted --crf=16 --log=error --browser-executable=$B > out/parts/p$a.log 2>&1 &
  pids+=($!)
done
for p in "${pids[@]}"; do wait $p || echo "a chunk failed"; done
echo rendered
