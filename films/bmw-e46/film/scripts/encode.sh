#!/usr/bin/env bash
# Delivery encode from the rendered frame sequence (out/seq/element-NNN.jpeg, 900 frames at 30 fps) and the mix:
#   bash scripts/encode.sh            (run from films/bmw-e46/film)
# -> ../deliver/bmw-330ci-coupe-e46.mp4 (with sound) and ../deliver/bmw-330ci-coupe-e46_silent.mp4
# H.264 High, yuv420p, BT.709 tagged, TV range, AAC 48 kHz stereo, exactly 30.0 s, faststart.
set -euo pipefail
SEQ="${1:-out/seq}"
N=$(ls $SEQ/element-*.jpeg | wc -l)
[ "$N" -eq 900 ] || { echo "expected 900 frames, found $N"; exit 1; }
mkdir -p ../deliver
V="-framerate 30 -start_number 0 -i $SEQ/element-%03d.jpeg"
X="-c:v libx264 -preset slow -crf 15 -profile:v high -pix_fmt yuv420p -vf scale=1920:1080:flags=lanczos:in_range=full:out_range=tv,format=yuv420p
   -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -r 30 -g 60 -movflags +faststart"
ffmpeg -y -v error $V -i ../sound/mix.wav $X -c:a aac -b:a 256k -ar 48000 -ac 2 -t 30 -shortest ../deliver/bmw-330ci-coupe-e46.mp4
ffmpeg -y -v error $V $X -an -t 30 ../deliver/bmw-330ci-coupe-e46_silent.mp4
for f in ../deliver/bmw-330ci-coupe-e46.mp4 ../deliver/bmw-330ci-coupe-e46_silent.mp4; do
  ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,pix_fmt,color_space,sample_rate -of compact "$f"
done
