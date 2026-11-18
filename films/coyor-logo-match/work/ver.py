import json,sys
from PIL import Image, ImageDraw
L=json.load(open('logos.json'));D='../../coyor-fashion/harvest/img/'
TW=520;FW,FH=1080,1920;sc=0.25
tiles=[]
for e in L:
    im=Image.open(D+e['file']).convert('RGB');k=TW/e['w']
    im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
    fr=Image.new('RGB',(FW,FH),'white')
    fr.paste(im,(round(FW/2-e['cx']*k),round(FH/2-e['cy']*k)))
    fr=fr.crop((FW//2-300,FH//2-300,FW//2+300,FH//2+300)).resize((200,200))
    d=ImageDraw.Draw(fr);d.line((100,0,100,200),fill='red');d.line((0,100,200,100),fill='red')
    d.line((100-TW/2*200/600,96,100-TW/2*200/600,104),fill='green');d.line((100+TW/2*200/600,96,100+TW/2*200/600,104),fill='green');d.text((3,3),str(len(tiles)),fill='blue');tiles.append(fr)
c=8;S=Image.new('RGB',(c*200,((len(tiles)+c-1)//c)*200),'white')
for i,t in enumerate(tiles):S.paste(t,((i%c)*200,(i//c)*200))
S.save('ver.png')
