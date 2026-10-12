import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.webp':'image/webp' };
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 4173);
const server = http.createServer(async (request,response) => {
 try {
  const url = new URL(request.url,'http://127.0.0.1');
  const route = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const allowed = /^\/(index\.html|styles\.css|tokens\.css|app\.js|fixtures\/(minimal|five|alternate)\.html|assets\/[a-z0-9-]+\.webp)$/.test(route);
  if(!allowed) { response.writeHead(404); response.end('Not found'); return; }
  const data = await readFile(path.join(root,route));
  response.writeHead(200,{'Content-Type':types[path.extname(route)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  response.end(data);
 } catch {response.writeHead(404);response.end('Not found');}
});
server.on('error',error=>{console.error(`Preview could not start (${error.code}): ${error.message}`);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}/`));
