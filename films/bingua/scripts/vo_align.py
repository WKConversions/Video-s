# Align the script words to whisper's word timestamps, then correct sentence (and comma) edges with silencedetect.
#   python3 vo_align.py vo.mp3 script.txt whisper_words.json outdir [--noise -35] [--d 0.12] [--fix fixes.json]
# Writes outdir/words_full.json, words.json, sentences.json.
# fixes.json (optional): {"w:key": {"start": s, "end": s}} manual boundary corrections verified on a spectrogram;
# a corrected start also moves the previous word's end when the two touched (and vice versa).
import json, re, sys, subprocess, difflib

args = sys.argv[1:]
def opt(name, default):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
    return default
ctcp = opt("--ctc", None); SHIFT = float(opt("--shift", -0.03)); noise = float(opt("--noise", -35)); dmin = float(opt("--d", 0.12)); fixp = opt("--fix", None)
mp3, script_path, whisper_path, outdir = args

norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
script = open(script_path).read().strip()
# sentences and words in order
sent_texts = re.findall(r"[^.?!]+[.?!]", script)
words = []
for si, st in enumerate(sent_texts):
    for w in st.split():
        words.append({"w": w, "n": norm(w), "sent": si})
seen = {}
for x in words:
    seen[x["n"]] = seen.get(x["n"], 0) + 1
    x["key"] = "w:" + x["n"] + (str(seen[x["n"]]) if seen[x["n"]] > 1 else "")

wh = json.load(open(whisper_path))
a = [x["n"] for x in words]; b = [norm(x["w"]) for x in wh]
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            words[i1 + k]["start"] = wh[j1 + k]["start"]; words[i1 + k]["end"] = wh[j1 + k]["end"]; words[i1 + k]["src"] = "whisper"
    elif tag == "replace" and (i2 - i1) == (j2 - j1):
        for k in range(i2 - i1):
            words[i1 + k]["start"] = wh[j1 + k]["start"]; words[i1 + k]["end"] = wh[j1 + k]["end"]; words[i1 + k]["src"] = "whisper~" + wh[j1 + k]["w"]
    elif tag == "replace":
        t0, t1 = wh[j1]["start"], wh[j2 - 1]["end"]; n = i2 - i1
        for k in range(n):
            words[i1 + k]["start"] = t0 + (t1 - t0) * k / n; words[i1 + k]["end"] = t0 + (t1 - t0) * (k + 1) / n; words[i1 + k]["src"] = "spread"
# interpolate missing (inserted script words whisper did not hear)
for i, x in enumerate(words):
    if "start" not in x:
        j = i
        while j < len(words) and "start" not in words[j]: j += 1
        t0 = words[i - 1]["end"] if i > 0 else 0.0
        t1 = words[j]["start"] if j < len(words) else t0 + 0.3 * (j - i)
        n = j - i
        for k in range(n):
            words[i + k]["start"] = t0 + (t1 - t0) * k / n; words[i + k]["end"] = t0 + (t1 - t0) * (k + 1) / n; words[i + k]["src"] = "interp"

# optional: replace whisper's internal timings with the wav2vec2 CTC forced alignment (vo_ctc_align.py), which
# tracks the acoustics far better inside sentences; CTC first-character frames land ~30 ms late, hence SHIFT
for x in words: x["w_start"], x["w_end"] = x["start"], x["end"]
if ctcp:
    cw = [w for sgl in json.load(open(ctcp)) for w in sgl["words"]]
    assert [norm(w["w"]) for w in cw] == [x["n"] for x in words], "CTC words differ from the script"
    for x, w in zip(words, cw):
        x["c_start"], x["c_end"] = w["start"], w["end"]
        x["start"], x["end"] = w["start"] + SHIFT, w["end"]; x["src"] = "ctc"

# silences
log = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", mp3, "-af", f"silencedetect=noise={noise}dB:d={dmin}", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3], capture_output=True, text=True).stdout)
starts = [float(v) for v in re.findall(r"silence_start: ([-0-9.]+)", log)]
ends = [float(v) for v in re.findall(r"silence_end: ([-0-9.]+)", log)]
sil = []
for k, s0 in enumerate(starts):
    s1 = ends[k] if k < len(ends) else dur
    sil.append((max(0.0, s0), s1))
# speech envelope (10 ms window, 5 ms hop) to check the detector's edges: a click inside a pause can end a silence
# early (e.g. a -60 dB tick); the real onset is the first 15 ms run above -45 dB
import numpy as np
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
au = np.frombuffer(raw, np.float32); nfr = len(au) // 80
env = np.array([10 * np.log10((au[max(0, i * 80 - 80):i * 80 + 80] ** 2).mean() + 1e-12) for i in range(nfr)])
def onset_after(t, th=-45.0):
    i = int(t * 200)
    while i < nfr and env[i] > th: i += 1          # leave the decaying tail
    while i + 3 < nfr and not (env[i:i + 3] > th).all(): i += 1
    return i * 0.005
fixed_sil = []
for s0, s1 in sil:
    if s1 < dur - 0.01:
        on = onset_after(s0)
        if on - s1 > 0.05:
            print(f"note: silence {s0:.3f}-{s1:.3f} ends on a click; speech resumes at {on:.3f}", file=sys.stderr); s1 = on
    fixed_sil.append((s0, s1))
sil = fixed_sil
lead = sil[0][1] if sil and sil[0][0] <= 0.01 else 0.0
inner = [s for s in sil if s[0] > 0.01 and s[1] < dur - 0.01]
tail = next((s[0] for s in sil if s[1] >= dur - 0.01), dur)

# assign each inner silence to a word gap: distance between the silence and the aligner's gap [end_i, start_i+1]
# (0 when they overlap); punctuation gaps (sentence ends, commas) win ties; one silence per gap
def gdist(s0, s1, i):
    g0, g1 = min(words[i]["end"], words[i + 1]["start"]), max(words[i]["end"], words[i + 1]["start"])
    return max(0.0, s0 - g1, g0 - s1)
punct = lambda i: 0 if words[i]["sent"] != words[i + 1]["sent"] else (1 if words[i]["w"][-1] in ",;:" else 2)
assigned = {}
for s0, s1 in inner:
    cands = sorted((round(gdist(s0, s1, i), 2), punct(i), i) for i in range(len(words) - 1))
    for d, _, i in cands:
        if i not in assigned:
            assigned[i] = (s0, s1); break
for i, (s0, s1) in assigned.items():
    words[i]["end"] = s0; words[i + 1]["start"] = s1
    words[i]["snap_end"] = True; words[i + 1]["snap_start"] = True
if lead == 0.0:  # no detected leading silence (shorter than d): the first 15 ms run above -45 dB
    lead = onset_after(0.0)
words[0]["start"] = lead; words[0]["snap_start"] = True
words[-1]["end"] = tail; words[-1]["snap_end"] = True

# every sentence boundary must be a detected pause
missing = [words[i]["key"] for i in range(len(words) - 1) if words[i]["sent"] != words[i + 1]["sent"] and i not in assigned]
if missing: print("WARNING: no pause found after", missing, file=sys.stderr)

# manual corrections, each read off the envelope / spectrogram (vo_env.py, vo_onsets.py, vo_spectro.py)
fx = json.load(open(fixp)) if fixp else {}
idx = {x["key"]: i for i, x in enumerate(words)}
for k, v in fx.items():
    if k.startswith("_"): continue
    if "start" in v:
        words[idx[k]]["start"] = v["start"]; words[idx[k]]["src"] += "+fix"

# inside a speech run a word ends where the next begins
for i in range(len(words) - 1):
    if not words[i].get("snap_end"): words[i]["end"] = words[i + 1]["start"]
for k, v in fx.items():
    if not k.startswith("_") and "end" in v: words[idx[k]]["end"] = v["end"]

# keep times monotonic and non-overlapping inside snapped segments
for i in range(len(words)):
    x = words[i]
    if i > 0 and x["start"] < words[i - 1]["end"] - 1e-6:
        # overlap from snapping: split the difference at the snapped side
        if x.get("snap_start"): words[i - 1]["end"] = x["start"]
        else: x["start"] = words[i - 1]["end"]
    if x["end"] <= x["start"] + 0.04: x["end"] = x["start"] + 0.06

full = [{"w": x["w"], "key": x["key"], "start": round(x["start"], 3), "end": round(x["end"], 3)} for x in words]
json.dump([{k: (round(v, 3) if isinstance(v, float) else v) for k, v in x.items()} for x in words], open(f"{outdir}/align_debug.json", "w"), indent=1)
json.dump(full, open(f"{outdir}/words_full.json", "w"), indent=1)
json.dump({x["key"]: round(x["start"], 2) for x in words}, open(f"{outdir}/words.json", "w"), indent=1)
sents = []
for si, st in enumerate(sent_texts):
    ws = [x for x in words if x["sent"] == si]
    s, e = ws[0]["start"], ws[-1]["end"]
    nxt = next((x["start"] for x in words if x["sent"] == si + 1), dur)
    sents.append({"i": si + 1, "text": st.strip(), "start": round(s, 3), "end": round(e, 3), "pause_after": round(nxt - e, 3),
                  "first_key": ws[0]["key"], "last_key": ws[-1]["key"]})
json.dump(sents, open(f"{outdir}/sentences.json", "w"), indent=1)
for x in words:
    print(f"{x['key']:18s} {x['start']:7.3f} {x['end']:7.3f}  wh {x['w_start']:6.2f} ctc {x.get('c_start', -1):6.2f}  {x.get('src','')}{' S' if x.get('snap_start') else ''}{' E' if x.get('snap_end') else ''}")
print("silences:", [(round(a, 3), round(b, 3)) for a, b in sil])
