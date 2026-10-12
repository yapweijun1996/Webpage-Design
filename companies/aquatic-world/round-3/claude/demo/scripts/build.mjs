// Static build: writes dist/<route>/index.html for every page, dist/404.html and shared assets.
// Usage: node scripts/build.mjs [--base=/prefix/]   (default base "/")
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "../src/content.mjs";
import { document, setBase } from "../src/layout.mjs";
import * as render from "../src/pages.mjs";

const demoDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(demoDir, "dist");
const baseArg = process.argv.find((a) => a.startsWith("--base="));
setBase(baseArg ? baseArg.slice(7) : "/");

const renderers = {
  home: render.home,
  collections: render.collections,
  "ornamental-fish": render.ornamentalFish,
  "aquatic-plants": render.aquaticPlants,
  driftwood: render.driftwood,
  story: render.story,
  quality: render.quality,
  contact: render.contact,
  notFound: render.notFound,
};

if (!existsSync(join(demoDir, "assets", "img", "manifest.json"))) {
  console.error("Missing image derivatives. Run `npm run images` first (requires cwebp).");
  process.exit(1);
}

rmSync(dist, { recursive: true, force: true });
for (const [key, page] of Object.entries(pages)) {
  const file = page.route.endsWith(".html") ? join(dist, page.route) : join(dist, page.route, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, document({ pageKey: key, body: renderers[key](), bodyClass: `page-${key}` }));
  console.log(`  ${page.route}`);
}
mkdirSync(join(dist, "assets"), { recursive: true });
cpSync(join(demoDir, "assets", "img"), join(dist, "assets", "img"), { recursive: true });
cpSync(join(demoDir, "src", "site.css"), join(dist, "assets", "site.css"));
cpSync(join(demoDir, "src", "site.js"), join(dist, "assets", "site.js"));
cpSync(join(demoDir, "src", "favicon.svg"), join(dist, "assets", "favicon.svg"));
console.log(`Built ${Object.keys(pages).length} pages into ${dist}`);
