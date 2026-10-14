# Overlay sheets for the whole film: for every half second, the reference and ours blended 50/50 (left) and their
# edges (right: reference red, ours cyan, both white), ten moments a sheet.
#   python3 overlay_sheets.py ref.mp4 ours.mp4 outdir [duration_s]
import subprocess, sys, os
import numpy as np, cv2
ref, ours, out = sys.argv[1:4]
DUR = float(sys.argv[4]) if len(sys.argv) > 4 else 42.0
os.makedirs(out, exist_ok=True)
W, Hh = 480, 270
def grab(path, t):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", path, "-frames:v", "1", "-vf", f"scale={W * 2}:{Hh * 2}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(Hh * 2, W * 2, 3) if len(raw) == W * Hh * 12 else np.zeros((Hh * 2, W * 2, 3), np.uint8)
def edges(im):
    return cv2.Canny(cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), (3, 3), 0), 40, 120)
for s in range(int(DUR // 5) + 1):
    sheet = np.full((5 * (Hh + 18), 4 * W, 3), 20, np.uint8)
    for i in range(10):
        t = s * 5 + i * 0.5
        if t > DUR - 0.05: break
        a, b = grab(ref, t + 0.02), grab(ours, t + 0.02)
        blend = cv2.resize(cv2.addWeighted(a, 0.5, b, 0.5, 0), (W, Hh))
        ea, eb = edges(a), edges(b)
        ed = np.zeros_like(a); ed[ea > 0] = (60, 60, 255); ed[eb > 0] = (255, 220, 60); ed[(ea > 0) & (eb > 0)] = (255, 255, 255)
        ed = cv2.resize(ed, (W, Hh), interpolation=cv2.INTER_AREA)
        x, y = (i % 2) * 2 * W, (i // 2) * (Hh + 18)
        sheet[y + 18:y + 18 + Hh, x:x + W] = blend; sheet[y + 18:y + 18 + Hh, x + W:x + 2 * W] = ed
        cv2.putText(sheet, f"{t:.1f}s blend | edges (ref red, ours cyan)", (x + 4, y + 13), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 220, 255), 1)
    cv2.imwrite(f"{out}/ov_{s:02d}.jpg", sheet, [cv2.IMWRITE_JPEG_QUALITY, 86])
print("ok")
