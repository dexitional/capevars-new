"""Extract scene scripts from the supplied releases without executing archive code."""
import csv
import hashlib
import io
import json
from pathlib import Path
import re
import zipfile
from importlib.util import module_from_spec, spec_from_file_location

ROOT = Path(__file__).resolve().parents[3]
spec = spec_from_file_location('packages', Path(__file__).with_name('extract-kidi-packages.py'))
packages = module_from_spec(spec)
spec.loader.exec_module(packages)


def spoken(text):
    # Keep the original teaching content; expand symbols the speech engine may skip.
    text = re.sub(r'Welcome to Maths Quest lesson \d+\.\s*', '', text)
    text = re.sub(r'_{2,}', ' blank ', text)
    text = re.sub(r'(\d[\d,]*)s column', r'\1 place column', text)
    text = re.sub(r'(?<=\d)\s*-\s*(?=\d)', ' minus ', text)
    for before, after in {'×': ' times ', '÷': ' divided by ', '−': ' minus ',
                          '=': ' equals ', '+': ' plus ', '%': ' percent',
                          'GH₵': ' Ghana cedis ', '₵': ' cedis ',
                          '²': ' squared ', '³': ' cubed ', '&': ' and ',
                          '→': ' then ', '…': '. ', '—': '. ',
                          '>': ' greater than ', '<': ' less than ', '°': ' degrees ',
                          '½': ' one half ', '¼': ' one quarter ', '¾': ' three quarters '}.items():
        text = text.replace(before, after)
    return re.sub(r'\s+', ' ', text).strip()


def prepare():
    courses = json.loads((ROOT / 'docs/kidilearn-library-manifest.json').read_text())
    result = []
    for course in courses:
        if course.get('format') == 'multimedia-2026':
            continue  # Prepared separately by build-kidi-new-media.py.
        archive = ROOT / 'files' / course['source']
        assert hashlib.sha256(archive.read_bytes()).hexdigest() == course['sourceHash']
        with zipfile.ZipFile(archive) as z:
            prefix = course['courseDirectory'] + '/'
            names = [n for n in z.namelist() if n.startswith(prefix)]
            html_name = next(n for n in names if n.endswith('.html') and ('Interactive_Offline' in n or 'Maths_Quest_v' in n))
            lessons = packages.array(z.read(html_name).decode(), '(?:LESSONS|lessons)')
            base = f'/kidilearn/{course["level"]}/{course["subject"]}/v{course["version"]}/'
            if course['version'] == 17:
                studio = json.loads(z.read(next(n for n in z.namelist() if n.endswith('video_manifest.json'))))
                source = next(c for c in studio if c['subject'].lower() == course['subject'] and c['level'] == int(course['level'][1:]))
                scripts = []
                for lesson in source['lessons']:
                    scripts.append([next(str(v) for k, v in row.items() if 'narration' in k.lower() and 'status' not in k.lower()) for row in lesson['scenes']])
            elif course['version'] == 18:
                scripts = []
                for lesson in lessons:
                    play, challenge = lesson['play'][0], lesson['challenge'][0]
                    scripts.append([lesson['summary'],
                                    f'{play["q"]} The answer is {play["answer"]}. {play["explanation"]}',
                                    f'{challenge["q"]} Pause and solve it in your exercise book.',
                                    f'The answer is {challenge["answer"]}. {challenge["explanation"]}'])
            else:
                name = next(n for n in names if n.endswith('Video_Scene_Alignment_and_Future_Narration.csv'))
                rows = list(csv.DictReader(io.StringIO(z.read(name).decode('utf-8-sig'))))
                scripts = [[] for _ in lessons]
                for row in rows:
                    i = int(row.get('lesson', row.get('Lesson'))) - 1
                    text = next(v for k, v in row.items() if 'narration' in k.lower() or 'narrator script' in k.lower())
                    assert int(row.get('scene', row.get('Scene'))) == len(scripts[i]) + 1
                    scripts[i].append(text)
            assert len(scripts) == len(lessons) == course['lessons']
            for i, (lesson, scenes) in enumerate(zip(lessons, scripts)):
                candidates = [f'media/{p}-{i+1:02}.mp4' for p in ('lesson', 'quest')] + [f'media/videos/lesson-{i+1:02}.mp4']
                video = next(p for p in candidates if prefix + p in names)
                assert len(scenes) == 4 and all(s.strip() for s in scenes)
                frames = []
                for scene in range(1, 5):
                    candidates = [f'media/frames/lesson-{i+1:02}/scene-{scene}.png',
                                  f'media/frames/lesson-{i+1:02}-scene-{scene}.png',
                                  f'media/stills/lesson-{i+1:02}-scene-{scene}.png',
                                  f'media/stills/quest-{i+1:02}-scene-{scene}.png']
                    frame = next((p for p in candidates if prefix + p in names), None)
                    if frame:
                        frames.append(base + frame)
                assert len(frames) in (0, 4)
                result.append(dict(level=course['level'], subject=course['subject'], title=lesson['title'],
                                   video=base + video, frames=frames, scenes=[spoken(s) for s in scenes]))
    # Basic 3 first, then the remaining levels.
    result.sort(key=lambda r: (r['level'] != 'b3', r['level'], r['subject'], r['video']))
    target = ROOT / 'docs/kidilearn-narration-scripts.json'
    target.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
    print(f'Prepared {len(result)} lessons / {sum(len(r["scenes"]) for r in result)} scene scripts: {target}')


if __name__ == '__main__':
    prepare()
