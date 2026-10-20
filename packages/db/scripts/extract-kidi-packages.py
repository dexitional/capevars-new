"""Normalize v17–v22 archives without running their HTML or bundled scripts."""
import hashlib
import itertools
import json
from pathlib import Path, PurePosixPath
import re
import sys
import zipfile
from importlib.util import module_from_spec, spec_from_file_location

spec = spec_from_file_location('v15', Path(__file__).with_name('extract-kidi-v15.py'))
v15 = module_from_spec(spec)
spec.loader.exec_module(v15)


def array(html, name):
    marker = re.search(r'(?:const|let|var) ' + name + r'\s*=', html)
    if not marker:
        raise ValueError(f'Missing data array: {name}')
    return json.JSONDecoder().raw_decode(html[marker.end():].lstrip())[0]


def strings(value):
    if not value:
        return []
    return value if isinstance(value, list) else [value]


def game_question(game):
    """Represent original action states as indices for existing server grading.

    The interaction metadata never contains a hidden answer. Large state lists
    are used only for Play; final quizzes use the separate Challenge bank.
    """
    kind = game['type']
    if kind == 'choice':
        options = list(map(str, game['options']))
        return v15.question(dict(q=game['prompt'], options=options, a=options[game['answer']]))
    interaction = {'type': kind}
    if kind in ('tap', 'half'):
        options = list(map(str, range(game['total'] + 1)))
        answer = str(game['target'])
        interaction.update(total=game['total'], emoji=game.get('emoji', '▰'))
    elif kind == 'order':
        options = [' '.join(map(str, order)) for order in itertools.permutations(game['options'])]
        answer = ' '.join(map(str, game['answer']))
        interaction['items'] = game['options']
    elif kind == 'directions':
        options = [f'{x},{y}' for y in range(4) for x in range(4)]
        answer = ','.join(map(str, game['target']))
        interaction.update(start=game.get('start', [0, 0]), goal=game['target'])
    else:
        maximum = 100 if kind == 'chart' else 20
        options = list(map(str, range(1 if kind == 'chart' else 0, maximum + 1)))
        answer = str(game['target'])
        interaction.update(start=game.get('start', 0), size=game.get('size', 1), base=game.get('base'))
    if kind not in ('tap', 'half', 'order', 'directions', 'chart', 'numberline', 'groups', 'measure', 'money'):
        raise ValueError(f'Unsupported game: {kind}')
    assert options.count(answer) == 1 and len(options) <= 200
    return dict(question=game['prompt'], options=options, correctIndex=options.index(answer),
                explanation='Follow the instructions and compare your model with the requested result.',
                visual=None, interaction=interaction)


def normalize_lesson(lesson, i, subject, level, base, names, html):
    if subject == 'mathematics' and level == 'b1':
        play = [game_question(g) for g in array(html, 'PLAY_ROUNDS')[i]]
        challenge = [v15.question(dict(q=q[0], options=q[1], a=q[1][q[2]], why=q[3])) for q in lesson['quiz']]
        scenes = [s['narration'] for s in array(html, 'VOICE_SCENES')[i]]
    else:
        bank = lesson.get('questions', lesson)
        play = [v15.question(q) for q in bank['play']]
        challenge = [v15.question(q) for q in bank['challenge']]
        scenes = lesson.get('scenes', [f'{s[0]}: {s[1]}' for s in lesson.get('scene_steps', [])])
    assert len(play) == 5 and len(challenge) == 10, lesson['title']
    prompts = [re.sub(r'\s+', ' ', q['question']).strip().casefold() for q in play + challenge]
    assert len(set(prompts)) == 15, f'Duplicate questions: {lesson["title"]}'
    examples = []
    for e in lesson.get('examples', lesson.get('worked', [])):
        if isinstance(e, list):
            examples.append(dict(question=e[0], answer=e[1]))
        else:
            examples.append(dict(question=e.get('q', e.get('text')), answer=e.get('a', e.get('answer')) + ' — ' + e.get('why', e.get('explanation', ''))))
    if lesson.get('model_q'):
        examples.append(dict(question=lesson['model_q'], answer=lesson['model_a'] + ' — ' + lesson.get('model_explain', '')))
    strand = lesson.get('strand', lesson.get('group'))
    if not strand:
        strand = {'1': 'Number', '2': 'Algebra', '3': 'Geometry and measurement', '4': 'Data'}[lesson['code'].split('.')[1]]
    candidates = [f'media/{prefix}-{i+1:02}.mp4' for prefix in ('lesson', 'quest')] + [f'media/videos/lesson-{i+1:02}.mp4']
    video = next((p for p in candidates if p in names), None)
    assert video, f'Missing video: {lesson["title"]}'
    image = f'media/illustrations/lesson-{i+1:02}.png'
    return dict(key=f'{subject}-{i+1:02}', title=lesson['title'], strand=strand, level=level,
                code=lesson.get('code', lesson.get('prefix')), kind=lesson.get('kind', ''),
                goals=strings(lesson.get('outcomes', lesson.get('focus', lesson.get('goal', lesson['title'])))),
                notes=strings(lesson.get('teach', lesson.get('explain', lesson.get('summary', '')))),
                passage=lesson.get('passage', ''), examples=examples,
                activities=strings(lesson.get('activities', lesson.get('activity'))),
                home=lesson.get('home', ''), safety=lesson.get('safety', ''), scenes=scenes,
                video=base+'/'+video, illustration=base+'/'+image if image in names else None,
                play=play, challenge=challenge)


def extract(archives, output, public):
    result = []
    seen = set()
    new_archives = [p for p in archives if not re.search(r'_v\d+', p.name)]
    if new_archives:
        new_spec = spec_from_file_location('new_packages', Path(__file__).with_name('extract-kidi-new.py'))
        new_packages = module_from_spec(new_spec)
        new_spec.loader.exec_module(new_packages)
        additions, skipped = new_packages.extract(new_archives, public)
        result.extend(additions)
        for item in skipped:
            print(f"Skipped {item['source']}: {item['reason']}")
    for archive in [p for p in archives if p not in new_archives]:
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        version = int(re.search(r'_v(\d+)', archive.name).group(1))
        with zipfile.ZipFile(archive) as z:
            # Ignore the video authoring studio and unfinished assessment drafts.
            htmls = [n for n in z.namelist() if n.endswith('.html') and ('Interactive_Offline' in n or 'Maths_Quest_v' in n)]
            for html_name in sorted(htmls):
                match = re.search(r'(English|Mathematics|Science)_Basic_(\d)', html_name)
                subject, level = match.group(1).lower(), 'b'+match.group(2)
                assert (level, subject) not in seen, f'Multiple sources for {level}/{subject}'
                seen.add((level, subject))
                prefix = html_name.rsplit('/', 1)[0]+'/'
                names = {n[len(prefix):]: n for n in z.namelist() if n.startswith(prefix)}
                html = z.read(html_name).decode()
                lessons = array(html, '(?:LESSONS|lessons)')
                base = f'/kidilearn/{level}/{subject}/v{version}'
                media_count = 0
                for name, full in names.items():
                    p = PurePosixPath(name)
                    assert not p.is_absolute() and '..' not in p.parts
                    if p.suffix.lower() not in ('.png', '.mp4', '.pdf', '.epub'):
                        continue
                    assert z.getinfo(full).file_size < 25_000_000
                    target = public / base.lstrip('/') / p
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(z.read(full))
                    media_count += 1
                normalized = [normalize_lesson(l, i, subject, level, base, names, html) for i, l in enumerate(lessons)]
                pdf = next(n for n in names if n.endswith('.pdf'))
                epub = next(n for n in names if n.endswith('.epub'))
                result.append(dict(subject=subject, level=level, version=version, source=archive.name,
                                   sourceHash=digest, courseDirectory=prefix.rstrip('/'),
                                   pdf=base+'/'+pdf, epub=base+'/'+epub, mediaCount=media_count, lessons=normalized))
                print(f'Validated {level} {subject}: {len(lessons)} lessons, 5 Play + 10 Challenge each')
    output.write_text(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    extract([Path(p) for p in sys.argv[3:]], Path(sys.argv[1]), Path(sys.argv[2]))
