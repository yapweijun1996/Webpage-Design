// Reuse a running preview on --url, or start an owned serve.mjs child and stop only that child.
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export async function ensureServer() {
  const urlArg = process.argv.find((a) => a.startsWith("--url="));
  const port = Number(process.env.AQUATIC_PREVIEW_PORT || 4192);
  const origin = (urlArg ? urlArg.slice(6) : `http://127.0.0.1:${port}`).replace(/\/$/, "");
  const up = await fetch(`${origin}/`).then((r) => r.ok).catch(() => false);
  if (up) return { origin, stop: async () => {}, owned: false };
  const child = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "serve.mjs"), `--port=${new URL(origin).port}`], { stdio: "ignore" });
  for (let i = 0; i < 50; i++) {
    if (await fetch(`${origin}/`).then((r) => r.ok).catch(() => false)) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  return { origin, owned: true, pid: child.pid, stop: async () => { child.kill("SIGTERM"); } };
}
