from PIL import Image
import numpy as np, potrace
im=Image.open('src.png')
cols=np.where((np.array(im)[290:480]>128).any(0))[0];x0,x1=cols.min()-10,cols.max()+10
c=im.crop((x0,285,x1,483))
c=c.resize((c.width*4,c.height*4),Image.LANCZOS)
a=np.array(c)>110
bm=potrace.Bitmap(~a)
pl=bm.trace(turdsize=20,alphamax=1.0,opttolerance=0.4)
parts=[]
for cv in pl:
    s=cv.start_point;d=f"M{s.x:.1f},{s.y:.1f}"
    for seg in cv.segments:
        if seg.is_corner: d+=f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}"
        else: d+=f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}"
    parts.append(d+"Z")
W,H=c.size
open('cy.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><rect width="100%" height="100%" fill="#fff"/><path fill="#000" fill-rule="evenodd" d="{"".join(parts)}"/></svg>')
open('cy.json','w').write('{"w":%d,"h":%d,"d":"%s"}'%(W,H,"".join(parts)))
print(W,H,len(pl))
Image.fromarray(~a).save('mask_inv.png')
