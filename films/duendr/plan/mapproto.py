# Prototype of the curved-globe map (the TS version in film/src/globe.ts follows the same math).
import json, math, sys
from PIL import Image, ImageDraw
G=[g for g in json.load(open('film/src/geo.json')) if g['c'] in ('Spain','Portugal','Morocco','Gibraltar','Algeria')]
CITIES={'Málaga':(-4.4214,36.7213),'Marbella':(-4.8826,36.5101),'Estepona':(-5.1460,36.4277),'Fuengirola':(-4.6247,36.5398),'Torremolinos':(-4.4999,36.6203),
        'Nerja':(-3.8787,36.7580),'Sotogrande':(-5.2847,36.2867),'Ronda':(-5.1670,36.7462),'Sevilla':(-5.9845,37.3891),'Granada':(-3.5986,37.1773),'Cádiz':(-6.2886,36.5271)}
def view(lam0,phi0,k,pitch,d,S,cy_off):
    c0=math.cos(math.radians(phi0)); p=math.radians(pitch); zc=1/d+0.002
    def to3(lon,lat):
        u=math.radians(k*(lon-lam0)*c0); w=math.radians(k*(lat-phi0))
        X=math.cos(w)*math.sin(u); Y=math.sin(w); Z=math.cos(w)*math.cos(u)
        return (X, Y*math.cos(p)+Z*math.sin(p), -Y*math.sin(p)+Z*math.cos(p))
    yc=to3(lam0,phi0); yc=yc[1]/(d-yc[2])
    def pj(P): X,Y,Z=P; return (960+X/(d-Z)*S, 540+cy_off-(Y/(d-Z)-yc)*S)
    def boxclip(ring, B=(-8.6,-0.4,34.6,39.4)):   # clip the lon/lat ring to a box first (far points would wrap the magnified sphere)
        R=ring
        for axis,lim,keep_gt in [(0,B[0],True),(0,B[1],False),(1,B[2],True),(1,B[3],False)]:
            out=[]
            for i in range(len(R)):
                A,Bp=R[i-1],R[i]; ina=(A[axis]>=lim) if keep_gt else (A[axis]<=lim); inb=(Bp[axis]>=lim) if keep_gt else (Bp[axis]<=lim)
                if inb:
                    if not ina: t=(lim-A[axis])/(Bp[axis]-A[axis]); out.append([A[0]+(Bp[0]-A[0])*t, A[1]+(Bp[1]-A[1])*t])
                    out.append(Bp)
                elif ina: t=(lim-A[axis])/(Bp[axis]-A[axis]); out.append([A[0]+(Bp[0]-A[0])*t, A[1]+(Bp[1]-A[1])*t])
            R=out
            if not R: return []
        return R
    def clip(ring):   # Sutherland-Hodgman against Z >= zc, in 3D
        ring=boxclip(ring)
        if len(ring)<3: return []
        # densify long edges (box edges): a straight chord between far points dips under the sphere
        dense=[]
        for i in range(len(ring)):
            A,Bp=ring[i-1],ring[i]; n=max(1,int(max(abs(Bp[0]-A[0]),abs(Bp[1]-A[1]))/0.05))
            for j in range(1,n+1): dense.append([A[0]+(Bp[0]-A[0])*j/n, A[1]+(Bp[1]-A[1])*j/n])
        ring=dense
        P=[to3(lo,la) for lo,la in ring]; out=[]; rr=math.sqrt(1-zc*zc); pend=None
        def arc(E,N):   # walk the horizon from E to N through the top of the globe (the hidden side is beyond the horizon)
            a0=math.atan2(E[1],E[0]); a1=math.atan2(N[1],N[0]); top=math.pi/2
            def through_top(a,b,ccw):
                span=(b-a)%(2*math.pi) if ccw else (a-b)%(2*math.pi); off=(top-a)%(2*math.pi) if ccw else (a-top)%(2*math.pi); return off<=span
            ccwspan=(a1-a0)%(2*math.pi); span=ccwspan if ccwspan<=math.pi else ccwspan-2*math.pi   # the shorter way round
            n=max(2,int(abs(span)/0.01)); return [(rr*math.cos(a0+span*i/n), rr*math.sin(a0+span*i/n), zc) for i in range(1,n)]
        for i in range(len(P)):
            A,B=P[i-1],P[i]; ina,inb=A[2]>=zc,B[2]>=zc
            if inb:
                if not ina:
                    t=(zc-A[2])/(B[2]-A[2]); N=tuple(A[j]+(B[j]-A[j])*t for j in range(3))
                    if pend is not None: out.extend(arc(pend,N)); pend=None
                    out.append(N)
                out.append(B)
            elif ina:
                t=(zc-A[2])/(B[2]-A[2]); E=tuple(A[j]+(B[j]-A[j])*t for j in range(3)); out.append(E); pend=E
        if pend is not None and out:   # the ring ended outside: close along the horizon to the first point
            out.extend(arc(pend,out[0]))
        return [pj(q) for q in out]
    def pt(lon,lat): P=to3(lon,lat); return (*pj(P), P[2]>=zc)
    # the horizon circle: points on the sphere with Z = zc
    def horizon(n=240):
        r=math.sqrt(1-zc*zc); return [pj((r*math.cos(a), r*math.sin(a), zc)) for a in [2*math.pi*i/n for i in range(n)]]
    return clip, pt, horizon
def render(v):
    clip,pt,horizon=view(*v)
    im=Image.new('RGB',(1920,1080),(22,20,19)); dr=ImageDraw.Draw(im)
    dr.polygon(horizon(),fill=(30,27,25))
    for la in [x*0.25 for x in range(120,180)]:
        seg=[(x,y) for x,y,vv in [pt(lo*0.25,la) for lo in range(-60,20)] if vv]
        if len(seg)>1: dr.line(seg,fill=(46,42,39),width=2)
    for lo in [x*0.5 for x in range(-30,10)]:
        seg=[(x,y) for x,y,vv in [pt(lo,la*0.05) for la in range(600,900)] if vv]
        if len(seg)>1: dr.line(seg,fill=(46,42,39),width=2)
    for g in G:
        P=clip(g['p'])
        if len(P)>2: dr.polygon(P,fill=(52,46,43),outline=(120,106,98))
    for n,(lo,la) in CITIES.items():
        x,y,vv=pt(lo,la)
        if vv: dr.ellipse((x-11,y-11,x+11,y+11),fill=(226,90,61)); dr.text((x+16,y-8),n,fill=(240,235,225))
    return im.resize((960,540))
if __name__=='__main__':
    V=[(-4.85,36.85,14,28,1.6,3200,40),(-4.85,36.9,12,34,1.5,3800,60),(-4.9,36.95,10,38,1.55,3000,90),(-4.85,36.9,13,30,1.5,3400,70)]
    sheet=Image.new('RGB',(1920,1080))
    for i,v in enumerate(V): sheet.paste(render(v),((i%2)*960,(i//2)*540))
    sheet.save(sys.argv[1])
