"""Loopback-only static preview with an honest 404 and no submission endpoint."""
import argparse
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=int(os.environ.get("AQUATIC_PREVIEW_PORT", "0")))
args = parser.parse_args()
root = Path(__file__).resolve().parent / "public"
if not (root / "index.html").is_file():
    raise SystemExit("Run python3 demo/build.py first.")


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".png": "image/png"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)

    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        content = (root / "404.html").read_bytes()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(content)

    def log_message(self, fmt, *args):
        pass  # Preview logs must never collect sample form content or query data.


server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
print(f"Aquatic World preview: http://127.0.0.1:{server.server_address[1]} (loopback only)", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
