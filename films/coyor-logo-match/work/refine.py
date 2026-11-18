import json,numpy as np
from PIL import Image
from scipy import ndimage as ndi
L=json.load(open('logos.json'));D='../../coyor-fashion/harvest/img/'
out=[]
for e in L:
    if e.get('serif'): out.append(e);continue
    a=np.asarray(Image.open(D+e['file']).convert('RGB')).astype(float)
    r=int(e['w']*1.6);cx,cy=e['cx'],e['cy']
    x0,x1=max(0,cx-r),min(a.shape[1],cx+r);y0,y1=max(0,cy-r),min(a.shape[0],cy+r)
    win=a[y0:y1,x0:x1]
    ring=np.concatenate([win[:6].reshape(-1,3),win[-6:].reshape(-1,3),win[:,:6].reshape(-1,3),win[:,-6:].reshape(-1,3)])
    bg=np.median(ring,0)
    m=np.abs(win-bg).sum(2)>70
    m=ndi.binary_closing(m,iterations=4);m=ndi.binary_fill_holes(m)
    lab,n=ndi.label(m)
    if n==0: print('none',e);out.append(e);continue
    # component containing/closest to estimate centre
    ec=lab[cy-y0,cx-x0] if 0<=cy-y0<lab.shape[0] and 0<=cx-x0<lab.shape[1] else 0
    if ec==0:
        sizes=ndi.sum(m,lab,range(1,n+1));ec=1+int(np.argmax(sizes))
    ys,xs=np.where(lab==ec)
    bx=(xs.min()+xs.max())/2+x0;by=(ys.min()+ys.max())/2+y0;bw=xs.max()-xs.min()+1
    print(e['file'][:25],(e['cx'],e['cy'],e['w']),'->',round(bx),round(by),bw)
    out.append(dict(file=e['file'],cx=round(bx),cy=round(by),w=int(bw)))
json.dump(out,open('logos_r.json','w'),indent=1)
