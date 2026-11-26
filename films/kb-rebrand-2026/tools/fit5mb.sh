#!/bin/bash
# Two-pass x264 to land a video just under 5 MB (5,000,000 bytes) at the best quality that size allows.
#   fit5mb.sh in.mp4 out.mp4 [height]      height: 1080 (default) or 720 (scaled, Lanczos)
# Total target 4.8 MB: video bitrate = (4.8e6 * 8 / duration - audio) * 0.97, audio AAC 96 kbps when present.
set -euo pipefail
in=$1; out=$2; h=${3:-1080}
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
has_a=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$in" | head -1)
ab=0; [ -n "$has_a" ] && ab=96000
vb=$(python3 -c "print(int((4.8e6 * 8 / $dur - $ab) * 0.97))")
vf=""; [ "$h" != 1080 ] && vf="-vf scale=-2:$h:flags=lanczos"
log=$(mktemp -u /tmp/claude-0/-home-user-Video-s/1b338aa5-0d41-5df7-93ad-fbe415aea70d/scratchpad/x264pass.XXXXXX)
ffmpeg -v error -y -i "$in" $vf -c:v libx264 -preset slow -b:v $vb -pass 1 -passlogfile "$log" -an -f mp4 /dev/null
if [ -n "$has_a" ]; then aopt="-c:a aac -b:a 96k"; else aopt="-an"; fi
ffmpeg -v error -y -i "$in" $vf -c:v libx264 -preset slow -b:v $vb -pass 2 -passlogfile "$log" -pix_fmt yuv420p $aopt -movflags +faststart "$out"
rm -f "$log"*
echo "$(basename "$out") ${h}p video ${vb} bps -> $(stat -c %s "$out") bytes"
