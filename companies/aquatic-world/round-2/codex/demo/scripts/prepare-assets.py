"""Create deterministic local WebP variants from the fixed source pack."""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT.parent/'input/assets'
manifest=json.loads((SOURCE/'asset-manifest.json').read_text())
output={'content_status':'ILLUSTRATIVE_DEMO_ONLY','prepared_on':'2026-10-10','encoder':f'Pillow WebP, quality=84, method=6','assets':{},'slots':manifest['slots']}
for asset in manifest['assets']:
    image=Image.open(SOURCE/asset['file']).convert('RGB')
    widths=[640,1280,1882] if asset['id']=='hero-angelfish' else ([640,1280,1983] if asset['id']=='enquiry-underwater-school' else ([480,960] if asset['id']=='heritage-waterfront' else [320,640]))
    variants=[]
    for width in widths:
        height=round(image.height*width/image.width)
        resized=image.resize((width,height),Image.Resampling.LANCZOS)
        relative=f"assets/{asset['id']}-{width}.webp"
        path=ROOT/relative
        resized.save(path,'WEBP',quality=84,method=6)
        variants.append({'file':relative,'width':width,'height':height,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    output['assets'][asset['id']]={**asset,'source':f"input/assets/{asset['file']}",'variants':variants}
(ROOT/'assets/manifest.json').write_text(json.dumps(output,indent=2)+'\n')
print(json.dumps({'source_bytes':sum(a['bytes'] for a in manifest['assets']),'all_variant_bytes':sum(v['bytes'] for a in output['assets'].values() for v in a['variants']),'variants':sum(len(a['variants']) for a in output['assets'].values())}))
