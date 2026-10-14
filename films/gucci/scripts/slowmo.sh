#!/usr/bin/env bash
# Bakes each clip's slow motion into the file: the used window, slowed to the film's rate and motion-interpolated to
# exactly 30 fps, so every film frame is its own interpolated frame (played at 1x, no uneven frame picking).
#   bash scripts/slowmo.sh   (run from films/gucci/film/public/footage; writes <clip>-s.mp4)
set -e
mk() { ffmpeg -v error -y -ss "$2" -t "$3" -i "$1.mp4" -vf "setpts=PTS/$4,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an -c:v libx264 -crf 15 -preset fast -g 10 -pix_fmt yuv420p "$1-s.mp4"; echo "$1 done"; }
mk lobby 1.5 4 0.8 & mk dancer 0 3.5 0.75 & mk stitch 0 7.5 0.7 & mk bookstore 0 3.5 0.8 & wait
mk leather 0.5 2.5 0.6 & mk mirrors 4 9 0.8 & mk needle 7 3.5 0.75 & mk cut 8.5 3.5 0.75 & wait
mk coat 10 5 0.8 & mk street 19.5 4 0.7 & wait
