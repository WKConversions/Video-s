# Lists the stretches of a render where less than X% of the frame moves (the frames that pull the median down).
#   python3 motion_segments.py film.mp4 [threshold%=4] [min_frames=6]
import sys, cv2, numpy as np
cap = cv2.VideoCapture(sys.argv[1]); fps = cap.get(cv2.CAP_PROP_FPS) or 30
th = float(sys.argv[2]) if len(sys.argv) > 2 else 4.0; mn = int(sys.argv[3]) if len(sys.argv) > 3 else 6
prev, fr = None, []
while True:
    ok, f = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(f, (160, 90), interpolation=cv2.INTER_LINEAR), cv2.COLOR_BGR2GRAY).astype(np.int16)
    if prev is not None: fr.append((np.abs(g.astype(np.float32) - prev) > 6).mean() * 100)
    prev = g
fr = np.array(fr); low = fr < th
print(f"median {np.median(fr):.2f}%  frames below {th}%: {low.mean()*100:.0f}%")
i = 0
while i < len(fr):
    if low[i]:
        j = i
        while j < len(fr) and low[j]: j += 1
        if j - i >= mn: print(f"  {(i+1)/fps:6.2f}-{(j+1)/fps:6.2f}s  {j-i:3d} frames  mean {fr[i:j].mean():.2f}%")
        i = j
    else: i += 1
