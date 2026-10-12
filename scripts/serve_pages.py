"""Preview the built Pages package under its real project base on loopback."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]/'_site'
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port',type=int,default=4240)
args=parser.parse_args()
if not (ROOT/'manifest.json').exists():parser.error('Run prepare_pages.py first')
BASE=json.loads((ROOT/'manifest.json').read_text())['base']

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        if not urlsplit(self.path).path.startswith(BASE):self.send_error(404);return
        super().do_GET()
    def do_HEAD(self):
        if not urlsplit(self.path).path.startswith(BASE):self.send_error(404);return
        super().do_HEAD()
    def translate_path(self,path):return super().translate_path('/'+path[len(BASE):])
    def log_message(self,*args):pass

server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
print(f'Pages preview: http://127.0.0.1:{args.port}{BASE}',flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
