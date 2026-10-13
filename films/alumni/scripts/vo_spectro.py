# Spectrogram strips of the voice-over with word boundaries drawn on, for checking an alignment by eye.
#   python3 vo_spectro.py vo.mp3 words_full.json out_prefix [--sec 6] [--pps 160]
import json, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw
args = sys.argv[1:]
def opt(n, d):
    if n in args:
        i = args.index(n); v = args[i + 1]; del args[i:i + 2]; return v
    return d
ALT = opt("--alt", None); SEC = float(opt("--sec", 6)); PPS = int(opt("--pps", 160)); T0 = float(opt("--t0", 0)); T1 = float(opt("--t1", 1e9))
mp3, wpath, prefix = args
SR = 16000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
hop = int(round(SR / PPS)); PPS = SR / hop; win = 512
pad = np.pad(x, (win // 2, win // 2))
nfr = (len(x)) // hop
idx = np.arange(win)[None, :] + hop * np.arange(nfr)[:, None]
fr = pad[idx] * np.hanning(win)[None, :]
S = np.abs(np.fft.rfft(fr, axis=1))[:, :int(8000 / (SR / win))]
db = 20 * np.log10(S + 1e-6); db = np.clip((db - (db.max() - 80)) / 80, 0, 1)
rms = 20 * np.log10(np.sqrt((x[idx[:, :win] - 0] ** 2 if False else (pad[idx] ** 2)).mean(1)) + 1e-9)
fq = np.fft.rfftfreq(win, 1 / SR)[:S.shape[1]]
band = lambda lo, hi: 10 * np.log10((S[:, (fq >= lo) & (fq < hi)] ** 2).sum(1) + 1e-9)
LF, HF = band(80, 900), band(3500, 8000)
LF -= LF.max(); HF -= LF.max() if False else HF.max()
H = 200; RH = 60; LH = 34
words = json.load(open(wpath))
dur = len(x) / SR
t = max(0, T0); n = 0
while t < min(dur, T1):
    t1 = min(t + SEC, dur, T1); f0, f1 = int(t * PPS), int(t1 * PPS)
    spec = (255 * (1 - db[f0:f1].T[::-1])).astype(np.uint8)
    im = Image.fromarray(spec).resize((f1 - f0, H)).convert("RGB")
    canvas = Image.new("RGB", (f1 - f0 + 40, H + RH + LH * 2 + 20), "white"); canvas.paste(im, (40, LH))
    d = ImageDraw.Draw(canvas)
    # rms curve (-60..0 dB)
    r = rms[f0:f1]; y0 = LH + H
    pts = [(40 + i, y0 + RH - int(np.clip((v + 60) / 60, 0, 1) * RH)) for i, v in enumerate(r)]
    for arr, col in ((LF, (0, 150, 0)), (HF, (220, 90, 0))):
        d.line([(40 + i, y0 + RH - int(np.clip((v + 60) / 60, 0, 1) * RH)) for i, v in enumerate(arr[f0:f1])], fill=col)
    d.line(pts, fill=(0, 0, 160)); d.line([(40, y0 + RH - int(25 / 60 * RH)), (40 + f1 - f0, y0 + RH - int(25 / 60 * RH))], fill=(200, 200, 255))
    # seconds ticks
    for s in np.arange(np.ceil(t * 10) / 10, t1, 0.1):
        xx = 40 + int((s - t) * PPS); big = abs(s - round(s)) < 1e-6
        d.line([(xx, H + LH + RH), (xx, H + LH + RH + (10 if big else 4))], fill="black")
        if big or PPS >= 300: d.text((xx + 2, H + LH + RH + 6), f"{s:.1f}", fill="black" if big else (90, 90, 90))
    for k, w in enumerate(words):
        if w["end"] < t or w["start"] > t1: continue
        xs = 40 + int((w["start"] - t) * PPS); xe = 40 + int((w["end"] - t) * PPS)
        d.line([(xs, LH - 4), (xs, LH + H + RH)], fill=(0, 170, 0), width=1)
        d.line([(xe, LH + 10), (xe, LH + H)], fill=(220, 0, 0), width=1)
        d.text((xs + 2, 2 + (k % 2) * 14), w["w"], fill=(0, 110, 0))
    if ALT:
        for k, w in enumerate(json.load(open(ALT))):
            if w["start"] < t or w["start"] > t1: continue
            xs = 40 + int((w["start"] - t) * PPS)
            d.line([(xs, LH + H // 2), (xs, LH + H + RH)], fill=(230, 0, 230), width=2)
            d.text((xs + 2, LH + H + RH + 20 + (k % 2) * 12), w["w"], fill=(200, 0, 200))
    d.text((2, LH), f"{t:.1f}", fill="black")
    canvas.save(f"{prefix}_{n:02d}.png"); print(f"{prefix}_{n:02d}.png", f"{t:.2f}-{t1:.2f}")
    t = t1; n += 1
