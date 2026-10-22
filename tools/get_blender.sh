#!/bin/bash
# Installs Blender 4.2 LTS (Cycles on CPU, free) to /opt/blender when a film needs photoreal 3D plates
# (skill library: production/realism.md). About 350 MB download, 1.1 GB on disk; skips if already there.
set -e
B=/opt/blender/blender-4.2.3-linux-x64/blender
[ -x "$B" ] && { echo "$B"; exit 0; }
mkdir -p /opt/blender && cd /opt/blender
curl -sS -o b.tar.xz https://download.blender.org/release/Blender4.2/blender-4.2.3-linux-x64.tar.xz
tar -xJf b.tar.xz && rm b.tar.xz
"$B" -b --version | head -1 && echo "$B"
