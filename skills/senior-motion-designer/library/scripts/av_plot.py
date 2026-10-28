# Picture of sound against motion for a vault note: the frame-to-frame change (blue) and the sound onsets (orange)
# over a time window, with a tick at every frame and the frame numbers, plus the frames around one hit underneath.
#   python3 av_plot.py film.mp4 out.png --from 8.8 --to 10.6 --hit 292 [--frames 5]
import sys, os, subprocess, tempfile, wave, cv2, numpy as np
def opt(n, d): return sys.argv[sys.argv.index(n) + 1] if n in sys.argv else d
film, out = sys.argv[1], sys.argv[2]; t0, t1 = float(opt("--from", 0)), float(opt("--to", 3)); hit = int(opt("--hit", -1)); k = int(opt("--frames", 5))
wav = os.path.join(tempfile.mkdtemp(), "a.wav"); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", film, "-vn", "-ac", "1", "-ar", "22050", wav], check=True)
cap = cv2.VideoCapture(film); fps = cap.get(cv2.CAP_PROP_FPS) or 30; f0, f1 = int(t0 * fps), int(t1 * fps)
cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, f0 - 1)); prev = None; d = []; frames = {}
for f in range(max(0, f0 - 1), f1 + 1):
    ok, im = cap.read()
    if not ok: break
    if hit >= 0 and abs(f - hit) <= k: frames[f] = im
    g = cv2.cvtColor(cv2.resize(im, (160, 90)), cv2.COLOR_BGR2GRAY).astype(np.float32)
    if prev is not None: d.append(float(np.abs(g - prev).mean()))
    prev = g
w = wave.open(wav); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
flux = []; last = None
for f in range(f0 - 1, f0 + len(d)):
    c = int(f * sr / fps); seg = x[c:c + 1024]; seg = np.pad(seg, (0, 1024 - len(seg)))
    m = np.abs(np.fft.rfft(seg * np.hanning(1024)))
    if last is not None: flux.append(float(np.maximum(m - last, 0).sum()))
    last = m
d, flux = np.array(d), np.array(flux); W, H = 1600, 260; img = np.full((H, W, 3), 255, np.uint8); n = len(d)
for i in range(n):
    x0 = int(i * W / n); cv2.line(img, (x0, H - 30), (x0, H - 24), (180, 180, 180), 1)
    if (f0 + i) % 5 == 0: cv2.putText(img, f"f{f0 + i}", (x0 + 2, H - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (90, 90, 90), 1)
for arr, col, base in ((d, (200, 120, 40), H - 40), (flux, (40, 140, 240), H - 40)):
    a = arr / (arr.max() + 1e-9) * (H - 70); pts = np.array([[int(i * W / n), int(base - v)] for i, v in enumerate(a)], np.int32)
    cv2.polylines(img, [pts], False, col, 2, cv2.LINE_AA)
if hit >= 0: xh = int((hit - f0) * W / n); cv2.line(img, (xh, 10), (xh, H - 30), (0, 0, 200), 1)
cv2.putText(img, "blue: motion per frame   orange: sound onsets   red: the visual hit", (8, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (60, 60, 60), 1, cv2.LINE_AA)
rows = [img]
if frames:
    tw = W // len(frames); tiles = []
    for f in sorted(frames):
        t = cv2.resize(frames[f], (tw, int(tw * frames[f].shape[0] / frames[f].shape[1])))
        cv2.rectangle(t, (0, 0), (90, 16), (255, 255, 255), -1); cv2.putText(t, f"f{f}" + (" HIT" if f == hit else ""), (3, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 200), 1)
        tiles.append(t)
    strip = np.hstack(tiles); strip = cv2.copyMakeBorder(strip, 0, 0, 0, W - strip.shape[1], cv2.BORDER_CONSTANT, value=(255, 255, 255)); rows.append(strip)
cv2.imwrite(out, np.vstack(rows))
