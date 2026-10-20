"""Source-faithful OWOP B1/B2, upper-primary Science/English and KG imports."""
import csv
import hashlib
import io
import json
from pathlib import PurePosixPath
import re
import zipfile

VERSION = 1
TITLES = {'world': 'Our world & our people', 'science': 'Science',
          'english': 'English language', 'literacy': 'Language & literacy',
          'numeracy': 'Numeracy', 'creative': 'Creative arts'}
DATASETS = ('Course_Data_and_Question_Bank.json', 'teacher_lesson_data.json', 'course.json')


def supports(name):
    return name in ('NACCA_OWOP_Basic_1.zip', 'NACCA_OWOP_Basic_2.zip') or bool(
        re.search(r'(Science_B4-B6_English_B6_KG1-KG2|Science_Basic_[4-6]|Science_Basic_4-6|English_(?:Language_Basic_6|Basic_6)|Kindergarten_1-2|KG[12]_)', name))


def safe(name):
    p = PurePosixPath(name)
    assert not p.is_absolute() and '..' not in p.parts and '\\' not in name, name
    return p


def question(q):
    options = q.get('choices', q.get('options'))
    prompt = q.get('prompt', q.get('question'))
    assert isinstance(prompt, str) and 0 < len(prompt) <= 1000
    assert isinstance(options, list) and 2 <= len(options) <= 8
    assert all(isinstance(o, str) and o.strip() for o in options)
    assert len(set(options)) == len(options)
    answer = q['answer']
    if isinstance(answer, str):
        assert options.count(answer) == 1
        index = options.index(answer)
        assert 'correct' not in q or q['correct'] == index
    else:
        assert type(answer) is int and 0 <= answer < len(options)
        index = answer
    return dict(question=prompt, options=options, correctIndex=index,
                explanation=q.get('feedback', f'{options[index]}. Compare this answer with the lesson explanation.'),
                visual=None)


def identity(directory):
    if 'OWOP_Basic_' in directory:
        return 'b'+re.search(r'OWOP_Basic_([12])', directory)[1], 'world'
    if directory.startswith('Science_Basic_'):
        return 'b'+directory[-1], 'science'
    if directory == 'English_Language_Basic_6':
        return 'b6', 'english'
    match = re.fullmatch(r'KG([12])_(Language_and_Literacy|Numeracy|Creative_Arts|Our_World_and_Our_People)', directory)
    assert match, f'Unsupported course directory: {directory}'
    return 'kg'+match[1], {'Language_and_Literacy': 'literacy', 'Numeracy': 'numeracy',
                         'Creative_Arts': 'creative', 'Our_World_and_Our_People': 'world'}[match[2]]


def normalize(row, index, level, subject, base, names, read, metadata):
    if 'questions' in row:
        play = [question(q) for q in row['questions'] if q['phase'].lower() == 'play']
        challenge = [question(q) for q in row['questions'] if q['phase'].lower() == 'challenge']
    else:
        play, challenge = [question(q) for q in row['play']], [question(q) for q in row['challenge']]
    assert len(play) == 5 and len(challenge) == 10, row['title']
    prompts = [re.sub(r'\s+', ' ', q['question']).strip().casefold() for q in play+challenge]
    assert len(set(prompts)) == 15, f'Duplicate prompts: {row["title"]}'
    raw = {k: v for k, v in row.items() if k not in ('questions', 'play', 'challenge')}
    transcript, audio_file = '', None
    if 'facts' in row:
        image, video = f'media/illustrations/lesson-{index:02}.png', f'media/videos/lesson-{index:02}.mp4'
        scene_rows = list(csv.DictReader(io.StringIO(read('Video_Scene_Alignment_and_Future_Narration.csv'))))
        scene_rows = [s for s in scene_rows if int(s['Lesson']) == index]
        assert len(scene_rows) == 4
        panels = [dict(title=s['Teaching heading'].title(), text=s['Silent onscreen explanation'],
                       image=base+'/'+s['Scene image']) for s in scene_rows]
        goals, notes, passage = [row['objective']], row['facts'], ''
        steps, activities, home = [row['practical']], [row['practical']], ''
        safety = 'Work with an adult for outdoor visits, tools and devices. Use models or pictures where needed. Keep personal information private and respect different family beliefs.'
        assessment = 'Observe practical skills, communication, responsible behaviour and careful observation separately from the quiz. Share one positive achievement and one next step.'
        mode = 'silent'
    elif 'explain' in row:
        image = f'illustrations/{index:02}.png'
        video = f'silent_video_lessons/OWOP_B2_Lesson_{index:02}_Silent.mp4'
        script = read(f'silent_video_lessons/OWOP_B2_Lesson_{index:02}_Narration_Script.txt')
        scene_text = re.findall(r'^Scene \d+ \([^)]*\): (.+)$', script, re.M)
        assert len(scene_text) == 3
        panels = [dict(title=t, text=s, image=base+'/'+image) for t, s in zip(['Notice', 'Discover', 'Try'], scene_text)]
        goals, notes, passage = [row['goal']], [row['explain']], row['story']
        steps = [row['activity'], row['draw']]
        activities, home = steps, ''
        safety = 'Use adult guidance for outdoor visits, tools and devices. Practise with safe classroom materials.'
        assessment, mode = 'Observe the practical activity and drawing as well as the digital quiz.', 'silent'
    else:
        assert 'idea' in row
        image, video = f'illustrations/lesson_{index:02}.png', f'videos/lesson_{index:02}.mp4'
        audio_file = f'narration/lesson_{index:02}.mp3'
        script = read('NARRATION_SCRIPTS.md')
        match = re.search(rf'^## {index}\. [^\n]+\n(.*?)(?=^## |\Z)', script, re.M | re.S)
        assert match, f'Missing narration script: {index}'
        transcript = match[1].strip()
        goals, notes, passage = [row['idea']], [row['idea'], 'Look for: '+', '.join(row['examples']), 'Remember: '+row['misconception']], ''
        steps = [row['activity'], row['application']]
        activities, home = [row['activity']], row['application']
        panels = [dict(title=t, text=s, image=base+'/'+image) for t, s in
                  [('Look', row['idea']), ('Try', row['activity']), ('Share', row['application'])]]
        teacher_notes = read('TEACHER_NOTES.md')
        safety = re.search(r'\*\*Safety:\*\* (.+)', teacher_notes)[1]
        assessment = re.search(r'\*\*Method:\*\* (.+)', teacher_notes)[1]
        if level.startswith('kg'):
            assessment += '\n\n'+re.search(r'\*\*Kindergarten:\*\* (.+)', teacher_notes)[1]
        mode = 'synthetic-english'
    for name in [image, video, *([audio_file] if audio_file else []),
                 *[p['image'][len(base)+1:] for p in panels]]:
        safe(name)
        assert name in names, f'Missing source media: {level}/{subject}/{name}'
    raw.update(steps=steps, teacher_assessment=assessment, indicator=row.get('code', ''),
               source=row.get('source', metadata.get('source', 'Independent NaCCA-aligned learning companion.')))
    source_video = dict(audio=mode, transcript=transcript, poster=base+'/'+image)
    if audio_file:
        source_video['audioDownload'] = base+'/'+audio_file
    return dict(key=f'{subject}-{index:02}', title=row['title'], strand=row['strand'], level=level,
                code=row.get('code', ''), kind=row.get('visual', row.get('symbol', subject)),
                goals=goals, notes=notes, passage=passage, examples=[], activities=activities,
                home=home, safety=safety, scenes=[p['text'] for p in panels], video=base+'/'+video,
                illustration=base+'/'+image, originalIllustration=base+'/'+image,
                sourceLesson=raw, sourceVideo=source_video, sourceScope=metadata.get('provenance', metadata.get('source', '')),
                visualGuide=dict(panels=panels, concepts=[], steps=steps, experiment='source-practice',
                                 context='', reflection='', sourceStatus=metadata.get('kind', '')),
                play=play, challenge=challenge)


def extract(archives, public):
    selected = {}

    def visit(z, chain, archive_hash):
        assert len(chain) <= 4, 'Nested archive depth exceeded'
        assert sum(i.file_size for i in z.infolist()) < 1_000_000_000
        for name in z.namelist():
            safe(name)
        datasets = [n for n in z.namelist() if PurePosixPath(n).name in DATASETS]
        for dataset in datasets:
            prefix = dataset.rsplit('/', 1)[0]+'/'
            level, subject = identity(prefix.rstrip('/').split('/')[-1])
            data = json.loads(z.read(dataset))
            metadata = {k: v for k, v in data.items() if k != 'lessons'} if isinstance(data, dict) else {}
            rows = data['lessons'] if isinstance(data, dict) else data
            names = {n[len(prefix):]: n for n in z.namelist() if n.startswith(prefix)}
            read = lambda name: z.read(names[name]).decode('utf-8-sig')
            base = f'/kidilearn/{level}/{subject}/v{VERSION}'
            lessons = [normalize(row, i+1, level, subject, base, names, read, metadata) for i, row in enumerate(rows)]
            assets, hashes = {}, {}
            for name, full in sorted(names.items()):
                if safe(name).suffix.lower() not in ('.png', '.jpg', '.mp4', '.mp3', '.pdf', '.epub'):
                    continue
                assert z.getinfo(full).file_size < 25_000_000, name
                assets[name] = z.read(full)
                hashes[name] = hashlib.sha256(assets[name]).hexdigest()
            # Fingerprint normalized teaching/scripts too, so wording changes cannot be silently skipped.
            fingerprint = hashlib.sha256(json.dumps(dict(revision=VERSION, metadata=metadata, lessons=lessons, assets=hashes),
                                                      sort_keys=True, ensure_ascii=False).encode()).hexdigest()
            key = (level, subject)
            if key in selected:
                assert selected[key]['sourceHash'] == fingerprint, f'Conflicting duplicate source: {key}'
                selected[key]['duplicates'].append(' / '.join(chain))
                continue
            for name, content in assets.items():
                target = public / base.lstrip('/') / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(content)
            selected[key] = dict(level=level, subject=subject, subjectTitle=TITLES[subject], version=VERSION,
                                 format='additional-multimedia-v1', source='new/'+chain[0], sourceHash=fingerprint,
                                 archiveHash=archive_hash, archiveChain=chain, metadata=metadata, duplicates=[],
                                 courseDirectory=prefix.rstrip('/'), mediaCount=len(assets), assetHashes=hashes,
                                 pdf=base+'/'+next(n for n in names if n.endswith('.pdf')),
                                 epub=base+'/'+next(n for n in names if n.endswith('.epub')), lessons=lessons)
            print(f'Validated {level} {subject}: {len(lessons)} lessons with original media')
        nested = [n for n in z.namelist() if n.endswith('.zip')]
        for name in nested:
            with zipfile.ZipFile(io.BytesIO(z.read(name))) as child:
                visit(child, [*chain, name], archive_hash)
        assert datasets or nested, f'No supported lesson data: {chain}'

    for archive in sorted(archives, key=lambda p: p.name):
        with zipfile.ZipFile(archive) as z:
            visit(z, [archive.name], hashlib.sha256(archive.read_bytes()).hexdigest())
    return list(selected.values())
