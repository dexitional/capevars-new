"""Draw classroom diagrams and four-scene storyboards for the new course packs.

These code-drawn illustrations are additive; supplied images/videos/PDFs remain
unchanged. Narration is derived from the same text visible in each new scene.
"""
import argparse
import json
from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'apps/web/public'
NAVY, TEAL, GOLD, PAPER = '#041d40', '#147d80', '#f5b942', '#f5f8fc'
FONT = PUBLIC / 'kidilearn/fonts/fredoka.ttf'
FONT_TITLE = PUBLIC / 'kidilearn/fonts/sourgummy.ttf'


def font(size, title=False):
    return ImageFont.truetype(str(FONT_TITLE if title else FONT), size)


def wrap(draw, text, width, face):
    lines, line = [], ''
    for word in text.split():
        proposed = (line+' '+word).strip()
        if draw.textlength(proposed, font=face) > width and line:
            lines.append(line)
            line = word
        else:
            line = proposed
    if line: lines.append(line)
    return lines


def textblock(draw, text, box, size=30, fill=NAVY, title=False):
    x,y,w,h = box
    while size > 17:
        face=font(size, title)
        lines=wrap(draw, text,w,face)
        if len(lines)*(size+9)<=h: break
        size-=1
    assert len(lines)*(size+9)<=h, text
    for line in lines:
        draw.text((x,y),line,font=face,fill=fill)
        y+=size+9


def arrow(d, a, b, color=TEAL, width=5):
    d.line([a,b],fill=color,width=width)
    angle=math.atan2(b[1]-a[1],b[0]-a[0])
    points=[b,(b[0]-18*math.cos(angle-.45),b[1]-18*math.sin(angle-.45)),(b[0]-18*math.cos(angle+.45),b[1]-18*math.sin(angle+.45))]
    d.polygon(points,fill=color)


def person(d,x,y,color=TEAL,pose=0):
    d.ellipse((x-16,y-60,x+16,y-28),fill='#986747')
    d.rounded_rectangle((x-23,y-20,x+23,y+45),12,fill=color)
    d.line([(x-12,y+40),(x-25,y+83)],fill=NAVY,width=9)
    d.line([(x+12,y+40),(x+27,y+83)],fill=NAVY,width=9)
    d.line([(x-20,y-8),(x-52,y+(-25 if pose else 25))],fill='#986747',width=9)
    d.line([(x+20,y-8),(x+50,y+(-36 if pose else 25))],fill='#986747',width=9)


def model(lesson, subject, stage):
    im=Image.new('RGB',(600,390),'#ecf4f8');d=ImageDraw.Draw(im)
    title=lesson['title'].lower();kind=lesson['visualGuide']['experiment']; concepts=lesson['visualGuide']['concepts']
    label='A model to explore'
    if subject=='computing' and kind=='data':
        label='Example: classroom choices'
        d.line([(80,310),(520,310)],fill=NAVY,width=3)
        for i,(name,n,col) in enumerate([('Mango',3,TEAL),('Orange',5,GOLD),('Banana',4,'#7770bf')]):
            x=110+i*150;h=n*35
            d.rounded_rectangle((x,310-h,x+85,310),12,fill=col)
            d.text((x+28,280-h),str(n),font=font(25),fill=NAVY)
            d.text((x-4,325),name,font=font(22),fill=NAVY)
    elif subject=='computing' and kind=='files':
        label='Organise work so you can find it'
        for x,y,name,color in [(235,65,'Classwork',GOLD),(75,225,'Art',TEAL),(375,225,'Writing','#7770bf')]:
            if y>65: arrow(d,(300,165),(x+60,y-10))
            d.rounded_rectangle((x,y,x+135,y+75),12,fill=color)
            d.rounded_rectangle((x+10,y-12,x+65,y+16),6,fill=color)
            d.text((x+8,y+88),name,font=font(23),fill=NAVY)
    elif subject=='computing' and kind=='code':
        label='An algorithm is an ordered set of steps'
        for i,name in enumerate(['Start','Move','Stop']):
            x=30+i*195
            d.rounded_rectangle((x,145,x+150,235),20,fill=[TEAL,'#7770bf',NAVY][i])
            d.text((x+28,170),name,font=font(28),fill='white')
            if i<2:arrow(d,(x+155,190),(x+190,190))
        d.text((40,290),'Change the order. Predict the result.',font=font(25),fill=NAVY)
    elif subject=='computing' and kind=='typing':
        label='Practise carefully, then check your work'
        d.rounded_rectangle((40,55,560,165),16,fill='white',outline=NAVY,width=3)
        d.text((65,85),'Hello, Ghana!',font=font(36),fill=TEAL)
        for r,letters in enumerate(['QWERTYUIOP','ASDFGHJKL','ZXCVBNM']):
            for c,ch in enumerate(letters):
                x=40+c*50+r*15;y=200+r*48
                d.rounded_rectangle((x,y,x+42,y+40),7,fill=GOLD if c==stage+1 else 'white')
                d.text((x+10,y+4),ch,font=font(23),fill=NAVY)
    elif subject=='computing':
        # Device diagram is a visual context, while the lesson-specific cards
        # beside it carry the exact terminology (hardware, networks, safety etc).
        label='Input → process → output'
        if any(w in title for w in ['privacy','private','safe','footprint','manners']):
            label='Pause. Think. Ask a trusted adult.'
            d.polygon([(300,60),(435,110),(420,240),(300,325),(180,240),(165,110)],fill=TEAL)
            d.rounded_rectangle((255,160,345,245),15,fill=GOLD)
            d.arc((270,115,330,195),180,360,fill='white',width=12)
        elif any(w in title for w in ['email','communication','browser','internet','url','web','iot','connected','network']):
            label='Connected devices share information'
            for x,y,col in [(75,85,TEAL),(400,85,'#7770bf'),(235,240,NAVY)]:
                d.rounded_rectangle((x,y,x+120,y+75),13,fill=col)
                d.line([(x+12,y+15),(x+60,y+43),(x+108,y+15)],fill='white',width=3)
            arrow(d,(205,125),(390,125));arrow(d,(120,175),(240,250));arrow(d,(460,175),(365,250))
        else:
            d.rounded_rectangle((180,55,490,235),18,fill=NAVY)
            d.rounded_rectangle((195,70,475,215),10,fill='#b9e6e0')
            d.text((240,120),'Hello!',font=font(44,True),fill=NAVY)
            d.rectangle((315,235,355,270),fill=NAVY)
            d.rounded_rectangle((265,265,405,280),8,fill=NAVY)
            d.rounded_rectangle((110,305,440,355),10,fill='white',outline=NAVY,width=3)
            for j in range(12):d.rectangle((123+j*25,315,140+j*25,329),fill=TEAL)
            d.ellipse((475,300,520,355),fill=GOLD,outline=NAVY,width=3)
            d.rounded_rectangle((65,80,140,255),10,fill=TEAL)
            d.ellipse((90,105,115,130),fill=GOLD)
    elif subject=='creative':
        if kind=='rhythm':
            label='Feel a steady pulse • make your own rhythm'
            for i in range(8):
                x=35+i*70
                d.ellipse((x,125,x+50,175),fill=TEAL if i%3 else GOLD,outline=NAVY,width=2)
                d.text((x+17,190),str(i+1),font=font(24),fill=NAVY)
            for i in range(4):
                x=120+i*100;d.line([(x,285),(x,245),(x+30,245)],fill=NAVY,width=5);d.ellipse((x-13,280,x+5,294),fill=NAVY)
        elif kind=='colour':
            label='Plan colours before you begin'
            for x,y,col in [(230,90,'#e6535d'),(330,90,GOLD),(280,175,'#4b84d1')]:d.ellipse((x-70,y,x+70,y+140),fill=col,outline='white',width=8)
            for i,col in enumerate(['#e6535d','#eb8b40',GOLD,'#68a875','#4b84d1','#8863ad']):d.rounded_rectangle((50+i*85,330,120+i*85,360),8,fill=col)
        elif kind=='pattern':
            label='Repeat a motif • change one feature'
            for r in range(5):
                for c in range(9):
                    x=60+c*54;y=70+r*54
                    col=[GOLD,TEAL,'#d65554'][(c+r)%3]
                    d.rectangle((x,y,x+49,y+49),fill=col)
                    if (c+r)%2:d.polygon([(x+24,y+5),(x+44,y+24),(x+24,y+44),(x+5,y+24)],fill=NAVY)
            if stage>1:d.rectangle((60,70,109,119),outline='white',width=5)
        elif any(w in title for w in ['pot','bowl','clay']):
            label='Observe the rim, body and base'
            d.polygon([(170,140),(430,140),(385,300),(215,300)],fill='#c98555')
            d.ellipse((165,100,435,180),fill='#efb681',outline=NAVY,width=4)
            d.ellipse((185,116,415,165),fill='#865235')
            for y in [210,245]:d.line([(205,y),(395,y)],fill=GOLD,width=9)
            d.text((230,322),'Shape + function',font=font(25),fill=NAVY)
        elif any(w in title for w in ['dance','drama','gesture','performance','restage']):
            label='Express an idea with movement'
            for i,col in enumerate([TEAL,'#d65554','#7770bf']):person(d,150+i*150,190,col,i%2)
            d.line([(65,290),(535,290)],fill=GOLD,width=8)
        else:
            label='Arrange • make • review'
            d.rounded_rectangle((75,55,525,340),18,fill='white',outline=NAVY,width=4)
            d.ellipse((120,90,220,190),fill=GOLD)
            d.polygon([(250,270),(350,100),(450,270)],fill=TEAL)
            d.rectangle((130,225,230,290),fill='#d65554')
            d.line([(95,315),(505,315)],fill=NAVY,width=3)
    else:
        if kind=='map' or any(w in title for w in ['home and school','settlement']):
            label='A simple community map (example)'
            d.line([(20,190),(580,190)],fill='#c8d6df',width=45)
            d.line([(300,40),(300,350)],fill='#c8d6df',width=40)
            for x,y,name,col in [(80,65,'School',TEAL),(380,65,'Clinic','#d65554'),(80,250,'Market',GOLD),(380,250,'Park','#6fa971')]:
                d.rounded_rectangle((x,y,x+125,y+65),10,fill=col)
                d.text((x+5,y+72),name,font=font(22),fill=NAVY)
            d.text((545,15),'N',font=font(23),fill=NAVY);arrow(d,(555,95),(555,50),NAVY,3)
        elif kind=='garden' or any(w in title for w in ['creation','environment','water','land','resources','energy']):
            label='Care for the living world'
            d.ellipse((440,40,520,120),fill=GOLD)
            d.rounded_rectangle((25,300,575,365),18,fill='#bd8c65')
            for i in range(4):
                x=100+i*120;d.line([(x,310),(x,190)],fill=TEAL,width=8)
                d.ellipse((x-45,190,x,245),fill='#69a973');d.ellipse((x,160,x+48,220),fill='#3a8c68')
            d.polygon([(70,80),(45,125),(95,125)],fill='#77b5e9');d.ellipse((45,105,95,150),fill='#77b5e9')
        elif any(w in title for w in ['comput','information','technology','communication']):
            label='Share information clearly'
            for x,col in [(80,TEAL),(390,'#7770bf')]:
                d.rounded_rectangle((x,80,x+140,280),18,fill=NAVY)
                d.rounded_rectangle((x+12,100,x+128,245),10,fill=col)
                for y in [130,170,210]:d.line([(x+25,y),(x+105,y)],fill='white',width=5)
            arrow(d,(240,150),(365,150));arrow(d,(365,225),(240,225))
        else:
            label='Listen • respect • work together'
            for i,col in enumerate([TEAL,'#d65554','#7770bf']):person(d,150+i*150,205,col,i==1)
            d.rounded_rectangle((140,45,460,105),20,fill='white')
            d.text((170,60),'Everyone has a voice',font=font(24),fill=NAVY)
    return im,label


def build(courses):
    scripts=[]
    for course in courses:
        for lesson in course['lessons']:
            frames=[]
            for k,panel in enumerate(lesson['visualGuide']['panels']):
                im=Image.new('RGB',(1280,720),PAPER);d=ImageDraw.Draw(im)
                d.rounded_rectangle((24,24,1256,696),30,fill='white')
                chip = f"Basic {course['level'][1:]}  /  {course['subjectTitle']}"
                d.rounded_rectangle((48,45,82+d.textlength(chip,font=font(20)),88),18,fill=NAVY)
                d.text((65,51),chip,font=font(20),fill='white')
                textblock(d,lesson['title'],(48,109,1180,90),size=38,title=True)
                diagram,label=model(lesson,course['subject'],k)
                im.paste(diagram,(48,220))
                d.rounded_rectangle((680,220,1230,610),22,fill='#f2f6fa')
                d.text((708,246),f"0{k+1}  {panel['title']}",font=font(28,True),fill=TEAL)
                textblock(d,panel['text'],(708,300,492,280),size=29)
                textblock(d,label,(60,615,1140,36),size=23)
                for j in range(4):d.rounded_rectangle((49+j*298,667,332+j*298,674),3,fill=TEAL if j==k else '#dce7ec')
                target=PUBLIC/panel['image'].lstrip('/');target.parent.mkdir(parents=True,exist_ok=True)
                im.save(target,optimize=True)
                frames.append(panel['image'])
            scripts.append(dict(level=course['level'],subject=course['subject'],title=lesson['title'],video=lesson['video'],scenes=lesson['scenes'],frames=frames))
        print(f"Illustrated {course['level']} {course['subject']}: {len(course['lessons'])} lessons",flush=True)
    return scripts


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--content',type=Path,default=ROOT/'docs/kidilearn-new-content.json')
    parser.add_argument('--scripts',type=Path,default=ROOT/'docs/kidilearn-new-narration-scripts.json')
    args=parser.parse_args()
    args.scripts.write_text(json.dumps(build(json.loads(args.content.read_text())),ensure_ascii=False,indent=2)+'\n')
