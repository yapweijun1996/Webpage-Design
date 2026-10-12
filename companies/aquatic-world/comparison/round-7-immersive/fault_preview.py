"""Loopback-only fault previews; delivered source files stay untouched."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit,unquote
import threading

ROOT=Path(__file__).resolve().parents[2]/'round-7-immersive'
SCRIPT=b'''<script>const qaOriginalPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){return navigator.userActivation.isActive?qaOriginalPlay.call(this):Promise.reject(new DOMException("QA autoplay refusal","NotAllowedError"));};</script>'''
servers=[]
for model,port in [('codex',4261),('claude',4262),('codex',4271),('claude',4272)]:
    folder=ROOT/model/'demo'/('public' if model=='codex' else 'dist')
    fault='missing' if port<4270 else 'autoplay'
    def handler_for(directory,mode):
        class Handler(SimpleHTTPRequestHandler):
            def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(directory),**kwargs)
            def do_GET(self):
                path=urlsplit(self.path).path
                if mode=='missing' and path.endswith('.mp4'):
                    self.send_error(404,'Intentional QA missing-media fault');return
                file=directory/unquote(path).lstrip('/')
                if file.is_dir():file/='index.html'
                if mode=='autoplay' and file.is_file() and file.suffix=='.html' and file.resolve().is_relative_to(directory.resolve()):
                    content=file.read_bytes().replace(b'</head>',SCRIPT+b'</head>',1)
                    self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(content)));self.end_headers();self.wfile.write(content);return
                super().do_GET()
            def log_message(self,*args):pass
        return Handler
    server=ThreadingHTTPServer(('127.0.0.1',port),handler_for(folder,fault))
    servers.append(server)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    print(f'{model} {fault}: http://127.0.0.1:{port}/',flush=True)
try:threading.Event().wait()
except KeyboardInterrupt:pass
finally:
    for server in servers:server.shutdown();server.server_close()
