"""Loopback-only review server with byte ranges for untouched large video files."""

import argparse
import functools
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BYTE_RANGE = re.compile(r"bytes=(\d*)-(\d*)\Z")


class ReviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.byte_count = None
        path = Path(self.translate_path(self.path))
        if not path.resolve().is_relative_to(ROOT):
            self.send_error(403)
            return None
        if not path.is_file():
            return super().send_head()
        stream = path.open("rb")
        size = path.stat().st_size
        start, end = 0, size - 1
        requested = self.headers.get("Range")
        if requested:
            match = BYTE_RANGE.fullmatch(requested)
            if match and any(match.groups()) and size:
                lower, upper = match.groups()
                if lower:
                    start = int(lower)
                    end = min(int(upper), size - 1) if upper else size - 1
                else:
                    length = int(upper)
                    start = max(size - length, 0)
                    end = size - 1
                valid = 0 <= start <= end < size
            else:
                valid = False
            if not valid:
                stream.close()
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
        self.send_response(206 if requested else 200)
        self.send_header("Content-Type", self.guess_type(str(path)))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(path.stat().st_mtime))
        if requested:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        stream.seek(start)
        self.byte_count = end - start + 1
        return stream

    def copyfile(self, source, outputfile):
        if self.byte_count is None:
            return super().copyfile(source, outputfile)
        remaining = self.byte_count
        try:
            while remaining:
                data = source.read(min(64 * 1024, remaining))
                if not data:
                    break
                outputfile.write(data)
                remaining -= len(data)
        except (BrokenPipeError, ConnectionResetError):
            pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4284)
    options = parser.parse_args()
    handler = functools.partial(ReviewHandler, directory=str(ROOT))
    ThreadingHTTPServer(("127.0.0.1", options.port), handler).serve_forever()
