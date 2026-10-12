// Full-size screenshots for design review: node scripts/shots.mjs [--routes=a,b] [--sizes=1440x900,390x844] [--out=dir] [--viewport-only]
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { launchChrome } from "./cdp.mjs";
import { ensureServer } from "./server-handle.mjs";

const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const routes = {
  home: "/", collections: "/collections/", fish: "/collections/ornamental-fish/", plants: "/collections/aquatic-plants/",
  driftwood: "/collections/driftwood/", story: "/our-story/", quality: "/quality/", contact: "/contact/", "not-found": "/missing-page/",
};
const pick = arg("routes", Object.keys(routes).join(",")).split(",");
const sizes = arg("sizes", "1440x900,390x844").split(",").map((s) => s.split("x").map(Number));
const out = arg("out", join(dirname(fileURLToPath(import.meta.url)), "..", "..", "evidence", "screenshots"));
const fullPage = !process.argv.includes("--viewport-only");
mkdirSync(out, { recursive: true });

const server = await ensureServer();
const browser = await launchChrome();
const page = await browser.newPage();
try {
  for (const [w, h] of sizes) {
    await page.viewport(w, h);
    for (const key of pick) {
      await page.goto(server.origin + routes[key]);
      const broken = await page.loadAllImages();
      const file = join(out, `${key}-${w}x${h}${fullPage ? "" : "-viewport"}.png`);
      await page.screenshot(file, { fullPage });
      console.log(`${file}${broken.length ? `  BROKEN: ${broken.join(", ")}` : ""}`);
    }
  }
  if (page.consoleErrors.length) console.log("Console errors:", page.consoleErrors);
} finally {
  // Stop the owned preview even if closing Chrome fails.
  await browser.close().catch((e) => console.error("Chrome close failed:", e.message));
  await server.stop();
}
