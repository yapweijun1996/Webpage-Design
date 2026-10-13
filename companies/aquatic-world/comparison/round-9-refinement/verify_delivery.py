"""Verify the served Pages artifact against the local disposable source build."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[4]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--origin', required=True, help='Catalog URL including the project directory')
parser.add_argument('--commit', help='Expected deployed Git commit')
parser.add_argument('--output', required=True)
args = parser.parse_args()
origin = args.origin.rstrip('/') + '/'
local = json.loads((ROOT / '_site/manifest.json').read_text())


def fetch(relative):
    request = Request(origin + relative, headers={'Cache-Control': 'no-cache'})
    with urlopen(request, timeout=30) as response:
        assert response.status == 200, (relative, response.status)
        return response.read()


served = json.loads(fetch('manifest.json'))
if args.commit:
    assert served['commit'] == args.commit, ('Deployment is not current', served.get('commit'))
assert served['demos'] == local['demos'], 'Published demo manifest differs'
assert served['comparison'] == local['comparison'], 'Published comparison manifest differs'
assert served['verified_local_references'] == local['verified_local_references']
expected = {}
for name, demo in local['demos'].items():
    expected.update({f'aquatic-world/{name}/{file}': sha for file, sha in demo['sha256'].items()})
expected.update({f'comparison/{file}': sha for file, sha in local['comparison']['sha256'].items()})
for file in ('index.html', '404.html'):
    expected[file] = hashlib.sha256((ROOT / '_site' / file).read_bytes()).hexdigest()

# This empty build marker is not user-facing content. The observed Pages host
# hides it (404), while the local static server exposes its empty bytes (200).
marker = ROOT / '_site/.nojekyll'
assert marker.is_file() and marker.read_bytes() == b'', 'Invalid publication marker'
try:
    assert fetch('.nojekyll') == b'', 'Served marker is not empty'
    marker_result = {'file': '.nojekyll', 'status': 200, 'exposed': True}
except HTTPError as error:
    assert error.code == 404, ('Unexpected marker response', error.code)
    marker_result = {'file': '.nojekyll', 'status': 404, 'exposed': False}


def verify(item):
    file, sha = item
    actual = hashlib.sha256(fetch(file)).hexdigest()
    assert actual == sha, f'Served bytes differ: {file}'
    return {'file': file, 'sha256': actual, 'status': 200}


with ThreadPoolExecutor(max_workers=5) as pool:
    checked = list(pool.map(verify, expected.items()))
result = {'origin': origin, 'served_commit': served.get('commit'), 'files': len(checked),
          'content_routes': sum(len(demo['routes']) for demo in served['demos'].values()),
          'local_references': served['verified_local_references'],
          'publication_marker': marker_result, 'checks': checked}
Path(args.output).write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({key: result[key] for key in ('origin', 'served_commit', 'files', 'content_routes', 'local_references')}))
