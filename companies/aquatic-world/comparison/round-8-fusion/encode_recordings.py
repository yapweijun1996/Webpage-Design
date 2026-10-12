"""Encode native screencasts using their real frame timestamps; remove temporary frame files."""
from pathlib import Path
import json
import shutil
import subprocess

ROOT=Path(__file__).resolve().parent/'evidence'
for directory in sorted(ROOT.glob('*playback')):
    record=directory/'capture.json'
    if not record.exists(): continue
    data=json.loads(record.read_text())
    if '-full-' not in directory.name:
        # These were technically rejected because the old inactive-tab viewport clipped the captures.
        (ROOT/(directory.name+'-rejected.json')).write_text(json.dumps({'reason':'Inactive-tab widget crop; replaced by complete selected-tab screencast','frames':len(data['frames']),'source':data['source']},indent=2)+'\n')
        shutil.rmtree(directory)
        continue
    target=ROOT/(directory.name+'.mp4')
    if target.exists() and (ROOT/(directory.name+'.json')).exists(): continue
    # A prior verifier failure can leave the owned encoded output before its summary.
    if target.exists(): target.unlink()
    frames=data['frames']
    lines=['ffconcat version 1.0']
    for i,frame in enumerate(frames):
        filename=f'{i:05d}.jpg'
        assert (directory/filename).exists()
        lines.append(f"file '{filename}'")
        duration=frames[i+1]['metadata']['timestamp']-frame['metadata']['timestamp'] if i+1<len(frames) else 1/24
        assert 0<duration<2, 'Missing or invalid capture clock'
        lines.append(f'duration {duration:.6f}')
    sequence=directory/'sequence.ffconcat'
    sequence.write_text('\n'.join(lines)+'\n')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-n','-safe','0','-f','concat','-i',str(sequence),'-an','-c:v','libx264','-crf','25','-preset','slow','-pix_fmt','yuv420p','-fps_mode','vfr','-movflags','+faststart',str(target)],check=True)
    probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_streams','-show_format','-of','json',str(target)]))
    stream=probe['streams'][0]
    viewport=data['states'][0]['viewport']
    expected=[viewport['w'], viewport['h']]
    assert [stream['width'],stream['height']]==expected, 'Capture is clipped'
    joins=[]
    states=data['states']
    for i in range(1,len(states)):
        if states[i]['video']['time']<states[i-1]['video']['time']:
            joins.append({'before_seconds':states[i-1]['elapsed'],'after_seconds':states[i]['elapsed'],'video_before':states[i-1]['video']['time'],'video_after':states[i]['video']['time']})
    assert len(joins)>=3
    data.update(encoded_file=target.name,encoded_bytes=target.stat().st_size,probe=probe,observed_clock_wraps=joins,editing='Real timestamp durations, H.264 compression only; no frame synthesis, crop or smoothing')
    (ROOT/(directory.name+'.json')).write_text(json.dumps(data,indent=2)+'\n')
    # Retain concise actual frames around each observed join for visual review.
    for index,join in enumerate(joins):
        first_clock=frames[0]['metadata']['timestamp']
        for side,key in [('before','before_seconds'),('after','after_seconds')]:
            selected=min(frames,key=lambda f:abs((f['metadata']['timestamp']-first_clock)-join[key]))
            shutil.copyfile(directory/f"{selected['frame']:05d}.jpg",ROOT/f'{directory.name}-join-{index+1}-{side}.jpg')
    shutil.rmtree(directory)
    print(json.dumps({'recording':target.name,'dimensions':expected,'bytes':target.stat().st_size,'joins':len(joins)}))
