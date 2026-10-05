#!/usr/bin/env bash
# Renders a Remotion film in contiguous chunks, one browser tab per chunk, all chunks at once, and joins
# them; then lays the finished mix under the picture.
#   bash render_chunks.sh <composition> <out.mp4> '<props json>' <boundaries> [mix.wav]
#   bash render_chunks.sh Film out/final.mp4 '{"blurSamples":8}' 0,252,600,870,1110 public/audio/mix.wav
# Why: with --concurrency above 1, Remotion hands neighbouring frames to different tabs. A layer that
# glides at sub-pixel steps (will-change: transform on slowly moving text) keeps a raster offset that
# depends on what that tab rendered before, so neighbouring frames disagree by up to a pixel and the
# text trembles; without the layer, slow text steps a whole pixel at a time. One tab per contiguous chunk
# keeps every frame's history the same as the frame before it. Put the boundaries (first frames of each
# chunk, then the total) where no layered text is moving; a boundary costs at most one sub-pixel blip.
# Run from the Remotion project folder. Needs ffmpeg; uses the pre-installed headless Chromium.
set -euo pipefail
comp=$1; out=$2; props=$3; IFS=, read -ra B <<< "$4"; mix=${5:-}
browser=$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell 2>/dev/null | head -1)
work=$(mktemp -d); trap 'rm -rf "$work"' EXIT
npx remotion bundle src/index.ts --out-dir="$work/bundle" --log=error >/dev/null
pids=()
for ((i = 0; i < ${#B[@]} - 1; i++)); do
  a=${B[i]}; b=$(( B[i + 1] - 1 ))
  npx remotion render "$work/bundle" "$comp" "$work/part$i.mp4" --frames="$a-$b" --props="$props" --concurrency=1 \
    --muted --crf=16 --log=error ${browser:+--browser-executable="$browser"} > "$work/part$i.log" 2>&1 &
  pids+=($!)
done
fail=0
for i in "${!pids[@]}"; do wait "${pids[i]}" || { echo "chunk $i failed:"; tail -5 "$work/part$i.log"; fail=1; }; done
[ $fail = 0 ] || exit 1
for ((i = 0; i < ${#B[@]} - 1; i++)); do echo "file '$work/part$i.mp4'"; done > "$work/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$work/list.txt" -c copy "$work/video.mp4"
if [ -n "$mix" ]; then
  ffmpeg -v error -y -i "$work/video.mp4" -i "$mix" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$out"
else
  ffmpeg -v error -y -i "$work/video.mp4" -c copy -movflags +faststart "$out"
fi
echo "$out: $(( B[${#B[@]} - 1] - B[0] )) frames in $(( ${#B[@]} - 1 )) chunks"
