#!/usr/bin/env bash
# The Dutch build: work/NL is film/ with LANG = "nl" (node_modules and public hardlinked, src copied).
#   bash scripts/sync_nl.sh   (run from films/talenthub, after any change to film/src)
set -euo pipefail
rm -rf work/NL/src && cp -r film/src work/NL/src
sed -i 's/export const LANG = "en"/export const LANG = "nl"/' work/NL/src/lang.ts
grep -q '"nl" as' work/NL/src/lang.ts
