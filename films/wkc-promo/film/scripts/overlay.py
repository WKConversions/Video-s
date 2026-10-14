# Overlay check: our still against the reference frame, both at 1920x1080.
#   python3 scripts/overlay.py OUR.png FRAME [out.jpg]
# Writes a 2x2 sheet: reference | ours / 50 % blend | edges (reference red, ours cyan, both white), and prints the
# foreground boxes of both (bright or dark things against the background) and the best global shift (phase correlation).
import sys, cv2, numpy as np
ours_p, n = sys.argv[1], int(sys.argv[2])
out = sys.argv[3] if len(sys.argv) > 3 else ours_p.replace(".png", "_ov.jpg")
ref = cv2.resize(cv2.imread(f"/home/user/Video-s/films/wkc-promo/ref/frames/f{n:04d}.jpg"), (1920, 1080), interpolation=cv2.INTER_CUBIC)
ours = cv2.imread(ours_p)
blend = cv2.addWeighted(ref, 0.5, ours, 0.5, 0)
def edges(im):
    g = cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), (3, 3), 0)
    return cv2.Canny(g, 40, 120)
er, eo = edges(ref), edges(ours)
ed = np.zeros_like(ref)
ed[er > 0] = (60, 60, 255); ed[eo > 0] = (255, 220, 60); ed[(er > 0) & (eo > 0)] = (255, 255, 255)
sheet = np.vstack([np.hstack([ref, ours]), np.hstack([blend, ed])])
cv2.imwrite(out, cv2.resize(sheet, (1920, 1080)), [cv2.IMWRITE_JPEG_QUALITY, 88])
def boxes(im):
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
    bg = cv2.medianBlur(g.astype(np.uint8), 61).astype(np.float32)
    m = (np.abs(g - bg) > 40).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 25), np.uint8))
    k, lab, st, _ = cv2.connectedComponentsWithStats(m)
    bs = [tuple(int(v) for v in st[i][:4]) for i in range(1, k) if st[i][4] > 400]
    return sorted(bs, key=lambda b: -b[2] * b[3])[:8]
(dx, dy), resp = cv2.phaseCorrelate(np.float32(cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY)), np.float32(cv2.cvtColor(ours, cv2.COLOR_BGR2GRAY)))
print(f"frame {n}: shift ours vs ref dx={dx:+.1f} dy={dy:+.1f} (response {resp:.2f})")
print("ref  boxes x,y,w,h:", boxes(ref))
print("ours boxes x,y,w,h:", boxes(ours))
print("sheet:", out)
