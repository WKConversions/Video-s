import cv2, numpy as np, json
ref = cv2.cvtColor(cv2.imread('full/f230.png'), cv2.COLOR_BGR2GRAY)
orb = cv2.ORB_create(4000); k2, d2 = orb.detectAndCompute(ref, None); bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
out = {}
for n in range(150, 243):
    g = cv2.cvtColor(cv2.imread(f'full/f{n:03d}.png'), cv2.COLOR_BGR2GRAY)
    k1, d1 = orb.detectAndCompute(g, None)
    if d1 is None: print(n, 'none'); continue
    mt = sorted(bf.match(d2, d1), key=lambda x: x.distance)[:600]
    p_ref = np.float32([k2[x.queryIdx].pt for x in mt]); p_n = np.float32([k1[x.trainIdx].pt for x in mt])
    M, inl = cv2.estimateAffinePartial2D(p_ref, p_n, ransacReprojThreshold=2.0)
    ni = int(inl.sum()) if inl is not None else 0
    out[n] = (M.tolist() if M is not None else None, ni)
    if n % 6 == 0 or n > 232: print(n, ni, None if M is None else np.round([M[0,0], M[0,2], M[1,2]], 3).tolist())
json.dump(out, open('track.json', 'w'))
