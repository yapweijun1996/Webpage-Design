"""Create disclosed, eased return loops from stable early portions of both raw films."""
from pathlib import Path
import argparse
import hashlib
import json
import math
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=ROOT / 'runtime')
args = parser.parse_args()
output = args.output.resolve()
if output.exists():
    parser.error('Output already exists; use a new directory to preserve reviewed media')
output.mkdir(parents=True)
manifest = {'prepared_on': '2026-10-12', 'selection': 'coordinator technical/visual candidate; human acceptance open',
            'processing': 'Source frames 1–36 traverse forward then backward using explicit cosine-eased frame indices over exactly 144 frames. Six-second return loop; first/last use the same source frame. No frame blending, generated pixels, crop, recoloring or extra provider call.',
            'media_query': '(min-width: 900px) and (min-aspect-ratio: 6/5)',
            'fit': 'cover', 'landscape_position': '50% 50%', 'portrait_position': '50% 30%',
            'new_provider_cost_usd': '1.44', 'assets': {}, 'commands': {}}
for name, size in [('landscape', (1280, 720)), ('portrait', (720, 1280))]:
    source = ROOT / f'{name}-raw.mp4'
    video = output / f'{name}.mp4'
    indices = [1 + round(35 * (1 - math.cos(2 * math.pi * i / 144)) / 2) for i in range(144)]
    assert indices[0] == indices[-1] == 1 and max(indices) == 36
    command = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-n', '-f', 'image2pipe',
               '-framerate', '24', '-c:v', 'png', '-i', '-', '-an', '-frames:v', '144',
               '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '23',
               '-movflags', '+faststart', str(video)]
    with tempfile.TemporaryDirectory(prefix='aquatic-loop-frames-') as temp:
        frames = Path(temp)
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-n', '-i', str(source),
                        '-vf', 'select=between(n\\,1\\,36)', '-fps_mode', 'vfr', '-start_number', '1',
                        str(frames / '%02d.png')], check=True)
        encoded = {i: (frames / f'{i:02d}.png').read_bytes() for i in set(indices)}
        # Byte streaming reorders untouched decoded frames; no image pixels are edited in Python.
        process = subprocess.Popen(command, stdin=subprocess.PIPE)
        try:
            for i in indices:
                process.stdin.write(encoded[i])
        finally:
            process.stdin.close()
        assert process.wait() == 0, 'Video encoding failed'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(video), '-f', 'null', '-'], check=True)
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'quiet', '-show_format', '-show_streams', '-of', 'json', str(video)]))
    stream = probe['streams'][0]
    assert len(probe['streams']) == 1 and stream['codec_name'] == 'h264'
    assert (stream['width'], stream['height']) == size and stream['r_frame_rate'] == '24/1'
    assert float(probe['format']['duration']) == 6.0 and stream['nb_frames'] == '144'
    poster = output / f'{name}-poster.webp'
    with tempfile.TemporaryDirectory(prefix='aquatic-loop-') as temp:
        first = Path(temp) / 'first.png'
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-n', '-i', str(video), '-frames:v', '1', str(first)], check=True)
        subprocess.run(['cwebp', '-quiet', '-q', '82', str(first), '-o', str(poster)], check=True)
    assert video.stat().st_size < 3 * 1024 * 1024 and poster.stat().st_size < 200 * 1024
    for file in [video, poster]:
        manifest['assets'][file.name] = {'bytes': file.stat().st_size, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'width': size[0], 'height': size[1]}
    manifest['assets'][video.name].update(duration_seconds=6.0, fps=24, frames=144, audio=False,
        raw_source=f'{name}-raw.mp4', raw_sha256=hashlib.sha256(source.read_bytes()).hexdigest(), source_frames='1–36 inclusive', source_frame_indices=indices)
    manifest['commands'][name] = command
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({'runtime': str(output), 'assets': manifest['assets']}, indent=2))
