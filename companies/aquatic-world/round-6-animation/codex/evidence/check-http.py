"""Smoke-check the owned loopback preview. HTTP only; no browser automation."""
from pathlib import Path
import hashlib
import http.client
import json
import os
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
port = int(os.environ['AQUATIC_PREVIEW_PORT'])
command = [sys.executable, '-B', 'demo/serve.py', '--port', str(port)]
process = subprocess.Popen(command, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
results = []
record = {'kind':'Loopback HTTP source/response checks, no browser', 'port':port, 'owned_server_pid':process.pid,
          'command':command, 'results':results, 'user_acceptance':'pending'}
try:
    startup = process.stdout.readline().strip()
    if not startup or process.poll() is not None:
        raise RuntimeError('Owned preview did not start: ' + process.stderr.read())
    record['startup'] = startup
    urls = ['/', '/collections/', '/collections/ornamental-fish/', '/collections/aquatic-plants/',
            '/collections/driftwood/', '/our-story/', '/quality/', '/contact/', '/404.html',
            '/contact/?category=ornamental-fish', '/contact/?category=aquatic-plants', '/contact/?category=driftwood',
            '/home-motion.css', '/home-motion.js', '/styles.css', '/script.js', '/assets/hero-angelfish.png',
            '/missing-animation-review-page/']
    for url in urls:
        connection = http.client.HTTPConnection('127.0.0.1', port, timeout=5)
        connection.request('GET', url)
        response = connection.getresponse()
        body = response.read()
        content_type = response.getheader('Content-Type')
        assert response.status == (404 if url.startswith('/missing-') else 200), (url, response.status)
        if url.endswith('.png'):
            assert content_type == 'image/png', content_type
            assert hashlib.sha256(body).hexdigest() == '8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1'
        if url.startswith('/missing-'):
            assert body == (ROOT/'demo/public/404.html').read_bytes()
        results.append({'url':url,'status':response.status,'content_type':content_type,'bytes':len(body)})
        connection.close()
    connection = http.client.HTTPConnection('127.0.0.1', port, timeout=5)
    connection.request('HEAD', '/assets/hero-angelfish.png')
    response = connection.getresponse()
    assert response.status == 200 and response.getheader('Content-Type') == 'image/png' and response.read() == b''
    assert response.getheader('Content-Length') == '2205920'
    connection.close()
    record['head_png'] = 'pass: image/png, correct Content-Length, empty response body'
    record['status'] = 'pass'
except Exception as error:
    record['status'] = 'failed'
    record['error'] = str(error)
    raise
finally:
    if process.poll() is None:
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=5)
    record['owned_server_exit_code'] = process.returncode
    record['owned_server_stopped'] = process.poll() is not None
    (ROOT/'evidence/http-checks.json').write_text(json.dumps(record, indent=2)+'\n')
print('PASS:', len(results), 'GET responses plus PNG HEAD; owned preview stopped')
