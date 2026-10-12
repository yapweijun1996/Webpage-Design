"""Read supplied runtime films using existing ffprobe/ffmpeg; never alter media."""
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
manifest = json.loads((ROOT / 'input-stage2/media/manifest.json').read_text())
ffprobe = shutil.which('ffprobe')
ffmpeg = shutil.which('ffmpeg')
assert ffprobe and ffmpeg, 'Existing ffprobe/ffmpeg required; do not install dependencies.'
results = []


def run(command):
    result = subprocess.run(command, capture_output=True, text=True, check=True)
    assert not result.stderr.strip(), result.stderr
    return result.stdout


for mode in ['landscape', 'portrait']:
    name = f'{mode}.mp4'
    path = ROOT / 'demo/assets/immersive' / name
    expected = manifest['assets'][name]
    content = path.read_bytes()
    assert len(content) == expected['bytes']
    assert hashlib.sha256(content).hexdigest() == expected['sha256']
    probe = json.loads(run([ffprobe, '-v', 'error', '-count_frames', '-show_entries',
                           'stream=codec_type,codec_name,pix_fmt,width,height,avg_frame_rate,r_frame_rate,duration,nb_frames,nb_read_frames:format=duration,size',
                           '-of', 'json', str(path)]))
    assert len(probe['streams']) == 1 and probe['streams'][0]['codec_type'] == 'video'
    stream = probe['streams'][0]
    assert stream['codec_name'] == 'h264' and stream['pix_fmt'] == 'yuv420p'
    assert (stream['width'], stream['height']) == (expected['width'], expected['height'])
    assert Fraction(stream['avg_frame_rate']) == Fraction(stream['r_frame_rate']) == expected['fps']
    assert float(stream['duration']) == float(probe['format']['duration']) == expected['duration_seconds']
    assert int(stream['nb_frames']) == int(stream['nb_read_frames']) == expected['frames']
    assert int(probe['format']['size']) == expected['bytes']
    hashes = run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-i', str(path),
                  '-map', '0:v:0', '-f', 'framemd5', '-'])
    frames = [line.split(',')[-1].strip() for line in hashes.splitlines()
              if line.strip() and not line.startswith('#')]
    assert len(frames) == expected['frames']
    assert len(set(frames)) > 1, 'Decoded film must contain varying frames.'
    poster_name = f'{mode}-poster.webp'
    poster_path = ROOT / 'demo/assets/immersive' / poster_name
    poster = json.loads(run([ffprobe, '-v', 'error', '-show_entries',
                            'stream=codec_name,width,height', '-of', 'json', str(poster_path)]))
    assert len(poster['streams']) == 1
    assert poster['streams'][0]['codec_name'] == 'webp'
    assert (poster['streams'][0]['width'], poster['streams'][0]['height']) == (expected['width'], expected['height'])
    results.append({
        'film': name, 'result': 'pass', 'sha256': expected['sha256'],
        'probe': probe, 'poster_probe': poster,
        'decoded_frames': len(frames), 'distinct_decoded_frame_hashes': len(set(frames)),
        'first_frame_md5': frames[0], 'last_frame_md5': frames[-1],
        'decoded_first_last_identical': frames[0] == frames[-1],
        'limit': 'Decode integrity and frame variation do not prove browser advancement, perceptually seamless joins, poster handoff or subject safety.'
    })

report = {'scope': 'Offline read-only media metadata/decode checks. No browser or visually observed playback.',
          'count': len(results), 'checks': results}
(ROOT / 'evidence/stage-2/media-checks.json').write_text(json.dumps(report, indent=2) + '\n')
print('PASS: both supplied films decode all 144 frames, contain frame variation, and match silent H.264/24fps/six-second metadata; WebP dimensions match.')
