"""Track a planar screen quad through a clip: LK optical flow on features in a mask polygon, a RANSAC homography
from frame 0 to each frame (chained frame to frame), lightly smoothed. Writes JSON: {"w","h","quads":[[TL,TR,BR,BL],...]}.
usage: python3 track_quad.py clip.mp4 out.json "x,y x,y x,y x,y" "mask polygon x,y ..." """
import sys, json, cv2, numpy as np
clip, out, quad_s, mask_s = sys.argv[1:5]
quad = np.array([[float(v) for v in p.split(",")] for p in quad_s.split()], np.float32)
poly = np.array([[int(float(v)) for v in p.split(",")] for p in mask_s.split()], np.int32)
cap = cv2.VideoCapture(clip); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY))
h, w = frames[0].shape
mask = np.zeros((h, w), np.uint8); cv2.fillPoly(mask, [poly], 255)
H = np.eye(3); Hs = [H.copy()]
prev = frames[0]; pts = cv2.goodFeaturesToTrack(prev, 600, 0.01, 12, mask=mask)
for g in frames[1:]:
    nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, pts, None, winSize=(31, 31), maxLevel=4)
    good0, good1 = pts[st[:, 0] == 1], nxt[st[:, 0] == 1]
    M, inl = cv2.findHomography(good0, good1, cv2.RANSAC, 2.0)
    H = M @ H; Hs.append(H.copy())
    # re-seed features in the mask moved with the quad
    m2 = cv2.warpPerspective(mask, H, (w, h))
    pts = cv2.goodFeaturesToTrack(g, 600, 0.01, 12, mask=m2); prev = g
qs = np.array([cv2.perspectiveTransform(quad[None], Hm)[0] for Hm in Hs])
# smooth (centred moving average, 5 frames) to remove tracker jitter
k = 5; pad = np.pad(qs, ((k // 2, k // 2), (0, 0), (0, 0)), mode="edge")
sm = np.array([pad[i:i + k].mean(0) for i in range(len(qs))])
json.dump({"w": w, "h": h, "quads": np.round(sm, 2).tolist()}, open(out, "w"))
d = sm[-1] - sm[0]; print(len(qs), "frames; corner drift first→last:", np.round(d, 1).tolist())
