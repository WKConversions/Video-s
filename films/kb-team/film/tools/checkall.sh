#!/usr/bin/env bash
# Scores every package against the reference (no sheets): the film's gate table.   bash tools/checkall.sh [R01 R02 ...]
set -uo pipefail
for p in ${@:-R01 R02 R03 R04 R05 R06 R07 R08 R09 R10 R11 R12}; do python3 -I tools/check.py "$p" --no-sheets 2>&1 | grep -v "^pair sheets" ; done
