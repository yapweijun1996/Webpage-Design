"""Source/output and real preview-handler checks. This is not browser QA."""
from contextlib import redirect_stdout
from html.parser import HTMLParser
import hashlib
import io
import json
from pathlib import Path
import runpy
import sys
from unittest.mock import patch
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'demo/public'
ROUTES = ['/', '/collections/', '/collections/ornamental-fish/',
          '/collections/aquatic-plants/', '/collections/driftwood/',
          '/our-story/', '/quality/', '/contact/']
NAV = ['/', '/collections/', '/our-story/', '/quality/', '/contact/']
checks = []


def check(name, outcome):
    checks.append({'check': name, 'status': 'pass' if outcome else 'fail'})


class Node:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children, self.parts = [], []

    @property
    def text(self):
        return ''.join(p.text if isinstance(p, Node) else p for p in self.parts)

    def all(self, tag=None):
        found = []
        for child in self.children:
            if tag is None or child.tag == tag:
                found.append(child)
            found.extend(child.all(tag))
        return found

    def has(self, css):
        return css in self.attrs.get('class', '').split()


class Document(HTMLParser):
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        child = Node(tag, attrs, self.stack[-1])
        self.stack[-1].children.append(child)
        self.stack[-1].parts.append(child)
        if tag not in self.VOID:
            self.stack.append(child)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].parts.append(data)


def entry(route):
    return PUBLIC / ('index.html' if route == '/' else route.strip('/') + '/index.html')


documents = {r: Document(entry(r).read_text()).root for r in ROUTES}
titles, headings = [], []
for route, doc in documents.items():
    prefix = route + ': '
    titles.append(doc.all('title')[0].text)
    h1s = doc.all('h1')
    check(prefix + 'one page-specific h1', len(h1s) == 1)
    headings.append(h1s[0].text)
    main = doc.all('main')[0]
    check(prefix + 'meaningful independent content', len(main.text.split()) > 100)
    ids = [n.attrs['id'] for n in doc.all() if 'id' in n.attrs]
    check(prefix + 'unique IDs', len(ids) == len(set(ids)))
    check(prefix + 'skip target', 'main' in ids)
    check(prefix + 'no positive tabindex', all(int(n.attrs.get('tabindex', '0')) <= 0 for n in doc.all()))
    header = doc.all('header')[0]
    check(prefix + 'header slogan omitted', not any(n.has('tagline') for n in header.all()))
    check(prefix + 'footer slogan preserved', any(n.has('tagline') for n in doc.all('footer')[0].all()))
    check(prefix + 'native compact disclosure', any(n.has('mobile-menu') for n in header.all('details')))
    for nav in header.all('nav'):
        anchors = nav.all('a')[:5]
        check(prefix + nav.attrs['aria-label'] + ' actual destinations', [a.attrs['href'] for a in anchors] == NAV)
        expected = '/collections/' if route.startswith('/collections/') else route
        active = [a for a in anchors if 'aria-current' in a.attrs]
        check(prefix + nav.attrs['aria-label'] + ' current context', len(active) == 1 and active[0].attrs['href'] == expected)
        if route.startswith('/collections/') and route != '/collections/':
            check(prefix + nav.attrs['aria-label'] + ' current section semantics', active[0].attrs.get('aria-current') == 'location')
    for node in doc.all():
        for attr in ['aria-describedby', 'aria-labelledby']:
            if attr in node.attrs:
                check(prefix + attr + ' references exist', all(v in ids for v in node.attrs[attr].split()))
    for a in doc.all('a'):
        url = urlsplit(a.attrs.get('href', ''))
        check(prefix + 'local anchor ' + a.attrs.get('href', ''), not url.scheme and not url.netloc)
        dest = documents.get(url.path or route)
        check(prefix + 'anchor route exists', dest is not None)
        if url.fragment and dest:
            check(prefix + 'anchor target exists', any(n.attrs.get('id') == url.fragment for n in dest.all()))
    for img in doc.all('img'):
        check(prefix + 'image alt present', 'alt' in img.attrs)
        for url in [img.attrs['src']] + [s.strip().split()[0] for s in img.attrs.get('srcset', '').split(',') if s.strip()]:
            check(prefix + 'image exists ' + url, (PUBLIC / url.lstrip('/')).is_file())
    for script in doc.all('script'):
        check(prefix + 'local deferred script', script.attrs.get('src') == '/script.js' and 'defer' in script.attrs)

check('unique eight titles', len(set(titles)) == 8)
check('unique eight h1s', len(set(headings)) == 8)
contact = documents['/contact/']
grid = next(n for n in contact.all() if n.has('contact-grid'))
check('Contact real introduction/workspace/help order', [n.attrs.get('class') for n in grid.children] == ['contact-intro', 'form-panel', 'contact-secondary'])
panel = grid.children[1]
check('complete preview inside workspace before help', any(n.attrs.get('id') == 'preview-result' for n in panel.all()))
check('no photo in introduction/workspace', not grid.children[0].all('img') and not panel.all('img'))
check('local disclosure before form', next(i for i,n in enumerate(panel.children) if n.has('local-disclosure')) < next(i for i,n in enumerate(panel.children) if n.tag == 'form'))
check('honest no-JS form', bool(panel.all('noscript')) and 'No form submission is available' in panel.all('noscript')[0].text)
check('closed general option concise', contact.all('option')[0].text == 'Not sure yet')
form = contact.all('form')[0]
check('no remote form destination', 'action' not in form.attrs and 'method' not in form.attrs)
for n in form.all('input') + form.all('select') + form.all('textarea'):
    check(n.attrs['id'] + ' associated label', any(l.attrs.get('for') == n.attrs['id'] for l in form.all('label')))
check('clear action is native reset', any(b.attrs.get('id') == 'clear-brief' and b.attrs.get('type') == 'reset' for b in form.all('button')))


class NoServer:
    server_address = ('127.0.0.1', 4201)
    def __init__(self, *args):
        pass
    def serve_forever(self):
        pass
    def server_close(self):
        pass


with patch('http.server.ThreadingHTTPServer', NoServer), patch.object(sys, 'argv', ['serve.py']), redirect_stdout(io.StringIO()):
    Handler = runpy.run_path(str(ROOT / 'demo/serve.py'))['Handler']


class Connection:
    def __init__(self, request):
        self.request, self.response = io.BytesIO(request), io.BytesIO()
    def makefile(self, *args):
        return self.request
    def sendall(self, data):
        self.response.write(data)


def request(method, url):
    conn = Connection(f'{method} {url} HTTP/1.0\r\nHost: localhost\r\n\r\n'.encode())
    Handler(conn, ('127.0.0.1', 1), NoServer())
    head, body = conn.response.getvalue().split(b'\r\n\r\n', 1)
    return head.decode(), body


for route in ROUTES:
    head, body = request('GET', route)
    check('actual handler GET ' + route, ' 200 ' in head and body == entry(route).read_bytes())
    head, body = request('HEAD', route)
    check('actual handler HEAD ' + route, ' 200 ' in head and not body)
for path in PUBLIC.rglob('*'):
    if path.is_file() and path.suffix != '.html':
        url = '/' + str(path.relative_to(PUBLIC))
        head, body = request('GET', url)
        check('actual handler asset ' + url, ' 200 ' in head and body == path.read_bytes())
head, body = request('GET', '/uncharted-water/')
check('actual handler unknown path is honest HTTP 404', ' 404 ' in head and body == (PUBLIC / '404.html').read_bytes())
head, body = request('POST', '/contact/')
check('actual handler has no submission endpoint', ' 501 ' in head)
check('no-JS output disables preview', 'disabled' in next(b for b in form.all('button') if b.attrs.get('id') == 'preview-button').attrs)

frozen = json.loads((ROOT / 'evidence/frozen-before.json').read_text())
for file, expected in frozen.items():
    check('frozen unchanged ' + file, hashlib.sha256((ROOT / file).read_bytes()).hexdigest() == expected)
for source in ['styles.css', 'script.js', 'favicon.svg']:
    check('generated source copy ' + source, (ROOT / 'demo' / source).read_bytes() == (PUBLIC / source).read_bytes())
assets = json.loads((ROOT / 'demo/assets/manifest.json').read_text())
check('fixed nine-image pack retained', len(assets) == 9)
for asset in assets.values():
    check('original asset hash ' + asset['source'], hashlib.sha256((ROOT / 'input/assets' / asset['source']).read_bytes()).hexdigest() == asset['source_sha256'])
    for variant in asset['variants']:
        for folder in ['demo/assets', 'demo/public/assets']:
            check('local derivative hash ' + folder + '/' + variant['file'], hashlib.sha256((ROOT / folder / variant['file']).read_bytes()).hexdigest() == variant['sha256'])
for name in ['build.py', 'site_data.py', 'serve.py', 'tools/prepare_assets.py']:
    compile((ROOT / 'demo' / name).read_text(), name, 'exec')
    check('Python syntax ' + name, True)
report = {'kind': 'source-output-and-in-process-handler', 'browser': 'not_run',
          'passed': sum(c['status'] == 'pass' for c in checks),
          'failed': sum(c['status'] == 'fail' for c in checks), 'checks': checks}
(ROOT / 'evidence/static-results.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({k:v for k,v in report.items() if k != 'checks'}))
for c in checks:
    if c['status'] == 'fail':
        print(c)
raise SystemExit(bool(report['failed']))
