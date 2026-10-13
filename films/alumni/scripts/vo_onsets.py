# For each word: a compact 10 ms envelope strip around its start (broadband level 0-9 and a high-band fricative mark),
# to judge onsets by eye.   python3 vo_onsets.py vo.mp3 words_full.json [pre_s] [post_s]
import json, subprocess, sys
import numpy as np
src, wp = sys.argv[1], sys.argv[2]; PRE = float(sys.argv[3]) if len(sys.argv) > 3 else 0.15; POST = float(sys.argv[4]) if len(sys.argv) > 4 else 0.08
SR = 16000; hop = 160; win = 400
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32); n = len(x) // hop
fq = np.fft.rfftfreq(win, 1 / SR); pad = np.pad(x, (win // 2, win))
fr = np.stack([pad[i * hop:i * hop + win] for i in range(n)])
sp = np.abs(np.fft.rfft(fr * np.hanning(win), axis=1)) ** 2
rms = 10 * np.log10((fr ** 2).mean(1) + 1e-12)
lf = 10 * np.log10(sp[:, (fq >= 80) & (fq < 900)].sum(1) + 1e-12); hf = 10 * np.log10(sp[:, (fq >= 3500) & (fq < 8000)].sum(1) + 1e-12)
lvl = lambda v: str(int(np.clip((v + 60) / 4.5, 0, 9)))
for w in json.load(open(wp)):
    c = w["start"]; a = int(round((c - PRE) * 100)); b = int(round((c + POST) * 100))
    s1 = "".join(("|" if i == int(round(c * 100)) else "") + lvl(rms[i]) for i in range(max(0, a), min(n, b)))
    s2 = "".join(("|" if i == int(round(c * 100)) else "") + ("f" if hf[i] - lf[i] > -5 and rms[i] > -45 else ".") for i in range(max(0, a), min(n, b)))
    print(f"{w['key']:16s} {c:6.2f}  {s1}\n{'':24s}{s2}")
