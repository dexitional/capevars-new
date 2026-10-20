"""Normalize the supplied Computing, Creative Arts and OWOP packages safely.

JSON is read as data. Duplicate standalone/library copies must agree; archive
HTML/scripts are never executed. The production starter is recorded, not taught.
"""
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import zipfile

SUBJECTS = {'Computing': 'computing', 'Creative_Arts': 'creative', 'OWOP': 'world'}
TITLES = {'computing': 'Computing', 'creative': 'Creative arts', 'world': 'Our world & our people'}
VERSION = 1


def question(q):
    prompt = q.get('question', q.get('q'))
    options = q['options']
    assert isinstance(options, list) and all(isinstance(o, str) and o.strip() for o in options), prompt
    if 'correct' in q:
        assert type(q['correct']) is int and 0 <= q['correct'] < len(options), prompt
    answer = options[q['correct']] if 'correct' in q else q['answer']
    assert options.count(answer) == 1 and len(set(options)) == len(options), prompt
    assert 2 <= len(options) <= 8 and isinstance(prompt, str) and prompt.strip() and len(prompt) <= 1000
    explanation = q.get('explanation', q.get('reason')) or f"{answer}. Check the lesson explanation and compare it with the other choices."
    return dict(question=prompt, options=options, correctIndex=options.index(answer), explanation=explanation, visual=None)


def experiment(subject, lesson):
    title = lesson['title'].lower()
    if subject == 'creative':
        if any(x in title for x in ('beat', 'percussion', 'song', 'soundscape', 'music')): return 'rhythm'
        if 'colour' in title: return 'colour'
        if any(x in title for x in ('cloth', 'weav', 'pattern')): return 'pattern'
        return 'studio'
    if subject == 'computing':
        if any(x in title for x in ('algorithm', 'program', 'block')): return 'code'
        if any(x in title for x in ('typing', 'keyboard', 'word process', 'document', 'paragraph', 'text features', 'phrases')): return 'typing'
        if any(x in title for x in ('data', 'survey', 'spreadsheet', 'worksheet', 'workbook', 'chart', 'totals', 'mean')): return 'data'
        if any(x in title for x in ('folder', 'file explorer', 'save and find', 'files', 'recycle bin')): return 'files'
        return 'concepts'
    if any(x in title for x in ('map', 'landmark', 'classroom', 'neighbourhood')): return 'map'
    if any(x in title for x in ('garden', 'plants and animals', 'farming')): return 'garden'
    return 'concepts'


def normalized(lesson, index, subject, level, base, names):
    creative = subject == 'creative'
    if creative:
        play = [question(q) for q in lesson['questions'] if q['type'] == 'Play']
        challenge = [question(q) for q in lesson['questions'] if q['type'] == 'Challenge']
        steps = lesson['steps']
        goals = [lesson['purpose'].capitalize() + '.', 'Create ' + lesson['product'] + ' and explain one choice you made.']
        notes = ['Materials: ' + lesson['materials'] + '.', 'Our context: ' + lesson['context'] + '.', *steps, 'Look for ' + lesson['success'] + '.']
        concepts = [dict(term='Explore', meaning=steps[0]), dict(term='Make', meaning=steps[1]), dict(term='Share', meaning=steps[2])]
        scenes = [f"{lesson['title']}. {steps[0]}", steps[1], steps[2]]
    else:
        play, challenge = [question(q) for q in lesson['play']], [question(q) for q in lesson['challenge']]
        notes = [s.strip() for s in re.split(r'(?<=[.!?])\s+', lesson['explain']) if s.strip()]
        goals = [lesson['goal']]
        concepts = lesson.get('concepts', [])
        steps = [lesson['goal'], lesson['activity'], lesson['draw']]
        scenes = [lesson['explain'], lesson['story'], lesson['activity']]
        if not concepts:
            concepts = [dict(term='Notice', meaning=notes[0]), dict(term='Connect', meaning=lesson['story']), dict(term='Try', meaning=lesson['activity'])]
    assert len(play) == 5 and len(challenge) == 10, lesson['title']
    prompts = [re.sub(r'\s+', ' ', q['question']).strip().casefold() for q in play + challenge]
    assert len(set(prompts)) == 15, f'Duplicate prompts: {level}/{subject}/{lesson["title"]}'
    video_candidates = [f'videos/Lesson_{index:02}.mp4', f'videos/lesson_{index:02}.mp4', f'videos/{index:02}.mp4', f'silent_video_lessons/OWOP_B3_Lesson_{index:02}_Silent.mp4']
    video = next((n for n in video_candidates if n in names), None)
    image_candidates = [f'illustrations/Lesson_{index:02}.png', f'illustrations/lesson_{index:02}.png', f'illustrations/{index:02}.png']
    image = next((n for n in image_candidates if n in names), None)
    assert video and image, (level, subject, index, video, image)
    if creative:
        panels = [dict(title='Imagine', text=f"Today we will {lesson['purpose']}. Our work connects with {lesson['context']}.")] + [dict(title=t, text=v) for t,v in zip(['Explore', 'Make', 'Share'], steps)]
    else:
        panels = [dict(title='Notice', text=lesson['goal'])]
        if lesson.get('concepts'):
            panels += [dict(title='Discover', text=' '.join(f"{c['term']}: {c['meaning']}." for c in concepts[:2])), dict(title='Connect', text=' '.join(f"{c['term']}: {c['meaning']}." for c in concepts[2:]))]
        else:
            midpoint = max(1, len(notes)//2)
            panels += [dict(title='Discover', text=' '.join(notes[:midpoint])), dict(title='Connect', text=' '.join(notes[midpoint:]) or lesson['story'])]
        panels.append(dict(title='Try it', text=lesson['activity']))
    for k, panel in enumerate(panels):
        panel['image'] = f'{base}/enhanced/lesson-{index:02}-scene-{k+1}.png'
    scenes = [p['text'] for p in panels]
    return dict(key=f'{subject}-{index:02}', title=lesson['title'], strand=lesson['strand'], level=level,
                code=lesson.get('indicator', lesson.get('code')), kind=lesson.get('bank', lesson.get('artkind', lesson.get('symbol', ''))),
                goals=goals, notes=notes, passage='' if creative else lesson['story'],
                examples=[] if creative else [dict(question='What do you notice in this example?', answer=lesson['story'])],
                activities=[*steps, lesson['task']] if creative else [lesson['activity'], lesson['draw']],
                home=lesson.get('extension', ''), safety=lesson.get('safety', 'Ask a trusted adult before using tools or devices. Use classroom practice data, not personal information.'),
                scenes=scenes, video=base+'/'+video, illustration=panels[0]['image'], originalIllustration=base+'/'+image,
                visualGuide=dict(panels=panels, concepts=concepts, steps=steps, experiment=experiment(subject, lesson),
                                 context=lesson.get('context', 'At home, at school and in our community'),
                                 reflection=('Explain one choice in your work. What will you improve next?' if creative else 'Explain one idea in your own words and give an example from your community.'),
                                 sourceStatus=lesson.get('source_status', 'Selected practical learning topics; teacher observation supports assessment.')),
                play=play, challenge=challenge)


def extract_legacy(archives, public):
    selected, skipped = {}, []
    # Prefer full libraries so repeat imports have stable provenance and paths.
    archives = sorted(archives, key=lambda p: ('Library' not in p.name, p.name))
    for archive in archives:
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        with zipfile.ZipFile(archive) as z:
            datasets = [n for n in z.namelist() if n.endswith(('teacher_lesson_data.json', 'lesson_data_with_answers.json', 'course.json'))]
            if not datasets:
                if archive.name == 'NACCA_OWOP_B4_B6_Production_Starter.zip':
                    skipped.append(dict(source=archive.name, reason='Planning files only; no learner lessons.'))
                    continue
                raise ValueError(f'No supported lesson data: {archive}')
            for dataset in sorted(datasets):
                match = re.search(r'(Computing|Creative_Arts|OWOP)_Basic_([1-6])/', dataset)
                assert match, dataset
                subject, level = SUBJECTS[match[1]], 'b'+match[2]
                data = json.loads(z.read(dataset))
                lessons = data['lessons'] if isinstance(data, dict) else data
                canonical = json.dumps(lessons, sort_keys=True, ensure_ascii=False)
                identity = (level, subject)
                if identity in selected:
                    assert selected[identity][0] == canonical, f'Conflicting duplicate source: {archive.name} {identity}'
                    selected[identity][1]['duplicates'].append(archive.name)
                    continue
                prefix = dataset.rsplit('/', 1)[0] + '/'
                names = {n[len(prefix):]: n for n in z.namelist() if n.startswith(prefix)}
                base = f'/kidilearn/{level}/{subject}/v{VERSION}'
                media_count = 0
                for name, full in names.items():
                    p = PurePosixPath(name)
                    assert not p.is_absolute() and '..' not in p.parts, name
                    if p.suffix.lower() not in ('.png', '.jpg', '.mp4', '.pdf', '.epub'): continue
                    assert z.getinfo(full).file_size < 25_000_000, name
                    target = public / base.lstrip('/') / p
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(z.read(full))
                    media_count += 1
                rows = [normalized(l, i+1, subject, level, base, names) for i, l in enumerate(lessons)]
                pdf = next(n for n in names if n.endswith('.pdf'))
                epub = next(n for n in names if n.endswith('.epub'))
                course = dict(subject=subject, subjectTitle=TITLES[subject], level=level, version=VERSION,
                              format='multimedia-2026', source='new/'+archive.name, sourceHash=digest,
                              courseDirectory=prefix.rstrip('/'), pdf=base+'/'+pdf, epub=base+'/'+epub,
                              mediaCount=media_count, duplicates=[], lessons=rows)
                selected[identity] = (canonical, course)
                print(f'Validated {level} {subject}: {len(rows)} lessons')
    return [c for _, c in selected.values()], skipped


def extract(archives, public):
    from importlib.util import spec_from_file_location, module_from_spec
    spec = spec_from_file_location('source_packages', Path(__file__).with_name('extract-kidi-source.py'))
    source = module_from_spec(spec)
    spec.loader.exec_module(source)
    extra_spec = spec_from_file_location('additional_packages', Path(__file__).with_name('extract-kidi-additional.py'))
    additional = module_from_spec(extra_spec)
    extra_spec.loader.exec_module(additional)
    extras = [p for p in archives if additional.supports(p.name)]
    modern = [p for p in archives if p not in extras and source.supports(p.name)]
    courses, skipped = extract_legacy([p for p in archives if p not in modern and p not in extras], public)
    courses.extend(source.extract(modern, public))
    courses.extend(additional.extract(extras, public))
    return courses, skipped


if __name__ == '__main__':
    import sys
    courses, skipped = extract([Path(p) for p in sys.argv[3:]], Path(sys.argv[2]))
    Path(sys.argv[1]).write_text(json.dumps(courses, ensure_ascii=False))
    print('Skipped:', skipped)
