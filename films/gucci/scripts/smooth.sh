#!/usr/bin/env bash
# Rebuilds the used window of each clip at 60 fps with motion-compensated in-between frames, so footage slowed to
# 0.6-0.8x plays smoothly at 30 fps (24/25 fps sources slowed down otherwise repeat frames and judder).
#   bash scripts/smooth.sh   (run from films/gucci/film/public/footage; writes <clip>-60.mp4)
set -e
mk() { ffmpeg -v error -y -ss "$2" -t "$3" -i "$1.mp4" -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an -c:v libx264 -crf 15 -preset fast -g 12 -pix_fmt yuv420p "$1-60.mp4"; echo "$1 done"; }
mk lobby 1.5 4 & mk dancer 0 3.5 & mk stitch 0 7.5 & mk bookstore 0 3.5 & wait
mk leather 0.5 2.5 & mk mirrors 4 9 & mk needle 7 3.5 & mk cut 8.5 3.5 & wait
mk coat 10 5 & mk street 19.5 4 & wait
