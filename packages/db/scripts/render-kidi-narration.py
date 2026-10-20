"""Render local neural narration, scene-timed MP4s and WebVTT captions.

Original videos and database records remain untouched. A sidecar is published
last, so the player only selects a completely rendered video. Repeated runs
reuse identical speech and skip completed outputs with matching fingerprints.
"""
import argparse
from concurrent.futures import ProcessPoolExecutor
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'apps/web/public'
CACHE = ROOT / '.cache/kidi-media'
RENDER_VERSION = 1


def timestamp(seconds):
    ms = round(seconds * 1000)
    return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}'


def caption_cues(text, start, duration):
    # Short readable cues; scene boundaries are exact, intra-scene cues use
    # proportional word timing (not forced word alignment).
    words = text.split()
    groups, group = [], []
    for word in words:
        if len(' '.join(group + [word])) > 85 and group:
            groups.append(group)
            group = []
        group.append(word)
    if group:
        groups.append(group)
    result, used = [], 0
    for group in groups:
        begin = start + duration * used / len(words)
        used += len(group)
        end = start + duration * used / len(words)
        result.append(f'{timestamp(begin)} --> {timestamp(end)}\n' + ' '.join(group).replace('-->', '→'))
    return result


def init_worker(voice, speed, model_digest, model_path):
    global TTS, VOICE, SPEED, MODEL_DIGEST, FFMPEG, np, sf
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
    VOICE, SPEED, MODEL_DIGEST = voice, speed, model_digest
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def render(lesson):
    source = PUBLIC / lesson['video'].lstrip('/')
    settings = dict(version=RENDER_VERSION, model=MODEL_DIGEST, voice=VOICE, speed=SPEED, lesson=lesson,
                    source=hashlib.sha256(source.read_bytes()).hexdigest())
    if lesson.get('frames'):
        settings['frames'] = [hashlib.sha256((PUBLIC / url.lstrip('/')).read_bytes()).hexdigest() for url in lesson['frames']]
    fingerprint = hashlib.sha256(json.dumps(settings, sort_keys=True).encode()).hexdigest()
    sidecar = source.with_suffix('.narration.json')
    stem = source.stem + '.narrated-' + fingerprint[:12]
    target, captions = source.with_name(stem + '.mp4'), source.with_name(stem + '.vtt')
    if sidecar.exists() and target.exists() and captions.exists():
        old = json.loads(sidecar.read_text())
        if old.get('fingerprint') == fingerprint:
            return 'Skipped ' + lesson['video']
    probe = subprocess.run([FFMPEG, '-hide_banner', '-i', str(source)], capture_output=True, text=True)
    match = re.search(r'Duration: (\d+):(\d+):([\d.]+)', probe.stderr)
    if not match:
        raise ValueError(f'Cannot read video duration: {source}')
    h, m, s = map(float, match.groups())
    original_scene_duration = (h * 3600 + m * 60 + s) / 4
    tracks, scenes, cues, cursor = [], [], [], 0.0
    rate = 24000
    speech_cache = CACHE / 'speech'
    speech_cache.mkdir(exist_ok=True)
    for text in lesson['scenes']:
        key = hashlib.sha256(json.dumps([MODEL_DIGEST, VOICE, SPEED, text]).encode()).hexdigest()
        wav = speech_cache / (key + '.wav')
        if wav.exists():
            samples, sr = sf.read(wav, dtype='float32')
        else:
            samples, sr = TTS.create(text, voice=VOICE, speed=SPEED, lang='en-gb')
            assert sr == rate and len(samples) > rate / 4 and np.isfinite(samples).all()
            # Separate temporary names allow duplicate scripts in parallel jobs.
            temporary = wav.with_name(key + f'.{os.getpid()}.wav')
            sf.write(temporary, samples, sr, subtype='PCM_16')
            temporary.replace(wav)
        assert sr == rate
        # A short lead-in and tail avoid rushed transitions or clipped endings.
        duration = math.ceil(max(4, len(samples) / sr + 0.8) * 12) / 12
        lead = int(0.2 * rate)
        padded = np.pad(samples, (lead, round(duration * rate) - len(samples) - lead))
        tracks.append(padded)
        scenes.append(dict(start=round(cursor, 3), end=round(cursor + duration, 3), text=text))
        cues.extend(caption_cues(text, cursor + 0.2, len(samples) / sr))
        cursor += duration
    with tempfile.TemporaryDirectory(prefix='kidi-render-', dir=CACHE) as temp:
        temp = Path(temp)
        sf.write(temp / 'voice.wav', np.concatenate(tracks), rate, subtype='PCM_16')
        if lesson.get('frames'):
            # Source stills give exact scene boundaries even in the upper-primary
            # MP4s, whose scene durations are unequal.
            entries = []
            for i, (url, scene) in enumerate(zip(lesson['frames'], scenes)):
                frame = PUBLIC / url.lstrip('/')
                (temp / f'{i}.png').symlink_to(frame)
                entries.extend([f"file '{i}.png'", f"duration {scene['end'] - scene['start']}"])
            entries.append("file '3.png'")
            (temp / 'frames.txt').write_text('\n'.join(entries) + '\n')
            visual_input = ['-f', 'concat', '-safe', '0', '-i', str(temp / 'frames.txt')]
            visual_filter = ['-vf', 'fps=12', '-map', '0:v:0']
        else:
            filters = ['[0:v]split=4[v0][v1][v2][v3]']
            for i, scene in enumerate(scenes):
                duration = scene['end'] - scene['start']
                ratio = duration / original_scene_duration
                filters.append(f'[v{i}]trim=start={i * original_scene_duration}:end={(i+1)*original_scene_duration},setpts={ratio}*(PTS-STARTPTS),fps=12,tpad=stop_mode=clone:stop_duration=1,trim=duration={duration}[s{i}]')
            filters.append('[s0][s1][s2][s3]concat=n=4:v=1:a=0[out]')
            visual_input = ['-i', str(source)]
            visual_filter = ['-filter_complex_threads', '1', '-filter_complex', ';'.join(filters), '-map', '[out]']
        command = [FFMPEG, '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-threads', '2',
                   *visual_input, '-i', str(temp / 'voice.wav'), *visual_filter, '-map', '1:a:0',
                   '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-threads', '2',
                   '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000',
                   '-af', 'loudnorm=I=-18:TP=-1.5:LRA=7', '-movflags', '+faststart',
                   '-t', str(cursor), str(temp / 'video.mp4')]
        subprocess.run(command, check=True, capture_output=True)
        assert (temp / 'video.mp4').stat().st_size > 1000
        (temp / 'video.mp4').replace(target)
        (temp / 'captions.vtt').write_text('WEBVTT\n\n' + '\n\n'.join(cues) + '\n')
        (temp / 'captions.vtt').replace(captions)
        metadata = dict(fingerprint=fingerprint, voice=f'Kokoro {VOICE} (AI generated)',
                        video='/' + str(target.relative_to(PUBLIC)), captions='/' + str(captions.relative_to(PUBLIC)),
                        duration=round(cursor, 3), scenes=scenes)
        (temp / 'metadata.json').write_text(json.dumps(metadata, ensure_ascii=False) + '\n')
        (temp / 'metadata.json').replace(sidecar)
    return f'Rendered {lesson["level"]} {lesson["subject"]}: {lesson["title"]} ({cursor:.1f}s)'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--scripts', type=Path, default=ROOT / 'docs/kidilearn-narration-scripts.json')
    parser.add_argument('--level')
    parser.add_argument('--limit', type=int)
    parser.add_argument('--workers', type=int, default=2)
    parser.add_argument('--voice', default='bf_emma')
    parser.add_argument('--speed', type=float, default=0.95)
    parser.add_argument('--model', type=Path, default=CACHE / 'kokoro-v1.0.onnx')
    parser.add_argument('--missing-only', action='store_true', help='Keep all completed renders, including those from a different model precision')
    args = parser.parse_args()
    lessons = json.loads(args.scripts.read_text())
    if args.level:
        lessons = [l for l in lessons if l['level'] == args.level]
    if args.limit:
        lessons = lessons[:args.limit]
    if args.missing_only:
        lessons = [l for l in lessons if not (PUBLIC / l['video'].lstrip('/')).with_suffix('.narration.json').exists()]
    digest = hashlib.sha256(args.model.read_bytes()).hexdigest()
    with ProcessPoolExecutor(max_workers=args.workers, initializer=init_worker,
                             initargs=(args.voice, args.speed, digest, args.model)) as pool:
        for i, result in enumerate(pool.map(render, lessons)):
            print(f'[{i+1}/{len(lessons)}] {result}', flush=True)


if __name__ == '__main__':
    main()
