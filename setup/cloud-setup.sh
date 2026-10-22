#!/bin/bash
# Setup script for the cloud environment of the Video-s repo.
# Paste this file's contents into: the cloud environment menu in the session's title bar → Edit → Setup script.
# New sessions then start with every tool a film needs, so no turns go to installing. Each step may fail without
# blocking the session. Blender (1.1 GB) is NOT installed here; run tools/get_blender.sh when a film needs it.
set -u
# Python tools: VO timings, mixing, stock and reference downloads, tracking, depth/matte models
pip install -q --break-system-packages yt-dlp pyloudnorm onnxruntime opencv-python-headless faster-whisper pillow numpy \
  2>/dev/null || pip install -q yt-dlp pyloudnorm onnxruntime opencv-python-headless faster-whisper pillow numpy || true
# Remotion: one shared node_modules (the lab's lockfile); films hardlink it with `cp -al` instead of reinstalling
REPO=$(git rev-parse --show-toplevel 2>/dev/null || echo /home/user/Video-s)
if [ -f "$REPO/films/_lab/film/package-lock.json" ] && [ ! -d "$REPO/films/_lab/film/node_modules" ]; then
  (cd "$REPO/films/_lab/film" && npm ci --no-audit --no-fund --loglevel=error) || true
fi
exit 0
