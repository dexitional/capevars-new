"""Render recorded narration for the lesson theatre.

Each different line becomes one small clip, shared by every lesson that says it.
A lesson's manifest is published last, once all its clips exist, so the player
either has a whole recorded lesson or uses the device's voice. Repeated runs
reuse identical speech and skip finished clips, so a failed run can be resumed.
To roll back a lesson, remove its manifest.

    (cd apps/web && npx tsx scripts/export-theatre-narration.ts)   # lists the lines
    .cache/kidi-media/venv/bin/python packages/db/scripts/render-kidi-theatre.py --only b2/mathematics
"""
import argparse
from concurrent.futures import ProcessPoolExecutor
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'apps/web/public'
CACHE = ROOT / '.cache/kidi-media'
OUTPUT = PUBLIC / 'kidilearn/theatre'
RENDER_VERSION = 1
VOICES = {'en': ('bf_emma', 'en-gb'), 'fr': ('ff_siwis', 'fr-fr')}
SAMPLE_RATE = 24000


def clip_name(digest, speed, lang, text):
    voice = VOICES[lang][0]
    key = json.dumps([RENDER_VERSION, digest, voice, speed, text])
    return hashlib.sha256(key.encode()).hexdigest()[:24] + '.m4a'


def clip_url(name):
    return f'/kidilearn/theatre/clips/{name}'


def wanted_lines(boards):
    """Each different line once, in the order first needed."""
    lines = {}
    for board in boards:
        for line in board['lines']:
            lines.setdefault(f"{line['lang']}:{line['text']}", line)
    return list(lines.values())


def manifest_for(board, digest, speed):
    return {
        'version': RENDER_VERSION,
        'voices': {lang: VOICES[lang][0] for lang in {l['lang'] for l in board['lines']}},
        'clips': {
            f"{l['lang']}:{l['text']}": clip_url(clip_name(digest, speed, l['lang'], l['text']))
            for l in board['lines']
        },
    }


def manifest_path(board_id):
    path = (OUTPUT / (board_id + '.json')).resolve()
    if OUTPUT.resolve() not in path.parents:
        raise ValueError(f'Board id leaves the theatre folder: {board_id}')
    return path


def init_worker(digest, speed, model_path):
    global TTS, DIGEST, SPEED, FFMPEG, np, sf
    import numpy as np
    import soundfile as sf
    import imageio_ffmpeg
    import onnxruntime as ort
    from kokoro_onnx import Kokoro
    options = ort.SessionOptions()
    options.intra_op_num_threads = 2
    options.inter_op_num_threads = 1
    session = ort.InferenceSession(str(model_path), sess_options=options, providers=['CPUExecutionProvider'])
    TTS = Kokoro.from_session(session, str(CACHE / 'voices-v1.0.bin'))
    DIGEST, SPEED = digest, speed
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def speech(lang, text):
    voice, language = VOICES[lang]
    # The same key as the video renderer, so shared sentences are not spoken twice.
    key = hashlib.sha256(json.dumps([DIGEST, voice, SPEED, text]).encode()).hexdigest()
    wav = CACHE / 'speech' / (key + '.wav')
    if wav.exists():
        return wav
    samples, rate = TTS.create(text, voice=voice, speed=SPEED, lang=language)
    assert rate == SAMPLE_RATE and len(samples) > rate / 10 and np.isfinite(samples).all()
    wav.parent.mkdir(exist_ok=True)
    temporary = wav.with_name(key + f'.{os.getpid()}.wav')
    sf.write(temporary, samples, rate, subtype='PCM_16')
    temporary.replace(wav)
    return wav


def render(line):
    lang, text = line['lang'], line['text']
    target = OUTPUT / 'clips' / clip_name(DIGEST, SPEED, lang, text)
    if target.exists():
        return 0
    wav = speech(lang, text)
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='kidi-theatre-', dir=CACHE) as temp:
        encoded = Path(temp) / 'clip.m4a'
        subprocess.run(
            [FFMPEG, '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-threads', '1',
             '-i', str(wav), '-af', 'loudnorm=I=-18:TP=-1.5:LRA=7', '-ac', '1', '-ar', '24000',
             '-c:a', 'aac', '-b:a', '32k', '-movflags', '+faststart', str(encoded)],
            check=True,
        )
        # Decode the finished clip: a broken or silent file must never be published.
        decoded = Path(temp) / 'check.wav'
        subprocess.run([FFMPEG, '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(encoded), str(decoded)], check=True)
        samples, _ = sf.read(decoded, dtype='float32')
        if not len(samples) or not np.isfinite(samples).all() or np.abs(samples).max() < 0.01:
            raise ValueError(f'Silent or unreadable clip for: {text}')
        os.replace(encoded, target)
    return target.stat().st_size


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--lines', type=Path, default=CACHE / 'theatre-lines.json')
    parser.add_argument('--only', action='append', help='Board ids starting with this, such as b2/mathematics. Repeatable.')
    parser.add_argument('--limit', type=int)
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--speed', type=float, default=0.95)
    parser.add_argument('--model', type=Path, default=CACHE / 'kokoro-v1.0.onnx')
    args = parser.parse_args()
    boards = json.loads(args.lines.read_text())
    if args.only:
        boards = [b for b in boards if any(b['id'].startswith(prefix) for prefix in args.only)]
    if args.limit:
        boards = boards[:args.limit]
    lines = wanted_lines(boards)
    digest = hashlib.sha256(args.model.read_bytes()).hexdigest()
    print(f'{len(boards)} boards, {len(lines)} different lines', flush=True)
    written = 0
    with ProcessPoolExecutor(max_workers=args.workers, initializer=init_worker,
                             initargs=(digest, args.speed, args.model)) as pool:
        for i, size in enumerate(pool.map(render, lines, chunksize=4)):
            written += size
            if (i + 1) % 100 == 0 or i + 1 == len(lines):
                print(f'[{i + 1}/{len(lines)}] {written / 1e6:.1f} MB written', flush=True)
    # Only now does the player see these lessons as recorded.
    for board in boards:
        path = manifest_path(board['id'])
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_name(path.name + '.tmp')
        temporary.write_text(json.dumps(manifest_for(board, digest, args.speed), ensure_ascii=False))
        temporary.replace(path)
    print(f'Published {len(boards)} manifests under {OUTPUT}', flush=True)


if __name__ == '__main__':
    main()
