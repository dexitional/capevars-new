"""Check narrated media, caption bounds and decoded audio for every lesson."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import re
import subprocess

import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'apps/web/public'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def seconds(value):
    h, m, s = map(float, value.split(':'))
    return h * 3600 + m * 60 + s


def verify(lesson):
    original = PUBLIC / lesson['video'].lstrip('/')
    sidecar = original.with_suffix('.narration.json')
    if not sidecar.exists():
        return None
    data = json.loads(sidecar.read_text())
    video = PUBLIC / data['video'].lstrip('/')
    captions = PUBLIC / data['captions'].lstrip('/')
    assert video.is_file() and captions.is_file() and original.is_file(), sidecar
    assert len(data['scenes']) == 4
    assert [scene['text'] for scene in data['scenes']] == lesson['scenes'], f'Stale transcript: {sidecar}'
    previous = 0
    for scene in data['scenes']:
        assert abs(scene['start'] - previous) < 0.002
        assert scene['end'] > scene['start'] and scene['text'].strip()
        previous = scene['end']
    assert abs(previous - data['duration']) < 0.002
    text = captions.read_text()
    assert text.startswith('WEBVTT\n')
    previous = 0
    for start, end in re.findall(r'([\d:.]+) --> ([\d:.]+)', text):
        start, end = seconds(start), seconds(end)
        assert previous <= start < end <= data['duration']
        previous = end
    assert previous > 0
    decoded = subprocess.run([FFMPEG, '-nostdin', '-v', 'error', '-i', str(video),
                              '-map', '0:a:0', '-ar', '24000', '-ac', '1',
                              '-f', 'f32le', '-'], capture_output=True, check=True)
    samples = np.frombuffer(decoded.stdout, dtype='<f4')
    assert samples.size > 24000 and np.isfinite(samples).all(), video
    peak = float(np.max(np.abs(samples)))
    rms = float(np.sqrt(np.mean(samples ** 2)))
    assert 0.01 < peak < 1 and rms > 0.005, (video, peak, rms)
    assert abs(len(samples) / 24000 - data['duration']) < 0.1, video
    return dict(video=data['video'], duration=data['duration'], peak=round(peak, 4), rms=round(rms, 4))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--scripts', type=Path, default=ROOT / 'docs/kidilearn-narration-scripts.json')
    parser.add_argument('--report', type=Path, default=ROOT / '.cache/kidi-media/verification.json')
    parser.add_argument('--allow-incomplete', action='store_true')
    args = parser.parse_args()
    lessons = json.loads(args.scripts.read_text())
    with ThreadPoolExecutor(max_workers=3) as pool:
        rows = [r for r in pool.map(verify, lessons) if r]
    if not args.allow_incomplete:
        assert len(rows) == len(lessons), f'Only {len(rows)}/{len(lessons)} narrated videos exist'
    report = dict(checked=len(rows), expected=len(lessons), seconds=round(sum(r['duration'] for r in rows), 1),
                  highestPeak=max((r['peak'] for r in rows), default=0), videos=rows)
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(f'Validated {len(rows)}/{len(lessons)} narrated videos: decoded audio, no clipping, duration, transcripts and captions.')
