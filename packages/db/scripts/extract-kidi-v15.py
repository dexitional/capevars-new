"""Read the supplied v15 archive as data. Never execute its HTML or scripts."""
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import sys
import zipfile


def visual_context(v):
    """Keep diagram-dependent questions understandable in text-only final quizzes."""
    if not v:
        return ''
    kind = v['type']
    if kind == 'sequence': return 'Sequence: ' + ', '.join('?' if n is None else str(n) for n in v['nums']) + '.'
    if kind in ('graph', 'bars'): return 'Chart values, from left to right: ' + ', '.join(map(str, v['vals'])) + '.'
    if kind == 'array': return f"The array has {v['rows']} rows and {v['cols']} columns."
    if kind == 'fraction': return f"The model has {v['parts']} equal parts; {v.get('filled', 1)} are shaded."
    if kind in ('place', 'place4'): return f"Number shown: {v['n']}."
    if kind == 'money': return 'Money shown in Ghana cedis: ' + ', '.join(map(str, v['vals'])) + '.'
    if kind == 'rect': return f"Rectangle: length {v['a']} cm, width {v['b']} cm."
    if kind == 'clock': return f"Clock: minute hand at 12; hour hand at {v.get('hour', 3)}."
    if kind == 'tally': return f"Tally marks shown: {v['n']}."
    if kind == 'compare': return f"Numbers shown: {v['a']} and {v['b']}."
    if kind == 'math': return f"Expression: {v['a']} {v['op']} {v['b']}."
    if kind == 'balance': return f"Balance: left {v['left']}; right {v['right']}."
    if kind == 'angle': return f"Angle shown: {v['degrees']} degrees."
    if kind == 'numberline': return f"Marked number-line points: {v['a']} and {v['b']}."
    if kind == 'chart': return f"A ten-column number chart begins at {v['base']}, increasing by one across and ten down."
    if kind == 'signed': return f"Signed number shown: {v['v']}."
    if kind == 'arrow': return f"Arrow direction: {v['a']}."
    # Shape questions already contain their geometric clues. Naming the model
    # here would disclose the answer to the quadrilateral-identification items.
    if kind == 'shape': return ''
    if kind == 'measure': return 'Measurements shown: ' + ', '.join(map(str, v.get('vals', [v.get('units')]))) + ' ' + v['unit'] + '.'
    return ''


def question(q):
    options = q.get('options', q.get('choices'))
    answer = q.get('a', q.get('answer'))
    text = q.get('q', q.get('text'))
    assert options.count(answer) == 1 and len(set(options)) == len(options), text
    index = options.index(answer)
    assert 'correct' not in q or q['correct'] == index, text
    visual = q.get('visual')
    context = visual_context(visual)
    prompt = text + ('\n' + context if context else '')
    assert len(prompt) <= 1000 and 2 <= len(options) <= 8, text
    return dict(question=prompt, options=options, correctIndex=index,
                explanation=q.get('why', q.get('reason', q.get('explanation', ''))), visual=visual)


def extract(archive, output, public):
    result = []
    with zipfile.ZipFile(archive) as outer:
        for subject in ('english', 'mathematics', 'science'):
            name = next(n for n in outer.namelist() if f'_{subject.title()}_Basic_3_' in n)
            blob = outer.read(name)
            digest = hashlib.sha256(blob).hexdigest()
            with zipfile.ZipFile(io.BytesIO(blob)) as inner:
                html = inner.read(next(n for n in inner.namelist() if n.endswith('.html'))).decode()
                marker = re.search(r'const (?:LESSONS|lessons)\s*=', html)
                assert marker, name
                # Parse the actual v15 HTML dataset. English course_data.json is older.
                lessons, _ = json.JSONDecoder().raw_decode(html[marker.end():])
                base = f'/kidilearn/b3/{subject}'
                media_count = 0
                for member in inner.infolist():
                    p = PurePosixPath(member.filename)
                    assert not p.is_absolute() and '..' not in p.parts
                    if p.suffix.lower() not in ('.mp4', '.png', '.pdf', '.epub'):
                        continue
                    assert member.file_size < 25_000_000, member.filename
                    target = public / 'kidilearn' / 'b3' / subject / p
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(inner.read(member))
                    media_count += 1
                normalized = []
                for i, lesson in enumerate(lessons):
                    bank = lesson.get('questions', lesson)
                    notes = lesson.get('teach', lesson.get('explain', ''))
                    notes = notes if isinstance(notes, list) else [notes]
                    examples = []
                    for e in lesson.get('examples', []):
                        examples.append({'question': e[0], 'answer': e[1]} if isinstance(e, list)
                                        else {'question': e['q'], 'answer': e['a'] + ' — ' + e['why']})
                    strand = lesson.get('strand', lesson.get('group'))
                    if not strand:
                        strand = {'1': 'Number', '2': 'Algebra', '3': 'Geometry and measurement', '4': 'Data'}[lesson['code'].split('.')[1]]
                    video = f"media/{'quest' if subject == 'science' else 'lesson'}-{i+1:02}.mp4"
                    assert video in inner.namelist(), video
                    normalized.append(dict(
                        key=f'{subject}-{i+1:02}', title=lesson['title'], strand=strand,
                        code=lesson.get('code'), kind=lesson.get('kind', ''),
                        goals=lesson.get('outcomes', [lesson.get('goal', '')]), notes=notes,
                        passage=lesson.get('passage', ''), examples=examples,
                        activities=lesson.get('activities', [lesson.get('activity', '')]),
                        home=lesson.get('home', ''), safety=lesson.get('safety', ''),
                        scenes=lesson.get('scenes', []), video=base+'/'+video,
                        play=[question(q) for q in bank['play']],
                        challenge=[question(q) for q in bank['challenge']],
                    ))
                    assert len(normalized[-1]['play']) == 10 and len(normalized[-1]['challenge']) == 25
                pdf = next(n for n in inner.namelist() if n.endswith('.pdf'))
                epub = next(n for n in inner.namelist() if n.endswith('.epub'))
                result.append(dict(subject=subject, level='b3', source=name, sourceHash=digest,
                                   pdf=base+'/'+pdf, epub=base+'/'+epub, mediaCount=media_count, lessons=normalized))
    output.write_text(json.dumps(result, ensure_ascii=False))
    print('Validated and extracted:', ', '.join(f"{r['subject']}: {len(r['lessons'])} lessons" for r in result))


if __name__ == '__main__':
    extract(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]))
