import cv2, numpy as np, sys
from psd_tools import PSDImage
from PIL import Image
psd = PSDImage.open('/home/user/Video-s/films/mexico-social/source/mexico_pre_merge_V2.psd')
L = {l.name: l for l in psd.descendants()}
def comp(names):
    im = psd.composite(layer_filter=lambda l: (l.name in names) or (l.is_group() and l.name == 'Group 1' and 'Group 1' in names))
    return im.convert('RGBA')
comp(['Layer 0']).save('psd_map.png')
comp(['Group 1', 'Ellipse 1', 'Layer 1']).save('psd_logo.png')
comp(['Ellipse 1 copy', 'Weathered Athena Statue with Shield and Spear', 'AdobeStock_815398030 copy', 'AdobeStock_815398030 copy 2', 'AdobeStock_815398030 copy 3', 'Weathered Athena Statue with Shield and Spear copy']).save('psd_statue.png')
m = np.asarray(Image.open('psd_map.png')); a = m[..., 3:4] / 255.0
psdg = (m[..., :3] * a + 255 * (1 - a)).astype(np.uint8)
psdg = cv2.cvtColor(psdg, cv2.COLOR_RGB2GRAY)
ref = cv2.cvtColor(cv2.imread('full/f230.png'), cv2.COLOR_BGR2GRAY)
orb = cv2.ORB_create(6000)
k1, d1 = orb.detectAndCompute(psdg, None); k2, d2 = orb.detectAndCompute(ref, None)
mt = sorted(cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True).match(d1, d2), key=lambda x: x.distance)[:800]
p1 = np.float32([k1[x.queryIdx].pt for x in mt]); p2 = np.float32([k2[x.trainIdx].pt for x in mt])
A, inl = cv2.estimateAffine2D(p1, p2, ransacReprojThreshold=2.5)
S_, inl2 = cv2.estimateAffinePartial2D(p1, p2, ransacReprojThreshold=2.5)
print('full affine', np.round(A, 4).tolist(), 'inliers', int(inl.sum()))
print('similarity', np.round(S_, 4).tolist(), 'inliers', int(inl2.sum()))
np.save('A_psd2ref.npy', A); np.save('S_psd2ref.npy', S_)
