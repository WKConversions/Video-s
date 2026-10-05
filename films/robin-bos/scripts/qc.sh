#!/usr/bin/env bash
# The automatic quality checks, in one go, on a draft or a final encode:
#   bash qc.sh film.mp4 [out_dir] [--cuts 120,452]
# 1 motion_check (how much moves), 2 jitter_check (shake), 3 handoff_check (pops, with strips),
# 4 busy_check (too many things on screen), 5 strips (every transition). Read every SHAKE, POP and CROWDED line and
# look at its strip before the final render. The motion probe (spikes, lurches, pops past size) runs on the
# project, not the encode: node scripts/motion_probe.mjs, then python3 scripts/motion_probe.py.
set -u
F="$1"; OUT="${2:-qc}"; shift; [ $# -gt 0 ] && shift
D="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$OUT"
echo "== 1 motion";  python3 "$D/motion_check.py" "$F" --profile > "$OUT/motion.txt"; head -1 "$OUT/motion.txt"
echo "== 2 shake";   python3 "$D/jitter_check.py" "$F" --png "$OUT/shake.png" "$@" | tee "$OUT/shake.txt" | grep -v "^look" ; S=${PIPESTATUS[0]}
echo "== 3 pops";    python3 "$D/handoff_check.py" "$F" --strips "$OUT/pops" "$@" | tee "$OUT/pops.txt" | tail -4; P=${PIPESTATUS[0]}
echo "== 4 busy";    python3 "$D/busy_check.py" "$F" | tee "$OUT/busy.txt" | tail -1; B=${PIPESTATUS[0]}
echo "== 5 strips";  python3 "$D/strips.py" "$F" "$OUT/strips"
echo "== result: $([ $S -eq 0 ] && echo 'no shake' || echo 'SHAKE found'), $([ $P -eq 0 ] && echo 'no pops' || echo 'pops to look at'), $([ $B -eq 0 ] && echo 'clear' || echo 'BUSY: fewer, bigger things') — details in $OUT/"
