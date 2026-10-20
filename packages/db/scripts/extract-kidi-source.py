"""Read the nested language/RME/history/PE/French libraries without executing HTML.

Keep supplied teaching fields and media intact. A content fingerprint, independent
of the outer ZIP name, makes standalone and bundled imports interchangeable.
"""
import hashlib
import io
import json
from pathlib import PurePosixPath
import re
import zipfile

VERSION = 2
TITLES = {
    'ghanaian': 'Ghanaian language · Twi',
    'ghanaian_ga': 'Ghanaian language · Ga',
    'ghanaian_mfantse': 'Ghanaian language · Mfantse',
    'rme': 'Religious & moral education', 'history': 'History',
    'pe': 'Physical education', 'french': 'French',
}


def supports(name):
    return bool(re.search(r'(Ghanaian_Language|RME|History|Physical_Education|French)', name))


def canonical(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':'))


def safe(name):
    p = PurePosixPath(name)
    assert not p.is_absolute() and '..' not in p.parts and '\\' not in name, name
    return p


def question(q):
    options, answer = q['options'], q['answer']
    assert isinstance(q['prompt'], str) and 0 < len(q['prompt']) <= 1000
    assert isinstance(options, list) and 2 <= len(options) <= 8
    assert all(isinstance(o, str) and o.strip() for o in options)
    assert len(set(options)) == len(options)
    assert type(answer) is int and 0 <= answer < len(options)
    return dict(question=q['prompt'], options=options, correctIndex=answer,
                explanation=q['explanation'], visual=None)


def identity(name):
    match = re.search(r'(Ghanaian_Language_(Ga|Mfantse|Twi)|RME|History|Physical_Education|French)_Basic_([1-6])_', name)
    assert match, f'Unrecognized source course: {name}'
    raw = match[1]
    subject = {'Ghanaian_Language_Ga': 'ghanaian_ga', 'Ghanaian_Language_Mfantse': 'ghanaian_mfantse',
               'Ghanaian_Language_Twi': 'ghanaian', 'RME': 'rme', 'History': 'history',
               'Physical_Education': 'pe', 'French': 'french'}[raw]
    return 'b'+match[3], subject


def normalize(row, subject, level, base, names, metadata):
    index = row['id']
    assert type(index) is int and index > 0
    play = [question(q) for q in row['questions'] if q['mode'] == 'Play']
    challenge = [question(q) for q in row['questions'] if q['mode'] == 'Challenge']
    assert len(play) == 5 and len(challenge) == 10, row['title']
    prompts = [re.sub(r'\s+', ' ', q['question']).strip().casefold() for q in play + challenge]
    assert len(set(prompts)) == 15, f'Duplicate prompts: {row["title"]}'
    steps = row['steps']
    assert len(steps) == 3 and all(isinstance(s, str) and s.strip() for s in steps)
    narrated = 'body' in row
    video = row.get('video', f'videos/lesson_{index}.mp4')
    images = row.get('slides', [f'illustrations/lesson_{index}.png'])
    cover = row.get('cover_image', images[0])
    for name in [video, cover, *images]:
        safe(name)
        assert name in names, f'Missing source asset: {level}/{subject}/{name}'
    panels = [dict(title=f'Step {i+1}', text=text, image=base+'/'+images[min(i, len(images)-1)])
              for i, text in enumerate(steps)]
    body = row.get('body', row.get('lesson_text'))
    assert body and row['statement'], row['title']
    # Preserve every non-assessment field, including original curriculum wording.
    # Answer keys remain only in the server-side quiz bank, never this payload.
    source_lesson = {k: v for k, v in row.items() if k != 'questions'}
    return dict(key=f'{subject}-{index:02}', title=row['title'], level=level,
                strand=TITLES[subject], code=row.get('indicator', ''), kind=row.get('kind', row.get('subject', '')),
                goals=[row['statement']], notes=[body], passage='', examples=[],
                activities=[row.get('action', row.get('activity', ''))],
                home=row.get('age_extension', ''), safety=row['safety'], scenes=steps,
                video=base+'/'+video, illustration=base+'/'+cover, originalIllustration=base+'/'+cover,
                sourceLesson=source_lesson,
                sourceVideo=dict(audio='english-guide' if narrated else 'silent',
                                 transcript=row.get('narration', ''), poster=base+'/'+cover),
                sourceScope=metadata.get('scope', ''),
                visualGuide=dict(panels=panels, concepts=[], steps=steps, experiment='source-practice',
                                 context=row.get('context', ''), reflection=row.get('reflection', ''),
                                 sourceStatus=row.get('source', '')),
                play=play, challenge=challenge)


def extract(archives, public):
    selected = {}

    def visit(z, chain, archive_hash):
        assert len(chain) <= 4, 'Nested archive depth exceeded'
        assert sum(i.file_size for i in z.infolist()) < 1_000_000_000, 'Archive too large'
        for name in z.namelist():
            safe(name)
        datasets = [n for n in z.namelist() if n.endswith(('lesson_data_with_answers.json', '/course.json'))]
        for dataset in sorted(datasets):
            level, subject = identity(chain[-1])
            data = json.loads(z.read(dataset))
            metadata = {k: v for k, v in data.items() if k != 'lessons'} if isinstance(data, dict) else {}
            rows = data['lessons'] if isinstance(data, dict) else data
            assert rows and len({r['id'] for r in rows}) == len(rows)
            prefix = dataset.rsplit('/', 1)[0]+'/'
            names = {n[len(prefix):]: n for n in z.namelist() if n.startswith(prefix)}
            base = f'/kidilearn/{level}/{subject}/v{VERSION}'
            lessons = [normalize(row, subject, level, base, names, metadata) for row in rows]
            # Include every copied media byte in duplicate/reimport comparisons.
            media = {n: full for n, full in names.items() if safe(n).suffix.lower() in ('.png', '.jpg', '.mp4', '.pdf', '.epub')}
            hashes = {}
            for name, full in sorted(media.items()):
                assert z.getinfo(full).file_size < 25_000_000, name
                hashes[name] = hashlib.sha256(z.read(full)).hexdigest()
            fingerprint = hashlib.sha256(canonical(dict(revision=VERSION, data=data, assets=hashes)).encode()).hexdigest()
            key = (level, subject)
            if key in selected:
                assert selected[key]['sourceHash'] == fingerprint, f'Conflicting duplicate source: {chain} {key}'
                selected[key]['duplicates'].append(' / '.join(chain))
                continue
            for name, full in media.items():
                target = public / base.lstrip('/') / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(z.read(full))
            pdf = next(n for n in names if n.endswith('.pdf'))
            epub = next(n for n in names if n.endswith('.epub'))
            course = dict(subject=subject, subjectTitle=TITLES[subject], level=level, version=VERSION,
                          format='source-multimedia-v2', source='new/'+chain[0], sourceHash=fingerprint,
                          archiveHash=archive_hash, archiveChain=chain, metadata=metadata,
                          courseDirectory=prefix.rstrip('/'), pdf=base+'/'+pdf, epub=base+'/'+epub,
                          mediaCount=len(media), assetHashes=hashes, duplicates=[], lessons=lessons)
            selected[key] = course
            print(f'Validated {level} {subject}: {len(lessons)} complete source lessons')
        for name in sorted(n for n in z.namelist() if n.lower().endswith('.zip')):
            with zipfile.ZipFile(io.BytesIO(z.read(name))) as nested:
                visit(nested, [*chain, name], archive_hash)
        assert datasets or any(n.lower().endswith('.zip') for n in z.namelist()), f'No lesson data: {chain}'

    for archive in sorted(archives, key=lambda p: ('Library' not in p.name, p.name)):
        with zipfile.ZipFile(archive) as z:
            visit(z, [archive.name], hashlib.sha256(archive.read_bytes()).hexdigest())
    return list(selected.values())
