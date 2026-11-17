import numpy as np, cv2
from PIL import Image
D='/tmp/claude-0/-home-user-Video-s/1b338aa5-0d41-5df7-93ad-fbe415aea70d/scratchpad/mx/full/f%03d.png'
O='/home/user/Video-s/films/mexico-social/work/line/f%03d.png'
L=lambda f:np.array(Image.open(D%f).convert('RGB')).astype(int)
a=L(234)
mn=a.min(2)
# path fit
pts=[];cols=[]
for y in range(180,426):
    xs=np.nonzero(mn[y,1195:]<246)[0]+1195
    if y>=428: xs=[x for x in xs if a[y,x,1]-a[y,x,2]>=20]
    if len(xs)==0: continue
    w=255-mn[y,xs]; pts.append((y,(xs*w).sum()/w.sum()))
    j=xs[np.argmin(mn[y,xs])]; cols.append(a[y,j])
pts=np.array(pts); P=np.poly1d(np.polyfit(pts[:,0],pts[:,1],4))
print('fit err',np.abs(P(pts[:,0])-pts[:,1]).max())
col=np.median(np.array(cols[20:-20]),0); print('col',col)
# ball
def ball(f,im=None):
    im=L(f) if im is None else im
    m=(im[...,1]-im[...,2]>=100)&(im[...,2]<120); m[:, :1195]=0; m[440:]=0
    ys,xs=np.nonzero(m)
    if len(ys)<4: return None
    return xs.mean(),ys.mean(),len(ys)
print('ball234',ball(234))
bc=np.array([160,201,74.])
Y0=438.
def render(f,T,s,head):
    im=L(f).copy(); H,W=im.shape[:2]
    # erase
    yy=np.arange(432.,0,-1.0)
    path=np.stack([P(yy),yy],1)
    pw=cv2.transform(path[None].astype(np.float32),T)[0]
    er=np.zeros((H,W),np.uint8)
    cv2.polylines(er,[np.round(pw).astype(np.int32)],False,255,int(round(20*s)))
    cb=cv2.transform(np.array([[[1337.5,head]]],np.float32),T)[0,0]
    cv2.circle(er,(int(round(cb[0])),int(round(cb[1]))),int(round(14*s)),255,-1)
    # keep where far from the map tip region unless saturated
    nonw=im.min(2)<255
    ys,xs=np.mgrid[:H,:W]
    sat=(im[...,1]-im[...,2])>=25
    mapzone=(ys>=428*s+ (T[1,2]*0)) # approx, unwarped when s=1
    if s==1 and T[0,0]==1: protect=(ys>=428)&~sat
    else: protect=np.zeros((H,W),bool)
    kill=(er>0)&nonw&~protect&(xs>=1196)
    im[kill]=255
    # draw
    SS=4
    lay=np.zeros((H*0+520,W*SS//1,3),np.float32)
    cv2_h=520
    A=np.zeros((cv2_h*SS,W*SS),np.uint8)
    hy=np.arange(Y0,head-0.5,-1.0)
    path=np.stack([P(hy),hy],1)
    pw=cv2.transform(path[None].astype(np.float32),T)[0]
    cv2.polylines(A,[np.round(pw*SS).astype(np.int32)],False,255,int(round(3.0*s*SS)),cv2.LINE_8)
    C=np.zeros_like(A); 
    ctr=np.array([[[P(head),head]]],np.float32); ctr=cv2.transform(ctr,T)[0,0]
    cv2.circle(C,(int(round(ctr[0]*SS)),int(round(ctr[1]*SS))),int(round(5.5*s*SS)),255,-1)
    al=cv2.resize(A,(W,cv2_h),interpolation=cv2.INTER_AREA)/255.
    bl=cv2.resize(C,(W,cv2_h),interpolation=cv2.INTER_AREA)/255.
    if f < 215: bl = bl*0   # lead: as in the original, the ball appears only when the line completes (frame 215)
    reg=im[:cv2_h].astype(float)
    reg=reg*(1-al[...,None])+col*al[...,None]
    reg=reg*(1-bl[...,None])+bc*bl[...,None]
    im[:cv2_h]=np.round(reg)
    Image.fromarray(im.astype(np.uint8)).save(O%f)
I=np.float32([[1,0,0],[0,1,0]])
heads={}
for f in range(199,236):
    b=ball(f)
    if b is None:
        im=L(f); m=im.min(2)<246; m[:, :1195]=0; m[440:]=0; ys=np.nonzero(m)[0]; hy=ys.min()+6 if len(ys) else None
    else: hy=b[1]
    heads[f]=hy
print(heads)
for f,h in heads.items():
    if h is not None and h<438: render(f,I,1,h)
# zoom frames
ref=cv2.cvtColor(a.astype(np.uint8),cv2.COLOR_RGB2GRAY)
orb=cv2.ORB_create(3000)
k1,d1=orb.detectAndCompute(ref,None)
bf=cv2.BFMatcher(cv2.NORM_HAMMING,crossCheck=True)
for f in range(235,241):
    im=L(f).astype(np.uint8); g=cv2.cvtColor(im,cv2.COLOR_RGB2GRAY)
    k2,d2=orb.detectAndCompute(g,None)
    ms=bf.match(d1,d2)
    s1=np.float32([k1[m.queryIdx].pt for m in ms]); s2=np.float32([k2[m.trainIdx].pt for m in ms])
    T,inl=cv2.estimateAffinePartial2D(s1,s2,ransacReprojThreshold=2)
    s=np.hypot(T[0,0],T[1,0]); print(f,T.round(3).tolist(),inl.sum(),ball(f))
    render(f,T.astype(np.float32),s,162.33)
