// Loopback static server for dist/. Directory URLs resolve to index.html; "/x" redirects to "/x/"
// when that directory exists; unknown paths get dist/404.html with HTTP 404.
// Port: --port=N, else AQUATIC_PREVIEW_PORT, else 4192.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const portArg = process.argv.find((a) => a.startsWith("--port="));
const port = Number(portArg ? portArg.slice(7) : process.env.AQUATIC_PREVIEW_PORT || 4192);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webp": "image/webp", ".json": "application/json", ".svg": "image/svg+xml" };

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false;
const isDir = async (p) => (await stat(p).catch(() => null))?.isDirectory() ?? false;

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  let path;
  try { path = decodeURIComponent(pathname); } catch { path = "/__invalid__"; }
  const target = normalize(join(dist, path));
  if (!target.startsWith(dist)) return send(res, 404, join(dist, "404.html"));
  if (await isFile(target)) return send(res, 200, target);
  if (await isDir(target)) {
    if (!path.endsWith("/")) { res.writeHead(301, { Location: `${path}/` }); return res.end(); }
    if (await isFile(join(target, "index.html"))) return send(res, 200, join(target, "index.html"));
  }
  return send(res, 404, join(dist, "404.html"));
});

async function send(res, status, file) {
  const body = await readFile(file);
  res.writeHead(status, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
  res.end(body);
}

server.listen(port, "127.0.0.1", () => console.log(`Aquatic World preview: http://127.0.0.1:${port}/ (pid ${process.pid})`));
